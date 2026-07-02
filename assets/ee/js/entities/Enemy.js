import { Entity } from './Entity.js';
import {
    CANVAS_WIDTH, CANVAS_HEIGHT,
    DEFAULT_AGGRO_RANGE, DEFAULT_ATTACK_RANGE, DEFAULT_ATTACK_COOLDOWN, ENEMY_KNOCKBACK,
    ENEMY_WANDER_SPEED_FACTOR, ENEMY_WANDER_RADIUS
} from '../constants.js';

export class Enemy extends Entity {
    constructor(game, x, y, enemyTypeData) {
        super(game, x, y, enemyTypeData.width, enemyTypeData.height, 'enemy');
        this.enemyType = enemyTypeData;
        this.health = enemyTypeData.health;
        this.speed = enemyTypeData.speed;
        this.damage = enemyTypeData.damage;
        this.aggroRange = enemyTypeData.aggroRange || DEFAULT_AGGRO_RANGE;
        this.attackRange = enemyTypeData.attackRange || DEFAULT_ATTACK_RANGE;
        this.attackCooldown = enemyTypeData.attackCooldown || DEFAULT_ATTACK_COOLDOWN;
        this.currentAttackCooldown = 0;
        this.isEthereal = enemyTypeData.isEthereal || false;
        this.isFlying = enemyTypeData.isFlying || false;
        this.solid = enemyTypeData.solid || false;
        this.interactive = enemyTypeData.interactive || false;
        this.enemyAnimationFrame = Math.floor(Math.random() * 100);
        // Idle behavior state
        this.spawnX = x;
        this.spawnY = y;
        this.wanderTimer = Math.floor(Math.random() * 90);
        this.wanderX = 0;
        this.wanderY = 0;
        this.circleAngle = Math.random() * Math.PI * 2;
        this.facing = 1; // 1 = right, -1 = left
        this.isMoving = false;
    }

    update() {
        this.enemyAnimationFrame++;
        const prevX = this.x, prevY = this.y;
        if (this.currentAttackCooldown > 0) this.currentAttackCooldown--;
        const player = this.game.player;
        if (!player) return;
        const distX = player.centerX - this.centerX;
        const distY = player.centerY - this.centerY;
        const distanceToPlayer = Math.sqrt(distX * distX + distY * distY) || 1;

        if (distanceToPlayer < this.aggroRange) {
            if (distanceToPlayer > this.attackRange) {
                let vx = (distX / distanceToPlayer) * this.speed;
                let vy = (distY / distanceToPlayer) * this.speed;
                if (this.enemyType.erratic) {
                    vx += Math.sin(this.enemyAnimationFrame * 0.3) * 0.8;
                    vy += Math.cos(this.enemyAnimationFrame * 0.27) * 0.8;
                }
                if (this.enemyType.charges) {
                    const burst = 1 + Math.max(0, Math.sin(this.enemyAnimationFrame * 0.05)) * 0.8;
                    vx *= burst; vy *= burst;
                }
                const nx = this.x + vx, ny = this.y + vy;
                if (this.isFlying || !this.game.currentMap.checkCollision(nx, this.y, this.width, this.height)) this.x = nx;
                if (this.isFlying || !this.game.currentMap.checkCollision(this.x, ny, this.width, this.height)) this.y = ny;
            } else if (this.currentAttackCooldown === 0) {
                player.takeDamage(this.damage, this.enemyType.name);
                this.currentAttackCooldown = this.attackCooldown;
                this.game.sound.playSound('enemyAttack');
                this.x -= (distX / distanceToPlayer) * ENEMY_KNOCKBACK;
                this.y -= (distY / distanceToPlayer) * ENEMY_KNOCKBACK;
            }
            if (Math.abs(distX) > 2) this.facing = distX > 0 ? 1 : -1;
        } else if (this.enemyType.circles) {
            // Vultures glide back onto their circling path, no teleporting
            this.circleAngle += 0.02;
            const tx = this.spawnX + Math.cos(this.circleAngle) * 50;
            const ty = this.spawnY + Math.sin(this.circleAngle) * 32;
            const ddx = tx - this.x, ddy = ty - this.y;
            const dd = Math.hypot(ddx, ddy);
            if (dd > this.speed * 1.5) {
                this.x += (ddx / dd) * this.speed;
                this.y += (ddy / dd) * this.speed;
                if (Math.abs(ddx) > 2) this.facing = ddx > 0 ? 1 : -1;
            } else {
                this.x = tx;
                this.y = ty;
                this.facing = Math.cos(this.circleAngle + Math.PI / 2) >= 0 ? 1 : -1;
            }
        } else {
            if (--this.wanderTimer <= 0) {
                this.wanderTimer = 90 + Math.floor(Math.random() * 120);
                if (Math.random() < 0.4) {
                    this.wanderX = 0; this.wanderY = 0;
                } else {
                    const a = Math.random() * Math.PI * 2;
                    this.wanderX = Math.cos(a);
                    this.wanderY = Math.sin(a);
                }
            }
            if (this.wanderX !== 0 || this.wanderY !== 0) {
                const map = this.game.currentMap;
                const nx = this.x + this.wanderX * this.speed * ENEMY_WANDER_SPEED_FACTOR;
                const ny = this.y + this.wanderY * this.speed * ENEMY_WANDER_SPEED_FACTOR;
                if (Math.abs(nx - this.spawnX) < ENEMY_WANDER_RADIUS && !map.checkCollision(nx, this.y, this.width, this.height)) this.x = nx;
                else this.wanderX *= -1;
                if (Math.abs(ny - this.spawnY) < ENEMY_WANDER_RADIUS && !map.checkCollision(this.x, ny, this.width, this.height)) this.y = ny;
                else this.wanderY *= -1;
                if (Math.abs(this.wanderX) > 0.1) this.facing = this.wanderX > 0 ? 1 : -1;
            }
        }

        // Keep on screen (knockback can shove enemies out) and record real movement
        this.x = Math.max(0, Math.min(this.x, CANVAS_WIDTH - this.width));
        this.y = Math.max(0, Math.min(this.y, CANVAS_HEIGHT - this.height));
        this.isMoving = Math.abs(this.x - prevX) + Math.abs(this.y - prevY) > 0.05;
    }

    // Walk frame flips every 8 ticks while moving; frame 0 when standing.
    get walkFrame() {
        return this.isMoving ? Math.floor(this.enemyAnimationFrame / 8) % 2 : 0;
    }

    // Wing frame flips regardless of travel (flyers always flap).
    get flapFrame() {
        return Math.floor(this.enemyAnimationFrame / 7) % 2;
    }

    drawSprite(ctx, frames, palette, frame, bobAmp = 0) {
        const rows = frames[frame];
        const scale = this.width / rows[0].length;
        const bob = bobAmp ? Math.sin(this.enemyAnimationFrame * 0.12) * bobAmp : 0;
        const oy = this.y + this.height - rows.length * scale + bob;
        this.drawPixels(ctx, rows, palette, this.x, oy, scale);
    }

    draw(ctx) {
        if (this.isEthereal) ctx.globalAlpha = 0.55 + Math.sin(this.enemyAnimationFrame * 0.1) * 0.2;

        // Flying enemies cast a small blocky ground shadow
        if (this.isFlying) {
            const sw = Math.round(this.width * 0.35);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(Math.round(this.centerX - sw), Math.round(this.y + this.height + 10), sw * 2, 3);
            ctx.fillRect(Math.round(this.centerX - sw * 0.6), Math.round(this.y + this.height + 13), Math.round(sw * 1.2), 2);
        }

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(this.centerX, 0);
            ctx.scale(-1, 1);
            ctx.translate(-this.centerX, 0);
        }

        switch (this.enemyType.name) {
            case 'Scorpion': this.drawScorpion(ctx); break;
            case 'Snake': this.drawSnake(ctx); break;
            case 'Coyote': this.drawCoyote(ctx); break;
            case 'Giant Spider': this.drawGiantSpider(ctx); break;
            case 'Restless Spirit': this.drawRestlessSpirit(ctx); break;
            case 'Gila Monster': this.drawGilaMonster(ctx); break;
            case 'Vulture': this.drawVulture(ctx); break;
            case 'Javelina': this.drawJavelina(ctx); break;
            case 'Cave Bat': this.drawBat(ctx); break;
            case 'Ancient Guardian': this.drawMummy(ctx); break;
            default:
                ctx.fillStyle = this.enemyType.color || '#FF0000';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                break;
        }

        ctx.restore();
        if (this.isEthereal) ctx.globalAlpha = 1.0;

        // Health bar
        if (this.health < this.enemyType.health) {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y - 8, this.width, 4);
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y - 8, this.width * (this.health / this.enemyType.health), 4);
        }
    }

    drawScorpion(ctx) {
        const P = { s: '#2A1A0A', d: '#4A3B2A', b: '#6A4F3A', c: '#7A5F4A' };
        const F = [[
            "..ss............",
            ".sdd............",
            ".dd.......c..c..",
            ".dd.......cc.cc.",
            "..dd....bbccbcc.",
            "...dbbbbbbbbb...",
            "..bbbbbbbbbbb...",
            ".d.d.d.d.d......",
            "..d.d.d.d.d.....",
        ], [
            "..ss............",
            ".sdd............",
            ".dd.......cc.cc.",
            ".dd.......c..c..",
            "..dd....bbccbcc.",
            "...dbbbbbbbbb...",
            "..bbbbbbbbbbb...",
            "..d.d.d.d.d.....",
            ".d.d.d.d.d......",
        ]];
        this.drawSprite(ctx, F, P, this.walkFrame);
    }

    drawSnake(ctx) {
        const P = { b: '#556B2F', a: '#8FBC8F', e: '#FF2222', t: '#FF4500' };
        const F = [[
            "..bb.....bb.....bbb.",
            ".baab...baab...bebb.",
            "b....bbb....bbb.bbb.",
            "....................",
        ], [
            "....................",
            "b....bbb....bbb.bbb.",
            ".baab...baab...bebb.",
            "..bb.....bb.....bbb.",
        ]];
        // Snakes ripple even at rest, just slower
        const frame = Math.floor(this.enemyAnimationFrame / (this.isMoving ? 8 : 30)) % 2;
        this.drawSprite(ctx, F, P, frame);
        // Tongue flick
        if (this.enemyAnimationFrame % 60 < 12) {
            const s = this.width / 20;
            ctx.fillStyle = P.t;
            ctx.fillRect(Math.round(this.x + 19 * s), Math.round(this.y + this.height * 0.35), Math.ceil(s * 1.5), Math.ceil(s));
        }
    }

    drawCoyote(ctx) {
        const P = { B: '#B8860B', D: '#8B4513', U: '#D2B48C', K: '#111111', N: '#2A1A0A' };
        const F = [[
            ".............D..D...",
            ".............DDDD...",
            "D............BBBB...",
            "DD..........BKBBNN..",
            ".DD..BBBBBBBBBBB....",
            ".DDBBBBBBBBBBBB.....",
            "..DBBBBBBBBBBB......",
            "...BUUUUUUUUUB......",
            "...BUUUUUUUUUB......",
            "....B..B..B..B......",
            "....B..B..B..B......",
            "....D..D..D..D......",
        ], [
            ".............D..D...",
            ".............DDDD...",
            "D............BBBB...",
            "DD..........BKBBNN..",
            ".DD..BBBBBBBBBBB....",
            ".DDBBBBBBBBBBBB.....",
            "..DBBBBBBBBBBB......",
            "...BUUUUUUUUUB......",
            "...BUUUUUUUUUB......",
            "...B..B....B..B.....",
            "...B..B....B..B.....",
            "...D..D....D..D.....",
        ]];
        this.drawSprite(ctx, F, P, this.walkFrame);
    }

    drawGiantSpider(ctx) {
        const P = { L: '#2A2A2A', B: '#3A3A3A', H: '#2E2E2E', e: '#FF2222', f: '#E0E0E0' };
        const F = [[
            ".L......LL......L.",
            "..L....BBBB....L..",
            "L..L..BBBBBB..L..L",
            ".LL...BBBBBB...LL.",
            "L.....BBBBBB.....L",
            ".L.....BBBB.....L.",
            "..LL...HHHH...LL..",
            ".......eHHe.......",
            "........ff........",
        ], [
            "..L....LL......L..",
            ".L....BBBB....L...",
            "..LL..BBBBBB..LL..",
            "L.....BBBBBB.....L",
            ".LL...BBBBBB...LL.",
            "..L....BBBB....L..",
            ".L.....HHHH.....L.",
            ".......eHHe.......",
            "........ff........",
        ]];
        this.drawSprite(ctx, F, P, this.walkFrame, 1.5);
    }

    drawRestlessSpirit(ctx) {
        const P = { g: '#ADD8E6', h: '#B0E0E6', W: '#FFFFFF' };
        const F = [[
            "...hhhhhh...",
            "..hhhhhhhh..",
            ".gghhhhhhgg.",
            ".gWWggggWWg.",
            ".gWWggggWWg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".g.gg.gg.g..",
        ], [
            "...hhhhhh...",
            "..hhhhhhhh..",
            ".gghhhhhhgg.",
            ".gWWggggWWg.",
            ".gWWggggWWg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            ".gggggggggg.",
            "..gg.gg.gg..",
        ]];
        this.drawSprite(ctx, F, P, Math.floor(this.enemyAnimationFrame / 12) % 2, 2);
    }

    drawGilaMonster(ctx) {
        const P = { o: '#E2725B', b: '#2A2A2A', e: '#FFB347' };
        const F = [[
            "..................",
            ".oo.oobboobboo....",
            "oo.oobboobboobbb..",
            ".o.oobboobboobbe..",
            "...oobboobboobbb..",
            "....o.o......o.o..",
        ], [
            "..................",
            ".oo.oobboobboo....",
            "oo.oobboobboobbb..",
            ".o.oobboobboobbe..",
            "...oobboobboobbb..",
            "...o.o......o.o...",
        ]];
        this.drawSprite(ctx, F, P, this.walkFrame);
        // Tongue flick
        if (this.enemyAnimationFrame % 70 < 10) {
            const s = this.width / 18;
            ctx.fillStyle = '#CC2255';
            ctx.fillRect(Math.round(this.x + 17 * s), Math.round(this.y + this.height * 0.5), Math.ceil(s * 1.5), Math.ceil(s * 0.8));
        }
    }

    drawVulture(ctx) {
        const P = { w: '#2B2121', b: '#3B2F2F', r: '#C25B4E', k: '#E8DCC8', e: '#111111' };
        const F = [[
            "ww..............ww",
            ".www..........www.",
            "..wwww......wwww..",
            "....wwbbbbbbww....",
            ".....bbbbbbbb.....",
            "......bbbbbbre....",
            ".......bbbb.rkk...",
            "..................",
        ], [
            "..................",
            "..................",
            ".....bbbbbbbb.....",
            "..wwwbbbbbbbwww...",
            ".www..bbbbbb.rwww.",
            "ww.....bbbb..re...",
            "........bb...rkk..",
            "..................",
        ]];
        this.drawSprite(ctx, F, P, this.flapFrame, 2);
    }

    drawJavelina(ctx) {
        const P = { d: '#4A4038', k: '#332B24', g: '#8A7B6C', s: '#5C5148', t: '#E8DCC8', e: '#FF3333' };
        const F = [[
            "..k.k..k.k..k.......",
            ".ddddddddddddd......",
            "ddddddddddddddkk....",
            "dddddgddddddddkk....",
            "dddddgddddddddekk...",
            "ddddddddddddddddss..",
            ".dddddddddddddddss..",
            ".ddddddddddddddt....",
            "..kk..kk..kk..kk....",
            "..kk..kk..kk..kk....",
        ], [
            "..k.k..k.k..k.......",
            ".ddddddddddddd......",
            "ddddddddddddddkk....",
            "dddddgddddddddkk....",
            "dddddgddddddddekk...",
            "ddddddddddddddddss..",
            ".dddddddddddddddss..",
            ".ddddddddddddddt....",
            ".kk....kk.kk....kk..",
            ".kk....kk.kk....kk..",
        ]];
        this.drawSprite(ctx, F, P, this.walkFrame);
    }

    drawBat(ctx) {
        const P = { w: '#2A2A36', b: '#1A1A22', r: '#FF2222' };
        const F = [[
            "w...bb...w",
            "ww.bbbb.ww",
            ".wwwbbwww.",
            "...rbbr...",
            "....bb....",
        ], [
            "....bb....",
            "...bbbb...",
            "wwwwbbwwww",
            ".w.rbbr.w.",
            "....bb....",
        ]];
        this.drawSprite(ctx, F, P, this.flapFrame, 2.5);
    }

    drawMummy(ctx) {
        const P = { w: '#C8BCA0', s: '#A89C80', G: '#66FF88' };
        const F = [[
            ".wwwwwwwwww..",
            ".wsswwwwssw..",
            ".wGGwwwwGGw..",
            ".wwwwsswwww..",
            "..wwwwwwww...",
            "wwwwwwwwwwwww",
            "w..wsswssw..w",
            "...wwwwwww...",
            "...wsswssw...",
            "...wwwwwww...",
            "...wsswssw...",
            "...wwwwwww...",
            "...ww...ww...",
            "...ww...ww...",
            "...ss...ss...",
        ], [
            ".wwwwwwwwww..",
            ".wsswwwwssw..",
            ".wGGwwwwGGw..",
            ".wwwwsswwww..",
            "..wwwwwwww...",
            "wwwwwwwwwwwww",
            "w..wsswssw..w",
            "...wwwwwww...",
            "...wsswssw...",
            "...wwwwwww...",
            "...wsswssw...",
            "...wwwwwww...",
            "..ww....ww...",
            "..ww....ww...",
            "..ss....ss...",
        ]];
        this.drawSprite(ctx, F, P, this.walkFrame);
    }

    takeDamage(amount) {
        this.health -= amount;
        this.game.sound.playSound('enemyHit');
        if (this.game.particles) {
            this.game.particles.floatText(this.centerX, this.y - 10, `-${amount}`, '#FFEE88');
            this.game.particles.burst(this.centerX, this.centerY, '#FFD27D', 6, 1.8);
        }
        if (this.health <= 0) {
            this.game.currentMap.removeEnemy(this);
            this.game.sound.playSound('enemyDie');
            if (this.game.particles) {
                this.game.particles.burst(this.centerX, this.centerY, '#FFFFFF', 14, 2.4);
            }
        }
    }
}
