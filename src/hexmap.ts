/// <reference path='hexagon.ts' />

/**
 * cf. http://codeincomplete.com/posts/2013/12/3/javascript_game_foundations_loading_assets/
 */
function loadImages(filenames: string[], callback?) {
  var images = {};
  var count = filenames.length;

  if (callback) {
    var onload = function () {
      if (--count == 0) callback(images);
    };
  }

  for (var i = 0; i < filenames.length; i++) {
    var filename = filenames[i];
    images[filename] = document.createElement('img');
    images[filename].addEventListener('load', onload);
    images[filename].src = "../data/images/" + filename;
  } // for i
} // loadImages

module Game {
  export var container: HTMLElement;
  export var images: HTMLImageElement[];
  var canvas: HTMLCanvasElement;
  var ctx: CanvasRenderingContext2D;

  export function main(container: HTMLElement, images: HTMLImageElement[]) {
    Game.container = container;
    Game.images = images;
    Hexagon.init(10, 8, 72, 72, true, true);

    canvas = document.createElement('canvas');
    container.appendChild(canvas);
    canvas.width = 600;
    canvas.height = 600;
    ctx = canvas.getContext('2d');

    drawMap();
  } // main

  function drawMap() {
    for (var i = 0; i < Hexagon.mapWidth; i++) {
      for (var j = 0; j < Hexagon.mapHeight; j++) {
        drawTile(i, j);
      } // for j
    } // for i
  } // drawMap

  function drawTile(q, r: number) {
    var cell = Hexagon.map[q][r];
    var point = cell.toPoint();

    switch (cell.layers[Hexagon.LayerTypeEnum.base]) {
      case 0:
        ctx.drawImage(images['flat-top/terrain/ocean-A01.png'], point.x, point.y);
        var neighbors = cell.getNeighbors();
        if (neighbors[Hexagon.DirectionQ.N] && neighbors[Hexagon.DirectionQ.N].layers['b'] == 1) {
          ctx.drawImage(images['flat-top/terrain/green-medium-n.png'], point.x, point.y);
        }
        if (neighbors[Hexagon.DirectionQ.NE] && neighbors[Hexagon.DirectionQ.NE].layers['b'] == 1) {
          ctx.drawImage(images['flat-top/terrain/green-medium-ne.png'], point.x, point.y);
        }
        if (neighbors[Hexagon.DirectionQ.SE] && neighbors[Hexagon.DirectionQ.SE].layers['b'] == 1) {
          ctx.drawImage(images['flat-top/terrain/green-medium-se.png'], point.x, point.y);
        }
        if (neighbors[Hexagon.DirectionQ.S] && neighbors[Hexagon.DirectionQ.S].layers['b'] == 1) {
          ctx.drawImage(images['flat-top/terrain/green-medium-s.png'], point.x, point.y);
        }
        if (neighbors[Hexagon.DirectionQ.SW] && neighbors[Hexagon.DirectionQ.SW].layers['b'] == 1) {
          ctx.drawImage(images['flat-top/terrain/green-medium-sw.png'], point.x, point.y);
        }
        if (neighbors[Hexagon.DirectionQ.NW] && neighbors[Hexagon.DirectionQ.NW].layers['b'] == 1) {
          ctx.drawImage(images['flat-top/terrain/green-medium-nw.png'], point.x, point.y);
        }
        break;
      case 1:
        ctx.drawImage(images['flat-top/terrain/green.png'], point.x, point.y);
        break;
    } // switch loc.layers[GameMap.LayerTypeEnum.base]

    ctx.drawImage(images['flat-top/terrain/grid.png'], point.x, point.y);
  } // drawTile
} // Game


window.onload = () => {
  var container = document.getElementById('content');
  loadImages([
    'flat-top/terrain/green.png',
    'flat-top/terrain/green-medium-n.png',
    'flat-top/terrain/green-medium-ne.png',
    'flat-top/terrain/green-medium-se.png',
    'flat-top/terrain/green-medium-s.png',
    'flat-top/terrain/green-medium-sw.png',
    'flat-top/terrain/green-medium-nw.png',
    'flat-top/terrain/ocean-A01.png',
    'flat-top/terrain/grid.png'],
    Game.main.bind(this, container));
};
