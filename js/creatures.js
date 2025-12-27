// ============================================================
// THE DEEP ONES - CREATURES
// ============================================================

const CREATURES = {
    surface: [
        { name: "Harbor Cod", desc: "Looks normal. Looks. Normal.", value: 10, rarity: 0.5, sanityLoss: 0 },
        { name: "Pale Flounder", desc: "Too many eyes. They all blink separately.", value: 20, rarity: 0.3, sanityLoss: 3 },
        { name: "Whisper Eel", desc: "You heard it before you saw it.", value: 35, rarity: 0.15, sanityLoss: 5 },
        { name: "Midnight Perch", desc: "Its scales absorb light.", value: 50, rarity: 0.05, sanityLoss: 8 }
    ],
    mid: [
        { name: "Glass Squid", desc: "You can see what it ate. That wasn't a fish.", value: 60, rarity: 0.4, sanityLoss: 10 },
        { name: "Bone Angler", desc: "Its light is beautiful. Don't look.", value: 90, rarity: 0.3, sanityLoss: 15 },
        { name: "The Mimic", desc: "It looks familiar. Too familiar.", value: 120, rarity: 0.2, sanityLoss: 18 },
        { name: "Prophet Fish", desc: "It knows your name.", value: 150, rarity: 0.1, sanityLoss: 22 }
    ],
    deep: [
        { name: "Congregation Fish", desc: "Several fish. Fused. Breathing in unison.", value: 180, rarity: 0.4, sanityLoss: 25 },
        { name: "The Listener", desc: "No eyes. It knows where you are.", value: 220, rarity: 0.3, sanityLoss: 30 },
        { name: "Drowned Sailor's Friend", desc: "No one will say what this is.", value: 280, rarity: 0.2, sanityLoss: 35 },
        { name: "Memory Leech", desc: "You forgot something. What was it?", value: 350, rarity: 0.1, sanityLoss: 40 }
    ],
    abyss: [
        { name: "Dagon's Fingerling", desc: "'Fingerling' is relative.", value: 500, rarity: 0.5, sanityLoss: 45 },
        { name: "The Dreaming One", desc: "It sleeps. DO NOT WAKE IT.", value: 800, rarity: 0.3, sanityLoss: 55 },
        { name: "Mother Hydra's Tear", desc: "A piece of something vast.", value: 1200, rarity: 0.15, sanityLoss: 65 },
        { name: "The Unnamed", desc: "There are no words.", value: 2000, rarity: 0.05, sanityLoss: 80 }
    ]
};

function getCreatureForDepth(depth) {
    let pool;
    if (depth < 20) pool = CREATURES.surface;
    else if (depth < 55) pool = CREATURES.mid;
    else if (depth < 90) pool = CREATURES.deep;
    else pool = CREATURES.abyss;
    return pool[0];
}

function getCreature() {
    const rod = getCurrentRod();
    const lure = getCurrentLure();
    const depth = game.depth;

    // Get location-based creature pool weights
    const locationWeights = getLocationCreaturePool();

    // Select pool based on location weights AND depth
    let pool;
    let poolRoll = Math.random();

    // Combine location preference with depth requirement
    if (locationWeights) {
        // Adjust weights based on depth capability
        const maxDepth = rod ? rod.depthMax : 30;
        let adjustedWeights = { ...locationWeights };

        // Can't catch deep creatures without proper equipment
        if (maxDepth < 90) adjustedWeights.abyss = 0;
        if (maxDepth < 55) adjustedWeights.deep = 0;
        if (maxDepth < 20) adjustedWeights.mid = 0;

        // Normalize weights
        const total = adjustedWeights.surface + adjustedWeights.mid + adjustedWeights.deep + adjustedWeights.abyss;
        if (total > 0) {
            if (poolRoll < adjustedWeights.surface / total) pool = CREATURES.surface;
            else if (poolRoll < (adjustedWeights.surface + adjustedWeights.mid) / total) pool = CREATURES.mid;
            else if (poolRoll < (adjustedWeights.surface + adjustedWeights.mid + adjustedWeights.deep) / total) pool = CREATURES.deep;
            else pool = CREATURES.abyss;
        } else {
            pool = CREATURES.surface;
        }
    } else {
        // Fallback to depth-based selection
        if (depth < 20) pool = CREATURES.surface;
        else if (depth < 55) pool = CREATURES.mid;
        else if (depth < 90) pool = CREATURES.deep;
        else pool = CREATURES.abyss;
    }

    let roll = Math.random();

    // Apply lure bonus
    if (lure) {
        const zoneMatch = (lure.bonus === 'surface' && pool === CREATURES.surface) ||
                         (lure.bonus === 'mid' && pool === CREATURES.mid) ||
                         (lure.bonus === 'deep' && pool === CREATURES.deep) ||
                         (lure.bonus === 'abyss' && pool === CREATURES.abyss);
        if (zoneMatch) roll *= lure.multiplier;
    }

    // Apply location bonus
    const locBonus = game.locationBonuses[game.currentLocation];
    if (locBonus) roll += locBonus.bonus;

    // Apply transformation bonus (fish bite more eagerly for transformed players)
    roll *= getTransformationBiteBonus();

    for (const creature of pool) {
        if (roll <= creature.rarity) return creature;
        roll -= creature.rarity;
    }
    return pool[pool.length - 1];
}
