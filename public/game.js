const socket = io();

// Variables globales du jeu
let currentMode = null;
let player = {
    x: 100, y: 100,
    coins: 0, xp: 0,
    character: 'default',
    skin: 'default',
    isGodMode: false,
    hasAngelAnimations: false,
    hasSniperBullet: false
};

// --- 1. Gestion des Lobbys & Compteurs ---
function selectLobby(mode) {
    currentMode = mode;
    socket.emit('joinMode', mode);
    document.getElementById('lobby-menu').style.display = 'none';
    document.getElementById('game-hud').style.display = 'block';
    if (mode === 'special') {
        document.getElementById('special-boss-hud').style.display = 'block';
    }
}

socket.on('playerCounts', (counts) => {
    if(document.getElementById('count-classic')) {
        document.getElementById('count-classic').innerText = `En ligne : ${counts.classic}`;
        document.getElementById('count-ranked').innerText = `En ligne : ${counts.ranked}`;
        document.getElementById('count-special').innerText = `En ligne : ${counts.special}`;
    }
});

// --- 2. Mode Spécial & Boss (Tong Tong Sahur Géant) ---
let bossData = { alive: false, health: 15000, maxHealth: 15000 };

socket.on('bossState', (data) => {
    bossData = data;
    updateBossHUD();
});

socket.on('bossSpawned', (data) => {
    bossData.alive = true;
    bossData.health = data.health;
    bossData.maxHealth = data.maxHealth;
    alert("Le Tong Tong Sahur géant est apparu ! Préparez vos armes en équipe !");
    updateBossHUD();
});

socket.on('bossHealthUpdate', (data) => {
    bossData.health = data.health;
    updateBossHUD();
});

socket.on('bossDefeated', (data) => {
    bossData.alive = false;
    alert(`Victoire ! Vous avez vaincu le Boss ! +${data.rewardCoins} pièces, +${data.rewardXp} XP et déblocage du personnage secret !`);
    player.coins += data.rewardCoins;
    player.xp += data.rewardXp;
    unlockSecretCharacter(data.unlockCharacter);
});

function updateBossHUD() {
    let fill = document.getElementById('boss-hp-fill');
    if (fill) {
        let pct = Math.max(0, (bossData.health / bossData.maxHealth) * 100);
        fill.style.width = pct + '%';
    }
}

function unlockSecretCharacter(charId) {
    // Ajout visuel avec contours arc-en-ciel dans la boutique et la sélection
    let roster = document.getElementById('character-roster');
    if (roster) {
        let card = document.createElement('div');
        card.className = 'character-card rainbow-border';
        card.innerHTML = `<span>Tong Tong Sahur (Boss)</span>`;
        roster.appendChild(card);
    }
}

// --- 3. Personnages & Compétences ---

// Personnage : Chamber (Doré)
function selectChamber() {
    player.character = 'chamber_gold';
    player.primaryWeapon = 'pistol';
    player.hasSniperBullet = false;
}

function useChamberAbility() {
    if (player.character === 'chamber_gold' && !player.hasSniperBullet) {
        player.hasSniperBullet = true;
        player.currentWeapon = 'sniper_one_shot'; // One shot unique
        console.ch("Chamber équipé de son sniper unique (One-Shot).");
    }
}

// Personnage Boss (Taille normale) : Pouvoir de téléportation dans le dos
function bossNormalTeleport(targetEnemy) {
    if (targetEnemy) {
        // Se téléporte dans le dos du joueur ou bot le plus proche visible à l'écran
        let angle = targetEnemy.rotation || 0;
        player.x = targetEnemy.x - Math.cos(angle) * 50;
        player.y = targetEnemy.y - Math.sin(angle) * 50;
    }
}

// --- 4. Équilibrages (Phénix & Zéphir) ---
let phenixCooldown = 20000; // Cooldown plus long
let lastPhenixUse = 0;

function activatePhenixPower() {
    let now = Date.now();
    if (now - lastPhenixUse < phenixCooldown) {
        console.log("Compétence de Phénix en recharge.");
        return;
    }
    lastPhenixUse = now;
    player.isPhenixActive = true;
    player.weaponSpeed *= 0.85; // Ralentissement léger de son arme
    // Visible par tous les autres joueurs
    socket.emit('phenixActivated', { playerId: socket.id });
    
    setTimeout(() => { player.isPhenixActive = false; }, 5000);
}

function applyZephyrLoadout() {
    // Utilise le même pompe que Corona
    player.weapon = 'corona_shotgun';
}

// --- 5. Classement Global (Top 10 tous rangs confondus) ---
function updateGlobalLeaderboard(allPlayersList) {
    // Tri combiné pour un Top 10 commun sans distinction de rang radiant uniquement
    let sorted = allPlayersList.sort((a, b) => b.score - a.score);
    let top10 = sorted.slice(0, 10);
    
    let listEl = document.getElementById('leaderboard-container');
    if (listEl) {
        listEl.innerHTML = top10.map((p, idx) => `
            <div class="leaderboard-row">
                <span>#${idx + 1} - ${p.name} [${p.rank}]</span>
                <span>${p.score} pts</span>
            </div>
        `).join('');
    }
}

// --- 6. Menu Admin & God Mode (Ange) ---
socket.on('updatePlayerSkin', ({ targetId, skin, isGodMode }) => {
    // Si l'événement s'applique à ce client ou globalement
    if (socket.id === targetId || targetId === 'all') {
        player.isGodMode = isGodMode;
        if (isGodMode) {
            player.skin = 'angel_god_mode';
            player.hasAngelAnimations = true; // Active les animations d'ange autour
        } else {
            player.skin = skin;
            player.hasAngelAnimations = false;
        }
    }
});

// Fonction admin déclenchée depuis l'interface admin
function adminTriggerRespawnBoss() {
    socket.emit('adminRespawnBoss');
}

function adminApplySkinAndGodMode(targetId, skinName, godModeBool) {
    socket.emit('adminSetSkin', { targetId: targetId, skin: skinName, isGodMode: godModeBool });
}