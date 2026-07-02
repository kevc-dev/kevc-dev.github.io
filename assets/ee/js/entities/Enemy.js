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
                // Erratic flyers (bats) jitter as they chase
                if (this.enemyType.erratic) {
                    vx += Math.sin(this.enemyAnimationFrame * 0.3) * 0.8;
                    vy += Math.cos(this.enemyAnimationFrame * 0.27) * 0.8;
                }
                // Chargers (javelina) rush faster in a burst
                if (this.enemyType.charges) {
                    const burst = 1 + Math.max(0, Math.sin(this.enemyAnimationFrame * 0.05)) * 0.8;
                    vx *= burst; vy *= burst;
                }
                // Ground enemies respect solid objects; flyers pass over
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
            // Vultures glide back onto their circling path — no teleporting
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
            // Ground enemies wander lazily around their spawn point
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

    draw(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const animFrame = this.enemyAnimationFrame;
        if (this.isEthereal) ctx.globalAlpha = 0.5 + Math.sin(animFrame * 0.1) * 0.2;

        // Flying enemies cast a small ground shadow
        if (this.isFlying) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(this.centerX, y + h + 12, w * 0.35, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(this.centerX, 0);
            ctx.scale(-1, 1);
            ctx.translate(-this.centerX, 0);
        }

        switch (this.enemyType.name) {
            case 'Scorpion': this.drawScorpion(ctx, x, y, w, h, animFrame); break;
            case 'Snake': this.drawSnake(ctx, x, y, w, h, animFrame); break;
            case 'Coyote': this.drawCoyote(ctx, x, y, w, h, animFrame); break;
            case 'Giant Spider': this.drawGiantSpider(ctx, x, y, w, h, animFrame); break;
            case 'Restless Spirit': this.drawRestlessSpirit(ctx, x, y, w, h, animFrame); break;
            case 'Gila Monster': this.drawGilaMonster(ctx, x, y, w, h, animFrame); break;
            case 'Vulture': this.drawVulture(ctx, x, y, w, h, animFrame); break;
            case 'Javelina': this.drawJavelina(ctx, x, y, w, h, animFrame); break;
            case 'Cave Bat': this.drawBat(ctx, x, y, w, h, animFrame); break;
            case 'Ancient Guardian': this.drawMummy(ctx, x, y, w, h, animFrame); break;
            default:
                ctx.fillStyle = this.enemyType.color || '#FF0000';
                ctx.fillRect(x, y, w, h);
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

    drawScorpion(ctx, x, y, w, h, animFrame) {
        const bodyColor = '#6A4F3A', darkBodyColor = '#4A3B2A', pincerColor = '#7A5F4A', stingerColor = '#3A2B1A';
        const tailBob = Math.sin(animFrame * 0.2) * 2;
        const pincerMove = Math.sin(animFrame * 0.15) * 2;

        // Tail
        ctx.fillStyle = bodyColor;
        const segX = x + w * 0.5, segY = y + h * 0.8;
        const segWidth = w * 0.2, segHeight = h * 0.25;
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(segX - segWidth / 2, segY - segHeight * (i + 1) + tailBob * (i * 0.3), segWidth, segHeight);
        }
        ctx.fillStyle = stingerColor;
        ctx.beginPath();
        ctx.moveTo(segX, segY - segHeight * 4 + tailBob);
        ctx.lineTo(segX + w * 0.1, segY - segHeight * 4.5 + tailBob - 2);
        ctx.lineTo(segX - w * 0.1, segY - segHeight * 4.5 + tailBob - 2);
        ctx.closePath(); ctx.fill();

        // Body
        ctx.fillStyle = bodyColor;
        ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.6);
        ctx.fillStyle = darkBodyColor;
        ctx.fillRect(x + w * 0.2, y + h * 0.3, w * 0.6, h * 0.2);

        // Pincers
        ctx.fillStyle = pincerColor;
        ctx.fillRect(x - w * 0.1 + pincerMove, y + h * 0.2, w * 0.4, h * 0.3);
        ctx.fillRect(x - w * 0.2 + pincerMove, y + h * 0.1, w * 0.2, h * 0.2);
        ctx.fillRect(x + w * 0.7 - pincerMove, y + h * 0.2, w * 0.4, h * 0.3);
        ctx.fillRect(x + w * 1.0 - pincerMove, y + h * 0.1, w * 0.2, h * 0.2);

        // Legs (only scuttle when moving)
        ctx.fillStyle = darkBodyColor;
        for (let i = 0; i < 4; i++) {
            const legY = y + h * (0.5 + i * 0.1);
            const legMove = this.isMoving ? Math.sin(animFrame * 0.3 + i) * 3 : 0;
            ctx.fillRect(x + w * 0.05, legY + legMove, w * 0.2, 2);
            ctx.fillRect(x + w * 0.75, legY - legMove, w * 0.2, 2);
        }
    }

    drawSnake(ctx, x, y, w, h, animFrame) {
        const bodyColor = '#556B2F', bellyColor = '#8FBC8F', eyeColor = '#FF0000', tongueColor = '#FF4500';
        const segments = 8, segmentWidth = w / segments, segmentHeight = h;
        // Coiled and nearly still at rest; full slither when moving
        const waveAmplitude = h * 0.3 * (this.isMoving ? 1 : 0.3), waveSpeed = this.isMoving ? 0.15 : 0.05;

        for (let i = 0; i < segments; i++) {
            const offsetY = Math.sin(animFrame * waveSpeed + i * 0.5) * waveAmplitude;
            const currentX = x + i * segmentWidth;
            ctx.fillStyle = bellyColor;
            ctx.fillRect(currentX, y + segmentHeight * 0.6 + offsetY, segmentWidth, segmentHeight * 0.4);
            ctx.fillStyle = bodyColor;
            ctx.fillRect(currentX, y + offsetY, segmentWidth, segmentHeight * 0.7);
        }

        const headX = x + (segments - 1) * segmentWidth;
        const headY = y + Math.sin(animFrame * waveSpeed + (segments - 1) * 0.5) * waveAmplitude;
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(headX + segmentWidth / 2, headY + segmentHeight / 2, segmentWidth * 0.7, segmentHeight * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = eyeColor;
        ctx.fillRect(headX + segmentWidth * 0.5, headY + segmentHeight * 0.2, 3, 3);
        ctx.fillRect(headX + segmentWidth * 0.8, headY + segmentHeight * 0.2, 3, 3);

        if (animFrame % 60 < 15) {
            ctx.fillStyle = tongueColor;
            ctx.beginPath();
            ctx.moveTo(headX + segmentWidth * 1.1, headY + segmentHeight * 0.5);
            ctx.lineTo(headX + segmentWidth * 1.4, headY + segmentHeight * 0.4);
            ctx.lineTo(headX + segmentWidth * 1.4, headY + segmentHeight * 0.6);
            ctx.closePath(); ctx.fill();
        }
    }

    drawCoyote(ctx, x, y, w, h, animFrame) {
        const bodyColor = '#B8860B', underbellyColor = '#D2B48C', darkFurColor = '#8B4513', eyeColor = '#000000';
        const legMovement = this.isMoving ? Math.sin(animFrame * 0.2) * 3 : 0;
        const tailWag = Math.sin(animFrame * 0.15) * 4;

        // Legs
        ctx.fillStyle = bodyColor;
        ctx.fillRect(x + w * 0.1, y + h * 0.6, w * 0.2, h * 0.4);
        ctx.fillRect(x + w * 0.7, y + h * 0.6, w * 0.2, h * 0.4);
        ctx.fillRect(x + w * 0.2 + legMovement, y + h * 0.55, w * 0.15, h * 0.45);
        ctx.fillRect(x + w * 0.6 - legMovement, y + h * 0.55, w * 0.15, h * 0.45);

        // Body
        ctx.fillStyle = bodyColor;
        ctx.fillRect(x + w * 0.1, y + h * 0.2, w * 0.8, h * 0.5);
        ctx.fillStyle = underbellyColor;
        ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.6, h * 0.2);

        // Head
        ctx.fillStyle = bodyColor;
        ctx.fillRect(x + w * 0.6, y, w * 0.4, h * 0.4);

        // Snout
        ctx.fillStyle = darkFurColor;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.9, y + h * 0.15);
        ctx.lineTo(x + w * 1.1, y + h * 0.25);
        ctx.lineTo(x + w * 0.9, y + h * 0.35);
        ctx.closePath(); ctx.fill();

        // Ears
        ctx.beginPath();
        ctx.moveTo(x + w * 0.65, y); ctx.lineTo(x + w * 0.75, y - h * 0.15); ctx.lineTo(x + w * 0.85, y);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w * 0.8, y); ctx.lineTo(x + w * 0.9, y - h * 0.1); ctx.lineTo(x + w, y);
        ctx.closePath(); ctx.fill();

        // Eyes
        ctx.fillStyle = eyeColor;
        ctx.fillRect(x + w * 0.75, y + h * 0.1, 3, 3);
        ctx.fillRect(x + w * 0.85, y + h * 0.1, 3, 3);

        // Tail
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.05, y + h * 0.3);
        ctx.quadraticCurveTo(x - w * 0.1 + tailWag, y + h * 0.5, x + w * 0.05, y + h * 0.7);
        ctx.quadraticCurveTo(x + w * 0.15 + tailWag, y + h * 0.5, x + w * 0.05, y + h * 0.3);
        ctx.fill();
        ctx.fillStyle = darkFurColor;
        ctx.fillRect(x - w * 0.15 + tailWag, y + h * 0.65, 6, 6);
    }

    drawGiantSpider(ctx, x, y, w, h, animFrame) {
        const bodyColor = '#3A3A3A', legColor = '#2A2A2A', eyeColor = '#FF0000', fangColor = '#E0E0E0';
        const legMovement = this.isMoving ? Math.sin(animFrame * 0.25) : 0;
        const bodyBob = Math.sin(animFrame * 0.1) * 2;

        // Abdomen
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.5, y + h * 0.65 + bodyBob, w * 0.4, h * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.ellipse(x + w * 0.5, y + h * 0.25 + bodyBob, w * 0.25, h * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.strokeStyle = legColor;
        const legLength = w * 0.5;
        const legAngles = [-0.8, -0.4, 0.4, 0.8];
        for (let i = 0; i < 4; i++) {
            const move = legMovement * (i % 2 === 0 ? 5 : -5);
            // Left legs
            ctx.beginPath();
            ctx.moveTo(x + w * 0.4, y + h * 0.25 + bodyBob);
            ctx.lineTo(x + w * 0.4 - legLength * 0.6 * Math.cos(legAngles[i]), y + h * 0.25 + bodyBob - legLength * 0.6 * Math.sin(legAngles[i]) + move / 2);
            ctx.lineTo(x + w * 0.4 - legLength * Math.cos(legAngles[i]) + move, y + h * 0.25 + bodyBob - legLength * Math.sin(legAngles[i]) + move);
            ctx.lineWidth = 4; ctx.stroke();
            // Right legs
            ctx.beginPath();
            ctx.moveTo(x + w * 0.6, y + h * 0.25 + bodyBob);
            ctx.lineTo(x + w * 0.6 + legLength * 0.6 * Math.cos(legAngles[i]), y + h * 0.25 + bodyBob - legLength * 0.6 * Math.sin(legAngles[i]) - move / 2);
            ctx.lineTo(x + w * 0.6 + legLength * Math.cos(legAngles[i]) - move, y + h * 0.25 + bodyBob - legLength * Math.sin(legAngles[i]) - move);
            ctx.lineWidth = 4; ctx.stroke();
        }
        ctx.lineWidth = 1;

        // Eyes
        ctx.fillStyle = eyeColor;
        ctx.fillRect(x + w * 0.45, y + h * 0.15 + bodyBob, 2, 2);
        ctx.fillRect(x + w * 0.55, y + h * 0.15 + bodyBob, 2, 2);
        ctx.fillRect(x + w * 0.4, y + h * 0.2 + bodyBob, 2, 2);
        ctx.fillRect(x + w * 0.6, y + h * 0.2 + bodyBob, 2, 2);

        // Fangs
        ctx.fillStyle = fangColor;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.48, y + h * 0.3 + bodyBob);
        ctx.lineTo(x + w * 0.45, y + h * 0.4 + bodyBob);
        ctx.lineTo(x + w * 0.5, y + h * 0.35 + bodyBob);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w * 0.52, y + h * 0.3 + bodyBob);
        ctx.lineTo(x + w * 0.55, y + h * 0.4 + bodyBob);
        ctx.lineTo(x + w * 0.5, y + h * 0.35 + bodyBob);
        ctx.closePath(); ctx.fill();
    }

    drawRestlessSpirit(ctx, x, y, w, h, animFrame) {
        const headColor = '#B0E0E6', bodyColor = '#ADD8E6', eyeColor = '#FFFFFF';

        // Wispy bottom
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.1, y + h);
        for (let i = 0; i <= 5; i++) {
            const peakX = x + w * (0.1 + i * 0.16);
            const peakY = y + h - (i % 2 === 0 ? h * 0.2 : h * 0.1) - Math.sin(animFrame * 0.15 + i) * 5;
            ctx.lineTo(peakX, peakY);
        }
        ctx.lineTo(x + w * 0.9, y + h);
        ctx.closePath(); ctx.fill();

        // Body
        ctx.beginPath();
        ctx.moveTo(x + w * 0.1, y + h * 0.9);
        ctx.quadraticCurveTo(x - w * 0.1, y + h * 0.5, x + w * 0.2, y + h * 0.2);
        ctx.quadraticCurveTo(x + w * 0.5, y - h * 0.1, x + w * 0.8, y + h * 0.2);
        ctx.quadraticCurveTo(x + w * 1.1, y + h * 0.5, x + w * 0.9, y + h * 0.9);
        ctx.closePath(); ctx.fill();

        // Head
        ctx.fillStyle = headColor;
        ctx.beginPath();
        ctx.arc(x + w * 0.5, y + h * 0.3, w * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(x + w * 0.4, y + h * 0.28, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + w * 0.6, y + h * 0.28, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawGilaMonster(ctx, x, y, w, h, animFrame) {
        const bodyColor = '#E2725B', bandColor = '#2A2A2A', eyeColor = '#000000';
        const legMove = this.isMoving ? Math.sin(animFrame * 0.2) * 2 : 0;
        const tailSway = Math.sin(animFrame * 0.1) * 3;

        // Fat tail
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.12, y + h * 0.55 + tailSway * 0.3, w * 0.18, h * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.beginPath();
        ctx.ellipse(x + w * 0.5, y + h * 0.5, w * 0.32, h * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Beaded black bands
        ctx.fillStyle = bandColor;
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(x + w * (0.32 + i * 0.14), y + h * 0.2, w * 0.06, h * 0.6);
        }
        ctx.fillRect(x + w * 0.05, y + h * 0.45 + tailSway * 0.3, w * 0.05, h * 0.25);

        // Head
        ctx.fillStyle = bandColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.88, y + h * 0.45, w * 0.14, h * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#FFB347';
        ctx.fillRect(x + w * 0.88, y + h * 0.32, 3, 3);

        // Stubby legs
        ctx.fillStyle = bandColor;
        ctx.fillRect(x + w * 0.3, y + h * 0.75 + legMove, 4, h * 0.25);
        ctx.fillRect(x + w * 0.65, y + h * 0.75 - legMove, 4, h * 0.25);

        // Tongue flick
        if (animFrame % 70 < 12) {
            ctx.strokeStyle = '#CC2255';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + w * 1.0, y + h * 0.45);
            ctx.lineTo(x + w * 1.12, y + h * 0.4);
            ctx.stroke();
        }
    }

    drawVulture(ctx, x, y, w, h, animFrame) {
        const bodyColor = '#3B2F2F', wingColor = '#2B2121', headColor = '#C25B4E';
        const flap = Math.sin(animFrame * 0.2);

        // Wings
        ctx.fillStyle = wingColor;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y + h * 0.5);
        ctx.quadraticCurveTo(x + w * 0.15, y + h * 0.5 - flap * h * 0.6, x - w * 0.1, y + h * 0.35 - flap * h * 0.5);
        ctx.lineTo(x + w * 0.15, y + h * 0.62);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y + h * 0.5);
        ctx.quadraticCurveTo(x + w * 0.85, y + h * 0.5 - flap * h * 0.6, x + w * 1.1, y + h * 0.35 - flap * h * 0.5);
        ctx.lineTo(x + w * 0.85, y + h * 0.62);
        ctx.closePath(); ctx.fill();

        // Body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.5, y + h * 0.55, w * 0.22, h * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bald red head + beak
        ctx.fillStyle = headColor;
        ctx.beginPath();
        ctx.arc(x + w * 0.62, y + h * 0.3, w * 0.09, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#E8DCC8';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.7, y + h * 0.3);
        ctx.lineTo(x + w * 0.8, y + h * 0.35);
        ctx.lineTo(x + w * 0.7, y + h * 0.38);
        ctx.closePath(); ctx.fill();

        // Eye
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w * 0.63, y + h * 0.27, 2, 2);
    }

    drawJavelina(ctx, x, y, w, h, animFrame) {
        const furColor = '#4A4038', darkFur = '#332B24', snoutColor = '#5C5148', tuskColor = '#E8DCC8';
        const trot = this.isMoving ? Math.sin(animFrame * 0.25) * 3 : 0;

        // Legs
        ctx.fillStyle = darkFur;
        ctx.fillRect(x + w * 0.15, y + h * 0.65 + trot * 0.4, 5, h * 0.35);
        ctx.fillRect(x + w * 0.3, y + h * 0.65 - trot * 0.4, 5, h * 0.35);
        ctx.fillRect(x + w * 0.6, y + h * 0.65 - trot * 0.4, 5, h * 0.35);
        ctx.fillRect(x + w * 0.75, y + h * 0.65 + trot * 0.4, 5, h * 0.35);

        // Body (bristly hump)
        ctx.fillStyle = furColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.45, y + h * 0.45, w * 0.4, h * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
        // Bristles on back
        ctx.strokeStyle = darkFur;
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const bx = x + w * (0.2 + i * 0.12);
            ctx.beginPath();
            ctx.moveTo(bx, y + h * 0.2);
            ctx.lineTo(bx - 2, y + h * 0.08 + Math.sin(animFrame * 0.1 + i) * 1.5);
            ctx.stroke();
        }
        ctx.lineWidth = 1;

        // Pale collar band
        ctx.fillStyle = '#8A7B6C';
        ctx.fillRect(x + w * 0.6, y + h * 0.25, w * 0.08, h * 0.4);

        // Head + snout
        ctx.fillStyle = furColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.82, y + h * 0.42, w * 0.16, h * 0.24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = snoutColor;
        ctx.fillRect(x + w * 0.94, y + h * 0.42, w * 0.12, h * 0.16);

        // Tusks
        ctx.fillStyle = tuskColor;
        ctx.fillRect(x + w * 0.95, y + h * 0.56, 2, 5);

        // Eye + ear
        ctx.fillStyle = '#FF3333';
        ctx.fillRect(x + w * 0.84, y + h * 0.3, 3, 3);
        ctx.fillStyle = darkFur;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.76, y + h * 0.2);
        ctx.lineTo(x + w * 0.8, y + h * 0.05);
        ctx.lineTo(x + w * 0.86, y + h * 0.2);
        ctx.closePath(); ctx.fill();
    }

    drawBat(ctx, x, y, w, h, animFrame) {
        const bodyColor = '#1A1A22', wingColor = '#2A2A36';
        const flap = Math.sin(animFrame * 0.5);

        // Wings (fast flapping)
        ctx.fillStyle = wingColor;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y + h * 0.5);
        ctx.lineTo(x - w * 0.05, y + h * 0.4 - flap * h * 0.5);
        ctx.lineTo(x + w * 0.15, y + h * 0.7 - flap * h * 0.2);
        ctx.lineTo(x + w * 0.35, y + h * 0.6);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y + h * 0.5);
        ctx.lineTo(x + w * 1.05, y + h * 0.4 - flap * h * 0.5);
        ctx.lineTo(x + w * 0.85, y + h * 0.7 - flap * h * 0.2);
        ctx.lineTo(x + w * 0.65, y + h * 0.6);
        ctx.closePath(); ctx.fill();

        // Body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(x + w * 0.5, y + h * 0.55, w * 0.16, h * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.beginPath();
        ctx.moveTo(x + w * 0.42, y + h * 0.3); ctx.lineTo(x + w * 0.4, y + h * 0.05); ctx.lineTo(x + w * 0.5, y + h * 0.3);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w * 0.52, y + h * 0.3); ctx.lineTo(x + w * 0.6, y + h * 0.05); ctx.lineTo(x + w * 0.58, y + h * 0.3);
        ctx.closePath(); ctx.fill();

        // Red eyes
        ctx.fillStyle = '#FF2222';
        ctx.fillRect(x + w * 0.44, y + h * 0.42, 2, 2);
        ctx.fillRect(x + w * 0.54, y + h * 0.42, 2, 2);
    }

    drawMummy(ctx, x, y, w, h, animFrame) {
        const wrapColor = '#C8BCA0', shadowWrap = '#A89C80', eyeColor = '#66FF88';
        const sway = Math.sin(animFrame * 0.06) * 1.5;

        ctx.save();
        ctx.translate(sway, 0);

        // Body
        ctx.fillStyle = wrapColor;
        ctx.fillRect(x + w * 0.15, y + h * 0.28, w * 0.7, h * 0.72);

        // Head
        ctx.fillRect(x + w * 0.2, y, w * 0.6, h * 0.28);

        // Bandage lines
        ctx.strokeStyle = shadowWrap;
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            const ly = y + h * (0.08 + i * 0.15);
            ctx.beginPath();
            ctx.moveTo(x + w * 0.15, ly);
            ctx.lineTo(x + w * 0.85, ly + 3);
            ctx.stroke();
        }
        ctx.lineWidth = 1;

        // Loose bandage trailing
        ctx.strokeStyle = wrapColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.2, y + h * 0.5);
        ctx.quadraticCurveTo(x - w * 0.15 - sway * 2, y + h * 0.65, x + w * 0.05, y + h * 0.9);
        ctx.stroke();
        ctx.lineWidth = 1;

        // Glowing eyes
        const glow = 0.6 + Math.sin(animFrame * 0.15) * 0.4;
        ctx.globalAlpha = glow;
        ctx.fillStyle = eyeColor;
        ctx.fillRect(x + w * 0.32, y + h * 0.12, 4, 3);
        ctx.fillRect(x + w * 0.58, y + h * 0.12, 4, 3);
        ctx.globalAlpha = 1;

        // Outstretched arms
        ctx.fillStyle = wrapColor;
        ctx.fillRect(x + w * 0.75, y + h * 0.35, w * 0.35, 5);
        ctx.fillRect(x - w * 0.1, y + h * 0.4, w * 0.25, 5);

        ctx.restore();
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
