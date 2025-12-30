// ============================================================
// THE DEEP ONES - UI RENDERING
// ============================================================

// ============================================================
// MINIMAL CONTROL HINTS (Chill n Fish inspired)
// ============================================================

function drawMinimalControlHints() {
    ctx.save();

    // Apply UI fade-out opacity
    ctx.globalAlpha = game.ui?.opacity ?? 1.0;

    const w = CONFIG.canvas.width;
    const h = CONFIG.canvas.height;
    const hintColor = 'rgba(220, 230, 240, 0.85)';
    const boxColor = 'rgba(20, 30, 40, 0.7)';
    const borderColor = 'rgba(100, 120, 140, 0.4)';

    // Helper function to draw a hint box
    const drawHint = (text, x, y, align = 'center') => {
        ctx.font = '12px VT323';
        const metrics = ctx.measureText(text);
        const padding = 8;
        const boxW = metrics.width + padding * 2;
        const boxH = 22;

        let boxX = x - boxW / 2;
        if (align === 'left') boxX = x;
        if (align === 'right') boxX = x - boxW;

        // Background box
        ctx.fillStyle = boxColor;
        ctx.fillRect(boxX, y - boxH / 2, boxW, boxH);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX, y - boxH / 2, boxW, boxH);

        // Text
        ctx.fillStyle = hintColor;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
    };

    // CONTEXT-SENSITIVE HINTS based on game state

    // LEFT SIDE - Movement/Navigation
    if (game.state === 'sailing') {
        drawHint('[←→] DRIVE BOAT', 15, h / 2, 'left');
    }

    // BOTTOM LEFT - Pet Dog (always available when not in menus)
    if (!game.shop.open && !game.villageMenu?.open && !game.journal?.open && !game.loreViewer?.open) {
        drawHint('[P] PAT DOG', 15, h - 25, 'left');
    }

    // CENTER - Main Action (context-sensitive)
    if (game.state === 'sailing') {
        drawHint('[SPACE] CAST YOUR LINE', w / 2, h - 40, 'center');
    } else if (game.state === 'waiting') {
        drawHint('[SPACE] REEL IN', w / 2, h - 40, 'center');
        drawHint('[↑↓] ADJUST DEPTH', w / 2, h - 70, 'center');
    } else if (game.state === 'caught') {
        drawHint('[SPACE] CONTINUE', w / 2, h - 40, 'center');
    }

    // BOTTOM CENTER - Harbor (when near dock)
    if (game.nearDock && game.state === 'sailing') {
        drawHint('[E] HARBOR', w / 2, h - 70, 'center');
    }

    // RIGHT SIDE - Secondary Actions
    drawHint('[J] JOURNAL', w - 15, h - 85, 'right');
    drawHint('[L] LORE', w - 15, h - 55, 'right');
    drawHint('[H] HELP', w - 15, h - 25, 'right');

    // TOP RIGHT - Idle Mode indicator (if active)
    if (game.idleFishing?.active) {
        const idleX = w - 15;
        const idleY = 25;
        ctx.font = '14px VT323';
        const idleText = 'IDLE MODE';
        const metrics = ctx.measureText(idleText);
        const padding = 10;
        const boxW = metrics.width + padding * 2;
        const boxH = 28;

        // Pulsing effect
        const pulse = (Math.sin(game.time * 0.003) + 1) / 2;
        ctx.globalAlpha = (game.ui?.opacity ?? 1.0) * (0.7 + pulse * 0.3);

        ctx.fillStyle = 'rgba(80, 120, 100, 0.6)';
        ctx.fillRect(idleX - boxW, idleY - boxH / 2, boxW, boxH);
        ctx.strokeStyle = 'rgba(120, 180, 140, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(idleX - boxW, idleY - boxH / 2, boxW, boxH);

        ctx.fillStyle = '#c0e0d0';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(idleText, idleX - padding, idleY);

        ctx.globalAlpha = game.ui?.opacity ?? 1.0;
    }

    // TOP CENTER - Rod & Lure info (minimal)
    if (game.state === 'sailing' || game.state === 'waiting') {
        const rod = getCurrentRod();
        const rodText = rod ? rod.name : 'No Rod';
        drawHint(`🎣 ${rodText}`, w / 2, 25, 'center');
    }

    ctx.restore();
}

function drawLocationIndicator() {
    // MINIMALIZED: Only show minimap, no location name text
    const loc = CONFIG.locations[game.currentLocation];
    if (!loc) return;

    ctx.save();
    ctx.globalAlpha = game.ui?.opacity ?? 1.0;

    // Smaller, more minimal minimap
    const mapWidth = 120, mapHeight = 12;
    const mapX = CONFIG.canvas.width - mapWidth - 10;
    const mapY = CONFIG.canvas.height - mapHeight - 10;

    ctx.fillStyle = 'rgba(10, 20, 30, 0.5)';
    ctx.fillRect(mapX, mapY, mapWidth, mapHeight);
    ctx.strokeStyle = 'rgba(100, 130, 120, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(mapX, mapY, mapWidth, mapHeight);

    // Location markers (smaller)
    for (const [name, l] of Object.entries(CONFIG.locations)) {
        const markerX = mapX + (l.x / CONFIG.worldWidth) * mapWidth;
        ctx.fillStyle = name === game.currentLocation ? 'rgba(138, 186, 154, 0.6)' : 'rgba(74, 106, 90, 0.4)';
        ctx.fillRect(markerX - 1, mapY + 1, 2, mapHeight - 2);
    }

    // Boat marker (smaller triangle)
    const boatMarkerX = mapX + (game.boatX / CONFIG.worldWidth) * mapWidth;
    ctx.fillStyle = 'rgba(240, 208, 128, 0.8)';
    ctx.beginPath();
    ctx.moveTo(boatMarkerX, mapY + 2);
    ctx.lineTo(boatMarkerX - 2, mapY + mapHeight - 2);
    ctx.lineTo(boatMarkerX + 2, mapY + mapHeight - 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function drawWeatherIndicator() {
    // HIDDEN: Weather is now shown visually through effects, not as UI text
    // Keeping function for compatibility but it does nothing
    return;
}

function drawDogIndicator() {
    // MINIMALIZED: Dog barks are now shown as floating text only, no constant UI element
    // Happiness is communicated through dog behavior, not a bar

    if (game.dog.isBarking) {
        ctx.save();
        ctx.globalAlpha = game.ui?.opacity ?? 1.0;

        const x = 60;
        const y = CONFIG.canvas.height - 80;

        ctx.font = '14px VT323';
        ctx.fillStyle = '#e0e8f0';
        ctx.textAlign = 'left';

        let barkText = '*woof!*';
        if (game.dog.barkReason === 'rare') barkText = '*BARK BARK!*';
        else if (game.dog.barkReason === 'danger') barkText = '*whimper*';
        else if (game.dog.barkReason === 'excited') barkText = '*happy bark!*';

        // Draw with subtle background
        const metrics = ctx.measureText(barkText);
        const padding = 6;
        ctx.fillStyle = 'rgba(30, 40, 50, 0.6)';
        ctx.fillRect(x - padding, y - 14, metrics.width + padding * 2, 20);

        ctx.fillStyle = '#e0e8f0';
        ctx.fillText(barkText, x, y);

        ctx.restore();
    }
}

function drawLoreCollection() {
    if (!game.loreViewer.open) return;

    // Scaled for low resolution (480x270)
    const w = Math.min(440, CONFIG.canvas.width - 20);
    const h = Math.min(240, CONFIG.canvas.height - 20);
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    ctx.fillStyle = 'rgba(15, 20, 25, 0.98)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#5a4a6a';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#8a6a9a';
    ctx.textAlign = 'center';
    ctx.fillText('FORBIDDEN KNOWLEDGE', x + w/2, y + 18);

    ctx.font = '8px VT323';
    ctx.fillStyle = '#6a5a7a';
    ctx.fillText(`${game.loreFound.length} / ${LORE_FRAGMENTS.length} fragments`, x + w/2, y + 30);

    // Only show 2 items per page in low res
    const itemsPerPage = 2;
    const startIdx = game.loreViewer.page * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, LORE_FRAGMENTS.length);

    ctx.textAlign = 'left';
    for (let i = startIdx; i < endIdx; i++) {
        const lore = LORE_FRAGMENTS[i];
        const itemY = y + 40 + (i - startIdx) * 85;

        ctx.fillStyle = 'rgba(40, 35, 50, 0.5)';
        ctx.fillRect(x + 10, itemY, w - 20, 75);

        if (lore.found || game.loreFound.includes(lore.id)) {
            ctx.fillStyle = '#a08ab0';
            ctx.font = '10px VT323';
            ctx.fillText(lore.title, x + 15, itemY + 14);

            ctx.fillStyle = '#8a7a9a';
            ctx.font = '8px VT323';
            const maxChars = Math.floor((w - 30) / 4);
            const text = lore.text.length > maxChars ? lore.text.substring(0, maxChars - 3) + '...' : lore.text;
            ctx.fillText(text, x + 15, itemY + 30);

            ctx.fillStyle = '#6a5a7a';
            ctx.font = '7px VT323';
            const locName = CONFIG.locations[lore.location]?.name || lore.location;
            ctx.fillText(`Found: ${locName}`, x + 15, itemY + 45);
        } else {
            ctx.fillStyle = '#5a4a6a';
            ctx.font = '10px VT323';
            ctx.fillText('???', x + 15, itemY + 14);

            ctx.fillStyle = '#4a3a5a';
            ctx.font = '8px VT323';
            ctx.fillText('Undiscovered...', x + 15, itemY + 30);

            ctx.fillStyle = '#3a2a4a';
            ctx.font = '7px VT323';
            const locName = CONFIG.locations[lore.location]?.name || lore.location;
            ctx.fillText(`Hint: ${locName}`, x + 15, itemY + 45);
        }
    }

    const totalPages = Math.ceil(LORE_FRAGMENTS.length / itemsPerPage);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6a5a7a';
    ctx.font = '8px VT323';
    ctx.fillText(`Page ${game.loreViewer.page + 1}/${totalPages}`, x + w/2, y + h - 20);

    ctx.fillStyle = '#5a4a6a';
    ctx.font = '7px VT323';
    ctx.fillText('[<-/->] Pages | [ESC] Close', x + w/2, y + h - 10);

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
    // Scaled for low resolution
    const w = Math.min(300, CONFIG.canvas.width - 20);
    const h = Math.min(250, CONFIG.canvas.height - 10);
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    // Background
    ctx.fillStyle = 'rgba(10, 15, 20, 0.95)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#5a7a8a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    // Title
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#8ab0c0';
    ctx.textAlign = 'center';
    ctx.fillText('CONTROLS', x + w/2, y + 15);

    // Hotkeys list - condensed
    const hotkeys = [
        { key: 'ARROWS', desc: 'Move/Navigate' },
        { key: 'SPACE', desc: 'Cast/Confirm' },
        { key: 'E', desc: 'Harbor menu' },
        { key: 'P', desc: 'Pet dog' },
        { key: 'I', desc: 'Idle mode' },
        { key: 'J', desc: 'Journal' },
        { key: 'L', desc: 'Lore' },
        { key: 'A', desc: 'Achievements' },
        { key: 'H', desc: 'This help' },
        { key: 'T', desc: 'Time' },
        { key: 'ESC', desc: 'Close' }
    ];

    ctx.textAlign = 'left';
    const cols = 2;
    const itemsPerCol = Math.ceil(hotkeys.length / cols);

    hotkeys.forEach((hk, i) => {
        const col = Math.floor(i / itemsPerCol);
        const row = i % itemsPerCol;
        const itemX = x + 10 + col * (w / 2);
        const itemY = y + 30 + row * 18;

        ctx.fillStyle = '#6a9aaa';
        ctx.font = '8px VT323';
        ctx.fillText(`[${hk.key}]`, itemX, itemY);

        ctx.fillStyle = '#a0b0c0';
        ctx.font = '7px VT323';
        ctx.fillText(hk.desc, itemX + 50, itemY);
    });

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#5a7a8a';
    ctx.font = '7px VT323';
    ctx.fillText('[H/ESC] Close', x + w/2, y + h - 8);
    ctx.textAlign = 'left';
}

// Tutorial system - REPLACED by minimal control hints
// Keeping function for compatibility but it does nothing
function drawTutorial() {
    // Tutorial tips are now integrated into drawMinimalControlHints()
    // which shows contextual controls based on game state
    return;
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

// ============================================================
// STREAK/COMBO SYSTEM UI
// ============================================================

function drawStreakIndicator() {
    if (game.streak.count < 2) return;

    const x = CONFIG.canvas.width / 2;
    const y = 70;

    // Streak background
    const pulse = (Math.sin(game.time * 0.01) + 1) / 2;
    const alpha = 0.7 + pulse * 0.3;

    ctx.fillStyle = `rgba(255, 180, 50, ${alpha * 0.2})`;
    ctx.fillRect(x - 60, y - 20, 120, 40);

    // Streak text
    ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
    ctx.font = '20px VT323';
    ctx.textAlign = 'center';
    ctx.fillText(`STREAK x${game.streak.count}`, x, y);

    // Multiplier
    if (game.streak.comboMultiplier > 1) {
        ctx.fillStyle = `rgba(100, 255, 100, ${alpha})`;
        ctx.font = '14px VT323';
        ctx.fillText(`+${Math.round((game.streak.comboMultiplier - 1) * 100)}% bonus`, x, y + 18);
    }

    ctx.textAlign = 'left';
}

// Update streak system
function updateStreak() {
    if (game.streak.timer > 0) {
        game.streak.timer--;
        if (game.streak.timer <= 0) {
            // Streak ended
            if (game.streak.count > game.streak.maxStreak) {
                game.streak.maxStreak = game.streak.count;
            }
            game.streak.count = 0;
            game.streak.comboMultiplier = 1;
        }
    }
}

// Add to streak
function addToStreak() {
    game.streak.count++;
    game.streak.timer = 300;  // 5 seconds at 60fps to maintain streak
    game.streak.lastCatchTime = game.time;

    // Calculate multiplier (up to 2x at 10 streak)
    game.streak.comboMultiplier = 1 + Math.min(1, game.streak.count * 0.1);

    // Check daily challenge
    if (game.streak.count >= 5 && typeof checkDailyChallengeProgress === 'function') {
        checkDailyChallengeProgress('streak', game.streak.count);
    }
}

// ============================================================
// DAILY CHALLENGES UI
// ============================================================

function drawDailyChallenges() {
    if (!game.dailyChallenges.challenges || game.dailyChallenges.challenges.length === 0) return;

    const x = CONFIG.canvas.width - 220;
    const y = 200;
    const w = 210;
    const h = 25 + game.dailyChallenges.challenges.length * 25;

    // Background
    ctx.fillStyle = 'rgba(20, 30, 40, 0.8)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#4a6a7a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    // Title
    ctx.fillStyle = '#8ab0c0';
    ctx.font = '12px VT323';
    ctx.textAlign = 'left';
    ctx.fillText('DAILY CHALLENGES', x + 10, y + 15);

    // Challenges
    game.dailyChallenges.challenges.forEach((challenge, i) => {
        const itemY = y + 30 + i * 25;
        const isCompleted = game.dailyChallenges.completed.includes(challenge.id);

        ctx.fillStyle = isCompleted ? '#60a060' : '#8090a0';
        ctx.font = '11px VT323';
        ctx.fillText(isCompleted ? 'v' : 'o', x + 10, itemY);
        ctx.fillText(challenge.name, x + 25, itemY);

        ctx.fillStyle = '#6080a0';
        ctx.font = '10px VT323';
        ctx.fillText(challenge.desc, x + 25, itemY + 12);
    });

    ctx.textAlign = 'left';
}

// Generate daily challenges
function generateDailyChallenges() {
    const today = new Date().toDateString();

    if (game.dailyChallenges.date !== today) {
        game.dailyChallenges.date = today;
        game.dailyChallenges.completed = [];

        // Pick 3 random challenges
        if (typeof DAILY_CHALLENGES !== 'undefined') {
            const shuffled = [...DAILY_CHALLENGES].sort(() => Math.random() - 0.5);
            game.dailyChallenges.challenges = shuffled.slice(0, 3).map(c => ({
                ...c,
                progress: 0
            }));
        }
    }
}

// Check daily challenge progress
function checkDailyChallengeProgress(type, value) {
    if (!game.dailyChallenges.challenges) return;

    game.dailyChallenges.challenges.forEach(challenge => {
        if (game.dailyChallenges.completed.includes(challenge.id)) return;

        let completed = false;

        if (challenge.type === type) {
            challenge.progress = (challenge.progress || 0) + (typeof value === 'number' ? value : 1);
            if (challenge.progress >= challenge.target) {
                completed = true;
            }
        } else if (challenge.zone && type === 'catch') {
            // Check zone-based catch challenges
            if (value && value.zone === challenge.zone) {
                challenge.progress = (challenge.progress || 0) + 1;
                if (challenge.progress >= challenge.target) {
                    completed = true;
                }
            }
        }

        if (completed) {
            game.dailyChallenges.completed.push(challenge.id);
            // Reward
            const reward = 25 + Math.floor(Math.random() * 25);
            game.money += reward;
            game.achievements.stats.totalGoldEarned += reward;
            addSoundEffect(`Challenge Complete! +${reward}g`, CONFIG.canvas.width / 2, 180, {
                color: '#80e0a0',
                size: 16,
                duration: 100
            });
            if (typeof playAchievement === 'function') playAchievement();
        }
    });
}

// ============================================================
// VISUAL EFFECTS
// ============================================================

// Water reflection effect
function drawWaterReflection() {
    if (typeof GameSettings !== 'undefined' && !GameSettings.graphics.weatherEffects) return;

    const boatX = game.boatX - game.cameraX;
    const reflectionY = CONFIG.waterLine + 20;

    // Simple boat reflection
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.translate(0, reflectionY * 2);
    ctx.scale(1, -1);

    // Draw inverted boat shape
    ctx.fillStyle = '#2a2520';
    ctx.beginPath();
    ctx.moveTo(boatX - 35, CONFIG.waterLine - 5);
    ctx.lineTo(boatX - 30, CONFIG.waterLine - 25);
    ctx.lineTo(boatX + 30, CONFIG.waterLine - 25);
    ctx.lineTo(boatX + 35, CONFIG.waterLine - 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Wavy distortion overlay
    for (let i = 0; i < 5; i++) {
        const waveY = reflectionY + i * 8;
        const waveOffset = Math.sin(game.time * 0.003 + i * 0.5) * 3;

        ctx.strokeStyle = `rgba(100, 140, 160, ${0.05 - i * 0.01})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(boatX - 40 + waveOffset, waveY);
        ctx.lineTo(boatX + 40 + waveOffset, waveY);
        ctx.stroke();
    }
}

// Big catch screen shake
function applyBigCatchShake() {
    if (game.visualEffects.bigCatchShake > 0) {
        const intensity = game.visualEffects.bigCatchShake;
        const shakeX = (Math.random() - 0.5) * intensity * 4;
        const shakeY = (Math.random() - 0.5) * intensity * 4;
        ctx.translate(shakeX, shakeY);
        game.visualEffects.bigCatchShake -= 0.05;
    }
}

// Glitch effect for abyss/horror
function drawGlitchEffect() {
    if (game.visualEffects.glitchIntensity <= 0) return;
    if (typeof GameSettings !== 'undefined' && !GameSettings.graphics.particles) return;

    const intensity = game.visualEffects.glitchIntensity;

    // Random scanlines
    for (let i = 0; i < 5; i++) {
        if (Math.random() < intensity * 0.3) {
            const y = Math.random() * CONFIG.canvas.height;
            const height = 2 + Math.random() * 5;
            ctx.fillStyle = `rgba(100, 200, 200, ${intensity * 0.3})`;
            ctx.fillRect(0, y, CONFIG.canvas.width, height);
        }
    }

    // Color channel offset
    if (Math.random() < intensity * 0.1) {
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = `rgba(255, 0, 0, ${intensity * 0.1})`;
        ctx.fillRect(2, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        ctx.fillStyle = `rgba(0, 255, 255, ${intensity * 0.1})`;
        ctx.fillRect(-2, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        ctx.globalCompositeOperation = 'source-over';
    }

    game.visualEffects.glitchIntensity -= 0.01;
}

// Trigger glitch effect
function triggerGlitch(intensity) {
    intensity = intensity || 0.5;
    game.visualEffects.glitchIntensity = Math.min(1, game.visualEffects.glitchIntensity + intensity);
}

// Mute indicator
function drawMuteIndicator() {
    if (typeof AudioManager !== 'undefined' && AudioManager.settings && AudioManager.settings.muted) {
        ctx.fillStyle = 'rgba(150, 80, 80, 0.8)';
        ctx.font = '12px VT323';
        ctx.textAlign = 'right';
        ctx.fillText('[M] MUTED', CONFIG.canvas.width - 15, 75);
        ctx.textAlign = 'left';
    }
}

// Fullscreen indicator
function drawFullscreenHint() {
    if (typeof isTouchDevice === 'function' && isTouchDevice() && typeof isFullscreen === 'function' && !isFullscreen()) {
        // Only show hint on touch devices when not fullscreen
        if (game.state === 'sailing' && game.caughtCreatures.length < 5) {
            ctx.fillStyle = 'rgba(80, 100, 120, 0.7)';
            ctx.font = '11px VT323';
            ctx.textAlign = 'center';
            ctx.fillText('Tap [F] for fullscreen', CONFIG.canvas.width / 2, CONFIG.canvas.height - 45);
            ctx.textAlign = 'left';
        }
    }
}
