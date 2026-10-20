// survivor.js — Mode SURVIVANT (lobby n°4).
// Chargé après game.js : utilise ses variables globales (g, SV, me, bots, WL, MW, MH, cam, tt, feed, ...).
//
// Principe : grande carte (3200×2400), des CAISSES en bois à casser (tirs, mêlée, explosions, pouvoirs…),
// des vagues d'ennemis de plus en plus dures. Chaque caisse cassée :
//   • fait monter le NIVEAU D'ARME (dégâts, cadence, projectiles en plus) ;
//   • débloque ton POUVOIR (verrouillé tant que SVPOW caisses ne sont pas cassées) ;
//   • peut lâcher un bonus (soin, vitesse, dégâts x2, régénération, bouclier).
// Coop sans PvP : les ennemis sont simulés chez chaque joueur (comme les bots), les autres joueurs de ce mode
// apparaissent sur ta carte mais ne peuvent pas te blesser.
//
// Réglages faciles ↓
const SVLV = [0, 3, 7, 12, 18];        // caisses cassées nécessaires pour les niveaux d'arme 1 → 5
const SVPOW = 4;                       // caisses à casser pour débloquer le pouvoir
const SVNCR = 70;                      // nombre de caisses présentes sur la carte
const SVDMG = [1, 1.25, 1.5, 1.8, 2.2];   // multiplicateur de dégâts par niveau
const SVCD = [1, 1, .85, .75, .62];       // multiplicateur de délai entre deux tirs par niveau
const SVPELS = [0, 0, 0, 1, 2];           // projectiles en plus par niveau
const SVACD = [1, 1, .9, .8, .7];         // multiplicateur de recharge du pouvoir par niveau
const SVEN = [ // types d'ennemis : w = vague d'apparition, rg = portée de tir (0 = corps à corps)
  { n: 'Rôdeur', hp: 28, sp: 105, r: 13, dm: 9, col: '#7a9a4a', rg: 0, w: 1 },
  { n: 'Coureur', hp: 16, sp: 185, r: 11, dm: 7, col: '#d9b04a', rg: 0, w: 2 },
  { n: 'Tireur', hp: 30, sp: 90, r: 13, dm: 9, col: '#c45a8a', rg: 340, w: 3 },
  { n: 'Brute', hp: 150, sp: 78, r: 20, dm: 22, col: '#8a4a3a', rg: 0, w: 4 },
  { n: 'Colosse', hp: 900, sp: 70, r: 30, dm: 35, col: '#6a2a8a', rg: 0, w: 99, boss: 1 }];

// ---------- Carte ----------
const SVI = (function () {
  let sd = 4242; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const MWs = 3200, MHs = 2400, cx = MWs / 2, cy = MHs / 2, w = [[0, 0, MWs, 24], [0, MHs - 24, MWs, 24], [0, 0, 24, MHs], [MWs - 24, 0, 24, MHs]];
  const clear = (x, y, ww, hh) => !(x < cx + 280 && x + ww > cx - 280 && y < cy + 280 && y + hh > cy - 280);
  w.push([cx - 190, cy - 190, 50, 50], [cx + 140, cy - 190, 50, 50], [cx - 190, cy + 140, 50, 50], [cx + 140, cy + 140, 50, 50]); // quelques abris autour du départ
  for (let i = 0; i < 70 && w.length < 60; i++) {
    const x = 140 + rnd() * (MWs - 480), y = 140 + rnd() * (MHs - 480), k = rnd();
    let parts;
    if (k < .35) { const a = 160 + rnd() * 140, b = 140 + rnd() * 140; parts = [[x, y, a, 36], [x, y, 36, b]]; }          // angle (ruine en L)
    else if (k < .6) { const a = 60 + rnd() * 60; parts = [[x, y, a, a]]; }                                              // pilier
    else if (k < .8) parts = [[x, y, 280 + rnd() * 220, 36]];                                                            // mur horizontal
    else parts = [[x, y, 36, 240 + rnd() * 200]];                                                                        // mur vertical
    if (parts.every((p) => clear(p[0], p[1], p[2], p[3]))) w.push(...parts);
  }
  const mud = [];
  for (let i = 0; i < 40 && mud.length < 14; i++) {
    const ww = 200 + rnd() * 160, hh = 120 + rnd() * 100, x = 150 + rnd() * (MWs - 500), y = 150 + rnd() * (MHs - 400);
    if (clear(x, y, ww, hh)) mud.push([x, y, ww, hh]);
  }
  MAPS.push({ n: 'Terres désolées', d: 'Immense carte : caisses à casser, vagues d\'ennemis', mw: MWs, mh: MHs, ev: 1, sv: 1,
    fl: '#29321f', gr: '#323d28', wa: '#5b6650', wt: '#8a9a76', dc: ['#4a6a3a', '#6a6a58'], w, mud });
  return MAPS.length - 1;
})();

// ---------- État de la partie ----------
const SVR = { on: 0, wave: 0, q: 0, wt: 0, sp: 0, ct: 0, k: 0, crates: 0, xp: 0, co: 0, nt: -9, ban: null, last: null, tail: 0 };
let SVP = []; // bonus au sol

const svLvl = () => { let l = 0; for (let i = 0; i < SVLV.length; i++) if (SVR.crates >= SVLV[i]) l = i; return l; };
const svActive = () => SV.mode == 3 && SVR.on;
function svDm() { return svActive() ? SVDMG[svLvl()] : 1; }
function svCd() { return svActive() ? SVCD[svLvl()] : 1; }
function svPel() { return svActive() ? SVPELS[svLvl()] : 0; }
function svAc() { return svActive() ? SVACD[svLvl()] : 1; }
function svCan(quiet) {
  if (!svActive() || SVR.crates >= SVPOW) return 1;
  if (!quiet && tt - SVR.nt > 1.5) { SVR.nt = tt; feed.push({ t: '🔒 Pouvoir verrouillé : casse ' + (SVPOW - SVR.crates) + ' caisse' + (SVPOW - SVR.crates > 1 ? 's' : '') + ' !', l: 2 }); }
  return 0;
}
function svInfo() {
  const L = SVR.last;
  return 'Survivant' + (L ? ' · dernière partie : vague ' + L.w + ', ' + L.k + ' ennemis, ' + L.c + ' caisses' : '') + ' · record : vague ' + (SV.sbest | 0);
}

// place libre (pas dans un mur ni dans la lave)
function svFree(x, y, r) {
  if (x < 60 || y < 60 || x > MW - 60 || y > MH - 60) return false;
  for (const q of WL) if (x > q[0] - r && x < q[0] + q[2] + r && y > q[1] - r && y < q[1] + q[3] + r) return false;
  return true;
}
function svRandPos(minD, maxD, r) { // autour du joueur (anneau) si maxD, sinon n'importe où à plus de minD
  for (let i = 0; i < 30; i++) {
    let x, y;
    if (maxD) { const a = Math.random() * 6.283, d = minD + Math.random() * (maxD - minD); x = me.x + Math.cos(a) * d; y = me.y + Math.sin(a) * d; }
    else { x = 80 + Math.random() * (MW - 160); y = 80 + Math.random() * (MH - 160); if (Math.hypot(x - me.x, y - me.y) < minD) continue; }
    if (svFree(x, y, r + 6)) return { x, y };
  }
  return null;
}
function svSpawnCrate(near) {
  const p = near ? svRandPos(250, 900, 24) : svRandPos(350, 0, 24); if (!p) return;
  for (const o of bots) if (o.cr && o.hp > 0 && Math.hypot(o.x - p.x, o.y - p.y) < 80) return;
  const gold = Math.random() < .14, hp = gold ? 60 : 30;
  bots.push({ sv: 1, cr: 1, gold, x: p.x, y: p.y, hp, mh: hp, a: 0, fl: 0, dt: 0, k: 0, d: 0, r: 19 });
}

// ---------- Début / fin ----------
function svStart() {
  Object.assign(SVR, { on: 1, wave: 0, q: 0, wt: 3, sp: 0, ct: 0, k: 0, crates: 0, xp: 0, co: 0, nt: -9, ban: null, tail: 0 });
  bots = []; SVP = []; Bu = []; DP = [];
  me.x = MW / 2; me.y = MH / 2 + 70; me.k = 0;
  for (let i = 0, t = 0; i < SVNCR && t < 600; t++) { const n = bots.length; svSpawnCrate(0); if (bots.length > n) i++; }
  SVR.ban = { t: 'SURVIVANT', c: '#8affb0', l: 2.6, m: 'Casse des caisses : arme plus forte + pouvoir !' };
  feed.push({ t: '💥 Casse ' + SVPOW + ' caisses : pouvoir + arme plus forte', l: 6 });
}
function svOver() {
  if (!SVR.on) return;
  SVR.on = 0;
  const w = SVR.wave, rec = w > (SV.sbest | 0);
  if (rec) SV.sbest = w;
  postStat(3, w);
  SVR.last = { w, k: SVR.k, c: SVR.crates };
  gain(SVR.xp + w * 10, SVR.co + w * 4);
  feed.push({ t: '☠ Fin de partie : vague ' + w + ' · ' + SVR.k + ' ennemis · ' + SVR.crates + ' caisses' + (rec ? ' · NOUVEAU RECORD !' : '') + ' (+' + (SVR.co + w * 4) + ' pièces)', l: 9 });
  bots = []; SVP = [];
}

// ---------- Dégâts reçus par les caisses / ennemis (appelé par hitBot) ----------
function svHit(o, d) {
  if (o.hp <= 0 || !(d > 0)) return;
  o.hp -= d; o.fl = .08;
  if (o.hp > 0) { if (o.cr && Math.random() < .5) ptc(o.x + (Math.random() - .5) * 20, o.y + (Math.random() - .5) * 20, o.gold ? '#ffd23a' : '#c48a4a'); return; }
  o.hp = 0;
  if (o.cr) svBreak(o); else svKill(o);
}
function svBeep(f, d, ty, v) { try { if (typeof AC !== 'undefined' && AC && !mute) tone(f, AC.currentTime, d, ty || 'square', v || .12); } catch (e) { } }
function svBreak(o) {
  for (let i = 0; i < 18; i++) ptc(o.x, o.y, i % 3 ? (o.gold ? '#ffd23a' : '#b8803f') : '#5a3a1a');
  svBeep(180, .1, 'square', .15);
  const before = svLvl(), had = SVR.crates >= SVPOW;
  SVR.crates += o.gold ? 2 : 1;
  const after = svLvl();
  if (!had && SVR.crates >= SVPOW) {
    SVR.ban = { t: '⚡ POUVOIR DÉBLOQUÉ', c: '#7ad0ff', l: 2.6, m: 'Maj / Espace / clic droit pour l\'utiliser' };
    feed.push({ t: '⚡ Pouvoir débloqué !', l: 5 }); me.ab = 0; for (let i = 0; i < 30; i++) ptc(me.x, me.y, i % 2 ? '#7ad0ff' : '#fff');
    svBeep(660, .25, 'triangle', .2);
  }
  if (after > before) {
    SVR.ban = { t: after >= SVLV.length - 1 ? 'ARME NIVEAU MAX' : 'ARME NIVEAU ' + (after + 1), c: '#ffd23a', l: 2.6, m: ['', 'Dégâts +25 %', 'Dégâts +50 %, tir plus rapide', 'Un projectile en plus !', 'Dégâts x2,2 · deux projectiles en plus'][after] };
    feed.push({ t: '🔫 Arme niveau ' + (after + 1) + ' !', l: 5 });
    for (let i = 0; i < 30; i++) ptc(me.x, me.y, i % 2 ? '#ffd23a' : '#fff3b0');
    svBeep(520, .2, 'triangle', .2);
  }
  if (o.gold || Math.random() < .4) svDrop(o.x, o.y, ['spd', 'dmg', 'reg', 'shd', 'hp', 'hp'][Math.random() * 6 | 0]);
}
function svDrop(x, y, t) { SVP.push({ x, y, t, l: 25 }); if (SVP.length > 40) SVP.shift(); }
function svKill(o) {
  me.k++; necroKill(); crKillAt('me', o.x, o.y);
  SVR.k++; SVR.xp += o.boss ? 120 : o.mh > 100 ? 12 : 4; if (o.boss) SVR.co += 40; else if (Math.random() < (o.mh > 100 ? .8 : .22)) SVR.co += 1;
  for (let i = 0; i < 14; i++) ptc(o.x, o.y, i % 2 ? o.col : '#c55');
  if (o.boss) { for (let i = 0; i < 4; i++) svDrop(o.x + (Math.random() - .5) * 90, o.y + (Math.random() - .5) * 90, ['hp', 'dmg', 'shd', 'reg'][i]); for (let i = 0; i < 40; i++) ptc(o.x + (Math.random() - .5) * 60, o.y + (Math.random() - .5) * 60, '#e8b0ff'); }
  else if (Math.random() < (o.mh > 100 ? .5 : .07)) svDrop(o.x, o.y, 'hp');
}

// ---------- Vagues ----------
function svSpawnEnemy(boss) {
  const w = SVR.wave, pool = SVEN.filter((e) => !e.boss && e.w <= w);
  let T; if (boss) T = SVEN[4]; else { const wt = pool.map((e) => e.w >= 4 ? 1 : e.w == 3 ? 1.3 : e.w == 2 ? 1.6 : 2.4); let r = Math.random() * wt.reduce((a, b) => a + b, 0), i = 0; while (r > wt[i] && i < pool.length - 1) { r -= wt[i]; i++; } T = pool[i]; }
  const p = svRandPos(640, 900, T.r); if (!p) return 0;
  const hs = 1 + .14 * (w - 1), ds = 1 + .05 * (w - 1);
  bots.push({ sv: 1, x: p.x, y: p.y, hp: T.hp * hs * (boss ? 1 + .1 * Math.floor(w / 5) : 1), mh: T.hp * hs * (boss ? 1 + .1 * Math.floor(w / 5) : 1), a: 0, an: 0, fl: 0, dt: 0, k: 0, d: 0, cd: .6 + Math.random(), r: T.r,
    sp: T.sp * Math.min(1.5, 1 + .02 * w), dm: Math.round(T.dm * ds), rg: T.rg, col: T.col, n: T.n, boss: T.boss || 0, ty: SVEN.indexOf(T) });
  return 1;
}
function svEnemyUpd(o, dt) {
  o.fl -= dt; o.cd -= dt;
  const dx = me.x - o.x, dy = me.y - o.y, d = Math.hypot(dx, dy) || 1; let ang = Math.atan2(dy, dx);
  o.an = ang; o.a = ang;
  let mv = 1;
  if (o.rg) { if (d < o.rg * .55) mv = -.8; else if (d < o.rg * .9) mv = 0; }
  if (o.sw > 0) { o.sw -= dt; ang += o.sa; }
  const sp = o.sp * (inMud(o.x, o.y) ? .55 : 1), px = o.x, py = o.y;
  o.x += Math.cos(ang) * sp * mv * dt; o.y += Math.sin(ang) * sp * mv * dt;
  col(o, o.r);
  o.x = Math.max(40, Math.min(MW - 40, o.x)); o.y = Math.max(40, Math.min(MH - 40, o.y));
  if (mv != 0 && !(o.sw > 0)) { // bloqué derrière un mur : on contourne
    if (Math.hypot(o.x - px, o.y - py) < sp * dt * .35) { o.stk = (o.stk || 0) + dt; if (o.stk > .25) { o.sw = .8 + Math.random() * .6; o.sa = (Math.random() < .5 ? -1 : 1) * (1.1 + Math.random() * .7); o.stk = 0; } } else o.stk = 0;
  }
  if (d > 1200) { o.far = (o.far || 0) + dt; if (o.far > 6) { const p = svRandPos(640, 900, o.r); if (p) { o.x = p.x; o.y = p.y; } o.far = 0; } } else o.far = 0; // retardataires : on les ramène
  if (!me.al) return;
  if (!o.rg) { if (o.cd <= 0 && d < o.r + CH[me.c].r + 8) { hurtMe(o.dm, 'horde'); o.cd = o.boss ? 1 : .75; if (o.boss) { for (let i = 0; i < 10; i++) ptc(me.x, me.y, '#e8b0ff'); } } }
  else if (o.cd <= 0 && d < o.rg + 40 && los(o.x, o.y, me.x, me.y)) {
    o.cd = 1.5 + Math.random() * .6;
    shoot(o.x, o.y, [ang + (Math.random() - .5) * .14], 0, false, 'horde', 0, o.dm);
    const b = Bu[Bu.length - 1]; if (b) { b.vx *= .5; b.vy *= .5; b.l = 1.5; b.bo = 1; b.d = o.dm; }
  }
}

function svUpd(dt) {
  if (SV.mode != 3 || !SVR.on || mode != 1 || !me.al) return;
  if (SVR.ban && (SVR.ban.l -= dt) <= 0) SVR.ban = null;
  const en = []; let nc = 0;
  for (const o of bots) { if (!o.sv || o.hp <= 0) continue; if (o.cr) { nc++; o.fl -= dt; } else en.push(o); }
  // vagues
  if (SVR.q > 0) { SVR.sp -= dt; if (SVR.sp <= 0 && en.length < 40) { SVR.sp = .35; const boss = SVR.boss; SVR.boss = 0; if (svSpawnEnemy(boss)) SVR.q--; else if (boss) SVR.boss = 1; } }
  else if (!en.length) {
    if (SVR.wave > 0 && SVR.wt <= 0) { // vague terminée
      SVR.wt = 6; SVR.co += SVR.wave; me.hp = Math.min(CH[me.c].hp, me.hp + CH[me.c].hp * .35);
      feed.push({ t: '✔ Vague ' + SVR.wave + ' terminée · +35 % de vie', l: 4 });
      for (let i = 0; i < 8; i++) svSpawnCrate(1);
    }
    SVR.wt -= dt;
    if (SVR.wt <= 0) {
      SVR.wave++; SVR.q = Math.min(50, 5 + 2 * SVR.wave); SVR.sp = 0; SVR.boss = SVR.wave % 5 == 0 ? 1 : 0; if (SVR.boss) SVR.q++;
      SVR.ban = { t: (SVR.boss ? '☠ VAGUE ' : 'VAGUE ') + SVR.wave, c: SVR.boss ? '#e08aff' : '#ff9a6a', l: 2.6, m: SVR.boss ? 'Un Colosse approche !' : SVR.q + ' ennemis' };
      svBeep(110, .5, 'sawtooth', .18);
    }
  }
  // caisses : on garde la carte approvisionnée
  if (nc < SVNCR && (SVR.ct -= dt) <= 0) { SVR.ct = 4; svSpawnCrate(0); }
  // ennemis
  for (const o of en) svEnemyUpd(o, dt);
  for (let i = 0; i < en.length; i++) for (let j = i + 1; j < en.length; j++) { // ils ne s'empilent pas
    const a = en[i], b = en[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), m = a.r + b.r - 2;
    if (d < m && d > .01) { const k = (m - d) / 2 / d; a.x -= dx * k; a.y -= dy * k; b.x += dx * k; b.y += dy * k; }
  }
  svPickUp(dt);
  bots = bots.filter((o) => !o.sv || o.hp > 0);
}

function svPickUp(dt) {
  for (const p of SVP) {
    p.l -= dt;
    if (Math.hypot(me.x - p.x, me.y - p.y) < 30) {
      p.l = 0;
      if (p.t == 'hp') { me.hp = Math.min(CH[me.c].hp, me.hp + CH[me.c].hp * .3); feed.push({ t: 'Soin +30 %', l: 3 }); for (let i = 0; i < 12; i++) ptc(me.x, me.y, '#7dff9a'); }
      else applyOrb(p.t);
    }
  }
  SVP = SVP.filter((p) => p.l > 0);
}

// ---------- Dessin (dans le monde) ----------
const SVPC = { hp: '#5dff8a', spd: '#7ad0ff', dmg: '#ff6a4a', reg: '#8affb0', shd: '#b070ff' }, SVPL = { hp: '+', spd: '»', dmg: '✦', reg: '♥', shd: '◈' };
function svDrawCrate(o) {
  const x = o.x - cam.x, y = o.y - cam.y; if (x < -50 || x > W + 50 || y < -50 || y > H + 50) return;
  const s = o.gold ? 42 : 36, h = s / 2;
  g.save(); g.translate(x, y);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-h + 4, -h + 6, s, s);
  if (o.gold) { g.shadowColor = '#ffd23a'; g.shadowBlur = 14 + 6 * Math.sin(tt * 4); }
  g.fillStyle = o.fl > 0 ? '#fff' : o.gold ? '#e6b422' : '#a8743a'; g.fillRect(-h, -h, s, s); g.shadowBlur = 0;
  const dk = o.gold ? '#8a6410' : '#5e3b18';
  g.strokeStyle = dk; g.lineWidth = 3; g.strokeRect(-h + 1.5, -h + 1.5, s - 3, s - 3);
  g.lineWidth = 2.5; g.beginPath(); g.moveTo(-h + 3, -h + 3); g.lineTo(h - 3, h - 3); g.moveTo(h - 3, -h + 3); g.lineTo(-h + 3, h - 3); g.stroke();
  g.fillStyle = dk; for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.fillRect(a * (h - 6) - 2, b * (h - 6) - 2, 4, 4);
  const f = o.hp / o.mh;
  if (f < .7) { g.strokeStyle = 'rgba(20,10,0,.8)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-6, -h); g.lineTo(-2, -4); g.lineTo(-9, 2); if (f < .4) { g.moveTo(8, h); g.lineTo(4, 5); g.lineTo(11, -3); } g.stroke(); }
  if (f < 1) { g.fillStyle = '#000a'; g.fillRect(-14, -h - 9, 28, 4); g.fillStyle = o.gold ? '#ffd23a' : '#e0a050'; g.fillRect(-14, -h - 9, 28 * Math.max(0, f), 4); }
  g.restore();
}
function svDrawEnemy(o) {
  const x = o.x - cam.x, y = o.y - cam.y, r = o.r; if (x < -80 || x > W + 80 || y < -80 || y > H + 80) return;
  g.save(); g.translate(x, y);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(4, 6, r, r * .85, 0, 0, 7); g.fill();
  if (o.boss) { g.shadowColor = o.gc || '#c060ff'; g.shadowBlur = 20; }
  g.rotate(o.an || 0);
  g.fillStyle = o.fl > 0 ? '#fff' : o.col; g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 3;
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.stroke(); g.shadowBlur = 0;
  if (o.ty == 1) { g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(-r - 4, i * 5); g.lineTo(-r - 14, i * 5); g.stroke(); } }
  if (o.ty == 2) { g.fillStyle = '#222'; g.fillRect(r - 2, -3, 16, 6); }
  if (o.ty == 3 || o.boss) { g.fillStyle = 'rgba(0,0,0,.35)'; for (const a of [-.9, .9]) { g.beginPath(); g.arc(Math.cos(a) * r * .55, Math.sin(a) * r * .55, r * .38, 0, 7); g.fill(); } }
  if (o.boss) { g.fillStyle = '#ffd23a'; for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(-r * .3, i * 7 - 3); g.lineTo(-r * .3 - 9, i * 7); g.lineTo(-r * .3, i * 7 + 3); g.fill(); } }
  g.fillStyle = '#ff3a3a'; g.beginPath(); g.arc(r * .4, -r * .32, Math.max(2, r * .15), 0, 7); g.arc(r * .4, r * .32, Math.max(2, r * .15), 0, 7); g.fill();
  g.restore();
  const f = o.hp / o.mh;
  if (f < 1 || o.boss || o.ty == 3) {
    const w = Math.max(28, r * 2);
    g.fillStyle = '#000a'; g.fillRect(x - w / 2, y - r - 11, w, 5); g.fillStyle = o.boss ? '#c060ff' : '#e25a4a'; g.fillRect(x - w / 2, y - r - 11, w * Math.max(0, f), 5);
    if (o.boss) { g.textAlign = 'center'; g.font = 'bold 12px Trebuchet MS,sans-serif'; g.fillStyle = '#f0d8ff'; g.fillText((o.n || 'COLOSSE').toUpperCase(), x, y - r - 16); }
  }
}
function svDraw() {
  if (SV.mode < 3) return;
  for (const p of SVP) {
    const x = p.x - cam.x, y = p.y - cam.y; if (x < -30 || x > W + 30 || y < -30 || y > H + 30) continue;
    if (p.l < 5 && Math.floor(tt * 8) % 2) continue;
    const c = SVPC[p.t] || '#fff', bob = Math.sin(tt * 4 + p.x) * 3;
    g.fillStyle = c + '44'; g.beginPath(); g.arc(x, y + bob, 17, 0, 7); g.fill();
    g.fillStyle = '#0c1018'; g.strokeStyle = c; g.lineWidth = 3; g.beginPath(); g.arc(x, y + bob, 11, 0, 7); g.fill(); g.stroke();
    g.fillStyle = c; g.font = 'bold 14px Trebuchet MS,sans-serif'; g.textAlign = 'center'; g.fillText(SVPL[p.t] || '?', x, y + bob + 5);
  }
  for (const o of bots) { if (!o.sv || o.hp <= 0) continue; if (o.cr) svDrawCrate(o); }
  for (const o of bots) { if (!o.sv || o.hp <= 0 || o.cr) continue; svDrawEnemy(o); }
}

// ---------- Interface ----------
function svHud() {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  let alive = 0; for (const o of bots) if (o.sv && !o.cr && o.hp > 0) alive++;
  g.textAlign = 'center';
  g.font = 'bold 24px Trebuchet MS,sans-serif'; g.fillStyle = '#f0e6d0'; g.fillText(SVR.on ? (SVR.wave ? 'Vague ' + SVR.wave : 'Prépare-toi…') : 'Survivant', W / 2, 30);
  g.font = '12px Trebuchet MS,sans-serif'; g.fillStyle = '#8f9bb3';
  const left = alive + SVR.q;
  g.fillText(SVR.on ? (left ? left + ' ennemi' + (left > 1 ? 's' : '') + ' restant' + (left > 1 ? 's' : '') : 'Prochaine vague dans ' + Math.max(0, Math.ceil(SVR.wt)) + ' s') : 'Record : vague ' + (SV.sbest | 0), W / 2, 46);
  if (SVR.on && me.al) {
    const lv = svLvl(), max = lv >= SVLV.length - 1, x0 = W / 2 - 84, y0 = H - 78, w = 240;
    g.fillStyle = 'rgba(8,10,18,.72)'; g.fillRect(x0 - 12, y0, w, 52); g.strokeStyle = '#8affb0'; g.lineWidth = 1.5; g.strokeRect(x0 - 11.5, y0 + .5, w - 1, 51);
    g.textAlign = 'left'; g.font = 'bold 12px Trebuchet MS,sans-serif'; g.fillStyle = '#ffd23a'; g.fillText('🔫 ARME NIV. ' + (lv + 1) + (max ? ' (MAX)' : ' / ' + SVLV.length), x0, y0 + 16);
    g.textAlign = 'right'; g.fillStyle = '#c5cfe0'; g.font = '11px Trebuchet MS,sans-serif'; g.fillText('📦 ' + SVR.crates + (max ? '' : ' / ' + SVLV[lv + 1]), x0 + w - 24, y0 + 16);
    const f = max ? 1 : (SVR.crates - SVLV[lv]) / (SVLV[lv + 1] - SVLV[lv]);
    g.fillStyle = '#000a'; g.fillRect(x0, y0 + 22, w - 24, 8); g.fillStyle = '#ffd23a'; g.fillRect(x0, y0 + 22, (w - 24) * Math.max(0, Math.min(1, f)), 8);
    g.textAlign = 'left'; g.font = 'bold 12px Trebuchet MS,sans-serif';
    if (SVR.crates >= SVPOW) { g.fillStyle = me.ab <= 0 ? '#7ad0ff' : '#6a7a92'; g.fillText('⚡ POUVOIR ' + (me.ab <= 0 ? 'PRÊT' : 'en recharge ' + Math.ceil(me.ab) + ' s'), x0, y0 + 46); }
    else { g.fillStyle = '#ff9a6a'; g.fillText('🔒 POUVOIR : ' + SVR.crates + ' / ' + SVPOW + ' caisses', x0, y0 + 46); }
  }
  if (SVR.on) svMini();
  svBanner();
  g.restore();
}
function svMini() {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  {
    const mw = 176, mh = Math.round(176 * MH / MW), mx = W - 14 - mw, my = 124, k = mw / MW;
    g.fillStyle = 'rgba(8,10,18,.7)'; g.fillRect(mx, my, mw, mh); g.strokeStyle = '#8affb0'; g.lineWidth = 1.5; g.strokeRect(mx + .5, my + .5, mw - 1, mh - 1);
    g.fillStyle = 'rgba(160,180,140,.45)'; for (const w of WL) g.fillRect(mx + w[0] * k, my + w[1] * k, Math.max(1, w[2] * k), Math.max(1, w[3] * k));
    for (const o of bots) { if (!o.sv || o.hp <= 0) continue; g.fillStyle = o.cr ? (o.gold ? '#ffd23a' : '#d79a50') : o.boss ? '#e08aff' : '#ff4a4a'; const s = o.boss ? 5 : o.cr ? 3 : 2.5; g.fillRect(mx + o.x * k - s / 2, my + o.y * k - s / 2, s, s); }
    g.fillStyle = '#5dff8a'; for (const p of SVP) g.fillRect(mx + p.x * k - 1.5, my + p.y * k - 1.5, 3, 3);
    g.fillStyle = '#4fd8ff'; for (const key in R) { const o = R[key]; if (o.al) g.fillRect(mx + o.x * k - 2, my + o.y * k - 2, 4, 4); }
    g.fillStyle = '#fff'; g.beginPath(); g.arc(mx + me.x * k, my + me.y * k, 3.2, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1; g.strokeRect(mx + cam.x * k, my + cam.y * k, W * k, H * k);
  }
  g.restore();
}
function svBanner() {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const b = SVR.ban;
  if (b) {
    const a = Math.max(0, Math.min(1, b.l * 2, (2.6 - b.l) * 6));
    g.globalAlpha = a; g.textAlign = 'center'; g.font = 'bold 46px Trebuchet MS,sans-serif'; g.lineWidth = 6; g.lineJoin = 'round'; g.strokeStyle = 'rgba(0,0,0,.8)'; g.strokeText(b.t, W / 2, 150); g.fillStyle = b.c; g.fillText(b.t, W / 2, 150);
    if (b.m) { g.font = 'bold 16px Trebuchet MS,sans-serif'; g.lineWidth = 4; g.strokeText(b.m, W / 2, 178); g.fillStyle = '#f0e6d0'; g.fillText(b.m, W / 2, 178); }
    g.globalAlpha = 1;
  }
  g.restore();
}
