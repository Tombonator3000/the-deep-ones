// ============================================================
// THE DEEP ONES - INPUT HANDLING
// ============================================================

function handleMinigameInput(e) {
    if (!game.minigame.active) return false;

    // Simplified minigame - SPACE to reel faster
    if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        game.minigame.reeling = true;
        return true;
    }
    return false;
}

// Handle key release for minigame
function handleMinigameKeyUp(e) {
    if (!game.minigame.active) return false;

    if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        game.minigame.reeling = false;
        return true;
    }
    return false;
}

function handleShopInput(e) {
    if (!game.shop.open) return false;

    if (e.key === 'Tab') {
        e.preventDefault();
        const tabs = ['sell', 'rods', 'lures', 'boats'];
        const idx = tabs.indexOf(game.shop.tab);
        game.shop.tab = tabs[(idx + 1) % tabs.length];
        game.shop.selectedIndex = 0;
        return true;
    } else if (e.key === 'ArrowUp') {
        game.shop.selectedIndex = Math.max(0, game.shop.selectedIndex - 1);
        return true;
    } else if (e.key === 'ArrowDown') {
        let maxIdx = 0;
        if (game.shop.tab === 'sell') maxIdx = Math.max(0, game.inventory.length - 1);
        else if (game.shop.tab === 'rods') maxIdx = SHOP.rods.length - 1;
        else if (game.shop.tab === 'lures') maxIdx = SHOP.lures.length - 1;
        else if (game.shop.tab === 'boats') maxIdx = SHOP.boats.length - 1;
        game.shop.selectedIndex = Math.min(maxIdx, game.shop.selectedIndex + 1);
        return true;
    } else if (e.key === ' ' || e.key === 'Enter') {
        shopAction();
        return true;
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'e') {
        closeShop();
        return true;
    } else if (e.key.toLowerCase() === 'a' && game.shop.tab === 'sell') {
        sellAllFish();
        return true;
    }
    return false;
}

function handleLoreViewerInput(e) {
    if (!game.loreViewer.open) return false;

    if (e.key === 'ArrowLeft') {
        game.loreViewer.page = Math.max(0, game.loreViewer.page - 1);
        return true;
    } else if (e.key === 'ArrowRight') {
        const totalPages = Math.ceil(LORE_FRAGMENTS.length / game.loreViewer.itemsPerPage);
        game.loreViewer.page = Math.min(totalPages - 1, game.loreViewer.page + 1);
        return true;
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'l') {
        game.loreViewer.open = false;
        return true;
    }
    return false;
}

function handleJournalInput(e) {
    if (!game.journal.open) return false;

    if (e.key === 'ArrowLeft') {
        game.journal.page = Math.max(0, game.journal.page - 1);
        return true;
    } else if (e.key === 'ArrowRight') {
        game.journal.page = Math.min(3, game.journal.page + 1); // 4 zones
        return true;
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'j') {
        closeJournal();
        return true;
    }
    return false;
}

function handleVillageMenuInput(e) {
    if (!game.villageMenu.open) return false;

    if (e.key === 'ArrowUp') {
        game.villageMenu.selectedIndex = Math.max(0, game.villageMenu.selectedIndex - 1);
        return true;
    } else if (e.key === 'ArrowDown') {
        game.villageMenu.selectedIndex = Math.min(3, game.villageMenu.selectedIndex + 1);
        return true;
    } else if (e.key === ' ' || e.key === 'Enter') {
        villageMenuAction();
        return true;
    } else if (e.key === 'Escape') {
        closeVillageMenu();
        return true;
    }
    return false;
}

function handleAchievementsViewerInput(e) {
    if (!game.achievements.viewerOpen) return false;

    const allAchievements = Object.values(ACHIEVEMENTS);
    const totalPages = Math.ceil(allAchievements.length / 6);

    if (e.key === 'ArrowLeft') {
        game.achievements.viewerPage = Math.max(0, game.achievements.viewerPage - 1);
        return true;
    } else if (e.key === 'ArrowRight') {
        game.achievements.viewerPage = Math.min(totalPages - 1, game.achievements.viewerPage + 1);
        return true;
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'a') {
        closeAchievementsViewer();
        return true;
    }
    return false;
}

function handleEndingInput(e) {
    if (game.state !== 'ending') return false;

    if (game.ending.canContinue) {
        if (e.key === ' ') {
            startEndlessMode();
            return true;
        } else if (e.key === 'Escape') {
            // Return to title
            game.state = 'title';
            game.ending.triggered = false;
            game.ending.phase = 'none';
            document.getElementById('title-screen').style.display = 'flex';
            return true;
        }
    }
    return true;  // Block all other input during ending
}

function setupInputHandlers() {
    document.addEventListener('keydown', (e) => {
        // Handle ending input first
        if (handleEndingInput(e)) return;

        // Handle lore popup first
        if (game.currentLore) {
            if (e.key === ' ') {
                game.currentLore = null;
                if (typeof playMenuClose === 'function') playMenuClose();
            }
            return;
        }

        // Handle settings menu input
        if (typeof handleSettingsInput === 'function' && handleSettingsInput(e)) return;

        // Handle lore viewer
        if (handleLoreViewerInput(e)) return;

        // Handle journal input
        if (handleJournalInput(e)) return;

        // Handle village menu input
        if (handleVillageMenuInput(e)) return;

        // Handle achievements viewer input
        if (handleAchievementsViewerInput(e)) return;

        // Handle minigame input
        if (handleMinigameInput(e)) return;

        // Handle shop input
        if (handleShopInput(e)) return;

        // Lore viewer toggle
        if (e.key.toLowerCase() === 'l' && game.state !== 'title') {
            game.loreViewer.open = !game.loreViewer.open;
            return;
        }

        // Achievements viewer toggle
        if (e.key.toLowerCase() === 'a' && game.state !== 'title') {
            if (game.achievements.viewerOpen) {
                closeAchievementsViewer();
            } else {
                openAchievementsViewer();
            }
            return;
        }

        // Journal toggle
        if (e.key.toLowerCase() === 'j' && game.state !== 'title') {
            if (game.journal.open) {
                closeJournal();
            } else {
                openJournal();
            }
            return;
        }

        // Save game
        if (e.key === 'S' && e.shiftKey) {
            saveGame();
            return;
        }

        // Time controls
        if (e.key === 'T' && e.shiftKey) {
            game.timePaused = !game.timePaused;
            return;
        }

        // Debug toggle
        if (e.key.toLowerCase() === 'd') {
            CONFIG.showDebug = !CONFIG.showDebug;
            updateDebugPanel();
            return;
        }

        // Sprite toggle - ONLY allow if sprites are actually loaded
        if (e.key.toLowerCase() === 's' && !e.shiftKey) {
            // Count how many sprites are actually loaded (not failed)
            const loadedCount = Object.values(loadedAssets.status).filter(s => s === 'loaded').length;

            // If currently using sprites and want to turn OFF, always allow
            if (CONFIG.useSprites) {
                CONFIG.useSprites = false;
                console.log('Switched to procedural mode');
                updateDebugPanel();
                return;
            }

            // If want to turn ON sprites, only allow if any are loaded
            if (loadedCount > 0) {
                CONFIG.useSprites = true;
                console.log('Switched to sprite mode');
                updateDebugPanel();
            } else {
                console.log('No sprites loaded - cannot switch to sprite mode');
            }
            return;
        }

        // Mute toggle
        if (e.key.toLowerCase() === 'm' && game.state !== 'title') {
            if (typeof AudioManager !== 'undefined') {
                AudioManager.toggleMute();
            }
            return;
        }

        // Fullscreen toggle
        if (e.key.toLowerCase() === 'f' && game.state !== 'title') {
            if (typeof toggleFullscreen === 'function') {
                toggleFullscreen();
            }
            return;
        }

        // Settings menu toggle
        if (e.key.toLowerCase() === 'o' && game.state !== 'title') {
            if (typeof settingsMenu !== 'undefined') {
                if (settingsMenu.open) {
                    if (typeof closeSettingsMenu === 'function') closeSettingsMenu();
                } else {
                    if (typeof openSettingsMenu === 'function') openSettingsMenu();
                }
            }
            return;
        }

        // Game state controls
        if (game.state === 'title') return;

        const rod = getCurrentRod();
        const boat = getCurrentBoat();
        // Reduced multiplier from 3 to 1.5 for smoother movement at 480x270 resolution
        const speed = (boat ? boat.speed : 1) * 1.5;

        switch (e.key) {
            case 'ArrowLeft':
                if (game.state === 'sailing') {
                    game.boatX = Math.max(CONFIG.worldMinX, game.boatX - speed);
                }
                break;
            case 'ArrowRight':
                if (game.state === 'sailing') {
                    game.boatX = Math.min(CONFIG.worldMaxX, game.boatX + speed);
                }
                break;
            case 'ArrowUp':
                // Arrow Up = reel up toward surface (decrease depth)
                if (game.state === 'waiting' || game.state === 'reeling') {
                    game.targetDepth = Math.max(0, game.targetDepth - 5);
                }
                break;
            case 'ArrowDown':
                // Arrow Down = lower line toward bottom (increase depth)
                if (game.state === 'waiting' || game.state === 'reeling') {
                    const maxDepth = rod ? rod.depthMax : 30;
                    game.targetDepth = Math.min(maxDepth, game.targetDepth + 5);
                }
                break;
            case ' ':
                if (game.state === 'sailing') {
                    game.state = 'waiting';
                    game.targetDepth = 0;  // Start at surface, use Down arrow to go deeper
                    game.depth = 0;
                    triggerSplashSound();
                    if (typeof playSplash === 'function') playSplash();
                    // Add water ripple effect when casting
                    if (typeof WaterEffects !== 'undefined' && typeof WaterEffects.addRipple === 'function') {
                        WaterEffects.addRipple(game.boatX, CONFIG.waterLine, 1.5);
                    }
                } else if (game.state === 'waiting') {
                    game.state = 'sailing';
                    game.depth = 0;
                    game.targetDepth = 0;
                    // Reset camera to surface
                    if (game.camera) {
                        game.camera.targetY = 0;
                    }
                } else if (game.state === 'caught') {
                    const c = game.currentCatch;

                    // Handle lore fragments specially
                    if (c.isLore && c.loreId) {
                        const lore = LORE_FRAGMENTS.find(l => l.id === c.loreId);
                        if (lore && !lore.found) {
                            lore.found = true;
                            game.loreFound.push(lore.id);
                            game.currentLore = lore;
                            // Remove from floating bottles if exists
                            const bottleIndex = game.loreBottles.findIndex(b => b.id === lore.id);
                            if (bottleIndex !== -1) {
                                game.loreBottles.splice(bottleIndex, 1);
                            }
                        }
                        // Apply small sanity loss from reading eldritch text
                        game.sanity = Math.max(0, game.sanity - c.sanityLoss);
                        game.transformation.totalSanityLost += c.sanityLoss;

                        game.currentCatch = null;
                        game.state = 'sailing';
                        game.depth = 0;
                        game.targetDepth = 0;
                        if (game.camera) {
                            game.camera.targetY = 0;
                        }
                        autoSave();
                        break;
                    }

                    game.sanity = Math.max(0, game.sanity - c.sanityLoss);

                    // Track sanity lost for transformation
                    game.transformation.totalSanityLost += c.sanityLoss;

                    // Add to journal
                    addToJournal(c);

                    // Add to streak
                    if (typeof addToStreak === 'function') {
                        addToStreak();
                    }

                    // Apply streak bonus to value
                    const streakBonus = game.streak.comboMultiplier || 1;
                    const adjustedValue = Math.floor(c.value * streakBonus);

                    // Track total fish caught and biggest catch
                    game.achievements.stats.totalFishCaught++;
                    const zone = c.value >= 500 ? 'abyss' : c.value >= 180 ? 'deep' : c.value >= 60 ? 'mid' : 'surface';
                    if (c.value > game.achievements.stats.biggestCatch[zone]) {
                        game.achievements.stats.biggestCatch[zone] = c.value;
                    }

                    // Check daily challenges
                    if (typeof checkDailyChallengeProgress === 'function') {
                        checkDailyChallengeProgress('catch', { zone: zone });
                        if (game.timeOfDay === 'night') {
                            checkDailyChallengeProgress('nightCatch', 1);
                        }
                        if (game.weather.current === 'storm') {
                            checkDailyChallengeProgress('stormCatch', 1);
                        }
                    }

                    if (game.inventory.length < game.inventoryMax) {
                        // Store with adjusted value for selling
                        const catchWithBonus = { ...c, value: adjustedValue };
                        game.inventory.push(catchWithBonus);
                    } else {
                        game.money += Math.floor(adjustedValue * 0.5);
                        game.achievements.stats.totalGoldEarned += Math.floor(adjustedValue * 0.5);
                    }

                    game.caughtCreatures.push(c);
                    if (c.rarity < 0.15) game.lastRareCatch = true;

                    // Add to trophy tracking (Cast n Chill inspired)
                    if (typeof addTrophy === 'function') {
                        addTrophy(c);
                    }

                    // Trigger visual effects for rare/valuable catches
                    if (c.value >= 180 && typeof game.visualEffects !== 'undefined') {
                        game.visualEffects.bigCatchShake = 0.5;
                    }
                    if (c.value >= 500 && typeof triggerGlitch === 'function') {
                        triggerGlitch(0.3);
                    }

                    // Track story flags
                    if (c.name === "The Unnamed") game.storyFlags.caughtUnnamed = true;

                    // Track achievement stats
                    if (game.timeOfDay === 'night') {
                        game.achievements.stats.nightCatches++;
                    }
                    if (game.weather.current === 'storm') {
                        game.achievements.stats.stormCatches++;
                    }

                    game.currentCatch = null;
                    game.state = 'sailing';
                    game.depth = 0;
                    game.targetDepth = 0;
                    // Reset camera to surface
                    if (game.camera) {
                        game.camera.targetY = 0;
                    }
                    autoSave();
                }
                break;
            case 'h':
            case 'H':
                game.hotkeyHelp.open = !game.hotkeyHelp.open;
                break;
            case 't':
                if (!e.shiftKey) cycleTime();
                break;
            case 'e':
            case 'E':
                if (game.nearDock && !game.shop.open && !game.villageMenu.open) {
                    openVillageMenu();
                }
                break;
            case 'p':
            case 'P':
                petDog();
                break;
            case 'i':
            case 'I':
                // Toggle idle fishing mode (Cast n Chill inspired)
                if (typeof toggleIdleFishing === 'function' && game.state === 'sailing') {
                    toggleIdleFishing();
                }
                break;
        }
    });

    // Keyup handler for minigame (stop reeling)
    document.addEventListener('keyup', (e) => {
        handleMinigameKeyUp(e);
    });
}

function cycleTime() {
    const times = ['dawn', 'day', 'dusk', 'night'];
    const idx = times.indexOf(game.timeOfDay);
    game.timeOfDay = times[(idx + 1) % 4];
    initLayers();
}

// ============================================================
// TOUCH CONTROLS
// ============================================================

const touchState = {
    activeKeys: new Set(),
    holdIntervals: {},
    isTouchDevice: false
};

function setupTouchControls() {
    // Detect touch device
    touchState.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    const touchControls = document.getElementById('touch-controls');
    if (!touchControls) return;

    // Show/hide touch controls based on device
    if (touchState.isTouchDevice) {
        touchControls.classList.add('visible');
    }

    // Get all touch buttons
    const touchButtons = document.querySelectorAll('.touch-btn');

    touchButtons.forEach(btn => {
        const key = btn.dataset.key;
        if (!key) return;

        // Touch start - simulate key press
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            btn.classList.add('pressed');
            handleTouchKeyDown(key);

            // For movement keys AND space during minigame, enable continuous action
            if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
                startHoldAction(key);
            }
            // Enable continuous reeling during minigame
            if (key === ' ' && game.minigame && game.minigame.active) {
                game.minigame.reeling = true;
            }
        }, { passive: false });

        // Touch end - simulate key release
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            btn.classList.remove('pressed');
            stopHoldAction(key);
            // Stop reeling when releasing
            if (key === ' ' && game.minigame) {
                game.minigame.reeling = false;
            }
        }, { passive: false });

        // Touch cancel
        btn.addEventListener('touchcancel', (e) => {
            btn.classList.remove('pressed');
            stopHoldAction(key);
            if (key === ' ' && game.minigame) {
                game.minigame.reeling = false;
            }
        });

        // Mouse events for testing on desktop
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            btn.classList.add('pressed');
            handleTouchKeyDown(key);

            if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
                startHoldAction(key);
            }
            // Enable continuous reeling during minigame
            if (key === ' ' && game.minigame && game.minigame.active) {
                game.minigame.reeling = true;
            }
        });

        btn.addEventListener('mouseup', (e) => {
            btn.classList.remove('pressed');
            stopHoldAction(key);
            if (key === ' ' && game.minigame) {
                game.minigame.reeling = false;
            }
        });

        btn.addEventListener('mouseleave', (e) => {
            btn.classList.remove('pressed');
            stopHoldAction(key);
            if (key === ' ' && game.minigame) {
                game.minigame.reeling = false;
            }
        });
    });

    // Prevent default touch behaviors on game canvas
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
}

function handleTouchKeyDown(key) {
    // Dispatch a keyboard event with proper properties for bubble and capture
    const event = new KeyboardEvent('keydown', {
        key: key,
        code: key === ' ' ? 'Space' : key,
        keyCode: key === ' ' ? 32 : key.charCodeAt(0),
        which: key === ' ' ? 32 : key.charCodeAt(0),
        shiftKey: false,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
}

function startHoldAction(key) {
    // Clear any existing interval for this key
    stopHoldAction(key);

    touchState.activeKeys.add(key);

    // For continuous movement, repeat the action
    touchState.holdIntervals[key] = setInterval(() => {
        if (touchState.activeKeys.has(key)) {
            handleTouchKeyDown(key);
        }
    }, 50); // 20 FPS for smooth movement
}

function stopHoldAction(key) {
    touchState.activeKeys.delete(key);

    if (touchState.holdIntervals[key]) {
        clearInterval(touchState.holdIntervals[key]);
        delete touchState.holdIntervals[key];
    }
}

// Update touch action button text based on game state
function updateTouchActionButton() {
    const actionBtn = document.getElementById('touch-action');
    if (!actionBtn) return;

    // Check if minigame is active
    if (game.minigame && game.minigame.active) {
        actionBtn.textContent = 'REEL';
        return;
    }

    switch (game.state) {
        case 'sailing':
            actionBtn.textContent = 'CAST';
            break;
        case 'waiting':
            actionBtn.textContent = 'REEL';
            break;
        case 'reeling':
            actionBtn.textContent = 'REEL';
            break;
        case 'caught':
            actionBtn.textContent = 'OK';
            break;
        default:
            actionBtn.textContent = 'CAST';
    }
}

// Check if device is touch-capable
function isTouchDevice() {
    return touchState.isTouchDevice;
}

// ============================================================
// MOUSE CONTROLS FOR PC
// ============================================================

const mouseState = {
    x: 0,
    y: 0,
    isDown: false
};

function setupMouseControls() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    // Track mouse position
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseState.x = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouseState.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    });

    // Handle mouse clicks
    canvas.addEventListener('click', handleMouseClick);

    // Update cursor style based on hovering over interactive elements
    canvas.addEventListener('mousemove', updateCursor);
}

function handleMouseClick(e) {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Handle shop clicks
    if (game.shop.open) {
        handleShopClick(x, y);
        return;
    }

    // Handle village menu clicks
    if (game.villageMenu && game.villageMenu.open) {
        handleVillageMenuClick(x, y);
        return;
    }

    // Handle journal clicks
    if (game.journal && game.journal.open) {
        handleJournalClick(x, y);
        return;
    }

    // Handle lore viewer clicks
    if (game.loreViewer && game.loreViewer.open) {
        handleLoreViewerClick(x, y);
        return;
    }

    // Handle achievements viewer clicks
    if (game.achievements && game.achievements.viewerOpen) {
        handleAchievementsClick(x, y);
        return;
    }

    // Handle catch popup clicks
    if (game.state === 'caught' && game.currentCatch) {
        // Click anywhere to continue
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
        document.dispatchEvent(event);
        return;
    }

    // Handle lore popup clicks
    if (game.currentLore) {
        game.currentLore = null;
        if (typeof playMenuClose === 'function') playMenuClose();
        return;
    }

    // Handle dock interaction
    if (game.nearDock && !game.shop.open && !game.villageMenu.open && game.state === 'sailing') {
        const dockX = CONFIG.dockX - game.cameraX;
        if (x >= dockX - 70 && x <= dockX + 70 && y >= CONFIG.waterLine - 100 && y <= CONFIG.waterLine - 75) {
            openVillageMenu();
            return;
        }
    }
}

function handleShopClick(x, y) {
    const w = CONFIG.canvas.width;
    const h = CONFIG.canvas.height;
    const panelW = 420, panelH = h - 80;
    const panelX = w - panelW - 30;
    const panelY = 40;

    // Check tab clicks
    const tabWidth = panelW / 4;
    const tabY = panelY + 60;
    const tabHeight = 28;

    if (y >= tabY && y <= tabY + tabHeight) {
        const tabs = ['sell', 'rods', 'lures', 'boats'];
        for (let i = 0; i < 4; i++) {
            const tabX = panelX + i * tabWidth;
            if (x >= tabX && x <= tabX + tabWidth) {
                game.shop.tab = tabs[i];
                game.shop.selectedIndex = 0;
                if (typeof playMenuClick === 'function') playMenuClick();
                return;
            }
        }
    }

    // Check item clicks in content area
    const contentY = panelY + 150;
    const contentX = panelX + 20;
    const contentW = panelW - 40;

    if (x >= contentX && x <= contentX + contentW) {
        let itemHeight, itemStartY;

        if (game.shop.tab === 'sell') {
            itemHeight = 25;
            itemStartY = contentY + 30;
            const maxItems = game.inventory.length;

            for (let i = 0; i < maxItems; i++) {
                const itemY = itemStartY + i * itemHeight;
                if (y >= itemY - 15 && y <= itemY + 10) {
                    game.shop.selectedIndex = i;
                    shopAction();
                    return;
                }
            }
        } else if (game.shop.tab === 'lures') {
            itemHeight = 50;
            itemStartY = contentY + 30;
            for (let i = 0; i < SHOP.lures.length; i++) {
                const itemY = itemStartY + i * itemHeight;
                if (y >= itemY - 5 && y <= itemY + 45) {
                    game.shop.selectedIndex = i;
                    shopAction();
                    return;
                }
            }
        } else {
            // Rods and boats
            itemHeight = 55;
            itemStartY = contentY;
            const items = game.shop.tab === 'rods' ? SHOP.rods : SHOP.boats;
            for (let i = 0; i < items.length; i++) {
                const itemY = itemStartY + i * itemHeight;
                if (y >= itemY - 5 && y <= itemY + 50) {
                    game.shop.selectedIndex = i;
                    shopAction();
                    return;
                }
            }
        }
    }

    // Check close button / click outside panel to close
    if (x < panelX - 10 || y < panelY - 10 || y > panelY + panelH + 10) {
        closeShop();
    }
}

function handleVillageMenuClick(x, y) {
    const w = 350, h = 280;
    const menuX = (CONFIG.canvas.width - w) / 2;
    const menuY = (CONFIG.canvas.height - h) / 2;

    // Check if clicked outside menu
    if (x < menuX || x > menuX + w || y < menuY || y > menuY + h) {
        closeVillageMenu();
        return;
    }

    // Check menu items
    const options = ['Bait Shop', 'Rest', 'Talk', 'Leave'];
    const optionStartY = menuY + 85;
    const optionHeight = 45;

    for (let i = 0; i < options.length; i++) {
        const optY = optionStartY + i * optionHeight;
        if (y >= optY && y <= optY + 40 && x >= menuX + 25 && x <= menuX + w - 25) {
            game.villageMenu.selectedIndex = i;
            villageMenuAction();
            return;
        }
    }
}

function handleJournalClick(x, y) {
    const w = 700, h = 500;
    const menuX = (CONFIG.canvas.width - w) / 2;
    const menuY = (CONFIG.canvas.height - h) / 2;

    // Navigation arrows
    const arrowY = menuY + h - 40;

    // Left arrow
    if (x >= menuX + 20 && x <= menuX + 60 && y >= arrowY - 20 && y <= arrowY + 10) {
        if (game.journal.page > 0) {
            game.journal.page--;
            if (typeof playMenuClick === 'function') playMenuClick();
        }
        return;
    }

    // Right arrow
    if (x >= menuX + w - 60 && x <= menuX + w - 20 && y >= arrowY - 20 && y <= arrowY + 10) {
        if (game.journal.page < 3) {
            game.journal.page++;
            if (typeof playMenuClick === 'function') playMenuClick();
        }
        return;
    }

    // Click outside or on close area
    if (x < menuX || x > menuX + w || y < menuY || y > menuY + h) {
        closeJournal();
    }
}

function handleLoreViewerClick(x, y) {
    const w = 600, h = 450;
    const menuX = (CONFIG.canvas.width - w) / 2;
    const menuY = (CONFIG.canvas.height - h) / 2;
    const totalPages = Math.ceil(LORE_FRAGMENTS.length / game.loreViewer.itemsPerPage);

    // Navigation - left side
    if (x >= menuX + 20 && x <= menuX + 100 && y >= menuY + h - 50 && y <= menuY + h - 20) {
        if (game.loreViewer.page > 0) {
            game.loreViewer.page--;
            if (typeof playMenuClick === 'function') playMenuClick();
        }
        return;
    }

    // Navigation - right side
    if (x >= menuX + w - 100 && x <= menuX + w - 20 && y >= menuY + h - 50 && y <= menuY + h - 20) {
        if (game.loreViewer.page < totalPages - 1) {
            game.loreViewer.page++;
            if (typeof playMenuClick === 'function') playMenuClick();
        }
        return;
    }

    // Click outside to close
    if (x < menuX || x > menuX + w || y < menuY || y > menuY + h) {
        game.loreViewer.open = false;
        if (typeof playMenuClose === 'function') playMenuClose();
    }
}

function handleAchievementsClick(x, y) {
    const w = 650, h = 480;
    const menuX = (CONFIG.canvas.width - w) / 2;
    const menuY = (CONFIG.canvas.height - h) / 2;
    const allAchievements = Object.values(ACHIEVEMENTS);
    const totalPages = Math.ceil(allAchievements.length / 6);

    // Navigation - left side
    if (x >= menuX + 20 && x <= menuX + 100 && y >= menuY + h - 50 && y <= menuY + h - 20) {
        if (game.achievements.viewerPage > 0) {
            game.achievements.viewerPage--;
            if (typeof playMenuClick === 'function') playMenuClick();
        }
        return;
    }

    // Navigation - right side
    if (x >= menuX + w - 100 && x <= menuX + w - 20 && y >= menuY + h - 50 && y <= menuY + h - 20) {
        if (game.achievements.viewerPage < totalPages - 1) {
            game.achievements.viewerPage++;
            if (typeof playMenuClick === 'function') playMenuClick();
        }
        return;
    }

    // Click outside to close
    if (x < menuX || x > menuX + w || y < menuY || y > menuY + h) {
        closeAchievementsViewer();
    }
}

function updateCursor(e) {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    let isClickable = false;

    // Check if hovering over clickable elements
    if (game.shop.open) {
        isClickable = isOverShopElement(x, y);
    } else if (game.villageMenu && game.villageMenu.open) {
        isClickable = isOverVillageMenuItem(x, y);
    } else if (game.nearDock && !game.shop.open && !game.villageMenu.open && game.state === 'sailing') {
        const dockX = CONFIG.dockX - game.cameraX;
        isClickable = x >= dockX - 70 && x <= dockX + 70 && y >= CONFIG.waterLine - 100 && y <= CONFIG.waterLine - 75;
    } else if (game.currentLore || (game.state === 'caught' && game.currentCatch)) {
        isClickable = true;
    }

    canvas.style.cursor = isClickable ? 'pointer' : 'default';
}

function isOverShopElement(x, y) {
    const w = CONFIG.canvas.width;
    const h = CONFIG.canvas.height;
    const panelW = 420;
    const panelX = w - panelW - 30;
    const panelY = 40;

    // Tabs
    const tabY = panelY + 60;
    if (y >= tabY && y <= tabY + 28 && x >= panelX && x <= panelX + panelW) {
        return true;
    }

    // Content area items
    const contentY = panelY + 150;
    const contentX = panelX + 20;
    const contentW = panelW - 40;

    if (x >= contentX && x <= contentX + contentW && y >= contentY && y <= h - 100) {
        return true;
    }

    return false;
}

function isOverVillageMenuItem(x, y) {
    const w = 350, h = 280;
    const menuX = (CONFIG.canvas.width - w) / 2;
    const menuY = (CONFIG.canvas.height - h) / 2;
    const optionStartY = menuY + 85;
    const optionHeight = 45;

    for (let i = 0; i < 4; i++) {
        const optY = optionStartY + i * optionHeight;
        if (y >= optY && y <= optY + 40 && x >= menuX + 25 && x <= menuX + w - 25) {
            return true;
        }
    }
    return false;
}
