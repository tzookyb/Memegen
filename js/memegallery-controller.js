'use strict'

function renderMemeGallery() {
    const memes = loadMemeGallery()
    if (!memes || !memes.length) return;
    document.querySelector('.memes').innerHTML = '';
    memes.forEach(meme => {
        let strHTML = `
        <div class="gallery-image"> 
        <img src="${meme.imgData}"/ onclick="drawMemeToCanvas">
        </div>
        `;
        document.querySelector('.memes').innerHTML += strHTML;
    });
}