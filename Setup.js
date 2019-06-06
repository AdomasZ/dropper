
var config = {
    type: Phaser.AUTO,
    width: canvasWidth,
    height: canvasHeight,
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