// ============================================================
// THE DEEP ONES - SAVE/LOAD SYSTEM
// ============================================================

const SAVE_KEY = 'theDeepOnes_save';

let saveNotification = { show: false, text: '', timer: 0 };

function saveGame() {
    const saveData = {
        version: '1.0',
        timestamp: Date.now(),
        game: {
            money: game.money,
            sanity: game.sanity,
            boatX: game.boatX,
            timeOfDay: game.timeOfDay,
            dayProgress: game.dayProgress,
            currentLocation: game.currentLocation
        },
        equipment: { ...game.equipment },
        inventory: [...game.inventory],
        loreFound: [...game.loreFound],
        dog: { happiness: game.dog.happiness },
        shop: {
            rods: SHOP.rods.map(r => ({ id: r.id, owned: r.owned })),
            lures: SHOP.lures.map(l => ({ id: l.id, count: l.count })),
            boats: SHOP.boats.map(b => ({ id: b.id, owned: b.owned }))
        },
        transformation: {
            stage: game.transformation.stage,
            totalSanityLost: game.transformation.totalSanityLost
        },
        journal: {
            discovered: [...game.journal.discovered]
        },
        storyFlags: { ...game.storyFlags },
        stats: {
            totalCatches: game.caughtCreatures.length
        },
        achievements: {
            unlocked: [...game.achievements.unlocked],
            stats: { ...game.achievements.stats }
        },
        ending: {
            triggered: game.ending.triggered,
            current: game.ending.current
        },
        endlessMode: game.endlessMode
    };

    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        showSaveNotification('Game Saved!');
        return true;
    } catch (e) {
        console.error('Failed to save:', e);
        return false;
    }
}

function loadGame() {
    try {
        const data = localStorage.getItem(SAVE_KEY);
        if (!data) return false;

        const saveData = JSON.parse(data);

        game.money = saveData.game.money;
        game.sanity = saveData.game.sanity;
        game.boatX = saveData.game.boatX;
        game.timeOfDay = saveData.game.timeOfDay;
        game.dayProgress = saveData.game.dayProgress || 0.5;
        game.currentLocation = saveData.game.currentLocation;

        game.equipment = { ...saveData.equipment };
        game.inventory = [...saveData.inventory];
        game.loreFound = [...saveData.loreFound];
        game.dog.happiness = saveData.dog.happiness;

        // Restore shop state
        saveData.shop.rods.forEach(saved => {
            const rod = SHOP.rods.find(r => r.id === saved.id);
            if (rod) rod.owned = saved.owned;
        });
        saveData.shop.lures.forEach(saved => {
            const lure = SHOP.lures.find(l => l.id === saved.id);
            if (lure) lure.count = saved.count;
        });
        saveData.shop.boats.forEach(saved => {
            const boat = SHOP.boats.find(b => b.id === saved.id);
            if (boat) boat.owned = saved.owned;
        });

        // Restore lore found state
        LORE_FRAGMENTS.forEach(lore => {
            lore.found = game.loreFound.includes(lore.id);
        });

        // Restore transformation state
        if (saveData.transformation) {
            game.transformation.stage = saveData.transformation.stage || 0;
            game.transformation.totalSanityLost = saveData.transformation.totalSanityLost || 0;
        }

        // Restore journal state
        if (saveData.journal) {
            game.journal.discovered = [...(saveData.journal.discovered || [])];
        }

        // Restore story flags
        if (saveData.storyFlags) {
            game.storyFlags = { ...game.storyFlags, ...saveData.storyFlags };
        }

        // Restore achievements
        if (saveData.achievements) {
            game.achievements.unlocked = [...(saveData.achievements.unlocked || [])];
            game.achievements.stats = { ...game.achievements.stats, ...(saveData.achievements.stats || {}) };
        }

        // Restore ending state
        if (saveData.ending) {
            game.ending.triggered = saveData.ending.triggered || false;
            game.ending.current = saveData.ending.current || null;
        }

        // Restore endless mode
        game.endlessMode = saveData.endlessMode || false;

        // Update inventory max based on boat
        const boat = getCurrentBoat();
        if (boat) game.inventoryMax = boat.storage;

        return true;
    } catch (e) {
        console.error('Failed to load:', e);
        return false;
    }
}

function hasSaveGame() {
    return localStorage.getItem(SAVE_KEY) !== null;
}

function deleteSave() {
    localStorage.removeItem(SAVE_KEY);
}

function getSaveInfo() {
    try {
        const data = localStorage.getItem(SAVE_KEY);
        if (!data) return null;

        const saveData = JSON.parse(data);
        return {
            timestamp: new Date(saveData.timestamp).toLocaleString(),
            money: saveData.game.money,
            loreCount: saveData.loreFound.length,
            totalCatches: saveData.stats?.totalCatches || 0
        };
    } catch (e) {
        return null;
    }
}

function showSaveNotification(text) {
    saveNotification = { show: true, text: text, timer: 120 };
}

function drawSaveNotification() {
    if (!saveNotification.show) return;

    saveNotification.timer--;
    if (saveNotification.timer <= 0) {
        saveNotification.show = false;
        return;
    }

    const alpha = Math.min(1, saveNotification.timer / 30);
    ctx.fillStyle = `rgba(90, 140, 110, ${alpha * 0.8})`;
    ctx.fillRect(CONFIG.canvas.width - 150, 80, 140, 30);
    ctx.fillStyle = `rgba(200, 255, 200, ${alpha})`;
    ctx.font = '14px VT323';
    ctx.textAlign = 'center';
    ctx.fillText(saveNotification.text, CONFIG.canvas.width - 80, 100);
    ctx.textAlign = 'left';
}

function autoSave() {
    saveGame();
}
