import { Game } from './Game.js';

// Fix iOS viewport height issues
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100);
});

// Font loading detection
function checkFontLoaded() {
    const testElement = document.createElement('div');
    testElement.style.fontFamily = '"Press Start 2P", monospace';
    testElement.style.fontSize = '16px';
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    testElement.innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    document.body.appendChild(testElement);

    const originalWidth = testElement.offsetWidth;
    testElement.style.fontFamily = 'monospace';
    const fallbackWidth = testElement.offsetWidth;

    document.body.removeChild(testElement);

    if (originalWidth !== fallbackWidth) {
        document.body.classList.remove('font-loading');
        document.body.classList.add('font-loaded');
        return true;
    }
    return false;
}

function waitForFont() {
    if (checkFontLoaded()) return;

    let attempts = 0;
    const maxAttempts = 50;

    const checkInterval = setInterval(() => {
        attempts++;
        if (checkFontLoaded() || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            document.body.classList.remove('font-loading');
            document.body.classList.add('font-loaded');
        }
    }, 100);
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        waitForFont();
        new Game();
    });
} else {
    waitForFont();
    new Game();
}
