/// <reference path='heightmap/heightmap.ts' />
/// <reference path='hexagon.ts' />

/**
 * cf. http://codeincomplete.com/posts/2013/12/3/javascript_game_foundations_loading_assets/
 */
function loadImages(folder: string, filenames: string[], callback?) {
  var images: HTMLImageElement[] = [];
  var count = filenames.length;

  if (callback) {
    var onload = function () {
      if (--count == 0) callback(images);
    };
  }

  for (var i = 0; i < filenames.length; i++) {
    var filename = filenames[i];
    images[i] = document.createElement('img');
    images[i].addEventListener('load', onload);
    images[i].src = folder + filename;
  } // for i
} // loadImages

module Hexmap {
  enum BaseTerrain { HILL, GRASS, WATER };
  enum FringeTerrain { TREE };
  enum Grid { DEFAULT };
  export class LayerTypeEnum {
    static base = 'b';
    static fringe = 'f';
    static object = 'o';
    static unit = 'u';
  } // LayerTypeEnum

  export var container: HTMLElement;
  var canvas: HTMLCanvasElement;
  var ctx: CanvasRenderingContext2D;

  export var folder: string;
  export var baseTerrainFlatFilenames: string[]; // must be stored in reversed order of precedence, index 0 is the highest precedence.
  export var transitionFlatFilenames: string[];
  export var gridFlatFilenames: string[];
  export var baseTerrainPointyFilenames: string[]; // must be stored in reversed order of precedence, index 0 is the highest precedence.
  export var transitionPointyFilenames: string[];
  export var gridPointyFilenames: string[];
  export var fringeFilenames: string[];

  export var baseTerrainFlatImages: HTMLImageElement[];
  export var transitionFlatImages: HTMLImageElement[];
  export var gridFlatImages: HTMLImageElement[];
  export var baseTerrainPointyImages: HTMLImageElement[];
  export var transitionPointyImages: HTMLImageElement[];
  export var gridPointyImages: HTMLImageElement[];
  export var fringeImages: HTMLImageElement[];

  export var showGrid: boolean;
  export var showTransition: boolean;
  export enum GenerationAlgo { RANDOM, DIAMOND_SQUARE };
  export var genAlgo: GenerationAlgo;

  export function init(container: HTMLElement, folder: string,
    baseTerrainFlatFilenames, transitionFlatFilenames, gridFlatFilenames,
    baseTerrainPointyFilenames, transitionPointyFilenames, gridPointyFilenames,
    fringeFilenames: string[]) {
    this.container = container;
    this.folder = folder;
    this.baseTerrainFlatFilenames = baseTerrainFlatFilenames;
    this.transitionFlatFilenames = transitionFlatFilenames;
    this.baseTerrainPointyFilenames = baseTerrainPointyFilenames;
    this.transitionPointyFilenames = transitionPointyFilenames;
    this.fringeFilenames = fringeFilenames;

    this.showGrid = true;
    this.showTransition = true;
    this.genAlgo = GenerationAlgo.DIAMOND_SQUARE;

    Hexagon.init(10, 8, 72, 72, true, true); // Flat-topped hexagons, even-q layout

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    loadImages(folder, baseTerrainFlatFilenames, (images: HTMLImageElement[]) => {
      baseTerrainFlatImages = images;
      loadImages(folder, transitionFlatFilenames, (images: HTMLImageElement[]) => {
        transitionFlatImages = images;
        loadImages(folder, gridFlatFilenames, (images: HTMLImageElement[]) => {
          gridFlatImages = images;
          loadImages(folder, baseTerrainPointyFilenames, (images: HTMLImageElement[]) => {
            baseTerrainPointyImages = images;
            loadImages(folder, transitionPointyFilenames, (images: HTMLImageElement[]) => {
              transitionPointyImages = images;
              loadImages(folder, gridPointyFilenames, (images: HTMLImageElement[]) => {
                gridPointyImages = images;
                loadImages(folder, fringeFilenames, (images: HTMLImageElement[]) => {
                  fringeImages = images;
                  generate.call(this);
                });
              });
            });
          });
        });
      });
    });
  } // init

  export function generate() {
    var nbBaseTerrain = Object.keys(BaseTerrain).length / 2;

    Hexagon.map = [];

    switch (genAlgo) {
      case GenerationAlgo.RANDOM:
        Hexagon.map = new Array(Hexagon.mapWidth);
        for (var i = 0; i < Hexagon.mapWidth; i++) {
          Hexagon.map[i] = new Array(Hexagon.mapHeight);

          for (var j = 0; j < Hexagon.mapHeight; j++) {
            Hexagon.map[i][j] = new Hexagon.Cell(i, j);
            Hexagon.map[i][j].layers[LayerTypeEnum.base] = Math.floor(Math.random() * nbBaseTerrain);
          } // for j
        } // for i
        break;
      case GenerationAlgo.DIAMOND_SQUARE:
        var mapSize = Math.pow(2, Math.ceil(Math.log(Math.max(Hexagon.mapWidth, Hexagon.mapHeight) * 5 - 1) / Math.LN2)) + 1;
        Heightmap.init();
        var heightmap = Heightmap.diamondSquare(mapSize);

        Hexagon.map = new Array(Hexagon.mapWidth);
        for (var i = 0; i < Hexagon.mapWidth; i++) {
          Hexagon.map[i] = new Array(Hexagon.mapHeight);

          for (var j = 0; j < Hexagon.mapHeight; j++) {
            Hexagon.map[i][j] = new Hexagon.Cell(i, j);
            var heightmapPoint = heightmap[i * 5 + 2][j * 5 + 2];
            if (heightmapPoint < 255 * 0.35) {
              Hexagon.map[i][j].layers[LayerTypeEnum.base] = BaseTerrain.WATER;
            }
            else if (heightmapPoint < 255 * 0.7) {
              Hexagon.map[i][j].layers[LayerTypeEnum.base] = BaseTerrain.GRASS;
            }
            else {
              Hexagon.map[i][j].layers[LayerTypeEnum.base] = BaseTerrain.HILL;
            }
          } // for j
        } // for i
        break;
    } // switch genAlgo

    /*
    // trees
    Hexagon.map[2][2].layers[LayerTypeEnum.fringe] = FringeTerrain.TREE;
    Hexagon.map[3][2].layers[LayerTypeEnum.fringe] = FringeTerrain.TREE;
    Hexagon.map[3][3].layers[LayerTypeEnum.fringe] = FringeTerrain.TREE;
    */


  refresh();
  } // generate;

  export function refresh() {
    if (canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    drawMap();
  } // refresh

  function drawMap() {
    var rect = Hexagon.getRectangle();

    canvas.width = rect[1].x;
    canvas.height = rect[1].y;

    for (var i = 0; i < Hexagon.mapWidth; i++) {
      for (var j = 0; j < Hexagon.mapHeight; j++) {
        drawTile(i, j);
      } // for j
    } // for i
  } // drawMap

  function drawTile(q: number, r: number) {
    // we assume (q, r) are valid cell coordinates
    var cell = Hexagon.map[q][r];
    var point = cell.toPoint();
    var baseTerrain = cell.layers[LayerTypeEnum.base];
    var fringeTerrain = cell.layers[LayerTypeEnum.fringe];

    if (Hexagon.flatTopped) {
      var baseTerrainImages = baseTerrainFlatImages;
      var transitionImages = transitionFlatImages;
      var gridImages = gridFlatImages;
    }
    else {
      var baseTerrainImages = baseTerrainPointyImages;
      var transitionImages = transitionPointyImages;
      var gridImages = gridPointyImages;
    }

    switch (baseTerrain) {
      case BaseTerrain.HILL:
        drawImage(baseTerrainImages[baseTerrain], cell);
        break;
      case BaseTerrain.GRASS:
        drawImage(baseTerrainImages[baseTerrain], cell);

        if (showTransition) {
          var neighbors = cell.getNeighbors();
          for (var i = 0; i < 6; i++) {
            if (neighbors[i] && neighbors[i].layers['b'] == BaseTerrain.HILL) {
              drawImage(transitionImages[i], cell);
            }
          } // for i
        }

        break;
      case BaseTerrain.WATER:
        drawImage(baseTerrainImages[baseTerrain], cell);

        if (showTransition) {
          var neighbors = cell.getNeighbors();
          for (var i = 0; i < 6; i++) {
            if (neighbors[i] && neighbors[i].layers['b'] == BaseTerrain.HILL) {
              drawImage(transitionImages[i], cell);
            }
            else if (neighbors[i] && neighbors[i].layers['b'] == BaseTerrain.GRASS) {
              drawImage(transitionImages[i + 6], cell);
            }
          } // for i
        }

        break;
    } // switch baseTerrain

    switch (fringeTerrain) {
      case FringeTerrain.TREE:
        drawImage(fringeImages[fringeTerrain], cell);
        break;
    } // switch fringeTerrain

    if (showGrid) {
      drawImage(gridImages[Grid.DEFAULT], cell);
    }
  } // drawTile

  function drawImage(image: HTMLImageElement, cell: Hexagon.Cell) {
    var imgCenter = {
      x: Math.floor(image.width / 2),
      y: Math.floor(image.height / 2)
    };

    var tileCenter = cell.getCenter();

    ctx.drawImage(image, tileCenter.x - imgCenter.x, tileCenter.y - imgCenter.y);
  } // drawImage
} // Hexmap
