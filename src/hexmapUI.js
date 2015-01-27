/// <reference path="hexmap.ts" />
/// <reference path="jquery/jquery.d.ts" />
window.onload = function () {
    Game.init(document.getElementById('content'), '../data/images/', [
        'flat-top/terrain/green.png',
        'flat-top/terrain/ocean-A01.png',
        'flat-top/terrain/grid.png',
    ], [
        'flat-top/terrain/green-medium-n.png',
        'flat-top/terrain/green-medium-ne.png',
        'flat-top/terrain/green-medium-se.png',
        'flat-top/terrain/green-medium-s.png',
        'flat-top/terrain/green-medium-sw.png',
        'flat-top/terrain/green-medium-nw.png',
    ], [
        'pointy-top/terrain/green.png',
        'pointy-top/terrain/ocean-A01.png',
        'pointy-top/terrain/grid.png',
    ], [
        'pointy-top/terrain/green-medium-ne.png',
        'pointy-top/terrain/green-medium-e.png',
        'pointy-top/terrain/green-medium-se.png',
        'pointy-top/terrain/green-medium-sw.png',
        'pointy-top/terrain/green-medium-w.png',
        'pointy-top/terrain/green-medium-nw.png',
    ]);
    // Listeners
    $('#flatTopped').on('change', changeOrientation);
    $('#pointyTopped').on('change', changeOrientation);
    $('#oddOffset').on('change', changeLayoutOffset);
    $('#evenOffset').on('change', changeLayoutOffset);
    $('#yesGrid').on('change', changeShowGrid);
    $('#noGrid').on('change', changeShowGrid);
    $('#yesTransition').on('change', changeShowTransition);
    $('#noTransition').on('change', changeShowTransition);
    $('#generate').on('click', generate);
};
function changeOrientation() {
    var flatRadioHTML = document.getElementById('flatTopped');
    var pointyRadioHTML = document.getElementById('pointyTopped');
    if (flatRadioHTML.checked)
        Hexagon.flatTopped = true;
    else if (pointyRadioHTML.checked)
        Hexagon.flatTopped = false;
    Game.generate();
} // changeOrientation
function changeLayoutOffset() {
    var oddRadioHTML = document.getElementById('oddOffset');
    var evenRadioHTML = document.getElementById('evenOffset');
    if (oddRadioHTML.checked)
        Hexagon.evenOffset = false;
    else if (evenRadioHTML.checked)
        Hexagon.evenOffset = true;
    Game.generate();
} // changeLayoutOffset
function changeShowGrid() {
    var yesRadioHTML = document.getElementById('yesGrid');
    var noRadioHTML = document.getElementById('noGrid');
    if (yesRadioHTML.checked)
        Game.showGrid = true;
    else if (noRadioHTML.checked)
        Game.showGrid = false;
    Game.refresh();
} // changeshowGrid
function changeShowTransition() {
    var yesRadioHTML = document.getElementById('yesTransition');
    var noRadioHTML = document.getElementById('noTransition');
    if (yesRadioHTML.checked)
        Game.showTransition = true;
    else if (noRadioHTML.checked)
        Game.showTransition = false;
    Game.refresh();
} // changeShowTransition
function generate() {
    Game.generate();
} // generate
//# sourceMappingURL=hexmapUI.js.map