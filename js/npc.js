// ============================================================
// THE DEEP ONES - NPC & SHOP SYSTEM
// ============================================================

function getRandomDialog(category) {
    const dialogs = NPC_DIALOGS[category];
    return dialogs[Math.floor(Math.random() * dialogs.length)];
}

function getCurrentRod() {
    return SHOP.rods.find(r => r.id === game.equipment.rod);
}

function getCurrentBoat() {
    return SHOP.boats.find(b => b.id === game.equipment.boat);
}

function getCurrentLure() {
    if (!game.equipment.lure) return null;
    return SHOP.lures.find(l => l.id === game.equipment.lure);
}

function drawDock() {
    const dockX = CONFIG.dockX - game.cameraX * 0.4;
    if (dockX < -150 || dockX > CONFIG.canvas.width + 50) return;

    const palette = getTimePalette();

    ctx.fillStyle = '#3a2a20';
    ctx.fillRect(dockX - 40, CONFIG.waterLine - 10, 80, 15);

    ctx.fillStyle = '#2a1a15';
    ctx.fillRect(dockX - 35, CONFIG.waterLine - 5, 8, 40);
    ctx.fillRect(dockX + 27, CONFIG.waterLine - 5, 8, 40);

    ctx.strokeStyle = '#4a3a30';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(dockX - 38, CONFIG.waterLine - 8 + i * 3);
        ctx.lineTo(dockX + 38, CONFIG.waterLine - 8 + i * 3);
        ctx.stroke();
    }

    ctx.fillStyle = '#2a2520';
    ctx.fillRect(dockX - 30, CONFIG.waterLine - 55, 60, 45);

    ctx.fillStyle = '#1a1510';
    ctx.beginPath();
    ctx.moveTo(dockX - 35, CONFIG.waterLine - 55);
    ctx.lineTo(dockX, CONFIG.waterLine - 75);
    ctx.lineTo(dockX + 35, CONFIG.waterLine - 55);
    ctx.closePath();
    ctx.fill();

    const windowGlow = 0.3 + Math.sin(game.time * 0.02) * 0.1;
    ctx.fillStyle = `rgba(255, 200, 120, ${windowGlow})`;
    ctx.fillRect(dockX - 20, CONFIG.waterLine - 45, 15, 12);

    ctx.fillStyle = '#1a1510';
    ctx.fillRect(dockX + 5, CONFIG.waterLine - 40, 18, 30);

    ctx.fillStyle = '#3a3530';
    ctx.fillRect(dockX + 40, CONFIG.waterLine - 50, 30, 20);
    ctx.fillStyle = '#8a9a7a';
    ctx.font = '10px VT323';
    ctx.fillText('BAIT', dockX + 44, CONFIG.waterLine - 36);

    if (game.nearDock || game.shop.open) drawOldMarsh(dockX);

    if (game.nearDock && !game.shop.open && !game.villageMenu.open && game.state === 'sailing') {
        ctx.fillStyle = 'rgba(10, 15, 12, 0.8)';
        ctx.fillRect(dockX - 70, CONFIG.waterLine - 100, 140, 25);
        ctx.fillStyle = '#aaddaa';
        ctx.font = '14px VT323';
        ctx.fillText('[E] Innsmouth Harbor', dockX - 60, CONFIG.waterLine - 82);
    }
}

function drawOldMarsh(dockX) {
    const bob = Math.sin(game.time * 0.015) * 1;

    ctx.fillStyle = '#1a1815';
    ctx.beginPath();
    ctx.ellipse(dockX - 5, CONFIG.waterLine - 25 + bob, 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#252520';
    ctx.beginPath();
    ctx.moveTo(dockX - 15, CONFIG.waterLine - 15 + bob);
    ctx.lineTo(dockX - 12, CONFIG.waterLine - 35 + bob);
    ctx.lineTo(dockX + 2, CONFIG.waterLine - 35 + bob);
    ctx.lineTo(dockX + 5, CONFIG.waterLine - 15 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#8a7a6a';
    ctx.beginPath();
    ctx.arc(dockX - 5, CONFIG.waterLine - 48 + bob, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3a3520';
    ctx.beginPath();
    ctx.ellipse(dockX - 5, CONFIG.waterLine - 55 + bob, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(dockX - 10, CONFIG.waterLine - 62 + bob, 10, 8);

    ctx.fillStyle = '#2a3a3a';
    const blink = Math.sin(game.time * 0.1) > 0.95 ? 0 : 1;
    ctx.fillRect(dockX - 9, CONFIG.waterLine - 50 + bob, 3, 2 * blink);
    ctx.fillRect(dockX - 3, CONFIG.waterLine - 50 + bob, 3, 2 * blink);

    ctx.fillStyle = '#5a5a5a';
    ctx.beginPath();
    ctx.moveTo(dockX - 8, CONFIG.waterLine - 42 + bob);
    ctx.lineTo(dockX - 10, CONFIG.waterLine - 35 + bob);
    ctx.lineTo(dockX, CONFIG.waterLine - 35 + bob);
    ctx.lineTo(dockX - 2, CONFIG.waterLine - 42 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#4a3a25';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(dockX + 8, CONFIG.waterLine - 40 + bob);
    ctx.lineTo(dockX + 12, CONFIG.waterLine - 45 + bob);
    ctx.lineTo(dockX + 20, CONFIG.waterLine - 42 + bob);
    ctx.stroke();

    if (Math.sin(game.time * 0.02) > 0.8) {
        ctx.fillStyle = 'rgba(180, 180, 180, 0.3)';
        ctx.beginPath();
        ctx.arc(dockX + 22 + Math.sin(game.time * 0.05) * 3, CONFIG.waterLine - 45 + bob - game.time * 0.02 % 20, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawShopUI() {
    if (!game.shop.open) return;

    const w = 500, h = 400;
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    ctx.fillStyle = 'rgba(15, 20, 18, 0.98)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#5a8a6a';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = '#8aba9a';
    ctx.textAlign = 'center';
    ctx.fillText("MARSH'S BAIT & TACKLE", x + w/2, y + 30);

    const tabs = ['SELL', 'RODS', 'LURES', 'BOATS'];
    const tabWidth = w / 4;
    tabs.forEach((tab, i) => {
        const tabX = x + i * tabWidth;
        const isActive = game.shop.tab === tab.toLowerCase();
        ctx.fillStyle = isActive ? 'rgba(90, 140, 110, 0.3)' : 'rgba(30, 40, 35, 0.5)';
        ctx.fillRect(tabX, y + 45, tabWidth, 25);
        ctx.fillStyle = isActive ? '#aaddaa' : '#6a8a7a';
        ctx.font = '12px VT323';
        ctx.fillText(tab, tabX + tabWidth/2, y + 62);
    });

    if (game.shop.npcDialog) {
        ctx.fillStyle = 'rgba(40, 50, 45, 0.8)';
        ctx.fillRect(x + 20, y + 80, w - 40, 40);
        ctx.fillStyle = '#c0d0c0';
        ctx.font = '14px VT323';
        ctx.fillText(`"${game.shop.npcDialog}"`, x + w/2, y + 105);
    }

    const contentY = y + 130;
    ctx.textAlign = 'left';

    if (game.shop.tab === 'sell') drawSellTab(x + 20, contentY, w - 40);
    else if (game.shop.tab === 'rods') drawEquipmentTab(x + 20, contentY, w - 40, SHOP.rods, 'rod');
    else if (game.shop.tab === 'lures') drawLuresTab(x + 20, contentY, w - 40);
    else if (game.shop.tab === 'boats') drawEquipmentTab(x + 20, contentY, w - 40, SHOP.boats, 'boat');

    ctx.fillStyle = '#5a7a6a';
    ctx.font = '12px VT323';
    ctx.textAlign = 'center';
    ctx.fillText('[TAB] Switch tabs | [UP/DOWN] Select | [SPACE] Action | [ESC] Close', x + w/2, y + h - 15);
    ctx.textAlign = 'left';
}

function drawSellTab(x, y, w) {
    ctx.fillStyle = '#8a9a8a';
    ctx.font = '14px VT323';
    ctx.fillText(`Inventory: ${game.inventory.length}/${game.inventoryMax}`, x, y);
    ctx.fillText(`Gold: ${game.money}`, x + 200, y);

    if (game.inventory.length === 0) {
        ctx.fillStyle = '#6a7a6a';
        ctx.fillText('No fish to sell. Go catch some!', x, y + 40);
        return;
    }

    game.inventory.forEach((fish, i) => {
        const itemY = y + 30 + i * 25;
        const isSelected = game.shop.selectedIndex === i;

        if (isSelected) {
            ctx.fillStyle = 'rgba(90, 140, 110, 0.3)';
            ctx.fillRect(x - 5, itemY - 15, w + 10, 22);
        }

        ctx.fillStyle = isSelected ? '#aaddaa' : '#8a9a8a';
        ctx.fillText(fish.name, x, itemY);
        ctx.fillStyle = '#d0d080';
        ctx.fillText(`${fish.value}g`, x + 250, itemY);
    });

    ctx.fillStyle = '#6a8a7a';
    ctx.fillText('[SPACE] Sell selected | [A] Sell all', x, y + 250);
}

function drawEquipmentTab(x, y, w, items, type) {
    items.forEach((item, i) => {
        const itemY = y + i * 55;
        const isSelected = game.shop.selectedIndex === i;
        const isOwned = item.owned;
        const isEquipped = game.equipment[type] === item.id;

        if (isSelected) {
            ctx.fillStyle = 'rgba(90, 140, 110, 0.3)';
            ctx.fillRect(x - 5, itemY - 5, w + 10, 50);
        }

        ctx.fillStyle = isEquipped ? '#aaddaa' : (isOwned ? '#8aba9a' : '#6a8a7a');
        ctx.font = '16px VT323';
        ctx.fillText(item.name, x, itemY + 15);

        if (isEquipped) ctx.fillText('[EQUIPPED]', x + 200, itemY + 15);
        else if (isOwned) ctx.fillText('[OWNED]', x + 200, itemY + 15);
        else {
            ctx.fillStyle = game.money >= item.price ? '#d0d080' : '#a06060';
            ctx.fillText(`${item.price}g`, x + 200, itemY + 15);
        }

        ctx.fillStyle = '#5a7a6a';
        ctx.font = '12px VT323';
        ctx.fillText(item.desc, x, itemY + 35);
    });
}

function drawLuresTab(x, y, w) {
    ctx.fillStyle = '#8a9a8a';
    ctx.font = '14px VT323';
    const currentLure = getCurrentLure();
    ctx.fillText(`Equipped: ${currentLure ? `${currentLure.name} (${currentLure.count})` : 'None'}`, x, y);

    SHOP.lures.forEach((lure, i) => {
        const itemY = y + 30 + i * 50;
        const isSelected = game.shop.selectedIndex === i;

        if (isSelected) {
            ctx.fillStyle = 'rgba(90, 140, 110, 0.3)';
            ctx.fillRect(x - 5, itemY - 5, w + 10, 45);
        }

        ctx.fillStyle = lure.count > 0 ? '#8aba9a' : '#6a8a7a';
        ctx.font = '16px VT323';
        ctx.fillText(`${lure.name} (x${lure.count})`, x, itemY + 15);

        ctx.fillStyle = game.money >= lure.price ? '#d0d080' : '#a06060';
        ctx.fillText(`${lure.price}g each`, x + 250, itemY + 15);

        ctx.fillStyle = '#5a7a6a';
        ctx.font = '12px VT323';
        ctx.fillText(lure.desc, x, itemY + 32);
    });
}

function openShop() {
    game.shop.open = true;
    game.shop.tab = 'sell';
    game.shop.selectedIndex = 0;

    if (game.sanity < 30) {
        game.shop.npcDialog = getRandomDialog('lowSanity');
    } else if (game.lastRareCatch) {
        game.shop.npcDialog = getRandomDialog('afterRareCatch');
        game.lastRareCatch = false;
    } else {
        game.shop.npcDialog = getRandomDialog('greeting');
    }
}

function closeShop() {
    game.shop.open = false;
    game.shop.npcDialog = '';
    autoSave();
}

function shopAction() {
    if (game.shop.tab === 'sell') {
        if (game.inventory.length > 0 && game.shop.selectedIndex < game.inventory.length) {
            const fish = game.inventory.splice(game.shop.selectedIndex, 1)[0];
            game.money += fish.value;
            game.achievements.stats.totalGoldEarned += fish.value;  // Track for achievements
            game.shop.npcDialog = getRandomDialog('selling');
            if (game.shop.selectedIndex >= game.inventory.length) {
                game.shop.selectedIndex = Math.max(0, game.inventory.length - 1);
            }
        }
    } else if (game.shop.tab === 'rods') {
        const rod = SHOP.rods[game.shop.selectedIndex];
        if (rod.owned) {
            game.equipment.rod = rod.id;
        } else if (game.money >= rod.price) {
            game.money -= rod.price;
            rod.owned = true;
            game.equipment.rod = rod.id;
            game.shop.npcDialog = getRandomDialog('buying');
        }
    } else if (game.shop.tab === 'lures') {
        const lure = SHOP.lures[game.shop.selectedIndex];
        if (game.money >= lure.price) {
            game.money -= lure.price;
            lure.count++;
            game.equipment.lure = lure.id;
            game.shop.npcDialog = getRandomDialog('buying');
        }
    } else if (game.shop.tab === 'boats') {
        const boat = SHOP.boats[game.shop.selectedIndex];
        if (boat.owned) {
            game.equipment.boat = boat.id;
            game.inventoryMax = boat.storage;
        } else if (game.money >= boat.price) {
            game.money -= boat.price;
            boat.owned = true;
            game.equipment.boat = boat.id;
            game.inventoryMax = boat.storage;
            game.shop.npcDialog = getRandomDialog('buying');
        }
    }
}

function sellAllFish() {
    if (game.inventory.length === 0) return;
    let total = 0;
    game.inventory.forEach(fish => total += fish.value);
    game.money += total;
    game.achievements.stats.totalGoldEarned += total;  // Track for achievements
    game.inventory = [];
    game.shop.selectedIndex = 0;
    game.shop.npcDialog = getRandomDialog('selling');
}

function equipLure(idx) {
    const lure = SHOP.lures[idx];
    if (lure && lure.count > 0) {
        game.equipment.lure = lure.id;
    }
}
