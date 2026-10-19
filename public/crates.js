// crates.js — Caisses (boutique), skins animés (perso / arme / pouvoir), animations de kill, onglet Personnalisation.
// Chargé après game.js : utilise ses variables globales (g, SV, tt, M, cam, R, me, ...).
// Réglages faciles : prix et probabilités dans CRC, objets dans CRTH / CAT.

// ---------- Catalogue ----------
const CRT = [ // paliers de rareté = niveau d'animation (0 = fixe … 4 = animation maximale)
  { n: 'Commun', c: '#9aa7bd', v: 5 }, { n: 'Rare', c: '#4fb8ff', v: 15 }, { n: 'Épique', c: '#b36bff', v: 45 },
  { n: 'Légendaire', c: '#ffb02e', v: 120 }, { n: 'Mythique', c: '#ff4ad8', v: 300 }, { n: 'Secret', c: '#ff3d8b', v: 400 }]; // v = pièces rendues en cas de doublon
const CRTH = [ // thèmes : nom, couleur 1, couleur 2, effet de particules
  ['Cobalt', '#3a7bff', '#a9d4ff', 'spark'], ['Braise', '#ff6a1a', '#ffd23a', 'flame'], ['Menthe', '#1fcf8a', '#bfffe8', 'spark'], ['Rubis', '#e0264a', '#ff9ab0', 'flame'],
  ['Orchidée', '#b04bff', '#f0c4ff', 'star'], ['Glace', '#5fc8ff', '#eafcff', 'snow'], ['Toxine', '#7ad62a', '#eaff9a', 'drip'], ['Ombre', '#34344e', '#9a9ac4', 'smoke'],
  ['Soleil', '#ffbf1f', '#fff4b0', 'star'], ['Océan', '#1698c0', '#8aefff', 'bubble'], ['Sakura', '#ff7fb0', '#ffe3ee', 'petal'], ['Foudre', '#ffe030', '#ffffff', 'bolt'],
  ['Champion', '#ffcf33', '#fff6c4', 'crown'], ['Radiant', '#ff6adf', '#7affff', 'rainbow'],
  // thèmes SECRETS (14 → 19) : le 4e champ est la « signature » animée du skin
  ['Singularité', '#8a2cff', '#f1dcff', 'void'], ['Dragon Solaire', '#ff5a14', '#ffe27a', 'sun'], ['Zéro Absolu', '#3fd0ff', '#f2fdff', 'ice'],
  ['Cyber Glitch', '#00f0ff', '#ff2bd6', 'glitch'], ['Aurore Boréale', '#27e8a2', '#b58cff', 'aurora'], ['Éclipse Divine', '#ffc83a', '#fff6d0', 'eclipse']];
const CRTN = { b: ['Mat', 'Brillant', 'Prisme', 'Aura'], w: ['Simple', 'Néon', 'Cristal', 'Infernal'], p: ['Halo', 'Double halo', 'Orbite', 'Explosion'] };
const CRTY = { b: 'Perso', w: 'Arme', p: 'Pouvoir', k: 'Kill', s: 'Secret' };
const CRTL = { b: 'Skin de perso', w: 'Skin d\'arme', p: 'Effet de pouvoir', k: 'Animation de kill', s: 'Skin secret complet' };
const CAT = [];
(function () {
  const sets = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [1, 3, 5, 11]];
  for (const t of ['b', 'w', 'p']) {
    for (let r = 0; r < 4; r++) for (const th of sets[r]) CAT.push({ t, r, th, x: 0, n: CRTH[th][0] + ' ' + CRTN[t][r] });
    const top = { b: 'Absolu', w: 'Suprême', p: 'Cataclysme' }[t];
    CAT.push({ t, r: 4, th: 12, x: 1, n: 'Champion ' + top }); CAT.push({ t, r: 4, th: 13, x: 2, n: 'Radiant ' + top });
  }
  // x : 0 = toutes les caisses d'un palier compatible, 1 = Caisse Champion seulement, 2 = Caisse Radiant seulement
  [['Confettis', 2, 0, 'conf'], ['Âme libérée', 2, 0, 'soul'], ['Foudre', 3, 0, 'bolt'], ['Étoiles filantes', 3, 0, 'stars'],
   ['Explosion pixel', 3, 0, 'pixel'], ['Pluie de pétales', 3, 2, 'petal'], ['Couronne du champion', 4, 1, 'crown'], ['Supernova', 4, 2, 'nova']]
    .forEach(a => CAT.push({ t: 'k', n: a[0], r: a[1], x: a[2], k: a[3], th: a[2] == 2 ? 13 : a[2] == 1 ? 12 : a[1] >= 3 ? 11 : 8 }));
  // SKINS SECRETS : un set complet (perso + arme + pouvoir + kill) qui remplace les 4 équipements d'un coup. Uniquement via la Caisse Secrète.
  ['Singularité', 'Dragon Solaire', 'Zéro Absolu', 'Cyber Glitch', 'Aurore Boréale', 'Éclipse Divine'].forEach((n, j) => {
    const th = 14 + j, mk = (t, o) => Object.assign({ t, r: 5, th, x: 0, n }, o);
    CAT.push({ t: 's', r: 5, th, x: 0, n, v: { b: mk('b'), w: mk('w'), p: mk('p'), k: mk('k', { k: 'sec' }) } });
  });
  CAT.forEach((it, i) => it.i = i);
})();
const CRC = [ // w = probabilités (%) par palier de rareté
  { n: 'Caisse Bronze', p: 30, c1: '#c98a4a', c2: '#ffd9a0', w: [60, 30, 9, 1, 0], d: 'Animations simples' },
  { n: 'Caisse Argent', p: 90, c1: '#aab6c8', c2: '#ffffff', w: [15, 40, 35, 10, 0], d: 'Animations lumineuses' },
  { n: 'Caisse Or', p: 250, c1: '#ffc933', c2: '#fff2a8', w: [0, 10, 45, 45, 0], d: 'Animations spectaculaires' },
  { n: 'Caisse Champion', p: 0, c1: '#ffcf33', c2: '#ff8a1a', w: [0, 0, 35, 45, 20], top: 1, kx: 1, d: 'Top 1 en Classique' },
  { n: 'Caisse Radiant', p: 0, c1: '#ff6adf', c2: '#7affff', w: [0, 0, 20, 45, 35], top: 2, kx: 2, d: 'Top 1 en Classé' },
  { n: 'Caisse Secrète', p: 1000, c1: '#240a3d', c2: '#ff3d8b', w: [0, 0, 0, 0, 0], secret: 1, d: 'Skins secrets animés' }]; // se débloque quand TOUS les skins sont obtenus

// ---------- État & sauvegarde ----------
let crTab = 0, crOp = null, crWinInfo = null, crDone = -1, KFX = [], PFX = [], crLast = 0;
function crInit() {
  if (!Array.isArray(SV.cw)) SV.cw = [];
  if (!SV.cq || typeof SV.cq != 'object') SV.cq = {};
  if (!SV.ci || typeof SV.ci != 'object') SV.ci = {};
  for (const t of ['b', 'w', 'p', 'k', 's']) { const v = SV.cq[t]; if (!Number.isInteger(v) || !SV.cw.includes(v) || !CAT[v] || CAT[v].t != t) SV.cq[t] = -1 }
}
function crCx() { crInit(); return ['b', 'w', 'p', 'k', 's'].map(t => SV.cq[t] + 1).join('.') }
const crMemo = {};
function crGet(cx, t) {
  if (!cx || typeof cx != 'string') return null;
  let a = crMemo[cx]; if (!a) { a = crMemo[cx] = cx.split('.').map(n => n | 0) }
  const sj = a[4] - 1, sec = sj >= 0 ? CAT[sj] : null; // un skin secret équipé remplace perso + arme + pouvoir + kill
  if (sec && sec.t == 's') return t == 's' ? sec : (sec.v[t] || null);
  const i = a['bwpks'.indexOf(t)] - 1; const it = i >= 0 ? CAT[i] : null; return it && it.t == t ? it : null;
}
function crEquip(i) { crInit(); const it = CAT[i]; if (!it || !SV.cw.includes(i)) return; SV.cq[it.t] = SV.cq[it.t] == i ? -1 : i; save(); pres() }
const crTopCount = () => (SV.ci[3] | 0) + (SV.ci[4] | 0);
const crProg = () => { crInit(); const l = CAT.filter(it => it.t != 's'); return [l.filter(it => SV.cw.includes(it.i)).length, l.length] }; // progression de la collection (hors secrets)
const crAll = () => { const p = crProg(); return p[0] >= p[1] };

// ---------- Tirage ----------
function crPickW(w) { let s = 0; for (const v of w) s += v; let r = Math.random() * s; for (let i = 0; i < w.length; i++) { if (r < w[i]) return i; r -= w[i] } return 0 }
function crRoll(ci) {
  const C = CRC[ci], kx = C.kx || 0, ok = it => it.t != 's' && (it.x == 0 || it.x == kx);
  if (C.secret) { const all = CAT.filter(it => it.t == 's'), fresh = all.filter(it => !SV.cw.includes(it.i)), pl = fresh.length ? fresh : all; return pl[Math.random() * pl.length | 0] } // jamais de doublon tant qu'il reste un skin secret
  const tier = crPickW(C.w); let type;
  if (C.top && Math.random() < .3) type = 'k'; else { const r = Math.random() * 100; type = r < 40 ? 'b' : r < 75 ? 'w' : 'p' }
  let pool = CAT.filter(it => it.t == type && it.r == tier && ok(it));
  if (!pool.length && type == 'k') pool = CAT.filter(it => it.t == 'k' && ok(it) && it.r >= 2);
  if (!pool.length) pool = CAT.filter(it => it.t != 'k' && it.r == tier && ok(it));
  if (!pool.length) pool = CAT.filter(it => ok(it));
  return pool[Math.random() * pool.length | 0];
}
function crBuy(ci) {
  crInit(); const C = CRC[ci];
  if ((SV.ci[ci] | 0) > 0) SV.ci[ci]--; else if (C.top) return; else { if (C.secret && !crAll()) { feed.push({ t: '🔒 Obtiens tous les skins pour débloquer la Caisse Secrète', l: 4 }); return } if (SV.coins < C.p) { feed.push({ t: 'Pas assez de pièces', l: 3 }); return } SV.coins -= C.p }
  const it = crRoll(ci), dup = SV.cw.includes(it.i);
  if (dup) SV.coins += CRT[it.r].v; else SV.cw.push(it.i);
  crOp = { ci, it, dup, t0: performance.now(), eq: SV.cq[it.t] == it.i }; save(); pres();
}

// ---------- Récompenses Top 1 ----------
function crStand() {
  const L = [{ me: 1, k: me.k, d: me.dth || 0, id: myPeer || 'me' }];
  for (const k in R) { const o = R[k]; if (o.pl) L.push({ id: k, k: o.k, d: o.dd || 0 }) }
  if (L.length == 1) bots.forEach((b, i) => L.push({ id: 'bot:' + i, k: b.k || 0, d: b.d || 0 }));
  L.sort((a, b) => b.k - a.k || a.d - b.d || (String(a.id) < String(b.id) ? -1 : 1)); return L;
}
function crWin(id) {
  if (crDone === id || (SV.mode != 0 && SV.mode != 1) || !me.pl || me.late) return;
  crDone = id; const L = crStand();
  if (L.length < 2 || !L[0].me || me.k < 3) return; // il faut au moins 3 kills pour mériter la caisse
  crInit(); const ci = SV.mode == 1 ? 4 : 3; SV.ci[ci] = (SV.ci[ci] | 0) + 1; save();
  crWinInfo = { ci }; feed.push({ t: '🏆 Top 1 ! Tu gagnes une ' + CRC[ci].n, l: 8 });
}

// ---------- Utilitaires de dessin ----------
const crRnd = s => ((Math.sin(s * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;
function crMix(a, b, k) { const p = s => [1, 3, 5].map(i => parseInt(s.substr(i, 2), 16)); const A = p(a), B = p(b); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',') + ')' }
function crShape(kind, x, y, z, col, a, rot) {
  kind = { void: 'bubble', sun: 'flame', ice: 'snow', aurora: 'petal', eclipse: 'star' }[kind] || kind;
  g.save(); g.globalAlpha = g.globalAlpha * Math.max(0, Math.min(1, a)); g.translate(x, y); g.rotate(rot || 0); g.fillStyle = col; g.strokeStyle = col;
  if (kind == 'flame') { g.beginPath(); g.moveTo(0, -z); g.lineTo(z * .6, z * .4); g.lineTo(-z * .6, z * .4); g.fill() }
  else if (kind == 'star' || kind == 'spark' || kind == 'crown') { g.beginPath(); for (let i = 0; i < 8; i++) { const rd = i % 2 ? z * .35 : z, an = i * Math.PI / 4; g.lineTo(Math.cos(an) * rd, Math.sin(an) * rd) } g.closePath(); g.fill() }
  else if (kind == 'snow') { g.lineWidth = 1.3; for (let i = 0; i < 3; i++) { g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(-z, 0); g.lineTo(z, 0); g.stroke() } }
  else if (kind == 'drip') { g.beginPath(); g.ellipse(0, 0, z * .5, z * .8, 0, 0, 7); g.fill() }
  else if (kind == 'bubble') { g.lineWidth = 1.5; g.beginPath(); g.arc(0, 0, z, 0, 7); g.stroke() }
  else if (kind == 'petal') { g.beginPath(); g.ellipse(0, 0, z, z * .5, 0, 0, 7); g.fill() }
  else if (kind == 'glitch') { g.fillRect(-z, -z * .3, z * 2, z * .6) }
  else { g.beginPath(); g.arc(0, 0, z, 0, 7); g.fill() }
  g.restore();
}
function crParts(kind, th, r, t, n) { // particules thématiques autour du centre (repère du joueur, l'arrière est en -x)
  if (kind == 'bolt') {
    g.save(); g.strokeStyle = th[2]; g.lineWidth = 2; g.shadowColor = th[1]; g.shadowBlur = 8;
    for (let i = 0; i < 3; i++) { const sd = Math.floor(t * 12) + i * 17, a = crRnd(sd) * 6.283; g.beginPath(); g.moveTo(Math.cos(a) * r * .8, Math.sin(a) * r * .8);
      for (let j = 1; j <= 4; j++) g.lineTo(Math.cos(a) * (r * .8 + j * r * .35) + (crRnd(sd + j) - .5) * r * .6, Math.sin(a) * (r * .8 + j * r * .35) + (crRnd(sd + j + 9) - .5) * r * .6); g.stroke() }
    g.restore(); return;
  }
  for (let i = 0; i < n; i++) {
    const ph = (t * .9 + i / n) % 1, a0 = i * 2.399; let x, y, z = r * .3, al = 1 - ph, col = i % 2 ? th[2] : th[1];
    if (kind == 'flame' || kind == 'sun' || kind == 'smoke' || kind == 'drip' || kind == 'rainbow') { x = -r * (.5 + ph * 1.6); y = Math.sin(a0 * 3) * r * .5 * (1 - ph * .5);
      if (kind == 'flame' || kind == 'sun') { z = r * .5 * (1 - ph) + 1; col = crMix(th[2], th[1], ph) } else if (kind == 'smoke') { z = r * .3 + ph * r * .6; al = .35 * (1 - ph) } else if (kind == 'rainbow') col = 'hsl(' + ((t * 200 + i * 40) % 360) + ',100%,65%)'; else z = r * .25 }
    else if (kind == 'spark' || kind == 'star' || kind == 'crown') { const a = t * 2.5 + a0, d = r * (1.3 + .3 * Math.sin(t * 4 + i)); x = Math.cos(a) * d; y = Math.sin(a) * d; al = .6 + .4 * Math.sin(t * 6 + i); z = r * (kind == 'spark' ? .22 : .35) }
    else { const a = a0 + t * .5, d = r * (1 + ph * 1.3); x = Math.cos(a) * d; y = Math.sin(a) * d; z = r * .25 }
    crShape(kind, x, y, z, col, al, t * 2 + i);
  }
}
function crFill(it, r) {
  const th = CRTH[it.th], t = tt;
  if (it.r == 0) return th[1];
  if (it.r == 5) return crSecFill(it, r, t);
  if (it.th == 13) { const gr = g.createLinearGradient(-r, -r, r, r); for (let i = 0; i < 4; i++) gr.addColorStop(i / 3, 'hsl(' + ((t * 120 + i * 80) % 360) + ',95%,62%)'); return gr }
  if (it.r == 1) return crMix(th[1], th[2], .5 + .45 * Math.sin(t * 3));
  const gr = g.createRadialGradient(Math.cos(t * 2) * r * .4, Math.sin(t * 2) * r * .4, 1, 0, 0, r * 1.1);
  gr.addColorStop(0, th[2]); gr.addColorStop(1, th[1]); return gr;
}
function crBodyFx(s, it) { // repère du joueur (tourné)
  if (it.r == 5) { crSecBody(s, it); return }
  const th = CRTH[it.th], r = s.r, t = tt, k = it.r; g.save(); const A = g.globalAlpha; g.strokeStyle = th[2];
  if (k == 0) { g.globalAlpha = A * .7; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, r * .8, 0, 7); g.stroke() }
  else if (k == 1) { g.globalAlpha = A * (.35 + .35 * Math.sin(t * 4)); g.lineWidth = 3; g.beginPath(); g.arc(0, 0, r + 2, 0, 7); g.stroke() }
  else { const n = k + 1; for (let i = 0; i < n; i++) { const a = t * (2 + k * .4) + i * 6.283 / n; crShape('star', Math.cos(a) * r * 1.25, Math.sin(a) * r * 1.25, 2.5 + k * .6, th[2], .9, t * 3) } }
  if (k >= 2) { g.globalAlpha = A * (.25 + .2 * Math.sin(t * 3)); g.lineWidth = 2; g.beginPath(); g.arc(0, 0, r * .6, 0, 7); g.stroke() }
  if (k >= 3) crParts(th[3], th, r, t, 3 + k);
  g.restore();
}
function crUp(s, it) { // décorations droites (couronne, auréole, ailes) pour les objets Mythiques
  if (it.r == 5) { crSecUp(s, it); return }
  if (it.r < 4) return; const r = s.r, t = tt; g.save();
  if (it.th == 12) crCrown(0, -r - 1 + Math.sin(t * 3) * 1.5, 9, '#ffd24a');
  else {
    g.lineWidth = 2.5; g.strokeStyle = 'hsl(' + ((t * 200) % 360) + ',100%,70%)'; g.beginPath(); g.ellipse(0, -r - 8, r * .7, 3.5, 0, 0, 7); g.stroke();
    const fl = Math.sin(t * 6) * .25; g.globalAlpha = g.globalAlpha * .4; g.fillStyle = '#fff';
    for (const q of [-1, 1]) { g.beginPath(); g.moveTo(q * r * .7, -2); g.quadraticCurveTo(q * r * 2, -r * (1.2 + fl), q * r * 2.6, -r * .1); g.quadraticCurveTo(q * r * 1.9, -r * .1, q * r * 1.5, r * .5); g.closePath(); g.fill() }
  }
  g.restore();
}
// ---------- Skins SECRETS : chaque skin a sa propre forme de corps, ses balles, son pouvoir et son kill ----------
const crSecC = (it, i) => crMix(CRTH[it.th][1], CRTH[it.th][2], .5 + .5 * Math.sin(tt * 3 + (i || 0)));
function crSecFill(it, r, t) {
  const th = CRTH[it.th], f = th[3], c1 = th[1], c2 = th[2], s = .5 + .5 * Math.sin(t * 2); let gr;
  if (f == 'void' || f == 'eclipse') { gr = g.createRadialGradient(0, 0, 2, 0, 0, r * 1.1); gr.addColorStop(0, '#05020c'); gr.addColorStop(.7, crMix('#05020c', c1, .35 + .2 * Math.sin(t * 3))); gr.addColorStop(1, c1); return gr }
  if (f == 'sun') { gr = g.createRadialGradient(0, 0, 1, 0, 0, r * 1.1); gr.addColorStop(0, '#fffbe0'); gr.addColorStop(.45, c2); gr.addColorStop(1, crMix(c1, '#b01000', s)); return gr }
  if (f == 'ice') { gr = g.createLinearGradient(-r, -r, r, r); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.5, crMix(c2, c1, s)); gr.addColorStop(1, c1); return gr }
  if (f == 'glitch') return Math.sin(t * 23) > .65 ? c2 : crMix('#0a0f1c', c1, .45 + .3 * Math.sin(t * 5));
  gr = g.createLinearGradient(-r, -r, r, r); gr.addColorStop(0, crMix(c1, c2, s)); gr.addColorStop(.5, crMix(c2, '#ffffff', .25)); gr.addColorStop(1, crMix(c2, c1, s)); return gr;
}
function crSecBody(s, it) { // repère du joueur (tourné) : l'arrière est en -x
  const th = CRTH[it.th], r = s.r, t = tt, f = th[3], c1 = th[1], c2 = th[2]; g.save(); const A = g.globalAlpha;
  g.globalCompositeOperation = 'lighter'; const hg = g.createRadialGradient(0, 0, r * .4, 0, 0, r * 2.2); hg.addColorStop(0, c1); hg.addColorStop(1, 'rgba(0,0,0,0)');
  g.globalAlpha = A * (.22 + .1 * Math.sin(t * 4)); g.fillStyle = hg; g.beginPath(); g.arc(0, 0, r * 2.2, 0, 7); g.fill(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = A;
  const eyes = () => { g.fillStyle = '#fff'; g.beginPath(); g.arc(r * .35, -r * .35, 2.4, 0, 7); g.arc(r * .35, r * .35, 2.4, 0, 7); g.fill() };
  if (f == 'void') { // trou noir : disque d'accrétion incliné, horizon des événements, matière aspirée
    g.save(); g.rotate(t * .7); g.scale(1, .38); g.strokeStyle = c1; g.lineWidth = 7; g.globalAlpha = A * .7; g.beginPath(); g.arc(0, 0, r * 1.75, 0, 7); g.stroke(); g.strokeStyle = c2; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, r * 1.75, 0, 7); g.stroke(); g.restore(); g.globalAlpha = A;
    g.fillStyle = 'rgba(4,0,12,.93)'; g.beginPath(); g.arc(0, 0, r * .8, 0, 7); g.fill(); g.strokeStyle = c2; g.lineWidth = 2; g.globalAlpha = A * (.6 + .4 * Math.sin(t * 8)); g.beginPath(); g.arc(0, 0, r * .82, 0, 7); g.stroke(); g.globalAlpha = A;
    for (let i = 0; i < 12; i++) { const ph = (t * .8 + i / 12) % 1, a = i * 2.4 + ph * 5, d = r * (2.3 - ph * 1.5); g.globalAlpha = A * ph; g.fillStyle = i % 2 ? c1 : c2; g.fillRect(Math.cos(a) * d - 1.5, Math.sin(a) * d - 1.5, 3, 3) } g.globalAlpha = A; eyes()
  } else if (f == 'sun') { // étoile : longue traîne de flammes + couronne de rayons
    for (let i = 0; i < 14; i++) { const ph = (t * 1.3 + i / 14) % 1; crShape('flame', -r * (.6 + ph * 2.6), Math.sin(i * 2.7 + t * 6) * r * .45 * (1 - ph * .4), r * .65 * (1 - ph) + 2, crMix(c2, c1, ph), (1 - ph) * A, -1.5708) }
    for (let i = 0; i < 10; i++) { const a = i * .6283 + t * .8, L = r * (1.4 + .3 * Math.sin(t * 5 + i * 1.7)); g.fillStyle = i % 2 ? c2 : c1; g.globalAlpha = A * .85; g.beginPath(); g.moveTo(Math.cos(a - .15) * r * .95, Math.sin(a - .15) * r * .95); g.lineTo(Math.cos(a) * L, Math.sin(a) * L); g.lineTo(Math.cos(a + .15) * r * .95, Math.sin(a + .15) * r * .95); g.closePath(); g.fill() } g.globalAlpha = A
  } else if (f == 'ice') { // flocon hexagonal : 6 pointes de cristal, hexagone intérieur, anneau de givre
    g.save(); g.rotate(-t * .5); g.strokeStyle = c2; g.lineWidth = 2; g.beginPath(); for (let i = 0; i <= 6; i++) g.lineTo(Math.cos(i * 1.0472) * r * 1.0, Math.sin(i * 1.0472) * r * 1.0); g.stroke(); g.restore();
    for (let i = 0; i < 6; i++) { g.save(); g.rotate(i * 1.0472 + t * .35); g.fillStyle = c2; g.strokeStyle = c1; g.lineWidth = 1.5; g.beginPath(); g.moveTo(r * 1.1, 0); g.lineTo(r * 1.55, -r * .17); g.lineTo(r * (2.1 + .15 * Math.sin(t * 4 + i)), 0); g.lineTo(r * 1.55, r * .17); g.closePath(); g.fill(); g.stroke(); g.restore() }
    g.save(); g.setLineDash([4, 5]); g.rotate(t * .8); g.strokeStyle = c1; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, r * 1.25, 0, 7); g.stroke(); g.restore(); crParts('ice', th, r, t, 7)
  } else if (f == 'glitch') { // cadre de visée carré, image dédoublée RGB, tranches qui sautent
    const sd = Math.floor(t * 14), j = (crRnd(sd) - .5) * 8; g.lineWidth = 2; g.strokeStyle = c1; g.globalAlpha = A * .8; g.beginPath(); g.arc(j, -j * .4, r * 1.02, 0, 7); g.stroke(); g.strokeStyle = c2; g.beginPath(); g.arc(-j, j * .4, r * 1.02, 0, 7); g.stroke(); g.globalAlpha = A;
    if (Math.sin(t * 30) > -.75) { const z = r * 1.45, l = r * .5; g.strokeStyle = c1; g.lineWidth = 2.5; for (const sx of [-1, 1]) for (const sy of [-1, 1]) { g.beginPath(); g.moveTo(sx * z, sy * (z - l)); g.lineTo(sx * z, sy * z); g.lineTo(sx * (z - l), sy * z); g.stroke() } }
    g.globalAlpha = A * .75; for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? c1 : c2; g.fillRect(-r + (crRnd(sd + i) - .5) * 12, (crRnd(sd + i + 5) - .5) * r * 1.9, r * 1.7, 2) } g.globalAlpha = A; crParts('glitch', th, r, t, 5)
  } else if (f == 'aurora') { // 4 longs rubans fluides qui s'étirent derrière
    g.lineCap = 'round'; for (let k = 0; k < 4; k++) { g.strokeStyle = crMix(c1, c2, k / 3); g.lineWidth = 5 - k * .8; g.globalAlpha = A * .8; g.beginPath(); for (let j = 0; j <= 20; j++) g.lineTo(-r * .6 - j * r * .24, Math.sin(j * .45 - t * 4 + k * 1.6) * r * (.25 + j * .04) + (k - 1.5) * r * .35); g.stroke() } g.globalAlpha = A; crParts('aurora', th, r, t, 5)
  } else { // éclipse : disque noir, couronne de 24 rayons dorés, 3 glyphes en orbite
    g.fillStyle = '#05030a'; g.beginPath(); g.arc(0, 0, r * .8, 0, 7); g.fill(); g.strokeStyle = c1; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, r * .86, 0, 7); g.stroke(); g.strokeStyle = c2; g.lineWidth = 1.5; g.globalAlpha = A * .75;
    for (let i = 0; i < 24; i++) { const a = i * .2618 + t * .5, L = r * (1.2 + (i % 2 ? .45 : .2) * (.6 + .4 * Math.sin(t * 6 + i))); g.beginPath(); g.moveTo(Math.cos(a) * r * .95, Math.sin(a) * r * .95); g.lineTo(Math.cos(a) * L, Math.sin(a) * L); g.stroke() } g.globalAlpha = A;
    for (let i = 0; i < 3; i++) { const a = -t * 1.6 + i * 2.094; crShape('star', Math.cos(a) * r * 1.7, Math.sin(a) * r * 1.7, 4.5, c1, 1, t * 3) } eyes()
  }
  g.restore();
}
function crSecUp(s, it) { // décorations droites (au-dessus du joueur) : différentes pour chaque skin
  const th = CRTH[it.th], r = s.r, t = tt, f = th[3], c1 = th[1], c2 = th[2]; g.save(); const A = g.globalAlpha, hy = -r - 10 + Math.sin(t * 3) * 1.5;
  if (f == 'void') { g.fillStyle = '#05000e'; g.strokeStyle = c1; g.lineWidth = 2; g.beginPath(); g.arc(0, hy - 4, 6, 0, 7); g.fill(); g.stroke(); for (let i = 0; i < 3; i++) { const a = t * 3 + i * 2.094; g.fillStyle = c2; g.fillRect(Math.cos(a) * 11 - 1.5, hy - 4 + Math.sin(a) * 4 - 1.5, 3, 3) } }
  else if (f == 'sun') { for (let i = -2; i <= 2; i++) crShape('flame', i * 6, hy - 2 - (2 - Math.abs(i)) * 2.5, 7 + Math.sin(t * 9 + i) * 1.6, i % 2 ? c2 : c1, A, 0) }
  else if (f == 'ice') { g.fillStyle = c2; g.strokeStyle = c1; g.lineWidth = 1.5; for (let i = -2; i <= 2; i++) { const h = 11 - Math.abs(i) * 2.5; g.beginPath(); g.moveTo(i * 5 - 3, hy + 3); g.lineTo(i * 5, hy + 3 - h); g.lineTo(i * 5 + 3, hy + 3); g.closePath(); g.fill(); g.stroke() } }
  else if (f == 'glitch') { const on = Math.sin(t * 20) > -.5, j = (crRnd(Math.floor(t * 12)) - .5) * 5; if (on) { g.strokeStyle = c1; g.lineWidth = 2; g.strokeRect(-8 + j, hy - 7, 16, 11); g.strokeStyle = c2; g.strokeRect(-8 - j, hy - 7, 16, 11) } g.fillStyle = c2; g.fillRect(-12 + j, hy - 2, 24, 2) }
  else if (f == 'aurora') { g.lineWidth = 3; g.lineCap = 'round'; for (let k = 0; k < 2; k++) { g.strokeStyle = k ? c2 : c1; g.beginPath(); for (let j = 0; j <= 16; j++) { const a = j / 16 * 6.2832; g.lineTo(Math.cos(a) * r * .75, hy + Math.sin(a) * 3.5 + Math.sin(a * 3 + t * 4 + k * 2) * 2.5) } g.stroke() } }
  else { g.lineWidth = 2.5; g.strokeStyle = crSecC(it, 0); g.beginPath(); g.ellipse(0, hy, r * .7, 3.5, 0, 0, 7); g.stroke(); const fl = Math.sin(t * 6) * .3;
    for (const q of [-1, 1]) { g.globalAlpha = A * .5; g.fillStyle = c2; g.beginPath(); g.moveTo(q * r * .7, -2); g.quadraticCurveTo(q * r * 2, -r * (1.3 + fl), q * r * 2.7, -r * .1); g.quadraticCurveTo(q * r * 1.9, -r * .1, q * r * 1.5, r * .5); g.closePath(); g.fill() } g.globalAlpha = A; crCrown(0, hy - 8, 8, c1) }
  g.restore();
}
function crSecMuz(it, x1) { // bout du canon : une forme différente par skin
  const th = CRTH[it.th], f = th[3], t = tt, p = .5 + .5 * Math.sin(t * 10); g.save(); g.translate(x1, 0);
  if (f == 'void') { g.fillStyle = '#05000e'; g.beginPath(); g.arc(0, 0, 4 + p * 1.5, 0, 7); g.fill(); g.strokeStyle = th[1]; g.lineWidth = 1.5; g.stroke() }
  else if (f == 'sun') crShape('flame', 3, 0, 7 + p * 3, th[2], 1, 1.5708);
  else if (f == 'ice') crShape('snow', 0, 0, 6, th[2], 1, t * 2);
  else if (f == 'glitch') { g.fillStyle = Math.sin(t * 25) > 0 ? th[1] : th[2]; g.fillRect(-3, -3, 6 + p * 3, 6) }
  else if (f == 'aurora') crShape('petal', 0, 0, 6 + p * 2, th[2], .9, t * 3);
  else crShape('star', 0, 0, 6 + p * 2, th[1], 1, t * 2);
  g.restore();
}
function crSecBul(it, x, y, ux, uy) { // balle : une forme et une traînée différentes par skin
  const th = CRTH[it.th], f = th[3], t = tt, c1 = th[1], c2 = th[2], ang = Math.atan2(uy, ux);
  if (f == 'void') { g.globalAlpha = .5; g.strokeStyle = c1; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x - ux * 26, y - uy * 26); g.stroke(); g.globalAlpha = 1; g.fillStyle = '#05000e'; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); g.strokeStyle = c2; g.lineWidth = 1.6; g.stroke(); g.globalAlpha = .45; g.beginPath(); g.arc(x, y, 8.5 + Math.sin(t * 15), 0, 7); g.stroke(); g.globalAlpha = 1 }
  else if (f == 'sun') { g.shadowColor = c1; g.shadowBlur = 14; g.fillStyle = c2; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.fill(); g.shadowBlur = 0; for (let j = 1; j <= 5; j++) crShape('flame', x - ux * j * 8, y - uy * j * 8, 8 - j, j % 2 ? c2 : c1, 1 - j * .17, Math.atan2(-ux, uy)) }
  else if (f == 'ice') { g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = c2; g.strokeStyle = c1; g.lineWidth = 1.5; g.beginPath(); g.moveTo(10, 0); g.lineTo(0, -3.5); g.lineTo(-9, 0); g.lineTo(0, 3.5); g.closePath(); g.fill(); g.stroke(); g.restore(); for (let j = 1; j <= 3; j++) crShape('snow', x - ux * (j * 11 + 6) + Math.sin(t * 9 + j) * 3, y - uy * (j * 11 + 6), 4, c2, 1 - j * .25, t * 3 + j) }
  else if (f == 'glitch') { const j = (crRnd(Math.floor(t * 20) + (x | 0)) - .5) * 6; g.fillStyle = c1; g.fillRect(x - 3 + j, y - 3, 6, 6); g.fillStyle = c2; g.fillRect(x - 3 - j, y - 3, 6, 6); for (let k = 1; k <= 3; k++) { g.globalAlpha = 1 - k * .25; g.fillStyle = k % 2 ? c1 : c2; g.fillRect(x - ux * k * 9 - 2, y - uy * k * 9 - 2, 4, 4) } g.globalAlpha = 1 }
  else if (f == 'aurora') { g.lineCap = 'round'; g.lineWidth = 3; g.strokeStyle = crSecC(it, x * .02); g.beginPath(); for (let j = 0; j <= 10; j++) { const d = j * 4, w = Math.sin(j * .7 - t * 18) * 3 * (j / 10); g.lineTo(x - ux * d - uy * w, y - uy * d + ux * w) } g.stroke(); g.fillStyle = c2; g.beginPath(); g.arc(x, y, 3.5, 0, 7); g.fill() }
  else { g.shadowColor = c1; g.shadowBlur = 12; crShape('star', x, y, 7, c1, 1, t * 5); g.shadowBlur = 0; g.strokeStyle = c2; g.lineWidth = 1.4; g.globalAlpha = .8; g.beginPath(); g.arc(x, y, 9, 0, 7); g.stroke(); g.globalAlpha = 1; for (let j = 1; j <= 3; j++) crShape('star', x - ux * j * 10, y - uy * j * 10, 5 - j, c2, 1 - j * .25, t * 4 + j) }
}
function crSecPfx(it, t, dur, u) { // effet de pouvoir (repère centré sur le joueur) : un effet totalement différent par skin
  const th = CRTH[it.th], f = th[3], c1 = th[1], c2 = th[2]; g.lineCap = 'round';
  if (f == 'void') { // implosion puis onde de choc
    for (let i = 0; i < 3; i++) { const uu = Math.max(0, Math.min(1, u * 1.5 - i * .12)); g.globalAlpha = (1 - uu) * .9; g.strokeStyle = i % 2 ? c2 : c1; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, (1 - uu) * (120 + i * 30) + 8, 0, 7); g.stroke() }
    g.globalAlpha = 1 - u * .5; g.fillStyle = 'rgba(4,0,12,.9)'; g.beginPath(); g.arc(0, 0, Math.sin(Math.min(1, u * 1.2) * Math.PI) * 34, 0, 7); g.fill(); g.strokeStyle = c2; g.lineWidth = 2; g.stroke();
    if (u > .55) { const v = (u - .55) / .45; g.globalAlpha = 1 - v; g.strokeStyle = c2; g.lineWidth = 5 * (1 - v) + 1; g.beginPath(); g.arc(0, 0, v * 135, 0, 7); g.stroke() }
  } else if (f == 'sun') { // anneau de feu + 14 flammes projetées
    g.globalCompositeOperation = 'lighter'; const R0 = 30 + u * 110, gr = g.createRadialGradient(0, 0, 0, 0, 0, R0); gr.addColorStop(0, c2); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.globalAlpha = (1 - u) * .8; g.fillStyle = gr; g.beginPath(); g.arc(0, 0, R0, 0, 7); g.fill(); g.globalCompositeOperation = 'source-over';
    g.globalAlpha = 1 - u; g.strokeStyle = c1; g.lineWidth = 6 * (1 - u) + 1; g.beginPath(); g.arc(0, 0, 25 + u * 95, 0, 7); g.stroke();
    for (let i = 0; i < 14; i++) { const a = i * .449, d = 20 + u * 115; crShape('flame', Math.cos(a) * d, Math.sin(a) * d, 15 * (1 - u * .6), i % 2 ? c2 : c1, 1 - u, a + 1.5708) }
  } else if (f == 'ice') { // anneau de givre + 6 grandes lances de glace + neige
    g.globalAlpha = 1 - u; g.strokeStyle = c2; g.lineWidth = 4 * (1 - u) + 1; g.beginPath(); g.arc(0, 0, 25 + u * 100, 0, 7); g.stroke();
    for (let i = 0; i < 6; i++) { g.save(); g.rotate(i * 1.0472 + u * .5); g.globalAlpha = 1 - u * .6; g.fillStyle = c2; g.strokeStyle = c1; g.lineWidth = 1.5; const L = 30 + u * 95; g.beginPath(); g.moveTo(18, 0); g.lineTo(L * .55, -8); g.lineTo(L, 0); g.lineTo(L * .55, 8); g.closePath(); g.fill(); g.stroke(); g.restore() }
    for (let i = 0; i < 12; i++) { const a = i * .5236 + crRnd(i), d = 30 + u * (60 + crRnd(i + 2) * 60); crShape('snow', Math.cos(a) * d, Math.sin(a) * d + u * 25, 5, c2, 1 - u, t * 3 + i) }
  } else if (f == 'glitch') { // carrés concentriques décalés RGB + barres parasites
    const sd = Math.floor(t * 25); for (let i = 0; i < 4; i++) { const z = 16 + u * 85 + i * 16, j = (crRnd(sd + i) - .5) * 9; g.globalAlpha = 1 - u; g.lineWidth = 2.5; g.strokeStyle = c1; g.strokeRect(-z + j, -z, z * 2, z * 2); g.strokeStyle = c2; g.strokeRect(-z - j, -z, z * 2, z * 2) }
    for (let i = 0; i < 8; i++) { g.globalAlpha = (1 - u) * .8; g.fillStyle = i % 2 ? c1 : c2; g.fillRect((crRnd(sd + i + 3) - .5) * 220, (crRnd(sd + i + 9) - .5) * 160, 30 + crRnd(sd + i) * 60, 3) }
  } else if (f == 'aurora') { // 3 rubans en spirale ascendante
    for (let k = 0; k < 3; k++) { g.globalAlpha = 1 - u; g.strokeStyle = crMix(c1, c2, k / 2); g.lineWidth = 5 * (1 - u) + 1; g.beginPath(); for (let j = 0; j <= 30; j++) { const a = j * .3 + t * 3 + k * 2.094, d = 10 + j * 3 * (.4 + u); g.lineTo(Math.cos(a) * d, Math.sin(a) * d * .55 - j * 2.5 * u) } g.stroke() }
    for (let i = 0; i < 8; i++) crShape('star', Math.sin(t * 3 + i) * 50, -u * (40 + i * 14), 4, i % 2 ? c1 : c2, 1 - u, t * 3)
  } else { // éclipse : disque noir, couronne de 24 rayons dorés, couronne qui s'élève
    g.globalAlpha = 1 - u * .6; g.fillStyle = '#05030a'; g.beginPath(); g.arc(0, 0, 22, 0, 7); g.fill(); g.strokeStyle = c1; g.lineWidth = 3; g.stroke();
    for (let i = 0; i < 24; i++) { const a = i * .2618 + t, d = 28 + u * (70 + (i % 2) * 40); g.globalAlpha = 1 - u; g.strokeStyle = i % 2 ? c2 : c1; g.lineWidth = 2; g.beginPath(); g.moveTo(Math.cos(a) * 28, Math.sin(a) * 28); g.lineTo(Math.cos(a) * d, Math.sin(a) * d); g.stroke() }
    g.globalAlpha = 1 - u * .5; crCrown(0, -34 - u * 30, 10, c1);
  }
}
function crSecKill(f, c, u, t, e) { // animation de kill (repère centré sur la victime)
  if (u < .14) { g.globalAlpha = .35 * (1 - u / .14); g.fillStyle = c[2]; g.fillRect(-W, -H, W * 2, H * 2) }
  g.lineCap = 'round';
  if (f == 'void') { // aspiration → trou noir → explosion
    if (u < .45) for (let i = 0; i < 26; i++) { const a = crRnd(i) * 6.283, d = (60 + crRnd(i + 3) * 140) * (1 - u / .45); g.globalAlpha = .9; g.fillStyle = i % 2 ? c[1] : c[2]; g.fillRect(Math.cos(a) * d - 2, Math.sin(a) * d - 2, 4, 4) }
    const v = u < .45 ? 0 : (u - .45) / .55, rad = u < .45 ? 6 + u / .45 * 28 : 34 * (1 - v); g.globalAlpha = 1; g.fillStyle = 'rgba(4,0,12,.95)'; g.beginPath(); g.arc(0, 0, rad, 0, 7); g.fill(); g.strokeStyle = c[2]; g.lineWidth = 2; g.stroke();
    if (v > 0) { g.globalAlpha = 1 - v; g.strokeStyle = c[1]; g.lineWidth = 5 * (1 - v) + 1; g.beginPath(); g.arc(0, 0, v * 190, 0, 7); g.stroke(); for (let i = 0; i < 16; i++) { const a = i * .3927 + crRnd(i) * .2, d = v * (80 + crRnd(i + 4) * 130); crShape('star', Math.cos(a) * d, Math.sin(a) * d, 6 * (1 - v), c[2], 1 - v, a) } }
  } else if (f == 'sun') { // phénix : deux ailes de flammes, pilier de feu, braises
    for (const q of [-1, 1]) for (let j = 0; j < 7; j++) { const a = -.3 - j * .26, d = (26 + j * 9) * (.5 + e); crShape('flame', q * Math.cos(a) * d, Math.sin(a) * d - u * 70, 12 * (1 - u * .5), j % 2 ? c[2] : c[1], 1 - u, q * (.6 + j * .12)) }
    for (let i = 0; i < 9; i++) crShape('flame', (i - 4) * 12, -u * 170 - (i % 3) * 22, 17 * (1 - u * .5), i % 2 ? c[2] : c[1], 1 - u, 0);
    for (let i = 0; i < 22; i++) { g.globalAlpha = 1 - u; g.fillStyle = c[2]; g.beginPath(); g.arc((crRnd(i) - .5) * 120 + Math.sin(t * 4 + i) * 8, -u * (50 + crRnd(i + 3) * 150), 2.2 * (1 - u) + .5, 0, 7); g.fill() }
  } else if (f == 'ice') { // gel puis éclatement en cristaux
    if (u < .3) { g.globalAlpha = 1; g.fillStyle = 'rgba(180,240,255,.55)'; g.fillRect(-22, -22, 44, 44); g.strokeStyle = c[2]; g.lineWidth = 3; g.strokeRect(-22, -22, 44, 44); g.lineWidth = 1.5; g.beginPath(); g.moveTo(-22, -22); g.lineTo(22 * (u / .3), 22 * (u / .3)); g.moveTo(22, -22); g.lineTo(-22 * (u / .3), 22 * (u / .3)); g.stroke() }
    else { const v = (u - .3) / .7; for (let i = 0; i < 16; i++) { const a = i * .3927 + crRnd(i) * .3, d = v * (70 + crRnd(i + 2) * 120); g.save(); g.translate(Math.cos(a) * d, Math.sin(a) * d + v * v * 90); g.rotate(a + t * 4); g.globalAlpha = 1 - v; g.fillStyle = i % 2 ? c[2] : c[1]; g.beginPath(); g.moveTo(0, -13); g.lineTo(5, 0); g.lineTo(0, 13); g.lineTo(-5, 0); g.closePath(); g.fill(); g.restore() }
      g.globalAlpha = 1 - v; g.strokeStyle = c[2]; g.lineWidth = 3 * (1 - v) + 1; g.beginPath(); g.arc(0, 0, v * 120, 0, 7); g.stroke() }
    for (let i = 0; i < 14; i++) crShape('snow', (crRnd(i) - .5) * 200, -80 + u * (150 + crRnd(i + 2) * 40), 5, c[2], 1 - u * .7, t * 3 + i)
  } else if (f == 'glitch') { // corruption : tranches, gros pixels, barres sur tout l'écran
    const sd = Math.floor(t * 30); for (let i = 0; i < 28; i++) { const sz = 6 + crRnd(i) * 16; g.globalAlpha = 1 - u; g.fillStyle = i % 3 == 0 ? c[1] : i % 3 == 1 ? c[2] : '#fff'; g.fillRect((crRnd(sd + i) - .5) * 260, (crRnd(sd + i + 9) - .5) * 170, sz, sz) }
    for (let i = 0; i < 4; i++) { g.globalAlpha = (1 - u) * .5; g.fillStyle = i % 2 ? c[1] : c[2]; g.fillRect(-W / 2, (crRnd(sd + i * 3) - .5) * 200, W, 2 + crRnd(sd + i) * 6) }
    g.globalAlpha = 1 - u; g.strokeStyle = '#fff'; g.lineWidth = 2; const z = 26 * (1 - u); g.strokeRect(-z, -z, z * 2, z * 2);
  } else if (f == 'aurora') { // 4 rubans en spirale + étoiles qui montent
    for (let k = 0; k < 4; k++) { g.globalAlpha = 1 - u; g.strokeStyle = crMix(c[1], c[2], k / 3); g.lineWidth = 4 * (1 - u) + 1; g.beginPath(); for (let j = 0; j <= 28; j++) g.lineTo(Math.sin(j * .35 + t * 4 + k * 1.6) * (14 + j * 2.2), -j * 7 * (.4 + u) + 10); g.stroke() }
    for (let i = 0; i < 18; i++) crShape('star', (crRnd(i) - .5) * 140 + Math.sin(t * 3 + i) * 14, -u * (60 + crRnd(i + 3) * 150), 5 * (1 - u * .5), i % 2 ? c[1] : c[2], 1 - u, t * 3 + i)
  } else { // éclipse : disque noir, couronne dorée qui explose, rayons, couronne royale
    g.globalAlpha = 1 - u; g.fillStyle = '#05030a'; g.beginPath(); g.arc(0, 0, 28 * (1 - u * .3), 0, 7); g.fill(); g.strokeStyle = c[1]; g.lineWidth = 6 * (1 - u) + 1; g.beginPath(); g.arc(0, 0, 30 + e * 120, 0, 7); g.stroke();
    for (let i = 0; i < 24; i++) { const a = i * .2618 + t * .6; g.strokeStyle = i % 2 ? c[2] : c[1]; g.lineWidth = 2; g.beginPath(); g.moveTo(Math.cos(a) * 34, Math.sin(a) * 34); g.lineTo(Math.cos(a) * (34 + e * (60 + (i % 3) * 40)), Math.sin(a) * (34 + e * (60 + (i % 3) * 40))); g.stroke() }
    g.globalAlpha = 1 - u * .6; crCrown(0, u < .35 ? -140 + Math.pow(u / .35, 2) * 110 : -30 - (u - .35) * 70, 16, c[1]);
  }
}
function crCrown(x, y, z, col) { g.fillStyle = col; g.beginPath(); g.moveTo(x - z, y + z * .6); g.lineTo(x - z, y - z * .3); g.lineTo(x - z * .5, y + z * .1); g.lineTo(x, y - z * .6); g.lineTo(x + z * .5, y + z * .1); g.lineTo(x + z, y - z * .3); g.lineTo(x + z, y + z * .6); g.closePath(); g.fill(); g.fillStyle = '#fff6c4'; g.fillRect(x - z, y + z * .35, z * 2, z * .25) }
function crWpnFx(s, it) { // arme : liseré lumineux sur le canon (repère tourné)
  if (s.ml || s.cr) return; const th = CRTH[it.th], r = s.r, L = s.L || 22, t = tt, k = it.r, x1 = r + L; g.save(); g.lineCap = 'round';
  const c1 = it.th == 13 ? 'hsl(' + ((t * 200) % 360) + ',100%,65%)' : it.r == 5 ? crSecC(it, 0) : th[1];
  g.strokeStyle = c1; g.lineWidth = k ? 4 : 3; g.beginPath(); g.moveTo(r + 4, 0); g.lineTo(x1, 0); g.stroke();
  g.strokeStyle = th[2]; g.lineWidth = 1.4; g.beginPath(); g.moveTo(r + 4, 0); g.lineTo(x1, 0); g.stroke();
  if (k >= 1) { g.fillStyle = th[2]; g.globalAlpha = g.globalAlpha * (.4 + .4 * Math.sin(t * 6)); g.beginPath(); g.arc(x1, 0, 3 + k, 0, 7); g.fill() }
  if (k >= 2) { g.globalAlpha = 1; g.fillStyle = '#fff'; g.beginPath(); g.arc(r + 4 + ((t * 1.5) % 1) * (L - 4), 0, 1.8, 0, 7); g.fill() }
  if (k >= 5) crSecMuz(it, x1);
  if (k >= 3) { g.translate(x1, 0); crParts(th[3], th, r * .5, t, 4) }
  g.restore();
}

// ---------- Balles ----------
function crOwnerItem(own, t) { if (own === myPeer || own === 'me') return crGet(crCx(), t); const o = R[own]; return o ? crGet(o.cx, t) : null }
function crBulAt(it, x, y, vx, vy) {
  const th = CRTH[it.th], k = it.r, t = tt, l = Math.hypot(vx, vy) || 1, ux = vx / l, uy = vy / l; g.save(); g.lineCap = 'round';
  if (k == 5) { crSecBul(it, x, y, ux, uy); g.restore(); return }
  const col = it.th == 13 ? 'hsl(' + ((t * 300) % 360) + ',100%,65%)' : it.r == 5 ? crSecC(it, x * .02) : th[1];
  if (k >= 1) { g.strokeStyle = col; g.globalAlpha = .5; g.lineWidth = 2 + k; g.beginPath(); g.moveTo(x, y); g.lineTo(x - ux * (10 + k * 7), y - uy * (10 + k * 7)); g.stroke(); g.globalAlpha = 1 }
  if (k >= 2) { g.shadowColor = th[1]; g.shadowBlur = 10 }
  g.fillStyle = col; g.beginPath(); g.arc(x, y, 3 + (k >= 3 ? 1.5 : 0), 0, 7); g.fill(); g.shadowBlur = 0; g.fillStyle = th[2]; g.beginPath(); g.arc(x, y, 1.6, 0, 7); g.fill();
  if (k >= 5) { g.strokeStyle = th[2]; g.lineWidth = 1.5; g.globalAlpha = .8; g.beginPath(); g.arc(x, y, 6 + Math.sin(t * 20) * 1.5, 0, 7); g.stroke(); g.globalAlpha = 1 }
  if (k >= 3) for (let j = 1; j <= 4; j++) { const d = j * 9, wob = Math.sin(t * 20 + j * 2 + x * .05) * 3; crShape(th[3] == 'bolt' ? 'spark' : th[3], x - ux * d - uy * wob, y - uy * d + ux * wob, 3.5 - j * .4, j % 2 ? th[2] : th[1], 1 - j * .2, t * 4 + j) }
  g.restore();
}
function crBul(b) { if (b.gr || b.rk || b.lz || b.gd || b.sn) return 0; const it = crOwnerItem(b.own, 'w'); if (!it) return 0; crBulAt(it, b.x - cam.x, b.y - cam.y, b.vx, b.vy); return 1 }

// ---------- Effets de pouvoir ----------
function crPfx(it, x, y, t, dur) {
  const th = CRTH[it.th], u = Math.min(1, t / dur), k = it.r; g.save(); g.translate(x, y);
  if (k == 5) { crSecPfx(it, t, dur, u); g.restore(); return }
  const rc = i => it.th == 13 ? 'hsl(' + ((t * 260 + i * 80) % 360) + ',100%,65%)' : it.r == 5 ? crSecC(it, i) : i % 2 ? th[2] : th[1];
  const nR = k == 0 ? 1 : k < 3 ? 2 : 3;
  for (let i = 0; i < nR; i++) { const uu = Math.max(0, u - i * .12); g.globalAlpha = (1 - uu) * .9; g.strokeStyle = rc(i); g.lineWidth = (k >= 2 ? 5 : 3) * (1 - uu) + 1; g.beginPath(); g.arc(0, 0, 22 + uu * (60 + k * 12), 0, 7); g.stroke() }
  if (k >= 1) { g.globalAlpha = .4 * (1 - u); g.fillStyle = th[1]; g.beginPath(); g.arc(0, 0, 20 + u * 30, 0, 7); g.fill() }
  if (k >= 2) for (let i = 0; i < 4 + k; i++) { const a = t * 4 + i * 6.283 / (4 + k), d = 36 + k * 4 + Math.sin(t * 5 + i) * 4; g.globalAlpha = 1; crShape('star', Math.cos(a) * d, Math.sin(a) * d, 4 + k, th[2], 1 - u * .7, t * 3) }
  if (k >= 3) { g.globalAlpha = 1 - u * .5; crParts(th[3], th, 20, t * 1.4, 10) }
  if (k == 4) {
    if (it.th == 12) { const gr = g.createLinearGradient(0, -150, 0, 10); gr.addColorStop(0, 'rgba(255,230,120,0)'); gr.addColorStop(1, 'rgba(255,230,120,.7)'); g.globalAlpha = 1 - u; g.fillStyle = gr; g.fillRect(-18, -150, 36, 160); g.globalAlpha = 1 - u * .5; crCrown(0, -34 - u * 26, 10, '#ffd24a') }
    else for (let i = 0; i < 12; i++) { const a = i * .5236 + t * 2, d = 20 + u * 90; g.globalAlpha = 1 - u; g.strokeStyle = 'hsl(' + ((t * 300 + i * 30) % 360) + ',100%,65%)'; g.lineWidth = 2; g.beginPath(); g.moveTo(Math.cos(a) * d * .4, Math.sin(a) * d * .4); g.lineTo(Math.cos(a) * d, Math.sin(a) * d); g.stroke() }
  }
  g.restore();
}
function crPos(own) { if (own === myPeer || own === 'me') return me; return R[own] || null }
function crPowFx(own, x, y, it) { if (!it) return; PFX.push({ own, it, t: 0, dur: .9 + .15 * it.r, x, y }); if (PFX.length > 16) PFX.shift() }
function crPfxRecv(d, from) { const o = R[from], it = o && crGet(o.cx, 'p'); if (it) crPowFx(from, +d.x || o.x, +d.y || o.y, it) }

// ---------- Animations de kill ----------
const CRKD = { conf: 1.8, soul: 2.2, bolt: .7, stars: 1.3, pixel: 1, petal: 2.4, crown: 2.1, nova: 1.8, sec: 2.4 };
function crKfx(k, x, y, t, th) {
  const u = Math.min(1, t / CRKD[k]); g.save(); g.translate(x, y); g.lineCap = 'round';
  if (k == 'conf') { for (let i = 0; i < 36; i++) { const a = crRnd(i) * 6.283, sp = 70 + crRnd(i + 9) * 210; g.save(); g.translate(Math.cos(a) * sp * u, Math.sin(a) * sp * u * .7 + 260 * u * u - 60 * u); g.rotate(t * 9 + i); g.globalAlpha = 1 - u * u; g.fillStyle = 'hsl(' + (i * 37 % 360) + ',90%,60%)'; g.fillRect(-4, -2, 8, 4); g.restore() } }
  else if (k == 'soul') {
    const gy = -u * 120, gx = Math.sin(t * 6) * 8; g.globalAlpha = (1 - u) * .85; g.fillStyle = '#eaf6ff'; g.beginPath(); g.arc(gx, gy - 8, 14, Math.PI, 0); g.lineTo(gx + 14, gy + 14);
    for (let i = 0; i < 4; i++) g.lineTo(gx + 14 - (i + .5) * 7, gy + (i % 2 ? 14 : 20)); g.lineTo(gx - 14, gy + 14); g.closePath(); g.fill();
    g.fillStyle = '#223'; g.beginPath(); g.arc(gx - 5, gy - 8, 2.5, 0, 7); g.arc(gx + 5, gy - 8, 2.5, 0, 7); g.fill(); g.beginPath(); g.ellipse(gx, gy, 3, 4, 0, 0, 7); g.fill();
    g.fillStyle = '#cfe8ff'; for (let i = 0; i < 5; i++) { g.globalAlpha = (1 - u) * .35; g.beginPath(); g.arc(gx + Math.sin(t * 5 + i * 2) * 10, gy + 24 + i * 9, 5 - i * .7, 0, 7); g.fill() }
  }
  else if (k == 'bolt') {
    if (u < .25) { g.globalAlpha = .3 * (1 - u * 4); g.fillStyle = '#fff'; g.fillRect(-W, -H, W * 2, H * 2) }
    const sd = Math.floor(t * 30); g.beginPath(); g.moveTo(0, -420); for (let j = 1; j <= 8; j++) g.lineTo(j < 8 ? (crRnd(sd + j) - .5) * 60 : 0, -420 + j * 52.5);
    g.globalAlpha = 1 - u * .8; g.strokeStyle = 'rgba(120,200,255,.6)'; g.lineWidth = 12; g.stroke(); g.strokeStyle = '#fff'; g.lineWidth = 3; g.stroke();
    g.globalAlpha = 1 - u; g.strokeStyle = '#9fd8ff'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 10 + u * 90, 0, 7); g.stroke();
  }
  else if (k == 'stars') { for (let i = 0; i < 14; i++) { const a = i * .449 + crRnd(i) * .3, dd = (1 - (1 - u) * (1 - u)) * (120 + crRnd(i + 3) * 80), sx = Math.cos(a) * dd, sy = Math.sin(a) * dd;
    g.globalAlpha = 1 - u; g.strokeStyle = '#ffe58a'; g.lineWidth = 2; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx - Math.cos(a) * 30 * (1 - u), sy - Math.sin(a) * 30 * (1 - u)); g.stroke(); crShape('star', sx, sy, 6 * (1 - u * .6), '#fff3b0', 1 - u, t * 5) } }
  else if (k == 'pixel') { const c = th ? [CRTH[th][1], CRTH[th][2]] : ['#ffffff', '#ffd23a']; for (let i = 0; i < 30; i++) { const a = crRnd(i) * 6.283, dd = u * (40 + crRnd(i + 5) * 110), sz = (1 - u) * 9 + 1;
    g.globalAlpha = 1 - u; g.fillStyle = c[i % 2]; g.fillRect(Math.round(Math.cos(a) * dd / 6) * 6 - sz / 2, Math.round(Math.sin(a) * dd / 6) * 6 - sz / 2, sz, sz) } }
  else if (k == 'petal') { for (let i = 0; i < 26; i++) { const py = -150 + u * (220 + crRnd(i + 2) * 40) + crRnd(i + 7) * 30, px = (crRnd(i) - .5) * 200 + Math.sin(t * 3 + i) * 24;
    crShape('petal', px, py, 6 + crRnd(i + 8) * 3, i % 2 ? '#ff9ec4' : '#ffd3e4', u < .85 ? 1 : (1 - u) / .15, t * 3 + i) } }
  else if (k == 'crown') {
    if (u < .3) { const cy = -150 + Math.pow(u / .3, 2) * 140; crCrown(0, cy, 22, '#ffd24a') }
    else {
      const v = (u - .3) / .7; g.globalAlpha = 1 - v; g.strokeStyle = '#ffe58a'; g.lineWidth = 4 * (1 - v) + 1; g.beginPath(); g.arc(0, 0, v * 110, 0, 7); g.stroke();
      if (v < .25) crCrown(0, -10, 22 * (1 + v), '#ffd24a');
      for (let i = 0; i < 12; i++) { const a = i * .5236 + crRnd(i) * .3; crShape('flame', Math.cos(a) * v * 130, Math.sin(a) * v * 130 - 20 * v, 8 * (1 - v * .5), i % 2 ? '#ffd24a' : '#fff3b0', 1 - v, a + v * 6) }
    }
  }
  else if (k == 'nova') {
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, 20 + 60 * (1 - u)); gr.addColorStop(0, '#fff'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.globalAlpha = 1 - u; g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 80, 0, 7); g.fill();
    for (let i = 0; i < 4; i++) { const r = u * (140 + i * 40) - i * 10; if (r > 0) { g.globalAlpha = 1 - u; g.strokeStyle = 'hsl(' + ((t * 300 + i * 70) % 360) + ',100%,65%)'; g.lineWidth = 4 * (1 - u) + 1; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke() } }
    for (let i = 0; i < 18; i++) { const a = i * .349 + t; g.globalAlpha = 1 - u; g.strokeStyle = 'hsl(' + ((i * 20 + t * 200) % 360) + ',100%,70%)'; g.lineWidth = 2; g.beginPath(); g.moveTo(Math.cos(a) * u * 60, Math.sin(a) * u * 60); g.lineTo(Math.cos(a) * u * 190, Math.sin(a) * u * 190); g.stroke() }
  }
  else if (k == 'sec') crSecKill((CRTH[th] && th >= 14 ? CRTH[th] : CRTH[14])[3], CRTH[th] && th >= 14 ? CRTH[th] : CRTH[14], u, t, 1 - (1 - u) * (1 - u));
  g.restore();
}
function crKillAt(by, x, y) {
  by = String(by); const cx = (by === myPeer || by === 'me') ? crCx() : (R[by] ? R[by].cx : ''), it = crGet(cx, 'k'); if (!it) return;
  const bi = crGet(cx, 'b'); KFX.push({ k: it.k, x, y, t: 0, th: bi ? bi.th : it.th }); if (KFX.length > 12) KFX.shift();
}
function crKillEv(by, v) { const p = (v === myPeer || v === 'me') ? me : R[v]; if (p) crKillAt(by, p.x, p.y) }
function crFxDraw() {
  const now = performance.now(), dt = Math.min(.05, (now - (crLast || now)) / 1000); crLast = now; if (!KFX.length && !PFX.length) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
  for (const f of PFX) { f.t += dt; const p = crPos(f.own); if (p) { f.x = p.x; f.y = p.y } crPfx(f.it, f.x - cam.x, f.y - cam.y, f.t, f.dur) }
  PFX = PFX.filter(f => f.t < f.dur);
  for (const f of KFX) { f.t += dt; crKfx(f.k, f.x - cam.x, f.y - cam.y, f.t, f.th) }
  KFX = KFX.filter(f => f.t < CRKD[f.k]); g.restore();
}

// ---------- Aperçus (boutique / personnalisation) ----------
function crPrev(it, x, y, sc) {
  const S = { r: 17, L: 22 }, t = tt; g.save(); g.translate(x, y); g.scale(sc, sc);
  const body = fill => { g.fillStyle = fill; g.beginPath(); g.arc(0, 0, S.r, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 3; g.stroke(); g.fillStyle = '#111'; g.beginPath(); g.arc(6, -6, 2.4, 0, 7); g.arc(6, 6, 2.4, 0, 7); g.fill() };
  const gun = () => { g.fillStyle = '#3a4050'; g.fillRect(S.r - 2, -3, S.L + 2, 6) };
  if (it.t == 'b') { gun(); body(crFill(it, S.r)); crBodyFx(S, it); crUp(S, it) }
  else if (it.t == 'w') { gun(); body('#5a6478'); crWpnFx(S, it); const o = (t * 120) % 80; crBulAt(it, S.r + S.L + 6 + o, 0, 600, 0); crBulAt(it, S.r + S.L + 6 + (o + 40) % 80, 0, 600, 0) }
  else if (it.t == 'p') { gun(); body('#5a6478'); const d = .9 + .15 * it.r, tm = t % (d + .5); if (tm < d) { g.scale(.6, .6); crPfx(it, 0, 0, tm, d) } }
  else if (it.t == 's') { const V = it.v; gun(); body(crFill(V.b, S.r)); crWpnFx(S, V.w); crBodyFx(S, V.b); crUp(S, V.b); const o = (t * 120) % 80; crBulAt(V.w, S.r + S.L + 6 + o, 0, 600, 0); crBulAt(V.w, S.r + S.L + 6 + (o + 40) % 80, 0, 600, 0); const d = 1.65, tm = t % (d + .7); if (tm < d) { g.scale(.6, .6); crPfx(V.p, 0, 0, tm, d) } }
  else { g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.arc(0, 0, 15, 0, 7); g.fill(); const d = CRKD[it.k], tm = t % (d + .6); if (tm < d) { g.scale(.45, .45); crKfx(it.k, 0, 0, tm, it.th) } }
  g.restore();
}

// ---------- Interface ----------
const crTabR = i => ({ x: 150 + i * 240, y: 12, w: 232, h: 36 });
const crCardR = i => ({ x: 12 + i * 156, y: 64, w: 150, h: 404 });
const crBuyR = i => { const c = crCardR(i); return { x: c.x + 10, y: c.y + c.h - 52, w: c.w - 20, h: 42 } };
const crSlotR = i => ({ x: 24 + i * 136, y: 58, w: 130, h: 34 });
const crCellR = k => ({ x: 300 + (k % 4) * 160, y: 100 + Math.floor(k / 4) * 78, w: 154, h: 72 });
const crOkR = { x: 500, y: 450, w: 170, h: 48 }, crEqR = { x: 290, y: 450, w: 170, h: 48 };
const crList = () => CAT.filter(it => it.t == 'bwpks'[crTab]);
function crBtn(p, txt, col, on) { const h = inB(p, M.x, M.y) && on !== false; g.fillStyle = on === false ? '#171c27' : h ? '#2b3a58' : '#1d2740'; g.fillRect(p.x, p.y, p.w, p.h); g.strokeStyle = on === false ? '#444c5e' : h ? '#fff' : col; g.lineWidth = 2; g.strokeRect(p.x, p.y, p.w, p.h); g.fillStyle = on === false ? '#7b8499' : '#f0e6d0'; g.textAlign = 'center'; g.font = 'bold ' + (txt.length > 19 ? 11 : txt.length > 13 ? 12 : 15) + 'px' + F2; g.fillText(txt, p.x + p.w / 2, p.y + p.h / 2 + 5) }
function crChest(x, y, sc, c1, c2, open, glow) {
  g.save(); g.translate(x, y); g.scale(sc, sc);
  if (glow > 0) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = Math.min(1, glow); const gr = g.createRadialGradient(0, 0, 8, 0, 0, 100); gr.addColorStop(0, c2); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 100, 0, 7); g.fill(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1 }
  g.fillStyle = crMix(c1, '#000000', .38); g.fillRect(-40, 0, 80, 42); g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 2; g.strokeRect(-40, 0, 80, 42);
  g.fillStyle = c2; g.globalAlpha = .75; g.fillRect(-30, 0, 8, 42); g.fillRect(22, 0, 8, 42); g.globalAlpha = 1;
  if (open > 0) { g.fillStyle = '#fff'; g.globalAlpha = Math.min(1, open * 1.3); g.fillRect(-36, -4, 72, 8); g.globalAlpha = 1 }
  g.save(); g.translate(-40, 0); g.rotate(-open * 1.15); g.fillStyle = c1; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(40, -52, 80, 0); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = c2; g.globalAlpha = .75; g.beginPath(); g.moveTo(10, -3); g.quadraticCurveTo(14, -22, 18, -17); g.lineTo(26, -2); g.fill(); g.beginPath(); g.moveTo(54, -2); g.lineTo(62, -17); g.quadraticCurveTo(66, -22, 70, -3); g.fill(); g.globalAlpha = 1; g.restore();
  g.fillStyle = '#ffd24a'; g.fillRect(-7, -4, 14, 16); g.strokeStyle = 'rgba(0,0,0,.6)'; g.strokeRect(-7, -4, 14, 16);
  g.restore();
}
function crRays(x, y, col, n, t, len) { g.save(); g.translate(x, y); g.rotate(t * .4); g.globalAlpha = .22; g.fillStyle = col; for (let i = 0; i < n; i++) { g.rotate(6.283 / n); g.beginPath(); g.moveTo(0, 0); g.lineTo(len, -len * .07); g.lineTo(len, len * .07); g.fill() } g.restore() }
function crShop() {
  g.textAlign = 'center'; g.fillStyle = '#ffd98a'; g.font = 'bold 15px' + F2;
  const pr = crProg(), lock = pr[0] < pr[1];
  CRC.forEach((C, i) => {
    const p = crCardR(i), hv = inB(p, M.x, M.y), top = !!C.top, sec = !!C.secret, n = SV.ci[i] | 0, t = tt, cx = p.x + p.w / 2;
    g.fillStyle = sec ? '#0e0a1a' : '#121826'; g.fillRect(p.x, p.y, p.w, p.h); g.strokeStyle = sec ? 'hsl(' + ((t * 160) % 360) + ',90%,62%)' : top ? (i == 4 ? 'hsl(' + ((t * 120) % 360) + ',90%,65%)' : '#ffd24a') : C.c1; g.lineWidth = hv ? 4 : 2; g.strokeRect(p.x, p.y, p.w, p.h);
    crChest(cx, p.y + 84, 1.15, C.c1, C.c2, 0, .35 + .25 * Math.sin(t * 2 + i) + i * .06);
    if (i >= 1) for (let j = 0; j < i * 2; j++) { const a = t * (1 + i * .3) + j * 6.283 / (i * 2); crShape('star', cx + Math.cos(a) * 62, p.y + 80 + Math.sin(a) * 40, 3 + i * .4, C.c2, .8, t * 3) }
    if (sec && lock) { g.fillStyle = 'rgba(5,7,11,.5)'; g.fillRect(p.x + 1, p.y + 1, p.w - 2, 150); g.textAlign = 'center'; g.font = '34px' + F2; g.fillStyle = '#fff'; g.fillText('🔒', cx, p.y + 98) }
    g.textAlign = 'center'; g.fillStyle = '#f0e6d0'; g.font = 'bold 16px' + F2; g.fillText(C.n, cx, p.y + 160);
    g.font = '11px' + F2; g.fillStyle = '#9aa7bd'; g.fillText(C.d, cx, p.y + 180);
    let y = p.y + 204; g.textAlign = 'left'; g.font = '12px' + F2;
    C.w.forEach((w, r) => { if (!w) return; g.fillStyle = CRT[r].c; g.fillText(CRT[r].n, p.x + 12, y); g.textAlign = 'right'; g.fillText(w + ' %', p.x + p.w - 12, y); g.textAlign = 'left'; y += 18 });
    g.fillStyle = '#9aa7bd'; g.font = '11px' + F2;
    if (sec) {
      g.textAlign = 'center'; g.fillStyle = lock ? '#ff9ab0' : '#7dff9a'; g.font = 'bold 12px' + F2; g.fillText(lock ? 'Collection ' + pr[0] + ' / ' + pr[1] : '✔ Débloquée !', cx, y);
      g.fillStyle = '#232a3a'; g.fillRect(p.x + 14, y + 8, p.w - 28, 8); g.fillStyle = lock ? '#ff3d8b' : '#3fcf5a'; g.fillRect(p.x + 14, y + 8, (p.w - 28) * pr[0] / pr[1], 8);
      g.fillStyle = '#9aa7bd'; g.font = '11px' + F2; g.fillText('Set complet animé :', cx, y + 38); g.fillText('perso + arme + pouvoir', cx, y + 53); g.fillText('+ animation de kill', cx, y + 68); g.fillText(lock ? 'Obtiens tous les skins' : 'Aucun doublon garanti', cx, y + 88); if (lock) g.fillText('pour la débloquer', cx, y + 102);
    } else if (top) { g.fillText('Skins exclusifs', p.x + 12, y + 6); g.fillText('+ animations de kill', p.x + 12, y + 20) } else g.fillText('Perso · Arme · Pouvoir', p.x + 12, y + 6);
    if (n > 0) crBtn(crBuyR(i), 'Ouvrir (x' + n + ')', '#ffd24a');
    else if (sec) crBtn(crBuyR(i), lock ? '🔒 Collection ' + pr[0] + '/' + pr[1] : 'Acheter — ' + C.p + ' ●', '#ff3d8b', !lock && SV.coins >= C.p);
    else if (top) crBtn(crBuyR(i), '🔒 ' + C.d, '#ffd24a', false);
    else crBtn(crBuyR(i), 'Acheter — ' + C.p + ' ●', '#7ad0ff', SV.coins >= C.p);
  });
  g.textAlign = 'center'; g.fillStyle = '#9aa7bd'; g.font = '13px' + F2;
  g.fillText('Fais Top 1 (3 kills minimum) en Classique → Caisse Champion · Top 1 en Classé → Caisse Radiant. Doublon = pièces rendues.', W / 2, 496);
  g.fillText('Équipe tes objets dans l\'onglet Personnalisation.  Objets possédés : ' + SV.cw.length + ' / ' + CAT.length + '  ·  Caisse Secrète : obtiens tous les skins pour la débloquer.', W / 2, 518);
}
// Onglet Personnalisation : un mannequin à gauche (montre les objets équipés) + liste compacte des objets à droite (sans images de personnages)
const crPanR = { x: 24, y: 100, w: 262, h: 392 };
function crDummy() {
  const P = crPanR, t = tt, S = { r: 17, L: 22 }, sc = 2.3, cx = P.x + 114, cy = P.y + 124 + Math.sin(t * 2) * 2.5;
  let cb = SV.cq.b >= 0 ? CAT[SV.cq.b] : null, cw = SV.cq.w >= 0 ? CAT[SV.cq.w] : null, cp = SV.cq.p >= 0 ? CAT[SV.cq.p] : null, ck = SV.cq.k >= 0 ? CAT[SV.cq.k] : null;
  const cs = SV.cq.s >= 0 ? CAT[SV.cq.s] : null; if (cs) { cb = cs.v.b; cw = cs.v.w; cp = cs.v.p; ck = cs.v.k }
  const sk = SKINS[SV.skin] || SKINS[0];
  g.save(); g.fillStyle = '#0e1320'; g.fillRect(P.x, P.y, P.w, P.h);
  const bg = g.createRadialGradient(cx, cy, 10, cx, cy, 210); bg.addColorStop(0, 'rgba(100,120,190,.30)'); bg.addColorStop(1, 'rgba(100,120,190,0)'); g.fillStyle = bg; g.fillRect(P.x, P.y, P.w, P.h);
  g.strokeStyle = '#3a4560'; g.lineWidth = 2; g.strokeRect(P.x, P.y, P.w, P.h);
  g.beginPath(); g.rect(P.x + 1, P.y + 1, P.w - 2, P.h - 2); g.clip();
  g.textAlign = 'center'; g.fillStyle = '#c5cfe0'; g.font = 'bold 14px' + F2; g.fillText('Aperçu — mannequin', P.x + P.w / 2, P.y + 22);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(cx + 4, P.y + 124 + 52, 52, 11, 0, 0, 7); g.fill();
  g.save(); g.translate(cx, cy); g.scale(sc, sc);
  g.fillStyle = '#1b1f2a'; g.fillRect(S.r - 4, -3.5, S.L, 7);
  if (cw) crWpnFx(S, cw);
  g.fillStyle = cb ? crFill(cb, S.r) : (sk.c || '#5a6478'); g.beginPath(); g.arc(0, 0, S.r, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 3; g.stroke();
  g.fillStyle = '#111'; g.beginPath(); g.arc(S.r * .35, -S.r * .35, 2.4, 0, 7); g.arc(S.r * .35, S.r * .35, 2.4, 0, 7); g.fill();
  if (cb) crBodyFx(S, cb); else if (sk.rk) { if (sk.an) radFx(S); else rkFx(S, SV.skin) }
  if (cb) crUp(S, cb);
  if (cw) { const o = (t * 90) % 36; for (const q of [o, (o + 18) % 36]) crBulAt(cw, S.r + S.L + 4 + q, 0, 600, 0) }
  g.restore();
  if (cp) { const d = .9 + .15 * cp.r, tm = t % (d + 1.3); if (tm < d) { g.save(); g.translate(cx, cy); g.scale(.75, .75); crPfx(cp, 0, 0, tm, d); g.restore() } }
  const tx = P.x + 208, ty = P.y + 248;
  g.fillStyle = 'rgba(255,255,255,.10)'; g.beginPath(); g.arc(tx, ty, 15, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.stroke();
  g.beginPath(); g.moveTo(tx - 7, ty - 5); g.lineTo(tx - 2, ty); g.moveTo(tx - 2, ty - 5); g.lineTo(tx - 7, ty); g.moveTo(tx + 2, ty - 5); g.lineTo(tx + 7, ty); g.moveTo(tx + 7, ty - 5); g.lineTo(tx + 2, ty); g.stroke();
  g.fillStyle = '#6d7690'; g.font = '10px' + F2; g.fillText('cible', tx, ty + 28);
  if (ck) { const dk = CRKD[ck.k], tm = t % (dk + 1.4); if (tm < dk) { g.save(); g.translate(tx, ty); g.scale(.7, .7); crKfx(ck.k, 0, 0, tm, ck.th); g.restore() } }
  const y0 = P.y + 298; g.strokeStyle = '#2c3446'; g.lineWidth = 1; g.beginPath(); g.moveTo(P.x + 12, y0 - 14); g.lineTo(P.x + P.w - 12, y0 - 14); g.stroke();
  [['Perso', cb], ['Arme', cw], ['Pouvoir', cp], ['Kill', ck]].forEach((r, i) => { const y = y0 + i * 20; g.textAlign = 'left'; g.fillStyle = '#8f9bb3'; g.font = '11px' + F2; g.fillText(r[0], P.x + 14, y);
    g.fillStyle = r[1] ? CRT[r[1].r].c : '#566077'; g.font = (r[1] ? 'bold ' : '') + '12px' + F2; g.fillText(r[1] ? r[1].n : '— aucun —', P.x + 74, y) });
  if (!cb && !cw && !cp && !ck) { g.textAlign = 'center'; g.fillStyle = '#6d7690'; g.font = '11px' + F2; g.fillText('Équipe un objet pour le voir ici', P.x + P.w / 2, P.y + P.h - 8) }
  g.restore();
}
function crPerso() {
  g.textAlign = 'center'; ['b', 'w', 'p', 'k', 's'].forEach((t, i) => { const p = crSlotR(i), on = crTab == i, n = SV.cw.filter(j => CAT[j].t == t).length, tot = CAT.filter(it => it.t == t).length;
    g.fillStyle = on ? '#2b3a58' : '#161d2a'; g.fillRect(p.x, p.y, p.w, p.h); g.strokeStyle = on ? '#fff' : inB(p, M.x, M.y) ? '#9ab' : '#556'; g.lineWidth = 2; g.strokeRect(p.x, p.y, p.w, p.h); g.fillStyle = '#f0e6d0'; g.font = 'bold 14px' + F2; g.fillText(t == 's' && !n && !crAll() ? '🔒 Secret' : CRTY[t] + '  ' + n + '/' + tot, p.x + p.w / 2, p.y + 22) });
  const cur = SV.cq['bwpks'[crTab]]; g.textAlign = 'right'; g.fillStyle = '#9aa7bd'; g.font = '13px' + F2; g.fillText('Équipé : ' + (cur >= 0 ? CAT[cur].n : 'rien'), W - 24, 80);
  crDummy();
  crList().forEach((it, k) => {
    const p = crCellR(k), own = SV.cw.includes(it.i), eq = SV.cq[it.t] == it.i, hv = inB(p, M.x, M.y) && own, rc = CRT[it.r].c, th = CRTH[it.th];
    g.fillStyle = eq ? '#1a2234' : '#121826'; g.fillRect(p.x, p.y, p.w, p.h); g.strokeStyle = eq ? '#ffd98a' : own ? rc : '#2c3446'; g.lineWidth = eq ? 4 : hv ? 3 : 2; g.strokeRect(p.x, p.y, p.w, p.h);
    const sx = p.x + 28, sy = p.y + 36;
    if (own) { const gr = g.createLinearGradient(sx - 18, sy - 18, sx + 18, sy + 18); if (it.th == 13) for (let i = 0; i < 4; i++) gr.addColorStop(i / 3, 'hsl(' + ((tt * 120 + i * 80) % 360) + ',95%,62%)'); else { gr.addColorStop(0, th[1]); gr.addColorStop(1, th[2]) } g.fillStyle = gr; g.beginPath(); g.arc(sx, sy, 18, 0, 7); g.fill(); g.strokeStyle = rc; g.lineWidth = 3; g.stroke() }
    else { g.fillStyle = '#1c2231'; g.beginPath(); g.arc(sx, sy, 18, 0, 7); g.fill(); g.strokeStyle = '#2c3446'; g.lineWidth = 2; g.stroke(); g.fillStyle = rc; g.globalAlpha = .6; g.font = 'bold 22px' + F2; g.textAlign = 'center'; g.fillText('?', sx, sy + 8); g.globalAlpha = 1 }
    for (let j = 0; j <= it.r; j++) { g.fillStyle = own ? rc : '#2c3446'; g.beginPath(); g.arc(sx - 12 + j * 6, p.y + 62, 2, 0, 7); g.fill() }
    const nm = own ? it.n : '???', sp = nm.indexOf(' '), l1 = sp > 0 ? nm.slice(0, sp) : nm, l2 = sp > 0 ? nm.slice(sp + 1) : '';
    g.textAlign = 'left'; g.fillStyle = own ? '#f0e6d0' : '#6d7690'; g.font = 'bold 12px' + F2; g.fillText(l1, p.x + 56, p.y + 22);
    if (l2) { g.font = '11px' + F2; g.fillStyle = own ? '#c5cfe0' : '#566077'; g.fillText(l2, p.x + 56, p.y + 38) }
    g.font = 'bold 10px' + F2; g.fillStyle = eq ? '#3fcf5a' : own ? '#9aa7bd' : rc; g.fillText(eq ? '✔ Équipé' : own ? 'Équiper' : CRT[it.r].n + (it.x ? ' · Top 1' : ''), p.x + 56, p.y + 62);
  });
  if (crTab == 4) { const pr = crProg(); g.textAlign = 'center'; g.fillStyle = pr[0] < pr[1] ? '#ff9ab0' : '#7dff9a'; g.font = 'bold 14px' + F2;
    g.fillText(pr[0] < pr[1] ? '🔒 Obtiens tous les skins (' + pr[0] + ' / ' + pr[1] + ') pour débloquer la Caisse Secrète' : '✔ Caisse Secrète débloquée — 1000 ● dans la boutique', 300 + 320, 300);
    g.font = '12px' + F2; g.fillStyle = '#9aa7bd'; g.fillText('Un skin secret remplace ton perso, ton arme, ton pouvoir et ton animation de kill.', 300 + 320, 322) }
  g.textAlign = 'center'; g.fillStyle = '#7b8499'; g.font = '12px' + F2; g.fillText('Clique un objet possédé pour l\'équiper — reclique pour le retirer.', 300 + 320, 512);
}
function crOpen() {
  const o = crOp, t = (performance.now() - o.t0) / 1000, C = CRC[o.ci], it = o.it, rc = CRT[it.r].c; g.fillStyle = 'rgba(3,5,9,.93)'; g.fillRect(0, 0, W, H);
  if (t < 2) {
    const a = Math.min(1, t / 1.5), shake = t < 1.5 ? Math.sin(t * 45) * a * .12 : 0, open = t < 1.5 ? 0 : Math.min(1, (t - 1.5) / .4);
    crRays(W / 2, 260, C.c2, 12, t, 380 * a); g.save(); g.translate(W / 2, 270); g.rotate(shake); g.translate(-W / 2, -270); crChest(W / 2, 270, 2.6, C.c1, C.c2, open, a); g.restore();
    g.textAlign = 'center'; g.fillStyle = '#c5cfe0'; g.font = 'bold 22px' + F2; g.fillText(C.n, W / 2, 80); g.font = '13px' + F2; g.fillStyle = '#7b8499'; g.fillText('Clique pour passer', W / 2, 508);
    if (t > 1.5) { g.fillStyle = '#fff'; g.globalAlpha = Math.min(1, (t - 1.5) / .5); g.fillRect(0, 0, W, H); g.globalAlpha = 1 }
    return;
  }
  const k = Math.min(1, (t - 2) / .35), e = 1 - Math.pow(1 - k, 3);
  crRays(W / 2, 220, rc, 10 + it.r * 3, t, 520); g.textAlign = 'center'; g.fillStyle = rc; g.font = 'bold 22px' + F2; g.fillText(CRT[it.r].n.toUpperCase() + ' — ' + CRTL[it.t], W / 2, 70);
  g.save(); g.beginPath(); g.rect(W / 2 - 230, 90, 460, 250); g.clip(); crPrev(it, W / 2, 215, (it.t == 'b' || it.t == 'w' || it.t == 's' ? 3.2 : 1.7) * e); g.restore();
  g.fillStyle = '#f0e6d0'; g.font = 'bold 34px' + F2; g.fillText(it.n, W / 2, 380);
  g.font = 'bold 18px' + F2; if (o.dup) { g.fillStyle = '#e9d9a8'; g.fillText('Doublon : +' + CRT[it.r].v + ' pièces', W / 2, 412) } else { g.fillStyle = '#7dff9a'; g.fillText('NOUVEAU !', W / 2, 412) }
  if (SV.cq[it.t] != it.i) crBtn(crEqR, 'Équiper', '#3fcf5a'); crBtn(crOkR, 'OK', '#7ad0ff');
  const n = (SV.ci[o.ci] | 0); if (n > 0) { g.fillStyle = '#9aa7bd'; g.font = '13px' + F2; g.fillText('Il te reste ' + n + ' ' + CRC[o.ci].n + ' à ouvrir', W / 2, 520) }
}
function crDraw() {
  crInit(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.fillStyle = 'rgba(5,7,11,.98)'; g.fillRect(0, 0, W, H);
  ['Boutique de caisses', 'Personnalisation'].forEach((tx, i) => { const p = crTabR(i), on = crS == i + 1; g.fillStyle = on ? '#2b3a58' : '#161d2a'; g.fillRect(p.x, p.y, p.w, p.h); g.strokeStyle = on ? '#fff' : inB(p, M.x, M.y) ? '#9ab' : '#556'; g.lineWidth = 2; g.strokeRect(p.x, p.y, p.w, p.h); g.textAlign = 'center'; g.fillStyle = '#f0e6d0'; g.font = 'bold 16px' + F2; g.fillText(tx, p.x + p.w / 2, p.y + 24) });
  g.textAlign = 'right'; g.fillStyle = '#e9d9a8'; g.font = 'bold 16px' + F2; g.fillText('● ' + SV.coins + ' pièces', W - 24, 36);
  if (crS == 1) crShop(); else crPerso(); if (crOp) crOpen();
}
function crClick() {
  crInit();
  if (crOp) { const t = (performance.now() - crOp.t0) / 1000; if (t < 2) { crOp.t0 = performance.now() - 2100; return }
    if (inB(crEqR, M.x, M.y) && SV.cq[crOp.it.t] != crOp.it.i) crEquip(crOp.it.i); crOp = null; return }
  for (let i = 0; i < 2; i++) if (inB(crTabR(i), M.x, M.y)) { crS = i + 1; return }
  if (crS == 1) { for (let i = 0; i < CRC.length; i++) if (inB(crBuyR(i), M.x, M.y)) crBuy(i) }
  else { for (let i = 0; i < 5; i++) if (inB(crSlotR(i), M.x, M.y)) crTab = i; crList().forEach((it, k) => { if (inB(crCellR(k), M.x, M.y) && SV.cw.includes(it.i)) crEquip(it.i) }) }
}
function crOpenScr(n) { bp = shop = st = 0; psk = 1; crS = n; crOp = null }
function crMenuClick() { return 0 } // plus de boutons sur le menu des modes : les caisses s'ouvrent depuis l'écran de choix (cases) ou avec C / V
function crBanner() {
  if (ph.n == 0) crWinInfo = null; if (ph.n != 1 || !crWinInfo || psk || st || shop || bp) return;
  g.setTransform(1, 0, 0, 1, 0, 0); g.textAlign = 'center'; g.fillStyle = '#ffd98a'; g.font = 'bold 18px' + F2; g.fillText('🏆 TOP 1 ! Tu gagnes une ' + CRC[crWinInfo.ci].n + ' — ouvre-la dans Caisses (C)', W / 2, 520);
}

// ---------- Branchements sur game.js ----------
{
  const _o0 = overlays0; overlays0 = function () { if (!psk) { crS = 0; crOp = null } if (psk && crS) { crDraw(); return } _o0(); crBanner() };
  const _d = draw; draw = function () { _d(); crFxDraw() };
  const _ua = useAb; useAb = function (s, dx, dy, l) { _ua(s, dx, dy, l); if (me.ab > 0) { const it = crGet(crCx(), 'p'); if (it) { crPowFx(myPeer || 'me', me.x, me.y, it); snd('pfx', { x: Math.round(me.x), y: Math.round(me.y) }) } } };
  const _ne = netEvent; netEvent = function (t, d, from) { d = d || {}; if (t == 'kill') crKillEv(d.by, String(d.vic || from)); else if (t == 'pfx') { crPfxRecv(d, from); return } _ne(t, d, from) };
  addEventListener('keydown', e => { if (e.ctrlKey || e.metaKey || e.altKey) return; if (e.code == 'KeyC' || e.code == 'KeyV') { const n = e.code == 'KeyC' ? 1 : 2; if (psk && crS == n) { psk = 0; crS = 0 } else crOpenScr(n) } });
}
crInit();
