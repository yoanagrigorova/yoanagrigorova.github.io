let start = new TimelineMax();

start.fromTo("#start", 0.5, {
    scale: 0,
    opacity: 0,
}, {
        scale: 1,
        opacity: 0.7,
        onStart: function () {
            document.getElementById("scoreContainer").style.visibility = "hidden";
        },
        onComplete: ()=>{
            document.getElementById("start").addEventListener("mouseover", zoomIn);
            document.getElementById("start").addEventListener("mouseout", zoomOut);
        }
});

function zoomIn() {
    start.to("#start", 0.5, {
        scale: 1.5,
        opacity: 1
    })
}

function zoomOut() {
    start.to("#start", 0.5, {
        scale: 1,
        opacity: 0.7
    })
}

function renderEnemies(): void {
    let rowCount = 8;
    let rows = 3;
    for (let i = 0; i < rows * rowCount; i++) {
        let row = Math.floor(i / rowCount);
        if (row === 0) {
            let enemy = new Boss(container, i % rowCount, row * 60);
            enemies.push(enemy);
        } else {
            let enemy = new Enemy(container, i % rowCount, row * 60);
            enemies.push(enemy);
        }
    }

    let interval = setInterval(() => {
        if (enemies.length) {
            let enemy = enemies[Math.floor(Math.random() * enemies.length)];
            enemyShoot(enemy);
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

document.getElementById("start").addEventListener("mouseup", (event) => {
    start.fromTo("#start", 0.5, {
        scale: 1,
        opacity: 1
    }, {
        // scale: 0,
        opacity: 0,
        x:-800,
        onStart: () => {
            document.getElementById("start").removeEventListener("mouseover", zoomIn);
            document.getElementById("start").removeEventListener("mouseout", zoomOut);
        },
        onComplete: renderGame
    })
})

function renderWin(winTl, shooter: Shooter): void {
    winTl
        .set("#result", { text: "YOU WIN" })
        .set("#score", { text: shooter.score.toString() })
        .fromTo("#resultContainer", 2, {
            opacity: 0,
            scale: 0
        }, { opacity: 1, scale: 1 });

    document.getElementById("restart").addEventListener("mouseup", restartWon);
}

function renederLostGame(winTl, shooter: Shooter): void {
    winTl
        .set("#result", { text: "YOU LOSE" })
        .set("#score", { text: shooter.score.toString() })
        .fromTo("#resultContainer", 2, {
            opacity: 0,
            scale: 0
        }, { opacity: 1, scale: 1 });

    document.getElementById("restart").addEventListener("mouseup", restartWon);
}

function renderHitTarget(shooter: Shooter, bullet: Bullet, enemy: Enemy, index: number): void {
    bullet.remove();
    enemy.hit();

    if (enemy.livesCount <= 0) enemies.splice(index, 1);

    shooter.updateScore(enemy.pointsCount);
    tl.to("#score", 0.1, { text: shooter.score.toString() });

    if (!enemies.length) {
        app.stage.children = app.stage.children.filter(c => !(c instanceof Bullet));
        renderWin(winTl, shooter);
    }
}

function hitShield(bullet: Bullet): boolean {
    let hit = false;
    shields.forEach((shield, index) => {
        if ((bullet.positionY >= shield.positionY && bullet.positionY <= shield.positionY + shield.getHeight()) &&
            (bullet.positionX >= shield.positionX && bullet.positionX <= shield.positionX + shield.getWidth())) {
            bullet.remove();
            shield.updateHealth();
            if (shield.health === 0) {
                shields.splice(index, 1);
            }

            hit = true;
        }
    });
    return hit;
}

function shootOneBullet(hit: boolean): void {
    let bullet = new Bullet(app.stage, shooter.positionX, shooter.positionY - (shooter.getHeight() / 2));
    shoot.play();

    app.ticker.add(function hitTarget() {
        bullet.shoot();

        if (hitShield(bullet)) {
            app.ticker.remove(hitTarget);
        }

        enemies.forEach((enemy, index) => {
            if ((bullet.positionY >= enemy.position.y && bullet.positionY <= enemy.positionY + enemy.getHeight()) &&
                (bullet.positionX >= enemy.positionX + container.x && bullet.positionX <= enemy.positionX + enemy.getWidth() + container.x)) {

                hit = true;
                stoppedTicker = true;

                renderHitTarget(shooter, bullet, enemy, index);
                app.ticker.remove(hitTarget);
            }
        })

        if (bullet.positionY <= 0) {
            stoppedTicker = true;
            app.ticker.remove(hitTarget);
        }

        if (!hit && stoppedTicker) {
            numOfHits = 0;
            stoppedTicker = false;
        } else if (hit && stoppedTicker) {
            numOfHits++;
            hit = false;
            stoppedTicker = false;
            if (numOfHits >= 3) {
                threeBullets = true;
            }
        }
    })
}

function shootThreeBullets(): void {
    let middleBullet = new Bullet(app.stage, shooter.positionX, shooter.positionY - (shooter.getHeight() / 2));
    let leftBullet = new Bullet(app.stage, shooter.positionX - (shooter.getWidth() / 2) + 3, shooter.positionY);
    let rightBullet = new Bullet(app.stage, shooter.positionX + (shooter.getWidth() / 2) - 3, shooter.positionY);

    let bullets:Bullet[];
    bullets = [leftBullet, middleBullet, rightBullet];

    shoot.play();

    bullets.forEach((bullet) => {
        app.ticker.add(function hitTarget() {
            bullet.shoot();

            if (hitShield(bullet)) {
                app.ticker.remove(hitTarget);
            }

            enemies.forEach((enemy, index) => {
                if ((bullet.positionY >= enemy.positionY && bullet.positionY <= enemy.positionY + enemy.getHeight()) &&
                    (bullet.positionX >= enemy.positionX + container.x && bullet.positionX <= enemy.positionX + enemy.getWidth() + container.x)) {

                    renderHitTarget(shooter, bullet, enemy, index);
                    app.ticker.remove(hitTarget);
                }
            })

            if (bullet.positionY <= 0) {
                app.ticker.remove(hitTarget);
            }
        })
    })
}

function restartWon(): void {
    container.children.length = 0;
    shooter.lostGame = false;
    winTl
        .fromTo("#resultContainer", 1, { opacity: 1, scale: 1 }, {
            opacity: 0,
            scale: 0
        })
    shooter.score = 0;
    threeBullets = false;
    numOfHits = 0;
    enemies.length = 0;
    tl.to("#score", 0.5, { text: shooter.score.toString() });
    renderEnemies();
    shooter.restart();
    shields.forEach(shield => shield.remove());
    shields.length = 0;
    for (let i = 0; i < 4; i++) {
        let shield = new Shield(app.stage, (i * 200) + 50, shooter.positionY - 200);
        shields.push(shield);
    }
    document.getElementById("restart").removeEventListener("mouseup", restartWon);
}

function enemyShoot(enemy: Enemy): void {
    const { x, y } = enemy.getPosition();
    let bullet = new Bullet(app.stage, x, y);
    app.ticker.add(function shoot() {
        bullet.enemyShoot();

        if (hitShield(bullet)) {
            bullet.remove();
            app.ticker.remove(shoot);
        }

        if (shooter.isHit(bullet)) {
            app.ticker.remove(shoot);
            shooter.updateLives(bullet);
            threeBullets = false;
            numOfHits = 0;
            bullet.remove();
        }

        if (shooter.liveCount === 0) {
            shooter.lostGame = true;

            bullet.remove();
            app.ticker.remove(shoot);
            shooter.remove();
            let killed = new Howl({
                src: ['./assets/sounds/explosion.wav'],
                volume: 0.25,
            });
            killed.play();
            if (enemies.length > 0) {
                renederLostGame(winTl, shooter);
            }
        }

        if (shooter.lostGame || bullet.positionY >= app.screen.height) {
            bullet.remove();
            app.ticker.remove(shoot);
        }
    })
}