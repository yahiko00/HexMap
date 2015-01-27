var GameMap;
(function (GameMap) {
    GameMap.width; // width in tiles
    GameMap.height; // height in tiles
    GameMap.map;
    var LayerTypeEnum = (function () {
        function LayerTypeEnum() {
        }
        LayerTypeEnum.base = 'b';
        LayerTypeEnum.fringe = 'f';
        LayerTypeEnum.object = 'o';
        LayerTypeEnum.unit = 'u';
        return LayerTypeEnum;
    })();
    GameMap.LayerTypeEnum = LayerTypeEnum; // LayerTypeEnum
    // Terrains must be ordered by precedence.
    // First one has the highest precedence.
    (function (Terrain) {
        Terrain[Terrain["GREEN_GRASS"] = 0] = "GREEN_GRASS";
        Terrain[Terrain["MEDIUM_DEEP_WATER"] = 1] = "MEDIUM_DEEP_WATER";
    })(GameMap.Terrain || (GameMap.Terrain = {}));
    var Terrain = GameMap.Terrain;
    ;
    function init(mapWidth, mapHeight, tileWidth, tileHeight) {
        GameMap.width = mapWidth;
        GameMap.height = mapHeight;
        Hexagon.init(mapWidth, mapHeight, tileWidth, tileHeight, 3 /* EVEN_Q */);
        GameMap.map = new Array(GameMap.width);
        for (var i = 0; i < GameMap.width; i++) {
            GameMap.map[i] = new Array(GameMap.height);
            for (var j = 0; j < GameMap.height; j++) {
                GameMap.map[i][j] = new Tile(i, j);
                GameMap.map[i][j].layers[LayerTypeEnum.base] = Math.round(Math.random());
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
    })();
    GameMap.Layer = Layer; // Layer
})(GameMap || (GameMap = {})); // GameMap
//# sourceMappingURL=gamemap.js.map