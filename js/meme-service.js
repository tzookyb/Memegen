'use strict'
var gId = 1;
var gImgs = [];
var gKeywords = { 'happy': 12, 'funny': 1 }

function loadImages() {
    let images = loadFromStorage('gImgs');
    if (!images || images.length === 0) _createDefaultImgs();
    else gImgs = images;
}
function _createDefaultImgs() {
    for (let i = 1; i <= 18; i++) {
        _createImg();
    }
    saveToStorage('gImgs', gImgs);
}
function _createImg() {
    var img = {
        id: gId,
        url: `img/meme-imgs-square/${gId++}.jpg`,
        keywords: [],
        currTitleIdx: 0,
        titles: []
    };
    gImgs.push(img);
}
// returns image by id, or if not given id param - returns the whole gImgs
function getImages(id) {
    if (!id) return gImgs;
    let idx = getImgIdxById(id);
    return gImgs[idx];
}
function getImgIdxById(id) {
    return gImgs.findIndex(img => img.id === id);
}
function addToMemeGallery(data) {
    var memes = loadFromStorage('memes');
    if (!memes || !memes.length) memes = [data];
    else memes.push(data);
    saveToStorage('memes', memes)
}
function loadMemeGallery(){
    return loadFromStorage('memes');
}