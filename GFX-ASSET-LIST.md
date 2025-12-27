# The Deep Ones — GFX Asset Liste

## Oversikt

| Kategori | Antall filer | Prioritet |
|----------|--------------|-----------|
| Bakgrunner | 32 | 1 |
| Båt & Karakter | 6 | 1 |
| Fisk/Creatures | 16 | 2 |
| UI | 5 | 3 |
| Effekter | 4 | 3 |
| **TOTAL** | **63 filer** | |

---

## 📁 BAKGRUNNER

### Himmel — Dawn (`backgrounds/dawn/`)

| Fil | Størrelse | Type | Scroll | Notater |
|-----|-----------|------|--------|---------|
| `sky.png` | 1000x280 | Static | 0.00 | Gradient fra mørk lilla til varm oransje |
| `stars.png` | 1000x200 | Static | 0.02 | Spredte stjerner, alpha |
| `sun.png` | 100x100 | Static | 0.05 | Varm oransje sol med glow |

### Himmel — Day (`backgrounds/day/`)

| Fil | Størrelse | Type | Scroll | Notater |
|-----|-----------|------|--------|---------|
| `sky.png` | 1000x280 | Static | 0.00 | Klar blå gradient |
| `clouds-far.png` | 500x60 | Tile X | 0.10 | Små fjerne skyer |
| `clouds-near.png` | 400x80 | Tile X | 0.20 | Større nære skyer |
| `sun.png` | 80x80 | Static | 0.05 | Lys gul sol |

### Himmel — Dusk (`backgrounds/dusk/`)

| Fil | Størrelse | Type | Scroll | Notater |
|-----|-----------|------|--------|---------|
| `sky.png` | 1000x280 | Static | 0.00 | Dramatisk gradient, lilla til oransje |
| `stars.png` | 1000x200 | Static | 0.02 | Begynnende stjerner |
| `clouds.png` | 500x70 | Tile X | 0.15 | Mørke skyer med oransje kanter |
| `sun.png` | 120x120 | Static | 0.05 | Stor rød sol ved horisonten |
| `moon.png` | 60x60 | Static | 0.03 | Blek måne |

### Himmel — Night (`backgrounds/night/`)

| Fil | Størrelse | Type | Scroll | Notater |
|-----|-----------|------|--------|---------|
| `sky.png` | 1000x280 | Static | 0.00 | Mørk blå/svart gradient |
| `stars.png` | 1000x200 | Static | 0.02 | Mange stjerner, noen klynger |
| `moon.png` | 70x70 | Static | 0.03 | Lys måne med kratere |
| `clouds.png` | 500x60 | Tile X | 0.10 | Mørke, nesten usynlige skyer |

### Land (`backgrounds/land/`)

| Fil | Størrelse | Type | Scroll | Notater |
|-----|-----------|------|--------|---------|
| `mountains-far.png` | 500x100 | Tile X | 0.10 | Fjerne fjellsilhuetter, mest desaturert |
| `mountains-mid.png` | 500x80 | Tile X | 0.20 | Mellomfjell |
| `mountains-near.png` | 500x60 | Tile X | 0.30 | Nære åser |
| `trees-far.png` | 400x100 | Tile X | 0.35 | Bakgrunnsskog, grantrær |
| `trees-near.png` | 400x120 | Tile X | 0.45 | Forgrunnsskog, mer detalj |
| `lighthouse.png` | 80x120 | Static | 0.40 | Fyrtårn på klippe |
| `reeds.png` | 200x50 | Static | 0.50 | Siv ved vannkanten |

### Vann (`backgrounds/water/`)

| Fil | Størrelse | Type | Scroll | Notater |
|-----|-----------|------|--------|---------|
| `surface.png` | 2000x30 | Tile X, Anim | 0.60 | 4 frames, vannoverflate med bølger |
| `reflection.png` | 500x100 | Tile X | 0.50 | Forvrengde refleksjoner |

### Undervann (`backgrounds/underwater/`)

| Fil | Størrelse | Type | Scroll | Notater |
|-----|-----------|------|--------|---------|
| `gradient.png` | 1000x370 | Static | 0.00 | Gradient fra turkis til mørk blå/svart |
| `lightrays.png` | 1000x300 | Static | 0.10 | Lysstraler, semi-transparent |
| `rocks-far.png` | 500x80 | Tile X | 0.15 | Fjerne steiner, enkel silhuett |
| `rocks-mid.png` | 500x100 | Tile X | 0.30 | Nære steiner, mer detalj |
| `seaweed-far.png` | 1200x150 | Tile X, Anim | 0.20 | 6 frames, sakte svaing |
| `seaweed-near.png` | 1200x180 | Tile X, Anim | 0.40 | 6 frames, større tang |
| `particles.png` | 800x300 | Tile X, Anim | 0.25 | 8 frames, flytende partikler |
| `shadows.png` | 600x100 | Tile X | 0.10 | Store mørke skygger i dypet |

---

## 🚣 BÅT & KARAKTER (`sprites/boat/`)

| Fil | Størrelse | Frames | FPS | Notater |
|-----|-----------|--------|-----|---------|
| `boat.png` | 90x50 | 1 | - | Trebåt, sett fra siden |
| `fisher.png` | 32x48 | 1 | - | Fisker silhuett med hatt |
| `dog.png` | 96x20 | 4 | 6 | Hund med logrende hale |
| `lantern.png` | 64x24 | 4 | 8 | Flimrende lanterne |
| `rod.png` | 64x64 | 1 | - | Fiskestang |
| `bobber.png` | 12x16 | 1 | - | Rød/hvit dupp |

---

## 🐟 CREATURES (`sprites/fish/`)

### Surface (0-20m)

| Fil | Størrelse | Frames | FPS | Notater |
|-----|-----------|--------|-----|---------|
| `harbor-cod.png` | 128x16 | 4 | 6 | Normal fisk, kanskje litt rare øyne |
| `pale-flounder.png` | 144x20 | 4 | 5 | Flat fisk, FOR mange øyne på én side |
| `whisper-eel.png` | 288x12 | 6 | 8 | Lang, tynn, nesten gjennomsiktig |
| `midnight-perch.png` | 112x18 | 4 | 6 | Mørk, absorberer lys |

### Mid (20-55m)

| Fil | Størrelse | Frames | FPS | Notater |
|-----|-----------|--------|-----|---------|
| `glass-squid.png` | 240x32 | 6 | 7 | Transparent, synlige innvoller |
| `bone-angler.png` | 176x28 | 4 | 5 | Skjelettaktig, lysende lokkeorgan |
| `mimic.png` | 192x24 | 4 | 4 | Ser ut som annen fisk, men feil |
| `prophet-fish.png` | 144x24 | 6 | 6 | Glødende øyne, mystisk |

### Deep (55-90m)

| Fil | Størrelse | Frames | FPS | Notater |
|-----|-----------|--------|-----|---------|
| `congregation.png` | 224x32 | 4 | 3 | Flere fisk smeltet sammen |
| `listener.png` | 208x28 | 4 | 4 | Ingen øyne, store ører/sensorer |
| `drowned-friend.png` | 192x36 | 4 | 5 | Udefinerbar, urovekkende form |
| `memory-leech.png` | 160x20 | 6 | 8 | Parasittisk, tentakler |

### Abyss (90-120m)

| Fil | Størrelse | Frames | FPS | Notater |
|-----|-----------|--------|-----|---------|
| `dagon-fingerling.png` | 256x40 | 4 | 4 | Stor, "liten" del av noe større |
| `dreaming-one.png` | 288x48 | 4 | 2 | Sover, puster sakte, ikke vekk den |
| `hydra-tear.png` | 480x56 | 6 | 3 | Organisk, del av Hydra |
| `unnamed.png` | 384x64 | 4 | 2 | Abstrakt, geometrisk horror |

---

## 🖼️ UI (`sprites/ui/`)

| Fil | Størrelse | Notater |
|-----|-----------|---------|
| `catch-popup.png` | 350x160 | Bakgrunn for fangst-popup |
| `journal-bg.png` | 300x400 | Gammel bok-tekstur |
| `sanity-bar.png` | 120x20 | Bar med 10 segmenter |
| `depth-meter.png` | 30x300 | Vertikal dybdemåler |
| `coin.png` | 16x16 | Gull-ikon |

---

## ✨ EFFEKTER (`sprites/effects/`)

| Fil | Størrelse | Frames | Notater |
|-----|-----------|--------|---------|
| `bubbles.png` | 64x16 | 4 | Stigende bobler |
| `splash.png` | 48x24 | 4 | Vannsprut |
| `glow.png` | 32x32 | 1 | Radial glow for bioluminescens |
| `tentacle.png` | 80x200 | 6 | Tentakel fra dypet (sanity) |

---

## 🎨 FARGE-PALETTER

### Dawn
```
Himmel:  #2a2040, #4a3a60, #8a6080, #d4a090, #f0d0a0
Vann:    #3a5060, #2a4050, #1a3040, #0a2030
Fjell:   #1a1525, #2a2035, #3a3045
Trær:    #1a2520, #253530
```

### Day
```
Himmel:  #4060a0, #6090c0, #90c0e0, #b0e0f0, #d0f0ff
Vann:    #4080a0, #3070a0, #2060a0, #1050a0
Fjell:   #3a5060, #4a6070, #5a7080
Trær:    #2a4a30, #3a5a40
```

### Dusk
```
Himmel:  #1a1530, #3a2545, #6a4060, #b06070, #e0a070, #f0c080
Vann:    #4a5070, #3a4060, #2a3050, #1a2040
Fjell:   #1a1020, #2a1530, #3a2040
Trær:    #151a20, #1a2025
```

### Night
```
Himmel:  #0a0a15, #101020, #151530, #1a1a40
Vann:    #152535, #102030, #0a1525, #05101a
Fjell:   #0a0a12, #0f0f18, #141420
Trær:    #080a10, #0a0c12
```

### Creatures
```
Normal:      #8a9a70 til #a0a090
Unsettling:  #80a0b0 til #6050a0
Deep:        #605050 til #500030
Abyss:       #203020 til #050505
Biolum:      #80ffa0, #60ffff
```

---

## 📐 SPRITESHEET FORMAT

### Horisontal layout for animasjoner:
```
┌────────┬────────┬────────┬────────┐
│ Frame1 │ Frame2 │ Frame3 │ Frame4 │
└────────┴────────┴────────┴────────┘
   32px     32px     32px     32px
   
Total bredde = enkelt-frame-bredde × antall frames
```

### Eksempel: `dog.png` (4 frames á 24px)
```
┌────┬────┬────┬────┐
│ 🐕 │ 🐕 │ 🐕 │ 🐕 │  Hale i forskjellige posisjoner
└────┴────┴────┴────┘
 24px 24px 24px 24px = 96px total
```

---

## ✅ PRIORITERT ARBEIDSLISTE

### Fase 1: Spillbart (minimalt)
- [ ] `boat.png`
- [ ] `fisher.png`
- [ ] `dog.png`
- [ ] `bobber.png`
- [ ] `sky.png` (én tid, f.eks. dusk)
- [ ] `underwater-gradient.png`
- [ ] 4 surface fish

### Fase 2: Visuelt komplett
- [ ] Alle 4 himmel-varianter
- [ ] Alle land-lag (fjell, trær, fyrtårn)
- [ ] Vann-animasjoner
- [ ] Alle 16 creatures

### Fase 3: Polish
- [ ] UI elementer
- [ ] Effekter
- [ ] Animert tang og partikler
- [ ] Sanity-effekter

---

## 💾 FIL-NAVNGIVNING

```
[kategori]-[navn]-[variant].png

Eksempler:
bg-sky-dawn.png
bg-mountains-far.png
fish-harbor-cod.png
ui-catch-popup.png
fx-bubbles.png
```

---

## 🔧 EKSPORT-INNSTILLINGER

### Aseprite
- Format: PNG
- Color Mode: RGBA
- Scale: 1x (pixel perfect)
- Trim: Nei (behold canvas size)

### Photoshop
- Save for Web: PNG-24
- Transparency: On
- Interlaced: Off

---

*Total: 63 assets*
*Estimert arbeid: 20-40 timer pixel art*
