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
import { getObjectTypes, getEnemyTypes, getItemTypes, getMaps, MAP_MUSIC } from './gameData.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = GAME_STATE.START_SCREEN;
        this.animationFrame = 0;
        this.sound = new SoundManager();
        this.ui = new UIManager(this);
        this.input = new InputHandler(this);
        this.player = null;
        this.currentMap = null;
        this.interactionTarget = null;
        this.pendingPortal = null;
        this.currentPuzzle = null;
        this.gameTime = INITIAL_GAME_HOUR * 3600;
        this.dayTime = true;
        this.lastFrameTime = 0;
        this.defineGameData();
        this.ui.showStartScreen();
        this.sound.playMusic('menuTheme');
    }

    defineGameData() {
        this.objectTypes = getObjectTypes();
        this.enemyTypes = getEnemyTypes();
        this.itemTypes = getItemTypes();
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
                this.ui.showWinScreen("You solved the puzzle and claim the Arizona Artifact!");
                break;
            case GAME_STATE.GAME_OVER:
                this.sound.stopMusic();
                this.sound.playSound('gameOver');
                break;
        }
    }

    startGame(isRestart = false) {
        this.ui.hideStartScreen();
        this.ui.showLoading();
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
            if (!isRestart || this.lastFrameTime === 0) this.gameLoop(0);
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
        const freshMapData = JSON.parse(JSON.stringify(mapData));
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
            this.gameOver("Incorrect. The artifact's secrets remain elusive.");
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
        if (this.gameState === GAME_STATE.PLAYING || this.gameState === GAME_STATE.DIALOG || this.gameState === GAME_STATE.PAUSED) {
            if (this.currentMap && this.player) this.currentMap.draw(this.ctx);
            if (this.interactionTarget && this.gameState === GAME_STATE.PLAYING) {
                this.ui.drawInteractionIndicator(this.interactionTarget.centerX, this.interactionTarget.y);
            }
        }
    }

    handleKeyUp(key) {
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
