// ============================================================
// THE DEEP ONES - RENDERING
// ============================================================

// Fish System
function initFish() {
    game.fish = [];
    for (let i = 0; i < 20; i++) game.fish.push(createFish());
}

function createFish() {
    const depth = CONFIG.waterLine + 50 + Math.random() * 300;
    const isDeep = depth > CONFIG.waterLine + 200;
    const isAbyss = depth > CONFIG.waterLine + 300;

    let pool;
    if (isAbyss) pool = CREATURES.abyss;
    else if (isDeep) pool = CREATURES.deep;
    else if (depth > CONFIG.waterLine + 100) pool = CREATURES.mid;
    else pool = CREATURES.surface;

    const creature = pool[Math.floor(Math.random() * pool.length)];

    return {
        x: Math.random() * CONFIG.canvas.width,
        y: depth,
        type: creature.name,
        size: isAbyss ? 12 : (isDeep ? 8 : 5),
        speed: (0.3 + Math.random() * 0.7) * (Math.random() > 0.5 ? 1 : -1),
        frame: 0,
        frameTimer: 0
    };
}

function drawFish() {
    game.fish.forEach(fish => {
        fish.x += fish.speed;
        if (fish.x > CONFIG.canvas.width + 50) fish.x = -50;
        if (fish.x < -50) fish.x = CONFIG.canvas.width + 50;

        fish.frameTimer++;
        if (fish.frameTimer > 10) {
            fish.frame = (fish.frame + 1) % 4;
            fish.frameTimer = 0;
        }

        const spriteConfig = SPRITES.fish[fish.type];
        const img = loadedAssets.images[`sprite-fish-${fish.type}`];

        if (img && CONFIG.useSprites && spriteConfig) {
            const frameWidth = spriteConfig.width;
            const sx = fish.frame * frameWidth;
            ctx.save();
            if (fish.speed < 0) {
                ctx.scale(-1, 1);
                ctx.drawImage(img, sx, 0, frameWidth, spriteConfig.height, -fish.x - frameWidth/2, fish.y - spriteConfig.height/2, frameWidth, spriteConfig.height);
            } else {
                ctx.drawImage(img, sx, 0, frameWidth, spriteConfig.height, fish.x - frameWidth/2, fish.y - spriteConfig.height/2, frameWidth, spriteConfig.height);
            }
            ctx.restore();
        } else {
            drawFishProcedural(fish);
        }
    });
}

function drawFishProcedural(fish) {
    const dir = fish.speed > 0 ? 1 : -1;
    const wobble = Math.sin(game.time * 0.1 + fish.y) * 2;

    ctx.fillStyle = fish.y > CONFIG.waterLine + 250 ? 'rgba(60, 80, 70, 0.6)' : 'rgba(140, 160, 120, 0.7)';
    ctx.beginPath();
    ctx.ellipse(fish.x, fish.y + wobble, fish.size * 1.5, fish.size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(fish.x - fish.size * 1.5 * dir, fish.y + wobble);
    ctx.lineTo(fish.x - fish.size * 2.5 * dir, fish.y + wobble - fish.size * 0.5);
    ctx.lineTo(fish.x - fish.size * 2.5 * dir, fish.y + wobble + fish.size * 0.5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(200, 220, 180, 0.8)';
    ctx.beginPath();
    ctx.arc(fish.x + fish.size * 0.8 * dir, fish.y + wobble - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();

    if (fish.y > CONFIG.waterLine + 200) {
        const glow = Math.sin(game.time * 0.05 + fish.x) * 0.2 + 0.3;
        ctx.fillStyle = `rgba(100, 180, 150, ${glow})`;
        ctx.beginPath();
        ctx.arc(fish.x, fish.y + wobble, fish.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Boat Drawing
function drawBoat() {
    const bob = Math.sin(game.time * 0.04) * 4;
    const x = game.boatX - game.cameraX;
    const y = CONFIG.waterLine - 15 + bob;
    const tilt = Math.sin(game.time * 0.03) * 0.03;

    const boatImg = loadedAssets.images['sprite-boat'];

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    if (boatImg && CONFIG.useSprites) {
        ctx.drawImage(boatImg, -SPRITES.boat.anchor.x, -SPRITES.boat.anchor.y);
    } else {
        drawBoatProcedural(0, 0);
    }

    ctx.restore();
}

// --- Boat Component Drawing Helpers ---

function drawBoatHull(x, y) {
    // Main hull shape
    ctx.fillStyle = '#4a3525';
    ctx.beginPath();
    ctx.moveTo(x - 45, y);
    ctx.quadraticCurveTo(x - 50, y + 15, x - 35, y + 20);
    ctx.lineTo(x + 35, y + 20);
    ctx.quadraticCurveTo(x + 50, y + 15, x + 45, y);
    ctx.closePath();
    ctx.fill();

    // Hull plank detail
    ctx.fillStyle = '#5a4535';
    ctx.fillRect(x - 35, y + 5, 70, 4);

    // Hull interior shadow
    ctx.fillStyle = '#3a2a20';
    ctx.beginPath();
    ctx.ellipse(x, y + 8, 32, 8, 0, 0, Math.PI);
    ctx.fill();
}

function drawFisher(x, y, transVis) {
    // Body
    ctx.fillStyle = '#1a1815';
    ctx.fillRect(x - 8, y - 25, 16, 25);

    // Head - skin color changes with transformation
    ctx.fillStyle = transVis.skinColor;
    ctx.beginPath();
    ctx.arc(x, y - 32, 8, 0, Math.PI * 2);
    ctx.fill();

    // Transformation glow effect
    if (transVis.glowIntensity > 0) {
        const glowGrad = ctx.createRadialGradient(x, y - 32, 0, x, y - 32, 15);
        glowGrad.addColorStop(0, `rgba(100, 180, 160, ${transVis.glowIntensity * 0.3})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(x, y - 32, 15, 0, Math.PI * 2);
        ctx.fill();
    }

    // Hat
    ctx.fillStyle = '#3a3530';
    ctx.fillRect(x - 10, y - 42, 20, 5);
    ctx.fillRect(x - 6, y - 48, 12, 8);

    // Eyes - get bigger with transformation
    const eyeSize = 1.5 * transVis.eyeSize;
    ctx.fillStyle = game.transformation.stage >= 3 ? '#60a0a0' : '#2a3a3a';
    const blink = Math.sin(game.time * 0.1) > 0.95 ? 0 : 1;
    ctx.beginPath();
    ctx.arc(x - 4, y - 33, eyeSize * blink, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 33, eyeSize * blink, 0, Math.PI * 2);
    ctx.fill();

    // Gills (visible at stage 3+)
    if (transVis.hasGills) {
        ctx.strokeStyle = `rgba(80, 140, 130, ${0.6 + Math.sin(game.time * 0.05) * 0.2})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(x - 8, y - 28 + i * 3);
            ctx.lineTo(x - 12, y - 27 + i * 3);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 8, y - 28 + i * 3);
            ctx.lineTo(x + 12, y - 27 + i * 3);
            ctx.stroke();
        }
    }

    // Webbed hands (visible at stage 2+)
    if (transVis.hasWebbing) {
        ctx.fillStyle = `rgba(100, 160, 140, 0.5)`;
        ctx.beginPath();
        ctx.moveTo(x - 12, y - 15);
        ctx.lineTo(x - 18, y - 20);
        ctx.lineTo(x - 15, y - 10);
        ctx.closePath();
        ctx.fill();
    }
}

function drawBoatDog(x, y) {
    // Body
    ctx.fillStyle = '#c0a080';
    ctx.beginPath();
    ctx.ellipse(x + 25, y - 5, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(x + 32, y - 10, 6, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#201510';
    ctx.beginPath();
    ctx.arc(x + 34, y - 11, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Tail with animation
    const tailWag = game.dog.animation === 'wag' ? Math.sin(game.time * 0.3) * 8 : 0;
    ctx.strokeStyle = '#c0a080';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 16, y - 5);
    ctx.quadraticCurveTo(x + 10, y - 15 + Math.sin(game.time * 0.2) * 5 + tailWag, x + 8, y - 20);
    ctx.stroke();
}

function drawBoatFishingRod(x, y) {
    ctx.strokeStyle = '#5a4a30';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 5, y - 20);
    ctx.lineTo(x + 55, y - 55);
    ctx.stroke();
}

function drawBoatLantern(x, y) {
    const glow = (Math.sin(game.time * 0.08) + 1) / 2;

    // Lantern glow effect
    const lanternGrad = ctx.createRadialGradient(x - 30, y - 10, 0, x - 30, y - 10, 20);
    lanternGrad.addColorStop(0, `rgba(255, 200, 100, ${0.4 + glow * 0.2})`);
    lanternGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lanternGrad;
    ctx.beginPath();
    ctx.arc(x - 30, y - 10, 20, 0, Math.PI * 2);
    ctx.fill();

    // Lantern body
    ctx.fillStyle = '#3a3025';
    ctx.fillRect(x - 34, y - 5, 8, 12);
    ctx.fillStyle = `rgba(255, 220, 150, ${0.7 + glow * 0.3})`;
    ctx.fillRect(x - 33, y - 3, 6, 8);
}

// --- Main Boat Procedural Drawing ---

function drawBoatProcedural(x, y) {
    const transVis = getTransformationVisuals();

    drawBoatHull(x, y);
    drawFisher(x, y, transVis);
    drawBoatDog(x, y);

    if (game.state !== 'sailing') {
        drawBoatFishingRod(x, y);
    }

    drawBoatLantern(x, y);
}

function drawFishingLine() {
    if (game.state === 'sailing') return;

    const bob = Math.sin(game.time * 0.04) * 4;
    const boatScreenX = game.boatX - game.cameraX;
    const rodTipX = boatScreenX + 55;
    const rodTipY = CONFIG.waterLine - 15 + bob - 55;

    const maxDepth = CONFIG.canvas.height - CONFIG.waterLine - 50;
    const lineY = CONFIG.waterLine + 20 + (game.depth / 120) * maxDepth;
    const lineX = boatScreenX + 60 + Math.sin(game.time * 0.02) * 5;

    ctx.strokeStyle = 'rgba(200, 210, 200, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(rodTipX, rodTipY);
    ctx.lineTo(lineX, Math.min(lineY, CONFIG.canvas.height - 30));
    ctx.stroke();
    ctx.setLineDash([]);

    const bobberY = CONFIG.waterLine + 5 + Math.sin(game.time * 0.05) * 3;
    const wobble = game.state === 'reeling' ? Math.sin(game.time * 0.3) * 8 : 0;

    ctx.fillStyle = '#cc3030';
    ctx.beginPath();
    ctx.ellipse(lineX + wobble, bobberY, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f0f0e0';
    ctx.beginPath();
    ctx.ellipse(lineX + wobble, bobberY - 5, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const hookY = Math.min(lineY, CONFIG.canvas.height - 30);
    ctx.fillStyle = '#a0a090';
    ctx.beginPath();
    ctx.arc(lineX, hookY, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(200, 220, 210, 0.7)';
    ctx.font = '14px VT323';
    ctx.fillText(`${Math.floor(game.depth)}m -> ${game.targetDepth}m`, lineX + 10, hookY);
}

// Location Features
function drawLocationFeatures() {
    // Sandbank (western boundary)
    const sandbankX = CONFIG.locations.sandbank.x - game.cameraX;
    if (sandbankX > -300 && sandbankX < CONFIG.canvas.width + 300) drawSandbank(sandbankX);

    // Sunset Cove
    const coveX = CONFIG.locations.sunsetCove.x - game.cameraX;
    if (coveX > -300 && coveX < CONFIG.canvas.width + 300) drawSunsetCove(coveX);

    // Coral Reef
    const reefX = CONFIG.locations.reef.x - game.cameraX;
    if (reefX > -300 && reefX < CONFIG.canvas.width + 300) drawCoralReef(reefX);

    // Shipwreck
    const wreckX = CONFIG.locations.shipwreck.x - game.cameraX;
    if (wreckX > -200 && wreckX < CONFIG.canvas.width + 200) drawShipwreck(wreckX);

    // Deep Trench
    const trenchX = CONFIG.locations.trench.x - game.cameraX;
    if (trenchX > -100 && trenchX < CONFIG.canvas.width + 100) drawTrenchMarker(trenchX);

    // The Void
    const voidX = CONFIG.locations.void.x - game.cameraX;
    if (voidX > -100 && voidX < CONFIG.canvas.width + 100) drawVoidBuoy(voidX);
}

function drawSandbank(x) {
    const y = CONFIG.waterLine;

    // Shallow sandy bottom visible through water
    ctx.fillStyle = 'rgba(180, 160, 120, 0.3)';
    ctx.beginPath();
    ctx.moveTo(x - 150, y + 30);
    ctx.quadraticCurveTo(x - 100, y + 60, x - 50, y + 50);
    ctx.quadraticCurveTo(x, y + 70, x + 50, y + 55);
    ctx.quadraticCurveTo(x + 100, y + 40, x + 150, y + 45);
    ctx.lineTo(x + 150, y + 100);
    ctx.lineTo(x - 150, y + 100);
    ctx.closePath();
    ctx.fill();

    // Warning buoy
    const bob = Math.sin(game.time * 0.003) * 3;
    ctx.fillStyle = '#e0a040';
    ctx.beginPath();
    ctx.ellipse(x, y + bob, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#303030';
    ctx.fillRect(x - 8, y + bob - 3, 16, 6);

    // Sign post
    ctx.fillStyle = '#4a3a25';
    ctx.fillRect(x - 40, y - 40, 6, 50);
    ctx.fillStyle = '#5a4a35';
    ctx.fillRect(x - 55, y - 55, 45, 20);
    ctx.fillStyle = '#c0a060';
    ctx.font = '10px VT323';
    ctx.textAlign = 'center';
    ctx.fillText('SHALLOWS', x - 32, y - 42);
    ctx.textAlign = 'left';

    // Seagulls occasionally
    if (Math.sin(game.time * 0.001) > 0.7) {
        ctx.fillStyle = '#f0f0f0';
        const birdY = y - 60 + Math.sin(game.time * 0.01) * 5;
        ctx.beginPath();
        ctx.moveTo(x + 30, birdY);
        ctx.lineTo(x + 25, birdY - 5);
        ctx.lineTo(x + 20, birdY);
        ctx.lineTo(x + 25, birdY + 2);
        ctx.closePath();
        ctx.fill();
    }
}

function drawSunsetCove(x) {
    const y = CONFIG.waterLine;
    const palette = getTimePalette();

    // Distinctive rock formations
    ctx.fillStyle = '#3a3530';
    ctx.beginPath();
    ctx.moveTo(x - 60, y + 10);
    ctx.lineTo(x - 70, y - 30);
    ctx.lineTo(x - 50, y - 45);
    ctx.lineTo(x - 40, y - 25);
    ctx.lineTo(x - 35, y + 5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 40, y + 10);
    ctx.lineTo(x + 35, y - 20);
    ctx.lineTo(x + 55, y - 35);
    ctx.lineTo(x + 65, y - 15);
    ctx.lineTo(x + 60, y + 8);
    ctx.closePath();
    ctx.fill();

    // Beautiful sunset reflection (especially at dusk)
    if (game.timeOfDay === 'dusk' || game.timeOfDay === 'dawn') {
        const gradient = ctx.createLinearGradient(x - 80, y + 10, x + 80, y + 100);
        gradient.addColorStop(0, 'rgba(255, 150, 100, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 100, 80, 0.2)');
        gradient.addColorStop(1, 'rgba(200, 80, 100, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 80, y + 10, 160, 90);
    }

    // Mysterious glow at night (hint at something beneath)
    if (game.timeOfDay === 'night' && game.sanity < 70) {
        const pulseAlpha = (Math.sin(game.time * 0.002) + 1) / 2 * 0.2;
        ctx.fillStyle = `rgba(100, 200, 180, ${pulseAlpha})`;
        ctx.beginPath();
        ctx.arc(x, y + 60, 40, 0, Math.PI * 2);
        ctx.fill();
    }

    // Abandoned picnic spot on rock
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(x - 48, y - 28, 12, 3);
}

function drawShipwreck(x) {
    const y = CONFIG.waterLine;
    ctx.fillStyle = '#3a2a20';
    ctx.fillRect(x - 3, y - 80, 6, 90);
    ctx.fillRect(x - 25, y - 60, 50, 4);

    ctx.fillStyle = 'rgba(180, 170, 150, 0.4)';
    ctx.beginPath();
    ctx.moveTo(x + 2, y - 75);
    ctx.lineTo(x + 25, y - 55);
    ctx.lineTo(x + 20, y - 35);
    ctx.lineTo(x + 2, y - 40);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(40, 30, 25, 0.6)';
    ctx.beginPath();
    ctx.ellipse(x, y + 30, 60, 25, 0.1, 0, Math.PI * 2);
    ctx.fill();

    if (game.timeOfDay === 'night' || game.timeOfDay === 'dusk') {
        ctx.fillStyle = 'rgba(100, 150, 120, 0.1)';
        ctx.beginPath();
        ctx.arc(x, y, 80, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawCoralReef(x) {
    const y = CONFIG.waterLine + 20;
    const colors = ['#a05060', '#60a080', '#a0a060', '#8060a0'];

    for (let i = 0; i < 8; i++) {
        const cx = x - 80 + i * 25 + Math.sin(i * 2) * 10;
        const cy = y + 10 + Math.sin(i * 1.5) * 5;
        ctx.fillStyle = colors[i % colors.length];

        ctx.beginPath();
        ctx.moveTo(cx, cy + 30);
        ctx.lineTo(cx - 8, cy);
        ctx.lineTo(cx - 4, cy - 15);
        ctx.lineTo(cx + 4, cy - 12);
        ctx.lineTo(cx + 8, cy + 5);
        ctx.closePath();
        ctx.fill();
    }
}

function drawTrenchMarker(x) {
    const y = CONFIG.waterLine;
    const bob = Math.sin(game.time * 0.003) * 3;

    ctx.fillStyle = '#a04040';
    ctx.beginPath();
    ctx.ellipse(x, y + bob, 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e0e040';
    ctx.fillRect(x - 10, y + bob - 5, 20, 6);

    ctx.fillStyle = '#404040';
    ctx.fillRect(x - 2, y + bob - 30, 4, 25);

    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(x - 20, y + bob - 45, 40, 18);
    ctx.fillStyle = '#a04040';
    ctx.font = '10px VT323';
    ctx.textAlign = 'center';
    ctx.fillText('DANGER', x, y + bob - 32);
    ctx.textAlign = 'left';

    const gradient = ctx.createLinearGradient(x, y + 50, x, y + 200);
    gradient.addColorStop(0, 'rgba(5, 5, 15, 0)');
    gradient.addColorStop(1, 'rgba(5, 5, 15, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - 60, y + 50, 120, 150);
}

function drawVoidBuoy(x) {
    const y = CONFIG.waterLine;
    const bob = Math.sin(game.time * 0.002) * 5;

    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(x, y + bob - 50);
    ctx.lineTo(x - 15, y + bob + 20);
    ctx.lineTo(x + 15, y + bob + 20);
    ctx.closePath();
    ctx.fill();

    if (game.sanity < 50) {
        const alpha = (50 - game.sanity) / 50 * 0.5;
        ctx.fillStyle = `rgba(150, 50, 80, ${alpha})`;
        ctx.font = '12px VT323';
        ctx.textAlign = 'center';
        ctx.fillText('◊', x, y + bob - 30);
        ctx.fillText('◊', x - 5, y + bob - 15);
        ctx.fillText('◊', x + 5, y + bob);
        ctx.textAlign = 'left';
    }

    const gradient = ctx.createRadialGradient(x, y + 100, 20, x, y + 100, 200);
    gradient.addColorStop(0, 'rgba(0, 0, 5, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 0, 5, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - 200, y, 400, 300);
}

// Lore Rendering
function drawLoreBottles() {
    game.loreBottles.forEach(bottle => {
        const screenX = bottle.x - game.cameraX;
        if (screenX < -50 || screenX > CONFIG.canvas.width + 50) return;

        const bob = Math.sin(game.time * 0.003 + bottle.bobOffset) * 3;
        const y = bottle.y + bob;

        ctx.fillStyle = '#4a6a5a';
        ctx.beginPath();
        ctx.ellipse(screenX, y, 6, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#8a6a4a';
        ctx.fillRect(screenX - 2, y - 12, 4, 4);

        ctx.fillStyle = 'rgba(255, 255, 200, 0.5)';
        ctx.fillRect(screenX - 3, y - 5, 2, 4);
    });
}

function drawLorePopup() {
    if (!game.currentLore) return;

    const w = 400, h = 180;
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    ctx.fillStyle = 'rgba(20, 25, 30, 0.95)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#5a8a7a';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.font = '18px "Press Start 2P"';
    ctx.fillStyle = '#8aba9a';
    ctx.textAlign = 'center';
    ctx.fillText('LORE FOUND', x + w/2, y + 30);

    ctx.font = '16px VT323';
    ctx.fillStyle = '#c0d0c0';
    ctx.fillText(game.currentLore.title, x + w/2, y + 60);

    ctx.font = '14px VT323';
    ctx.fillStyle = '#a0b0a0';
    const words = game.currentLore.text.split(' ');
    let line = '';
    let lineY = y + 90;
    words.forEach(word => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > w - 40) {
            ctx.fillText(line, x + w/2, lineY);
            line = word + ' ';
            lineY += 18;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line, x + w/2, lineY);

    ctx.font = '12px VT323';
    ctx.fillStyle = '#6a8a7a';
    ctx.fillText('[SPACE] to continue', x + w/2, y + h - 15);
    ctx.textAlign = 'left';
}

// Minigame Rendering
function drawMinigame() {
    if (!game.minigame.active) return;

    const mg = game.minigame;
    const barWidth = 300, barHeight = 30;
    const x = (CONFIG.canvas.width - barWidth) / 2;
    const y = CONFIG.canvas.height - 100;

    ctx.fillStyle = 'rgba(20, 30, 40, 0.9)';
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = '#4a6a5a';
    ctx.strokeRect(x, y, barWidth, barHeight);

    const fishX = x + mg.targetZone * barWidth;
    const zoneWidth = mg.zoneSize * barWidth;
    ctx.fillStyle = 'rgba(100, 150, 120, 0.5)';
    ctx.fillRect(fishX - zoneWidth/2, y, zoneWidth, barHeight);

    const cursorX = x + mg.playerZone * barWidth;
    ctx.fillStyle = '#f0d080';
    ctx.fillRect(cursorX - 3, y - 5, 6, barHeight + 10);

    ctx.fillStyle = '#8aba9a';
    ctx.font = '16px VT323';
    ctx.textAlign = 'center';
    ctx.fillText('🐟', fishX, y + 20);

    ctx.fillStyle = 'rgba(20, 30, 40, 0.9)';
    ctx.fillRect(x, y - 25, barWidth, 15);
    const tensionColor = mg.tension > 70 ? '#a04040' : (mg.tension > 40 ? '#a0a040' : '#40a060');
    ctx.fillStyle = tensionColor;
    ctx.fillRect(x + 2, y - 23, (barWidth - 4) * (mg.tension / 100), 11);

    ctx.fillStyle = '#4a8a6a';
    ctx.fillRect(x + 2, y + barHeight + 5, (barWidth - 4) * (mg.fishStamina / 100), 8);

    ctx.font = '12px VT323';
    ctx.fillStyle = '#8a9a8a';
    ctx.textAlign = 'left';
    ctx.fillText('TENSION', x, y - 30);
    ctx.fillText('FISH STAMINA', x, y + barHeight + 20);
    ctx.textAlign = 'center';
    ctx.fillText('[<- ->] Keep fish in green zone!', x + barWidth/2, y + barHeight + 35);
    ctx.textAlign = 'left';
}

function drawCatchPopup() {
    if (!game.currentCatch) return;

    const c = game.currentCatch;
    const px = (CONFIG.canvas.width - 350) / 2;
    const py = 100;

    ctx.fillStyle = 'rgba(5, 10, 8, 0.95)';
    ctx.fillRect(px - 5, py - 5, 360, 190);
    ctx.strokeStyle = '#5a8a6a';
    ctx.lineWidth = 3;
    ctx.strokeRect(px, py, 350, 180);

    ctx.fillStyle = '#aaddaa';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText('CAUGHT!', px + 120, py + 30);

    ctx.fillStyle = '#8aba9a';
    ctx.font = '22px VT323';
    ctx.fillText(c.name, px + 20, py + 60);

    ctx.fillStyle = '#d0d080';
    ctx.font = '18px VT323';
    ctx.fillText(`${c.value} gold`, px + 20, py + 90);

    if (c.sanityLoss > 15) {
        ctx.fillStyle = '#a06060';
        ctx.fillText(`-${c.sanityLoss} sanity`, px + 150, py + 90);
    }

    ctx.fillStyle = '#6a8a7a';
    ctx.font = '16px VT323';
    ctx.fillText(c.desc, px + 20, py + 120);

    // Trophy info (Cast n Chill inspired)
    if (typeof drawTrophyInfo === 'function') {
        drawTrophyInfo(c, px + 20, py + 145);
    }

    ctx.fillStyle = '#5a6a5a';
    ctx.font = '14px VT323';
    ctx.fillText('[SPACE] continue', px + 220, py + 170);
}
