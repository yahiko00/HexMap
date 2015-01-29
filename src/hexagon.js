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
    (function (DirectionFlat) {
        DirectionFlat[DirectionFlat["N"] = 0] = "N";
        DirectionFlat[DirectionFlat["NE"] = 1] = "NE";
        DirectionFlat[DirectionFlat["SE"] = 2] = "SE";
        DirectionFlat[DirectionFlat["S"] = 3] = "S";
        DirectionFlat[DirectionFlat["SW"] = 4] = "SW";
        DirectionFlat[DirectionFlat["NW"] = 5] = "NW";
    })(Hexagon.DirectionFlat || (Hexagon.DirectionFlat = {}));
    var DirectionFlat = Hexagon.DirectionFlat;
    ;
    (function (DirectionPointy) {
        DirectionPointy[DirectionPointy["NE"] = 0] = "NE";
        DirectionPointy[DirectionPointy["E"] = 1] = "E";
        DirectionPointy[DirectionPointy["SE"] = 2] = "SE";
        DirectionPointy[DirectionPointy["SW"] = 3] = "SW";
        DirectionPointy[DirectionPointy["W"] = 4] = "W";
        DirectionPointy[DirectionPointy["NW"] = 5] = "NW";
    })(Hexagon.DirectionPointy || (Hexagon.DirectionPointy = {}));
    var DirectionPointy = Hexagon.DirectionPointy;
    ;
    // Move vectors for each direction
    var movesFlat = [
        [0, +1, -1],
        [+1, 0, -1],
        [+1, -1, 0],
        [0, -1, +1],
        [-1, 0, +1],
        [-1, +1, 0]
    ];
    var movesPointy = [
        [+1, 0, -1],
        [+1, -1, 0],
        [0, -1, +1],
        [-1, 0, +1],
        [-1, +1, 0],
        [0, +1, -1]
    ];
    Hexagon.mapWidth; // map width in cells
    Hexagon.mapHeight; // map height in cells
    Hexagon.map;
    Hexagon.cellWidth; // cell width in pixels
    Hexagon.cellHeight; // cell height in pixels
    function init(mapWidth, mapHeight, cellWidth, cellHeight, flatTopped, evenOffset) {
        if (flatTopped === void 0) { flatTopped = true; }
        if (evenOffset === void 0) { evenOffset = true; }
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.flatTopped = flatTopped;
        this.evenOffset = evenOffset;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
    }
    Hexagon.init = init; // init
    function mapLayout() {
        return (Hexagon.evenOffset ? 1 : 0) | (Hexagon.flatTopped ? 1 : 0) << 1;
    }
    Hexagon.mapLayout = mapLayout; // mapLayout
    function getRectangle() {
        var a = { x: 0, y: 0 };
        var b = { x: 0, y: 0 };
        // upper left corner
        if (!Hexagon.evenOffset) {
            a = Hexagon.map[0][0].toPoint();
        }
        else {
            if (!Hexagon.flatTopped) {
                if (Hexagon.mapHeight > 0) {
                    a.x = Hexagon.map[0][1].toPoint().x;
                }
                else {
                    a.x = Hexagon.map[0][0].toPoint().x;
                }
                a.y = Hexagon.map[0][0].toPoint().y;
            }
            else {
                a.x = Hexagon.map[0][0].toPoint().x;
                if (Hexagon.mapHeight > 0) {
                    a.y = Hexagon.map[1][0].toPoint().y;
                }
                else {
                    a.y = Hexagon.map[0][0].toPoint().y;
                }
            }
        }
        switch (mapLayout()) {
            case 0 /* ODD_R */:
                if ((Hexagon.mapHeight & 1) === 0) {
                    b.x = Hexagon.map[Hexagon.mapWidth - 1][1].toPoint().x;
                }
                else {
                    b.x = Hexagon.map[Hexagon.mapWidth - 1][0].toPoint().x;
                }
                b.y = Hexagon.map[0][Hexagon.mapHeight - 1].toPoint().y;
                break;
            case 1 /* EVEN_R */:
                b.x = Hexagon.map[Hexagon.mapWidth - 1][0].toPoint().x;
                b.y = Hexagon.map[0][Hexagon.mapHeight - 1].toPoint().y;
                break;
            case 2 /* ODD_Q */:
                b.x = Hexagon.map[Hexagon.mapWidth - 1][0].toPoint().x;
                if ((Hexagon.mapWidth & 1) === 0) {
                    b.y = Hexagon.map[1][Hexagon.mapHeight - 1].toPoint().y;
                }
                else {
                    b.y = Hexagon.map[0][Hexagon.mapHeight - 1].toPoint().y;
                }
                break;
            case 3 /* EVEN_Q */:
                b.x = Hexagon.map[Hexagon.mapWidth - 1][0].toPoint().x;
                b.y = Hexagon.map[0][Hexagon.mapHeight - 1].toPoint().y;
                break;
        }
        b.x += Hexagon.cellWidth;
        b.y += Hexagon.cellHeight;
        return [a, b];
    }
    Hexagon.getRectangle = getRectangle; // getRectangle
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
            switch (mapLayout()) {
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
                moves = movesFlat;
            }
            else {
                moves = movesPointy;
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
        Cell.prototype.getCenter = function () {
            var upperLeft = this.toPoint();
            return {
                x: Math.round(upperLeft.x + Hexagon.cellWidth / 2),
                y: Math.round(upperLeft.y + Hexagon.cellHeight / 2),
            };
        }; // getCenter
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
            switch (mapLayout()) {
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