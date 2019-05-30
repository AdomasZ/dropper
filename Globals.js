var score = 0;
var highScore = 0;
var bulletLoadTime = 120;
var canvasWidth = 800;

var platformHeight = 20;
var platformGapX = 100;
var platformGapY = 130;
var platformPosY = 400;

var config = {
    type: Phaser.AUTO,
    width: canvasWidth,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y:  600 }
        }
    },
    scene: [ Menu , Dropper ]
};

var game = new Phaser.Game(config);
$( document ).ready(function() {

    $('#button').click((e) => {game.scene.stop('Menu');game.scene.start('Dropper');});
});