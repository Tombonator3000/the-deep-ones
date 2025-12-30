// ============================================================
// WATER EFFECTS SYSTEM
// ============================================================
// Comprehensive water rendering inspired by Cast 'n' Chill
// Features:
// - Enhanced reflections (sky, celestials, landscape)
// - Advanced ripple system (multiple rings, fade-out)
// - Weather-responsive water (calm vs rough)
// - Time-of-day integration with palettes
// ============================================================

const WaterEffects = {
    // Settings
    settings: {
        enableReflections: true,
        enableRipples: true,
        enableShimmer: true,
        reflectionDetail: 'high', // 'low', 'medium', 'high'
        rippleQuality: 'high'      // 'low', 'medium', 'high'
    },

    // Ripple tracking for dynamic ripples (e.g., fish jumping, casting)
    activeRipples: [],

    // Add a dynamic ripple at specific position
    addRipple(x, y, intensity = 1.0) {
        this.activeRipples.push({
            x,
            y,
            age: 0,
            maxAge: 120 + intensity * 60, // Frames to live
            intensity,
            maxRadius: 40 + intensity * 30
        });

        // Limit active ripples for performance
        if (this.activeRipples.length > 20) {
            this.activeRipples.shift();
        }
    },

    // Update ripple ages and remove dead ones
    updateRipples() {
        this.activeRipples = this.activeRipples.filter(ripple => {
            ripple.age++;
            return ripple.age < ripple.maxAge;
        });
    },

    // ============================================================
    // MAIN DRAW FUNCTION
    // ============================================================
    draw(ctx, gameState, cameraX, panOffset = 0) {
        if (!gameState) return;

        // Update dynamic ripples
        this.updateRipples();

        // Draw in layers
        if (this.settings.enableReflections) {
            this.drawReflections(ctx, gameState, cameraX, panOffset);
        }

        if (this.settings.enableShimmer) {
            this.drawWaterShimmer(ctx, gameState, cameraX, panOffset);
        }

        if (this.settings.enableRipples) {
            this.drawRipples(ctx, gameState, cameraX, panOffset);
        }

        // Weather-specific water effects
        this.drawWeatherWater(ctx, gameState, cameraX, panOffset);
    },

    // ============================================================
    // REFLECTIONS
    // ============================================================
    drawReflections(ctx, gameState, cameraX, panOffset) {
        const palette = typeof getTimePalette === 'function' ? getTimePalette() : null;
        if (!palette) return;

        const waterY = CONFIG.waterLine;
        const reflectionDepth = 60; // How far down reflections go

        ctx.save();

        // 1. SKY REFLECTION (base layer)
        this.drawSkyReflection(ctx, gameState, palette, waterY, reflectionDepth, panOffset);

        // 2. CELESTIAL REFLECTIONS (sun/moon)
        this.drawCelestialReflection(ctx, gameState, palette, waterY, cameraX, panOffset);

        // 3. LANDSCAPE REFLECTION (distant mountains/features)
        this.drawLandscapeReflection(ctx, gameState, palette, waterY, reflectionDepth, cameraX, panOffset);

        // 4. BOAT REFLECTION
        this.drawBoatReflection(ctx, gameState, waterY, cameraX, panOffset);

        ctx.restore();
    },

    // Sky reflection in water
    drawSkyReflection(ctx, gameState, palette, waterY, depth, panOffset) {
        // Create gradient from water surface down
        const gradient = ctx.createLinearGradient(0, waterY, 0, waterY + depth);

        // Use sky colors from palette, but darker and more muted
        const skyColor = palette.sky || '#4a6a8a';
        const horizonColor = palette.horizon || '#8a9aaa';

        // Add distortion based on weather
        const distortion = this.getWaterDistortion(gameState);

        gradient.addColorStop(0, this.adjustColorAlpha(skyColor, 0.2 * distortion));
        gradient.addColorStop(0.5, this.adjustColorAlpha(horizonColor, 0.15 * distortion));
        gradient.addColorStop(1, this.adjustColorAlpha(skyColor, 0.05));

        // Draw with wave distortion
        ctx.fillStyle = gradient;
        for (let y = 0; y < depth; y += 2) {
            const waveOffset = Math.sin((y * 0.1 + gameState.time * 0.002) * distortion) * 3;
            ctx.fillRect(waveOffset - panOffset * 0.1, waterY + y - panOffset, CONFIG.canvas.width, 2);
        }
    },

    // Celestial (sun/moon) reflection
    drawCelestialReflection(ctx, gameState, palette, waterY, cameraX, panOffset) {
        let celestialX, celestialColor, celestialIntensity;

        // Get sun or moon position
        if (gameState.timeOfDay === 'day' || gameState.timeOfDay === 'dawn' || gameState.timeOfDay === 'dusk') {
            if (typeof getSunPosition === 'function') {
                const sunPos = getSunPosition();
                if (sunPos) {
                    celestialX = sunPos.x - cameraX * 0.1;
                    celestialColor = gameState.timeOfDay === 'dusk'
                        ? 'rgba(255, 150, 80, '
                        : gameState.timeOfDay === 'dawn'
                        ? 'rgba(255, 200, 150, '
                        : 'rgba(255, 255, 200, ';
                    celestialIntensity = gameState.timeOfDay === 'day' ? 0.3 : 0.25;
                }
            }
        } else if (gameState.timeOfDay === 'night') {
            if (typeof getMoonPosition === 'function') {
                const moonPos = getMoonPosition();
                if (moonPos) {
                    celestialX = moonPos.x - cameraX * 0.05;
                    celestialColor = 'rgba(200, 210, 230, ';
                    celestialIntensity = 0.25;
                }
            }
        }

        if (!celestialColor || celestialX === undefined) return;

        const distortion = this.getWaterDistortion(gameState);

        // Vertical light path on water (like Cast 'n' Chill's stunning water trails)
        const pathSegments = this.settings.reflectionDetail === 'high' ? 12 :
                             this.settings.reflectionDetail === 'medium' ? 8 : 5;

        for (let i = 0; i < pathSegments; i++) {
            const segmentY = waterY + 8 + i * 5 - panOffset;
            const baseWidth = 10 + Math.sin(gameState.time * 0.003 + i * 0.7) * 6;
            const width = baseWidth * distortion;
            const xOffset = Math.sin(gameState.time * 0.002 + i * 0.5) * 4 * distortion;
            const alpha = (celestialIntensity - i * 0.02) * distortion;

            if (alpha > 0) {
                ctx.fillStyle = celestialColor + alpha + ')';
                ctx.beginPath();
                ctx.ellipse(
                    celestialX + xOffset,
                    segmentY,
                    width,
                    2 + Math.sin(gameState.time * 0.01 + i) * 0.8,
                    0, 0, Math.PI * 2
                );
                ctx.fill();
            }
        }

        // Add core bright spot at top of reflection
        ctx.fillStyle = celestialColor + (celestialIntensity * 0.8) + ')';
        ctx.beginPath();
        ctx.ellipse(celestialX, waterY + 8 - panOffset, 15, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    },

    // Landscape features reflected in water
    drawLandscapeReflection(ctx, gameState, palette, waterY, depth, cameraX, panOffset) {
        // Simplified landscape reflection (mountains, trees, etc.)
        // This creates atmospheric depth without being too detailed

        ctx.globalAlpha = 0.08;
        const distortion = this.getWaterDistortion(gameState);

        // Draw simplified mountain reflection
        if (palette.mountains && palette.mountains.length > 0) {
            ctx.fillStyle = palette.mountains[0];

            for (let x = 0; x < CONFIG.canvas.width; x += 4) {
                const mountainHeight = Math.sin((x + cameraX * 0.3) * 0.01) * 15 + 10;
                const waveY = Math.sin((x * 0.05 + gameState.time * 0.002) * distortion) * 2;

                ctx.fillRect(
                    x,
                    waterY + 10 + waveY - panOffset,
                    4,
                    mountainHeight
                );
            }
        }

        ctx.globalAlpha = 1.0;
    },

    // Boat reflection
    drawBoatReflection(ctx, gameState, waterY, cameraX, panOffset) {
        if (typeof GameSettings !== 'undefined' && !GameSettings.graphics.weatherEffects) return;

        const boatX = gameState.boatX - cameraX;
        const reflectionY = waterY + 20 - panOffset;
        const distortion = this.getWaterDistortion(gameState);

        ctx.save();
        ctx.globalAlpha = 0.12 * distortion;
        ctx.translate(0, reflectionY * 2);
        ctx.scale(1, -1);

        // Draw inverted boat shape (simplified)
        ctx.fillStyle = '#2a2520';
        ctx.beginPath();
        ctx.moveTo(boatX - 35, waterY - 5);
        ctx.lineTo(boatX - 30, waterY - 25);
        ctx.lineTo(boatX + 30, waterY - 25);
        ctx.lineTo(boatX + 35, waterY - 5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Wavy distortion lines over reflection
        for (let i = 0; i < 5; i++) {
            const waveY = reflectionY + i * 6;
            const waveOffset = Math.sin(gameState.time * 0.003 + i * 0.5) * 3 * distortion;
            const alpha = (0.05 - i * 0.01) * distortion;

            if (alpha > 0) {
                ctx.strokeStyle = `rgba(100, 140, 160, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(boatX - 40 + waveOffset, waveY);
                ctx.lineTo(boatX + 40 + waveOffset, waveY);
                ctx.stroke();
            }
        }
    },

    // ============================================================
    // WATER SHIMMER (sparkles and highlights)
    // ============================================================
    drawWaterShimmer(ctx, gameState, cameraX, panOffset) {
        const sparkleCount = this.settings.reflectionDetail === 'high' ? 15 :
                            this.settings.reflectionDetail === 'medium' ? 10 : 5;
        const distortion = this.getWaterDistortion(gameState);

        // Random sparkles on water surface
        for (let i = 0; i < sparkleCount; i++) {
            const sparklePhase = (gameState.time * 0.001 + i * 0.4) % 2;

            // Only visible briefly
            if (sparklePhase < 0.3) {
                const sparkleX = ((i * 50 + gameState.time * 0.01) % CONFIG.canvas.width);
                const sparkleY = CONFIG.waterLine + 5 + Math.sin(i * 2.3) * 12 - panOffset;
                const sparkleAlpha = (0.3 - sparklePhase) * 0.6 * distortion;

                if (sparkleAlpha > 0) {
                    // Draw star-like sparkle
                    ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
                    ctx.beginPath();
                    ctx.arc(sparkleX, sparkleY, 1.5, 0, Math.PI * 2);
                    ctx.fill();

                    // Add cross-highlight for extra sparkle
                    ctx.strokeStyle = `rgba(255, 255, 255, ${sparkleAlpha * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(sparkleX - 2, sparkleY);
                    ctx.lineTo(sparkleX + 2, sparkleY);
                    ctx.moveTo(sparkleX, sparkleY - 2);
                    ctx.lineTo(sparkleX, sparkleY + 2);
                    ctx.stroke();
                }
            }
        }
    },

    // ============================================================
    // RIPPLES
    // ============================================================
    drawRipples(ctx, gameState, cameraX, panOffset) {
        // 1. Ambient ripples around boat
        this.drawBoatRipples(ctx, gameState, cameraX, panOffset);

        // 2. Dynamic ripples (from fish, casting, etc.)
        this.drawDynamicRipples(ctx, gameState, cameraX, panOffset);
    },

    // Ambient ripples around boat
    drawBoatRipples(ctx, gameState, cameraX, panOffset) {
        const boatX = gameState.boatX - cameraX;
        const waterY = CONFIG.waterLine + 8 - panOffset;
        const rippleCount = this.settings.rippleQuality === 'high' ? 4 :
                           this.settings.rippleQuality === 'medium' ? 3 : 2;

        for (let i = 0; i < rippleCount; i++) {
            const ripplePhase = ((gameState.time * 0.002 + i * 0.25) % 1);
            const size = 10 + ripplePhase * 25;
            const alpha = (1 - ripplePhase) * 0.2;

            if (alpha > 0) {
                ctx.strokeStyle = `rgba(180, 200, 220, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(boatX, waterY, size, size * 0.3, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    },

    // Dynamic ripples from events
    drawDynamicRipples(ctx, gameState, cameraX, panOffset) {
        const waterY = CONFIG.waterLine - panOffset;

        this.activeRipples.forEach(ripple => {
            const progress = ripple.age / ripple.maxAge;
            const size = ripple.maxRadius * progress;
            const alpha = (1 - progress) * 0.3 * ripple.intensity;

            if (alpha > 0) {
                const rippleX = ripple.x - cameraX;

                // Draw multiple concentric rings for each ripple
                for (let ring = 0; ring < 3; ring++) {
                    const ringProgress = (progress - ring * 0.15);
                    if (ringProgress > 0 && ringProgress < 1) {
                        const ringSize = size * (1 - ring * 0.2);
                        const ringAlpha = alpha * (1 - ring * 0.3);

                        ctx.strokeStyle = `rgba(180, 200, 220, ${ringAlpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.ellipse(rippleX, waterY + 5, ringSize, ringSize * 0.3, 0, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            }
        });
    },

    // ============================================================
    // WEATHER-SPECIFIC WATER EFFECTS
    // ============================================================
    drawWeatherWater(ctx, gameState, cameraX, panOffset) {
        if (!gameState.weather) return;

        const weatherType = gameState.weather.current;

        // Rain ripples on water
        if (weatherType === 'rain' || weatherType === 'storm') {
            this.drawRainRipples(ctx, gameState, panOffset);
        }

        // Fog interaction with water
        if (weatherType === 'fog') {
            this.drawFogWater(ctx, gameState, panOffset);
        }

        // Storm waves
        if (weatherType === 'storm') {
            this.drawStormWaves(ctx, gameState, panOffset);
        }
    },

    // Rain creating ripples on water surface
    drawRainRipples(ctx, gameState, panOffset) {
        const rippleCount = gameState.weather.current === 'storm' ? 25 : 15;

        for (let i = 0; i < rippleCount; i++) {
            const rippleX = (i * 73 + gameState.time * 0.5) % CONFIG.canvas.width;
            const ripplePhase = (gameState.time * 0.01 + i * 0.5) % 1;
            const size = ripplePhase * 8;
            const alpha = (1 - ripplePhase) * 0.3;

            if (alpha > 0) {
                ctx.strokeStyle = `rgba(200, 220, 255, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(rippleX, CONFIG.waterLine + 5 - panOffset, size, size * 0.3, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    },

    // Fog merging with water
    drawFogWater(ctx, gameState, panOffset) {
        const waterY = CONFIG.waterLine - panOffset;

        ctx.save();
        ctx.globalAlpha = 0.2;

        const gradient = ctx.createLinearGradient(0, waterY - 30, 0, waterY + 20);
        gradient.addColorStop(0, 'rgba(180, 190, 200, 0.3)');
        gradient.addColorStop(0.5, 'rgba(160, 170, 180, 0.2)');
        gradient.addColorStop(1, 'rgba(140, 150, 160, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, waterY - 30, CONFIG.canvas.width, 50);

        ctx.restore();
    },

    // Rough waves during storm
    drawStormWaves(ctx, gameState, panOffset) {
        const waterY = CONFIG.waterLine - panOffset;

        ctx.save();
        ctx.strokeStyle = 'rgba(120, 140, 160, 0.4)';
        ctx.lineWidth = 2;

        // Large rolling waves
        ctx.beginPath();
        for (let x = 0; x < CONFIG.canvas.width; x += 3) {
            const waveHeight = Math.sin(x * 0.02 + gameState.time * 0.005) * 5 +
                              Math.sin(x * 0.03 + gameState.time * 0.003) * 3;

            if (x === 0) {
                ctx.moveTo(x, waterY + waveHeight);
            } else {
                ctx.lineTo(x, waterY + waveHeight);
            }
        }
        ctx.stroke();

        ctx.restore();
    },

    // ============================================================
    // UTILITY FUNCTIONS
    // ============================================================

    // Get water distortion factor based on weather
    getWaterDistortion(gameState) {
        if (!gameState.weather) return 1.0;

        switch (gameState.weather.current) {
            case 'storm': return 2.5;
            case 'rain': return 1.8;
            case 'fog': return 0.6;
            case 'cloudy': return 1.0;
            case 'clear':
            default: return 1.0;
        }
    },

    // Adjust color with alpha
    adjustColorAlpha(color, alpha) {
        // Simple hex to rgba conversion with alpha
        if (color.startsWith('#')) {
            const r = parseInt(color.substr(1, 2), 16);
            const g = parseInt(color.substr(3, 2), 16);
            const b = parseInt(color.substr(5, 2), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return color;
    }
};

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WaterEffects;
}
