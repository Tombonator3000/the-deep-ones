// ============================================================
// THE DEEP ONES - GAME SYSTEMS
// ============================================================

// Weather System
function updateWeather(deltaTime) {
    game.weather.timeUntilChange -= deltaTime;

    if (game.weather.timeUntilChange <= 0) {
        const weathers = Object.keys(WEATHER.types);
        const weights = { clear: 0.35, cloudy: 0.25, rain: 0.2, fog: 0.12, storm: 0.08 };

        if (game.timeOfDay === 'night') weights.storm += 0.1;
        if (game.boatX > 2500) weights.storm += 0.1;
        if (game.sanity < 30) weights.fog += 0.15;

        let roll = Math.random();
        let sum = 0;
        for (const w of weathers) {
            sum += weights[w] || 0.1;
            if (roll <= sum) {
                game.weather.next = w;
                break;
            }
        }

        game.weather.transitionProgress = 0;
        game.weather.timeUntilChange = WEATHER.minDuration + Math.random() * (WEATHER.maxDuration - WEATHER.minDuration);
    }

    if (game.weather.current !== game.weather.next) {
        game.weather.transitionProgress += deltaTime / WEATHER.transitionTime;
        if (game.weather.transitionProgress >= 1) {
            game.weather.current = game.weather.next;
            game.weather.transitionProgress = 0;
        }
    }

    const w = WEATHER.types[game.weather.current];
    if (game.weather.current === 'rain' || game.weather.current === 'storm') {
        game.weather.intensity = Math.min(1, game.weather.intensity + 0.02);
    } else {
        game.weather.intensity = Math.max(0, game.weather.intensity - 0.02);
    }

    if (w.sanityDrain > 0 && game.state !== 'title') {
        game.sanity = Math.max(0, game.sanity - w.sanityDrain);
    }
}

function drawWeatherEffects() {
    if (game.weather.current === 'rain' || game.weather.current === 'storm') {
        ctx.strokeStyle = game.weather.current === 'storm' ? 'rgba(180, 200, 255, 0.4)' : 'rgba(150, 180, 220, 0.3)';
        ctx.lineWidth = game.weather.current === 'storm' ? 2 : 1;

        const drops = game.weather.current === 'storm' ? 150 : 80;
        for (let i = 0; i < drops; i++) {
            const x = (i * 37 + game.time * 3) % CONFIG.canvas.width;
            const y = (i * 53 + game.time * 8) % CONFIG.waterLine;
            const len = game.weather.current === 'storm' ? 15 : 8;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 2, y + len);
            ctx.stroke();
        }
    }

    if (game.weather.current === 'fog') {
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvas.height);
        gradient.addColorStop(0, 'rgba(180, 190, 200, 0.6)');
        gradient.addColorStop(0.5, 'rgba(160, 170, 180, 0.4)');
        gradient.addColorStop(1, 'rgba(140, 150, 160, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    }

    if (game.weather.current === 'storm' && Math.random() < 0.002) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    }
}

// Time Progression
function updateTimeProgression(deltaTime) {
    if (game.timePaused) return;

    game.dayProgress += deltaTime / CONFIG.dayDuration;
    if (game.dayProgress >= 1) game.dayProgress = 0;

    const oldTime = game.timeOfDay;
    if (game.dayProgress < 0.25) game.timeOfDay = 'dawn';
    else if (game.dayProgress < 0.5) game.timeOfDay = 'day';
    else if (game.dayProgress < 0.75) game.timeOfDay = 'dusk';
    else game.timeOfDay = 'night';

    if (oldTime !== game.timeOfDay) initLayers();
}

// Location System
function getCurrentLocation() {
    const x = game.boatX;
    let closest = 'dock';
    let closestDist = Infinity;

    for (const [name, loc] of Object.entries(CONFIG.locations)) {
        const dist = Math.abs(x - loc.x);
        if (dist < closestDist) {
            closestDist = dist;
            closest = name;
        }
    }
    return closest;
}

// Dog System
function updateDog(deltaTime) {
    game.dog.happiness = Math.max(0, game.dog.happiness - 0.001);

    if (game.state === 'reeling') {
        const creature = getCreatureForDepth(game.depth);
        if (creature && creature.rarity < 0.15) {
            game.dog.isBarking = true;
            game.dog.barkReason = 'rare';
            game.dog.animation = 'alert';
        }
    } else if (game.state === 'waiting' && game.depth > 80) {
        if (Math.random() < 0.01) {
            game.dog.isBarking = true;
            game.dog.barkReason = 'danger';
            game.dog.animation = 'alert';
        }
    } else {
        game.dog.isBarking = false;
        game.dog.barkReason = null;

        if (game.dog.happiness > 80) game.dog.animation = 'wag';
        else if (game.dog.happiness < 30) game.dog.animation = 'sleep';
        else game.dog.animation = 'idle';
    }
}

function petDog() {
    game.dog.happiness = Math.min(100, game.dog.happiness + 25);
    game.dog.lastPetTime = game.time;
    game.dog.animation = 'wag';
    game.sanity = Math.min(100, game.sanity + 3);
    game.dog.isBarking = true;
    game.dog.barkReason = 'excited';
    setTimeout(() => { game.dog.isBarking = false; }, 1000);
}

// Lore System
function initLoreBottles() {
    game.loreBottles = [];
    LORE_FRAGMENTS.forEach(lore => {
        if (!lore.found) {
            const loc = CONFIG.locations[lore.location];
            if (loc) {
                game.loreBottles.push({
                    id: lore.id,
                    x: loc.x + (Math.random() - 0.5) * 400,
                    y: CONFIG.waterLine + 20 + Math.random() * 30,
                    bobOffset: Math.random() * Math.PI * 2
                });
            }
        }
    });
}

function updateLoreBottles() {
    game.loreBottles.forEach((bottle, i) => {
        const dist = Math.abs(game.boatX - bottle.x);
        if (dist < 50 && game.state === 'sailing') {
            const lore = LORE_FRAGMENTS.find(l => l.id === bottle.id);
            if (lore && !lore.found) {
                lore.found = true;
                game.loreFound.push(lore.id);
                game.currentLore = lore;
                game.loreBottles.splice(i, 1);
                autoSave();
            }
        }
    });
}

// Minigame System
function startMinigame(creature) {
    game.minigame.active = true;
    game.minigame.targetZone = 0.5;
    game.minigame.playerZone = 0.5;
    game.minigame.tension = 0;
    game.minigame.fishStamina = 100;
    game.minigame.difficulty = 1 - creature.rarity + (creature.sanityLoss / 100);
    game.minigame.zoneSize = Math.max(0.08, 0.2 - game.minigame.difficulty * 0.1);
    game.minigame.speed = 0.015 + game.minigame.difficulty * 0.02;
    game.minigame.direction = Math.random() > 0.5 ? 1 : -1;
    game.pendingCatch = creature;
}

function updateMinigame(deltaTime) {
    if (!game.minigame.active) return;

    const mg = game.minigame;

    mg.targetZone += mg.direction * mg.speed;
    if (mg.targetZone > 0.9 || mg.targetZone < 0.1) mg.direction *= -1;
    if (Math.random() < 0.02) mg.direction *= -1;

    const inZone = Math.abs(mg.playerZone - mg.targetZone) < mg.zoneSize;

    if (inZone) {
        mg.fishStamina -= 0.5;
        mg.tension = Math.min(100, mg.tension + 0.3);
    } else {
        mg.fishStamina = Math.min(100, mg.fishStamina + 0.1);
        mg.tension = Math.max(0, mg.tension - 0.5);
    }

    if (mg.tension >= 100) { endMinigame(false); return; }
    if (mg.fishStamina <= 0) { endMinigame(true); return; }
}

function endMinigame(success) {
    game.minigame.active = false;

    if (success && game.pendingCatch) {
        game.currentCatch = game.pendingCatch;
        game.state = 'caught';

        const lure = getCurrentLure();
        if (lure && lure.count > 0) {
            lure.count--;
            if (lure.count === 0) game.equipment.lure = null;
        }
    } else {
        game.state = 'sailing';
        game.depth = 0;
        document.getElementById('catch-display').textContent = 'It got away...';
        setTimeout(() => { document.getElementById('catch-display').textContent = ''; }, 2000);
    }

    game.pendingCatch = null;
}

// Sanity Effects
function updateSanityEffects() {
    const s = game.sanity;
    const effects = game.sanityEffects;

    effects.screenShake = s < 30 ? (30 - s) / 30 * 3 : 0;
    effects.colorShift = s < 50 ? (50 - s) / 50 : 0;
    effects.vignette = Math.max(0, (70 - s) / 70);
    effects.whispers = s < 25;

    if (s < 20 && Math.random() < 0.001) {
        effects.hallucinations.push({
            x: Math.random() * CONFIG.canvas.width,
            y: CONFIG.waterLine + Math.random() * 200,
            type: 'shadow',
            life: 100
        });
    }

    effects.hallucinations = effects.hallucinations.filter(h => {
        h.life--;
        return h.life > 0;
    });
}

function drawSanityEffects() {
    const effects = game.sanityEffects;

    if (effects.screenShake > 0) {
        ctx.save();
        const shakeX = (Math.random() - 0.5) * effects.screenShake * 2;
        const shakeY = (Math.random() - 0.5) * effects.screenShake * 2;
        ctx.translate(shakeX, shakeY);
    }

    effects.hallucinations.forEach(h => {
        const alpha = h.life / 100 * 0.3;
        ctx.fillStyle = `rgba(30, 20, 40, ${alpha})`;
        if (h.type === 'shadow') {
            ctx.beginPath();
            ctx.ellipse(h.x, h.y, 20, 40, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(200, 50, 50, ${alpha})`;
            ctx.fillRect(h.x - 8, h.y - 15, 4, 4);
            ctx.fillRect(h.x + 4, h.y - 15, 4, 4);
        }
    });

    if (effects.vignette > 0) {
        const gradient = ctx.createRadialGradient(
            CONFIG.canvas.width/2, CONFIG.canvas.height/2, 100,
            CONFIG.canvas.width/2, CONFIG.canvas.height/2, CONFIG.canvas.width * 0.7
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, `rgba(10, 5, 15, ${effects.vignette * 0.7})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    }

    if (effects.whispers && Math.random() < 0.01) {
        const whispers = ["come deeper...", "we see you...", "join us...", "the water remembers...", "do you hear us?", "look below..."];
        const whisper = whispers[Math.floor(Math.random() * whispers.length)];
        ctx.font = '14px VT323';
        ctx.fillStyle = `rgba(150, 100, 120, ${0.3 + Math.random() * 0.3})`;
        ctx.fillText(whisper, Math.random() * CONFIG.canvas.width, Math.random() * CONFIG.canvas.height);
    }

    if (effects.screenShake > 0) ctx.restore();
}
