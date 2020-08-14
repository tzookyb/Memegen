'use strict'

var gElBody = document.querySelector('body');
var isMenuOpen = false;
var isModalShown = false;
var gGallerySection = document.querySelector('.gallery');
var gEditorSection = document.querySelector('.editor');
var gMemeGallerySection = document.querySelector('.meme-gallery');

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

function onShowGallery() {
    if (isMenuOpen) onCloseMenu();
    gEditorSection.style.display = 'none';
    gMemeGallerySection.style.display = 'none';
    gGallerySection.style.display = 'flex';
}
function onShowMemes() {
    if (isMenuOpen) onCloseMenu();
    gEditorSection.style.display = 'none';
    gGallerySection.style.display = 'none';
    gMemeGallerySection.style.display = 'flex';
}
function onShowEditor() {
    if (isMenuOpen) closeMenu();
    gGallerySection.style.display = 'none';
    gMemeGallerySection.style.display = 'none';
    gEditorSection.style.display = 'flex';
}

function onOpenMenu() {
    gElBody.classList.add('menu-open');
    document.querySelector('.menu-btn').style.display = 'none';
    document.querySelector('.menu-close-btn').style.display = 'block';
    isMenuOpen = true;
}
function onCloseMenu() {
    if (isModalShown) onHideDoneModal();
    gElBody.classList.remove('menu-screen');
    gElBody.classList.remove('menu-open');
    document.querySelector('.menu-close-btn').style.display = '';
    document.querySelector('.menu-btn').style.display = '';
    isMenuOpen = false;
}

function onHideDoneModal() {
    gElBody.classList.remove('modal-open');
    document.querySelector('.done-modal').style.display = 'none';
    isModalShown = false;
}
function onShowDoneModal() {
    gElBody.classList.add('modal-open');
    document.querySelector('.done-modal').style.display = 'flex';
    isModalShown = true;
}

function initEditor() {
    document.querySelector('.meme-title').addEventListener('keyup', function (ev) {
        if (ev.keyCode === 13) onAddTextTitle();
    });
}