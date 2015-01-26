module Hexagon {
  export enum Layout { ODD_R, EVEN_R, ODD_Q, EVEN_Q };
  export type Point = { x: number; y: number };

  export function init(cellWidth, cellHeight: number, layout: Layout) {
    Cell.width = cellWidth;
    Cell.height = cellHeight;
    Cell.layout = layout;
  } // init

  /**
   * Hexagonal cell expressed in offset coordinates
   */
  export class Cell {
    static width: number;
    static height: number;
    q: number; // column
    r: number; // row
    static layout: Layout;

    constructor(q, r: number) {
      this.q = q;
      this.r = r;
    } // constructor

    private toCube(): Cube {
      var x, y, z: number;

      switch (Cell.layout) {
        case Layout.ODD_R:
          x = this.q - (this.r - (this.r & 1)) / 2;
          z = this.r;
          y = -x - z;
          break;
        case Layout.EVEN_R:
          x = this.q - (this.r + (this.r & 1)) / 2;
          z = this.r;
          y = -x - z;
          break;
        case Layout.ODD_Q:
          x = this.q;
          z = this.r - (this.q - (this.q & 1)) / 2;
          y = -x - z;
          break;
        case Layout.EVEN_Q:
          x = this.q;
          z = this.r - (this.q + (this.q & 1)) / 2
          y = -x - z;
          break;
      } // switch this.layout

      return new Cube(x, y, z);
    } // toCube

    private toAxial(): Axial {
      return this.toCube().toAxial();
    } // toAxial

    toPoint(): Point {
      var x, y: number;

      // conversion to axial coordinates
      var a = this.toAxial();

      switch (Cell.layout) {
        case Layout.ODD_R:
        case Layout.EVEN_R:
          x = Cell.height * (a.q + a.r / 2);
          y = Cell.width * 3 / 4 * a.r;
          break;
        case Layout.ODD_Q:
        case Layout.EVEN_Q:
          x = Cell.width * 3 / 4 * a.q;
          y = Cell.height * (a.r + a.q / 2);
          break;
      } // switch this.layout

      return { x: x, y: y };
    } // toPoint
  } // Cell

  /**
   * Hexagonal cell expressed in cubic coordinates
   */
  class Cube {
    x: number;
    y: number;
    z: number;

    constructor(x, y, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
    } // constructor

    toAxial() {
      var q = this.x;
      var r = this.z;

      return new Axial(q, r);
    } // toAxial
  } // Cube

  /**
   * Hexagonal cell expressed in axial coordinates
   */
  class Axial {
    q: number;
    r: number;

    constructor(q, r: number) {
      this.q = q;
      this.r = r;
    } // constructor

    toCube() {
      var x = this.q;
      var z = this.r;
      var y = -x - z;
    } // toCube
  } // Axial
} // Hexagon

module GameMap {
  var width: number; // width in tiles
  var height: number; // height in tiles

  export var locations: Tile[][];

  export function init(mapWidth, mapHeight, tileWidth, tileHeight: number) {
    width = mapWidth;
    height = mapHeight;
    Tile.width = tileWidth;
    Tile.height = tileHeight;

    Hexagon.init(Tile.width, Tile.height, Hexagon.Layout.EVEN_Q);

    locations = new Array(Tile.width);
    for (var i = 0; i < Tile.width; i++) {
      locations[i] = new Array(Tile.height);

      for (var j = 0; j < Tile.height; j++) {
        locations[i][j] = new Tile(i, j);
      } // for j
    } // for i
  } // init

  class Tile {
    static width: number;
    static height: number;
    cell: Hexagon.Cell;
    layers: Object;

    constructor(q, r: number) {
      this.cell = new Hexagon.Cell(q, r);
      this.layers = {};
    } // constructor
  } // Tile

  class Layer {
    code: number;

    constructor(code: number) {
      this.code = code;
    } // constructor
  } // Layer
} // GameMap

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

function drawHexMap(container: HTMLElement, images: HTMLImageElement[]) {
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
    } // for j
  } // for i
} // draw

function gameMain(container: HTMLElement, images: HTMLImageElement[]) {
  drawHexMap(container, images);
} // gameMain

window.onload = () => {
  var container = document.getElementById('content');
  loadImages(['terrain/green.png', 'terrain/grid.png'], gameMain.bind(this, container));
};
