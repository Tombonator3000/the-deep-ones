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
    // Safety checks
    if (typeof game.boatX !== 'number' || isNaN(game.boatX)) {
        console.error('[BOAT] Invalid boatX:', game.boatX);
        game.boatX = CONFIG.dockX || 1500;
    }
    if (typeof game.cameraX !== 'number' || isNaN(game.cameraX)) {
        console.error('[BOAT] Invalid cameraX:', game.cameraX);
        game.cameraX = 0;
    }
    if (typeof game.time !== 'number' || isNaN(game.time)) {
        console.error('[BOAT] Invalid game.time:', game.time);
        game.time = 0;
    }

    const bob = Math.sin(game.time * 0.04) * 4;
    const x = game.boatX - game.cameraX;
    const y = CONFIG.waterLine - 15 + bob;
    const tilt = Math.sin(game.time * 0.03) * 0.03;

    // Debug: Log boat position every 2 seconds
    if (Math.floor(game.time / 2000) !== game._lastBoatDebug) {
        game._lastBoatDebug = Math.floor(game.time / 2000);
        console.log('[BOAT] Drawing at screen pos:', Math.round(x), Math.round(y),
            '| boatX:', Math.round(game.boatX),
            '| cameraX:', Math.round(game.cameraX),
            '| waterLine:', CONFIG.waterLine,
            '| useSprites:', CONFIG.useSprites);
    }

    // Check if boat is on screen
    if (x < -100 || x > CONFIG.canvas.width + 100) {
        console.warn('[BOAT] Boat is off-screen! x:', x);
    }

    const boatImg = loadedAssets.images['sprite-boat'];

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    if (boatImg && CONFIG.useSprites) {
        // Scale boat sprite to configured size (boat.png is 1080x589, we want 90x50)
        ctx.drawImage(boatImg,
            -SPRITES.boat.anchor.x, -SPRITES.boat.anchor.y,
            SPRITES.boat.width, SPRITES.boat.height);
    } else {
        drawBoatProcedural(0, 0);
    }

    ctx.restore();
}

// --- Boat Component Drawing Helpers ---

function drawBoatHull(x, y) {
    // Ensure globalAlpha is 1 for boat rendering
    ctx.globalAlpha = 1;

    // DEBUG: Draw bright marker at boat position
    if (CONFIG.showDebug) {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(x - 3, y - 60, 6, 6);
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px VT323';
        ctx.fillText('BOAT', x - 15, y - 65);
    }

    // OUTER GLOW for visibility (especially at night/dusk)
    const glowGrad = ctx.createRadialGradient(x, y + 10, 0, x, y + 10, 60);
    glowGrad.addColorStop(0, 'rgba(255, 220, 150, 0.15)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(x, y + 10, 60, 0, Math.PI * 2);
    ctx.fill();

    // Main hull shape - MUCH BRIGHTER cream/tan color
    ctx.fillStyle = '#d4b896';  // Bright tan
    ctx.beginPath();
    ctx.moveTo(x - 45, y);
    ctx.quadraticCurveTo(x - 50, y + 15, x - 35, y + 20);
    ctx.lineTo(x + 35, y + 20);
    ctx.quadraticCurveTo(x + 50, y + 15, x + 45, y);
    ctx.closePath();
    ctx.fill();

    // THICK dark outline for strong visibility
    ctx.strokeStyle = '#1a0a00';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Hull plank details - multiple planks for texture
    ctx.fillStyle = '#c4a886';
    ctx.fillRect(x - 38, y + 3, 76, 3);
    ctx.fillRect(x - 36, y + 8, 72, 3);
    ctx.fillRect(x - 34, y + 13, 68, 3);

    // Plank lines
    ctx.strokeStyle = '#8a6850';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 38, y + 6);
    ctx.lineTo(x + 38, y + 6);
    ctx.moveTo(x - 36, y + 11);
    ctx.lineTo(x + 36, y + 11);
    ctx.moveTo(x - 34, y + 16);
    ctx.lineTo(x + 34, y + 16);
    ctx.stroke();

    // Hull interior shadow
    ctx.fillStyle = '#9a7a60';
    ctx.beginPath();
    ctx.ellipse(x, y + 6, 35, 6, 0, 0, Math.PI);
    ctx.fill();

    // Gunwale (top edge) - bright highlight
    ctx.strokeStyle = '#e8d8c8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 44, y + 1);
    ctx.quadraticCurveTo(x, y - 3, x + 44, y + 1);
    ctx.stroke();
}

function drawFisher(x, y, transVis) {
    // Body - BRIGHTER clothing (yellow raincoat)
    ctx.fillStyle = '#c4a040';  // Yellow raincoat
    ctx.fillRect(x - 8, y - 25, 16, 25);

    // Body outline
    ctx.strokeStyle = '#604820';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 8, y - 25, 16, 25);

    // Suspenders/straps
    ctx.fillStyle = '#604820';
    ctx.fillRect(x - 6, y - 25, 3, 25);
    ctx.fillRect(x + 3, y - 25, 3, 25);

    // Head - skin color changes with transformation
    ctx.fillStyle = transVis.skinColor;
    ctx.beginPath();
    ctx.arc(x, y - 32, 8, 0, Math.PI * 2);
    ctx.fill();

    // Head outline
    ctx.strokeStyle = '#5a4a3a';
    ctx.lineWidth = 1;
    ctx.stroke();

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

    // Hat - BRIGHTER (fisherman's cap)
    ctx.fillStyle = '#5a5550';  // Lighter gray
    ctx.fillRect(x - 10, y - 42, 20, 5);
    ctx.fillRect(x - 6, y - 48, 12, 8);

    // Hat highlight
    ctx.fillStyle = '#7a7570';
    ctx.fillRect(x - 5, y - 47, 10, 3);

    // Eyes - get bigger with transformation
    const eyeSize = 1.5 * transVis.eyeSize;
    ctx.fillStyle = game.transformation.stage >= 3 ? '#60a0a0' : '#2a3a3a';
    const blink = Math.sin(game.time * 0.1) > 0.95 ? 0 : 1;
    ctx.beginPath();
    ctx.arc(x - 4, y - 33, eyeSize * blink, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 33, eyeSize * blink, 0, Math.PI * 2);
    ctx.fill();

    // Eye whites/highlights
    if (blink > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x - 4 + 0.5, y - 33 - 0.5, 0.5, 0, Math.PI * 2);
        ctx.arc(x + 4 + 0.5, y - 33 - 0.5, 0.5, 0, Math.PI * 2);
        ctx.fill();
    }

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

    // Arms (visible)
    ctx.fillStyle = transVis.skinColor;
    ctx.fillRect(x - 12, y - 18, 4, 12);  // Left arm
    ctx.fillRect(x + 8, y - 18, 4, 12);   // Right arm
}

function drawBoatDog(x, y) {
    // Body - BRIGHTER golden color
    ctx.fillStyle = '#e8c89a';
    ctx.beginPath();
    ctx.ellipse(x + 25, y - 5, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body outline
    ctx.strokeStyle = '#806040';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Head
    ctx.fillStyle = '#e8c89a';
    ctx.beginPath();
    ctx.arc(x + 32, y - 10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#806040';
    ctx.stroke();

    // Ears
    ctx.fillStyle = '#c8a87a';
    ctx.beginPath();
    ctx.ellipse(x + 28, y - 14, 3, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 36, y - 14, 3, 4, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#d8b88a';
    ctx.beginPath();
    ctx.ellipse(x + 36, y - 9, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#302520';
    ctx.beginPath();
    ctx.arc(x + 38, y - 9, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#201510';
    ctx.beginPath();
    ctx.arc(x + 33, y - 11, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 33.5, y - 11.5, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Tail with animation
    const tailWag = game.dog.animation === 'wag' ? Math.sin(game.time * 0.3) * 8 : 0;
    ctx.strokeStyle = '#e8c89a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 16, y - 5);
    ctx.quadraticCurveTo(x + 10, y - 15 + Math.sin(game.time * 0.2) * 5 + tailWag, x + 8, y - 20);
    ctx.stroke();

    // Tail outline
    ctx.strokeStyle = '#806040';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Legs (front)
    ctx.fillStyle = '#e8c89a';
    ctx.fillRect(x + 28, y - 2, 3, 8);
    ctx.fillRect(x + 22, y - 2, 3, 8);
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

    // LARGE outer glow for visibility
    const outerGlow = ctx.createRadialGradient(x - 30, y - 10, 0, x - 30, y - 10, 50);
    outerGlow.addColorStop(0, `rgba(255, 220, 120, ${0.3 + glow * 0.2})`);
    outerGlow.addColorStop(0.5, `rgba(255, 180, 80, ${0.15 + glow * 0.1})`);
    outerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(x - 30, y - 10, 50, 0, Math.PI * 2);
    ctx.fill();

    // Inner glow
    const lanternGrad = ctx.createRadialGradient(x - 30, y - 10, 0, x - 30, y - 10, 25);
    lanternGrad.addColorStop(0, `rgba(255, 240, 180, ${0.6 + glow * 0.3})`);
    lanternGrad.addColorStop(0.5, `rgba(255, 200, 100, ${0.3 + glow * 0.2})`);
    lanternGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lanternGrad;
    ctx.beginPath();
    ctx.arc(x - 30, y - 10, 25, 0, Math.PI * 2);
    ctx.fill();

    // Lantern pole
    ctx.fillStyle = '#4a3a25';
    ctx.fillRect(x - 32, y - 5, 4, 15);

    // Lantern top hook
    ctx.strokeStyle = '#4a3a25';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 30, y - 5);
    ctx.lineTo(x - 30, y - 15);
    ctx.stroke();

    // Lantern body (brass frame)
    ctx.fillStyle = '#806830';
    ctx.fillRect(x - 36, y - 8, 12, 16);

    // Lantern glass (glowing)
    ctx.fillStyle = `rgba(255, 240, 180, ${0.8 + glow * 0.2})`;
    ctx.fillRect(x - 35, y - 6, 10, 12);

    // Bright center flame
    ctx.fillStyle = `rgba(255, 255, 220, ${0.9 + glow * 0.1})`;
    ctx.beginPath();
    ctx.ellipse(x - 30, y - 2 + glow * 2, 3, 4 + glow * 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lantern top
    ctx.fillStyle = '#806830';
    ctx.beginPath();
    ctx.moveTo(x - 37, y - 8);
    ctx.lineTo(x - 30, y - 14);
    ctx.lineTo(x - 23, y - 8);
    ctx.closePath();
    ctx.fill();
}

// --- Main Boat Procedural Drawing ---

function drawBoatProcedural(x, y) {
    // Get transformation visuals with fallback defaults
    let transVis;
    try {
        transVis = getTransformationVisuals();
    } catch (e) {
        console.warn('getTransformationVisuals failed, using defaults:', e);
    }

    // Fallback if transVis is undefined or missing properties
    if (!transVis || !transVis.skinColor) {
        transVis = {
            skinColor: '#d4a574',
            eyeSize: 1,
            hasGills: false,
            hasWebbing: false,
            glowIntensity: 0
        };
    }

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

    // Scaled for low resolution
    const w = Math.min(280, CONFIG.canvas.width - 20);
    const h = Math.min(140, CONFIG.canvas.height - 30);
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    // Use crisp UI canvas for readable text
    drawCrispRect(x, y, w, h, 'rgba(20, 25, 30, 0.95)');
    drawCrispStrokeRect(x, y, w, h, '#5a8a7a', 1);

    drawCrispText('LORE FOUND', x + w/2, y + 18, {
        font: '10px "Press Start 2P"',
        color: '#8aba9a',
        align: 'center'
    });

    drawCrispText(game.currentLore.title, x + w/2, y + 38, {
        font: '14px VT323',
        color: '#c0d0c0',
        align: 'center'
    });

    // Word wrap the lore text using crisp rendering
    const scale = CONFIG.uiScale || 1;
    const targetCtx = uiCtx || ctx;
    targetCtx.save();
    targetCtx.font = `${Math.round(12 * scale)}px VT323`;

    const words = game.currentLore.text.split(' ');
    let line = '';
    let lineY = y + 58;
    const maxWidth = (w - 20) * scale;

    words.forEach(word => {
        const testLine = line + word + ' ';
        if (targetCtx.measureText(testLine).width > maxWidth) {
            drawCrispText(line.trim(), x + w/2, lineY, {
                font: '12px VT323',
                color: '#a0b0a0',
                align: 'center'
            });
            line = word + ' ';
            lineY += 14;
        } else {
            line = testLine;
        }
    });
    if (lineY <= y + h - 25) {
        drawCrispText(line.trim(), x + w/2, lineY, {
            font: '12px VT323',
            color: '#a0b0a0',
            align: 'center'
        });
    }
    targetCtx.restore();

    drawCrispText('[SPACE] to continue', x + w/2, y + h - 10, {
        font: '10px VT323',
        color: '#6a8a7a',
        align: 'center'
    });
}

// Minigame Rendering - Simplified progress bar
function drawMinigame() {
    if (!game.minigame.active) return;

    const mg = game.minigame;
    // Scaled for low resolution
    const barWidth = Math.min(200, CONFIG.canvas.width - 40);
    const barHeight = 20;
    const x = (CONFIG.canvas.width - barWidth) / 2;
    const y = CONFIG.canvas.height - 55;

    // Background panel - scaled for low res
    const panelH = 55;
    ctx.fillStyle = 'rgba(15, 25, 35, 0.92)';
    ctx.fillRect(x - 10, y - 22, barWidth + 20, panelH);
    ctx.strokeStyle = '#4a7a6a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 10, y - 22, barWidth + 20, panelH);

    // Title
    ctx.font = '8px VT323';
    ctx.fillStyle = '#8aba9a';
    ctx.textAlign = 'center';
    ctx.fillText('REELING IN...', x + barWidth/2, y - 12);

    // Progress bar background
    ctx.fillStyle = 'rgba(30, 50, 60, 0.9)';
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = '#3a5a5a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);

    // Progress bar fill with gradient
    const progressWidth = (barWidth - 4) * (mg.progress / 100);
    const gradient = ctx.createLinearGradient(x, y, x + progressWidth, y);
    gradient.addColorStop(0, '#4a8a6a');
    gradient.addColorStop(0.5, '#6ab08a');
    gradient.addColorStop(1, '#8ad0aa');
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 2, y + 2, progressWidth, barHeight - 4);

    // Shine effect on progress bar
    if (mg.reeling) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(x + 2, y + 2, progressWidth, (barHeight - 4) / 3);
    }

    // Fish icon that moves with progress
    const fishX = x + 10 + (barWidth - 20) * (mg.progress / 100) + mg.fishWiggle;
    const fishY = y + barHeight / 2;

    // Fish wiggle animation
    ctx.save();
    ctx.translate(fishX, fishY);
    ctx.rotate(Math.sin(game.time * 0.1) * 0.1 * (100 - mg.progress) / 100);

    // Draw fish - smaller for low res
    ctx.fillStyle = '#d0e0f0';
    ctx.font = '12px VT323';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('><>', 0, 0);
    ctx.restore();

    // Splash effect when reeling
    if (mg.splashTimer > 0) {
        ctx.fillStyle = `rgba(150, 200, 255, ${mg.splashTimer / 15})`;
        for (let i = 0; i < 2; i++) {
            const splashX = fishX + Math.random() * 10 - 5;
            const splashY = fishY + Math.random() * 6 - 8;
            ctx.beginPath();
            ctx.arc(splashX, splashY, 1 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Percentage text
    ctx.font = '10px VT323';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.floor(mg.progress)}%`, x + barWidth / 2, y + barHeight / 2);

    // Instructions
    ctx.font = '7px VT323';
    ctx.fillStyle = mg.reeling ? '#aaddaa' : '#7a9a8a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const instruction = mg.reeling ? 'Reeling!' : 'Hold [SPACE]';
    ctx.fillText(instruction, x + barWidth / 2, y + barHeight + 10);
}

function drawCatchPopup() {
    if (!game.currentCatch) return;

    const c = game.currentCatch;
    // Scaled for low resolution
    const w = Math.min(220, CONFIG.canvas.width - 20);
    const h = 100;
    const px = (CONFIG.canvas.width - w) / 2;
    const py = 50;

    // Special styling for lore items - uses crisp UI canvas
    if (c.isLore) {
        drawCrispRect(px - 3, py - 3, w + 6, h + 6, 'rgba(15, 10, 20, 0.95)');
        drawCrispStrokeRect(px, py, w, h, '#8a6a9a', 1);

        drawCrispText('FOUND!', px + w/2, py + 15, {
            font: '10px "Press Start 2P"',
            color: '#c0a0d0',
            align: 'center'
        });

        drawCrispText(c.name, px + 10, py + 35, {
            font: '16px VT323',
            color: '#a090c0'
        });

        drawCrispText(c.desc, px + 10, py + 55, {
            font: '12px VT323',
            color: '#8a7a9a'
        });

        drawCrispText('Press SPACE to read...', px + 10, py + 75, {
            font: '11px VT323',
            color: '#6a5a7a'
        });

        drawCrispText('[SPACE]', px + w/2, py + h - 8, {
            font: '10px VT323',
            color: '#5a4a6a',
            align: 'center'
        });
        return;
    }

    // Normal catch popup - uses crisp UI canvas
    drawCrispRect(px - 3, py - 3, w + 6, h + 6, 'rgba(5, 10, 8, 0.95)');
    drawCrispStrokeRect(px, py, w, h, '#5a8a6a', 1);

    drawCrispText('CAUGHT!', px + w/2, py + 15, {
        font: '10px "Press Start 2P"',
        color: '#aaddaa',
        align: 'center'
    });

    drawCrispText(c.name, px + 10, py + 35, {
        font: '16px VT323',
        color: '#8aba9a'
    });

    drawCrispText(`${c.value}g`, px + 10, py + 52, {
        font: '14px VT323',
        color: '#d0d080'
    });

    if (c.sanityLoss > 15) {
        drawCrispText(`-${c.sanityLoss} san`, px + 70, py + 52, {
            font: '14px VT323',
            color: '#a06060'
        });
    }

    // Truncate description for display
    const maxChars = 45;
    const desc = c.desc.length > maxChars ? c.desc.substring(0, maxChars - 3) + '...' : c.desc;
    drawCrispText(desc, px + 10, py + 72, {
        font: '11px VT323',
        color: '#6a8a7a'
    });

    drawCrispText('[SPACE]', px + w/2, py + h - 8, {
        font: '10px VT323',
        color: '#5a6a5a',
        align: 'center'
    });
}
