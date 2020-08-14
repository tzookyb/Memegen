'use strict'

function galleryRender() {
    const images = getGalleryImages();
    var strHTML = '';
    if (!images.length) {
        strHTML = `<span style="grid-column: 1/-1; text-align: center">Sorry, No images that match that search...</span>`;
    } else {
        images.forEach(image => {
            strHTML += `
        <div class="gallery-image"> 
        <img src="${image.url}" onclick="onEditImage(${image.id})"/>
        </div>
        `;
        });
    }
    document.querySelector('.gallery-grid').innerHTML = strHTML;
}
function onEditImage(id) {
    const meme = getGalleryImages(id);
    editorInitCanvas(meme);
}

function galleryRenderKeywords() {
    let wordCloud = document.querySelector('.word-cloud');

    let words = [];
    let idxs = [];
    for (var word in gKeywords) {
        words.push(word);
        idxs.push(gKeywords[word]);
    }
    wordCloud.innerHTML = searchWordsToHTML(words, idxs, 10);

    if (words.length) {
        wordCloud.innerHTML += `
        <span class="more" onclick="galleryShowMoreWords(this)">more...</span>
        <span class="more-words"></span>
        `;
        let moreWords = document.querySelector('.more-words');
        moreWords.innerHTML = searchWordsToHTML(words, idxs, idxs.length);
    }
}

function searchWordsToHTML(words, idxs, maxWords) {
    let strHTML = '';
    for (let i = 0; i < maxWords; i++) {
        if (!idxs.length) break;
        let idx = getRandomInt(0, idxs.length);
        let word = words.splice(idx, 1);
        let count = idxs.splice(idx, 1);
        let fontSize = 2.5 * count + 10;
        strHTML += `
        <span class="search-words" onclick="galleryWordSearch(this)" style="font-size: ${fontSize}px;"> ${word} </span>
        `;
    }
    return strHTML;
}

function galleryShowMoreWords(el) {
    el.style.display = 'none';
    document.querySelector('.more-words').style.display = "block";
}

function galleryWordSearch(el) {
    let word = el.innerText;
    document.querySelector('.search-bar').value = word.trim();
    onSearch(document.querySelector('.search-bar'));
}

function onSearch(el) {
    let searchStr = el.value.toLowerCase();
    filterGalleryBy(searchStr);
    galleryRender();
}