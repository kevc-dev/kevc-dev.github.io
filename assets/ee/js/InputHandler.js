export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.isVirtualJoystickActive = false;
        this.joystickDirection = { x: 0, y: 0 };
        this.virtualControlsActive = false;

        window.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.game.handleKeyUp(e.key.toLowerCase());
        });

        this.checkDeviceType();
        window.addEventListener('resize', () => this.checkDeviceType());
    }

    checkDeviceType() {
        const isMobile = window.innerWidth <= 1024 || this.isMobileDevice();
        if (isMobile && !this.virtualControlsActive) {
            setTimeout(() => this.setupVirtualControls(), 100);
            this.virtualControlsActive = true;
        }
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    }

    setupVirtualControls() {
        const joystickStick = document.getElementById('joystickStick');
        const joystickBase = document.getElementById('joystickBase');
        const interactButton = document.getElementById('interactButton');
        const inventoryButton = document.getElementById('inventoryButton');
        const questButton = document.getElementById('questButton');
        const pauseButton = document.getElementById('pauseButton');

        if (!joystickStick || !joystickBase) return;

        let baseRect = joystickBase.getBoundingClientRect();
        let baseX = baseRect.width / 2;
        let baseY = baseRect.height / 2;
        let maxDistance = baseRect.width / 2 - joystickStick.clientWidth / 2;

        const updateJoystickMeasurements = () => {
            baseRect = joystickBase.getBoundingClientRect();
            baseX = baseRect.width / 2;
            baseY = baseRect.height / 2;
            maxDistance = baseRect.width / 2 - joystickStick.clientWidth / 2;
        };

        window.addEventListener('resize', updateJoystickMeasurements);
        window.addEventListener('orientationchange', () => {
            setTimeout(updateJoystickMeasurements, 100);
        });

        const handleJoystickTouch = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            baseRect = joystickBase.getBoundingClientRect();
            const touchX = touch.clientX - baseRect.left;
            const touchY = touch.clientY - baseRect.top;
            const deltaX = touchX - baseX;
            const deltaY = touchY - baseY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > maxDistance) {
                const angle = Math.atan2(deltaY, deltaX);
                joystickStick.style.left = (baseX + Math.cos(angle) * maxDistance) + 'px';
                joystickStick.style.top = (baseY + Math.sin(angle) * maxDistance) + 'px';
                this.joystickDirection.x = Math.cos(angle);
                this.joystickDirection.y = Math.sin(angle);
            } else {
                joystickStick.style.left = touchX + 'px';
                joystickStick.style.top = touchY + 'px';
                this.joystickDirection.x = deltaX / maxDistance;
                this.joystickDirection.y = deltaY / maxDistance;
            }
            this.isVirtualJoystickActive = true;
            this.keys['arrowup'] = this.joystickDirection.y < -0.3;
            this.keys['arrowdown'] = this.joystickDirection.y > 0.3;
            this.keys['arrowleft'] = this.joystickDirection.x < -0.3;
            this.keys['arrowright'] = this.joystickDirection.x > 0.3;
        };

        const resetJoystick = () => {
            joystickStick.style.left = '50%';
            joystickStick.style.top = '50%';
            this.joystickDirection = { x: 0, y: 0 };
            this.isVirtualJoystickActive = false;
            this.keys['arrowup'] = false;
            this.keys['arrowdown'] = false;
            this.keys['arrowleft'] = false;
            this.keys['arrowright'] = false;
        };

        joystickBase.addEventListener('touchstart', handleJoystickTouch, { passive: false });
        joystickBase.addEventListener('touchmove', handleJoystickTouch, { passive: false });
        joystickBase.addEventListener('touchend', resetJoystick);
        joystickBase.addEventListener('touchcancel', resetJoystick);

        const setupButtonListener = (button, key) => {
            if (button) {
                button.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.keys[key] = true;
                }, { passive: false });
                button.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.keys[key] = false;
                    this.game.handleKeyUp(key);
                }, { passive: false });
            }
        };

        setupButtonListener(interactButton, 'e');
        setupButtonListener(inventoryButton, 'i');
        setupButtonListener(questButton, 'q');
        setupButtonListener(pauseButton, 'p');

        resetJoystick();
    }

    isPressed(key) {
        return this.keys[key] || false;
    }
}
