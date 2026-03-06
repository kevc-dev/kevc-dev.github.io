import { Entity } from './Entity.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, ARROW_LIFESPAN } from '../constants.js';

export class Arrow extends Entity {
    constructor(game, x, y, targetX, targetY, speed, damage) {
        super(game, x, y, 8, 4, 'projectile');
        this.speed = speed;
        this.damage = damage;
        const angle = Math.atan2(targetY - y, targetX - x);
        this.dx = Math.cos(angle) * this.speed;
        this.dy = Math.sin(angle) * this.speed;
        this.lifeSpan = ARROW_LIFESPAN;
        this.rotation = angle;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.lifeSpan--;
        const player = this.game.player;
        if (this.x < player.x + player.width && this.x + this.width > player.x &&
            this.y < player.y + player.height && this.y + this.height > player.y) {
            player.takeDamage(this.damage, "Arrow");
            this.lifeSpan = 0;
        }
        if (this.x < 0 || this.x > CANVAS_WIDTH || this.y < 0 || this.y > CANVAS_HEIGHT) {
            this.lifeSpan = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.fillStyle = '#A9A9A9';
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(this.width / 2 - 4, -this.height / 2 - 1);
        ctx.lineTo(this.width / 2 - 4, this.height / 2 + 1);
        ctx.closePath(); ctx.fill();
        ctx.restore();
    }
}
