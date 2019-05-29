class Dropper extends Phaser.Scene {
    constructor(){
        super({key:"Dropper"});
    }
    preload(){
        this.load.image('ball', './assets/ball.png');
        this.load.image('platform', 'http://labs.phaser.io/assets/sprites/platform.png');
    }

    create(){
        this.platforms = this.physics.add.staticGroup();
        var width = 800;
        var pHeight = 20;
        var gap = 100;
        var y = 100;
        var p1w;
        for(var i = 0; i < 50; i++){
            p1w = Phaser.Math.RND.integerInRange(100, width - 200);
            var p2w = width - p1w - gap;

            var p1 = this.platforms.create(600, 400, 'platform');

            var p2 = this.platforms.create(600, 400, 'platform');
            p1.next = p2;
            p1.x = p1w/2;
            p1.displayWidth = p1w;
            p1.body.width = p1w;
            p1.displayHeight = pHeight;
            p1.body.height = pHeight;
            p1.y = y;

            p2.x = p1w + gap + (p2w/2);
            p2.displayWidth = p2w;
            p2.body.width = p2w;
            p2.displayHeight = pHeight;
            p2.body.height = pHeight;
            p2.y = y;
            y += 130;
        }

        this.player = this.physics.add.sprite(100, 100, 'ball');
        this.player.displayHeight = 50;
        this.player.displayWidth = 50;
        this.player.setBounce(0, 0.9);

        this.destroyed = 0;

        this.player.body.damping = 2;
        this.player.setDragY(2);
        this.player.setCollideWorldBounds(true);
        this.player.onCollide = true;
        this.previousCollision = '';
        this.physics.add.collider(this.player, this.platforms, (ball, platform) => {
            if(this.destroyed > 4){
                this.platforms.children.getArray()[0].destroy();
            }
            this.destroyed = 0;
        } , false);

        this.platforms.refresh();
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    }
    update(delta){
        this.platforms.children.getArray().forEach((platform, index) => {

            platform.y -= 1;
            if(this.player.y > platform.y){
                platform.destroy();
                this.destroyed++;
            }
        });

        this.platforms.refresh();
        if(this.key_D.isDown){
            this.player.x+= 3;
        } else if(this.key_A.isDown){
            this.player.x -= 3;
        } if (this.jumpButton.isDown && this.player.body.onFloor())
        {
            this.player.body.velocity.y = -300;
        }
    }

    addLevel(group){

    }
}

// this.input.keyboard.down('keyup_D', (e) => {
//     this.image.x += 1;
// }, this);
