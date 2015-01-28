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
var Hexmap;
(function (Hexmap) {
    var BaseTerrain;
    (function (BaseTerrain) {
        BaseTerrain[BaseTerrain["HILL"] = 0] = "HILL";
        BaseTerrain[BaseTerrain["GRASS"] = 1] = "GRASS";
        BaseTerrain[BaseTerrain["WATER"] = 2] = "WATER";
    })(BaseTerrain || (BaseTerrain = {}));
    ;
    var Grid;
    (function (Grid) {
        Grid[Grid["DEFAULT"] = 0] = "DEFAULT";
    })(Grid || (Grid = {}));
    ;
    Hexmap.container;
    var canvas;
    var ctx;
    Hexmap.folder;
    Hexmap.baseTerrainFlatFilenames; // must be stored in reversed order of precedence, index 0 is the highest precedence.
    Hexmap.transitionFlatFilenames;
    Hexmap.gridFlatFilenames;
    Hexmap.baseTerrainPointyFilenames; // must be stored in reversed order of precedence, index 0 is the highest precedence.
    Hexmap.transitionPointyFilenames;
    Hexmap.gridPointyFilenames;
    Hexmap.baseTerrainFlatImages;
    Hexmap.transitionFlatImages;
    Hexmap.gridFlatImages;
    Hexmap.baseTerrainPointyImages;
    Hexmap.transitionPointyImages;
    Hexmap.gridPointyImages;
    Hexmap.showGrid;
    Hexmap.showTransition;
    function init(container, folder, baseTerrainFlatFilenames, transitionFlatFilenames, gridFlatFilenames, baseTerrainPointyFilenames, transitionPointyFilenames, gridPointyFilenames) {
        var _this = this;
        this.showGrid = true;
        this.showTransition = true;
        this.folder = folder;
        this.baseTerrainFlatFilenames = baseTerrainFlatFilenames;
        this.transitionFlatFilenames = transitionFlatFilenames;
        this.baseTerrainPointyFilenames = baseTerrainPointyFilenames;
        this.transitionPointyFilenames = transitionPointyFilenames;
        this.container = container;
        Hexagon.init(10, 8, 72, 72, true, true); // Flat-topped hexagons, even-q layout
        canvas = document.createElement('canvas');
        container.appendChild(canvas);
        canvas.width = 800;
        canvas.height = 600;
        ctx = canvas.getContext('2d');
        loadImages(folder, baseTerrainFlatFilenames, function (images) {
            Hexmap.baseTerrainFlatImages = images;
            loadImages(folder, transitionFlatFilenames, function (images) {
                Hexmap.transitionFlatImages = images;
                loadImages(folder, gridFlatFilenames, function (images) {
                    Hexmap.gridFlatImages = images;
                    loadImages(folder, baseTerrainPointyFilenames, function (images) {
                        Hexmap.baseTerrainPointyImages = images;
                        loadImages(folder, transitionPointyFilenames, function (images) {
                            Hexmap.transitionPointyImages = images;
                            loadImages(folder, gridPointyFilenames, function (images) {
                                Hexmap.gridPointyImages = images;
                                generate.call(_this);
                            });
                        });
                    });
                });
            });
        });
    }
    Hexmap.init = init; // init
    function generate() {
        var nbBaseTerrain = Object.keys(BaseTerrain).length / 2;
        Hexagon.map = [];
        Hexagon.map = new Array(Hexagon.mapWidth);
        for (var i = 0; i < Hexagon.mapWidth; i++) {
            Hexagon.map[i] = new Array(Hexagon.mapHeight);
            for (var j = 0; j < Hexagon.mapHeight; j++) {
                Hexagon.map[i][j] = new Hexagon.Cell(i, j);
                Hexagon.map[i][j].layers[Hexagon.LayerTypeEnum.base] = Math.floor(Math.random() * nbBaseTerrain);
            }
        }
        refresh();
    }
    Hexmap.generate = generate; // generate;
    function refresh() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap();
    }
    Hexmap.refresh = refresh; // refresh
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
            var baseTerrainImages = Hexmap.baseTerrainFlatImages;
            var transitionImages = Hexmap.transitionFlatImages;
            var gridImages = Hexmap.gridFlatImages;
        }
        else {
            var baseTerrainImages = Hexmap.baseTerrainPointyImages;
            var transitionImages = Hexmap.transitionPointyImages;
            var gridImages = Hexmap.gridPointyImages;
        }
        switch (baseTerrain) {
            case 0 /* HILL */:
                ctx.drawImage(baseTerrainImages[baseTerrain], point.x, point.y);
                break;
            case 1 /* GRASS */:
                ctx.drawImage(baseTerrainImages[baseTerrain], point.x, point.y);
                if (Hexmap.showTransition) {
                    var neighbors = cell.getNeighbors();
                    for (var i = 0; i < 6; i++) {
                        if (neighbors[i] && neighbors[i].layers['b'] == 0 /* HILL */) {
                            ctx.drawImage(transitionImages[i], point.x, point.y);
                        }
                    }
                }
                break;
            case 2 /* WATER */:
                ctx.drawImage(baseTerrainImages[baseTerrain], point.x, point.y);
                if (Hexmap.showTransition) {
                    var neighbors = cell.getNeighbors();
                    for (var i = 0; i < 6; i++) {
                        if (neighbors[i] && neighbors[i].layers['b'] == 0 /* HILL */) {
                            ctx.drawImage(transitionImages[i], point.x, point.y);
                        }
                        else if (neighbors[i] && neighbors[i].layers['b'] == 1 /* GRASS */) {
                            ctx.drawImage(transitionImages[i + 6], point.x, point.y);
                        }
                    }
                }
                break;
        }
        if (Hexmap.showGrid) {
            ctx.drawImage(gridImages[0 /* DEFAULT */], point.x, point.y);
        }
    } // drawTile
})(Hexmap || (Hexmap = {})); // Hexmap
//# sourceMappingURL=hexmap.js.map