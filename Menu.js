class Menu extends Phaser.Scene {
    constructor(){
        super({key:"Menu"});
    }
    preload(){
        this.load.image('menu', './assets/menu.png');
        this.load.image('platform', 'http://labs.phaser.io/assets/sprites/platform.png');
        this.load.image('start', './assets/start.png')
    }

    create(){
        this.add.image(canvasWidth/2,canvasHeight/2,'menu');
        this.scoreText = this.add.text(canvasWidth/2 ,canvasHeight/4, 'Game over', { fontSize: '32px', fill: 'rgb(23,63,96)', backgroundColor: 'rgb(250,214,97)', fontFamily: 'roboto'});
        this.scoreText.setText('High Score: ' + highScore);
        this.scoreText.x -= this.scoreText.width / 2;
        this.scoreText.y -= this.scoreText.height / 2;
        this.startButton = this.add.image(canvasWidth/2 ,canvasHeight/2, 'start').setInteractive();
        this.startButton.displayWidth -= 90;
        this.startButton.displayHeight -= 90;
        this.startButton.on('pointerdown', function (pointer) {
            this.scene.start('Dropper');
        }, this);
    }
}
