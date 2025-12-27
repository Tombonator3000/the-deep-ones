// ============================================================
// THE DEEP ONES - INPUT HANDLING
// ============================================================

function handleMinigameInput(e) {
    if (!game.minigame.active) return false;

    if (e.key === 'ArrowLeft') {
        game.minigame.playerZone = Math.max(0, game.minigame.playerZone - 0.03);
        return true;
    } else if (e.key === 'ArrowRight') {
        game.minigame.playerZone = Math.min(1, game.minigame.playerZone + 0.03);
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
            }
            return;
        }

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

        // Sprite toggle
        if (e.key.toLowerCase() === 's' && !e.shiftKey) {
            CONFIG.useSprites = !CONFIG.useSprites;
            updateDebugPanel();
            return;
        }

        // Game state controls
        if (game.state === 'title') return;

        const rod = getCurrentRod();
        const boat = getCurrentBoat();
        const speed = (boat ? boat.speed : 1) * 3;

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
                if (game.state === 'waiting' || game.state === 'reeling') {
                    const maxDepth = rod ? rod.depthMax : 30;
                    game.targetDepth = Math.min(maxDepth, game.targetDepth + 5);
                }
                break;
            case 'ArrowDown':
                if (game.state === 'waiting' || game.state === 'reeling') {
                    game.targetDepth = Math.max(0, game.targetDepth - 5);
                }
                break;
            case ' ':
                if (game.state === 'sailing') {
                    game.state = 'waiting';
                    game.targetDepth = 30;
                    triggerSplashSound();
                } else if (game.state === 'waiting') {
                    game.state = 'sailing';
                    game.depth = 0;
                } else if (game.state === 'caught') {
                    const c = game.currentCatch;
                    game.sanity = Math.max(0, game.sanity - c.sanityLoss);

                    // Track sanity lost for transformation
                    game.transformation.totalSanityLost += c.sanityLoss;

                    // Add to journal
                    addToJournal(c);

                    // Track total fish caught and biggest catch
                    game.achievements.stats.totalFishCaught++;
                    const zone = c.value >= 500 ? 'abyss' : c.value >= 180 ? 'deep' : c.value >= 60 ? 'mid' : 'surface';
                    if (c.value > game.achievements.stats.biggestCatch[zone]) {
                        game.achievements.stats.biggestCatch[zone] = c.value;
                    }

                    if (game.inventory.length < game.inventoryMax) {
                        game.inventory.push(c);
                    } else {
                        game.money += Math.floor(c.value * 0.5);
                    }

                    game.caughtCreatures.push(c);
                    if (c.rarity < 0.15) game.lastRareCatch = true;

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
        }
    });
}

function cycleTime() {
    const times = ['dawn', 'day', 'dusk', 'night'];
    const idx = times.indexOf(game.timeOfDay);
    game.timeOfDay = times[(idx + 1) % 4];
    initLayers();
}
