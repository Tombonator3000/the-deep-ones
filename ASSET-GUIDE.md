# The Deep Ones — Asset Guide

## 🎨 Hvordan bytte ut grafikk

Spillet bruker et **parallax layer system** med automatisk fallback til prosedyral grafikk.

### Steg 1: Lag asset-mappe

```
the-deep-ones/
├── index.html
└── assets/
    ├── backgrounds/
    │   ├── dawn/
    │   │   ├── sky.png
    │   │   ├── stars.png
    │   │   └── sun.png
    │   ├── day/
    │   │   ├── sky.png
    │   │   ├── clouds-far.png
    │   │   ├── clouds-near.png
    │   │   └── sun.png
    │   ├── dusk/
    │   │   └── ...
    │   ├── night/
    │   │   └── ...
    │   ├── land/
    │   │   ├── mountains-far.png      (tile horizontalt)
    │   │   ├── mountains-mid.png      (tile horizontalt)
    │   │   ├── mountains-near.png     (tile horizontalt)
    │   │   ├── trees-far.png          (tile horizontalt)
    │   │   ├── trees-near.png         (tile horizontalt)
    │   │   ├── lighthouse.png
    │   │   └── reeds.png
    │   ├── water/
    │   │   ├── surface.png            (animert spritesheet, 4 frames)
    │   │   └── reflection.png
    │   └── underwater/
    │       ├── gradient.png
    │       ├── lightrays.png
    │       ├── rocks-far.png
    │       ├── rocks-mid.png
    │       ├── seaweed-far.png        (animert, 6 frames)
    │       ├── seaweed-near.png       (animert, 6 frames)
    │       ├── particles.png          (animert, 8 frames)
    │       └── shadows.png
    └── sprites/
        ├── boat/
        │   ├── boat.png               (90x50px)
        │   ├── fisher.png             (32x48px)
        │   ├── dog.png                (animert, 4 frames, 24x20px per frame)
        │   ├── lantern.png            (animert, 4 frames)
        │   └── rod.png
        ├── fishing/
        │   └── bobber.png
        ├── fish/
        │   ├── harbor-cod.png         (spritesheet, 4 frames)
        │   ├── pale-flounder.png
        │   ├── glass-squid.png
        │   └── ... (en fil per fisketype)
        └── ui/
            ├── catch-popup.png
            └── journal-bg.png
```

---

## 📐 Parallax Layer Specs

| Layer ID | Scroll Speed | Repeat X | Notes |
|----------|-------------|----------|-------|
| `sky-gradient` | 0 (static) | No | Full canvas height gradient |
| `stars` | 0.02 | No | Twinkle animation i koden |
| `clouds-far` | 0.1 | Yes | Sakte drift |
| `clouds-near` | 0.2 | Yes | Raskere drift |
| `mountains-far` | 0.1 | Yes | Fjerneste fjell |
| `mountains-mid` | 0.2 | Yes | Mellomfjell |
| `mountains-near` | 0.3 | Yes | Nærmeste fjell |
| `trees-far` | 0.35 | Yes | Bakgrunns-skog |
| `trees-near` | 0.45 | Yes | Forgrunns-skog |
| `lighthouse` | 0.4 | No | Enkelt objekt |
| `water-surface` | 0.6 | Yes | Animert (4 frames) |
| `underwater-bg` | 0 (static) | No | Gradient ned i dypet |
| `light-rays` | 0.1 | No | Semi-transparent |
| `seaweed-far` | 0.2 | Yes | Animert (6 frames) |
| `seaweed-near` | 0.4 | Yes | Animert (6 frames) |
| `rocks-far` | 0.15 | Yes | Bakgrunns-steiner |
| `rocks-mid` | 0.3 | Yes | Forgrunns-steiner |
| `deep-shadows` | 0.1 | Yes | Vises kun ved lav sanity |

---

## 🐟 Fiske-sprites

Hver fisk er et **horisontalt spritesheet** med animasjonsframes:

```
┌─────┬─────┬─────┬─────┐
│ F1  │ F2  │ F3  │ F4  │  ← 4 frames for swim animation
└─────┴─────┴─────┴─────┘
```

### Størrelser per fisketype:

| Fisk | Bredde | Høyde | Frames | FPS |
|------|--------|-------|--------|-----|
| Harbor Cod | 32 | 16 | 4 | 6 |
| Pale Flounder | 36 | 20 | 4 | 5 |
| Whisper Eel | 48 | 12 | 6 | 8 |
| Glass Squid | 40 | 32 | 6 | 7 |
| Bone Angler | 44 | 28 | 4 | 5 |
| The Mimic | 48 | 24 | 4 | 4 |
| Congregation Fish | 56 | 32 | 4 | 3 |
| The Listener | 52 | 28 | 4 | 4 |
| Dagon's Fingerling | 64 | 40 | 4 | 4 |
| The Dreaming One | 72 | 48 | 4 | 2 |
| Mother Hydra's Tear | 80 | 56 | 6 | 3 |
| The Unnamed | 96 | 64 | 4 | 2 |

---

## ⚙️ Aktivere sprites

I koden, endre:

```javascript
const CONFIG = {
    // Sett til true når du har lagt til assets
    useSprites: true,
    
    // Asset base path (relativt til HTML-filen)
    assetPath: 'assets/',
};
```

---

## 🎯 Tips for pixel art

1. **Canvas størrelse**: 1000x650px
2. **Vannlinje**: y = 280px
3. **Tile-bredde**: Lag bakgrunner som er delbare på canvas-bredden (f.eks. 500px eller 1000px)
4. **Fargepalett**: Følg Cast n Chill-stilen med landskapsmaleri-inspirerte farger
5. **Transparens**: Bruk PNG med alpha for overlappende lag

---

## 🔧 Debug-panel

Trykk **[D]** for å toggle debug-panelet som viser:
- Antall lastede sprites
- Antall fallback (prosedyrale)
- Hvilken modus som brukes

---

## 📁 Eksempel workflow

1. Lag pixel art i **Aseprite** / **Photoshop** / **GIMP**
2. Eksporter som PNG til riktig mappe
3. Refresh nettleseren
4. Sjekk debug-panelet for status
5. Hvis noe er feil, faller spillet automatisk tilbake til prosedyral grafikk

---

## 🌊 Animerte bakgrunner

For animerte lag (vann, tang, etc.), lag et **horisontalt spritesheet**:

```
Eksempel: seaweed-far.png (6 frames á 200px bredde)

┌───────┬───────┬───────┬───────┬───────┬───────┐
│ 200px │ 200px │ 200px │ 200px │ 200px │ 200px │
└───────┴───────┴───────┴───────┴───────┴───────┘
Total bredde: 1200px
```

---

Lykke til med pixel art! 🎨🐙
