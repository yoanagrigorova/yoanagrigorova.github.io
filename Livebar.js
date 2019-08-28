class Live extends PIXI.Sprite {
    constructor(parent, x, y) {
        super(PIXI.Texture.from("./assets/live.png"));
        this.width = 20;
        this.height = 20;
        this.x = x;
        this.y = y;
        this.parentContainer = parent;
        if (parent) {
            parent.addChild(this);
        }
    }
    remove() {
        this.parentContainer.removeChild(this);
    }
}
