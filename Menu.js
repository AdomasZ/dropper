class Menu extends Phaser.Scene {
    constructor(){
        super({key:"Menu"});
    }
    preload(){
        this.load.image('ball', './assets/ball.png');
        this.load.image('platform', 'http://labs.phaser.io/assets/sprites/platform.png');
        this.load.image('start', './assets/startBtn.png')
    }

    create(){
        // Set up the player ball
        this.scoreText = this.add.text(16, 50, 'Game over', { fontSize: '32px', fill: '#555' });
        this.startButton = this.add.sprite(100, 300, 'start').setInteractive();
        this.startButton.setScale(0.2, 0.2);
        this.startButton.on('pointerdown', function (pointer) {
            this.scene.start('Dropper');
        }, this);
        this.scoreText.setText('Game Over!');
    }

}

// this.input.keyboard.down('keyup_D', (e) => {
//     this.image.x += 1;
// }, this);
