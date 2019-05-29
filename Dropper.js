class Dropper extends Phaser.Scene {
    constructor(){
        super({key:"Dropper"});
    }
    preload(){
        this.load.image('ball', './assets/ball.png');
        this.load.image('platform', 'http://labs.phaser.io/assets/sprites/platform.png');
        this.load.image('spikes', './assets/spikes.png')
    }

    create(){
        var canvasWidth = this.sys.game.canvas.width;
        this.spikes = this.physics.add.sprite(canvasWidth / 2, 0, 'spikes', true);
        this.spikes.displayWidth = canvasWidth;
        this.spikes.body.width = canvasWidth;
        this.spikes.displayHeight = 100;
        this.spikes.body.height = 100;
        this.spikes.body.moves = false;
        this.levels = [];
        this.platforms = this.physics.add.staticGroup();
        this.destroyed = 0;
        this.scoreText = this.add.text(16, 50, 'score: 0', { fontSize: '32px', fill: '#fff' });

        var platformHeight = 20;
        var platformGapX = 100;
        var platformGapY = 130;
        var platformPosY = 400;
        var platformLeft;
        var platformRight;
        var platformLeftWidth;
        var platformRightWidth;

        for(var i = 0; i < 50; i++){
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
            platformRight.y = platformPosY;

            platformPosY += platformGapY;
        }

        // Set up the player ball
        this.player = this.physics.add.sprite(50, 200, 'ball');
        this.player.displayHeight = 50;
        this.player.displayWidth = 50;
        // Cuts the body into a circle
        this.player.body.setCircle(130,5,10);

        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms, (ball, platform) => {
            this.bounce(ball, platform);
            this.destroyed = 0;
        });
        this.physics.add.collider(this.player, this.spikes, () => {
            this.scene.start('Menu');
        });

        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        //this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    }

    update(){

        this.platforms.children.getArray().forEach((platform, index) => {
            platform.y -= 1;
            if(this.player.y-1 > platform.y){
                platform.destroy();
                this.destroyed++;
                score++;

            }
        });
        this.scoreText.setText('Score: ' + score);
        this.platforms.refresh();
        if(this.key_D.isDown){
            this.player.x += 3;
        } else if(this.key_A.isDown){
            this.player.x -= 3;
        } else {
            this.player.body.velocity.x = 0;
        }
    }

    bounce(ball, platform){
        console.log(this.destroyed);
        if(this.destroyed > 4){
            this.platforms.children.getArray()[0].destroy();
            this.platforms.children.getArray()[0].destroy();
            score += this.destroyed * 2;
        }

        this.player.body.velocity.y = -300;
    }
}

// this.input.keyboard.down('keyup_D', (e) => {
//     this.image.x += 1;
// }, this);
