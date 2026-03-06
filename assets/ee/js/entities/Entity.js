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

    get centerX() { return this.x + this.width / 2; }
    get centerY() { return this.y + this.height / 2; }
}
