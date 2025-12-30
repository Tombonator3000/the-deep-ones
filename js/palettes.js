// ============================================================
// THE DEEP ONES - TIME PALETTES
// ============================================================

const TIME_PALETTES = {
    dawn: {
        sky: ['#2a2040', '#4a3a60', '#8a6080', '#d4a090', '#f0d0a0'],
        skyStops: [0, 0.3, 0.5, 0.7, 1],
        clouds: 'rgba(200, 160, 140, 0.4)',
        mountains: ['#1a1525', '#2a2035', '#3a3045'],
        trees: ['#1a2520', '#253530'],
        water: ['#3a5060', '#2a4050', '#1a3040', '#0a2030'],
        waterHighlight: 'rgba(240, 200, 160, 0.15)',
        underwater: ['#2a4555', '#1a3545', '#0a2535', '#051525'],
        sun: { x: 850, y: 120, color: '#f0c080', glow: 'rgba(240, 180, 100, 0.4)' },
        moon: null,
        // Ambient lighting
        ambientLight: 'rgba(200, 180, 170, 0.2)',
        highlightColor: 'rgba(240, 200, 160, 0.3)',
        shadowColor: 'rgba(20, 15, 30, 0.4)',
        fogColor: 'rgba(200, 180, 170, 0.25)'
    },
    day: {
        sky: ['#4060a0', '#6090c0', '#90c0e0', '#b0e0f0', '#d0f0ff'],
        skyStops: [0, 0.3, 0.5, 0.7, 1],
        clouds: 'rgba(255, 255, 255, 0.6)',
        mountains: ['#3a5060', '#4a6070', '#5a7080'],
        trees: ['#2a4a30', '#3a5a40'],
        water: ['#4080a0', '#3070a0', '#2060a0', '#1050a0'],
        waterHighlight: 'rgba(255, 255, 255, 0.2)',
        underwater: ['#306080', '#205070', '#104060', '#003050'],
        sun: { x: 500, y: 80, color: '#ffffa0', glow: 'rgba(255, 255, 200, 0.3)' },
        moon: null,
        // Ambient lighting
        ambientLight: 'rgba(255, 255, 255, 0.15)',
        highlightColor: 'rgba(255, 255, 230, 0.4)',
        shadowColor: 'rgba(30, 50, 70, 0.3)',
        fogColor: null // No fog during day
    },
    dusk: {
        sky: ['#1a1530', '#3a2545', '#6a4060', '#b06070', '#e0a070', '#f0c080'],
        skyStops: [0, 0.2, 0.4, 0.6, 0.8, 1],
        clouds: 'rgba(180, 100, 80, 0.5)',
        mountains: ['#1a1020', '#2a1530', '#3a2040'],
        trees: ['#151a20', '#1a2025'],
        water: ['#4a5070', '#3a4060', '#2a3050', '#1a2040'],
        waterHighlight: 'rgba(240, 160, 100, 0.2)',
        underwater: ['#3a4560', '#2a3550', '#1a2540', '#0a1530'],
        sun: { x: 900, y: 220, color: '#f08050', glow: 'rgba(240, 100, 50, 0.5)' },
        moon: { x: 150, y: 100 },
        // Ambient lighting
        ambientLight: 'rgba(180, 120, 100, 0.2)',
        highlightColor: 'rgba(240, 160, 100, 0.35)',
        shadowColor: 'rgba(15, 10, 25, 0.5)',
        fogColor: null
    },
    night: {
        sky: ['#0a0a15', '#101020', '#151530', '#1a1a40'],
        skyStops: [0, 0.3, 0.6, 1],
        clouds: 'rgba(40, 40, 60, 0.4)',
        mountains: ['#0a0a12', '#0f0f18', '#141420'],
        trees: ['#080a10', '#0a0c12'],
        water: ['#152535', '#102030', '#0a1525', '#05101a'],
        waterHighlight: 'rgba(100, 120, 150, 0.1)',
        underwater: ['#102030', '#0a1525', '#05101a', '#020a10'],
        sun: null,
        moon: { x: 750, y: 80 },
        // Ambient lighting
        ambientLight: 'rgba(80, 100, 130, 0.15)',
        highlightColor: 'rgba(150, 180, 200, 0.2)',
        shadowColor: 'rgba(5, 5, 15, 0.6)',
        fogColor: 'rgba(60, 70, 90, 0.2)'
    }
};

function getTimePalette() {
    return TIME_PALETTES[game.timeOfDay];
}

// ============================================================
// GRADIENT BLENDING BETWEEN TIMES OF DAY
// ============================================================

// Time progression order
const TIME_ORDER = ['dawn', 'day', 'dusk', 'night'];

// Get next time of day in cycle
function getNextTimeOfDay(current) {
    const index = TIME_ORDER.indexOf(current);
    return TIME_ORDER[(index + 1) % TIME_ORDER.length];
}

// Get previous time of day in cycle
function getPreviousTimeOfDay(current) {
    const index = TIME_ORDER.indexOf(current);
    return TIME_ORDER[(index - 1 + TIME_ORDER.length) % TIME_ORDER.length];
}

// Lerp between two hex colors
function lerpColor(color1, color2, t) {
    // Handle rgba colors
    if (color1.startsWith('rgba') && color2.startsWith('rgba')) {
        const rgba1 = color1.match(/[\d.]+/g).map(Number);
        const rgba2 = color2.match(/[\d.]+/g).map(Number);

        const r = Math.round(rgba1[0] + (rgba2[0] - rgba1[0]) * t);
        const g = Math.round(rgba1[1] + (rgba2[1] - rgba1[1]) * t);
        const b = Math.round(rgba1[2] + (rgba2[2] - rgba1[2]) * t);
        const a = (rgba1[3] + (rgba2[3] - rgba1[3]) * t).toFixed(2);

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // Handle hex colors
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);

    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Lerp between color arrays (for gradients)
function lerpColorArray(arr1, arr2, t) {
    if (!arr1 || !arr2) return arr1 || arr2;
    if (arr1.length !== arr2.length) return arr1; // Fallback to first array

    return arr1.map((color, i) => lerpColor(color, arr2[i], t));
}

// Get blended palette between two times
// transitionProgress: 0 = fully current time, 1 = fully next time
function getBlendedPalette(currentTime, nextTime, transitionProgress) {
    const t = Math.max(0, Math.min(1, transitionProgress)); // Clamp 0-1
    const palette1 = TIME_PALETTES[currentTime];
    const palette2 = TIME_PALETTES[nextTime];

    const blended = {
        sky: lerpColorArray(palette1.sky, palette2.sky, t),
        skyStops: palette1.skyStops, // Keep stops constant
        clouds: lerpColor(palette1.clouds, palette2.clouds, t),
        mountains: lerpColorArray(palette1.mountains, palette2.mountains, t),
        trees: lerpColorArray(palette1.trees, palette2.trees, t),
        water: lerpColorArray(palette1.water, palette2.water, t),
        waterHighlight: lerpColor(palette1.waterHighlight, palette2.waterHighlight, t),
        underwater: lerpColorArray(palette1.underwater, palette2.underwater, t),

        // Blend lighting properties
        ambientLight: lerpColor(palette1.ambientLight, palette2.ambientLight, t),
        highlightColor: lerpColor(palette1.highlightColor, palette2.highlightColor, t),
        shadowColor: lerpColor(palette1.shadowColor, palette2.shadowColor, t),

        // Handle optional fog color
        fogColor: (palette1.fogColor && palette2.fogColor) ?
            lerpColor(palette1.fogColor, palette2.fogColor, t) :
            (t < 0.5 ? palette1.fogColor : palette2.fogColor),

        // Handle sun/moon transitions
        sun: palette1.sun && palette2.sun ? {
            x: palette1.sun.x + (palette2.sun.x - palette1.sun.x) * t,
            y: palette1.sun.y + (palette2.sun.y - palette1.sun.y) * t,
            color: lerpColor(palette1.sun.color, palette2.sun.color, t),
            glow: lerpColor(palette1.sun.glow, palette2.sun.glow, t)
        } : (t < 0.5 ? palette1.sun : palette2.sun),

        moon: palette1.moon && palette2.moon ? {
            x: palette1.moon.x + (palette2.moon.x - palette1.moon.x) * t,
            y: palette1.moon.y + (palette2.moon.y - palette1.moon.y) * t
        } : (t < 0.5 ? palette1.moon : palette2.moon)
    };

    return blended;
}

// Get palette with smooth transition based on game time
// Call this instead of getTimePalette() if you want smooth transitions
function getTransitionedPalette(gameState) {
    // If no transition system in place, return current palette
    if (!gameState.timeTransition || !gameState.timeTransition.active) {
        return getTimePalette();
    }

    const { fromTime, toTime, progress } = gameState.timeTransition;
    return getBlendedPalette(fromTime, toTime, progress);
}
