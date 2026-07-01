// Lightweight retro particle system: pixel squares + floating text.
export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.texts = [];
    }

    emit(x, y, opts = {}) {
        this.particles.push({
            x, y,
            vx: opts.vx !== undefined ? opts.vx : (Math.random() - 0.5) * 2,
            vy: opts.vy !== undefined ? opts.vy : (Math.random() - 0.5) * 2,
            life: opts.life || 30,
            maxLife: opts.life || 30,
            size: opts.size || 3,
            color: opts.color || '#FFFFFF',
            gravity: opts.gravity || 0,
        });
    }

    burst(x, y, color = '#FFD27D', count = 10, speed = 2.2) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const s = speed * (0.4 + Math.random() * 0.6);
            this.emit(x, y, {
                vx: Math.cos(angle) * s,
                vy: Math.sin(angle) * s,
                life: 18 + Math.floor(Math.random() * 20),
                size: 2 + Math.floor(Math.random() * 3),
                color,
                gravity: 0.04,
            });
        }
    }

    dust(x, y) {
        for (let i = 0; i < 2; i++) {
            this.emit(x + (Math.random() - 0.5) * 10, y, {
                vx: (Math.random() - 0.5) * 0.6,
                vy: -0.2 - Math.random() * 0.3,
                life: 14 + Math.floor(Math.random() * 10),
                size: 2,
                color: 'rgba(210, 185, 140, 0.7)',
            });
        }
    }

    sparkle(x, y, color = '#FFFFFF') {
        this.emit(x, y, {
            vx: 0,
            vy: -0.4,
            life: 20,
            size: 2,
            color,
        });
    }

    floatText(x, y, text, color = '#FFEE88') {
        this.texts.push({ x, y, text, color, life: 45 });
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life--;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
        for (let i = this.texts.length - 1; i >= 0; i--) {
            const t = this.texts[i];
            t.y -= 0.6;
            t.life--;
            if (t.life <= 0) this.texts.splice(i, 1);
        }
    }

    draw(ctx) {
        this.particles.forEach(p => {
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        });
        ctx.globalAlpha = 1;
        this.texts.forEach(t => {
            ctx.globalAlpha = Math.max(0, Math.min(1, t.life / 20));
            ctx.fillStyle = t.color;
            ctx.font = '8px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText(t.text, Math.round(t.x), Math.round(t.y));
            ctx.textAlign = 'left';
        });
        ctx.globalAlpha = 1;
    }

    clear() {
        this.particles.length = 0;
        this.texts.length = 0;
    }
}
