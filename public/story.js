// story.js — Mode HISTOIRE (solo) : campagne en 5 chapitres, un boss par chapitre.
// Chargé après survivor.js : réutilise ses ennemis (SVEN, svEnemyUpd, svDrawEnemy…) et les variables de game.js.
//
// Déroulé d'un chapitre : dialogue d'intro → 3 vagues d'ennemis → boss → dialogue de fin → récompenses → chapitre suivant.
// La progression (SV.story = chapitres terminés) est sauvegardée. Mort = on recommence le chapitre.
// Fin de l'histoire : déblocage de Magmaar (ou pièces si tu l'as déjà).
//
// Réglages faciles ↓ (textes, vagues, boss, récompenses)
const STCH = [
  { n: 'Les Cendres', map: { fl: '#2c2a2a', gr: '#383535', wa: '#5a5048', wt: '#8a7c6c', dc: ['#4a3a30', '#6a5a50'], seed: 11 },
    intro: [['Narrateur', 'Il y a trois lunes, le Roi d\'Ombre a brisé le Sceau de l\'Arène. Depuis, ses créatures dévorent les terres.'],
      ['Narrateur', 'Ton village n\'est plus que cendres. Tu es le dernier à tenir encore debout.'],
      ['Narrateur', 'Traverse les ruines. Le Gardien Calciné garde la route du nord.']],
    waves: [[[0, 6]], [[0, 6], [1, 3]], [[0, 8], [1, 5]]],
    boss: { n: 'Gardien Calciné', hp: 700, r: 26, sp: 85, dm: 28, col: '#7a6a5a', gc: '#ff7a3a', ab: ['charge'] },
    outro: [['Narrateur', 'Le Gardien s\'effondre en poussière. Sur son armure brille l\'emblème du Roi d\'Ombre.'], ['Narrateur', 'Au nord, le Marais Maudit t\'attend.']] },
  { n: 'Le Marais Maudit', map: { fl: '#1f3a2c', gr: '#2a4b39', wa: '#3f6e4d', wt: '#5f9a70', dc: ['#2e6b44', '#3a7a6a'], seed: 22, mud: 1 },
    intro: [['Narrateur', 'La brume du marais étouffe les cris. Des tireurs embusqués guettent dans les roseaux.'], ['Narrateur', 'Méfie-toi de la boue : elle ralentit les imprudents.']],
    waves: [[[0, 6], [2, 3]], [[1, 6], [2, 4]], [[0, 6], [2, 5], [3, 1]]],
    boss: { n: 'Mère des Marais', hp: 1000, r: 28, sp: 70, dm: 26, col: '#4a8a4a', gc: '#7aff7a', ab: ['summon'] },
    outro: [['Narrateur', 'Dans la gorge de la Mère, un éclat du Sceau brille encore.'], ['Voix', '« Il en reste trois… Cherche le froid, il garde le prochain. »']] },
  { n: 'La Citadelle de Givre', map: { fl: '#7a9bb2', gr: '#8aaac0', wa: '#4f7390', wt: '#dff3ff', dc: ['#a9c9dd', '#e8f4fb'], seed: 33, ice: 1 },
    intro: [['Narrateur', 'Le froid est venu avec l\'Ombre. Ici, la glace n\'offre aucune prise : chaque pas glisse.'], ['Narrateur', 'Le Seigneur du Givre règne sur la citadelle. Son souffle glace le sang.']],
    waves: [[[1, 8], [2, 4]], [[0, 8], [3, 2]], [[1, 6], [2, 6], [3, 2]]],
    boss: { n: 'Seigneur du Givre', hp: 1300, r: 28, sp: 75, dm: 30, col: '#8ad0f0', gc: '#bff0ff', ab: ['nova'] },
    outro: [['Narrateur', 'Le Seigneur du Givre se brise comme du verre.'], ['Seigneur du Givre', '« Le Roi s\'est caché… dans les Forges. Tu arrives trop tard. »']] },
  { n: 'Les Forges Infernales', map: { fl: '#3a1f18', gr: '#4a2a20', wa: '#5e4a44', wt: '#826860', dc: ['#7a3a20', '#4a3028'], seed: 44, lava: 1 },
    intro: [['Narrateur', 'La lave des Forges nourrit l\'armée du Roi. Ne touche pas aux flaques : elles brûlent.'], ['Narrateur', 'Un Titan de magma forge ici les armes de l\'Ombre.']],
    waves: [[[0, 8], [3, 3]], [[1, 10], [2, 5]], [[3, 4], [2, 6], [1, 6]]],
    boss: { n: 'Titan de Magma', hp: 1700, r: 32, sp: 70, dm: 36, col: '#e05a1a', gc: '#ffb040', ab: ['charge', 'nova'] },
    outro: [['Narrateur', 'Le Titan s\'éteint dans un grondement. Le chemin vers le Trône d\'Ombre est ouvert.']] },
  { n: 'Le Trône d\'Ombre', map: { fl: '#241526', gr: '#2e1c34', wa: '#5a3a62', wt: '#8a5a96', dc: ['#6a2a5a', '#4a3a4a'], seed: 55 },
    intro: [['Narrateur', 'Voici la fin du voyage. Sur le trône se dresse une silhouette immense, une batte à la main.'], ['Roi d\'Ombre', '« Tong Tong Sahur… voilà le nom que les vivants murmurent avant de mourir. »'], ['Narrateur', 'Tout se joue maintenant.']],
    waves: [[[0, 10], [2, 6]], [[3, 4], [1, 10]], [[3, 5], [2, 8], [1, 8]]],
    boss: { n: 'Tong Tong Sahur', hp: 2600, r: 34, sp: 85, dm: 40, col: '#b9824a', gc: '#c060ff', ab: ['charge', 'summon', 'nova'], final: 1 },
    outro: [['Narrateur', 'Le Roi d\'Ombre tombe. Le Sceau se reforme et les cendres redeviennent terre.'], ['Narrateur', 'Magmaar, seigneur des flammes, reconnaît ta force et rejoint ta cause.'], ['Narrateur', 'FIN — merci d\'avoir joué l\'histoire !']] }];
const STMAG = 15; // indice de Magmaar dans CH (récompense de fin)

// ---------- Cartes (une par chapitre) ----------
const STI = STCH.map((c) => {
  const o = c.map; let sd = o.seed * 977 + 5; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const MWs = 2400, MHs = 1800, cx = MWs / 2, cy = MHs / 2, w = [[0, 0, MWs, 24], [0, MHs - 24, MWs, 24], [0, 0, 24, MHs], [MWs - 24, 0, 24, MHs]];
  const clear = (x, y, ww, hh) => !(x < cx + 260 && x + ww > cx - 260 && y < cy + 260 && y + hh > cy - 260);
  for (let i = 0; i < 60 && w.length < 40; i++) {
    const x = 120 + rnd() * (MWs - 400), y = 120 + rnd() * (MHs - 400), k = rnd(); let parts;
    if (k < .4) { const a = 140 + rnd() * 120, b = 120 + rnd() * 120; parts = [[x, y, a, 36], [x, y, 36, b]]; }
    else if (k < .7) { const a = 60 + rnd() * 50; parts = [[x, y, a, a]]; }
    else parts = [[x, y, 240 + rnd() * 180, 36]];
    if (parts.every((p) => clear(p[0], p[1], p[2], p[3]))) w.push(...parts);
  }
  const zone = (n, ww0, hh0) => { const L = []; for (let i = 0; i < 60 && L.length < n; i++) { const ww = ww0 + rnd() * 120, hh = hh0 + rnd() * 80, x = 150 + rnd() * (MWs - 400), y = 150 + rnd() * (MHs - 300); if (clear(x, y, ww, hh)) L.push([x, y, ww, hh]); } return L; };
  const m = { n: c.n, d: 'Mode Histoire', mw: MWs, mh: MHs, ev: 1, fl: o.fl, gr: o.gr, wa: o.wa, wt: o.wt, dc: o.dc, w };
  if (o.mud) m.mud = zone(9, 180, 110);
  if (o.lava) m.lv = zone(7, 160, 100);
  if (o.ice) { m.ice = 1; m.snow = 1; }
  MAPS.push(m); return MAPS.length - 1;
});

// ---------- État ----------
const STR = { ph: 'idle', ch: 1, wv: 0, q: [], sp: 0, wt: 0, dlg: null, di: 0, then: null, sx: 0, sy: 0, retry: 0, boss: null, md: 0, kn: 0, ban: null };
const stChap = () => STCH[STR.ch - 1];
function stInfo() {
  const n = STR.ph == 'idle' ? ((SV.story | 0) >= 5 ? 1 : (SV.story | 0) + 1) : STR.ch;
  return 'Chapitre ' + n + ' : ' + STCH[n - 1].n;
}
function stDialog(lines, then) { STR.dlg = lines; STR.di = 0; STR.then = then; STR.sx = me.x; STR.sy = me.y; STR.md = M.d ? 1 : 0; }

function stStart() {
  if (STR.ph != 'dead') STR.ch = (SV.story | 0) >= 5 ? 1 : (SV.story | 0) + 1; // sinon : on rejoue le chapitre perdu
  stLoad(STR.retry);
}
function stLoad(skipIntro) {
  const c = stChap();
  setMap(STI[STR.ch - 1]);
  bots = []; SVP = []; Bu = []; DP = [];
  me.x = MW / 2; me.y = MH / 2 + 80; me.k = 0; me.hp = CH[me.c].hp; me.al = 1;
  Object.assign(STR, { wv: 0, q: [], sp: 0, wt: 2, boss: null, kn: 0, ban: null, ph: 'play', dlg: null });
  if (!skipIntro) { STR.ph = 'intro'; stDialog(c.intro, () => { STR.ph = 'play'; STR.wt = 1.5; stBanner('CHAPITRE ' + STR.ch, c.n, '#ffb38a'); }); }
  else stBanner('CHAPITRE ' + STR.ch, c.n, '#ffb38a');
  STR.retry = 0;
}
function stBanner(t, m, c) { STR.ban = { t, m, c, l: 2.6 }; }
function stOver() {
  if (STR.ph == 'dead') return;
  STR.ph = 'dead'; STR.retry = 1; bots = []; SVP = []; STR.dlg = null;
  feed.push({ t: '☠ Chapitre ' + STR.ch + ' échoué — choisis un perso pour réessayer', l: 6 });
}

// ---------- Ennemis ----------
function stMake(T, x, y, hs, ds, boss) {
  const hp = T.hp * hs;
  const o = { sv: 1, x, y, hp, mh: hp, a: 0, an: 0, fl: 0, dt: 0, k: 0, d: 0, cd: .6 + Math.random(), r: T.r, sp: T.sp, dm: Math.round(T.dm * ds), rg: T.rg || 0, col: T.col, n: T.n, boss: boss ? 1 : 0, ty: SVEN.indexOf(T) };
  if (boss) Object.assign(o, { gc: T.gc, ab: T.ab, final: T.final, t1: 4, t2: 6, t3: 5, chg: 0, tel: 0, kind: '' });
  bots.push(o); return o;
}
function stSpawn(ti, boss) {
  const hs = 1 + .25 * (STR.ch - 1), ds = 1 + .12 * (STR.ch - 1);
  if (boss) { const T = Object.assign({}, stChap().boss); T.rg = 0; const o = stMake(T, MW / 2, 220, 1, ds, 1); o.x = MW / 2; o.y = 260; STR.boss = o; return; }
  const T = SVEN[ti], p = svRandPos(640, 900, T.r); if (!p) return false;
  stMake(T, p.x, p.y, hs, ds, 0); return true;
}
function stBullets(o, n, spd) {
  const as = [], off = Math.random() * 6.283; for (let i = 0; i < n; i++) as.push(off + i * 6.283 / n);
  shoot(o.x, o.y, as, 0, false, 'horde', 0, Math.round(o.dm * .45));
  for (let i = 0; i < as.length; i++) { const b = Bu[Bu.length - 1 - i]; if (b) { b.vx *= spd; b.vy *= spd; b.l = 2.4; b.bo = 1; b.d = Math.round(o.dm * .45); } }
}
function stBossUpd(o, dt) { // renvoie 1 si le boss gère lui-même son déplacement
  const enr = o.final && o.hp < o.mh * .5, k = enr ? .7 : 1;
  if (enr && !o.enr) { o.enr = 1; o.sp *= 1.25; stBanner('☠ ENRAGÉ', o.n, '#ff5a5a'); for (let i = 0; i < 40; i++) ptc(o.x, o.y, '#ff4a4a'); }
  o.fl -= dt; o.cd -= dt;
  const dx = me.x - o.x, dy = me.y - o.y, d = Math.hypot(dx, dy) || 1;
  if (o.tel > 0) { // télégraphie (immobile)
    o.tel -= dt; o.an = Math.atan2(dy, dx);
    if (o.tel <= 0) {
      if (o.kind == 'charge') { o.chg = .6; o.ca = Math.atan2(dy, dx); o.hit = 0; }
      else if (o.kind == 'nova') { stBullets(o, enr ? 18 : 12, .38); for (let i = 0; i < 24; i++) ptc(o.x, o.y, '#fff'); }
      else if (o.kind == 'summon') { let n = 0; for (const q of bots) if (q.sv && !q.cr && q.hp > 0 && !q.boss) n++; for (let i = 0; i < 3 && n < 22; i++) { const T = SVEN[0], a = i * 2.1 + Math.random(); stMake(T, o.x + Math.cos(a) * 70, o.y + Math.sin(a) * 70, 1 + .25 * (STR.ch - 1), 1, 0); } for (let i = 0; i < 20; i++) ptc(o.x, o.y, '#9a4ac0'); }
    }
    return 1;
  }
  if (o.chg > 0) { // charge
    o.chg -= dt; o.x += Math.cos(o.ca) * 560 * dt; o.y += Math.sin(o.ca) * 560 * dt; col(o, o.r); o.x = Math.max(40, Math.min(MW - 40, o.x)); o.y = Math.max(40, Math.min(MH - 40, o.y)); o.an = o.ca;
    if (me.al && !o.hit && d < o.r + CH[me.c].r + 6) { o.hit = 1; hurtMe(Math.round(o.dm * 1.2), 'horde'); }
    return 1;
  }
  for (const [i, ab] of o.ab.entries()) { // cooldowns
    const key = ['t1', 't2', 't3'][['charge', 'summon', 'nova'].indexOf(ab)];
    o[key] -= dt;
    if (o[key] <= 0 && !o.tel) { o[key] = [5, 9, 7][['charge', 'summon', 'nova'].indexOf(ab)] * k; o.kind = ab; o.tel = ab == 'charge' ? .7 : .6; break; }
  }
  return 0;
}

// ---------- Boucle ----------
function stUpd(dt) {
  if (SV.mode != 4) return;
  if (STR.ban && (STR.ban.l -= dt) <= 0) STR.ban = null;
  if (STR.dlg && (mode != 1 || !me.al)) STR.dlg = null;
  if (STR.dlg) { // dialogue : le jeu est figé, tu es invulnérable
    me.x = STR.sx; me.y = STR.sy; me.cd = .3; me.ri = Math.max(me.ri, .2); AB = 0;
    const down = M.d ? 1 : 0; if (down && !STR.md) stNext(); STR.md = down;
    return;
  }
  if (mode != 1 || !me.al || (STR.ph != 'play' && STR.ph != 'boss')) return;
  const en = []; for (const o of bots) if (o.sv && !o.cr && o.hp > 0) en.push(o);
  const T = stChap();
  if (STR.q.length) { STR.sp -= dt; if (STR.sp <= 0 && en.length < 36) { STR.sp = .4; if (stSpawn(STR.q[STR.q.length - 1])) STR.q.pop(); else STR.q.pop(); } }
  else if (!en.length) {
    if (STR.ph == 'boss') { stClear(); return; }
    STR.wt -= dt;
    if (STR.wt <= 0) {
      if (STR.wv < T.waves.length) {
        const W_ = T.waves[STR.wv++]; STR.q = []; for (const [ty, n] of W_) for (let i = 0; i < n; i++) STR.q.push(ty); STR.q.sort(() => Math.random() - .5);
        STR.wt = 3; stBanner('VAGUE ' + STR.wv + ' / ' + T.waves.length, STR.q.length + ' ennemis', '#ff9a6a');
      } else { STR.ph = 'boss'; stSpawn(0, 1); stBanner('☠ BOSS', T.boss.n, '#e08aff'); }
    }
  }
  for (const o of en) { if (o.boss) { if (stBossUpd(o, dt)) continue; } svEnemyUpd(o, dt); }
  for (let i = 0; i < en.length; i++) for (let j = i + 1; j < en.length; j++) {
    const a = en[i], b = en[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), m = a.r + b.r - 2;
    if (d < m && d > .01) { const k = (m - d) / 2 / d; if (!a.boss) { a.x -= dx * k; a.y -= dy * k; } if (!b.boss) { b.x += dx * k; b.y += dy * k; } }
  }
  svPickUp(dt);
  bots = bots.filter((o) => !o.sv || o.hp > 0);
}
function stNext() {
  STR.di++;
  if (STR.di >= STR.dlg.length) { const f = STR.then; STR.dlg = null; if (f) f(); }
}
function stClear() {
  const ch = STR.ch, last = ch >= 5;
  SV.story = Math.max(SV.story | 0, ch);
  gain(80 * ch, 40 * ch);
  feed.push({ t: '✔ Chapitre ' + ch + ' terminé · +' + 40 * ch + ' pièces', l: 6 });
  STR.ph = 'outro'; me.hp = CH[me.c].hp;
  stDialog(stChap().outro, () => {
    if (last) {
      const owns = (SV.bu || []).includes(STMAG) || owned(STMAG);
      if (!owns) { SV.bu = SV.bu || []; SV.bu.push(STMAG); feed.push({ t: '🔥 Magmaar débloqué !', l: 8 }); } else gain(0, 500);
      STR.ph = 'idle'; save(); leaveEvent();
    } else { STR.ch++; stLoad(0); }
  });
}

// ---------- Interface ----------
function stWrap(t, w) { const L = [], ws = t.split(' '); let l = ''; for (const x of ws) { if (g.measureText(l + x).width > w && l) { L.push(l); l = ''; } l += x + ' '; } L.push(l); return L; }
function stHud() {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const T = stChap(), b = STR.boss && STR.boss.hp > 0 ? STR.boss : null;
  g.textAlign = 'center'; g.font = 'bold 18px Trebuchet MS,sans-serif'; g.fillStyle = '#ffb38a'; g.fillText('Chapitre ' + STR.ch + ' — ' + T.n, W / 2, b ? 70 : 28);
  if (b) {
    const bw = 440, bx = W / 2 - bw / 2, f = Math.max(0, b.hp / b.mh);
    g.font = 'bold 15px Trebuchet MS,sans-serif'; g.fillStyle = '#f0e6d0'; g.fillText(b.n.toUpperCase(), W / 2, 22);
    g.fillStyle = '#000a'; g.fillRect(bx - 3, 28, bw + 6, 22); g.fillStyle = '#2a0d1a'; g.fillRect(bx, 31, bw, 16);
    g.fillStyle = b.enr ? '#ff3a3a' : '#c04bd8'; g.fillRect(bx, 31, bw * f, 16); g.strokeStyle = '#e9d9a8'; g.lineWidth = 2; g.strokeRect(bx, 31, bw, 16);
  } else {
    let n = STR.q.length; for (const o of bots) if (o.sv && o.hp > 0 && !o.cr) n++;
    g.font = '12px Trebuchet MS,sans-serif'; g.fillStyle = '#8f9bb3';
    g.fillText(STR.ph == 'boss' ? '' : n ? 'Vague ' + STR.wv + ' / ' + T.waves.length + ' · ' + n + ' ennemi' + (n > 1 ? 's' : '') : STR.dlg ? '' : 'Prépare-toi…', W / 2, 46);
  }
  // télégraphie des attaques du boss
  if (b && b.tel > 0) {
    const x = b.x - cam.x, y = b.y - cam.y, a = .35 + .3 * Math.sin(tt * 30);
    g.globalAlpha = a; g.strokeStyle = '#ff3a3a'; g.fillStyle = '#ff3a3a';
    if (b.kind == 'charge') { g.lineWidth = b.r * 2; g.globalAlpha = a * .5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(b.an) * 380, y + Math.sin(b.an) * 380); g.stroke(); }
    else { g.lineWidth = 4; g.beginPath(); g.arc(x, y, b.r + 26 + (b.kind == 'nova' ? 40 : 0), 0, 7); g.stroke(); }
    g.globalAlpha = 1;
  }
  if (STR.ph != 'idle' && STR.ph != 'dead' && !STR.dlg) svMini();
  // bandeau
  const bn = STR.ban;
  if (bn) {
    const a = Math.max(0, Math.min(1, bn.l * 2, (2.6 - bn.l) * 6));
    g.globalAlpha = a; g.textAlign = 'center'; g.font = 'bold 44px Trebuchet MS,sans-serif'; g.lineWidth = 6; g.lineJoin = 'round'; g.strokeStyle = 'rgba(0,0,0,.8)'; g.strokeText(bn.t, W / 2, 150); g.fillStyle = bn.c; g.fillText(bn.t, W / 2, 150);
    if (bn.m) { g.font = 'bold 18px Trebuchet MS,sans-serif'; g.lineWidth = 4; g.strokeText(bn.m, W / 2, 180); g.fillStyle = '#f0e6d0'; g.fillText(bn.m, W / 2, 180); }
    g.globalAlpha = 1;
  }
  // dialogue
  if (STR.dlg) {
    const [who, txt] = STR.dlg[STR.di], bx = 80, by = H - 170, bw = W - 160, bh = 130;
    g.fillStyle = 'rgba(6,5,12,.9)'; g.fillRect(bx, by, bw, bh); g.strokeStyle = '#ffb38a'; g.lineWidth = 2; g.strokeRect(bx, by, bw, bh);
    g.textAlign = 'left'; g.font = 'bold 16px Trebuchet MS,sans-serif'; g.fillStyle = '#ffb38a'; g.fillText(who, bx + 20, by + 28);
    g.font = '17px Trebuchet MS,sans-serif'; g.fillStyle = '#f0e6d0'; stWrap(txt, bw - 40).slice(0, 3).forEach((l, i) => g.fillText(l, bx + 20, by + 58 + i * 24));
    g.textAlign = 'right'; g.font = '12px Trebuchet MS,sans-serif'; g.fillStyle = '#8f9bb3'; g.fillText((STR.di + 1) + ' / ' + STR.dlg.length + '  ·  Entrée / clic : continuer', bx + bw - 14, by + bh - 12);
  }
  g.restore();
}
addEventListener('keydown', (e) => { if (SV.mode == 4 && STR.dlg && (e.code == 'Enter' || e.code == 'NumpadEnter')) { e.preventDefault(); e.stopImmediatePropagation(); stNext(); } });
