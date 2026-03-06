import { Entity } from './Entity.js';
import { GAME_STATE } from '../constants.js';

export class NPC extends Entity {
    constructor(game, x, y, name, spriteKey, dialog) {
        super(game, x, y, 24, 32, 'npc');
        this.name = name;
        this.spriteKey = spriteKey;
        this.dialog = dialog;
        this.isInteractable = true;
        if (Array.isArray(this.dialog)) this.dialogIndex = 0;
        this.npcAnimationFrame = Math.floor(Math.random() * 100);
    }

    draw(ctx) {
        this.npcAnimationFrame++;
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const skinColor = '#E0C0A0', eyeColor = '#000000';
        const headHeight = 8, bodyTopY = y + headHeight, bodyHeight = h - headHeight;
        let npcHeadColor = skinColor, npcShirtColor = '#607D8B', npcTrouserColor = '#4E342E';
        const isSpirit = this.name.toLowerCase().includes('spirit') || this.name.toLowerCase().includes('ghost');

        if (isSpirit) {
            this.drawSpirit(ctx, x, y, w, h, bodyTopY, bodyHeight, headHeight);
        } else {
            this.drawHuman(ctx, x, y, w, h, bodyTopY, bodyHeight, headHeight, npcHeadColor, npcShirtColor, npcTrouserColor, eyeColor);
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(this.name.substring(0, 10), this.x + this.width / 2, this.y - 8);
        ctx.textAlign = 'left';
    }

    drawSpirit(ctx, x, y, w, h, bodyTopY, bodyHeight, headHeight) {
        const npcTrouserColor = '#87CEEB', npcShirtColor = '#B0E0E6', npcHeadColor = '#ADD8E6';
        ctx.globalAlpha = 0.6 + Math.sin(this.npcAnimationFrame * 0.1) * 0.15;
        ctx.fillStyle = npcTrouserColor;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.2, y + h);
        ctx.quadraticCurveTo(x + w * 0.5, y + h - 10, x + w * 0.8, y + h);
        ctx.quadraticCurveTo(x + w * 0.5, y + h + 5, x + w * 0.2, y + h);
        ctx.fill();
        ctx.fillStyle = npcShirtColor;
        ctx.fillRect(x + w * 0.15, bodyTopY, w * 0.7, bodyHeight * 0.6);
        ctx.fillStyle = npcHeadColor;
        ctx.fillRect(x + w * 0.25, y, w * 0.5, headHeight);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + w * 0.35, y + headHeight * 0.3, 2, 2);
        ctx.fillRect(x + w * 0.55, y + headHeight * 0.3, 2, 2);
        ctx.globalAlpha = 1.0;
    }

    drawHuman(ctx, x, y, w, h, bodyTopY, bodyHeight, headHeight, npcHeadColor, npcShirtColor, npcTrouserColor, eyeColor) {
        if (this.name === 'Ranger Rick') {
            npcShirtColor = '#556B2F'; npcTrouserColor = '#8B4513';
            ctx.fillStyle = '#6B4226';
            ctx.fillRect(x, y, w, headHeight * 0.6);
            ctx.fillRect(x - 4, y + headHeight * 0.4, w + 8, headHeight * 0.4);
        } else if (this.name === 'Old Hermit') {
            npcShirtColor = '#778899'; npcTrouserColor = '#5A4D41';
            ctx.fillStyle = '#A9A9A9';
            ctx.fillRect(x + w * 0.2, y - 2, w * 0.6, headHeight * 0.5);
        } else if (this.name === 'Tired Hiker') {
            npcShirtColor = '#FF6347'; npcTrouserColor = '#4682B4';
            ctx.fillStyle = '#2E8B57';
            ctx.fillRect(x + w * 0.1, bodyTopY + 2, w * 0.8, bodyHeight * 0.5);
        } else if (this.name === 'Lost Tourist') {
            npcShirtColor = '#FF4500'; npcTrouserColor = '#F0E68C';
            // Sunhat
            ctx.fillStyle = '#F5DEB3';
            ctx.fillRect(x - 2, y - 2, w + 4, headHeight * 0.4);
            ctx.fillRect(x + w * 0.15, y - 4, w * 0.7, headHeight * 0.3);
            // Camera strap
            ctx.fillStyle = '#333';
            ctx.fillRect(x + w * 0.7, bodyTopY + 2, 3, bodyHeight * 0.4);
        } else if (this.name === 'Old Prospector') {
            npcShirtColor = '#8B6914'; npcTrouserColor = '#654321';
            // Wide-brim hat
            ctx.fillStyle = '#5C4033';
            ctx.fillRect(x - 4, y, w + 8, headHeight * 0.4);
            ctx.fillRect(x + w * 0.1, y - 3, w * 0.8, headHeight * 0.5);
            // Bushy beard
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(x + w * 0.15, y + headHeight * 0.5, w * 0.7, headHeight * 0.6);
            // Pickaxe on back
            ctx.fillStyle = '#8B8682';
            ctx.save();
            ctx.translate(x + w * 0.8, bodyTopY);
            ctx.rotate(0.3);
            ctx.fillRect(0, 0, 3, bodyHeight * 0.7);
            ctx.fillStyle = '#A9A9A9';
            ctx.fillRect(-3, -2, 9, 4);
            ctx.restore();
        } else if (this.name === 'Petroglyph Researcher' || this.name === 'Grad Student') {
            npcShirtColor = '#4682B4';
            if (this.name === 'Grad Student') npcShirtColor = '#D2691E';
            npcTrouserColor = '#696969';
            if (this.name === 'Petroglyph Researcher') {
                ctx.fillStyle = '#000000';
                ctx.fillRect(x + w * 0.25, y + headHeight * 0.4, w * 0.5, 2);
            }
        }

        // Legs
        ctx.fillStyle = npcTrouserColor;
        ctx.fillRect(x + w * 0.15, bodyTopY + bodyHeight * 0.5, w * 0.3, bodyHeight * 0.5);
        ctx.fillRect(x + w * 0.55, bodyTopY + bodyHeight * 0.5, w * 0.3, bodyHeight * 0.5);

        // Shirt
        ctx.fillStyle = npcShirtColor;
        ctx.fillRect(x + w * 0.15, bodyTopY, w * 0.7, bodyHeight * 0.6);

        // Head
        ctx.fillStyle = npcHeadColor;
        ctx.fillRect(x + w * 0.25, y, w * 0.5, headHeight);

        // Eyes (with blink)
        ctx.fillStyle = eyeColor;
        if (this.npcAnimationFrame % 100 > 5) {
            ctx.fillRect(x + w * 0.35, y + headHeight * 0.3, 2, 2);
            ctx.fillRect(x + w * 0.55, y + headHeight * 0.3, 2, 2);
        } else {
            ctx.fillRect(x + w * 0.35, y + headHeight * 0.3 + 1, 2, 1);
            ctx.fillRect(x + w * 0.55, y + headHeight * 0.3 + 1, 2, 1);
        }
    }

    onInteract(player) {
        let currentDialog = this.dialog;
        if (typeof this.dialog === 'function') {
            currentDialog = this.dialog(player, this.game);
        } else if (Array.isArray(this.dialog)) {
            currentDialog = this.dialog[this.dialogIndex];
            this.dialogIndex = (this.dialogIndex + 1) % this.dialog.length;
        }
        this.game.ui.showDialog(currentDialog, this.name);
        this.game.setGameState(GAME_STATE.DIALOG);
    }
}
