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

    get isMoving() { return this.state !== 'idle'; }

    update() {
        this.animFrame++;
        const player = this.game.player;

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
                // Blocked: turn 90° and skitter along the obstacle instead of jamming into it
                const t = this.dirX;
                this.dirX = -this.dirY;
                this.dirY = t;
            }
            if (Math.abs(this.dirX) > 0.1) this.facing = this.dirX > 0 ? 1 : -1;
        }
    }

    get walkFrame() {
        return this.isMoving ? Math.floor(this.animFrame / 7) % 2 : 0;
    }

    drawSprite(ctx, frames, palette, frame, yOffset = 0) {
        const rows = frames[frame];
        const scale = this.width / rows[0].length;
        const oy = this.y + this.height - rows.length * scale + yOffset;
        this.drawPixels(ctx, rows, palette, this.x, oy, scale);
    }

    draw(ctx) {
        ctx.save();
        if (this.facing === -1) {
            ctx.translate(this.centerX, 0);
            ctx.scale(-1, 1);
            ctx.translate(-this.centerX, 0);
        }
        switch (this.critterType.name) {
            case 'Jackrabbit': this.drawJackrabbit(ctx); break;
            case 'Roadrunner': this.drawRoadrunner(ctx); break;
            case 'Lizard': this.drawLizard(ctx); break;
            case 'Quail': this.drawQuail(ctx); break;
            case 'Desert Tortoise': this.drawTortoise(ctx); break;
            default:
                ctx.fillStyle = '#996633';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                break;
        }
        ctx.restore();
    }

    drawJackrabbit(ctx) {
        const P = { b: '#C4A882', d: '#A08862', w: '#FFFFFF', k: '#111111' };
        const F = [[
            "....d.d....",
            "....d.d....",
            "....bbb....",
            "..bbbbbb...",
            "wbbbbbbbk..",
            ".bbbbbbbb..",
            "..bb..bb...",
            "..d....d...",
        ], [
            "....d.d....",
            "....d.d....",
            "....bbb....",
            "..bbbbbb...",
            "wbbbbbbbk..",
            ".bbbbbbbb..",
            "...dbbd....",
            "...........",
        ]];
        // Hop while moving
        const hop = this.isMoving ? -Math.abs(Math.sin(this.animFrame * 0.3)) * 4 : 0;
        this.drawSprite(ctx, F, P, this.walkFrame, hop);
    }

    drawRoadrunner(ctx) {
        const P = { b: '#6B5B45', c: '#4A3D2E', t: '#4A3D2E', p: '#3A3128', e: '#FFD700', l: '#3A3128' };
        const F = [[
            ".........cc..",
            "t.........bb.",
            ".tt......bebp",
            "..ttbbbbbbbb.",
            "....bbbbbbb..",
            ".....bbbb....",
            "......l..l...",
            ".....l....l..",
        ], [
            ".........cc..",
            "t.........bb.",
            ".tt......bebp",
            "..ttbbbbbbbb.",
            "....bbbbbbb..",
            ".....bbbb....",
            ".....l..l....",
            "......l..l...",
        ]];
        this.drawSprite(ctx, F, P, this.walkFrame);
    }

    drawLizard(ctx) {
        const P = { b: '#7A8B5A', t: '#5A6B3A', k: '#111111' };
        const F = [[
            "t...bbbb.",
            ".tt.bbbbk",
            "...b..b..",
        ], [
            ".t..bbbb.",
            "t.t.bbbbk",
            "..b..b...",
        ]];
        this.drawSprite(ctx, F, P, this.walkFrame);
    }

    drawQuail(ctx) {
        const P = { b: '#8A8078', a: '#B0A698', p: '#3A3128', k: '#111111', l: '#5A5148' };
        const F = [[
            "......p..",
            ".....pp..",
            "...bbbb..",
            "..bbbbbk.",
            "..abbbbp.",
            "..aabba..",
            "...l.l...",
        ], [
            "......p..",
            ".....pp..",
            "...bbbb..",
            "..bbbbbk.",
            "..abbbbp.",
            "..aabba..",
            "..l...l..",
        ]];
        // Gentle idle bob
        const bob = this.isMoving ? 0 : Math.sin(this.animFrame * 0.08) * 1;
        this.drawSprite(ctx, F, P, this.walkFrame, bob);
    }

    drawTortoise(ctx) {
        const P = { s: '#6B5B3A', d: '#4F4228', h: '#8A7A55', k: '#111111', l: '#8A7A55' };
        const F = [[
            "....sssss....",
            "..sssssssss..",
            ".sdsdsdsdsds.",
            ".sssssssssss.",
            "..l...l...hh.",
            "..l...l...hk.",
        ], [
            "....sssss....",
            "..sssssssss..",
            ".sdsdsdsdsds.",
            ".sssssssssss.",
            "..l...l..hh..",
            "..l...l..hk..",
        ]];
        // Tortoise animates slowly even for its two frames
        const frame = this.isMoving ? Math.floor(this.animFrame / 20) % 2 : 0;
        this.drawSprite(ctx, F, P, frame);
    }
}
