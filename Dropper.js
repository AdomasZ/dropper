class Dropper extends Phaser.Scene {

    constructor(){
        super({key:"Dropper"});
        var stage = this;
        this.Level = function(){
            this.objectsOnPlatform = [];
            this.platformLeft = '';
            this.platformRight = '';

            this.destroy = () => {
                this.platformLeft.destroy();
                this.platformRight.destroy();
                this.objectsOnPlatform.forEach((object) => {
                    object.destroy();
                });
            };

            this.createBullet = (xPos) => {
                var bullet = stage.bullets.create(xPos, platformPosY, 'bullet');
                stage.shapeBullet(bullet);
                bullet.y -= 50;
                this.objectsOnPlatform.push(bullet);
            };

            this.createShield = (xPos) => {
                var shield = stage.shields.create(xPos, platformPosY, 'shield');
                stage.shapeShield(shield);
                shield.y -= 50;
                this.objectsOnPlatform.push(shield);
            };

            this.createMine = (xPos) => {
                var mine = stage.mines.create(xPos, platformPosY, 'mine');
                stage.shapeMine(mine);
                mine.y -= 25;
                this.objectsOnPlatform.push(mine);
            };

            this.getRandomXLeft = (platformLeft) => {
                return Phaser.Math.RND.integerInRange(50, platformLeft.body.width - 50);
            };

            this.getRandomXRight = (platformRight) => {
                return Phaser.Math.RND.integerInRange((platformRight.x - (platformRight.body.width / 2)) + 50, canvasWidth - 50);
            };

            this.getLeftOrRightX = (platformLeft, platformRight) => {
                var chance = Phaser.Math.FloatBetween(0, 1);
                if(chance < 0.5) {
                    return this.getRandomXLeft(platformLeft);
                } else {
                    return this.getRandomXRight(platformRight);
                }
            };

            var platformLeft;
            var platformRight;
            var platformLeftWidth;
            var platformRightWidth;
            platformLeftWidth = Phaser.Math.RND.integerInRange(100, canvasWidth - 200);
            platformRightWidth = canvasWidth - platformLeftWidth - platformGapX;

            platformLeft = stage.platforms.create(0, 0, 'platform1');
            platformLeft.x = platformLeftWidth / 2;
            platformLeft.displayWidth = platformLeftWidth;
            platformLeft.body.width = platformLeftWidth;
            platformLeft.displayHeight = platformHeight;
            platformLeft.body.height = 2;
            platformLeft.y = platformPosY;
            this.platformLeft = platformLeft;

            platformRight = stage.platforms.create(0, 0, 'platform1');
            platformRight.x = platformLeftWidth + platformGapX + (platformRightWidth / 2);
            platformRight.displayWidth = platformRightWidth;
            platformRight.body.width = platformRightWidth;
            platformRight.displayHeight = platformHeight;
            platformRight.body.height = 2;
            platformRight.y = platformPosY ;
            this.platformRight = platformRight;

            var chance = Phaser.Math.FloatBetween(0, 1);

            this.createMine(this.getLeftOrRightX(platformLeft, platformRight));

            if(chance < bulletChance) {
                this.createBullet(this.getLeftOrRightX(platformLeft, platformRight));
            } else if (chance < shieldChance) {
                this.createShield(this.getLeftOrRightX(platformLeft, platformRight));
            }

            platformPosY += platformGapY;

            stage.levels.push(this);
        };

        this.Player = function(object){
            this.object = object;
            this.bullets = [];
            this.pickup = (power) => {
                if(power.texture.key === 'bullet'){
                    this.bullets.push(power);
                }
                power.destroy();
            };
            this.shoot = () => {
                if(this.bullets.length > 0){
                    var bullet = stage.physics.add.sprite(this.object.x, this.object.y, 'bullet');
                    bullet.body.velocity.y = 900;
                    stage.shapeBullet(bullet);
                    stage.flyingBullets.add(bullet);
                    this.bullets.pop();
                }
            };
            this.bounce = () => {
                if(stage.destroyedPlatforms > 2){
                    stage.levels[0].destroy();
                    stage.levels.shift();
                    stage.destroyedPlatforms++;
                    score += stage.destroyedPlatforms * stage.bonusMultiplier;
                    stage.setBonusText('You earned extra ' + stage.destroyedPlatforms * stage.bonusMultiplier + ' points');
                    setTimeout(()=>{stage.bonusText.setText('')}, 3000)
                    //reset
                    stage.bonusMultiplier = 2;
                }
                this.object.body.velocity.y = -300;
            };
            this.object.displayHeight = 50;
            this.object.displayWidth = 50;
            // Cuts the body into a circle
            this.object.body.setCircle(110, 12 , 10);
            this.object.setCollideWorldBounds(false);
        };
    }

    preload(){
        this.load.image('ball', './assets/ball.png');
        this.load.image('platform1', './assets/platform1.png');
        this.load.image('spikes', './assets/spikes.png');
        this.load.image('bullet', './assets/bullet.png');
        this.load.image('shield', './assets/shield.png');
        this.load.image('mine', './assets/mine.png');
    }

    create(){
        // reset the score and the yPos of the first platform
        score = 0;
        platformPosY = 400;

        this.player = new this.Player(this.physics.add.sprite(50, 200, 'ball'));
        this.cameras.main.setBounds(0, 0, canvasWidth);
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(3000);
        this.cameras.main.setBackgroundColor('rgba(249, 214, 98,1)');
        this.platforms = this.physics.add.staticGroup();
        this.bullets = this.physics.add.staticGroup();
        this.shields = this.physics.add.staticGroup();
        this.mines = this.physics.add.staticGroup();
        this.flyingBullets = this.physics.add.staticGroup();
        this.levels = [];
        this.cameraY = 0;
        this.bulletLoad = bulletLoadTime;
        this.destroyedPlatforms = 0;
        this.bonusMultiplier = 2;
        this.shieldTime = 0;


        // Create a few levels
        for(var i = 0; i < 50; i++){
            this.createLevel();
        }

        // Destroy all items on first platform
        for(var i = 0; i < this.levels[0].objectsOnPlatform.length; i++){
            this.levels[0].objectsOnPlatform[i].destroy();
        }

        this.createSpikes();
        this.addColliders();
        this.createInputs();

        // Text
        this.scoreText = this.add.text(0, 0, '', { fontSize: '20px', fill: 'rgb(23,63,96)', backgroundColor: 'rgb(250,214,97)', fontFamily: 'roboto'});
        this.scoreText.setScrollFactor(0);
        this.bonusText = this.add.text(0, 100, '', { fontSize: '32px', fill: 'rgb(255, 255, 255)', backgroundColor: 'rgb(234,85,62)', fontFamily: 'roboto'});
        this.bonusText.setScrollFactor(0);
    }

    update(){
        // User stays within the screen
        if(this.player.object.x < 0 || this.player.object.x > canvasWidth){
            this.endGame()
        }

        // The spikes move down
        this.spikes.y += spikeSpeed;

        // The spikes move down faster when off screen to catch up with the player
        if (this.player.object.y - this.spikes.y > canvasHeight){
            this.spikes.y += spikeSpeed * 1.5;
        }

        // The shield timer is on
        if(this.shieldTime > 0){
            this.mineCollision.active = false;
            this.cameras.main.setBackgroundColor('rgba(60,174,167,1)');
        } else {
            clearInterval(this.shieldIntrerval);
            this.mineCollision.active = true;
            this.cameras.main.setBackgroundColor('rgba(249, 214, 98,1)');
        }

        // The camera progresses with the player
        if(this.cameraY < this.player.object.y){
            this.cameraY = this.player.object.y;
        }

        // The camera stays on the player
        this.cameras.main.centerOn(this.player.object.x, this.cameraY);

        // Destroy the platforms passed
        if(this.levels[0].platformLeft.y + 25 < this.player.object.y){
            this.levels[0].destroy();
            this.levels.shift();
            this.destroyedPlatforms++;
            score++;
            this.createLevel();
        }

        // More platforms passed more bonus points
        if(this.destroyedPlatforms > 3){
            this.bonusMultiplier = 3;
        } else if(this.destroyedPlatforms > 4){
            this.bonusMultiplier = 4;
        } else if(this.destroyedPlatforms > 5){
            this.bonusMultiplier = 5;
        }

        // Refresh the static groups for collision detection.
        this.platforms.refresh();
        this.bullets.refresh();
        this.shields.refresh();
        this.mines.refresh();

        // Update HUD
        this.scoreText.setText('Score: ' + score
        + ' \nShield time: ' + (this.shieldTime/1000) + 'sec.'
        + ' \nBullet amount: ' + (this.player.bullets.length)
        + ' \nBullet load: ' + ((bulletLoadTime - this.bulletLoad) <= 0 && this.player.bullets.length > 0? 'ready' : 'not ready'));

        // Handle input
        if(this.key_D.isDown){
            this.player.object.x += movementSpeed;
        } else if(this.key_A.isDown) {
            this.player.object.x -= movementSpeed;
        } else if(this.shootBtn.isDown){
            if(this.bulletLoad >= bulletLoadTime){
                this.bulletLoad = 0;
                setInterval(()=>{this.bulletLoad += 1000;},1000);
                this.player.shoot(this);
            }
        }
    }

    setBonusText(text){
        this.bonusText.setText(text);
        this.bonusText.x = (canvasWidth / 2) - this.bonusText.displayWidth / 2;
    }
    createSpikes(){
        this.spikes = this.physics.add.sprite(canvasWidth / 2, -2000, 'spikes', true);
        this.spikes.displayWidth = canvasWidth;
        this.spikes.body.width = canvasWidth;
        this.spikes.displayHeight = canvasHeight;
        this.spikes.body.height = canvasHeight;
        this.spikes.body.moves = false;
    }

    createInputs() {
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.shootBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    createLevel(){
        new this.Level();
    }

    addColliders() {
        this.physics.add.collider(this.player.object, this.platforms, (ball, platform) => {
            this.player.bounce();
            this.destroyedPlatforms = 0;
        });

        this.physics.add.collider(this.player.object, this.spikes, () => {
            this.endGame();
        });

        this.physics.add.collider(this.player.object, this.bullets, (player, bullet) => {
            this.player.pickup(bullet);
        });

        this.mineCollision = this.physics.add.collider(this.player.object, this.mines, () => {
            this.endGame();
        });

        this.physics.add.collider(this.player.object, this.shields, (player, shield) => {
            shield.destroy();
            this.player.bounce();
            // Interval needs to be reset here. We're experiencing trouble with clearInterval() if the interval was assigned to this.shieldIntrerval multiple times
            clearInterval(this.shieldIntrerval);
            this.shieldIntrerval = null;
            this.shieldTime += shieldTime;
            this.shieldIntrerval = setInterval(() => {this.shieldTime -= 1000}, 1000);
        });

        this.physics.add.collider(this.flyingBullets, this.platforms, (bullet, platform) => {
            bullet.destroy();
            platform.destroy();
            this.platforms.refresh();
            this.flyingBullets.refresh();
        });

        this.physics.add.collider(this.flyingBullets, this.mines, (bullet, mine) => {
            bullet.destroy();
            mine.destroy();
            this.mines.refresh();
            this.flyingBullets.refresh();
        });
    }

    shapeBullet(bullet){
        bullet.displayWidth = bulletWidth;
        bullet.body.width = bulletWidth;
        bullet.displayHeight = bulletHeight;
        bullet.body.height = bulletHeight;
    }

    shapeShield(bullet){
        bullet.displayWidth = shieldWidth;
        bullet.body.width = shieldWidth;
        bullet.displayHeight = shieldHeight;
        bullet.body.height = shieldHeight;
    }

    shapeMine(bullet){
        bullet.displayWidth = mineWidth;
        bullet.body.width = mineWidth;
        bullet.displayHeight = mineHeight;
        bullet.body.height = mineHeight;
    }

    endGame(){
        if(score > highScore){
            highScore = score;
        }
        this.scene.start('Menu');
    }
}