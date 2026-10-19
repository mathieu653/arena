// ads.js — pub Google AdSense (H5 Games Ads) : une pub toutes les 3 parties, sur l'écran « Fin de la partie ».
// Chargé après game.js (utilise ses variables globales : ph, mute, setVol).
// Pour tester avec de fausses pubs, ajoute data-adbreak-test="on" sur la balise <script> AdSense de index.html.
const AD_EVERY = 3; // une pub toutes les N parties
let adGames = 0, adPrev = 0, adBusy = false;
try { adGames = +localStorage.getItem('arena_adgames') || 0; } catch (e) {}

function adMute(on) { // coupe le son du jeu pendant la pub, puis le remet comme avant
  try {
    if (on) { window._adm = mute; mute = 1; } else { mute = window._adm; }
    if (typeof setVol == 'function') setVol();
  } catch (e) {}
}

function adShow() {
  if (adBusy || typeof adBreak != 'function') return;
  adBusy = true;
  try {
    adBreak({
      type: 'next', name: 'fin-de-partie',
      beforeAd: () => adMute(1),
      afterAd: () => adMute(0),
      adBreakDone: () => { adBusy = false; }
    });
  } catch (e) { adBusy = false; }
  setTimeout(() => { adBusy = false; }, 60000); // sécurité si le callback n'est jamais appelé
}

setInterval(() => {
  const n = (typeof ph != 'undefined' && ph) ? ph.n : 0;
  if (n === 1 && adPrev !== 1) { // une partie vient de se terminer
    adGames++;
    try { localStorage.setItem('arena_adgames', adGames); } catch (e) {}
    if (adGames % AD_EVERY === 0) adShow();
  }
  adPrev = n;
}, 500);
