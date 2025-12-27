// ============================================================
// THE DEEP ONES - AUDIO SYSTEM
// ============================================================

// Audio Manager using Web Audio API for dynamic sound mixing
const AudioManager = {
    context: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    ambientGain: null,

    // Settings
    settings: {
        masterVolume: 0.7,
        musicVolume: 0.5,
        sfxVolume: 0.8,
        ambientVolume: 0.6,
        muted: false
    },

    // Currently playing sounds
    activeSounds: [],
    activeAmbient: [],
    currentMusic: null,

    // Sound definitions
    sounds: {
        // Fishing sounds
        splash: { frequency: 200, duration: 0.3, type: 'noise', filter: 'lowpass' },
        cast: { frequency: 400, duration: 0.15, type: 'sine', slide: -200 },
        bite: { frequency: 600, duration: 0.2, type: 'square', slide: 100 },
        reel: { frequency: 300, duration: 0.1, type: 'sawtooth', slide: 50 },
        catch: { frequency: 500, duration: 0.4, type: 'sine', slide: 200 },
        catchRare: { frequency: 700, duration: 0.6, type: 'sine', slide: 300, harmonics: true },
        linesnap: { frequency: 150, duration: 0.25, type: 'noise', filter: 'highpass' },

        // Boat sounds
        creak: { frequency: 80, duration: 0.4, type: 'sawtooth', slide: -20 },
        paddle: { frequency: 150, duration: 0.2, type: 'noise', filter: 'lowpass' },

        // Weather sounds
        thunder: { frequency: 60, duration: 1.5, type: 'noise', filter: 'lowpass', attack: 0.01, decay: 1.4 },
        rain: { frequency: 8000, duration: 0.05, type: 'noise', filter: 'highpass', loop: true },
        wind: { frequency: 200, duration: 2, type: 'noise', filter: 'bandpass', loop: true },
        wave: { frequency: 100, duration: 1.5, type: 'noise', filter: 'lowpass' },

        // UI sounds
        menuOpen: { frequency: 400, duration: 0.1, type: 'sine', slide: 100 },
        menuClose: { frequency: 400, duration: 0.1, type: 'sine', slide: -100 },
        menuSelect: { frequency: 500, duration: 0.08, type: 'square' },
        purchase: { frequency: 800, duration: 0.15, type: 'sine', slide: 200 },
        error: { frequency: 200, duration: 0.2, type: 'square', slide: -50 },

        // Achievement/notification
        achievement: { frequency: 600, duration: 0.5, type: 'sine', harmonics: true, slide: 200 },
        loreFound: { frequency: 400, duration: 0.8, type: 'sine', slide: 100, reverb: true },
        save: { frequency: 500, duration: 0.15, type: 'sine' },

        // Dog sounds
        bark: { frequency: 400, duration: 0.15, type: 'square', slide: 100 },
        whimper: { frequency: 300, duration: 0.3, type: 'sine', slide: -100 },
        happyBark: { frequency: 500, duration: 0.12, type: 'square', slide: 150 },

        // Horror/atmosphere
        whisper: { frequency: 200, duration: 2, type: 'noise', filter: 'bandpass', volume: 0.2 },
        heartbeat: { frequency: 60, duration: 0.3, type: 'sine' },
        deepRumble: { frequency: 40, duration: 3, type: 'sine', volume: 0.3 }
    },

    // Initialize audio context
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();

            // Create gain nodes for mixing
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);

            this.musicGain = this.context.createGain();
            this.musicGain.connect(this.masterGain);

            this.sfxGain = this.context.createGain();
            this.sfxGain.connect(this.masterGain);

            this.ambientGain = this.context.createGain();
            this.ambientGain.connect(this.masterGain);

            this.updateVolumes();

            console.log('Audio system initialized');
            return true;
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            return false;
        }
    },

    // Resume audio context (required after user interaction)
    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    },

    // Update volume levels
    updateVolumes() {
        if (!this.context) return;

        const master = this.settings.muted ? 0 : this.settings.masterVolume;
        this.masterGain.gain.setValueAtTime(master, this.context.currentTime);
        this.musicGain.gain.setValueAtTime(this.settings.musicVolume, this.context.currentTime);
        this.sfxGain.gain.setValueAtTime(this.settings.sfxVolume, this.context.currentTime);
        this.ambientGain.gain.setValueAtTime(this.settings.ambientVolume, this.context.currentTime);
    },

    // Toggle mute
    toggleMute() {
        this.settings.muted = !this.settings.muted;
        this.updateVolumes();
        return this.settings.muted;
    },

    // Create a noise buffer for noise-based sounds
    createNoiseBuffer(duration = 1) {
        const sampleRate = this.context.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = this.context.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        return buffer;
    },

    // Play a synthesized sound effect
    playSFX(soundName, options = {}) {
        if (!this.context) return;
        this.resume();

        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn('Unknown sound:', soundName);
            return;
        }

        const now = this.context.currentTime;
        const duration = options.duration || sound.duration;
        const frequency = options.frequency || sound.frequency;
        const volume = (options.volume || sound.volume || 1) * 0.5;

        let source;
        let gainNode = this.context.createGain();

        if (sound.type === 'noise') {
            // Noise-based sound
            source = this.context.createBufferSource();
            source.buffer = this.createNoiseBuffer(duration);

            // Apply filter
            if (sound.filter) {
                const filter = this.context.createBiquadFilter();
                filter.type = sound.filter;
                filter.frequency.value = frequency;
                filter.Q.value = 1;
                source.connect(filter);
                filter.connect(gainNode);
            } else {
                source.connect(gainNode);
            }
        } else {
            // Oscillator-based sound
            source = this.context.createOscillator();
            source.type = sound.type;
            source.frequency.setValueAtTime(frequency, now);

            // Frequency slide
            if (sound.slide) {
                source.frequency.linearRampToValueAtTime(
                    frequency + sound.slide,
                    now + duration
                );
            }

            source.connect(gainNode);

            // Add harmonics for richer sound
            if (sound.harmonics) {
                const harmonic = this.context.createOscillator();
                harmonic.type = sound.type;
                harmonic.frequency.setValueAtTime(frequency * 1.5, now);
                if (sound.slide) {
                    harmonic.frequency.linearRampToValueAtTime(
                        (frequency + sound.slide) * 1.5,
                        now + duration
                    );
                }
                const harmonicGain = this.context.createGain();
                harmonicGain.gain.setValueAtTime(volume * 0.3, now);
                harmonic.connect(harmonicGain);
                harmonicGain.connect(this.sfxGain);
                harmonic.start(now);
                harmonic.stop(now + duration);
            }
        }

        // Envelope
        const attack = sound.attack || 0.01;
        const decay = sound.decay || duration - attack;

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + attack);
        gainNode.gain.linearRampToValueAtTime(0, now + attack + decay);

        gainNode.connect(this.sfxGain);

        if (source.start) {
            source.start(now);
            if (!sound.loop) {
                source.stop(now + duration);
            }
        }

        return source;
    },

    // Play ambient sound (looping)
    playAmbient(type) {
        if (!this.context) return;
        this.resume();

        // Stop existing ambient of same type
        this.stopAmbient(type);

        const sound = this.sounds[type];
        if (!sound || !sound.loop) return;

        const source = this.context.createBufferSource();
        source.buffer = this.createNoiseBuffer(2);
        source.loop = true;

        const filter = this.context.createBiquadFilter();
        filter.type = sound.filter || 'lowpass';
        filter.frequency.value = sound.frequency;

        const gainNode = this.context.createGain();
        gainNode.gain.setValueAtTime(sound.volume || 0.3, this.context.currentTime);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ambientGain);

        source.start();

        this.activeAmbient.push({ type, source, gainNode });

        return source;
    },

    // Stop ambient sound
    stopAmbient(type) {
        const index = this.activeAmbient.findIndex(a => a.type === type);
        if (index !== -1) {
            const ambient = this.activeAmbient[index];
            ambient.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5);
            setTimeout(() => {
                try { ambient.source.stop(); } catch(e) {}
            }, 600);
            this.activeAmbient.splice(index, 1);
        }
    },

    // Stop all ambient sounds
    stopAllAmbient() {
        this.activeAmbient.forEach(ambient => {
            try { ambient.source.stop(); } catch(e) {}
        });
        this.activeAmbient = [];
    },

    // Play procedural music based on game state
    playMusic(mood = 'calm') {
        if (!this.context) return;
        this.resume();

        // Simple procedural music using oscillators
        const moods = {
            calm: { baseFreq: 220, intervals: [0, 4, 7, 12], tempo: 2000 },
            tense: { baseFreq: 185, intervals: [0, 3, 6, 10], tempo: 1500 },
            horror: { baseFreq: 110, intervals: [0, 1, 6, 7], tempo: 3000 },
            peaceful: { baseFreq: 262, intervals: [0, 4, 7, 11], tempo: 2500 }
        };

        const config = moods[mood] || moods.calm;

        // Stop current music
        this.stopMusic();

        // Create a simple pad sound
        const playNote = () => {
            if (!this.currentMusic) return;

            const noteIndex = Math.floor(Math.random() * config.intervals.length);
            const semitones = config.intervals[noteIndex];
            const freq = config.baseFreq * Math.pow(2, semitones / 12);

            const osc = this.context.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.context.currentTime);

            const gain = this.context.createGain();
            gain.gain.setValueAtTime(0, this.context.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.5);
            gain.gain.linearRampToValueAtTime(0, this.context.currentTime + config.tempo / 1000);

            osc.connect(gain);
            gain.connect(this.musicGain);

            osc.start();
            osc.stop(this.context.currentTime + config.tempo / 1000);
        };

        this.currentMusic = {
            mood,
            interval: setInterval(playNote, config.tempo / 2)
        };

        playNote(); // Play first note immediately
    },

    // Stop music
    stopMusic() {
        if (this.currentMusic) {
            clearInterval(this.currentMusic.interval);
            this.currentMusic = null;
        }
    },

    // Update ambient sounds based on game state
    updateAmbient(gameState) {
        if (!this.context) return;

        // Weather-based ambient
        if (gameState.weather.current === 'rain' || gameState.weather.current === 'storm') {
            if (!this.activeAmbient.find(a => a.type === 'rain')) {
                this.playAmbient('rain');
            }
        } else {
            this.stopAmbient('rain');
        }

        if (gameState.weather.current === 'storm') {
            if (!this.activeAmbient.find(a => a.type === 'wind')) {
                this.playAmbient('wind');
            }
        } else {
            this.stopAmbient('wind');
        }

        // Horror ambient at low sanity
        if (gameState.sanity < 30) {
            if (!this.activeAmbient.find(a => a.type === 'whisper')) {
                this.playAmbient('whisper');
            }
        } else {
            this.stopAmbient('whisper');
        }
    },

    // Update music based on game state
    updateMusic(gameState) {
        if (!this.context) return;

        let targetMood = 'calm';

        if (gameState.sanity < 20) {
            targetMood = 'horror';
        } else if (gameState.sanity < 50 || gameState.currentLocation === 'void' || gameState.currentLocation === 'trench') {
            targetMood = 'tense';
        } else if (gameState.timeOfDay === 'dawn' || gameState.timeOfDay === 'day') {
            targetMood = 'peaceful';
        }

        if (!this.currentMusic || this.currentMusic.mood !== targetMood) {
            this.playMusic(targetMood);
        }
    }
};

// Convenience functions for triggering sounds
function playSound(name, options) {
    AudioManager.playSFX(name, options);
}

function playSplash() { AudioManager.playSFX('splash'); }
function playCast() { AudioManager.playSFX('cast'); }
function playBite() { AudioManager.playSFX('bite'); }
function playReel() { AudioManager.playSFX('reel'); }
function playCatch(isRare) { AudioManager.playSFX(isRare ? 'catchRare' : 'catch'); }
function playLineSnap() { AudioManager.playSFX('linesnap'); }
function playCreak() { AudioManager.playSFX('creak'); }
function playThunder() { AudioManager.playSFX('thunder'); }
function playWave() { AudioManager.playSFX('wave'); }
function playMenuOpen() { AudioManager.playSFX('menuOpen'); }
function playMenuClose() { AudioManager.playSFX('menuClose'); }
function playMenuSelect() { AudioManager.playSFX('menuSelect'); }
function playPurchase() { AudioManager.playSFX('purchase'); }
function playError() { AudioManager.playSFX('error'); }
function playAchievement() { AudioManager.playSFX('achievement'); }
function playLoreFound() { AudioManager.playSFX('loreFound'); }
function playSaveSound() { AudioManager.playSFX('save'); }
function playBark() { AudioManager.playSFX('bark'); }
function playWhimper() { AudioManager.playSFX('whimper'); }
function playHappyBark() { AudioManager.playSFX('happyBark'); }
function playHeartbeat() { AudioManager.playSFX('heartbeat'); }
function playDeepRumble() { AudioManager.playSFX('deepRumble'); }
