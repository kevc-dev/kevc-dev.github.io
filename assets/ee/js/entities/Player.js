import { Entity } from './Entity.js';
import {
    CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SPEED, HYDRATION_RATE,
    ANIMATION_CYCLE_FRAMES, WALK_FRAMES, DEHYDRATION_DAMAGE_INTERVAL,
    DEHYDRATION_DAMAGE, GAME_STATE,
    PLAYER_ATTACK_DAMAGE, PLAYER_ATTACK_RANGE, PLAYER_ATTACK_COOLDOWN,
    PLAYER_ATTACK_DURATION, PLAYER_ATTACK_KNOCKBACK
} from '../constants.js';

// Professor Walker: 12x16 pixel sprite. H=hat, h=brim shadow, s=skin, e=eye,
// B=grey beard/hair, r=shirt, d=shirt shadow, p=pants, o=boots, g=satchel.
const PLAYER_PALETTE = {
    H: '#8B5A2B', h: '#6B4522', s: '#E8C49C', e: '#2A1A0A', B: '#9A8C78',
    r: '#9E2B2B', d: '#7A1E1E', p: '#4A3B31', o: '#241608', g: '#C8A868',
};

// Bodies (rows 0-11) are shared per direction; leg sets make a 4-phase gait:
// stand -> stride A -> stand -> stride B.
const DOWN_BODY = [
    "....HHHH....",
    "..HHHHHHHH..",
    ".hhHHHHHHhh.",
    "..ssssssss..",
    "..ssessess..",
    "..sBBBBBBs..",
    "...BBBBBB...",
    "..srrddrrs..",
    "..srrrrrrs..",
    "...rrrrrr...",
    "...pppppp...",
    "...pppppp...",
];
const UP_BODY = [
    "....HHHH....",
    "..HHHHHHHH..",
    ".hhHHHHHHhh.",
    "..BBBBBBBB..",
    "..BBBBBBBB..",
    "..sBBBBBBs..",
    "...gggggg...",
    "..srrggrrs..",
    "..srrrrrrs..",
    "...rrrrrr...",
    "...pppppp...",
    "...pppppp...",
];
// Drawn facing right; flipped horizontally for 'left'
const SIDE_BODY = [
    "..HHHH......",
    ".HHHHHH.....",
    ".hHHHHHhhh..",
    "..sssss.....",
    "..ssses.....",
    "..sBBBB.....",
    "..sBBB......",
    "..rrrrs.....",
    "..rrrrrs....",
    "..rrrr......",
    "..pppp......",
    "..pppp......",
];
const LEGS_STAND = ["...pp..pp...", "...pp..pp...", "...oo..oo...", "..ooo..ooo.."];
const LEGS_A = ["...pp..pp...", "..pp...pp...", "..oo...oo...", ".ooo...ooo.."];
const LEGS_B = ["...pp..pp...", "...pp...pp..", "...oo...oo..", "..ooo...ooo."];
const SIDE_LEGS_STAND = ["..pp.pp.....", ".pp..pp.....", ".oo..oo.....", "ooo..oo....."];
const SIDE_LEGS_A = ["..pp.pp.....", "..pp...pp...", "..oo...oo...", ".ooo...ooo.."];
const SIDE_LEGS_B = ["..pp.pp.....", ".ppp.pp.....", ".ooo.oo.....", "oooo.oo....."];
const mkFrame = (body, legs) => [...body, ...legs];

const PLAYER_SPRITES = {
    down: [mkFrame(DOWN_BODY, LEGS_STAND), mkFrame(DOWN_BODY, LEGS_A), mkFrame(DOWN_BODY, LEGS_STAND), mkFrame(DOWN_BODY, LEGS_B)],
    up: [mkFrame(UP_BODY, LEGS_STAND), mkFrame(UP_BODY, LEGS_A), mkFrame(UP_BODY, LEGS_STAND), mkFrame(UP_BODY, LEGS_B)],
    side: [mkFrame(SIDE_BODY, SIDE_LEGS_STAND), mkFrame(SIDE_BODY, SIDE_LEGS_A), mkFrame(SIDE_BODY, SIDE_LEGS_STAND), mkFrame(SIDE_BODY, SIDE_LEGS_B)],
};

export class Player extends Entity {
    constructor(game, x, y) {
        super(game, x, y, 24, 32, 'player');
        this.collisionBox = { xOffset: 4, yOffset: 16, width: 16, height: 16 };
        this.speed = PLAYER_SPEED;
        this.direction = 'down';
        this.health = 100;
        this.maxHealth = 100;
        this.hydration = 100;
        this.maxHydration = 100;
        this.inventory = ['canteen', 'compass', 'newspaper', 'field_notebook'];
        this.quests = [{ id: "main_artifact", description: "Read the valley's alignments (M to track). Solstice: June 21.", completed: false }];
        this.isMoving = false;
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackCooldownTimer = 0;
        // Rattlesnake venom: a slow drain that makes you pay attention, not a death
        this.venomTicks = 0;
        // Brief invulnerability after a hit so overlapping enemies can't stunlock
        this.invulnTimer = 0;
    }

    applyVenom() {
        this.venomTicks = 8;
        if (this.game.particles) this.game.particles.floatText(this.centerX, this.y - 16, 'VENOM!', '#7CFC00');
    }

    update() {
        this.isMoving = false;
        let nextX = this.x;
        let nextY = this.y;
        let moveX = 0;
        let moveY = 0;

        if (this.game.input.isPressed('w') || this.game.input.isPressed('arrowup')) {
            moveY = -this.speed; this.direction = 'up'; this.isMoving = true;
        } else if (this.game.input.isPressed('s') || this.game.input.isPressed('arrowdown')) {
            moveY = this.speed; this.direction = 'down'; this.isMoving = true;
        }
        if (this.game.input.isPressed('a') || this.game.input.isPressed('arrowleft')) {
            moveX = -this.speed; this.direction = 'left'; this.isMoving = true;
        } else if (this.game.input.isPressed('d') || this.game.input.isPressed('arrowright')) {
            moveX = this.speed; this.direction = 'right'; this.isMoving = true;
        }

        // Normalize diagonal movement so it isn't ~40% faster than straight lines
        if (moveX !== 0 && moveY !== 0) {
            const inv = 1 / Math.SQRT2;
            moveX *= inv;
            moveY *= inv;
        }

        nextX += moveX;
        nextY += moveY;

        if (!this.game.currentMap.checkCollision(nextX + this.collisionBox.xOffset, this.y + this.collisionBox.yOffset, this.collisionBox.width, this.collisionBox.height)) {
            this.x = nextX;
        }
        if (!this.game.currentMap.checkCollision(this.x + this.collisionBox.xOffset, nextY + this.collisionBox.yOffset, this.collisionBox.width, this.collisionBox.height)) {
            this.y = nextY;
        }

        this.x = Math.max(0, Math.min(this.x, CANVAS_WIDTH - this.width));
        this.y = Math.max(0, Math.min(this.y, CANVAS_HEIGHT - this.height));

        this.animationFrame++;
        if (this.isMoving) {
            if (this.animationFrame % ANIMATION_CYCLE_FRAMES === 0) {
                this.spriteIndex = (this.spriteIndex + 1) % WALK_FRAMES;
            }
            if (this.animationFrame % 12 === 0 && this.game.particles) {
                this.game.particles.dust(this.centerX, this.y + this.height - 2);
            }
        } else {
            this.spriteIndex = 0;
        }

        // Combat timers & attack input (F or J)
        if (this.invulnTimer > 0) this.invulnTimer--;
        if (this.attackCooldownTimer > 0) this.attackCooldownTimer--;
        if (this.isAttacking) {
            this.attackTimer--;
            if (this.attackTimer <= 0) this.isAttacking = false;
        }
        if (this.game.input.isPressed('f') || this.game.input.isPressed('j')) {
            this.attack();
        }

        // Midday lethality band: 11am-4pm outdoors drains hydration much faster.
        const hour = this.game.gameHour;
        const indoors = this.game.currentMap && this.game.currentMap.indoor;
        const heatMult = (!indoors && hour >= 11 && hour < 16) ? 2.5 : 1;
        this.hydration -= (HYDRATION_RATE * heatMult) / 60;
        if (this.hydration < 0) this.hydration = 0;
        // Water is life: staying above 60% hydration slowly mends you
        if (this.hydration > 60 && this.health < this.maxHealth && this.animationFrame % 180 === 0) {
            this.heal(1);
        }
        if (this.hydration === 0 && this.animationFrame % DEHYDRATION_DAMAGE_INTERVAL === 0) {
            this.takeDamage(DEHYDRATION_DAMAGE, "Dehydration");
        }
        // Venom works slowly; prickly pear fruit clears it
        if (this.venomTicks > 0 && this.animationFrame % 300 === 0) {
            this.venomTicks--;
            this.takeDamage(2, "Venom");
        }
        this.game.ui.updateHydration(this.hydration, this.maxHydration);
    }

    draw(ctx) {
        // Post-hit invulnerability reads as a classic sprite flicker
        if (this.invulnTimer > 0 && this.game.animationFrame % 6 < 3) return;
        const frame = this.isMoving ? (this.spriteIndex % WALK_FRAMES) : 0;
        const key = this.direction === 'up' ? 'up'
                  : (this.direction === 'left' || this.direction === 'right') ? 'side'
                  : 'down';
        const rows = PLAYER_SPRITES[key][frame];
        const scale = this.width / 12;

        // Step bob on stride frames; a small lunge toward the swing while attacking
        const bob = this.isMoving && frame % 2 === 1 ? -1 : 0;
        let lungeX = 0, lungeY = 0;
        if (this.isAttacking) {
            const push = this.attackTimer > PLAYER_ATTACK_DURATION * 0.4 ? 2 : 1;
            switch (this.direction) {
                case 'up': lungeY = -push; break;
                case 'down': lungeY = push; break;
                case 'left': lungeX = -push; break;
                case 'right': lungeX = push; break;
            }
        }

        ctx.save();
        ctx.translate(lungeX, lungeY + bob);
        if (this.direction === 'left') {
            ctx.translate(this.centerX, 0);
            ctx.scale(-1, 1);
            ctx.translate(-this.centerX, 0);
        }
        this.drawPixels(ctx, rows, PLAYER_PALETTE, this.x, this.y, scale);
        ctx.restore();

        // Walking stick swing when attacking
        if (this.isAttacking) this.drawAttackSwing(ctx);
    }

    drawAttackSwing(ctx) {
        const progress = 1 - this.attackTimer / PLAYER_ATTACK_DURATION;
        let baseAngle = 0;
        switch (this.direction) {
            case 'right': baseAngle = 0; break;
            case 'down': baseAngle = Math.PI / 2; break;
            case 'left': baseAngle = Math.PI; break;
            case 'up': baseAngle = -Math.PI / 2; break;
        }
        const swing = (progress - 0.5) * Math.PI * 0.9;
        const a = baseAngle + swing;
        const dx = Math.cos(a), dy = Math.sin(a);
        // Stick as a chain of pixel segments along the swing angle
        ctx.fillStyle = '#8B5A2B';
        for (let s = 2; s <= 5; s++) {
            ctx.fillRect(Math.round(this.centerX + dx * s * 5) - 2, Math.round(this.centerY + dy * s * 5) - 2, 4, 4);
        }
        ctx.fillStyle = '#6B4226';
        ctx.fillRect(Math.round(this.centerX + dx * 30) - 3, Math.round(this.centerY + dy * 30) - 3, 6, 6);
        // Pixel swoosh trail behind the tip
        const trail = a - 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * (1 - progress)})`;
        ctx.fillRect(Math.round(this.centerX + Math.cos(trail) * 26) - 1, Math.round(this.centerY + Math.sin(trail) * 26) - 1, 3, 3);
        ctx.fillRect(Math.round(this.centerX + Math.cos(trail - 0.35) * 24) - 1, Math.round(this.centerY + Math.sin(trail - 0.35) * 24) - 1, 2, 2);
    }

    attack() {
        if (this.attackCooldownTimer > 0 || this.isAttacking) return;
        if (this.game.gameState !== GAME_STATE.PLAYING) return;
        this.isAttacking = true;
        this.attackTimer = PLAYER_ATTACK_DURATION;
        this.attackCooldownTimer = PLAYER_ATTACK_COOLDOWN;

        // Build hitbox in front of the player
        const r = PLAYER_ATTACK_RANGE;
        let hx = this.x, hy = this.y, hw = this.width, hh = this.height;
        switch (this.direction) {
            case 'up': hy = this.y - r; hh = r + 6; hx = this.x - 8; hw = this.width + 16; break;
            case 'down': hy = this.y + this.height - 6; hh = r + 6; hx = this.x - 8; hw = this.width + 16; break;
            case 'left': hx = this.x - r; hw = r + 6; hy = this.y - 4; hh = this.height + 8; break;
            case 'right': hx = this.x + this.width - 6; hw = r + 6; hy = this.y - 4; hh = this.height + 8; break;
        }

        let hitSomething = false;
        [...this.game.currentMap.enemies].forEach(enemy => {
            if (hx < enemy.x + enemy.width && hx + hw > enemy.x &&
                hy < enemy.y + enemy.height && hy + hh > enemy.y) {
                hitSomething = true;
                // Knockback away from player
                const dx = enemy.centerX - this.centerX;
                const dy = enemy.centerY - this.centerY;
                const d = Math.hypot(dx, dy) || 1;
                enemy.x += (dx / d) * PLAYER_ATTACK_KNOCKBACK;
                enemy.y += (dy / d) * PLAYER_ATTACK_KNOCKBACK;
                enemy.takeDamage(PLAYER_ATTACK_DAMAGE);
            }
        });
        if (!hitSomething) this.game.sound.playSound('knock');
    }


    interact() {
        const checkRange = 20;
        let checkX = this.x + this.width / 2;
        let checkY = this.y + this.height / 2;
        switch (this.direction) {
            case 'up': checkY -= this.height / 2 + checkRange / 2; break;
            case 'down': checkY += this.height / 2 + checkRange / 2; break;
            case 'left': checkX -= this.width / 2 + checkRange / 2; break;
            case 'right': checkX += this.width / 2 + checkRange / 2; break;
        }
        this.game.currentMap.tryInteraction(checkX, checkY, this);
    }

    addItem(itemKey) {
        if (!this.inventory.includes(itemKey)) {
            this.inventory.push(itemKey);
            this.game.ui.updateInventoryDisplay(this.inventory, this.game.itemTypes);
            if (itemKey === 'artifact1' || itemKey === 'artifact2' || itemKey === 'artifact3' || itemKey === 'final_artifact') {
                this.game.sound.playSound('getCoin');
            } else {
                this.game.sound.playSound('getItem');
            }
            if (this.game.particles) this.game.particles.burst(this.centerX, this.y, '#FFD700', 12, 1.8);
            this.game.saveGame(); // silent checkpoint: items are rare and load-bearing
            return true;
        }
        return false;
    }

    hasItem(itemKey) { return this.inventory.includes(itemKey); }

    removeItem(itemKey) {
        const idx = this.inventory.indexOf(itemKey);
        if (idx >= 0) {
            this.inventory.splice(idx, 1);
            this.game.ui.updateInventoryDisplay(this.inventory, this.game.itemTypes);
        }
    }

    // Returns true if the hit landed (false while invulnerability frames are up)
    takeDamage(amount, source = "Unknown") {
        const internal = source === "Dehydration" || source === "Venom";
        if (!internal) {
            if (this.invulnTimer > 0) return false;
            this.invulnTimer = 45; // ~0.75s of mercy; the sprite flickers meanwhile
            this.game.sound.playSound('playerHurt');
        }
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        this.game.ui.updateHealth(this.health, this.maxHealth);
        if (this.game.particles) {
            this.game.particles.floatText(this.centerX, this.y - 6, `-${amount}`, '#FF6666');
            this.game.particles.burst(this.centerX, this.centerY, '#CC3333', 5, 1.6);
        }
        if (this.health <= 0) this.game.gameOver(`Defeated by ${source}.`);
        return true;
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.game.ui.updateHealth(this.health, this.maxHealth);
    }

    hydrate(amount) {
        this.hydration = Math.min(this.maxHydration, this.hydration + amount);
        this.game.ui.updateHydration(this.hydration, this.maxHydration);
    }

    addQuest(quest) {
        if (!this.quests.find(q => q.id === quest.id)) {
            this.quests.push(quest);
            this.game.ui.updateQuestLog(this.quests);
            this.game.saveGame(); // silent checkpoint: alignment records live here
        }
    }

    completeQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest && !quest.completed) {
            quest.completed = true;
            this.game.ui.updateQuestLog(this.quests);
            this.game.ui.showDialog(`Quest Completed: ${quest.description}`, "System");
        }
    }
}
