// ============================================================
// THE DEEP ONES - GAME SYSTEMS
// ============================================================

// ============================================================
// CELESTIAL ORBIT SYSTEM - Sun/Moon arc across the sky
// ============================================================

/**
 * Beregner sol-posisjon basert på dayProgress
 * Solen er synlig fra dawn (0) til dusk (0.75)
 * Den følger en bue: stiger i dawn, høyest midt på dagen, går ned i dusk
 */
function getSunPosition() {
    const progress = game.dayProgress;

    // Solen er synlig fra 0 (dawn start) til 0.75 (dusk slutt)
    // Den er "under horisonten" fra 0.75 til 1.0 (natt)

    // Normaliser progress til solens synlige periode (0 til 0.75)
    // 0 = soloppgang (øst/høyre), 0.375 = middag (senit), 0.75 = solnedgang (vest/venstre)

    if (progress >= 0.75) {
        // Natt - solen er under horisonten
        return null;
    }

    // Normaliser til 0-1 for solens bane
    const sunProgress = progress / 0.75;

    // X-posisjon: beveger seg fra høyre (øst) til venstre (vest)
    // Start ved høyre kant, slutt ved venstre kant
    const sunX = CONFIG.canvas.width - (sunProgress * CONFIG.canvas.width * 1.2) + 100;

    // Y-posisjon: følger en omvendt parabel (bue)
    // Lavest ved sunrise/sunset, høyest midt på dagen
    // Bruker sinus for en naturlig bue
    const arcHeight = 200; // Hvor høyt solen stiger over horisonten
    const horizonY = 220;  // Horisontnivå
    const minY = 50;       // Høyeste punkt (laveste y-verdi)

    // Sin-bue: 0 ved start/slutt, 1 ved midten
    const arcProgress = Math.sin(sunProgress * Math.PI);
    const sunY = horizonY - (arcProgress * arcHeight);

    // Beregn hvor langt solen er fra horisonten (for farge/intensitet)
    const heightRatio = arcProgress; // 0 = horisont, 1 = senit

    return {
        x: sunX,
        y: Math.max(minY, sunY),
        heightRatio: heightRatio,
        progress: sunProgress,
        isRising: sunProgress < 0.5,
        isSetting: sunProgress >= 0.5
    };
}

/**
 * Beregner måne-posisjon basert på dayProgress
 * Månen er synlig fra dusk (0.5) gjennom natten til dawn (0.25)
 */
function getMoonPosition() {
    const progress = game.dayProgress;

    // Månen er synlig fra ca 0.5 (dusk midten) til 0.25 neste dag
    // Vi "wrapper" rundt midnatt

    let moonProgress;
    let visible = false;

    if (progress >= 0.5) {
        // Fra dusk til midnatt: 0.5 -> 1.0 mapper til 0 -> 0.5 av månebanen
        moonProgress = (progress - 0.5) / 0.5 * 0.5;
        visible = true;
    } else if (progress < 0.25) {
        // Fra midnatt til dawn: 0 -> 0.25 mapper til 0.5 -> 1.0 av månebanen
        moonProgress = 0.5 + (progress / 0.25) * 0.5;
        visible = true;
    } else {
        // Dagtid - månen er ikke synlig
        return null;
    }

    if (!visible) return null;

    // X-posisjon: beveger seg fra øst (høyre) til vest (venstre)
    const moonX = CONFIG.canvas.width - (moonProgress * CONFIG.canvas.width * 1.1) + 50;

    // Y-posisjon: bue over himmelen
    const arcHeight = 180;
    const horizonY = 200;
    const minY = 60;

    const arcProgress = Math.sin(moonProgress * Math.PI);
    const moonY = horizonY - (arcProgress * arcHeight);

    return {
        x: moonX,
        y: Math.max(minY, moonY),
        heightRatio: arcProgress,
        progress: moonProgress,
        isRising: moonProgress < 0.5,
        isSetting: moonProgress >= 0.5
    };
}

/**
 * Beregner solfarge basert på høyde
 * Lav = oransje/rød (soloppgang/nedgang)
 * Høy = gul/hvit (midt på dagen)
 */
function getSunColor(heightRatio) {
    // heightRatio: 0 = horisont, 1 = senit

    if (heightRatio < 0.3) {
        // Nær horisonten - varm oransje/rød
        const t = heightRatio / 0.3;
        return {
            core: lerpColor('#ff6030', '#ffc060', t),
            glow: lerpColor('rgba(255, 80, 40, 0.6)', 'rgba(255, 200, 100, 0.4)', t),
            size: 35 - (t * 5) // Større ved horisonten (atmosfærisk effekt)
        };
    } else if (heightRatio < 0.7) {
        // Midthøyde - gul
        const t = (heightRatio - 0.3) / 0.4;
        return {
            core: lerpColor('#ffc060', '#ffffa0', t),
            glow: lerpColor('rgba(255, 200, 100, 0.4)', 'rgba(255, 255, 200, 0.3)', t),
            size: 30
        };
    } else {
        // Senit - lys gul/hvit
        const t = (heightRatio - 0.7) / 0.3;
        return {
            core: lerpColor('#ffffa0', '#fffff0', t),
            glow: lerpColor('rgba(255, 255, 200, 0.3)', 'rgba(255, 255, 240, 0.25)', t),
            size: 28
        };
    }
}

/**
 * Hjelpefunksjon for å interpolere mellom to farger
 */
function lerpColor(color1, color2, t) {
    // Enkel implementasjon - returner color1 eller color2 basert på t
    // For en jevnere overgang kunne vi parse RGB-verdier
    if (t < 0.5) return color1;
    return color2;
}

/**
 * Mer presis farge-interpolering for hex-farger
 */
function lerpHexColor(hex1, hex2, t) {
    // Parse hex to RGB
    const r1 = parseInt(hex1.slice(1, 3), 16);
    const g1 = parseInt(hex1.slice(3, 5), 16);
    const b1 = parseInt(hex1.slice(5, 7), 16);

    const r2 = parseInt(hex2.slice(1, 3), 16);
    const g2 = parseInt(hex2.slice(3, 5), 16);
    const b2 = parseInt(hex2.slice(5, 7), 16);

    // Interpolate
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Converts hex color to rgba string
 * @param {string} hex - Hex color like '#2a2040'
 * @param {number} alpha - Alpha value 0-1
 * @returns {string} - rgba string like 'rgba(42, 32, 64, 0.5)'
 */
function hexToRgba(hex, alpha) {
    if (!hex || typeof hex !== 'string') {
        return `rgba(100, 150, 200, ${alpha})`;  // Fallback color
    }
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Beregner månefarge/lysstyrke
 */
function getMoonColor(heightRatio) {
    // Månen er mer dempet ved horisonten
    const baseAlpha = 0.3 + heightRatio * 0.3;

    return {
        core: '#e0e8f0',
        glow: `rgba(200, 210, 230, ${0.1 + heightRatio * 0.1})`,
        size: 25 + (1 - heightRatio) * 5 // Litt større ved horisonten
    };
}

// ============================================================
// SOUND EFFECT TEXT SYSTEM
// ============================================================

function addSoundEffect(text, x, y, options = {}) {
    const effect = {
        text: text,
        x: x || CONFIG.canvas.width / 2,
        y: y || CONFIG.canvas.height / 2,
        timer: options.duration || 60,
        maxTimer: options.duration || 60,
        color: options.color || '#c0d0c0',
        size: options.size || 14,
        rise: options.rise !== false,  // Default to rising
        italic: options.italic || false
    };
    game.soundEffects.push(effect);
}

function updateSoundEffects() {
    game.soundEffects = game.soundEffects.filter(effect => {
        effect.timer--;
        if (effect.rise) {
            effect.y -= 0.5;
        }
        return effect.timer > 0;
    });
}

function drawSoundEffects() {
    game.soundEffects.forEach(effect => {
        const alpha = Math.min(1, effect.timer / 20);
        ctx.fillStyle = effect.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        if (effect.color.startsWith('#')) {
            // Convert hex to rgba
            const hex = effect.color.slice(1);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        ctx.font = `${effect.italic ? 'italic ' : ''}${effect.size}px VT323`;
        ctx.textAlign = 'center';
        ctx.fillText(effect.text, effect.x, effect.y);
        ctx.textAlign = 'left';
    });
}

// Trigger sound effects based on game events
function triggerSplashSound() {
    const boatScreenX = game.boatX - game.cameraX;
    addSoundEffect('*splash*', boatScreenX + 60, CONFIG.waterLine + 30, {
        color: '#80b0c0',
        duration: 45,
        size: 12
    });
}

function triggerCreakSound() {
    const boatScreenX = game.boatX - game.cameraX;
    addSoundEffect('*creak*', boatScreenX, CONFIG.waterLine - 30, {
        color: '#8a7a6a',
        duration: 40,
        size: 11,
        italic: true
    });
}

function triggerBiteSound() {
    const boatScreenX = game.boatX - game.cameraX;
    addSoundEffect('*BITE!*', boatScreenX + 60, CONFIG.waterLine + 50, {
        color: '#f0a060',
        duration: 50,
        size: 16
    });
}

function triggerReelSound() {
    const boatScreenX = game.boatX - game.cameraX;
    addSoundEffect('*whirrrr*', boatScreenX + 30, CONFIG.waterLine - 40, {
        color: '#a0a080',
        duration: 30,
        size: 10,
        italic: true
    });
}

function triggerCatchSound(isRare) {
    const boatScreenX = game.boatX - game.cameraX;
    if (isRare) {
        addSoundEffect('*CAUGHT!*', boatScreenX, CONFIG.waterLine - 60, {
            color: '#ffd700',
            duration: 60,
            size: 18
        });
    } else {
        addSoundEffect('*caught!*', boatScreenX, CONFIG.waterLine - 50, {
            color: '#80c080',
            duration: 50,
            size: 14
        });
    }
}

function triggerThunderSound() {
    addSoundEffect('*KRAKA-BOOM*', CONFIG.canvas.width / 2, 80, {
        color: '#e0e0ff',
        duration: 80,
        size: 20,
        rise: false
    });
}

function triggerWaveSound() {
    addSoundEffect('*whoosh*', 100 + Math.random() * 800, CONFIG.waterLine + 10, {
        color: '#6090a0',
        duration: 35,
        size: 10,
        italic: true
    });
}

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
    // Rain and storm effects
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

        // Rain ripples on water surface
        for (let i = 0; i < 15; i++) {
            const rippleX = (i * 73 + game.time * 0.5) % CONFIG.canvas.width;
            const ripplePhase = (game.time * 0.01 + i * 0.5) % 1;
            const rippleSize = ripplePhase * 8;
            const rippleAlpha = (1 - ripplePhase) * 0.3;

            ctx.strokeStyle = `rgba(200, 220, 255, ${rippleAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(rippleX, CONFIG.waterLine + 5, rippleSize, rippleSize * 0.3, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // Rolling fog effect
    if (game.weather.current === 'fog') {
        // Multiple fog layers moving at different speeds
        for (let layer = 0; layer < 3; layer++) {
            const layerOffset = (game.time * 0.01 * (layer + 1)) % CONFIG.canvas.width;
            const layerAlpha = 0.15 + layer * 0.1;

            const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvas.height);
            gradient.addColorStop(0, `rgba(180, 190, 200, ${layerAlpha})`);
            gradient.addColorStop(0.5, `rgba(160, 170, 180, ${layerAlpha * 0.7})`);
            gradient.addColorStop(1, `rgba(140, 150, 160, ${layerAlpha * 0.5})`);

            // Wavy fog shapes
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, CONFIG.waterLine * 0.3);
            for (let x = 0; x <= CONFIG.canvas.width; x += 50) {
                const waveY = CONFIG.waterLine * 0.3 + Math.sin((x + layerOffset) * 0.01) * 30 + layer * 40;
                ctx.lineTo(x, waveY);
            }
            ctx.lineTo(CONFIG.canvas.width, CONFIG.canvas.height);
            ctx.lineTo(0, CONFIG.canvas.height);
            ctx.closePath();
            ctx.fill();
        }

        // Fog at water level
        const waterFogGrad = ctx.createLinearGradient(0, CONFIG.waterLine - 30, 0, CONFIG.waterLine + 50);
        waterFogGrad.addColorStop(0, 'transparent');
        waterFogGrad.addColorStop(0.5, 'rgba(180, 190, 200, 0.4)');
        waterFogGrad.addColorStop(1, 'rgba(160, 170, 180, 0.2)');
        ctx.fillStyle = waterFogGrad;
        ctx.fillRect(0, CONFIG.waterLine - 30, CONFIG.canvas.width, 80);
    }

    // Enhanced lightning effect for storms
    if (game.weather.current === 'storm') {
        // Random lightning flashes
        if (Math.random() < 0.003) {
            game.weather.lightningFlash = 1;
            triggerThunderSound();
        }

        if (game.weather.lightningFlash > 0) {
            // Bright flash
            ctx.fillStyle = `rgba(255, 255, 255, ${game.weather.lightningFlash * 0.4})`;
            ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

            // Lightning bolt
            if (game.weather.lightningFlash > 0.8) {
                drawLightningBolt();
            }

            game.weather.lightningFlash -= 0.05;
        }
    }
}

// Draw a procedural lightning bolt
function drawLightningBolt() {
    const startX = 100 + Math.random() * (CONFIG.canvas.width - 200);
    let x = startX;
    let y = 0;

    ctx.strokeStyle = 'rgba(255, 255, 220, 0.9)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(200, 220, 255, 0.8)';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(x, y);

    while (y < CONFIG.waterLine - 50) {
        y += 20 + Math.random() * 30;
        x += (Math.random() - 0.5) * 40;
        ctx.lineTo(x, y);

        // Branch occasionally
        if (Math.random() < 0.3) {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);

            // Draw branch
            let bx = x, by = y;
            for (let i = 0; i < 3; i++) {
                bx += (Math.random() - 0.5) * 30 + (Math.random() > 0.5 ? 15 : -15);
                by += 15 + Math.random() * 20;
                ctx.lineTo(bx, by);
            }
            ctx.stroke();

            // Continue main bolt
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
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

    // Track pet count for achievement
    game.achievements.stats.petCount++;

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
// Minigame types for different zones
const MINIGAME_TYPES = {
    surface: {
        name: 'standard',
        description: 'Keep the marker in the zone!',
        staminaDrain: 0.5,
        tensionGain: 0.3
    },
    mid: {
        name: 'erratic',
        description: 'The fish moves unpredictably!',
        staminaDrain: 0.4,
        tensionGain: 0.35,
        erraticChance: 0.05  // Chance to suddenly change direction
    },
    deep: {
        name: 'tugOfWar',
        description: 'Fight against the pull!',
        staminaDrain: 0.35,
        tensionGain: 0.4,
        pullStrength: 0.02  // Constant pull on player zone
    },
    abyss: {
        name: 'tentacles',
        description: 'Avoid the interference!',
        staminaDrain: 0.3,
        tensionGain: 0.5,
        interferenceChance: 0.03  // Chance to obscure part of the bar
    }
};

function getMinigameType(creature) {
    // Determine minigame type based on creature value
    if (creature.value >= 500) return MINIGAME_TYPES.abyss;
    if (creature.value >= 180) return MINIGAME_TYPES.deep;
    if (creature.value >= 60) return MINIGAME_TYPES.mid;
    return MINIGAME_TYPES.surface;
}

function startMinigame(creature) {
    const mgType = getMinigameType(creature);

    game.minigame.active = true;
    game.minigame.type = mgType.name;
    game.minigame.targetZone = 0.5;
    game.minigame.playerZone = 0.5;
    game.minigame.tension = 0;
    game.minigame.fishStamina = 100;
    game.minigame.difficulty = 1 - creature.rarity + (creature.sanityLoss / 100);
    game.minigame.zoneSize = Math.max(0.08, 0.2 - game.minigame.difficulty * 0.1);
    game.minigame.speed = 0.015 + game.minigame.difficulty * 0.02;
    game.minigame.direction = Math.random() > 0.5 ? 1 : -1;
    game.minigame.staminaDrain = mgType.staminaDrain;
    game.minigame.tensionGain = mgType.tensionGain;
    game.minigame.interference = null;  // For abyss type
    game.minigame.pull = 0;  // For deep type
    game.pendingCatch = creature;

    // Trigger bite sound
    triggerBiteSound();
}

function updateMinigame(deltaTime) {
    if (!game.minigame.active) return;

    const mg = game.minigame;

    // Base movement
    mg.targetZone += mg.direction * mg.speed;
    if (mg.targetZone > 0.9 || mg.targetZone < 0.1) mg.direction *= -1;

    // Type-specific behaviors
    switch (mg.type) {
        case 'erratic':
            // More frequent direction changes
            if (Math.random() < 0.05) mg.direction *= -1;
            // Occasional speed bursts
            if (Math.random() < 0.02) {
                mg.targetZone += mg.direction * 0.1;
                mg.targetZone = Math.max(0.1, Math.min(0.9, mg.targetZone));
            }
            break;

        case 'tugOfWar':
            // Constant pull towards center or edge
            mg.pull = Math.sin(game.time * 0.003) * 0.015;
            mg.playerZone += mg.pull;
            mg.playerZone = Math.max(0, Math.min(1, mg.playerZone));
            break;

        case 'tentacles':
            // Create interference zones that block visibility
            if (!mg.interference && Math.random() < 0.02) {
                mg.interference = {
                    position: Math.random(),
                    size: 0.15 + Math.random() * 0.1,
                    timer: 60
                };
            }
            if (mg.interference) {
                mg.interference.timer--;
                if (mg.interference.timer <= 0) mg.interference = null;
            }
            break;

        default:
            // Standard: occasional direction change
            if (Math.random() < 0.02) mg.direction *= -1;
    }

    const inZone = Math.abs(mg.playerZone - mg.targetZone) < mg.zoneSize;

    if (inZone) {
        mg.fishStamina -= mg.staminaDrain;
        mg.tension = Math.min(100, mg.tension + mg.tensionGain);
        // Occasional reel sound
        if (Math.random() < 0.03) triggerReelSound();
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

        // Trigger catch sound
        triggerCatchSound(game.pendingCatch.rarity < 0.15);

        // Check for creature interactions
        const interaction = checkCreatureInteraction(game.pendingCatch);
        if (interaction) {
            game.pendingInteraction = interaction;
            // Show interaction message
            addSoundEffect(interaction.message, CONFIG.canvas.width / 2, 200, {
                color: '#ffd700',
                duration: 90,
                size: 16,
                rise: false
            });
        }

        const lure = getCurrentLure();
        if (lure && lure.count > 0) {
            lure.count--;
            if (lure.count === 0) game.equipment.lure = null;
        }
    } else {
        game.state = 'sailing';
        game.depth = 0;
        game.targetDepth = 0;
        // Reset camera to surface
        if (game.camera) {
            game.camera.targetY = 0;
        }
        addSoundEffect('*snap* It got away...', CONFIG.canvas.width / 2, CONFIG.waterLine - 50, {
            color: '#a06060',
            duration: 60,
            size: 14
        });
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

// ============================================================
// TRANSFORMATION SYSTEM
// ============================================================

function getTransformationStage() {
    const sanity = game.sanity;
    for (let i = TRANSFORMATION.stages.length - 1; i >= 0; i--) {
        if (sanity <= TRANSFORMATION.stages[i].sanityThreshold) {
            return i;
        }
    }
    return 0;
}

function updateTransformation() {
    const oldStage = game.transformation.stage;
    const newStage = getTransformationStage();

    if (newStage > oldStage) {
        game.transformation.stage = newStage;
        game.storyFlags.transformationStarted = true;

        // Add physical change notification
        if (newStage < TRANSFORMATION.physicalSigns.length) {
            game.transformation.physicalChanges.push({
                text: TRANSFORMATION.physicalSigns[newStage],
                time: game.time,
                alpha: 1
            });
        }
    }

    // Fade out physical change notifications
    game.transformation.physicalChanges = game.transformation.physicalChanges.filter(change => {
        change.alpha -= 0.001;
        return change.alpha > 0;
    });
}

function getTransformationBiteBonus() {
    // Higher transformation = fish bite more eagerly
    return 1 + (game.transformation.stage * 0.15);
}

function drawTransformationIndicator() {
    const stage = TRANSFORMATION.stages[game.transformation.stage];
    if (!stage) return;

    // Draw transformation stage in top left
    ctx.fillStyle = 'rgba(10, 15, 20, 0.7)';
    ctx.fillRect(10, 85, 150, 40);
    ctx.strokeStyle = stage.color;
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 85, 150, 40);

    ctx.font = '12px VT323';
    ctx.fillStyle = stage.color;
    ctx.fillText(`Stage: ${stage.name}`, 20, 102);
    ctx.fillStyle = '#8a9a8a';
    ctx.font = '10px VT323';
    ctx.fillText(stage.desc, 20, 118);

    // Draw physical change notifications
    game.transformation.physicalChanges.forEach((change, i) => {
        ctx.fillStyle = `rgba(100, 150, 160, ${change.alpha})`;
        ctx.font = '14px VT323';
        ctx.textAlign = 'center';
        ctx.fillText(change.text, CONFIG.canvas.width / 2, 200 + i * 25);
        ctx.textAlign = 'left';
    });
}

// Visual transformation of fisher sprite
function getTransformationVisuals() {
    const stage = game.transformation.stage;
    return {
        skinColor: ['#d4a574', '#b8c0c0', '#90a8a8', '#6890a0', '#4878a0'][stage],
        eyeSize: 1 + stage * 0.2,
        hasGills: stage >= 3,
        hasWebbing: stage >= 2,
        glowIntensity: stage * 0.1
    };
}

// ============================================================
// FISHING JOURNAL SYSTEM
// ============================================================

function openJournal() {
    game.journal.open = true;
    game.journal.page = 0;
}

function closeJournal() {
    game.journal.open = false;
}

function addToJournal(creature) {
    if (!game.journal.discovered.includes(creature.name)) {
        game.journal.discovered.push(creature.name);
    }
}

function drawJournal() {
    if (!game.journal.open) return;

    const w = 550, h = 450;
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    // Background
    ctx.fillStyle = 'rgba(20, 15, 10, 0.98)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#8a7a5a';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Title
    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = '#c0b090';
    ctx.textAlign = 'center';
    ctx.fillText('FISHING JOURNAL', x + w/2, y + 30);

    // Stats
    ctx.font = '12px VT323';
    ctx.fillStyle = '#a09080';
    const allCreatures = [...CREATURES.surface, ...CREATURES.mid, ...CREATURES.deep, ...CREATURES.abyss];
    ctx.fillText(`Discovered: ${game.journal.discovered.length}/${allCreatures.length}`, x + w/2, y + 50);

    // Creature list by zone
    ctx.textAlign = 'left';
    let currentY = y + 80;
    const zones = [
        { name: 'SURFACE (0-20m)', creatures: CREATURES.surface, color: '#80c0ff' },
        { name: 'MID (20-55m)', creatures: CREATURES.mid, color: '#60a0a0' },
        { name: 'DEEP (55-90m)', creatures: CREATURES.deep, color: '#4080a0' },
        { name: 'ABYSS (90m+)', creatures: CREATURES.abyss, color: '#6040a0' }
    ];

    const startZone = game.journal.page;
    const zone = zones[startZone];
    if (!zone) return;

    // Zone header
    ctx.fillStyle = zone.color;
    ctx.font = '14px VT323';
    ctx.fillText(zone.name, x + 20, currentY);
    currentY += 25;

    // Creatures in zone
    zone.creatures.forEach((creature, i) => {
        const discovered = game.journal.discovered.includes(creature.name);

        ctx.fillStyle = discovered ? 'rgba(60, 50, 40, 0.5)' : 'rgba(30, 25, 20, 0.5)';
        ctx.fillRect(x + 15, currentY - 15, w - 30, 75);

        if (discovered) {
            ctx.fillStyle = '#c0b090';
            ctx.font = '14px VT323';
            ctx.fillText(creature.name, x + 25, currentY);

            ctx.fillStyle = '#a09070';
            ctx.font = '12px VT323';
            ctx.fillText(creature.desc, x + 25, currentY + 20);

            ctx.fillStyle = '#d0c060';
            ctx.fillText(`Value: ${creature.value}g`, x + 25, currentY + 40);
            ctx.fillStyle = '#a06060';
            ctx.fillText(`Sanity Loss: ${creature.sanityLoss}`, x + 150, currentY + 40);
            ctx.fillStyle = '#80a080';
            ctx.fillText(`Rarity: ${Math.round(creature.rarity * 100)}%`, x + 300, currentY + 40);
        } else {
            ctx.fillStyle = '#605040';
            ctx.font = '14px VT323';
            ctx.fillText('???', x + 25, currentY);
            ctx.font = '12px VT323';
            ctx.fillText('Not yet discovered...', x + 25, currentY + 20);
        }

        currentY += 85;
    });

    // Navigation
    ctx.fillStyle = '#8a7a6a';
    ctx.font = '12px VT323';
    ctx.textAlign = 'center';
    ctx.fillText(`[←/→] ${zones[startZone].name} (${startZone + 1}/${zones.length}) | [J/ESC] Close`, x + w/2, y + h - 15);
    ctx.textAlign = 'left';
}

// ============================================================
// VILLAGE MENU SYSTEM
// ============================================================

function openVillageMenu() {
    game.villageMenu.open = true;
    game.villageMenu.selectedIndex = 0;
}

function closeVillageMenu() {
    game.villageMenu.open = false;
}

function restAtVillage() {
    // Skip to next dawn
    game.dayProgress = 0.1;
    game.timeOfDay = 'dawn';
    game.sanity = Math.min(100, game.sanity + 30);
    game.dog.happiness = Math.min(100, game.dog.happiness + 50);
    initLayers();
    closeVillageMenu();

    // Show rest message
    game.shop.npcDialog = "You rest through the night. The dreams were... troubling.";
    game.shop.dialogTimer = game.time + 3000;
}

function drawVillageMenu() {
    if (!game.villageMenu.open) return;

    const w = 400, h = 300;
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    // Background
    ctx.fillStyle = 'rgba(15, 12, 10, 0.98)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#6a5a4a';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Title
    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = '#a09080';
    ctx.textAlign = 'center';
    ctx.fillText('INNSMOUTH HARBOR', x + w/2, y + 30);

    // Menu options
    const options = [
        { label: "Old Marsh's Bait & Tackle", desc: "Buy and sell goods", action: 'shop' },
        { label: "Rest Until Dawn", desc: `Restore sanity (+30). Current: ${Math.round(game.sanity)}`, action: 'rest' },
        { label: "Fishing Journal", desc: `${game.journal.discovered.length} creatures discovered`, action: 'journal' },
        { label: "Return to Sea", desc: "Continue fishing", action: 'leave' }
    ];

    options.forEach((opt, i) => {
        const optY = y + 70 + i * 55;
        const isSelected = game.villageMenu.selectedIndex === i;

        if (isSelected) {
            ctx.fillStyle = 'rgba(80, 70, 50, 0.5)';
            ctx.fillRect(x + 20, optY - 10, w - 40, 50);
        }

        ctx.fillStyle = isSelected ? '#d0c0a0' : '#a09080';
        ctx.font = '14px VT323';
        ctx.textAlign = 'left';
        ctx.fillText(opt.label, x + 30, optY + 10);

        ctx.fillStyle = '#706050';
        ctx.font = '12px VT323';
        ctx.fillText(opt.desc, x + 30, optY + 28);
    });

    // Controls
    ctx.fillStyle = '#605040';
    ctx.font = '12px VT323';
    ctx.textAlign = 'center';
    ctx.fillText('[↑/↓] Select | [SPACE/ENTER] Confirm | [ESC] Leave', x + w/2, y + h - 15);
    ctx.textAlign = 'left';
}

function villageMenuAction() {
    const options = ['shop', 'rest', 'journal', 'leave'];
    const action = options[game.villageMenu.selectedIndex];

    switch(action) {
        case 'shop':
            closeVillageMenu();
            openShop();
            break;
        case 'rest':
            restAtVillage();
            break;
        case 'journal':
            closeVillageMenu();
            openJournal();
            break;
        case 'leave':
            closeVillageMenu();
            break;
    }
}

// ============================================================
// ENDINGS SYSTEM
// ============================================================

const ENDING_SCENES = {
    deepOne: [
        "The water calls...",
        "Your skin splits. Gills open.",
        "The cold embrace of the deep.",
        "They welcome you. Brothers. Sisters.",
        "You descend into darkness.",
        "This is not an ending.",
        "This is becoming."
    ],
    survivor: [
        "You row towards the horizon.",
        "Innsmouth shrinks behind you.",
        "The whispers fade.",
        "You survived what others could not.",
        "But the dreams will never stop.",
        "Some nights, you still hear them.",
        "The sea remembers."
    ],
    prophet: [
        "You stand between worlds.",
        "Neither human nor Deep One.",
        "You have seen the truth.",
        "The Old Ones are patient.",
        "They have always been here.",
        "And you... you understand.",
        "The bridge has been built."
    ]
};

function checkEnding() {
    if (game.ending.triggered || game.endlessMode) return;

    // Check for Deep One ending (sanity = 0)
    if (game.sanity <= 0) {
        triggerEnding('deepOne');
        return;
    }

    // Check for Survivor ending (caught The Unnamed with sanity > 30)
    if (game.storyFlags.caughtUnnamed && game.sanity > 30) {
        // Only trigger if player chooses to leave (near edge of map going left)
        if (game.boatX < 100) {
            triggerEnding('survivor');
            return;
        }
    }

    // Check for Prophet ending (all lore + The Unnamed + sanity 20-40)
    const allLoreFound = game.loreFound.length >= LORE_FRAGMENTS.length;
    if (allLoreFound && game.storyFlags.caughtUnnamed && game.sanity >= 20 && game.sanity <= 40) {
        triggerEnding('prophet');
        return;
    }
}

function triggerEnding(endingType) {
    game.ending.triggered = true;
    game.ending.current = endingType;
    game.ending.phase = 'fadeout';
    game.ending.timer = 0;
    game.ending.textIndex = 0;
    game.state = 'ending';

    // Unlock ending achievement
    if (endingType === 'deepOne') unlockAchievement('endingDeepOne');
    else if (endingType === 'survivor') unlockAchievement('endingSurvivor');
    else if (endingType === 'prophet') unlockAchievement('endingProphet');

    autoSave();
}

function updateEnding(deltaTime) {
    if (!game.ending.triggered) return;

    game.ending.timer += deltaTime;

    if (game.ending.phase === 'fadeout') {
        if (game.ending.timer > 2000) {
            game.ending.phase = 'scene';
            game.ending.timer = 0;
        }
    } else if (game.ending.phase === 'scene') {
        const scenes = ENDING_SCENES[game.ending.current];
        const textDuration = 3000;

        if (game.ending.timer > textDuration) {
            game.ending.timer = 0;
            game.ending.textIndex++;

            if (game.ending.textIndex >= scenes.length) {
                game.ending.phase = 'credits';
                game.ending.timer = 0;
            }
        }
    } else if (game.ending.phase === 'credits') {
        if (game.ending.timer > 8000) {
            game.ending.canContinue = true;
        }
    }
}

function drawEndingScene() {
    if (!game.ending.triggered) return;

    const fadeAlpha = game.ending.phase === 'fadeout'
        ? Math.min(1, game.ending.timer / 2000)
        : 1;

    // Ending-specific color palettes
    const endingPalettes = {
        deepOne: { bg: [5, 20, 40], text: [100, 180, 200], accent: [60, 140, 160] },
        survivor: { bg: [30, 25, 15], text: [220, 200, 150], accent: [180, 150, 80] },
        prophet: { bg: [20, 10, 30], text: [180, 140, 200], accent: [140, 80, 180] }
    };
    const palette = endingPalettes[game.ending.current] || endingPalettes.deepOne;

    // Animated background with particles
    ctx.fillStyle = `rgba(${palette.bg[0]}, ${palette.bg[1]}, ${palette.bg[2]}, ${fadeAlpha})`;
    ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    // Draw animated particles based on ending type
    if (game.ending.phase === 'scene' || game.ending.phase === 'credits') {
        drawEndingParticles(palette);
    }

    if (game.ending.phase === 'scene') {
        const scenes = ENDING_SCENES[game.ending.current];
        const text = scenes[game.ending.textIndex];
        const textAlpha = Math.min(1, game.ending.timer / 500);
        const fadeOut = game.ending.timer > 2500 ? Math.max(0, 1 - (game.ending.timer - 2500) / 500) : 1;
        const alpha = textAlpha * fadeOut;

        // Text glow effect
        ctx.shadowColor = `rgba(${palette.accent[0]}, ${palette.accent[1]}, ${palette.accent[2]}, ${alpha * 0.5})`;
        ctx.shadowBlur = 20;

        ctx.fillStyle = `rgba(${palette.text[0]}, ${palette.text[1]}, ${palette.text[2]}, ${alpha})`;
        ctx.font = '22px VT323';
        ctx.textAlign = 'center';
        ctx.fillText(text, CONFIG.canvas.width / 2, CONFIG.canvas.height / 2);

        ctx.shadowBlur = 0;
    } else if (game.ending.phase === 'credits') {
        const ending = ENDINGS[game.ending.current];
        const scrollOffset = Math.min(50, game.ending.timer / 100);

        // Animated title with glow
        const titlePulse = (Math.sin(game.time * 0.003) + 1) / 2;
        ctx.shadowColor = `rgba(${palette.accent[0]}, ${palette.accent[1]}, ${palette.accent[2]}, ${0.3 + titlePulse * 0.3})`;
        ctx.shadowBlur = 15 + titlePulse * 10;

        ctx.fillStyle = `rgb(${palette.text[0]}, ${palette.text[1]}, ${palette.text[2]})`;
        ctx.font = '28px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(ending.name, CONFIG.canvas.width / 2, 150 - scrollOffset);

        ctx.shadowBlur = 0;

        // Subtitle with fade-in
        const subtitleAlpha = Math.min(1, game.ending.timer / 1000);
        ctx.fillStyle = `rgba(${palette.text[0] * 0.7}, ${palette.text[1] * 0.7}, ${palette.text[2] * 0.7}, ${subtitleAlpha})`;
        ctx.font = '18px VT323';
        ctx.fillText(`- ${ending.subtitle} -`, CONFIG.canvas.width / 2, 190 - scrollOffset);

        // Description with typewriter effect
        const descAlpha = Math.min(1, (game.ending.timer - 500) / 1000);
        if (descAlpha > 0) {
            ctx.fillStyle = `rgba(${palette.accent[0]}, ${palette.accent[1]}, ${palette.accent[2]}, ${descAlpha})`;
            ctx.font = '16px VT323';
            ctx.fillText(ending.description, CONFIG.canvas.width / 2, 260 - scrollOffset);
        }

        // Decorative line
        const lineWidth = Math.min(200, game.ending.timer / 10);
        ctx.strokeStyle = `rgba(${palette.accent[0]}, ${palette.accent[1]}, ${palette.accent[2]}, 0.5)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(CONFIG.canvas.width / 2 - lineWidth, 300 - scrollOffset);
        ctx.lineTo(CONFIG.canvas.width / 2 + lineWidth, 300 - scrollOffset);
        ctx.stroke();

        // Credits with staggered fade
        const creditsAlpha = Math.min(1, (game.ending.timer - 1500) / 1000);
        if (creditsAlpha > 0) {
            ctx.fillStyle = `rgba(${palette.text[0] * 0.5}, ${palette.text[1] * 0.5}, ${palette.text[2] * 0.5}, ${creditsAlpha})`;
            ctx.font = '16px VT323';
            ctx.fillText('THE DEEP ONES', CONFIG.canvas.width / 2, 360 - scrollOffset);
            ctx.font = '14px VT323';
            ctx.fillText('A Lovecraftian Fishing Game', CONFIG.canvas.width / 2, 385 - scrollOffset);
            ctx.fillText('v0.9', CONFIG.canvas.width / 2, 410 - scrollOffset);
        }

        // Continue prompt with pulse animation
        if (game.ending.canContinue) {
            const pulse = (Math.sin(game.time * 0.005) + 1) / 2;
            ctx.fillStyle = `rgba(${palette.text[0]}, ${palette.text[1]}, ${palette.text[2]}, ${0.6 + pulse * 0.4})`;
            ctx.font = '14px VT323';
            ctx.fillText('[SPACE] Enter Endless Mode', CONFIG.canvas.width / 2, 500);
            ctx.fillText('[ESC] Return to Title', CONFIG.canvas.width / 2, 525);
        }
    }

    ctx.textAlign = 'left';
}

// Animated particles for ending scenes
function drawEndingParticles(palette) {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const seed = i * 137.5;
        const x = (seed + game.time * 0.02) % CONFIG.canvas.width;
        const y = (seed * 2.3 + game.time * 0.01) % CONFIG.canvas.height;
        const size = 1 + Math.sin(seed) * 1;
        const alpha = 0.1 + Math.sin(game.time * 0.002 + seed) * 0.1;

        ctx.fillStyle = `rgba(${palette.accent[0]}, ${palette.accent[1]}, ${palette.accent[2]}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Special effect based on ending type
    if (game.ending.current === 'deepOne') {
        // Rising bubbles
        for (let i = 0; i < 10; i++) {
            const bx = 100 + i * 80;
            const by = CONFIG.canvas.height - ((game.time * 0.05 + i * 50) % CONFIG.canvas.height);
            ctx.fillStyle = 'rgba(100, 180, 200, 0.15)';
            ctx.beginPath();
            ctx.arc(bx, by, 3 + i % 3, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (game.ending.current === 'survivor') {
        // Drifting light rays
        for (let i = 0; i < 5; i++) {
            const rayX = 150 + i * 180;
            const rayAlpha = 0.05 + Math.sin(game.time * 0.001 + i) * 0.03;
            const grad = ctx.createLinearGradient(rayX, 0, rayX + 50, CONFIG.canvas.height);
            grad.addColorStop(0, `rgba(255, 220, 150, ${rayAlpha})`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(rayX, 0, 30, CONFIG.canvas.height);
        }
    } else if (game.ending.current === 'prophet') {
        // Swirling symbols
        for (let i = 0; i < 8; i++) {
            const angle = (game.time * 0.001 + i * Math.PI / 4);
            const radius = 150 + Math.sin(game.time * 0.002 + i) * 30;
            const sx = CONFIG.canvas.width / 2 + Math.cos(angle) * radius;
            const sy = CONFIG.canvas.height / 2 + Math.sin(angle) * radius;
            ctx.fillStyle = `rgba(140, 80, 180, ${0.1 + Math.sin(game.time * 0.003 + i) * 0.05})`;
            ctx.font = '16px VT323';
            ctx.fillText('◊', sx, sy);
        }
    }
}

function startEndlessMode() {
    game.ending.phase = 'complete';
    game.endlessMode = true;
    game.state = 'sailing';
    game.sanity = 50;  // Reset sanity to playable level
    showSaveNotification('Endless Mode Unlocked!');
    autoSave();
}

// ============================================================
// ACHIEVEMENTS SYSTEM
// ============================================================

function unlockAchievement(achievementKey) {
    const achievement = ACHIEVEMENTS[achievementKey];
    if (!achievement) return;

    // Check if already unlocked
    if (game.achievements.unlocked.includes(achievement.id)) return;

    // Unlock it
    game.achievements.unlocked.push(achievement.id);

    // Show notification
    game.achievements.notification = {
        achievement: achievement,
        timer: 180  // 3 seconds at 60fps
    };

    autoSave();
}

function checkAchievements() {
    if (game.state === 'title' || game.state === 'ending') return;

    const stats = game.achievements.stats;
    const discovered = game.journal.discovered;

    // First catch
    if (game.caughtCreatures.length >= 1) {
        unlockAchievement('firstCatch');
    }

    // Surface creatures
    const surfaceNames = CREATURES.surface.map(c => c.name);
    if (surfaceNames.every(n => discovered.includes(n))) {
        unlockAchievement('surfaceMaster');
    }

    // Mid creatures
    const midNames = CREATURES.mid.map(c => c.name);
    if (midNames.every(n => discovered.includes(n))) {
        unlockAchievement('midExplorer');
    }

    // Deep creatures
    const deepNames = CREATURES.deep.map(c => c.name);
    if (deepNames.every(n => discovered.includes(n))) {
        unlockAchievement('deepDiver');
    }

    // Abyss creatures
    const abyssNames = CREATURES.abyss.map(c => c.name);
    if (abyssNames.every(n => discovered.includes(n))) {
        unlockAchievement('abyssWalker');
    }

    // Wealth
    if (stats.totalGoldEarned >= 100) unlockAchievement('firstHundred');
    if (stats.totalGoldEarned >= 1000) unlockAchievement('thousandaire');
    if (stats.totalGoldEarned >= 5000) unlockAchievement('richBeyondReason');

    // Exploration
    if (game.storyFlags.reachedVoid) unlockAchievement('reachVoid');
    if (game.storyFlags.visitedLocations.length >= Object.keys(CONFIG.locations).length) {
        unlockAchievement('allLocations');
    }

    // Lore
    if (game.loreFound.length >= 1) unlockAchievement('firstLore');
    if (game.loreFound.length >= Math.floor(LORE_FRAGMENTS.length / 2)) unlockAchievement('halfLore');
    if (game.loreFound.length >= LORE_FRAGMENTS.length) unlockAchievement('allLore');

    // Sanity
    if (game.sanity < 10) unlockAchievement('brinkOfMadness');
    if (game.storyFlags.transformationStarted) unlockAchievement('transformation');

    // Special
    if (stats.petCount >= 50) unlockAchievement('goodBoy');
    if (stats.stormCatches >= 1) unlockAchievement('stormChaser');
    if (stats.nightCatches >= 10) unlockAchievement('nightFisher');
}

function updateAchievementNotification() {
    if (game.achievements.notification) {
        game.achievements.notification.timer--;
        if (game.achievements.notification.timer <= 0) {
            game.achievements.notification = null;
        }
    }
}

function drawAchievementNotification() {
    if (!game.achievements.notification) return;

    const notif = game.achievements.notification;
    const achievement = notif.achievement;

    // Slide-in animation
    const slideProgress = Math.min(1, (180 - notif.timer) / 30);
    const slideOut = notif.timer < 30 ? (30 - notif.timer) / 30 : 0;
    const xOffset = (1 - slideProgress + slideOut) * 300;

    const x = CONFIG.canvas.width - 280 + xOffset;
    const y = 130;
    const w = 270;
    const h = 80;

    // Screen edge glow effect
    if (slideProgress > 0 && slideOut < 1) {
        const glowAlpha = Math.sin(notif.timer * 0.1) * 0.15 + 0.15;
        const glowGrad = ctx.createRadialGradient(
            CONFIG.canvas.width, y + h/2, 0,
            CONFIG.canvas.width, y + h/2, 200
        );
        glowGrad.addColorStop(0, `rgba(255, 215, 100, ${glowAlpha})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(CONFIG.canvas.width - 200, y - 50, 200, h + 100);
    }

    // Background with gradient
    const bgGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    bgGrad.addColorStop(0, 'rgba(30, 50, 70, 0.98)');
    bgGrad.addColorStop(1, 'rgba(50, 70, 90, 0.98)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(x, y, w, h);

    // Animated border
    const borderPulse = (Math.sin(notif.timer * 0.15) + 1) / 2;
    ctx.strokeStyle = `rgba(255, 215, 100, ${0.6 + borderPulse * 0.4})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Inner glow
    ctx.shadowColor = 'rgba(255, 215, 100, 0.3)';
    ctx.shadowBlur = 10;

    // Icon with background circle
    ctx.fillStyle = 'rgba(255, 215, 100, 0.2)';
    ctx.beginPath();
    ctx.arc(x + 35, y + 40, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.fillText(achievement.icon, x + 35, y + 50);
    ctx.textAlign = 'left';

    // "ACHIEVEMENT UNLOCKED" header with gold gradient
    ctx.fillStyle = '#ffd700';
    ctx.font = '12px VT323';
    ctx.fillText('★ ACHIEVEMENT UNLOCKED ★', x + 70, y + 22);

    // Achievement name
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px VT323';
    ctx.fillText(achievement.name, x + 70, y + 42);

    // Description
    ctx.fillStyle = '#b0c0d0';
    ctx.font = '12px VT323';
    ctx.fillText(achievement.desc, x + 70, y + 60);

    // Sparkle particles
    for (let i = 0; i < 5; i++) {
        const sparkleX = x + 20 + Math.sin(notif.timer * 0.2 + i * 1.5) * 15 + i * 50;
        const sparkleY = y + 10 + Math.cos(notif.timer * 0.15 + i * 2) * 10;
        const sparkleAlpha = 0.3 + Math.sin(notif.timer * 0.3 + i) * 0.2;
        ctx.fillStyle = `rgba(255, 255, 200, ${sparkleAlpha})`;
        ctx.font = '10px VT323';
        ctx.fillText('✦', sparkleX, sparkleY);
    }
}

// ============================================================
// LOCATION-BASED CREATURES
// ============================================================

function getLocationCreaturePool() {
    const loc = game.currentLocation;
    const locData = CONFIG.locations[loc];
    if (!locData) return null;

    // Each location has preferred zones
    const zoneWeights = {
        sandbank: { surface: 1.0, mid: 0, deep: 0, abyss: 0 },
        shallows: { surface: 0.8, mid: 0.2, deep: 0, abyss: 0 },
        sunsetCove: { surface: 0.6, mid: 0.4, deep: 0, abyss: 0 },
        dock: { surface: 0.9, mid: 0.1, deep: 0, abyss: 0 },
        reef: { surface: 0.2, mid: 0.7, deep: 0.1, abyss: 0 },
        shipwreck: { surface: 0.1, mid: 0.3, deep: 0.5, abyss: 0.1 },
        trench: { surface: 0, mid: 0.1, deep: 0.6, abyss: 0.3 },
        void: { surface: 0, mid: 0, deep: 0.2, abyss: 0.8 }
    };

    return zoneWeights[loc] || { surface: 0.5, mid: 0.3, deep: 0.15, abyss: 0.05 };
}

// ============================================================
// ACHIEVEMENTS VIEWER
// ============================================================

function openAchievementsViewer() {
    game.achievements.viewerOpen = true;
    game.achievements.viewerPage = 0;
}

function closeAchievementsViewer() {
    game.achievements.viewerOpen = false;
}

function drawAchievementsViewer() {
    if (!game.achievements.viewerOpen) return;

    const w = 600, h = 500;
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    // Background
    ctx.fillStyle = 'rgba(15, 20, 25, 0.98)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#6080a0';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Title
    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = '#a0c0d0';
    ctx.textAlign = 'center';
    ctx.fillText('ACHIEVEMENTS', x + w/2, y + 30);

    // Stats
    ctx.font = '12px VT323';
    ctx.fillStyle = '#8090a0';
    const allAchievements = Object.values(ACHIEVEMENTS);
    ctx.fillText(`Unlocked: ${game.achievements.unlocked.length}/${allAchievements.length}`, x + w/2, y + 50);

    // Achievement list
    ctx.textAlign = 'left';
    const itemsPerPage = 6;
    const startIdx = game.achievements.viewerPage * itemsPerPage;
    const pageAchievements = allAchievements.slice(startIdx, startIdx + itemsPerPage);

    pageAchievements.forEach((achievement, i) => {
        const itemY = y + 80 + i * 65;
        const isUnlocked = game.achievements.unlocked.includes(achievement.id);

        // Background
        ctx.fillStyle = isUnlocked ? 'rgba(60, 80, 60, 0.4)' : 'rgba(30, 35, 40, 0.4)';
        ctx.fillRect(x + 15, itemY, w - 30, 55);

        if (isUnlocked) {
            ctx.strokeStyle = '#80a080';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 15, itemY, w - 30, 55);
        }

        // Icon
        ctx.font = '28px serif';
        ctx.fillStyle = isUnlocked ? '#ffffff' : '#404040';
        ctx.fillText(achievement.icon, x + 30, itemY + 38);

        // Name
        ctx.fillStyle = isUnlocked ? '#d0e0d0' : '#606060';
        ctx.font = '16px VT323';
        ctx.fillText(achievement.name, x + 75, itemY + 22);

        // Description
        ctx.fillStyle = isUnlocked ? '#a0b0a0' : '#505050';
        ctx.font = '13px VT323';
        ctx.fillText(achievement.desc, x + 75, itemY + 42);

        // Status
        if (isUnlocked) {
            ctx.fillStyle = '#80c080';
            ctx.font = '12px VT323';
            ctx.textAlign = 'right';
            ctx.fillText('UNLOCKED', x + w - 30, itemY + 30);
            ctx.textAlign = 'left';
        }
    });

    // Pagination
    const totalPages = Math.ceil(allAchievements.length / itemsPerPage);
    ctx.fillStyle = '#6080a0';
    ctx.font = '12px VT323';
    ctx.textAlign = 'center';
    ctx.fillText(`[←/→] Page ${game.achievements.viewerPage + 1}/${totalPages} | [A/ESC] Close`, x + w/2, y + h - 15);
    ctx.textAlign = 'left';
}

// ============================================================
// UNDERWATER CAMERA PANNING (Cast n Chill inspired)
// ============================================================

function updateCameraPan() {
    const cam = game.camera;

    // Guard against undefined camera state
    if (!cam) {
        return;
    }

    // Ensure cam.y is a valid number
    if (typeof cam.y !== 'number' || isNaN(cam.y)) {
        cam.y = 0;
    }

    // Determine target pan based on game state
    if (game.state === 'waiting' || game.state === 'reeling' || game.minigame.active) {
        // Calculate target depth based on fishing line
        const rod = (typeof getCurrentRod === 'function') ? getCurrentRod() : null;
        const maxDepth = (rod && typeof rod.depthMax === 'number') ? rod.depthMax : 30;
        const depth = (typeof game.depth === 'number' && !isNaN(game.depth)) ? game.depth : 0;

        // Safely calculate depth percent (0 to 1)
        const depthPercent = maxDepth > 0 ? Math.min(1, Math.max(0, depth / maxDepth)) : 0;

        // Reduced pan amount - max 100px instead of 200px for better visibility
        const maxPan = Math.min(cam.maxPan || 200, 100);

        // Pan down into the water when fishing (reduced multiplier from 1.5 to 0.8)
        cam.targetY = depthPercent * maxPan * 0.8;
        cam.mode = 'underwater';
    } else if (game.state === 'caught') {
        // Quickly return camera when catching - faster reduction
        cam.targetY = Math.max(0, (cam.targetY || 0) * 0.8);
        cam.mode = cam.targetY > 5 ? 'transitioning' : 'surface';
    } else {
        // Return to surface view immediately
        cam.targetY = 0;
        cam.mode = 'surface';
    }

    // Smooth interpolation with faster return speed when going back to surface
    const diff = (cam.targetY || 0) - cam.y;
    const speed = cam.targetY < cam.y ? 0.1 : (cam.panSpeed || 0.05);  // Faster when returning up
    cam.y = cam.y + diff * speed;

    // Snap to 0 if very close to surface
    if (cam.targetY === 0 && Math.abs(cam.y) < 1) {
        cam.y = 0;
    }

    // Clamp values
    cam.y = Math.max(0, Math.min(100, cam.y));

    // Final NaN guard
    if (isNaN(cam.y)) {
        cam.y = 0;
    }
}

function getCameraPanOffset() {
    const y = game.camera ? game.camera.y : 0;
    return (typeof y === 'number' && !isNaN(y)) ? y : 0;
}

// ============================================================
// FISH STRUGGLE PARTICLES
// ============================================================

function addFishStruggleParticle(x, y) {
    game.fishStruggleParticles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2 - 1,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        size: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? 'orange' : 'yellow'
    });
}

function updateFishStruggleParticles() {
    game.fishStruggleParticles = game.fishStruggleParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;  // Slight gravity
        p.life--;
        return p.life > 0;
    });

    // Add new particles when fish is struggling hard
    if (game.minigame.active && game.minigame.tension > 60) {
        const intensity = (game.minigame.tension - 60) / 40;  // 0 to 1
        if (Math.random() < intensity * 0.3) {
            const boatX = game.boatX - game.cameraX;
            const hookY = CONFIG.waterLine + 50 + (game.depth / 120) * 200;
            addFishStruggleParticle(boatX + 60, hookY);
        }
    }
}

function drawFishStruggleParticles() {
    const panOffset = getCameraPanOffset();

    game.fishStruggleParticles.forEach(p => {
        const alpha = p.life / p.maxLife;

        // Determine color
        let color;
        if (p.color === 'orange') {
            color = `rgba(255, ${150 + Math.random() * 50}, 50, ${alpha})`;
        } else {
            color = `rgba(255, ${200 + Math.random() * 55}, 100, ${alpha})`;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y - panOffset, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle effect
        if (Math.random() < 0.3) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(p.x + (Math.random() - 0.5) * 5, p.y - panOffset + (Math.random() - 0.5) * 5, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Visual indicator on the fish during minigame when struggling
function drawFishStruggleIndicator() {
    if (!game.minigame.active || game.minigame.tension < 50) return;

    const mg = game.minigame;
    const barWidth = 300;
    const x = (CONFIG.canvas.width - barWidth) / 2;
    const y = CONFIG.canvas.height - 100;
    const fishX = x + mg.targetZone * barWidth;

    const intensity = (mg.tension - 50) / 50;  // 0 to 1
    const numParticles = Math.floor(intensity * 8) + 2;

    // Draw burst particles around the fish icon
    for (let i = 0; i < numParticles; i++) {
        const angle = (game.time * 0.02 + i * (Math.PI * 2 / numParticles)) % (Math.PI * 2);
        const distance = 10 + intensity * 15 + Math.sin(game.time * 0.1 + i) * 5;
        const px = fishX + Math.cos(angle) * distance;
        const py = y + 15 + Math.sin(angle) * distance * 0.5;

        const alpha = 0.3 + intensity * 0.5;
        ctx.fillStyle = mg.tension > 80
            ? `rgba(255, 100, 80, ${alpha})`
            : `rgba(255, 180, 80, ${alpha})`;

        ctx.beginPath();
        ctx.arc(px, py, 2 + intensity * 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Pulsing glow around fish
    if (mg.tension > 70) {
        const pulse = (Math.sin(game.time * 0.1) + 1) / 2;
        ctx.fillStyle = `rgba(255, 100, 50, ${0.1 + pulse * 0.15})`;
        ctx.beginPath();
        ctx.arc(fishX, y + 15, 20 + pulse * 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ============================================================
// TROPHY TRACKING SYSTEM
// ============================================================

function addTrophy(creature) {
    const name = creature.name;

    if (!game.trophies[name]) {
        game.trophies[name] = {
            bestValue: creature.value,
            count: 1,
            firstCaughtTime: game.time
        };
    } else {
        game.trophies[name].count++;
        if (creature.value > game.trophies[name].bestValue) {
            game.trophies[name].bestValue = creature.value;
            // Notify of new record
            addSoundEffect('NEW RECORD!', CONFIG.canvas.width / 2, 120, {
                color: '#ffd700',
                duration: 80,
                size: 18
            });
        }
    }
}

function getTrophyInfo(creatureName) {
    return game.trophies[creatureName] || null;
}

function getAllTrophies() {
    return Object.entries(game.trophies).map(([name, data]) => ({
        name,
        ...data
    }));
}

function getTrophyProgress() {
    const allCreatures = [...CREATURES.surface, ...CREATURES.mid, ...CREATURES.deep, ...CREATURES.abyss];
    const caughtCount = Object.keys(game.trophies).length;
    return {
        caught: caughtCount,
        total: allCreatures.length,
        percentage: Math.round((caughtCount / allCreatures.length) * 100)
    };
}

// Draw trophy info in catch popup
function drawTrophyInfo(creature, x, y) {
    const trophy = getTrophyInfo(creature.name);

    if (trophy && trophy.count > 1) {
        ctx.fillStyle = '#b0a060';
        ctx.font = '12px VT323';
        ctx.fillText(`Catch #${trophy.count}`, x, y);

        if (creature.value >= trophy.bestValue) {
            ctx.fillStyle = '#ffd700';
            ctx.fillText(' BEST!', x + 70, y);
        } else {
            ctx.fillStyle = '#808060';
            ctx.fillText(` Best: ${trophy.bestValue}g`, x + 70, y);
        }
    } else if (!trophy) {
        ctx.fillStyle = '#60c080';
        ctx.font = '12px VT323';
        ctx.fillText('FIRST CATCH!', x, y);
    }
}

// ============================================================
// IDLE FISHING MODE
// ============================================================

function toggleIdleFishing() {
    game.idleFishing.active = !game.idleFishing.active;

    if (game.idleFishing.active) {
        game.idleFishing.timer = 0;
        game.idleFishing.lastCatchTime = game.time;
        addSoundEffect('IDLE MODE ON', CONFIG.canvas.width / 2, 150, {
            color: '#80c0ff',
            duration: 80,
            size: 16
        });
    } else {
        addSoundEffect('IDLE MODE OFF', CONFIG.canvas.width / 2, 150, {
            color: '#ffa080',
            duration: 80,
            size: 16
        });
    }
}

function updateIdleFishing(deltaTime) {
    if (!game.idleFishing.active) return;
    if (game.state !== 'sailing') return;

    game.idleFishing.timer += deltaTime;

    // Extra sanity drain while idle
    game.sanity = Math.max(0, game.sanity - 0.01 * game.idleFishing.sanityDrainMultiplier);

    // Auto-cast if not fishing
    if (game.state === 'sailing') {
        // Start fishing
        game.state = 'waiting';
        game.depth = 0;
        game.targetDepth = 30 + Math.random() * 30;
        triggerSplashSound();
    }

    // Auto-catch logic (simplified)
    if (game.idleFishing.timer > game.idleFishing.catchInterval) {
        game.idleFishing.timer = 0;

        // Roll for catch
        const rod = getCurrentRod ? getCurrentRod() : null;
        const weather = WEATHER.types[game.weather.current];
        let catchChance = 0.6 * (weather ? weather.biteModifier : 1);

        if (Math.random() < catchChance) {
            // Auto-catch a fish
            const creature = getCreature();

            // Add to inventory
            if (game.inventory.length < game.inventoryMax) {
                game.inventory.push(creature);
                game.caughtCreatures.push(creature);

                // Apply sanity loss
                game.sanity = Math.max(0, game.sanity - creature.sanityLoss);

                // Add trophy
                addTrophy(creature);

                // Track stats
                game.achievements.stats.totalFishCaught++;

                // Journal
                addToJournal(creature);

                addSoundEffect(`Auto: ${creature.name}`, CONFIG.canvas.width / 2, 180, {
                    color: '#80c0a0',
                    duration: 60,
                    size: 12
                });
            } else {
                // Inventory full - return to dock
                addSoundEffect('Inventory full!', CONFIG.canvas.width / 2, 180, {
                    color: '#c08080',
                    duration: 60,
                    size: 14
                });
                game.idleFishing.active = false;
            }
        }
    }
}

function drawIdleFishingIndicator() {
    if (!game.idleFishing.active) return;

    const x = CONFIG.canvas.width - 130;
    const y = 95;

    // Animated background
    const pulse = (Math.sin(game.time * 0.005) + 1) / 2;
    ctx.fillStyle = `rgba(60, 80, 120, ${0.7 + pulse * 0.2})`;
    ctx.fillRect(x, y, 120, 30);
    ctx.strokeStyle = `rgba(100, 150, 200, ${0.5 + pulse * 0.3})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, 120, 30);

    // Text
    ctx.fillStyle = '#a0d0ff';
    ctx.font = '12px VT323';
    ctx.textAlign = 'center';
    ctx.fillText('IDLE FISHING', x + 60, y + 13);

    // Progress bar to next catch
    const progress = game.idleFishing.timer / game.idleFishing.catchInterval;
    ctx.fillStyle = 'rgba(100, 180, 255, 0.3)';
    ctx.fillRect(x + 5, y + 20, 110, 5);
    ctx.fillStyle = 'rgba(100, 180, 255, 0.8)';
    ctx.fillRect(x + 5, y + 20, 110 * progress, 5);

    ctx.textAlign = 'left';
}

// ============================================================
// ENHANCED WATER REFLECTIONS (Cast n Chill inspired)
// ============================================================

function drawEnhancedWaterReflection() {
    if (typeof GameSettings !== 'undefined' && !GameSettings.graphics.weatherEffects) return;

    const boatX = game.boatX - game.cameraX;
    const reflectionY = CONFIG.waterLine + 20;
    const panOffset = getCameraPanOffset();

    // Sky/cloud reflection on water
    const palette = getTimePalette();

    // Safety check for palette and palette.sky
    if (!palette || !palette.sky || !Array.isArray(palette.sky) || palette.sky.length === 0) {
        return; // Skip drawing if palette is not available
    }

    // Create shimmering sky reflection
    // Use middle sky color from palette (it's an array of hex colors, not RGB components)
    const skyColor = palette.sky[Math.floor(palette.sky.length / 2)] || '#6090c0';

    for (let i = 0; i < 8; i++) {
        const shimmerX = (i * 150 + game.time * 0.02) % (CONFIG.canvas.width + 200) - 100;
        const shimmerY = reflectionY + 5 + Math.sin(game.time * 0.002 + i) * 3;
        const shimmerWidth = 80 + Math.sin(game.time * 0.003 + i * 2) * 20;
        const shimmerAlpha = 0.03 + Math.sin(game.time * 0.004 + i * 0.7) * 0.02;

        const gradient = ctx.createLinearGradient(shimmerX, shimmerY, shimmerX + shimmerWidth, shimmerY + 30);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, hexToRgba(skyColor, shimmerAlpha));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(shimmerX, shimmerY - panOffset, shimmerWidth, 30);
    }

    // Boat reflection with wave distortion
    ctx.save();
    ctx.globalAlpha = 0.2;

    // Apply wave distortion to reflection
    const waveOffset = Math.sin(game.time * 0.003) * 3;

    ctx.translate(0, (reflectionY * 2) - panOffset);
    ctx.scale(1, -0.8);  // Slightly compressed reflection

    // Draw simplified boat shape
    ctx.fillStyle = '#2a2520';
    ctx.beginPath();
    ctx.moveTo(boatX - 35 + waveOffset, CONFIG.waterLine - 5);
    ctx.lineTo(boatX - 30 + waveOffset, CONFIG.waterLine - 25);
    ctx.lineTo(boatX + 30 + waveOffset, CONFIG.waterLine - 25);
    ctx.lineTo(boatX + 35 + waveOffset, CONFIG.waterLine - 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Ripple rings around boat
    for (let i = 0; i < 3; i++) {
        const ripplePhase = ((game.time * 0.002 + i * 0.3) % 1);
        const rippleSize = 20 + ripplePhase * 40;
        const rippleAlpha = (1 - ripplePhase) * 0.15;

        ctx.strokeStyle = `rgba(180, 200, 220, ${rippleAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(boatX, reflectionY + 10 - panOffset, rippleSize, rippleSize * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Sun/moon reflection path
    if (game.timeOfDay === 'day' || game.timeOfDay === 'dusk' || game.timeOfDay === 'dawn') {
        const sunReflectX = CONFIG.canvas.width * 0.7;
        const sunReflectAlpha = game.timeOfDay === 'dusk' ? 0.15 : 0.08;

        // Shimmering light path on water
        for (let i = 0; i < 5; i++) {
            const pathX = sunReflectX + (Math.random() - 0.5) * 50;
            const pathY = reflectionY + 20 + i * 15;
            const pathWidth = 30 + Math.sin(game.time * 0.01 + i) * 15;

            const sunColor = game.timeOfDay === 'dusk'
                ? `rgba(255, 150, 80, ${sunReflectAlpha})`
                : `rgba(255, 255, 200, ${sunReflectAlpha})`;

            ctx.fillStyle = sunColor;
            ctx.beginPath();
            ctx.ellipse(pathX, pathY - panOffset, pathWidth, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
