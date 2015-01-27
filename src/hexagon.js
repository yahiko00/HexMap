var Hexagon;
(function (Hexagon) {
    Hexagon.flatTopped; // flat topped hexagon if true, pointy topped hexagon if false
    Hexagon.evenOffset; // even offset layout if true, odd offset layout if false
    (function (Layout) {
        Layout[Layout["ODD_R"] = 0] = "ODD_R";
        Layout[Layout["EVEN_R"] = 1] = "EVEN_R";
        Layout[Layout["ODD_Q"] = 2] = "ODD_Q";
        Layout[Layout["EVEN_Q"] = 3] = "EVEN_Q";
    })(Hexagon.Layout || (Hexagon.Layout = {}));
    var Layout = Hexagon.Layout;
    ;
    (function (DirectionR) {
        DirectionR[DirectionR["NE"] = 0] = "NE";
        DirectionR[DirectionR["E"] = 1] = "E";
        DirectionR[DirectionR["SE"] = 2] = "SE";
        DirectionR[DirectionR["SW"] = 3] = "SW";
        DirectionR[DirectionR["W"] = 4] = "W";
        DirectionR[DirectionR["NW"] = 5] = "NW";
    })(Hexagon.DirectionR || (Hexagon.DirectionR = {}));
    var DirectionR = Hexagon.DirectionR;
    ;
    (function (DirectionQ) {
        DirectionQ[DirectionQ["N"] = 0] = "N";
        DirectionQ[DirectionQ["NE"] = 1] = "NE";
        DirectionQ[DirectionQ["SE"] = 2] = "SE";
        DirectionQ[DirectionQ["S"] = 3] = "S";
        DirectionQ[DirectionQ["SW"] = 4] = "SW";
        DirectionQ[DirectionQ["NW"] = 5] = "NW";
    })(Hexagon.DirectionQ || (Hexagon.DirectionQ = {}));
    var DirectionQ = Hexagon.DirectionQ;
    ;
    var movesR = [
        [+1, -1, 0],
        [+1, 0, -1],
        [0, +1, -1],
        [-1, +1, 0],
        [-1, 0, +1],
        [0, -1, +1]
    ];
    var movesQ = [
        [0, +1, -1],
        [+1, 0, -1],
        [+1, -1, 0],
        [0, -1, +1],
        [-1, 0, +1],
        [-1, +1, 0]
    ];
    Hexagon.mapWidth; // map width in cells
    Hexagon.mapHeight; // map height in cells
    Hexagon.mapLayout;
    Hexagon.map;
    Hexagon.cellWidth; // cell width in pixels
    Hexagon.cellHeight; // cell height in pixels
    // Terrains must be ordered by precedence.
    // First one has the highest precedence.
    (function (Terrain) {
        Terrain[Terrain["GREEN_GRASS"] = 0] = "GREEN_GRASS";
        Terrain[Terrain["MEDIUM_DEEP_WATER"] = 1] = "MEDIUM_DEEP_WATER";
    })(Hexagon.Terrain || (Hexagon.Terrain = {}));
    var Terrain = Hexagon.Terrain;
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
    Hexagon.LayerTypeEnum = LayerTypeEnum; // LayerTypeEnum
    function init(mapWidth, mapHeight, cellWidth, cellHeight, flatTopped, evenOffset) {
        Hexagon.mapWidth = mapWidth;
        Hexagon.mapHeight = mapHeight;
        Hexagon.flatTopped = flatTopped;
        Hexagon.evenOffset = evenOffset;
        Hexagon.cellWidth = cellWidth;
        Hexagon.cellHeight = cellHeight;
        Hexagon.mapLayout = (evenOffset ? 1 : 0) | (flatTopped ? 1 : 0) << 1;
        Hexagon.map = new Array(mapWidth);
        for (var i = 0; i < mapWidth; i++) {
            Hexagon.map[i] = new Array(mapHeight);
            for (var j = 0; j < mapHeight; j++) {
                Hexagon.map[i][j] = new Cell(i, j);
                Hexagon.map[i][j].layers[LayerTypeEnum.base] = Math.round(Math.random());
            }
        }
    }
    Hexagon.init = init; // init
    /**
      * Hexagonal cell expressed in offset coordinates
      */
    var Cell = (function () {
        function Cell(q, r) {
            this.q = q;
            this.r = r;
            this.layers = {};
        } // constructor
        Cell.prototype.toCube = function () {
            var x, y, z;
            switch (Hexagon.mapLayout) {
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
            if (Hexagon.flatTopped) {
                x = Hexagon.cellWidth * 3 / 4 * a.q;
                y = Hexagon.cellHeight * (a.r + a.q / 2);
            }
            else {
                x = Hexagon.cellHeight * (a.q + a.r / 2);
                y = Hexagon.cellWidth * 3 / 4 * a.r;
            }
            return { x: x, y: y };
        }; // toPoint
        Cell.prototype.getNeighbors = function () {
            var c = this.toCube();
            var moves;
            var neighbors = [];
            if (Hexagon.flatTopped) {
                moves = movesQ;
            }
            else {
                moves = movesR;
            }
            for (var i = 0; i < 6; i++) {
                var move = moves[i];
                var newCube = new Cube(c.x + move[0], c.y + move[1], c.z + move[2]);
                var cell = newCube.toOffset();
                if (cell.q >= 0 && cell.r >= 0 && cell.q < Hexagon.mapWidth && cell.r < Hexagon.mapHeight) {
                    neighbors.push(Hexagon.map[cell.q][cell.r]);
                }
                else {
                    neighbors.push(null);
                }
            }
            return neighbors;
        }; // getNeighbors
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
        Cube.prototype.toOffset = function () {
            var q, r;
            switch (Hexagon.mapLayout) {
                case 0 /* ODD_R */:
                    q = this.x + (this.z - (this.z & 1)) / 2;
                    r = this.z;
                    break;
                case 1 /* EVEN_R */:
                    q = this.x + (this.z + (this.z & 1)) / 2;
                    r = this.z;
                    break;
                case 2 /* ODD_Q */:
                    q = this.x;
                    r = this.z + (this.x - (this.x & 1)) / 2;
                    break;
                case 3 /* EVEN_Q */:
                    q = this.x;
                    r = this.z + (this.x + (this.x & 1)) / 2;
                    break;
            }
            return new Cell(q, r);
        }; // toOffset
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
//# sourceMappingURL=hexagon.js.map