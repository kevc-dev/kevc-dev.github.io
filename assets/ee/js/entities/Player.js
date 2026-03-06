import { Entity } from './Entity.js';
import {
    CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SPEED, HYDRATION_RATE,
    ANIMATION_CYCLE_FRAMES, WALK_FRAMES, DEHYDRATION_DAMAGE_INTERVAL,
    DEHYDRATION_DAMAGE, SCREEN_FLASH_DURATION, GAME_STATE
} from '../constants.js';

export class Player extends Entity {
    constructor(game, x, y) {
        super(game, x, y, 24, 32, 'player');
        this.collisionBox = { xOffset: 4, yOffset: 16, width: 16, height: 16 };
        this.speed = PLAYER_SPEED;
        this.direction = 'down';
        this.health = 100;
        this.maxHealth = 100;
        this.hydration = 100;
        this.maxHydration = 100;
        this.inventory = ['canteen', 'compass'];
        this.quests = [{ id: "main_artifact", description: "Find the Arizona Artifact.", completed: false }];
        this.isMoving = false;
    }

    update() {
        this.isMoving = false;
        let nextX = this.x;
        let nextY = this.y;
        let moveX = 0;
        let moveY = 0;

        if (this.game.input.isPressed('w') || this.game.input.isPressed('arrowup')) {
            moveY = -this.speed; this.direction = 'up'; this.isMoving = true;
        } else if (this.game.input.isPressed('s') || this.game.input.isPressed('arrowdown')) {
            moveY = this.speed; this.direction = 'down'; this.isMoving = true;
        }
        if (this.game.input.isPressed('a') || this.game.input.isPressed('arrowleft')) {
            moveX = -this.speed; this.direction = 'left'; this.isMoving = true;
        } else if (this.game.input.isPressed('d') || this.game.input.isPressed('arrowright')) {
            moveX = this.speed; this.direction = 'right'; this.isMoving = true;
        }

        nextX += moveX;
        nextY += moveY;

        if (!this.game.currentMap.checkCollision(nextX + this.collisionBox.xOffset, this.y + this.collisionBox.yOffset, this.collisionBox.width, this.collisionBox.height)) {
            this.x = nextX;
        }
        if (!this.game.currentMap.checkCollision(this.x + this.collisionBox.xOffset, nextY + this.collisionBox.yOffset, this.collisionBox.width, this.collisionBox.height)) {
            this.y = nextY;
        }

        this.x = Math.max(0, Math.min(this.x, CANVAS_WIDTH - this.width));
        this.y = Math.max(0, Math.min(this.y, CANVAS_HEIGHT - this.height));

        this.animationFrame++;
        if (this.isMoving) {
            if (this.animationFrame % ANIMATION_CYCLE_FRAMES === 0) {
                this.spriteIndex = (this.spriteIndex + 1) % WALK_FRAMES;
            }
        } else {
            this.spriteIndex = 0;
        }

        this.hydration -= HYDRATION_RATE / 60;
        if (this.hydration < 0) this.hydration = 0;
        if (this.hydration === 0 && this.animationFrame % DEHYDRATION_DAMAGE_INTERVAL === 0) {
            this.takeDamage(DEHYDRATION_DAMAGE, "Dehydration");
        }
        this.game.ui.updateHydration(this.hydration, this.maxHydration);
    }

    draw(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const hatColor = '#8B4513', beardColor = '#5A2D0C', skinColor = '#F0D8C0';
        const eyeColor = '#000000', shirtColor = '#8B0000', pantsColor = '#4A3B31', shoesColor = '#2C1C0A';
        const headHeight = 8, hatHeight = 6, torsoHeight = 12;
        const legHeight = h - hatHeight - headHeight - torsoHeight;
        const frame = this.spriteIndex;

        // Hat
        ctx.fillStyle = hatColor;
        ctx.fillRect(x + w * 0.1, y, w * 0.8, hatHeight);
        ctx.fillRect(x, y + hatHeight * 0.5, w, hatHeight * 0.5);

        // Head
        ctx.fillStyle = skinColor;
        ctx.fillRect(x + w * 0.2, y + hatHeight, w * 0.6, headHeight);

        // Beard
        ctx.fillStyle = beardColor;
        if (this.direction === 'left' || this.direction === 'right' || this.direction === 'down') {
            ctx.fillRect(x + w * 0.1, y + hatHeight + 2, w * 0.1, headHeight - 2);
            ctx.fillRect(x + w * 0.8, y + hatHeight + 2, w * 0.1, headHeight - 2);
            ctx.fillRect(x + w * 0.2, y + hatHeight + headHeight * 0.65, w * 0.6, headHeight * 0.35);
            ctx.fillRect(x + w * 0.3, y + hatHeight + headHeight * 0.45, w * 0.4, 2);
        }
        if (this.direction === 'up') {
            ctx.fillRect(x + w * 0.2, y + hatHeight + headHeight * 0.6, w * 0.6, headHeight * 0.4);
        }

        // Eyes
        ctx.fillStyle = eyeColor;
        if (this.direction !== 'up') {
            const eyeY = y + hatHeight + headHeight * 0.3;
            ctx.fillRect(x + w * 0.3, eyeY, 2, 2);
            ctx.fillRect(x + w * 0.6, eyeY, 2, 2);
        }

        // Torso
        const torsoTopY = y + hatHeight + headHeight;
        ctx.fillStyle = shirtColor;
        ctx.fillRect(x + w * 0.15, torsoTopY, w * 0.7, torsoHeight);

        // Arms
        const armWidth = 4, armLength = torsoHeight * 0.8;
        this.drawArms(ctx, x, w, torsoTopY, armWidth, armLength, frame);

        // Legs
        const pantsTopY = torsoTopY + torsoHeight;
        const legWidth = w * 0.35, shoeHeight = 4;
        this.drawLegs(ctx, x, w, pantsTopY, pantsColor, shoesColor, legWidth, legHeight, shoeHeight, frame);
    }

    drawArms(ctx, x, w, torsoTopY, armWidth, armLength, frame) {
        if (this.direction === 'down') {
            if (this.isMoving) {
                if (frame === 0 || frame === 2) {
                    ctx.fillRect(x, torsoTopY + 2, armWidth, armLength);
                    ctx.fillRect(x + w - armWidth, torsoTopY + 4, armWidth, armLength);
                } else {
                    ctx.fillRect(x, torsoTopY + 4, armWidth, armLength);
                    ctx.fillRect(x + w - armWidth, torsoTopY + 2, armWidth, armLength);
                }
            } else {
                ctx.fillRect(x, torsoTopY + 2, armWidth, armLength);
                ctx.fillRect(x + w - armWidth, torsoTopY + 2, armWidth, armLength);
            }
        } else if (this.direction === 'up') {
            ctx.fillRect(x, torsoTopY + 2, armWidth, armLength * 0.7);
            ctx.fillRect(x + w - armWidth, torsoTopY + 2, armWidth, armLength * 0.7);
        } else if (this.direction === 'left') {
            ctx.fillRect(x + w * 0.4, torsoTopY + 2, armWidth, armLength);
            if (this.isMoving) ctx.fillRect(x + w * 0.6, torsoTopY + ((frame === 0 || frame === 2) ? 4 : 2), armWidth, armLength * 0.8);
        } else if (this.direction === 'right') {
            ctx.fillRect(x + w * 0.6 - armWidth, torsoTopY + 2, armWidth, armLength);
            if (this.isMoving) ctx.fillRect(x + w * 0.4 - armWidth, torsoTopY + ((frame === 0 || frame === 2) ? 4 : 2), armWidth, armLength * 0.8);
        }
    }

    drawLegs(ctx, x, w, pantsTopY, pantsColor, shoesColor, legWidth, legHeight, shoeHeight, frame) {
        ctx.fillStyle = pantsColor;
        if (this.direction === 'down' || this.direction === 'up') {
            if (this.isMoving) {
                const legOffset = (frame === 1 || frame === 3) ? 2 : 0;
                ctx.fillRect(x + w * 0.1, pantsTopY + ((frame === 0 || frame === 2) ? 0 : legOffset), legWidth, legHeight - shoeHeight);
                ctx.fillStyle = shoesColor;
                ctx.fillRect(x + w * 0.1, pantsTopY + legHeight - shoeHeight + ((frame === 0 || frame === 2) ? 0 : legOffset), legWidth, shoeHeight);
                ctx.fillStyle = pantsColor;
                ctx.fillRect(x + w * 0.9 - legWidth, pantsTopY + ((frame === 1 || frame === 3) ? 0 : legOffset), legWidth, legHeight - shoeHeight);
                ctx.fillStyle = shoesColor;
                ctx.fillRect(x + w * 0.9 - legWidth, pantsTopY + legHeight - shoeHeight + ((frame === 1 || frame === 3) ? 0 : legOffset), legWidth, shoeHeight);
            } else {
                ctx.fillRect(x + w * 0.1, pantsTopY, legWidth, legHeight - shoeHeight);
                ctx.fillStyle = shoesColor;
                ctx.fillRect(x + w * 0.1, pantsTopY + legHeight - shoeHeight, legWidth, shoeHeight);
                ctx.fillStyle = pantsColor;
                ctx.fillRect(x + w * 0.9 - legWidth, pantsTopY, legWidth, legHeight - shoeHeight);
                ctx.fillStyle = shoesColor;
                ctx.fillRect(x + w * 0.9 - legWidth, pantsTopY + legHeight - shoeHeight, legWidth, shoeHeight);
            }
        } else {
            const legX = this.direction === 'left' ? (x + w * 0.2) : (x + w * 0.45);
            if (this.isMoving) {
                const forward = (frame === 0 || frame === 2) ? 0 : 2;
                const back = (frame === 1 || frame === 3) ? 0 : 2;
                ctx.fillStyle = pantsColor;
                ctx.fillRect(legX + (this.direction === 'left' ? 4 : -4), pantsTopY + back, legWidth * 0.8, legHeight - shoeHeight);
                ctx.fillStyle = shoesColor;
                ctx.fillRect(legX + (this.direction === 'left' ? 4 : -4), pantsTopY + legHeight - shoeHeight + back, legWidth * 0.8, shoeHeight);
                ctx.fillStyle = pantsColor;
                ctx.fillRect(legX, pantsTopY + forward, legWidth, legHeight - shoeHeight);
                ctx.fillStyle = shoesColor;
                ctx.fillRect(legX, pantsTopY + legHeight - shoeHeight + forward, legWidth, shoeHeight);
            } else {
                ctx.fillRect(legX, pantsTopY, legWidth, legHeight - shoeHeight);
                ctx.fillStyle = shoesColor;
                ctx.fillRect(legX, pantsTopY + legHeight - shoeHeight, legWidth, shoeHeight);
                ctx.fillStyle = pantsColor;
                ctx.fillRect(legX + (this.direction === 'left' ? 4 : -4), pantsTopY, legWidth * 0.7, legHeight - shoeHeight);
            }
        }
    }

    interact() {
        const checkRange = 20;
        let checkX = this.x + this.width / 2;
        let checkY = this.y + this.height / 2;
        switch (this.direction) {
            case 'up': checkY -= this.height / 2 + checkRange / 2; break;
            case 'down': checkY += this.height / 2 + checkRange / 2; break;
            case 'left': checkX -= this.width / 2 + checkRange / 2; break;
            case 'right': checkX += this.width / 2 + checkRange / 2; break;
        }
        this.game.currentMap.tryInteraction(checkX, checkY, this);
    }

    addItem(itemKey) {
        if (!this.inventory.includes(itemKey)) {
            this.inventory.push(itemKey);
            this.game.ui.updateInventoryDisplay(this.inventory, this.game.itemTypes);
            if (itemKey === 'artifact1' || itemKey === 'final_artifact') {
                this.game.sound.playSound('getCoin');
            } else {
                this.game.sound.playSound('getItem');
            }
            return true;
        }
        return false;
    }

    hasItem(itemKey) { return this.inventory.includes(itemKey); }

    takeDamage(amount, source = "Unknown") {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        this.game.ui.updateHealth(this.health, this.maxHealth);
        if (source !== "Dehydration") {
            this.game.sound.playSound('playerHurt');
        }
        this.game.canvas.style.backgroundColor = '#FF0000';
        setTimeout(() => { this.game.canvas.style.backgroundColor = ''; }, SCREEN_FLASH_DURATION);
        if (this.health <= 0) this.game.gameOver(`Defeated by ${source}.`);
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.game.ui.updateHealth(this.health, this.maxHealth);
    }

    hydrate(amount) {
        this.hydration = Math.min(this.maxHydration, this.hydration + amount);
        this.game.ui.updateHydration(this.hydration, this.maxHydration);
    }

    addQuest(quest) {
        if (!this.quests.find(q => q.id === quest.id)) {
            this.quests.push(quest);
            this.game.ui.updateQuestLog(this.quests);
        }
    }

    completeQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest && !quest.completed) {
            quest.completed = true;
            this.game.ui.updateQuestLog(this.quests);
            this.game.ui.showDialog(`Quest Completed: ${quest.description}`, "System");
        }
    }
}
