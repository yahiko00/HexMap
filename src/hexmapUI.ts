/// <reference path="hexmap.ts" />
/// <reference path="jquery/jquery.d.ts" />

window.onload = () => {
  Game.init(
    document.getElementById('content'),
    '../data/images/',
    [
      'flat-top/terrain/green.png',
      'flat-top/terrain/ocean-A01.png',
      'flat-top/terrain/grid.png',
    ],
    [
      'flat-top/terrain/green-medium-n.png',
      'flat-top/terrain/green-medium-ne.png',
      'flat-top/terrain/green-medium-se.png',
      'flat-top/terrain/green-medium-s.png',
      'flat-top/terrain/green-medium-sw.png',
      'flat-top/terrain/green-medium-nw.png',
    ],
    [
      'pointy-top/terrain/green.png',
      'pointy-top/terrain/ocean-A01.png',
      'pointy-top/terrain/grid.png',
    ],
    [
      'pointy-top/terrain/green-medium-ne.png',
      'pointy-top/terrain/green-medium-e.png',
      'pointy-top/terrain/green-medium-se.png',
      'pointy-top/terrain/green-medium-sw.png',
      'pointy-top/terrain/green-medium-w.png',
      'pointy-top/terrain/green-medium-nw.png',
    ]);

  // Listeners
  $("#flatTopped").on("change", changeOrientation);
  $("#pointyTopped").on("change", changeOrientation);
  $('#generate').on('click', generate);

};

function changeOrientation() {
  var flatRadioHTML = <HTMLInputElement>document.getElementById("flatTopped");
  var pointyRadioHTML = <HTMLInputElement>document.getElementById("pointyTopped");

  if (flatRadioHTML.checked) Hexagon.flatTopped = true;
  else if (pointyRadioHTML.checked) Hexagon.flatTopped = false;

  generate();
} // changeOrientation

function generate() {
  Game.refresh();
} // generate