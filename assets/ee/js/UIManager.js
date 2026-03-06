import { SAVE_NOTIFICATION_DURATION } from './constants.js';

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

        document.getElementById('startButton').addEventListener('click', () => {
            this.game.sound.initializeAudio();
            this.game.sound.stopMusic('menuTheme');
            this.game.sound.playSound('selectOption');
            this.game.startGame();
        });
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
            this.game.startGame(true);
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
    }

    showStartScreen() { this.startScreen.style.display = 'flex'; }
    hideStartScreen() { this.startScreen.style.display = 'none'; }
    showPauseScreen() { this.pauseScreen.style.display = 'flex'; }
    hidePauseScreen() { this.pauseScreen.style.display = 'none'; }
    showGameOverScreen(message) {
        document.getElementById('gameOverMessage').textContent = message;
        this.gameOverScreen.style.display = 'flex';
    }
    hideGameOverScreen() { this.gameOverScreen.style.display = 'none'; }
    showLoading() { this.loadingText.style.display = 'block'; }
    hideLoading() { this.loadingText.style.display = 'none'; }
    updateHealth(current, max) { this.hpFill.style.width = `${(current / max) * 100}%`; }
    updateHydration(current, max) { this.hydrationFill.style.width = `${(current / max) * 100}%`; }
    updateMapName(name) { this.mapNameDisplay.textContent = name; }

    updateClock(gameTimeInSeconds) {
        const day = Math.floor(gameTimeInSeconds / (24 * 60 * 60)) + 1;
        const totalSecondsInDay = gameTimeInSeconds % (24 * 60 * 60);
        const hours = Math.floor(totalSecondsInDay / 3600);
        const minutes = Math.floor((totalSecondsInDay % 3600) / 60);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
        this.clockDisplay.textContent = `Day ${day} - ${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
    }

    showDialog(text, speaker) {
        this.dialogBox.innerHTML = speaker ? `<strong>${speaker}:</strong> ${text}` : text;
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

    showWinScreen(message) {
        this.winMessage.textContent = message;
        this.winScreen.style.display = 'block';
    }
    hideWinScreen() { this.winScreen.style.display = 'none'; }

    updateInventoryDisplay(inventory, itemTypes) {
        this.inventoryDiv.innerHTML = '';
        inventory.forEach(itemKey => {
            const item = itemTypes[itemKey];
            if (!item) return;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'invItem';
            itemDiv.textContent = item.name.charAt(0).toUpperCase();
            itemDiv.title = `${item.name}: ${item.description}`;
            itemDiv.addEventListener('click', () => this.game.useItem(itemKey));
            this.inventoryDiv.appendChild(itemDiv);
        });
    }

    updateQuestLog(quests) {
        if (quests.length === 0) {
            this.questLogDisplay.style.display = 'none';
            return;
        }
        this.questLogDisplay.style.display = 'block';
        this.questList.innerHTML = '';
        quests.forEach(quest => {
            const li = document.createElement('li');
            li.textContent = quest.description + (quest.completed ? " (Completed)" : "");
            if (quest.completed) li.style.textDecoration = "line-through";
            this.questList.appendChild(li);
        });
    }

    toggleQuestLog() {
        this.questLogDisplay.style.display = this.questLogDisplay.style.display === 'none' ? 'block' : 'none';
    }

    drawInteractionIndicator(x, y) {
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 35, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    showSaveNotification() {
        this.saveNotification.style.display = 'block';
        setTimeout(() => { this.saveNotification.style.display = 'none'; }, SAVE_NOTIFICATION_DURATION);
    }
}
