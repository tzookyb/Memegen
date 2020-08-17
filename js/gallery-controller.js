'use strict'

function galleryRender() {
    var images = getGalleryImages().slice();
    var strHTML = '';
    if (!images.length) {
        strHTML = `<span style="grid-column: 1/-1; text-align: center">Sorry, No images that match that search...</span>`;
    } else {
        while (images.length) {
            const image = images.splice((getRandomInt(0, images.length - 1)), 1);
            strHTML += `
            <div class="gallery-image"> 
            <img src="${image[0].url}" onclick="onEditImage(${image[0].id})"/>
            </div>
        `;
        };
    }
    document.querySelector('.gallery-grid').innerHTML = strHTML;
}

function onEditImage(id) {
    const meme = getGalleryImages(id);
    editorInit(meme);
}

function galleryRenderKeywords() {
    let elWordCloud = document.querySelector('.word-cloud');
    let words = [];
    let idxs = [];
    for (var word in gKeywords) {
        words.push(word);
        idxs.push(gKeywords[word]);
    }
    elWordCloud.innerHTML = searchWordsToHTML(words, idxs, 10);

    if (words.length) {
        elWordCloud.innerHTML += `
        <span class="more" onclick="galleryShowMoreWords(this)">more...</span>
        <span class="more-words"></span>
        `;
        let moreWords = document.querySelector('.more-words');
        moreWords.innerHTML = searchWordsToHTML(words, idxs, idxs.length);
    }
}

function searchWordsToHTML(words, idxs, maxWords) {
    if (!idxs.length) return;
    let strHTML = '';
    for (let i = 0; i < maxWords; i++) {
        let idx = getRandomInt(0, idxs.length);
        let word = words.splice(idx, 1);
        let count = idxs.splice(idx, 1);
        let ratio = count / (Object.keys(gKeywords).length) * 4.5;
        let fontSize = 0.7 + ratio;
        strHTML += `
        <span class="search-words" onclick="galleryWordSearch(this)" style="font-size: ${fontSize}em;"> ${word} </span>
        `;
    }
    return strHTML;
}

function galleryShowMoreWords(el) {
    el.style.display = 'none';
    document.querySelector('.more-words').style.display = "block";
}

function galleryWordSearch(el) {
    let word = el.innerText.trim();
    gKeywords[word]++;
    saveData();
    galleryRenderKeywords();
    document.querySelector('.search-bar').value = word.trim();
    onSearch(document.querySelector('.search-bar'));
}

function onSearch(el) {
    let searchStr = el.value.toLowerCase();
    filterGalleryBy(searchStr);
    galleryRender();
}