'use strict'

var gElBody = document.querySelector('body');
var gIsMenuOpen = false;
var gIsModalShown = false;
var gGallerySection = document.querySelector('.gallery');
var gEditorSection = document.querySelector('.editor');
var gMemeGallerySection = document.querySelector('.meme-gallery');
var gTimeout

function onInit() {
    loadSettings();
    resetPrefs();
    galleryRender();
    galleryRenderKeywords();
    memeGalleryRender();
    onShowGallery();
    initEditor();
    initCanvas();
}

function showMessage(str, secsInterval) {
    clearTimeout(gTimeout);
    var toast = document.querySelector('.info-toast')
    toast.innerText = str;
    toast.classList.add('info-toast-show');
    gTimeout = setTimeout(() => {
        toast.classList.remove('info-toast-show');
    }, secsInterval * 1000)

}
function onShowGallery() {
    if (gIsMenuOpen) onCloseMenu();
    gMemeGallerySection.classList.remove('show-section');
    gEditorSection.classList.remove('show-section');
    gGallerySection.classList.add('show-section');
}
function onShowMemes() {
    if (gIsMenuOpen) onCloseMenu();
    gGallerySection.classList.remove('show-section');
    gEditorSection.classList.remove('show-section');
    gMemeGallerySection.classList.add('show-section');
}
function onShowEditor() {
    if (gIsMenuOpen) closeMenu();
    gGallerySection.classList.remove('show-section');
    gMemeGallerySection.classList.remove('show-section');
    gEditorSection.classList.add('show-section');
}

function onOpenMenu() {
    gElBody.classList.add('menu-open');
    document.querySelector('.menu-btn').style.display = 'none';
    document.querySelector('.menu-close-btn').style.display = 'block';
    gIsMenuOpen = true;
}
function onCloseMenu() {
    if (gIsModalShown) {
        onHideDoneModal();
        onHideAboutModal();
    }
    gElBody.classList.remove('menu-screen');
    gElBody.classList.remove('menu-open');
    document.querySelector('.menu-close-btn').style.display = '';
    document.querySelector('.menu-btn').style.display = '';
    gIsMenuOpen = false;
}

function onHideDoneModal() {
    gElBody.classList.remove('modal-open');
    document.querySelector('.done-modal').style.display = 'none';
    gIsModalShown = false;
}
function onShowDoneModal() {
    gElBody.classList.add('modal-open');
    document.querySelector('.done-modal').style.display = 'flex';
    gIsModalShown = true;
}

function initEditor() {
    document.querySelector('.meme-title').addEventListener('keyup', function (ev) {
        if (ev.keyCode === 13) onAddTextTitle();
    });
}
function onShowAboutModal() {
    if (gIsMenuOpen) onCloseMenu();
    gElBody.classList.add('about-open');
    document.querySelector('.about-modal').style.display = 'block';
    gIsModalShown = true;
}
function onHideAboutModal() {
    gElBody.classList.remove('about-open');
    document.querySelector('.about-modal').style.display = 'none';
    gIsModalShown = false;
}