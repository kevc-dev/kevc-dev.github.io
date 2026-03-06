import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATE } from './constants.js';
import { NPC } from './entities/NPC.js';
import { Enemy } from './entities/Enemy.js';
import { InteractiveObject } from './entities/InteractiveObject.js';

export class GameMap {
    constructor(game, mapData) {
        this.game = game;
        this.name = mapData.name;
        this.background = mapData.background;
        this.objects = [];
        this.npcs = [];
        this.enemies = [];
        this.projectiles = [];
        this.loadEntities(mapData);
    }

    loadEntities(mapData) {
        this.objects = [];
        this.npcs = [];
        this.enemies = [];
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
    }

    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }

    update() {
        if (this.game.gameState !== GAME_STATE.PLAYING) return;
        this.npcs.forEach(npc => npc.update());
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
        if (!this.game.dayTime) {
            ctx.fillStyle = 'rgba(0, 0, 30, 0.65)';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        const allDrawableEntities = [...this.objects, ...this.npcs, ...this.enemies, ...this.projectiles];
        if (this.game.player) allDrawableEntities.push(this.game.player);
        allDrawableEntities.sort((a, b) => (a.y + a.height) - (b.y + b.height));
        allDrawableEntities.forEach(entity => {
            if (entity && typeof entity.draw === 'function') entity.draw(ctx);
        });
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
