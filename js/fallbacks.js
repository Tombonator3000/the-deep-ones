// ============================================================
// THE DEEP ONES - PROCEDURAL FALLBACKS
// ============================================================

const FALLBACKS = {
    'sky-gradient': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        // Create gradient from top to waterline
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.waterLine);
        palette.sky.forEach((color, i) => {
            gradient.addColorStop(palette.skyStops[i], color);
        });
        ctx.fillStyle = gradient;
        // Fill entire sky area - ensure complete coverage from top to waterline
        // Extend slightly beyond to ensure no gaps at edges
        ctx.fillRect(-1, -1, w + 2, CONFIG.waterLine + 2);
    },

    'stars': (ctx, offset, y, w, h, layer) => {
        if (game.timeOfDay !== 'night' && game.timeOfDay !== 'dusk') return;
        const intensity = game.timeOfDay === 'night' ? 1 : 0.4;
        for (let i = 0; i < 100; i++) {
            const x = (i * 73 + offset * 0.5 + game.time * 0.01) % w;
            const sy = (i * 47) % (CONFIG.waterLine - 50);
            const twinkle = Math.sin(game.time * 0.03 + i * 0.5) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(255, 255, 240, ${intensity * twinkle * 0.8})`;
            ctx.fillRect(x, sy, (i % 5 === 0) ? 2 : 1, (i % 5 === 0) ? 2 : 1);
        }
    },

    'sun': (ctx, offset, y, w, h, layer) => {
        // Bruk dynamisk celestial orbit system
        const sunPos = getSunPosition();
        if (!sunPos) return; // Sol er under horisonten

        const x = sunPos.x - offset * 0.1; // Minimal parallax for solen
        const sunY = sunPos.y;

        // Hent dynamisk farge basert på høyde
        const sunColors = getSunColor(sunPos.heightRatio);

        // Ytre glow - større når solen er lavt (atmosfærisk spredning)
        const glowSize = 80 + (1 - sunPos.heightRatio) * 60;
        const outerGlow = ctx.createRadialGradient(x, sunY, 0, x, sunY, glowSize);

        // Parse glow-farge for gradient
        if (sunPos.heightRatio < 0.3) {
            // Ved horisonten - dramatisk oransje/rød glow
            outerGlow.addColorStop(0, 'rgba(255, 150, 80, 0.8)');
            outerGlow.addColorStop(0.3, 'rgba(255, 100, 50, 0.4)');
            outerGlow.addColorStop(0.6, 'rgba(255, 80, 40, 0.15)');
            outerGlow.addColorStop(1, 'transparent');
        } else if (sunPos.heightRatio < 0.7) {
            // Middag - varm gul glow
            outerGlow.addColorStop(0, 'rgba(255, 240, 150, 0.6)');
            outerGlow.addColorStop(0.4, 'rgba(255, 220, 100, 0.25)');
            outerGlow.addColorStop(1, 'transparent');
        } else {
            // Senit - lys og mild glow
            outerGlow.addColorStop(0, 'rgba(255, 255, 200, 0.5)');
            outerGlow.addColorStop(0.5, 'rgba(255, 255, 180, 0.15)');
            outerGlow.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(x, sunY, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Indre glow
        const innerGlow = ctx.createRadialGradient(x, sunY, 0, x, sunY, sunColors.size + 20);
        if (sunPos.heightRatio < 0.3) {
            innerGlow.addColorStop(0, '#fff8e0');
            innerGlow.addColorStop(0.5, '#ffb060');
            innerGlow.addColorStop(1, 'rgba(255, 120, 60, 0.3)');
        } else {
            innerGlow.addColorStop(0, '#fffff0');
            innerGlow.addColorStop(0.5, '#ffffa0');
            innerGlow.addColorStop(1, 'rgba(255, 255, 150, 0.2)');
        }
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(x, sunY, sunColors.size + 15, 0, Math.PI * 2);
        ctx.fill();

        // Solkjernen
        const coreGradient = ctx.createRadialGradient(x, sunY, 0, x, sunY, sunColors.size);
        coreGradient.addColorStop(0, '#ffffff');
        coreGradient.addColorStop(0.3, sunColors.core);
        coreGradient.addColorStop(1, sunPos.heightRatio < 0.3 ? '#ff8040' : '#ffdd80');

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(x, sunY, sunColors.size, 0, Math.PI * 2);
        ctx.fill();

        // Solstråler ved lav horisont (soloppgang/nedgang)
        if (sunPos.heightRatio < 0.4) {
            const rayIntensity = (0.4 - sunPos.heightRatio) / 0.4;
            ctx.save();
            ctx.translate(x, sunY);

            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2 + game.time * 0.0002;
                const rayLength = 60 + Math.sin(game.time * 0.003 + i) * 20;

                ctx.strokeStyle = `rgba(255, 180, 100, ${rayIntensity * 0.3})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(
                    Math.cos(angle) * (sunColors.size + 10),
                    Math.sin(angle) * (sunColors.size + 10)
                );
                ctx.lineTo(
                    Math.cos(angle) * (sunColors.size + rayLength),
                    Math.sin(angle) * (sunColors.size + rayLength)
                );
                ctx.stroke();
            }
            ctx.restore();
        }
    },

    'moon': (ctx, offset, y, w, h, layer) => {
        // Bruk dynamisk celestial orbit system
        const moonPos = getMoonPosition();
        if (!moonPos) return; // Måne er under horisonten (dagtid)

        const x = moonPos.x - offset * 0.05; // Minimal parallax for månen
        const moonY = moonPos.y;

        // Hent dynamisk farge basert på høyde
        const moonColors = getMoonColor(moonPos.heightRatio);

        // Ytre glow - subtil og kald
        const glowSize = 50 + (1 - moonPos.heightRatio) * 30;
        const glowAlpha = 0.1 + moonPos.heightRatio * 0.1;

        const outerGlow = ctx.createRadialGradient(x, moonY, 0, x, moonY, glowSize);
        outerGlow.addColorStop(0, `rgba(200, 210, 230, ${glowAlpha * 2})`);
        outerGlow.addColorStop(0.5, `rgba(180, 190, 210, ${glowAlpha})`);
        outerGlow.addColorStop(1, 'transparent');

        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(x, moonY, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Månens overflate med gradient
        const moonSize = moonColors.size;
        const moonGradient = ctx.createRadialGradient(
            x - moonSize * 0.3, moonY - moonSize * 0.3, 0,
            x, moonY, moonSize
        );
        moonGradient.addColorStop(0, '#f0f4f8');
        moonGradient.addColorStop(0.7, '#e0e8f0');
        moonGradient.addColorStop(1, '#c8d0d8');

        ctx.fillStyle = moonGradient;
        ctx.beginPath();
        ctx.arc(x, moonY, moonSize, 0, Math.PI * 2);
        ctx.fill();

        // Månekratere (subtile)
        ctx.fillStyle = 'rgba(180, 190, 200, 0.4)';
        ctx.beginPath();
        ctx.arc(x - moonSize * 0.35, y - moonSize * 0.2, moonSize * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + moonSize * 0.4, moonY + moonSize * 0.3, moonSize * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x - moonSize * 0.1, moonY + moonSize * 0.35, moonSize * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + moonSize * 0.2, moonY - moonSize * 0.25, moonSize * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Månelys-refleksjon på horisonten når månen er lav
        if (moonPos.heightRatio < 0.4) {
            const reflectionIntensity = (0.4 - moonPos.heightRatio) / 0.4;
            const reflectY = CONFIG.waterLine - 10;

            // Vertikal lyssøyle fra månen til horisonten
            const moonBeam = ctx.createLinearGradient(x, moonY + moonSize, x, reflectY);
            moonBeam.addColorStop(0, `rgba(200, 210, 230, ${reflectionIntensity * 0.1})`);
            moonBeam.addColorStop(1, `rgba(180, 200, 220, ${reflectionIntensity * 0.05})`);

            ctx.fillStyle = moonBeam;
            ctx.beginPath();
            ctx.moveTo(x - 15, moonY + moonSize);
            ctx.lineTo(x + 15, moonY + moonSize);
            ctx.lineTo(x + 30, reflectY);
            ctx.lineTo(x - 30, reflectY);
            ctx.closePath();
            ctx.fill();
        }

        // Horror-element: Ved lav sanity, månens "ansikt"
        if (game.sanity < 25) {
            const alpha = (25 - game.sanity) / 25;

            // Uhyggelige øyne
            ctx.fillStyle = `rgba(30, 20, 40, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(x - moonSize * 0.3, moonY - moonSize * 0.1, moonSize * 0.12, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + moonSize * 0.3, moonY - moonSize * 0.1, moonSize * 0.12, 0, Math.PI * 2);
            ctx.fill();

            // Røde pupiller
            ctx.fillStyle = `rgba(150, 50, 50, ${alpha * 0.7})`;
            ctx.beginPath();
            ctx.arc(x - moonSize * 0.3, moonY - moonSize * 0.1, moonSize * 0.05, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + moonSize * 0.3, moonY - moonSize * 0.1, moonSize * 0.05, 0, Math.PI * 2);
            ctx.fill();

            // Uhyggelig munn
            ctx.strokeStyle = `rgba(30, 20, 40, ${alpha * 0.6})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, moonY + moonSize * 0.2, moonSize * 0.25, 0.2 * Math.PI, 0.8 * Math.PI);
            ctx.stroke();
        }
    },

    // Clouds scaled for 480x270 resolution
    'clouds-far': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.fillStyle = palette.clouds;
        for (let i = 0; i < 4; i++) {
            const x = ((i * 120 - offset) % (w + 100)) - 50;
            drawCloud(ctx, x, y + Math.sin(i * 2) * 6, 35 + i * 8, 10);
        }
    },

    'clouds-near': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.fillStyle = palette.clouds;
        for (let i = 0; i < 3; i++) {
            const x = ((i * 150 - offset * 1.5) % (w + 100)) - 50;
            drawCloud(ctx, x, y + Math.cos(i * 1.5) * 5, 45 + i * 6, 12);
        }
    },

    'clouds': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.fillStyle = palette.clouds;
        for (let i = 0; i < 3; i++) {
            const x = ((i * 140 - offset) % (w + 100)) - 50;
            drawCloud(ctx, x, y + Math.sin(i) * 8, 40, 12);
        }
    },

    // Mountains scaled for 480x270 resolution (scaled from original 1000x650)
    'mountains-far': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();

        // Draw mountain shape
        ctx.fillStyle = palette.mountains[0];
        ctx.beginPath();
        ctx.moveTo(-offset % 200 - 200, CONFIG.waterLine);
        for (let x = -200; x < w + 200; x += 80) {
            const px = x - (offset % 200);
            const py = y + Math.sin(x * 0.01) * 15 + 20;
            ctx.lineTo(px, py);
        }
        ctx.lineTo(w + 50, CONFIG.waterLine);
        ctx.closePath();
        ctx.fill();

        // ATMOSPHERIC PERSPECTIVE: Add haze overlay on distant mountains
        if (palette.fogColor) {
            ctx.fillStyle = palette.fogColor;
            ctx.beginPath();
            ctx.moveTo(-offset % 200 - 200, CONFIG.waterLine);
            for (let x = -200; x < w + 200; x += 80) {
                const px = x - (offset % 200);
                const py = y + Math.sin(x * 0.01) * 15 + 20;
                ctx.lineTo(px, py);
            }
            ctx.lineTo(w + 50, CONFIG.waterLine);
            ctx.closePath();
            ctx.fill();
        }
    },

    'mountains-mid': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();

        // Draw mountain shape with more varied peaks
        ctx.fillStyle = palette.mountains[1];
        ctx.beginPath();
        ctx.moveTo(-offset % 150 - 150, CONFIG.waterLine);
        for (let x = -150; x < w + 150; x += 60) {
            const px = x - (offset % 150);
            // Add layered sine waves for more natural mountain shapes
            const py = y + Math.sin(x * 0.015 + 1) * 12 + Math.cos(x * 0.025) * 6 + 15;
            ctx.lineTo(px, py);
        }
        ctx.lineTo(w + 50, CONFIG.waterLine);
        ctx.closePath();
        ctx.fill();

        // ATMOSPHERIC PERSPECTIVE: Lighter haze for mid-distance
        if (palette.fogColor) {
            // Extract rgba values and reduce alpha by half for mid-distance
            const fogMatch = palette.fogColor.match(/[\d.]+/g);
            if (fogMatch) {
                const [r, g, b, a] = fogMatch.map(Number);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.5})`;
                ctx.beginPath();
                ctx.moveTo(-offset % 150 - 150, CONFIG.waterLine);
                for (let x = -150; x < w + 150; x += 60) {
                    const px = x - (offset % 150);
                    const py = y + Math.sin(x * 0.015 + 1) * 12 + Math.cos(x * 0.025) * 6 + 15;
                    ctx.lineTo(px, py);
                }
                ctx.lineTo(w + 50, CONFIG.waterLine);
                ctx.closePath();
                ctx.fill();
            }
        }
    },

    'mountains-near': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();

        // Draw mountain with complex, layered details
        ctx.fillStyle = palette.mountains[2] || palette.mountains[1];
        ctx.beginPath();
        ctx.moveTo(-offset % 120 - 120, CONFIG.waterLine);
        for (let x = -120; x < w + 120; x += 50) {
            const px = x - (offset % 120);
            // Triple-layered sine for complex, natural peaks
            const py = y + Math.sin(x * 0.02 + 2) * 10 + Math.cos(x * 0.035) * 5 + Math.sin(x * 0.008) * 3 + 12;
            ctx.lineTo(px, py);
        }
        ctx.lineTo(w + 50, CONFIG.waterLine);
        ctx.closePath();
        ctx.fill();

        // Add subtle shadow details on near mountains for depth
        ctx.fillStyle = palette.shadowColor;
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.moveTo(-offset % 120 - 120, CONFIG.waterLine);
        for (let x = -120; x < w + 120; x += 50) {
            const px = x - (offset % 120);
            const py = y + Math.sin(x * 0.02 + 2) * 10 + Math.cos(x * 0.035) * 5 + Math.sin(x * 0.008) * 3 + 12;
            ctx.lineTo(px, py);
        }
        ctx.lineTo(w + 50, CONFIG.waterLine);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;
    },

    // Trees scaled for 480x270 resolution
    'trees-far': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();

        // Draw trees with varying heights for depth
        for (let i = 0; i < 20; i++) {
            const x = ((i * 40 - offset) % (w + 100)) - 50;
            const heightVariation = 20 + (i % 3) * 5 + Math.sin(i * 1.3) * 3;
            drawTree(ctx, x, y + 25, heightVariation, palette.trees[0]);
        }

        // ATMOSPHERIC PERSPECTIVE: Add fog overlay on distant trees
        if (palette.fogColor) {
            const fogMatch = palette.fogColor.match(/[\d.]+/g);
            if (fogMatch) {
                const [r, g, b, a] = fogMatch.map(Number);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.7})`;
                for (let i = 0; i < 20; i++) {
                    const x = ((i * 40 - offset) % (w + 100)) - 50;
                    const heightVariation = 20 + (i % 3) * 5 + Math.sin(i * 1.3) * 3;
                    // Draw simplified tree silhouette for fog overlay
                    ctx.fillRect(x - 3, y + 25 - heightVariation, 6, heightVariation);
                }
            }
        }
    },

    'trees-near': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();

        // Draw trees with more variation and overlapping
        for (let i = 0; i < 15; i++) {
            const x = ((i * 55 - offset) % (w + 100)) - 50;
            const heightVariation = 28 + (i % 4) * 4 + Math.sin(i * 0.8) * 4;

            // Add subtle shadow behind each tree for depth
            ctx.fillStyle = palette.shadowColor;
            ctx.globalAlpha = 0.2;
            ctx.fillRect(x + 1, y + 20 - heightVariation * 0.3, 3, heightVariation * 0.3);
            ctx.globalAlpha = 1.0;

            // Draw main tree
            drawTree(ctx, x, y + 20, heightVariation, palette.trees[1]);

            // Add highlight on some trees for depth variation
            if (i % 3 === 0 && palette.highlightColor) {
                ctx.fillStyle = palette.highlightColor;
                ctx.globalAlpha = 0.15;
                // Small highlight on tree top
                ctx.beginPath();
                ctx.moveTo(x, y + 20 - heightVariation);
                ctx.lineTo(x - 4, y + 20 - heightVariation * 0.3);
                ctx.lineTo(x + 4, y + 20 - heightVariation * 0.3);
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }
    },

    // Lighthouse scaled for 480x270 resolution - MUCH LARGER AND BRIGHTER
    'lighthouse': (ctx, offset, y, w, h, layer) => {
        // Use layer.worldX for flexibility, fallback to 75
        const worldX = layer.worldX || 75;
        const x = worldX - offset;

        // More generous visibility bounds
        if (x < -60 || x > w + 60) return;

        const palette = getTimePalette();
        const intensity = (Math.sin(game.time * 0.05) + 1) / 2;

        // OUTER GLOW for visibility (drawn first, behind everything)
        const glowRadius = 40 + intensity * 20;
        const outerGlow = ctx.createRadialGradient(x, y - 10, 0, x, y - 10, glowRadius);
        outerGlow.addColorStop(0, `rgba(255, 250, 200, ${0.3 + intensity * 0.2})`);
        outerGlow.addColorStop(0.5, `rgba(255, 200, 100, ${0.15 + intensity * 0.1})`);
        outerGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(x, y - 10, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Base rock - larger and darker for contrast
        ctx.fillStyle = '#1a1510';
        ctx.beginPath();
        ctx.ellipse(x, y + 50, 35, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        // Rock highlight
        ctx.fillStyle = '#3a3530';
        ctx.beginPath();
        ctx.ellipse(x, y + 48, 30, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tower body - MUCH LARGER (was 12px wide, now 24px)
        ctx.fillStyle = '#f0e8e0';  // Bright cream white
        ctx.beginPath();
        ctx.moveTo(x - 12, y + 45);
        ctx.lineTo(x - 8, y - 15);
        ctx.lineTo(x + 8, y - 15);
        ctx.lineTo(x + 12, y + 45);
        ctx.closePath();
        ctx.fill();

        // Tower outline for visibility
        ctx.strokeStyle = '#2a2520';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Red stripes (multiple for classic lighthouse look)
        ctx.fillStyle = '#c04040';
        ctx.fillRect(x - 10, y + 30, 20, 10);
        ctx.fillRect(x - 9, y + 10, 18, 8);
        ctx.fillRect(x - 8, y - 8, 16, 6);

        // Top platform/gallery
        ctx.fillStyle = '#2a2520';
        ctx.fillRect(x - 10, y - 18, 20, 5);

        // Gallery railings
        ctx.strokeStyle = '#1a1510';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 10, y - 18);
        ctx.lineTo(x - 12, y - 25);
        ctx.moveTo(x + 10, y - 18);
        ctx.lineTo(x + 12, y - 25);
        ctx.stroke();

        // Dome/roof
        ctx.fillStyle = '#c04040';
        ctx.beginPath();
        ctx.arc(x, y - 22, 8, Math.PI, 0);
        ctx.fill();

        // Spire
        ctx.fillStyle = '#2a2520';
        ctx.beginPath();
        ctx.moveTo(x, y - 35);
        ctx.lineTo(x - 3, y - 22);
        ctx.lineTo(x + 3, y - 22);
        ctx.closePath();
        ctx.fill();

        // Light chamber (glass)
        ctx.fillStyle = `rgba(255, 250, 200, ${0.6 + intensity * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y - 22, 6, 0, Math.PI * 2);
        ctx.fill();

        // BRIGHT LIGHT BEAM (rotating)
        const beamAngle = game.time * 0.002;
        ctx.save();
        ctx.translate(x, y - 22);
        ctx.rotate(beamAngle);

        // Light beam gradient
        const beamGrad = ctx.createLinearGradient(0, 0, 100, 0);
        beamGrad.addColorStop(0, `rgba(255, 255, 220, ${0.6 + intensity * 0.3})`);
        beamGrad.addColorStop(0.3, `rgba(255, 255, 200, ${0.3 + intensity * 0.2})`);
        beamGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(100, -20);
        ctx.lineTo(100, 20);
        ctx.lineTo(0, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Inner light glow
        const innerGlow = ctx.createRadialGradient(x, y - 22, 0, x, y - 22, 15);
        innerGlow.addColorStop(0, `rgba(255, 255, 255, ${0.8 + intensity * 0.2})`);
        innerGlow.addColorStop(0.5, `rgba(255, 250, 200, ${0.4 + intensity * 0.3})`);
        innerGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(x, y - 22, 15, 0, Math.PI * 2);
        ctx.fill();

        // Debug: draw a bright marker to show lighthouse position
        if (CONFIG.showDebug) {
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(x - 2, y - 40, 4, 4);
        }
    },

    // Reeds scaled for 480x270 resolution
    'reeds-left': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.strokeStyle = palette.trees[1];
        ctx.lineWidth = 1;

        for (let i = 0; i < 15; i++) {
            const x = ((i * 4 - offset * 0.5) % 100);
            const height = 15 + Math.sin(i) * 7;
            const sway = Math.sin(game.time * 0.02 + i * 0.5) * 2;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + sway, y - height/2, x + sway * 1.5, y - height);
            ctx.stroke();
        }
    },

    // FOREGROUND ELEMENTS - Added for enhanced depth perception
    'grass-foreground': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();

        // Draw grass blades close to camera with strong parallax
        for (let i = 0; i < 40; i++) {
            const x = ((i * 12 - offset * 0.8) % (w + 50)) - 25;
            const height = 8 + (i % 3) * 3;
            const sway = Math.sin(game.time * 0.025 + i * 0.7) * 1.5;

            // Draw grass blade
            ctx.strokeStyle = palette.trees[1];
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + sway * 0.5, y - height * 0.5, x + sway, y - height);
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Add highlight on some blades
            if (i % 4 === 0 && palette.highlightColor) {
                ctx.strokeStyle = palette.highlightColor;
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.moveTo(x, y - height * 0.3);
                ctx.lineTo(x + sway * 0.7, y - height * 0.8);
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }
        }
    },

    'rocks-foreground': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();

        // Draw foreground rocks just above waterline
        for (let i = 0; i < 8; i++) {
            const x = ((i * 60 - offset * 0.9) % (w + 80)) - 40;
            const rockW = 8 + (i % 3) * 4;
            const rockH = 4 + (i % 2) * 3;

            // Shadow for rock
            ctx.fillStyle = palette.shadowColor;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.ellipse(x + 2, y + rockH + 1, rockW * 0.6, rockH * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // Rock body
            ctx.fillStyle = palette.mountains[2] || palette.mountains[1];
            ctx.beginPath();
            ctx.ellipse(x, y + rockH * 0.5, rockW, rockH, 0, 0, Math.PI * 2);
            ctx.fill();

            // Rock highlight
            if (palette.highlightColor) {
                ctx.fillStyle = palette.highlightColor;
                ctx.globalAlpha = 0.25;
                ctx.beginPath();
                ctx.ellipse(x - rockW * 0.3, y + rockH * 0.3, rockW * 0.4, rockH * 0.4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }
    },

    // Water surface scaled for 480x270 resolution
    'water-surface': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();

        ctx.strokeStyle = palette.waterHighlight;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < w; x += 3) {
            const ripple = Math.sin((x + offset) * 0.03 + game.time * 0.03) * 1;
            if (x === 0) ctx.moveTo(x, CONFIG.waterLine + ripple);
            else ctx.lineTo(x, CONFIG.waterLine + ripple);
        }
        ctx.stroke();

        // Small highlight reflections
        for (let i = 0; i < 15; i++) {
            const x = (i * 35 + game.time * 0.3 + offset) % w;
            const ripple = Math.sin(x * 0.03 + game.time * 0.03) * 1;
            ctx.fillStyle = palette.waterHighlight;
            ctx.fillRect(x, CONFIG.waterLine + ripple - 1, 5 + Math.sin(i) * 2, 1);
        }
    },

    // Water reflection scaled for 480x270 resolution - ENHANCED
    'water-reflection': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        const reflectionHeight = 60; // How far down the reflection extends
        const waterStart = CONFIG.waterLine;

        ctx.save();

        // 1. SKY REFLECTION (inverted and faded)
        // Create inverted sky gradient for reflection
        const skyReflGradient = ctx.createLinearGradient(0, waterStart, 0, waterStart + reflectionHeight * 0.6);

        // Reverse the sky colors for reflection effect
        const reversedSky = [...palette.sky].reverse();
        const reversedStops = [...palette.skyStops].reverse().map(stop => 1 - stop);

        reversedSky.forEach((color, i) => {
            // Make reflection more transparent and darker
            const stop = i / (reversedSky.length - 1);
            skyReflGradient.addColorStop(stop, color);
        });

        ctx.globalAlpha = 0.12; // Subtle sky reflection
        ctx.fillStyle = skyReflGradient;
        ctx.fillRect(0, waterStart, w, reflectionHeight * 0.6);

        // 2. MOUNTAINS REFLECTION (with wave distortion)
        ctx.globalAlpha = 0.18;
        for (let ry = 0; ry < reflectionHeight * 0.7; ry += 2) {
            const actualY = waterStart + ry;
            const distort = Math.sin(ry * 0.12 + game.time * 0.025 + offset * 0.008) * 3 +
                          Math.sin(ry * 0.2 + game.time * 0.015) * 1.5;

            // Fade out as we go deeper
            const fadeOut = 1 - (ry / (reflectionHeight * 0.7));
            ctx.globalAlpha = 0.18 * fadeOut;

            // Draw mountain reflection with distortion
            ctx.fillStyle = palette.mountains[0];
            for (let x = 0; x < w; x += 4) {
                const xDistort = distort + Math.sin((x + offset * 0.1) * 0.05) * 1;
                ctx.fillRect(x + xDistort, actualY, 4, 2);
            }
        }

        // 3. TREES REFLECTION (darker and more distorted)
        ctx.globalAlpha = 0.15;
        for (let ry = reflectionHeight * 0.3; ry < reflectionHeight * 0.8; ry += 3) {
            const actualY = waterStart + ry;
            const distort = Math.sin(ry * 0.18 + game.time * 0.03 + offset * 0.012) * 4 +
                          Math.sin(ry * 0.25 + game.time * 0.02) * 2;

            // Fade out as we go deeper
            const fadeOut = 1 - (ry / (reflectionHeight * 0.8));
            ctx.globalAlpha = 0.15 * fadeOut;

            // Draw tree reflection strips with more distortion
            ctx.fillStyle = palette.trees[0];
            for (let x = 0; x < w; x += 3) {
                const xDistort = distort + Math.sin((x + offset * 0.35) * 0.08 + ry * 0.1) * 2;
                ctx.fillRect(x + xDistort, actualY, 3, 3);
            }
        }

        // 4. SUN/MOON REFLECTION (if visible)
        if (palette.sun) {
            const sunPos = getSunPosition ? getSunPosition() : palette.sun;
            if (sunPos && sunPos.y < CONFIG.waterLine) {
                // Sun is above horizon, draw reflection
                const sunX = (sunPos.x || palette.sun.x) - offset * 0.1;
                const reflectY = waterStart + 15 + Math.sin(game.time * 0.03) * 3;

                // Vertical shimmer effect
                const shimmerGrad = ctx.createLinearGradient(sunX, reflectY, sunX, reflectY + 40);
                shimmerGrad.addColorStop(0, 'rgba(255, 240, 180, 0.3)');
                shimmerGrad.addColorStop(0.3, 'rgba(255, 220, 150, 0.15)');
                shimmerGrad.addColorStop(1, 'transparent');

                ctx.globalAlpha = 0.4;
                ctx.fillStyle = shimmerGrad;

                // Wavy light column
                for (let dy = 0; dy < 40; dy += 2) {
                    const wave = Math.sin(dy * 0.2 + game.time * 0.05) * 8;
                    const width = 6 + Math.sin(dy * 0.15) * 3;
                    ctx.fillRect(sunX - width/2 + wave, reflectY + dy, width, 2);
                }
            }
        }

        if (palette.moon && game.timeOfDay === 'night') {
            const moonPos = getMoonPosition ? getMoonPosition() : palette.moon;
            if (moonPos && moonPos.y < CONFIG.waterLine) {
                // Moon is above horizon, draw reflection
                const moonX = (moonPos.x || palette.moon.x) - offset * 0.05;
                const reflectY = waterStart + 12 + Math.sin(game.time * 0.025) * 2;

                // Vertical moonlight shimmer
                const moonShimmer = ctx.createLinearGradient(moonX, reflectY, moonX, reflectY + 35);
                moonShimmer.addColorStop(0, 'rgba(200, 210, 230, 0.25)');
                moonShimmer.addColorStop(0.4, 'rgba(180, 200, 220, 0.12)');
                moonShimmer.addColorStop(1, 'transparent');

                ctx.globalAlpha = 0.35;
                ctx.fillStyle = moonShimmer;

                // Wavy moonlight column
                for (let dy = 0; dy < 35; dy += 2) {
                    const wave = Math.sin(dy * 0.18 + game.time * 0.04) * 6;
                    const width = 5 + Math.sin(dy * 0.12) * 2;
                    ctx.fillRect(moonX - width/2 + wave, reflectY + dy, width, 2);
                }
            }
        }

        // 5. SURFACE SHIMMER (animated highlights on water surface)
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 10; i++) {
            const shimmerX = (i * 48 + game.time * 0.4 + offset * 0.6) % w;
            const shimmerY = waterStart + Math.sin(shimmerX * 0.05 + game.time * 0.03) * 2;
            const shimmerWidth = 8 + Math.sin(game.time * 0.02 + i) * 4;

            ctx.fillStyle = palette.waterHighlight;
            ctx.fillRect(shimmerX, shimmerY, shimmerWidth, 1);
        }

        ctx.restore();
    },

    // Underwater background
    'underwater-bg': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        const gradient = ctx.createLinearGradient(0, CONFIG.waterLine, 0, h);
        palette.underwater.forEach((color, i) => {
            gradient.addColorStop(i / (palette.underwater.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, CONFIG.waterLine, w, h - CONFIG.waterLine);
    },

    // Light rays scaled for 480x270 resolution
    'light-rays': (ctx, offset, y, w, h, layer) => {
        if (game.timeOfDay === 'night') return;
        const intensity = game.timeOfDay === 'day' ? 0.06 : 0.03;

        for (let i = 0; i < 4; i++) {
            const x = (60 + i * 80 - offset * 0.3) % (w + 50);
            const gradient = ctx.createLinearGradient(x, CONFIG.waterLine, x + 20, h);
            gradient.addColorStop(0, `rgba(200, 220, 180, ${intensity})`);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(x, CONFIG.waterLine);
            ctx.lineTo(x - 10, h);
            ctx.lineTo(x + 30, h);
            ctx.lineTo(x + 15, CONFIG.waterLine);
            ctx.closePath();
            ctx.fill();
        }
    },

    // Rocks scaled for 480x270 resolution
    'rocks-far': (ctx, offset, y, w, h, layer) => {
        ctx.fillStyle = 'rgba(15, 25, 30, 0.6)';
        for (let i = 0; i < 6; i++) {
            const x = ((i * 80 - offset) % (w + 100)) - 50;
            const rw = 18 + (i % 3) * 8;
            const rh = 8 + (i % 2) * 4;
            ctx.beginPath();
            ctx.ellipse(x, y + 20, rw, rh, 0, Math.PI, 0);
            ctx.fill();
        }
    },

    'rocks-mid': (ctx, offset, y, w, h, layer) => {
        ctx.fillStyle = 'rgba(10, 20, 25, 0.8)';
        for (let i = 0; i < 5; i++) {
            const x = ((i * 100 - offset) % (w + 100)) - 50;
            const rw = 22 + (i % 4) * 6;
            const rh = 10 + (i % 3) * 4;
            ctx.beginPath();
            ctx.ellipse(x, y + 15, rw, rh, 0, Math.PI, 0);
            ctx.fill();
        }
    },

    // Seaweed scaled for 480x270 resolution
    'seaweed-far': (ctx, offset, y, w, h, layer) => {
        ctx.strokeStyle = 'rgba(40, 80, 60, 0.4)';
        ctx.lineWidth = 2;

        for (let i = 0; i < 10; i++) {
            const x = ((i * 50 - offset) % (w + 100)) - 50;
            const baseY = y + 40 + (i % 3) * 12;
            const height = 20 + (i % 4) * 6;
            const sway = Math.sin(game.time * 0.015 + i * 0.8 + layer.currentFrame * 0.5) * 4;

            ctx.beginPath();
            ctx.moveTo(x, baseY);
            ctx.quadraticCurveTo(x + sway/2, baseY - height/2, x + sway, baseY - height);
            ctx.stroke();
        }
    },

    'seaweed-near': (ctx, offset, y, w, h, layer) => {
        ctx.strokeStyle = 'rgba(50, 100, 70, 0.5)';
        ctx.lineWidth = 2;

        for (let i = 0; i < 8; i++) {
            const x = ((i * 65 - offset) % (w + 100)) - 50;
            const baseY = y + 50 + (i % 2) * 10;
            const height = 25 + (i % 3) * 8;
            const sway = Math.sin(game.time * 0.015 + i * 0.6 + layer.currentFrame * 0.5) * 5;

            ctx.beginPath();
            ctx.moveTo(x, baseY);
            ctx.quadraticCurveTo(x + sway/2, baseY - height/2, x + sway, baseY - height);
            ctx.stroke();
        }
    },

    // Particles scaled for 480x270 resolution
    'particles': (ctx, offset, y, w, h, layer) => {
        for (let i = 0; i < 25; i++) {
            const x = (i * 20 + game.time * 0.2 + offset * 0.3) % w;
            const py = y + 10 + (i * 12 + Math.sin(game.time * 0.02 + i) * 10) % (h - y - 25);
            const alpha = 0.2 + Math.sin(game.time * 0.03 + i) * 0.1;
            ctx.fillStyle = `rgba(150, 180, 170, ${alpha})`;
            ctx.fillRect(x, py, 1, 1);
        }
    },

    // Deep shadows scaled for 480x270 resolution
    'deep-shadows': (ctx, offset, y, w, h, layer) => {
        if (game.sanity > 80) return;
        const count = Math.floor((100 - game.sanity) / 25) + 1;

        for (let i = 0; i < count; i++) {
            const x = (game.time * 0.3 + i * 150 - offset * 0.2) % (w + 100) - 50;
            const sy = y + Math.sin(game.time * 0.01 + i * 2) * 10;
            const size = 25 + i * 10;

            ctx.fillStyle = `rgba(5, 5, 10, ${0.4 - i * 0.1})`;
            ctx.beginPath();
            ctx.ellipse(x, sy, size, size / 3, 0, 0, Math.PI * 2);
            ctx.fill();

            if (game.sanity < 40) {
                for (let t = 0; t < 2; t++) {
                    ctx.strokeStyle = `rgba(5, 5, 10, ${0.3 - i * 0.08})`;
                    ctx.lineWidth = 3 - t;
                    ctx.beginPath();
                    const tx = x + Math.cos(t * 2 + game.time * 0.02) * size * 0.7;
                    const ty = sy + Math.sin(t * 2 + game.time * 0.02) * 8;
                    ctx.moveTo(tx, ty);
                    ctx.quadraticCurveTo(
                        tx + Math.sin(game.time * 0.03 + t) * 10,
                        ty + 15,
                        tx + Math.sin(game.time * 0.02 + t) * 15,
                        ty + 30
                    );
                    ctx.stroke();
                }
            }
        }
    }
};

// Helper functions scaled for 480x270 resolution
function drawCloud(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.ellipse(x, y, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x - w * 0.3, y + h * 0.1, w * 0.3, h * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.3, y + h * 0.15, w * 0.35, h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
}

// Tree drawing scaled for pixel art resolution
function drawTree(ctx, x, y, height, color) {
    // Trunk - thin for pixel art
    ctx.fillStyle = '#1a1510';
    ctx.fillRect(x - 1, y - height * 0.3, 2, height * 0.3);

    // Top triangle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - height);
    ctx.lineTo(x - 6, y - height * 0.3);
    ctx.lineTo(x + 6, y - height * 0.3);
    ctx.closePath();
    ctx.fill();

    // Bottom triangle
    ctx.beginPath();
    ctx.moveTo(x, y - height * 0.8);
    ctx.lineTo(x - 8, y - height * 0.1);
    ctx.lineTo(x + 8, y - height * 0.1);
    ctx.closePath();
    ctx.fill();
}
