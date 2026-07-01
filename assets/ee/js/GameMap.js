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
        this.loadEntities(mapData);
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

        // Daytime ground effects (outdoor maps only)
        if (!this.indoor && this.game.dayTime) this.drawCloudShadows(ctx);

        const allDrawableEntities = [...this.objects, ...this.npcs, ...this.critters, ...this.enemies, ...this.projectiles];
        if (this.game.player) allDrawableEntities.push(this.game.player);
        allDrawableEntities.sort((a, b) => (a.y + a.height) - (b.y + b.height));
        allDrawableEntities.forEach(entity => {
            if (entity && typeof entity.draw === 'function') entity.draw(ctx);
        });

        // Night falls over everything (outdoor maps only)
        if (!this.indoor && !this.game.dayTime) {
            ctx.fillStyle = 'rgba(0, 0, 30, 0.55)';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            this.drawNightSky(ctx);
        }
        if (!this.indoor && this.game.dayTime) this.drawBirds(ctx);
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
