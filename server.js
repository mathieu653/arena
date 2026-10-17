// Serveur Arène : fichiers statiques + relais WebSocket (présence 30 Hz, tirs, éliminations)
// Salons : 0 = Classique, 1 = Classé, 2 = Événement spécial (boss), -1 = menu (hors salon)
const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');
// Dossier de données (comptes + classement). Sur un hébergeur avec disque persistant, mets DATA_DIR vers ce disque (ex. /var/data)
const DATA = process.env.DATA_DIR || path.join(__dirname, 'data');
try { fs.mkdirSync(DATA, { recursive: true }); } catch {}
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

const wss = new WebSocketServer({ server, maxPayload: 32768 });
const players = new Map();
let counter = 0, dirty = false, cntDirty = true;
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const ADMIN = process.env.ADMIN_KEY || 'math'; // code admin par défaut : « math » (change-le avec la variable d'environnement ADMIN_KEY)
const EV = 2;

// Classement (top 10, tous rangs confondus) : score = (rang*3 + stade)*100 + RR (Radiant = 2200 + RR, sans stade). En mémoire + leaderboard.json
// (sur l'offre gratuite de Render, le disque est effacé à chaque redéploiement)
const LBFILE = path.join(DATA, 'leaderboard.json');
let LB = {}, lbDirty = false;
try { LB = JSON.parse(fs.readFileSync(LBFILE, 'utf8')); } catch {}
for (const u in LB) { const e = LB[u]; if (e && !e.v) { e.s = 700 + Math.max(0, num(e.best || e.rr)); e.v = 2; delete e.best; delete e.rr; lbDirty = true; } } // ancien format : Radiant uniquement
for (const u in LB) { const e = LB[u]; if (e && e.v === 2) { const o = num(e.s), r = Math.floor(o / 100); e.s = r >= 7 ? 2200 + (o - 700) : r * 300 + (o % 100); e.v = 3; lbDirty = true; } } // v2 -> v3 : 3 stades par rang
setInterval(() => { if (lbDirty) { lbDirty = false; try { fs.writeFileSync(LBFILE, JSON.stringify(LB)); } catch {} } }, 30000);


// ---------- Comptes : pseudo + mot de passe, la sauvegarde du joueur est stockée sur le serveur ----------
const ACCFILE = path.join(DATA, 'accounts.json');
let ACC = {}, accDirty = false;
try { ACC = JSON.parse(fs.readFileSync(ACCFILE, 'utf8')); } catch {}
function flushAcc() {
  if (!accDirty) return;
  accDirty = false;
  try { fs.writeFileSync(ACCFILE + '.tmp', JSON.stringify(ACC)); fs.renameSync(ACCFILE + '.tmp', ACCFILE); } catch (e) { console.error('accounts:', e.message); accDirty = true; }
}
setInterval(flushAcc, 5000);
const accKey = (u) => String(u || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 16);
const pwHash = (p, salt) => crypto.scryptSync(String(p), salt, 32).toString('hex');
const sha = (x) => crypto.createHash('sha256').update(String(x)).digest('hex');
const sameHex = (a, b) => { try { return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex')); } catch { return false; } };
function cleanSv(o) { // sauvegarde de jeu : simple objet JSON de taille raisonnable
  if (!o || typeof o !== 'object' || Array.isArray(o)) return {};
  try { const j = JSON.stringify(o); return j.length > 30000 ? {} : JSON.parse(j); } catch { return {}; }
}
function accReply(me, k, a, created, tk) {
  me.acc = k;
  me.ws.send(JSON.stringify({ t: 'acc_ok', d: { u: k, created: created ? 1 : 0, tk: tk ? 1 : 0, sv: a.sv, tok: tk ? undefined : me.newTok } }));
}
const accNo = (me, e, bad) => me.ws.send(JSON.stringify({ t: 'acc_no', d: { e, bad: bad ? 1 : 0 } }));

// Horloge de partie partagée : le temps peut être avancé quand tous les joueurs sont prêts
const PL = 300, SC = 10, VT = 15, CY = PL + SC + VT; // jeu, scores, vote (secondes)
let skip = 0;
const sNow = () => Date.now() + skip;

const send = (ws, o) => { if (ws.readyState === 1) ws.send(typeof o === 'string' ? o : JSON.stringify(o)); };
const inLobby = (l) => [...players.values()].filter((p) => p.lobby === l);
const lobbyCast = (l, t, d, except) => { const out = JSON.stringify({ t, d }); for (const [pid, p] of players) if (p.lobby === l && pid !== except) send(p.ws, out); };

// ---------- Boss : Tong Tong Sahur (événement spécial) ----------
// Constantes à garder identiques à celles de public/game.js
const BREACH = 190, BSPD = 130;
let evOn = 0, respawnAt = 0; // respawnAt : réapparition automatique du boss 10 min après sa mort
const RESPAWN_MS = Number(process.env.RESPAWN_MS) || 10 * 60 * 1000;
const boss = { al: 0, x: 800, y: 600, a: 0, hp: 0, mh: 1, st: 0, tm: 0, dur: 1, tpcd: 6 };
function spawnBoss() {
  const n = Math.max(1, inLobby(EV).length);
  Object.assign(boss, { al: 1, x: 800, y: 600, a: 0, mh: 6000 + 2500 * n, st: 0, tm: 0, dur: 1, tpcd: 6 });
  boss.hp = boss.mh;
  respawnAt = 0;
  const ann = JSON.stringify({ t: 'ann', d: {} }); // petit message arc-en-ciel pour tous les modes
  for (const p of players.values()) send(p.ws, ann);
}
function killBoss() {
  boss.al = 0; boss.hp = 0; respawnAt = Date.now() + RESPAWN_MS; cntDirty = true;
  lobbyCast(EV, 'bossdead', {});
  sendBoss();
}
function sendBoss() {
  lobbyCast(EV, 'boss', boss.al
    ? { al: 1, x: Math.round(boss.x), y: Math.round(boss.y), a: +boss.a.toFixed(2), hp: Math.round(boss.hp), mh: boss.mh, st: boss.st, tp: +Math.min(1, boss.tm / boss.dur).toFixed(2) }
    : { al: 0 });
}
function tickBoss(dt) {
  if (!boss.al) return;
  let tg = null, bd = 1e9;
  const alive = [];
  for (const p of inLobby(EV)) {
    const q = p.presence;
    if (!q || !q.al) continue;
    alive.push(q);
    const d = Math.hypot(q.x - boss.x, q.y - boss.y);
    if (d < bd) { bd = d; tg = q; }
  }
  const turn = (rate) => {
    if (!tg) return;
    const want = Math.atan2(tg.y - boss.y, tg.x - boss.x);
    const df = ((want - boss.a + 3 * Math.PI) % (2 * Math.PI)) - Math.PI, m = rate * dt;
    boss.a += Math.max(-m, Math.min(m, df));
  };
  boss.tm += dt;
  boss.tpcd -= dt;
  if (boss.st === 0 && boss.tpcd <= 0 && alive.length) { // téléportation dans le dos d'un joueur (au hasard), puis coup annoncé
    const v = alive[Math.floor(Math.random() * alive.length)], d = 120;
    boss.x = v.x - Math.cos(v.a) * d; boss.y = v.y - Math.sin(v.a) * d;
    boss.x = Math.max(110, Math.min(1490, boss.x)); boss.y = Math.max(110, Math.min(1090, boss.y));
    boss.a = Math.atan2(v.y - boss.y, v.x - boss.x);
    boss.st = 1; boss.tm = 0; boss.dur = 0.7; boss.tpcd = 7 + Math.random() * 5;
    lobbyCast(EV, 'btp', { x: Math.round(boss.x), y: Math.round(boss.y) });
    sendBoss();
    return;
  }
  if (boss.st === 0) {
    turn(3.5);
    if (tg) {
      if (bd > BREACH * 0.6) { boss.x += Math.cos(boss.a) * BSPD * dt; boss.y += Math.sin(boss.a) * BSPD * dt; }
      if (bd < BREACH - 25) { boss.st = 1; boss.tm = 0; boss.dur = 0.8; }
    }
  } else if (boss.st === 1) { // préparation du coup : zone rouge visible
    turn(2.2);
    if (boss.tm >= boss.dur) {
      boss.st = 2; boss.tm = 0; boss.dur = 0.22;
      lobbyCast(EV, 'bswing', { x: Math.round(boss.x), y: Math.round(boss.y), a: +boss.a.toFixed(2) });
    }
  } else if (boss.st === 2) { if (boss.tm >= boss.dur) { boss.st = 3; boss.tm = 0; boss.dur = 0.6; } }
  else if (boss.tm >= boss.dur) { boss.st = 0; boss.tm = 0; boss.dur = 1; }
  boss.a = Math.atan2(Math.sin(boss.a), Math.cos(boss.a));
  boss.x = Math.max(110, Math.min(1490, boss.x)); boss.y = Math.max(110, Math.min(1090, boss.y));
}

wss.on('connection', (ws, req) => {
  req.socket.setNoDelay(true);
  const id = 'p' + (++counter).toString(36);
  const me = { ws, presence: {}, shots: 0, since: Date.now(), lobby: -1 };
  players.set(id, me);
  cntDirty = true;
  ws.send(JSON.stringify({ t: 'hello', id, time: sNow() }));
  ws.on('message', (raw) => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    if (!m || typeof m.t !== 'string') return;
    if (raw.length > 2048 && !m.t.startsWith('acc_')) return; // seuls les messages de compte peuvent être gros
    if (m.t === 'presence' && m.d && typeof m.d === 'object') {
      const d = m.d;
      me.presence = { x: num(d.x), y: num(d.y), a: num(d.a), hp: num(d.hp), c: num(d.c) & 31, s: num(d.s) & 31, b: Math.min(100, Math.max(0, num(d.b))), k: num(d.k),
        al: d.al ? 1 : 0, iv: d.iv ? 1 : 0, sh: d.sh ? 1 : 0, v: d.v == null ? null : num(d.v) & 3, m: num(d.m) & 15, n: String(d.n || '').slice(0, 14), pk: num(d.pk) & 15, rd: Math.max(0, Math.min(1e9, Math.floor(num(d.rd)))), rv: d.rv ? 1 : 0, md: num(d.md) & 3, pl: d.pl ? 1 : 0, dd: num(d.dd) & 255, rk: num(d.rk) & 7,
        pw: d.pw ? 1 : 0, go: d.go ? 1 : 0, sn: d.sn ? 1 : 0, cs: d.cs ? 1 : 0,
        cx: /^[0-9.]{0,20}$/.test(String(d.cx || '')) ? String(d.cx || '') : '' };
      dirty = true;
    } else if (m.t === 'acc_auth' && m.d) { // connexion, ou création du compte s'il n'existe pas encore
      me.atry = (me.atry || 0) + 1;
      if (me.atry > 8) return accNo(me, 'Trop d\'essais, recharge la page.');
      const k = accKey(m.d.u), p = String(m.d.p || '');
      if (k.length < 3) return accNo(me, 'Pseudo de compte : 3 à 16 caractères (lettres, chiffres, - _).');
      if (p.length < 4 || p.length > 64) return accNo(me, 'Mot de passe : 4 caractères minimum.');
      let a = ACC[k], created = 0;
      if (!a) {
        if (Object.keys(ACC).length >= 20000) return accNo(me, 'Serveur plein.');
        const salt = crypto.randomBytes(16).toString('hex');
        a = ACC[k] = { salt, h: pwHash(p, salt), sv: cleanSv(m.d.sv), toks: [], t: Date.now() };
        created = 1;
      } else if (!sameHex(a.h, pwHash(p, a.salt))) return accNo(me, 'Mot de passe incorrect.');
      const tok = crypto.randomBytes(24).toString('hex');
      a.toks = (a.toks || []).concat(sha(tok)).slice(-6);
      me.newTok = tok; accDirty = true;
      accReply(me, k, a, created, 0);
    } else if (m.t === 'acc_tok' && m.d) { // reconnexion automatique avec le jeton gardé par le navigateur
      const k = accKey(m.d.u), a = ACC[k];
      if (!a || !(a.toks || []).includes(sha(m.d.t))) return accNo(me, 'Session expirée : reconnecte-toi.', 1);
      accReply(me, k, a, 0, 1);
    } else if (m.t === 'acc_save') {
      const a = me.acc && ACC[me.acc];
      if (a && Date.now() - (me.accT || 0) > 800) {
        const sv = cleanSv(m.d);
        if (sv && sv.rk) { me.accT = Date.now(); a.sv = sv; a.t = Date.now(); accDirty = true; }
      }
    } else if (m.t === 'acc_out') {
      const a = ACC[accKey(m.d && m.d.u)];
      if (a && m.d && m.d.t) { a.toks = (a.toks || []).filter((x) => x !== sha(m.d.t)); accDirty = true; }
      me.acc = null;
    } else if (m.t === 'join') {
      const l = num(m.d && m.d.m) | 0;
      me.lobby = l >= 0 && l <= 2 ? l : -1;
      if (m.d && m.d.n) me.nm = String(m.d.n).slice(0, 14);
      cntDirty = true; dirty = true;
    } else if (m.t === 'bd') { // dégâts infligés au boss (envoyés par lots par les clients)
      if (me.lobby === EV && boss.al && m.d) {
        const t = Date.now();
        if (t - (me.bdT || 0) > 1000) { me.bdT = t; me.bdN = 0; }
        if (++me.bdN <= 20) { boss.hp -= Math.max(0, Math.min(360, num(m.d.d))); if (boss.hp <= 0) killBoss(); }
      }
    } else if (m.t === 'ev' && me.admin) { // activer / désactiver l'événement spécial
      evOn = m.d && m.d.on ? 1 : 0;
      if (evOn && !boss.al) spawnBoss();
      if (!evOn && boss.al) { boss.al = 0; sendBoss(); }
      cntDirty = true;
    } else if (m.t === 'evspawn' && me.admin) { // faire réapparaître le boss
      evOn = 1; spawnBoss(); cntDirty = true;
    } else if (m.t === 'admin_login') {
      me.tries = (me.tries || 0) + 1;
      const ok = ADMIN && me.tries <= 5 && m.d === ADMIN;
      if (ok) me.admin = true;
      ws.send(JSON.stringify({ t: ok ? 'admin_ok' : 'admin_no' }));
    } else if (m.t === 'adm' && me.admin && m.d) {
      const tg = players.get(String(m.d.to));
      if (m.d.act === 'reset' && tg && tg.uid && LB[tg.uid]) { delete LB[tg.uid]; lbDirty = true; } // retire le joueur du classement
      if (tg && tg.ws.readyState === 1) tg.ws.send(JSON.stringify({ t: 'adm', d: { act: String(m.d.act).slice(0, 8), v: num(m.d.v) } }));
    } else if (m.t === 'chat' && m.d) { // chat : relayé à tous les joueurs du même salon (l'expéditeur inclus)
      const txt = String(m.d.txt || '').replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100), now = Date.now();
      if (!txt || me.lobby < 0 || now - (me.chT || 0) < 700) return; // anti-spam : 1 message / 0,7 s
      me.chT = now;
      const out = JSON.stringify({ t: 'chat', d: { n: (me.presence && me.presence.n) || '?', txt, a: me.admin ? 1 : 0 }, from: id });
      for (const p of players.values()) if (p.lobby === me.lobby) send(p.ws, out);
    } else if (m.t === 'lb_post' && m.d) {
      const uid = String(m.d.uid || '').slice(0, 24).replace(/[^\w-]/g, '');
      if (uid && Date.now() - (me.lbT || 0) > 3000) {
        me.lbT = Date.now(); me.uid = uid;
        const r = Math.max(0, Math.min(7, num(m.d.r) | 0)), dv = r < 7 ? Math.max(0, Math.min(2, num(m.d.d) | 0)) : 0, ix = r < 7 ? r * 3 + dv : 22, rr = Math.max(0, Math.min(ix < 22 ? 99 : 9999, num(m.d.rr) | 0)), s = ix * 100 + rr;
        if (s > 0) LB[uid] = { name: String(m.d.name || '?').slice(0, 14), s, t: Date.now(), v: 3 };
        else delete LB[uid];
        lbDirty = true;
      }
    } else if (m.t === 'lb_get') {
      const list = Object.values(LB).sort((a, b) => b.s - a.s || a.t - b.t).slice(0, 10).map((e) => ({ n: e.name, r: e.s, b: e.s }));
      ws.send(JSON.stringify({ t: 'lb', list }));
    } else if (['shot', 'kill', 'dep', 'act', 'flash', 'plate', 'orb', 'rm', 'melee', 'pw', 'pfx'].includes(m.t)) {
      if (me.lobby < 0) return;
      if (m.d && m.d.gd && !me.admin) m.d.gd = 0; // le laser géant est réservé à l'admin
      if (Date.now() - me.since > 1000) { me.since = Date.now(); me.shots = 0; }
      if (++me.shots > 40) return; // anti-spam
      const out = JSON.stringify({ t: m.t, d: m.d, from: id });
      for (const [pid, p] of players) if (pid !== id && p.lobby === me.lobby && p.ws.readyState === 1) p.ws.send(out);
    }
  });
  ws.on('close', () => { players.delete(id); dirty = true; cntDirty = true; });
});

// Présence : chaque joueur ne reçoit que les joueurs de son salon
setInterval(() => {
  if (!dirty) return;
  dirty = false;
  for (let l = 0; l <= 2; l++) {
    const grp = [...players].filter(([, p]) => p.lobby === l);
    if (!grp.length) continue;
    const msg = JSON.stringify({ t: 'peers', list: grp.map(([pid, p]) => ({ id: pid, presence: p.presence })) });
    for (const [, p] of grp) send(p.ws, msg);
  }
}, 33);

// Boss : simulation 30 Hz, état envoyé 15 Hz au salon événement
let lastB = Date.now(), bt = 0;
setInterval(() => {
  const now = Date.now(), dt = Math.min(0.1, (now - lastB) / 1000); lastB = now;
  if (!boss.al && evOn && respawnAt && now >= respawnAt) { spawnBoss(); cntDirty = true; }
  if (!inLobby(EV).length) return;
  tickBoss(dt);
  if (++bt % 2 === 0) sendBoss();
}, 33);


// Liste de tous les joueurs connectés (tous salons, menu compris), envoyée uniquement aux admins
setInterval(() => {
  const adms = [...players.values()].filter((p) => p.admin);
  if (!adms.length) return;
  const list = [...players].slice(0, 200).map(([pid, p]) => ({ id: pid, n: (p.presence && p.presence.n) || p.nm || p.acc || pid, l: p.lobby }));
  const msg = JSON.stringify({ t: 'adm_list', d: list });
  for (const p of adms) send(p.ws, msg);
}, 1000);

// Nombre de joueurs en ligne par mode (aussi envoyé aux joueurs qui sont dans le menu)
let cntT = 0;
setInterval(() => {
  if (!cntDirty && ++cntT < 4) return;
  cntDirty = false; cntT = 0;
  const c = [0, 0, 0];
  for (const p of players.values()) if (p.lobby >= 0) c[p.lobby]++;
  const msg = JSON.stringify({ t: 'cnt', d: { c, b: evOn, a: boss.al, r: respawnAt && !boss.al ? Math.max(0, Math.ceil((respawnAt - Date.now()) / 1000)) : 0 } });
  for (const p of players.values()) send(p.ws, msg);
}, 500);

// Si tous les joueurs du classique/classé ont cliqué sur « Prêt » pendant les scores ou le vote, on passe à la phase suivante
setInterval(() => {
  const ps = [...players.values()].filter((p) => p.lobby === 0 || p.lobby === 1);
  if (!ps.length) return;
  const t = sNow() / 1000, e = t % CY, id = Math.floor(t / CY);
  const n = e < PL ? 0 : e < PL + SC ? 1 : 2;
  if (n === 0) return;
  const token = id * 3 + n + 1;
  for (const p of ps) if (p.presence.rd !== token) return;
  skip += Math.ceil(((n === 1 ? PL + SC : CY) - e) * 1000) + 50;
  const msg = JSON.stringify({ t: 'sync', time: sNow() });
  for (const p of players.values()) send(p.ws, msg);
}, 250);

const flushAll = () => { flushAcc(); if (lbDirty) { lbDirty = false; try { fs.writeFileSync(LBFILE, JSON.stringify(LB)); } catch {} } };
for (const sg of ['SIGINT', 'SIGTERM']) process.on(sg, () => { flushAll(); process.exit(0); });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Arène : http://localhost:' + PORT));
