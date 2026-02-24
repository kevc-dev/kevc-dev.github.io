/**
 * Splash Screen — POS Terminal + Tap to Pay + Receipt
 *
 * Flow:
 * 1. POS terminal fades in
 * 2. Screen shows "TAP TO PAY" with blinking cursor
 * 3. Business card floats down from above, hovers over NFC zone
 * 4. Card gently lowers to tap — NFC zone lights up gold
 * 5. Card lifts away and fades out
 * 6. Screen shows "READING CARD..." then transaction details
 * 7. Progress bar fills during processing
 * 8. Screen shows APPROVED, NFC zone turns green
 * 9. Receipt prints out from terminal
 * 10. Receipt shows APPROVED stamp
 * 11. Gold flash → main site
 */

(function () {
    'use strict';

    // ===== TIMING =====
    const T = {
        terminalReady: 800,
        cardAppear: 1600,         // card floats down from above
        cardHoverPause: 700,      // card hovers before tapping
        cardTapDuration: 400,     // card lowers to touch
        tapContactHold: 500,      // card stays in contact
        cardLiftDuration: 700,    // card lifts away
        readingDelay: 300,        // after lift, "READING CARD..."
        lineDelay: 200,
        processingDuration: 1600,
        approvedDelay: 350,
        receiptDelay: 500,
        receiptStamp: 1400,
        exitDelay: 1000,
        flashDuration: 800,
    };

    // ===== HELPERS =====
    function randomCode(len, chars) {
        let s = '';
        for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
        return s;
    }

    const authCode = randomCode(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    const txnId = 'TXN-' + Date.now().toString(36).toUpperCase().slice(-8);

    // ===== EXIT =====
    let hasExited = false;

    function exitSplash() {
        if (hasExited) return;
        hasExited = true;

        const overlay = document.getElementById('splash-overlay');
        const flash = document.getElementById('splash-flash');
        const skipBtn = document.querySelector('.splash-skip');

        if (skipBtn) skipBtn.style.display = 'none';

        if (flash) flash.classList.add('active');

        setTimeout(() => {
            if (overlay) overlay.classList.add('hidden');
            document.body.classList.remove('splash-active');
        }, 300);

        setTimeout(() => {
            if (overlay) overlay.remove();
            if (flash) flash.remove();
        }, T.flashDuration + 200);
    }

    // ===== SCREEN LINE HELPER =====
    function showLine(step) {
        const el = document.querySelector(`.screen-line[data-step="${step}"]`);
        if (el) el.classList.add('visible');
        return el;
    }

    function hideLine(step) {
        const el = document.querySelector(`.screen-line[data-step="${step}"]`);
        if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(4px)'; }
    }

    // ===== MAIN SEQUENCE =====
    function runSequence() {
        const cursor = document.querySelector('.screen-cursor');
        const card = document.querySelector('.swipe-card');
        const tapZone = document.querySelector('.pos-tap-zone');
        const statusLed = document.querySelector('.pos-led.status');
        const progress = document.querySelector('.screen-progress');
        const progressFill = document.querySelector('.screen-progress-fill');
        const receipt = document.querySelector('.pos-receipt');
        const approvedStamp = document.querySelector('.receipt-line.approved-stamp');

        let t = 0;

        // Step 1: Screen header
        t += T.terminalReady;
        setTimeout(() => showLine('header'), t);

        // Step 2: "TAP TO PAY"
        t += 400;
        setTimeout(() => {
            showLine('insert');
            if (cursor) cursor.style.display = 'inline-block';
        }, t);

        // Step 3: Card floats down from above and hovers
        t += T.cardAppear - 400;
        setTimeout(() => {
            if (card) card.classList.add('animate-hover');
        }, t);

        // Step 4: After hover animation completes + pause, card taps down
        t += 800 + T.cardHoverPause;
        setTimeout(() => {
            if (card) {
                // Lock the hover end-state into inline styles before swapping animation
                card.style.top = '-20px';
                card.style.opacity = '1';
                card.classList.remove('animate-hover');
                // Force reflow so the browser registers the class removal
                void card.offsetHeight;
                card.classList.add('animate-tap');
            }
            if (tapZone) tapZone.classList.add('active');
            if (cursor) cursor.style.display = 'none';
            if (statusLed) statusLed.classList.add('status-active');
        }, t);

        // Step 5: Card holds contact, then lifts away
        t += T.cardTapDuration + T.tapContactHold;
        setTimeout(() => {
            if (card) {
                // Lock the tap end-state before swapping to lift
                card.style.top = '0px';
                card.style.opacity = '1';
                card.classList.remove('animate-tap');
                void card.offsetHeight;
                card.classList.add('animate-lift');
            }
        }, t);

        // Step 6: "READING CARD..."
        t += T.readingDelay + 200;
        setTimeout(() => {
            hideLine('insert');
            showLine('reading');
        }, t);

        // Step 7: Show transaction info lines
        t += 600;
        const infoSteps = ['merchant', 'txn', 'item', 'card', 'total'];
        infoSteps.forEach((step, i) => {
            setTimeout(() => {
                if (i === 0) hideLine('reading');
                showLine(step);
            }, t + (i * T.lineDelay));
        });

        t += infoSteps.length * T.lineDelay + 300;

        // Step 8: Processing bar
        setTimeout(() => {
            showLine('processing');
            if (progress) progress.classList.add('visible');

            let startTs = null;
            function animateBar(ts) {
                if (!startTs) startTs = ts;
                const elapsed = ts - startTs;
                const pct = Math.min((elapsed / T.processingDuration) * 100, 100);
                if (progressFill) progressFill.style.width = pct + '%';

                if (pct < 100) {
                    requestAnimationFrame(animateBar);
                } else {
                    // Step 9: APPROVED
                    setTimeout(() => {
                        if (statusLed) {
                            statusLed.classList.remove('status-active');
                            statusLed.classList.add('status-approved');
                        }
                        if (tapZone) {
                            tapZone.classList.remove('active');
                            tapZone.classList.add('success');
                        }
                        hideLine('processing');
                        if (progress) progress.style.opacity = '0';
                        showLine('approved');
                        setTimeout(() => showLine('auth'), 100);

                        // Step 10: Print receipt
                        setTimeout(() => {
                            if (receipt) receipt.classList.add('printing');

                            // Step 11: Stamp on receipt
                            setTimeout(() => {
                                if (approvedStamp) approvedStamp.classList.add('visible');

                                // Step 12: Exit
                                setTimeout(exitSplash, T.exitDelay);
                            }, T.receiptStamp);
                        }, T.receiptDelay);
                    }, T.approvedDelay);
                }
            }
            requestAnimationFrame(animateBar);
        }, t);
    }

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', function () {
        const overlay = document.getElementById('splash-overlay');
        if (!overlay) return;

        // Skip if seen this session
        if (sessionStorage.getItem('splash-seen')) {
            overlay.remove();
            const flash = document.getElementById('splash-flash');
            if (flash) flash.remove();
            document.body.classList.remove('splash-active');
            return;
        }

        sessionStorage.setItem('splash-seen', '1');
        document.body.classList.add('splash-active');

        // Set dynamic values
        const txnEl = document.getElementById('splash-txn-id');
        const authEl = document.getElementById('splash-auth-code');
        const receiptTxnEl = document.getElementById('receipt-txn-id');
        const receiptAuthEl = document.getElementById('receipt-auth-code');

        if (txnEl) txnEl.textContent = txnId;
        if (authEl) authEl.textContent = 'AUTH: ' + authCode;
        if (receiptTxnEl) receiptTxnEl.textContent = txnId;
        if (receiptAuthEl) receiptAuthEl.textContent = 'AUTH CODE: ' + authCode;

        // Skip button
        const skipBtn = document.querySelector('.splash-skip');
        if (skipBtn) skipBtn.addEventListener('click', exitSplash);

        runSequence();
    });
})();
