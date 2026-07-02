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
            // Subtle idle breathing bob
            const bob = Math.round(Math.sin(this.npcAnimationFrame * 0.05));
            ctx.save();
            ctx.translate(0, bob);
            this.drawHuman(ctx, x, y, w, h, bodyTopY, bodyHeight, headHeight, npcHeadColor, npcShirtColor, npcTrouserColor, eyeColor);
            ctx.restore();
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        const label = this.name.length > 12 ? this.name.split(' ')[0] : this.name;
        ctx.fillText(label, this.x + this.width / 2, this.y - 8);
        ctx.textAlign = 'left';
    }

    drawSpirit(ctx, x, y, w, h, bodyTopY, bodyHeight, headHeight) {
        ctx.globalAlpha = 0.6 + Math.sin(this.npcAnimationFrame * 0.1) * 0.15;
        const P = { g: '#ADD8E6', b: '#B0E0E6', W: '#FFFFFF' };
        const F = [[
            "...bbbbbb...",
            "..bbbbbbbb..",
            ".bbWWbbWWbb.",
            ".bbWWbbWWbb.",
            ".bbbbbbbbbb.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".g.gg.gg.g..",
        ], [
            "...bbbbbb...",
            "..bbbbbbbb..",
            ".bbWWbbWWbb.",
            ".bbWWbbWWbb.",
            ".bbbbbbbbbb.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            "..gg.gg.gg..",
        ]];
        const rows = F[Math.floor(this.npcAnimationFrame / 14) % 2];
        const scale = w / rows[0].length;
        this.drawPixels(ctx, rows, P, x, y + h - rows.length * scale, scale);
        ctx.globalAlpha = 1.0;
    }

    drawHuman(ctx, x, y, w, h, bodyTopY, bodyHeight, headHeight, npcHeadColor, npcShirtColor, npcTrouserColor, eyeColor) {
        if (this.name.startsWith('Ranger')) {
            npcShirtColor = '#556B2F'; npcTrouserColor = '#8B4513';
            ctx.fillStyle = '#6B4226';
            ctx.fillRect(x, y, w, headHeight * 0.6);
            ctx.fillRect(x - 4, y + headHeight * 0.4, w + 8, headHeight * 0.4);
        } else if (this.name === 'Frances Antone') {
            npcShirtColor = '#2E8B8B'; npcTrouserColor = '#3B3B3B';
            // Dark hair
            ctx.fillStyle = '#1A1414';
            ctx.fillRect(x + w * 0.2, y - 2, w * 0.6, headHeight * 0.45);
            ctx.fillRect(x + w * 0.18, y + headHeight * 0.2, w * 0.12, headHeight * 0.9);
            ctx.fillRect(x + w * 0.7, y + headHeight * 0.2, w * 0.12, headHeight * 0.9);
            // District clipboard under one arm
            ctx.fillStyle = '#C8B888';
            ctx.fillRect(x + w * 0.78, bodyTopY + 4, 7, 10);
            ctx.fillStyle = '#8A7A55';
            ctx.fillRect(x + w * 0.78, bodyTopY + 4, 7, 2);
        } else if (this.name === 'Vance Cutler') {
            npcShirtColor = '#C8A868'; npcTrouserColor = '#5A4A3A';
            // Cream panama hat with dark band
            ctx.fillStyle = '#E8DCC0';
            ctx.fillRect(x - 3, y + headHeight * 0.3, w + 6, headHeight * 0.35);
            ctx.fillRect(x + w * 0.15, y - 3, w * 0.7, headHeight * 0.5);
            ctx.fillStyle = '#4A3A28';
            ctx.fillRect(x + w * 0.15, y + headHeight * 0.15, w * 0.7, 2);
            // Bolo tie
            ctx.fillStyle = '#2A2A2A';
            ctx.fillRect(x + w * 0.48, bodyTopY, 2, bodyHeight * 0.35);
            ctx.fillStyle = '#40C4B0';
            ctx.fillRect(x + w * 0.44, bodyTopY + 2, 5, 5);
        } else if (this.name === 'Dr. Delgado') {
            npcShirtColor = '#B8A070'; npcTrouserColor = '#6B5B45';
            // Yellow hard hat
            ctx.fillStyle = '#F2C230';
            ctx.fillRect(x + w * 0.15, y - 3, w * 0.7, headHeight * 0.45);
            ctx.fillRect(x + w * 0.05, y + headHeight * 0.25, w * 0.9, headHeight * 0.2);
            // Trowel in hand: stepped pixel blade
            ctx.fillStyle = '#8A8078';
            ctx.fillRect(x + w * 0.92, bodyTopY + bodyHeight * 0.38, 5, 5);
            ctx.fillRect(x + w * 1.02, bodyTopY + bodyHeight * 0.44, 4, 4);
            ctx.fillRect(x + w * 1.1, bodyTopY + bodyHeight * 0.5, 3, 3);
        } else if (this.name === 'Morning Fisherman') {
            npcShirtColor = '#7A8B9A'; npcTrouserColor = '#4E5A42';
            // Bucket hat
            ctx.fillStyle = '#9AA382';
            ctx.fillRect(x + w * 0.1, y - 2, w * 0.8, headHeight * 0.4);
            ctx.fillRect(x, y + headHeight * 0.25, w, headHeight * 0.2);
            // Fishing rod: stepped pixel pole + hanging line
            ctx.fillStyle = '#6B4226';
            ctx.fillRect(x + w * 0.88, bodyTopY + bodyHeight * 0.45, 3, 5);
            ctx.fillRect(x + w * 1.0, bodyTopY + bodyHeight * 0.25, 3, 6);
            ctx.fillRect(x + w * 1.12, bodyTopY + bodyHeight * 0.05, 3, 6);
            ctx.fillRect(x + w * 1.24, y - h * 0.12, 3, 6);
            ctx.fillStyle = '#CCCCCC';
            ctx.fillRect(x + w * 1.26, y - h * 0.12 + 6, 1.5, bodyTopY + bodyHeight * 0.6 - (y - h * 0.12) - 6);
        } else if (this.name === 'Sparky') {
            // Student in the Sparky suit: all maroon, gold horns, gold pitchfork
            npcShirtColor = '#8C1D40'; npcTrouserColor = '#8C1D40'; npcHeadColor = '#8C1D40';
            ctx.fillStyle = '#FFC627';
            // Horns: stepped pixel spikes
            ctx.fillRect(x + w * 0.28, y - 1, 4, 3);
            ctx.fillRect(x + w * 0.3, y - 5, 2, 4);
            ctx.fillRect(x + w * 0.64, y - 1, 4, 3);
            ctx.fillRect(x + w * 0.68, y - 5, 2, 4);
            // Pitchfork held at the side
            const fx = x + w + 1, fy = y + 2;
            ctx.fillRect(fx, fy, 2, h * 0.8);           // shaft
            ctx.fillRect(fx - 4, fy + 3, 10, 2);        // crossbar
            ctx.fillRect(fx - 4, fy - 2, 2, 5);         // left prong
            ctx.fillRect(fx, fy - 4, 2, 5);             // center prong
            ctx.fillRect(fx + 4, fy - 2, 2, 5);         // right prong
            // Gold chest lightning bolt
            ctx.fillRect(x + w * 0.45, bodyTopY + 2, 3, 4);
            ctx.fillRect(x + w * 0.4, bodyTopY + 6, 3, 4);
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
            // Pickaxe on back: stepped pixel handle + head
            ctx.fillStyle = '#8B8682';
            ctx.fillRect(x + w * 0.78, bodyTopY + 2, 3, 6);
            ctx.fillRect(x + w * 0.84, bodyTopY + 7, 3, 6);
            ctx.fillRect(x + w * 0.9, bodyTopY + 12, 3, 5);
            ctx.fillStyle = '#A9A9A9';
            ctx.fillRect(x + w * 0.72, bodyTopY - 2, 12, 4);
        } else if (this.name === 'UFO Watcher') {
            npcShirtColor = '#2F4F4F'; npcTrouserColor = '#3A3A3A';
            // Foil hat: stepped pixel cone
            ctx.fillStyle = '#C0C8D0';
            ctx.fillRect(x + w * 0.2, y + headHeight * 0.2, w * 0.6, 3);
            ctx.fillRect(x + w * 0.32, y - 1, w * 0.36, headHeight * 0.35);
            ctx.fillRect(x + w * 0.42, y - 5, w * 0.16, 5);
            // Telescope: stepped diagonal tube aimed at the sky
            ctx.fillStyle = '#555555';
            ctx.fillRect(x + w * 0.82, bodyTopY + 8, 4, 4);
            ctx.fillRect(x + w * 0.94, bodyTopY + 4, 4, 4);
            ctx.fillRect(x + w * 1.06, bodyTopY, 4, 4);
            ctx.fillStyle = '#777777';
            ctx.fillRect(x + w * 1.14, bodyTopY - 4, 5, 5);
        } else if (this.name === 'Photographer') {
            npcShirtColor = '#8FBC8F'; npcTrouserColor = '#5F5F5F';
            // Backwards cap
            ctx.fillStyle = '#B22222';
            ctx.fillRect(x + w * 0.2, y - 2, w * 0.6, headHeight * 0.4);
            ctx.fillRect(x + w * 0.05, y, w * 0.2, headHeight * 0.25);
            // Camera held up
            ctx.fillStyle = '#222';
            ctx.fillRect(x + w * 0.55, bodyTopY + 3, 10, 7);
            ctx.fillStyle = '#88CCEE';
            ctx.fillRect(x + w * 0.55 + 3, bodyTopY + 5, 4, 3);
        } else if (this.name === 'Tumbleweed Ted') {
            npcTrouserColor = '#4E342E';
            // Striped serape poncho
            const stripes = ['#B23A48', '#E0A458', '#3E7C59'];
            for (let i = 0; i < 3; i++) {
                ctx.fillStyle = stripes[i];
                ctx.fillRect(x + w * 0.1, bodyTopY + i * (bodyHeight * 0.2), w * 0.8, bodyHeight * 0.2);
            }
            npcShirtColor = 'rgba(0,0,0,0)';
            // Wide sombrero
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(x - 5, y + headHeight * 0.3, w + 10, headHeight * 0.35);
            ctx.fillRect(x + w * 0.2, y - 4, w * 0.6, headHeight * 0.6);
        } else if (this.name === 'Wandering Musician') {
            npcShirtColor = '#6A0DAD'; npcTrouserColor = '#2F2F2F';
            // Bandana
            ctx.fillStyle = '#CC2222';
            ctx.fillRect(x + w * 0.2, y - 1, w * 0.6, headHeight * 0.35);
            // Guitar strapped across: pixel body + stepped neck
            ctx.fillStyle = '#8B5A2B';
            ctx.fillRect(x - 4, bodyTopY + bodyHeight * 0.35, 12, 8);
            ctx.fillRect(x - 2, bodyTopY + bodyHeight * 0.28, 8, 4);
            ctx.fillStyle = '#2A1A0A';
            ctx.fillRect(x - 1, bodyTopY + bodyHeight * 0.38, 4, 4);
            ctx.fillStyle = '#5C3D1E';
            ctx.fillRect(x + 5, bodyTopY + bodyHeight * 0.22, 3, 4);
            ctx.fillRect(x + 8, bodyTopY + bodyHeight * 0.12, 3, 4);
            ctx.fillRect(x + 11, bodyTopY + bodyHeight * 0.02, 4, 4);
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
