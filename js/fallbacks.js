// ============================================================
// THE DEEP ONES - PROCEDURAL FALLBACKS
// ============================================================

const FALLBACKS = {
    'sky-gradient': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.waterLine);
        palette.sky.forEach((color, i) => {
            gradient.addColorStop(palette.skyStops[i], color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, CONFIG.waterLine);
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

    'clouds-far': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.fillStyle = palette.clouds;
        for (let i = 0; i < 5; i++) {
            const x = ((i * 250 - offset) % (w + 200)) - 100;
            drawCloud(ctx, x, y + Math.sin(i * 2) * 15, 80 + i * 20, 25);
        }
    },

    'clouds-near': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.fillStyle = palette.clouds;
        for (let i = 0; i < 4; i++) {
            const x = ((i * 300 - offset * 1.5) % (w + 200)) - 100;
            drawCloud(ctx, x, y + Math.cos(i * 1.5) * 10, 100 + i * 15, 30);
        }
    },

    'clouds': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.fillStyle = palette.clouds;
        for (let i = 0; i < 4; i++) {
            const x = ((i * 280 - offset) % (w + 200)) - 100;
            drawCloud(ctx, x, y + Math.sin(i) * 20, 90, 28);
        }
    },

    'mountains-far': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.fillStyle = palette.mountains[0];
        ctx.beginPath();
        ctx.moveTo(-offset % 400 - 400, CONFIG.waterLine);
        for (let x = -400; x < w + 400; x += 200) {
            const px = x - (offset % 400);
            const py = y + Math.sin(x * 0.005) * 30 + 40;
            ctx.lineTo(px, py);
        }
        ctx.lineTo(w + 100, CONFIG.waterLine);
        ctx.closePath();
        ctx.fill();
    },

    'mountains-mid': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.fillStyle = palette.mountains[1];
        ctx.beginPath();
        ctx.moveTo(-offset % 300 - 300, CONFIG.waterLine);
        for (let x = -300; x < w + 300; x += 150) {
            const px = x - (offset % 300);
            const py = y + Math.sin(x * 0.008 + 1) * 25 + 30;
            ctx.lineTo(px, py);
        }
        ctx.lineTo(w + 100, CONFIG.waterLine);
        ctx.closePath();
        ctx.fill();
    },

    'mountains-near': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.fillStyle = palette.mountains[2] || palette.mountains[1];
        ctx.beginPath();
        ctx.moveTo(-offset % 250 - 250, CONFIG.waterLine);
        for (let x = -250; x < w + 250; x += 100) {
            const px = x - (offset % 250);
            const py = y + Math.sin(x * 0.01 + 2) * 20 + 25;
            ctx.lineTo(px, py);
        }
        ctx.lineTo(w + 100, CONFIG.waterLine);
        ctx.closePath();
        ctx.fill();
    },

    'trees-far': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        for (let i = 0; i < 30; i++) {
            const x = ((i * 80 - offset) % (w + 200)) - 100;
            drawTree(ctx, x, y + 50, 40 + (i % 3) * 10, palette.trees[0]);
        }
    },

    'trees-near': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        for (let i = 0; i < 20; i++) {
            const x = ((i * 120 - offset) % (w + 200)) - 100;
            drawTree(ctx, x, y + 40, 55 + (i % 4) * 8, palette.trees[1]);
        }
    },

    'lighthouse': (ctx, offset, y, w, h, layer) => {
        const x = 150 - offset;
        if (x < -50 || x > w + 50) return;

        const palette = getTimePalette();

        ctx.fillStyle = palette.mountains[1];
        ctx.beginPath();
        ctx.ellipse(x, y + 70, 40, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e0d8d0';
        ctx.beginPath();
        ctx.moveTo(x - 12, y + 65);
        ctx.lineTo(x - 8, y);
        ctx.lineTo(x + 8, y);
        ctx.lineTo(x + 12, y + 65);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#a04040';
        ctx.fillRect(x - 10, y + 30, 20, 15);

        ctx.fillStyle = '#302520';
        ctx.fillRect(x - 10, y - 5, 20, 8);

        ctx.fillStyle = '#a04040';
        ctx.beginPath();
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x - 12, y - 5);
        ctx.lineTo(x + 12, y - 5);
        ctx.closePath();
        ctx.fill();

        const intensity = (Math.sin(game.time * 0.05) + 1) / 2;
        ctx.fillStyle = `rgba(255, 250, 200, ${0.4 + intensity * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y - 2, 5 + intensity * 3, 0, Math.PI * 2);
        ctx.fill();
    },

    'reeds-left': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.strokeStyle = palette.trees[1];
        ctx.lineWidth = 2;

        for (let i = 0; i < 20; i++) {
            const x = ((i * 8 - offset * 0.5) % 200);
            const height = 30 + Math.sin(i) * 15;
            const sway = Math.sin(game.time * 0.02 + i * 0.5) * 3;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + sway, y - height/2, x + sway * 1.5, y - height);
            ctx.stroke();
        }
    },

    'water-surface': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();

        ctx.strokeStyle = palette.waterHighlight;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
            const ripple = Math.sin((x + offset) * 0.02 + game.time * 0.03) * 2;
            if (x === 0) ctx.moveTo(x, y + ripple);
            else ctx.lineTo(x, y + ripple);
        }
        ctx.stroke();

        for (let i = 0; i < 30; i++) {
            const x = (i * 67 + game.time * 0.3 + offset) % w;
            const ripple = Math.sin(x * 0.02 + game.time * 0.03) * 2;
            ctx.fillStyle = palette.waterHighlight;
            ctx.fillRect(x, y + ripple - 1, 10 + Math.sin(i) * 5, 2);
        }
    },

    'water-reflection': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        ctx.globalAlpha = 0.2;

        for (let ry = y; ry < y + 80; ry += 4) {
            const distort = Math.sin(ry * 0.1 + game.time * 0.03 + offset * 0.01) * 3;
            ctx.fillStyle = palette.mountains[0];
            ctx.fillRect(distort, ry, w, 2);
        }

        ctx.globalAlpha = 1;
    },

    'underwater-bg': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        const gradient = ctx.createLinearGradient(0, y, 0, h);
        palette.underwater.forEach((color, i) => {
            gradient.addColorStop(i / (palette.underwater.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y, w, h - y);
    },

    'light-rays': (ctx, offset, y, w, h, layer) => {
        if (game.timeOfDay === 'night') return;
        const intensity = game.timeOfDay === 'day' ? 0.08 : 0.04;

        for (let i = 0; i < 6; i++) {
            const x = (150 + i * 150 - offset * 0.3) % (w + 100);
            const gradient = ctx.createLinearGradient(x, y, x + 50, h);
            gradient.addColorStop(0, `rgba(200, 220, 180, ${intensity})`);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 20, h);
            ctx.lineTo(x + 70, h);
            ctx.lineTo(x + 30, y);
            ctx.closePath();
            ctx.fill();
        }
    },

    'rocks-far': (ctx, offset, y, w, h, layer) => {
        ctx.fillStyle = 'rgba(15, 25, 30, 0.6)';
        for (let i = 0; i < 10; i++) {
            const x = ((i * 150 - offset) % (w + 200)) - 100;
            const rw = 40 + (i % 3) * 20;
            const rh = 20 + (i % 2) * 10;
            ctx.beginPath();
            ctx.ellipse(x, y + 50, rw, rh, 0, Math.PI, 0);
            ctx.fill();
        }
    },

    'rocks-mid': (ctx, offset, y, w, h, layer) => {
        ctx.fillStyle = 'rgba(10, 20, 25, 0.8)';
        for (let i = 0; i < 8; i++) {
            const x = ((i * 180 - offset) % (w + 200)) - 100;
            const rw = 50 + (i % 4) * 15;
            const rh = 25 + (i % 3) * 8;
            ctx.beginPath();
            ctx.ellipse(x, y + 30, rw, rh, 0, Math.PI, 0);
            ctx.fill();
        }
    },

    'seaweed-far': (ctx, offset, y, w, h, layer) => {
        ctx.strokeStyle = 'rgba(40, 80, 60, 0.4)';
        ctx.lineWidth = 3;

        for (let i = 0; i < 15; i++) {
            const x = ((i * 100 - offset) % (w + 200)) - 100;
            const baseY = y + 100 + (i % 3) * 30;
            const height = 50 + (i % 4) * 15;
            const sway = Math.sin(game.time * 0.015 + i * 0.8 + layer.currentFrame * 0.5) * 10;

            ctx.beginPath();
            ctx.moveTo(x, baseY);
            ctx.quadraticCurveTo(x + sway/2, baseY - height/2, x + sway, baseY - height);
            ctx.stroke();
        }
    },

    'seaweed-near': (ctx, offset, y, w, h, layer) => {
        ctx.strokeStyle = 'rgba(50, 100, 70, 0.5)';
        ctx.lineWidth = 4;

        for (let i = 0; i < 12; i++) {
            const x = ((i * 130 - offset) % (w + 200)) - 100;
            const baseY = y + 130 + (i % 2) * 20;
            const height = 60 + (i % 3) * 20;
            const sway = Math.sin(game.time * 0.015 + i * 0.6 + layer.currentFrame * 0.5) * 12;

            ctx.beginPath();
            ctx.moveTo(x, baseY);
            ctx.quadraticCurveTo(x + sway/2, baseY - height/2, x + sway, baseY - height);
            ctx.stroke();
        }
    },

    'particles': (ctx, offset, y, w, h, layer) => {
        for (let i = 0; i < 40; i++) {
            const x = (i * 37 + game.time * 0.2 + offset * 0.3) % w;
            const py = y + 20 + (i * 23 + Math.sin(game.time * 0.02 + i) * 20) % (h - y - 50);
            const alpha = 0.2 + Math.sin(game.time * 0.03 + i) * 0.1;
            ctx.fillStyle = `rgba(150, 180, 170, ${alpha})`;
            ctx.fillRect(x, py, 1 + (i % 3), 1 + (i % 3));
        }
    },

    'deep-shadows': (ctx, offset, y, w, h, layer) => {
        if (game.sanity > 80) return;
        const count = Math.floor((100 - game.sanity) / 20) + 1;

        for (let i = 0; i < count; i++) {
            const x = (game.time * 0.3 + i * 300 - offset * 0.2) % (w + 200) - 100;
            const sy = y + Math.sin(game.time * 0.01 + i * 2) * 20;
            const size = 60 + i * 25;

            ctx.fillStyle = `rgba(5, 5, 10, ${0.4 - i * 0.1})`;
            ctx.beginPath();
            ctx.ellipse(x, sy, size, size / 3, 0, 0, Math.PI * 2);
            ctx.fill();

            if (game.sanity < 40) {
                for (let t = 0; t < 3; t++) {
                    ctx.strokeStyle = `rgba(5, 5, 10, ${0.3 - i * 0.08})`;
                    ctx.lineWidth = 8 - t * 2;
                    ctx.beginPath();
                    const tx = x + Math.cos(t * 2 + game.time * 0.02) * size * 0.7;
                    const ty = sy + Math.sin(t * 2 + game.time * 0.02) * 15;
                    ctx.moveTo(tx, ty);
                    ctx.quadraticCurveTo(
                        tx + Math.sin(game.time * 0.03 + t) * 25,
                        ty + 35,
                        tx + Math.sin(game.time * 0.02 + t) * 40,
                        ty + 70
                    );
                    ctx.stroke();
                }
            }
        }
    }
};

// Helper functions
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

function drawTree(ctx, x, y, height, color) {
    ctx.fillStyle = '#1a1510';
    ctx.fillRect(x - 2, y - height * 0.3, 4, height * 0.3);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - height);
    ctx.lineTo(x - 15, y - height * 0.3);
    ctx.lineTo(x + 15, y - height * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y - height * 0.8);
    ctx.lineTo(x - 20, y - height * 0.1);
    ctx.lineTo(x + 20, y - height * 0.1);
    ctx.closePath();
    ctx.fill();
}
