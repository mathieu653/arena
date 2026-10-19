// Serveur Arène : fichiers statiques + relais WebSocket (présence 30 Hz, tirs, éliminations)
// Salons : 0 = Classique, 1 = Classé, 2 = Événement spécial (boss), -1 = menu (hors salon)
const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');
// Dossier de données (comptes + classement). Sur un hébergeur avec disque persistant, mets DATA_DIR vers ce disque (ex. /var/data)
const DATA = process.env.DATA_DIR || path.join(__dirname, 'data');
try { fs.mkdirSync(DATA, { recursive: true }); } catch {}
const PUB = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.txt': 'text/plain' };

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

// ---------- Boss (événement spécial) ----------
// Constantes à garder identiques à celles de public/game.js
const SLR = 230, BSPD = 115, BREACH = 190, TSPD = 130;
let evOn = 0, respawnAt = 0; // respawnAt : réapparition automatique du boss 10 min après sa mort
const RESPAWN_MS = Number(process.env.RESPAWN_MS) || 10 * 60 * 1000;
// Registre des boss : pour en ajouter un, déclare-le ici (PV + fonction tick) puis dans BOSSL de public/game.js
const BOSSES = { magma: { hp0: 6000, hpN: 2500, tick: tickMagma }, tong: { hp0: 6000, hpN: 2500, tick: tickTong }, necro: { hp0: 6000, hpN: 2500, tick: tickNecro }, dragon: { hp0: 9000, hpN: 3500, tick: tickDragon } };
const boss = { bt: 'magma', al: 0, x: 800, y: 600, a: 0, hp: 0, mh: 1, st: 0, tm: 0, dur: 1, mtcd: 6, tpcd: 6, en: 0, su: 6, ar: 0, brcd: 5, dvcd: 14 };
// Nécro-Sire : sbires invoqués (simulés ici) et arène qui rétrécit (rayon boss.ar autour de ARC_X/ARC_Y)
const ARC_X = 800, ARC_Y = 600, AR0 = 540, AR1 = 175, AR_T = 45, MINHP = 55, MINSPD = 105, MINMAX = 12, MINR = 16;
const mins = []; let minId = 0;
const clampB = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
function spawnBoss(type) {
  if (BOSSES[type]) boss.bt = type;
  const B = BOSSES[boss.bt], n = Math.max(1, inLobby(EV).length);
  Object.assign(boss, { ctl: null, ci: null, al: 1, x: 800, y: 600, a: 0, mh: B.hp0 + B.hpN * n, st: 0, tm: 0, dur: 1, mtcd: 6, tpcd: 6, en: 0, su: 6, ar: 0, brcd: 5, dvcd: 14, dx: 800, dy: 600 });
  mins.length = 0;
  boss.hp = boss.mh;
  respawnAt = 0;
  const ann = JSON.stringify({ t: 'ann', d: { b: boss.bt } }); // petit message arc-en-ciel pour tous les modes
  for (const p of players.values()) send(p.ws, ann);
}
function killBoss() {
  boss.al = 0; boss.ctl = null; boss.hp = 0; mins.length = 0; respawnAt = Date.now() + RESPAWN_MS; cntDirty = true;
  lobbyCast(EV, 'bossdead', { b: boss.bt });
  sendBoss();
}
function sendBoss() {
  lobbyCast(EV, 'boss', boss.al
    ? { al: 1, bt: boss.bt, en: boss.en, x: Math.round(boss.x), y: Math.round(boss.y), a: +boss.a.toFixed(2), hp: Math.round(boss.hp), mh: boss.mh, st: boss.st, tp: +Math.min(1, boss.tm / boss.dur).toFixed(2), ar: Math.round(boss.ar || 0), ct: boss.ctl || undefined, m: boss.bt === 'necro' ? mins.map((q) => [q.id, Math.round(q.x), Math.round(q.y), Math.round(q.hp)]) : undefined }
    : { al: 0 });
}
function tickBoss(dt) {
  if (!boss.al) return;
  if (boss.ctl) { // le boss est piloté par un admin : l'IA est suspendue
    const cp = players.get(boss.ctl);
    if (!cp || cp.lobby !== EV) boss.ctl = null;
    else {
      const al2 = [];
      for (const p of inLobby(EV)) { const q = p.presence; if (q && q.al) al2.push(q); }
      tickCtl(dt, al2);
      boss.a = Math.atan2(Math.sin(boss.a), Math.cos(boss.a));
      boss.x = clampB(boss.x, 110, 1490); boss.y = clampB(boss.y, 110, 1090);
      return;
    }
  }
  let tg = null, bd = 1e9;
  const alive = [];
  for (const p of inLobby(EV)) {
    const q = p.presence;
    if (!q || !q.al) continue;
    alive.push(q);
    const d = Math.hypot(q.x - boss.x, q.y - boss.y);
    if (d < bd) { bd = d; tg = q; }
  }
  BOSSES[boss.bt].tick(dt, alive, tg, bd);
  boss.a = Math.atan2(Math.sin(boss.a), Math.cos(boss.a));
  boss.x = clampB(boss.x, 110, 1490); boss.y = clampB(boss.y, 110, 1090);
}
// Boss piloté par un admin (touches : déplacement + clic = attaque principale, Maj/Espace = attaque spéciale)
// Utilise les mêmes états (st / tm / dur) que l'IA : les clients affichent donc les mêmes zones annoncées.
function stepMins(dt, alive, fin) {
  for (const m of mins) {
    let t2 = null, d2 = 1e9;
    for (const q of alive) { const d = Math.hypot(q.x - m.x, q.y - m.y); if (d < d2) { d2 = d; t2 = q; } }
    if (t2 && d2 > 4) { const sp = MINSPD * (fin ? 1.3 : 1) * dt; m.x += (t2.x - m.x) / d2 * sp; m.y += (t2.y - m.y) / d2 * sp; }
    for (const o of mins) if (o !== m) { const dx = m.x - o.x, dy = m.y - o.y, dd = Math.hypot(dx, dy); if (dd > 0.01 && dd < MINR * 2) { m.x += dx / dd * 40 * dt; m.y += dy / dd * 40 * dt; } }
    m.x = clampB(m.x, 40, 1560); m.y = clampB(m.y, 40, 1160);
  }
}
function tickCtl(dt, alive) {
  const t = boss.bt, c = boss.ci || (boss.ci = { dx: 0, dy: 0, a: boss.a, k: 0 });
  const en = t !== 'tong' && boss.hp < boss.mh * 0.5, fin = t === 'necro' && boss.hp < boss.mh * 0.35;
  boss.en = t === 'dragon' ? (boss.hp < boss.mh * 0.25 ? 2 : en ? 1 : 0) : (en ? 1 : 0);
  if (t === 'dragon') { boss.brcd -= dt; boss.mtcd -= dt; }
  if (t === 'necro') { boss.ar = fin ? Math.max(AR1, (boss.ar || AR0) - (AR0 - AR1) / AR_T * dt) : 0; stepMins(dt, alive, fin); }
  boss.tm += dt; boss.mtcd -= dt; boss.tpcd -= dt; boss.su -= dt;
  const k = c.k; c.k = 0;
  if (boss.st === 0) {
    boss.a = c.a;
    const l = Math.hypot(c.dx, c.dy);
    if (l > 0.01) {
      const spd = t === 'tong' ? TSPD : t === 'necro' ? BSPD * 0.55 : BSPD * (en ? 1.4 : 1);
      boss.x += c.dx / l * spd * dt; boss.y += c.dy / l * spd * dt;
    }
    if (k === 1) { boss.st = 1; boss.tm = 0; boss.dur = t === 'tong' ? 0.8 : (en ? 0.75 : 1); }
    else if (k === 2) {
      if (t === 'dragon') {
        if (boss.brcd <= 0) { boss.st = 5; boss.tm = 0; boss.dur = 1.1; boss.brcd = boss.en ? 4 : 6; sendBoss(); }
        else if (boss.mtcd <= 0) {
          boss.st = 4; boss.tm = 0; boss.dur = 1.3; boss.mtcd = 10;
          const pts = [], n = Math.min(12, alive.length + 4);
          for (let i = 0; i < n; i++) { const v = alive.length ? alive[i % alive.length] : boss, rnd = !alive.length || i >= alive.length; pts.push([Math.round(clampB(v.x + (rnd ? (Math.random() - 0.5) * 300 : 0), 60, 1540)), Math.round(clampB(v.y + (rnd ? (Math.random() - 0.5) * 300 : 0), 60, 1140))]); }
          lobbyCast(EV, 'bmeteor', { p: pts }); sendBoss();
        }
      } else if (t === 'magma' && boss.mtcd <= 0) { // pluie de météores : un impact par joueur vivant + des impacts au hasard
        boss.st = 4; boss.tm = 0; boss.dur = 1.3; boss.mtcd = en ? 6 : 9;
        const pts = [], n = Math.min(12, alive.length + (en ? 5 : 3));
        for (let i = 0; i < n; i++) {
          const v = alive.length ? alive[i % alive.length] : boss, rnd = !alive.length || i >= alive.length;
          pts.push([Math.round(clampB(v.x + (rnd ? (Math.random() - 0.5) * 300 : 0), 60, 1540)), Math.round(clampB(v.y + (rnd ? (Math.random() - 0.5) * 300 : 0), 60, 1140))]);
        }
        lobbyCast(EV, 'bmeteor', { p: pts });
        sendBoss();
      } else if (t === 'tong' && boss.tpcd <= 0 && alive.length) { // téléportation dans le dos du joueur le plus proche, puis coup annoncé
        let v = alive[0], bd = 1e9;
        for (const q of alive) { const d = Math.hypot(q.x - boss.x, q.y - boss.y); if (d < bd) { bd = d; v = q; } }
        boss.x = clampB(v.x - Math.cos(v.a) * 120, 110, 1490); boss.y = clampB(v.y - Math.sin(v.a) * 120, 110, 1090);
        boss.a = Math.atan2(v.y - boss.y, v.x - boss.x);
        boss.st = 1; boss.tm = 0; boss.dur = 0.7; boss.tpcd = 5;
        lobbyCast(EV, 'btp', { x: Math.round(boss.x), y: Math.round(boss.y) });
        sendBoss();
      } else if (t === 'necro' && boss.su <= 0 && mins.length < MINMAX - 2) { // incantation des sbires
        boss.st = 4; boss.tm = 0; boss.dur = 1.4; boss.su = fin ? 6 : 9;
        lobbyCast(EV, 'bsummon', { x: Math.round(boss.x), y: Math.round(boss.y) });
        sendBoss();
      }
    }
  } else if (t === 'dragon' && boss.st === 5) { boss.a = c.a; if (boss.tm >= boss.dur) { boss.st = 6; boss.tm = 0; boss.dur = 2.2; sendBoss(); } }
  else if (t === 'dragon' && boss.st === 6) { boss.a = c.a; if (boss.tm >= boss.dur) { boss.st = 3; boss.tm = 0; boss.dur = 1; sendBoss(); } }
  else if (boss.st === 1) { // préparation du coup : la zone annoncée est visible
    boss.a = c.a;
    if (boss.tm >= boss.dur) {
      boss.st = 2; boss.tm = 0; boss.dur = t === 'tong' ? 0.22 : 0.25;
      lobbyCast(EV, 'bswing', { x: Math.round(boss.x), y: Math.round(boss.y), a: +boss.a.toFixed(2) });
    }
  } else if (boss.st === 2) { if (boss.tm >= boss.dur) { boss.st = 3; boss.tm = 0; boss.dur = t === 'tong' ? 0.6 : (en && t === 'magma' ? 0.5 : 0.8); } }
  else if (boss.st === 3) { if (boss.tm >= boss.dur) { boss.st = 0; boss.tm = 0; boss.dur = 1; } }
  else if (boss.tm >= boss.dur) { // fin de l'incantation
    if (t === 'necro') {
      const n = Math.min(MINMAX - mins.length, 3 + Math.min(alive.length, 4) + (en ? 2 : 0));
      for (let i = 0; i < n; i++) { const a = Math.random() * 6.283; mins.push({ id: ++minId, x: clampB(boss.x + Math.cos(a) * 95, 40, 1560), y: clampB(boss.y + Math.sin(a) * 95, 40, 1160), hp: MINHP }); }
    }
    boss.st = 0; boss.tm = 0; boss.dur = 1;
    sendBoss();
  }
}

// Magmaar : poing écrasant (zone circulaire annoncée), pluie de météores (impacts annoncés), rage sous 50 % de PV
// états : 0 marche · 1 préparation du coup · 2 impact · 3 récupération · 4 incantation des météores
function tickMagma(dt, alive, tg, bd) {
  const en = boss.hp < boss.mh * 0.5;
  boss.en = en ? 1 : 0;
  const turn = (rate) => {
    if (!tg) return;
    const want = Math.atan2(tg.y - boss.y, tg.x - boss.x);
    const df = ((want - boss.a + 3 * Math.PI) % (2 * Math.PI)) - Math.PI, m = rate * dt;
    boss.a += Math.max(-m, Math.min(m, df));
  };
  boss.tm += dt;
  boss.mtcd -= dt;
  if (boss.st === 0) {
    turn(3);
    if (boss.mtcd <= 0 && alive.length) { // pluie de météores : un impact par joueur vivant + quelques impacts au hasard
      boss.st = 4; boss.tm = 0; boss.dur = 1.3;
      boss.mtcd = (en ? 7 : 11) + Math.random() * 3;
      const pts = [], n = Math.min(12, alive.length + (en ? 5 : 3));
      for (let i = 0; i < n; i++) {
        const v = alive[i % alive.length], rnd = i >= alive.length;
        pts.push([Math.round(clampB(v.x + (rnd ? (Math.random() - 0.5) * 300 : 0), 60, 1540)), Math.round(clampB(v.y + (rnd ? (Math.random() - 0.5) * 300 : 0), 60, 1140))]);
      }
      lobbyCast(EV, 'bmeteor', { p: pts });
      sendBoss();
      return;
    }
    if (tg) {
      const spd = BSPD * (en ? 1.4 : 1);
      if (bd > SLR * 0.5) { boss.x += Math.cos(boss.a) * spd * dt; boss.y += Math.sin(boss.a) * spd * dt; }
      if (bd < SLR - 50) { boss.st = 1; boss.tm = 0; boss.dur = en ? 0.75 : 1; }
    }
  } else if (boss.st === 1) { // préparation : la zone rouge grandit, il faut s'éloigner
    turn(1.2);
    if (boss.tm >= boss.dur) {
      boss.st = 2; boss.tm = 0; boss.dur = 0.25;
      lobbyCast(EV, 'bswing', { x: Math.round(boss.x), y: Math.round(boss.y) });
    }
  } else if (boss.st === 2) { if (boss.tm >= boss.dur) { boss.st = 3; boss.tm = 0; boss.dur = en ? 0.5 : 0.8; } }
  else if (boss.st === 3) { if (boss.tm >= boss.dur) { boss.st = 0; boss.tm = 0; boss.dur = 1; } }
  else if (boss.tm >= boss.dur) { boss.st = 0; boss.tm = 0; boss.dur = 1; } // fin de l'incantation
}

// Tong Tong Sahur : gros coup de batte en arc de cercle (zone annoncée) + téléportation dans le dos d'un joueur
// états : 0 marche · 1 préparation du coup · 2 coup · 3 récupération
function tickTong(dt, alive, tg, bd) {
  boss.en = 0;
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
    boss.x = clampB(v.x - Math.cos(v.a) * d, 110, 1490); boss.y = clampB(v.y - Math.sin(v.a) * d, 110, 1090);
    boss.a = Math.atan2(v.y - boss.y, v.x - boss.x);
    boss.st = 1; boss.tm = 0; boss.dur = 0.7; boss.tpcd = 7 + Math.random() * 5;
    lobbyCast(EV, 'btp', { x: Math.round(boss.x), y: Math.round(boss.y) });
    sendBoss();
    return;
  }
  if (boss.st === 0) {
    turn(3.5);
    if (tg) {
      if (bd > BREACH * 0.6) { boss.x += Math.cos(boss.a) * TSPD * dt; boss.y += Math.sin(boss.a) * TSPD * dt; }
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
}

// Nécro-Sire : invoque des sbires qui poursuivent les joueurs, onde de mort au corps à corps,
// invocations plus rapides sous 50 % de PV, et sous 35 % l'arène se referme (zone sûre qui rétrécit)
// états : 0 marche · 1 préparation de l'onde · 2 onde · 3 récupération · 4 incantation (les sbires apparaissent à la fin)
function tickNecro(dt, alive, tg, bd) {
  const en = boss.hp < boss.mh * 0.5, fin = boss.hp < boss.mh * 0.35;
  boss.en = en ? 1 : 0;
  boss.ar = fin ? Math.max(AR1, (boss.ar || AR0) - (AR0 - AR1) / AR_T * dt) : 0;
  const turn = (rate) => {
    if (!tg) return;
    const want = Math.atan2(tg.y - boss.y, tg.x - boss.x);
    const df = ((want - boss.a + 3 * Math.PI) % (2 * Math.PI)) - Math.PI, m = rate * dt;
    boss.a += Math.max(-m, Math.min(m, df));
  };
  for (const m of mins) { // les sbires poursuivent le joueur vivant le plus proche
    let t2 = null, d2 = 1e9;
    for (const q of alive) { const d = Math.hypot(q.x - m.x, q.y - m.y); if (d < d2) { d2 = d; t2 = q; } }
    if (t2 && d2 > 4) { const sp = MINSPD * (fin ? 1.3 : 1) * dt; m.x += (t2.x - m.x) / d2 * sp; m.y += (t2.y - m.y) / d2 * sp; }
    for (const o of mins) if (o !== m) { const dx = m.x - o.x, dy = m.y - o.y, dd = Math.hypot(dx, dy); if (dd > 0.01 && dd < MINR * 2) { m.x += dx / dd * 40 * dt; m.y += dy / dd * 40 * dt; } }
    m.x = clampB(m.x, 40, 1560); m.y = clampB(m.y, 40, 1160);
  }
  boss.tm += dt;
  boss.su -= dt;
  if (boss.st === 0) {
    turn(2.5);
    if (boss.su <= 0 && alive.length && mins.length < MINMAX - 2) { // incantation : annoncée 1,4 s avant l'apparition des sbires
      boss.st = 4; boss.tm = 0; boss.dur = 1.4;
      boss.su = (fin ? 8 : en ? 11 : 15) + Math.random() * 3;
      lobbyCast(EV, 'bsummon', { x: Math.round(boss.x), y: Math.round(boss.y) });
      sendBoss();
      return;
    }
    if (tg) {
      if (bd > SLR * 0.6) { boss.x += Math.cos(boss.a) * BSPD * 0.55 * dt; boss.y += Math.sin(boss.a) * BSPD * 0.55 * dt; }
      if (bd < SLR - 60) { boss.st = 1; boss.tm = 0; boss.dur = en ? 0.8 : 1; }
    }
  } else if (boss.st === 1) { // préparation : la zone grandit, il faut s'éloigner
    turn(1.2);
    if (boss.tm >= boss.dur) { boss.st = 2; boss.tm = 0; boss.dur = 0.25; lobbyCast(EV, 'bswing', { x: Math.round(boss.x), y: Math.round(boss.y) }); }
  } else if (boss.st === 2) { if (boss.tm >= boss.dur) { boss.st = 3; boss.tm = 0; boss.dur = 0.8; } }
  else if (boss.st === 3) { if (boss.tm >= boss.dur) { boss.st = 0; boss.tm = 0; boss.dur = 1; } }
  else if (boss.tm >= boss.dur) { // fin de l'incantation : les sbires apparaissent autour du boss
    const n = Math.min(MINMAX - mins.length, 3 + Math.min(alive.length, 4) + (en ? 2 : 0));
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.283; mins.push({ id: ++minId, x: clampB(boss.x + Math.cos(a) * 95, 40, 1560), y: clampB(boss.y + Math.sin(a) * 95, 40, 1160), hp: MINHP }); }
    boss.st = 0; boss.tm = 0; boss.dur = 1;
    sendBoss();
  }
}

// Pyrax le Dragon : coup de queue (zone annoncée), souffle de feu en cône (annoncé puis 2,2 s), pluie de météores,
// plongeon (invulnérable en vol, impact de zone) ; rage < 50 % PV, fureur < 25 % PV (souffle à 3 cônes).
// États : 0 libre · 1 queue (préparation) · 2 impact · 3 récupération · 4 rugissement/météores · 5 souffle (préparation) · 6 souffle · 7 envol + plongeon
function tickDragon(dt, alive, tg, bd) {
  const en = boss.hp < boss.mh * 0.5 ? (boss.hp < boss.mh * 0.25 ? 2 : 1) : 0;
  boss.en = en;
  const turn = (rate) => {
    if (!tg) return;
    const want = Math.atan2(tg.y - boss.y, tg.x - boss.x);
    const df = ((want - boss.a + 3 * Math.PI) % (2 * Math.PI)) - Math.PI, m = rate * dt;
    boss.a += Math.max(-m, Math.min(m, df));
  };
  boss.tm += dt; boss.brcd -= dt; boss.mtcd -= dt; boss.dvcd -= dt;
  if (boss.st === 0) {
    turn(2);
    if (!tg) return;
    if (boss.brcd <= 0 && bd > 150) { boss.st = 5; boss.tm = 0; boss.dur = en ? 0.9 : 1.1; boss.brcd = en ? 4.5 : 7; sendBoss(); return; }
    if (boss.mtcd <= 0) {
      boss.st = 4; boss.tm = 0; boss.dur = 1.3; boss.mtcd = en ? 9 : 14;
      const pts = [], n = Math.min(14, alive.length + (en ? 6 : 3));
      for (let i = 0; i < n; i++) { const v = alive[i % alive.length], rnd = i >= alive.length; pts.push([Math.round(clampB(v.x + (rnd ? (Math.random() - 0.5) * 320 : 0), 60, 1540)), Math.round(clampB(v.y + (rnd ? (Math.random() - 0.5) * 320 : 0), 60, 1140))]); }
      lobbyCast(EV, 'bmeteor', { p: pts }); sendBoss(); return;
    }
    if (en && boss.dvcd <= 0) { boss.st = 7; boss.tm = 0; boss.dur = 2.1; boss.dvcd = en > 1 ? 11 : 16; boss.dx = tg.x; boss.dy = tg.y; sendBoss(); return; }
    if (bd > SLR * 0.6) { boss.x += Math.cos(boss.a) * BSPD * (en ? 0.95 : 0.7) * dt; boss.y += Math.sin(boss.a) * BSPD * (en ? 0.95 : 0.7) * dt; }
    if (bd < SLR - 50) { boss.st = 1; boss.tm = 0; boss.dur = en ? 0.7 : 0.9; }
  } else if (boss.st === 1) { turn(1.2); if (boss.tm >= boss.dur) { boss.st = 2; boss.tm = 0; boss.dur = 0.25; lobbyCast(EV, 'bswing', { x: Math.round(boss.x), y: Math.round(boss.y), a: +boss.a.toFixed(2) }); } }
  else if (boss.st === 2) { if (boss.tm >= boss.dur) { boss.st = 3; boss.tm = 0; boss.dur = 0.8; } }
  else if (boss.st === 3) { if (boss.tm >= boss.dur) { boss.st = 0; boss.tm = 0; boss.dur = 1; } }
  else if (boss.st === 4) { turn(1); if (boss.tm >= boss.dur) { boss.st = 0; boss.tm = 0; boss.dur = 1; sendBoss(); } }
  else if (boss.st === 5) { turn(2.4); if (boss.tm >= boss.dur) { boss.st = 6; boss.tm = 0; boss.dur = 2.2; sendBoss(); } }
  else if (boss.st === 6) { turn(en ? 0.75 : 0.55); if (boss.tm >= boss.dur) { boss.st = 3; boss.tm = 0; boss.dur = 1.1; sendBoss(); } }
  else if (boss.st === 7) { // en l'air : suit sa cible 1,5 s puis se fige et retombe
    if (tg && boss.tm < 1.5) { boss.dx = tg.x; boss.dy = tg.y; }
    const ex = boss.dx - boss.x, ey = boss.dy - boss.y, d = Math.hypot(ex, ey), sp = (boss.tm < 1.5 ? 420 : 0) * dt;
    if (d > 1) { boss.x += ex / d * Math.min(sp, d); boss.y += ey / d * Math.min(sp, d); boss.a = Math.atan2(ey, ex); }
    if (boss.tm >= boss.dur) { boss.st = 2; boss.tm = 0; boss.dur = 0.3; boss.mtcd = Math.max(boss.mtcd, 3); lobbyCast(EV, 'bswing', { x: Math.round(boss.x), y: Math.round(boss.y), a: +boss.a.toFixed(2) }); }
  }
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
      me.lobby = l >= 0 && l <= 3 ? l : -1; // 0 classique, 1 classé, 2 événement, 3 survivant
      if (m.d && m.d.n) me.nm = String(m.d.n).slice(0, 14);
      cntDirty = true; dirty = true;
    } else if (m.t === 'bd') { // dégâts infligés au boss (envoyés par lots par les clients)
      if (me.lobby === EV && boss.al && m.d) {
        const t = Date.now();
        if (t - (me.bdT || 0) > 1000) { me.bdT = t; me.bdN = 0; }
        if (++me.bdN <= 20 && !(boss.bt === 'dragon' && boss.st === 7)) { boss.hp -= Math.max(0, Math.min(360, num(m.d.d))); if (boss.hp <= 0) killBoss(); }
      }
    } else if (m.t === 'md') { // dégâts infligés à un sbire de Nécro-Sire (lots envoyés par les clients)
      if (me.lobby === EV && boss.al && boss.bt === 'necro' && m.d) {
        const t = Date.now();
        if (t - (me.mdT || 0) > 1000) { me.mdT = t; me.mdN = 0; }
        if (++me.mdN <= 40) {
          const k = mins.findIndex((q) => q.id === (m.d.i | 0));
          if (k >= 0) { mins[k].hp -= Math.max(0, Math.min(120, num(m.d.d))); if (mins[k].hp <= 0) mins.splice(k, 1); }
        }
      }
    } else if (m.t === 'ev' && me.admin) { // activer / désactiver l'événement spécial
      evOn = m.d && m.d.on ? 1 : 0;
      if (evOn && !boss.al) spawnBoss();
      if (!evOn && boss.al) { boss.al = 0; boss.ctl = null; sendBoss(); }
      cntDirty = true;
    } else if (m.t === 'evkill' && me.admin) { // tuer le boss (test des récompenses)
      if (boss.al) killBoss();
    } else if (m.t === 'bpos' && me.admin) { // l'admin incarne le boss (ou le rend à l'IA)
      if (m.d && m.d.on) {
        if (me.lobby !== EV) return;
        evOn = 1;
        const want = m.d.b && BOSSES[m.d.b] ? m.d.b : boss.bt;
        if (!boss.al || m.d.b) spawnBoss(want);
        boss.ctl = id; boss.ci = { dx: 0, dy: 0, a: boss.a, k: 0 };
        cntDirty = true; sendBoss();
      } else if (boss.ctl === id) { boss.ctl = null; boss.ci = null; sendBoss(); }
    } else if (m.t === 'bctl' && me.admin && boss.ctl === id && m.d && boss.ci) { // commandes du boss piloté
      const d = m.d;
      boss.ci.dx = Math.max(-1, Math.min(1, num(d.dx))); boss.ci.dy = Math.max(-1, Math.min(1, num(d.dy)));
      boss.ci.a = num(d.a);
      if (d.k === 1 || d.k === 2) boss.ci.k = d.k;
    } else if (m.t === 'evspawn' && me.admin) { // faire réapparaître le boss
      evOn = 1; spawnBoss(m.d && m.d.b); cntDirty = true;
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
    } else if (['shot', 'kill', 'dep', 'act', 'flash', 'plate', 'orb', 'rm', 'melee', 'pw', 'pfx', 'sm', 'ecl'].includes(m.t)) {
      if (me.lobby < 0) return;
      if (m.d && m.d.gd && !me.admin) m.d.gd = 0; // le laser géant est réservé à l'admin
      if (Date.now() - me.since > 1000) { me.since = Date.now(); me.shots = 0; }
      if (++me.shots > 40) return; // anti-spam
      const out = JSON.stringify({ t: m.t, d: m.d, from: id });
      for (const [pid, p] of players) if (pid !== id && p.lobby === me.lobby && p.ws.readyState === 1) p.ws.send(out);
    }
  });
  ws.on('close', () => { if (boss.ctl === id) boss.ctl = null; players.delete(id); dirty = true; cntDirty = true; });
});

// Présence : chaque joueur ne reçoit que les joueurs de son salon
setInterval(() => {
  if (!dirty) return;
  dirty = false;
  for (let l = 0; l <= 3; l++) {
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
  const c = [0, 0, 0, 0];
  for (const p of players.values()) if (p.lobby >= 0) c[p.lobby]++;
  const msg = JSON.stringify({ t: 'cnt', d: { c, b: evOn, a: boss.al, t: boss.bt, r: respawnAt && !boss.al ? Math.max(0, Math.ceil((respawnAt - Date.now()) / 1000)) : 0 } });
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
