export class Entity {
    constructor(game, x, y, width, height, type = 'entity') {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.animationFrame = 0;
        this.spriteIndex = 0;
    }

    draw(ctx) {}
    update() {}

    // Draw a pixel sprite from string rows ('.'/' ' = transparent), snapped to a coarse grid.
    drawPixels(ctx, rows, palette, ox, oy, scale) {
        for (let r = 0; r < rows.length; r++) {
            const row = rows[r];
            for (let c = 0; c < row.length; c++) {
                const color = palette[row[c]];
                if (!color) continue;
                ctx.fillStyle = color;
                ctx.fillRect(Math.round(ox + c * scale), Math.round(oy + r * scale), Math.ceil(scale), Math.ceil(scale));
            }
        }
    }

    get centerX() { return this.x + this.width / 2; }
    get centerY() { return this.y + this.height / 2; }
}
