// Connexion WebSocket
const socket = io();

// Initialisation du Canvas et du contexte graphique 2D
const canvas = document.getElementById('gameCanvas') || document.querySelector('canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// Gestion du redimensionnement de l'écran
if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// État local du joueur
let player = {
    x: canvas ? canvas.width / 2 : 100,
    y: canvas ? canvas.height / 2 : 100,
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

let currentMode = null;
let bossData = { alive: false, health: 15000, maxHealth: 15000 };

// --- 1. SÉLECTION DES LOBBYS & COMPTEURS ---
function selectLobby(mode) {
    currentMode = mode;
    socket.emit('joinMode', mode);
    
    // Masquer le menu principal et afficher l'interface de jeu
    const menu = document.getElementById('lobby-menu') || document.getElementById('menu');
    if (menu) menu.style.display = 'none';
}

socket.on('playerCounts', (counts) => {
    updateCount('count-classic', counts.classic);
    updateCount('count-ranked', counts.ranked);
    updateCount('count-special', counts.special);
});

function updateCount(elementId, count) {
    const el = document.getElementById(elementId);
    if (el) el.innerText = `En ligne : ${count}`;
}

// --- 2. MODE SPÉCIAL & BOSS (TONG TONG SAHUR GÉANT) ---
socket.on('bossState', (data) => {
    bossData = data;
    updateBossHUD();
});

socket.on('bossSpawned', (data) => {
    bossData.alive = true;
    bossData.health = data.health;
    bossData.maxHealth = data.maxHealth;
    alert("Le Tong Tong Sahur géant est apparu ! En équipe, éliminez-le !");
    updateBossHUD();
});

socket.on('bossHealthUpdate', (data) => {
    bossData.health = data.health;
    updateBossHUD();
});

socket.on('bossDefeated', (data) => {
    bossData.alive = false;
    alert(`Victoire ! Boss vaincu ! +${data.rewardCoins} pièces, +${data.rewardXp} XP et déblocage du personnage secret !`);
    player.coins += data.rewardCoins;
    player.xp += data.rewardXp;
    unlockSecretCharacter(data.unlockCharacter);
});

function updateBossHUD() {
    let hud = document.getElementById('special-boss-hud');
    if (!hud && document.body) {
        hud = document.createElement('div');
        hud.id = 'special-boss-hud';
        hud.style.cssText = "position:fixed; top:10px; left:50%; transform:translateX(-50%); text-align:center; z-index:999; color:white; font-weight:bold;";
        hud.innerHTML = `
            <div>Tong Tong Sahur Géant</div>
            <div style="width:300px; height:18px; border:2px solid #fff; background:rgba(0,0,0,0.6); margin-top:4px;">
                <div id="boss-hp-fill" style="width:100%; height:100%; background:red;"></div>
            </div>
        `;
        document.body.appendChild(hud);
    }
    const fill = document.getElementById('boss-hp-fill');
    if (fill) {
        const pct = Math.max(0, (bossData.health / bossData.maxHealth) * 100);
        fill.style.width = pct + '%';
    }
}

function unlockSecretCharacter(charId) {
    const roster = document.getElementById('character-roster');
    if (roster) {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.style.border = '3px solid gold';
        card.style.boxShadow = '0 0 10px violet';
        card.innerHTML = `<span>Tong Tong Sahur (Secret Exclusif)</span>`;
        roster.appendChild(card);
    }
}

// --- 3. PERSONNAGES (CHAMBER & BOSS NORMAL) ---
function selectChamber() {
    player.character = 'chamber_gold';
    player.hasSniperBullet = false;
}

function useChamberAbility() {
    if (player.character === 'chamber_gold' && !player.hasSniperBullet) {
        player.hasSniperBullet = true; // Équipement du sniper unique one-shot
    }
}

function bossNormalTeleport(targetEnemy) {
    if (targetEnemy) {
        const angle = targetEnemy.rotation || 0;
        player.x = targetEnemy.x - Math.cos(angle) * 50;
        player.y = targetEnemy.y - Math.sin(angle) * 50;
    }
}

// --- 4. ÉQUILIBRAGES (PHÉNIX & ZÉPHIR) ---
let phenixCooldown = 25000;
let lastPhenixUse = 0;

function activatePhenixPower() {
    const now = Date.now();
    if (now - lastPhenixUse < phenixCooldown) return;
    lastPhenixUse = now;
    player.isPhenixActive = true;
    player.weaponSpeed *= 0.85; // Ralentissement léger
    socket.emit('phenixActivated', { playerId: socket.id });
    setTimeout(() => { player.isPhenixActive = false; }, 5000);
}

function applyZephyrLoadout() {
    player.weapon = 'corona_shotgun'; // Même pompe que Corona
}

// --- 5. CLASSEMENT GLOBAL (TOP 10 COMMUN) ---
function updateGlobalLeaderboard(allPlayersList) {
    const sorted = allPlayersList.sort((a, b) => b.score - a.score);
    const top10 = sorted.slice(0, 10);
    const listEl = document.getElementById('leaderboard-container');
    if (listEl) {
        listEl.innerHTML = top10.map((p, idx) => `
            <div>#${idx + 1} - ${p.name || 'Joueur'} (${p.rank || 'Bronze'}) : ${p.score} pts</div>
        `).join('');
    }
}

// --- 6. MENU ADMIN & GOD MODE (ANGE) ---
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

// --- 7. BOUCLE DE JEU DE SECOURS (SI LE PROJET N'EN A PAS) ---
function fallbackGameLoop() {
    if (ctx && canvas) {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dessin du joueur avec animations God Mode Ange si actif
        ctx.save();
        ctx.translate(player.x, player.y);
        if (player.hasAngelAnimations) {
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 32 + Math.sin(Date.now() / 200) * 4, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.fillStyle = player.isGodMode ? '#ffeb3b' : '#3f51b5';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    requestAnimationFrame(fallbackGameLoop);
}

// Lancement de la boucle si aucune autre boucle n'écrase le canvas
if (ctx) {
    requestAnimationFrame(fallbackGameLoop);
}
```[cite: 1]