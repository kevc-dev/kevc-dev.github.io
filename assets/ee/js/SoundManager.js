export class SoundManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.masterVolume = 1.0;
        this.sfxVolume = 0.7;
        this.musicVolume = 0.5;
        this.currentMusic = null;
        this.audioInitialized = false;
        this.pendingMusic = null;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.audioContext = null;

        if (this.isMobile) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContext();
            } catch (e) {
                console.warn('Web Audio API not supported.');
            }
        }

        const resumeOnInteraction = () => {
            this.initializeAudio();
            if (this.pendingMusic) {
                this.playMusic(this.pendingMusic.name, this.pendingMusic.loop);
                this.pendingMusic = null;
            }
            document.removeEventListener('click', resumeOnInteraction);
            document.removeEventListener('keydown', resumeOnInteraction);
            document.removeEventListener('touchstart', resumeOnInteraction);
        };
        document.addEventListener('click', resumeOnInteraction, { once: false });
        document.addEventListener('keydown', resumeOnInteraction, { once: false });
        document.addEventListener('touchstart', resumeOnInteraction, { once: false });

        this.music.menuTheme = new Audio('music/menu.mp3');
        this.music.firstScenarioTheme = new Audio('sounds/first_scenario.mp3');
        this.music.secondScenarioTheme = new Audio('sounds/second_scenario.mp3');
        this.music.thirdScenarioTheme = new Audio('sounds/third_scenario.mp3');
        this.music.hohokamTheme = new Audio('sounds/hohokam_theme.mp3');
        this.music.casaGrandeTheme = new Audio('sounds/casa_grande_theme.mp3');
        this.music.skyPeopleTheme = new Audio('sounds/sky_people_theme.mp3');
        this.music.whiteTanksTheme = new Audio('sounds/white_tanks_theme.mp3');
        this.music.asuLabTheme = new Audio('sounds/fourth_scenario.mp3');
        this.music.chamberTheme = new Audio('sounds/chamber_theme.mp3');

        this.sounds.selectOption = new Audio('sounds/select_options.mp3');
        this.sounds.gameStart = new Audio('sounds/game_start.mp3');
        this.sounds.nextScenario = new Audio('sounds/next_scenario.mp3');
        this.sounds.playerHurt = new Audio('sounds/hurt.mp3');
        this.sounds.getCoin = new Audio('sounds/get_coin.mp3');
        this.sounds.getItem = new Audio('sounds/get_item.mp3');
        this.sounds.gameOver = new Audio('sounds/game_over.mp3');
        this.sounds.winGame = new Audio('sounds/win_game.mp3');
        this.sounds.puzzleCorrect = new Audio('sounds/puzzle_correct.mp3');
        this.sounds.puzzleIncorrect = new Audio('sounds/puzzle_incorrect.mp3');
        this.sounds.enemyAttack = new Audio('sounds/enemy_attack.mp3');
        this.sounds.enemyHit = new Audio('sounds/enemy_hit.mp3');
        this.sounds.enemyDie = new Audio('sounds/enemy_die.mp3');
        this.sounds.drink = new Audio('sounds/drink.mp3');
        this.sounds.toinkArrow = new Audio('sounds/toink_arrow.mp3');
        this.sounds.thunder = new Audio('sounds/thunder.mp3');

        this.preloadAudio();

        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.masterVolume * this.sfxVolume;
            sound.addEventListener('ended', () => sound.currentTime = 0);
            sound.addEventListener('error', (e) => console.warn('Error with sound:', e));
        });

        Object.values(this.music).forEach(track => {
            track.volume = this.masterVolume * this.musicVolume;
            track.addEventListener('ended', () => track.currentTime = 0);
            track.addEventListener('error', (e) => console.warn('Error with music:', e));
        });
    }

    preloadAudio() {
        const preload = (audio) => {
            if (audio && audio.src) audio.load();
        };
        Object.values(this.sounds).forEach(preload);
        Object.values(this.music).forEach(preload);
    }

    initializeAudio() {
        if (this.audioInitialized) return;
        if (this.isMobile && this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('AudioContext resumed');
            }).catch(e => console.warn('Error resuming AudioContext:', e));
        }
        if (this.isMobile) {
            const silentSound = new Audio();
            silentSound.src = 'data:audio/mp3;base64,SUQzBAAAAAABEUAAACgAZHRlYWNoZXIgdGVzdCBmaWxlIEJlZXAgdG9uZQAAAAAAAAAAAA==';
            silentSound.play().catch(() => {});
            Object.values(this.sounds).concat(Object.values(this.music)).forEach(audio => {
                audio.load();
                audio.play().catch(() => {}).then(() => audio.pause());
                audio.currentTime = 0;
            });
        }
        this.audioInitialized = true;
    }

    playSound(soundName) {
        if (!this.audioInitialized) this.initializeAudio();
        if (this.sounds[soundName]) {
            const sound = this.sounds[soundName];
            sound.currentTime = 0;
            sound.play().catch(e => {
                console.warn(`Error playing sound ${soundName}:`, e);
                if (e.name === 'NotAllowedError' && this.isMobile) {
                    document.body.addEventListener('touchstart', () => sound.play().catch(() => {}), { once: true });
                }
            });
        } else {
            console.warn(`Sound not found: ${soundName}`);
        }
    }

    playMusic(musicName, loop = true) {
        if (!this.audioInitialized) this.initializeAudio();
        if (this.currentMusic && this.music[this.currentMusic]) {
            this.music[this.currentMusic].pause();
            this.music[this.currentMusic].currentTime = 0;
        }
        if (this.music[musicName]) {
            const music = this.music[musicName];
            music.loop = loop;
            music.play().catch(e => {
                if (e.name === 'NotAllowedError') {
                    this.pendingMusic = { name: musicName, loop };
                } else {
                    console.warn(`Error playing music ${musicName}:`, e);
                }
            });
            this.currentMusic = musicName;
        } else {
            console.warn(`Music not found: ${musicName}`);
        }
    }

    stopMusic(specificMusicName = null) {
        this.pendingMusic = null;
        if (specificMusicName && this.music[specificMusicName]) {
            this.music[specificMusicName].pause();
            this.music[specificMusicName].currentTime = 0;
            if (this.currentMusic === specificMusicName) this.currentMusic = null;
        } else if (this.currentMusic && this.music[this.currentMusic]) {
            this.music[this.currentMusic].pause();
            this.music[this.currentMusic].currentTime = 0;
            this.currentMusic = null;
        }
    }

    pauseCurrentMusic() {
        if (this.currentMusic && this.music[this.currentMusic]) this.music[this.currentMusic].pause();
    }

    resumeCurrentMusic() {
        if (this.currentMusic && this.music[this.currentMusic]) {
            this.music[this.currentMusic].play().catch(e => {
                console.warn(`Error resuming music ${this.currentMusic}:`, e);
                if (e.name === 'NotAllowedError' && this.isMobile) {
                    document.body.addEventListener('touchstart', () => this.music[this.currentMusic].play().catch(() => {}), { once: true });
                }
            });
        }
    }
}
