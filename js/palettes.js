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
        moon: null
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
        moon: null
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
        moon: { x: 150, y: 100 }
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
        moon: { x: 750, y: 80 }
    }
};

function getTimePalette() {
    return TIME_PALETTES[game.timeOfDay];
}
