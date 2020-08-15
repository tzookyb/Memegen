'use strict'

var gMeme = {};
var gTitleSettings = {};
var gIsTitleSelected = false;

function resetPrefs() {
    gIsTitleSelected = false;
    gMeme = null;
    gTitleSettings = {
        x: 0,
        y: 50,
        font: 'Impact',
        fontSize: 40,
        stroke: '#000',
        fill: '#fff',
        align: 'center',
        text: '',
    };
    document.querySelector('.meme-title').value = '';
    onChangeAlign(gTitleSettings.align);
}

function resizeCanvas(width, height) {
    gCanvas.width = width;
    gCanvas.height = height;
}

function editorInit(meme) {
    resetPrefs();
    gMeme = meme;
    renderMeme();
    onShowEditor();
}


function renderMeme(isTitleChange) {
    var img = new Image()
    img.onload = () => {
        resizeCanvas(img.width, img.height);
        gCtx.drawImage(img, 0, 0, img.width, img.height);
        gTitleSettings.x = img.width / 2;
        gMeme.initialWidth = img.width;
        gMeme.initialHeight = img.height;
        gMeme.titles.forEach((title) => {
            gTitleSettings = {
                x: title.x,
                y: title.y,
                font: title.font,
                fontSize: title.fontSize,
                fill: title.fill,
                stroke: title.stroke,
                align: title.align,
                text: title.text
            };

            onAddTextTitle(true, isTitleChange);
        })
    }
    img.src = gMeme.url;
}

function onAddTextTitle(isRerender = false, isChange = false) {
    if (!gTitleSettings.text) {
        showMessage('You have to insert some text to add title.', 2);
        return;
    }
    if (!isRerender) {
        setTitleYLocation();
        gCtx.font = gTitleSettings.fontSize + 'px ' + gTitleSettings.font;
        gTitleSettings.textWidth = gCtx.measureText(gTitleSettings.text).width;
        saveTitleSettings();
    }
    gCtx.lineWidth = '2';
    gCtx.font = gTitleSettings.fontSize + 'px ' + gTitleSettings.font;
    gCtx.strokeStyle = gTitleSettings.stroke;
    gCtx.fillStyle = gTitleSettings.fill;
    gCtx.textAlign = gTitleSettings.align;
    gCtx.fillText(gTitleSettings.text, gTitleSettings.x, gTitleSettings.y);
    gCtx.strokeText(gTitleSettings.text, gTitleSettings.x, gTitleSettings.y);

    if (!isChange) {
        gIsTitleSelected = false;
        document.querySelector('.meme-title').value = '';
        gTitleSettings.text = '';
    }
}

function setTitleYLocation() {
    let titleCount = gMeme.titles.length;
    if (!titleCount) gTitleSettings.y = gTitleSettings.fontSize + 10;
    else if (titleCount === 1) gTitleSettings.y = gCanvas.height - gTitleSettings.fontSize + 10;
    else gTitleSettings.y = gCanvas.height / 2;
}

function onSelectTitle(idx) {
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
        document.querySelector('.meme-title').value = '';
    } else {
        gMeme.selectedTitleIdx = idx;
        gIsTitleSelected = true;
        document.querySelector('.meme-title').value = gMeme.titles[gMeme.selectedTitleIdx].text;
    }
}

function onChangeTitleText(el) {
    if (!gIsTitleSelected) {
        gTitleSettings.text = el.value;
        return;
    }
    getCurrentSelectedTitle().text = el.value;
    renderMeme(true);
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

function onFontSizeChange(value) {
    if (gIsTitleSelected) {
        getCurrentSelectedTitle().fontSize += value;
        reCalcTitleSizeVars();
        renderMeme(true);
    }
    gTitleSettings.fontSize += value;
    gTitleSettings.y += value;
    document.querySelector('.font-size span').innerHTML = `Font size: ${gTitleSettings.fontSize}`;
}
function onChangeFont(el) {
    if (gIsTitleSelected) {
        getCurrentSelectedTitle().font = el.value;
        reCalcTitleSizeVars();
        renderMeme(true);
    }
    gTitleSettings.font = el.value;
}

function reCalcTitleSizeVars() {
    var title = getCurrentSelectedTitle();

    gCtx.font = title.fontSize + 'px ' + title.font;
    title.textWidth = gCtx.measureText(title.text).width;
    title.titleArea = getTitleArea(title.x, title.y, title.textWidth, title.align, title.fontSize)
}

function onChangeStroke(el) {
    if (gIsTitleSelected) {
        getCurrentSelectedTitle().stroke = el.value;
        renderMeme(true);
    }
    gTitleSettings.stroke = el.value;
}
function onChangeFill(el) {
    if (gIsTitleSelected) {
        getCurrentSelectedTitle().fill = el.value;
        renderMeme(true);
    }
    gTitleSettings.fill = el.value;
}
function onChangeAlign(align) {
    if (gIsTitleSelected) {
        var title = getCurrentSelectedTitle();
        title.align = align;
        if (align === 'left') title.x = 10;
        else if (align === 'right') title.x = gCanvas.width - 10;
        else if (align === 'center') title.x = gCanvas.width / 2;
        reCalcTitleSizeVars();
        renderMeme(true);
    }
    gTitleSettings.align = align;
    if (align === 'left') gTitleSettings.x = 10;
    else if (align === 'right') gTitleSettings.x = gCanvas.width - 10;
    else if (align === 'center') gTitleSettings.x = gCanvas.width / 2;

    let alignBtns = document.querySelectorAll('.align')
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
}
function onSaveToMemes() {
    const imgData = gCanvas.toDataURL();
    var meme = { id: gSavedMemeId++, imgData, editorData: gMeme };
    renderMeme(true);
    addToMemeGallery(meme);
    memeGalleryRender();
    showDoneModalInfo('Added to Meme Gallery Successfuly! Redirecting...');
    setTimeout(() => {
        onHideDoneModal();
        onShowMemes();
    }, 3000);
}
function showDoneModalInfo(str) {
    document.querySelector('.done-modal-info').innerText = str;
    setTimeout(() => { document.querySelector('.done-modal-info').innerText = '' }, 5000);
}