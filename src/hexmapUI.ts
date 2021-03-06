﻿/// <reference path="hexmap.ts" />
/// <reference path="jquery/jquery.d.ts" />

window.onload = () => {
  Hexmap.init(
    document.getElementById('content'),
    '../data/images/',
    [
      'flat-top/terrain/hill.png',
      'flat-top/terrain/grass.png',
      'flat-top/terrain/water.png',
    ],
    [
      'flat-top/terrain/hill-n.png',
      'flat-top/terrain/hill-ne.png',
      'flat-top/terrain/hill-se.png',
      'flat-top/terrain/hill-s.png',
      'flat-top/terrain/hill-sw.png',
      'flat-top/terrain/hill-nw.png',
      'flat-top/terrain/grass-n.png',
      'flat-top/terrain/grass-ne.png',
      'flat-top/terrain/grass-se.png',
      'flat-top/terrain/grass-s.png',
      'flat-top/terrain/grass-sw.png',
      'flat-top/terrain/grass-nw.png',
    ],
    [
      'flat-top/terrain/grid.png',
    ],
    [
      'pointy-top/terrain/hill.png',
      'pointy-top/terrain/grass.png',
      'pointy-top/terrain/water.png',
    ],
    [
      'pointy-top/terrain/hill-ne.png',
      'pointy-top/terrain/hill-e.png',
      'pointy-top/terrain/hill-se.png',
      'pointy-top/terrain/hill-sw.png',
      'pointy-top/terrain/hill-w.png',
      'pointy-top/terrain/hill-nw.png',
      'pointy-top/terrain/grass-ne.png',
      'pointy-top/terrain/grass-e.png',
      'pointy-top/terrain/grass-se.png',
      'pointy-top/terrain/grass-sw.png',
      'pointy-top/terrain/grass-w.png',
      'pointy-top/terrain/grass-nw.png',
    ],
    [
      'pointy-top/terrain/grid.png',
    ],
    [
      'tree.png'
    ]);

  // Default value on parameters
  if (Hexagon.flatTopped) $("#flatTopped").prop("checked", true);
  else $("#pointyTopped").prop("checked", true);
  if (Hexagon.evenOffset) $("#evenOffset").prop("checked", true);
  else $("#oddOffset").prop("checked", true);
  if (Hexmap.showGrid) $("#yesGrid").prop("checked", true);
  else $("#noGrid").prop("checked", true);
  if (Hexmap.showTransition) $("#yesTransition").prop("checked", true);
  else $("#noTransition").prop("checked", true);
  switch (Hexmap.genAlgo) {
    case Hexmap.GenerationAlgo.RANDOM:
      $("#randomAlgo").prop("checked", true);
      break;
    case Hexmap.GenerationAlgo.DIAMOND_SQUARE:
      $("#diamondSquareAlgo").prop("checked", true);
      break;
  } // switch Hexmap.genAlgo

  // Listeners
  $('#flatTopped').on('change', changeOrientation);
  $('#pointyTopped').on('change', changeOrientation);
  $('#oddOffset').on('change', changeLayoutOffset);
  $('#evenOffset').on('change', changeLayoutOffset);
  $('#yesGrid').on('change', changeShowGrid);
  $('#noGrid').on('change', changeShowGrid);
  $('#yesTransition').on('change', changeShowTransition);
  $('#noTransition').on('change', changeShowTransition);
  $('#randomAlgo').on('change', changeAlgorithm);
  $('#diamondSquareAlgo').on('change', changeAlgorithm);
  $('#generate').on('click', generate);

};

function changeOrientation() {
  var flatRadioHTML = <HTMLInputElement>document.getElementById('flatTopped');
  var pointyRadioHTML = <HTMLInputElement>document.getElementById('pointyTopped');

  if (flatRadioHTML.checked) Hexagon.flatTopped = true;
  else if (pointyRadioHTML.checked) Hexagon.flatTopped = false;

  Hexmap.generate();
} // changeOrientation

function changeLayoutOffset() {
  var oddRadioHTML = <HTMLInputElement>document.getElementById('oddOffset');
  var evenRadioHTML = <HTMLInputElement>document.getElementById('evenOffset');

  if (oddRadioHTML.checked) Hexagon.evenOffset = false;
  else if (evenRadioHTML.checked) Hexagon.evenOffset = true;

  Hexmap.generate();
} // changeLayoutOffset

function changeShowGrid() {
  var yesRadioHTML = <HTMLInputElement>document.getElementById('yesGrid');
  var noRadioHTML = <HTMLInputElement>document.getElementById('noGrid');

  if (yesRadioHTML.checked) Hexmap.showGrid = true;
  else if (noRadioHTML.checked) Hexmap.showGrid = false;

  Hexmap.refresh();
} // changeshowGrid

function changeShowTransition() {
  var yesRadioHTML = <HTMLInputElement>document.getElementById('yesTransition');
  var noRadioHTML = <HTMLInputElement>document.getElementById('noTransition');

  if (yesRadioHTML.checked) Hexmap.showTransition = true;
  else if (noRadioHTML.checked) Hexmap.showTransition = false;

  Hexmap.refresh();
} // changeShowTransition

function changeAlgorithm() {
  var randomRadioHTML = <HTMLInputElement>document.getElementById('randomAlgo');
  var diamondSquareRadioHTML = <HTMLInputElement>document.getElementById('diamondSquareAlgo');

  if (randomRadioHTML.checked) Hexmap.genAlgo = Hexmap.GenerationAlgo.RANDOM;
  else if (diamondSquareRadioHTML.checked) Hexmap.genAlgo = Hexmap.GenerationAlgo.DIAMOND_SQUARE;

  Hexmap.generate();
} // changeAlgorithm

function generate() {
  Hexmap.generate();
} // generate