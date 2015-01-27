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

module Game {
  enum BaseTerrain { GRASS, WATER, GRID };

  export var container: HTMLElement;
  var canvas: HTMLCanvasElement;
  var ctx: CanvasRenderingContext2D;

  export var folder: string;
  export var baseTerrainFlatFilenames: string[]; // must be stored in reversed order of precedence, index 0 is the highest precedence.
  export var transitionFlatFilenames: string[];
  export var baseTerrainPointyFilenames: string[]; // must be stored in reversed order of precedence, index 0 is the highest precedence.
  export var transitionPointyFilenames: string[];

  export var baseTerrainFlatImages: HTMLImageElement[];
  export var transitionFlatImages: HTMLImageElement[];
  export var baseTerrainPointyImages: HTMLImageElement[];
  export var transitionPointyImages: HTMLImageElement[];

  export function init(container: HTMLElement, folder: string, baseTerrainFlatFilenames, transitionFlatFilenames, baseTerrainPointyFilenames, transitionPointyFilenames: string[]) {
    Game.container = container;
    Game.folder = folder;
    Game.baseTerrainFlatFilenames = baseTerrainFlatFilenames;
    Game.transitionFlatFilenames = transitionFlatFilenames;
    Game.baseTerrainPointyFilenames = baseTerrainPointyFilenames;
    Game.transitionPointyFilenames = transitionPointyFilenames;

    Hexagon.init(10, 8, 72, 72, true, true); // Flat-topped hexagons, even-q layout

    canvas = document.createElement('canvas');
    container.appendChild(canvas);
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext('2d');

    loadImages(folder, baseTerrainFlatFilenames, (images: HTMLImageElement[]) => {
      baseTerrainFlatImages = images;
      loadImages(folder, transitionFlatFilenames, (images: HTMLImageElement[]) => {
        transitionFlatImages = images;
        loadImages(folder, baseTerrainPointyFilenames, (images: HTMLImageElement[]) => {
          baseTerrainPointyImages = images;
          loadImages(folder, transitionPointyFilenames, (images: HTMLImageElement[]) => {
            transitionPointyImages = images;
            refresh.call(this);
          });
        });
      });
    });
  } // init

  export function refresh() {
    Hexagon.generate();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
  } // refresh;

  function drawMap() {
    for (var i = 0; i < Hexagon.mapWidth; i++) {
      for (var j = 0; j < Hexagon.mapHeight; j++) {
        drawTile(i, j);
      } // for j
    } // for i
  } // drawMap

  function drawTile(q, r: number) {
    // we assume (q, r) are valid cell coordinates
    var cell = Hexagon.map[q][r];
    var point = cell.toPoint();
    var baseTerrain = cell.layers[Hexagon.LayerTypeEnum.base];

    if (Hexagon.flatTopped) {
      var baseTerrainImages = baseTerrainFlatImages;
      var transitionImages = transitionFlatImages;
    }
    else {
      var baseTerrainImages = baseTerrainPointyImages;
      var transitionImages = transitionPointyImages;
    }

    switch (baseTerrain) {
      case BaseTerrain.GRASS:
        ctx.drawImage(baseTerrainImages[baseTerrain], point.x, point.y);
        break;
      case BaseTerrain.WATER:
        ctx.drawImage(baseTerrainImages[baseTerrain], point.x, point.y);
        var neighbors = cell.getNeighbors();

        for (var i = 0; i < 6; i++) {
          if (neighbors[i] && neighbors[i].layers['b'] == BaseTerrain.GRASS) {
            ctx.drawImage(transitionImages[i], point.x, point.y);
          }
        } // for i

        break;
    } // switch baseTerrain

    ctx.drawImage(baseTerrainImages[BaseTerrain.GRID], point.x, point.y);
  } // drawTile
} // Game
