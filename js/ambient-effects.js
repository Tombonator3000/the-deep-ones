// ============================================================
// THE DEEP ONES - AMBIENT EFFECTS
// Inspired by Cast 'n' Chill atmospheric rendering
// ============================================================

// Particle system for atmospheric effects
const AMBIENT_EFFECTS = {
    particles: [],
    maxParticles: {
        fog: 60,
        lightRays: 8,
        fireflies: 25
    }
};

// Helper function to set alpha on an existing RGBA color string
function setRGBAAlpha(rgbaString, newAlpha) {
    // Extract RGB values from rgba string (handles both full rgba and incomplete strings)
    const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) {
        console.error('[AMBIENT] Invalid RGBA string:', rgbaString);
        return `rgba(255, 255, 255, ${newAlpha})`;
    }

    const [_, r, g, b] = match;
    return `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
}

// Initialize ambient effects
function initAmbientEffects() {
    AMBIENT_EFFECTS.particles = [];
    console.log('[AMBIENT] Effects initialized');
}

// Main update function - called each frame
function updateAmbientEffects(deltaTime = 16) {
    const timeOfDay = game.timeOfDay;

    // Update existing particles
    AMBIENT_EFFECTS.particles = AMBIENT_EFFECTS.particles.filter(p => {
        p.life += deltaTime;
        if (p.life > p.maxLife) return false;

        // Update based on particle type
        switch(p.type) {
            case 'fog':
                updateFogParticle(p, deltaTime);
                break;
            case 'lightRay':
                updateLightRayParticle(p, deltaTime);
                break;
            case 'firefly':
                updateFireflyParticle(p, deltaTime);
                break;
        }

        return true;
    });

    // Spawn new particles based on time of day
    spawnParticlesForTime(timeOfDay);
}

// Draw all ambient effects
function drawAmbientEffects(ctx) {
    const timeOfDay = game.timeOfDay;
    const palette = getTimePalette();

    // Draw particles by type
    AMBIENT_EFFECTS.particles.forEach(p => {
        switch(p.type) {
            case 'fog':
                drawFogParticle(ctx, p, palette);
                break;
            case 'lightRay':
                drawLightRayParticle(ctx, p, palette);
                break;
            case 'firefly':
                drawFireflyParticle(ctx, p);
                break;
        }
    });
}

// ============================================================
// DAWN - FOG PARTICLES
// ============================================================

function spawnFogParticle() {
    return {
        type: 'fog',
        x: Math.random() * CONFIG.canvas.width,
        y: CONFIG.waterLine - Math.random() * 80, // Fog near water surface
        vx: (Math.random() - 0.5) * 0.15, // Slow horizontal drift
        vy: Math.random() * 0.05 - 0.08, // Gentle upward movement
        size: 30 + Math.random() * 50,
        opacity: 0.15 + Math.random() * 0.15,
        life: 0,
        maxLife: 8000 + Math.random() * 4000,
        phase: Math.random() * Math.PI * 2 // For pulsing effect
    };
}

function updateFogParticle(p, deltaTime) {
    p.x += p.vx * deltaTime / 16;
    p.y += p.vy * deltaTime / 16;

    // Wrap around screen
    if (p.x < -p.size) p.x = CONFIG.canvas.width + p.size;
    if (p.x > CONFIG.canvas.width + p.size) p.x = -p.size;

    // Gentle pulsing
    p.phase += 0.001 * deltaTime / 16;

    // Fade in/out
    const lifeRatio = p.life / p.maxLife;
    if (lifeRatio < 0.2) {
        p.currentOpacity = p.opacity * (lifeRatio / 0.2);
    } else if (lifeRatio > 0.8) {
        p.currentOpacity = p.opacity * ((1 - lifeRatio) / 0.2);
    } else {
        p.currentOpacity = p.opacity * (1 + Math.sin(p.phase) * 0.2);
    }
}

function drawFogParticle(ctx, p, palette) {
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);

    // Use dawn palette colors for fog
    const fogColor = palette.ambientLight || 'rgba(200, 180, 170, 0.2)';
    const alpha = p.currentOpacity || p.opacity;

    gradient.addColorStop(0, setRGBAAlpha(fogColor, alpha));
    gradient.addColorStop(0.5, setRGBAAlpha(fogColor, alpha * 0.5));
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
}

// ============================================================
// DUSK - LIGHT RAYS
// ============================================================

function spawnLightRayParticle() {
    const palette = getTimePalette();
    const sunPos = palette.sun || { x: 900, y: 220 };

    return {
        type: 'lightRay',
        x: sunPos.x + (Math.random() - 0.5) * 100,
        y: sunPos.y,
        angle: Math.PI * 0.5 + (Math.random() - 0.5) * 0.4, // Downward rays with variation
        length: 150 + Math.random() * 100,
        width: 15 + Math.random() * 25,
        opacity: 0.08 + Math.random() * 0.08,
        life: 0,
        maxLife: 6000 + Math.random() * 4000,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0005 + Math.random() * 0.001
    };
}

function updateLightRayParticle(p, deltaTime) {
    // Gentle swaying motion
    p.phase += p.speed * deltaTime;
    p.angleOffset = Math.sin(p.phase) * 0.05;

    // Pulsing opacity
    const lifeRatio = p.life / p.maxLife;
    if (lifeRatio < 0.3) {
        p.currentOpacity = p.opacity * (lifeRatio / 0.3);
    } else if (lifeRatio > 0.7) {
        p.currentOpacity = p.opacity * ((1 - lifeRatio) / 0.3);
    } else {
        p.currentOpacity = p.opacity * (1 + Math.sin(p.phase * 2) * 0.3);
    }
}

function drawLightRayParticle(ctx, p, palette) {
    const currentAngle = p.angle + p.angleOffset;
    const endX = p.x + Math.cos(currentAngle) * p.length;
    const endY = p.y + Math.sin(currentAngle) * p.length;

    const gradient = ctx.createLinearGradient(p.x, p.y, endX, endY);

    // Use sunset colors from palette
    const rayColor = palette.highlightColor || 'rgba(240, 160, 100, 0.35)';
    const alpha = p.currentOpacity || p.opacity;

    gradient.addColorStop(0, setRGBAAlpha(rayColor, alpha * 0.3));
    gradient.addColorStop(0.5, setRGBAAlpha(rayColor, alpha));
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(currentAngle);

    // Draw ray as elongated oval
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(p.length / 2, 0, p.length / 2, p.width / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ============================================================
// NIGHT - FIREFLIES
// ============================================================

function spawnFireflyParticle() {
    // Spawn near trees/land area (upper portion of screen)
    return {
        type: 'firefly',
        x: Math.random() * CONFIG.canvas.width,
        y: 30 + Math.random() * (CONFIG.waterLine - 60),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1 + Math.random() * 1.5,
        color: Math.random() > 0.7 ? 'rgba(150, 255, 150, ' : 'rgba(255, 255, 150, ',
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: 0.02 + Math.random() * 0.03,
        life: 0,
        maxLife: 5000 + Math.random() * 5000,
        // Random flight pattern
        patternPhase: Math.random() * Math.PI * 2,
        patternSpeed: 0.01 + Math.random() * 0.02
    };
}

function updateFireflyParticle(p, deltaTime) {
    // Organic, wavy movement pattern
    p.patternPhase += p.patternSpeed * deltaTime / 16;

    const patternX = Math.sin(p.patternPhase) * 0.5;
    const patternY = Math.cos(p.patternPhase * 1.3) * 0.5;

    p.x += (p.vx + patternX) * deltaTime / 16;
    p.y += (p.vy + patternY) * deltaTime / 16;

    // Bounce off boundaries
    if (p.x < 0 || p.x > CONFIG.canvas.width) p.vx *= -1;
    if (p.y < 20 || p.y > CONFIG.waterLine - 10) p.vy *= -1;

    // Keep within bounds
    p.x = Math.max(0, Math.min(CONFIG.canvas.width, p.x));
    p.y = Math.max(20, Math.min(CONFIG.waterLine - 10, p.y));

    // Pulsing glow
    p.glowPhase += p.glowSpeed * deltaTime / 16;
    p.currentGlow = 0.3 + Math.sin(p.glowPhase) * 0.7;

    // Fade out at end of life
    const lifeRatio = p.life / p.maxLife;
    if (lifeRatio > 0.8) {
        p.currentGlow *= ((1 - lifeRatio) / 0.2);
    }
}

function drawFireflyParticle(ctx, p) {
    const alpha = p.currentGlow;

    // Draw glow
    const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
    glowGradient.addColorStop(0, p.color + `${alpha})`);
    glowGradient.addColorStop(0.5, p.color + `${alpha * 0.3})`);
    glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw bright core
    ctx.fillStyle = p.color + `${Math.min(1, alpha * 1.5)})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================================
// PARTICLE SPAWNING LOGIC
// ============================================================

function spawnParticlesForTime(timeOfDay) {
    switch(timeOfDay) {
        case 'dawn':
            // Spawn fog particles
            const fogCount = AMBIENT_EFFECTS.particles.filter(p => p.type === 'fog').length;
            if (fogCount < AMBIENT_EFFECTS.maxParticles.fog && Math.random() < 0.15) {
                AMBIENT_EFFECTS.particles.push(spawnFogParticle());
            }
            break;

        case 'dusk':
            // Spawn light rays (fewer, more dramatic)
            const rayCount = AMBIENT_EFFECTS.particles.filter(p => p.type === 'lightRay').length;
            if (rayCount < AMBIENT_EFFECTS.maxParticles.lightRays && Math.random() < 0.08) {
                AMBIENT_EFFECTS.particles.push(spawnLightRayParticle());
            }
            break;

        case 'night':
            // Spawn fireflies
            const fireflyCount = AMBIENT_EFFECTS.particles.filter(p => p.type === 'firefly').length;
            if (fireflyCount < AMBIENT_EFFECTS.maxParticles.fireflies && Math.random() < 0.12) {
                AMBIENT_EFFECTS.particles.push(spawnFireflyParticle());
            }
            break;

        case 'day':
            // No ambient particles during day (clear, bright)
            break;
    }
}

// Helper function to clear particles when time changes
function clearAmbientParticles() {
    AMBIENT_EFFECTS.particles = [];
}

// Optional: Clear only specific particle types
function clearParticlesByType(type) {
    AMBIENT_EFFECTS.particles = AMBIENT_EFFECTS.particles.filter(p => p.type !== type);
}
