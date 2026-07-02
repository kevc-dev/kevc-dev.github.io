import {
    CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATE, GAME_TIME_MULTIPLIER,
    DAY_START_HOUR, DAY_END_HOUR, INITIAL_GAME_HOUR,
    INTERACTION_RANGE, SHAKE_DURATION, SHAKE_INTERVAL, SHAKE_INTENSITY
} from './constants.js';
import { SoundManager } from './SoundManager.js';
import { UIManager } from './UIManager.js';
import { InputHandler } from './InputHandler.js';
import { Player } from './entities/Player.js';
import { GameMap } from './GameMap.js';
import { ParticleSystem } from './Particles.js';
import { getObjectTypes, getEnemyTypes, getItemTypes, getCritterTypes, getMaps, MAP_MUSIC } from './gameData.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = GAME_STATE.START_SCREEN;
        this.animationFrame = 0;
        this.sound = new SoundManager();
        this.ui = new UIManager(this);
        this.input = new InputHandler(this);
        this.particles = new ParticleSystem();
        this.player = null;
        this.currentMap = null;
        this.interactionTarget = null;
        this.pendingPortal = null;
        this.currentPuzzle = null;
        this.gameTime = INITIAL_GAME_HOUR * 3600;
        this.dayTime = true;
        this.lastFrameTime = 0;
        this.loopRunning = false;
        this.introPanel = 0;
        this.defineGameData();
        this.ui.showStartScreen();
        this.sound.playMusic('menuTheme');
        // Click/tap advances the intro comic
        this.canvas.addEventListener('click', () => {
            if (this.gameState === GAME_STATE.INTRO) this.advanceIntro();
        });
    }

    defineGameData() {
        this.objectTypes = getObjectTypes();
        this.enemyTypes = getEnemyTypes();
        this.itemTypes = getItemTypes();
        this.critterTypes = getCritterTypes();
        this.maps = getMaps();
    }

    setGameState(newState) {
        this.gameState = newState;
        if (newState !== GAME_STATE.START_SCREEN) this.ui.hideStartScreen();
        if (newState !== GAME_STATE.PAUSED) this.ui.hidePauseScreen();
        if (newState !== GAME_STATE.GAME_OVER) this.ui.hideGameOverScreen();
        if (newState !== GAME_STATE.PUZZLE) this.ui.hidePuzzle();
        if (newState !== GAME_STATE.WIN) this.ui.hideWinScreen();
        if (newState !== GAME_STATE.DIALOG) this.ui.hideDialog();

        switch (newState) {
            case GAME_STATE.START_SCREEN:
                this.ui.showStartScreen();
                this.sound.playMusic('menuTheme');
                break;
            case GAME_STATE.PLAYING:
                this.sound.resumeCurrentMusic();
                break;
            case GAME_STATE.PAUSED:
                this.ui.showPauseScreen();
                this.sound.pauseCurrentMusic();
                break;
            case GAME_STATE.PUZZLE:
                this.sound.pauseCurrentMusic();
                this.ui.showPuzzle(this.currentPuzzle.question, this.currentPuzzle.options);
                break;
            case GAME_STATE.WIN:
                this.sound.stopMusic();
                this.sound.playSound('winGame');
                this.ui.showWinScreen("The stick comes out of the olla whole. Four centuries of sky and water — the great star of 1006, the floods, the drought years, and one final, deliberate mark. Cutler makes his offer. You make a phone call instead: Salt River, cultural office, Frances Antone's desk. Some things aren't found, Professor. They're returned.");
                break;
            case GAME_STATE.GAME_OVER:
                this.sound.stopMusic();
                this.sound.playSound('gameOver');
                break;
        }
    }

    startGame(isRestart = false) {
        this.ui.hideStartScreen();
        if (!isRestart) {
            // Play the intro comic before the expedition begins
            this.gameState = GAME_STATE.INTRO;
            this.introPanel = 0;
            this.ensureLoop();
            return;
        }
        this.beginExpedition();
    }

    advanceIntro() {
        this.sound.playSound('selectOption');
        this.introPanel++;
        if (this.introPanel > 3) this.beginExpedition();
    }

    ensureLoop() {
        if (!this.loopRunning) {
            this.loopRunning = true;
            this.gameLoop(0);
        }
    }

    beginExpedition() {
        this.ui.showLoading();
        this.gameState = GAME_STATE.LOADING;
        setTimeout(() => {
            this.player = new Player(this, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            this.gameTime = INITIAL_GAME_HOUR * 3600;
            this.defineGameData();
            this.currentMap = null;
            this.changeMap('desert', this.player.x, this.player.y);
            this.ui.updateHealth(this.player.health, this.player.maxHealth);
            this.ui.updateHydration(this.player.hydration, this.player.maxHydration);
            this.ui.updateInventoryDisplay(this.player.inventory, this.itemTypes);
            this.ui.updateQuestLog(this.player.quests);
            this.setGameState(GAME_STATE.PLAYING);
            this.ui.hideLoading();
            this.ensureLoop();
        }, 500);
    }

    goToMainMenu() {
        this.sound.stopMusic();
        this.setGameState(GAME_STATE.START_SCREEN);
    }

    changeMap(mapName, playerX, playerY) {
        const isInitialLoad = !this.currentMap;
        this.sound.stopMusic();
        if (!isInitialLoad) this.sound.playSound('nextScenario');

        if (!this.maps[mapName]) {
            console.error(`Map ${mapName} not found!`);
            return;
        }

        const mapData = this.maps[mapName];
        // Deep-copy JSON-safe parts only; NPC dialogs may be functions and must survive.
        const freshMapData = {
            ...mapData,
            objects: JSON.parse(JSON.stringify(mapData.objects || [])),
            enemies: JSON.parse(JSON.stringify(mapData.enemies || [])),
            critters: JSON.parse(JSON.stringify(mapData.critters || [])),
            npcs: mapData.npcs || [],
        };
        this.particles.clear();
        this.currentMap = new GameMap(this, freshMapData);
        if (this.player) {
            this.player.x = playerX;
            this.player.y = playerY;
        }
        this.ui.updateMapName(this.currentMap.name);

        const musicDelay = isInitialLoad ? 0 : (this.sound.sounds.nextScenario.duration && isFinite(this.sound.sounds.nextScenario.duration) ? this.sound.sounds.nextScenario.duration * 1000 : 200);

        setTimeout(() => {
            if ((this.gameState !== GAME_STATE.PLAYING && this.gameState !== GAME_STATE.DIALOG) || !this.currentMap || this.currentMap.name !== mapData.name) return;

            if (mapName === 'desert' && isInitialLoad) {
                this.sound.playSound('gameStart');
                const gameStartDuration = this.sound.sounds.gameStart.duration;
                setTimeout(() => {
                    if (this.gameState === GAME_STATE.PLAYING && this.currentMap && this.currentMap.name === 'Sonoran Desert Outskirts') {
                        this.sound.playMusic('firstScenarioTheme', true);
                    }
                }, gameStartDuration && isFinite(gameStartDuration) ? gameStartDuration * 1000 : 500);
            } else {
                const musicKey = MAP_MUSIC[mapName];
                if (musicKey) this.sound.playMusic(musicKey, true);
            }
        }, musicDelay);
    }

    startPuzzle(puzzleDetails) {
        this.currentPuzzle = puzzleDetails;
        this.sound.playSound('thunder');
        const gameContainer = document.getElementById('gameContainer');
        let shakes = 0;
        const numShakes = SHAKE_DURATION / SHAKE_INTERVAL;
        const interval = setInterval(() => {
            const x = (Math.random() - 0.5) * SHAKE_INTENSITY;
            const y = (Math.random() - 0.5) * SHAKE_INTENSITY;
            gameContainer.style.transform = `translate(${x}px, ${y}px)`;
            shakes++;
            if (shakes >= numShakes) {
                clearInterval(interval);
                gameContainer.style.transform = 'translate(0,0)';
                const pedestal = this.currentMap.objects.find(obj => obj.objData.triggersPuzzle);
                if (pedestal) pedestal.objData.opened = true;
                this.setGameState(GAME_STATE.PUZZLE);
            }
        }, SHAKE_INTERVAL);
    }

    handlePuzzleAnswer(answerIndex) {
        if (!this.currentPuzzle) return;
        this.ui.hidePuzzle();
        if (answerIndex === this.currentPuzzle.correctAnswerIndex) {
            this.sound.playSound('puzzleCorrect');
            this.player.addItem('final_artifact');
            this.player.completeQuest('main_artifact');
            setTimeout(() => { this.setGameState(GAME_STATE.WIN); }, 500);
        } else {
            this.sound.playSound('puzzleIncorrect');
            this.gameOver("The counts don't align. Cutler smiles, and the moment — centuries in the making — passes to him.");
        }
        this.currentPuzzle = null;
    }

    gameLoop(timestamp) {
        this.animationFrame++;
        const deltaTime = (timestamp - this.lastFrameTime) / 1000;
        this.lastFrameTime = timestamp;
        if (this.gameState === GAME_STATE.PLAYING) this.update(deltaTime);
        this.draw();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    update(deltaTime) {
        if (!this.player || !this.currentMap) return;
        this.player.update();
        this.currentMap.update();
        this.particles.update();
        this.interactionTarget = null;
        this.gameTime += deltaTime * GAME_TIME_MULTIPLIER;
        const currentHour = Math.floor((this.gameTime % (24 * 3600)) / 3600);
        this.dayTime = currentHour >= DAY_START_HOUR && currentHour < DAY_END_HOUR;
        this.ui.updateClock(this.gameTime);

        let checkX = this.player.x + this.player.width / 2;
        let checkY = this.player.y + this.player.height / 2;
        switch (this.player.direction) {
            case 'up': checkY -= this.player.height / 2 + INTERACTION_RANGE / 2; break;
            case 'down': checkY += this.player.height / 2 + INTERACTION_RANGE / 2; break;
            case 'left': checkX -= this.player.width / 2 + INTERACTION_RANGE / 2; break;
            case 'right': checkX += this.player.width / 2 + INTERACTION_RANGE / 2; break;
        }

        const potentialTargets = [...this.currentMap.objects, ...this.currentMap.npcs];
        for (const entity of potentialTargets) {
            if (entity.isInteractable && Math.abs(entity.centerX - checkX) < (entity.width / 2 + 10) && Math.abs(entity.centerY - checkY) < (entity.height / 2 + 10)) {
                this.interactionTarget = entity;
                break;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        if (this.gameState === GAME_STATE.INTRO) {
            this.drawIntro(this.ctx);
            return;
        }
        if (this.gameState === GAME_STATE.PLAYING || this.gameState === GAME_STATE.DIALOG || this.gameState === GAME_STATE.PAUSED) {
            if (this.currentMap && this.player) this.currentMap.draw(this.ctx);
            this.particles.draw(this.ctx);
            if (this.interactionTarget && this.gameState === GAME_STATE.PLAYING) {
                this.ui.drawInteractionIndicator(this.interactionTarget.centerX, this.interactionTarget.y);
            }
        }
    }

    handleKeyUp(key) {
        if (this.gameState === GAME_STATE.INTRO) {
            if (key === 'e' || key === ' ' || key === 'enter') this.advanceIntro();
            return;
        }
        if (this.gameState === GAME_STATE.PLAYING) {
            if (key === 'e' || key === ' ') this.player.interact();
            else if (key === 'p') this.togglePause();
            else if (key === 'i') {
                this.ui.showDialog("Inventory: " + this.player.inventory.map(itemKey => this.itemTypes[itemKey].name).join(', '), "System");
                this.setGameState(GAME_STATE.DIALOG);
            }
            else if (key === 'q') this.ui.toggleQuestLog();
        } else if (this.gameState === GAME_STATE.DIALOG) {
            if (key === 'e' || key === ' ' || key === 'enter') {
                this.ui.hideDialog();
                if (this.pendingPortal) {
                    this.changeMap(this.pendingPortal.mapName, this.pendingPortal.toX, this.pendingPortal.toY);
                    this.pendingPortal = null;
                } else {
                    this.setGameState(GAME_STATE.PLAYING);
                }
            }
        } else if (this.gameState === GAME_STATE.PAUSED) {
            if (key === 'p') this.togglePause();
        }
    }

    // ---------- Intro comic ----------

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let yy = y;
        for (const word of words) {
            const test = line ? line + ' ' + word : word;
            if (ctx.measureText(test).width > maxWidth && line) {
                ctx.fillText(line, x, yy);
                line = word;
                yy += lineHeight;
            } else {
                line = test;
            }
        }
        if (line) ctx.fillText(line, x, yy);
        return yy;
    }

    drawIntro(ctx) {
        const W = CANVAS_WIDTH, H = CANVAS_HEIGHT;
        ctx.fillStyle = '#0A0A0A';
        ctx.fillRect(0, 0, W, H);

        // Panel frame
        const px = 44, py = 26, pw = W - 88, ph = 280;
        ctx.strokeStyle = '#E8DCC0';
        ctx.lineWidth = 3;
        ctx.strokeRect(px - 3, py - 3, pw + 6, ph + 6);

        ctx.save();
        ctx.beginPath();
        ctx.rect(px, py, pw, ph);
        ctx.clip();
        const captions = [
            "June 5, 1986. Scottsdale, Arizona. The canal behind your house is older than the city. The 1912 engineers followed a ditch that was already seven hundred years old. Nobody thinks about that. The water just comes.",
            "This morning's Republic, two stories on one page. A grading crew has cut into an ancient canal near the airport — salvage crews get two weeks. And a letter from a reader: a mountain carving that shows an exploding star. Signed, 'A Watcher of Skies.'",
            "You have seen that carving. You sketched it in the White Tanks in 1956, and under it you wrote: 'What is this? Ask someone who knows.' You never did. You have thirty years of never did.",
            "The solstice is in sixteen days. The bulldozers pour concrete the Monday after. You take the hat off its hook and fill your canteen."
        ];
        switch (this.introPanel) {
            case 0: this.drawIntroCanal(ctx, px, py, pw, ph); break;
            case 1: this.drawIntroNewspaper(ctx, px, py, pw, ph); break;
            case 2: this.drawIntroNotebook(ctx, px, py, pw, ph); break;
            default: this.drawIntroDeparture(ctx, px, py, pw, ph); break;
        }
        ctx.restore();

        // Caption box
        const cy = py + ph + 16;
        ctx.fillStyle = '#1A1410';
        ctx.fillRect(px - 3, cy, pw + 6, H - cy - 40);
        ctx.strokeStyle = '#8B4513';
        ctx.strokeRect(px - 3, cy, pw + 6, H - cy - 40);
        ctx.fillStyle = '#E8DCC0';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'left';
        this.wrapText(ctx, captions[Math.min(this.introPanel, 3)], px + 10, cy + 20, pw - 20, 14);

        // Page dots + prompt
        ctx.textAlign = 'center';
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = i === this.introPanel ? '#FFAA33' : '#555';
            ctx.fillRect(W / 2 - 30 + i * 16, H - 26, 8, 8);
        }
        if (this.animationFrame % 60 < 40) {
            ctx.fillStyle = '#FFAA33';
            ctx.font = '8px "Press Start 2P"';
            ctx.fillText("E / SPACE / TAP >", W - 120, H - 18);
        }
        ctx.textAlign = 'left';
    }

    drawIntroCanal(ctx, px, py, pw, ph) {
        // Dawn sky bands
        const bands = ['#2A1A3A', '#6A2A3A', '#C4522A', '#E8862A', '#F4B04A'];
        const bandH = (ph * 0.55) / bands.length;
        bands.forEach((c, i) => {
            ctx.fillStyle = c;
            ctx.fillRect(px, py + i * bandH, pw, bandH + 1);
        });
        // Rising sun
        ctx.fillStyle = '#FFD778';
        ctx.beginPath();
        ctx.arc(px + pw * 0.72, py + ph * 0.52, 26, Math.PI, 0);
        ctx.fill();
        // Ground
        ctx.fillStyle = '#3A2A20';
        ctx.fillRect(px, py + ph * 0.55, pw, ph * 0.45);
        // The canal
        ctx.fillStyle = '#2A5A8A';
        ctx.fillRect(px, py + ph * 0.72, pw, ph * 0.12);
        ctx.fillStyle = '#3B77AC';
        for (let i = 0; i < 10; i++) {
            const gx = px + (i * pw / 10) + ((this.animationFrame * 0.3) % (pw / 10));
            ctx.fillRect(gx, py + ph * 0.75, 24, 3);
            ctx.fillRect(gx + 10, py + ph * 0.8, 18, 3);
        }
        // House silhouette with one lit window
        ctx.fillStyle = '#141014';
        ctx.fillRect(px + pw * 0.06, py + ph * 0.36, 100, ph * 0.22);
        ctx.beginPath();
        ctx.moveTo(px + pw * 0.04, py + ph * 0.37);
        ctx.lineTo(px + pw * 0.06 + 50, py + ph * 0.24);
        ctx.lineTo(px + pw * 0.06 + 104, py + ph * 0.37);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#FFD778';
        ctx.fillRect(px + pw * 0.06 + 62, py + ph * 0.42, 16, 14);
        // Saguaro silhouettes
        ctx.fillStyle = '#141014';
        const sx = px + pw * 0.88;
        ctx.fillRect(sx, py + ph * 0.3, 10, ph * 0.28);
        ctx.fillRect(sx - 12, py + ph * 0.36, 14, 8);
        ctx.fillRect(sx - 12, py + ph * 0.36, 8, ph * 0.12);
        ctx.fillRect(sx + 8, py + ph * 0.4, 14, 8);
        ctx.fillRect(sx + 14, py + ph * 0.4, 8, ph * 0.1);
    }

    drawIntroNewspaper(ctx, px, py, pw, ph) {
        ctx.fillStyle = '#26221E';
        ctx.fillRect(px, py, pw, ph);
        // Paper
        const nx = px + pw * 0.12, ny = py + 18, nw = pw * 0.76, nh = ph - 36;
        ctx.fillStyle = '#111';
        ctx.fillRect(nx + 5, ny + 5, nw, nh);
        ctx.fillStyle = '#E8E4D8';
        ctx.fillRect(nx, ny, nw, nh);
        // Masthead
        ctx.fillStyle = '#111';
        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('ARIZONA REPUBLIC', nx + nw / 2, ny + 26);
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText('THURSDAY, JUNE 5, 1986 — TEN CENTS', nx + nw / 2, ny + 40);
        ctx.fillRect(nx + 10, ny + 46, nw - 20, 2);
        // Headline 1
        ctx.textAlign = 'left';
        ctx.font = '9px "Press Start 2P"';
        this.wrapText(ctx, 'GRADING CREW CUTS INTO ANCIENT CANAL NEAR AIRPORT', nx + 12, ny + 64, nw - 24, 13);
        // Column bars
        ctx.fillStyle = '#9A968A';
        for (let r = 0; r < 5; r++) {
            ctx.fillRect(nx + 12, ny + 96 + r * 8, nw * 0.42, 3);
            ctx.fillRect(nx + nw * 0.52, ny + 96 + r * 8, nw * 0.4 - 12, 3);
        }
        // Rule
        ctx.fillStyle = '#111';
        ctx.fillRect(nx + 10, ny + 142, nw - 20, 2);
        // Headline 2
        ctx.font = '8px "Press Start 2P"';
        this.wrapText(ctx, "READER: MOUNTAIN CARVING SHOWS 'EXPLODING STAR'", nx + 12, ny + 158, nw - 24, 12);
        ctx.fillStyle = '#9A968A';
        for (let r = 0; r < 4; r++) {
            ctx.fillRect(nx + 12, ny + 182 + r * 8, nw - 24, 3);
        }
        ctx.fillStyle = '#555';
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText("— signed, 'A WATCHER OF SKIES'", nx + 12, ny + nh - 12);
        ctx.textAlign = 'left';
    }

    drawIntroNotebook(ctx, px, py, pw, ph) {
        ctx.fillStyle = '#26221E';
        ctx.fillRect(px, py, pw, ph);
        // Page
        const nx = px + pw * 0.15, ny = py + 16, nw = pw * 0.7, nh = ph - 32;
        ctx.fillStyle = '#111';
        ctx.fillRect(nx + 5, ny + 5, nw, nh);
        ctx.fillStyle = '#E8DCB8';
        ctx.fillRect(nx, ny, nw, nh);
        // Spiral binding
        ctx.fillStyle = '#4A4A4A';
        for (let i = 0; i < 9; i++) {
            ctx.beginPath();
            ctx.arc(nx + 8, ny + 16 + i * (nh - 32) / 8, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        // Header
        ctx.fillStyle = '#4A3A28';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'left';
        ctx.fillText('WHITE TANK MTS — MAY 1956', nx + 26, ny + 24);
        ctx.fillRect(nx + 24, ny + 30, nw - 44, 1);
        // The sketch: scorpion of stars
        const cx = nx + nw * 0.38, cy = ny + nh * 0.5;
        ctx.fillStyle = '#4A3A28';
        const scorpStars = [[0,0],[14,-6],[28,-8],[42,-4],[52,6],[56,20],[50,32],[38,36]];
        scorpStars.forEach(([dx, dy]) => ctx.fillRect(cx + dx - 40, cy + dy - 10, 4, 4));
        // The great star — a circle with rays
        const gx = cx + 44, gy = cy - 26;
        ctx.beginPath();
        ctx.arc(gx, gy, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4A3A28';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(gx + Math.cos(a) * 13, gy + Math.sin(a) * 13);
            ctx.lineTo(gx + Math.cos(a) * (20 + (i % 2) * 5), gy + Math.sin(a) * (20 + (i % 2) * 5));
            ctx.stroke();
        }
        // Handwriting
        ctx.font = '7px "Press Start 2P"';
        ctx.fillText('what is this?', nx + 30, ny + nh - 40);
        ctx.fillText('ask someone who knows.', nx + 30, ny + nh - 24);
    }

    drawIntroDeparture(ctx, px, py, pw, ph) {
        // Day sky
        ctx.fillStyle = '#F4C87A';
        ctx.fillRect(px, py, pw, ph * 0.5);
        ctx.fillStyle = '#E8A85A';
        ctx.fillRect(px, py + ph * 0.32, pw, ph * 0.18);
        // Sun high
        ctx.fillStyle = '#FFF0C0';
        ctx.beginPath();
        ctx.arc(px + pw * 0.18, py + 44, 18, 0, Math.PI * 2);
        ctx.fill();
        // Distant mountains
        ctx.fillStyle = '#8A5A6A';
        ctx.beginPath();
        ctx.moveTo(px, py + ph * 0.5);
        ctx.lineTo(px + pw * 0.2, py + ph * 0.34);
        ctx.lineTo(px + pw * 0.38, py + ph * 0.5);
        ctx.lineTo(px + pw * 0.55, py + ph * 0.3);
        ctx.lineTo(px + pw * 0.62, py + ph * 0.38);
        ctx.lineTo(px + pw * 0.8, py + ph * 0.26);
        ctx.lineTo(px + pw, py + ph * 0.5);
        ctx.closePath(); ctx.fill();
        // Ground
        ctx.fillStyle = '#D8B488';
        ctx.fillRect(px, py + ph * 0.5, pw, ph * 0.5);
        // Long shadow
        ctx.fillStyle = 'rgba(60, 40, 20, 0.35)';
        ctx.beginPath();
        ctx.ellipse(px + pw * 0.56, py + ph * 0.86, 70, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Walker, back to us, hat on
        const wx = px + pw * 0.45, wy = py + ph * 0.56;
        ctx.fillStyle = '#8B4513';                    // hat
        ctx.fillRect(wx + 4, wy, 24, 7);
        ctx.fillRect(wx + 8, wy - 5, 16, 6);
        ctx.fillStyle = '#F0D8C0';                    // neck
        ctx.fillRect(wx + 12, wy + 7, 8, 5);
        ctx.fillStyle = '#8B0000';                    // shirt
        ctx.fillRect(wx + 6, wy + 12, 20, 22);
        ctx.fillStyle = '#C8A868';                    // satchel strap
        ctx.fillRect(wx + 6, wy + 12, 5, 22);
        ctx.fillStyle = '#4A3B31';                    // pants
        ctx.fillRect(wx + 8, wy + 34, 7, 18);
        ctx.fillRect(wx + 17, wy + 34, 7, 18);
        // Canteen on hip
        ctx.fillStyle = '#5A6A7A';
        ctx.beginPath();
        ctx.arc(wx + 28, wy + 30, 6, 0, Math.PI * 2);
        ctx.fill();
        // Distant saguaro
        ctx.fillStyle = '#2D7D40';
        ctx.fillRect(px + pw * 0.82, py + ph * 0.56, 8, 40);
        ctx.fillRect(px + pw * 0.82 - 8, py + ph * 0.62, 10, 6);
        ctx.fillRect(px + pw * 0.82 - 8, py + ph * 0.62, 6, 14);
    }

    togglePause() {
        if (this.gameState === GAME_STATE.PLAYING) this.setGameState(GAME_STATE.PAUSED);
        else if (this.gameState === GAME_STATE.PAUSED) this.setGameState(GAME_STATE.PLAYING);
    }

    useItem(itemKey) {
        if (this.gameState !== GAME_STATE.PLAYING && this.gameState !== GAME_STATE.DIALOG) return;
        const item = this.itemTypes[itemKey];
        if (item && item.useFunc) {
            item.useFunc(this);
        } else if (item) {
            this.ui.showDialog(`${item.name}: ${item.description}`, "Item");
            this.setGameState(GAME_STATE.DIALOG);
        }
    }

    gameOver(message) {
        this.setGameState(GAME_STATE.GAME_OVER);
        this.ui.showGameOverScreen(message);
    }
}
