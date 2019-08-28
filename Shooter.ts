class Shooter extends PIXI.Sprite {
    private width:number;
    private height:number;
    private vx:number;
    private _score:number;
    private _lostGame:boolean;
    private lives:number;
    private livebar:Live[];
    private x:number;
    private y:number;
    private parentContainer:any;
    private container:any;

    constructor(parent) {
        super(PIXI.Texture.from("./assets/shooter.png"));

        this.width = 60;
        this.height = 60;
        this.anchor.set(0.5);
        this.vx = 0;
        this._score = 0;
        this._lostGame = false;

        this.lives = 5;
        this.livebar = [];

        this.parentContainer = parent;
        this.container = new PIXI.Container();

        this.y = parent.screen.height - (this.height / 2);
        this.x = parent.screen.width / 2;
        parent.stage.addChild(this);

        this.renderLives();
    }

    get positionX(){
        return this.x;
    }

    get positionY(){
        return this.y;
    }

    set positionX(value){
        this.x = value;
    }

    get liveCount(){
        return this.lives;
    }

    get score(){
        return this._score;
    }

    set score(value){
        this._score = value;
    }

    set velocity(vx:number){
        this.vx=vx;
    }

    get velocity(){
        return this.vx;
    }

    getWidth(){
        return this._width;
    }

    getHeight(){
        return this._height;
    }

    get lostGame(){
        return this._lostGame;
    }

    set lostGame(value){
        this._lostGame = value;
    }

    updateScore(points:number){
        this.score+=points;
    }

    updateLives(bullet:Bullet):void {
        let explosion = new Explosion(bullet.positionX, bullet.positionY);
        explosion.anchor.set(0.5);
        explosion.explode();
        if (this.lives > 0) {
            this.lives--;
            let live = this.livebar.splice(this.lives, 1);
            live[0].remove();
        }
    }

    isHit(bullet:Bullet):boolean {
        if ((bullet.positionX >= this.x - (this.width / 2) && bullet.positionX <= this.x + (this.width / 2)) &&
            bullet.positionY >= this.y - (this.height / 2) && bullet.positionY <= this.y + (this.height / 2) && enemies.length) {
            return true;
        }
        return false;
    }

    private renderLives():void {
        this.container.x = 250;
        this.container.y = 5;
        this.parentContainer.stage.addChild(this.container);
        for (let i = 0; i < this.lives; i++) {
            let live = new Live(this.container, this.container.x + (20 * i), 0);
            this.livebar.push(live);
        }
    }

    remove():void {
        this.lives--;
        this.container.children.length = 0;
        this.parentContainer.stage.removeChild(this);
    }

    restart():void {
        this.remove();
        this.lives = 5;
        this.livebar = [];
        this.renderLives();
        this.parentContainer.stage.addChild(this);
    }
}