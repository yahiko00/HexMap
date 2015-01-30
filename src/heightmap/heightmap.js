/// <reference path="../rng/rng.ts"/>
var Heightmap;
(function (Heightmap) {
    Heightmap.rng;
    function init(rng) {
        if (rng === void 0) { rng = new SeededRNG(); }
        this.rng = rng;
    }
    Heightmap.init = init; // init
    /** Run an iterative diamond square algorithm
     * See: http://stackoverflow.com/questions/2755750/diamond-square-algorithm
     */
    function diamondSquare(MAP_SIZE, low, high, wrap, roughness) {
        // MAP_SIZE is the size of grid to generate, note this must be a
        // value (2^n)+1
        if (low === void 0) { low = 0; }
        if (high === void 0) { high = 255; }
        if (wrap === void 0) { wrap = true; }
        if (roughness === void 0) { roughness = 1; }
        var map = [];
        var nw = (wrap ? 0 : 1); // non-wrap flag
        for (var i = 0; i < MAP_SIZE; i++) {
            map[i] = [];
        }
        // Initialize the corners of the map
        map[0][0] = low + Heightmap.rng.rand() * (high - low); // top left
        map[0][MAP_SIZE - 1] = low + Heightmap.rng.rand() * (high - low); // bottom left
        map[MAP_SIZE - 1][0] = low + Heightmap.rng.rand() * (high - low); // top right
        map[MAP_SIZE - 1][MAP_SIZE - 1] = low + Heightmap.rng.rand() * (high - low); // bottom right
        var h = low + (high - low) / 2; // the range (-h -> +h) for the average offset
        for (var sideLength = MAP_SIZE - 1; sideLength >= 2; sideLength /= 2, h /= 2.0) {
            // half the length of the side of a square
            // or distance from diamond center to one corner
            // (just to make calcs below a little clearer)
            var halfSide = sideLength / 2;
            for (var x = 0; x < MAP_SIZE - 1; x += sideLength) {
                for (var y = 0; y < MAP_SIZE - 1; y += sideLength) {
                    // x, y is upper left corner of square
                    // calculate average of existing corners
                    var avg = map[x][y] + map[x + sideLength][y] + map[x][y + sideLength] + map[x + sideLength][y + sideLength]; // lower right
                    avg /= 4.0;
                    // center is average plus random offset
                    map[x + halfSide][y + halfSide] = normalize(avg + offset(h, roughness), low, high);
                }
            }
            for (var x = 0; x < MAP_SIZE - 1 + nw; x += halfSide) {
                for (var y = (x + halfSide) % sideLength; y < MAP_SIZE - 1 + nw; y += sideLength) {
                    // x, y is center of diamond
                    // note we must use mod  and add MAP_SIZE for subtraction
                    // so that we can wrap around the array to find the corners
                    var avg = map[(x - halfSide + MAP_SIZE - 1) % (MAP_SIZE - 1)][y] + map[(x + halfSide) % (MAP_SIZE - 1)][y] + map[x][(y + halfSide) % (MAP_SIZE - 1)] + map[x][(y - halfSide + MAP_SIZE - 1) % (MAP_SIZE - 1)]; // above center
                    avg /= 4.0;
                    // new value = average plus random offset
                    avg = normalize(avg + offset(h, roughness), low, high);
                    // update value for center of diamond
                    map[x][y] = avg;
                    // wrap values on the edges
                    if (wrap) {
                        if (x == 0)
                            map[MAP_SIZE - 1][y] = avg;
                        if (y == 0)
                            map[x][MAP_SIZE - 1] = avg;
                    }
                }
            }
        }
        // return the map
        return map;
    }
    Heightmap.diamondSquare = diamondSquare; // diamondSquare
    /**
     * Return a random offset scaled on height
     */
    function offset(height, roughness) {
        // We calculate random value in range of 2h
        // and then subtract h so the end value is
        // in the range (-h, +h)
        return (Heightmap.rng.rand() * 2 - 1) * height * roughness;
    } // offset
    /**
     * Normalize the value to make sure its within bounds
     */
    function normalize(value, low, high) {
        return Math.max(Math.min(value, high), low);
    } // normalize
})(Heightmap || (Heightmap = {})); // Heightmap
//# sourceMappingURL=heightmap.js.map