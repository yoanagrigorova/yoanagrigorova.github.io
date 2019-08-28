class Bullet extends PIXI.Sprite {
    private width:number;
    private height:number;
    public y:number;
    public x:number;
    private vy:number;
    private parentContainer:any;

    constructor(parent, x, y) {
        super(PIXI.Texture.from("./assets/bullet.png"));

        this.width = 70;
        this.height = 70;
        this.anchor.set(0.5);
        this.y = y;
        this.x = x;
        this.vy = 10;
        this.parentContainer = parent;

        if (parent) {
            parent.addChild(this);
        }
    }

    get positionY():number{
        return this.y;
    }

    get positionX():number{
        return this.x;
    }

    shoot():void {
        this.y -= this.vy;

        if (this.y <= 0) {
            this.remove();
        }
    }

    enemyShoot():void {
        this.y += (this.vy - 3);

        if (this.y >= app.screen.height) {
            this.remove();
        }
    }

    remove():void {
        this.parentContainer.removeChild(this);
    }
}