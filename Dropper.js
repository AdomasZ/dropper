class Dropper extends Phaser.Scene {

    constructor(){
        super({key:"Dropper"});
        var stage = this;
        this.Level = function(){
            this.objectsOnPlatform = [];
            this.platformLeft = '';
            this.platformRight = '';

            this.move = () => {
                this.platformLeft.y--;
                this.platformRight.y--;
                this.objectsOnPlatform.forEach((power)=>{
                    power.y--;
                });
            };

            this.destroy = () => {
                this.platformLeft.destroy();
                this.platformRight.destroy();
                this.objectsOnPlatform.forEach((power)=>{
                    power.destroy();
                });
            };

            this.createBullet = (xPos) => {
                var bullet = stage.bullets.create(xPos, platformPosY, 'bullet');
                stage.shapeBulletSprite(bullet);
                bullet.y -= 50;
                this.objectsOnPlatform.push(bullet);
            };

            this.createShield = (xPos) => {
                var shield = stage.shields.create(xPos, platformPosY, 'shield');
                stage.shapeShieldSprite(shield);
                shield.y -= 50;
                this.objectsOnPlatform.push(shield);
            };

            this.createMine = (xPos) => {
                var mine = stage.mines.create(xPos, platformPosY, 'mine');
                stage.shapeMineSprite(mine);
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
            platformLeft.body.height = platformHeight;
            platformLeft.y = platformPosY;
            this.platformLeft = platformLeft;

            platformRight = stage.platforms.create(0, 0, 'platform1');
            platformRight.x = platformLeftWidth + platformGapX + (platformRightWidth / 2);
            platformRight.displayWidth = platformRightWidth;
            platformRight.body.width = platformRightWidth;
            platformRight.displayHeight = platformHeight;
            platformRight.body.height = platformHeight;
            platformRight.y = platformPosY ;
            this.platformRight = platformRight;

            stage.levels.push(this);

            var chance = Phaser.Math.FloatBetween(0, 1);

            this.createMine(this.getLeftOrRightX(platformLeft, platformRight));

            if(chance < bulletChance) {
                this.createBullet(this.getLeftOrRightX(platformLeft, platformRight));
            } else if (chance < shieldChance) {
                this.createShield(this.getLeftOrRightX(platformLeft, platformRight));
                this.createShield(this.getLeftOrRightX(platformLeft, platformRight));
            }

            platformPosY += platformGapY;
        };

        this.Player = function(object){
            this.object = object;
            this.bullets = [];
            this.object.displayHeight = 50;
            this.object.displayWidth = 50;
            // Cuts the body into a circle
            this.object.body.setCircle(110, 12 , 10);
            this.object.setCollideWorldBounds(false);
            this.pickup = (power) => {
                if(power.texture.key === 'bullet'){
                    this.bullets.push(power);
                    console.log(this.bullets)
                }
                power.destroy();
            };
            this.shoot = () => {
                if(this.bullets.length > 0){
                    var bullet = stage.physics.add.sprite(this.object.x, this.object.y, 'bullet');
                    bullet.body.velocity.y = 900;
                    stage.shapeBulletSprite(bullet);
                    stage.flyingBullets.add(bullet);
                    this.bullets.pop();
                }
            }
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
        score = 0;
        platformPosY = 400;

        this.platforms = this.physics.add.staticGroup();
        this.levels = [];
        this.bullets = this.physics.add.staticGroup();
        this.shields = this.physics.add.staticGroup();
        this.mines = this.physics.add.staticGroup();
        this.flyingBullets = this.physics.add.staticGroup();
        this.destroyed = 0;

        // Create a few levels
        for(var i = 0; i < 20; i++){
            this.createLevel();
        }
        this.player = new this.Player(this.physics.add.sprite(50, 200, 'ball'));
        // var camera = this.cameras.main;
        this.cameras.main.setBounds(0, 0, canvasWidth);
        // this.cameras.main.setZoom(1.1);
        this.cameras.main.centerOn(0, 0);
        this.cameras.main.fadeIn(3000);
        this.cameras.main.setBackgroundColor('rgba(249, 214, 98,1)');
        // make the camera follow the player


        // // set background color, so the sky is not black
        // this.cameras.main.setBackgroundColor('#ccccff');
        // Set up the player ball
        this.createSpikes();
        this.addColliders();
        this.createInputs();
        this.bulletLoad = 60;

        // Scoreboard
        this.scoreText = this.add.text(16, 50, 'score: 0', { fontSize: '32px', fill: '#111', backgroundColor: '#fff' });
        this.scoreText.setScrollFactor(0);
        this.scoreText.setTint(0xffffff)
    }

    update(){
        this.spikes.y += 1;
        if (this.player.object.y - this.spikes.y > 600){
            this.spikes.y += 5;
        }

        if(this.shieldTime > 0){
            this.mineCollision.active = false;
            this.cameras.main.setBackgroundColor('rgba(60,174,167,1)');
        } else {
            clearInterval(this.shieldIntrerval);
            this.mineCollision.active = true;
            this.cameras.main.setBackgroundColor('rgba(249, 214, 98,1)');
        }

        this.cameras.main.centerOn(this.player.object.x, this.player.object.y);
        // Destroy the platforms passed
        if(this.levels[0].platformLeft.y < this.player.object.y){
            this.levels[0].destroy();
            this.levels.shift();
            this.destroyed++;
            score++;
            this.createLevel();
        }

        this.platforms.refresh();
        this.bullets.refresh();
        this.shields.refresh();
        this.mines.refresh();

        this.scoreText.setText('Score: ' + score
        + ' \nShield time: ' + this.shieldTime
        + ' \nBullet amount: ' + (this.player.bullets.length)
        + ' \nBullet load: ' + ((bulletLoadTime - this.bulletLoad) <= 0 && this.player.bullets.length > 0? 'ready' : 'not ready'));

        if(this.key_D.isDown){
            this.player.object.x += 3;
        } else if(this.key_A.isDown){
            this.player.object.x -= 3;
        } else if(this.jumpButton.isDown){
            if(this.bulletLoad > bulletLoadTime){
                this.bulletLoad = 0;
                this.player.shoot(this);
            }
        }
        this.bulletLoad++;
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
        this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    createLevel(){
        new this.Level();
    }

    addColliders() {
        this.physics.add.collider(this.player.object, this.platforms, (ball, platform) => {
            this.bounce();
            this.destroyed = 0;
        });

        this.physics.add.collider(this.player.object, this.spikes, () => {
            if(score > highScore){
                score = highScore;
            }
            this.scene.start('Menu');
        });

        this.physics.add.collider(this.player.object, this.bullets, (player, bullet) => {
            this.player.pickup(bullet);
        });

        this.mineCollision = this.physics.add.collider(this.player.object, this.mines, () => {
            this.scene.start('Menu');
        });
        this.shieldTime = 0;
        this.shieldIntrerval = null;
        this.physics.add.collider(this.player.object, this.shields, (player, shield) => {
            shield.destroy();
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

    bounce(){
        this.createLevel();
        if(this.destroyed > 2){
            this.levels[0].destroy();
            this.levels.shift();
            this.destroyed++;
            score += this.destroyed * 2;
        }
        this.player.object.body.velocity.y = -300;
    }

    shapeBulletSprite(bullet){
        bullet.displayWidth = bulletWidth;
        bullet.body.width = bulletWidth;
        bullet.displayHeight = bulletHeight;
        bullet.body.height = bulletHeight;
    }

    shapeShieldSprite(bullet){
        bullet.displayWidth = shieldWidth;
        bullet.body.width = shieldWidth;
        bullet.displayHeight = shieldHeight;
        bullet.body.height = shieldHeight;
    }

    shapeMineSprite(bullet){
        bullet.displayWidth = mineWidth;
        bullet.body.width = mineWidth;
        bullet.displayHeight = mineHeight;
        bullet.body.height = mineHeight;
    }
}