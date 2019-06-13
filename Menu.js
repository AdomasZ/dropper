class Menu extends Phaser.Scene {
    constructor(){
        super({key:"Menu"});
    }
    preload(){
        this.load.image('menu', './assets/menu.png');
        this.load.image('start', './assets/start.png');
    }

    create(){
        this.add.image(canvasWidth/2,canvasHeight/2,'menu');
        this.scoreText = this.add.text(canvasWidth/2 ,canvasHeight/4, 'Game over', { fontSize: '32px', fill: 'rgb(255, 255, 255)', backgroundColor: 'rgb(234,85,62)', fontFamily: 'roboto'});
        this.scoreText.setText('High Score: ' + highScore + '\nScore: ' + score);
        this.scoreText.x -= this.scoreText.width / 2;
        this.scoreText.y -= this.scoreText.height / 2;
        this.startButton = this.add.image(canvasWidth/2 ,canvasHeight/2, 'start').setInteractive();
        this.startButton.displayWidth -= 90;
        this.startButton.displayHeight -= 90;
        this.restartBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.startButton.on('pointerdown', function () {
            this.scene.start('Dropper');
        }, this);
    }
    update(){
        if(this.restartBtn.isDown) {
            this.scene.start('Dropper');
        }
    }
}
