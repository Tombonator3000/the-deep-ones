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
    return getPoolForDepth(depth)[0];
}

// ============================================================
// CREATURE SELECTION HELPERS
// ============================================================

// Maps depth to creature pool
function getPoolForDepth(depth) {
    if (depth < 20) return CREATURES.surface;
    if (depth < 55) return CREATURES.mid;
    if (depth < 90) return CREATURES.deep;
    return CREATURES.abyss;
}

// Adjusts location weights based on rod's max depth capability
function adjustWeightsForEquipment(weights, maxDepth) {
    const adjusted = { ...weights };

    // Can't catch creatures from zones beyond equipment capability
    if (maxDepth < 90) adjusted.abyss = 0;
    if (maxDepth < 55) adjusted.deep = 0;
    if (maxDepth < 20) adjusted.mid = 0;

    return adjusted;
}

// Selects a pool based on normalized weights
function selectPoolFromWeights(weights) {
    const total = weights.surface + weights.mid + weights.deep + weights.abyss;
    if (total <= 0) return CREATURES.surface;

    const roll = Math.random();
    let cumulative = 0;

    cumulative += weights.surface / total;
    if (roll < cumulative) return CREATURES.surface;

    cumulative += weights.mid / total;
    if (roll < cumulative) return CREATURES.mid;

    cumulative += weights.deep / total;
    if (roll < cumulative) return CREATURES.deep;

    return CREATURES.abyss;
}

// Checks if lure matches the current zone
function doesLureMatchZone(lure, pool) {
    if (!lure) return false;

    const zoneMap = {
        'surface': CREATURES.surface,
        'mid': CREATURES.mid,
        'deep': CREATURES.deep,
        'abyss': CREATURES.abyss
    };

    return zoneMap[lure.bonus] === pool;
}

// Applies all modifiers to the rarity roll
function applyRollModifiers(baseRoll, pool, lure) {
    let roll = baseRoll;

    // Lure bonus - reduces roll making rarer creatures more likely
    if (doesLureMatchZone(lure, pool)) {
        roll *= lure.multiplier;
    }

    // Location bonus
    const locBonus = game.locationBonuses[game.currentLocation];
    if (locBonus) {
        roll += locBonus.bonus;
    }

    // Transformation bonus
    roll *= getTransformationBiteBonus();

    return roll;
}

// Adds time/weather adjusted rarity to each creature
function createAdjustedPool(pool) {
    return pool.map(creature => ({
        ...creature,
        adjustedRarity: creature.rarity * getCreatureTimeWeatherBonus(creature)
    }));
}

// Selects creature from pool using adjusted rarities
function selectCreatureByRarity(adjustedPool, roll) {
    let remaining = roll;

    for (const creature of adjustedPool) {
        if (remaining <= creature.adjustedRarity) {
            return creature;
        }
        remaining -= creature.adjustedRarity;
    }

    // Fallback to last creature
    return adjustedPool[adjustedPool.length - 1];
}

// ============================================================
// MAIN CREATURE SELECTION
// ============================================================

function getCreature() {
    const rod = getCurrentRod();
    const lure = getCurrentLure();
    const maxDepth = rod ? rod.depthMax : 30;

    // Step 1: Select creature pool
    const locationWeights = getLocationCreaturePool();
    let pool;

    if (locationWeights) {
        const adjustedWeights = adjustWeightsForEquipment(locationWeights, maxDepth);
        pool = selectPoolFromWeights(adjustedWeights);
    } else {
        pool = getPoolForDepth(game.depth);
    }

    // Step 2: Adjust rarities for time/weather
    const adjustedPool = createAdjustedPool(pool);

    // Step 3: Apply modifiers and select creature
    const baseRoll = Math.random();
    const modifiedRoll = applyRollModifiers(baseRoll, pool, lure);

    return selectCreatureByRarity(adjustedPool, modifiedRoll);
}
