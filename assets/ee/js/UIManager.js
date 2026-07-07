import { SAVE_NOTIFICATION_DURATION } from './constants.js';
import { getPortraitURL } from './portraits.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.dialogBox = document.getElementById('dialogBox');
        this.inventoryDiv = document.getElementById('inventory');
        this.hpFill = document.getElementById('hpFill');
        this.hydrationFill = document.getElementById('hydrationFill');
        this.mapNameDisplay = document.getElementById('mapNameDisplay');
        this.clockDisplay = document.getElementById('clockDisplay');
        this.questLogDisplay = document.getElementById('questLogDisplay');
        this.questList = document.getElementById('questList');
        this.startScreen = document.getElementById('startScreen');
        this.pauseScreen = document.getElementById('pauseScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.loadingText = document.getElementById('loadingText');
        this.saveNotification = document.getElementById('saveNotification');
        this.puzzleScreen = document.getElementById('puzzleScreen');
        this.puzzleQuestion = document.getElementById('puzzleQuestion');
        this.puzzleOptionA = document.getElementById('puzzleOptionA');
        this.puzzleOptionB = document.getElementById('puzzleOptionB');
        this.puzzleOptionC = document.getElementById('puzzleOptionC');
        this.winScreen = document.getElementById('winScreen');
        this.winMessage = document.getElementById('winMessage');
        this.questLogPinned = false;
        this.questLogTimer = null;
        this.inventoryPinned = false;
        this.inventoryTimer = null;
        this.inventoryDiv.style.display = 'none';
        this.inventoryInfo = document.getElementById('inventoryInfo');
        this.inventoryList = document.getElementById('inventoryList');

        document.getElementById('startButton').addEventListener('click', () => {
            this.game.sound.initializeAudio();
            this.game.sound.stopMusic('menuTheme');
            this.game.sound.playSound('selectOption');
            this.game.startGame();
        });
        const continueButton = document.getElementById('continueButton');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                this.game.sound.initializeAudio();
                this.game.sound.stopMusic('menuTheme');
                this.game.sound.playSound('selectOption');
                this.game.continueGame();
            });
        }
        document.getElementById('resumeButton').addEventListener('click', () => {
            this.game.sound.initializeAudio();
            this.game.togglePause();
        });
        document.getElementById('mainMenuButton').addEventListener('click', () => {
            this.game.sound.initializeAudio();
            this.game.goToMainMenu();
        });
        document.getElementById('restartButton').addEventListener('click', () => {
            this.game.sound.initializeAudio();
            this.game.sound.playSound('selectOption');
            // Death resumes from the last checkpoint when one exists
            if (this.game.hasSave()) this.game.continueGame();
            else this.game.startGame(true);
        });
        document.getElementById('gameOverMainMenuButton').addEventListener('click', () => {
            this.game.sound.initializeAudio();
            this.game.sound.playSound('selectOption');
            this.game.goToMainMenu();
        });
        document.getElementById('winMainMenuButton').addEventListener('click', () => {
            this.game.sound.initializeAudio();
            this.game.sound.playSound('selectOption');
            this.game.goToMainMenu();
        });
        this.puzzleOptionA.addEventListener('click', () => this.game.handlePuzzleAnswer(0));
        this.puzzleOptionB.addEventListener('click', () => this.game.handlePuzzleAnswer(1));
        this.puzzleOptionC.addEventListener('click', () => this.game.handlePuzzleAnswer(2));

        const muteButton = document.getElementById('muteButton');
        if (muteButton) {
            // Volume cycles full / half / silent
            const renderVolumeIcon = (level) => {
                muteButton.innerHTML = level === 0 ? '&#128263;' : (level === 0.5 ? '&#128265;' : '&#128266;');
            };
            renderVolumeIcon(this.game.sound.volumeLevel);
            muteButton.addEventListener('click', () => renderVolumeIcon(this.game.sound.toggleMute()));
        }
    }

    showStartScreen() {
        this.startScreen.style.display = 'flex';
        const continueButton = document.getElementById('continueButton');
        if (continueButton) continueButton.style.display = this.game.hasSave() ? 'inline-block' : 'none';
    }
    hideStartScreen() { this.startScreen.style.display = 'none'; }
    showPauseScreen() { this.pauseScreen.style.display = 'flex'; }
    hidePauseScreen() { this.pauseScreen.style.display = 'none'; }
    showGameOverScreen(message) {
        document.getElementById('gameOverMessage').textContent = message;
        const restartButton = document.getElementById('restartButton');
        if (restartButton) restartButton.textContent = this.game.hasSave() ? 'LAST CHECKPOINT' : 'RESTART';
        this.gameOverScreen.style.display = 'flex';
    }
    hideGameOverScreen() { this.gameOverScreen.style.display = 'none'; }
    showLoading() { this.loadingText.style.display = 'block'; }
    hideLoading() { this.loadingText.style.display = 'none'; }
    updateHealth(current, max) { this.hpFill.style.width = `${(current / max) * 100}%`; }

    updateHydration(current, max) {
        this.hydrationFill.style.width = `${(current / max) * 100}%`;
        // Critically dry: the bar pulses
        const bar = document.getElementById('hydrationBar');
        if (bar) {
            const low = current / max < 0.2;
            if (low !== this.hydrationLow) {
                this.hydrationLow = low;
                if (low) bar.classList.add('low');
                else bar.classList.remove('low');
            }
        }
    }

    // Persistent poison indicator next to the HP bar
    setVenomBadge(active) {
        if (active === this.venomBadgeShown) return;
        this.venomBadgeShown = active;
        const badge = document.getElementById('venomBadge');
        if (badge) badge.style.display = active ? 'block' : 'none';
    }
    updateMapName(name) { this.mapNameDisplay.textContent = name; }

    updateClock(gameTimeInSeconds) {
        // Day 1 = June 5, 1986. Summer solstice = June 21.
        const day = Math.floor(gameTimeInSeconds / (24 * 60 * 60)) + 1;
        const totalSecondsInDay = gameTimeInSeconds % (24 * 60 * 60);
        const hours = Math.floor(totalSecondsInDay / 3600);
        const minutes = Math.floor((totalSecondsInDay % 3600) / 60);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
        const date = day + 4;
        const dateLabel = date <= 30 ? `Jun ${date}` : `Jul ${date - 30}`;
        const toSolstice = 21 - date;
        let suffix = '';
        if (toSolstice > 0) suffix = ` · Solstice in ${toSolstice}d`;
        else if (toSolstice === 0) suffix = ' · SOLSTICE';
        else if (date < 23) suffix = ' · Pour: Jun 23';
        this.clockDisplay.textContent = `${dateLabel}, 1986 - ${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}${suffix}`;
    }

    showDialog(text, speaker) {
        const portrait = speaker ? getPortraitURL(speaker) : null;
        const face = portrait ? `<img class="portrait" src="${portrait}" alt="">` : '';
        this.dialogBox.innerHTML = face + (speaker ? `<strong>${speaker}:</strong> ${text}` : text);
        this.dialogBox.style.display = 'block';
    }
    hideDialog() { this.dialogBox.style.display = 'none'; }

    showPuzzle(question, options) {
        this.puzzleQuestion.textContent = question;
        this.puzzleOptionA.textContent = `A. ${options[0]}`;
        this.puzzleOptionB.textContent = `B. ${options[1]}`;
        this.puzzleOptionC.textContent = `C. ${options[2]}`;
        this.puzzleScreen.style.display = 'block';
    }
    hidePuzzle() { this.puzzleScreen.style.display = 'none'; }

    showWinScreen(message, title) {
        const titleEl = document.getElementById('winTitle');
        if (titleEl && title) titleEl.textContent = title;
        // Each ending gets its own emblem: an olla going home, a briefcase of
        // cash, a museum plaque — the trophy stays for anything else.
        const art = document.getElementById('pixelTrophy');
        if (art) {
            const EMBLEMS = {
                'THE RETURN': "<rect x='9' y='0' width='1' height='4' fill='#C8A868'/><rect x='10' y='1' width='1' height='1' fill='#8A6B3F'/><rect x='10' y='3' width='1' height='1' fill='#8A6B3F'/><rect x='6' y='4' width='4' height='1' fill='#9A4630'/><rect x='5' y='5' width='6' height='1' fill='#C97B5A'/><rect x='4' y='6' width='8' height='4' fill='#C97B5A'/><rect x='4' y='8' width='8' height='1' fill='#4A3B2A'/><rect x='5' y='10' width='6' height='2' fill='#9A4630'/><rect x='6' y='12' width='4' height='1' fill='#7A3E24'/><rect x='2' y='13' width='12' height='1' fill='#B08D57'/>",
                'THE SPLIT': "<rect x='3' y='5' width='10' height='7' fill='#4A3A28'/><rect x='4' y='6' width='8' height='5' fill='#6B5B45'/><rect x='7' y='4' width='2' height='2' fill='#4A3A28'/><rect x='5' y='7' width='6' height='3' fill='#3E7C59'/><rect x='6' y='8' width='4' height='1' fill='#8FBC8F'/><rect x='12' y='11' width='3' height='3' fill='#FFD700'/><rect x='13' y='12' width='1' height='1' fill='#B8860B'/>",
                'THE PLAQUE': "<rect x='2' y='3' width='12' height='10' fill='#DAA520'/><rect x='3' y='4' width='10' height='8' fill='#B8860B'/><rect x='4' y='6' width='8' height='1' fill='#6B4A0F'/><rect x='4' y='8' width='6' height='1' fill='#6B4A0F'/><rect x='4' y='10' width='7' height='1' fill='#6B4A0F'/><rect x='3' y='4' width='1' height='1' fill='#F0D060'/><rect x='12' y='11' width='1' height='1' fill='#F0D060'/>",
            };
            if (title && EMBLEMS[title]) art.innerHTML = EMBLEMS[title];
        }
        this.winMessage.textContent = message;
        this.winScreen.style.display = 'block';
    }
    hideWinScreen() { this.winScreen.style.display = 'none'; }

    updateInventoryDisplay(inventory, itemTypes) {
        this.inventoryDiv.innerHTML = '';
        this.inventoryList.innerHTML = '';
        // Stackables collapse into one slot with a count
        const counts = new Map();
        inventory.forEach(itemKey => counts.set(itemKey, (counts.get(itemKey) || 0) + 1));
        counts.forEach((count, itemKey) => {
            const item = itemTypes[itemKey];
            if (!item) return;
            const countLabel = count > 1 ? ` x${count}` : '';
            // Icon box (top-left)
            const itemDiv = document.createElement('div');
            itemDiv.className = 'invItem';
            itemDiv.textContent = item.name.charAt(0).toUpperCase();
            if (count > 1) {
                const badge = document.createElement('span');
                badge.className = 'invCount';
                badge.textContent = count;
                itemDiv.appendChild(badge);
            }
            itemDiv.title = `${item.name}${countLabel}: ${item.description}`;
            itemDiv.addEventListener('click', () => this.game.useItem(itemKey));
            this.inventoryDiv.appendChild(itemDiv);
            // Readable name row (reference panel)
            const li = document.createElement('li');
            const key = document.createElement('span');
            key.className = 'invKey';
            key.textContent = item.name.charAt(0).toUpperCase();
            li.appendChild(key);
            li.appendChild(document.createTextNode(item.name + countLabel));
            this.inventoryList.appendChild(li);
        });
        this.showInventory();
        // Auto-hide after 2s unless pinned open
        if (this.inventoryTimer) clearTimeout(this.inventoryTimer);
        this.inventoryTimer = setTimeout(() => {
            this.inventoryTimer = null;
            if (!this.inventoryPinned) this.hideInventory();
        }, 2000);
    }

    showInventory() {
        this.inventoryDiv.style.display = 'flex';
        this.inventoryInfo.style.display = 'block';
    }

    hideInventory() {
        this.inventoryDiv.style.display = 'none';
        this.inventoryInfo.style.display = 'none';
    }

    toggleInventory() {
        if (this.inventoryTimer) {
            clearTimeout(this.inventoryTimer);
            this.inventoryTimer = null;
        }
        this.inventoryPinned = !this.inventoryPinned;
        if (this.inventoryPinned) this.showInventory();
        else this.hideInventory();
    }

    updateQuestLog(quests) {
        if (quests.length === 0) {
            this.questLogDisplay.style.display = 'none';
            return;
        }
        this.questList.innerHTML = '';
        // Open tasks first, settled records below them
        const ordered = [...quests.filter(q => !q.completed), ...quests.filter(q => q.completed)];
        ordered.forEach(quest => {
            const li = document.createElement('li');
            li.textContent = quest.description + (quest.completed ? " (Done)" : "");
            if (quest.completed) {
                li.style.textDecoration = "line-through";
                li.style.opacity = "0.6";
            }
            this.questList.appendChild(li);
        });
        // Pop up briefly on quest changes, then hide (unless pinned open with Q)
        this.questLogDisplay.style.display = 'block';
        if (this.questLogTimer) clearTimeout(this.questLogTimer);
        this.questLogTimer = setTimeout(() => {
            this.questLogTimer = null;
            if (!this.questLogPinned) this.questLogDisplay.style.display = 'none';
        }, 2000);
    }

    toggleQuestLog() {
        if (this.questLogTimer) {
            clearTimeout(this.questLogTimer);
            this.questLogTimer = null;
        }
        this.questLogPinned = !this.questLogPinned;
        this.questLogDisplay.style.display = this.questLogPinned ? 'block' : 'none';
    }

    drawInteractionIndicator(x, y) {
        // Bouncing stepped pixel arrow with outline. Reads clearly on any background
        const bounce = Math.round(Math.sin(this.game.animationFrame * 0.15) * 3);
        const px = Math.round(x), py = Math.round(y - 40 + bounce);
        // Black outline (one pixel larger each step)
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(px - 8, py, 16, 5);
        this.ctx.fillRect(px - 5, py + 4, 10, 4);
        this.ctx.fillRect(px - 2, py + 7, 4, 4);
        // Gold arrow steps
        this.ctx.fillStyle = '#FFDD33';
        this.ctx.fillRect(px - 6, py + 1, 12, 3);
        this.ctx.fillRect(px - 3, py + 4, 6, 3);
        this.ctx.fillRect(px - 1, py + 7, 2, 2);
    }

    showSaveNotification() {
        this.saveNotification.style.display = 'block';
        setTimeout(() => { this.saveNotification.style.display = 'none'; }, SAVE_NOTIFICATION_DURATION);
    }
}
