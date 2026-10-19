// dragon.js — Boss DRAGON « Pyrax » (événement spécial).
// Chargé après game.js. L'IA du boss est dans server.js (tickDragon) ; ici : dessin + dégâts du souffle côté client.
//
// États envoyés par le serveur (BS.st) :
//   0 vol stationnaire / marche · 1 préparation du coup de queue (zone annoncée) · 2 impact · 3 récupération (vulnérable)
//   4 rugissement : pluie de météores · 5 préparation du souffle (cône annoncé) · 6 SOUFFLE DE FEU · 7 envol puis plongeon (invulnérable en l'air)
// BS.en : 0 normal · 1 rage (< 50 % PV) · 2 fureur (< 25 % PV : souffle à 3 cônes)
const DBL = 560, DBH = .36; // portée et demi-angle du souffle (identiques à server.js)

const dgCones = () => BS.en >= 2 ? [BS.a - .72, BS.a, BS.a + .72] : [BS.a];

// Dégâts du souffle (à chaque image) + braises
function dragonUpd(dt) {
  if (!BS.al || BS.bt != 'dragon') return;
  if (Math.random() < dt * (BS.en ? 34 : 14)) ptc(BS.x + (Math.random() - .5) * BS.r * 1.5, BS.y + (Math.random() - .5) * BS.r * 1.5, BS.en ? '#ff8a2a' : '#7a2a1a');
  if (BS.st == 7 && Math.random() < dt * 40) ptc(BS.x + (Math.random() - .5) * BS.r * 2.4, BS.y + (Math.random() - .5) * BS.r * 2.4, '#e8d9b8');
  if (SV.mode != 2 || !me.al || BS.st != 6) return;
  const dx = me.x - BS.x, dy = me.y - BS.y, d = Math.hypot(dx, dy), r = CH[me.c].r, an = Math.atan2(dy, dx);
  if (d > DBL + r || d < BS.r * .5) return;
  for (const a of dgCones()) {
    if (Math.abs(angd(an, a)) < DBH + Math.min(.5, r / Math.max(d, 1))) {
      const f = me.fl; hurtMe((BS.en >= 2 ? 36 : 28) * dt, 'boss'); if (me.al) { me.fl = f > 0 ? f : .04; me.brn = Math.max(me.brn || 0, 2); me.bro = 'boss'; }
      break;
    }
  }
}

// ---------- Dessin ----------
function dgFlame(len, half, t, fin, k) { // un cône de flammes depuis l'origine locale, vers +x
  const N = 30;
  g.save(); g.globalCompositeOperation = 'lighter';
  const gr = g.createLinearGradient(0, 0, len, 0); gr.addColorStop(0, 'rgba(255,240,170,.55)'); gr.addColorStop(.45, 'rgba(255,120,30,.34)'); gr.addColorStop(1, 'rgba(160,30,10,0)');
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(len, -Math.tan(half) * len * 1.05); g.lineTo(len, Math.tan(half) * len * 1.05); g.closePath(); g.fill();
  for (let i = 0; i < N; i++) {
    const u = ((i / N) + t * (1.3 + (i % 5) * .08)) % 1, sp = Math.sin(i * 12.9898 + t * 9 + i * u) * Math.tan(half) * len * u * .95, x = u * len, rr = (7 + u * 30 + (i % 3) * 3) * (k || 1);
    const col = u < .18 ? '255,248,190' : u < .5 ? '255,150,40' : '210,60,16';
    g.fillStyle = 'rgba(' + col + ',' + (.62 * (1 - u) + .08) + ')'; g.beginPath(); g.arc(x, sp, rr, 0, 7); g.fill();
  }
  g.restore();
}

function dgWing(q, r, ws, flap, en, t, fl) { // une aile (q = ±1) : os, doigts et membrane festonnée
  const S = [r * .18, q * r * .42], W = [r * (-.02 + flap * .25), q * r * (1.2 + flap * .35) * ws];
  const F = [[r * .62, q * r * 1.55 * ws], [r * .05, q * r * 1.82 * ws], [-r * .55, q * r * 1.62 * ws], [-r * .95, q * r * 1.12 * ws]].map((p, i) => [p[0] + flap * r * .2 * (i - 1), p[1] + q * flap * r * .3]);
  const B = [-r * .72, q * r * .34];
  g.save();
  const gr = g.createRadialGradient(S[0], S[1], r * .1, W[0], W[1], r * 1.6);
  gr.addColorStop(0, 'rgba(140,28,20,.96)'); gr.addColorStop(.6, 'rgba(90,16,16,.93)'); gr.addColorStop(1, 'rgba(46,8,14,.9)');
  g.fillStyle = fl > 0 ? 'rgba(255,255,255,.9)' : gr; g.strokeStyle = '#1a0606'; g.lineWidth = 3; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(S[0], S[1]); g.lineTo(W[0], W[1]); g.lineTo(F[0][0], F[0][1]);
  for (let i = 0; i < 3; i++) { const a = F[i], b = F[i + 1], mx = (a[0] + b[0]) / 2 * .78 + W[0] * .22, my = (a[1] + b[1]) / 2 * .78 + W[1] * .22; g.quadraticCurveTo(mx, my, b[0], b[1]); }
  g.quadraticCurveTo((F[3][0] + B[0]) / 2 * .8, (F[3][1] + B[1]) / 2 * .8, B[0], B[1]); g.closePath(); g.fill(); g.stroke();
  // veines
  g.strokeStyle = 'rgba(255,120,70,' + (en ? .5 + .25 * Math.sin(t * 6) : .22) + ')'; g.lineWidth = 1.5;
  for (const f of F) { g.beginPath(); g.moveTo(W[0], W[1]); g.lineTo(f[0], f[1]); g.stroke(); }
  g.beginPath(); g.moveTo(S[0], S[1]); g.lineTo(W[0] * .6 + B[0] * .4, W[1] * .6 + B[1] * .4); g.stroke();
  // os
  g.lineCap = 'round'; g.strokeStyle = '#d8c9a4'; g.lineWidth = 6; g.beginPath(); g.moveTo(S[0], S[1]); g.lineTo(W[0], W[1]); g.stroke();
  g.lineWidth = 3.4; for (const f of F) { g.beginPath(); g.moveTo(W[0], W[1]); g.lineTo(f[0], f[1]); g.stroke(); }
  g.fillStyle = '#e8d9b8'; for (const f of F) { g.beginPath(); g.arc(f[0], f[1], 3.4, 0, 7); g.fill(); }
  g.fillStyle = '#b39b73'; g.beginPath(); g.arc(W[0], W[1], 6, 0, 7); g.fill();
  g.restore();
}

function drawDragon(r, st, tp, en, fl, t, fx) { // repère local : +x = direction du boss ; fx (perso joueur) = {len, half, fly, k}
  const e = u => u * u * (3 - 2 * u), fin = en >= 2, rage = en >= 1, fly = !!(fx && fx.fly), BL = fx && fx.len || DBL, BH = fx && fx.half || DBH;
  const air = fly ? 1 : st == 7 ? Math.sin(Math.PI * Math.min(1, tp)) : 0, pul = .5 + .5 * Math.sin(t * (rage ? 8 : 3));
  // ----- aura de fureur -----
  if (fin) {
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + t * .8, rr = r * (1.55 + .12 * Math.sin(t * 5 + i * 2)), sz = 16 + 8 * Math.sin(t * 7 + i); const gx = Math.cos(a) * rr, gy = Math.sin(a) * rr, gr = g.createRadialGradient(gx, gy, 1, gx, gy, sz); gr.addColorStop(0, 'rgba(255,200,80,.7)'); gr.addColorStop(1, 'rgba(255,60,10,0)'); g.fillStyle = gr; g.beginPath(); g.arc(gx, gy, sz, 0, 7); g.fill(); }
    g.restore();
  }
  g.save();
  if (air) g.scale(1 + .3 * air, 1 + .3 * air);
  if (air) g.globalAlpha = .96;
  // ----- cercle d'annonce du coup de queue / de l'impact -----
  // (la zone circulaire est dessinée par drawBoss pour les autres boss ; ici on l'ajoute pour le dragon)
  // ----- rugissement : ondes de feu -----
  if (st == 4) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) { const k = (tp * 1.6 + i / 3) % 1; g.strokeStyle = 'rgba(255,140,50,' + (.6 * (1 - k)) + ')'; g.lineWidth = 8 * (1 - k) + 1; g.beginPath(); g.arc(0, 0, r * (1.1 + 1.6 * k), 0, 7); g.stroke(); } g.restore(); }
  // ----- queue -----
  const whip = st == 1 ? tp * .9 : st == 2 ? 1.1 : 0, amp = .2 + whip * .55, N = 15;
  const tail = [];
  for (let i = 0; i <= N; i++) { const u = i / N, sw = Math.sin(t * 2.3 - i * .42) * amp * (.25 + u) + (st == 2 ? 1.2 * u * u : st == 1 ? -.7 * tp * u : 0); tail.push([-r * (.62 + u * 1.55), sw * r * (.2 + u * .55)]); }
  for (let i = N; i > 0; i--) {
    const p = tail[i], u = i / N, rad = r * (.3 * (1 - u) + .045), q = tail[i - 1];
    g.strokeStyle = '#150505'; g.lineWidth = rad * 2 + 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(p[0], p[1]); g.stroke();
    g.strokeStyle = fl > 0 ? '#fff' : i % 2 ? '#7a1612' : '#8c1c16'; g.lineWidth = rad * 2; g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(p[0], p[1]); g.stroke();
    if (i % 2 == 0 && i < N - 1) { g.fillStyle = '#d8c9a4'; g.beginPath(); g.moveTo(p[0] + rad * .1, p[1] - rad * .2); g.lineTo(p[0] - rad * .7, p[1] - rad * 1.7); g.lineTo(p[0] - rad * 1.2, p[1] - rad * .2); g.closePath(); g.fill(); g.beginPath(); g.moveTo(p[0] + rad * .1, p[1] + rad * .2); g.lineTo(p[0] - rad * .7, p[1] + rad * 1.7); g.lineTo(p[0] - rad * 1.2, p[1] + rad * .2); g.closePath(); g.fill(); }
  }
  { const p = tail[N], q = tail[N - 1], a = Math.atan2(p[1] - q[1], p[0] - q[0]); g.save(); g.translate(p[0], p[1]); g.rotate(a); g.shadowColor = rage ? '#ff6a1a' : '#9fd0ff'; g.shadowBlur = rage ? 16 : 8; g.fillStyle = rage ? '#ffb070' : '#dfe6f0'; g.strokeStyle = '#2a1a1a'; g.lineWidth = 2; g.beginPath(); g.moveTo(r * .42, 0); g.lineTo(-r * .06, -r * .2); g.lineTo(-r * .2, 0); g.lineTo(-r * .06, r * .2); g.closePath(); g.fill(); g.stroke(); g.restore(); }
  // ----- pattes arrière -----
  const claw = (x, y, q, s) => { g.fillStyle = '#4a0e0c'; g.strokeStyle = '#150505'; g.lineWidth = 3; g.beginPath(); g.ellipse(x, y, r * .26 * s, r * .15 * s, q * .5, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#e8d9b8'; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(x + r * .2 * s, y + q * r * (.12 * s + i * .07)); g.lineTo(x + r * .42 * s, y + q * r * (.2 * s + i * .12)); g.lineTo(x + r * .22 * s, y + q * r * (.17 * s + i * .07)); g.closePath(); g.fill(); } };
  for (const q of [-1, 1]) claw(-r * .42, q * r * .58, q, 1);
  // ----- ailes -----
  const ws = st == 7 || fly ? .95 + .45 * air : st == 4 ? 1.2 : st == 1 ? 1.05 + .15 * tp : .86, flap = st == 7 || fly ? Math.sin(t * 15) * .6 : st == 4 ? -.15 + .1 * Math.sin(t * 10) : Math.sin(t * (rage ? 5 : 3.2)) * (.18 + (rage ? .1 : 0));
  dgWing(-1, r, ws, flap, rage, t, fl); dgWing(1, r, ws, flap, rage, t, fl);
  // ----- corps -----
  g.save();
  if (rage || st == 6 || st == 5) { g.shadowColor = '#ff5a1a'; g.shadowBlur = 18 + 12 * pul; }
  const bg = g.createLinearGradient(0, -r * .6, 0, r * .6); bg.addColorStop(0, '#5a100e'); bg.addColorStop(.5, '#a02a1c'); bg.addColorStop(1, '#5a100e');
  g.fillStyle = fl > 0 ? '#fff' : bg; g.strokeStyle = '#150505'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(r * .78, 0); g.bezierCurveTo(r * .7, -r * .55, -r * .2, -r * .66, -r * .78, -r * .34); g.lineTo(-r * .86, 0); g.lineTo(-r * .78, r * .34); g.bezierCurveTo(-r * .2, r * .66, r * .7, r * .55, r * .78, 0); g.closePath(); g.fill(); g.stroke();
  g.restore();
  // écailles
  g.save(); g.beginPath(); g.moveTo(r * .78, 0); g.bezierCurveTo(r * .7, -r * .55, -r * .2, -r * .66, -r * .78, -r * .34); g.lineTo(-r * .86, 0); g.lineTo(-r * .78, r * .34); g.bezierCurveTo(-r * .2, r * .66, r * .7, r * .55, r * .78, 0); g.closePath(); g.clip();
  g.strokeStyle = 'rgba(20,4,4,.42)'; g.lineWidth = 1.6;
  for (let row = -4; row <= 4; row++) for (let c = 0; c < 10; c++) { const x = -r * .8 + c * r * .17 + (row & 1 ? r * .085 : 0), y = row * r * .15; g.beginPath(); g.arc(x, y, r * .1, Math.PI * .1, Math.PI * .9); g.stroke(); }
  g.strokeStyle = 'rgba(255,170,110,.14)'; for (let row = -4; row <= 4; row++) for (let c = 0; c < 10; c++) { const x = -r * .8 + c * r * .17 + (row & 1 ? r * .085 : 0), y = row * r * .15 - 2; g.beginPath(); g.arc(x, y, r * .1, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); }
  // ventre clair sur les flancs
  g.fillStyle = 'rgba(255,190,120,.10)'; g.fillRect(-r, -r * .7, r * 2, r * .14); g.fillRect(-r, r * .56, r * 2, r * .14);
  // fissures de lave (rage)
  if (rage) { g.strokeStyle = 'rgba(255,' + (110 + 90 * pul | 0) + ',30,.95)'; g.lineWidth = 3; g.lineCap = 'round'; for (let i = 0; i < 6; i++) { const a = i * 1.05 + .4, x0 = Math.cos(a) * r * .1, y0 = Math.sin(a) * r * .1; g.beginPath(); g.moveTo(x0, y0); g.lineTo(Math.cos(a + .2) * r * .38, Math.sin(a + .2) * r * .38); g.lineTo(Math.cos(a - .1) * r * .64, Math.sin(a - .1) * r * .64); g.stroke(); } }
  g.restore();
  // crête dorsale
  for (let i = 0; i < 9; i++) { const x = r * .62 - i * r * .16, h = r * (.1 + .05 * Math.sin(i * 1.3 + 1)), s = 1 - i * .03; g.fillStyle = fl > 0 ? '#fff' : '#d8c9a4'; g.strokeStyle = '#2a1a1a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + r * .08, 0); g.lineTo(x - r * .02, -h * 1.1 * s); g.lineTo(x - r * .1, 0); g.lineTo(x - r * .02, h * 1.1 * s); g.closePath(); g.fill(); g.stroke(); if (rage) { g.fillStyle = 'rgba(255,150,40,' + (.35 + .3 * pul) + ')'; g.beginPath(); g.arc(x - r * .02, 0, h * .55, 0, 7); g.fill(); } }
  // ----- pattes avant -----
  for (const q of [-1, 1]) claw(r * .38 + (st == 1 ? tp * r * .12 : 0), q * r * .6, q, 1.1);
  // ----- cou + tête -----
  const hx = r * (st == 5 ? .98 : st == 6 ? 1.34 : st == 4 ? 1.08 : 1.18) + (st == 0 ? Math.sin(t * 2.1) * r * .03 : 0), hy = (st == 0 ? Math.sin(t * 1.4) * r * .05 : 0), hs = (st == 4 ? 1.12 : st == 5 ? 1.06 : 1) * (1 + .12 * air);
  g.lineCap = 'round'; g.strokeStyle = '#150505'; g.lineWidth = r * .46 + 5; g.beginPath(); g.moveTo(r * .5, 0); g.quadraticCurveTo(r * .85, hy * 2 + (st == 5 ? -r * .18 : 0), hx, hy); g.stroke();
  g.strokeStyle = fl > 0 ? '#fff' : '#8c1c16'; g.lineWidth = r * .46; g.beginPath(); g.moveTo(r * .5, 0); g.quadraticCurveTo(r * .85, hy * 2 + (st == 5 ? -r * .18 : 0), hx, hy); g.stroke();
  g.strokeStyle = 'rgba(20,4,4,.4)'; g.lineWidth = 1.6; for (let i = 0; i < 5; i++) { const u = .15 + i * .17, x = r * .5 + (hx - r * .5) * u; g.beginPath(); g.moveTo(x, hy * u - r * .2); g.lineTo(x - r * .04, hy * u + r * .2); g.stroke(); }
  g.save(); g.translate(hx, hy); g.scale(hs, hs);
  const jaw = st == 6 ? .62 : st == 5 ? .15 + .4 * e(tp) : st == 4 ? .5 + .1 * Math.sin(t * 20) : st == 1 ? .1 : .05 + .03 * Math.sin(t * 2);
  // cornes
  for (const q of [-1, 1]) {
    g.fillStyle = fl > 0 ? '#fff' : '#e8d9b8'; g.strokeStyle = '#2a1a1a'; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(-r * .02, q * r * .17); g.quadraticCurveTo(-r * .32, q * r * .22, -r * .58, q * r * .52); g.quadraticCurveTo(-r * .3, q * r * .36, -r * .12, q * r * .32); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(r * .06, q * r * .26); g.lineTo(-r * .04, q * r * .45); g.lineTo(r * .12, q * r * .31); g.closePath(); g.fill(); g.stroke();
  }
  // mâchoire inférieure
  g.save(); g.translate(-r * .02, 0); g.rotate(0); for (const q of [-1, 1]) { g.save(); g.rotate(q * jaw * .6); g.fillStyle = fl > 0 ? '#fff' : '#6a1410'; g.strokeStyle = '#150505'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(r * .56, q * r * .03); g.lineTo(r * .6, q * r * .1); g.lineTo(r * .06, q * r * .2); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#f4ecd8'; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(r * (.18 + i * .1), q * r * .04); g.lineTo(r * (.22 + i * .1), q * r * (.04 + .07)); g.lineTo(r * (.26 + i * .1), q * r * .04); g.closePath(); g.fill(); } g.restore(); } g.restore();
  // gueule : lueur intérieure
  if (jaw > .2) { const gl = g.createRadialGradient(r * .38, 0, 2, r * .38, 0, r * .4); gl.addColorStop(0, st == 6 ? 'rgba(255,250,200,.98)' : 'rgba(255,170,60,.9)'); gl.addColorStop(1, 'rgba(255,60,10,0)'); g.fillStyle = gl; g.beginPath(); g.arc(r * .38, 0, r * .4, 0, 7); g.fill(); }
  // crâne
  g.fillStyle = fl > 0 ? '#fff' : '#9c261a'; g.strokeStyle = '#150505'; g.lineWidth = 4;
  g.beginPath(); g.moveTo(-r * .22, 0); g.bezierCurveTo(-r * .22, -r * .34, r * .1, -r * .3, r * .32, -r * .14); g.lineTo(r * .66, -r * .07); g.lineTo(r * .68, 0); g.lineTo(r * .66, r * .07); g.lineTo(r * .32, r * .14); g.bezierCurveTo(r * .1, r * .3, -r * .22, r * .34, -r * .22, 0); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = 'rgba(255,200,150,.3)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-r * .1, 0); g.lineTo(r * .6, 0); g.stroke();
  for (const q of [-1, 1]) { g.fillStyle = '#d8c9a4'; g.beginPath(); g.moveTo(r * .24, q * r * .12); g.lineTo(r * .34, q * r * .26); g.lineTo(r * .4, q * r * .12); g.closePath(); g.fill(); } // arcades
  // narines + fumée
  g.fillStyle = '#150505'; for (const q of [-1, 1]) { g.beginPath(); g.arc(r * .6, q * r * .035, r * .02, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(80,60,60,' + (.18 + (st == 5 ? .25 * tp : 0)) + ')'; for (let i = 0; i < 3; i++) { const k = (t * .9 + i / 3) % 1; g.beginPath(); g.arc(r * (.7 + k * .5), Math.sin(i * 4 + t * 2) * r * .05, r * (.04 + k * .09), 0, 7); g.fill(); }
  // yeux
  for (const q of [-1, 1]) { g.shadowColor = rage ? '#ff2a1a' : '#ffd23a'; g.shadowBlur = 14; g.fillStyle = rage ? '#ff3a22' : '#ffd23a'; g.beginPath(); g.ellipse(r * .17, q * r * .15, r * .085, r * .05, q * .5, 0, 7); g.fill(); g.shadowBlur = 0; g.fillStyle = '#100000'; g.beginPath(); g.ellipse(r * .185, q * r * .15, r * .018, r * .045, q * .5, 0, 7); g.fill(); }
  g.restore();
  // ----- annonce du souffle : cône rouge + chaleur à la gueule -----
  if (st == 5) {
    const f = .4 + .35 * Math.sin(t * 24);
    for (const a of (fin ? [-.72, 0, .72] : [0])) { g.save(); g.rotate(a); g.fillStyle = 'rgba(255,50,20,' + (.05 + .13 * tp) + ')'; g.beginPath(); g.moveTo(0, 0); g.lineTo(DBL, -Math.tan(DBH) * DBL); g.lineTo(DBL, Math.tan(DBH) * DBL); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,120,70,' + f + ')'; g.lineWidth = 3; g.stroke(); g.strokeStyle = 'rgba(255,230,180,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(DBL * tp, 0); g.stroke(); g.restore(); }
    g.save(); g.globalCompositeOperation = 'lighter'; const mx = r * 1.7, gl = g.createRadialGradient(mx, 0, 1, mx, 0, 14 + 40 * tp); gl.addColorStop(0, 'rgba(255,230,140,.95)'); gl.addColorStop(1, 'rgba(255,80,20,0)'); g.fillStyle = gl; g.beginPath(); g.arc(mx, 0, 14 + 40 * tp, 0, 7); g.fill(); g.restore();
  }
  // ----- SOUFFLE -----
  if (st == 6) for (const a of (fin ? [-.72, 0, .72] : [0])) { g.save(); g.rotate(a); g.translate(r * 1.5, 0); dgFlame(BL - r * 1.5, BH, t, fin, fx && fx.k); g.restore(); }
  if (fl > 0) { g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); }
  g.restore();
}

// =====================================================================================
//  PERSO JOUEUR « Pyrax » : dragon (même dessin que le boss, en petit)
//   • Attaque : SOUFFLE DE FEU en cône (maintenir le tir). Les dégâts aux joueurs sont appliqués côté victime
//     (comme les balles) : chaque client envoie « br » (je souffle) + l'angle dans sa présence.
//   • Ultime « Envol » : vole PYT secondes -> invulnérable, un peu plus rapide, le souffle continue en l'air.
//     Brisé si le dragon entre dans une zone anti-pouvoirs.
// =====================================================================================
const PYL = 270, PYH = .3;   // portée du souffle (depuis le centre) et demi-angle du cône
const PYP = 55, PYM = 85;    // dégâts par seconde : sur les joueurs / sur bots, boss, sbires
const PYT = 6;               // durée de l'envol (s)

const pyIn = (ox, oy, a, tx, ty, r) => {
  const dx = tx - ox, dy = ty - oy, d = Math.hypot(dx, dy);
  if (d > PYL + r) return 0;
  if (d < r + 10) return 1;
  return Math.abs(angd(Math.atan2(dy, dx), a)) < PYH + Math.min(.5, r / d);
};

// Appelée à chaque image (joueur vivant) : envol, souffle de MON dragon, et dégâts reçus des souffles des autres
function pyUpd(dt, s, held) {
  if (s.dg && me.fy > 0 && inIx(me.x, me.y)) { me.fy = 0; feed.push({ t: 'Envol brisé par la zone anti-pouvoirs', l: 3 }); }
  if (s.dg && me.fy > 0) {
    me.fy -= dt; me.ri = Math.max(me.ri, .3); me.brn = 0; // invulnérable tant qu'il vole
    if (Math.random() < dt * 30) ptc(me.x + (Math.random() - .5) * 50, me.y + (Math.random() - .5) * 50, Math.random() < .5 ? '#ff8a2a' : '#e8d9b8');
    if (me.fy <= 0) { me.fy = 0; feed.push({ t: 'Pyrax se pose', l: 2 }); for (let i = 0; i < 24; i++) ptc(me.x, me.y, i % 2 ? '#ff8a2a' : '#e8d9b8'); }
  }
  me.br = s.dg && held && me.ro <= 0 && me.inv <= 0 && !me.god && !(me.lz > 0) ? 1 : 0;
  if (me.br) {
    me.fr = .6;
    const a = me.a, ox = me.x, oy = me.y, dm = PYM * dt * svDm(), myId = myPeer || 'me';
    for (const o of bots) if (o.hp > 0 && pyIn(ox, oy, a, o.x, o.y, o.r || 15) && los(ox, oy, o.x, o.y)) hitBot(o, dm);
    if (BS.al) {
      const d = Math.hypot(BS.x - ox, BS.y - oy);
      if (d - BS.r < PYL && Math.abs(angd(Math.atan2(BS.y - oy, BS.x - ox), a)) < PYH + Math.asin(Math.min(1, BS.r / Math.max(d, 1)))) bossHit(dm);
    }
    for (const m of MINL.slice()) if (pyIn(ox, oy, a, m.x, m.y, MNR)) minHit(m, dm);
    for (const o of DP) if (['tur', 'bot', 'trap', 'tp', 'sum'].includes(o.k) && o.own !== myId && pyIn(ox, oy, a, o.x, o.y, 12)) o.hp -= dm;
    if (Math.random() < dt * 40) { const u = 60 + Math.random() * (PYL - 80); ptc(ox + Math.cos(a) * u, oy + Math.sin(a) * u, Math.random() < .5 ? '#ff8a2a' : '#ffd23a'); }
    try { if (AC && !mute && Math.random() < dt * 7) tone(70 + Math.random() * 40, AC.currentTime, .12, 'sawtooth', .04); } catch (e) { }
  }
  // dégâts reçus : souffles des autres joueurs-dragons (appliqués chez la victime)
  if (SV.mode < 2 && me.al) for (const k in R) {
    const o = R[k];
    if (!o.br || !o.al || !CH[o.c] || !CH[o.c].dg) continue;
    if (pyIn(o.x, o.y, o.a, me.x, me.y, CH[me.c].r) && los(o.x, o.y, me.x, me.y)) {
      const f = me.fl, h0 = me.hp;
      hurtMe(PYP * dt, k);
      if (me.al && me.hp < h0) { me.fl = f > 0 ? f : .04; me.brn = Math.max(me.brn || 0, 1.5); me.bro = k; }
    }
  }
}

// Dessin du perso (repère local : +x = visée) : dragon du boss à l'échelle du joueur ; en vol : grandes ailes battantes
function drawPyrax(r, br, fy, fl, t) {
  drawDragon(r, br ? 6 : 0, 0, fy ? 1 : 0, fl, t, { len: fy ? PYL / 1.3 : PYL, half: PYH, fly: fy, k: .5 });
}
