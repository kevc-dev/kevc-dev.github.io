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
        // Dust storms roll through maps flagged for them (the canal traversal)
        this.haboob = mapData.haboob ? { phase: 'calm', timer: 1000 + Math.floor(Math.random() * 700) } : null;
        this.loadEntities(mapData);
    }

    endHaboob() {
        if (!this.haboob) return;
        this.haboob.phase = 'calm';
        this.haboob.timer = 1600 + Math.floor(Math.random() * 900);
        this.game.sound.setWind(false);
    }

    updateHaboob() {
        const hb = this.haboob;
        hb.timer--;
        if (hb.timer <= 0) {
            switch (hb.phase) {
                case 'calm':
                    hb.phase = 'approaching';
                    hb.timer = 260;
                    break;
                case 'approaching':
                    hb.phase = 'engulfed';
                    hb.timer = 720;
                    break;
                case 'engulfed':
                    hb.phase = 'clearing';
                    hb.timer = 200;
                    break;
                case 'clearing':
                    this.endHaboob();
                    return;
            }
        }
        // Re-assert wind each tick so it self-heals after pause/menu silencing
        this.game.sound.setWind(hb.phase !== 'calm');
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
                const s = Math.round(d.s);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.13)';
                ctx.fillRect(Math.round(d.x - s), Math.round(d.y - s * 0.6), s * 2, Math.max(2, Math.round(s * 1.2)));
                ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
                ctx.fillRect(Math.round(d.x - s * 0.5), Math.round(d.y - s * 0.6), s, Math.max(1, Math.round(s * 0.5)));
            } else {
                // Dry grass tuft: pixel blades, top pixels sway
                const sway = this.indoor ? 0 : Math.round(Math.sin(t * 0.03 + d.phase) * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
                const bx = Math.round(d.x), by = Math.round(d.y);
                ctx.fillRect(bx - 3, by - 4, 2, 4);
                ctx.fillRect(bx, by - 6, 2, 6);
                ctx.fillRect(bx + 3, by - 4, 2, 4);
                ctx.fillRect(bx - 3 + sway, by - 6, 2, 2);
                ctx.fillRect(bx + sway, by - 8, 2, 2);
                ctx.fillRect(bx + 3 + sway, by - 6, 2, 2);
            }
        });
    }

    loadEntities(mapData) {
        this.objects = [];
        this.npcs = [];
        this.enemies = [];
        this.critters = [];
        this.projectiles = [];

        (mapData.objects || []).forEach((objData, index) => {
            const baseObjectType = this.game.objectTypes[objData.type] || {};
            const instanceData = JSON.parse(JSON.stringify({ ...baseObjectType, ...objData }));
            this.objects.push(new InteractiveObject(this.game, instanceData.x, instanceData.y, instanceData, index));
        });

        (mapData.npcs || []).forEach(npcData => {
            this.npcs.push(new NPC(this.game, npcData.x, npcData.y, npcData.name, npcData.sprite, npcData.dialog));
        });

        const killedHere = this.game.sessionKills && this.game.sessionKills[this.game.currentMapName];
        (mapData.enemies || []).forEach((enemyData, index) => {
            if (killedHere && killedHere.has(index)) return; // stays dead this session
            const enemyDefinition = this.game.enemyTypes[enemyData.type];
            if (enemyDefinition) {
                this.enemies.push(new Enemy(this.game, enemyData.x, enemyData.y, enemyDefinition, index));
            } else {
                console.warn(`Enemy type "${enemyData.type}" not found in definitions.`);
            }
        });

        (mapData.critters || []).forEach(critterData => {
            const critterDefinition = this.game.critterTypes[critterData.type];
            if (critterDefinition) {
                // Merge instance data over the definition (guide paths, etc.)
                this.critters.push(new Critter(this.game, critterData.x, critterData.y, { ...critterDefinition, ...critterData }));
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
        if (this.haboob) this.updateHaboob();
        this.npcs.forEach(npc => npc.update());
        this.critters.forEach(critter => critter.update());
        if (this.critters.some(c => c.gone)) this.critters = this.critters.filter(c => !c.gone);
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

        // Flat ground features (washes) render under everything else
        this.objects.forEach(obj => { if (obj.objData.groundLayer) obj.draw(ctx); });

        // Daytime ground effects (outdoor maps only)
        if (!this.indoor && this.game.dayTime) this.drawCloudShadows(ctx);

        const allDrawableEntities = [...this.objects.filter(o => !o.objData.groundLayer), ...this.npcs, ...this.critters, ...this.enemies, ...this.projectiles];
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
                // Blocky two-step blob shadow
                ctx.fillStyle = 'rgba(40, 25, 10, 0.22)';
                ctx.fillRect(Math.round(e.centerX - sw), Math.round(e.y + e.height - 3), Math.round(sw * 2), 3);
                ctx.fillRect(Math.round(e.centerX - sw * 0.6), Math.round(e.y + e.height), Math.round(sw * 1.2), 2);
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
                // Golden dawn, the hour the alignments read
                ctx.fillStyle = 'rgba(255, 180, 80, 0.14)';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
            if (this.game.dayTime) {
                this.drawBirds(ctx);
                this.drawHawks(ctx);
            }
        }

        // The dust wall covers everything, day or night
        if (this.haboob && this.haboob.phase !== 'calm') this.drawHaboob(ctx);
    }

    drawHaboob(ctx) {
        const hb = this.haboob;
        const t = this.game.animationFrame;

        const drawDust = (alpha) => {
            // Full-screen dust with a clear pocket around the player
            ctx.fillStyle = `rgba(186, 142, 88, ${alpha})`;
            ctx.beginPath();
            ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            if (this.game.player) {
                const p = this.game.player;
                ctx.arc(p.centerX, p.centerY, 76, 0, Math.PI * 2, true);
            }
            ctx.fill();
            // Streaking grit blowing through
            ctx.fillStyle = `rgba(226, 196, 148, ${alpha * 0.8})`;
            for (let i = 0; i < 26; i++) {
                const gx = ((i * 97 + t * (6 + (i % 5))) % (CANVAS_WIDTH + 60)) - 30;
                const gy = (i * 53 + (i % 7) * 9) % CANVAS_HEIGHT;
                ctx.fillRect(gx, gy, 6 + (i % 3) * 3, 2);
            }
            // The chime is the beacon: a pulse of sound made visible
            const chime = this.objects.find(o => o.type === 'wind_chime');
            if (chime && alpha > 0.3) {
                const pulse = ((t % 50) / 50);
                const r = 4 + pulse * 22;
                ctx.fillStyle = `rgba(255, 240, 180, ${(1 - pulse) * 0.8})`;
                ctx.fillRect(Math.round(chime.centerX - r), Math.round(chime.centerY - 1), Math.round(r * 2), 2);
                ctx.fillRect(Math.round(chime.centerX - 1), Math.round(chime.centerY - r), 2, Math.round(r * 2));
            }
        };

        if (hb.phase === 'approaching') {
            // The brown wall rolls in from the east
            const progress = 1 - hb.timer / 260;
            const wallX = CANVAS_WIDTH - progress * (CANVAS_WIDTH + 60);
            ctx.fillStyle = 'rgba(186, 142, 88, 0.85)';
            ctx.fillRect(Math.round(wallX), 0, CANVAS_WIDTH - Math.round(wallX) + 60, CANVAS_HEIGHT);
            // Churning face of the wall: stacked lobes
            for (let i = 0; i < 8; i++) {
                const ly = i * (CANVAS_HEIGHT / 8);
                const bulge = Math.round(Math.sin(t * 0.08 + i * 1.7) * 10) - 18;
                ctx.fillStyle = `rgba(150, 108, 62, ${0.5 + (i % 2) * 0.2})`;
                ctx.fillRect(Math.round(wallX) + bulge, Math.round(ly), 26, Math.ceil(CANVAS_HEIGHT / 8) + 1);
                ctx.fillStyle = 'rgba(226, 196, 148, 0.5)';
                ctx.fillRect(Math.round(wallX) + bulge - 6, Math.round(ly + 4), 5, 5);
            }
        } else if (hb.phase === 'engulfed') {
            drawDust(0.82);
        } else if (hb.phase === 'clearing') {
            drawDust(0.82 * (hb.timer / 200));
        }
    }

    drawCloudShadows(ctx) {
        const t = this.game.animationFrame;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        for (let i = 0; i < 2; i++) {
            const cx = Math.round(((t * (0.15 + i * 0.08) + i * 390) % (CANVAS_WIDTH + 260)) - 130);
            const cy = 90 + i * 210;
            // Blocky cloud silhouette: stacked offset rects
            ctx.fillRect(cx - 70, cy - 10, 140, 22);
            ctx.fillRect(cx - 40, cy - 20, 90, 12);
            ctx.fillRect(cx - 90, cy + 2, 40, 14);
            ctx.fillRect(cx + 60, cy - 2, 36, 16);
        }
    }

    drawBirds(ctx) {
        const t = this.game.animationFrame;
        const cycle = 1400;
        const progress = (t % cycle) / cycle;
        if (progress > 0.35) return; // birds only cross occasionally
        const flockX = progress / 0.35 * (CANVAS_WIDTH + 120) - 60;
        const flockY = 50 + Math.sin(progress * 8) * 10;
        ctx.fillStyle = 'rgba(40, 30, 20, 0.8)';
        for (let i = 0; i < 4; i++) {
            const bx = Math.round(flockX - i * 22 - (i % 2) * 8);
            const by = Math.round(flockY + (i % 2) * 12 + Math.floor(i / 2) * 7);
            const up = (Math.floor(t / 7) + i) % 2 === 0;
            // Pixel bird: body + two 2px wings, up or down frame
            ctx.fillRect(bx - 1, by, 3, 2);
            if (up) {
                ctx.fillRect(bx - 5, by - 3, 4, 2);
                ctx.fillRect(bx + 2, by - 3, 4, 2);
            } else {
                ctx.fillRect(bx - 5, by + 2, 4, 2);
                ctx.fillRect(bx + 2, by + 2, 4, 2);
            }
        }
    }

    // Harris's hawks hunt in family groups — the only raptor that does — and a
    // tight wheel of them marks something on the ground below. Here: the
    // nearest unopened cache. The sky is the minimap, if you know to read it.
    drawHawks(ctx) {
        const marked = this.objects.find(o => o.type === 'chest' && o.objData.contains && !o.objData.opened);
        if (!marked) return;
        const t = this.game.animationFrame;
        const cx = marked.centerX;
        const cy = Math.max(40, marked.y - 58);
        for (let i = 0; i < 3; i++) {
            const a = t * 0.012 + i * (Math.PI * 2 / 3);
            const hx = Math.round(cx + Math.cos(a) * 34);
            const hy = Math.round(cy + Math.sin(a) * 13);
            const up = (Math.floor(t / 9) + i) % 2 === 0;
            ctx.fillStyle = 'rgba(58, 38, 24, 0.9)';
            ctx.fillRect(hx - 1, hy, 4, 2);            // body
            if (up) {
                ctx.fillRect(hx - 6, hy - 3, 5, 2);
                ctx.fillRect(hx + 3, hy - 3, 5, 2);
            } else {
                ctx.fillRect(hx - 6, hy + 2, 5, 2);
                ctx.fillRect(hx + 3, hy + 2, 5, 2);
            }
            // Rust shoulder patch, the Harris's tell
            ctx.fillStyle = 'rgba(140, 70, 40, 0.9)';
            ctx.fillRect(hx - 2, hy, 1, 1);
        }
    }

    drawDustDevil(ctx) {
        const t = this.game.animationFrame;
        const cycle = 1700;
        const p = (t % cycle) / cycle;
        if (p > 0.4) return; // passes through occasionally, then the air goes still
        const prog = p / 0.4;
        const x = -40 + prog * (CANVAS_WIDTH + 80);
        const baseY = 280 + Math.sin(prog * 5 + this.name.length) * 70;
        // Blocky spinning column: stacked rects widening upward, alternating offset
        for (let i = 0; i < 7; i++) {
            const yy = Math.round(baseY - i * 9);
            const hw = Math.round(4 + i * 2.2);
            const wob = Math.round(Math.sin(t * 0.3 + i * 1.3) * (2 + i * 0.9));
            ctx.fillStyle = `rgba(210, 180, 140, ${0.26 - i * 0.025})`;
            ctx.fillRect(Math.round(x) + wob - hw, yy - 4, hw * 2, 8);
            // Spin streak pixels on alternating sides
            ctx.fillStyle = `rgba(230, 205, 165, ${0.3 - i * 0.03})`;
            const side = (Math.floor(t / 4) + i) % 2 === 0 ? -1 : 1;
            ctx.fillRect(Math.round(x) + wob + side * hw - 2, yy - 2, 4, 4);
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
        // Pixel crescent moon: stepped disc with a dark bite
        const mx = CANVAS_WIDTH - 98, my = 42;
        ctx.fillStyle = '#E8E8D8';
        ctx.fillRect(mx + 9, my, 18, 36);
        ctx.fillRect(mx + 3, my + 6, 30, 24);
        ctx.fillRect(mx, my + 12, 36, 12);
        ctx.fillStyle = 'rgba(0, 0, 30, 0.85)';
        ctx.fillRect(mx + 3, my, 16, 28);
        ctx.fillRect(mx - 2, my + 4, 14, 18);
        // Crater pixels
        ctx.fillStyle = '#C8C8B8';
        ctx.fillRect(mx + 24, my + 10, 3, 3);
        ctx.fillRect(mx + 20, my + 24, 4, 4);
        ctx.fillRect(mx + 28, my + 18, 2, 2);
        // Occasional shooting star (or something else...?)
        const cycle = 900;
        const sp = (t % cycle) / cycle;
        if (sp < 0.06) {
            const p = sp / 0.06;
            const sx = Math.round(100 + p * 300);
            const sy = Math.round(40 + p * 90);
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - p})`;
            ctx.fillRect(sx, sy, 3, 3);
            ctx.fillStyle = `rgba(255, 255, 255, ${(1 - p) * 0.6})`;
            ctx.fillRect(sx - 7, sy - 3, 3, 3);
            ctx.fillStyle = `rgba(255, 255, 255, ${(1 - p) * 0.3})`;
            ctx.fillRect(sx - 14, sy - 6, 3, 3);
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
            if (entity.objData && entity.objData.uv && !this.game.uvActive) return;
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
