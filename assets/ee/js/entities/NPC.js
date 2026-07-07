import { Entity } from './Entity.js';
import { GAME_STATE, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';
import { NPC_SPRITES } from './npcSprites.js';

export class NPC extends Entity {
    constructor(game, x, y, name, spriteKey, dialog) {
        super(game, x, y, 24, 32, 'npc');
        this.name = name;
        this.spriteKey = spriteKey;
        this.dialog = dialog;
        this.isInteractable = true;
        if (Array.isArray(this.dialog)) this.dialogIndex = 0;
        this.phaseOffset = Math.floor(Math.random() * 100);
        this.npcAnimationFrame = this.phaseOffset;
        // Gentle idle wander around a home spot
        this.homeX = x;
        this.homeY = y;
        this.dirX = 0;
        this.dirY = 0;
        this.wanderTimer = Math.floor(Math.random() * 240);
        this.walkFacing = 1;
    }

    update() {
        const p = this.game.player;
        // Someone's here: stop shuffling and pay attention
        if (p && Math.hypot(p.centerX - this.centerX, p.centerY - this.centerY) < 90) {
            this.dirX = 0;
            this.dirY = 0;
            return;
        }
        if (--this.wanderTimer <= 0) {
            this.wanderTimer = 200 + Math.floor(Math.random() * 280);
            if (Math.random() < 0.55) {
                this.dirX = 0;
                this.dirY = 0;
            } else {
                const a = Math.random() * Math.PI * 2;
                this.dirX = Math.cos(a);
                this.dirY = Math.sin(a);
            }
        }
        if (this.dirX !== 0 || this.dirY !== 0) {
            const sp = 0.35;
            const map = this.game.currentMap;
            const nx = this.x + this.dirX * sp;
            const ny = this.y + this.dirY * sp;
            if (Math.abs(nx - this.homeX) < 42 && nx > 0 && nx < CANVAS_WIDTH - this.width &&
                !map.checkCollision(nx + 4, this.y + 16, 16, 16)) this.x = nx;
            else this.dirX *= -1;
            if (Math.abs(ny - this.homeY) < 30 && ny > 0 && ny < CANVAS_HEIGHT - this.height &&
                !map.checkCollision(this.x + 4, ny + 16, 16, 16)) this.y = ny;
            else this.dirY *= -1;
            if (Math.abs(this.dirX) > 0.1) this.walkFacing = this.dirX > 0 ? 1 : -1;
        }
    }

    draw(ctx) {
        // Tied to the fixed-step game clock (not draw calls) so idle animation
        // speed doesn't depend on the display's refresh rate
        this.npcAnimationFrame = this.game.animationFrame + this.phaseOffset;
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const skinColor = '#E0C0A0', eyeColor = '#000000';
        const headHeight = 8, bodyTopY = y + headHeight, bodyHeight = h - headHeight;
        let npcHeadColor = skinColor, npcShirtColor = '#607D8B', npcTrouserColor = '#4E342E';
        const isSpirit = this.name.toLowerCase().includes('spirit') || this.name.toLowerCase().includes('ghost');
        const spriteSpec = NPC_SPRITES[this.name];

        if (spriteSpec) {
            // Dedicated pixel sprite with a slow idle blink; turns to face the
            // player when they're nearby (props swap sides, reading as a turn)
            const frame = Math.floor(this.npcAnimationFrame / 45) % 2;
            const rows = spriteSpec.frames[frame];
            const scale = w / rows[0].length;
            const p = this.game.player;
            const nearPlayer = p && Math.abs(p.centerY - this.centerY) < 90 && Math.abs(p.centerX - this.centerX) < 120;
            const faceLeft = nearPlayer ? p.centerX < this.centerX - 6 : this.walkFacing === -1;
            ctx.save();
            if (faceLeft) {
                ctx.translate(this.centerX, 0);
                ctx.scale(-1, 1);
                ctx.translate(-this.centerX, 0);
            }
            this.drawPixels(ctx, rows, spriteSpec.palette, x, y + h - rows.length * scale, scale);
            ctx.restore();
        } else if (isSpirit) {
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
        // Long names shrink instead of truncating ("Lock Keeper Vega", not "Lock")
        ctx.font = this.name.length > 12 ? '6px "Press Start 2P"' : '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.width / 2, this.y - 8);
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
        } else if (this.name === 'Lock Keeper Vega') {
            npcShirtColor = '#4E6A8A'; npcTrouserColor = '#3B3B3B';
            // SRP ball cap
            ctx.fillStyle = '#2A5A8A';
            ctx.fillRect(x + w * 0.2, y - 2, w * 0.6, headHeight * 0.45);
            ctx.fillStyle = '#1E4266';
            ctx.fillRect(x + w * 0.1, y + headHeight * 0.3, w * 0.55, headHeight * 0.18);
            // Long-handled lock wrench over the shoulder
            ctx.fillStyle = '#8A8078';
            ctx.fillRect(x + w * 0.85, bodyTopY - 4, 3, bodyHeight * 0.6);
            ctx.fillRect(x + w * 0.78, bodyTopY - 6, 10, 3);
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

        // Eyes (with blink); pupils glance toward the player when they're close
        const p = this.game.player;
        let look = 0;
        if (p && Math.abs(p.centerX - this.centerX) < 100 && Math.abs(p.centerY - this.centerY) < 70) {
            look = Math.sign(p.centerX - this.centerX);
        }
        ctx.fillStyle = eyeColor;
        if (this.npcAnimationFrame % 100 > 5) {
            ctx.fillRect(x + w * 0.35 + look, y + headHeight * 0.3, 2, 2);
            ctx.fillRect(x + w * 0.55 + look, y + headHeight * 0.3, 2, 2);
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
