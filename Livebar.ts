class Live extends PIXI.Sprite {
    private width: number;
    private height: number;
    private x: number;
    private y: number;
    private parentContainer: any;

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

    remove(): void {
        this.parentContainer.removeChild(this);
    }

}