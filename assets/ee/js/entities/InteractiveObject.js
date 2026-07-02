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
            case 'fruit_cactus': this.drawFruitCactus(ctx); break;
            case 'rock': this.drawRock(ctx); break;
            case 'chest': this.drawChest(ctx); break;
            case 'sign':
            case 'interactive_point': this.drawSign(ctx); break;
            case 'petroglyph_panel': this.drawPetroglyphPanel(ctx); break;
            case 'ancient_symbol': this.drawAncientSymbol(ctx); break;
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
            case 'old_building': this.drawOldBuilding(ctx); break;
            case 'saloon': this.drawSaloon(ctx); break;
            case 'wagon': this.drawWagon(ctx); break;
            case 'barrel': this.drawBarrel(ctx); break;
            case 'well': this.drawWell(ctx); break;
            case 'mine_portal': this.drawMinePortal(ctx); break;
            case 'rail_track': this.drawRailTrack(ctx); break;
            case 'mine_cart': this.drawMineCart(ctx); break;
            case 'crystal': this.drawCrystal(ctx); break;
            case 'stalagmite': this.drawStalagmite(ctx); break;
            case 'sparky_statue': this.drawSparkyStatue(ctx); break;
            case 'asu_banner': this.drawAsuBanner(ctx); break;
            case 'trophy_case': this.drawTrophyCase(ctx); break;
            case 'bulletin_board': this.drawBulletinBoard(ctx); break;
            case 'potted_palm': this.drawPottedPalm(ctx); break;
            case 'hole_in_the_rock': this.drawHoleInTheRock(ctx); break;
            case 'aligned_doorway': this.drawAlignedDoorway(ctx); break;
            case 'horizon_marker': this.drawHorizonMarker(ctx); break;
            case 'survey_flag': this.drawSurveyFlag(ctx); break;
            case 'looter_pit': this.drawLooterPit(ctx); break;
            default: ctx.fillRect(this.x, this.y, this.width, this.height); break;
        }
    }

    drawCactus(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const green = '#2D7D40', dark = '#1E532D', light = '#3E9A52';
        const variant = (Math.round(x) * 7 + Math.round(y) * 13) % 3; // 0: two arms+blooms, 1: one arm+wren, 2: young
        const trunkX = x + w * 0.32, trunkW = w * 0.36;
        const trunkTop = variant === 2 ? y + h * 0.25 : y;

        // Trunk with rounded crown
        ctx.fillStyle = green;
        ctx.fillRect(trunkX, trunkTop + trunkW / 2, trunkW, y + h - trunkTop - trunkW / 2);
        ctx.beginPath();
        ctx.arc(trunkX + trunkW / 2, trunkTop + trunkW / 2, trunkW / 2, Math.PI, 0);
        ctx.fill();

        // Arms: out then up, rounded tips
        const arm = (ax, ay, dir, len) => {
            ctx.fillStyle = green;
            ctx.fillRect(dir > 0 ? ax : ax - w * 0.22, ay, w * 0.22, 7);          // elbow out
            const upX = dir > 0 ? ax + w * 0.22 - 7 : ax - w * 0.22;
            ctx.fillRect(upX, ay - len, 7, len + 7);                               // arm up
            ctx.beginPath();
            ctx.arc(upX + 3.5, ay - len, 3.5, Math.PI, 0);
            ctx.fill();
            ctx.fillStyle = dark;                                                  // arm rib
            ctx.fillRect(upX + 2, ay - len, 1, len);
        };
        if (variant === 0) {
            arm(trunkX, y + h * 0.32, -1, h * 0.24);
            arm(trunkX + trunkW, y + h * 0.42, 1, h * 0.3);
        } else if (variant === 1) {
            arm(trunkX + trunkW, y + h * 0.35, 1, h * 0.28);
        }

        // Ribs and sun-side highlight
        ctx.fillStyle = dark;
        for (let i = 0; i < 3; i++) ctx.fillRect(trunkX + 3 + i * (trunkW / 3), trunkTop + trunkW / 2, 1.5, y + h - trunkTop - trunkW / 2);
        ctx.fillStyle = light;
        ctx.fillRect(trunkX + 1, trunkTop + trunkW / 2, 2, y + h - trunkTop - trunkW / 2);

        // June crown blossoms (saguaros bloom white in May-June)
        if (variant === 0) {
            const bx = trunkX + trunkW / 2, by = trunkTop + 2;
            ctx.fillStyle = '#F5F0DC';
            ctx.fillRect(bx - 6, by, 4, 4);
            ctx.fillRect(bx + 3, by - 1, 4, 4);
            ctx.fillRect(bx - 1, by - 3, 4, 4);
            ctx.fillStyle = '#E8C84A';
            ctx.fillRect(bx - 5, by + 1, 2, 2);
            ctx.fillRect(bx + 4, by, 2, 2);
            ctx.fillRect(bx, by - 2, 2, 2);
        }

        // Cactus wren perched on variant 1, bobbing occasionally
        if (variant === 1) {
            const bob = (this.game.animationFrame % 90 < 12) ? -2 : 0;
            const wx = trunkX + trunkW / 2 - 3, wy = trunkTop - 5 + bob;
            ctx.fillStyle = '#8A6B4F';
            ctx.fillRect(wx, wy, 7, 4);            // body
            ctx.fillRect(wx + 5, wy - 3, 4, 4);    // head
            ctx.fillStyle = '#5C4433';
            ctx.fillRect(wx - 3, wy, 4, 2);        // tail
            ctx.fillStyle = '#2A1A0A';
            ctx.fillRect(wx + 8, wy - 2, 1, 1);    // eye
            ctx.fillRect(wx + 9, wy - 1, 2, 1);    // beak
        }
    }

    drawFruitCactus(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const green = '#3E7C4A', dark = '#2A5A34', fruit = '#C42A5A';
        const px = w / 8; // coarse pixel unit
        const rect = (cx, cy, cw, ch, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(Math.round(x + cx * px), Math.round(y + cy * px), Math.ceil(cw * px), Math.ceil(ch * px));
        };
        // Three prickly pear paddles, chunky pixel style
        rect(2.5, 3.0, 3.0, 4.5, green);   // center paddle
        rect(0.5, 4.0, 2.5, 3.0, green);   // left paddle
        rect(5.0, 4.2, 2.5, 2.8, green);   // right paddle
        rect(3.0, 3.4, 0.6, 3.6, dark);    // center rib
        rect(1.2, 4.4, 0.5, 2.2, dark);    // left rib
        rect(5.8, 4.6, 0.5, 1.8, dark);    // right rib
        // Spine dots
        ctx.fillStyle = '#D8E8C8';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(Math.round(x + (1 + i * 1.4) * px), Math.round(y + (3.6 + (i % 2)) * px), 2, 2);
        }
        // Ripe magenta fruits along the paddle tops (gone once picked)
        if (!this.objData.opened) {
            rect(2.2, 2.2, 1.0, 1.0, fruit);
            rect(3.8, 2.0, 1.0, 1.0, fruit);
            rect(5.4, 3.4, 1.0, 1.0, fruit);
            rect(0.8, 3.2, 1.0, 1.0, fruit);
            // Sparkle hint
            if (this.game.animationFrame % 80 < 10) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(Math.round(x + 4 * px), Math.round(y + 1.4 * px), 2, 2);
            }
        }
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
        // Sparkle hint on unopened chests
        if (!this.objData.opened) {
            const t = this.game.animationFrame % 90;
            if (t < 12) {
                ctx.fillStyle = '#FFFFFF';
                const sx = this.x + 4 + (t % 3) * 10;
                const sy = this.y - 4 + (t % 2) * 4;
                ctx.fillRect(sx, sy, 2, 2);
                ctx.fillRect(sx - 2, sy + 2, 2, 2);
            }
        }
    }

    drawSign(ctx) {
        // Post
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + this.width / 2 - 4, this.y + this.height / 2, 8, this.height / 2);
        ctx.fillStyle = '#6B3410';
        ctx.fillRect(this.x + this.width / 2 + 2, this.y + this.height / 2, 2, this.height / 2);
        // Board with grain lines
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(this.x, this.y, this.width, this.height / 2);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(this.x, this.y, this.width, 2);
        ctx.fillRect(this.x, this.y + this.height / 2 - 2, this.width, 2);
        ctx.fillRect(this.x + 4, this.y + 5, this.width - 8, 1.5);
        ctx.fillRect(this.x + 4, this.y + 9, this.width - 12, 1.5);
    }

    drawWaterSource(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const t = this.game.animationFrame;
        const cx = x + w / 2, cy = y + h / 2;
        // Muddy bank
        ctx.fillStyle = '#8A7355';
        ctx.beginPath();
        ctx.ellipse(cx, cy, w * 0.62, h * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Water
        ctx.fillStyle = '#2A5A8A';
        ctx.beginPath();
        ctx.ellipse(cx, cy, w * 0.5, h * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3B77AC';
        ctx.beginPath();
        ctx.ellipse(cx, cy, w * 0.36, h * 0.26, 0, 0, Math.PI * 2);
        ctx.fill();
        // Expanding ripple rings
        for (let r = 0; r < 2; r++) {
            const phase = ((t + r * 45) % 90) / 90;
            ctx.strokeStyle = `rgba(200, 230, 255, ${0.5 * (1 - phase)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(cx, cy, w * 0.1 + phase * w * 0.36, (h * 0.07 + phase * h * 0.26), 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        // Sun glints
        if (t % 50 < 12) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(cx - 6 + (t % 3) * 4, cy - 3, 2, 2);
            ctx.fillRect(cx + 4, cy + 4, 2, 2);
        }
        // Reeds on the bank
        ctx.strokeStyle = '#3A6B2A';
        ctx.lineWidth = 1.5;
        const sway = Math.sin(t * 0.04) * 1.5;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.85, cy + h * 0.3);
        ctx.lineTo(x + w * 0.85 + sway, cy - h * 0.15);
        ctx.moveTo(x + w * 0.92, cy + h * 0.28);
        ctx.lineTo(x + w * 0.94 + sway, cy - h * 0.05);
        ctx.stroke();
        ctx.lineWidth = 1;
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
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const anim = this.game.animationFrame;
        // Chunky warm glow (square, like a low-color light radius)
        const glow = 0.1 + Math.sin(anim * 0.2) * 0.04;
        ctx.fillStyle = `rgba(255, 140, 40, ${glow})`;
        ctx.fillRect(x - w * 0.5, y - h * 1.1, w * 2, h * 2.4);
        ctx.fillStyle = `rgba(255, 180, 80, ${glow * 0.7})`;
        ctx.fillRect(x - w * 0.2, y - h * 0.6, w * 1.4, h * 1.7);

        const P = { y: '#FFE066', o: '#FF9A2A', r: '#E24A1A', L: '#5C3D2E', D: '#3A2A1E', s: '#7D7064', d: '#5F534B' };
        const F = [[
            ".....y......",
            "....yy......",
            "....oyy.y...",
            "...yooy.o...",
            "...ooooo....",
            "..yoooooo...",
            "..ooorooo...",
            ".rroorroor..",
            ".LLLDLLDLL..",
            "sdLLLLLLLds.",
        ], [
            "......y.....",
            "...y.yy.....",
            "...o.oyy....",
            "....yooy.o..",
            "....ooooo...",
            "...ooooooy..",
            "...ooroooo..",
            "..roorroorr.",
            ".LLLDLLDLL..",
            "sdLLLLLLLds.",
        ]];
        const frame = Math.floor(anim / 6) % 2;
        const rows = F[frame];
        const scale = w / rows[0].length;
        this.drawPixels(ctx, rows, P, x, y + h - rows.length * scale, scale);

        // Rising embers
        if (anim % 14 === 0 && this.game.particles) {
            this.game.particles.emit(x + w * 0.3 + Math.random() * w * 0.4, y + h * 0.2, {
                vx: (Math.random() - 0.5) * 0.4,
                vy: -0.6 - Math.random() * 0.4,
                life: 25,
                size: 2,
                color: Math.random() < 0.5 ? '#FFB347' : '#FF6A2A',
            });
        }
    }

    drawSkullTurret(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const P = { w: '#E8E4D8', c: '#C8C4B0', k: '#141014', t: '#B8B4A0', p: '#5F534B' };
        const rows = [
            "....wwwwwwww....",
            "..wwwwwwwwwwww..",
            ".wwwwwwwwwwwwww.",
            ".wwcwwwwwwwwcww.",
            ".wkkkwwwwwwkkkw.",
            ".wkkkkwwwwkkkkw.",
            ".wwkkwwwwwwkkww.",
            ".wwwwwwkkwwwwww.",
            "..wwwwkkkkwwww..",
            "..wwwwwwwwwwww..",
            "...wtwtwtwtwt...",
            "...wtwtwtwtwt...",
            "....wwwwwwww....",
            "......pp.pp.....",
            "......pppp......",
            "......pppp......",
        ];
        const scale = w / 16;
        this.drawPixels(ctx, rows, P, x, y + h - rows.length * scale, scale);
        // Eyes ignite red when the guardian sees you
        const player = this.game.player;
        if (player) {
            const dist = Math.hypot(player.centerX - this.centerX, player.centerY - this.centerY);
            const seen = dist < (this.aggroRange || 200);
            const pulse = seen ? (0.7 + Math.sin(this.game.animationFrame * 0.25) * 0.3) : 0.25;
            ctx.fillStyle = `rgba(255, 40, 30, ${pulse})`;
            ctx.fillRect(Math.round(x + 3 * scale), Math.round(y + h - 11 * scale), Math.ceil(scale * 2), Math.ceil(scale * 2));
            ctx.fillRect(Math.round(x + 11 * scale), Math.round(y + h - 11 * scale), Math.ceil(scale * 2), Math.ceil(scale * 2));
        }
    }

    drawPetroglyphPanel(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Basalt slab with desert varnish, pecked glyphs in pale stone
        const P = { B: '#3A3546', D: '#2E2A38', g: '#D8C8A8' };
        const rows = [
            "....BBBBBBBB....",
            "..BBBBBBBBBBBB..",
            ".BBBDBBBBBBDBBB.",
            ".BBB.g..BBBBBBB.",
            "BBB.g.g.BBg.gBBB",
            "BBB.ggg.BB.g.BBB",
            "BBBB..g.Bg.g.BBB",
            "BBBDggg.B.....BB",
            "BBBB....BBggBBB.",
            ".BBBg.gBBg..gBB.",
            ".BBB.g.BBBggBBB.",
            ".BBBBgBBBDBBBB..",
            "..BBBgBBBBBBB...",
            "..BBg.gBBBBBB...",
            "...BBBBBBBBB....",
            "....BBBBBBB.....",
        ];
        const scale = w / 16;
        this.drawPixels(ctx, rows, P, x, y + h - rows.length * scale, scale);
    }

    drawAncientSymbol(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const variant = (Math.round(x) + Math.round(y)) % 2;
        const P = { B: '#3A3546', D: '#2E2A38', g: '#D8C8A8' };
        // Variant 0: spiral glyph. Variant 1: figure with a crook, facing the sunrise.
        const rows = variant === 0 ? [
            "...BBBBBBBBBB...",
            "..BBBBBBBBBBBB..",
            ".BBBBggggggBBBB.",
            ".BBBg.....gBBDB.",
            "BBBg..ggg..gBBBB",
            "BBBg.g...g.gBBBB",
            "BBBg.g.gg..gBBBB",
            "BBBg.g.....gBBDB",
            "BBBg..ggggg.BBBB",
            ".BBBg......BBBB.",
            ".BBDBggggggBBBB.",
            "..BBBBBBBBBBBB..",
            "...BBBBBBBBBB...",
        ] : [
            "...BBBBBBBBBB...",
            "..BBBBBBBBBBBB..",
            ".BBBBB.g.BBBBBB.",
            ".BBBB.ggg.BBgBB.",
            "BBBBBB.g.BBBgBBB",
            "BBBg.gggggg.gBBB",
            "BBBBBB.g.BBggBBB",
            "BBBDBB.g.BBBBBDB",
            "BBBBB.g.g.BBBBBB",
            ".BBBB.g.g.BBBBB.",
            ".BBBBg.B.gBBBBB.",
            "..BBBBBBBBBBBB..",
            "...BBBBBBBBBB...",
        ];
        const scale = w / 16;
        this.drawPixels(ctx, rows, P, x, y + h - rows.length * scale, scale);
        // Faint shimmer, like low sun raking across the varnish
        if (this.game.animationFrame % 100 < 8) {
            ctx.fillStyle = 'rgba(255, 230, 180, 0.5)';
            ctx.fillRect(Math.round(x + w * 0.45), Math.round(y + h * 0.2), 2, 2);
        }
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

    drawOldBuilding(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Facade
        ctx.fillStyle = '#8A7358';
        ctx.fillRect(x, y + h * 0.2, w, h * 0.8);
        // Plank lines
        ctx.strokeStyle = '#6E5A44';
        for (let i = 1; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(x, y + h * 0.2 + i * (h * 0.8 / 5));
            ctx.lineTo(x + w, y + h * 0.2 + i * (h * 0.8 / 5));
            ctx.stroke();
        }
        // False front / roofline
        ctx.fillStyle = '#6E5A44';
        ctx.fillRect(x - 3, y + h * 0.12, w + 6, h * 0.12);
        ctx.fillStyle = '#7A6650';
        ctx.fillRect(x + w * 0.1, y, w * 0.8, h * 0.14);
        // Boarded window
        ctx.fillStyle = '#3A2F22';
        ctx.fillRect(x + w * 0.12, y + h * 0.35, w * 0.24, h * 0.28);
        ctx.strokeStyle = '#9A8265';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.12, y + h * 0.38);
        ctx.lineTo(x + w * 0.36, y + h * 0.58);
        ctx.moveTo(x + w * 0.36, y + h * 0.38);
        ctx.lineTo(x + w * 0.12, y + h * 0.58);
        ctx.stroke();
        ctx.lineWidth = 1;
        // Dark doorway
        ctx.fillStyle = '#241C12';
        ctx.fillRect(x + w * 0.58, y + h * 0.42, w * 0.24, h * 0.58);
    }

    drawSaloon(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Facade
        ctx.fillStyle = '#9A8265';
        ctx.fillRect(x, y + h * 0.22, w, h * 0.78);
        ctx.strokeStyle = '#7E6A50';
        for (let i = 1; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(x, y + h * 0.22 + i * (h * 0.78 / 6));
            ctx.lineTo(x + w, y + h * 0.22 + i * (h * 0.78 / 6));
            ctx.stroke();
        }
        // Tall false front with sign
        ctx.fillStyle = '#7E6A50';
        ctx.fillRect(x - 4, y, w + 8, h * 0.24);
        ctx.fillStyle = '#4A2A0A';
        ctx.fillRect(x + w * 0.15, y + h * 0.04, w * 0.7, h * 0.14);
        ctx.fillStyle = '#FFD27D';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('SALOON', x + w / 2, y + h * 0.145);
        ctx.textAlign = 'left';
        // Porch roof
        ctx.fillStyle = '#5E4A34';
        ctx.fillRect(x + w * 0.05, y + h * 0.42, w * 0.9, h * 0.06);
        // Swinging doors
        ctx.fillStyle = '#241C12';
        ctx.fillRect(x + w * 0.4, y + h * 0.55, w * 0.2, h * 0.45);
        const swing = Math.sin(this.game.animationFrame * 0.05) * 2;
        ctx.fillStyle = '#6E5A44';
        ctx.fillRect(x + w * 0.4 - swing, y + h * 0.6, w * 0.1, h * 0.25);
        ctx.fillRect(x + w * 0.5 + swing, y + h * 0.6, w * 0.1, h * 0.25);
        // Windows (warm glow flicker, as if a lamp still burns)
        const glow = (this.game.animationFrame % 80 < 40) ? '#B8934E' : '#A8834E';
        ctx.fillStyle = glow;
        ctx.fillRect(x + w * 0.12, y + h * 0.55, w * 0.16, h * 0.2);
        ctx.fillRect(x + w * 0.72, y + h * 0.55, w * 0.16, h * 0.2);
        ctx.strokeStyle = '#4A3A28';
        ctx.strokeRect(x + w * 0.12, y + h * 0.55, w * 0.16, h * 0.2);
        ctx.strokeRect(x + w * 0.72, y + h * 0.55, w * 0.16, h * 0.2);
    }

    drawWagon(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Bed
        ctx.fillStyle = '#6B4226';
        ctx.fillRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.4);
        ctx.strokeStyle = '#4A2F18';
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(x + w * 0.05 + i * (w * 0.9 / 4), y + h * 0.3);
            ctx.lineTo(x + w * 0.05 + i * (w * 0.9 / 4), y + h * 0.7);
            ctx.stroke();
        }
        // Intact wheel
        ctx.strokeStyle = '#3A2A18';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x + w * 0.75, y + h * 0.78, h * 0.22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + w * 0.75 - h * 0.22, y + h * 0.78);
        ctx.lineTo(x + w * 0.75 + h * 0.22, y + h * 0.78);
        ctx.moveTo(x + w * 0.75, y + h * 0.56);
        ctx.lineTo(x + w * 0.75, y + h);
        ctx.stroke();
        // Broken wheel on the ground
        ctx.beginPath();
        ctx.arc(x + w * 0.15, y + h * 0.95, h * 0.18, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 1;
        // Tilted tongue beam
        ctx.fillStyle = '#4A2F18';
        ctx.save();
        ctx.translate(x, y + h * 0.6);
        ctx.rotate(0.4);
        ctx.fillRect(0, 0, w * 0.3, 3);
        ctx.restore();
    }

    drawBarrel(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        ctx.fillStyle = '#7A5438';
        ctx.fillRect(x + 1, y, w - 2, h);
        // Slight bulge
        ctx.fillRect(x, y + h * 0.2, w, h * 0.6);
        // Metal bands
        ctx.fillStyle = '#4A4038';
        ctx.fillRect(x, y + h * 0.2, w, 3);
        ctx.fillRect(x, y + h * 0.72, w, 3);
        // Stave lines
        ctx.strokeStyle = '#5E4028';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.35, y); ctx.lineTo(x + w * 0.35, y + h);
        ctx.moveTo(x + w * 0.65, y); ctx.lineTo(x + w * 0.65, y + h);
        ctx.stroke();
    }

    drawWell(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Stone base
        ctx.fillStyle = '#7D7064';
        ctx.fillRect(x, y + h * 0.5, w, h * 0.5);
        ctx.fillStyle = '#5F534B';
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 4; c++) {
                ctx.strokeStyle = '#4F453D';
                ctx.strokeRect(x + c * (w / 4) + (r % 2) * 4, y + h * 0.5 + r * (h * 0.25), w / 4, h * 0.25);
            }
        }
        // Dark water inside
        ctx.fillStyle = '#1A2A3A';
        ctx.fillRect(x + w * 0.15, y + h * 0.55, w * 0.7, h * 0.12);
        if (this.game.animationFrame % 70 < 8) {
            ctx.fillStyle = '#3377CC';
            ctx.fillRect(x + w * 0.4, y + h * 0.58, 4, 2);
        }
        // Posts and roof
        ctx.fillStyle = '#6B4226';
        ctx.fillRect(x + 2, y + h * 0.1, 4, h * 0.45);
        ctx.fillRect(x + w - 6, y + h * 0.1, 4, h * 0.45);
        ctx.fillStyle = '#8B5A2B';
        ctx.beginPath();
        ctx.moveTo(x - 3, y + h * 0.15);
        ctx.lineTo(x + w / 2, y - 4);
        ctx.lineTo(x + w + 3, y + h * 0.15);
        ctx.lineTo(x + w - 2, y + h * 0.22);
        ctx.lineTo(x + w / 2, y + 4);
        ctx.lineTo(x + 2, y + h * 0.22);
        ctx.closePath(); ctx.fill();
        // Rope and bucket
        ctx.strokeStyle = '#C8BCA0';
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y + 4);
        ctx.lineTo(x + w / 2, y + h * 0.4);
        ctx.stroke();
        ctx.fillStyle = '#5E4028';
        ctx.fillRect(x + w / 2 - 4, y + h * 0.4, 8, 6);
    }

    drawMinePortal(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Dark opening
        ctx.fillStyle = '#0F0A05';
        ctx.fillRect(x + w * 0.12, y + h * 0.2, w * 0.76, h * 0.8);
        // Timber frame
        ctx.fillStyle = '#5E4A34';
        ctx.fillRect(x, y + h * 0.15, w * 0.14, h * 0.85);
        ctx.fillRect(x + w * 0.86, y + h * 0.15, w * 0.14, h * 0.85);
        ctx.fillRect(x - 3, y, w + 6, h * 0.18);
        // Support brace
        ctx.fillStyle = '#4A3A28';
        ctx.fillRect(x + w * 0.2, y + h * 0.18, w * 0.6, 4);
        if (this.objData.text) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '8px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText(this.objData.text.substring(0, 10), x + w / 2, y - 5);
            ctx.textAlign = 'left';
        }
    }

    drawRailTrack(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Sleepers
        ctx.fillStyle = '#4A3A28';
        for (let i = 0; i < 6; i++) {
            ctx.fillRect(x + i * (w / 6) + 2, y, 6, h);
        }
        // Rails
        ctx.fillStyle = '#8A8078';
        ctx.fillRect(x, y + h * 0.2, w, 3);
        ctx.fillRect(x, y + h * 0.65, w, 3);
    }

    drawMineCart(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Body
        ctx.fillStyle = '#4A4A52';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w * 0.85, y + h * 0.7);
        ctx.lineTo(x + w * 0.15, y + h * 0.7);
        ctx.closePath(); ctx.fill();
        // Ore inside
        ctx.fillStyle = '#B87333';
        ctx.fillRect(x + w * 0.2, y - 4, w * 0.15, 5);
        ctx.fillRect(x + w * 0.45, y - 6, w * 0.2, 7);
        ctx.fillRect(x + w * 0.7, y - 3, w * 0.12, 4);
        // Rivets
        ctx.fillStyle = '#2A2A32';
        ctx.fillRect(x + w * 0.1, y + h * 0.25, 3, 3);
        ctx.fillRect(x + w * 0.85, y + h * 0.25, 3, 3);
        // Wheels
        ctx.fillStyle = '#1A1A1E';
        ctx.beginPath();
        ctx.arc(x + w * 0.28, y + h * 0.82, h * 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + w * 0.72, y + h * 0.82, h * 0.18, 0, Math.PI * 2);
        ctx.fill();
    }

    drawCrystal(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const pulse = 0.5 + Math.sin(this.game.animationFrame * 0.08) * 0.3;
        // Glow halo
        ctx.fillStyle = `rgba(102, 221, 238, ${pulse * 0.25})`;
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.6, w * 0.9, h * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Crystal shards
        const shards = [
            { cx: 0.5, top: 0, base: 0.45, hw: 0.22 },
            { cx: 0.25, top: 0.3, base: 0.35, hw: 0.14 },
            { cx: 0.75, top: 0.25, base: 0.38, hw: 0.15 },
        ];
        shards.forEach(s => {
            ctx.fillStyle = `rgba(102, 221, 238, ${0.6 + pulse * 0.4})`;
            ctx.beginPath();
            ctx.moveTo(x + w * s.cx, y + h * s.top);
            ctx.lineTo(x + w * (s.cx + s.hw), y + h);
            ctx.lineTo(x + w * (s.cx - s.hw), y + h);
            ctx.closePath(); ctx.fill();
            // Highlight edge
            ctx.strokeStyle = `rgba(220, 255, 255, ${pulse})`;
            ctx.beginPath();
            ctx.moveTo(x + w * s.cx, y + h * s.top);
            ctx.lineTo(x + w * (s.cx - s.hw * 0.5), y + h * 0.85);
            ctx.stroke();
        });
        // Twinkle
        if (this.game.animationFrame % 50 < 6) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + w * 0.5 - 1, y + h * 0.25, 2, 2);
        }
    }

    drawStalagmite(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        ctx.fillStyle = '#5F534B';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y);
        ctx.lineTo(x + w * 0.75, y + h * 0.5);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + w * 0.3, y + h * 0.45);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#4A4038';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y);
        ctx.lineTo(x + w * 0.62, y + h * 0.5);
        ctx.lineTo(x + w * 0.72, y + h);
        ctx.lineTo(x + w * 0.45, y + h);
        ctx.closePath(); ctx.fill();
    }

    drawSparkyStatue(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const maroon = '#8C1D40', gold = '#FFC627', bronze = '#6B4A2A';
        // Pedestal
        ctx.fillStyle = '#7A7068';
        ctx.fillRect(x + 2, y + h * 0.78, w - 4, h * 0.22);
        ctx.fillStyle = '#5F534B';
        ctx.fillRect(x + 2, y + h * 0.78, w - 4, 4);
        // Plaque
        ctx.fillStyle = gold;
        ctx.fillRect(x + w * 0.3, y + h * 0.85, w * 0.4, 6);
        // Legs
        ctx.fillStyle = maroon;
        ctx.fillRect(x + w * 0.32, y + h * 0.6, 6, h * 0.18);
        ctx.fillRect(x + w * 0.52, y + h * 0.6, 6, h * 0.18);
        // Body
        ctx.fillRect(x + w * 0.28, y + h * 0.34, w * 0.38, h * 0.28);
        // Head with widow's peak
        ctx.fillRect(x + w * 0.34, y + h * 0.14, w * 0.26, h * 0.2);
        ctx.beginPath();
        ctx.moveTo(x + w * 0.47, y + h * 0.22);
        ctx.lineTo(x + w * 0.42, y + h * 0.14);
        ctx.lineTo(x + w * 0.52, y + h * 0.14);
        ctx.closePath(); ctx.fill();
        // Gold horns
        ctx.fillStyle = gold;
        ctx.fillRect(x + w * 0.3, y + h * 0.08, 4, 7);
        ctx.fillRect(x + w * 0.6, y + h * 0.08, 4, 7);
        // Eyes and grin
        ctx.fillStyle = gold;
        ctx.fillRect(x + w * 0.38, y + h * 0.2, 3, 3);
        ctx.fillRect(x + w * 0.52, y + h * 0.2, 3, 3);
        ctx.fillRect(x + w * 0.4, y + h * 0.28, w * 0.16, 2);
        // Arm and pitchfork
        ctx.fillStyle = maroon;
        ctx.fillRect(x + w * 0.62, y + h * 0.38, w * 0.18, 5);
        ctx.fillStyle = gold;
        ctx.fillRect(x + w * 0.8, y + h * 0.12, 4, h * 0.55);   // shaft
        ctx.fillRect(x + w * 0.72, y + h * 0.12, w * 0.24, 4);  // crossbar
        ctx.fillRect(x + w * 0.72, y + h * 0.04, 4, h * 0.1);   // left prong
        ctx.fillRect(x + w * 0.8, y + h * 0.02, 4, h * 0.12);   // center prong
        ctx.fillRect(x + w * 0.88, y + h * 0.04, 4, h * 0.1);   // right prong
        // Tail
        ctx.fillStyle = bronze;
        ctx.fillRect(x + w * 0.22, y + h * 0.52, 6, 4);
        ctx.fillRect(x + w * 0.18, y + h * 0.46, 4, 8);
    }

    drawAsuBanner(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const maroon = '#8C1D40', gold = '#FFC627';
        // Hanging rod
        ctx.fillStyle = '#4A3A28';
        ctx.fillRect(x - 4, y, w + 8, 3);
        // Banner field with gold border
        ctx.fillStyle = gold;
        ctx.fillRect(x, y + 3, w, h - 3);
        ctx.fillStyle = maroon;
        ctx.fillRect(x + 3, y + 6, w - 6, h - 12);
        // Swallowtail bottom edge
        ctx.fillStyle = gold;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(x + (i * w) / 4, y + h - 6);
            ctx.lineTo(x + (i * w) / 4 + w / 8, y + h);
            ctx.lineTo(x + ((i + 1) * w) / 4, y + h - 6);
            ctx.closePath(); ctx.fill();
        }
        // Text and mini pitchfork
        ctx.fillStyle = gold;
        ctx.font = '9px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('ASU', x + w / 2 - 8, y + h * 0.55);
        ctx.textAlign = 'left';
        const fx = x + w - 20, fy = y + 9;
        ctx.fillRect(fx + 4, fy, 2, 12);
        ctx.fillRect(fx, fy + 3, 10, 2);
        ctx.fillRect(fx, fy, 2, 5);
        ctx.fillRect(fx + 8, fy, 2, 5);
    }

    drawTrophyCase(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const gold = '#FFC627';
        // Wood frame
        ctx.fillStyle = '#4A3A28';
        ctx.fillRect(x, y, w, h);
        // Glass
        ctx.fillStyle = '#2A3A44';
        ctx.fillRect(x + 3, y + 3, w - 6, h - 8);
        // Shelf
        ctx.fillStyle = '#8C1D40';
        ctx.fillRect(x + 3, y + h * 0.55, w - 6, 3);
        // Trophies (pixel cups)
        const cup = (cx, cy, s) => {
            ctx.fillStyle = gold;
            ctx.fillRect(cx, cy, s * 3, s * 2);
            ctx.fillRect(cx - s, cy, s, s);
            ctx.fillRect(cx + s * 3, cy, s, s);
            ctx.fillRect(cx + s, cy + s * 2, s, s);
            ctx.fillRect(cx, cy + s * 3, s * 3, s);
        };
        cup(x + w * 0.18, y + h * 0.18, 2);
        cup(x + w * 0.6, y + h * 0.22, 2);
        cup(x + w * 0.38, y + h * 0.62, 2);
        // Glass shine
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.moveTo(x + 6, y + h - 10);
        ctx.lineTo(x + w * 0.45, y + 6);
        ctx.stroke();
    }

    drawBulletinBoard(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Frame and cork
        ctx.fillStyle = '#5E4A34';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#B08D57';
        ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
        // Flyers
        const flyers = [
            { fx: 0.12, fy: 0.15, fw: 0.3, fh: 0.4, c: '#E8E4D8' },
            { fx: 0.5, fy: 0.12, fw: 0.34, fh: 0.34, c: '#FFC627' },
            { fx: 0.2, fy: 0.58, fw: 0.28, fh: 0.3, c: '#E8E4D8' },
            { fx: 0.56, fy: 0.52, fw: 0.3, fh: 0.36, c: '#8C1D40' },
        ];
        flyers.forEach(f => {
            ctx.fillStyle = f.c;
            ctx.fillRect(x + w * f.fx, y + h * f.fy, w * f.fw, h * f.fh);
            // Pin
            ctx.fillStyle = '#CC2222';
            ctx.fillRect(x + w * f.fx + (w * f.fw) / 2 - 1, y + h * f.fy - 1, 3, 3);
            // Text lines
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            for (let l = 0; l < 2; l++) {
                ctx.fillRect(x + w * f.fx + 2, y + h * f.fy + 4 + l * 4, w * f.fw - 4, 1.5);
            }
        });
    }

    drawPottedPalm(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const sway = Math.sin(this.game.animationFrame * 0.03 + this.x) * 1.5;
        // Terracotta pot
        ctx.fillStyle = '#B5654A';
        ctx.fillRect(x + w * 0.2, y + h * 0.72, w * 0.6, h * 0.28);
        ctx.fillRect(x + w * 0.12, y + h * 0.68, w * 0.76, 5);
        // Trunk
        ctx.fillStyle = '#8A6B4F';
        ctx.fillRect(x + w * 0.44, y + h * 0.3, 4, h * 0.42);
        ctx.fillStyle = '#7A5B3F';
        ctx.fillRect(x + w * 0.44, y + h * 0.38, 4, 2);
        ctx.fillRect(x + w * 0.44, y + h * 0.5, 4, 2);
        ctx.fillRect(x + w * 0.44, y + h * 0.62, 4, 2);
        // Fronds
        ctx.strokeStyle = '#3E7C4A';
        ctx.lineWidth = 3;
        const cx = x + w * 0.5, cy = y + h * 0.3;
        const fronds = [[-0.9, -0.3], [-0.5, -0.7], [0, -0.9], [0.5, -0.7], [0.9, -0.3]];
        fronds.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + dx * w * 0.42 + sway, cy + dy * h * 0.24);
            ctx.stroke();
        });
        ctx.lineWidth = 1;
        // Frond tips
        ctx.fillStyle = '#4E9C5A';
        fronds.forEach(([dx, dy]) => {
            ctx.fillRect(cx + dx * w * 0.42 + sway - 2, cy + dy * h * 0.24 - 2, 4, 4);
        });
    }

    drawHoleInTheRock(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const hour = Math.floor((this.game.gameTime % 86400) / 3600);
        const dawnLight = hour >= 5 && hour < 8;
        // Sandstone butte
        ctx.fillStyle = '#C97B5A';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.quadraticCurveTo(x + w * 0.05, y + h * 0.25, x + w * 0.3, y + h * 0.1);
        ctx.quadraticCurveTo(x + w * 0.55, y - h * 0.05, x + w * 0.75, y + h * 0.15);
        ctx.quadraticCurveTo(x + w * 1.0, y + h * 0.4, x + w, y + h);
        ctx.closePath(); ctx.fill();
        // Weathering bands
        ctx.strokeStyle = '#B06A4C';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.1, y + h * 0.55);
        ctx.quadraticCurveTo(x + w * 0.5, y + h * 0.45, x + w * 0.9, y + h * 0.6);
        ctx.stroke();
        // The hole
        ctx.fillStyle = '#2A1A12';
        ctx.beginPath();
        ctx.ellipse(x + w * 0.5, y + h * 0.45, w * 0.13, h * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Dawn: light shaft through the opening onto the ground
        if (dawnLight) {
            const flicker = 0.5 + Math.sin(this.game.animationFrame * 0.05) * 0.1;
            ctx.fillStyle = `rgba(255, 215, 120, ${flicker})`;
            ctx.beginPath();
            ctx.moveTo(x + w * 0.44, y + h * 0.38);
            ctx.lineTo(x + w * 0.56, y + h * 0.38);
            ctx.lineTo(x + w * 0.7, y + h + 10);
            ctx.lineTo(x + w * 0.3, y + h + 10);
            ctx.closePath(); ctx.fill();
            // Lit basin on the floor
            ctx.fillStyle = `rgba(255, 240, 180, ${flicker + 0.2})`;
            ctx.beginPath();
            ctx.ellipse(x + w * 0.5, y + h + 6, w * 0.12, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawAlignedDoorway(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const hour = Math.floor((this.game.gameTime % 86400) / 3600);
        const dawnLight = hour >= 5 && hour < 8;
        // Adobe wall
        ctx.fillStyle = '#B08D57';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#9A7B4F';
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(x, y + i * (h / 4));
            ctx.lineTo(x + w, y + i * (h / 4));
            ctx.stroke();
        }
        // Doorway gap
        ctx.fillStyle = dawnLight ? '#FFD778' : '#3A2B1A';
        ctx.fillRect(x + w * 0.38, y + h * 0.25, w * 0.24, h * 0.75);
        if (dawnLight) {
            // Light spills through toward the viewer
            ctx.fillStyle = 'rgba(255, 215, 120, 0.45)';
            ctx.beginPath();
            ctx.moveTo(x + w * 0.38, y + h);
            ctx.lineTo(x + w * 0.62, y + h);
            ctx.lineTo(x + w * 0.8, y + h + 14);
            ctx.lineTo(x + w * 0.2, y + h + 14);
            ctx.closePath(); ctx.fill();
        }
        // Lintel
        ctx.fillStyle = '#8A6B3F';
        ctx.fillRect(x + w * 0.34, y + h * 0.2, w * 0.32, 5);
    }

    drawHorizonMarker(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const hour = Math.floor((this.game.gameTime % 86400) / 3600);
        const duskLight = hour >= 17 && hour < 20;
        // Ridge silhouette with a cut notch
        ctx.fillStyle = '#4A3B2A';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x, y + h * 0.4);
        ctx.lineTo(x + w * 0.35, y + h * 0.15);
        ctx.lineTo(x + w * 0.44, y + h * 0.15);
        ctx.lineTo(x + w * 0.44, y + h * 0.45);   // notch left wall
        ctx.lineTo(x + w * 0.56, y + h * 0.45);   // notch floor
        ctx.lineTo(x + w * 0.56, y + h * 0.1);    // notch right wall
        ctx.lineTo(x + w * 0.7, y + h * 0.1);
        ctx.lineTo(x + w, y + h * 0.5);
        ctx.lineTo(x + w, y + h);
        ctx.closePath(); ctx.fill();
        // At dusk, a blocky pixel sun settles into the notch
        if (duskLight) {
            const glow = 0.7 + Math.sin(this.game.animationFrame * 0.04) * 0.15;
            const sx = Math.round(x + w * 0.5) - 6, sy = Math.round(y + h * 0.35) - 6;
            // Halo blocks
            ctx.fillStyle = `rgba(255, 170, 80, ${glow * 0.35})`;
            ctx.fillRect(sx - 4, sy - 4, 20, 20);
            // Sun disc, stepped like a low-res circle
            ctx.fillStyle = `rgba(255, 90, 40, ${glow})`;
            ctx.fillRect(sx + 3, sy, 6, 12);
            ctx.fillRect(sx, sy + 3, 12, 6);
            ctx.fillRect(sx + 1, sy + 1, 10, 10);
            // Hot core
            ctx.fillStyle = `rgba(255, 220, 120, ${glow})`;
            ctx.fillRect(sx + 4, sy + 4, 4, 4);
            // Rays
            ctx.fillStyle = `rgba(255, 130, 50, ${glow * 0.7})`;
            ctx.fillRect(sx - 6, sy + 5, 4, 2);
            ctx.fillRect(sx + 14, sy + 5, 4, 2);
            ctx.fillRect(sx + 5, sy - 6, 2, 4);
        }
        // Worn standing-spot at the base
        ctx.fillStyle = '#6B5B45';
        ctx.beginPath();
        ctx.ellipse(x + w * 0.5, y + h - 3, 10, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSurveyFlag(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const flutter = Math.sin(this.game.animationFrame * 0.15) * 2;
        // Stake
        ctx.fillStyle = '#C8BCA0';
        ctx.fillRect(x + w / 2 - 1, y + h * 0.25, 2, h * 0.75);
        // Orange flag
        ctx.fillStyle = '#FF6A00';
        ctx.beginPath();
        ctx.moveTo(x + w / 2 + 1, y);
        ctx.lineTo(x + w / 2 + 1 + w * 0.7 + flutter, y + h * 0.12);
        ctx.lineTo(x + w / 2 + 1, y + h * 0.25);
        ctx.closePath(); ctx.fill();
    }

    drawLooterPit(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Spoil pile
        ctx.fillStyle = '#A88B62';
        ctx.beginPath();
        ctx.ellipse(x + w * 0.78, y + h * 0.4, w * 0.22, h * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        // The pit
        ctx.fillStyle = '#3A2B1A';
        ctx.beginPath();
        ctx.ellipse(x + w * 0.4, y + h * 0.6, w * 0.34, h * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#241A0F';
        ctx.beginPath();
        ctx.ellipse(x + w * 0.4, y + h * 0.62, w * 0.24, h * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Discarded screen frame
        ctx.strokeStyle = '#6B5B45';
        ctx.strokeRect(x + w * 0.6, y + h * 0.75, w * 0.3, h * 0.2);
    }

    onInteract(player) {
        // Camp: rest until dawn
        if (this.objData.rest) {
            const daySec = 24 * 3600;
            const cur = this.game.gameTime % daySec;
            const dawn = 6 * 3600;
            let advance = dawn - cur;
            if (advance <= 0) advance += daySec;
            this.game.gameTime += advance;
            player.heal(20);
            player.hydration = Math.max(10, player.hydration - 15);
            this.game.ui.updateHydration(player.hydration, player.maxHydration);
            this.game.ui.updateClock(this.game.gameTime);
            this.game.ui.showDialog("You bank the coals and sleep under more stars than the city ever shows you. Dawn comes up gold and quiet. (You rest until first light. +20 HP, -15 H2O)", "CAMP");
            this.game.setGameState(GAME_STATE.DIALOG);
            return;
        }

        // Time-gated alignments: only read at the right hour
        if (this.objData.timeGated) {
            const tg = this.objData.timeGated;
            const hour = Math.floor((this.game.gameTime % 86400) / 3600);
            const inWindow = hour >= tg.startHour && hour < tg.endHour;
            this.game.ui.showDialog(inWindow ? tg.successText : tg.failText, (this.objData.name || this.type).toUpperCase());
            this.game.setGameState(GAME_STATE.DIALOG);
            if (inWindow && tg.record) player.addQuest(tg.record);
            return;
        }

        if (this.objData.triggersPuzzle && (!this.game.player || !this.game.player.hasItem('final_artifact')) && !this.objData.opened) {
            this.game.startPuzzle(this.objData.puzzleDetails);
            return;
        }
        // Multi-artifact lock: the door only opens once every required record is carried
        if (this.objData.requiredItems && !this.objData.isNowPortal) {
            const missing = this.objData.requiredItems.filter(k => !player.hasItem(k));
            if (missing.length > 0) {
                const names = missing.map(k => (this.game.itemTypes[k] ? this.game.itemTypes[k].name : k)).join(', ');
                this.game.ui.showDialog((this.objData.lockedText || "It will not budge.") + " Still missing: " + names + ".", (this.objData.name || this.type).toUpperCase());
                this.game.setGameState(GAME_STATE.DIALOG);
                if (!player.quests.find(q => q.id === 'three_records')) {
                    player.addQuest({ id: 'three_records', description: 'Recover the three records: stick fragment, olla shard, star rubbing.', completed: false });
                }
                return;
            }
            player.completeQuest('three_records');
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
        if ((this.type === 'chest' || this.type === 'fruit_cactus') && this.objData.contains && !this.objData.opened) {
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
        if (this.type === 'water_source' || this.type === 'well') {
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
            if (this.objData.questTrigger.grantsItem) player.addItem(this.objData.questTrigger.grantsItem);
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
