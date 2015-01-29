module Hexagon {
  export var flatTopped: boolean; // flat topped hexagon if true, pointy topped hexagon if false
  export var evenOffset: boolean; // even offset layout if true, odd offset layout if false

  export enum Layout { ODD_R, EVEN_R, ODD_Q, EVEN_Q };
  export type Point = { x: number; y: number };
  export enum DirectionFlat { N, NE, SE, S, SW, NW }; // Directions for flat topped hexagons
  export enum DirectionPointy { NE, E, SE, SW, W, NW }; // Directions for pointy topped hexagons
  // Move vectors for each direction
  var movesFlat = [
    [0, +1, -1], [+1, 0, -1], [+1, -1, 0],
    [0, -1, +1], [-1, 0, +1], [-1, +1, 0]
  ];
  var movesPointy = [
    [+1, 0, -1], [+1, -1, 0], [0, -1, +1],
    [-1, 0, +1], [-1, +1, 0], [0, +1, -1]
  ];

  export var mapWidth: number; // map width in cells
  export var mapHeight: number; // map height in cells
  export var map: Cell[][];
  export var cellWidth: number; // cell width in pixels
  export var cellHeight: number; // cell height in pixels

  export function init(mapWidth, mapHeight, cellWidth, cellHeight: number, flatTopped = true, evenOffset = true) {
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.flatTopped = flatTopped;
    this.evenOffset = evenOffset;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
  } // init

  export function mapLayout() {
    return (evenOffset ? 1 : 0) | (flatTopped ? 1 : 0) << 1;
  } // mapLayout

  export function getRectangle(): Point[] {
    var a: Point = { x: 0, y: 0 };
    var b: Point = { x: 0, y: 0 };

    // upper left corner
    if (!evenOffset) {
      a = map[0][0].toPoint();
    }
    else {
      if (!flatTopped) {
        if (mapHeight > 0) { // there is at least 2 rows
          a.x = map[0][1].toPoint().x;
        }
        else {
          a.x = map[0][0].toPoint().x;
        }
        a.y = map[0][0].toPoint().y;
      }
      else {
        a.x = map[0][0].toPoint().x;
        if (mapHeight > 0) { // there is at least 2 rows
          a.y = map[1][0].toPoint().y;
        }
        else {
          a.y = map[0][0].toPoint().y;
        }
      }
    }

    // lower right corner
    switch (mapLayout()) {
      case Layout.ODD_R:
        if ((mapHeight & 1) === 0) { // even number of rows
          b.x = map[mapWidth-1][1].toPoint().x;
        }
        else {
          b.x = map[mapWidth-1][0].toPoint().x;
        }
        b.y = map[0][mapHeight - 1].toPoint().y;
        break;
      case Layout.EVEN_R:
        b.x = map[mapWidth - 1][0].toPoint().x;
        b.y = map[0][mapHeight - 1].toPoint().y;
        break;
      case Layout.ODD_Q:
        b.x = map[mapWidth - 1][0].toPoint().x;
        if ((mapWidth & 1) === 0) { // even number of columns
          b.y = map[1][mapHeight - 1].toPoint().y;
        }
        else {
          b.y = map[0][mapHeight - 1].toPoint().y;
        }
        break;
      case Layout.EVEN_Q:
        b.x = map[mapWidth - 1][0].toPoint().x;
        b.y = map[0][mapHeight - 1].toPoint().y;
        break;
    } // switch mapLayout

    b.x += cellWidth;
    b.y += cellHeight;

    return [a, b];
  } // getRectangle

  /**
    * Hexagonal cell expressed in offset coordinates
    */
  export class Cell {
    q: number; // column
    r: number; // row
    layers: Object;

    constructor(q, r: number) {
      this.q = q;
      this.r = r;
      this.layers = {};
    } // constructor

    private toCube(): Cube {
      var x, y, z: number;

      switch (mapLayout()) {
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

      if (flatTopped) {
        x = cellWidth * 3 / 4 * a.q;
        y = cellHeight * (a.r + a.q / 2);
      }
      else {
        x = cellHeight * (a.q + a.r / 2);
        y = cellWidth * 3 / 4 * a.r;
      }

      return { x: x, y: y };
    } // toPoint

    getNeighbors(): Cell[]{
      var c = this.toCube();
      var moves: number[][];
      var neighbors: Cell[] = [];

      if (flatTopped) {
        moves = movesFlat;
      }
      else {
        moves = movesPointy;
      }

      for (var i = 0; i < 6; i++) {
        var move = moves[i];
        var newCube = new Cube(c.x + move[0], c.y + move[1], c.z + move[2]);
        var cell = newCube.toOffset();
        if (cell.q >= 0 && cell.r >= 0 && cell.q < mapWidth && cell.r < mapHeight) {
          neighbors.push(map[cell.q][cell.r]);
        }
        else {
          neighbors.push(null);
        }
      } // for i

      return neighbors;
    } // getNeighbors

    getCenter(): Point {
      var upperLeft = this.toPoint();
      return {
        x: Math.round(upperLeft.x + cellWidth / 2),
        y: Math.round(upperLeft.y + cellHeight / 2),
      }
    } // getCenter
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

    toOffset() {
      var q, r: number;

      switch (mapLayout()) {
        case Layout.ODD_R:
          q = this.x + (this.z - (this.z & 1)) / 2;
          r = this.z;
          break;
        case Layout.EVEN_R:
          q = this.x + (this.z + (this.z & 1)) / 2;
          r = this.z;
          break;
        case Layout.ODD_Q:
          q = this.x;
          r = this.z + (this.x - (this.x & 1)) / 2;
          break;
        case Layout.EVEN_Q:
          q = this.x;
          r = this.z + (this.x + (this.x & 1)) / 2
          break;
      } // switch Cell.layout

      return new Cell(q, r);
    } // toOffset
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
 