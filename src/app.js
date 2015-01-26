var _this = this;
var Hexagon;
(function (Hexagon) {
    (function (Layout) {
        Layout[Layout["ODD_R"] = 0] = "ODD_R";
        Layout[Layout["EVEN_R"] = 1] = "EVEN_R";
        Layout[Layout["ODD_Q"] = 2] = "ODD_Q";
        Layout[Layout["EVEN_Q"] = 3] = "EVEN_Q";
    })(Hexagon.Layout || (Hexagon.Layout = {}));
    var Layout = Hexagon.Layout;
    ;
    function init(cellWidth, cellHeight, layout) {
        Cell.width = cellWidth;
        Cell.height = cellHeight;
        Cell.layout = layout;
    }
    Hexagon.init = init; // init
    /**
     * Hexagonal cell expressed in offset coordinates
     */
    var Cell = (function () {
        function Cell(q, r) {
            this.q = q;
            this.r = r;
        } // constructor
        Cell.prototype.toCube = function () {
            var x, y, z;
            switch (Cell.layout) {
                case 0 /* ODD_R */:
                    x = this.q - (this.r - (this.r & 1)) / 2;
                    z = this.r;
                    y = -x - z;
                    break;
                case 1 /* EVEN_R */:
                    x = this.q - (this.r + (this.r & 1)) / 2;
                    z = this.r;
                    y = -x - z;
                    break;
                case 2 /* ODD_Q */:
                    x = this.q;
                    z = this.r - (this.q - (this.q & 1)) / 2;
                    y = -x - z;
                    break;
                case 3 /* EVEN_Q */:
                    x = this.q;
                    z = this.r - (this.q + (this.q & 1)) / 2;
                    y = -x - z;
                    break;
            }
            return new Cube(x, y, z);
        }; // toCube
        Cell.prototype.toAxial = function () {
            return this.toCube().toAxial();
        }; // toAxial
        Cell.prototype.toPoint = function () {
            var x, y;
            // conversion to axial coordinates
            var a = this.toAxial();
            switch (Cell.layout) {
                case 0 /* ODD_R */:
                case 1 /* EVEN_R */:
                    x = Cell.height * (a.q + a.r / 2);
                    y = Cell.width * 3 / 4 * a.r;
                    break;
                case 2 /* ODD_Q */:
                case 3 /* EVEN_Q */:
                    x = Cell.width * 3 / 4 * a.q;
                    y = Cell.height * (a.r + a.q / 2);
                    break;
            }
            return { x: x, y: y };
        }; // toPoint
        return Cell;
    })();
    Hexagon.Cell = Cell; // Cell
    /**
     * Hexagonal cell expressed in cubic coordinates
     */
    var Cube = (function () {
        function Cube(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        } // constructor
        Cube.prototype.toAxial = function () {
            var q = this.x;
            var r = this.z;
            return new Axial(q, r);
        }; // toAxial
        return Cube;
    })(); // Cube
    /**
     * Hexagonal cell expressed in axial coordinates
     */
    var Axial = (function () {
        function Axial(q, r) {
            this.q = q;
            this.r = r;
        } // constructor
        Axial.prototype.toCube = function () {
            var x = this.q;
            var z = this.r;
            var y = -x - z;
        }; // toCube
        return Axial;
    })(); // Axial
})(Hexagon || (Hexagon = {})); // Hexagon
var GameMap;
(function (GameMap) {
    var width; // width in tiles
    var height; // height in tiles
    GameMap.locations;
    function init(mapWidth, mapHeight, tileWidth, tileHeight) {
        width = mapWidth;
        height = mapHeight;
        Tile.width = tileWidth;
        Tile.height = tileHeight;
        Hexagon.init(Tile.width, Tile.height, 3 /* EVEN_Q */);
        GameMap.locations = new Array(Tile.width);
        for (var i = 0; i < Tile.width; i++) {
            GameMap.locations[i] = new Array(Tile.height);
            for (var j = 0; j < Tile.height; j++) {
                GameMap.locations[i][j] = new Tile(i, j);
            }
        }
    }
    GameMap.init = init; // init
    var Tile = (function () {
        function Tile(q, r) {
            this.cell = new Hexagon.Cell(q, r);
            this.layers = {};
        } // constructor
        return Tile;
    })(); // Tile
    var Layer = (function () {
        function Layer(code) {
            this.code = code;
        } // constructor
        return Layer;
    })(); // Layer
})(GameMap || (GameMap = {})); // GameMap
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
function drawHexMap(container, images) {
    var canvas = document.createElement('canvas');
    container.appendChild(canvas);
    canvas.width = 600;
    canvas.height = 600;
    var ctx = canvas.getContext('2d');
    GameMap.init(8, 8, 72, 72);
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var loc = GameMap.locations[i][j];
            var point = loc.cell.toPoint();
            ctx.drawImage(images['terrain/green.png'], point.x, point.y);
            ctx.drawImage(images['terrain/grid.png'], point.x, point.y);
        }
    }
} // draw
function gameMain(container, images) {
    drawHexMap(container, images);
} // gameMain
window.onload = function () {
    var container = document.getElementById('content');
    loadImages(['terrain/green.png', 'terrain/grid.png'], gameMain.bind(_this, container));
};
//# sourceMappingURL=app.js.map