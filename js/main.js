// ============================================================
// THE DEEP ONES - MAIN GAME LOOP
// ============================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;

function update(deltaTime) {
    if (game.state === 'title') return;

    // Handle ending state separately
    if (game.state === 'ending') {
        updateEnding(deltaTime);
        return;
    }

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
    updateAchievementNotification();
    updateSoundEffects();
    updateStreak();

    // Update new Cast n Chill inspired systems
    updateCameraPan();
    updateFishStruggleParticles();
    updateIdleFishing(deltaTime);

    // Update events system
    if (typeof updateEvents === 'function') {
        updateEvents(deltaTime);
    }

    // Update audio
    if (typeof AudioManager !== 'undefined' && AudioManager.context) {
        AudioManager.updateAmbient(game);
        if (game.time % 30000 < deltaTime) {  // Every 30 seconds, check music mood
            AudioManager.updateMusic(game);
        }
    }

    // Update stats
    game.achievements.stats.timePlayed += deltaTime / 1000;

    // Random ambient sounds
    if (game.weather.current === 'storm' && Math.random() < 0.001) {
        triggerWaveSound();
        if (typeof playWave === 'function') playWave();
    }
    if (game.state === 'sailing' && Math.random() < 0.0005) {
        triggerCreakSound();
        if (typeof playCreak === 'function') playCreak();
    }

    // Check endings
    checkEnding();

    // Check achievements
    checkAchievements();

    // Update location
    game.currentLocation = getCurrentLocation();

    // Track visited locations for achievements
    if (!game.storyFlags.visitedLocations.includes(game.currentLocation)) {
        game.storyFlags.visitedLocations.push(game.currentLocation);
    }

    // Track void visit
    if (game.currentLocation === 'void') {
        game.storyFlags.reachedVoid = true;
    }

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
    updateTouchActionButton();
}

function render() {
    ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    if (game.state === 'title') return;

    // Handle ending rendering
    if (game.state === 'ending') {
        drawEndingScene();
        return;
    }

    // Apply screen shake if active
    ctx.save();
    if (typeof applyBigCatchShake === 'function') {
        applyBigCatchShake();
    }

    // Apply underwater camera panning (Cast n Chill inspired)
    const cameraPanOffset = getCameraPanOffset();
    if (cameraPanOffset > 0) {
        ctx.translate(0, -cameraPanOffset);
    }

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

    // Draw enhanced water reflection (Cast n Chill inspired)
    if (typeof drawEnhancedWaterReflection === 'function') {
        drawEnhancedWaterReflection();
    } else if (typeof drawWaterReflection === 'function') {
        drawWaterReflection();
    }

    // Draw boat
    drawBoat();

    // Draw fishing line
    drawFishingLine();

    // Draw fish struggle particles (Cast n Chill inspired)
    drawFishStruggleParticles();

    // Draw weather effects
    drawWeatherEffects();

    // Draw event visuals
    if (typeof drawEventVisuals === 'function') {
        drawEventVisuals();
    }

    // Draw sanity effects
    drawSanityEffects();

    // Draw glitch effect
    if (typeof drawGlitchEffect === 'function') {
        drawGlitchEffect();
    }

    ctx.restore();  // Restore from screen shake and camera pan

    // Draw UI elements
    drawLocationIndicator();
    drawWeatherIndicator();
    drawDogIndicator();
    drawTransformationIndicator();

    // Draw streak indicator
    if (typeof drawStreakIndicator === 'function') {
        drawStreakIndicator();
    }

    // Draw daily challenges
    if (typeof drawDailyChallenges === 'function') {
        drawDailyChallenges();
    }

    // Draw mute indicator
    if (typeof drawMuteIndicator === 'function') {
        drawMuteIndicator();
    }

    // Draw endless mode indicator
    if (game.endlessMode) {
        ctx.fillStyle = 'rgba(80, 60, 100, 0.7)';
        ctx.fillRect(CONFIG.canvas.width - 120, 10, 110, 25);
        ctx.fillStyle = '#c0a0d0';
        ctx.font = '12px VT323';
        ctx.textAlign = 'center';
        ctx.fillText('ENDLESS MODE', CONFIG.canvas.width - 65, 27);
        ctx.textAlign = 'left';
    }

    // Draw minigame with fish struggle indicator
    drawMinigame();
    drawFishStruggleIndicator();

    // Draw idle fishing indicator
    drawIdleFishingIndicator();

    // Draw popups
    drawCatchPopup();
    drawLorePopup();
    drawShopUI();
    drawLoreCollection();
    drawJournal();
    drawVillageMenu();
    drawAchievementsViewer();

    // Draw settings menu
    if (typeof drawSettingsMenu === 'function') {
        drawSettingsMenu();
    }

    // Draw delete confirmation
    if (typeof drawDeleteConfirmation === 'function') {
        drawDeleteConfirmation();
    }

    // Draw notifications
    drawSaveNotification();
    drawAchievementNotification();

    // Draw sound effects
    drawSoundEffects();

    // Draw hotkey help if open
    if (game.hotkeyHelp.open) {
        drawHotkeyHelp();
    }

    // Draw tutorial if active
    drawTutorial();

    // Draw fullscreen hint on mobile
    if (typeof drawFullscreenHint === 'function') {
        drawFullscreenHint();
    }
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
    // Initialize audio
    if (typeof AudioManager !== 'undefined') {
        AudioManager.init();
    }

    // Load settings
    if (typeof loadSettings === 'function') {
        loadSettings();
    }

    // Generate daily challenges
    if (typeof generateDailyChallenges === 'function') {
        generateDailyChallenges();
    }

    setupInputHandlers();
    setupTouchControls();
    initTitleScreen();
    requestAnimationFrame(gameLoop);

    // Resume audio context on first user interaction
    document.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined') {
            AudioManager.resume();
        }
    }, { once: true });

    document.addEventListener('keydown', () => {
        if (typeof AudioManager !== 'undefined') {
            AudioManager.resume();
        }
    }, { once: true });
};
