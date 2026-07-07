import { Entity } from './Entity.js';
import { Arrow } from './Arrow.js';
import { GAME_STATE, TURRET_COOLDOWN, TURRET_ARROW_SPEED, TURRET_ARROW_DAMAGE, TURRET_AGGRO_RANGE } from '../constants.js';

export class InteractiveObject extends Entity {
    constructor(game, x, y, objData, mapIndex = -1) {
        super(game, x, y, objData.width, objData.height, objData.type);
        this.objData = JSON.parse(JSON.stringify(objData));
        this.mapIndex = mapIndex;
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
            case 'sign': this.drawSign(ctx); break;
            case 'interactive_point':
                this.drawSign(ctx);
                if (this.objData.lightBeam) this.drawLightBeam(ctx);
                break;
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
            case 'tinaja': this.drawTinaja(ctx); break;
            case 'granite_boulder': this.drawGraniteBoulder(ctx); break;
            case 'petroglyph_cliff': this.drawPetroglyphCliff(ctx); break;
            case 'great_house': this.drawGreatHouse(ctx); break;
            case 'canopy_post': this.drawCanopyPost(ctx); break;
            case 'compound_wall': this.drawCompoundWall(ctx); break;
            case 'ballcourt': this.drawBallcourt(ctx); break;
            case 'hole_in_the_rock': this.drawHoleInTheRock(ctx); break;
            case 'aligned_doorway': this.drawAlignedDoorway(ctx); break;
            case 'horizon_marker': this.drawHorizonMarker(ctx); break;
            case 'survey_flag': this.drawSurveyFlag(ctx); break;
            case 'looter_pit': this.drawLooterPit(ctx); break;
            case 'srp_canal': this.drawSrpCanal(ctx); break;
            case 'footbridge': this.drawFootbridge(ctx); break;
            case 'wind_chime': this.drawWindChime(ctx); break;
            case 'stone_needle': this.drawStoneNeedle(ctx); break;
            case 'canyon_wall': this.drawCanyonWall(ctx); break;
            case 'balanced_rock': this.drawBalancedRock(ctx); break;
            case 'dry_wash': this.drawDryWash(ctx); break;
            case 'uv_trace': this.drawUvTrace(ctx); break;
            case 'offering_ledge': this.drawOfferingLedge(ctx); break;
            case 'mountain_slope': this.drawMountainSlope(ctx); break;
            case 'praying_monk': this.drawPrayingMonk(ctx); break;
            case 'trail_path': this.drawTrailPath(ctx); break;
            case 'pickup_truck': this.drawPickupTruck(ctx); break;
            case 'palo_verde': this.drawPaloVerde(ctx); break;
            case 'interior_wall': this.drawInteriorWall(ctx); break;
            case 'bookshelf': this.drawBookshelf(ctx); break;
            default: ctx.fillRect(this.x, this.y, this.width, this.height); break;
        }
    }

    drawCactus(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const green = '#2D7D40', dark = '#1E532D', light = '#3E9A52';
        const variant = (Math.round(x) * 7 + Math.round(y) * 13) % 3; // 0: two arms+blooms, 1: one arm+wren, 2: young
        const trunkX = x + w * 0.32, trunkW = w * 0.36;
        const trunkTop = variant === 2 ? y + h * 0.25 : y;

        // Trunk with stepped crown
        ctx.fillStyle = green;
        ctx.fillRect(trunkX, trunkTop + trunkW / 2, trunkW, y + h - trunkTop - trunkW / 2);
        ctx.fillRect(trunkX + 2, trunkTop + trunkW * 0.2, trunkW - 4, trunkW * 0.35);
        ctx.fillRect(trunkX + trunkW * 0.25, trunkTop, trunkW * 0.5, trunkW * 0.25);

        // Arms: out then up, rounded tips
        const arm = (ax, ay, dir, len) => {
            ctx.fillStyle = green;
            ctx.fillRect(dir > 0 ? ax : ax - w * 0.22, ay, w * 0.22, 7);          // elbow out
            const upX = dir > 0 ? ax + w * 0.22 - 7 : ax - w * 0.22;
            ctx.fillRect(upX, ay - len, 7, len + 7);                               // arm up
            ctx.fillRect(upX + 1, ay - len - 3, 5, 3);                             // stepped tip
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

    // Shade a hex color toward black (f < 0) or white (f > 0)
    shade(hex, f) {
        const n = parseInt(hex.slice(1), 16);
        const ch = (v) => Math.max(0, Math.min(255, Math.round(v + (f > 0 ? (255 - v) : v) * f)));
        return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
    }

    drawRock(ctx) {
        const base = this.objData.color || '#7D7064';
        const P = { b: base, d: this.shade(base, -0.3), l: this.shade(base, 0.22) };
        const variant = (Math.round(this.x) * 3 + Math.round(this.y)) % 2;
        const rows = variant === 0 ? [
            "....dddd....",
            "..ddbbbbdd..",
            ".dblbbbbbbd.",
            ".dbllbbbbbbd",
            "dbbbbbbbbdbd",
            "dbbbbbbdbbbd",
            ".ddbbddbbdd.",
        ] : [
            "..ddd..dd...",
            ".dbbbddbbd..",
            "dblbbbbbbbd.",
            "dbllbbbbbbbd",
            "dbbbbbdbbbbd",
            ".dbbbbbbdbd.",
            "..dddddddd..",
        ];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x, this.y + this.height - rows.length * scale, scale);
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
            // Open lid: stepped back panel
            ctx.fillRect(this.x - 2, this.y - 9, this.width + 4, 4);
            ctx.fillRect(this.x, this.y - 5, this.width, 3);
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

    // A column of light standing on the floor while this object's time window
    // is open (the canyon's noon blade)
    drawLightBeam(ctx) {
        const tg = this.objData.timeGated;
        if (!tg) return;
        const hour = this.game.gameHour;
        if (hour < tg.startHour || hour >= tg.endHour) return;
        const t = this.game.animationFrame;
        const glow = 0.28 + Math.sin(t * 0.03) * 0.06;
        const cx = Math.round(this.centerX);
        const floorY = this.y + this.height - 2;
        ctx.fillStyle = `rgba(255, 232, 160, ${glow})`;
        ctx.fillRect(cx - 10, 0, 20, floorY);
        ctx.fillStyle = `rgba(255, 244, 200, ${glow + 0.16})`;
        ctx.fillRect(cx - 4, 0, 8, floorY);
        // Hot pool where the blade stands
        ctx.fillStyle = `rgba(255, 244, 200, ${glow + 0.22})`;
        ctx.fillRect(cx - 14, floorY - 3, 28, 7);
        // Dust swimming in the column
        for (let i = 0; i < 5; i++) {
            const my = (i * 83 + t * (0.4 + i * 0.13)) % floorY;
            const mx = cx - 6 + ((i * 37) % 12);
            ctx.fillStyle = `rgba(255, 250, 220, ${0.5 - i * 0.07})`;
            ctx.fillRect(Math.round(mx), Math.round(my), 2, 2);
        }
    }

    drawWaterSource(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const t = this.game.animationFrame;
        const P = { k: '#8A7355', b: '#2A5A8A', m: '#3B77AC', M: '#4E8FC4', g: '#3A6B2A' };
        const F = [[
            "...kkkkkkkkkk..g",
            ".kkbbbbbbbbbbkgg",
            "kbbmmmmmmmmmbbkg",
            "kbmmMMmmmmMmmbkk",
            "kbbmmmmMMmmmbbk.",
            ".kkbbbbbbbbbbkk.",
            "...kkkkkkkkkk...",
        ], [
            "...kkkkkkkkkk..g",
            ".kkbbbbbbbbbbkgg",
            "kbbmmmMMmmmmbbkg",
            "kbmmmmmmmMMmmbkk",
            "kbbmMMmmmmmmbbk.",
            ".kkbbbbbbbbbbkk.",
            "...kkkkkkkkkk...",
        ]];
        const frame = Math.floor(t / 20) % 2;
        const rows = F[frame];
        const scale = w / rows[0].length;
        this.drawPixels(ctx, rows, P, x, y + h - rows.length * scale, scale);
        // Sun glint pixel
        if (t % 50 < 12) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(Math.round(x + w * 0.4 + (t % 3) * 4), Math.round(y + h * 0.4), 2, 2);
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
        const unopened = !this.objData.opened && (!this.game.player || !this.game.player.hasItem('final_artifact'));
        // Solstice dawn: one gold line comes down the stair and finds the olla
        const solsticeLight = unopened && this.game.gameDate >= 21 && this.game.gameHour >= 5 && this.game.gameHour < 8;
        if (solsticeLight) {
            const glow = 0.65 + Math.sin(this.game.animationFrame * 0.06) * 0.2;
            const x1 = 0, y1 = 26; // the stair, top-left, where the doorway lets the dawn in
            const x2 = this.centerX, y2 = this.y - 4;
            const steps = 26;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const bx = Math.round(x1 + (x2 - x1) * t);
                const by = Math.round(y1 + (y2 - y1) * t);
                ctx.fillStyle = `rgba(255, 215, 120, ${glow * 0.25})`;
                ctx.fillRect(bx - 5, by - 5, 10, 10);
                ctx.fillStyle = `rgba(255, 230, 160, ${glow})`;
                ctx.fillRect(bx - 2, by - 2, 4, 4);
            }
            ctx.fillStyle = `rgba(255, 215, 120, ${glow * 0.3})`;
            ctx.fillRect(this.x - 8, this.y - 14, this.width + 16, this.height + 20);
        }
        ctx.fillStyle = '#8888AA';
        ctx.fillRect(this.x, this.y + this.height * 0.2, this.width, this.height * 0.8);
        ctx.fillStyle = '#777799';
        ctx.fillRect(this.x - 2, this.y + this.height * 0.1, this.width + 4, this.height * 0.2);
        if (unopened) {
            ctx.fillStyle = solsticeLight ? '#FFE88A' : '#FFD700';
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
        // waterColor overrides after the June 23 pour: concrete grey instead of old water
        ctx.fillStyle = this.objData.waterColor || '#658EA9';
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
        // Circular port, stepped like a low-res circle
        ctx.fillStyle = '#000020';
        const px = Math.round(this.x + this.width / 2), py = Math.round(this.y + this.height / 2);
        ctx.fillRect(px - 6, py - 3, 12, 6);
        ctx.fillRect(px - 3, py - 6, 6, 12);
        ctx.fillRect(px - 5, py - 5, 10, 10);
    }

    drawPhoenixStatue(ctx) {
        const P = { o: '#FF8C00', r: '#FF4500', y: '#FFD24A', s: '#7A7068' };
        const rows = [
            "......rr......",
            ".....ryyr.....",
            "o.....rr.....o",
            "oo...rrrr...oo",
            "ooo..rrrr..ooo",
            ".oooorrrroooo.",
            "..oo.rrrr.oo..",
            ".....rrrr.....",
            "....rrrrrr....",
            "...rr.rr.rr...",
            ".....ssss.....",
            "....ssssss....",
        ];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x, this.y + this.height - rows.length * scale, scale);
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
        const P = { r: '#5B3A29', d: '#40281C', k: '#2E1C12' };
        const rows = [
            "....rrrrrrrrrrrr....",
            "..rrrrddddddddrrrr..",
            ".rrddddkkkkkkddddrr.",
            ".rrddkkkkkkkkkkddrr.",
            "..rrddddkkkkddddrr..",
            "....rrrrddddrrrr....",
        ];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x, this.y + this.height - rows.length * scale, scale);
    }

    drawTumbleweed(ctx) {
        const anim = this.game.animationFrame;
        const roll = Math.round(Math.sin(anim * 0.04) * 2);
        const bounce = Math.round(Math.abs(Math.sin(anim * 0.06)) * 3);
        const P = { t: '#8B7355', c: '#A08050', d: '#6E5A42' };
        // Two "rotation" frames: the twig pattern flips, reading as a rolling ball
        const F = [[
            "..t.tt.t..",
            ".t.d..d.t.",
            "td.tcct.dt",
            ".t.cccc.t.",
            "td.tcct.dt",
            ".t.d..d.t.",
            "..t.tt.t..",
        ], [
            ".t..tt..t.",
            "t.d.tt.d.t",
            ".d.tcct.d.",
            "tt.cccc.tt",
            ".d.tcct.d.",
            "t.d.tt.d.t",
            ".t..tt..t.",
        ]];
        const frame = Math.floor(anim / 10) % 2;
        const rows = F[frame];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x + roll, this.y + this.height - rows.length * scale - bounce, scale);
    }

    drawDeadTree(ctx) {
        const P = { b: '#5C3D2E', d: '#4A2F20', t: '#6B4226' };
        const rows = [
            ".t......t.",
            ".tt....tt.",
            "..t.t.tt..",
            "..ttttt...",
            "t..tbt....",
            "tt.tbbt...",
            "..ttbdb...",
            "...bbdb...",
            "...bdbb...",
            "...bbdb...",
            "...bdbb...",
            "..bbbbbb..",
        ];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x, this.y + this.height - rows.length * scale, scale);
    }

    drawAnimalBones(ctx) {
        const P = { w: '#E8DCC8', d: '#C8BCA0', k: '#333333' };
        const rows = [
            "...........ww",
            ".w.w.w.w..www",
            "wwwwwwwwww.wk",
            ".w.w.w.w..www",
            "..w...w....w.",
        ];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x, this.y + this.height - rows.length * scale, scale);
    }

    drawCampfireRemains(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const anim = this.game.animationFrame;
        const P = { s: '#666666', d: '#4A4A4A', a: '#3A3A3A', L: '#2A1A0A' };
        const rows = [
            "..s..ss..s..",
            ".saaaaaaaas.",
            "saaLLaaLLaas",
            "saLLaaaaLLas",
            ".saaLLLLaas.",
            "..ss.dd.ss..",
        ];
        const scale = w / rows[0].length;
        this.drawPixels(ctx, rows, P, x, y + h - rows.length * scale, scale);
        // Pixel smoke puffs drifting up
        if (anim % 120 < 80) {
            const rise = (anim % 40) * 0.5;
            const drift = Math.round(Math.sin(anim * 0.05) * 3);
            ctx.fillStyle = 'rgba(150, 150, 150, 0.35)';
            ctx.fillRect(Math.round(x + w / 2 + drift), Math.round(y + h * 0.2 - rise), 3, 3);
            ctx.fillRect(Math.round(x + w / 2 - drift * 0.5), Math.round(y + h * 0.2 - rise - 8), 2, 2);
        }
    }

    drawDesertFlower(ctx) {
        const anim = this.game.animationFrame;
        const sway = Math.round(Math.sin(anim * 0.03) * 1.5);
        const P = { p: '#FF69B4', P: '#FF85C2', y: '#FFD700', g: '#3A6B2A', l: '#4A8B3A' };
        const rows = [
            ".pPp.",
            "pPyPp",
            ".ppp.",
            "..g..",
            ".lgl.",
            "..g..",
            "..g..",
        ];
        const scale = this.width / rows[0].length;
        // Head sways, base stays planted
        this.drawPixels(ctx, rows.slice(0, 3), P, this.x + sway, this.y + this.height - rows.length * scale, scale);
        this.drawPixels(ctx, rows.slice(3), P, this.x, this.y + this.height - (rows.length - 3) * scale, scale);
    }

    drawTrailMarker(ctx) {
        const P = { a: '#8B8178', b: '#7A7068', c: '#696058', d: '#585048', e: '#484038' };
        const rows = [
            "...ee.....",
            "..eeee....",
            "..dddd....",
            ".dddddd...",
            ".cccccc...",
            "cccccccc..",
            ".bbbbbbb..",
            "bbbbbbbbb.",
            "aaaaaaaaaa",
        ];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x, this.y + this.height - rows.length * scale, scale);
    }

    drawSandDune(ctx) {
        const P = { s: '#D4B483', d: '#C4A473', l: '#E2CA9A' };
        const rows = [
            ".....lll..ll....",
            "...llsssllssl...",
            "..lssssssssssl..",
            ".lssdssssssdssl.",
            "lssssssdsssssssl",
            "ssdssssssssdssss",
        ];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x, this.y + this.height - rows.length * scale, scale);
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
        // Intact wheel: blocky ring with cross spokes
        const wc = '#3A2A18';
        const wx = x + w * 0.75, wy = y + h * 0.78, r = h * 0.22;
        ctx.fillStyle = wc;
        ctx.fillRect(Math.round(wx - r), Math.round(wy - r * 0.5), 3, r);           // left rim
        ctx.fillRect(Math.round(wx + r - 3), Math.round(wy - r * 0.5), 3, r);       // right rim
        ctx.fillRect(Math.round(wx - r * 0.5), Math.round(wy - r), r, 3);           // top rim
        ctx.fillRect(Math.round(wx - r * 0.5), Math.round(wy + r - 3), r, 3);       // bottom rim
        ctx.fillRect(Math.round(wx - r), Math.round(wy - 1), r * 2, 3);             // spoke
        ctx.fillRect(Math.round(wx - 1), Math.round(wy - r), 3, r * 2);             // spoke
        // Broken wheel half-buried
        ctx.fillRect(Math.round(x + w * 0.06), Math.round(y + h * 0.88), h * 0.36, 3);
        ctx.fillRect(Math.round(x + w * 0.06), Math.round(y + h * 0.8), 3, h * 0.12);
        ctx.fillRect(Math.round(x + w * 0.06 + h * 0.36 - 3), Math.round(y + h * 0.8), 3, h * 0.12);
        // Fallen tongue beam, stepped diagonal
        ctx.fillStyle = '#4A2F18';
        ctx.fillRect(x, y + h * 0.72, 8, 3);
        ctx.fillRect(x + 6, y + h * 0.66, 8, 3);
        ctx.fillRect(x + 12, y + h * 0.6, 8, 3);
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
        const P = { b: '#4A4A52', d: '#2A2A32', o: '#B87333', O: '#D89153', k: '#1A1A1E' };
        const rows = [
            "..o.Oo..o..",
            ".oOooOOoOo.",
            "bbbbbbbbbbb",
            "bdbbbbbbbdb",
            "bbbbbbbbbbb",
            ".bbbbbbbbb.",
            ".bdbbbbbdb.",
            "..kk...kk..",
            ".kkkk.kkkk.",
            "..kk...kk..",
        ];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x, this.y + this.height - rows.length * scale, scale);
    }

    drawCrystal(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const pulse = 0.5 + Math.sin(this.game.animationFrame * 0.08) * 0.3;
        // Chunky square glow
        ctx.fillStyle = `rgba(102, 221, 238, ${pulse * 0.18})`;
        ctx.fillRect(x - w * 0.4, y - h * 0.2, w * 1.8, h * 1.4);
        const P = { c: '#66DDEE', h: '#B8F4FA', d: '#3A9AAC' };
        const rows = [
            ".....hc.....",
            ".....cc.....",
            "....hccd....",
            "..h.cccd.c..",
            "..cchccd.cc.",
            ".hcccccdhccd",
            ".ccdcccdcccd",
            "hcccdccccccd",
            "ccccdccdcccd",
        ];
        const scale = w / rows[0].length;
        this.drawPixels(ctx, rows, P, x, y + h - rows.length * scale, scale);
        // Twinkle
        if (this.game.animationFrame % 50 < 6) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(Math.round(x + w * 0.45), Math.round(y + h * 0.2), 2, 2);
        }
    }

    drawStalagmite(ctx) {
        const P = { s: '#5F534B', d: '#4A4038' };
        const rows = [
            "....sd....",
            "....sd....",
            "...ssdd...",
            "...ssdd...",
            "..sssddd..",
            "..sssddd..",
            ".ssssdddd.",
            "ssssssdddd",
        ];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x, this.y + this.height - rows.length * scale, scale);
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
        // Fronds: stepped pixel segments fanning out
        const cx = x + w * 0.5, cy = y + h * 0.3;
        const fronds = [[-0.9, -0.3], [-0.5, -0.7], [0, -0.9], [0.5, -0.7], [0.9, -0.3]];
        fronds.forEach(([dx, dy]) => {
            for (let s = 1; s <= 3; s++) {
                const fx = cx + dx * w * 0.14 * s + (s === 3 ? Math.round(sway) : 0);
                const fy = cy + dy * h * 0.08 * s;
                ctx.fillStyle = s === 3 ? '#4E9C5A' : '#3E7C4A';
                ctx.fillRect(Math.round(fx) - 2, Math.round(fy) - 2, 4, 4);
            }
        });
    }

    drawTinaja(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const t = this.game.animationFrame;
        const R = (bx, by, bw, bh, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x + bx), Math.round(y + by), Math.round(bw), Math.round(bh)); };
        // Pale granite basin (cross of rects reads as a rounded tank)
        R(w * 0.14, 0, w * 0.72, h, '#C8C0B0');
        R(0, h * 0.25, w, h * 0.5, '#C8C0B0');
        // Shadowed inner rim
        R(w * 0.2, h * 0.18, w * 0.6, h * 0.64, '#A69C88');
        R(w * 0.1, h * 0.34, w * 0.8, h * 0.32, '#A69C88');
        // Water
        R(w * 0.26, h * 0.24, w * 0.48, h * 0.52, '#2A5A8A');
        R(w * 0.16, h * 0.38, w * 0.68, h * 0.24, '#2A5A8A');
        R(w * 0.3, h * 0.32, w * 0.4, h * 0.36, '#3B77AC');
        // Ripple + glints
        const rp = (t % 80) / 80;
        ctx.fillStyle = `rgba(200, 230, 255, ${0.5 * (1 - rp)})`;
        ctx.fillRect(Math.round(x + w * 0.5 - (2 + rp * 10)), Math.round(y + h * 0.5), Math.round(4 + rp * 20), 1);
        if (t % 50 < 12) { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(Math.round(x + w * 0.4), Math.round(y + h * 0.44), 2, 2); }
        // Granite highlight
        R(w * 0.14, 0, w * 0.08, h, 'rgba(255,255,255,0.12)');
    }

    drawGraniteBoulder(ctx) {
        const base = this.objData.color || '#C8BEA8';
        const P = { b: base, d: this.shade(base, -0.28), l: this.shade(base, 0.2) };
        const variant = (Math.round(this.x) + Math.round(this.y)) % 2;
        const rows = variant === 0 ? [
            "...dddddd...",
            ".ddbbbbbbdd.",
            "dblbbbbbbbbd",
            "dllbbbbbbbbd",
            "dbbbbbbbbdbd",
            "dbbbbbbdbbbd",
            ".ddbbbbbbdd.",
            "..dddddddd..",
        ] : [
            "..dd...ddd..",
            ".dbbdddbbbd.",
            "dblbbbbbbbbd",
            "dllbbbbdbbbd",
            "dbbbbbbbbbbd",
            "dbbdbbbbbdbd",
            ".dbbbbbbbbd.",
            "..dddddddd..",
        ];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x, this.y + this.height - rows.length * scale, scale);
    }

    drawPetroglyphCliff(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const B = '#3A3546', D = '#2E2A38', L = '#4A4557', g = '#D8C8A8';
        const R = (bx, by, bw, bh, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x + bx), Math.round(y + by), Math.round(bw), Math.round(bh)); };
        // Blocky basalt cliff face
        R(w * 0.04, h * 0.14, w * 0.92, h * 0.86, B);
        R(w * 0.1, h * 0.04, w * 0.78, h * 0.14, B);
        R(0, h * 0.4, w, h * 0.5, B);
        R(0, h * 0.82, w, h * 0.18, D);          // shadowed base
        R(w * 0.04, h * 0.14, w * 0.06, h * 0.7, L);  // sunlit left edge
        // Desert-varnish streaks
        R(w * 0.3, h * 0.16, 2, h * 0.5, D);
        R(w * 0.62, h * 0.2, 2, h * 0.45, D);
        // Pecked glyphs stamped across the face
        const stamp = (rows, gx, gy, s) => this.drawPixels(ctx, rows, { g }, x + gx, y + gy, s);
        const spiral = ["ggggg", "g....", "g.gg.", "g..g.", "gggg."];
        const star = ["..g..", "g.g.g", ".ggg.", "g.g.g", "..g.."];
        const figure = [".g.", "ggg", ".g.", ".g.", "g.g"];
        const sheep = ["g...g.", "gggggg", "g....g"];
        stamp(spiral, w * 0.12, h * 0.24, 3);
        stamp(star, w * 0.74, h * 0.2, 3);
        stamp(figure, w * 0.46, h * 0.34, 4);
        stamp(sheep, w * 0.28, h * 0.62, 3);
        stamp(figure, w * 0.62, h * 0.58, 3);
    }

    drawGreatHouse(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const hour = Math.floor((this.game.gameTime % 86400) / 3600);
        const duskLight = hour >= 17 && hour < 20;
        const tan = '#C9A876', light = '#D8B98A', dark = '#A67C4E', shadow = '#8A6238', port = '#241A10';
        const blk = (bx, by, bw, bh, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x + bx), Math.round(y + by), Math.round(bw), Math.round(bh)); };

        // Battered base (wider at the foot, like the real caliche walls)
        blk(-5, h - 12, w + 10, 12, shadow);
        blk(-3, h - 20, w + 6, 10, dark);
        // Main body
        blk(2, h * 0.08, w - 4, h * 0.92, tan);
        // Sunlit left face
        blk(2, h * 0.08, w * 0.12, h * 0.9, light);
        // Eroded parapet top with crenellation gaps
        blk(6, 0, w - 12, h * 0.1, tan);
        blk(w * 0.28, 0, w * 0.1, h * 0.05, shadow);
        blk(w * 0.62, 0, w * 0.1, h * 0.05, shadow);
        // Floor string-courses (four stories)
        for (const fy of [0.3, 0.5, 0.7]) blk(2, h * fy, w - 4, 3, shadow);
        // Rectangular window ports in a grid
        ctx.fillStyle = port;
        for (const py of [0.2, 0.4, 0.6, 0.82]) {
            for (const px of [0.28, 0.5, 0.72]) {
                if (py > 0.75 && px === 0.5) continue; // doorway takes the center-bottom
                ctx.fillRect(Math.round(x + w * px - 5), Math.round(y + h * py), 10, 12);
            }
        }
        // Ground-floor doorway
        blk(w * 0.42, h * 0.8, w * 0.16, h * 0.2, port);
        // Vertical erosion crack
        blk(w * 0.6, h * 0.12, 2, h * 0.6, shadow);
        // The famous solstice port: a stepped round aperture high on the wall
        const cx = x + w * 0.5, cy = y + h * 0.16;
        ctx.fillStyle = duskLight ? '#FFD24A' : port;
        ctx.fillRect(Math.round(cx - 4), Math.round(cy - 7), 8, 14);
        ctx.fillRect(Math.round(cx - 7), Math.round(cy - 4), 14, 8);
        ctx.fillRect(Math.round(cx - 6), Math.round(cy - 6), 12, 12);
        if (duskLight) {
            // A shaft of light spears out through the port at dusk
            const glow = 0.6 + Math.sin(this.game.animationFrame * 0.05) * 0.15;
            ctx.fillStyle = `rgba(255, 210, 100, ${glow})`;
            ctx.fillRect(Math.round(cx - 3), Math.round(cy + 6), 6, Math.round(h * 0.2));
            ctx.fillRect(Math.round(cx - 6), Math.round(cy + h * 0.2), 12, 10);
            ctx.fillStyle = '#FFEC9A';
            ctx.fillRect(Math.round(cx - 2), Math.round(cy - 2), 4, 4);
        }
    }

    drawCanopyPost(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const steel = '#8A8A8A', dk = '#5F5F5F', lt = '#B0B0B0';
        ctx.fillStyle = steel;
        ctx.fillRect(Math.round(x + w * 0.3), y, Math.round(w * 0.4), h);
        ctx.fillStyle = lt;
        ctx.fillRect(Math.round(x + w * 0.3), y, 2, h);
        ctx.fillStyle = dk;
        ctx.fillRect(Math.round(x + w * 0.6), y, 2, h);
        // Riveted top bracket where the roof beam would sit
        ctx.fillStyle = steel;
        ctx.fillRect(x, y, w, 6);
        ctx.fillStyle = dk;
        ctx.fillRect(x + 1, y + 2, 2, 2);
        ctx.fillRect(x + w - 3, y + 2, 2, 2);
        // Concrete footing
        ctx.fillStyle = '#7A7068';
        ctx.fillRect(x, y + h - 5, w, 5);
    }

    drawCompoundWall(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const tan = '#B89A6E', dark = '#96794F', cap = '#C9AE82';
        ctx.fillStyle = tan;
        ctx.fillRect(x, y + 4, w, h - 4);
        // Capstone
        ctx.fillStyle = cap;
        ctx.fillRect(x, y, w, 5);
        // Adobe block seams
        ctx.fillStyle = dark;
        for (let i = 1; i * 20 < w; i++) ctx.fillRect(x + i * 20, y + 5, 1.5, h - 5);
        ctx.fillRect(x, y + h * 0.55, w, 1.5);
        // Eroded top gaps
        ctx.fillStyle = tan;
        ctx.fillRect(x + w * 0.3, y, 8, 3);
        ctx.fillRect(x + w * 0.7, y, 6, 3);
    }

    drawBallcourt(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const rim = '#C3A374', slope = '#A6844F', floor = '#8A6A3E', shad = '#6E5230';
        // Raised rim berms (top and bottom)
        ctx.fillStyle = rim;
        ctx.fillRect(Math.round(x + w * 0.1), Math.round(y), Math.round(w * 0.8), Math.round(h * 0.2));
        ctx.fillRect(Math.round(x + w * 0.1), Math.round(y + h * 0.8), Math.round(w * 0.8), Math.round(h * 0.2));
        // Sunken oval, stepped inward
        ctx.fillStyle = slope;
        ctx.fillRect(Math.round(x + w * 0.06), Math.round(y + h * 0.18), Math.round(w * 0.88), Math.round(h * 0.64));
        ctx.fillStyle = floor;
        ctx.fillRect(Math.round(x + w * 0.14), Math.round(y + h * 0.3), Math.round(w * 0.72), Math.round(h * 0.4));
        ctx.fillStyle = shad;
        ctx.fillRect(Math.round(x + w * 0.14), Math.round(y + h * 0.3), Math.round(w * 0.72), 3);
        // End goals (rounded ends read as darker notches)
        ctx.fillStyle = shad;
        ctx.fillRect(Math.round(x + w * 0.02), Math.round(y + h * 0.42), Math.round(w * 0.06), Math.round(h * 0.16));
        ctx.fillRect(Math.round(x + w * 0.92), Math.round(y + h * 0.42), Math.round(w * 0.06), Math.round(h * 0.16));
    }

    drawHoleInTheRock(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const hour = Math.floor((this.game.gameTime % 86400) / 3600);
        const dawnLight = hour >= 5 && hour < 8;
        // Sandstone butte, stepped like coarse strata
        const P = { r: '#C97B5A', d: '#B06A4C', s: '#A05A40', k: '#2A1A12' };
        const rows = [
            "......rrrrrrrr......",
            "....rrrrrrrrrrrr....",
            "...rrrrrrrrrrrrrr...",
            "..rrrrrrrrkkrrrrrr..",
            "..rrddrrrkkkkrrrrr..",
            ".rrrrrrrkkkkkkrrddr.",
            ".rrrrrrrkkkkkkrrrrr.",
            "rrddrrrrrkkkkrrrrrrr",
            "rrrrrrrrrrkkrrrddrrr",
            "rsrrrrddrrrrrrrrrrsr",
            "rrrrsrrrrrrsrrrrrrrr",
        ];
        const scale = w / rows[0].length;
        this.drawPixels(ctx, rows, P, x, y + h - rows.length * scale, scale);
        // Dawn: stepped light shaft through the opening onto the ground
        if (dawnLight) {
            const flicker = 0.5 + Math.sin(this.game.animationFrame * 0.05) * 0.1;
            ctx.fillStyle = `rgba(255, 215, 120, ${flicker})`;
            ctx.fillRect(Math.round(x + w * 0.44), Math.round(y + h * 0.42), Math.round(w * 0.12), Math.round(h * 0.3));
            ctx.fillRect(Math.round(x + w * 0.4), Math.round(y + h * 0.72), Math.round(w * 0.2), Math.round(h * 0.2));
            ctx.fillRect(Math.round(x + w * 0.36), Math.round(y + h * 0.92), Math.round(w * 0.28), Math.round(h * 0.14) + 8);
            // Lit basin on the floor
            ctx.fillStyle = `rgba(255, 240, 180, ${Math.min(1, flicker + 0.2)})`;
            ctx.fillRect(Math.round(x + w * 0.42), Math.round(y + h + 4), Math.round(w * 0.16), 4);
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
        ctx.fillRect(Math.round(x + w * 0.5) - 10, Math.round(y + h) - 6, 20, 4);
        ctx.fillRect(Math.round(x + w * 0.5) - 6, Math.round(y + h) - 2, 12, 2);
    }

    // Deterministic per-object randomness for procedural rock faces
    seededRand() {
        let seed = ((Math.round(this.x) * 31 + Math.round(this.y) * 17 + this.width * 7) >>> 0) || 1;
        return () => {
            seed = (seed * 1103515245 + 12345) >>> 0;
            return (seed >>> 8) / 16777216;
        };
    }

    // Walker's '61 Ford, nose east, dust up to the door handles
    drawPickupTruck(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const body = '#4E8A8A', shade = '#3A6A6A', rust = '#8A5A3A', glass = '#1E2E38', tire = '#1A1A1A', hub = '#8A8A82';
        // Bed (west) and body line
        ctx.fillStyle = body;
        ctx.fillRect(x, y + h * 0.34, w, h * 0.4);
        ctx.fillStyle = shade;
        ctx.fillRect(x, y + h * 0.6, w, h * 0.14);
        ctx.fillRect(x, y + h * 0.34, w * 0.04, h * 0.4); // tailgate edge
        // Cab (east) with windows
        ctx.fillStyle = body;
        ctx.fillRect(x + w * 0.52, y + h * 0.08, w * 0.3, h * 0.3);
        ctx.fillStyle = glass;
        ctx.fillRect(x + w * 0.56, y + h * 0.13, w * 0.1, h * 0.2);
        ctx.fillRect(x + w * 0.7, y + h * 0.13, w * 0.09, h * 0.2);
        // Hood/nose
        ctx.fillStyle = body;
        ctx.fillRect(x + w * 0.8, y + h * 0.24, w * 0.2, h * 0.16);
        ctx.fillStyle = '#E8DCA0'; // headlight
        ctx.fillRect(x + w - 4, y + h * 0.3, 3, 4);
        // Rust patches and dust skirt
        ctx.fillStyle = rust;
        ctx.fillRect(x + w * 0.12, y + h * 0.52, 8, 5);
        ctx.fillRect(x + w * 0.62, y + h * 0.4, 6, 4);
        ctx.fillStyle = 'rgba(210, 180, 140, 0.5)';
        ctx.fillRect(x, y + h * 0.66, w, h * 0.08);
        // Wheels: stepped discs
        [x + w * 0.18, x + w * 0.72].forEach(wx => {
            ctx.fillStyle = tire;
            ctx.fillRect(Math.round(wx) - 7, y + h * 0.68, 14, h * 0.28);
            ctx.fillRect(Math.round(wx) - 9, y + h * 0.74, 18, h * 0.16);
            ctx.fillStyle = hub;
            ctx.fillRect(Math.round(wx) - 3, y + h * 0.78, 6, h * 0.08);
        });
    }

    // Green-barked nurse tree with a young saguaro in its shade
    drawPaloVerde(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const rand = this.seededRand();
        const bark = '#7A9A4A', barkDark = '#5E7C38', leaf = '#A8C86A', leafDim = '#8FAE54', bloom = '#E8D84A';
        // Trunk, forking
        ctx.fillStyle = bark;
        ctx.fillRect(x + w * 0.44, y + h * 0.5, 7, h * 0.5);
        ctx.fillStyle = barkDark;
        ctx.fillRect(x + w * 0.48, y + h * 0.5, 3, h * 0.5);
        // Branches: stepped diagonals out and up
        ctx.fillStyle = bark;
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(Math.round(x + w * 0.46 - i * 7), Math.round(y + h * 0.46 - i * 6), 6, 4);
            ctx.fillRect(Math.round(x + w * 0.5 + i * 7), Math.round(y + h * 0.44 - i * 5), 6, 4);
        }
        // Airy canopy: scattered leaf clusters, never a solid mass
        for (let i = 0; i < 26; i++) {
            const px = x + 2 + rand() * (w - 8);
            const py = y + rand() * (h * 0.5);
            ctx.fillStyle = rand() < 0.5 ? leaf : leafDim;
            ctx.fillRect(Math.round(px), Math.round(py), 4, 3);
            if (rand() < 0.18) {
                ctx.fillStyle = bloom;
                ctx.fillRect(Math.round(px) + 1, Math.round(py) - 2, 2, 2);
            }
        }
        // The young saguaro it shelters
        ctx.fillStyle = '#2D7D40';
        ctx.fillRect(x + w * 0.74, y + h * 0.68, 8, h * 0.32);
        ctx.fillStyle = '#1E532D';
        ctx.fillRect(x + w * 0.78, y + h * 0.68, 2, h * 0.32);
    }

    // Institutional plaster with a baseboard: the least romantic wall in the game
    drawInteriorWall(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        ctx.fillStyle = '#8A8578';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#9A9588';
        ctx.fillRect(x, y, w, 4);
        ctx.fillStyle = '#5A554A';
        ctx.fillRect(x, y + h - 6, w, 6);
        ctx.fillStyle = '#7A7568';
        ctx.fillRect(x + w - 3, y, 3, h);
    }

    drawBookshelf(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const rand = this.seededRand();
        // Case
        ctx.fillStyle = '#6B4A2E';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#503620';
        ctx.fillRect(x, y, w, 4);
        // Three shelves of spines
        const spineColors = ['#8A3A2E', '#3A5A7A', '#6E7C3A', '#8A6E3A', '#5A4A6E', '#7A7A72'];
        for (let s = 0; s < 3; s++) {
            const sy = y + 8 + s * ((h - 14) / 3);
            const sh = (h - 14) / 3 - 6;
            ctx.fillStyle = '#3A2A1A';
            ctx.fillRect(x + 4, sy, w - 8, sh + 4);
            let bx = x + 5;
            while (bx < x + w - 9) {
                const bw = 4 + Math.floor(rand() * 4);
                const lean = rand() < 0.12 ? 2 : 0;
                ctx.fillStyle = spineColors[Math.floor(rand() * spineColors.length)];
                ctx.fillRect(bx, sy + 2 + lean, bw, sh - lean);
                bx += bw + 1;
            }
            ctx.fillStyle = '#503620';
            ctx.fillRect(x + 2, sy + sh + 2, w - 4, 3);
        }
    }

    // Camelback granite: sage-grey ledges with brush growing out of the cracks
    drawMountainSlope(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const rand = this.seededRand();
        const bands = ['#8A8A72', '#7C7C66', '#94947C', '#70705C'];
        const bandH = 11;
        for (let by = 0; by < h; by += bandH) {
            ctx.fillStyle = bands[Math.floor(by / bandH) % bands.length];
            ctx.fillRect(x, y + by, w, Math.min(bandH, h - by));
        }
        // Sunlit ledge top, shaded base
        ctx.fillStyle = '#AAAA90';
        ctx.fillRect(x, y, w, 4);
        ctx.fillStyle = 'rgba(30, 30, 20, 0.3)';
        ctx.fillRect(x, y + h - 5, w, 5);
        // Embedded boulders
        for (let i = 0; i < Math.max(2, Math.floor(w / 70)); i++) {
            const bx = x + rand() * (w - 22);
            const by = y + 6 + rand() * (h - 20);
            ctx.fillStyle = '#767662';
            ctx.fillRect(Math.round(bx), Math.round(by), 16 + Math.round(rand() * 8), 8 + Math.round(rand() * 5));
            ctx.fillStyle = '#9A9A82';
            ctx.fillRect(Math.round(bx) + 2, Math.round(by), 8, 3);
        }
        // Brittlebush and jojoba out of the cracks
        for (let i = 0; i < Math.max(2, Math.floor(w / 60)); i++) {
            const px = x + 4 + rand() * (w - 14);
            const py = y + 4 + rand() * (h - 14);
            ctx.fillStyle = '#5A6B4A';
            ctx.fillRect(Math.round(px), Math.round(py), 5, 4);
            ctx.fillRect(Math.round(px) + 2, Math.round(py) - 2, 2, 3);
            if (rand() < 0.4) {
                ctx.fillStyle = '#E8C84A'; // brittlebush bloom
                ctx.fillRect(Math.round(px) + 3, Math.round(py) - 3, 2, 2);
            }
        }
    }

    // The kneeling red sandstone figure at the camel's head, facing east
    drawPrayingMonk(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const red = '#C1583A', dark = '#9A4630', light = '#D97B52';
        // Kneeling base
        ctx.fillStyle = red;
        ctx.fillRect(x, y + h * 0.68, w, h * 0.32);
        ctx.fillStyle = dark;
        ctx.fillRect(x + w * 0.6, y + h * 0.68, w * 0.4, h * 0.32);
        // Torso, leaning slightly east
        ctx.fillStyle = red;
        ctx.fillRect(x + w * 0.16, y + h * 0.26, w * 0.44, h * 0.46);
        ctx.fillStyle = dark;
        ctx.fillRect(x + w * 0.46, y + h * 0.26, w * 0.14, h * 0.46);
        // Head
        ctx.fillStyle = red;
        ctx.fillRect(x + w * 0.2, y, w * 0.32, h * 0.24);
        ctx.fillStyle = light;
        ctx.fillRect(x + w * 0.2, y, w * 0.32, 4);
        ctx.fillRect(x + w * 0.16, y + h * 0.26, 3, h * 0.46); // west rim light
        // Praying hands: a nub raised toward the sunrise
        ctx.fillStyle = red;
        ctx.fillRect(x + w * 0.62, y + h * 0.3, w * 0.16, h * 0.26);
        ctx.fillStyle = light;
        ctx.fillRect(x + w * 0.62, y + h * 0.3, w * 0.16, 3);
        // Rubble at the base
        ctx.fillStyle = dark;
        ctx.fillRect(x - 4, y + h - 5, w + 8, 5);
    }

    // Packed dirt switchback, boot prints and all
    drawTrailPath(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const rand = this.seededRand();
        ctx.fillStyle = '#C9B189';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#B49A70';
        ctx.fillRect(x, y, w, 2);
        ctx.fillRect(x, y + h - 2, w, 2);
        // Boot prints in pairs, following the long axis
        const vertical = h > w;
        const steps = Math.max(2, Math.floor((vertical ? h : w) / 26));
        for (let i = 0; i < steps; i++) {
            const t = (i + 0.5) / steps;
            const px = vertical ? x + w * 0.3 + rand() * w * 0.4 : x + w * t;
            const py = vertical ? y + h * t : y + h * 0.25 + rand() * h * 0.5;
            ctx.fillStyle = 'rgba(140, 115, 80, 0.75)';
            ctx.fillRect(Math.round(px), Math.round(py), 3, 5);
            ctx.fillRect(Math.round(px) + 5, Math.round(py) + 3, 3, 5);
        }
        // Kicked pebbles
        for (let i = 0; i < Math.max(2, (w * h) / 1800); i++) {
            ctx.fillStyle = '#A89068';
            ctx.fillRect(Math.round(x + rand() * (w - 3)), Math.round(y + rand() * (h - 3)), 2, 2);
        }
    }

    drawCanyonWall(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const rand = this.seededRand();
        // Sedimentary strata bands
        const bands = ['#B0603A', '#9C5230', '#C1703E', '#8B4A2C', '#A85838'];
        const bandH = 12;
        for (let by = 0; by < h; by += bandH) {
            ctx.fillStyle = bands[Math.floor(by / bandH) % bands.length];
            ctx.fillRect(x, y + by, w, Math.min(bandH, h - by));
        }
        // Sunlit rim and shadowed base
        ctx.fillStyle = '#D98B57';
        ctx.fillRect(x, y, w, 4);
        ctx.fillStyle = 'rgba(40, 15, 5, 0.35)';
        ctx.fillRect(x, y + h - 6, w, 6);
        // Desert-varnish streaks bleeding down from the rim
        for (let i = 0; i < Math.max(2, Math.floor(w / 40)); i++) {
            const vx = x + rand() * (w - 8);
            ctx.fillStyle = 'rgba(52, 30, 40, 0.3)';
            ctx.fillRect(Math.round(vx), y + 4, 5, Math.round(8 + rand() * h * 0.45));
        }
        // Vertical fracture cracks
        for (let i = 0; i < Math.max(2, Math.floor(w / 55)); i++) {
            const cx = x + 4 + rand() * (w - 10);
            const ch = 8 + rand() * h * 0.5;
            const cy = y + rand() * (h - ch);
            ctx.fillStyle = 'rgba(60, 20, 8, 0.5)';
            ctx.fillRect(Math.round(cx), Math.round(cy), 2, Math.round(ch));
        }
        // Rubble at the foot
        for (let i = 0; i < Math.max(2, Math.floor(w / 60)); i++) {
            const rx = x + rand() * (w - 10);
            ctx.fillStyle = '#8B4A2C';
            ctx.fillRect(Math.round(rx), y + h - 4, 6 + Math.round(rand() * 5), 4);
        }
    }

    drawBalancedRock(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // The cap: a huge stepped boulder
        ctx.fillStyle = '#B0603A';
        ctx.fillRect(x + 4, y + 8, w - 8, h * 0.34);
        ctx.fillRect(x, y + 14, w, h * 0.24);
        ctx.fillRect(x + 8, y, w - 16, 12);
        ctx.fillStyle = '#D98B57';
        ctx.fillRect(x + 8, y, w - 16, 3);
        ctx.fillStyle = '#8B4A2C';
        ctx.fillRect(x + 4, y + h * 0.3, w - 8, 6);
        // The impossible neck
        ctx.fillStyle = '#9C5230';
        ctx.fillRect(x + w / 2 - 5, y + h * 0.38, 10, h * 0.34);
        ctx.fillStyle = '#7A3E24';
        ctx.fillRect(x + w / 2 + 2, y + h * 0.38, 3, h * 0.34);
        // Base mound
        ctx.fillStyle = '#A85838';
        ctx.fillRect(x + w / 2 - 14, y + h * 0.72, 28, h * 0.16);
        ctx.fillRect(x + w / 2 - 20, y + h * 0.84, 40, h * 0.16);
        // Daylight showing under the cap, either side of the neck
        ctx.fillStyle = '#BC6C25';
        ctx.fillRect(x + 6, y + h * 0.36, w / 2 - 12, 2);
        ctx.fillRect(x + w / 2 + 6, y + h * 0.36, w / 2 - 12, 2);
    }

    drawDryWash(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const rand = this.seededRand();
        // Pale flood-scoured sand
        ctx.fillStyle = '#D8B98C';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#C9A876';
        ctx.fillRect(x, y, w, 3);
        ctx.fillRect(x, y + h - 3, w, 3);
        // Meander lines left by the last flow
        ctx.fillStyle = 'rgba(160, 120, 70, 0.5)';
        for (let i = 0; i < 3; i++) {
            const ly = y + 6 + i * (h - 12) / 3;
            for (let sx = 0; sx < w - 14; sx += 22) {
                ctx.fillRect(x + sx + ((i * 7 + sx / 22) % 3) * 4, Math.round(ly + Math.sin(sx * 0.05 + i) * 2), 14, 2);
            }
        }
        // Tumbled gravel
        for (let i = 0; i < w / 24; i++) {
            const gx = x + rand() * (w - 6);
            const gy = y + 4 + rand() * (h - 10);
            ctx.fillStyle = rand() < 0.5 ? '#B99868' : '#8B7355';
            ctx.fillRect(Math.round(gx), Math.round(gy), 3 + Math.round(rand() * 3), 3);
        }
    }

    drawSrpCanal(ctx) {
        const t = this.game.animationFrame;
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Concrete banks
        ctx.fillStyle = '#B8B0A0';
        ctx.fillRect(x, y, w, 6);
        ctx.fillRect(x, y + h - 6, w, 6);
        ctx.fillStyle = '#98907E';
        ctx.fillRect(x, y + 4, w, 2);
        ctx.fillRect(x, y + h - 6, w, 2);
        // Water
        ctx.fillStyle = '#2A5A8A';
        ctx.fillRect(x, y + 6, w, h - 12);
        // Eastward flow streaks
        for (let i = 0; i < Math.max(2, Math.floor(w / 56)); i++) {
            const lane = y + 12 + (i % 3) * Math.max(8, (h - 24) / 3);
            const fx = x + ((i * 53 + t * 0.9) % Math.max(24, w - 26));
            ctx.fillStyle = '#3B77AC';
            ctx.fillRect(Math.round(fx), Math.round(lane), 22, 3);
            ctx.fillStyle = '#4E8FC4';
            ctx.fillRect(Math.round(fx) + 6, Math.round(lane) + 4, 12, 2);
        }
        // Sun glint
        if (t % 60 < 10) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(Math.round(x + w * 0.3 + (t % 5) * 8), Math.round(y + h * 0.45), 2, 2);
        }
    }

    drawFootbridge(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Planks across the water
        for (let i = 0; i < 7; i++) {
            ctx.fillStyle = i % 2 === 0 ? '#8A6B45' : '#7A5E3C';
            ctx.fillRect(x + 4, y + 4 + i * (h - 8) / 7, w - 8, (h - 8) / 7 - 1);
        }
        // Rails
        ctx.fillStyle = '#5E4A34';
        ctx.fillRect(x, y, 4, h);
        ctx.fillRect(x + w - 4, y, 4, h);
        ctx.fillRect(x, y, w, 3);
        ctx.fillRect(x, y + h - 3, w, 3);
    }

    drawWindChime(ctx) {
        const t = this.game.animationFrame;
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const sway = Math.round(Math.sin(t * 0.06) * 2);
        // Bracket
        ctx.fillStyle = '#5E4A34';
        ctx.fillRect(x, y, 4, 8);
        ctx.fillRect(x, y, w, 3);
        // Hanging copper tubes, staggered lengths, swaying together
        ctx.fillStyle = '#B87333';
        ctx.fillRect(x + 3 + sway, y + 4, 2, h * 0.55);
        ctx.fillRect(x + 7 + sway, y + 4, 2, h * 0.75);
        ctx.fillRect(x + 11 + sway, y + 4, 2, h * 0.62);
        // A ring note
        if (t % 70 < 8) {
            ctx.fillStyle = '#FFF0C0';
            ctx.fillRect(x + 8 + sway, Math.round(y + h * 0.8), 2, 2);
        }
    }

    drawStoneNeedle(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        const base = '#6B5B4A', dark = '#54463A', warm = '#8A7052';
        // Tapering volcanic spire, stacked slabs narrowing upward
        const slabs = 8;
        for (let i = 0; i < slabs; i++) {
            const t2 = i / slabs; // 0 at top
            const sw = w * (0.3 + 0.7 * t2);
            const sx = x + (w - sw) / 2 + Math.round(Math.sin(i * 2.7) * 3);
            const sy = y + h * t2;
            const sh = h / slabs + 1;
            ctx.fillStyle = base;
            ctx.fillRect(Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh));
            // Shadow side (east face stays dark until evening)
            ctx.fillStyle = dark;
            ctx.fillRect(Math.round(sx + sw * 0.62), Math.round(sy), Math.round(sw * 0.38), Math.round(sh));
            // Warm rim light on the west edge
            ctx.fillStyle = warm;
            ctx.fillRect(Math.round(sx), Math.round(sy), 3, Math.round(sh));
        }
        // The summit block
        ctx.fillStyle = dark;
        ctx.fillRect(Math.round(x + w / 2 - 4), y - 6, 8, 8);
    }

    // Only exists under the blacklight: fluorescing pigment, chalk, minerals
    drawUvTrace(ctx) {
        if (!this.game.uvActive) return;
        const t = this.game.animationFrame;
        const rand = this.seededRand();
        const pulse = 0.55 + Math.sin(t * 0.06) * 0.25;
        for (let i = 0; i < 9; i++) {
            const px = this.x + rand() * this.width;
            const py = this.y + rand() * this.height;
            ctx.fillStyle = i % 3 === 0
                ? `rgba(160, 255, 190, ${pulse})`
                : `rgba(110, 220, 255, ${pulse * 0.8})`;
            ctx.fillRect(Math.round(px), Math.round(py), 2 + (i % 2), 2);
        }
        // A soft halo so the find reads at a glance
        ctx.fillStyle = `rgba(120, 240, 200, ${pulse * 0.12})`;
        ctx.fillRect(this.x - 6, this.y - 6, this.width + 12, this.height + 12);
    }

    drawOfferingLedge(ctx) {
        const x = this.x, y = this.y, w = this.width, h = this.height;
        // Stone shelf
        ctx.fillStyle = '#5A4A5A';
        ctx.fillRect(x, y + h * 0.4, w, h * 0.6);
        ctx.fillStyle = '#6A5A6A';
        ctx.fillRect(x - 2, y + h * 0.3, w + 4, h * 0.25);
        // The offerings that were here long before you
        ctx.fillStyle = '#E8E0D0';   // shell beads, gone chalky
        ctx.fillRect(x + 6, y + h * 0.15, 3, 3);
        ctx.fillRect(x + 11, y + h * 0.18, 2, 2);
        ctx.fillStyle = '#C97B5A';   // pot sherd
        ctx.fillRect(x + w - 14, y + h * 0.12, 6, 4);
        ctx.fillStyle = '#40C4B0';   // a turquoise chip
        ctx.fillRect(x + w * 0.5 - 1, y + h * 0.2, 2, 2);
        // Yours, once given
        if (this.objData.gifted) {
            ctx.fillStyle = '#C8A868';
            ctx.fillRect(x + w * 0.5 - 4, y + h * 0.05, 8, 5);
            if (this.game.animationFrame % 80 < 10) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(x + w * 0.5 + 3, y + h * 0.02, 2, 2);
            }
        }
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
        const P = { p: '#3A2B1A', k: '#241A0F', m: '#A88B62', f: '#6B5B45' };
        const rows = [
            "..........mm..",
            ".........mmmm.",
            "..pppp...mmmm.",
            ".ppkkpp..mmmm.",
            "ppkkkkpp..mm..",
            ".ppkkpp.ffff..",
            "..pppp..f..f..",
        ];
        const scale = this.width / rows[0].length;
        this.drawPixels(ctx, rows, P, this.x, this.y + this.height - rows.length * scale, scale);
    }

    // Record a lasting change to this object (opened, spent trigger) in the game's
    // per-map state so it survives map transitions and checkpoint reloads.
    persistState(patch) {
        if (this.mapIndex < 0 || !this.game.currentMapName) return;
        const ms = this.game.mapState;
        const entry = ms[this.game.currentMapName] = ms[this.game.currentMapName] || { objects: {} };
        entry.objects[this.mapIndex] = { ...entry.objects[this.mapIndex], ...patch };
        this.game.saveGame();
    }

    onInteract(player) {
        // UV traces don't exist for you until the lamp says so
        if (this.objData.uv && !this.game.uvActive) return;

        // The offering ledge: give something up, permanently, to earn the vault
        if (this.type === 'offering_ledge') {
            if (player.quests.find(q => q.id === 'gift_left')) {
                this.game.ui.showDialog("Your offering sits among the older ones, already looking like it was always here. That's the idea.", "OFFERING LEDGE");
                this.game.setGameState(GAME_STATE.DIALOG);
                return;
            }
            const giftable = ['lucky_charm', 'rusted_canteen', 'old_pickaxe', 'prickly_pear'].filter(k => player.hasItem(k));
            const options = [];
            const offeringActions = [];
            if (giftable.length > 0) {
                options.push(`Leave the ${this.game.itemTypes[giftable[0]].name}`);
                offeringActions.push({ type: 'item', key: giftable[0] });
            }
            options.push('Pour out canteen water (-30 H2O)');
            offeringActions.push({ type: 'water' });
            options.push('Step back');
            offeringActions.push({ type: 'cancel' });
            while (options.length < 3) {
                options.push('Not yet');
                offeringActions.push({ type: 'cancel' });
            }
            this.game.currentPuzzle = {
                isOfferingChoice: true,
                offeringActions,
                question: "A worn stone ledge by the stair, dotted with small old gifts: shell, sherd, a chip of turquoise. Whoever came down here before you left something. What do you leave?",
                options,
            };
            this.game.setGameState(GAME_STATE.PUZZLE);
            return;
        }

        // Camp: choose to sleep until dawn or wait for dusk — time is a resource,
        // and the alignments only read at first light and crimson evening.
        if (this.objData.rest) {
            this.game.currentPuzzle = {
                isCampChoice: true,
                question: "The coals take. How long do you stay?",
                options: [
                    "Sleep until dawn (+20 HP, -15 H2O)",
                    "Wait for dusk (+10 HP, -10 H2O)",
                    "Break camp",
                ],
            };
            this.game.setGameState(GAME_STATE.PUZZLE);
            return;
        }

        // Storm shelter: when the haboob is up, ducking inside skips the worst of it
        if (this.objData.shelter && this.game.currentMap.haboob) {
            const phase = this.game.currentMap.haboob.phase;
            if (phase === 'approaching' || phase === 'engulfed') {
                this.game.currentMap.endHaboob();
                this.game.gameTime += 1800; // half an hour indoors
                this.game.ui.updateClock(this.game.gameTime);
                this.game.ui.showDialog("You duck inside. Vega pours coffee without asking, and the two of you listen to the world scour itself smooth. When the chime settles, it's over.", "SHELTER");
                this.game.setGameState(GAME_STATE.DIALOG);
                return;
            }
        }

        // Time-gated alignments: only read at the right hour
        if (this.objData.timeGated) {
            const tg = this.objData.timeGated;
            const hour = Math.floor((this.game.gameTime % 86400) / 3600);
            // Overnight windows wrap past midnight (e.g. start 20, end 5)
            const inWindow = tg.startHour <= tg.endHour
                ? (hour >= tg.startHour && hour < tg.endHour)
                : (hour >= tg.startHour || hour < tg.endHour);
            this.game.ui.showDialog(inWindow ? tg.successText : tg.failText, (this.objData.name || this.type).toUpperCase());
            this.game.setGameState(GAME_STATE.DIALOG);
            if (inWindow) {
                this.game.sound.playChime();
                if (tg.record) player.addQuest(tg.record);
            }
            return;
        }

        // Already holding the stick (e.g. reloaded mid-finale): the choice is still to make
        if (this.objData.triggersPuzzle && this.game.player && this.game.player.hasItem('final_artifact')) {
            this.game.startEndingChoice();
            return;
        }
        if (this.objData.triggersPuzzle && (!this.game.player || !this.game.player.hasItem('final_artifact')) && !this.objData.opened) {
            // You don't reach for the olla with empty-handed habits: give first
            if (!player.quests.find(q => q.id === 'gift_left')) {
                this.game.ui.showDialog("The olla waits, and your hands stop short of it. Thirty years of taking things out of the ground. There's a worn ledge back by the stair, dotted with small old gifts. Leave something first.", "THE VAULT");
                this.game.setGameState(GAME_STATE.DIALOG);
                return;
            }
            // The cache only reads at solstice dawn. Everything else about this game
            // taught you to wait; the finale asks you to do it on purpose.
            const date = this.game.gameDate;
            const hour = this.game.gameHour;
            if (date < 21) {
                this.game.advanceToSolsticeDawn();
                this.game.ui.showDialog("The final count on the stick ends at the solstice. Every reader before you did what you do now: you bank a small fire against the vault wall, ration the canteen, and wait for the one morning the whole instrument was built to catch. (June 21. First light.)", "THE VAULT");
                this.game.setGameState(GAME_STATE.DIALOG);
                this.game.saveGame(true);
                return;
            }
            if (hour < 5 || hour >= 8) {
                this.game.advanceToHour(5);
                this.game.ui.showDialog("You wait out the dark beside the 1912 benchmark, listening to water move somewhere under the floor. First light comes down the old stair like it has an appointment.", "THE VAULT");
                this.game.setGameState(GAME_STATE.DIALOG);
                return;
            }
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
        // Knowledge lock: carrying the pieces isn't the same as knowing the reading.
        // The alignments must have been witnessed — dawn light, doorway, horizon notch.
        if (this.objData.requiredRecords && !this.objData.isNowPortal) {
            const unread = this.objData.requiredRecords.filter(id => !player.quests.some(q => q.id === id));
            if (unread.length > 0) {
                const hints = unread.map(id => (this.objData.recordHints && this.objData.recordHints[id]) || id).join('; ');
                this.game.ui.showDialog("The three pieces slot together and the counts run unbroken... and still mean nothing to you. You have the pieces without the reading. Still to witness: " + hints + ".", (this.objData.name || this.type).toUpperCase());
                this.game.setGameState(GAME_STATE.DIALOG);
                if (!player.quests.find(q => q.id === 'learn_alignments')) {
                    player.addQuest({ id: 'learn_alignments', description: 'Witness the readings: the dawn light, the mound doorway, the horizon notch.', completed: false });
                }
                return;
            }
            player.completeQuest('learn_alignments');
        }

        // A passage already opened stays a passage
        if (this.objData.isNowPortal && this.objData.toMap) {
            this.game.changeMap(this.objData.toMap, this.objData.toX, this.objData.toY);
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
        if ((this.type === 'chest' || this.type === 'fruit_cactus') && this.objData.contains && !this.objData.opened) {
            if (player.addItem(this.objData.contains)) {
                this.game.ui.showDialog(this.objData.text || `You found a ${this.game.itemTypes[this.objData.contains].name}!`, this.type.toUpperCase());
                this.objData.opened = true;
                this.persistState({ opened: true });
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
        if (this.type === 'water_source' || this.type === 'well' || this.type === 'tinaja') {
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
            this.persistState({ questTriggerSpent: true });
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
