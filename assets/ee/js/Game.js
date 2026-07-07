import {
    CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATE, GAME_TIME_MULTIPLIER,
    DAY_START_HOUR, DAY_END_HOUR, INITIAL_GAME_HOUR,
    INTERACTION_RANGE, SHAKE_DURATION, SHAKE_INTERVAL, SHAKE_INTENSITY,
    SAVE_KEY
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
        this.accumulator = 0;
        this.mapFade = 0;
        this.loopRunning = false;
        this.introPanel = 0;
        // Per-map persistent state (opened chests, spent triggers) — part of the checkpoint save
        this.mapState = {};
        // Enemies killed this session stay dead on revisit (not saved: a fresh
        // session lets the desert repopulate)
        this.sessionKills = {};
        this.currentMapName = null;
        this.pendingEndingChoice = false;
        this.endingMessage = null;
        this.endingTitle = null;
        this.defineGameData();
        this.ui.showStartScreen();
        this.sound.playMusic('menuTheme');
        // Click/tap advances the intro comic and closes the field map
        this.canvas.addEventListener('click', () => {
            if (this.gameState === GAME_STATE.INTRO) this.advanceIntro();
            else if (this.gameState === GAME_STATE.MAP_VIEW) this.closeMap();
        });
    }

    // In-game calendar: June date (game starts June 5) and hour of day
    get gameDate() { return Math.floor(this.gameTime / 86400) + 5; }
    get gameHour() { return Math.floor((this.gameTime % 86400) / 3600); }

    // The UV lamp reveals things in the dark: night outdoors, or anywhere indoors
    get uvActive() {
        return !!(this.player && this.player.hasItem('blacklight') &&
            (!this.dayTime || (this.currentMap && this.currentMap.indoor)));
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
                this.sound.stopAmbience();
                this.sound.playMusic('menuTheme');
                break;
            case GAME_STATE.PLAYING:
                this.sound.resumeCurrentMusic();
                break;
            case GAME_STATE.PAUSED:
                this.sound.playSound('pause');
                this.ui.showPauseScreen();
                this.sound.pauseCurrentMusic();
                this.sound.stopAmbience();
                break;
            case GAME_STATE.PUZZLE:
                this.sound.pauseCurrentMusic();
                this.ui.showPuzzle(this.currentPuzzle.question, this.currentPuzzle.options);
                break;
            case GAME_STATE.WIN:
                this.sound.stopMusic();
                this.sound.stopAmbience();
                this.sound.playSound('winGame');
                // A finished expedition doesn't leave a checkpoint behind
                try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
                this.ui.showWinScreen(
                    this.endingMessage || "The stick comes out of the olla whole. Four centuries of sky and water: the great star of 1006, the floods, the drought years, and one final, deliberate mark.",
                    this.endingTitle || "EXPEDITION'S END"
                );
                break;
            case GAME_STATE.GAME_OVER:
                this.sound.stopMusic();
                this.sound.stopAmbience();
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
            this.mapState = {};
            this.sessionKills = {};
            this.pendingEndingChoice = false;
            this.endingMessage = null;
            this.endingTitle = null;
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

    // ---------- Checkpoint save/load ----------

    saveGame(notify = false) {
        if (!this.player || !this.currentMapName || this.gameState === GAME_STATE.GAME_OVER) return;
        const p = this.player;
        const data = {
            version: 1,
            mapName: this.currentMapName,
            x: Math.round(p.x), y: Math.round(p.y),
            health: p.health, hydration: p.hydration,
            inventory: [...p.inventory],
            quests: p.quests.map(q => ({ ...q })),
            gameTime: this.gameTime,
            mapState: this.mapState,
        };
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
            if (notify) this.ui.showSaveNotification();
        } catch (e) { /* storage blocked or full: play on without checkpoints */ }
    }

    loadSaveData() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            const data = raw ? JSON.parse(raw) : null;
            return (data && data.mapName && Array.isArray(data.inventory)) ? data : null;
        } catch (e) { return null; }
    }

    hasSave() { return !!this.loadSaveData(); }

    continueGame() {
        const data = this.loadSaveData();
        if (!data || !this.maps[data.mapName]) { this.startGame(); return; }
        this.ui.hideStartScreen();
        this.ui.showLoading();
        this.gameState = GAME_STATE.LOADING;
        setTimeout(() => {
            this.defineGameData();
            this.player = new Player(this, data.x, data.y);
            this.player.health = data.health;
            this.player.hydration = data.hydration;
            this.player.inventory = data.inventory;
            this.player.quests = data.quests;
            // Migrate older saves: journal records that predate their completed flag
            this.player.quests.forEach(q => {
                if ((q.id === 'supernova_read' || q.id === 'dutchman_bust') && !q.completed) q.completed = true;
            });
            this.gameTime = data.gameTime;
            this.mapState = data.mapState || {};
            this.sessionKills = {};
            this.pendingEndingChoice = false;
            this.endingMessage = null;
            this.endingTitle = null;
            this.currentMap = null;
            this.changeMap(data.mapName, data.x, data.y);
            this.ui.updateHealth(this.player.health, this.player.maxHealth);
            this.ui.updateHydration(this.player.hydration, this.player.maxHydration);
            this.ui.updateInventoryDisplay(this.player.inventory, this.itemTypes);
            this.ui.updateQuestLog(this.player.quests);
            this.ui.updateClock(this.gameTime);
            this.setGameState(GAME_STATE.PLAYING);
            this.ui.hideLoading();
            this.ensureLoop();
        }, 300);
    }

    goToMainMenu() {
        this.sound.stopMusic();
        this.setGameState(GAME_STATE.START_SCREEN);
    }

    changeMap(mapName, playerX, playerY) {
        const isInitialLoad = !this.currentMap;
        this.sound.stopMusic();
        this.sound.resetRattles();
        this.sound.setWind(false);
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
        this.currentMapName = mapName;
        // Re-apply persistent object state (opened chests, spent triggers) by original index,
        // BEFORE world events filter the list
        const savedMap = this.mapState[mapName];
        if (savedMap && savedMap.objects) {
            Object.entries(savedMap.objects).forEach(([idx, st]) => {
                const o = freshMapData.objects[idx];
                if (!o) return;
                if (st.opened) o.opened = true;
                if (st.questTriggerSpent) delete o.questTrigger;
            });
        }
        this.applyWorldEvents(mapName, freshMapData);
        this.particles.clear();
        this.mapFade = 1; // fade in from black on map change
        this.currentMap = new GameMap(this, freshMapData);
        if (this.player) {
            this.player.x = playerX;
            this.player.y = playerY;
        }
        this.ui.updateMapName(this.currentMap.name);
        if (!isInitialLoad) this.saveGame(true); // checkpoint on every map transition

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

    // World changes driven by the calendar. June 23: the concrete pour at the salvage site.
    applyWorldEvents(mapName, mapData) {
        if (mapName === 'hohokam_site' && this.gameDate >= 23) {
            mapData.objects = mapData.objects.filter(o =>
                o.type !== 'survey_flag' && !(o.type === 'chest' && o.contains === 'artifact2'));
            const canal = mapData.objects.find(o => o.type === 'hohokam_canal');
            if (canal) {
                canal.waterColor = '#9A9A94';
                canal.name = 'Poured Canal Segment';
                canal.text = "Fresh concrete, poured Monday at dawn, already hot to the touch. Nine hundred years of engineering under four inches of grey. Two weeks was never enough.";
            }
            const grid = mapData.objects.find(o => o.type === 'interactive_point');
            if (grid) grid.text = "The salvage grid is gone. Tire tracks, formwork stakes, an empty cement sack. The bulldozers don't come back; they never need to.";
        }
    }

    // ---------- Time advancement (camp, vault vigil) ----------

    advanceToHour(hour) {
        const daySec = 86400;
        const cur = this.gameTime % daySec;
        let adv = hour * 3600 - cur;
        if (adv <= 0) adv += daySec;
        this.gameTime += adv;
        this.ui.updateClock(this.gameTime);
    }

    // Jump to June 21, 5:00 AM (or the next dawn if the solstice already passed)
    advanceToSolsticeDawn() {
        const target = 16 * 86400 + 5 * 3600; // day 17 = June 21
        if (this.gameTime < target) {
            this.gameTime = target;
            this.ui.updateClock(this.gameTime);
        } else {
            this.advanceToHour(5);
        }
    }

    resolveCamp(answerIndex) {
        if (answerIndex === 2 || !this.player) { this.setGameState(GAME_STATE.PLAYING); return; }
        const p = this.player;
        if (answerIndex === 0) {
            this.advanceToHour(6);
            p.heal(20);
            p.hydration = Math.max(10, p.hydration - 15);
            this.ui.showDialog("You bank the coals and sleep under more stars than the city ever shows you. Dawn comes up gold and quiet. (You rest until first light. +20 HP, -15 H2O)", "CAMP");
        } else {
            this.advanceToHour(17);
            p.heal(10);
            p.hydration = Math.max(10, p.hydration - 10);
            this.ui.showDialog("You doze in the shade through the worst of the heat. The light goes long and red across the rocks: the crimson evening. (You wait until dusk. +10 HP, -10 H2O)", "CAMP");
        }
        this.ui.updateHydration(p.hydration, p.maxHydration);
        this.setGameState(GAME_STATE.DIALOG);
        this.saveGame(true);
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
        const puzzle = this.currentPuzzle;
        this.currentPuzzle = null;
        this.ui.hidePuzzle();
        if (puzzle.isCampChoice) { this.resolveCamp(answerIndex); return; }
        if (puzzle.isOfferingChoice) { this.resolveOffering(puzzle, answerIndex); return; }
        if (puzzle.isEndingChoice) { this.resolveEnding(answerIndex); return; }
        if (answerIndex === puzzle.correctAnswerIndex) {
            this.sound.playSound('puzzleCorrect');
            this.player.addItem('final_artifact');
            this.player.completeQuest('main_artifact');
            this.pendingEndingChoice = true;
            this.ui.showDialog("The seal parts, and the stick comes out whole: four centuries of sky and water, and one final, deliberate mark. Cutler steps out of the dark, hands open. 'Provenance like that... name your price, Jim. Museum drawer, my buyer's vault, or a plaque with your name on it. Unless you know a fourth one.'", "Vance Cutler");
            this.setGameState(GAME_STATE.DIALOG);
        } else {
            // Wrong reading: Cutler needles you, the seal stays shut. Re-read your notes and try again.
            this.sound.playSound('puzzleIncorrect');
            const pedestal = this.currentMap.objects.find(obj => obj.objData.triggersPuzzle);
            if (pedestal) pedestal.objData.opened = false;
            this.ui.showDialog("Cutler's smile doesn't move. 'Careful, Jim. Read it wrong and it's kindling with delusions.' The counts swim in the lamplight. Check the star rubbing and your 1956 notebook, then try the seal again.", "Vance Cutler");
            this.setGameState(GAME_STATE.DIALOG);
        }
    }

    // The visitor's custom, translated into game grammar: you don't take from
    // these places without giving. The gift is permanent.
    resolveOffering(puzzle, answerIndex) {
        const act = puzzle.offeringActions[answerIndex];
        const p = this.player;
        if (!act || act.type === 'cancel' || !p) { this.setGameState(GAME_STATE.PLAYING); return; }
        if (act.type === 'water') {
            if (p.hydration < 35) {
                this.ui.showDialog("Your canteen is nearly dry. The desert doesn't ask for what you can't spare. Come back with more water, or with something else.", "OFFERING LEDGE");
                this.setGameState(GAME_STATE.DIALOG);
                return;
            }
            p.hydration -= 30;
            this.ui.updateHydration(p.hydration, p.maxHydration);
        } else {
            p.removeItem(act.key);
        }
        const gifted = act.type === 'water' ? 'a long pour of your water' : `your ${this.itemTypes[act.key].name.toLowerCase()}`;
        const ledge = this.currentMap.objects.find(o => o.type === 'offering_ledge');
        if (ledge) ledge.objData.gifted = true;
        p.addQuest({ id: 'gift_left', description: 'Left an offering at the vault threshold. Not everything is for taking.', completed: true });
        this.sound.playChime();
        this.ui.showDialog(`You set ${gifted} on the ledge, among shell beads gone chalky and a pot sherd someone left when the canal still ran. The vault doesn't thank you. It doesn't need to. Thirty years of taking things out of the ground, and your hands feel steadier for once going the other way.`, "OFFERING LEDGE");
        this.setGameState(GAME_STATE.DIALOG);
        this.saveGame(true);
    }

    startEndingChoice() {
        this.currentPuzzle = {
            isEndingChoice: true,
            question: "Four centuries in your hands. What does Walker do?",
            options: [
                "Take Cutler's split. It beats a pension.",
                "The museum. Catalogued, published, your name on the paper.",
                "A fourth option. Call Salt River: Frances Antone's desk.",
            ],
        };
        this.setGameState(GAME_STATE.PUZZLE);
    }

    resolveEnding(answerIndex) {
        const poured = this.gameDate >= 23;
        if (answerIndex === 0) {
            this.endingTitle = "THE SPLIT";
            this.endingMessage = "You name a number; Cutler doesn't even blink. The stick rides to Scottsdale in a foam-lined case, and the check clears before the solstice light is off the mountains. The buyer is careful. No one will ever see it again. The astronomy goes unpublished; the valley pours and paves and forgets. It is a comfortable retirement. It is smaller than the desert.";
        } else if (answerIndex === 1) {
            this.endingTitle = "THE PLAQUE";
            this.endingMessage = "The museum takes it, grateful. Accession 86-114: THE WALKER COLLECTION. You publish the astronomy and the paper does well; there is talk of a plaque. Frances Antone reads about it in the Republic. She does not call back. In an acid-free drawer in a dark room, four centuries of sky and water keep perfect time for nobody.";
        } else {
            this.endingTitle = "THE RETURN";
            this.endingMessage = "You put the stick back in the olla, the olla in your pack, and make one phone call: Salt River, cultural office, Frances Antone's desk. The paper you could have written goes unwritten; you publish only the astronomy, the part that was yours."
                + (poured ? " The canal by the airport is concrete now, but what it carried is on the stick, and the stick is home." : "")
                + " At the new year, when the saguaro fruit comes ripe, there is a place set for you at the harvest. Some things aren't found, Professor. They're returned.";
        }
        this.setGameState(GAME_STATE.WIN);
    }

    // Fixed-timestep loop: simulation always steps at 60 Hz regardless of display refresh
    // rate, so movement, cooldowns, hydration, and the clock stay in sync on 120+ Hz screens.
    gameLoop(timestamp) {
        let delta = (timestamp - this.lastFrameTime) / 1000;
        this.lastFrameTime = timestamp;
        if (!(delta > 0)) delta = 0;           // first frame guard
        else if (delta > 0.25) delta = 0.25;   // tab-switch guard
        this.accumulator += delta;
        const STEP = 1 / 60;
        while (this.accumulator >= STEP) {
            this.accumulator -= STEP;
            this.animationFrame++;
            if (this.mapFade > 0) this.mapFade = Math.max(0, this.mapFade - 0.05);
            if (this.gameState === GAME_STATE.PLAYING) this.update(STEP);
        }
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
        const currentHour = this.gameHour;
        this.dayTime = currentHour >= DAY_START_HOUR && currentHour < DAY_END_HOUR;
        this.sound.setNightAmbience(!this.dayTime && !this.currentMap.indoor);
        this.ui.updateClock(this.gameTime);

        let checkX = this.player.x + this.player.width / 2;
        let checkY = this.player.y + this.player.height / 2;
        switch (this.player.direction) {
            case 'up': checkY -= this.player.height / 2 + INTERACTION_RANGE / 2; break;
            case 'down': checkY += this.player.height / 2 + INTERACTION_RANGE / 2; break;
            case 'left': checkX -= this.player.width / 2 + INTERACTION_RANGE / 2; break;
            case 'right': checkX += this.player.width / 2 + INTERACTION_RANGE / 2; break;
        }

        // Mirror tryInteraction's nearest-target logic exactly, so the floating
        // arrow always points at the thing E will actually activate
        const potentialTargets = [...this.currentMap.objects, ...this.currentMap.npcs];
        let best = null, bestDist = Infinity;
        for (const entity of potentialTargets) {
            if (!entity.isInteractable) continue;
            if (entity.objData && entity.objData.uv && !this.uvActive) continue; // invisible without the lamp
            const dist = Math.hypot(entity.centerX - checkX, entity.centerY - checkY);
            if (dist < (entity.width + entity.height) / 2 + 10 && dist < bestDist) {
                best = entity;
                bestDist = dist;
            }
        }
        this.interactionTarget = best;
    }

    draw() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        if (this.gameState === GAME_STATE.INTRO) {
            this.drawIntro(this.ctx);
            return;
        }
        if (this.gameState === GAME_STATE.MAP_VIEW) {
            this.drawMapView(this.ctx);
            return;
        }
        if (this.gameState === GAME_STATE.PLAYING || this.gameState === GAME_STATE.DIALOG || this.gameState === GAME_STATE.PAUSED) {
            if (this.currentMap && this.player) this.currentMap.draw(this.ctx);
            this.particles.draw(this.ctx);
            if (this.interactionTarget && this.gameState === GAME_STATE.PLAYING) {
                this.ui.drawInteractionIndicator(this.interactionTarget.centerX, this.interactionTarget.y);
            }
            // Fade in after a map transition (decremented in the fixed-step loop)
            if (this.mapFade > 0) {
                this.ctx.fillStyle = `rgba(0, 0, 0, ${this.mapFade})`;
                this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
        }
    }

    handleKeyUp(key) {
        if (this.gameState === GAME_STATE.INTRO) {
            if (key === 'e' || key === ' ' || key === 'enter') this.advanceIntro();
            else if (key === 'escape') this.beginExpedition(); // skip for repeat players
            return;
        }
        if (this.gameState === GAME_STATE.PLAYING) {
            if (key === 'e' || key === ' ') this.player.interact();
            else if (key === 'p') this.togglePause();
            else if (key === 'i') this.ui.toggleInventory();
            else if (key === 'q') this.ui.toggleQuestLog();
            else if (key === 'm') this.openMap();
        } else if (this.gameState === GAME_STATE.MAP_VIEW) {
            if (key === 'e' || key === ' ' || key === 'enter' || key === 'm' || key === 'escape') this.closeMap();
        } else if (this.gameState === GAME_STATE.DIALOG) {
            if (key === 'e' || key === ' ' || key === 'enter') {
                this.ui.hideDialog();
                if (this.pendingEndingChoice) {
                    this.pendingEndingChoice = false;
                    this.startEndingChoice();
                } else if (this.pendingPortal) {
                    this.changeMap(this.pendingPortal.mapName, this.pendingPortal.toX, this.pendingPortal.toY);
                    this.pendingPortal = null;
                } else {
                    this.setGameState(GAME_STATE.PLAYING);
                }
            }
        } else if (this.gameState === GAME_STATE.PUZZLE) {
            // Keyboard answers for choices (camp, seal, ending)
            if (key === '1') this.handlePuzzleAnswer(0);
            else if (key === '2') this.handlePuzzleAnswer(1);
            else if (key === '3') this.handlePuzzleAnswer(2);
        } else if (this.gameState === GAME_STATE.PAUSED) {
            if (key === 'p') this.togglePause();
        }
    }

    // ---------- Walker's field map (compass item / M key) ----------

    openMap() {
        if (!this.player || !this.currentMap) return;
        this.sound.playSound('selectOption');
        this.setGameState(GAME_STATE.MAP_VIEW);
    }

    closeMap() {
        this.setGameState(GAME_STATE.PLAYING);
    }

    drawMapView(ctx) {
        const W = CANVAS_WIDTH, H = CANVAS_HEIGHT;
        const has = (id) => this.player && this.player.quests.some(q => q.id === id);
        const SITES = [
            { key: 'white_tanks_petroglyphs', label: 'WHITE TANKS', x: 90, y: 190, mountain: true },
            { key: 'desert', label: 'OUTSKIRTS', x: 180, y: 265 },
            { key: 'ghost_town', label: 'DUSTY GULCH', x: 155, y: 350 },
            { key: 'abandoned_mine', label: 'MINE', x: 235, y: 385 },
            { key: 'canyon', label: 'RED ROCK', x: 258, y: 212 },
            { key: 'camelback', label: 'CAMELBACK', x: 345, y: 148, mountain: true },
            { key: 'papago_park', label: 'PAPAGO', x: 400, y: 205 },
            { key: 'canal_path', label: 'LOCK 9', x: 300, y: 264 },
            { key: 'hohokam_site', label: 'PUEBLO GRANDE', x: 360, y: 268 },
            { key: 'asu_lab', label: 'ASU TEMPE', x: 448, y: 300 },
            { key: 'sky_people_shrine', label: 'SOUTH MTN', x: 330, y: 350, mountain: true },
            { key: 'casa_grande', label: 'CASA GRANDE', x: 512, y: 412 },
            { key: 'superstition_mountains', label: 'SUPERSTITIONS', x: 570, y: 352, mountain: true },
        ];
        const VAULT = { x: 388, y: 288 };

        // Parchment
        ctx.fillStyle = '#E8DCB8';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#D8C8A0';
        for (let i = 0; i < 40; i++) ctx.fillRect((i * 137 + 31) % W, (i * 89 + 47) % H, 3, 3);
        ctx.strokeStyle = '#6B4A2A';
        ctx.lineWidth = 3;
        ctx.strokeRect(8, 8, W - 16, H - 16);
        ctx.lineWidth = 1;

        ctx.fillStyle = '#4A3A28';
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText("WALKER'S FIELD MAP", W / 2, 34);
        ctx.font = '7px "Press Start 2P"';
        ctx.fillText('SALT RIVER VALLEY - JUNE 1986', W / 2, 50);

        // The canal: old water, east-west through the valley
        const canalPts = [[230, 262], [300, 264], [360, 268], [430, 278], [520, 292]];
        ctx.fillStyle = '#658EA9';
        for (let i = 0; i < canalPts.length - 1; i++) {
            this.drawMapLine(ctx, canalPts[i][0], canalPts[i][1], canalPts[i + 1][0], canalPts[i + 1][1], 3, '#658EA9', false);
        }
        ctx.font = '6px "Press Start 2P"';
        ctx.fillStyle = '#4A6A85';
        ctx.fillText('THE CANALS', 262, 250);

        // Alignment sightlines, drawn as the player earns each reading
        const gold = '#B8860B';
        const papago = SITES.find(s => s.key === 'papago_park');
        const mound = SITES.find(s => s.key === 'hohokam_site');
        const southMtn = SITES.find(s => s.key === 'sky_people_shrine');
        const whiteTanks = SITES.find(s => s.key === 'white_tanks_petroglyphs');
        const pulse = 0.55 + Math.sin(this.animationFrame * 0.08) * 0.3;
        if (has('alignment_light')) this.drawMapRing(ctx, papago.x, papago.y, pulse);
        if (has('alignment_doorway')) this.drawMapLine(ctx, mound.x, mound.y, papago.x, papago.y, 2, gold, true);
        if (has('alignment_horizon')) this.drawMapLine(ctx, southMtn.x, southMtn.y, whiteTanks.x, whiteTanks.y, 2, gold, true);
        if (has('casa_venus')) this.drawMapRing(ctx, SITES.find(s => s.key === 'casa_grande').x, SITES.find(s => s.key === 'casa_grande').y, pulse);
        if (has('scorpius_rising')) this.drawMapRing(ctx, whiteTanks.x, whiteTanks.y, pulse);

        const readings = ['alignment_light', 'alignment_doorway', 'alignment_horizon'].filter(has).length;
        if (readings === 3) {
            // All three readings converge: the unpoured segment
            ctx.fillStyle = gold;
            ctx.fillRect(VAULT.x - 5, VAULT.y - 1, 10, 3);
            ctx.fillRect(VAULT.x - 1, VAULT.y - 5, 3, 10);
            ctx.font = '6px "Press Start 2P"';
            ctx.fillText('THE SEGMENT', VAULT.x, VAULT.y + 16);
        }

        // Sites
        SITES.forEach(s => {
            ctx.fillStyle = '#4A3A28';
            if (s.mountain) {
                ctx.fillRect(s.x - 7, s.y + 2, 14, 3);
                ctx.fillRect(s.x - 4, s.y - 2, 8, 4);
                ctx.fillRect(s.x - 1, s.y - 5, 3, 3);
            } else {
                ctx.fillRect(s.x - 3, s.y - 3, 6, 6);
            }
            ctx.font = '6px "Press Start 2P"';
            ctx.fillText(s.label, s.x, s.y + 15);
        });

        // You are here
        const here = SITES.find(s => s.key === this.currentMapName) || (this.currentMapName === 'artifact_chamber' ? VAULT : null);
        if (here && this.animationFrame % 50 < 32) {
            ctx.fillStyle = '#C42A2A';
            ctx.fillRect(here.x - 2, here.y - 12, 4, 4);
            ctx.fillRect(here.x - 1, here.y - 8, 2, 3);
        }

        // Legend: the three records, then the three readings
        ctx.font = '6px "Press Start 2P"';
        const recordLabels = [['artifact1', 'STICK'], ['artifact2', 'SHARD'], ['artifact3', 'RUBBING']];
        recordLabels.forEach(([key, label], i) => {
            const owned = this.player && this.player.hasItem(key);
            ctx.fillStyle = owned ? '#4A3A28' : 'rgba(74, 58, 40, 0.35)';
            ctx.fillText((owned ? '[x] ' : '[ ] ') + label, W / 2 + (i - 1) * 130, H - 46);
        });
        ctx.fillStyle = '#4A3A28';
        ctx.font = '7px "Press Start 2P"';
        ctx.fillText(`ALIGNMENTS READ: ${readings} OF 3` + (readings === 3 ? ' - ONE INSTRUMENT, VALLEY-SIZED' : ''), W / 2, H - 34);
        if (this.animationFrame % 60 < 40) {
            ctx.font = '6px "Press Start 2P"';
            ctx.fillText('M / E / TAP - CLOSE', W / 2, H - 18);
        }
        ctx.textAlign = 'left';
    }

    drawMapLine(ctx, x1, y1, x2, y2, size, color, dashed) {
        const dist = Math.hypot(x2 - x1, y2 - y1);
        const steps = Math.max(1, Math.floor(dist / size));
        ctx.fillStyle = color;
        for (let i = 0; i <= steps; i++) {
            if (dashed && (i % 4 === 3)) continue;
            const t = i / steps;
            ctx.fillRect(Math.round(x1 + (x2 - x1) * t - size / 2), Math.round(y1 + (y2 - y1) * t - size / 2), size, size);
        }
    }

    drawMapRing(ctx, x, y, alpha) {
        ctx.fillStyle = `rgba(184, 134, 11, ${alpha})`;
        ctx.fillRect(x - 7, y - 7, 5, 3);
        ctx.fillRect(x + 3, y - 7, 5, 3);
        ctx.fillRect(x - 7, y + 5, 5, 3);
        ctx.fillRect(x + 3, y + 5, 5, 3);
        ctx.fillRect(x - 9, y - 2, 3, 5);
        ctx.fillRect(x + 7, y - 2, 3, 5);
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
            "This morning's Republic, two stories on one page. A grading crew has cut into an ancient canal near the airport. Salvage crews get two weeks. And a letter from a reader: a mountain carving that shows an exploding star. Signed, 'A Watcher of Skies.'",
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
        ctx.fillStyle = '#777';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('ESC - SKIP', 80, H - 18);
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
        // Rising sun, stepped semicircle
        ctx.fillStyle = '#FFD778';
        const sunX = Math.round(px + pw * 0.72), sunY = Math.round(py + ph * 0.52);
        ctx.fillRect(sunX - 26, sunY - 9, 52, 9);
        ctx.fillRect(sunX - 20, sunY - 17, 40, 8);
        ctx.fillRect(sunX - 12, sunY - 23, 24, 6);
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
        ctx.fillText('THURSDAY, JUNE 5, 1986 - TEN CENTS', nx + nw / 2, ny + 40);
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
        ctx.fillText("signed, 'A WATCHER OF SKIES'", nx + 12, ny + nh - 12);
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
        // Spiral binding, square rings
        ctx.fillStyle = '#4A4A4A';
        for (let i = 0; i < 9; i++) {
            const ry = Math.round(ny + 13 + i * (nh - 32) / 8);
            ctx.fillRect(nx + 4, ry, 8, 8);
            ctx.fillStyle = '#E8DCB8';
            ctx.fillRect(nx + 6, ry + 2, 4, 4);
            ctx.fillStyle = '#4A4A4A';
        }
        // Header
        ctx.fillStyle = '#4A3A28';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'left';
        ctx.fillText('WHITE TANK MTS - MAY 1956', nx + 26, ny + 24);
        ctx.fillRect(nx + 24, ny + 30, nw - 44, 1);
        // The sketch: scorpion of stars
        const cx = nx + nw * 0.38, cy = ny + nh * 0.5;
        ctx.fillStyle = '#4A3A28';
        const scorpStars = [[0,0],[14,-6],[28,-8],[42,-4],[52,6],[56,20],[50,32],[38,36]];
        scorpStars.forEach(([dx, dy]) => ctx.fillRect(cx + dx - 40, cy + dy - 10, 4, 4));
        // The great star: stepped pixel burst
        const gx = cx + 44, gy = cy - 26;
        ctx.fillRect(gx - 9, gy - 3, 18, 6);
        ctx.fillRect(gx - 3, gy - 9, 6, 18);
        ctx.fillRect(gx - 6, gy - 6, 12, 12);
        // Rays
        ctx.fillRect(gx - 21, gy - 1, 8, 3);
        ctx.fillRect(gx + 13, gy - 1, 8, 3);
        ctx.fillRect(gx - 1, gy - 21, 3, 8);
        ctx.fillRect(gx - 1, gy + 13, 3, 8);
        ctx.fillRect(gx - 15, gy - 15, 4, 4);
        ctx.fillRect(gx + 11, gy - 15, 4, 4);
        ctx.fillRect(gx - 15, gy + 11, 4, 4);
        ctx.fillRect(gx + 11, gy + 11, 4, 4);
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
        // Sun high, stepped disc
        ctx.fillStyle = '#FFF0C0';
        const dsX = Math.round(px + pw * 0.18), dsY = py + 44;
        ctx.fillRect(dsX - 9, dsY - 18, 18, 36);
        ctx.fillRect(dsX - 15, dsY - 12, 30, 24);
        ctx.fillRect(dsX - 18, dsY - 6, 36, 12);
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
        // Long shadow, blocky
        ctx.fillStyle = 'rgba(60, 40, 20, 0.35)';
        ctx.fillRect(Math.round(px + pw * 0.56) - 70, Math.round(py + ph * 0.86) - 4, 140, 6);
        ctx.fillRect(Math.round(px + pw * 0.56) - 45, Math.round(py + ph * 0.86) + 2, 90, 4);
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
        // Canteen on hip, stepped disc
        ctx.fillStyle = '#5A6A7A';
        ctx.fillRect(wx + 23, wy + 27, 11, 7);
        ctx.fillRect(wx + 25, wy + 25, 7, 11);
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
