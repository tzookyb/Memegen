'use strict'

var gElBody = document.body;
var gIsMenuOpen = false;
var gIsModalShown = false;
var gTimeout;
var gCurrentShownModal;
const gSections = ['.gallery', '.editor', '.meme-gallery']
var gCurrentShownSection;


function onInit() {
    loadData();
    resetPrefs();
    galleryRender();
    galleryRenderKeywords();
    memeGalleryRender();
    initEvents();
}

function onShowModal(modal) {
    if (gCurrentShownModal) { onHideModal(gCurrentShownModal) };
    gElBody.classList.add('fade');
    document.querySelector(modal).classList.add('show-modal');
    gCurrentShownModal = modal;
    if (modal === 'nav') {
        document.querySelector('.menu-btn').style.display = 'none';
        document.querySelector('.menu-close-btn').style.display = 'block';
    }
}

function onHideModal(modal) {
    gElBody.classList.remove('fade');
    document.querySelector(modal).classList.remove('show-modal');
    gCurrentShownModal = null;
    if (modal === 'nav') {
        document.querySelector('.menu-close-btn').style.display = '';
        document.querySelector('.menu-btn').style.display = '';
    }
}

function onRouteTo(page) {
    if (gCurrentShownModal) { onHideModal(gCurrentShownModal) };
    gSections.forEach(section => {
        if (section === page) document.querySelector(section).classList.add('show-section');
        else document.querySelector(section).classList.remove('show-section');
    })
    gCurrentShownSection = page;
    if (page === '.editor') document.querySelector('.meme-title').focus();
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

function initEvents() {
    gCanvas.addEventListener("mousedown", mouseDown);
    gCanvas.addEventListener("mouseup", mouseUp);
    gElBody.addEventListener("mouseup", mouseUp);
    gCanvas.addEventListener("mousemove", drag);
    gCanvas.addEventListener("touchstart", mouseDown);
    gCanvas.addEventListener("touchmove", drag);
    gCanvas.addEventListener("touchend", mouseUp);
    
    document.querySelector('.meme-title').addEventListener('keyup', function (ev) {
        if (ev.keyCode === 13) {
            onAddTextTitle();
        }
    });
}