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
        const palette = getTimePalette();
        if (!palette.sun) return;
        const sun = palette.sun;
        const x = sun.x - offset;

        const glow = ctx.createRadialGradient(x, sun.y, 0, x, sun.y, 100);
        glow.addColorStop(0, sun.glow);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, sun.y, 100, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = sun.color;
        ctx.beginPath();
        ctx.arc(x, sun.y, 30, 0, Math.PI * 2);
        ctx.fill();
    },

    'moon': (ctx, offset, y, w, h, layer) => {
        const palette = getTimePalette();
        if (!palette.moon) return;
        const x = palette.moon.x - offset;

        ctx.fillStyle = 'rgba(200, 210, 230, 0.15)';
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e0e8f0';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#c0c8d0';
        ctx.beginPath();
        ctx.arc(x - 8, y - 5, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 10, y + 8, 4, 0, Math.PI * 2);
        ctx.fill();

        if (game.sanity < 25) {
            const alpha = (25 - game.sanity) / 25;
            ctx.fillStyle = `rgba(30, 20, 40, ${alpha})`;
            ctx.fillRect(x - 10, y - 8, 4, 4);
            ctx.fillRect(x + 6, y - 8, 4, 4);
            ctx.fillRect(x - 8, y + 10, 16, 3);
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
