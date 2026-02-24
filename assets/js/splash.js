/**
 * Splash Screen — Payment Transaction Intro Animation
 *
 * Flow:
 * 1. Business card fades in (0.3s delay, 0.8s animation)
 * 2. Terminal slides down beneath card (after 1.6s)
 * 3. Transaction lines type in one by one
 * 4. Progress bar fills during "processing"
 * 5. APPROVED result appears
 * 6. Gold flash transition → main site revealed
 */

(function () {
    'use strict';

    // ===== CONFIG =====
    const TIMING = {
        cardSettled: 1400,       // ms after page load before terminal appears
        terminalLineDelay: 250,  // ms between each terminal line
        processingStart: 400,    // ms after last line before progress starts
        processingDuration: 1800,// ms for progress bar to fill
        approvedDelay: 400,      // ms after bar full before APPROVED shows
        exitDelay: 1000,         // ms after APPROVED before transition starts
        flashDuration: 800,      // ms for gold flash
    };

    // ===== QR CODE (lightweight, same approach as business card) =====
    function generateQR(canvas, text, size) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, size, size);
        };
        img.onerror = function () {
            ctx.fillStyle = '#0f172a';
            const s = size / 13;
            for (let i = 0; i < 13; i++) {
                for (let j = 0; j < 13; j++) {
                    if ((i + j) % 2 === 0 || (i < 3 && j < 3) || (i < 3 && j > 9) || (i > 9 && j < 3)) {
                        ctx.fillRect(i * s, j * s, s, s);
                    }
                }
            }
        };
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=0&color=0f172a`;
    }

    // ===== RANDOM HELPERS =====
    function randomAuthCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
        return code;
    }

    function randomTxnId() {
        return 'TXN-' + Date.now().toString(36).toUpperCase().slice(-8);
    }

    // ===== SKIP / EXIT =====
    let hasExited = false;

    function exitSplash() {
        if (hasExited) return;
        hasExited = true;

        const overlay = document.getElementById('splash-overlay');
        const flash = document.getElementById('splash-flash');
        const skipBtn = document.querySelector('.splash-skip');

        if (skipBtn) skipBtn.style.display = 'none';

        // Trigger gold flash
        if (flash) {
            flash.classList.add('active');
        }

        // After flash peaks, hide the overlay
        setTimeout(() => {
            if (overlay) overlay.classList.add('hidden');
            document.body.classList.remove('splash-active');
        }, 300);

        // Clean up DOM after transition
        setTimeout(() => {
            if (overlay) overlay.remove();
            if (flash) flash.remove();
        }, TIMING.flashDuration + 200);
    }

    // ===== ANIMATION SEQUENCE =====
    function runSequence() {
        const terminal = document.querySelector('.splash-terminal');
        const lines = document.querySelectorAll('.terminal-line');
        const dividers = document.querySelectorAll('.terminal-divider');
        const statusDot = document.querySelector('.terminal-status-dot');
        const progress = document.querySelector('.terminal-progress');
        const progressFill = document.querySelector('.terminal-progress-fill');
        const result = document.querySelector('.terminal-result');
        const progressLabel = document.querySelector('.terminal-progress-label');

        // Step 1: Show terminal
        setTimeout(() => {
            if (terminal) terminal.classList.add('active');
        }, TIMING.cardSettled);

        // Step 2: Show lines one by one
        const allItems = document.querySelectorAll('.terminal-line, .terminal-divider');
        let lineStartTime = TIMING.cardSettled + 500;

        allItems.forEach((item, i) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, lineStartTime + (i * TIMING.terminalLineDelay));
        });

        const totalLineTime = lineStartTime + (allItems.length * TIMING.terminalLineDelay);

        // Step 3: Start processing
        const processingStartTime = totalLineTime + TIMING.processingStart;

        setTimeout(() => {
            if (statusDot) statusDot.classList.add('processing');
            if (progress) progress.classList.add('visible');
            if (progressLabel) progressLabel.textContent = 'Processing...';

            // Animate progress bar
            let startTs = null;
            function animateBar(ts) {
                if (!startTs) startTs = ts;
                const elapsed = ts - startTs;
                const pct = Math.min((elapsed / TIMING.processingDuration) * 100, 100);
                if (progressFill) progressFill.style.width = pct + '%';

                if (pct < 100) {
                    requestAnimationFrame(animateBar);
                } else {
                    // Step 4: Show APPROVED
                    setTimeout(() => {
                        if (statusDot) {
                            statusDot.classList.remove('processing');
                            statusDot.classList.add('approved');
                        }
                        if (progressLabel) progressLabel.textContent = 'Complete';
                        if (result) result.classList.add('visible');

                        // Step 5: Exit after pause
                        setTimeout(exitSplash, TIMING.exitDelay);
                    }, TIMING.approvedDelay);
                }
            }
            requestAnimationFrame(animateBar);
        }, processingStartTime);
    }

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', function () {
        const overlay = document.getElementById('splash-overlay');
        if (!overlay) return;

        // Check if user has seen the splash this session
        if (sessionStorage.getItem('splash-seen')) {
            overlay.remove();
            const flash = document.getElementById('splash-flash');
            if (flash) flash.remove();
            document.body.classList.remove('splash-active');
            return;
        }

        // Mark as seen
        sessionStorage.setItem('splash-seen', '1');

        // Lock scroll
        document.body.classList.add('splash-active');

        // Generate QR code
        const qrCanvas = document.getElementById('splash-qr-canvas');
        if (qrCanvas) generateQR(qrCanvas, 'https://kev-c.dev', 56);

        // Set dynamic values
        const txnIdEl = document.getElementById('splash-txn-id');
        const authCodeEl = document.getElementById('splash-auth-code');
        if (txnIdEl) txnIdEl.textContent = randomTxnId();
        if (authCodeEl) authCodeEl.textContent = 'AUTH: ' + randomAuthCode();

        // Wire up skip button
        const skipBtn = document.querySelector('.splash-skip');
        if (skipBtn) {
            skipBtn.addEventListener('click', exitSplash);
        }

        // Start animation sequence
        runSequence();
    });
})();
