declare var TimelineMax;
declare var PIXI;
declare var Howl;

const log = console.log;

let app = new PIXI.Application();

document.body.appendChild(app.view);

let background = new PIXI.Sprite.from("./assets/background.jpg");
app.stage.addChild(background);

let container = new PIXI.Container();
container.x = 0;
container.y = 30;

let shooter:Shooter;
let enemies:Enemy[];
let shields:Shield[];
shields=[];
enemies=[];
let numOfHits = 0;
let stoppedTicker = false;
let threeBullets = false;
let winTl = new TimelineMax();

let tl = new TimelineMax();

let tlContainer = new TimelineMax({
    repeat: -1,
    yoyo: true
});

let shoot = new Howl({
    src: ['./assets/sounds/shoot.wav'],
    volume: 0.25,
});

function renderGame() {
    document.getElementById("scoreContainer").style.visibility = "visible";

    app.stage.addChild(container);
    shooter = new Shooter(app);

    for (let i = 0; i < 4; i++) {
        let shield = new Shield(app.stage, (i * 200) + 50, shooter.positionY - 200);
        shields.push(shield);
    }

    renderEnemies();

    tlContainer.to(container, 10, {
        x: app.screen.width - container.width,
    })

    tl.to("#score", 0.1, { text: shooter.score.toString() });

    let left = keyboard(37),
        right = keyboard(39),
        space = keyboard(32);

    left.press = () => {
        if (shooter.positionX >= 20) {
            shooter.velocity = -10;
        } else {
            shooter.velocity = 0;
        }
    }

    left.release = () => {
        shooter.velocity = 0;
    }

    right.press = () => {
        shooter.velocity = 10;
    }

    right.release = () => {
        shooter.velocity = 0;
    }

    space.press = () => {
        let hit = false;           
        if (shooter.liveCount > 0) {
            if (threeBullets) {
                shootThreeBullets()
            } else {
                shootOneBullet(hit);
            }
        }
        
    }

    let state = play;

    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));

    function gameLoop(delta) {
        //Update the current game state:
        state(delta);
    }

    function play(delta) {
        if ((left.isDown && shooter.positionX - shooter.getWidth() / 2 > 0) || (right.isDown && shooter.positionX + shooter.getWidth() / 2 < app.screen.width)) {
            shooter.positionX = shooter.velocity + shooter.positionX;
        }
    }
}