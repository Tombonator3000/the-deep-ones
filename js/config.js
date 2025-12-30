// ============================================================
// THE DEEP ONES - CONFIGURATION
// ============================================================

// Pixel art configuration for Cast n Chill style rendering
const PIXEL_CONFIG = {
    // Internal resolution - this is what we actually draw at
    // 480x270 = 16:9 aspect ratio, 1/4 of 1080p
    // This gives visible pixels while keeping UI readable
    internalWidth: 480,
    internalHeight: 270,
    // Water line at ~43% of height (same ratio as before: 280/650)
    waterLineRatio: 0.43
};

const CONFIG = {
    canvas: { width: PIXEL_CONFIG.internalWidth, height: PIXEL_CONFIG.internalHeight },
    waterLine: Math.floor(PIXEL_CONFIG.internalHeight * PIXEL_CONFIG.waterLineRatio),
    useSprites: true,  // Sprites enabled with auto-scaling for oversized assets
    showDebug: true,
    assetPath: '',
    dockX: 1500,  // Must match CONFIG.locations.dock.x
    worldWidth: 6000,
    worldMinX: 50,
    worldMaxX: 5950,
    locations: {
        sandbank: { x: 200, name: "The Sandbank", desc: "Shallow waters. The boundary of safe return.", maxDepth: 15, zone: 'surface' },
        shallows: { x: 600, name: "The Shallows", desc: "Calm waters. Good for beginners.", maxDepth: 40, zone: 'surface' },
        sunsetCove: { x: 1000, name: "Sunset Cove", desc: "Beautiful at dusk. The villagers avoid it.", maxDepth: 50, zone: 'surface' },
        dock: { x: 1500, name: "Innsmouth Harbor", desc: "Home port. Old Marsh waits here.", maxDepth: 30, zone: 'surface' },
        reef: { x: 2200, name: "The Coral Reef", desc: "Colorful but strange. Mid-tier creatures lurk here.", maxDepth: 80, zone: 'mid' },
        shipwreck: { x: 3200, name: "The Wreck", desc: "SS Dagon. Lost in '28. They say the crew still fishes.", maxDepth: 100, zone: 'deep' },
        trench: { x: 4500, name: "The Deep Trench", desc: "Where light fears to go. Only the mad fish here.", maxDepth: 150, zone: 'deep' },
        void: { x: 5600, name: "The Void", desc: "Turn back. TURN BACK.", maxDepth: 200, zone: 'abyss' }
    },
    timeProgressionSpeed: 0.0001,
    dayDuration: 180000,
};

const WEATHER = {
    types: {
        clear: { name: "Clear", biteModifier: 1.0, sanityDrain: 0, visibility: 1.0, desc: "Calm seas. Perfect fishing weather." },
        cloudy: { name: "Cloudy", biteModifier: 1.1, sanityDrain: 0, visibility: 0.9, desc: "Overcast. The fish seem more active." },
        rain: { name: "Rain", biteModifier: 1.3, sanityDrain: 0.01, visibility: 0.7, desc: "Steady rain. Something stirs below." },
        fog: { name: "Fog", biteModifier: 1.2, sanityDrain: 0.02, visibility: 0.4, desc: "Thick fog. You can barely see your hands." },
        storm: { name: "Storm", biteModifier: 1.5, sanityDrain: 0.05, visibility: 0.5, desc: "The sea rages. Rare creatures surface..." }
    },
    transitionTime: 30000,
    minDuration: 20000,
    maxDuration: 60000
};

const LORE_FRAGMENTS = [
    { id: 1, title: "Driftwood Message", text: "STAY IN THE SHALLOWS. THE DEEP ONES WATCH. -Unknown", found: false, location: 'sandbank', hint: null },
    { id: 2, title: "Marsh's Journal, Page 1", text: "Day 47. The fish are different now. Their eyes... they follow.", found: false, location: 'shallows', hint: "The Midnight Perch only shows itself after dark." },
    { id: 3, title: "Sunset Lover's Note", text: "We used to watch the sunset here. Before the changes. Before she started swimming at night.", found: false, location: 'sunsetCove', hint: "Prophet Fish emerge at dusk, when the veil is thin." },
    { id: 4, title: "Torn Letter", text: "Dearest Sarah, I've seen things in the deep. Don't come looking for me. -Your Father", found: false, location: 'reef', hint: null },
    { id: 5, title: "Ship's Log (SS Dagon)", text: "Captain's Log: The crew won't sleep. They say the water sings to them at night.", found: false, location: 'shipwreck', hint: "The Drowned Sailor's Friend surfaces in storms." },
    { id: 6, title: "Carved Stone Tablet", text: "PH'NGLUI MGLW'NAFH... The rest is worn away. You feel sick looking at it.", found: false, location: 'shipwreck', hint: null },
    { id: 7, title: "Child's Drawing", text: "A crude drawing of a fish. It has too many fins. 'My friend' is written below.", found: false, location: 'shallows', hint: "The Mimic appears in the fog. It knows what you fear." },
    { id: 8, title: "Marsh's Journal, Page 23", text: "The old ones remember. Before the ice. Before the land. They wait.", found: false, location: 'trench', hint: null },
    { id: 9, title: "Waterlogged Bible", text: "Someone has crossed out 'God' and written 'DAGON' throughout. The pages stick together.", found: false, location: 'shipwreck', hint: "Dawn brings the Skipjack. Blink and you'll miss it." },
    { id: 10, title: "Photograph", text: "A fishing crew, circa 1920. Their faces are scratched out. One figure in back has no face.", found: false, location: 'reef', hint: null },
    { id: 11, title: "Final Transmission", text: "MAYDAY. SS DAGON. COORDINATES [ILLEGIBLE]. THEY'RE COMING UP. THEY'RE COMING UP. THEY'RE C-", found: false, location: 'trench', hint: "The Unnamed only surfaces in night storms. Pray you never find it." },
    { id: 12, title: "The Naming", text: "When you name a thing, you give it power. Some things should remain unnamed.", found: false, location: 'void', hint: null },
    { id: 13, title: "Marsh's Journal, Final Entry", text: "I understand now. The fish don't fear us. They pity us. We are so small. So brief.", found: false, location: 'void', hint: "The Fog Phantom exists only when you can't see it." },
    { id: 14, title: "Mother Hydra's Promise", text: "THOSE WHO SERVE SHALL NOT DIE. THOSE WHO SERVE SHALL DREAM FOREVER.", found: false, location: 'void', hint: "Mother Hydra's Tears fall only during the greatest storms." }
];

// Secret creature info unlocked by lore
const SECRET_CREATURE_INFO = {
    "Midnight Perch": { loreId: 2, secret: "Its scales can be used to see in complete darkness." },
    "Prophet Fish": { loreId: 3, secret: "Some say it can predict the manner of your death." },
    "Drowned Sailor's Friend": { loreId: 5, secret: "The sailors it 'befriended' are still with it. Inside." },
    "The Mimic": { loreId: 7, secret: "It takes the form of what you most desire. Then devours it." },
    "Dawn Skipjack": { loreId: 9, secret: "Ancient sailors believed catching one brought a year of luck." },
    "The Unnamed": { loreId: 11, secret: "To speak its true name is to summon it. Even thinking it..." },
    "Fog Phantom": { loreId: 13, secret: "It exists in the spaces between moments. Neither real nor unreal." },
    "Mother Hydra's Tear": { loreId: 14, secret: "A piece of an Old One. It still feels. It still dreams." }
};

// Get secret info for a creature if lore is found
function getSecretCreatureInfo(creatureName) {
    const info = SECRET_CREATURE_INFO[creatureName];
    if (!info) return null;
    if (game.loreFound.includes(info.loreId)) {
        return info.secret;
    }
    return null;
}

// Transformation stages
const TRANSFORMATION = {
    stages: [
        { name: "Human", sanityThreshold: 70, desc: "Normal. Safe. For now.", color: '#a0c0a0' },
        { name: "Touched", sanityThreshold: 40, desc: "Something stirs within. Fish bite more eagerly.", color: '#80a0a0' },
        { name: "Changing", sanityThreshold: 20, desc: "The reflection in the water... is that you?", color: '#6090a0' },
        { name: "Becoming", sanityThreshold: 1, desc: "Almost there. They welcome you.", color: '#4080a0' },
        { name: "Deep One", sanityThreshold: 0, desc: "The sea claims its own.", color: '#2060a0' }
    ],
    physicalSigns: [
        "Your skin feels... damp.",
        "Your eyes seem larger today.",
        "Webbing between your fingers?",
        "Gills. You have gills.",
        "The water calls you home."
    ]
};

const SHOP = {
    rods: [
        { id: 'bamboo', name: "Old Bamboo", desc: "Your grandfather's rod. Reliable, if limited.", depthMax: 30, strength: 1, price: 0, owned: true },
        { id: 'steel', name: "Steel Spinner", desc: "Reaches the mid-waters. Something watches from below.", depthMax: 60, strength: 2, price: 200, owned: false },
        { id: 'deep', name: "Deep Diver", desc: "For those who seek what shouldn't be found.", depthMax: 100, strength: 3, price: 500, owned: false },
        { id: 'abyss', name: "Abyss Caller", desc: "Marsh won't say where he got this. Don't ask.", depthMax: 120, strength: 4, price: 1500, owned: false }
    ],
    lures: [
        { id: 'worm', name: "Common Worm", desc: "Simple. Effective. The fish seem... too eager.", bonus: "surface", multiplier: 1.2, price: 10, count: 0 },
        { id: 'glow', name: "Glowing Jig", desc: "It pulses with an unnatural light.", bonus: "mid", multiplier: 1.3, price: 50, count: 0 },
        { id: 'blood', name: "Blood Bait", desc: "Best not to ask whose blood.", bonus: "deep", multiplier: 1.4, price: 150, count: 0 },
        { id: 'offering', name: "The Offering", desc: "They will come. They always come.", bonus: "abyss", multiplier: 1.5, price: 500, count: 0 }
    ],
    boats: [
        { id: 'rowboat', name: "Old Rowboat", desc: "Creaks with every wave. Feels like home.", storage: 10, speed: 1, price: 0, owned: true },
        { id: 'skiff', name: "Weathered Skiff", desc: "Faster. The dog seems nervous in it.", storage: 20, speed: 1.5, price: 400, owned: false },
        { id: 'trawler', name: "The Endeavour", desc: "A serious vessel. For serious work.", storage: 40, speed: 2, price: 1200, owned: false }
    ]
};

// Endings configuration
const ENDINGS = {
    deepOne: {
        id: 'deep_one',
        name: 'The Deep One',
        subtitle: 'Embrace',
        requirement: 'Sanity reaches 0',
        description: 'You have become one with the sea. The transformation is complete.',
        unlocksEndless: true
    },
    survivor: {
        id: 'survivor',
        name: 'The Survivor',
        subtitle: 'Resist',
        requirement: 'Catch The Unnamed while sanity > 30',
        description: 'You have seen the abyss and turned away. Innsmouth fades in your wake.',
        unlocksEndless: true
    },
    prophet: {
        id: 'prophet',
        name: 'The Prophet',
        subtitle: 'Transcend',
        requirement: 'Find all lore, catch The Unnamed, and maintain sanity 20-40',
        description: 'Neither human nor Deep One. You understand now. You are the bridge.',
        unlocksEndless: true,
        secret: true
    }
};

// Achievements configuration
const ACHIEVEMENTS = {
    // Fishing achievements
    firstCatch: { id: 'first_catch', name: 'First Bite', desc: 'Catch your first fish', icon: '🐟' },
    surfaceMaster: { id: 'surface_master', name: 'Surface Dweller', desc: 'Catch all surface creatures', icon: '🌊' },
    midExplorer: { id: 'mid_explorer', name: 'Into the Blue', desc: 'Catch all mid-depth creatures', icon: '🌀' },
    deepDiver: { id: 'deep_diver', name: 'Depths Unknown', desc: 'Catch all deep creatures', icon: '⚫' },
    abyssWalker: { id: 'abyss_walker', name: 'Abyss Walker', desc: 'Catch all abyss creatures', icon: '👁️' },

    // Wealth achievements
    firstHundred: { id: 'first_hundred', name: 'Getting Started', desc: 'Earn 100 gold', icon: '🪙' },
    thousandaire: { id: 'thousandaire', name: 'Thousandaire', desc: 'Earn 1000 gold', icon: '💰' },
    richBeyondReason: { id: 'rich_beyond', name: 'Rich Beyond Reason', desc: 'Earn 5000 gold', icon: '👑' },

    // Exploration achievements
    reachVoid: { id: 'reach_void', name: 'Edge of Nothing', desc: 'Reach The Void', icon: '🕳️' },
    allLocations: { id: 'all_locations', name: 'Wanderer', desc: 'Visit all locations', icon: '🗺️' },

    // Lore achievements
    firstLore: { id: 'first_lore', name: 'Curious Mind', desc: 'Find your first lore fragment', icon: '📜' },
    halfLore: { id: 'half_lore', name: 'Truth Seeker', desc: 'Find half of all lore', icon: '📖' },
    allLore: { id: 'all_lore', name: 'Forbidden Knowledge', desc: 'Find all lore fragments', icon: '📕' },

    // Sanity achievements
    brinkOfMadness: { id: 'brink', name: 'Brink of Madness', desc: 'Reach sanity below 10', icon: '🌀' },
    transformation: { id: 'transformed', name: 'Changed', desc: 'Begin transformation', icon: '🧬' },

    // Special achievements
    goodBoy: { id: 'good_boy', name: 'Good Boy', desc: 'Pet the dog 50 times', icon: '🐕' },
    stormChaser: { id: 'storm_chaser', name: 'Storm Chaser', desc: 'Catch a fish during a storm', icon: '⛈️' },
    nightFisher: { id: 'night_fisher', name: 'Night Fisher', desc: 'Catch 10 fish at night', icon: '🌙' },

    // Ending achievements
    endingDeepOne: { id: 'ending_deep', name: 'The Deep One', desc: 'Achieve the Deep One ending', icon: '🐙' },
    endingSurvivor: { id: 'ending_survivor', name: 'The Survivor', desc: 'Achieve the Survivor ending', icon: '🚶' },
    endingProphet: { id: 'ending_prophet', name: 'The Prophet', desc: 'Achieve the Prophet ending', icon: '👁️‍🗨️' }
};

// Additional NPCs in Innsmouth
const NPCS = {
    marsh: {
        id: 'marsh',
        name: 'Old Marsh',
        title: 'Bait & Tackle',
        location: 'dock',
        unlocked: true
    },
    innkeeper: {
        id: 'innkeeper',
        name: 'The Innkeeper',
        title: 'Gilman House',
        location: 'dock',
        unlocked: true,
        dialogs: {
            greeting: [
                "Room for the night? ...No? Then what do you want?",
                "The walls here remember things. Best not to ask what.",
                "Sleep well in Innsmouth? Ha. No one sleeps well here.",
                "Checkout is at dawn. If you last that long."
            ],
            lowSanity: [
                "You look like you've seen things. Join the club.",
                "The dreams getting worse? They will.",
                "I can give you something for the nightmares... but you won't like the side effects.",
                "Your eyes... they're starting to change. Like the others."
            ],
            hint: [
                "The fishermen talk about lights in the deep. Best ignore them.",
                "Father Dagon's followers meet on full moons. You didn't hear that from me.",
                "The old church? Abandoned. Officially. Unofficially... well."
            ]
        }
    },
    priest: {
        id: 'priest',
        name: 'Father Waite',
        title: 'Order of Dagon',
        location: 'dock',
        unlocked: false,  // Unlocks at low sanity
        unlockCondition: { sanity: { max: 40 } },
        dialogs: {
            greeting: [
                "Ah, a new convert... or will you be?",
                "The Deep Ones welcome all who hear the call.",
                "Your transformation has begun. Embrace it.",
                "Father Dagon sees all. He sees you."
            ],
            blessing: [
                "Receive Dagon's blessing... +5 to abyss catches, -10 sanity.",
                "The deep knows its own. Accept this gift.",
                "Let the waters claim what was always theirs."
            ],
            prophecy: [
                "The stars align soon. The sleeper stirs.",
                "R'lyeh rises when the moon bleeds.",
                "You will be among the chosen. If you survive."
            ]
        },
        services: [
            { name: "Dagon's Blessing", desc: "+50% abyss bite rate, -10 sanity", cost: 100, effect: 'blessing' },
            { name: "Forbidden Knowledge", desc: "Reveal nearby lore location", cost: 50, effect: 'loreHint' },
            { name: "Deep Communion", desc: "Speak with the fish... +15 sanity loss, reveals secrets", cost: 200, effect: 'communion' }
        ]
    },
    child: {
        id: 'child',
        name: 'Strange Child',
        title: '???',
        location: 'dock',
        unlocked: false,  // Appears randomly at night
        unlockCondition: { timeOfDay: 'night', random: 0.3 },
        dialogs: {
            greeting: [
                "...",
                "*stares with too-large eyes*",
                "The fish told me about you.",
                "Do you dream of the water too?"
            ],
            lowSanity: [
                "You're becoming like us. It doesn't hurt after a while.",
                "Mother says I used to be different. I don't remember.",
                "They're waiting for you. Under the waves.",
                "I can teach you to breathe water. Want me to?"
            ],
            cryptic: [
                "The old ones never died. They just... wait.",
                "I saw your ending. Both of them.",
                "The dog knows. Ask the dog.",
                "Don't catch the Unnamed. Or do. It's already written."
            ]
        }
    }
};

// Daily challenge definitions
const DAILY_CHALLENGES = [
    { id: 'catch_5_surface', name: 'Surface Skimmer', desc: 'Catch 5 surface fish', target: 5, zone: 'surface' },
    { id: 'catch_3_mid', name: 'Mid-Water Hunter', desc: 'Catch 3 mid-depth fish', target: 3, zone: 'mid' },
    { id: 'catch_deep', name: 'Deep Diver', desc: 'Catch a deep creature', target: 1, zone: 'deep' },
    { id: 'earn_100', name: 'Gold Rush', desc: 'Earn 100 gold today', target: 100, type: 'gold' },
    { id: 'earn_500', name: 'Big Haul', desc: 'Earn 500 gold today', target: 500, type: 'gold' },
    { id: 'pet_dog_5', name: 'Good Owner', desc: 'Pet your dog 5 times', target: 5, type: 'pet' },
    { id: 'visit_locations', name: 'Explorer', desc: 'Visit 4 different locations', target: 4, type: 'locations' },
    { id: 'night_catches', name: 'Night Owl', desc: 'Catch 3 fish at night', target: 3, type: 'nightCatch' },
    { id: 'storm_catch', name: 'Storm Chaser', desc: 'Catch a fish during a storm', target: 1, type: 'stormCatch' },
    { id: 'streak_5', name: 'On a Roll', desc: 'Get a 5-catch streak', target: 5, type: 'streak' },
    { id: 'find_lore', name: 'Knowledge Seeker', desc: 'Find a lore fragment', target: 1, type: 'lore' },
    { id: 'no_sanity_loss', name: 'Stay Sane', desc: 'Fish for 5 minutes without sanity loss', target: 300, type: 'sanityStreak' }
];

const NPC_DIALOGS = {
    greeting: [
        "Ah, another early riser. The fish bite best when the world sleeps.",
        "Back again? The sea keeps calling, doesn't it?",
        "You've got that look. The deep-water look. Be careful.",
        "Morning. Or is it evening? Time moves strange here.",
        "The dog knows. They always know. Watch its ears."
    ],
    lowSanity: [
        "Your eyes... you've seen things down there, haven't you?",
        "Maybe stay in the shallows today. Just... trust me.",
        "They whisper about you now. The things below.",
        "Here. Take this. *hands you something warm* ...Don't look at it too long.",
        "The old ones are watching. I can smell it on you."
    ],
    afterRareCatch: [
        "That thing you caught... we don't speak its name here.",
        "I'll take it. I'll take it all. Just don't tell me where you found it.",
        "My grandmother spoke of these. I didn't believe her.",
        "The price I'm paying... it's not for the fish. It's to forget I saw it."
    ],
    selling: [
        "Fair price for fair catch. Mostly fair, anyway.",
        "I know a buyer in Innsmouth. Don't ask questions.",
        "Gold for fish. Simple transaction. Nothing strange here.",
        "The usual rate. Unless you want to... negotiate."
    ],
    buying: [
        "Fine equipment. Treat it well.",
        "This rod's seen things. Good things, I hope.",
        "The bait's fresh. Fresher than you'd expect.",
        "You're ready. Or as ready as anyone can be."
    ],
    idle: [
        "*adjusts hat and stares at the horizon*",
        "*mutters something in a language you don't recognize*",
        "*the dog whimpers softly*",
        "*scratches something into the dock with a knife*"
    ],
    // Context-specific dialogs
    firstVisit: [
        "New here, ain't ya? The name's Marsh. Old Marsh, they call me now.",
        "Welcome to Innsmouth Harbor. Don't let the locals spook you.",
        "First time fishing these waters? Stick to the shallows. For now."
    ],
    veteranVisit: [
        "Ten times now. You're becoming one of us, friend.",
        "I remember when you first came here. You've changed.",
        "The regulars are talking about you. Not all bad, mind you."
    ],
    nightVisit: [
        "Fishing at night? Bold. Or foolish. Same thing sometimes.",
        "The moon's full. They're more active when the moon's full.",
        "Can't sleep either? The sea keeps you up too, doesn't it?"
    ],
    stormVisit: [
        "Storm's brewing. The big ones come up in storms.",
        "Most fishers stay home in weather like this. Not you.",
        "Lightning on the water... beautiful and terrible."
    ],
    dawnVisit: [
        "Up before the sun. My kind of fisher.",
        "Dawn's the best time. The fish are still dreaming.",
        "The world between night and day... things slip through."
    ],
    duskVisit: [
        "End of another day. Or just the beginning, for some.",
        "Sunset Cove's beautiful this time. Stay away from it.",
        "The dying light plays tricks. Or maybe it reveals truths."
    ],
    // Achievement-related
    afterFirstAchievement: [
        "Getting the hang of it, I see. Keep at it.",
        "Progress. That's what I like to see.",
        "Every fisher has their first milestone. This is yours."
    ],
    manyAchievements: [
        "Quite the collection you've built. Impressive.",
        "You've done things I've only heard whispers about.",
        "The sea has marked you as one of its own."
    ],
    // Specific creature reactions
    afterUnnamed: [
        "You... you caught THAT? How are you still standing?",
        "I've heard legends. Never thought I'd see proof.",
        "Take my advice: forget you ever saw it. If you can."
    ],
    afterAbyssCreature: [
        "That came from... down there? What else is waiting?",
        "The abyss gives up its secrets reluctantly.",
        "Each of these brings us closer to understanding. Or madness."
    ],
    // Weather hints
    fishingHints: [
        "Some fish only come out at night. The shy ones.",
        "Storm weather brings the big catches. And the dangerous ones.",
        "Fog's good for the strange ones. The ones that hide.",
        "Dawn skipjacks only bite at first light. Beautiful things.",
        "The Prophet Fish comes at dusk. It knows things."
    ],
    // Lore hints
    loreHints: [
        "There are bottles floating out there. Messages from... before.",
        "The Wreck holds secrets. Terrible secrets.",
        "Someone carved words into the Void rocks. Warnings.",
        "I found a journal once. Burned it. You should too."
    ]
};
