'use strict'
const gCanvas = document.querySelector('canvas');
const gCtx = gCanvas.getContext('2d');
var gMeme = {};
var gTitleSettings = {};
var gIsTitleSelected = false;

document.querySelector('.meme-title').addEventListener('keyup', function (ev) {
    if (ev.keyCode === 13) onAddTextTitle();
});

function resetPrefs() {
    gMeme = null;
    gTitleSettings = {
        x: 0,
        y: 50,
        font: 'Impact',
        fontSize: 40,
        stroke: '#fff',
        fill: '#000',
        align: 'center'
    };
    onChangeAlign(gTitleSettings.align, document.querySelector(`.${gTitleSettings.align}`));
}

function resizeCanvas(width, height) {
    gCanvas.width = width;
    gCanvas.height = height;
}

function editorInitCanvas(meme) {
    gMeme = meme;
    renderMeme();
    onShowEditor();
}

function onChangeSelectedTitle() {
    switch (gMeme.titles.length) {
        case 0:
            return;
        case 1:
            gMeme.selectedTitleIdx = 0;
            break;
        default:
            if (gMeme.selectedTitleIdx + 1 === gMeme.titles.length) {
                gMeme.selectedTitleIdx = null;
                document.querySelector('.meme-title').value = '';
                gIsTitleSelected = false;
                return;
            }
            if (gMeme.selectedTitleIdx === null) gMeme.selectedTitleIdx = 0;
            else gMeme.selectedTitleIdx++;
    }
    gIsTitleSelected = true;
    document.querySelector('.meme-title').value = gMeme.titles[gMeme.selectedTitleIdx].text;
    console.log(gMeme.selectedTitleIdx);
}

function setTitleYLocation() {
    let titleCount = gMeme.titles.length;
    if (!titleCount) gTitleSettings.y = gTitleSettings.fontSize + 10;
    else if (titleCount === 1) gTitleSettings.y = gCanvas.height - gTitleSettings.fontSize + 10;
    else if (titleCount > 1) gTitleSettings.y = gCanvas.height / 2;
}
function onAddTextTitle(isRerender = false, isChange = false) {
    if (!isRerender) {
        setTitleYLocation();
        let input = document.querySelector('.meme-title');
        gTitleSettings.text = input.value;
        var textWidth = gCtx.measureText(gTitleSettings.text).width;
        saveTitleSettings(textWidth);
        input.value = '';
    }
    gCtx.lineWidth = '1';
    gCtx.font = gTitleSettings.fontSize + 'px ' + gTitleSettings.font;
    gCtx.strokeStyle = gTitleSettings.stroke;
    gCtx.fillStyle = gTitleSettings.fill;
    gCtx.textAlign = gTitleSettings.align;
    gCtx.fillText(gTitleSettings.text, gTitleSettings.x, gTitleSettings.y);
    gCtx.strokeText(gTitleSettings.text, gTitleSettings.x, gTitleSettings.y);

    if (!isChange) gIsTitleSelected = false;
}

function renderMeme(isChange) {
    var img = new Image()
    img.onload = () => {
        resizeCanvas(img.width, img.height);
        gCtx.drawImage(img, 0, 0, img.width, img.height);
        gTitleSettings.x = img.width / 2;
        gMeme.titles.forEach((title) => {
            gTitleSettings = {
                x: title.x,
                y: title.y,
                font: title.font,
                fontSize: title.fontSize,
                stroke: title.stroke,
                align: title.align,
                text: title.text
            };

            onAddTextTitle(true, isChange);
        })
    }
    img.src = gMeme.url;
}

function onChangeTitleText(el) {
    if (!gIsTitleSelected) return;
    let idx = gMeme.selectedTitleIdx;
    gMeme.titles[idx].text = el.value;
    renderMeme(true);
}
function onFontSizeChange(value) {
    gTitleSettings.fontSize += value;
    gTitleSettings.y += value;
    document.querySelector('.font-size span').innerHTML = `Font size: ${gTitleSettings.fontSize}`;
}
function onChangeFont(el) {
    gTitleSettings.font = el.value;
}
function onChangeStroke(el) {
    gTitleSettings.stroke = el.value;
}
function onChangeFill(el) {
    gTitleSettings.fill = el.value;
}
function onChangeAlign(align, el) {
    gTitleSettings.align = align;
    if (align === 'left') gTitleSettings.x = 10;
    else if (align === 'center') gTitleSettings.x = gCanvas.width / 2;
    else if (align === 'right') gTitleSettings.x = gCanvas.width - 10;

    let alignBtns = document.querySelectorAll('.align')
    alignBtns.forEach((btn) => {
        if (btn.classList.contains(align)) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function onRemoveTextTitle() {
    if (!gMeme.titles.length || !gIsTitleSelected) {
        return;
    }
    gMeme.titles.splice(gMeme.selectedTitleIdx, 1);
    gMeme.selectedTitleIdx = 0;
    renderMeme();
    gIsTitleSelected = false;
    document.querySelector('.meme-title').value = '';
}

// DONE-MODAL FUNCTIONALITY //
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
    var meme = { id: gSavedMemeId++, imgData: imgData, editorData: gMeme };
    addToMemeGallery(meme);
    memeGalleryRender();
    showDoneModalInfo('Added to Meme Gallery Successfuly! Redirecting...');
    setTimeout(() => { onShowMemes }, 3000);
}
function showDoneModalInfo(str) {
    document.querySelector('.done-modal-info').innerText = str;

    setTimeout(() => { document.querySelector('.done-modal-info').innerText = '' }, 5000);
}
//

// function drawRect(x1, y1, x2, y2) {
    //     gCtx.beginPath();
//     gCtx.rect(x1, y1, x2, y2);
//     gCtx.lineWidth = '1';
//     gCtx.strokeStyle = '#000';
//     gCtx.stroke();
// }


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

// function markCurrentTitle() {
    //     if (gCurrMeme.isTitleSelected) renderMeme(gCurrMeme.id);

    //     let idx = gCurrMeme.selectedTitleIdx;
//     let title = gCurrMeme.titles[idx];
//     let x;
//     switch (title.align) {
    //         case 'center':
//             x = title.x - title.textWidth / 2;
//             break;
//         case 'left':
//             x1 = title.x
//             break;
//         case 'right':
//             x1 = title.x - textPixels
//             break;
//     }
//     let y = title.y - title.fontSize;
//     drawRect(x, y, title.textWidth, y + title.fontSize);
// }