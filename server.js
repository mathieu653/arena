const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Gestion des lobbys et des joueurs
const lobbies = {
    classic: { players: new Map() },
    ranked: { players: new Map() },
    special: { 
        players: new Map(), 
        bossAlive: false, 
        bossHealth: 15000, 
        maxBossHealth: 15000 
    }
};

function broadcastPlayerCounts() {
    io.emit('playerCounts', {
        classic: lobbies.classic.players.size,
        ranked: lobbies.ranked.players.size,
        special: lobbies.special.players.size
    });
}

io.on('connection', (socket) => {
    console.log(`Un joueur s'est connecté : ${socket.id}`);

    // Rejoindre un mode spécifique (lobbies séparés)
    socket.on('joinMode', (mode) => {
        Object.keys(lobbies).forEach(m => {
            if (lobbies[m].players.has(socket.id)) {
                lobbies[m].players.delete(socket.id);
                socket.leave(m);
            }
        });

        if (lobbies[mode]) {
            lobbies[mode].players.set(socket.id, { id: socket.id, mode: mode });
            socket.join(mode);
            socket.roomMode = mode;
            broadcastPlayerCounts();

            // Si le mode spécial, envoyer l'état actuel du boss
            if (mode === 'special') {
                socket.emit('bossState', {
                    alive: lobbies.special.bossAlive,
                    health: lobbies.special.bossHealth,
                    maxHealth: lobbies.special.maxBossHealth
                });
            }
        }
    });

    // Option Menu Admin : Respawn du Boss géant dans le mode spécial
    socket.on('adminRespawnBoss', () => {
        lobbies.special.bossAlive = true;
        lobbies.special.bossHealth = lobbies.special.maxBossHealth;
        io.to('special').emit('bossSpawned', {
            health: lobbies.special.bossHealth,
            maxHealth: lobbies.special.maxBossHealth
        });
    });

    // Option Menu Admin : Assigner un skin ou activer le God Mode (Ange avec animations)
    socket.on('adminSetSkin', ({ targetId, skin, isGodMode }) => {
        io.emit('updatePlayerSkin', { targetId, skin, isGodMode });
    });

    // Gestion des dégâts infligés au boss géant en mode spécial
    socket.on('attackBoss', (damage) => {
        if (socket.roomMode === 'special' && lobbies.special.bossAlive) {
            lobbies.special.bossHealth -= damage;
            if (lobbies.special.bossHealth <= 0) {
                lobbies.special.bossHealth = 0;
                lobbies.special.bossAlive = false;
                // Le boss est vaincu : récompense tous les joueurs présents dans le mode spécial
                io.to('special').emit('bossDefeated', {
                    rewardCoins: 5000,
                    rewardXp: 2500,
                    unlockCharacter: 'boss_secret'
                });
            } else {
                io.to('special').emit('bossHealthUpdate', { health: lobbies.special.bossHealth });
            }
        }
    });

    socket.on('disconnect', () => {
        Object.keys(lobbies).forEach(m => {
            if (lobbies[m].players.has(socket.id)) {
                lobbies[m].players.delete(socket.id);
            }
        });
        broadcastPlayerCounts();
        console.log(`Joueur déconnecté : ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});