'use strict'
var gSections = ['.gallery', '.editor', '.meme-gallery']
var gCurrSection = '.gallery';
var gCurrOpenModal = null;

var gElBody = document.querySelector('body');

function onInit() {
    resetPrefs()
    onLoadImagesGallery();
    renderImagesGallery();
    renderMemeGallery();
    onDisplaySection(gCurrSection);
}
function onDisplaySection(screen) {
    onCloseCurrentModal();
    gSections.forEach((section) => {
        document.querySelector(section).style.display = (section === screen) ? 'flex' : 'none';
    })
}
function onDisplayScreen() {
    gElBody.classList.add('screen');
}
function onCloseCurrentModal() {
    gElBody.classList.remove('screen');
    if (gCurrOpenModal === '.menu-open') {
        gElBody.classList.remove('menu-open');
        document.querySelector('.menu-close-btn').style.display = "none";
        document.querySelector('.menu-btn').style.display = "block";
        gCurrOpenModal = null;
    }
    if (gCurrOpenModal) document.querySelector(gCurrOpenModal).style.display = 'none';
}

function onDisplayDoneModal() {
    gCurrOpenModal = '.done-modal'
    onDisplayScreen();
    document.querySelector('.done-modal').style.display = 'flex';
}
function onDisplayMenu() {
    gCurrOpenModal = '.menu-open'
    onDisplayScreen();
    document.querySelector('body').classList.add('menu-open');
    document.querySelector('body').classList.add('screen');
    document.querySelector('.menu-btn').style.display = "none";
    document.querySelector('.menu-close-btn').style.display = "block";
}