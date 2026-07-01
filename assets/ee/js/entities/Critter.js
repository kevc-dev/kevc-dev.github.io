import { Entity } from './Entity.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

// Harmless ambient wildlife: wanders around, flees from the player.
export class Critter extends Entity {
    constructor(game, x, y, critterData) {
        super(game, x, y, critterData.width, critterData.height, 'critter');
        this.critterType = critterData;
        this.speed = critterData.speed;
        this.fleeRange = critterData.fleeRange || 60;
        this.state = 'idle'; // idle | wander | flee
        this.stateTimer = Math.floor(Math.random() * 120);
        this.dirX = 0;
        this.dirY = 0;
        this.facing = Math.random() < 0.5 ? 1 : -1;
        this.animFrame = Math.floor(Math.random() * 100);
    }

    update() {
        this.animFrame++;
        const player = this.game.player;

        // Flee if the player gets close
        if (player && this.fleeRange > 0) {
            const dx = this.centerX - player.centerX;
            const dy = this.centerY - player.centerY;
            const d = Math.hypot(dx, dy);
            if (d < this.fleeRange) {
                this.state = 'flee';
                this.dirX = dx / (d || 1);
                this.dirY = dy / (d || 1);
                this.stateTimer = 25;
            }
        }

        if (--this.stateTimer <= 0) {
            if (this.state === 'flee' || Math.random() < 0.5) {
                this.state = 'idle';
                this.dirX = 0; this.dirY = 0;
            } else {
                this.state = 'wander';
                const a = Math.random() * Math.PI * 2;
                this.dirX = Math.cos(a);
                this.dirY = Math.sin(a);
            }
            this.stateTimer = 60 + Math.floor(Math.random() * 150);
        }

        if (this.state !== 'idle') {
            const sp = this.state === 'flee' ? this.speed * 2.2 : this.speed;
            let nx = this.x + this.dirX * sp;
            let ny = this.y + this.dirY * sp;
            if (nx < 0 || nx + this.width > CANVAS_WIDTH) { this.dirX *= -1; nx = this.x; }
            if (ny < 0 || ny + this.height > CANVAS_HEIGHT) { this.dirY *= -1; ny = this.y; }
            if (!this.game.currentMap.checkCollision(nx, ny, this.width, this.height)) {
                this.x = nx;
                this.y = ny;
            } else {
                this.dirX *= -1;
                this.dirY *= -1;
            }
            if (Math.abs(this.dirX) > 0.1) this.facing = this.dirX > 0 ? 1 : -1;
        }
    }

    draw(ctx) {
        ctx.save();
        if (this.facing === -1) {
            ctx.translate(this.centerX, 0);
            ctx.scale(-1, 1);
            ctx.translate(-this.centerX, 0);
        }
        const x = this.x, y = this.y, w = this.width, h = this.height;
        switch (this.critterType.name) {
            case 'Jackrabbit': this.drawJackrabbit(ctx, x, y, w, h); break;
            case 'Roadrunner': this.drawRoadrunner(ctx, x, y, w, h); break;
            case 'Lizard': this.drawLizard(ctx, x, y, w, h); break;
            case 'Quail': this.drawQuail(ctx, x, y, w, h); break;
            case 'Desert Tortoise': this.drawTortoise(ctx, x, y, w, h); break;
            default:
                ctx.fillStyle = '#996633';
                ctx.fillRect(x, y, w, h);
                break;
        }
        ctx.restore();
    }

    drawJackrabbit(ctx, x, y, w, h) {
        const furColor = '#C4A882', darkFur = '#A08862';
        const moving = this.state !== 'idle';
        const hop = moving ? Math.abs(Math.sin(this.animFrame * 0.3)) * 4 : 0;
        const yy = y - hop;

        // Body
        ctx.fillStyle = furColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.45, yy + h * 0.6, w * 0.32, h * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(x + w * 0.75, yy + h * 0.4, w * 0.16, 0, Math.PI * 2);
        ctx.fill();

        // Long ears
        ctx.fillStyle = darkFur;
        ctx.fillRect(x + w * 0.68, yy - h * 0.35, 3, h * 0.6);
        ctx.fillRect(x + w * 0.8, yy - h * 0.4, 3, h * 0.65);

        // White tail
        ctx.fillStyle = '#FFF';
        ctx.fillRect(x + w * 0.08, yy + h * 0.5, 4, 4);

        // Eye
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w * 0.78, yy + h * 0.35, 2, 2);

        // Legs
        ctx.fillStyle = darkFur;
        const kick = moving ? Math.sin(this.animFrame * 0.3) * 2 : 0;
        ctx.fillRect(x + w * 0.25, yy + h * 0.82 + kick, w * 0.2, 3);
        ctx.fillRect(x + w * 0.6, yy + h * 0.85 - kick, w * 0.15, 3);
    }

    drawRoadrunner(ctx, x, y, w, h) {
        const bodyColor = '#6B5B45', crestColor = '#4A3D2E';
        const moving = this.state !== 'idle';
        const legBlur = moving ? Math.sin(this.animFrame * 0.6) * 3 : 0;

        // Long tail (angled up)
        ctx.fillStyle = crestColor;
        ctx.save();
        ctx.translate(x + w * 0.15, y + h * 0.45);
        ctx.rotate(-0.5);
        ctx.fillRect(-w * 0.35, -2, w * 0.4, 4);
        ctx.restore();

        // Body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.45, y + h * 0.5, w * 0.26, h * 0.26, 0, 0, Math.PI * 2);
        ctx.fill();

        // Neck + head
        ctx.fillRect(x + w * 0.6, y + h * 0.2, w * 0.12, h * 0.35);
        ctx.beginPath();
        ctx.arc(x + w * 0.7, y + h * 0.18, w * 0.11, 0, Math.PI * 2);
        ctx.fill();

        // Crest
        ctx.fillStyle = crestColor;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.64, y + h * 0.1);
        ctx.lineTo(x + w * 0.68, y - h * 0.08);
        ctx.lineTo(x + w * 0.74, y + h * 0.08);
        ctx.closePath(); ctx.fill();

        // Beak
        ctx.fillStyle = '#3A3128';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.8, y + h * 0.16);
        ctx.lineTo(x + w * 1.0, y + h * 0.2);
        ctx.lineTo(x + w * 0.8, y + h * 0.24);
        ctx.closePath(); ctx.fill();

        // Eye
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + w * 0.7, y + h * 0.13, 2, 2);

        // Fast legs
        ctx.strokeStyle = crestColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.4, y + h * 0.72);
        ctx.lineTo(x + w * 0.35 + legBlur, y + h);
        ctx.moveTo(x + w * 0.5, y + h * 0.72);
        ctx.lineTo(x + w * 0.55 - legBlur, y + h);
        ctx.stroke();
        ctx.lineWidth = 1;
    }

    drawLizard(ctx, x, y, w, h) {
        const bodyColor = '#7A8B5A', stripeColor = '#5A6B3A';
        const tailWiggle = Math.sin(this.animFrame * 0.25) * 2;

        // Tail
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.3, y + h * 0.5);
        ctx.quadraticCurveTo(x + w * 0.05, y + h * 0.5 + tailWiggle, x - w * 0.15, y + h * 0.4 - tailWiggle);
        ctx.stroke();
        ctx.lineWidth = 1;

        // Body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.5, y + h * 0.5, w * 0.28, h * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stripe
        ctx.fillStyle = stripeColor;
        ctx.fillRect(x + w * 0.3, y + h * 0.42, w * 0.4, 2);

        // Head
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.85, y + h * 0.45, w * 0.14, h * 0.24, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w * 0.86, y + h * 0.32, 2, 2);

        // Tiny legs
        const scurry = this.state !== 'idle' ? Math.sin(this.animFrame * 0.5) * 2 : 0;
        ctx.strokeStyle = stripeColor;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.35, y + h * 0.7); ctx.lineTo(x + w * 0.3 + scurry, y + h);
        ctx.moveTo(x + w * 0.65, y + h * 0.7); ctx.lineTo(x + w * 0.7 - scurry, y + h);
        ctx.stroke();
    }

    drawQuail(ctx, x, y, w, h) {
        const bodyColor = '#8A8078', bellyColor = '#B0A698';
        const bob = Math.sin(this.animFrame * 0.12) * 1;

        // Round body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.45, y + h * 0.6 + bob, w * 0.35, h * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = bellyColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.45, y + h * 0.72 + bob, w * 0.25, h * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(x + w * 0.72, y + h * 0.32 + bob, w * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Signature topknot plume
        ctx.strokeStyle = '#3A3128';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.74, y + h * 0.2 + bob);
        ctx.quadraticCurveTo(x + w * 0.68, y - h * 0.05 + bob, x + w * 0.8, y - h * 0.02 + bob);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.fillStyle = '#3A3128';
        ctx.beginPath();
        ctx.arc(x + w * 0.8, y - h * 0.02 + bob, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Beak & eye
        ctx.fillStyle = '#5A5148';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.85, y + h * 0.3 + bob);
        ctx.lineTo(x + w * 0.97, y + h * 0.34 + bob);
        ctx.lineTo(x + w * 0.85, y + h * 0.38 + bob);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w * 0.73, y + h * 0.28 + bob, 2, 2);

        // Legs
        ctx.strokeStyle = '#5A5148';
        const step = this.state !== 'idle' ? Math.sin(this.animFrame * 0.4) * 2 : 0;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.38, y + h * 0.85); ctx.lineTo(x + w * 0.36 + step, y + h);
        ctx.moveTo(x + w * 0.55, y + h * 0.85); ctx.lineTo(x + w * 0.57 - step, y + h);
        ctx.stroke();
    }

    drawTortoise(ctx, x, y, w, h) {
        const shellColor = '#6B5B3A', shellDark = '#4F4228', skinColor = '#8A7A55';
        const headPoke = Math.sin(this.animFrame * 0.04) * 2;

        // Legs
        ctx.fillStyle = skinColor;
        ctx.fillRect(x + w * 0.12, y + h * 0.7, 5, h * 0.3);
        ctx.fillRect(x + w * 0.68, y + h * 0.7, 5, h * 0.3);

        // Shell dome
        ctx.fillStyle = shellColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.45, y + h * 0.5, w * 0.38, h * 0.42, 0, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(x + w * 0.07, y + h * 0.5, w * 0.76, h * 0.22);

        // Shell pattern
        ctx.strokeStyle = shellDark;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.25, y + h * 0.2); ctx.lineTo(x + w * 0.3, y + h * 0.6);
        ctx.moveTo(x + w * 0.45, y + h * 0.08); ctx.lineTo(x + w * 0.45, y + h * 0.65);
        ctx.moveTo(x + w * 0.65, y + h * 0.2); ctx.lineTo(x + w * 0.6, y + h * 0.6);
        ctx.moveTo(x + w * 0.12, y + h * 0.4); ctx.lineTo(x + w * 0.78, y + h * 0.4);
        ctx.stroke();

        // Head poking out
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.88 + headPoke, y + h * 0.55, w * 0.1, h * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w * 0.9 + headPoke, y + h * 0.45, 2, 2);
    }
}
