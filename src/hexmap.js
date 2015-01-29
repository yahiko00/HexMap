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
    var FringeTerrain;
    (function (FringeTerrain) {
        FringeTerrain[FringeTerrain["TREE"] = 0] = "TREE";
    })(FringeTerrain || (FringeTerrain = {}));
    ;
    var Grid;
    (function (Grid) {
        Grid[Grid["DEFAULT"] = 0] = "DEFAULT";
    })(Grid || (Grid = {}));
    ;
    var LayerTypeEnum = (function () {
        function LayerTypeEnum() {
        }
        LayerTypeEnum.base = 'b';
        LayerTypeEnum.fringe = 'f';
        LayerTypeEnum.object = 'o';
        LayerTypeEnum.unit = 'u';
        return LayerTypeEnum;
    })();
    Hexmap.LayerTypeEnum = LayerTypeEnum; // LayerTypeEnum
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
    Hexmap.fringeFilenames;
    Hexmap.baseTerrainFlatImages;
    Hexmap.transitionFlatImages;
    Hexmap.gridFlatImages;
    Hexmap.baseTerrainPointyImages;
    Hexmap.transitionPointyImages;
    Hexmap.gridPointyImages;
    Hexmap.fringeImages;
    Hexmap.showGrid;
    Hexmap.showTransition;
    function init(container, folder, baseTerrainFlatFilenames, transitionFlatFilenames, gridFlatFilenames, baseTerrainPointyFilenames, transitionPointyFilenames, gridPointyFilenames, fringeFilenames) {
        var _this = this;
        this.container = container;
        this.folder = folder;
        this.baseTerrainFlatFilenames = baseTerrainFlatFilenames;
        this.transitionFlatFilenames = transitionFlatFilenames;
        this.baseTerrainPointyFilenames = baseTerrainPointyFilenames;
        this.transitionPointyFilenames = transitionPointyFilenames;
        this.fringeFilenames = fringeFilenames;
        this.showGrid = true;
        this.showTransition = true;
        Hexagon.init(10, 8, 72, 72, true, true); // Flat-topped hexagons, even-q layout
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        container.appendChild(canvas);
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
                                loadImages(folder, fringeFilenames, function (images) {
                                    Hexmap.fringeImages = images;
                                    generate.call(_this);
                                });
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
                Hexagon.map[i][j].layers[LayerTypeEnum.base] = Math.floor(Math.random() * nbBaseTerrain);
            }
        }
        refresh();
    }
    Hexmap.generate = generate; // generate;
    function refresh() {
        if (canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        drawMap();
    }
    Hexmap.refresh = refresh; // refresh
    function drawMap() {
        var rect = Hexagon.getRectangle();
        canvas.width = rect[1].x;
        canvas.height = rect[1].y;
        for (var i = 0; i < Hexagon.mapWidth; i++) {
            for (var j = 0; j < Hexagon.mapHeight; j++) {
                drawTile(i, j);
            }
        }
        // display trees
        drawImage(Hexmap.fringeImages[0 /* TREE */], Hexagon.map[2][2]);
        drawImage(Hexmap.fringeImages[0 /* TREE */], Hexagon.map[3][2]);
        drawImage(Hexmap.fringeImages[0 /* TREE */], Hexagon.map[3][3]);
    } // drawMap
    function drawTile(q, r) {
        // we assume (q, r) are valid cell coordinates
        var cell = Hexagon.map[q][r];
        var point = cell.toPoint();
        var baseTerrain = cell.layers[LayerTypeEnum.base];
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
                drawImage(baseTerrainImages[baseTerrain], cell);
                break;
            case 1 /* GRASS */:
                drawImage(baseTerrainImages[baseTerrain], cell);
                if (Hexmap.showTransition) {
                    var neighbors = cell.getNeighbors();
                    for (var i = 0; i < 6; i++) {
                        if (neighbors[i] && neighbors[i].layers['b'] == 0 /* HILL */) {
                            drawImage(transitionImages[i], cell);
                        }
                    }
                }
                break;
            case 2 /* WATER */:
                drawImage(baseTerrainImages[baseTerrain], cell);
                if (Hexmap.showTransition) {
                    var neighbors = cell.getNeighbors();
                    for (var i = 0; i < 6; i++) {
                        if (neighbors[i] && neighbors[i].layers['b'] == 0 /* HILL */) {
                            drawImage(transitionImages[i], cell);
                        }
                        else if (neighbors[i] && neighbors[i].layers['b'] == 1 /* GRASS */) {
                            drawImage(transitionImages[i + 6], cell);
                        }
                    }
                }
                break;
        }
        if (Hexmap.showGrid) {
            drawImage(gridImages[0 /* DEFAULT */], cell);
        }
    } // drawTile
    function drawImage(image, cell) {
        var imgCenter = {
            x: Math.floor(image.width / 2),
            y: Math.floor(image.height / 2)
        };
        var tileCenter = cell.getCenter();
        ctx.drawImage(image, tileCenter.x - imgCenter.x, tileCenter.y - imgCenter.y);
    } // drawImage
})(Hexmap || (Hexmap = {})); // Hexmap
//# sourceMappingURL=hexmap.js.map