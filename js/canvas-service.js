'use strict'
const gCanvas = document.querySelector('canvas');
const gCtx = gCanvas.getContext('2d');
var gIsMouseDown = false;
var gIsTitleSelected = false;

function initCanvas() {
    gCanvas.addEventListener("mousedown", mouseDown);
    gCanvas.addEventListener("mouseup", mouseUp);
    gCanvas.addEventListener("mousemove", drag);
    gCanvas.addEventListener("touchstart", mouseDown);
    gCanvas.addEventListener("touchmove", drag);
    gCanvas.addEventListener("touchend", mouseUp);
}

function transformRatio(x1, x2, y1, y2) {
    let currentSize = gCanvas.getBoundingClientRect();
    var widthRatio = currentSize.width / gMeme.initialWidth;
    var heightRatio = currentSize.height / gMeme.initialHeight;

    return { x1: widthRatio * x1, x2: widthRatio * x2, y1: heightRatio * y1, y2: heightRatio * y2 };
}

function mouseDown(ev) {
    gIsMouseDown = true;

    var click = { x: ev.offsetX, y: ev.offsetY };
    let clickedTitleIdx = checkTitleClicked(click.x, click.y);
    if (clickedTitleIdx === -1) {
        setSelectedTitle(null);
        return;
    }
    gIsTitleSelected = true;
    setSelectedTitle(clickedTitleIdx);
    var title = gMeme.titles[clickedTitleIdx];

}



function mouseUp(ev) {
    gIsMouseDown = false;
    gIsTitleSelected = false;
}
function drag(ev) {
    console.log(gIsMouseDown, gIsTitleSelected);
    if (gIsMouseDown && gIsTitleSelected) {
        let xDiff = ev.movementX;
        let yDiff = ev.movementY;
        let title = gMeme.titles[gMeme.selectedTitleIdx];
        title.x += xDiff;
        title.y += yDiff;
        title.titleArea = getTitleArea(title.x, title.y, title.textWidth, title.align, title.fontSize);
        renderMeme(true);
    }

}

function checkTitleClicked(x, y) {
    var clickedTitleIdx = gMeme.titles.findIndex(title => {
        let scaledCoords = transformRatio(title.titleArea.x1, title.titleArea.x2, title.titleArea.y1, title.titleArea.y2);
        let x1 = scaledCoords.x1;
        let x2 = scaledCoords.x2;
        let y1 = scaledCoords.y1;
        let y2 = scaledCoords.y2;
        return ((x < x2 && x > x1) && (y < y2 && y > y1));
    });
    return clickedTitleIdx;
}