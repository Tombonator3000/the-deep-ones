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
    boatX: 1500,
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
        sandbank: { zone: 'surface', bonus: 0, sanityMod: 0.02 },
        shallows: { zone: 'surface', bonus: 0.1, sanityMod: 0.01 },
        sunsetCove: { zone: 'surface', bonus: 0.15, sanityMod: 0 },
        dock: { zone: 'surface', bonus: 0, sanityMod: 0.05 },
        reef: { zone: 'mid', bonus: 0.2, sanityMod: -0.01 },
        shipwreck: { zone: 'deep', bonus: 0.3, sanityMod: -0.02 },
        trench: { zone: 'deep', bonus: 0.4, sanityMod: -0.03 },
        void: { zone: 'abyss', bonus: 0.5, sanityMod: -0.05 }
    },

    loreViewer: {
        open: false,
        page: 0,
        itemsPerPage: 4
    },

    // Transformation system (inspired by Deep Regrets)
    transformation: {
        stage: 0,  // 0=Human, 1=Touched, 2=Changing, 3=Becoming, 4=Deep One
        totalSanityLost: 0,
        creaturesCaught: { surface: 0, mid: 0, deep: 0, abyss: 0 },
        physicalChanges: []
    },

    // Fishing Journal/Bestiary
    journal: {
        open: false,
        page: 0,
        discovered: [],  // Array of creature names that have been caught
        itemsPerPage: 3
    },

    // Village menu
    villageMenu: {
        open: false,
        selectedIndex: 0
    },

    // Endings tracking
    storyFlags: {
        metMarsh: false,
        heardWhispers: false,
        sawVision: false,
        foundAllLore: false,
        caughtUnnamed: false,
        reachedVoid: false,
        transformationStarted: false,
        visitedLocations: []
    },

    // Endings state
    ending: {
        triggered: false,
        current: null,  // 'deepOne', 'survivor', or 'prophet'
        phase: 'none',  // 'none', 'fadeout', 'scene', 'credits', 'complete'
        timer: 0,
        textIndex: 0,
        canContinue: false
    },

    // Endless mode (after ending)
    endlessMode: false,

    // Achievements
    achievements: {
        unlocked: [],  // Array of achievement IDs
        stats: {
            totalGoldEarned: 50,
            petCount: 0,
            nightCatches: 0,
            stormCatches: 0
        },
        notification: null,  // { achievement: obj, timer: number }
        viewerOpen: false,
        viewerPage: 0
    }
};
