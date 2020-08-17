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
    _createImg('1.jpg', ['trump', 'finger', 'politics', 'angry']);
    _createImg('2.jpg', ['cute', 'dog', 'kiss']);
    _createImg('3.jpg', ['dog', 'baby', 'cute', 'sleep']);
    _createImg('4.jpg', ['cute', 'cat', 'sleep', 'laptop']);
    _createImg('5.jpg', ['baby', 'yes', 'winner']);
    _createImg('6.jpg', ['hair', 'size', 'hands']);
    _createImg('7.jpg', ['baby', 'cute']);
    _createImg('8.jpg', ['smile', 'bowtie', 'hat']);
    _createImg('9.jpg', ['asian', 'kid']);
    _createImg('10.jpg', ['smile', 'obama', 'celeb', 'politics']);
    _createImg('11.jpg', ['boxing', 'kiss']);
    _createImg('12.jpg', ['celeb', 'finger', 'gesture']);
    _createImg('13.jpg', ['celeb', 'smile', 'film', 'gatsby']);
    _createImg('14.jpg', ['celeb', 'film', 'matrix', 'face']);
    _createImg('15.jpg', ['film', 'face', 'gesture']);
    _createImg('16.jpg', ['face', 'smile']);
    _createImg('17.jpg', ['putin', 'finger']);
    _createImg('18.jpg', ['film', 'cartoon']);
    _createImg('19.jpg', ['film', 'nature', 'woman', 'music']);
    _createImg('20.jpg', ['eyes', 'funny', 'mouth']);
    _createImg('21.jpg', ['kid', 'funny', 'dance']);
    _createImg('22.jpg', ['trump', 'finger', 'face']);
    _createImg('23.jpg', ['dog', 'funny', 'weird']);
    _createImg('24.jpg', ['film', 'lazer', 'finger']);
    _createImg('25.jpg', ['celeb', 'funny', 'shout']);
    _createImg('26.jpg', ['celeb', 'how i met your mother', 'barney stinson', 'suit']);
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
        var filteredImages = [];
        gGallery.map(meme => {
            meme.keywords.map(keyword => {
                if (keyword.includes(gFilter)) {
                    filteredImages.push(meme);
                }
            })
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

function saveTitleSettings() {
    gMeme.titles.push(
        {
            x: gTitleSettings.x,
            y: gTitleSettings.y,
            stroke: gTitleSettings.stroke,
            fill: gTitleSettings.fill,
            align: gTitleSettings.align,
            font: gTitleSettings.font,
            fontSize: gTitleSettings.fontSize,
            text: gTitleSettings.text,
            textWidth: gTitleSettings.textWidth,
            titleArea: getTitleArea(gTitleSettings.x, gTitleSettings.y, gTitleSettings.textWidth, gTitleSettings.align, gTitleSettings.fontSize)
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

function removeMeme(id) {
    let idx = getSavedMemeIdx(id);
    gMemeGallery.splice(idx, 1);
    saveSettings();
}