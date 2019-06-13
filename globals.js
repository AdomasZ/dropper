// If the cookie isn't set
if(document.cookie < 1){
    document.cookie = 0;
}
var highScore = document.cookie;
var score = 0;
var bulletLoadTime = 3000;
var shieldTime = 5000;
var spikeSpeed = 2;
var movementSpeed = 6;


var canvasWidth = 600;
var canvasHeight = 800;
var platformHeight = 10;
var platformGapX = 130;
var platformGapY = 150;
var platformPosY = 400;

var mineWidth = 60;
var mineHeight = 30;

var shieldWidth = 45;
var shieldHeight = 50;

var bulletWidth = 20;
var bulletHeight = 50;

var bulletChance = 0.2;
var shieldChance = 0.4;
// Load fonts
WebFontConfig = {
    google: { families: ["Roboto"]}
};

(function() {
    var webFont = document.createElement('script');
    webFont.src = 'http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    webFont.type = 'text/javascript';
    webFont.async = 'true';
    var script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(webFont, script);
})();