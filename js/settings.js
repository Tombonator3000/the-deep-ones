// ============================================================
// THE DEEP ONES - SETTINGS SYSTEM
// ============================================================

// Game settings
const GameSettings = {
    audio: {
        masterVolume: 0.7,
        musicVolume: 0.5,
        sfxVolume: 0.8,
        ambientVolume: 0.6,
        muted: false
    },
    graphics: {
        quality: 'high',  // 'low', 'medium', 'high'
        particles: true,
        screenShake: true,
        weatherEffects: true
    },
    gameplay: {
        autoSave: true,
        showTutorial: true,
        touchControls: 'auto'  // 'auto', 'always', 'never'
    }
};

// Settings menu state
const settingsMenu = {
    open: false,
    category: 'audio',  // 'audio', 'graphics', 'gameplay', 'controls'
    selectedIndex: 0,
    categories: ['audio', 'graphics', 'gameplay', 'controls']
};

// Load settings from localStorage
function loadSettings() {
    try {
        const saved = localStorage.getItem('theDeepOnes_settings');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(GameSettings.audio, data.audio || {});
            Object.assign(GameSettings.graphics, data.graphics || {});
            Object.assign(GameSettings.gameplay, data.gameplay || {});
        }
    } catch (e) {
        console.warn('Failed to load settings:', e);
    }

    // Apply settings
    applySettings();
}

// Save settings to localStorage
function saveSettings() {
    try {
        localStorage.setItem('theDeepOnes_settings', JSON.stringify(GameSettings));
    } catch (e) {
        console.warn('Failed to save settings:', e);
    }
}

// Apply current settings
function applySettings() {
    // Apply audio settings
    if (typeof AudioManager !== 'undefined' && AudioManager.context) {
        AudioManager.settings.masterVolume = GameSettings.audio.masterVolume;
        AudioManager.settings.musicVolume = GameSettings.audio.musicVolume;
        AudioManager.settings.sfxVolume = GameSettings.audio.sfxVolume;
        AudioManager.settings.ambientVolume = GameSettings.audio.ambientVolume;
        AudioManager.settings.muted = GameSettings.audio.muted;
        AudioManager.updateVolumes();
    }

    // Apply touch controls setting
    const touchControls = document.getElementById('touch-controls');
    if (touchControls) {
        if (GameSettings.gameplay.touchControls === 'always') {
            touchControls.classList.add('visible');
        } else if (GameSettings.gameplay.touchControls === 'never') {
            touchControls.classList.remove('visible');
        }
        // 'auto' is handled by device detection
    }
}

// Open settings menu
function openSettingsMenu() {
    settingsMenu.open = true;
    settingsMenu.category = 'audio';
    settingsMenu.selectedIndex = 0;
    if (typeof playMenuOpen === 'function') playMenuOpen();
}

// Close settings menu
function closeSettingsMenu() {
    settingsMenu.open = false;
    saveSettings();
    if (typeof playMenuClose === 'function') playMenuClose();
}

// Get items for current category
function getSettingsItems() {
    switch (settingsMenu.category) {
        case 'audio':
            return [
                { key: 'masterVolume', label: 'Master Volume', type: 'slider', min: 0, max: 1, step: 0.1 },
                { key: 'musicVolume', label: 'Music Volume', type: 'slider', min: 0, max: 1, step: 0.1 },
                { key: 'sfxVolume', label: 'SFX Volume', type: 'slider', min: 0, max: 1, step: 0.1 },
                { key: 'ambientVolume', label: 'Ambient Volume', type: 'slider', min: 0, max: 1, step: 0.1 },
                { key: 'muted', label: 'Mute All', type: 'toggle' }
            ];
        case 'graphics':
            return [
                { key: 'quality', label: 'Quality', type: 'select', options: ['low', 'medium', 'high'] },
                { key: 'particles', label: 'Particles', type: 'toggle' },
                { key: 'screenShake', label: 'Screen Shake', type: 'toggle' },
                { key: 'weatherEffects', label: 'Weather Effects', type: 'toggle' }
            ];
        case 'gameplay':
            return [
                { key: 'autoSave', label: 'Auto-Save', type: 'toggle' },
                { key: 'showTutorial', label: 'Show Tutorial', type: 'toggle' },
                { key: 'touchControls', label: 'Touch Controls', type: 'select', options: ['auto', 'always', 'never'] }
            ];
        case 'controls':
            return [
                { label: 'Arrow Keys', desc: 'Move boat / Navigate menus', type: 'info' },
                { label: 'Space', desc: 'Cast line / Confirm', type: 'info' },
                { label: 'E', desc: 'Open Harbor menu', type: 'info' },
                { label: 'P', desc: 'Pet dog', type: 'info' },
                { label: 'J', desc: 'Journal', type: 'info' },
                { label: 'L', desc: 'Lore collection', type: 'info' },
                { label: 'A', desc: 'Achievements', type: 'info' },
                { label: 'M', desc: 'Toggle mute', type: 'info' },
                { label: 'F', desc: 'Toggle fullscreen', type: 'info' },
                { label: 'ESC', desc: 'Close menus', type: 'info' }
            ];
        default:
            return [];
    }
}

// Handle settings input
function handleSettingsInput(e) {
    if (!settingsMenu.open) return false;

    const items = getSettingsItems();

    if (e.key === 'Escape' || e.key.toLowerCase() === 'o') {
        closeSettingsMenu();
        return true;
    }

    if (e.key === 'Tab') {
        e.preventDefault();
        const idx = settingsMenu.categories.indexOf(settingsMenu.category);
        settingsMenu.category = settingsMenu.categories[(idx + 1) % settingsMenu.categories.length];
        settingsMenu.selectedIndex = 0;
        if (typeof playMenuSelect === 'function') playMenuSelect();
        return true;
    }

    if (e.key === 'ArrowUp') {
        settingsMenu.selectedIndex = Math.max(0, settingsMenu.selectedIndex - 1);
        if (typeof playMenuSelect === 'function') playMenuSelect();
        return true;
    }

    if (e.key === 'ArrowDown') {
        settingsMenu.selectedIndex = Math.min(items.length - 1, settingsMenu.selectedIndex + 1);
        if (typeof playMenuSelect === 'function') playMenuSelect();
        return true;
    }

    const item = items[settingsMenu.selectedIndex];
    if (!item || item.type === 'info') return true;

    const category = settingsMenu.category;
    const settings = GameSettings[category];

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const dir = e.key === 'ArrowRight' ? 1 : -1;

        if (item.type === 'slider') {
            const newValue = Math.max(item.min, Math.min(item.max, settings[item.key] + dir * item.step));
            settings[item.key] = Math.round(newValue * 10) / 10;
            applySettings();
        } else if (item.type === 'select') {
            const currentIdx = item.options.indexOf(settings[item.key]);
            const newIdx = (currentIdx + dir + item.options.length) % item.options.length;
            settings[item.key] = item.options[newIdx];
            applySettings();
        } else if (item.type === 'toggle') {
            settings[item.key] = !settings[item.key];
            applySettings();
        }

        if (typeof playMenuSelect === 'function') playMenuSelect();
        return true;
    }

    if (e.key === ' ' || e.key === 'Enter') {
        if (item.type === 'toggle') {
            settings[item.key] = !settings[item.key];
            applySettings();
            if (typeof playMenuSelect === 'function') playMenuSelect();
        }
        return true;
    }

    return true;
}

// Draw settings menu
function drawSettingsMenu() {
    if (!settingsMenu.open) return;

    const w = 500, h = 450;
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    // Background
    ctx.fillStyle = 'rgba(15, 20, 25, 0.98)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#6080a0';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Title
    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = '#a0c0d0';
    ctx.textAlign = 'center';
    ctx.fillText('SETTINGS', x + w/2, y + 30);

    // Category tabs
    const tabWidth = w / settingsMenu.categories.length;
    settingsMenu.categories.forEach((cat, i) => {
        const tabX = x + i * tabWidth;
        const isActive = settingsMenu.category === cat;
        ctx.fillStyle = isActive ? 'rgba(80, 120, 150, 0.3)' : 'rgba(30, 40, 50, 0.5)';
        ctx.fillRect(tabX, y + 45, tabWidth, 25);
        ctx.fillStyle = isActive ? '#aaddff' : '#6a8a9a';
        ctx.font = '12px VT323';
        ctx.fillText(cat.toUpperCase(), tabX + tabWidth/2, y + 62);
    });

    // Settings items
    const items = getSettingsItems();
    const settings = GameSettings[settingsMenu.category] || {};

    ctx.textAlign = 'left';
    items.forEach((item, i) => {
        const itemY = y + 100 + i * 35;
        const isSelected = settingsMenu.selectedIndex === i;

        if (isSelected) {
            ctx.fillStyle = 'rgba(80, 120, 150, 0.3)';
            ctx.fillRect(x + 15, itemY - 12, w - 30, 30);
        }

        ctx.fillStyle = isSelected ? '#c0e0ff' : '#8a9aaa';
        ctx.font = '14px VT323';
        ctx.fillText(item.label, x + 25, itemY + 5);

        // Draw value
        ctx.textAlign = 'right';
        if (item.type === 'slider') {
            const value = settings[item.key];
            const barWidth = 100;
            const barX = x + w - 30 - barWidth;

            // Bar background
            ctx.fillStyle = 'rgba(40, 50, 60, 0.8)';
            ctx.fillRect(barX, itemY - 5, barWidth, 12);

            // Bar fill
            ctx.fillStyle = isSelected ? '#80c0e0' : '#6090a0';
            ctx.fillRect(barX + 1, itemY - 4, (barWidth - 2) * value, 10);

            // Value text
            ctx.fillStyle = isSelected ? '#c0e0ff' : '#8a9aaa';
            ctx.fillText(Math.round(value * 100) + '%', barX - 10, itemY + 5);
        } else if (item.type === 'toggle') {
            const value = settings[item.key];
            ctx.fillStyle = value ? '#80e080' : '#a06060';
            ctx.fillText(value ? 'ON' : 'OFF', x + w - 30, itemY + 5);
        } else if (item.type === 'select') {
            ctx.fillStyle = isSelected ? '#c0e0ff' : '#8a9aaa';
            ctx.fillText(`< ${settings[item.key].toUpperCase()} >`, x + w - 30, itemY + 5);
        } else if (item.type === 'info') {
            ctx.fillStyle = '#6a7a8a';
            ctx.fillText(item.desc, x + w - 30, itemY + 5);
        }
        ctx.textAlign = 'left';
    });

    // Footer
    ctx.fillStyle = '#5a7a8a';
    ctx.font = '12px VT323';
    ctx.textAlign = 'center';
    ctx.fillText('[TAB] Category | [UP/DOWN] Select | [LEFT/RIGHT] Adjust | [ESC] Close', x + w/2, y + h - 15);
    ctx.textAlign = 'left';
}

// Fullscreen functions
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function isFullscreen() {
    return !!document.fullscreenElement;
}

// Delete save confirmation
let deleteConfirmation = {
    show: false,
    timer: 0
};

function showDeleteConfirmation() {
    deleteConfirmation.show = true;
    deleteConfirmation.timer = 180;  // 3 seconds
}

function confirmDeleteSave() {
    deleteSave();
    deleteConfirmation.show = false;
    showSaveNotification('Save Deleted');
}

function drawDeleteConfirmation() {
    if (!deleteConfirmation.show) return;

    deleteConfirmation.timer--;
    if (deleteConfirmation.timer <= 0) {
        deleteConfirmation.show = false;
        return;
    }

    const w = 300, h = 120;
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    ctx.fillStyle = 'rgba(30, 20, 20, 0.95)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#a06060';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = '#e08080';
    ctx.font = '14px VT323';
    ctx.textAlign = 'center';
    ctx.fillText('DELETE SAVE DATA?', x + w/2, y + 35);

    ctx.fillStyle = '#c0a0a0';
    ctx.font = '12px VT323';
    ctx.fillText('This cannot be undone!', x + w/2, y + 55);

    ctx.fillStyle = '#a08080';
    ctx.fillText('[ENTER] Confirm | [ESC] Cancel', x + w/2, y + 90);
    ctx.textAlign = 'left';
}
