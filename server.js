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

wss.on('connection', (ws) => {
  const id = 'p' + (++counter).toString(36);
  const me = { ws, presence: {}, shots: 0, since: Date.now() };
  players.set(id, me);
  ws.send(JSON.stringify({ t: 'hello', id, time: Date.now() }));
  ws.on('message', (raw) => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    if (!m || typeof m.t !== 'string') return;
    if (m.t === 'presence' && m.d && typeof m.d === 'object') {
      const d = m.d;
      me.presence = { x: num(d.x), y: num(d.y), a: num(d.a), hp: num(d.hp), c: num(d.c) & 3, k: num(d.k),
        al: d.al ? 1 : 0, iv: d.iv ? 1 : 0, sh: d.sh ? 1 : 0, v: d.v == null ? null : num(d.v) & 3, m: num(d.m) & 3 };
      dirty = true;
    } else if (m.t === 'shot' || m.t === 'kill') {
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
}, 50);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Arène : http://localhost:' + PORT));
