// ============================================================
// THE DEEP ONES - RANDOM EVENTS SYSTEM
// ============================================================

// Event definitions
const EVENTS = {
    // Positive events
    floatingDebris: {
        id: 'debris',
        name: 'Floating Debris',
        description: 'You spot something floating nearby...',
        rarity: 0.15,
        conditions: { state: 'sailing' },
        duration: 300,
        visual: 'debris',
        onTrigger: function() {
            const goldFound = 5 + Math.floor(Math.random() * 15);
            game.money += goldFound;
            game.achievements.stats.totalGoldEarned += goldFound;
            addSoundEffect(`Found ${goldFound}g!`, CONFIG.canvas.width / 2, 200, {
                color: '#ffd700',
                size: 16,
                duration: 90
            });
            if (typeof playPurchase === 'function') playPurchase();
        }
    },

    whaleSighting: {
        id: 'whale',
        name: 'Whale Sighting',
        description: 'A majestic whale surfaces in the distance...',
        rarity: 0.05,
        conditions: { state: 'sailing', minX: 1500 },
        duration: 400,
        visual: 'whale',
        onTrigger: function() {
            game.sanity = Math.min(100, game.sanity + 10);
            addSoundEffect('A peaceful moment...', CONFIG.canvas.width / 2, 200, {
                color: '#80c0e0',
                size: 14,
                duration: 120
            });
        }
    },

    seagullLanding: {
        id: 'seagull',
        name: 'Seagull Visit',
        description: 'A seagull lands on your boat.',
        rarity: 0.1,
        conditions: { state: 'sailing', location: ['shallows', 'dock', 'sunsetCove'] },
        duration: 200,
        visual: 'seagull',
        onTrigger: function() {
            game.dog.isBarking = true;
            game.dog.barkReason = 'excited';
            game.dog.happiness = Math.min(100, game.dog.happiness + 10);
            if (typeof playBark === 'function') playBark();
            setTimeout(() => { game.dog.isBarking = false; }, 2000);
        }
    },

    schoolOfFish: {
        id: 'school',
        name: 'School of Fish',
        description: 'A large school of fish passes beneath you!',
        rarity: 0.1,
        conditions: { state: 'waiting' },
        duration: 180,
        visual: 'fishSchool',
        onTrigger: function() {
            // Increase bite chance temporarily
            game.events.fishSchoolBonus = 150;
            addSoundEffect('Increased bite chance!', CONFIG.canvas.width / 2, 200, {
                color: '#80e0a0',
                size: 14,
                duration: 90
            });
        }
    },

    // Neutral/Atmospheric events
    ghostShip: {
        id: 'ghost_ship',
        name: 'Ghost Ship',
        description: 'A spectral vessel drifts through the fog...',
        rarity: 0.03,
        conditions: { state: 'sailing', timeOfDay: 'night', location: ['shipwreck', 'trench'] },
        duration: 500,
        visual: 'ghostShip',
        onTrigger: function() {
            game.sanity = Math.max(0, game.sanity - 5);
            game.storyFlags.sawVision = true;
            if (typeof playDeepRumble === 'function') playDeepRumble();
        }
    },

    cultRitual: {
        id: 'ritual',
        name: 'Distant Ritual',
        description: 'Strange chanting echoes across the water...',
        rarity: 0.02,
        conditions: { state: 'sailing', location: ['void', 'trench'], timeOfDay: 'night' },
        duration: 600,
        visual: 'ritual',
        onTrigger: function() {
            game.sanity = Math.max(0, game.sanity - 8);
            game.storyFlags.heardWhispers = true;
            if (typeof playDeepRumble === 'function') playDeepRumble();
        }
    },

    strangeLights: {
        id: 'lights',
        name: 'Strange Lights',
        description: 'Eerie lights dance beneath the waves...',
        rarity: 0.05,
        conditions: { state: 'sailing', timeOfDay: ['dusk', 'night'], minX: 2000 },
        duration: 350,
        visual: 'lights',
        onTrigger: function() {
            game.sanity = Math.max(0, game.sanity - 3);
        }
    },

    ancientWhispers: {
        id: 'whispers',
        name: 'Ancient Whispers',
        description: 'You hear voices from the deep...',
        rarity: 0.04,
        conditions: { state: 'waiting', depth: 60, sanity: { max: 50 } },
        duration: 400,
        visual: 'whispers',
        onTrigger: function() {
            game.storyFlags.heardWhispers = true;
            if (typeof playDeepRumble === 'function') playDeepRumble();
        }
    },

    // Weather-based events
    rainbowSighting: {
        id: 'rainbow',
        name: 'Rainbow',
        description: 'A rainbow appears after the rain.',
        rarity: 0.08,
        conditions: { weather: 'clear', previousWeather: 'rain' },
        duration: 300,
        visual: 'rainbow',
        onTrigger: function() {
            game.sanity = Math.min(100, game.sanity + 5);
        }
    },

    seaMonsterGlimpse: {
        id: 'monster',
        name: 'Something Stirs',
        description: 'Something massive moves in the depths...',
        rarity: 0.02,
        conditions: { state: 'sailing', location: ['void'], sanity: { max: 40 } },
        duration: 400,
        visual: 'monster',
        onTrigger: function() {
            game.sanity = Math.max(0, game.sanity - 10);
            game.storyFlags.sawVision = true;
            game.dog.isBarking = true;
            game.dog.barkReason = 'danger';
            if (typeof playWhimper === 'function') playWhimper();
            setTimeout(() => { game.dog.isBarking = false; }, 3000);
        }
    },

    // Bonus events
    luckyFind: {
        id: 'lucky',
        name: 'Lucky Find',
        description: 'Your line snags on something valuable!',
        rarity: 0.03,
        conditions: { state: 'waiting' },
        duration: 120,
        visual: 'sparkle',
        onTrigger: function() {
            const goldFound = 20 + Math.floor(Math.random() * 30);
            game.money += goldFound;
            game.achievements.stats.totalGoldEarned += goldFound;
            addSoundEffect(`Found ${goldFound}g treasure!`, CONFIG.canvas.width / 2, 200, {
                color: '#ffd700',
                size: 18,
                duration: 100
            });
            if (typeof playAchievement === 'function') playAchievement();
        }
    },

    dogFindsItem: {
        id: 'dogFind',
        name: 'Good Boy!',
        description: 'Your dog found something on the boat!',
        rarity: 0.05,
        conditions: { state: 'sailing', dogHappiness: { min: 70 } },
        duration: 150,
        visual: 'dogFind',
        onTrigger: function() {
            const items = [
                { type: 'gold', amount: 10, text: 'Found 10g!' },
                { type: 'gold', amount: 25, text: 'Found 25g!' },
                { type: 'lure', id: 'worm', text: 'Found a worm bait!' }
            ];
            const item = items[Math.floor(Math.random() * items.length)];

            if (item.type === 'gold') {
                game.money += item.amount;
                game.achievements.stats.totalGoldEarned += item.amount;
            } else if (item.type === 'lure') {
                const lure = SHOP.lures.find(l => l.id === item.id);
                if (lure) lure.count++;
            }

            addSoundEffect(item.text, CONFIG.canvas.width / 2, 200, {
                color: '#80e080',
                size: 14,
                duration: 90
            });
            if (typeof playHappyBark === 'function') playHappyBark();
        }
    }
};

// Event state
const eventState = {
    activeEvent: null,
    eventTimer: 0,
    cooldown: 0,
    previousWeather: 'clear',
    fishSchoolBonus: 0
};

// Check conditions for an event
function checkEventConditions(event) {
    const cond = event.conditions;
    if (!cond) return true;

    // State check
    if (cond.state && game.state !== cond.state) return false;

    // Location check
    if (cond.location) {
        const locs = Array.isArray(cond.location) ? cond.location : [cond.location];
        if (!locs.includes(game.currentLocation)) return false;
    }

    // Time of day check
    if (cond.timeOfDay) {
        const times = Array.isArray(cond.timeOfDay) ? cond.timeOfDay : [cond.timeOfDay];
        if (!times.includes(game.timeOfDay)) return false;
    }

    // Weather check
    if (cond.weather && game.weather.current !== cond.weather) return false;

    // Previous weather check
    if (cond.previousWeather && eventState.previousWeather !== cond.previousWeather) return false;

    // Position check
    if (cond.minX && game.boatX < cond.minX) return false;
    if (cond.maxX && game.boatX > cond.maxX) return false;

    // Depth check
    if (cond.depth && game.depth < cond.depth) return false;

    // Sanity check
    if (cond.sanity) {
        if (cond.sanity.min && game.sanity < cond.sanity.min) return false;
        if (cond.sanity.max && game.sanity > cond.sanity.max) return false;
    }

    // Dog happiness check
    if (cond.dogHappiness) {
        if (cond.dogHappiness.min && game.dog.happiness < cond.dogHappiness.min) return false;
    }

    return true;
}

// Try to trigger a random event
function tryTriggerEvent() {
    if (eventState.activeEvent || eventState.cooldown > 0) return;
    if (game.state === 'title' || game.state === 'ending') return;
    if (game.shop.open || game.villageMenu.open || game.journal.open) return;

    // Base chance for any event
    if (Math.random() > 0.001) return;  // Very low base chance per frame

    // Get eligible events
    const eligibleEvents = Object.values(EVENTS).filter(event => {
        if (Math.random() > event.rarity) return false;
        return checkEventConditions(event);
    });

    if (eligibleEvents.length === 0) return;

    // Pick random eligible event
    const event = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
    triggerEvent(event);
}

// Trigger a specific event
function triggerEvent(event) {
    eventState.activeEvent = event;
    eventState.eventTimer = event.duration;

    // Show event message
    addSoundEffect(event.description, CONFIG.canvas.width / 2, 150, {
        color: '#c0d0e0',
        size: 16,
        duration: 120,
        rise: false
    });

    // Execute event effect
    if (event.onTrigger) {
        event.onTrigger();
    }
}

// Update events system
function updateEvents(deltaTime) {
    // Update cooldown
    if (eventState.cooldown > 0) {
        eventState.cooldown -= deltaTime;
    }

    // Update active event
    if (eventState.activeEvent) {
        eventState.eventTimer -= deltaTime;
        if (eventState.eventTimer <= 0) {
            eventState.cooldown = 5000 + Math.random() * 10000;  // 5-15 second cooldown
            eventState.activeEvent = null;
        }
    }

    // Update fish school bonus
    if (eventState.fishSchoolBonus > 0) {
        eventState.fishSchoolBonus--;
    }

    // Track weather changes
    if (game.weather.current !== eventState.previousWeather) {
        eventState.previousWeather = game.weather.current;
    }

    // Try to trigger new event
    tryTriggerEvent();
}

// Draw event visuals
function drawEventVisuals() {
    if (!eventState.activeEvent) return;

    const event = eventState.activeEvent;
    const progress = eventState.eventTimer / event.duration;

    switch (event.visual) {
        case 'debris':
            drawFloatingDebris(progress);
            break;
        case 'whale':
            drawWhale(progress);
            break;
        case 'seagull':
            drawSeagull(progress);
            break;
        case 'fishSchool':
            drawFishSchool(progress);
            break;
        case 'ghostShip':
            drawGhostShip(progress);
            break;
        case 'ritual':
            drawRitual(progress);
            break;
        case 'lights':
            drawStrangeLights(progress);
            break;
        case 'rainbow':
            drawRainbow(progress);
            break;
        case 'monster':
            drawMonsterGlimpse(progress);
            break;
        case 'sparkle':
            drawSparkle(progress);
            break;
    }
}

// Visual drawing functions
function drawFloatingDebris(progress) {
    const alpha = Math.min(1, progress * 2) * Math.min(1, (1 - progress) * 3);
    const x = game.boatX - game.cameraX + 100;
    const y = CONFIG.waterLine + 10 + Math.sin(game.time * 0.01) * 5;

    ctx.fillStyle = `rgba(100, 80, 60, ${alpha})`;
    ctx.fillRect(x - 10, y - 5, 20, 10);
    ctx.fillStyle = `rgba(150, 130, 100, ${alpha})`;
    ctx.fillRect(x - 8, y - 8, 16, 3);
}

function drawWhale(progress) {
    const alpha = Math.min(1, progress * 2) * Math.min(1, (1 - progress) * 2);
    const baseX = game.boatX - game.cameraX + 300;
    const y = CONFIG.waterLine + 20;

    ctx.fillStyle = `rgba(40, 50, 60, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(baseX, y, 80, 25, 0, 0, Math.PI);
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(baseX + 60, y);
    ctx.lineTo(baseX + 100, y - 20);
    ctx.lineTo(baseX + 100, y + 10);
    ctx.closePath();
    ctx.fill();

    // Water spout
    if (progress > 0.3 && progress < 0.7) {
        ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.5})`;
        const spoutHeight = (progress - 0.3) * 100;
        ctx.beginPath();
        ctx.moveTo(baseX - 30, y - 20);
        ctx.lineTo(baseX - 35, y - 20 - spoutHeight);
        ctx.lineTo(baseX - 25, y - 20 - spoutHeight);
        ctx.closePath();
        ctx.fill();
    }
}

function drawSeagull(progress) {
    const alpha = Math.min(1, progress * 3) * Math.min(1, (1 - progress) * 3);
    const boatX = game.boatX - game.cameraX;
    const x = boatX + 20;
    const y = CONFIG.waterLine - 45 + Math.sin(game.time * 0.02) * 2;

    // Body
    ctx.fillStyle = `rgba(240, 240, 240, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(x + 6, y - 3, 4, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = `rgba(255, 180, 50, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x + 10, y - 3);
    ctx.lineTo(x + 15, y - 2);
    ctx.lineTo(x + 10, y - 1);
    ctx.closePath();
    ctx.fill();
}

function drawFishSchool(progress) {
    const alpha = Math.min(1, progress * 2) * Math.min(1, (1 - progress) * 2);
    const centerX = game.boatX - game.cameraX + 50;
    const centerY = CONFIG.waterLine + 80;

    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + game.time * 0.002;
        const radius = 30 + Math.sin(i * 1.5 + game.time * 0.003) * 15;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.5;

        ctx.fillStyle = `rgba(150, 180, 200, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.ellipse(x, y, 4, 2, angle, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawGhostShip(progress) {
    const alpha = Math.min(0.4, progress) * Math.min(1, (1 - progress) * 2);
    const x = game.boatX - game.cameraX + 400;
    const y = CONFIG.waterLine - 30;

    ctx.fillStyle = `rgba(150, 180, 200, ${alpha})`;

    // Hull
    ctx.beginPath();
    ctx.moveTo(x - 50, y);
    ctx.lineTo(x - 40, y + 20);
    ctx.lineTo(x + 40, y + 20);
    ctx.lineTo(x + 50, y);
    ctx.closePath();
    ctx.fill();

    // Mast
    ctx.fillRect(x - 3, y - 60, 6, 60);

    // Sail (tattered)
    ctx.fillStyle = `rgba(180, 190, 200, ${alpha * 0.7})`;
    ctx.beginPath();
    ctx.moveTo(x + 5, y - 55);
    ctx.lineTo(x + 40, y - 30);
    ctx.lineTo(x + 5, y - 10);
    ctx.closePath();
    ctx.fill();
}

function drawRitual(progress) {
    const alpha = Math.min(0.5, progress) * Math.min(1, (1 - progress) * 2);

    // Glowing orbs in the distance
    for (let i = 0; i < 5; i++) {
        const x = CONFIG.canvas.width - 100 + Math.sin(game.time * 0.002 + i) * 20;
        const y = CONFIG.waterLine - 50 + Math.cos(game.time * 0.003 + i * 2) * 10;

        ctx.fillStyle = `rgba(100, 255, 150, ${alpha * (0.3 + Math.sin(game.time * 0.01 + i) * 0.2)})`;
        ctx.beginPath();
        ctx.arc(x, y, 3 + i, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawStrangeLights(progress) {
    const alpha = Math.min(0.6, progress) * Math.min(1, (1 - progress) * 2);

    for (let i = 0; i < 8; i++) {
        const x = game.boatX - game.cameraX + 100 + i * 50 + Math.sin(game.time * 0.005 + i) * 30;
        const y = CONFIG.waterLine + 50 + Math.sin(game.time * 0.003 + i * 2) * 20;
        const hue = (game.time * 0.1 + i * 30) % 360;

        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, 5 + Math.sin(game.time * 0.01 + i) * 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawRainbow(progress) {
    const alpha = Math.min(0.4, progress) * Math.min(1, (1 - progress) * 2);
    const centerX = CONFIG.canvas.width / 2;
    const centerY = CONFIG.waterLine + 100;

    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];

    colors.forEach((color, i) => {
        ctx.strokeStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 200 + i * 8, Math.PI, 0);
        ctx.stroke();
    });
}

function drawMonsterGlimpse(progress) {
    const alpha = Math.min(0.3, progress * 0.5) * Math.min(1, (1 - progress) * 3);
    const x = game.boatX - game.cameraX + 200;
    const y = CONFIG.waterLine + 100;

    // Massive shadow
    ctx.fillStyle = `rgba(20, 30, 40, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 150, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing eye
    if (progress > 0.3 && progress < 0.7) {
        ctx.fillStyle = `rgba(255, 100, 50, ${alpha * 2})`;
        ctx.beginPath();
        ctx.arc(x - 50, y - 10, 8, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawSparkle(progress) {
    const alpha = Math.min(1, progress * 3) * Math.min(1, (1 - progress) * 3);
    const boatX = game.boatX - game.cameraX + 60;
    const y = CONFIG.waterLine + 20;

    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + game.time * 0.01;
        const radius = 10 + Math.sin(game.time * 0.02 + i) * 5;
        const sx = boatX + Math.cos(angle) * radius;
        const sy = y + Math.sin(angle) * radius;

        ctx.fillStyle = `rgba(255, 215, 100, ${alpha})`;
        ctx.font = '12px VT323';
        ctx.fillText('✦', sx, sy);
    }
}

// Get current fish school bite bonus
function getFishSchoolBonus() {
    return eventState.fishSchoolBonus > 0 ? 1.5 : 1;
}
