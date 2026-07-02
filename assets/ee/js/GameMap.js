import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATE } from './constants.js';
import { NPC } from './entities/NPC.js';
import { Enemy } from './entities/Enemy.js';
import { Critter } from './entities/Critter.js';
import { InteractiveObject } from './entities/InteractiveObject.js';

export class GameMap {
    constructor(game, mapData) {
        this.game = game;
        this.name = mapData.name;
        this.background = mapData.background;
        this.indoor = mapData.indoor || false;
        this.objects = [];
        this.npcs = [];
        this.enemies = [];
        this.critters = [];
        this.projectiles = [];
        // Deterministic star field for night skies
        this.stars = [];
        for (let i = 0; i < 40; i++) {
            this.stars.push({
                x: (i * 137 + 61) % CANVAS_WIDTH,
                y: ((i * 89 + 23) % (CANVAS_HEIGHT * 0.55)),
                size: (i % 3 === 0) ? 2 : 1,
                phase: i * 0.7,
            });
        }
        this.decor = this.generateDecor();
        this.loadEntities(mapData);
    }

    // Deterministic ground texture: sand speckles, pebbles, dry grass tufts
    generateDecor() {
        let seed = 7;
        for (const c of this.name) seed = ((seed * 31 + c.charCodeAt(0)) >>> 0);
        const rand = () => {
            seed = (seed * 1103515245 + 12345) >>> 0;
            return (seed >>> 8) / 16777216;
        };
        const decor = [];
        for (let i = 0; i < 70; i++) {
            decor.push({ kind: 'speck', x: rand() * CANVAS_WIDTH, y: rand() * CANVAS_HEIGHT, light: rand() < 0.4, s: rand() < 0.3 ? 3 : 2 });
        }
        for (let i = 0; i < 12; i++) {
            decor.push({ kind: 'stone', x: rand() * CANVAS_WIDTH, y: rand() * CANVAS_HEIGHT, s: 3 + rand() * 4 });
        }
        for (let i = 0; i < 9; i++) {
            decor.push({ kind: 'tuft', x: rand() * CANVAS_WIDTH, y: rand() * CANVAS_HEIGHT, phase: rand() * 6 });
        }
        return decor;
    }

    drawGroundDetail(ctx) {
        const t = this.game.animationFrame;
        this.decor.forEach(d => {
            if (d.kind === 'speck') {
                ctx.fillStyle = d.light ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.08)';
                ctx.fillRect(d.x, d.y, d.s, d.s);
            } else if (d.kind === 'stone') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.13)';
                ctx.beginPath();
                ctx.ellipse(d.x, d.y, d.s, d.s * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
                ctx.beginPath();
                ctx.ellipse(d.x - 1, d.y - 1, d.s * 0.5, d.s * 0.35, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Dry grass tuft, swaying faintly
                const sway = this.indoor ? 0 : Math.sin(t * 0.03 + d.phase) * 1.5;
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.14)';
                ctx.lineWidth = 1;
                for (let b = -1; b <= 1; b++) {
                    ctx.beginPath();
                    ctx.moveTo(d.x + b * 2, d.y);
                    ctx.lineTo(d.x + b * 3 + sway, d.y - 6 - Math.abs(b));
                    ctx.stroke();
                }
            }
        });
    }

    loadEntities(mapData) {
        this.objects = [];
        this.npcs = [];
        this.enemies = [];
        this.critters = [];
        this.projectiles = [];

        (mapData.objects || []).forEach(objData => {
            const baseObjectType = this.game.objectTypes[objData.type] || {};
            const instanceData = JSON.parse(JSON.stringify({ ...baseObjectType, ...objData }));
            this.objects.push(new InteractiveObject(this.game, instanceData.x, instanceData.y, instanceData));
        });

        (mapData.npcs || []).forEach(npcData => {
            this.npcs.push(new NPC(this.game, npcData.x, npcData.y, npcData.name, npcData.sprite, npcData.dialog));
        });

        (mapData.enemies || []).forEach(enemyData => {
            const enemyDefinition = this.game.enemyTypes[enemyData.type];
            if (enemyDefinition) {
                this.enemies.push(new Enemy(this.game, enemyData.x, enemyData.y, enemyDefinition));
            } else {
                console.warn(`Enemy type "${enemyData.type}" not found in definitions.`);
            }
        });

        (mapData.critters || []).forEach(critterData => {
            const critterDefinition = this.game.critterTypes[critterData.type];
            if (critterDefinition) {
                this.critters.push(new Critter(this.game, critterData.x, critterData.y, critterDefinition));
            } else {
                console.warn(`Critter type "${critterData.type}" not found in definitions.`);
            }
        });
    }

    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }

    update() {
        if (this.game.gameState !== GAME_STATE.PLAYING) return;
        this.npcs.forEach(npc => npc.update());
        this.critters.forEach(critter => critter.update());
        [...this.enemies].forEach(enemy => enemy.update());
        this.objects.forEach(obj => {
            if (obj.type === 'skull_turret' && typeof obj.updateTurret === 'function') obj.updateTurret();
        });
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update();
            if (this.projectiles[i].lifeSpan <= 0) this.projectiles.splice(i, 1);
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.drawGroundDetail(ctx);

        // Daytime ground effects (outdoor maps only)
        if (!this.indoor && this.game.dayTime) this.drawCloudShadows(ctx);

        const allDrawableEntities = [...this.objects, ...this.npcs, ...this.critters, ...this.enemies, ...this.projectiles];
        if (this.game.player) allDrawableEntities.push(this.game.player);
        allDrawableEntities.sort((a, b) => (a.y + a.height) - (b.y + b.height));

        // Soft contact shadows under characters and standing objects
        const shadowObjTypes = new Set(['cactus', 'dead_tree', 'chest', 'barrel', 'trail_marker', 'phoenix_statue', 'pedestal', 'mine_cart', 'stalagmite', 'well', 'sign', 'skull_turret', 'rock']);
        allDrawableEntities.forEach(e => {
            let sw = 0;
            if (e.type === 'player' || e.type === 'npc' || e.type === 'critter') sw = e.width * 0.42;
            else if (e.type === 'enemy' && !e.isFlying) sw = e.width * 0.4;
            else if (shadowObjTypes.has(e.type)) sw = e.width * 0.45;
            if (sw > 0) {
                ctx.fillStyle = 'rgba(40, 25, 10, 0.22)';
                ctx.beginPath();
                ctx.ellipse(e.centerX, e.y + e.height - 1, sw, 3.5, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        allDrawableEntities.forEach(entity => {
            if (entity && typeof entity.draw === 'function') entity.draw(ctx);
        });

        // Wandering dust devil (outdoor daytime only)
        if (!this.indoor && this.game.dayTime) this.drawDustDevil(ctx);

        // Time-of-day light over everything (outdoor maps only)
        if (!this.indoor) {
            const hour = Math.floor((this.game.gameTime % 86400) / 3600);
            if (!this.game.dayTime) {
                ctx.fillStyle = 'rgba(0, 0, 30, 0.55)';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                this.drawNightSky(ctx);
            } else if (hour >= 18) {
                // The crimson evening
                ctx.fillStyle = 'rgba(190, 45, 25, 0.18)';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            } else if (hour < 8) {
                // Golden dawn — the hour the alignments read
                ctx.fillStyle = 'rgba(255, 180, 80, 0.14)';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
            if (this.game.dayTime) this.drawBirds(ctx);
        }
    }

    drawCloudShadows(ctx) {
        const t = this.game.animationFrame;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        for (let i = 0; i < 2; i++) {
            const cx = ((t * (0.15 + i * 0.08) + i * 390) % (CANVAS_WIDTH + 260)) - 130;
            const cy = 90 + i * 210;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 70, 24, 0, 0, Math.PI * 2);
            ctx.ellipse(cx + 45, cy + 10, 50, 18, 0, 0, Math.PI * 2);
            ctx.ellipse(cx - 40, cy + 8, 40, 15, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawBirds(ctx) {
        const t = this.game.animationFrame;
        const cycle = 1400;
        const progress = (t % cycle) / cycle;
        if (progress > 0.35) return; // birds only cross occasionally
        const flockX = progress / 0.35 * (CANVAS_WIDTH + 120) - 60;
        const flockY = 50 + Math.sin(progress * 8) * 10;
        ctx.strokeStyle = 'rgba(40, 30, 20, 0.75)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const bx = flockX - i * 22 - (i % 2) * 8;
            const by = flockY + (i % 2) * 12 + Math.floor(i / 2) * 7;
            const flap = Math.sin(t * 0.25 + i) * 3;
            ctx.beginPath();
            ctx.moveTo(bx - 5, by - flap);
            ctx.lineTo(bx, by + 2);
            ctx.lineTo(bx + 5, by - flap);
            ctx.stroke();
        }
        ctx.lineWidth = 1;
    }

    drawDustDevil(ctx) {
        const t = this.game.animationFrame;
        const cycle = 1700;
        const p = (t % cycle) / cycle;
        if (p > 0.4) return; // passes through occasionally, then the air goes still
        const prog = p / 0.4;
        const x = -40 + prog * (CANVAS_WIDTH + 80);
        const baseY = 280 + Math.sin(prog * 5 + this.name.length) * 70;
        for (let i = 0; i < 7; i++) {
            const yy = baseY - i * 10;
            const r = 4 + i * 2.2;
            const wob = Math.sin(t * 0.3 + i * 1.3) * (2 + i * 0.9);
            ctx.fillStyle = `rgba(210, 180, 140, ${0.26 - i * 0.025})`;
            ctx.beginPath();
            ctx.ellipse(x + wob, yy, r, r * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        // Kicked-up grit at the base
        if (t % 6 === 0 && this.game.particles) this.game.particles.dust(x, baseY + 4);
    }

    drawNightSky(ctx) {
        const t = this.game.animationFrame;
        // Twinkling stars
        this.stars.forEach(star => {
            const twinkle = 0.4 + Math.abs(Math.sin(t * 0.03 + star.phase)) * 0.6;
            ctx.fillStyle = `rgba(255, 255, 230, ${twinkle})`;
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        // Moon
        ctx.fillStyle = '#E8E8D8';
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH - 80, 60, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(0, 0, 30, 0.85)';
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH - 88, 54, 15, 0, Math.PI * 2);
        ctx.fill();
        // Occasional shooting star (or something else...?)
        const cycle = 900;
        const sp = (t % cycle) / cycle;
        if (sp < 0.06) {
            const p = sp / 0.06;
            const sx = 100 + p * 300;
            const sy = 40 + p * 90;
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - p})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx - 22, sy - 8);
            ctx.lineTo(sx, sy);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
    }

    checkCollision(x, y, width, height) {
        if (x < 0 || x + width > CANVAS_WIDTH || y < 0 || y + height > CANVAS_HEIGHT) return true;
        for (const obj of this.objects) {
            if (obj.objData.solid && x < obj.x + obj.width && x + width > obj.x && y < obj.y + obj.height && y + height > obj.y) return true;
        }
        return false;
    }

    tryInteraction(checkX, checkY, player) {
        let interactionTarget = null;
        let minDistance = Infinity;
        const checkInteraction = (entity) => {
            if (!entity.isInteractable) return;
            const dist = Math.sqrt(Math.pow(entity.centerX - checkX, 2) + Math.pow(entity.centerY - checkY, 2));
            if (dist < (entity.width + entity.height) / 2 + 10 && dist < minDistance) {
                minDistance = dist;
                interactionTarget = entity;
            }
        };
        [...this.objects, ...this.npcs].forEach(checkInteraction);
        if (interactionTarget) {
            this.game.interactionTarget = interactionTarget;
            interactionTarget.onInteract(player);
        } else {
            this.game.interactionTarget = null;
        }
    }

    removeEnemy(enemyInstance) {
        this.enemies = this.enemies.filter(e => e !== enemyInstance);
    }
}
