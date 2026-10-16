const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// ============================================================================
// 1. VARIABLES DU CLIENT ET JOUEUR LOCAL
// ============================================================================

let players = {};
let myId = null;

let specialEventActive = false;
let bossData = { active: false, hp: 10000, maxHp: 10000, x: 2000, y: 2000 };

const myPlayer = {
    x: 400,
    y: 300,
    speed: 5,
    skin: 'default',
    isAngel: false
};


// ============================================================================
// 2. CONFIGURATION DES PERSONNAGES ET ÉQUILIBRAGES
// ============================================================================

const charactersConfig = {

    // Phénix : Cooldown plus long & arme ralentie
    phoenix: {
        cooldown: 12000,
        weaponSpeed: 0.8,
        visibleAbilityActivation: true
    },

    // Zéphir : Mince pompe que Corona
    zephyr: {
        weapon: 'shotgun_corona'
    },

    // Nouveau perso : Chamber (doré) avec sniper 1 balle One-Shot
    chamber: {
        name: "Chamber (doré)",
        primaryWeapon: "pistol",
        ability: "golden_sniper",
        ammo: 1,
        oneShot: true
    },

    // Nouveau perso secret exclusif : Tong Tong Sahur
    bossTongTong: {
        name: "Tong Tong Sahur",
        secret: true,
        rainbowBorder: true,
        ability: "teleport_behind_nearest"
    }

};


// ============================================================================
// 3. RÉCEPTION DES ÉVÉNEMENTS DU SERVEUR
// ============================================================================

socket.on('init', (data) => {
    players = data.players;
    myId = socket.id;
    specialEventActive = data.specialEventActive;
    bossData = data.boss;
});

socket.on('playerJoined', (player) => {
    players[player.id] = player;
});

socket.on('playerMoved', (player) => {
    if (players[player.id]) {
        players[player.id].x = player.x;
        players[player.id].y = player.y;
    }
});

socket.on('playerUpdated', (player) => {
    players[player.id] = player;
});

socket.on('playerDisconnected', (id) => {
    delete players[id];
});

socket.on('specialEventState', (data) => {
    specialEventActive = data.active;
    bossData = data.boss;
});

socket.on('bossRespawned', (data) => {
    bossData = data;
});

socket.on('bossUpdate', (data) => {
    bossData = data;
});

socket.on('bossDefeatedReward', (reward) => {
    alert(`🎉 VICTOIRE ! Boss battu !\n+${reward.coins} Pièces\n+${reward.xp} XP\nPersonnage Tong Tong Sahur débloqué !`);
});


// ============================================================================
// 4. BOUCLE PRINCIPALE DE RENDU (GAME LOOP)
// ============================================================================

function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // --- DESSIN DU BOSS SAHUR GÉANT EN MODE ÉVÉNEMENT ---
    if (specialEventActive && bossData.active) {

        ctx.fillStyle = "darkred";
        ctx.beginPath();
        ctx.arc(bossData.x, bossData.y, 55, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "gold";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("TONG TONG SAHUR (BOSS GÉANT)", bossData.x, bossData.y - 65);

        // Affiche la barre de vie du Boss en haut au milieu
        drawBossHealthBar();
    }


    // --- DESSIN DE TOUS LES JOUEURS ---
    for (let id in players) {

        let p = players[id];

        // Rendu Visuel du GOD MODE : Ange avec halo lumineux et animations autour
        if (p.isAngel) {
            ctx.save();
            ctx.shadowBlur = 30;
            ctx.shadowColor = "gold";
            ctx.fillStyle = "rgba(255, 223, 0, 0.6)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, 26 + Math.sin(Date.now() / 150) * 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        ctx.fillStyle = p.id === myId ? '#00bfff' : '#888888';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
        ctx.fill();

    }


    // --- MISE À JOUR DU TOP 10 GLOBAL ---
    updateLeaderboard();


    requestAnimationFrame(gameLoop);

}


// ============================================================================
// 5. AFFICHAGE BARRE DE VIE DU BOSS (HAUT / MILIEU DE L'ÉCRAN)
// ============================================================================

function drawBossHealthBar() {

    const barWidth = 450;
    const barHeight = 26;
    const x = (canvas.width - barWidth) / 2;
    const y = 20;

    // Fond
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(x, y, barWidth, barHeight);

    // Barre rouge
    const ratio = bossData.hp / bossData.maxHp;
    ctx.fillStyle = "crimson";
    ctx.fillRect(x, y, barWidth * ratio, barHeight);

    // Contour blanc
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);

    // Texte avec PV
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`TONG TONG SAHUR : ${Math.floor(bossData.hp)} / ${bossData.maxHp}`, x + barWidth / 2, y + 18);

}


// ============================================================================
// 6. TOP 10 GLOBAL (TOUS LES RANGS EN COMMUN)
// ============================================================================

function updateLeaderboard() {

    const allPlayers = Object.values(players);

    // Tri de TOUS les joueurs peu importe leur rang
    const sorted = allPlayers.sort((a, b) => b.score - a.score).slice(0, 10);

    let html = "<h3>🏆 Top 10 Global</h3><ol>";

    sorted.forEach(p => {
        html += `<li>${p.id === myId ? '⭐ <b>Moi</b>' : 'Joueur'} - Score: ${p.score} (${p.rank || 'Tout Rang'})</li>`;
    });

    html += "</ol>";

    let lbEl = document.getElementById('leaderboard');
    if (lbEl) lbEl.innerHTML = html;

}


// ============================================================================
// 7. FONCTIONS DE COMMANDES ADMIN
// ============================================================================

function adminToggleSpecialEvent() {
    specialEventActive = !specialEventActive;
    socket.emit('adminToggleSpecialEvent', specialEventActive);
}

function adminRespawnBoss() {
    socket.emit('adminRespawnBoss');
}

function adminSetSkinTarget(targetId, skinName, godMode) {
    socket.emit('adminSetSkin', { targetId, skinName, godMode });
}


// --- DÉPLACEMENTS CLAVIER ---
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') myPlayer.y -= myPlayer.speed;
    if (e.key === 'ArrowDown') myPlayer.y += myPlayer.speed;
    if (e.key === 'ArrowLeft') myPlayer.x -= myPlayer.speed;
    if (e.key === 'ArrowRight') myPlayer.x += myPlayer.speed;
    socket.emit('playerMove', { x: myPlayer.x, y: myPlayer.y });
});


// Lancement du jeu
requestAnimationFrame(gameLoop);