// ============================================================
// THE DEEP ONES - CREATURES
// ============================================================

const CREATURES = {
    surface: [
        { name: "Harbor Cod", desc: "Looks normal. Looks. Normal.", value: 10, rarity: 0.5, sanityLoss: 0, timePreference: null, weatherPreference: null },
        { name: "Pale Flounder", desc: "Too many eyes. They all blink separately.", value: 20, rarity: 0.3, sanityLoss: 3, timePreference: null, weatherPreference: null },
        { name: "Whisper Eel", desc: "You heard it before you saw it.", value: 35, rarity: 0.15, sanityLoss: 5, timePreference: 'night', weatherPreference: null },
        { name: "Midnight Perch", desc: "Its scales absorb light.", value: 50, rarity: 0.05, sanityLoss: 8, timePreference: 'night', weatherPreference: null },
        { name: "Dawn Skipjack", desc: "Only appears in the liminal hours.", value: 45, rarity: 0.08, sanityLoss: 5, timePreference: 'dawn', weatherPreference: null },
        { name: "Storm Petrel Fish", desc: "Rides the chaos. Thrives in it.", value: 55, rarity: 0.1, sanityLoss: 8, timePreference: null, weatherPreference: 'storm' }
    ],
    mid: [
        { name: "Glass Squid", desc: "You can see what it ate. That wasn't a fish.", value: 60, rarity: 0.4, sanityLoss: 10, timePreference: null, weatherPreference: null },
        { name: "Bone Angler", desc: "Its light is beautiful. Don't look.", value: 90, rarity: 0.3, sanityLoss: 15, timePreference: 'night', weatherPreference: null },
        { name: "The Mimic", desc: "It looks familiar. Too familiar.", value: 120, rarity: 0.2, sanityLoss: 18, timePreference: null, weatherPreference: 'fog' },
        { name: "Prophet Fish", desc: "It knows your name.", value: 150, rarity: 0.1, sanityLoss: 22, timePreference: 'dusk', weatherPreference: null },
        { name: "Fog Phantom", desc: "Exists only when unseen.", value: 130, rarity: 0.12, sanityLoss: 20, timePreference: null, weatherPreference: 'fog' },
        { name: "Thunder Caller", desc: "Lightning follows it. Or does it follow lightning?", value: 140, rarity: 0.1, sanityLoss: 18, timePreference: null, weatherPreference: 'storm' }
    ],
    deep: [
        { name: "Congregation Fish", desc: "Several fish. Fused. Breathing in unison.", value: 180, rarity: 0.4, sanityLoss: 25, timePreference: null, weatherPreference: null },
        { name: "The Listener", desc: "No eyes. It knows where you are.", value: 220, rarity: 0.3, sanityLoss: 30, timePreference: 'night', weatherPreference: null },
        { name: "Drowned Sailor's Friend", desc: "No one will say what this is.", value: 280, rarity: 0.2, sanityLoss: 35, timePreference: null, weatherPreference: 'storm' },
        { name: "Memory Leech", desc: "You forgot something. What was it?", value: 350, rarity: 0.1, sanityLoss: 40, timePreference: 'night', weatherPreference: null },
        { name: "Twilight Dweller", desc: "Neither day nor night claims it.", value: 300, rarity: 0.15, sanityLoss: 32, timePreference: 'dusk', weatherPreference: null }
    ],
    abyss: [
        { name: "Dagon's Fingerling", desc: "'Fingerling' is relative.", value: 500, rarity: 0.5, sanityLoss: 45, timePreference: null, weatherPreference: null },
        { name: "The Dreaming One", desc: "It sleeps. DO NOT WAKE IT.", value: 800, rarity: 0.3, sanityLoss: 55, timePreference: 'night', weatherPreference: null },
        { name: "Mother Hydra's Tear", desc: "A piece of something vast.", value: 1200, rarity: 0.15, sanityLoss: 65, timePreference: null, weatherPreference: 'storm' },
        { name: "The Unnamed", desc: "There are no words.", value: 2000, rarity: 0.05, sanityLoss: 80, timePreference: 'night', weatherPreference: 'storm' },
        { name: "Void Watcher", desc: "It has always been watching.", value: 1500, rarity: 0.08, sanityLoss: 70, timePreference: null, weatherPreference: null }
    ]
};

// Creature interactions - some creatures can trigger special events
const CREATURE_INTERACTIONS = {
    doubleCatch: {
        chance: 0.05,  // 5% chance of double catch
        triggers: ['Harbor Cod', 'Pale Flounder', 'Glass Squid'],
        message: "Two for one! They were swimming together."
    },
    predatorChase: {
        // When catching small fish, chance a predator chases it up
        triggers: {
            'Harbor Cod': { predator: 'Whisper Eel', chance: 0.08 },
            'Pale Flounder': { predator: 'The Mimic', chance: 0.05 },
            'Glass Squid': { predator: 'Bone Angler', chance: 0.06 }
        }
    },
    abyssCall: {
        // Abyss creatures can "call" other abyss creatures
        chance: 0.03,
        message: "Something else stirs in the depths..."
    }
};

// Check for time/weather preference bonus
function getCreatureTimeWeatherBonus(creature) {
    let bonus = 1.0;

    // Time preference bonus
    if (creature.timePreference) {
        if (creature.timePreference === game.timeOfDay) {
            bonus *= 2.0;  // Double chance during preferred time
        } else {
            bonus *= 0.3;  // Much lower chance at wrong time
        }
    }

    // Weather preference bonus
    if (creature.weatherPreference) {
        if (creature.weatherPreference === game.weather.current) {
            bonus *= 2.5;  // Even higher bonus for weather-specific creatures
        } else {
            bonus *= 0.2;  // Very low chance without the right weather
        }
    }

    return bonus;
}

// Check for creature interactions after a catch
function checkCreatureInteraction(caughtCreature) {
    // Check for double catch
    if (CREATURE_INTERACTIONS.doubleCatch.triggers.includes(caughtCreature.name)) {
        if (Math.random() < CREATURE_INTERACTIONS.doubleCatch.chance) {
            return {
                type: 'doubleCatch',
                message: CREATURE_INTERACTIONS.doubleCatch.message,
                extraCreature: { ...caughtCreature }  // Same creature again
            };
        }
    }

    // Check for predator chase
    const predatorData = CREATURE_INTERACTIONS.predatorChase.triggers[caughtCreature.name];
    if (predatorData && Math.random() < predatorData.chance) {
        // Find the predator creature
        let predator = null;
        for (const zone of Object.values(CREATURES)) {
            predator = zone.find(c => c.name === predatorData.predator);
            if (predator) break;
        }
        if (predator) {
            return {
                type: 'predatorChase',
                message: `A ${predator.name} followed your catch!`,
                extraCreature: { ...predator }
            };
        }
    }

    // Check for abyss call (only for abyss creatures)
    if (CREATURES.abyss.some(c => c.name === caughtCreature.name)) {
        if (Math.random() < CREATURE_INTERACTIONS.abyssCall.chance) {
            return {
                type: 'abyssCall',
                message: CREATURE_INTERACTIONS.abyssCall.message,
                abyssBonusActive: true
            };
        }
    }

    return null;
}

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

    // Calculate adjusted rarities based on time/weather
    const adjustedPool = pool.map(creature => ({
        ...creature,
        adjustedRarity: creature.rarity * getCreatureTimeWeatherBonus(creature)
    }));

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

    // Use adjusted rarities for creature selection
    for (const creature of adjustedPool) {
        if (roll <= creature.adjustedRarity) return creature;
        roll -= creature.adjustedRarity;
    }
    return adjustedPool[adjustedPool.length - 1];
}
