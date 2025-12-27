// ============================================================
// THE DEEP ONES - CONFIGURATION
// ============================================================

const CONFIG = {
    canvas: { width: 1000, height: 650 },
    waterLine: 280,
    useSprites: false,
    showDebug: true,
    assetPath: '',
    dockX: 180,
    worldWidth: 4000,
    worldMinX: 50,
    worldMaxX: 3950,
    locations: {
        dock: { x: 180, name: "Marsh's Dock", desc: "Safe harbor. Old Marsh waits here." },
        shallows: { x: 500, name: "The Shallows", desc: "Calm waters. Good for beginners." },
        reef: { x: 1200, name: "Coral Reef", desc: "Colorful but strange. Mid-tier creatures lurk here." },
        shipwreck: { x: 2000, name: "The Wreck", desc: "SS Dagon. Lost in '28. They say the crew still fishes." },
        trench: { x: 3200, name: "The Deep Trench", desc: "Where light fears to go. Only the mad fish here." },
        void: { x: 3800, name: "The Void", desc: "Turn back. TURN BACK." }
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
    { id: 1, title: "Marsh's Journal, Page 1", text: "Day 47. The fish are different now. Their eyes... they follow.", found: false, location: 'shallows' },
    { id: 2, title: "Torn Letter", text: "Dearest Sarah, I've seen things in the deep. Don't come looking for me. -Your Father", found: false, location: 'reef' },
    { id: 3, title: "Ship's Log (SS Dagon)", text: "Captain's Log: The crew won't sleep. They say the water sings to them at night.", found: false, location: 'shipwreck' },
    { id: 4, title: "Carved Stone Tablet", text: "PH'NGLUI MGLW'NAFH... The rest is worn away. You feel sick looking at it.", found: false, location: 'shipwreck' },
    { id: 5, title: "Child's Drawing", text: "A crude drawing of a fish. It has too many fins. 'My friend' is written below.", found: false, location: 'shallows' },
    { id: 6, title: "Marsh's Journal, Page 23", text: "The old ones remember. Before the ice. Before the land. They wait.", found: false, location: 'trench' },
    { id: 7, title: "Waterlogged Bible", text: "Someone has crossed out 'God' and written 'DAGON' throughout. The pages stick together.", found: false, location: 'shipwreck' },
    { id: 8, title: "Photograph", text: "A fishing crew, circa 1920. Their faces are scratched out. One figure in back has no face.", found: false, location: 'reef' },
    { id: 9, title: "Final Transmission", text: "MAYDAY. SS DAGON. COORDINATES [ILLEGIBLE]. THEY'RE COMING UP. THEY'RE COMING UP. THEY'RE C-", found: false, location: 'trench' },
    { id: 10, title: "The Naming", text: "When you name a thing, you give it power. Some things should remain unnamed.", found: false, location: 'void' },
    { id: 11, title: "Marsh's Journal, Final Entry", text: "I understand now. The fish don't fear us. They pity us. We are so small. So brief.", found: false, location: 'void' },
    { id: 12, title: "Mother Hydra's Promise", text: "THOSE WHO SERVE SHALL NOT DIE. THOSE WHO SERVE SHALL DREAM FOREVER.", found: false, location: 'void' }
];

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
    ]
};
