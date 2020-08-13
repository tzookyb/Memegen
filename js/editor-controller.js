'use strict'
const gCanvas = document.querySelector('canvas');
const gCtx = gCanvas.getContext('2d');
var gCurrMeme = {};
var gCurrSelections = {};

var gElDoneModalInfo = document.querySelector('.done-modal');

document.querySelector('.meme-title').addEventListener('keyup', function (ev) {
    if (ev.keyCode === 13) onAddTextTitle();
});

function resetPrefs() {
    gCurrMeme = null;
    gCurrSelections = { x: 0, y: 50, font: 'Impact', fontSize: 40, stroke: '#fff', fill: '#000', align: 'center' };
    onChangeAlign(gCurrSelections.align, document.querySelector(`.${gCurrSelections.align}`));
}
function resizeCanvas(width, height) {
    gCanvas.width = width;
    gCanvas.height = height;
}
function onEditImage(id) {
    gCurrMeme = getImages(id);
    drawImageToCanvas(gCurrMeme);
    onDisplaySection('.editor');
    ShowEditorInfo();
}
function drawImageToCanvas(image) {
    var img = new Image()
    img.onload = () => {
        resizeCanvas(img.width, img.height);
        gCtx.drawImage(img, 0, 0, img.width, img.height);
        gCurrSelections.x = img.width / 2;
    }
    img.src = image.url;
}
function renderMeme(meme) {
    drawImageToCanvas(meme.url);
    meme.titles.forEach((title) => {
        gCurrSelection = { x: title.x, y: title.y, font: title.font, fontSize: title.fontSize, stroke: title.stroke, align: title.align, text: title.text };
        onAddTextTitle(true);
    })
}
// BUTTONS FUNCTIONALITY //
function ShowEditorInfo(str) {
    let info = document.querySelector('.info');
    info.style.color = '';
    if (str) {
        setTimeout(ShowEditorInfo, 2500);
        info.style.color = 'red';
        info.innerText = str;
        return;
    }
    let currTitle = (gCurrMeme.currTitleIdx === gCurrMeme.titles.length) ? 'new' : gCurrMeme.currTitleIdx + 1;
    info.innerText = `Currently selected title: ${currTitle}`;
}
function onAddTextTitle(isReRender = false) {
    if (!isReRender) {
        if (gCurrMeme.currTitleIdx === 1) gCurrSelections.y = gCanvas.height - gCurrSelections.fontSize + 10;
        else if (gCurrMeme.currTitleIdx > 1) gCurrSelections.y = gCanvas.height / 2;
        var text = document.querySelector('.meme-title').value;
        gCurrMeme.titles.push(
            {
                titleIdx: gCurrMeme.currTitleIdx++,
                text: text,
                x: gCurrSelections.x,
                y: gCurrSelections.y,
                stroke: gCurrSelections.stroke,
                fill: gCurrSelections.fill,
                align: gCurrSelections.align,
                font: gCurrSelections.font,
                fontSize: gCurrSelections.fontSize
            });
    } else {
        var text = gCurrSelections.text;
    };

    gCtx.lineWidth = '1';
    gCtx.strokeStyle = gCurrSelections.stroke;
    gCtx.fillStyle = gCurrSelections.fill;
    gCtx.font = gCurrSelections.fontSize + 'px ' + gCurrSelections.font;
    gCtx.textAlign = gCurrSelections.align;
    gCtx.fillText(text, gCurrSelections.x, gCurrSelections.y);
    gCtx.strokeText(text, gCurrSelections.x, gCurrSelections.y);
    document.querySelector('.meme-title').value = '';
}
function markCurrentTitle() {
    let idx = gCurrMeme.currTitleIdx;
    if (idx >= gCurrMeme.titles.length) return;
    let title = gCurrMeme.titles[idx];
    gCtx.font = title.fontSize + 'px' + title.font;
    let textLength = gCtx.measureText(title.text);
    let x;
    switch (title.align) {
        case 'center':
            x = title.x - textLength / 2;
            break;
        case 'left':
            x1 = title.x
            break;
        case 'right':
            x1 = title.x - textPixels
            break;
    }
    let y = title.y - fontSize;
    drawRect(x, y, textPixels,);
}
function onChangeTitleText(el) {

}
function onFontSizeChange(value) {
    gCurrSelections.fontSize += value;
    gCurrSelections.y += value;
    document.querySelector('.font-size span').innerHTML = `Font size: ${gCurrSelections.fontSize}`;
}
function onChangeFont(el) {
    gCurrSelections.font = el.value;
}
function onChangeStroke(el) {
    gCurrSelections.stroke = el.value;
}
function onChangeFill(el) {
    gCurrSelections.fill = el.value;
}
function onChangeAlign(align, el) {
    gCurrSelections.align = align;
    if (align === 'left') gCurrSelections.x = 10;
    else if (align === 'center') gCurrSelections.x = gCanvas.width / 2;
    else if (align === 'right') gCurrSelections.x = gCanvas.width - 10;

    let alignBtns = document.querySelectorAll('.align')
    alignBtns.forEach((btn) => { btn.classList.remove('active') });
    if (el) el.classList.add('active');
}
function onChangeSelectedTitle() {
    if (!gCurrMeme.titles.length) {
        ShowEditorInfo('No titles to scroll through');
        return;
    }
    else if (gCurrMeme.currTitleIdx >= gCurrMeme.titles.length) gCurrMeme.currTitleIdx = 0;
    else gCurrMeme.currTitleIdx++;
    markCurrentTitle();
    ShowEditorInfo();
}
function onRemoveTextTitle() {
    if (gCurrMeme.currTitleIdx === gCurrMeme.titles.length) ShowEditorInfo('Cannot remove new title.');
    gCurrMeme.titles.splice(gCurrMeme.currTitleIdx);
}

// DONE MODAL FUNCTIONALITY//
function onDownloadMeme(el) {
    const data = gCanvas.toDataURL();
    el.href = data;
    el.download = "memegen_meme.png";
    showDoneModalInfo('Download Meme Successful!')
}
function onShareToFaceBook() {
    var imgToShare = gCanvas.toDataURL("image/jpeg");
    var formData = new FormData();
    formData.append('img', imgToShare);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(uploadedImgUrl => {
            uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`, '_blank')
        })
        .catch(function (err) {
            console.error(err)
        })
    showDoneModalInfo('Sharing to Facebook Successful!');
}
function onSaveToMemes() {
    const imgData = gCanvas.toDataURL();
    var meme = { imgData: imgData, editorData: gCurrMeme };
    addToMemeGallery(meme);
    showDoneModalInfo('Added to Meme Gallery Successfuly! Redirecting...');
    setTimeout((onDisplaySection('.meme-gallery')), 3000);
}
function showDoneModalInfo(str) {
    document.querySelector('.done-modal-info').innerText = str;
    setTimeout(() => { document.querySelector('.done-modal-info').innerText = '' }, 5000);
}
// 

function drawRect(x1, y1, x2, y2) {
    gCtx.beginPath();
    gCtx.rect(x1, y1, x2, y2);
    gCtx.lineWidth = '1';
    gCtx.strokeStyle = '#fff';
    gCtx.stroke();
}

function showcoords(ev) {
    console.clear();
    console.log(ev)
    console.log('x:', ev.offsetX);
    console.log('y:', ev.offsetY);
}
// function saveAndRestoreExample() {
//     gCtx.lineWidth = '2';
//     gCtx.font = '40px Ariel';
//     gCtx.strokeStyle = 'red';
//     gCtx.fillStyle = 'white';
//     drawText('before save', 100, 60);
//     gCtx.save();
//     drawText('after save', 100, 160)
//     gCtx.strokeStyle = 'black';
//     gCtx.fillStyle = 'red';
//     drawText('after save and change', 20, 260);
//     gCtx.restore();
//     drawText('after restore', 100, 360);
// }