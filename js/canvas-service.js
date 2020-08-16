'use strict'
const gCanvas = document.querySelector('canvas');
const gCtx = gCanvas.getContext('2d');
var gIsMouseDown = false;
var gIsTitleSelected = false;
var gTouchCoords;

function initCanvas() {
    gCanvas.addEventListener("mousedown", mouseDown);
    gCanvas.addEventListener("mouseup", mouseUp);
    gElBody.addEventListener("mouseup", mouseUp);
    gCanvas.addEventListener("mousemove", drag);
    gCanvas.addEventListener("touchstart", mouseDown);
    gCanvas.addEventListener("touchmove", drag);
    gCanvas.addEventListener("touchend", mouseUp);
}

function mouseDown(ev) {
    gIsMouseDown = true;

    let click;
    if (ev.type === "touchstart") {
        ev.preventDefault();
        gTouchCoords = { x: ev.targetTouches[0].clientX, y: ev.targetTouches[0].clientY };
        let canvasPos = gCanvas.getBoundingClientRect();
        click = { x: ev.targetTouches[0].pageX - canvasPos.x, y: ev.targetTouches[0].pageY - canvasPos.y };

    } else {
        click = { x: ev.offsetX, y: ev.offsetY };
    }

    let clickedTitleIdx = checkTitleClicked(click.x, click.y);
    if (clickedTitleIdx === -1) {
        setSelectedTitle(null);
        return;
    }
    gIsTitleSelected = true;
    setSelectedTitle(clickedTitleIdx);
}

function mouseUp(ev) {
    gIsMouseDown = false;
    if (ev.type === "touchend") gTouchCoords = null;
}

function drag(ev) {
    if (gIsMouseDown && gIsTitleSelected) {
        let title = getCurrentSelectedTitle();
        let xDiff;
        let yDiff;

        if (ev.type === "touchmove") {
            ev.preventDefault();
            xDiff = ev.targetTouches[0].clientX - gTouchCoords.x;
            yDiff = ev.targetTouches[0].clientY - gTouchCoords.y;
            gTouchCoords.x += xDiff;
            gTouchCoords.y += yDiff;
        } else {
            xDiff = ev.movementX;
            yDiff = ev.movementY;
        }

        title.x += xDiff;
        title.y += yDiff;
        title.titleArea = getTitleArea(title.x, title.y, title.textWidth, title.align, title.fontSize);
        renderMeme();
        renderSelectRect(gMeme.selectedTitleIdx);
    }
}

function checkTitleClicked(x, y) {
    var clickedTitleIdx = gMeme.titles.findIndex(title => {
        let scaledCoords = transformRatio(title.titleArea);
        let x1 = scaledCoords.x1;
        let x2 = scaledCoords.x2;
        let y1 = scaledCoords.y1;
        let y2 = scaledCoords.y2;
        return ((x < x2 && x > x1) && (y < y2 && y > y1));
    });
    return clickedTitleIdx;
}

function transformRatio(titleArea) {
    let currentSize = gCanvas.getBoundingClientRect();
    var widthRatio = currentSize.width / gMeme.initialWidth;
    var heightRatio = currentSize.height / gMeme.initialHeight;

    return { x1: widthRatio * titleArea.x1, x2: widthRatio * titleArea.x2, y1: heightRatio * titleArea.y1, y2: heightRatio * titleArea.y2 };
}