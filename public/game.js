// Connexion WebSocket
const socket = io();

// Configuration du Canvas et du rendu graphique
const canvas = document.getElementById('gameCanvas') || document.querySelector('canvas') || document.createElement('canvas');
if (!canvas.id) {
    canvas.id = 'gameCanvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
}
const ctx = canvas.getContext('2d');

// Variables d'état du jeu
let currentMode = null;
let players = new Map();
let player = {
    x: canvas.width / 2, 
    y: canvas.height / 2,
    coins: 0, 
    xp: 0,
    character: 'default',
    skin: 'default',
    isGodMode: false,
    hasAngelAnimations: false,
    hasSniperBullet: false,
    score: 0,
    rank: 'Bronze'
};

// --- 1. Gestion des Lobbys & Compteurs ---
function selectLobby(mode) {
    currentMode = mode;
    socket.emit('joinMode', mode);
    
    // Gestion de l'affichage UI des menus et du jeu
    let menu = document.getElementById('lobby-menu') || document.getElementById('menu');
    if (menu) menu.style.display = 'none';
    
    canvas.style.display = 'block';
}

socket.on('playerCounts', (counts) => {
    updateCountDisplay('count-classic', counts.classic);
    updateCountDisplay('count-ranked', counts.ranked);
    updateCountDisplay('count-special', counts.special);
});

function updateCountDisplay(elementId, count) {
    let el = document.getElementById(elementId);
    if (el) {
        el.innerText = `En ligne : ${count}`;
    }
}

// --- 2. Mode Spécial & Boss (Tong Tong Sahur Géant) ---
let bossData = { alive: false, health: 15000, maxHealth: 15000 };

socket.on('bossState', (data) => {
    bossData = data;
    renderBossHUD();
});

socket.on('bossSpawned', (data) => {
    bossData.alive = true;
    bossData.health = data.health;
    bossData.maxHealth = data.maxHealth;
    alert("Le Tong Tong Sahur géant est apparu dans le mode spécial !");
    renderBossHUD();
});

socket.on('bossHealthUpdate', (data) => {
    bossData.health = data.health;
    renderBossHUD();
});

socket.on('bossDefeated', (data) => {
    bossData.alive = false;
    alert(`Victoire collective ! Le boss a été vaincu. +${data.rewardCoins} pièces, +${data.rewardXp} XP et déblocage du personnage secret !`);
    player.coins += data.rewardCoins;
    player.xp += data.rewardXp;
    unlockSecretCharacter(data.unlockCharacter);
});

function renderBossHUD() {
    let hud = document.getElementById('special-boss-hud');
    if (!hud) {
        hud = document.createElement('div');
        hud.id = 'special-boss-hud';
        hud.style.position = 'absolute';
        hud.style.top = '10px';
        hud.style.left = '50%';
        hud.style.transform = 'translateX(-50%)';
        hud.style.textAlign = 'center';
        hud.style.zIndex = '999';
        hud.innerHTML = `
            <div style="color: white; font-weight: bold; margin-bottom: 5px;">Tong Tong Sahur Géant (Boss)</div>
            <div style="width: 300px; height: 20px; border: 2px solid #fff; background: rgba(0,0,0,0.6);">
                <div id="boss-hp-fill" style="width: 100%; height: 100%; background: #ff2222; transition: width 0.2s;"></div>
            </div>
        `;
        document.body.appendChild(hud);
    }
    let fill = document.getElementById('boss-hp-fill');
    if (fill) {
        let pct = Math.max(0, (bossData.health / bossData.maxHealth) * 100);
        fill.style.width = pct + '%';
    }
}

function unlockSecretCharacter(charId) {
    let roster = document.getElementById('character-roster');
    if (roster) {
        let card = document.createElement('div');
        card.className = 'character-card rainbow-border';
        card.style.border = '3px solid transparent';
        card.style.borderImage = 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet) 1';
        card.innerHTML = `<span>Tong Tong Sahur (Boss Secret)</span>`;
        roster.appendChild(card);
    }
}

// --- 3. Personnages : Chamber (Doré) & Boss Normal ---
function selectChamber() {
    player.character = 'chamber_gold';
    player.primaryWeapon = 'pistol';
    player.hasSniperBullet = false;
}

function useChamberAbility() {
    if (player.character === 'chamber_gold' && !player.hasSniperBullet) {
        player.hasSniperBullet = true;
        player.currentWeapon = 'sniper_one_shot';
    }
}

// Pouvoir du Boss en taille normale : se téléporter dans le dos de la cible visible la plus proche
function bossNormalTeleport(targetEnemy) {
    if (targetEnemy) {
        let angle = targetEnemy.rotation || 0;
        player.x = targetEnemy.x - Math.cos(angle) * 50;
        player.y = targetEnemy.y - Math.sin(angle) * 50;
    }
}

// --- 4. Équilibrages (Phénix & Zéphir) ---
let phenixCooldown = 25000; 
let lastPhenixUse = 0;

function activatePhenixPower() {
    let now = Date.now();
    if (now - lastPhenixUse < phenixCooldown) return;
    lastPhenixUse = now;
    player.isPhenixActive = true;
    player.weaponSpeed *= 0.8; // Léger ralentissement de l'arme
    socket.emit('phenixActivated', { playerId: socket.id });
    setTimeout(() => { player.isPhenixActive = false; }, 4000);
}

function applyZephyrLoadout() {
    player.weapon = 'corona_shotgun'; // Même pompe que Corona
}

// --- 5. Classement Global (Top 10 Tous Rangs Confondus) ---
function updateGlobalLeaderboard(allPlayersList) {
    let sorted = allPlayersList.sort((a, b) => b.score - a.score);
    let top10 = sorted.slice(0, 10);
    
    let listEl = document.getElementById('leaderboard-container');
    if (listEl) {
        listEl.innerHTML = top10.map((p, idx) => `
            <div class="leaderboard-row" style="color: #fff; padding: 4px;">
                #${idx + 1} - ${p.name || 'Joueur'} (${p.rank || 'Bronze'}) : ${p.score} pts
            </div>
        `).join('');
    }
}

// --- 6. Menu Admin & God Mode (Ange avec animations) ---
socket.on('updatePlayerSkin', ({ targetId, skin, isGodMode }) => {
    if (socket.id === targetId || targetId === 'all') {
        player.isGodMode = isGodMode;
        if (isGodMode) {
            player.skin = 'angel_god_mode';
            player.hasAngelAnimations = true;
        } else {
            player.skin = skin;
            player.hasAngelAnimations = false;
        }
    }
});

function adminTriggerRespawnBoss() {
    socket.emit('adminRespawnBoss');
}

function adminApplySkinAndGodMode(targetId, skinName, godModeBool) {
    socket.emit('adminSetSkin', { targetId: targetId, skin: skinName, isGodMode: godModeBool });
}

// --- 7. Boucle de Rendu Graphique (Évite l'écran noir) ---
function gameLoop() {
    // Effacer le canvas avec un fond propre (ex: gris sombre / noir de jeu)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner le joueur principal
    ctx.save();
    ctx.translate(player.x, player.y);
    
    // Effets visuels du God Mode (Ange avec anneau / animations dorées)
    if (player.hasAngelAnimations) {
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 35 + Math.sin(Date.now() / 200) * 5, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Corps du joueur selon son skin/personnage
    ctx.fillStyle = player.isGodMode ? '#ffeb3b' : '#3f51b5';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Répétition de la boucle de rendu
    requestAnimationFrame(gameLoop);
}

// Lancement de la boucle principale du jeu
requestAnimationFrame(gameLoop);

// Redimensionnement automatique de la fenêtre
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});