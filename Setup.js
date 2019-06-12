
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

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('bulletTimer').innerText = `The bullets have a cool-down timer of ${bulletLoadTime / 1000} seconds.`;
    document.getElementById('shieldTimer').innerText = `The shield has a duration of ${shieldTime / 1000} seconds.`;
    document.getElementById('chance').innerText = `The chance fo a bullet to spawn on a platform is ${bulletChance * 100}% and shield ${shieldChance * 100}% .`;
});