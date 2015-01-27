/// <reference path='hexagon.ts' />
var _this = this;
/**
 * cf. http://codeincomplete.com/posts/2013/12/3/javascript_game_foundations_loading_assets/
 */
function loadImages(filenames, callback) {
    var images = {};
    var count = filenames.length;
    if (callback) {
        var onload = function () {
            if (--count == 0)
                callback(images);
        };
    }
    for (var i = 0; i < filenames.length; i++) {
        var filename = filenames[i];
        images[filename] = document.createElement('img');
        images[filename].addEventListener('load', onload);
        images[filename].src = "../data/images/" + filename;
    }
} // loadImages
var Game;
(function (Game) {
    Game.container;
    Game.images;
    var canvas;
    var ctx;
    function main(container, images) {
        Game.container = container;
        Game.images = images;
        Hexagon.init(10, 8, 72, 72, true, true);
        canvas = document.createElement('canvas');
        container.appendChild(canvas);
        canvas.width = 600;
        canvas.height = 600;
        ctx = canvas.getContext('2d');
        drawMap();
    }
    Game.main = main; // main
    function drawMap() {
        for (var i = 0; i < Hexagon.mapWidth; i++) {
            for (var j = 0; j < Hexagon.mapHeight; j++) {
                drawTile(i, j);
            }
        }
    } // drawMap
    function drawTile(q, r) {
        var cell = Hexagon.map[q][r];
        var point = cell.toPoint();
        switch (cell.layers[Hexagon.LayerTypeEnum.base]) {
            case 0:
                ctx.drawImage(Game.images['flat-top/terrain/ocean-A01.png'], point.x, point.y);
                var neighbors = cell.getNeighbors();
                if (neighbors[0 /* N */] && neighbors[0 /* N */].layers['b'] == 1) {
                    ctx.drawImage(Game.images['flat-top/terrain/green-medium-n.png'], point.x, point.y);
                }
                if (neighbors[1 /* NE */] && neighbors[1 /* NE */].layers['b'] == 1) {
                    ctx.drawImage(Game.images['flat-top/terrain/green-medium-ne.png'], point.x, point.y);
                }
                if (neighbors[2 /* SE */] && neighbors[2 /* SE */].layers['b'] == 1) {
                    ctx.drawImage(Game.images['flat-top/terrain/green-medium-se.png'], point.x, point.y);
                }
                if (neighbors[3 /* S */] && neighbors[3 /* S */].layers['b'] == 1) {
                    ctx.drawImage(Game.images['flat-top/terrain/green-medium-s.png'], point.x, point.y);
                }
                if (neighbors[4 /* SW */] && neighbors[4 /* SW */].layers['b'] == 1) {
                    ctx.drawImage(Game.images['flat-top/terrain/green-medium-sw.png'], point.x, point.y);
                }
                if (neighbors[5 /* NW */] && neighbors[5 /* NW */].layers['b'] == 1) {
                    ctx.drawImage(Game.images['flat-top/terrain/green-medium-nw.png'], point.x, point.y);
                }
                break;
            case 1:
                ctx.drawImage(Game.images['flat-top/terrain/green.png'], point.x, point.y);
                break;
        }
        ctx.drawImage(Game.images['flat-top/terrain/grid.png'], point.x, point.y);
    } // drawTile
})(Game || (Game = {})); // Game
window.onload = function () {
    var container = document.getElementById('content');
    loadImages([
        'flat-top/terrain/green.png',
        'flat-top/terrain/green-medium-n.png',
        'flat-top/terrain/green-medium-ne.png',
        'flat-top/terrain/green-medium-se.png',
        'flat-top/terrain/green-medium-s.png',
        'flat-top/terrain/green-medium-sw.png',
        'flat-top/terrain/green-medium-nw.png',
        'flat-top/terrain/ocean-A01.png',
        'flat-top/terrain/grid.png'
    ], Game.main.bind(_this, container));
};
//# sourceMappingURL=hexmap.js.map