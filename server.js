const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));


// ============================================================================
// 1. ÉTAT GLOBAL DU JEU ET VARIABLES SERVEUR
// ============================================================================

const players = {};

let specialEventActive = false;

let bossData = {
    active: false,
    hp: 10000,
    maxHp: 10000,
    x: 2000,
    y: 2000
};


// ============================================================================
// 2. GESTION DES CONNEXIONS ET ÉVÉNEMENTS SOCKET.IO
// ============================================================================

io.on('connection', (socket) => {

    console.log('Un joueur s\'est connecté :', socket.id);


    // Initialisation d'un nouveau joueur
    players[socket.id] = {
        id: socket.id,
        x: Math.random() * 800,
        y: Math.random() * 600,
        score: 0,
        rank: 'Bronze',
        skin: 'default',
        godMode: false,
        isAngel: false
    };


    // Envoie l'état initial au joueur connecté
    socket.emit('init', { players, specialEventActive, bossData });

    socket.broadcast.emit('playerJoined', players[socket.id]);


    // --- DEPLACEMENT DES JOUEURS ---
    socket.on('playerMove', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });


    // ========================================================================
    // 3. FONCTIONNALITÉS ADMIN & ÉVÉNEMENT SPÉCIAL
    // ========================================================================

    // Activer / Désactiver le Mode Événement Spécial depuis le menu admin
    socket.on('adminToggleSpecialEvent', (active) => {
        specialEventActive = active;
        if (active && !bossData.active) {
            bossData.active = true;
            bossData.hp = bossData.maxHp;
        }
        io.emit('specialEventState', { active: specialEventActive, boss: bossData });
    });


    // Option Admin pour faire re-spawn le Boss géant
    socket.on('adminRespawnBoss', () => {
        bossData.active = true;
        bossData.hp = bossData.maxHp;
        io.emit('bossRespawned', bossData);
    });


    // Donner un skin ou activer le God Mode (Skin d'ange animé) à une personne sélectionnée
    socket.on('adminSetSkin', ({ targetId, skinName, godMode }) => {
        const target = players[targetId];
        if (target) {
            target.skin = skinName;
            if (godMode !== undefined) {
                target.godMode = godMode;
                target.isAngel = godMode;
            }
            io.emit('playerUpdated', target);
        }
    });


    // ========================================================================
    // 4. COMBAT CONTRE LE BOSS & RÉCOMPENSES
    // ========================================================================

    socket.on('bossHit', (damage) => {
        if (bossData.active) {
            bossData.hp -= damage;

            if (bossData.hp <= 0) {
                bossData.hp = 0;
                bossData.active = false;

                // Récompenses distribuées à tous les joueurs présents
                for (let id in players) {
                    players[id].score += 5000;
                    io.to(id).emit('bossDefeatedReward', {
                        coins: 5000,
                        xp: 2000,
                        exclusiveChar: true
                    });
                }
            }

            io.emit('bossUpdate', bossData);
        }
    });


    // --- DECONNEXION ---
    socket.on('disconnect', () => {
        console.log('Un joueur s\'est déconnecté :', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });

});


// ============================================================================
// 5. DEMARRAGE DU SERVEUR
// ============================================================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});