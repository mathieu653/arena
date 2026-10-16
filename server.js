// Serveur Arène : fichiers statiques + relais WebSocket (présence 20 Hz, tirs, éliminations)
const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');
const PUB = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  const file = path.join(PUB, path.normalize(url === '/' ? 'index.html' : url));
  if (!file.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
});

const wss = new WebSocketServer({ server, maxPayload: 2048 });
const players = new Map();
let counter = 0, dirty = false;
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const ADMIN = process.env.ADMIN_KEY || '';
// Classement Radiant (top 10) : en mémoire + sauvegardé dans leaderboard.json
// (sur l'offre gratuite de Render, le disque est effacé à chaque redéploiement)
const LBFILE = path.join(__dirname, 'leaderboard.json');
let LB = {}, lbDirty = false;
try { LB = JSON.parse(fs.readFileSync(LBFILE, 'utf8')); } catch {}
setInterval(() => { if (lbDirty) { lbDirty = false; try { fs.writeFileSync(LBFILE, JSON.stringify(LB)); } catch {} } }, 30000);

// Horloge de partie partagée : le temps peut être avancé quand tous les joueurs sont prêts
const PL = 300, SC = 10, VT = 15, CY = PL + SC + VT; // jeu, scores, vote (secondes)
let skip = 0;
const sNow = () => Date.now() + skip;
 // définis ADMIN_KEY dans les variables d'environnement de Render

wss.on('connection', (ws, req) => {
  req.socket.setNoDelay(true);
  const id = 'p' + (++counter).toString(36);
  const me = { ws, presence: {}, shots: 0, since: Date.now() };
  players.set(id, me);
  ws.send(JSON.stringify({ t: 'hello', id, time: sNow() }));
  ws.on('message', (raw) => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    if (!m || typeof m.t !== 'string') return;
    if (m.t === 'presence' && m.d && typeof m.d === 'object') {
      const d = m.d;
      me.presence = { x: num(d.x), y: num(d.y), a: num(d.a), hp: num(d.hp), c: num(d.c) & 15, s: num(d.s) & 7, b: Math.min(100, Math.max(0, num(d.b))), k: num(d.k),
        al: d.al ? 1 : 0, iv: d.iv ? 1 : 0, sh: d.sh ? 1 : 0, v: d.v == null ? null : num(d.v) & 3, m: num(d.m) & 7, n: String(d.n || '').slice(0, 14), pk: num(d.pk) & 15, rd: Math.max(0, Math.min(1e9, Math.floor(num(d.rd)))), rv: d.rv ? 1 : 0, md: num(d.md) & 1, pl: d.pl ? 1 : 0, dd: num(d.dd) & 255, rk: num(d.rk) & 7 };
      dirty = true;
    } else if (m.t === 'admin_login') {
      me.tries = (me.tries || 0) + 1;
      const ok = ADMIN && me.tries <= 5 && m.d === ADMIN;
      if (ok) me.admin = true;
      ws.send(JSON.stringify({ t: ok ? 'admin_ok' : 'admin_no' }));
    } else if (m.t === 'adm' && me.admin && m.d) {
      const tg = players.get(String(m.d.to));
      if (m.d.act === 'reset' && tg && tg.uid && LB[tg.uid]) { delete LB[tg.uid]; lbDirty = true; } // retire le joueur du top Radiant
      if (tg && tg.ws.readyState === 1) tg.ws.send(JSON.stringify({ t: 'adm', d: { act: String(m.d.act).slice(0, 8), v: num(m.d.v) } }));
    } else if (m.t === 'lb_post' && m.d) {
      const uid = String(m.d.uid || '').slice(0, 24).replace(/[^\w-]/g, '');
      if (uid && Date.now() - (me.lbT || 0) > 3000) {
        me.lbT = Date.now(); me.uid = uid;
        const rr = Math.max(0, Math.min(9999, num(m.d.rr))), e = LB[uid] || { best: 0 };
        LB[uid] = { name: String(m.d.name || '?').slice(0, 14), rr, best: Math.max(e.best || 0, rr), t: Date.now() };
        lbDirty = true;
      }
    } else if (m.t === 'lb_get') {
      const list = Object.values(LB).sort((a, b) => b.best - a.best || b.t - a.t).slice(0, 10).map((e) => ({ n: e.name, r: e.rr, b: e.best }));
      ws.send(JSON.stringify({ t: 'lb', list }));
    } else if (['shot', 'kill', 'dep', 'act', 'flash', 'plate', 'orb', 'rm'].includes(m.t)) {
      if (m.d && m.d.gd && !me.admin) m.d.gd = 0; // le laser géant est réservé à l'admin
      if (Date.now() - me.since > 1000) { me.since = Date.now(); me.shots = 0; }
      if (++me.shots > 40) return; // anti-spam
      const out = JSON.stringify({ t: m.t, d: m.d, from: id });
      for (const [pid, p] of players) if (pid !== id && p.ws.readyState === 1) p.ws.send(out);
    }
  });
  ws.on('close', () => { players.delete(id); dirty = true; });
});

setInterval(() => {
  if (!dirty) return;
  dirty = false;
  const msg = JSON.stringify({ t: 'peers', list: [...players].map(([id, p]) => ({ id, presence: p.presence })) });
  for (const p of players.values()) if (p.ws.readyState === 1) p.ws.send(msg);
}, 33);

// Si tous les joueurs ont cliqué sur « Prêt » pendant les scores ou le vote, on passe à la phase suivante
setInterval(() => {
  if (players.size === 0) return;
  const t = sNow() / 1000, e = t % CY, id = Math.floor(t / CY);
  const n = e < PL ? 0 : e < PL + SC ? 1 : 2;
  if (n === 0) return;
  const token = id * 3 + n + 1;
  for (const p of players.values()) if (p.presence.rd !== token) return;
  skip += Math.ceil(((n === 1 ? PL + SC : CY) - e) * 1000) + 50;
  const msg = JSON.stringify({ t: 'sync', time: sNow() });
  for (const p of players.values()) if (p.ws.readyState === 1) p.ws.send(msg);
}, 250);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Arène : http://localhost:' + PORT));
