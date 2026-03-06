import { Entity } from './Entity.js';
import { Arrow } from './Arrow.js';
import { GAME_STATE, TURRET_COOLDOWN, TURRET_ARROW_SPEED, TURRET_ARROW_DAMAGE, TURRET_AGGRO_RANGE } from '../constants.js';

export class InteractiveObject extends Entity {
    constructor(game, x, y, objData) {
        super(game, x, y, objData.width, objData.height, objData.type);
        this.objData = JSON.parse(JSON.stringify(objData));
        this.isInteractable = this.objData.interactive || this.objData.portal || this.objData.portalOnInteract || this.objData.triggersPuzzle;
        if (this.type === 'skull_turret') {
            this.attackCooldown = TURRET_COOLDOWN;
            this.currentAttackCooldown = Math.random() * this.attackCooldown;
            this.arrowSpeed = TURRET_ARROW_SPEED;
            this.arrowDamage = TURRET_ARROW_DAMAGE;
            this.aggroRange = TURRET_AGGRO_RANGE;
        }
    }

    updateTurret() {
        if (this.type !== 'skull_turret' || this.game.gameState !== GAME_STATE.PLAYING) return;
        this.currentAttackCooldown--;
        const player = this.game.player;
        const distX = player.centerX - this.centerX;
        const distY = player.centerY - this.centerY;
        const distanceToPlayer = Math.sqrt(distX * distX + distY * distY);
        if (distanceToPlayer < this.aggroRange && this.currentAttackCooldown <= 0) {
            this.game.currentMap.addProjectile(new Arrow(this.game, this.centerX, this.centerY, player.centerX, player.centerY, this.arrowSpeed, this.arrowDamage));
            this.game.sound.playSound('toinkArrow');
            this.currentAttackCooldown = this.attackCooldown;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.objData.color || '#888888';

        switch (this.type) {
            case 'cactus': this.drawCactus(ctx); break;
            case 'rock': this.drawRock(ctx); break;
            case 'chest': this.drawChest(ctx); break;
            case 'sign':
            case 'interactive_point':
            case 'petroglyph_panel':
            case 'ancient_symbol': this.drawSign(ctx); break;
            case 'water_source': this.drawWaterSource(ctx); break;
            case 'doorway': this.drawDoorway(ctx); break;
            case 'computer_terminal': this.drawComputerTerminal(ctx); break;
            case 'lab_bench': this.drawLabBench(ctx); break;
            case 'server_rack': this.drawServerRack(ctx); break;
            case 'secret_panel': this.drawSecretPanel(ctx); break;
            case 'pedestal': this.drawPedestal(ctx); break;
            case 'hohokam_canal': this.drawHohokamCanal(ctx); break;
            case 'platform_mound': this.drawPlatformMound(ctx); break;
            case 'sky_hole_wall': this.drawSkyHoleWall(ctx); break;
            case 'phoenix_statue': this.drawPhoenixStatue(ctx); break;
            case 'fire_pit': this.drawFirePit(ctx); break;
            case 'skull_turret': this.drawSkullTurret(ctx); break;
            case 'crater': this.drawCrater(ctx); break;
            case 'tumbleweed': this.drawTumbleweed(ctx); break;
            case 'dead_tree': this.drawDeadTree(ctx); break;
            case 'animal_bones': this.drawAnimalBones(ctx); break;
            case 'campfire_remains': this.drawCampfireRemains(ctx); break;
            case 'desert_flower': this.drawDesertFlower(ctx); break;
            case 'trail_marker': this.drawTrailMarker(ctx); break;
            case 'sand_dune': this.drawSandDune(ctx); break;
            default: ctx.fillRect(this.x, this.y, this.width, this.height); break;
        }
    }

    drawCactus(ctx) {
        const cactusGreen = '#2D7D40', darkCactusGreen = '#1E532D';
        ctx.fillStyle = cactusGreen;
        ctx.fillRect(this.x + this.width * 0.3, this.y, this.width * 0.4, this.height);
        ctx.fillRect(this.x, this.y + this.height * 0.2, this.width * 0.4, this.height * 0.2);
        ctx.fillRect(this.x, this.y + this.height * 0.2, this.width * 0.2, this.height * 0.5);
        ctx.fillRect(this.x + this.width * 0.6, this.y + this.height * 0.3, this.width * 0.4, this.height * 0.2);
        ctx.fillRect(this.x + this.width * 0.8, this.y + this.height * 0.3, this.width * 0.2, this.height * 0.5);
        ctx.fillStyle = darkCactusGreen;
        for (let i = 0; i < 3; i++) ctx.fillRect(this.x + this.width * 0.3 + i * 4, this.y, 2, this.height);
    }

    drawRock(ctx) {
        const rockColor = '#7D7064', darkRockColor = '#5F534B';
        ctx.fillStyle = rockColor;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.2, this.y + this.height);
        ctx.quadraticCurveTo(this.x, this.y + this.height * 0.5, this.x + this.width * 0.3, this.y + this.height * 0.2);
        ctx.quadraticCurveTo(this.x + this.width * 0.5, this.y, this.x + this.width * 0.8, this.y + this.height * 0.3);
        ctx.quadraticCurveTo(this.x + this.width, this.y + this.height * 0.7, this.x + this.width * 0.7, this.y + this.height);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = darkRockColor;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.3, this.y + this.height);
        ctx.quadraticCurveTo(this.x + this.width * 0.5, this.y + this.height * 0.7, this.x + this.width * 0.7, this.y + this.height);
        ctx.fill();
    }

    drawChest(ctx) {
        const chestBaseColor = this.objData.opened ? '#654321' : '#8B4513';
        const chestBandColor = '#DAA520';
        ctx.fillStyle = chestBaseColor;
        ctx.fillRect(this.x, this.y + 4, this.width, this.height - 4);
        ctx.fillStyle = '#5D3A1A';
        ctx.fillRect(this.x, this.y, this.width, 4);
        if (!this.objData.opened) {
            ctx.fillRect(this.x - 2, this.y, this.width + 4, 6);
        } else {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(-0.8);
            ctx.fillRect(0, 0, this.width, 6);
            ctx.restore();
        }
        ctx.fillStyle = chestBandColor;
        ctx.fillRect(this.x, this.y + this.height * 0.3, this.width, 4);
        ctx.fillRect(this.x, this.y + this.height * 0.6, this.width, 4);
        ctx.fillRect(this.x + this.width / 2 - 3, this.y + this.height / 2 - 3, 6, 6);
    }

    drawSign(ctx) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + this.width / 2 - 4, this.y + this.height / 2, 8, this.height / 2);
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(this.x, this.y, this.width, this.height / 2);
        if (this.type === 'petroglyph_panel') {
            ctx.fillStyle = '#4A2A0A';
            ctx.font = '6px "Press Start 2P"';
            ctx.fillText("PETRO", this.x + 2, this.y + 8);
            ctx.fillRect(this.x + 6, this.y + 12, 4, 8);
            ctx.beginPath();
            ctx.arc(this.x + 20, this.y + 10, 5, 0, Math.PI);
            ctx.stroke();
        }
        if (this.type === 'ancient_symbol') {
            ctx.fillStyle = '#E0E0E0';
            ctx.font = '10px "Press Start 2P"';
            ctx.fillText("?", this.x + this.width / 2 - 5, this.y + this.height / 2 + 5);
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 4, this.width / 4, 0, Math.PI * 1.5);
            ctx.stroke();
        }
    }

    drawWaterSource(ctx) {
        ctx.fillStyle = '#3377CC';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#66AADD';
        ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
        if (this.game.animationFrame % 60 < 10) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x + 8 + (this.game.animationFrame % 5) * 2, this.y + 8, 2, 2);
        }
    }

    drawDoorway(ctx) {
        ctx.fillStyle = '#555555';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#333333';
        ctx.fillRect(this.x + 4, this.y + 2, this.width - 8, this.height - 4);
        if (this.objData.text) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '8px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText(this.objData.text.substring(0, 10) + "...", this.x + this.width / 2, this.y - 5);
            ctx.textAlign = 'left';
        }
    }

    drawComputerTerminal(ctx) {
        ctx.fillStyle = '#222';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = (this.game.animationFrame % 40 < 20) ? '#2F5F2F' : '#3F7F3F';
        ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 8);
        ctx.fillStyle = '#444';
        ctx.fillRect(this.x + 2, this.y + this.height - 6, this.width - 4, 4);
    }

    drawLabBench(ctx) {
        ctx.fillStyle = '#777';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#555';
        ctx.fillRect(this.x, this.y, this.width, 4);
    }

    drawServerRack(ctx) {
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        for (let i = 0; i < 4; i++) {
            const blinkPhase = (this.game.animationFrame + i * 10) % 40;
            ctx.fillStyle = blinkPhase < 5 ? '#0F0' : (blinkPhase < 10 ? '#0A0' : '#222');
            ctx.fillRect(this.x + 4 + (i % 2 * 16), this.y + 4 + Math.floor(i / 2) * 12, 8, 4);
        }
    }

    drawSecretPanel(ctx) {
        if (this.objData.isNowPortal) {
            this.drawDoorway(ctx);
        } else {
            ctx.fillStyle = '#6B5B4B';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#5A4D41';
            ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
        }
    }

    drawPedestal(ctx) {
        ctx.fillStyle = '#8888AA';
        ctx.fillRect(this.x, this.y + this.height * 0.2, this.width, this.height * 0.8);
        ctx.fillStyle = '#777799';
        ctx.fillRect(this.x - 2, this.y + this.height * 0.1, this.width + 4, this.height * 0.2);
        if (!this.objData.opened && (!this.game.player || !this.game.player.hasItem('final_artifact'))) {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(this.x + this.width / 4, this.y - this.height / 4, this.width / 2, this.height / 2);
            if (this.game.animationFrame % 30 < 5) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(this.x + this.width / 2 - 1, this.y - this.height / 4 - 2, 2, 2);
            }
        }
    }

    drawHohokamCanal(ctx) {
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#658EA9';
        ctx.fillRect(this.x, this.y + this.height * 0.2, this.width, this.height * 0.6);
    }

    drawPlatformMound(ctx) {
        ctx.fillStyle = '#B08D57';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#9A7B4F';
        ctx.fillRect(this.x, this.y, this.width, 6);
    }

    drawSkyHoleWall(ctx) {
        ctx.fillStyle = '#A08C78';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#000020';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPhoenixStatue(ctx) {
        const mainColor = '#FF8C00', accentColor = '#FF4500';
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height * 0.2);
        ctx.lineTo(this.x, this.y + this.height * 0.5);
        ctx.lineTo(this.x + this.width * 0.1, this.y + this.height * 0.1);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height * 0.2);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.5);
        ctx.lineTo(this.x + this.width * 0.9, this.y + this.height * 0.1);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = accentColor;
        ctx.fillRect(this.x + this.width * 0.4, this.y + this.height * 0.1, this.width * 0.2, this.height * 0.8);
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height * 0.1, this.width * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFirePit(ctx) {
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x, this.y + this.height * 0.6, this.width, this.height * 0.4);
        const flameHeight = this.height * 0.7, flameWidth = this.width * 0.8;
        const flameX = this.x + this.width * 0.1, flameYBase = this.y + this.height * 0.1;
        const flicker = Math.sin(this.game.animationFrame * 0.3) * 5;
        ctx.fillStyle = (this.game.animationFrame % 20 < 10) ? '#FF4500' : '#FFA500';
        ctx.beginPath();
        ctx.moveTo(flameX, flameYBase + flameHeight);
        ctx.quadraticCurveTo(flameX + flameWidth / 2, flameYBase - flicker, flameX + flameWidth, flameYBase + flameHeight);
        ctx.quadraticCurveTo(flameX + flameWidth * 0.7, flameYBase + flameHeight * 0.5 + flicker / 2, flameX + flameWidth * 0.5, flameYBase + flameHeight);
        ctx.quadraticCurveTo(flameX + flameWidth * 0.3, flameYBase + flameHeight * 0.5 - flicker / 2, flameX, flameYBase + flameHeight);
        ctx.closePath(); ctx.fill();
    }

    drawSkullTurret(ctx) {
        const skullColor = '#E0E0E0', socketColor = '#000000';
        ctx.fillStyle = skullColor;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2.2, Math.PI * 0.1, Math.PI * 0.9, true);
        ctx.rect(this.x + this.width * 0.1, this.y + this.height / 2, this.width * 0.8, this.height * 0.4);
        ctx.fill();
        ctx.fillStyle = socketColor;
        ctx.beginPath();
        ctx.arc(this.x + this.width * 0.3, this.y + this.height * 0.4, this.width * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + this.width * 0.7, this.y + this.height * 0.4, this.width * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height * 0.5);
        ctx.lineTo(this.x + this.width * 0.4, this.y + this.height * 0.65);
        ctx.lineTo(this.x + this.width * 0.6, this.y + this.height * 0.65);
        ctx.closePath(); ctx.fill();
        ctx.fillRect(this.x + this.width * 0.2, this.y + this.height * 0.8, this.width * 0.6, 2);
    }

    drawCrater(ctx) {
        ctx.fillStyle = '#5B3A29';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#40281C';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 3, this.height / 4, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawTumbleweed(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const anim = this.game.animationFrame;
        const roll = Math.sin(anim * 0.04) * 2;
        const bounce = Math.abs(Math.sin(anim * 0.06)) * 3;
        ctx.save();
        ctx.translate(x + w / 2 + roll, y + h / 2 - bounce);
        ctx.rotate(anim * 0.02);
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r = w * 0.4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(
                Math.cos(angle + 0.3) * r * 0.6,
                Math.sin(angle + 0.3) * r * 0.6,
                Math.cos(angle) * r,
                Math.sin(angle) * r
            );
            ctx.stroke();
        }
        ctx.fillStyle = '#A08050';
        ctx.beginPath();
        ctx.arc(0, 0, w * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawDeadTree(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Trunk
        ctx.fillStyle = '#5C3D2E';
        ctx.fillRect(x + w * 0.35, y + h * 0.3, w * 0.3, h * 0.7);
        // Bark texture
        ctx.fillStyle = '#4A2F20';
        ctx.fillRect(x + w * 0.4, y + h * 0.4, w * 0.05, h * 0.3);
        ctx.fillRect(x + w * 0.55, y + h * 0.5, w * 0.05, h * 0.2);
        // Left branch
        ctx.fillStyle = '#6B4226';
        ctx.save();
        ctx.translate(x + w * 0.35, y + h * 0.35);
        ctx.rotate(-0.5);
        ctx.fillRect(0, 0, w * 0.45, 4);
        // Twig
        ctx.save();
        ctx.translate(w * 0.35, 0);
        ctx.rotate(-0.4);
        ctx.fillRect(0, 0, w * 0.2, 3);
        ctx.restore();
        ctx.restore();
        // Right branch
        ctx.save();
        ctx.translate(x + w * 0.65, y + h * 0.4);
        ctx.rotate(0.6);
        ctx.fillRect(0, 0, w * 0.5, 4);
        // Twig
        ctx.save();
        ctx.translate(w * 0.3, 0);
        ctx.rotate(0.5);
        ctx.fillRect(0, 0, w * 0.2, 3);
        ctx.restore();
        ctx.restore();
        // Top broken branch
        ctx.fillStyle = '#7A5438';
        ctx.save();
        ctx.translate(x + w * 0.45, y + h * 0.3);
        ctx.rotate(-0.2);
        ctx.fillRect(0, 0, 3, -h * 0.25);
        ctx.restore();
    }

    drawAnimalBones(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        ctx.strokeStyle = '#E8DCC8';
        ctx.fillStyle = '#E8DCC8';
        ctx.lineWidth = 2;
        // Spine
        ctx.beginPath();
        ctx.moveTo(x + w * 0.1, y + h * 0.5);
        ctx.lineTo(x + w * 0.7, y + h * 0.5);
        ctx.stroke();
        // Ribs
        for (let i = 0; i < 4; i++) {
            const rx = x + w * (0.2 + i * 0.12);
            ctx.beginPath();
            ctx.moveTo(rx, y + h * 0.5);
            ctx.quadraticCurveTo(rx + 4, y + h * 0.1, rx + 8, y + h * 0.3);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(rx, y + h * 0.5);
            ctx.quadraticCurveTo(rx + 4, y + h * 0.9, rx + 8, y + h * 0.7);
            ctx.stroke();
        }
        // Skull
        ctx.beginPath();
        ctx.ellipse(x + w * 0.82, y + h * 0.5, w * 0.12, h * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.fillRect(x + w * 0.85, y + h * 0.4, 2, 2);
        ctx.lineWidth = 1;
    }

    drawCampfireRemains(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const anim = this.game.animationFrame;
        // Ash circle
        ctx.fillStyle = '#3A3A3A';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.7, w * 0.45, h * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        // Charred logs
        ctx.fillStyle = '#2A1A0A';
        ctx.save();
        ctx.translate(x + w * 0.3, y + h * 0.6);
        ctx.rotate(0.3);
        ctx.fillRect(0, 0, w * 0.5, 5);
        ctx.restore();
        ctx.save();
        ctx.translate(x + w * 0.2, y + h * 0.5);
        ctx.rotate(-0.4);
        ctx.fillRect(0, 0, w * 0.55, 4);
        ctx.restore();
        // Ring of stones
        ctx.fillStyle = '#666';
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const sx = x + w / 2 + Math.cos(angle) * w * 0.38;
            const sy = y + h * 0.7 + Math.sin(angle) * h * 0.25;
            ctx.fillRect(sx - 3, sy - 2, 6, 4);
        }
        // Faint smoke wisps
        if (anim % 120 < 80) {
            ctx.fillStyle = 'rgba(150, 150, 150, 0.3)';
            const smokeY = y + h * 0.3 - (anim % 40) * 0.5;
            const drift = Math.sin(anim * 0.05) * 3;
            ctx.beginPath();
            ctx.arc(x + w / 2 + drift, smokeY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w / 2 - drift * 0.5, smokeY - 8, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawDesertFlower(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const anim = this.game.animationFrame;
        const sway = Math.sin(anim * 0.03) * 1.5;
        // Stem
        ctx.strokeStyle = '#3A6B2A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y + h);
        ctx.quadraticCurveTo(x + w / 2 + sway, y + h * 0.5, x + w / 2 + sway * 0.5, y + h * 0.3);
        ctx.stroke();
        // Leaves
        ctx.fillStyle = '#4A8B3A';
        ctx.beginPath();
        ctx.ellipse(x + w / 2 + sway * 0.3 - 4, y + h * 0.65, 4, 2, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + w / 2 + sway * 0.5 + 4, y + h * 0.55, 4, 2, 0.5, 0, Math.PI * 2);
        ctx.fill();
        // Petals
        const cx = x + w / 2 + sway * 0.5, cy = y + h * 0.25;
        const petalColors = ['#FF69B4', '#FF85C2', '#FF5BA0'];
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + anim * 0.005;
            ctx.fillStyle = petalColors[i % 3];
            ctx.beginPath();
            ctx.ellipse(
                cx + Math.cos(angle) * 4,
                cy + Math.sin(angle) * 4,
                3, 5, angle, 0, Math.PI * 2
            );
            ctx.fill();
        }
        // Center
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1;
    }

    drawTrailMarker(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Stacked stones (cairn)
        ctx.fillStyle = '#8B8178';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.9, w * 0.45, h * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#7A7068';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.72, w * 0.38, h * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#696058';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.55, w * 0.3, h * 0.09, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#585048';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.4, w * 0.22, h * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#484038';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.27, w * 0.15, h * 0.06, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSandDune(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Main dune shape
        ctx.fillStyle = '#D4B483';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.quadraticCurveTo(x + w * 0.25, y, x + w * 0.5, y + h * 0.3);
        ctx.quadraticCurveTo(x + w * 0.75, y + h * 0.1, x + w, y + h);
        ctx.closePath();
        ctx.fill();
        // Wind lines
        ctx.strokeStyle = '#C4A473';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.15, y + h * 0.6);
        ctx.quadraticCurveTo(x + w * 0.35, y + h * 0.45, x + w * 0.55, y + h * 0.55);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + w * 0.4, y + h * 0.75);
        ctx.quadraticCurveTo(x + w * 0.6, y + h * 0.6, x + w * 0.8, y + h * 0.7);
        ctx.stroke();
        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 230, 0.15)';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.1, y + h);
        ctx.quadraticCurveTo(x + w * 0.25, y + h * 0.1, x + w * 0.45, y + h * 0.4);
        ctx.lineTo(x + w * 0.3, y + h);
        ctx.closePath();
        ctx.fill();
    }

    onInteract(player) {
        if (this.objData.triggersPuzzle && (!this.game.player || !this.game.player.hasItem('final_artifact')) && !this.objData.opened) {
            this.game.startPuzzle(this.objData.puzzleDetails);
            return;
        }
        if (this.objData.portalOnInteract && this.objData.toMap && !this.objData.isNowPortal) {
            if (this.objData.interactionText) {
                this.game.ui.showDialog(this.objData.interactionText, (this.objData.name || this.type).toUpperCase());
                this.game.setGameState(GAME_STATE.DIALOG);
                this.game.pendingPortal = { mapName: this.objData.toMap, toX: this.objData.toX, toY: this.objData.toY };
                this.objData.isNowPortal = true;
                this.objData.text = "The passage is open.";
            } else {
                this.game.changeMap(this.objData.toMap, this.objData.toX, this.objData.toY);
            }
            return;
        }
        if (this.objData.portal && this.objData.toMap) {
            this.game.changeMap(this.objData.toMap, this.objData.toX, this.objData.toY);
            return;
        }
        if ((this.type === 'chest') && this.objData.contains && !this.objData.opened) {
            if (player.addItem(this.objData.contains)) {
                this.game.ui.showDialog(this.objData.text || `You found a ${this.game.itemTypes[this.objData.contains].name}!`, this.type.toUpperCase());
                this.objData.opened = true;
                if (this.objData.questComplete) player.completeQuest(this.objData.questComplete);
            } else {
                this.game.ui.showDialog("The container is empty or you already have this item.", this.type.toUpperCase());
            }
            this.game.setGameState(GAME_STATE.DIALOG);
            return;
        }
        if (this.objData.text && !this.objData.opened && this.type !== 'pedestal') {
            this.game.ui.showDialog(this.objData.text, (this.objData.name || this.type).toUpperCase());
            this.game.setGameState(GAME_STATE.DIALOG);
        }
        if (this.type === 'water_source') {
            if (player.hydration < player.maxHydration) {
                player.hydrate(player.maxHydration);
                this.game.ui.showDialog("You refill your canteen and take a long drink. You feel refreshed.", "Water Source");
                this.game.sound.playSound('drink');
            } else {
                this.game.ui.showDialog("Your canteen is already full.", "Water Source");
            }
            this.game.setGameState(GAME_STATE.DIALOG);
            return;
        }
        if (this.objData.questTrigger) {
            player.addQuest(this.objData.questTrigger);
            this.game.ui.showDialog(this.objData.questTrigger.startText || `New Quest: ${this.objData.questTrigger.description}`, "INFO");
            this.game.setGameState(GAME_STATE.DIALOG);
            delete this.objData.questTrigger;
            return;
        }
        if (this.objData.requiredItem && this.objData.questComplete) {
            if (player.hasItem(this.objData.requiredItem)) {
                player.completeQuest(this.objData.questComplete);
                if (this.objData.rewardText) this.game.ui.showDialog(this.objData.rewardText, "System");
                this.isInteractable = false;
            } else {
                this.game.ui.showDialog(this.objData.needItemText || "You seem to be missing something...", "System");
            }
            this.game.setGameState(GAME_STATE.DIALOG);
            return;
        }
    }
}
