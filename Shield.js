class Shield extends PIXI.Sprite {
    constructor(parent, x, y) {
        super(PIXI.Texture.from("./assets/shield.png"));
        this.width = 80;
        this.height = 80;
        this.x = x;
        this.y = y;
        this._health = 20;
        this.parentContainer = parent;
        if (parent) {
            parent.addChild(this);
        }
    }
    get health() {
        return this._health;
    }
    get positionX() {
        return this.x;
    }
    get positionY() {
        return this.y;
    }
    getWidth() {
        return this._width;
    }
    getHeight() {
        return this._height;
    }
    updateHealth() {
        this._health--;
        if (this.health === 0) {
            this.remove();
        }
    }
    remove() {
        this.parentContainer.removeChild(this);
    }
}
