// ============================================================
// THE DEEP ONES - UI RENDERING
// ============================================================

function drawLocationIndicator() {
    const loc = CONFIG.locations[game.currentLocation];
    if (!loc) return;

    ctx.font = '20px VT323';
    ctx.fillStyle = 'rgba(200, 220, 210, 0.8)';
    ctx.textAlign = 'center';
    ctx.fillText(loc.name, CONFIG.canvas.width / 2, 30);

    const mapWidth = 200, mapHeight = 20;
    const mapX = CONFIG.canvas.width - mapWidth - 15;
    const mapY = CONFIG.canvas.height - mapHeight - 15;

    ctx.fillStyle = 'rgba(10, 20, 30, 0.7)';
    ctx.fillRect(mapX, mapY, mapWidth, mapHeight);
    ctx.strokeStyle = 'rgba(100, 130, 120, 0.5)';
    ctx.strokeRect(mapX, mapY, mapWidth, mapHeight);

    for (const [name, l] of Object.entries(CONFIG.locations)) {
        const markerX = mapX + (l.x / CONFIG.worldWidth) * mapWidth;
        ctx.fillStyle = name === game.currentLocation ? '#8aba9a' : '#4a6a5a';
        ctx.fillRect(markerX - 2, mapY + 2, 4, mapHeight - 4);
    }

    const boatMarkerX = mapX + (game.boatX / CONFIG.worldWidth) * mapWidth;
    ctx.fillStyle = '#f0d080';
    ctx.beginPath();
    ctx.moveTo(boatMarkerX, mapY + 3);
    ctx.lineTo(boatMarkerX - 4, mapY + mapHeight - 3);
    ctx.lineTo(boatMarkerX + 4, mapY + mapHeight - 3);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = 'left';
}

function drawWeatherIndicator() {
    const weather = WEATHER.types[game.weather.current];

    ctx.font = '14px VT323';
    ctx.fillStyle = 'rgba(200, 220, 210, 0.7)';
    ctx.textAlign = 'right';

    let icon = '';
    if (game.weather.current === 'clear') icon = 'Clear';
    else if (game.weather.current === 'cloudy') icon = 'Cloudy';
    else if (game.weather.current === 'rain') icon = 'Rain';
    else if (game.weather.current === 'fog') icon = 'Fog';
    else if (game.weather.current === 'storm') icon = 'Storm';

    ctx.fillText(icon, CONFIG.canvas.width - 15, 55);
    ctx.textAlign = 'left';
}

function drawDogIndicator() {
    const x = 15, y = CONFIG.canvas.height - 60;

    let dogEmoji = 'Dog';
    if (game.dog.animation === 'sleep') dogEmoji = 'Zzz';
    else if (game.dog.animation === 'alert') dogEmoji = '!';
    else if (game.dog.isBarking) dogEmoji = '!!!';

    ctx.font = '16px VT323';
    ctx.fillStyle = '#c0d0c0';
    ctx.fillText(dogEmoji, x, y);

    ctx.fillStyle = 'rgba(10, 20, 30, 0.7)';
    ctx.fillRect(x + 30, y - 15, 60, 10);
    ctx.fillStyle = game.dog.happiness > 50 ? '#6a9a6a' : '#9a6a6a';
    ctx.fillRect(x + 31, y - 14, 58 * (game.dog.happiness / 100), 8);

    if (game.dog.isBarking) {
        ctx.font = '12px VT323';
        ctx.fillStyle = '#c0d0c0';
        let barkText = '*woof!*';
        if (game.dog.barkReason === 'rare') barkText = '*BARK BARK!*';
        else if (game.dog.barkReason === 'danger') barkText = '*whimper*';
        else if (game.dog.barkReason === 'excited') barkText = '*happy bark!*';
        ctx.fillText(barkText, x + 30, y + 5);
    }

    ctx.font = '10px VT323';
    ctx.fillStyle = '#5a7a6a';
    ctx.fillText('[P] Pet dog', x, y + 15);
}

function drawLoreCollection() {
    if (!game.loreViewer.open) return;

    const w = 600, h = 450;
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    ctx.fillStyle = 'rgba(15, 20, 25, 0.98)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#5a4a6a';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = '#8a6a9a';
    ctx.textAlign = 'center';
    ctx.fillText('FORBIDDEN KNOWLEDGE', x + w/2, y + 35);

    ctx.font = '14px VT323';
    ctx.fillStyle = '#6a5a7a';
    ctx.fillText(`${game.loreFound.length} / ${LORE_FRAGMENTS.length} fragments discovered`, x + w/2, y + 55);

    const startIdx = game.loreViewer.page * game.loreViewer.itemsPerPage;
    const endIdx = Math.min(startIdx + game.loreViewer.itemsPerPage, LORE_FRAGMENTS.length);

    ctx.textAlign = 'left';
    for (let i = startIdx; i < endIdx; i++) {
        const lore = LORE_FRAGMENTS[i];
        const itemY = y + 80 + (i - startIdx) * 85;

        ctx.fillStyle = 'rgba(40, 35, 50, 0.5)';
        ctx.fillRect(x + 20, itemY, w - 40, 75);

        if (lore.found || game.loreFound.includes(lore.id)) {
            ctx.fillStyle = '#a08ab0';
            ctx.font = '16px VT323';
            ctx.fillText(lore.title, x + 30, itemY + 20);

            ctx.fillStyle = '#8a7a9a';
            ctx.font = '13px VT323';
            const text = lore.text.length > 80 ? lore.text.substring(0, 77) + '...' : lore.text;
            ctx.fillText(text, x + 30, itemY + 40);

            ctx.fillStyle = '#6a5a7a';
            ctx.font = '11px VT323';
            const locName = CONFIG.locations[lore.location]?.name || lore.location;
            ctx.fillText(`Found at: ${locName}`, x + 30, itemY + 60);
        } else {
            ctx.fillStyle = '#5a4a6a';
            ctx.font = '16px VT323';
            ctx.fillText('???', x + 30, itemY + 20);

            ctx.fillStyle = '#4a3a5a';
            ctx.font = '13px VT323';
            ctx.fillText('This fragment remains undiscovered...', x + 30, itemY + 40);

            ctx.fillStyle = '#3a2a4a';
            ctx.font = '11px VT323';
            const locName = CONFIG.locations[lore.location]?.name || lore.location;
            ctx.fillText(`Hint: Search near ${locName}`, x + 30, itemY + 60);
        }
    }

    const totalPages = Math.ceil(LORE_FRAGMENTS.length / game.loreViewer.itemsPerPage);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6a5a7a';
    ctx.font = '14px VT323';
    ctx.fillText(`Page ${game.loreViewer.page + 1} / ${totalPages}`, x + w/2, y + h - 40);

    ctx.fillStyle = '#5a4a6a';
    ctx.font = '12px VT323';
    ctx.fillText('[<-/->] Navigate pages | [ESC/L] Close', x + w/2, y + h - 20);

    ctx.textAlign = 'left';
}

function updateUI() {
    document.getElementById('money').textContent = game.money;
    document.getElementById('depth').textContent = Math.floor(game.depth);

    const sanityBar = document.getElementById('sanity');
    const segments = Math.ceil(game.sanity / 10);
    let bar = '';
    for (let i = 0; i < 10; i++) {
        bar += i < segments ? '█' : '░';
    }
    sanityBar.textContent = bar;
    sanityBar.style.color = game.sanity > 50 ? '#8aba9a' : (game.sanity > 25 ? '#baba6a' : '#ba6a6a');

    const boat = getCurrentBoat();
    document.getElementById('inventory').textContent = `${game.inventory.length}/${boat ? boat.storage : 10}`;

    const rod = getCurrentRod();
    document.getElementById('rod').textContent = rod ? rod.name : 'None';
}

// Hotkey help overlay
function drawHotkeyHelp() {
    const w = 400, h = 450;
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    // Background
    ctx.fillStyle = 'rgba(10, 15, 20, 0.95)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#5a7a8a';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Title
    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = '#8ab0c0';
    ctx.textAlign = 'center';
    ctx.fillText('CONTROLS', x + w/2, y + 35);

    // Hotkeys list
    const hotkeys = [
        { key: 'ARROW KEYS', desc: 'Move boat / Navigate menus' },
        { key: 'SPACE', desc: 'Cast line / Confirm / Continue' },
        { key: 'E', desc: 'Open Innsmouth Harbor menu' },
        { key: 'P', desc: 'Pet your dog (+3 sanity)' },
        { key: 'J', desc: 'Open Fishing Journal' },
        { key: 'L', desc: 'Open Lore Collection' },
        { key: 'A', desc: 'Open Achievements' },
        { key: 'H', desc: 'Toggle this help screen' },
        { key: 'T', desc: 'Cycle time of day' },
        { key: 'SHIFT+T', desc: 'Pause/resume time' },
        { key: 'SHIFT+S', desc: 'Save game' },
        { key: 'D', desc: 'Toggle debug info' },
        { key: 'S', desc: 'Toggle sprites' },
        { key: 'ESC', desc: 'Close menus / Return' }
    ];

    ctx.textAlign = 'left';
    hotkeys.forEach((hk, i) => {
        const itemY = y + 70 + i * 26;

        ctx.fillStyle = '#6a9aaa';
        ctx.font = '14px VT323';
        ctx.fillText(`[${hk.key}]`, x + 25, itemY);

        ctx.fillStyle = '#a0b0c0';
        ctx.font = '13px VT323';
        ctx.fillText(hk.desc, x + 140, itemY);
    });

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#5a7a8a';
    ctx.font = '12px VT323';
    ctx.fillText('Press [H] or [ESC] to close', x + w/2, y + h - 15);
    ctx.textAlign = 'left';
}

// Tutorial system
function drawTutorial() {
    if (!game.tutorial.shown && game.state !== 'title' && game.caughtCreatures.length < 3) {
        // Check which tutorial step to show
        let currentTip = null;

        if (game.caughtCreatures.length === 0 && game.state === 'sailing') {
            currentTip = "Press [SPACE] to cast your line!";
        } else if (game.state === 'waiting' && game.depth < 10) {
            currentTip = "Use [UP/DOWN] to adjust fishing depth";
        } else if (game.nearDock && game.inventory.length > 0) {
            currentTip = "Press [E] to visit the harbor and sell fish";
        } else if (game.sanity < 50 && game.achievements.stats.petCount < 3) {
            currentTip = "Press [P] to pet your dog for sanity!";
        }

        if (currentTip) {
            const tipWidth = ctx.measureText(currentTip).width + 40;
            const tipX = (CONFIG.canvas.width - tipWidth) / 2;
            const tipY = CONFIG.canvas.height - 140;

            // Background with subtle animation
            const pulse = (Math.sin(game.time * 0.005) + 1) / 2;
            ctx.fillStyle = `rgba(30, 50, 60, ${0.85 + pulse * 0.1})`;
            ctx.fillRect(tipX, tipY, tipWidth, 35);
            ctx.strokeStyle = `rgba(100, 160, 180, ${0.5 + pulse * 0.3})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(tipX, tipY, tipWidth, 35);

            // Tip text
            ctx.fillStyle = '#c0e0f0';
            ctx.font = '14px VT323';
            ctx.textAlign = 'center';
            ctx.fillText(currentTip, CONFIG.canvas.width / 2, tipY + 23);
            ctx.textAlign = 'left';

            // Small indicator
            ctx.fillStyle = '#80c0d0';
            ctx.font = '10px VT323';
            ctx.textAlign = 'center';
            ctx.fillText('TIP', tipX + 20, tipY + 22);
            ctx.textAlign = 'left';
        }
    }
}

// Stats display for achievements viewer (extended)
function drawStatsPanel() {
    const stats = game.achievements.stats;
    const x = 15, y = CONFIG.canvas.height - 120;

    ctx.fillStyle = 'rgba(10, 15, 20, 0.7)';
    ctx.fillRect(x, y, 180, 100);

    ctx.fillStyle = '#8a9a8a';
    ctx.font = '11px VT323';
    ctx.fillText(`Fish caught: ${stats.totalFishCaught}`, x + 10, y + 20);
    ctx.fillText(`Gold earned: ${stats.totalGoldEarned}`, x + 10, y + 35);
    ctx.fillText(`Night catches: ${stats.nightCatches}`, x + 10, y + 50);
    ctx.fillText(`Storm catches: ${stats.stormCatches}`, x + 10, y + 65);
    ctx.fillText(`Dog pets: ${stats.petCount}`, x + 10, y + 80);

    const minutes = Math.floor(stats.timePlayed / 60);
    const seconds = Math.floor(stats.timePlayed % 60);
    ctx.fillText(`Time: ${minutes}m ${seconds}s`, x + 10, y + 95);
}
