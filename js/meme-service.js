'use strict'
var gId;
var gSavedMemeId;
var gGallery;
var gMemeGallery;
var gKeywords;
var gFilter;

function loadSettings() {
    var settings = loadFromStorage('MemegenData');
    if (!settings) setDefaults();
    else {
        gId = settings.gId;
        gSavedMemeId = settings.gSavedMemeId;
        gGallery = settings.gGallery;
        gMemeGallery = settings.gMemeGallery;
        gKeywords = settings.gKeywords;
    }
}

function saveSettings() {
    var settings = {
        gid: gId,
        gSavedMemeId: gSavedMemeId,
        gGallery: gGallery,
        gMemeGallery: gMemeGallery,
        gKeywords: gKeywords
    }
    saveToStorage('MemegenData', settings);
}

function setDefaults() {
    debugger
    gId = 1;
    gSavedMemeId = 1;
    gGallery = [];
    gMemeGallery = [];
    _createDefaultImgs();
    getKeywords();
    saveSettings();
}

function getKeywords() {
    gKeywords = {};
    const images = getGalleryImages();

    images.forEach(image => {
        image.keywords.forEach(keyword => {
            gKeywords[keyword] = gKeywords[keyword] ? ++gKeywords[keyword] : 1;
        })
    })
}

function _createDefaultImgs() {
    _createImg('1.jpg', ['trump', 'finger', 'face']);
    _createImg('2.jpg', ['cute', 'dog']);
    _createImg('3.jpg', ['dog', 'baby', 'cute', 'sleep']);
    _createImg('4.jpg', ['cute', 'cat', 'sleep', 'computer', 'laptop']);
    _createImg('5.jpg', ['baby', 'yes', 'face']);
    _createImg('6.jpg', ['hair', 'face']);
    _createImg('7.jpg', ['baby', 'cute', 'face']);
    _createImg('8.jpg', ['face']);
    _createImg('9.jpg', ['face', 'kid']);
    _createImg('10.jpg', ['smile', 'obama', 'celeb']);
    _createImg('11.jpg', ['boxing', 'kiss']);
    _createImg('12.jpg', ['face', 'celeb', 'finger', 'gesture']);
    _createImg('13.jpg', ['celeb', 'smile', 'film', 'gatsby']);
    _createImg('14.jpg', ['celeb', 'film', 'matrix', 'face']);
    _createImg('15.jpg', ['film', 'face', 'gesture']);
    _createImg('16.jpg', ['face', 'smile']);
    _createImg('17.jpg', ['putin', 'finger']);
    _createImg('18.jpg', ['film', 'cartoon']);
    _createImg('19.jpg', ['film', 'nature']);
}

function _createImg(filename, keywords) {
    var img = {
        id: gId++,
        url: `img/images/${filename}`,
        keywords: keywords,
        titles: [],
        selectedTitleIdx: null
    };
    gGallery.push(img);
}

function filterGalleryBy(str) {
    if (!str) gFilter = undefined;
    else gFilter = str;
}

// returns image by id, or if not given id param - returns the whole gImgs
function getGalleryImages(id) {
    if (id) {
        let idx = getImgIdxById(id);
        return gGallery[idx];
    }
    if (!gFilter) return gGallery;
    else {
        var filteredImages = gGallery.filter(image => {
            return image.keywords.includes(gFilter);
        });
    }
    return filteredImages;
}

function getSavedMemeIdx(id) {
    return gMemeGallery.findIndex(meme => meme.id === id);
}
function getImgIdxById(id) {
    return gGallery.findIndex(img => img.id === id);
}

function addToMemeGallery(data) {
    gMemeGallery.push(data);
    saveSettings();
}

function getSavedMeme(id) {
    let idx = gMemeGallery.findIndex(meme => {
        return meme.id === id;
    });
    return gMemeGallery[idx].editorData;
}

function saveTitleSettings(textWidth) {
    gMeme.titles.push(
        {
            text: gTitleSettings.text,
            textWidth: textWidth,
            x: gTitleSettings.x,
            y: gTitleSettings.y,
            stroke: gTitleSettings.stroke,
            fill: gTitleSettings.fill,
            align: gTitleSettings.align,
            font: gTitleSettings.font,
            fontSize: gTitleSettings.fontSize,
            titleArea: getTitleArea(gTitleSettings.x, gTitleSettings.y, textWidth, gTitleSettings.align, gTitleSettings.fontSize)
        });
}

function getTitleArea(x1, y1, width, align, fontSize) {
    let x;
    switch (align) {
        case 'center':
            x = x1 - (width / 2);
            break;

        case 'left':
            x = x1;
            break

        case 'right':
            x = x1 - width;
            break;
    }
    let y = y1 - fontSize;
    return { x1: x, y1: y, x2: (x + width), y2: y + fontSize }
}

function deleteMeme(id) {
    let idx = getSavedMemeIdx(id);
    gMemeGallery.splice(idx, 1);
    saveSettings();
}