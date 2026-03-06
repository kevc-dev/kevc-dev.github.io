import { Entity } from './Entity.js';
import { DEFAULT_AGGRO_RANGE, DEFAULT_ATTACK_RANGE, DEFAULT_ATTACK_COOLDOWN, ENEMY_KNOCKBACK } from '../constants.js';

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
        this.solid = enemyTypeData.solid || false;
        this.interactive = enemyTypeData.interactive || false;
        this.enemyAnimationFrame = Math.floor(Math.random() * 100);
    }

    update() {
        this.enemyAnimationFrame++;
        if (this.currentAttackCooldown > 0) this.currentAttackCooldown--;
        const player = this.game.player;
        if (!player) return;
        const distX = player.centerX - this.centerX;
        const distY = player.centerY - this.centerY;
        const distanceToPlayer = Math.sqrt(distX * distX + distY * distY);

        if (distanceToPlayer < this.aggroRange) {
            if (distanceToPlayer > this.attackRange) {
                this.x += (distX / distanceToPlayer) * this.speed;
                this.y += (distY / distanceToPlayer) * this.speed;
            } else if (this.currentAttackCooldown === 0) {
                player.takeDamage(this.damage, this.enemyType.name);
                this.currentAttackCooldown = this.attackCooldown;
                this.game.sound.playSound('enemyAttack');
                this.x -= (distX / distanceToPlayer) * ENEMY_KNOCKBACK;
                this.y -= (distY / distanceToPlayer) * ENEMY_KNOCKBACK;
            }
        }
    }

    draw(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const animFrame = this.enemyAnimationFrame;
        if (this.isEthereal) ctx.globalAlpha = 0.5 + Math.sin(animFrame * 0.1) * 0.2;

        switch (this.enemyType.name) {
            case 'Scorpion': this.drawScorpion(ctx, x, y, w, h, animFrame); break;
            case 'Snake': this.drawSnake(ctx, x, y, w, h, animFrame); break;
            case 'Coyote': this.drawCoyote(ctx, x, y, w, h, animFrame); break;
            case 'Giant Spider': this.drawGiantSpider(ctx, x, y, w, h, animFrame); break;
            case 'Restless Spirit': this.drawRestlessSpirit(ctx, x, y, w, h, animFrame); break;
            default:
                ctx.fillStyle = this.enemyType.color || '#FF0000';
                ctx.fillRect(x, y, w, h);
                break;
        }

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

        // Legs
        ctx.fillStyle = darkBodyColor;
        for (let i = 0; i < 4; i++) {
            const legY = y + h * (0.5 + i * 0.1);
            const legMove = Math.sin(animFrame * 0.3 + i) * 3;
            ctx.fillRect(x + w * 0.05, legY + legMove, w * 0.2, 2);
            ctx.fillRect(x + w * 0.75, legY - legMove, w * 0.2, 2);
        }
    }

    drawSnake(ctx, x, y, w, h, animFrame) {
        const bodyColor = '#556B2F', bellyColor = '#8FBC8F', eyeColor = '#FF0000', tongueColor = '#FF4500';
        const segments = 8, segmentWidth = w / segments, segmentHeight = h;
        const waveAmplitude = h * 0.3, waveSpeed = 0.15;

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
        const legMovement = Math.sin(animFrame * 0.2) * 3;
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
        const legMovement = Math.sin(animFrame * 0.25);
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

    takeDamage(amount) {
        this.health -= amount;
        this.game.sound.playSound('enemyHit');
        if (this.health <= 0) {
            this.game.currentMap.removeEnemy(this);
            this.game.sound.playSound('enemyDie');
        }
    }
}
