// ============================================================
// THE DEEP ONES - NPC & SHOP SYSTEM
// ============================================================

// Shop interior configuration - centralizes all layout values
const SHOP_INTERIOR = {
    // Wall settings
    wall: {
        color: '#2a2018',
        panelColor: '#3a2a1a',
        panelLineColor: '#2a1a10',
        panelWidth: 60,
        panelHeight: 40,
        heightRatio: 0.7
    },
    // Floor settings
    floor: {
        color: '#1a1510',
        plankColor: '#251a12',
        plankWidth: 80,
        plankLineWidth: 3
    },
    // Window settings
    window: {
        x: 50, y: 80,
        width: 180, height: 200,
        frameColor: '#4a3a28',
        frameThickness: 8,
        crossBarColor: '#3a2a1a',
        crossBarWidth: 6,
        waterColor: '#1a3a4a',
        rainColor: 'rgba(150, 180, 200, 0.3)',
        rainDropCount: 10
    },
    // Counter settings
    counter: {
        heightRatio: 0.65,
        widthRatio: 0.55,
        color: '#4a3a28',
        topColor: '#5a4a38',
        topHeight: 12,
        detailColor: '#3a2a1a',
        detailSpacing: 50
    },
    // Lantern settings
    lantern: {
        xRatio: 0.3,
        y: 50,
        chainColor: '#5a5a5a',
        bodyColor: '#3a3530',
        bodyWidth: 24,
        bodyHeight: 35,
        glowRadius: 150
    },
    // Sign settings
    sign: {
        xRatio: 0.35,
        y: 30,
        width: 150, height: 50,
        bgColor: '#3a3028',
        borderColor: '#5a4a38',
        textColor: '#a09070'
    },
    // Fishing net settings
    net: {
        xRatio: 0.55,
        y: 100,
        gridX: 8, gridY: 6,
        spacing: 15,
        color: '#5a5040'
    },
    // Barrel settings
    barrel: {
        x: 280,
        yRatio: 0.5,
        radiusX: 30, radiusY: 15,
        height: 50,
        color: '#4a3a25',
        bandColor: '#6a5a4a'
    }
};

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
    // Dock must use same camera factor (1.0) as the boat for proper alignment
    const dockX = CONFIG.dockX - game.cameraX;
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

    const w = CONFIG.canvas.width;
    const h = CONFIG.canvas.height;

    // Draw fullscreen shop interior background
    drawShopInterior(w, h);

    // Draw Old Marsh NPC
    drawShopMarsh(w, h);

    // Draw UI panel on the right side
    const panelW = 420, panelH = h - 80;
    const panelX = w - panelW - 30;
    const panelY = 40;

    // Semi-transparent panel background
    ctx.fillStyle = 'rgba(15, 12, 10, 0.92)';
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = '#6a5a4a';
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    // Title
    ctx.font = '14px "Press Start 2P"';
    ctx.fillStyle = '#c0a080';
    ctx.textAlign = 'center';
    ctx.fillText("MARSH'S BAIT & TACKLE", panelX + panelW/2, panelY + 28);

    // Gold display
    ctx.font = '16px VT323';
    ctx.fillStyle = '#d0c080';
    ctx.fillText(`Gold: ${game.money}`, panelX + panelW/2, panelY + 50);

    // Tabs
    const tabs = ['SELL', 'RODS', 'LURES', 'BOATS'];
    const tabWidth = panelW / 4;
    tabs.forEach((tab, i) => {
        const tabX = panelX + i * tabWidth;
        const isActive = game.shop.tab === tab.toLowerCase();
        ctx.fillStyle = isActive ? 'rgba(100, 80, 60, 0.6)' : 'rgba(40, 30, 25, 0.5)';
        ctx.fillRect(tabX, panelY + 60, tabWidth, 28);
        ctx.fillStyle = isActive ? '#e0d0b0' : '#8a7a6a';
        ctx.font = '14px VT323';
        ctx.fillText(tab, tabX + tabWidth/2, panelY + 80);
    });

    // NPC Dialog bubble
    if (game.shop.npcDialog) {
        ctx.fillStyle = 'rgba(50, 40, 35, 0.9)';
        ctx.fillRect(panelX + 15, panelY + 95, panelW - 30, 45);
        ctx.strokeStyle = '#8a7a6a';
        ctx.lineWidth = 1;
        ctx.strokeRect(panelX + 15, panelY + 95, panelW - 30, 45);
        ctx.fillStyle = '#d0c0a0';
        ctx.font = '14px VT323';
        ctx.fillText(`"${game.shop.npcDialog}"`, panelX + panelW/2, panelY + 122);
    }

    // Content area
    const contentY = panelY + 150;
    const contentW = panelW - 40;
    ctx.textAlign = 'left';

    if (game.shop.tab === 'sell') drawSellTab(panelX + 20, contentY, contentW);
    else if (game.shop.tab === 'rods') drawEquipmentTab(panelX + 20, contentY, contentW, SHOP.rods, 'rod');
    else if (game.shop.tab === 'lures') drawLuresTab(panelX + 20, contentY, contentW);
    else if (game.shop.tab === 'boats') drawEquipmentTab(panelX + 20, contentY, contentW, SHOP.boats, 'boat');

    // Controls at bottom
    ctx.fillStyle = '#6a5a4a';
    ctx.font = '12px VT323';
    ctx.textAlign = 'center';
    ctx.fillText('[TAB] Switch | [↑/↓] Select | [SPACE] Action | [ESC] Leave', panelX + panelW/2, panelY + panelH - 12);
    ctx.textAlign = 'left';
}

// Draw the shop interior background - main coordinator function
function drawShopInterior(w, h) {
    drawShopWalls(w, h);
    drawShopFloor(w, h);
    drawShopWindow(w, h);
    drawShopShelves(50, h * 0.35, 200, h * 0.35);
    drawShopCounter(w, h);
    drawCounterItems(w * 0.15, h * SHOP_INTERIOR.counter.heightRatio - 30);
    drawShopLantern(w, h);
    drawShopSign(w);
    drawShopNets(w);
    drawShopBarrel(w, h);
}

// Draw back wall with wood paneling pattern
function drawShopWalls(w, h) {
    const cfg = SHOP_INTERIOR.wall;
    const wallHeight = h * cfg.heightRatio;

    // Base wall color
    ctx.fillStyle = cfg.color;
    ctx.fillRect(0, 0, w, h);

    // Vertical panel lines
    ctx.fillStyle = cfg.panelColor;
    for (let x = 0; x < w; x += cfg.panelWidth) {
        ctx.fillRect(x, 0, 2, wallHeight);
    }

    // Horizontal panel lines
    ctx.fillStyle = cfg.panelLineColor;
    for (let y = 0; y < wallHeight; y += cfg.panelHeight) {
        ctx.fillRect(0, y, w, 2);
    }
}

// Draw floor with plank pattern
function drawShopFloor(w, h) {
    const cfg = SHOP_INTERIOR.floor;
    const wallCfg = SHOP_INTERIOR.wall;
    const floorY = h * wallCfg.heightRatio;
    const floorHeight = h - floorY;

    // Base floor color
    ctx.fillStyle = cfg.color;
    ctx.fillRect(0, floorY, w, floorHeight);

    // Floor plank lines
    ctx.fillStyle = cfg.plankColor;
    for (let x = 0; x < w; x += cfg.plankWidth) {
        ctx.fillRect(x, floorY, cfg.plankLineWidth, floorHeight);
    }
}

// Draw window with outside view and weather effects
function drawShopWindow() {
    const cfg = SHOP_INTERIOR.window;
    const { x, y, width, height } = cfg;

    // Window frame
    ctx.fillStyle = cfg.frameColor;
    ctx.fillRect(x - cfg.frameThickness, y - cfg.frameThickness,
                 width + cfg.frameThickness * 2, height + cfg.frameThickness * 2);

    // Window glass - show sky based on time of day
    const palette = typeof getTimePalette === 'function' ? getTimePalette() : { sky: ['#4a6080'] };
    const skyColor = palette.sky[1] || '#4a6080';
    ctx.fillStyle = skyColor;
    ctx.fillRect(x, y, width, height * 0.5);

    // Water in lower half of window
    ctx.fillStyle = cfg.waterColor;
    ctx.fillRect(x, y + height * 0.5, width, height * 0.5);

    // Window cross bars
    ctx.fillStyle = cfg.crossBarColor;
    ctx.fillRect(x + width / 2 - cfg.crossBarWidth / 2, y, cfg.crossBarWidth, height);
    ctx.fillRect(x, y + height / 2 - cfg.crossBarWidth / 2, width, cfg.crossBarWidth);

    // Rain effect when weather is rain or storm
    if (game.weather && (game.weather.current === 'rain' || game.weather.current === 'storm')) {
        ctx.fillStyle = cfg.rainColor;
        for (let i = 0; i < cfg.rainDropCount; i++) {
            const rx = x + Math.random() * width;
            const ry = y + Math.random() * height;
            ctx.fillRect(rx, ry, 1, 8);
        }
    }
}

// Draw the shop counter
function drawShopCounter(w, h) {
    const cfg = SHOP_INTERIOR.counter;
    const counterY = h * cfg.heightRatio;
    const counterWidth = w * cfg.widthRatio;
    const counterHeight = h - counterY;

    // Counter body
    ctx.fillStyle = cfg.color;
    ctx.fillRect(0, counterY, counterWidth, counterHeight);

    // Counter top edge
    ctx.fillStyle = cfg.topColor;
    ctx.fillRect(0, counterY, counterWidth, cfg.topHeight);

    // Counter front detail lines
    ctx.fillStyle = cfg.detailColor;
    for (let x = 0; x < counterWidth; x += cfg.detailSpacing) {
        ctx.fillRect(x, counterY + cfg.topHeight, 2, counterHeight - cfg.topHeight);
    }
}

// Draw hanging lantern with glow effect
function drawShopLantern(w) {
    const cfg = SHOP_INTERIOR.lantern;
    const lanternX = w * cfg.xRatio;
    const lanternY = cfg.y;
    const flicker = 0.7 + Math.sin(game.time * 0.05) * 0.15;

    // Chain from ceiling
    ctx.strokeStyle = cfg.chainColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lanternX, 0);
    ctx.lineTo(lanternX, lanternY);
    ctx.stroke();

    // Lantern body
    ctx.fillStyle = cfg.bodyColor;
    ctx.fillRect(lanternX - cfg.bodyWidth / 2, lanternY, cfg.bodyWidth, cfg.bodyHeight);

    // Inner glow
    ctx.fillStyle = `rgba(255, 200, 100, ${flicker * 0.8})`;
    ctx.fillRect(lanternX - cfg.bodyWidth / 2 + 4, lanternY + 5, cfg.bodyWidth - 8, cfg.bodyHeight - 10);

    // Radial light effect
    const gradient = ctx.createRadialGradient(lanternX, lanternY + 20, 0, lanternX, lanternY + 20, cfg.glowRadius);
    gradient.addColorStop(0, `rgba(255, 200, 100, ${flicker * 0.15})`);
    gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(lanternX - cfg.glowRadius, lanternY - 50, cfg.glowRadius * 2, cfg.glowRadius * 2);
}

// Draw wall sign
function drawShopSign(w) {
    const cfg = SHOP_INTERIOR.sign;
    const signX = w * cfg.xRatio;

    // Sign background
    ctx.fillStyle = cfg.bgColor;
    ctx.fillRect(signX, cfg.y, cfg.width, cfg.height);

    // Sign border
    ctx.strokeStyle = cfg.borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(signX, cfg.y, cfg.width, cfg.height);

    // Sign text
    ctx.fillStyle = cfg.textColor;
    ctx.font = '12px VT323';
    ctx.textAlign = 'center';
    ctx.fillText('FRESH BAIT', signX + cfg.width / 2, cfg.y + 20);
    ctx.fillText('LOCAL TACKLE', signX + cfg.width / 2, cfg.y + 38);
    ctx.textAlign = 'left';
}

// Draw fishing nets on wall
function drawShopNets(w) {
    const cfg = SHOP_INTERIOR.net;
    const netX = w * cfg.xRatio;

    ctx.strokeStyle = cfg.color;
    ctx.lineWidth = 1;

    for (let i = 0; i < cfg.gridX; i++) {
        for (let j = 0; j < cfg.gridY; j++) {
            const x1 = netX + i * cfg.spacing;
            const y1 = cfg.y + j * cfg.spacing;
            const x2 = netX + (i + 1) * cfg.spacing;
            const y2 = cfg.y + (j + 1) * cfg.spacing;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.moveTo(x2, y1);
            ctx.lineTo(x1, y2);
            ctx.stroke();
        }
    }
}

// Draw barrel in corner
function drawShopBarrel(w, h) {
    const cfg = SHOP_INTERIOR.barrel;
    const barrelY = h * cfg.yRatio;

    ctx.fillStyle = cfg.color;

    // Bottom ellipse
    ctx.beginPath();
    ctx.ellipse(cfg.x, barrelY + cfg.height, cfg.radiusX, cfg.radiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillRect(cfg.x - cfg.radiusX, barrelY, cfg.radiusX * 2, cfg.height);

    // Top ellipse
    ctx.beginPath();
    ctx.ellipse(cfg.x, barrelY, cfg.radiusX, cfg.radiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Metal bands
    ctx.strokeStyle = cfg.bandColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cfg.x, barrelY + 15, cfg.radiusX, cfg.radiusY - 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cfg.x, barrelY + 40, cfg.radiusX, cfg.radiusY - 3, 0, 0, Math.PI * 2);
    ctx.stroke();
}

// Draw shelves with fishing equipment
function drawShopShelves(x, y, w, h) {
    const shelfCount = 3;
    const shelfH = h / shelfCount;

    for (let i = 0; i < shelfCount; i++) {
        const shelfY = y + i * shelfH;
        // Shelf plank
        ctx.fillStyle = '#4a3a28';
        ctx.fillRect(x, shelfY + shelfH - 8, w, 8);
        // Shelf bracket
        ctx.fillStyle = '#3a2a1a';
        ctx.beginPath();
        ctx.moveTo(x, shelfY + shelfH);
        ctx.lineTo(x + 15, shelfY + shelfH);
        ctx.lineTo(x, shelfY + shelfH - 20);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w, shelfY + shelfH);
        ctx.lineTo(x + w - 15, shelfY + shelfH);
        ctx.lineTo(x + w, shelfY + shelfH - 20);
        ctx.closePath();
        ctx.fill();

        // Items on shelf
        if (i === 0) {
            // Jars of bait
            for (let j = 0; j < 4; j++) {
                const jarX = x + 20 + j * 40;
                ctx.fillStyle = '#6a8a6a';
                ctx.fillRect(jarX, shelfY + shelfH - 35, 25, 25);
                ctx.fillStyle = '#8aa88a';
                ctx.fillRect(jarX + 2, shelfY + shelfH - 33, 21, 8);
                ctx.fillStyle = '#4a3a2a';
                ctx.fillRect(jarX, shelfY + shelfH - 40, 25, 6);
            }
        } else if (i === 1) {
            // Lure boxes
            for (let j = 0; j < 3; j++) {
                const boxX = x + 15 + j * 55;
                ctx.fillStyle = '#8a6a4a';
                ctx.fillRect(boxX, shelfY + shelfH - 28, 45, 18);
                ctx.strokeStyle = '#5a4a3a';
                ctx.lineWidth = 1;
                ctx.strokeRect(boxX, shelfY + shelfH - 28, 45, 18);
            }
        } else {
            // Small rods
            ctx.strokeStyle = '#6a5a4a';
            ctx.lineWidth = 3;
            for (let j = 0; j < 5; j++) {
                ctx.beginPath();
                ctx.moveTo(x + 20 + j * 35, shelfY + shelfH - 8);
                ctx.lineTo(x + 20 + j * 35 + 20, shelfY + shelfH - 50);
                ctx.stroke();
            }
        }
    }
}

// Draw items on the counter
function drawCounterItems(x, y) {
    // Fish bucket
    ctx.fillStyle = '#5a6a6a';
    ctx.fillRect(x, y - 25, 35, 35);
    ctx.fillStyle = '#7a8a8a';
    ctx.beginPath();
    ctx.ellipse(x + 17, y - 25, 17, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Handle
    ctx.strokeStyle = '#4a5a5a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 17, y - 35, 12, Math.PI, 0);
    ctx.stroke();

    // Scale
    const scaleX = x + 80;
    ctx.fillStyle = '#8a7a5a';
    ctx.fillRect(scaleX, y - 8, 50, 12);
    // Scale plate
    ctx.fillStyle = '#9a8a6a';
    ctx.beginPath();
    ctx.ellipse(scaleX + 25, y - 12, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Coins
    const coinX = x + 150;
    ctx.fillStyle = '#d0b060';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(coinX + i * 4, y - 5 - i * 2, 8, 3, 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw Old Marsh NPC in the shop
function drawShopMarsh(w, h) {
    const x = w * 0.25;
    const y = h * 0.55;
    const bob = Math.sin(game.time * 0.01) * 2;

    // Body/coat
    ctx.fillStyle = '#1a1815';
    ctx.beginPath();
    ctx.moveTo(x - 30, y + 80);
    ctx.lineTo(x - 25, y - 20 + bob);
    ctx.lineTo(x + 25, y - 20 + bob);
    ctx.lineTo(x + 30, y + 80);
    ctx.closePath();
    ctx.fill();

    // Apron
    ctx.fillStyle = '#4a4a40';
    ctx.beginPath();
    ctx.moveTo(x - 20, y + bob);
    ctx.lineTo(x - 18, y + 60);
    ctx.lineTo(x + 18, y + 60);
    ctx.lineTo(x + 20, y + bob);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = '#8a7a6a';
    ctx.beginPath();
    ctx.arc(x, y - 40 + bob, 22, 0, Math.PI * 2);
    ctx.fill();

    // Hat
    ctx.fillStyle = '#3a3520';
    ctx.beginPath();
    ctx.ellipse(x, y - 55 + bob, 28, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 15, y - 75 + bob, 30, 20);

    // Eyes
    ctx.fillStyle = '#2a3a3a';
    const blink = Math.sin(game.time * 0.08) > 0.95 ? 0 : 1;
    ctx.fillRect(x - 10, y - 42 + bob, 5, 4 * blink);
    ctx.fillRect(x + 5, y - 42 + bob, 5, 4 * blink);

    // Beard
    ctx.fillStyle = '#6a6a5a';
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 30 + bob);
    ctx.quadraticCurveTo(x, y - 15 + bob, x + 12, y - 30 + bob);
    ctx.quadraticCurveTo(x + 8, y - 20 + bob, x, y - 10 + bob);
    ctx.quadraticCurveTo(x - 8, y - 20 + bob, x - 12, y - 30 + bob);
    ctx.fill();

    // Arms resting on counter
    ctx.fillStyle = '#252520';
    ctx.fillRect(x - 35, y + 30 + bob, 25, 15);
    ctx.fillRect(x + 10, y + 30 + bob, 25, 15);

    // Hands
    ctx.fillStyle = '#8a7a6a';
    ctx.beginPath();
    ctx.arc(x - 38, y + 40 + bob, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 38, y + 40 + bob, 8, 0, Math.PI * 2);
    ctx.fill();

    // Pipe smoke (occasionally)
    if (Math.sin(game.time * 0.015) > 0.6) {
        ctx.fillStyle = 'rgba(180, 180, 180, 0.25)';
        for (let i = 0; i < 3; i++) {
            const smokeY = y - 60 + bob - i * 15 - (game.time * 0.03) % 30;
            const smokeX = x + 25 + Math.sin(game.time * 0.02 + i) * 5;
            ctx.beginPath();
            ctx.arc(smokeX, smokeY, 5 + i * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
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
    game.shop.visitCount = (game.shop.visitCount || 0) + 1;

    // Determine dialog based on context
    game.shop.npcDialog = getContextualDialog();
}

function getContextualDialog() {
    // Priority 1: Special catches
    if (game.storyFlags.caughtUnnamed && Math.random() < 0.3) {
        return getRandomDialog('afterUnnamed');
    }

    // Check for abyss creature in inventory
    const hasAbyssCreature = game.inventory.some(c => c.value >= 500);
    if (hasAbyssCreature && Math.random() < 0.4) {
        return getRandomDialog('afterAbyssCreature');
    }

    // Priority 2: Low sanity
    if (game.sanity < 30) {
        return getRandomDialog('lowSanity');
    }

    // Priority 3: Rare catch
    if (game.lastRareCatch) {
        game.lastRareCatch = false;
        return getRandomDialog('afterRareCatch');
    }

    // Priority 4: First visit
    if (!game.storyFlags.metMarsh) {
        game.storyFlags.metMarsh = true;
        return getRandomDialog('firstVisit');
    }

    // Priority 5: Veteran visit (every 10 visits)
    if (game.shop.visitCount % 10 === 0) {
        return getRandomDialog('veteranVisit');
    }

    // Priority 6: Time of day specific
    const timeDialogs = {
        'night': 'nightVisit',
        'dawn': 'dawnVisit',
        'dusk': 'duskVisit'
    };
    if (timeDialogs[game.timeOfDay] && Math.random() < 0.3) {
        return getRandomDialog(timeDialogs[game.timeOfDay]);
    }

    // Priority 7: Weather specific
    if (game.weather.current === 'storm' && Math.random() < 0.4) {
        return getRandomDialog('stormVisit');
    }

    // Priority 8: Achievement milestones
    const achievementCount = game.achievements.unlocked.length;
    if (achievementCount >= 10 && Math.random() < 0.2) {
        return getRandomDialog('manyAchievements');
    } else if (achievementCount === 1) {
        return getRandomDialog('afterFirstAchievement');
    }

    // Priority 9: Fishing hints (occasional)
    if (Math.random() < 0.15) {
        return getRandomDialog('fishingHints');
    }

    // Priority 10: Lore hints (occasional, if not all lore found)
    if (game.loreFound.length < LORE_FRAGMENTS.length && Math.random() < 0.1) {
        return getRandomDialog('loreHints');
    }

    // Default greeting
    return getRandomDialog('greeting');
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
