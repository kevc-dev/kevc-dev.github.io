const MUTE_KEY = 'dc_muted';       // legacy: '1' meant muted
const VOLUME_KEY = 'dc_volume';    // '1' | '0.5' | '0'

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
        this.fadeTimers = new Map();
        // WebAudio synth for diegetic sound: rattlesnake, crickets, haboob wind, alignment chime
        this.synth = null;
        this.rattleUsers = 0;
        this.cricketsOn = false;
        this.windOn = false;
        // Three-step volume: full -> half -> silent
        this.volumeLevel = 1;
        try {
            const stored = localStorage.getItem(VOLUME_KEY);
            if (stored !== null) this.volumeLevel = Math.max(0, Math.min(1, parseFloat(stored) || 0));
            else if (localStorage.getItem(MUTE_KEY) === '1') this.volumeLevel = 0; // migrate legacy mute
        } catch (e) { /* ignore */ }

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
        this.music.asuLabTheme = new Audio('sounds/asu_scenario_theme.mp3');
        this.music.chamberTheme = new Audio('sounds/chamber_theme.mp3');
        this.music.ghostTownTheme = new Audio('sounds/western.mp3');
        this.music.mineTheme = new Audio('sounds/mine_scenario_theme.mp3');
        this.music.papagoTheme = new Audio('sounds/papago_scenario_theme.mp3');
        this.music.canalTheme = new Audio('sounds/another_scenario.mp3');
        this.music.superstitionsTheme = new Audio('sounds/fourth_scenario.mp3');

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
        this.sounds.knock = new Audio('sounds/knock.wav');
        this.sounds.thunder = new Audio('sounds/thunder.mp3');
        this.sounds.pause = new Audio('sounds/pause.wav');

        this.preloadAudio();

        Object.values(this.sounds).forEach(sound => {
            sound.addEventListener('ended', () => sound.currentTime = 0);
            sound.addEventListener('error', (e) => console.warn('Error with sound:', e));
        });
        Object.values(this.music).forEach(track => {
            track.addEventListener('ended', () => track.currentTime = 0);
            track.addEventListener('error', (e) => console.warn('Error with music:', e));
        });
        this.applyVolumes();
    }

    get muted() { return this.volumeLevel === 0; }
    get effectiveSfxVolume() { return this.masterVolume * this.sfxVolume * this.volumeLevel; }
    get effectiveMusicVolume() { return this.masterVolume * this.musicVolume * this.volumeLevel; }

    applyVolumes() {
        Object.values(this.sounds).forEach(s => { s.volume = this.effectiveSfxVolume; });
        Object.values(this.music).forEach(t => {
            if (!this.fadeTimers.has(t)) t.volume = this.effectiveMusicVolume;
        });
        if (this.synth) this.synth.master.gain.value = 0.5 * this.volumeLevel;
    }

    // Cycles full -> half -> silent -> full; returns the new level
    toggleMute() {
        this.volumeLevel = this.volumeLevel === 1 ? 0.5 : (this.volumeLevel === 0.5 ? 0 : 1);
        try {
            localStorage.setItem(VOLUME_KEY, String(this.volumeLevel));
            localStorage.removeItem(MUTE_KEY);
        } catch (e) { /* ignore */ }
        // Land any in-flight fades on the right value
        this.fadeTimers.forEach(id => clearInterval(id));
        this.fadeTimers.clear();
        this.applyVolumes();
        return this.volumeLevel;
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
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(e => console.warn('Error resuming AudioContext:', e));
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

    // Step a track's volume between two levels; used for crossfades
    fadeAudio(track, from, to, ms, done) {
        const prev = this.fadeTimers.get(track);
        if (prev) clearInterval(prev);
        const steps = Math.max(1, Math.round(ms / 50));
        let i = 0;
        track.volume = Math.max(0, Math.min(1, from));
        const id = setInterval(() => {
            i++;
            track.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps)));
            if (i >= steps) {
                clearInterval(id);
                this.fadeTimers.delete(track);
                if (done) done();
            }
        }, 50);
        this.fadeTimers.set(track, id);
    }

    playMusic(musicName, loop = true) {
        if (!this.audioInitialized) this.initializeAudio();
        const next = this.music[musicName];
        if (!next) {
            console.warn(`Music not found: ${musicName}`);
            return;
        }
        if (this.currentMusic === musicName && !next.paused) return;
        // Crossfade: old track eases out while the new one eases in
        if (this.currentMusic && this.music[this.currentMusic] && this.currentMusic !== musicName) {
            const old = this.music[this.currentMusic];
            this.fadeAudio(old, old.volume, 0, 450, () => {
                old.pause();
                old.currentTime = 0;
            });
        }
        next.loop = loop;
        next.currentTime = 0;
        next.volume = 0;
        next.play().then(() => {
            this.fadeAudio(next, 0, this.effectiveMusicVolume, 700);
        }).catch(e => {
            if (e.name === 'NotAllowedError') {
                this.pendingMusic = { name: musicName, loop };
            } else {
                console.warn(`Error playing music ${musicName}:`, e);
            }
        });
        this.currentMusic = musicName;
    }

    stopMusic(specificMusicName = null) {
        this.pendingMusic = null;
        const stopTrack = (track) => {
            this.fadeAudio(track, track.volume, 0, 350, () => {
                track.pause();
                track.currentTime = 0;
            });
        };
        if (specificMusicName && this.music[specificMusicName]) {
            stopTrack(this.music[specificMusicName]);
            if (this.currentMusic === specificMusicName) this.currentMusic = null;
        } else if (this.currentMusic && this.music[this.currentMusic]) {
            stopTrack(this.music[this.currentMusic]);
            this.currentMusic = null;
        }
    }

    pauseCurrentMusic() {
        if (this.currentMusic && this.music[this.currentMusic]) this.music[this.currentMusic].pause();
    }

    resumeCurrentMusic() {
        if (this.currentMusic && this.music[this.currentMusic]) {
            const track = this.music[this.currentMusic];
            if (!this.fadeTimers.has(track)) track.volume = this.effectiveMusicVolume;
            track.play().catch(e => {
                console.warn(`Error resuming music ${this.currentMusic}:`, e);
                if (e.name === 'NotAllowedError' && this.isMobile) {
                    document.body.addEventListener('touchstart', () => track.play().catch(() => {}), { once: true });
                }
            });
        }
    }

    // ---------- WebAudio synth: rattle, crickets, wind, chime ----------

    ensureSynth() {
        if (this.synth) return this.synth;
        try {
            const AC = (typeof window !== 'undefined') && (window.AudioContext || window.webkitAudioContext);
            if (!AC) return null;
            const ctx = this.audioContext || new AC();
            this.audioContext = ctx;
            if (ctx.state === 'suspended') ctx.resume().catch(() => {});
            const master = ctx.createGain();
            master.gain.value = this.muted ? 0 : 0.5;
            master.connect(ctx.destination);
            this.synth = { ctx, master, rattle: null, cricketTimer: null, wind: null };
        } catch (e) {
            this.synth = null;
        }
        return this.synth;
    }

    makeNoiseSource(ctx) {
        const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        return src;
    }

    // Rattlesnake warning buzz: band-passed noise gated ~19x a second.
    // Reference-counted: several snakes can hold the warning at once.
    startRattle() {
        this.rattleUsers++;
        const s = this.ensureSynth();
        if (!s || s.rattle) return;
        const ctx = s.ctx;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        const src = this.makeNoiseSource(ctx);
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 4500;
        bp.Q.value = 0.8;
        const gate = ctx.createGain();
        gate.gain.value = 0.11;
        const lfo = ctx.createOscillator();
        lfo.type = 'square';
        lfo.frequency.value = 19;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.1;
        lfo.connect(lfoGain);
        lfoGain.connect(gate.gain);
        src.connect(bp); bp.connect(gate); gate.connect(s.master);
        src.start(); lfo.start();
        s.rattle = { src, lfo };
    }

    stopRattle() {
        this.rattleUsers = Math.max(0, this.rattleUsers - 1);
        if (this.rattleUsers > 0) return;
        const s = this.synth;
        if (s && s.rattle) {
            try { s.rattle.src.stop(); s.rattle.lfo.stop(); } catch (e) { /* ignore */ }
            s.rattle = null;
        }
    }

    resetRattles() {
        this.rattleUsers = 1;
        this.stopRattle();
    }

    // Night crickets: short sine chirps on a loose timer
    setNightAmbience(on) {
        if (on === this.cricketsOn) return;
        this.cricketsOn = on;
        const s = this.ensureSynth();
        if (!s) return;
        if (on) {
            if (s.cricketTimer) return;
            s.cricketTimer = setInterval(() => {
                if (this.muted || s.ctx.state === 'suspended') return;
                const ctx = s.ctx;
                const t0 = ctx.currentTime + 0.02 + Math.random() * 0.2;
                const freq = 4100 + Math.random() * 250;
                for (let p = 0; p < 3; p++) {
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    const g = ctx.createGain();
                    const t = t0 + p * 0.07;
                    g.gain.setValueAtTime(0, t);
                    g.gain.linearRampToValueAtTime(0.028, t + 0.012);
                    g.gain.linearRampToValueAtTime(0, t + 0.05);
                    osc.connect(g); g.connect(s.master);
                    osc.start(t); osc.stop(t + 0.08);
                }
            }, 640);
        } else if (s.cricketTimer) {
            clearInterval(s.cricketTimer);
            s.cricketTimer = null;
        }
    }

    // Haboob wind: low-passed noise, eased in and out
    setWind(on) {
        if (on === this.windOn) return;
        this.windOn = on;
        const s = this.ensureSynth();
        if (!s) return;
        const ctx = s.ctx;
        if (on) {
            if (s.wind) return;
            const src = this.makeNoiseSource(ctx);
            const lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = 420;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.0001, ctx.currentTime);
            g.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 1.4);
            src.connect(lp); lp.connect(g); g.connect(s.master);
            src.start();
            s.wind = { src, g };
        } else if (s.wind) {
            const w = s.wind;
            s.wind = null;
            try {
                w.g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
                setTimeout(() => { try { w.src.stop(); } catch (e) { /* ignore */ } }, 1400);
            } catch (e) { /* ignore */ }
        }
    }

    // Soft two-note chime for an alignment reading
    playChime() {
        const s = this.ensureSynth();
        if (!s || this.muted) return;
        const ctx = s.ctx;
        if (ctx.state === 'suspended') return;
        const t = ctx.currentTime + 0.01;
        [659.25, 880].forEach((f, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = f;
            const g = ctx.createGain();
            const st = t + i * 0.18;
            g.gain.setValueAtTime(0.0001, st);
            g.gain.exponentialRampToValueAtTime(0.12, st + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, st + 0.9);
            osc.connect(g); g.connect(s.master);
            osc.start(st); osc.stop(st + 1);
        });
    }

    // Silence all synth layers (menu, pause, game over); they re-assert during play
    stopAmbience() {
        this.setNightAmbience(false);
        this.setWind(false);
        this.resetRattles();
    }
}
