// ============================================================
// THE DEEP ONES - GAME STATE
// ============================================================

const game = {
    state: 'title',
    timeOfDay: 'dusk',
    money: 50,
    sanity: 100,
    depth: 0,
    targetDepth: 30,
    boatX: 500,
    cameraX: 0,
    time: 0,
    currentCatch: null,
    caughtCreatures: [],
    fish: [],
    layers: [],
    pendingCatch: null,

    equipment: {
        rod: 'bamboo',
        lure: null,
        boat: 'rowboat'
    },

    inventory: [],
    inventoryMax: 10,

    shop: {
        open: false,
        tab: 'sell',
        selectedIndex: 0,
        npcDialog: '',
        dialogTimer: 0
    },

    nearDock: false,
    lastRareCatch: false,

    weather: {
        current: 'clear',
        next: 'clear',
        transitionProgress: 0,
        timeUntilChange: 30000,
        intensity: 0
    },

    dayProgress: 0.5,
    timePaused: false,

    currentLocation: 'dock',

    dog: {
        happiness: 100,
        lastPetTime: 0,
        isBarking: false,
        barkReason: null,
        animation: 'idle'
    },

    loreFound: [],
    currentLore: null,

    minigame: {
        active: false,
        targetZone: 0.5,
        playerZone: 0.5,
        zoneSize: 0.15,
        tension: 0,
        fishStamina: 100,
        difficulty: 1,
        direction: 1,
        speed: 0.02
    },

    sanityEffects: {
        screenShake: 0,
        colorShift: 0,
        whispers: false,
        hallucinations: [],
        vignette: 0
    },

    loreBottles: [],

    locationBonuses: {
        dock: { zone: 'surface', bonus: 0 },
        shallows: { zone: 'surface', bonus: 0.1 },
        reef: { zone: 'mid', bonus: 0.2 },
        shipwreck: { zone: 'deep', bonus: 0.3 },
        trench: { zone: 'abyss', bonus: 0.4 },
        void: { zone: 'abyss', bonus: 0.5 }
    },

    loreViewer: {
        open: false,
        page: 0,
        itemsPerPage: 4
    }
};
