// chat.js — chat en jeu, transparent, en haut à gauche.
// Il affiche aussi l'ancien « feed » (qui a tué qui, paliers, annonces…) : tout passe maintenant dans le chat.
// Touche T (ou Entrée pendant une partie) pour écrire, Entrée pour envoyer, Échap pour annuler.
const CHAT = [], CHX = 14, CHY = 36, CHW = 360, CHL = 16, CHKEEP = 60;
let chOpen = 0, chInp = null;
const chBlocked = () => psk || st || shop || bp || menuOpen || quitAsk;
const chPlaying = () => mode == 1 && ph.n == 0 && !chBlocked();
const chipR = { x: CHX, y: CHY + 9 * CHL + 6, w: 72, h: 20 };

function chWrap(txt, max) { // coupe un texte en lignes de largeur max
  g.save(); g.font = 'bold 13px' + F2;
  const out = []; let cur = '';
  for (let w of String(txt).split(' ')) {
    while (g.measureText(w).width > max) { // mot trop long : on le coupe
      let k = w.length; while (k > 1 && g.measureText(w.slice(0, k)).width > max) k--;
      if (cur) { out.push(cur); cur = ''; }
      out.push(w.slice(0, k)); w = w.slice(k);
    }
    const t = cur ? cur + ' ' + w : w;
    if (cur && g.measureText(t).width > max) { out.push(cur); cur = w; } else cur = t;
  }
  if (cur) out.push(cur);
  g.restore(); return out.length ? out : [''];
}
const chHue = (n) => { let h = 0; for (const c of String(n)) h = (h * 31 + c.charCodeAt(0)) % 360; return 'hsl(' + h + ',75%,72%)'; };
function chatPush(kind, name, txt, opt) {
  opt = opt || {};
  const pre = kind == 'chat' ? (opt.adm ? '🛡 ' : '') + name + ' : ' : '';
  CHAT.push({ kind, pre, txt, lines: chWrap(pre + txt, CHW), col: kind == 'kill' ? '#ff9c8a' : kind == 'sys' ? '#f0e1c8' : '#ffffff', nc: opt.adm ? '#ffd24a' : opt.me ? '#7ad0ff' : chHue(name), t: performance.now() });
  if (CHAT.length > CHKEEP) CHAT.shift();
}
function chatDrain() { // reprend tout ce que le jeu écrivait en haut à gauche
  if (!feed.length) return;
  for (const f of feed) chatPush(f.k ? 'kill' : 'sys', '', f.t);
  feed.length = 0;
}
function chatRecv(d, from) {
  const n = String(d.n || '?').slice(0, 14), txt = String(d.txt || '').slice(0, 100); if (!txt) return;
  chatPush('chat', n, txt, { adm: d.a, me: (from && from === myPeer) || n === SV.name });
}
function chatOpen() {
  if (chBlocked()) return;
  chOpen = 1; for (const k in K) K[k] = 0; M.d = 0;
  chInp.value = ''; chInp.hidden = false; chatPlace(0); setTimeout(() => chInp.focus(), 0);
}
function chatClose() { chOpen = 0; chInp.hidden = true; chInp.blur(); }
function chatSend() {
  const txt = chInp.value.replace(/\s+/g, ' ').trim().slice(0, 100);
  if (txt) { if (net.up()) net.send('chat', { txt }); else chatPush('chat', SV.name, txt, { me: 1 }); }
  chatClose();
}
function chatPlace(y) { // place la zone de saisie sous les messages, à l'échelle du canvas
  const r = c.getBoundingClientRect(), s = r.width / W, st2 = chInp.style;
  st2.left = (r.left + CHX * s) + 'px'; st2.top = (r.top + y * s) + 'px'; st2.width = (CHW * s) + 'px'; st2.height = (24 * s) + 'px'; st2.fontSize = (13 * s) + 'px';
}
function chatDraw() {
  if (chOpen && chBlocked()) chatClose();
  if (!chOpen && !chPlaying()) return;
  const now = performance.now(), max = chOpen ? 14 : 9, rows = [];
  for (let i = CHAT.length - 1; i >= 0 && rows.length < max; i--) {
    const e = CHAT[i], age = (now - e.t) / 1000, al = chOpen ? 1 : age < 10 ? 1 : Math.max(0, 1 - (age - 10) / 4);
    if (al <= 0) break;
    for (let j = e.lines.length - 1; j >= 0 && rows.length < max; j--) rows.unshift({ e, j, al });
  }
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.textAlign = 'left'; g.font = 'bold 13px' + F2; g.lineJoin = 'round';
  if (chOpen) { g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(CHX - 6, CHY - 6, CHW + 12, rows.length * CHL + 8 + 34); }
  rows.forEach((r, i) => {
    const y = CHY + i * CHL + 12, line = r.e.lines[r.j]; g.globalAlpha = r.al;
    const draw = (txt, x, col) => { g.strokeStyle = 'rgba(0,0,0,.8)'; g.lineWidth = 3; g.strokeText(txt, x, y); g.fillStyle = col; g.fillText(txt, x, y); };
    if (r.e.kind == 'chat' && r.j == 0 && line.startsWith(r.e.pre)) { const w = g.measureText(r.e.pre).width; draw(r.e.pre, CHX, r.e.nc); draw(line.slice(r.e.pre.length), CHX + w, r.e.col); }
    else draw(line, CHX, r.e.col);
  });
  g.globalAlpha = 1;
  if (chOpen) chatPlace(CHY + rows.length * CHL + 6);
  else { // petit rappel discret (et bouton pour le tactile)
    const hv = inB(chipR, M.x, M.y); g.globalAlpha = hv ? .9 : .45; g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(chipR.x, chipR.y, chipR.w, chipR.h); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1; g.strokeRect(chipR.x, chipR.y, chipR.w, chipR.h);
    g.fillStyle = '#fff'; g.font = '12px' + F2; g.textAlign = 'center'; g.fillText(TV.on ? '💬 Chat' : 'T · Chat', chipR.x + chipR.w / 2, chipR.y + 14);
  }
  g.restore();
}

// ---------- branchements ----------
{
  chInp = document.createElement('input'); chInp.id = 'chatInp'; chInp.hidden = true; chInp.maxLength = 100; chInp.autocomplete = 'off'; chInp.spellcheck = false; chInp.placeholder = 'Message… (Entrée : envoyer · Échap : annuler)';
  document.body.appendChild(chInp);
  for (const ev of ['keydown', 'keyup', 'keypress']) chInp.addEventListener(ev, (e) => {
    e.stopPropagation(); // le jeu ne doit pas réagir aux lettres tapées
    if (ev == 'keydown') { if (e.key == 'Enter') { e.preventDefault(); chatSend(); } else if (e.key == 'Escape') { e.preventDefault(); chatClose(); } }
  });
  chInp.addEventListener('blur', () => { if (chOpen) setTimeout(() => { if (chOpen && document.activeElement !== chInp && !chInp.hidden && !('ontouchstart' in window)) chInp.focus(); }, 0); });
  const _up = upd; upd = function (dt) { chatDrain(); _up(dt); };
  const _ov = overlays; overlays = function () { _ov(); chatDraw(); };
  const _ne = netEvent; netEvent = function (t, d, from) { if (t == 'chat') { chatRecv(d || {}, from); return; } _ne(t, d, from); };
  addEventListener('keydown', (e) => {
    if (chOpen || e.ctrlKey || e.metaKey || e.altKey || chBlocked()) return;
    if (e.code == 'KeyT' || (e.code == 'Enter' && chPlaying())) { e.preventDefault(); chatOpen(); }
  });
  const hit = (e, t) => { if (chOpen || !chPlaying()) return; const r = c.getBoundingClientRect(), x = (t.clientX - r.left) * W / r.width, y = (t.clientY - r.top) * H / r.height; if (inB(chipR, x, y)) { e.stopImmediatePropagation(); chatOpen(); } };
  c.addEventListener('mousedown', (e) => hit(e, e), true);
  c.addEventListener('touchstart', (e) => { if (e.changedTouches.length) hit(e, e.changedTouches[0]); }, { capture: true, passive: true });
}
