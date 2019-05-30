class Dropper extends Phaser.Scene {
    constructor(){
        super({key:"Dropper"});
    }
    preload(){
        this.load.image('ball', './assets/ball.png');
        this.load.image('platform', 'http://labs.phaser.io/assets/sprites/platform.png');
        this.load.image('spikes', './assets/spikes.png')
        this.load.image('bullet', './assets/bullet.png')
    }

    create(){
        score = 0;
        this.platforms = this.physics.add.staticGroup();
        this.levels = [];
        this.powerUps = this.physics.add.staticGroup();
        this.flyingBullets = this.physics.add.staticGroup();
        this.destroyed = 0;

        // Scoreboard
        this.scoreText = this.add.text(16, 50, 'score: 0', { fontSize: '32px', fill: '#fff' });

        // Create a few levels
        for(var i = 0; i < 7; i++){
            this.createLevel();
        }

        this.player = new Player(this.physics.add.sprite(50, 200, 'ball'));
        // Set up the player ball
        this.createSpikes();
        this.addColliders();
        this.createInputs();
        this.bulletLoad = 60;
    }

    update(){
        // Destroy the platforms passed
        if(this.levels[0].p1.y < this.player.object.y){
            this.levels[0].destroy();
            this.levels.shift();
            this.destroyed++;
            score++;
            this.createLevel();
        }

        this.levels.forEach((platform) => {
            platform.move();
        });

        this.platforms.refresh();
        this.powerUps.refresh();
        platformPosY -= 1;
        this.scoreText.setText('Score: ' + score);

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
        this.spikes = this.physics.add.sprite(canvasWidth / 2, 0, 'spikes', true);
        this.spikes.displayWidth = canvasWidth;
        this.spikes.body.width = canvasWidth;
        this.spikes.displayHeight = 100;
        this.spikes.body.height = 100;
        this.spikes.body.moves = false;
    }

    createInputs() {
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    createLevel(){
        var platformLeft;
        var platformRight;
        var platformLeftWidth;
        var platformRightWidth;
        platformLeftWidth = Phaser.Math.RND.integerInRange(100, canvasWidth - 200);
        platformRightWidth = canvasWidth - platformLeftWidth - platformGapX;

        platformLeft = this.platforms.create(600, 400, 'platform');
        platformLeft.x = platformLeftWidth / 2;
        platformLeft.displayWidth = platformLeftWidth;
        platformLeft.body.width = platformLeftWidth;
        platformLeft.displayHeight = platformHeight;
        platformLeft.body.height = platformHeight;
        platformLeft.y = platformPosY;

        platformRight = this.platforms.create(600, 400, 'platform');
        platformRight.x = platformLeftWidth + platformGapX + (platformRightWidth / 2);
        platformRight.displayWidth = platformRightWidth;
        platformRight.body.width = platformRightWidth;
        platformRight.displayHeight = platformHeight;
        platformRight.body.height = platformHeight;
        platformRight.y = platformPosY ;
        var bullet = this.powerUps.create(Phaser.Math.RND.integerInRange(100, canvasWidth - 100), platformPosY, 'bullet');
        // var bullet = this.powerUps.create(Phaser.Math.RND.integerInRange(100, canvasWidth - 100), platformPosY, 'bullet');
        this.shapeBulletSprite(bullet);
        bullet.y -= 50;
        platformPosY += platformGapY;
        this.levels.push(new Level(platformRight, platformLeft, bullet));
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

        this.physics.add.collider(this.player.object, this.powerUps, (player, bullet) => {
            this.player.pickup(bullet);
            // this.scene.start('Menu');
        });

        this.physics.add.collider(this.flyingBullets, this.platforms, (bullet, platform) => {
            bullet.destroy();
            platform.destroy();
            this.platforms.refresh();
            this.flyingBullets.refresh();
        });
    }

    bounce(){
        if(this.destroyed > 2){
            this.platforms.children.getArray()[0].destroy();
            this.platforms.children.getArray()[0].destroy();
            score += this.destroyed * 2;
        }
        console.log(this.levels.length)
        this.player.object.body.velocity.y = -300;
    }

    shapeBulletSprite(bullet){
        bullet.displayWidth = 20;
        bullet.body.width = 20;
        bullet.displayHeight = 50;
        bullet.body.height = 50;
    }
    shapePlatformSprite(platform, width){
        bullet.displayWidth = 20;
        bullet.body.width = 20;
        bullet.displayHeight = 50;
        bullet.body.height = 50;
    }
}
