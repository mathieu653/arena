// exclusifs.js — dessins PERSONNALISÉS des personnages exclusifs (sec = 1 ou 2).
// Chargé après game.js et dragon.js. Chaque exclusif a son propre dessin, dans le style de son boss :
// il ne change JAMAIS avec les skins / packs / caisses (corps, arme et rang ne s'appliquent pas).
//   Magmaar → golem de lave · Tong Tong Sahur → tambour de bois + batte · Nécro-Sire → nécromancien spectral
//   Éclipse → astre noir et sa couronne · Crocodile → crocodile vu du dessus · Pyrax → dragon (dragon.js)
// drawExcl(s, ex, fl, t) : repère local, +x = visée. ex = { sw (coup en cours), fr (vient de tirer), cs (nage), br, fy }
// Renvoie 1 si le perso a un dessin dédié (sinon game.js garde le dessin classique).

function drawExcl(s, ex, fl, t) {
  ex = ex || {};
  if (s.dg) { drawPyrax(s.r * 1.5, ex.br, ex.fy, fl, t); return 1; }
  if (s.cr) { exCroc(s, ex, fl, t); return 1; }
  if (s.ab == 'quake') { exMagma(s, ex, fl, t); return 1; }
  if (s.ab == 'nsum') { exNecro(s, ex, fl, t); return 1; }
  if (s.ml) { exTong(s, ex, fl, t); return 1; }
  if (s.ab == 'eclipse') { exEclipse(s, ex, fl, t); return 1; }
  return 0;
}

// ---------- Magmaar : le golem du boss, à l'échelle du joueur (poings en avant quand il tire) ----------
function exMagma(s, ex, fl, t) {
  const k = s.r * 1.5 / BR;
  g.save(); g.scale(k, k);
  drawMagma(BR, ex.fr ? 2 : 0, 1, ex.fr ? 1 : 0, fl, t);
  g.restore();
  // braises
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 4; i++) {
    const p = (t * .8 + i * .25) % 1, a = i * 1.9 + t * .6;
    g.fillStyle = 'rgba(255,' + (120 + i * 25) + ',40,' + (.8 * (1 - p)) + ')';
    g.beginPath(); g.arc(Math.cos(a) * s.r * (.4 + p), Math.sin(a) * s.r * (.4 + p), 2.6 * (1 - p) + .6, 0, 7); g.fill();
  }
  g.restore();
}

// ---------- Nécro-Sire : le nécromancien spectral du boss (mains tendues quand il tire) ----------
function exNecro(s, ex, fl, t) {
  const k = s.r * 1.5 / BR;
  g.save(); g.scale(k, k);
  drawNecro(BR, ex.fr ? 2 : 0, 1, 0, fl, t);
  g.restore();
}

// ---------- Tong Tong Sahur : tambour de bois, yeux écarquillés, batte qui balaie l'arc de frappe ----------
function exTong(s, ex, fl, t) {
  const r = s.r * 1.45, sw = ex.sw > 0 ? 1 - ex.sw / .25 : -1;
  const an = sw < 0 ? .55 + Math.sin(t * 4) * .04 : -s.ma + sw * 2 * s.ma, L = s.mr - 6, x0 = r * .55;
  if (sw >= 0) { // traînée du coup
    g.save(); g.strokeStyle = 'rgba(255,240,200,' + (.55 * (1 - sw)) + ')'; g.lineWidth = 9; g.lineCap = 'round';
    g.beginPath(); g.arc(0, 0, L - 10, -s.ma, an); g.stroke(); g.restore();
  }
  // batte
  g.save(); g.rotate(an);
  g.fillStyle = '#dcae70'; g.strokeStyle = '#4a2c10'; g.lineWidth = 2.6; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x0, -3.2); g.lineTo(x0 + (L - x0) * .5, -4.4); g.lineTo(L - 9, -8.5); g.arc(L - 9, 0, 8.5, -Math.PI / 2, Math.PI / 2); g.lineTo(x0 + (L - x0) * .5, 4.4); g.lineTo(x0, 3.2); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = 'rgba(74,44,16,.55)'; g.lineWidth = 2;
  for (const k of [.34, .52, .7]) { const x = x0 + (L - x0) * k; g.beginPath(); g.moveTo(x, -6); g.lineTo(x, 6); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(L * .5 + 4, -1.8, (L - x0) * .34, 1.4, 0, 0, 7); g.fill();
  g.restore();
  // tambour
  const gr = g.createRadialGradient(-r * .25, -r * .25, r * .1, 0, 0, r); gr.addColorStop(0, '#e8bb82'); gr.addColorStop(1, '#a56b30');
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
  g.strokeStyle = 'rgba(90,50,15,.42)'; g.lineWidth = 1.6; for (const k of [.34, .55, .76]) { g.beginPath(); g.arc(0, 0, r * k, 0, 7); g.stroke(); }
  g.strokeStyle = '#6b3f18'; g.lineWidth = 1.8; g.lineJoin = 'round'; // cordes de tension en zigzag sur le bord
  g.beginPath(); for (let i = 0; i <= 20; i++) { const a = i / 20 * 6.283, rr = r * (i % 2 ? .83 : .97); i ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.moveTo(rr, 0); } g.stroke();
  g.strokeStyle = '#3b2410'; g.lineWidth = 3.4; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
  if (fl > 0) { g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); }
  // yeux (rouges pendant le coup) + bouche
  for (const q of [-1, 1]) {
    g.fillStyle = '#fff'; g.strokeStyle = '#3b2410'; g.lineWidth = 2.4; g.beginPath(); g.arc(r * .42, q * r * .34, r * .23, 0, 7); g.fill(); g.stroke();
    g.fillStyle = sw >= 0 ? '#c01010' : '#111'; g.beginPath(); g.arc(r * .5 + (sw >= 0 ? .8 : 0), q * r * .33, r * .1, 0, 7); g.fill();
  }
  g.strokeStyle = '#2a1508'; g.lineWidth = 3.2; g.lineCap = 'round';
  g.beginPath(); g.arc(r * .3, 0, r * .3, sw >= 0 ? -1.15 : -.95, sw >= 0 ? 1.15 : .95); g.stroke(); g.lineCap = 'butt';
  // main qui tient la batte
  g.save(); g.rotate(an); g.fillStyle = '#c98f50'; g.strokeStyle = '#3b2410'; g.lineWidth = 2.4; g.beginPath(); g.arc(r * .95, 0, r * .26, 0, 7); g.fill(); g.stroke(); g.restore();
}

// ---------- Éclipse : un astre noir cerclé d'une couronne violette, croissant dans le dos, éclats en orbite ----------
function exEclipse(s, ex, fl, t) {
  const r = s.r * 1.3, pul = .5 + .5 * Math.sin(t * 3);
  g.save(); g.globalCompositeOperation = 'lighter'; // rayons de la couronne
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * 6.283 + t * .45, len = r * (1.55 + .4 * Math.sin(t * 3 + i * 1.7) + (i % 2 ? .0 : .35)), w = .09;
    g.fillStyle = i % 2 ? 'rgba(190,120,255,.34)' : 'rgba(150,90,255,.2)';
    g.beginPath(); g.moveTo(Math.cos(a - w) * r * .95, Math.sin(a - w) * r * .95); g.lineTo(Math.cos(a) * len, Math.sin(a) * len); g.lineTo(Math.cos(a + w) * r * .95, Math.sin(a + w) * r * .95); g.closePath(); g.fill();
  }
  const hg = g.createRadialGradient(0, 0, r * .9, 0, 0, r * 1.8); hg.addColorStop(0, 'rgba(200,150,255,' + (.5 + .2 * pul) + ')'); hg.addColorStop(1, 'rgba(120,60,255,0)');
  g.fillStyle = hg; g.beginPath(); g.arc(0, 0, r * 1.8, 0, 7); g.fill();
  g.restore();
  // croissant dans le dos
  const cg = g.createLinearGradient(-r * 1.5, 0, -r * .6, 0); cg.addColorStop(0, '#f2e4ff'); cg.addColorStop(1, '#9a5bff');
  g.fillStyle = cg; g.strokeStyle = '#1a0a30'; g.lineWidth = 2;
  g.beginPath(); g.arc(0, 0, r * 1.42, Math.PI * .66, Math.PI * 1.34); g.arc(-r * .34, 0, r * 1.18, Math.PI * 1.34, Math.PI * .66, true); g.closePath(); g.fill(); g.stroke();
  // disque sombre
  g.save(); g.shadowColor = '#b46bff'; g.shadowBlur = 12 + 6 * pul;
  const bg = g.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); bg.addColorStop(0, '#2d1b4d'); bg.addColorStop(.7, '#0d0618'); bg.addColorStop(1, '#030107');
  g.fillStyle = bg; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.restore();
  g.strokeStyle = '#b46bff'; g.lineWidth = 2.6; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
  g.strokeStyle = 'rgba(255,240,255,.95)'; g.lineWidth = 3.2; g.lineCap = 'round'; g.beginPath(); g.arc(0, 0, r, Math.PI * .72, Math.PI * 1.28); g.stroke(); g.lineCap = 'butt'; // anneau de diamant
  g.strokeStyle = 'rgba(180,107,255,.35)'; g.lineWidth = 1.4; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(0, 0, r * (.4 + i * .2), t * .8 + i, t * .8 + i + 1.3); g.stroke(); } // runes
  if (fl > 0) { g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); }
  // yeux
  for (const q of [-1, 1]) {
    g.save(); g.shadowColor = '#e8c8ff'; g.shadowBlur = 10; g.fillStyle = '#f4e6ff'; g.beginPath(); g.ellipse(r * .42, q * r * .28, r * .2, r * .08, q * .55, 0, 7); g.fill(); g.restore();
  }
  // éclats en orbite
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) {
    const a = t * 1.6 + i * 2.094, d = r * 1.72 + Math.sin(t * 4 + i) * 2; g.fillStyle = i % 2 ? '#fff' : '#c89bff';
    g.save(); g.translate(Math.cos(a) * d, Math.sin(a) * d); g.rotate(a * 2); g.beginPath(); g.moveTo(0, -4.5); g.lineTo(2.6, 0); g.lineTo(0, 4.5); g.lineTo(-2.6, 0); g.closePath(); g.fill(); g.restore();
  }
  if (ex.fr) { const mg = g.createRadialGradient(r * 1.15, 0, 1, r * 1.15, 0, 13); mg.addColorStop(0, 'rgba(240,215,255,.9)'); mg.addColorStop(1, 'rgba(160,90,255,0)'); g.fillStyle = mg; g.beginPath(); g.arc(r * 1.15, 0, 13, 0, 7); g.fill(); }
  g.restore();
}

// ---------- Crocodile : vu du dessus — queue sinueuse, 4 pattes, plaques dorsales, mâchoires qui claquent ----------
function exCroc(s, ex, fl, t) {
  const r = s.r, sw = ex.sw > 0 ? 1 - ex.sw / .25 : -1, swim = !!ex.cs;
  const open = sw < 0 ? .16 + Math.sin(t * 3) * .03 : Math.sin(sw * Math.PI) * .85, L = r + 34, fq = swim ? 13 : 5;
  const G1 = fl > 0 ? '#fff' : '#2c7a3c', G2 = fl > 0 ? '#fff' : '#1a4d27', OUT = '#0b2a13';
  // queue
  const N = 11, tl = [];
  for (let i = 0; i <= N; i++) { const u = i / N; tl.push([-r * (.7 + u * 2.5), Math.sin(t * fq - i * .62) * r * (.12 + .62 * u) * (swim ? 1.35 : 1)]); }
  for (let i = N; i > 0; i--) {
    const p = tl[i], q = tl[i - 1], w = r * (.62 * (1 - i / N) + .07);
    g.lineCap = 'round'; g.strokeStyle = OUT; g.lineWidth = w * 2 + 3; g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(p[0], p[1]); g.stroke();
    g.strokeStyle = i % 2 ? G1 : G2; g.lineWidth = w * 2; g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(p[0], p[1]); g.stroke();
    if (i % 2 == 0 && i < N - 1) { g.fillStyle = '#0e3318'; g.beginPath(); g.moveTo(p[0] + 2, p[1] - 1); g.lineTo(p[0] - 3, p[1] - w - 2.5); g.lineTo(p[0] - 5, p[1] - 1); g.fill(); g.beginPath(); g.moveTo(p[0] + 2, p[1] + 1); g.lineTo(p[0] - 3, p[1] + w + 2.5); g.lineTo(p[0] - 5, p[1] + 1); g.fill(); }
  }
  g.lineCap = 'butt';
  // pattes
  const leg = (x, y, q, ph) => {
    const sp = swim ? .35 : 1, k = swim ? 0 : Math.sin(t * 6 + ph) * .25;
    g.save(); g.translate(x, y); g.rotate(q * (.9 + k)); g.fillStyle = G2; g.strokeStyle = OUT; g.lineWidth = 2;
    g.beginPath(); g.ellipse(r * .32 * sp + 2, 0, r * .42 * sp + 2, r * .17, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#efe9d2'; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(r * .62 * sp + 3, i * 2.2 - .8); g.lineTo(r * .62 * sp + 8, i * 3.2); g.lineTo(r * .62 * sp + 3, i * 2.2 + .8); g.fill(); }
    g.restore();
  };
  leg(r * .5, -r * .62, -1, 0); leg(r * .5, r * .62, 1, 3.1); leg(-r * .6, -r * .6, -1, 3.1); leg(-r * .6, r * .6, 1, 0);
  // corps
  const bg = g.createLinearGradient(0, -r * .85, 0, r * .85); bg.addColorStop(0, G2); bg.addColorStop(.5, G1); bg.addColorStop(1, G2);
  g.fillStyle = bg; g.strokeStyle = OUT; g.lineWidth = 3; g.beginPath(); g.ellipse(-r * .05, 0, r * 1.45, r * .82, 0, 0, 7); g.fill(); g.stroke();
  g.save(); g.beginPath(); g.ellipse(-r * .05, 0, r * 1.45, r * .82, 0, 0, 7); g.clip();
  g.strokeStyle = 'rgba(8,38,16,.5)'; g.lineWidth = 1.3; // écailles
  for (let row = -3; row <= 3; row++) for (let c = -4; c <= 4; c++) { const x = c * r * .34 + (row & 1 ? r * .17 : 0), y = row * r * .26; g.beginPath(); g.arc(x, y, r * .15, .2, Math.PI - .2); g.stroke(); }
  g.fillStyle = 'rgba(210,235,150,.14)'; g.fillRect(-r * 1.6, r * .52, r * 3.2, r * .4); g.fillRect(-r * 1.6, -r * .92, r * 3.2, r * .4);
  g.restore();
  // plaques dorsales (2 rangées)
  for (let i = 0; i < 7; i++) for (const q of [-1, 1]) {
    const x = r * .95 - i * r * .3, y = q * r * .17; g.fillStyle = fl > 0 ? '#fff' : '#0e3318'; g.strokeStyle = '#06180b'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(x + r * .12, y - 3.2); g.lineTo(x - r * .1, y - 3.2); g.lineTo(x - r * .15, y); g.lineTo(x - r * .1, y + 3.2); g.lineTo(x + r * .12, y + 3.2); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = 'rgba(160,230,140,.45)'; g.beginPath(); g.moveTo(x - r * .06, y - 1.2); g.lineTo(x - r * .1, y); g.lineTo(x - r * .06, y + 1.2); g.fill();
  }
  // mâchoires
  for (const q of [-1, 1]) {
    g.save(); g.rotate(q * open * .5); g.fillStyle = q > 0 ? (fl > 0 ? '#fff' : '#17421f') : G2; g.strokeStyle = OUT; g.lineWidth = 2;
    g.beginPath(); g.moveTo(r * .55, 0); g.lineTo(r * .8, q * (r * .5)); g.lineTo(L - 12, q * 7.5); g.quadraticCurveTo(L + 2, q * 6, L, q * 2); g.lineTo(L, 0); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { const x = r * .85 + i * (L - r - 6) / 4.4; g.beginPath(); g.moveTo(x - 2, q * 2.2); g.lineTo(x, q * (2.2 + (open > .3 ? 6.5 : 3.8))); g.lineTo(x + 2, q * 2.2); g.fill(); }
    g.fillStyle = '#06180b'; g.beginPath(); g.arc(L - 7, q * 3.4, 1.5, 0, 7); g.fill(); // narine
    g.restore();
  }
  if (open > .3) { g.fillStyle = 'rgba(200,60,70,.55)'; g.beginPath(); g.moveTo(r * .8, 0); g.lineTo(L - 10, -3); g.lineTo(L - 10, 3); g.closePath(); g.fill(); } // gueule ouverte
  // yeux sur bosses
  for (const q of [-1, 1]) {
    g.fillStyle = G1; g.strokeStyle = OUT; g.lineWidth = 2; g.beginPath(); g.arc(r * .62, q * r * .48, r * .24, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#ffd23a'; g.beginPath(); g.arc(r * .66, q * r * .48, r * .13, 0, 7); g.fill();
    g.fillStyle = '#100'; g.beginPath(); g.ellipse(r * .68, q * r * .48, r * .035, r * .1, 0, 0, 7); g.fill();
  }
}
