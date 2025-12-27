// ============================================================
// THE DEEP ONES - MAIN GAME LOOP
// ============================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;

function update(deltaTime) {
    if (game.state === 'title') return;

    game.time += deltaTime;

    // Update camera
    game.cameraX = game.boatX - CONFIG.canvas.width / 2;
    game.cameraX = Math.max(0, Math.min(game.cameraX, CONFIG.worldWidth - CONFIG.canvas.width));

    // Update layers
    game.layers.forEach(layer => layer.update(deltaTime, game.cameraX));

    // Update systems
    updateWeather(deltaTime);
    updateTimeProgression(deltaTime);
    updateDog(deltaTime);
    updateLoreBottles();
    updateSanityEffects();
    updateMinigame(deltaTime);
    updateTransformation();

    // Update location
    game.currentLocation = getCurrentLocation();

    // Check dock proximity
    game.nearDock = Math.abs(game.boatX - CONFIG.dockX) < 100;

    // Sanity recovery at dock
    if (game.nearDock && game.state === 'sailing') {
        game.sanity = Math.min(100, game.sanity + 0.05);
    }

    // Location-based sanity effects (using sanityMod from locationBonuses)
    const locBonus = game.locationBonuses[game.currentLocation];
    if (locBonus && locBonus.sanityMod !== 0) {
        game.sanity = Math.max(0, Math.min(100, game.sanity + locBonus.sanityMod));
    }

    // Update depth
    if (game.state === 'waiting' || game.state === 'reeling') {
        const diff = game.targetDepth - game.depth;
        game.depth += diff * 0.02;

        // Check for bite
        if (game.state === 'waiting' && Math.random() < 0.002) {
            const rod = getCurrentRod();
            const lure = getCurrentLure();
            let biteChance = 0.3;

            // Weather modifier
            const weather = WEATHER.types[game.weather.current];
            biteChance *= weather.biteModifier;

            // Lure modifier
            if (lure) {
                const depth = game.depth;
                const zoneMatch = (lure.bonus === 'surface' && depth < 20) ||
                                 (lure.bonus === 'mid' && depth >= 20 && depth < 55) ||
                                 (lure.bonus === 'deep' && depth >= 55 && depth < 90) ||
                                 (lure.bonus === 'abyss' && depth >= 90);
                if (zoneMatch) biteChance *= lure.multiplier;
            }

            // Location modifier
            const locBonus = game.locationBonuses[game.currentLocation];
            if (locBonus) biteChance += locBonus.bonus * 0.2;

            if (Math.random() < biteChance) {
                game.state = 'reeling';
                const creature = getCreature();
                startMinigame(creature);

                // Dog reacts
                if (creature.rarity < 0.15) {
                    game.dog.isBarking = true;
                    game.dog.barkReason = 'rare';
                }
            }
        }
    }

    updateUI();
}

function render() {
    ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    if (game.state === 'title') return;

    // Draw layers with fallbacks
    game.layers.forEach(layer => {
        const fallback = FALLBACKS[layer.id];
        layer.draw(ctx, CONFIG.canvas.width, CONFIG.canvas.height, fallback);
    });

    // Draw location features
    drawLocationFeatures();

    // Draw dock and NPC
    drawDock();

    // Draw lore bottles
    drawLoreBottles();

    // Draw fish
    drawFish();

    // Draw boat
    drawBoat();

    // Draw fishing line
    drawFishingLine();

    // Draw weather effects
    drawWeatherEffects();

    // Draw sanity effects
    drawSanityEffects();

    // Draw UI elements
    drawLocationIndicator();
    drawWeatherIndicator();
    drawDogIndicator();
    drawTransformationIndicator();

    // Draw minigame
    drawMinigame();

    // Draw popups
    drawCatchPopup();
    drawLorePopup();
    drawShopUI();
    drawLoreCollection();
    drawJournal();
    drawVillageMenu();

    // Draw save notification
    drawSaveNotification();
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

function startGame(time) {
    game.state = 'sailing';
    game.timeOfDay = time;

    // Set day progress based on time
    if (time === 'dawn') game.dayProgress = 0.1;
    else if (time === 'day') game.dayProgress = 0.35;
    else if (time === 'dusk') game.dayProgress = 0.6;
    else game.dayProgress = 0.85;

    document.getElementById('title-screen').style.display = 'none';

    initLayers();
    initFish();
    initLoreBottles();

    loadAllAssets();
}

function continueGame() {
    if (loadGame()) {
        document.getElementById('title-screen').style.display = 'none';
        game.state = 'sailing';

        initLayers();
        initFish();
        initLoreBottles();

        loadAllAssets();
    }
}

function initTitleScreen() {
    if (hasSaveGame()) {
        const info = getSaveInfo();
        document.getElementById('continue-btn').style.display = 'block';
        if (info) {
            document.getElementById('save-info').innerHTML =
                `Last save: ${info.timestamp}<br>Gold: ${info.money} | Lore: ${info.loreCount}/12 | Catches: ${info.totalCatches}`;
        }
    }
}

// Initialize
window.onload = function() {
    setupInputHandlers();
    initTitleScreen();
    requestAnimationFrame(gameLoop);
};
