'use strict'

function onLoadImagesGallery() {
    loadImages();
}
function renderImagesGallery() {
    const images = getImages()
    images.forEach(image => {
        let strHTML = `
        <div class="gallery-image"> 
        <img src="${image.url}" onclick="onEditImage(${image.id})"/>
        </div>
        `;
        document.querySelector('.gallery-grid').innerHTML += strHTML;
    });
}
function onSearch(el) {
    console.log(el.value);
}