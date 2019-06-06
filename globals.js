var score = 0;
var highScore = 0;
var bulletLoadTime = 120;
var shieldTime = 5000;

var canvasWidth = 600;
var canvasHeight = 900;
var platformHeight = 20;
var platformGapX = 130;
var platformGapY = 130;
var platformPosY = 400;

var mineWidth = 60;
var mineHeight = 30;

var shieldWidth = 45;
var shieldHeight = 50;

var bulletWidth = 20;
var bulletHeight = 50;

var bulletChance = 0.2;
var shieldChance = 0.6;

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