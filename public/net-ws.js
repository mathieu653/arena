// Adaptateur réseau WebSocket : relie game.js au serveur Node (server.js)
(() => {
  const ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host);
  let offset = 0;
  net.now = () => Date.now() + offset;
  net.send = (t, d) => { if (ws.readyState === 1) ws.send(JSON.stringify({ t, d })); };
  net.presence = (p) => net.send('presence', p);
  let my = '';
  ws.onmessage = (e) => {
    let m; try { m = JSON.parse(e.data); } catch { return; }
    if (m.t === 'hello') { my = m.id; offset = m.time - Date.now(); }
    else if (m.t === 'peers') netPeers(m.list.filter((p) => p.id !== my), my);
    else netEvent(m.t, m.d, m.from);
  };
})();
