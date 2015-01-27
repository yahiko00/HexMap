/// <reference path='hexagon.ts' />
/**
 * cf. http://codeincomplete.com/posts/2013/12/3/javascript_game_foundations_loading_assets/
 */
function loadImages(folder, filenames, callback) {
    var images = [];
    var count = filenames.length;
    if (callback) {
        var onload = function () {
            if (--count == 0)
                callback(images);
        };
    }
    for (var i = 0; i < filenames.length; i++) {
        var filename = filenames[i];
        images[i] = document.createElement('img');
        images[i].addEventListener('load', onload);
        images[i].src = folder + filename;
    }
} // loadImages
var Game;
(function (Game) {
    var BaseTerrain;
    (function (BaseTerrain) {
        BaseTerrain[BaseTerrain["GRASS"] = 0] = "GRASS";
        BaseTerrain[BaseTerrain["WATER"] = 1] = "WATER";
        BaseTerrain[BaseTerrain["GRID"] = 2] = "GRID";
    })(BaseTerrain || (BaseTerrain = {}));
    ;
    Game.container;
    var canvas;
    var ctx;
    Game.folder;
    Game.baseTerrainFlatFilenames; // must be stored in reversed order of precedence, index 0 is the highest precedence.
    Game.transitionFlatFilenames;
    Game.baseTerrainPointyFilenames; // must be stored in reversed order of precedence, index 0 is the highest precedence.
    Game.transitionPointyFilenames;
    Game.baseTerrainFlatImages;
    Game.transitionFlatImages;
    Game.baseTerrainPointyImages;
    Game.transitionPointyImages;
    function init(container, folder, baseTerrainFlatFilenames, transitionFlatFilenames, baseTerrainPointyFilenames, transitionPointyFilenames) {
        var _this = this;
        Game.container = container;
        Game.folder = folder;
        Game.baseTerrainFlatFilenames = baseTerrainFlatFilenames;
        Game.transitionFlatFilenames = transitionFlatFilenames;
        Game.baseTerrainPointyFilenames = baseTerrainPointyFilenames;
        Game.transitionPointyFilenames = transitionPointyFilenames;
        loadImages(folder, baseTerrainFlatFilenames, function (images) {
            Game.baseTerrainFlatImages = images;
            loadImages(folder, transitionFlatFilenames, function (images) {
                Game.transitionFlatImages = images;
                loadImages(folder, baseTerrainPointyFilenames, function (images) {
                    Game.baseTerrainPointyImages = images;
                    loadImages(folder, transitionPointyFilenames, function (images) {
                        Game.transitionPointyImages = images;
                        main.call(_this);
                    });
                });
            });
        });
    }
    Game.init = init; // init
    function main() {
        Hexagon.init(10, 8, 72, 72, true, true); // Flat-topped hexagons, even-q layout
        canvas = document.createElement('canvas');
        Game.container.appendChild(canvas);
        canvas.width = 800;
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
        // we assume (q, r) are valid cell coordinates
        var cell = Hexagon.map[q][r];
        var point = cell.toPoint();
        var baseTerrain = cell.layers[Hexagon.LayerTypeEnum.base];
        if (Hexagon.flatTopped) {
            var baseTerrainImages = Game.baseTerrainFlatImages;
            var transitionImages = Game.transitionFlatImages;
        }
        else {
            var baseTerrainImages = Game.baseTerrainPointyImages;
            var transitionImages = Game.transitionPointyImages;
        }
        switch (baseTerrain) {
            case 0 /* GRASS */:
                ctx.drawImage(baseTerrainImages[baseTerrain], point.x, point.y);
                break;
            case 1 /* WATER */:
                ctx.drawImage(baseTerrainImages[baseTerrain], point.x, point.y);
                var neighbors = cell.getNeighbors();
                for (var i = 0; i < 6; i++) {
                    if (neighbors[i] && neighbors[i].layers['b'] == 0 /* GRASS */) {
                        ctx.drawImage(transitionImages[i], point.x, point.y);
                    }
                }
                break;
        }
        ctx.drawImage(baseTerrainImages[2 /* GRID */], point.x, point.y);
    } // drawTile
})(Game || (Game = {})); // Game
window.onload = function () {
    Game.init(document.getElementById('content'), '../data/images/', [
        'flat-top/terrain/green.png',
        'flat-top/terrain/ocean-A01.png',
        'flat-top/terrain/grid.png',
    ], [
        'flat-top/terrain/green-medium-n.png',
        'flat-top/terrain/green-medium-ne.png',
        'flat-top/terrain/green-medium-se.png',
        'flat-top/terrain/green-medium-s.png',
        'flat-top/terrain/green-medium-sw.png',
        'flat-top/terrain/green-medium-nw.png',
    ], [
        'pointy-top/terrain/green.png',
        'pointy-top/terrain/ocean-A01.png',
        'pointy-top/terrain/grid.png',
    ], [
        'pointy-top/terrain/green-medium-ne.png',
        'pointy-top/terrain/green-medium-e.png',
        'pointy-top/terrain/green-medium-se.png',
        'pointy-top/terrain/green-medium-sw.png',
        'pointy-top/terrain/green-medium-w.png',
        'pointy-top/terrain/green-medium-nw.png',
    ]);
};
//# sourceMappingURL=hexmap.js.map