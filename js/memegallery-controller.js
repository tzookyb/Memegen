'use strict'

function memeGalleryRender() {
    const memes = getSavedMemes();
    var memeGalleryHTML = document.querySelector('.memes');

    var strHTML = '';
    if (!memes || !memes.length) {
        strHTML = `<span style="grid-column: 1/-1; text-align: center">No saved Memes to show... Go on and create some :)</span>`;
    } else {
        memes.forEach(meme => {
            strHTML += `
            <div class="gallery-image">
            <img class="bin" width=30 src="img/icons/trash.png" onclick="onRemoveMeme(${meme.id})"/>    
            <img src="${meme.imgData}" onclick="onEditMeme(${meme.id})"/>
            </div>
            `;
        });
    }
    memeGalleryHTML.innerHTML = strHTML;
}

function onEditMeme(id) {
    const meme = getSavedMeme(id);
    editorInit(meme);
}

function onRemoveMeme(id) {
    removeMeme(id);
    memeGalleryRender();
}