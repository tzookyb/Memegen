'use strict'

var gMeme = {};
var gTitleSettings = {};
var gIsTitleSelected = false;
var gImg;

function resetPrefs() {
    gIsTitleSelected = false;
    gMeme = null;
    gTitleSettings = {
        text: '',
        x: 0,
        y: 50,
        font: 'Impact',
        fontSize: 28,
        stroke: '#000',
        fill: '#fff',
        align: 'center',
    };
    onChangeAlign('center');
}

function editorInit(meme) {
    resetPrefs();
    gMeme = meme;
    loadMemeToEditor();
    onRouteTo('.editor');
}

function resizeCanvas(width, height) {
    gCanvas.width = width;
    gCanvas.height = height;
}

function loadMemeToEditor() {
    gImg = new Image()
    gImg.onload = () => {
        gCanvas.width = gImg.width;
        gCanvas.height = gImg.height;
        gCtx.drawImage(gImg, 0, 0, gImg.width, gImg.height);
        gTitleSettings.x = gImg.width / 2;
        gTitleSettings.fontSize = parseInt(gImg.width * 0.07);
        onFontSizeChangeBy(0);
        setTitleYLocation();
        gMeme.initialWidth = gImg.width;
        gMeme.initialHeight = gImg.height;

        if (gMeme.titles.length) {
            gMeme.titles.forEach((title) => {
                renderTitle(title);
            })
        } else onAddTextTitle('type text and press Enter or +');
    }
    gImg.src = gMeme.url;
}

function renderMeme() {
    gCtx.drawImage(gImg, 0, 0, gImg.width, gImg.height);
    if (gMeme.titles.length) {
        gMeme.titles.forEach((title) => {
            renderTitle(title);
        })
    }
}

function setTitleYLocation() {
    const titleCount = gMeme.titles.length;
    if (!titleCount) gTitleSettings.y = gTitleSettings.fontSize + 10;
    else if (titleCount === 1) gTitleSettings.y = gCanvas.height - gTitleSettings.fontSize + 10;
    else gTitleSettings.y = gCanvas.height / 2;
}

function renderTitle(title) {
    gCtx.lineWidth = '2';
    gCtx.font = title.fontSize + 'px ' + title.font;
    gCtx.strokeStyle = title.stroke;
    gCtx.fillStyle = title.fill;
    gCtx.textAlign = title.align;
    gCtx.fillText(title.text, title.x, title.y);
    gCtx.strokeText(title.text, title.x, title.y);
}

function onAddTextTitle(text) {
    if (text) gTitleSettings.text = text;
    if (!gTitleSettings.text) {
        showMessage('You have to insert some text to add title.', 2);
        return;
    }
    setTitleYLocation();
    gCtx.font = gTitleSettings.fontSize + 'px ' + gTitleSettings.font;
    gTitleSettings.textWidth = gCtx.measureText(gTitleSettings.text).width;
    saveTitleSettings();

    gCtx.lineWidth = '2';
    gCtx.font = gTitleSettings.fontSize + 'px ' + gTitleSettings.font;
    gCtx.strokeStyle = gTitleSettings.stroke;
    gCtx.fillStyle = gTitleSettings.fill;
    gCtx.textAlign = gTitleSettings.align;
    gCtx.fillText(gTitleSettings.text, gTitleSettings.x, gTitleSettings.y);
    gCtx.strokeText(gTitleSettings.text, gTitleSettings.x, gTitleSettings.y);

    setSelectedTitle(gMeme.titles.length - 1);
}

function onSelectTitle(idx) {
    if (gIsTitleSelected) renderMeme();
    if (!gMeme.titles.length) {
        showMessage('There are no titles to select from.', 2);
        return;
    }
    else if (gMeme.selectedTitleIdx === null) gMeme.selectedTitleIdx = 0;
    else if (gMeme.selectedTitleIdx + 1 === gMeme.titles.length) {
        gMeme.selectedTitleIdx = null;
    } else gMeme.selectedTitleIdx++;
    setSelectedTitle(gMeme.selectedTitleIdx);
}

function setSelectedTitle(idx) {
    if (idx === null) {
        gMeme.selectedTitleIdx = null;
        gIsTitleSelected = false;
        document.querySelector('.meme-title').value = 'type text and press Enter or +';
    } else {
        gMeme.selectedTitleIdx = idx;
        gIsTitleSelected = true;
        document.querySelector('.meme-title').value = gMeme.titles[idx].text;
        renderSelectRect(gMeme.selectedTitleIdx);
    }
    const input = document.querySelector('.meme-title');
    input.focus();
    input.select();
}
function renderSelectRect(idx) {
    const title = gMeme.titles[idx];
    gCtx.save();
    gCtx.beginPath();
    gCtx.lineWidth = '2';
    gCtx.strokeStyle = '#fff';
    gCtx.setLineDash([6]);
    gCtx.rect(title.titleArea.x1 - 10, title.titleArea.y1, title.textWidth + 20, title.fontSize + 5);
    gCtx.stroke();
    gCtx.restore();
}

function onChangeTitleText(text) {
    if (!gIsTitleSelected) {
        gTitleSettings.text = text;
        return;
    }
    getCurrentSelectedTitle().text = text;
    reCalcTitleSizeVars();
    renderMeme();
    renderSelectRect(gMeme.selectedTitleIdx);
}

function getCurrentSelectedTitle() {
    return gMeme.titles[gMeme.selectedTitleIdx];
}

function onRemoveTextTitle() {
    if (!gMeme.titles.length || !gIsTitleSelected) {
        showMessage('First, You have to select a title to remove.', 2);
        return;
    }
    gMeme.titles.splice(gMeme.selectedTitleIdx, 1);
    renderMeme();
    setSelectedTitle(null);
}

function onFontSizeChangeBy(value) {
    if (gIsTitleSelected) {
        getCurrentSelectedTitle().fontSize += value;
        reCalcTitleSizeVars();
        renderMeme();
        renderSelectRect(gMeme.selectedTitleIdx);
    }
    gTitleSettings.fontSize += value;
    gTitleSettings.y += value;
    document.querySelector('.font-size span').innerHTML = `Font size: ${gTitleSettings.fontSize}`;
}

function onChangeFont(value) {
    if (gIsTitleSelected) {
        getCurrentSelectedTitle().font = value;
        reCalcTitleSizeVars();
        renderMeme();
        renderSelectRect(gMeme.selectedTitleIdx);
    }
    gTitleSettings.font = value;
}

function reCalcTitleSizeVars() {
    var title = getCurrentSelectedTitle();

    gCtx.font = title.fontSize + 'px ' + title.font;
    title.textWidth = gCtx.measureText(title.text).width;
    title.titleArea = getTitleArea(title.x, title.y, title.textWidth, title.align, title.fontSize)
}

function onChangeStroke(value) {
    if (gIsTitleSelected) {
        getCurrentSelectedTitle().stroke = value;
        renderMeme();
        renderSelectRect(gMeme.selectedTitleIdx);
    }
    gTitleSettings.stroke = value;
}

function onChangeFill(value) {
    if (gIsTitleSelected) {
        getCurrentSelectedTitle().fill = value;
        renderMeme();
        renderSelectRect(gMeme.selectedTitleIdx);
    }
    gTitleSettings.fill = value;
}
function onChangeAlign(align) {
    if (gIsTitleSelected) {
        const title = getCurrentSelectedTitle();
        title.align = align;
        if (align === 'left') title.x = 10;
        else if (align === 'right') title.x = gCanvas.width - 10;
        else if (align === 'center') title.x = gCanvas.width / 2;
        reCalcTitleSizeVars();
        renderMeme();
        renderSelectRect(gMeme.selectedTitleIdx);
    }
    gTitleSettings.align = align;
    if (align === 'left') gTitleSettings.x = 10;
    else if (align === 'right') gTitleSettings.x = gCanvas.width - 10;
    else if (align === 'center') gTitleSettings.x = gCanvas.width / 2;

    const alignBtns = document.querySelectorAll('.align')
    alignBtns.forEach((btn) => {
        if (btn.classList.contains(align)) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}


// DONE-MODAL FUNCTIONALITY //
function onDownloadMeme(el) {
    const data = gCanvas.toDataURL();
    el.href = data;
    el.download = "memegen_meme.png";

    showDoneModalInfo('Download Meme Successful!')
    setTimeout(() => { onHideModal(gCurrentShownModal) }, 2000)
}
function onShareToFaceBook() {
    var imgToShare = gCanvas.toDataURL("image/jpeg");
    var formData = new FormData();
    formData.append('img', imgToShare);
    fetch('https://ca-upload.com/here/upload.php', {
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
    setTimeout(() => { onHideModal(gCurrentShownModal) }, 2000)
}
function onSaveToMemes() {
    const imgData = gCanvas.toDataURL();
    var meme = { id: gSavedMemeId++, imgData, editorData: gMeme };
    renderMeme();
    addToMemeGallery(meme);
    memeGalleryRender();
    showDoneModalInfo('Added to Meme Gallery Successfuly! Redirecting...');
    setTimeout(() => {
        onRouteTo('.meme-gallery');
    }, 3000);
}
function showDoneModalInfo(str) {
    document.querySelector('.done-modal-info').innerText = str;
    setTimeout(() => { document.querySelector('.done-modal-info').innerText = '' }, 5000);
}