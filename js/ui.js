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
