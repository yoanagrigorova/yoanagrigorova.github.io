class Enemy extends PIXI.Sprite {
    protected height:number;
    protected width:number;
    protected x:number;
    protected y:number;
    protected points:number;
    private parentContainer:any;
    private _lives:Live[];
    private explodeSound:any;

    constructor(parent, index, y = 0, picture = "target", liveCount = 2) {
        super(PIXI.Texture.from("./assets/" + picture + ".png"));

        this.height = 50;
        this.width = 50;

        this.x = index * (this.width + 20);
        this.y = y;
        this.points = 20;

        this.parentContainer = parent;

        this._lives = [];

        for (let i = 0; i < liveCount; i++) {
            let live = new Live(parent, liveCount === 2 ? this.x + (i * 15) + 7 : this.x + (i * 15) - 3, this.y + this.height)
            this._lives.push(live);
        }

        if (parent) {
            parent.addChild(this);
        }

        this.explodeSound = new Howl({
            src: ['./assets/sounds/invaderkilled.wav'],
            volume: 0.25,
        });
    }

    get livesCount():number{
        return this._lives.length;
    }

    get pointsCount():number{
        return this.points;
    }

    get positionX(){
        return this.x;
    }

    get positionY(){
        return this.y;
    }

    getHeight(){
        return this.height;
    }

    getWidth(){
        return this.width;
    }

    hit():void {
        if (this._lives.length > 1) {
            let live = this._lives.splice(this._lives.length - 1, 1);
            live[0].remove();
            this.explodeSound.play();
            // this.explode();
        } else if (this._lives.length === 1) {
            this.remove();
            if (this._lives[0]) {
                this._lives[0].remove();
                this._lives.splice(0, 1);
            }
        }
    }

    getPosition() {
        return {
            x: (this.x + (this.width / 2)) + this.parent.x,
            y: this.y + this.height
        }
    }

    remove():void {
        this.parentContainer.removeChild(this);
        this.explode();
        this._lives.forEach(live => live.remove());
    }

    private explode():void {
        this.explodeSound.play();
        let explosion = new Explosion(this.x + this.parentContainer.x, this.y + this.parentContainer.y);
        explosion.explode();
    }

    
}