// ============================================================
// THE DEEP ONES - ASSET MANAGEMENT
// ============================================================

// Y-positions adjusted for 480x270 pixel art resolution
// waterLine is at ~116px (270 * 0.43)
// Sky: 0-60px, Mountains: peaks at 30-100px, Trees: 60-116px
// Water: 116px, Underwater: 116-270px
const PARALLAX_LAYERS = {
    sky: {
        dawn: [
            { id: 'sky-gradient', y: 0, scrollSpeed: 0, src: 'backgrounds/dawn/sky.png' },
            { id: 'stars', y: 0, scrollSpeed: 0.02, src: 'backgrounds/dawn/stars.png' },
            { id: 'sun', y: 30, scrollSpeed: 0.05, src: 'backgrounds/dawn/sun.png' },
        ],
        day: [
            { id: 'sky-gradient', y: 0, scrollSpeed: 0, src: 'backgrounds/day/sky.png' },
            { id: 'clouds-far', y: 15, scrollSpeed: 0.1, repeatX: true, src: 'backgrounds/day/clouds-far-day.png' },
            { id: 'clouds-near', y: 30, scrollSpeed: 0.2, repeatX: true, src: 'backgrounds/day/clouds-near-day.png' },
            { id: 'sun', y: 25, scrollSpeed: 0.05, src: 'backgrounds/day/sun-day.png' },
        ],
        dusk: [
            { id: 'sky-gradient', y: 0, scrollSpeed: 0, src: 'backgrounds/dusk/sky.png' },
            { id: 'stars', y: 0, scrollSpeed: 0.02, src: 'backgrounds/dusk/stars.png' },
            { id: 'clouds', y: 25, scrollSpeed: 0.15, repeatX: true, src: 'backgrounds/dusk/clouds.png' },
            { id: 'sun', y: 70, scrollSpeed: 0.05, src: 'backgrounds/dusk/sun.png' },
            { id: 'moon', y: 35, scrollSpeed: 0.03, src: 'backgrounds/dusk/moon.png' },
        ],
        night: [
            { id: 'sky-gradient', y: 0, scrollSpeed: 0, src: 'backgrounds/night/sky.png' },
            { id: 'stars', y: 0, scrollSpeed: 0.02, src: 'backgrounds/night/stars.png' },
            { id: 'moon', y: 25, scrollSpeed: 0.03, src: 'backgrounds/night/moon.png' },
            { id: 'clouds', y: 35, scrollSpeed: 0.1, repeatX: true, src: 'backgrounds/night/clouds.png' },
        ]
    },
    land: {
        all: [
            // Mountains: y + fallback_offset should be < waterLine (116) for peaks above water
            // mountains-far fallback adds ~40 + sin*30 = 10-70, so y=30 → peaks at 40-100
            { id: 'mountains-far', y: 30, scrollSpeed: 0.1, repeatX: true, src: 'backgrounds/land/mountains-far.png' },
            // mountains-mid fallback adds ~30 + sin*25 = 5-55, so y=45 → peaks at 50-100
            { id: 'mountains-mid', y: 45, scrollSpeed: 0.2, repeatX: true, src: 'backgrounds/land/mountains-mid.png' },
            // mountains-near fallback adds ~25 + sin*20 = 5-45, so y=55 → peaks at 60-100
            { id: 'mountains-near', y: 55, scrollSpeed: 0.3, repeatX: true, src: 'backgrounds/land/mountains-near.png' },
            // trees-far: y+50 is tree base, heights 40-60, so y=60 → base at 110, tops at 50-70
            { id: 'trees-far', y: 60, scrollSpeed: 0.35, repeatX: true, src: 'backgrounds/land/trees-far.png' },
            // trees-near: y+40 is tree base, heights 55-80, so y=70 → base at 110, tops at 30-55
            { id: 'trees-near', y: 70, scrollSpeed: 0.45, repeatX: true, src: 'backgrounds/land/trees-near.png' },
            // lighthouse at horizon
            { id: 'lighthouse', y: 50, scrollSpeed: 0.4, src: 'backgrounds/land/lighthouse.png' },
            // reeds just above waterline
            { id: 'reeds-left', y: 100, scrollSpeed: 0.5, src: 'backgrounds/land/reeds.png' },
        ]
    },
    water: {
        all: [
            // Water at waterLine (~116)
            { id: 'water-surface', y: 116, scrollSpeed: 0.6, repeatX: true, animated: true, frames: 4, fps: 8, src: 'backgrounds/water/surface.png' },
            { id: 'water-reflection', y: 118, scrollSpeed: 0.5, repeatX: true, src: 'backgrounds/water/reflection.png' },
        ]
    },
    underwater: {
        all: [
            // Underwater starts at waterLine and goes to bottom (270)
            { id: 'underwater-bg', y: 116, scrollSpeed: 0, src: 'backgrounds/underwater/gradient.png' },
            { id: 'light-rays', y: 116, scrollSpeed: 0.1, src: 'backgrounds/underwater/lightrays.png' },
            { id: 'rocks-far', y: 200, scrollSpeed: 0.15, repeatX: true, src: 'backgrounds/underwater/rocks-far.png' },
            { id: 'seaweed-far', y: 160, scrollSpeed: 0.2, repeatX: true, animated: true, frames: 6, fps: 4, src: 'backgrounds/underwater/seaweed-far.png' },
            { id: 'rocks-mid', y: 220, scrollSpeed: 0.3, repeatX: true, src: 'backgrounds/underwater/rocks-mid.png' },
            { id: 'seaweed-near', y: 180, scrollSpeed: 0.4, repeatX: true, animated: true, frames: 6, fps: 4, src: 'backgrounds/underwater/seaweed-near.png' },
            { id: 'particles', y: 125, scrollSpeed: 0.25, repeatX: true, animated: true, frames: 8, fps: 10, src: 'backgrounds/underwater/particles.png' },
            { id: 'deep-shadows', y: 240, scrollSpeed: 0.1, repeatX: true, src: 'backgrounds/underwater/shadows.png' },
        ]
    }
};

const SPRITES = {
    boat: { src: 'sprites/boat/boat.png', width: 90, height: 50, anchor: { x: 45, y: 25 } },
    fisher: { src: 'sprites/boat/fisher.png', width: 32, height: 48, anchor: { x: 16, y: 48 } },
    dog: { src: 'sprites/boat/dog.png', width: 24, height: 20, animated: true, frames: 4, fps: 6, anchor: { x: 12, y: 20 } },
    lantern: { src: 'sprites/boat/lantern.png', width: 16, height: 24, animated: true, frames: 4, fps: 8, anchor: { x: 8, y: 24 } },
    rod: { src: 'sprites/boat/rod.png', width: 64, height: 64, anchor: { x: 0, y: 64 } },
    bobber: { src: 'sprites/boat/bobber.png', width: 12, height: 16, anchor: { x: 6, y: 8 } },
    fish: {
        'Harbor Cod': { src: 'sprites/fish/surface/harbor-cod.png', width: 32, height: 16, frames: 4, fps: 6 },
        'Pale Flounder': { src: 'sprites/fish/surface/pale-flounder.png', width: 36, height: 20, frames: 4, fps: 5 },
        'Whisper Eel': { src: 'sprites/fish/surface/whisper-eel.png', width: 48, height: 12, frames: 6, fps: 8 },
        'Midnight Perch': { src: 'sprites/fish/surface/midnight-perch.png', width: 28, height: 18, frames: 4, fps: 6 },
        'Glass Squid': { src: 'sprites/fish/mid/glass-squid.png', width: 40, height: 32, frames: 6, fps: 7 },
        'Bone Angler': { src: 'sprites/fish/mid/bone-angler.png', width: 44, height: 28, frames: 4, fps: 5 },
        'The Mimic': { src: 'sprites/fish/mid/mimic.png', width: 48, height: 24, frames: 4, fps: 4 },
        'Prophet Fish': { src: 'sprites/fish/mid/prophet-fish.png', width: 36, height: 24, frames: 6, fps: 6 },
        'Congregation Fish': { src: 'sprites/fish/deep/congregation.png', width: 56, height: 32, frames: 4, fps: 3 },
        'The Listener': { src: 'sprites/fish/deep/listener.png', width: 52, height: 28, frames: 4, fps: 4 },
        "Drowned Sailor's Friend": { src: 'sprites/fish/deep/drowned-friend.png', width: 48, height: 36, frames: 4, fps: 5 },
        'Memory Leech': { src: 'sprites/fish/deep/memory-leech.png', width: 40, height: 20, frames: 6, fps: 8 },
        "Dagon's Fingerling": { src: 'sprites/fish/abyss/dagon-fingerling.png', width: 64, height: 40, frames: 4, fps: 4 },
        'The Dreaming One': { src: 'sprites/fish/abyss/dreaming-one.png', width: 72, height: 48, frames: 4, fps: 2 },
        "Mother Hydra's Tear": { src: 'sprites/fish/abyss/hydra-tear.png', width: 80, height: 56, frames: 6, fps: 3 },
        'The Unnamed': { src: 'sprites/fish/abyss/unnamed.png', width: 96, height: 64, frames: 4, fps: 2 },
    },
    ui: {
        catchPopup: { src: 'sprites/ui/catch-popup.png', width: 350, height: 160 },
        journal: { src: 'sprites/ui/journal-bg.png', width: 300, height: 400 },
    }
};

const loadedAssets = {
    images: {},
    status: {}
};

async function loadImage(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load: ${path}`));
        img.src = CONFIG.assetPath + path;
    });
}

async function loadAllAssets() {
    const toLoad = [];

    Object.values(PARALLAX_LAYERS).forEach(category => {
        Object.values(category).forEach(layers => {
            layers.forEach(layer => {
                if (layer.src) toLoad.push({ id: layer.id, src: layer.src });
            });
        });
    });

    Object.entries(SPRITES).forEach(([key, sprite]) => {
        if (sprite.src) {
            toLoad.push({ id: `sprite-${key}`, src: sprite.src });
        } else if (typeof sprite === 'object') {
            Object.entries(sprite).forEach(([subKey, subSprite]) => {
                if (subSprite.src) {
                    toLoad.push({ id: `sprite-${key}-${subKey}`, src: subSprite.src });
                }
            });
        }
    });

    for (const asset of toLoad) {
        loadedAssets.status[asset.id] = 'loading';
        try {
            loadedAssets.images[asset.id] = await loadImage(asset.src);
            loadedAssets.status[asset.id] = 'loaded';
        } catch (e) {
            loadedAssets.status[asset.id] = 'failed';
            console.log(`Using fallback for: ${asset.id}`);
        }
    }

    updateDebugPanel();
}

function updateDebugPanel() {
    if (!CONFIG.showDebug) {
        document.getElementById('debug').style.display = 'none';
        return;
    }

    const statusEl = document.getElementById('asset-status');
    let html = '';

    let loaded = 0, failed = 0;
    Object.entries(loadedAssets.status).forEach(([id, status]) => {
        if (status === 'loaded') loaded++;
        else if (status === 'failed') failed++;
    });

    html += `<div class="loaded">Loaded: ${loaded}</div>`;
    html += `<div class="fallback">Fallback: ${failed}</div>`;
    html += `<br><small>Press [D] to toggle</small>`;
    html += `<br><small>Using: ${CONFIG.useSprites ? 'SPRITES' : 'PROCEDURAL'}</small>`;

    statusEl.innerHTML = html;
}

// Parallax Layer Class
class ParallaxLayer {
    constructor(config) {
        this.id = config.id;
        this.y = config.y || 0;
        this.scrollSpeed = config.scrollSpeed || 0;
        this.repeatX = config.repeatX || false;
        this.src = config.src;
        this.animated = config.animated || false;
        this.frames = config.frames || 1;
        this.fps = config.fps || 10;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.offset = 0;
    }

    update(deltaTime, cameraX) {
        if (this.animated) {
            this.frameTimer += deltaTime;
            if (this.frameTimer >= 1000 / this.fps) {
                this.currentFrame = (this.currentFrame + 1) % this.frames;
                this.frameTimer = 0;
            }
        }
        this.offset = cameraX * this.scrollSpeed;
    }

    draw(ctx, canvasWidth, canvasHeight, fallbackFn) {
        const img = loadedAssets.images[this.id];

        if (img && CONFIG.useSprites) {
            if (this.animated) {
                const frameWidth = img.width / this.frames;
                const sx = this.currentFrame * frameWidth;
                if (this.repeatX) {
                    this.drawRepeating(ctx, img, canvasWidth, sx, frameWidth);
                } else {
                    ctx.drawImage(img, sx, 0, frameWidth, img.height, -this.offset, this.y, frameWidth, img.height);
                }
            } else {
                if (this.repeatX) {
                    this.drawRepeating(ctx, img, canvasWidth);
                } else {
                    ctx.drawImage(img, -this.offset, this.y);
                }
            }
        } else if (fallbackFn) {
            fallbackFn(ctx, this.offset, this.y, canvasWidth, canvasHeight, this);
        }
    }

    drawRepeating(ctx, img, canvasWidth, sx = 0, frameWidth = null) {
        const w = frameWidth || img.width;
        const h = img.height;
        const startX = -(this.offset % w) - w;

        for (let x = startX; x < canvasWidth + w; x += w) {
            if (frameWidth) {
                ctx.drawImage(img, sx, 0, frameWidth, h, x, this.y, frameWidth, h);
            } else {
                ctx.drawImage(img, x, this.y);
            }
        }
    }
}

function initLayers() {
    game.layers = [];

    const skyLayers = PARALLAX_LAYERS.sky[game.timeOfDay] || [];
    skyLayers.forEach(config => {
        game.layers.push(new ParallaxLayer(config));
    });

    PARALLAX_LAYERS.land.all.forEach(config => {
        game.layers.push(new ParallaxLayer(config));
    });

    PARALLAX_LAYERS.water.all.forEach(config => {
        game.layers.push(new ParallaxLayer(config));
    });

    PARALLAX_LAYERS.underwater.all.forEach(config => {
        game.layers.push(new ParallaxLayer(config));
    });
}
