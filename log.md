# The Deep Ones — Development Log

---

## 2025-12-28 — Player Display & Control Fixes

### Problem
Flere problemer rapportert:
1. Spiller/båt ikke synlig på skjermen
2. Ingen knapper fungerte
3. Kunne ikke styre snøre opp/ned eller caste
4. Grafikken ble rar når man trykket "S"

### Årsaker identifisert

#### 1. Inkonsistent dock-posisjon
- `CONFIG.dockX = 1000` men `CONFIG.locations.dock.x = 1500`
- Spilleren startet på x=1500 (ved dokken visuelt)
- Men dock-proximity sjekken brukte x=1000
- Resulterte i feil nearDock deteksjon

#### 2. S-tasten sprite-toggle
- "S" toggler `CONFIG.useSprites` mellom true/false
- Ingen sprites er lastet (alle faller tilbake til prosedyral)
- Når sprites var aktivert uten lastet grafikk, ble ting rart

#### 3. Touch-kontroller event-håndtering
- KeyboardEvent manglet `bubbles: true` property
- Events bobled ikke korrekt til document listener
- Førte til at touch-knapper ikke alltid registrerte

#### 4. Forvirrende minigame-knapp
- Knappen viste "PULL" under minigame
- Impliserte en handling, men Space gjør ingenting under minigame
- Spillere visste ikke at de skulle bruke ← → piltaster

### Løsninger

#### 1. Fikset CONFIG.dockX (js/config.js)
```javascript
// Før:
dockX: 1000,

// Etter:
dockX: 1500,  // Must match CONFIG.locations.dock.x
```

#### 2. Sikret S-tasten sprite-toggle (js/input.js)
- Sjekker nå om sprites faktisk er lastet før toggle
- Forhindrer aktivering av sprite-modus uten tilgjengelige sprites
- Logger melding til console hvis ingen sprites

#### 3. Forbedret touch event-håndtering (js/input.js)
```javascript
const event = new KeyboardEvent('keydown', {
    key: key,
    code: key === ' ' ? 'Space' : key,
    keyCode: key === ' ' ? 32 : key.charCodeAt(0),
    which: key === ' ' ? 32 : key.charCodeAt(0),
    shiftKey: false,
    bubbles: true,       // Viktig!
    cancelable: true
});
```

#### 4. Endret minigame-knapp tekst (js/input.js)
- "PULL" → "◀ ▶" under minigame
- Indikerer at spilleren skal bruke piltastene

#### 5. Oppdatert kontrollhint (game.html)
```html
<!-- Før: -->
[SPACE] Cast | [Arrows] Move | [E] Harbor | [P] Pet | [M] Mute | [F] Fullscreen | [O] Settings | [H] Help

<!-- Etter: -->
[SPACE] Cast/Reel | [↑↓] Depth | [←→] Move | [J] Journal | [T] Time
```

### Endringer
- `js/config.js`: Fikset dockX til 1500
- `js/input.js`: Sikret sprite-toggle, forbedret touch events, endret minigame-knapp
- `game.html`: Oppdatert kontrollhint

### Testing
1. Start spillet og trykk "NEW GAME"
2. Båten skal vises ved dokken
3. [E] skal fungere for å åpne harbor-menyen
4. SPACE skal caste snøret
5. ↑↓ skal justere dybde under fisking
6. Touch-kontroller skal fungere på mobil
7. S-tasten skal ikke ødelegge grafikken (hvis ingen sprites)

---

## 2025-12-28 — Celestial Orbit System (Sol/Måne-bane)

### Gjort

#### 1. Celestial Orbit System (js/systems.js)
- Sol og måne følger nå en naturlig bue over himmelen
- Posisjon beregnes dynamisk basert på `dayProgress`
- **Solen**:
  - Synlig fra dawn (0) til dusk (0.75)
  - Stiger i øst (høyre), høyest midt på dagen, går ned i vest (venstre)
  - Bruker sinus-kurve for naturlig buebevegelse
- **Månen**:
  - Synlig fra dusk (0.5) til dawn (0.25)
  - Følger samme bue-logikk som solen

#### 2. Dynamiske sol-farger basert på høyde
- Lav ved horisont: varm oransje/rød (soloppgang/nedgang)
- Middels høyde: gylden gul
- Senit: lys gul/hvit
- Atmosfærisk effekt: solen er større ved horisonten
- Solstråler tegnes ved lav horisont for dramatisk effekt

#### 3. Forbedret måne-rendering
- Gradient-basert måneskive med kratere
- Glow-effekt som varierer med høyde
- Månelys-søyle mot horisonten når månen er lav
- Horror-element: uhyggelig "ansikt" på månen ved lav sanity (<25)

#### 4. Hjelpefunksjoner
- `getSunPosition()` — Returnerer x, y, heightRatio, isRising/isSetting
- `getMoonPosition()` — Samme struktur som sol
- `getSunColor(heightRatio)` — Dynamisk farge basert på høyde
- `getMoonColor(heightRatio)` — Månens farger og glow
- `lerpHexColor(hex1, hex2, t)` — Interpolering mellom hex-farger

### Endringer

**js/systems.js:**
- Lagt til CELESTIAL ORBIT SYSTEM seksjon (~100 linjer)
- Nye funksjoner: getSunPosition(), getMoonPosition(), getSunColor(), getMoonColor(), lerpColor(), lerpHexColor()

**js/fallbacks.js:**
- Fullstendig refaktorert `FALLBACKS.sun` til å bruke dynamisk posisjon
- Fullstendig refaktorert `FALLBACKS.moon` til å bruke dynamisk posisjon
- Sol: Ytre glow, indre glow, kjerne med gradient, stråler ved horisont
- Måne: Gradient-overflate, kratere, månelys-søyle, horror-ansikt

### Tekniske beslutninger
- Sol bruker 0-0.75 av dayProgress (dawn→day→dusk)
- Måne bruker 0.5-1.0 + 0-0.25 (dusk→night→dawn)
- Minimal parallax på himmellegemer (0.1x for sol, 0.05x for måne)
- Bueberegning bruker `Math.sin(progress * PI)` for naturlig kurve

### Testing
- Test ved å endre `game.dayProgress` manuelt eller bruke [T] for å bytte tid
- Observer at sol/måne beveger seg gradvis over himmelen
- Ved tidsskifte ser man overgangen mellom himmellegemer

### Neste prioritet
- [ ] Claude API-integrasjon for dynamisk NPC-dialog
- [ ] Flere endings variants
- [ ] Sprite-art for alle creatures

---

## 2024-12-27 — v1.0 Full Feature Release

### Gjort

#### 1. Lyd/Musikk-system (js/audio.js)
- Web Audio API-basert lydmanager med prosedyral lydgenerering
- Lydeffekter: splash, cast, bite, reel, catch, linesnap, creak, thunder, rain, wind, etc.
- Ambient lyd-system som reagerer på vær og sanity
- Dynamisk musikk som endrer stemning basert på game state
- Mute-toggle med [M] keybind
- Volume-kontroll for master, music, SFX, ambient

#### 2. Random Events-system (js/events.js)
- 12+ unike events med visuelle effekter:
  - **Floating Debris** — Finn bonus gold
  - **Whale Sighting** — Sanity boost
  - **Seagull Landing** — Hunden reagerer
  - **School of Fish** — Økt bite chance
  - **Ghost Ship** — Creepy atmosfære om natten
  - **Cult Ritual** — Mystisk chanting i The Void
  - **Strange Lights** — Undervannslys
  - **Ancient Whispers** — Stemmer fra dypet
  - **Rainbow** — Etter regn
  - **Sea Monster Glimpse** — Skummel skygge
  - **Lucky Find** — Skattejakt
  - **Dog Finds Item** — Hunden finner ting
- Betingelsesbasert triggering (lokasjon, tid, vær, sanity)
- Full visuell rendering for alle events

#### 3. Streak/Combo-system
- Streak-teller for påfølgende fangster
- Combo-multiplier opp til 2x value
- Visuell indikator med gull-animasjon og puls
- Timer som resetter ved 5 sekunder uten fangst
- Integrert med daily challenges

#### 4. Daily Challenges-system
- 3 tilfeldige challenges per dag
- 12 forskjellige challenge-typer:
  - Zone-baserte fangster (surface, mid, deep)
  - Gold-målsetninger
  - Pet dog challenges
  - Location exploration
  - Night/storm fishing
  - Streak achievements
  - Lore hunting
- Belønning: 25-50g ved fullføring
- Progress-tracking og completion-notifikasjoner

#### 5. Nye NPCer i landsbyen
- **The Innkeeper** (Gilman House)
  - Mystiske hints om landsbyen
  - Reaksjon på lav sanity
  - Alltid tilgjengelig
- **Father Waite** (Order of Dagon)
  - Låses opp ved sanity < 40
  - Tilbyr "blessings" og forbidden knowledge
  - Creepy cultist dialog
- **Strange Child**
  - Dukker opp tilfeldig om natten (30% sjanse)
  - Profetiske og cryptiske replikker
  - Hinter om endings

#### 6. Settings-meny (js/settings.js)
- [O] keybind for å åpne
- **Audio settings:**
  - Master volume
  - Music volume
  - SFX volume
  - Ambient volume
  - Mute toggle
- **Graphics settings:**
  - Quality (low/medium/high)
  - Particles on/off
  - Screen shake on/off
  - Weather effects on/off
- **Gameplay settings:**
  - Auto-save on/off
  - Tutorial on/off
  - Touch controls (auto/always/never)
- **Controls tab:** Full oversikt over alle keybinds
- Lagres til LocalStorage

#### 7. Fullscreen-modus
- [F] keybind for toggle
- Fullscreen API-støtte (webkit, ms)
- Hint på mobile enheter
- Bedre immersjon på små skjermer

#### 8. Visuelle effekter
- **Water reflections:** Båten speiler seg i vannet med bølge-distorsjon
- **Screen shake:** Ved store/sjeldne fangster (value >= 180)
- **Glitch effect:** Ved abyss creatures (value >= 500)
- **Scanlines og color offset** ved lav sanity
- Settings-kontrollert (kan slås av)

### Endringer

**Nye filer:**
- `js/audio.js` — 320 linjer, komplett lydmanager
- `js/events.js` — 450 linjer, random events-system
- `js/settings.js` — 350 linjer, settings og fullscreen

**js/config.js:**
- Lagt til NPCS objekt med 4 NPCer og deres dialoger
- Lagt til DAILY_CHALLENGES array med 12 challenges

**js/game-state.js:**
- Lagt til events state
- Lagt til streak state (count, timer, maxStreak, comboMultiplier)
- Lagt til dailyChallenges state
- Lagt til visualEffects state (bigCatchShake, glitchIntensity)

**js/ui.js:**
- Lagt til drawStreakIndicator()
- Lagt til updateStreak(), addToStreak()
- Lagt til drawDailyChallenges(), generateDailyChallenges(), checkDailyChallengeProgress()
- Lagt til drawWaterReflection(), applyBigCatchShake(), drawGlitchEffect(), triggerGlitch()
- Lagt til drawMuteIndicator(), drawFullscreenHint()

**js/input.js:**
- Lagt til [M] for mute toggle
- Lagt til [F] for fullscreen toggle
- Lagt til [O] for settings menu
- Integrert handleSettingsInput()
- Streak-bonus ved fangst
- Daily challenge progress tracking
- Visual effects triggers ved store fangster
- Lydeffekter ved kasting

**js/main.js:**
- Integrert updateEvents(), updateStreak()
- Integrert AudioManager.updateAmbient() og updateMusic()
- Integrert drawEventVisuals(), drawWaterReflection(), drawGlitchEffect()
- Integrert drawStreakIndicator(), drawDailyChallenges()
- Integrert drawSettingsMenu(), drawMuteIndicator()
- AudioManager.init() ved oppstart
- Audio context resume på første brukerinteraksjon
- Daily challenges generering ved oppstart

**game.html:**
- Versjon oppdatert til 1.0
- Lagt til script includes for audio.js, events.js, settings.js
- Oppdatert controls hint med [M] [F] [O] [H]

**js/save.js:**
- Versjon oppdatert til 1.0

### Keybinds oppdatert
- [M] — Toggle mute
- [F] — Toggle fullscreen
- [O] — Settings menu
- [H] — Help/controls oversikt

### Tekniske beslutninger
- Web Audio API valgt for prosedyral lyd (ingen asset-filer nødvendig)
- Events bruker condition-objekter for fleksibel triggering
- Streak multiplier capped til 2x for balanse
- Settings lagres separat fra game save
- Visual effects er opt-out via settings

### Neste prioritet
- [ ] Claude API-integrasjon for dynamisk NPC-dialog
- [ ] Flere endings variants
- [ ] Multiplayer/leaderboard features
- [ ] Sprite-art for alle creatures

### Notater
- v1.0 markerer "feature complete" for core gameplay
- Prosedyral lyd gir overraskende god atmosfære uten assets
- Daily challenges øker replay value betydelig
- Random events gjør fishing mindre repetitivt
- Settings-meny gjør spillet mer tilgjengelig

---

## 2024-12-25 — Initial Development

### Gjort
- Konseptutvikling: "Cozy Cosmic Horror" fiskespill
- Researched Cast n Chill for inspirasjon
- Laget første prototype med prosedyral grafikk
- Implementert parallax layer system med 15+ lag
- Lagt til 4 tider på døgnet (dawn, day, dusk, night)
- Designet 16 creatures fordelt på 4 dybdesoner
- Implementert sanity-system med visuelle effekter
- Lagt til båt med hund, fisker, lanterne
- Bygget asset-ready versjon med sprite-støtte
- Skrevet komplett dokumentasjon

### Filer opprettet
- `index.html` — Første prototype
- `asset-ready.html` — Oppgradert versjon med sprite-system
- `ASSET-GUIDE.md` — Guide for pixel art assets
- `SYSTEM-PROMPT.md` — Mega system prompt for videre utvikling
- `agents.md` — AI-instruksjoner
- `log.md` — Denne filen

### Tekniske beslutninger
- **Vanilla JS** — Ingen frameworks for enkel portabilitet
- **Prosedyral fallback** — Spillet fungerer uten sprites
- **Layer-basert parallax** — Enkel å bytte ut enkelt-lag
- **Config-objekt** — Lett å justere parametre

### Neste steg
1. Sette opp GitHub repo
2. Implementere NPC fiskehandler med Claude API
3. Lage butikk-system
4. Begynne på pixel art assets

### Notater
- Cast n Chill bruker landskapsmaleri-stil pixel art
- Sanity-systemet bør være subtilt, ikke in-your-face
- Hunden er viktig for "cozy" følelsen
- Creature descriptions er nøkkelen til horror-tonen

---

## 2024-12-26 — NPC & Shop System

### Gjort
- Implementert NPC "Old Marsh" med prosedyral grafikk
  - Gammel fisker ved brygga med pipe og sou'wester-hatt
  - Subtil animasjon (bob, blinking, røyk fra pipe)
- Bygget komplett butikk-system med 4 faner:
  - **SELL FISH** — Selg fisk fra inventory
  - **RODS** — 4 fiskestenger med ulike dybdegrenser
  - **LURES** — 4 typer agn med bonuser for ulike soner
  - **BOATS** — 3 båter med forskjellig lagring og hastighet
- Implementert progression-system:
  - Fiskestenger låser opp dypere soner
  - Agn gir bonus bite-chance i matchende sone
  - Båter påvirker inventory-størrelse og bevegelseshastighet
- NPC dialog-system med kontekst-baserte replikker:
  - Hilsener, lav sanity-advarsler, sjeldne fangster, kjøp/salg
- Inventory-system: Fisk lagres i inventory, selges hos Marsh
- UI oppdatert med inventory og utstyr-visning

### Endringer
- `asset-ready.html`:
  - Lagt til SHOP config med rods, lures, boats
  - Lagt til NPC_DIALOGS objekt
  - Utvidet game state med equipment, inventory, shop
  - Nye funksjoner: drawDock(), drawOldMarsh(), drawShopUI()
  - Oppdatert input-håndtering for butikk
  - Equipment påvirker gameplay (dybde, hastighet, bite-chance)

### Tekniske beslutninger
- Inventory-system i stedet for instant sell — gir grunn til å besøke NPC
- Lures brukes opp ved fangst — ressurshåndtering
- Full inventory = auto-sell til halv pris — straffer manglende planlegging
- Butikk-tabs med keyboard navigation (TAB, piler, SPACE)

### Neste
- [ ] Legg til lyd/musikk
- [ ] Flere creatures
- [ ] Narrativ/lore fragments
- [ ] Claude API-integrasjon for dynamisk NPC-dialog

### Notater
- Old Marsh's design: Mystisk, ikke truende, men vet mer enn han sier
- Butikk-dialog tilpasser seg spillerens tilstand (sanity, sjeldne fangster)
- Brygga plassert til venstre for parallax-effekt

---

## 2024-12-27 — Massive Feature Update

### Gjort

#### 1. Utvidet spillverden med scrolling
- Verdensbredde utvidet fra ~1200px til 4000px
- Båten kan nå ro fritt fra venstre til høyre
- Kamera følger båten med parallax-effekt
- Grenser: worldMinX (50) til worldMaxX (3950)

#### 2. Nye lokasjoner
- **Marsh's Dock** (x=180) — Startpunkt, butikk
- **The Shallows** (x=500) — Trygt farvann for nybegynnere
- **Coral Reef** (x=1200) — Fargerike koraller, mid-tier fisk
- **The Wreck** (x=2000) — Skipsvrak fra SS Dagon, sjeldne fangster
- **Deep Trench** (x=3200) — Farlig, abyss-creatures
- **The Void** (x=3800) — Ekstrem fare, mystiske ting
- Minimap nederst til høyre viser alle lokasjoner
- Lokasjonsbaserte bonuser for bite-chance

#### 3. Vær-system
- 5 værtyper: Clear, Cloudy, Rain, Fog, Storm
- Dynamisk vær som endrer seg over tid
- Vær påvirker:
  - Bite-chance (storm = +50%)
  - Sanity-drain (storm/fog tapper sanity)
  - Visibilitet (tåke = 40%)
- Visuelle effekter: regndråper, tåke-overlay, lyn-glimt

#### 4. Lore Fragments / Collectibles
- 12 lore fragments spredt rundt i verden
- Flytende flasker som samles inn ved å seile over dem
- Historier om Dagon, SS Dagon-vraket, Marsh's hemmeligheter
- Popup-vindu når lore blir funnet

#### 5. Hund som gameplay-element
- Hunden har happiness-meter
- [P] for å klappe hunden — gir +3 sanity, +25 happiness
- Hunden reagerer på:
  - Sjeldne fisk (bjeffer)
  - Dypt vann (whimper)
  - Bite (excited bark)
- Animasjoner: idle, wag, alert, sleep
- Dog indicator i hjørnet med hint

#### 6. Fisking-minigame
- Ved bite starter nå et minigame
- Fisken beveger seg på en bar
- Bruk [←→] for å holde markøren i grønn sone
- Tension-meter: for høy = snøret ryker
- Fish stamina: tøm den for å fange fisken
- Vanskelighetsgrad basert på fiskens rarity

#### 7. Naturlig tid-progresjon
- Tiden går automatisk: dawn → day → dusk → night
- Full dag-syklus = 3 minutter
- [Shift+T] for å pause/resume tid
- [T] for manuell cycling (som før)
- Layers oppdateres automatisk ved tidsendring

#### 8. Utvidede sanity-effekter
- **Screen shake** ved sanity < 30
- **Vignette** som øker ved lav sanity
- **Whispers** — creepy tekst på skjermen ved sanity < 25
- **Hallucinations** — skygger med røde øyne ved sanity < 20
- Lokasjonsbasert sanity:
  - Dock: +0.05 recovery
  - Trench: -0.01 drain
  - Void: -0.03 drain, ingen recovery

### Endringer i `asset-ready.html`
- **CONFIG**: Lagt til worldWidth, worldMinX, worldMaxX, locations, timeProgressionSpeed, dayDuration
- **WEATHER**: Nytt objekt med 5 værtyper og modifiers
- **LORE_FRAGMENTS**: 12 lore-historier med lokasjoner
- **game state**: Utvidet med weather, dayProgress, currentLocation, dog, minigame, sanityEffects, loreBottles, locationBonuses
- **Nye funksjoner**:
  - updateWeather(), drawWeatherEffects()
  - updateTimeProgression()
  - getCurrentLocation(), drawLocationIndicator()
  - updateDog(), petDog(), drawDogIndicator()
  - initLoreBottles(), updateLoreBottles(), drawLoreBottles(), drawLorePopup()
  - startMinigame(), updateMinigame(), endMinigame(), drawMinigame()
  - updateSanityEffects(), drawSanityEffects()
  - drawLocationFeatures(), drawShipwreck(), drawCoralReef(), drawTrenchMarker(), drawVoidBuoy()
  - drawWeatherIndicator()
  - handleMinigameInput()
- **update()**: Integrert alle nye systemer
- **render()**: Integrert alle nye draw-funksjoner
- **Input**: Nye keybinds [P] pet dog, [Shift+T] pause time, minigame controls

### Tekniske beslutninger
- Verden er 4x større, men parallax-systemet håndterer det elegant
- Lore bottles spawnes ved game start basert på unfound fragments
- Minigame bruker enkel zonetracking for tilgjengelighet
- Sanity-effekter er subtile men merkbare
- Lokasjoner har distinkte visuelle elementer

### Neste prioritet
- [ ] Lyd/musikk system
- [ ] Save/Load med LocalStorage
- [ ] Lore collection viewer ([L] keybind)
- [ ] Flere creatures per lokasjon
- [ ] Claude API for dynamisk NPC-dialog

### Notater
- Skipsvraket er haunted om natten
- The Void har en mystisk obelisk
- Hunden er en viktig sanity-mekanikk
- Storm-vær gir beste fangst, men tapper sanity
- Tåke blir mer sannsynlig ved lav sanity

---

## 2024-12-27 — Save/Load & Lore Viewer Update

### Gjort

#### 1. Save/Load System med LocalStorage
- Komplett save-system som lagrer all spillprogress
- Lagrer: money, sanity, equipment, inventory, loreFound, shop progress, dog happiness
- `saveGame()` — Manuell lagring med [Shift+S]
- `loadGame()` — Laster lagret spill
- `hasSaveGame()` / `getSaveInfo()` — Sjekker for eksisterende save
- Auto-save ved viktige hendelser:
  - Etter fangst av fisk
  - Etter butikkbesøk
  - Etter å finne lore fragment
- Save notification popup vises i 2 sekunder

#### 2. Lore Collection Viewer
- Nytt [L] keybind åpner "Forbidden Knowledge" viewer
- Viser alle 12 lore fragments med paginering (4 per side)
- Funne fragments viser tittel, tekst-snippet og lokasjon
- Ukjente fragments viser "???" med hint om hvor de finnes
- Navigering med [←/→] piltaster
- Lukkes med [ESC] eller [L]

#### 3. Title Screen Oppdatering
- "CONTINUE" knapp vises hvis save eksisterer
- Viser save-info: tidspunkt, gold, lore-telling, total fangst
- Versjonsnummer oppdatert til v0.5

### Endringer i `asset-ready.html`
- **game state**: Lagt til `loreViewer` objekt
- **Nye funksjoner**:
  - `saveGame()`, `loadGame()`, `hasSaveGame()`, `deleteSave()`, `getSaveInfo()`
  - `autoSave()`, `showSaveNotification()`, `drawSaveNotification()`
  - `drawLoreCollection()`, `handleLoreViewerInput()`
  - `continueGame()`, `initTitleScreen()`
- **Input**: Nye keybinds [L] lore viewer, [Shift+S] save
- **render()**: Integrert `drawLoreCollection()` og `drawSaveNotification()`
- **UI**: Oppdatert controls-tekst med nye keybinds

### Tekniske beslutninger
- LocalStorage brukes for persistens (enkelt, ingen backend nødvendig)
- Auto-save er diskret — notification forsvinner etter 2 sekunder
- Lore viewer er fullscreen overlay som blokkerer gameplay
- Save-versjon inkludert for fremtidig migrering

### Neste prioritet
- [ ] Lyd/musikk system
- [ ] Lokasjonsbaserte creatures
- [ ] Fishing journal / bestiary
- [ ] Achievements

### Notater
- Save-systemet gjør spillet mye mer "sticky"
- Lore viewer gir incentiv til å utforske alle lokasjoner
- Vurder å legge til "Delete Save" knapp på title screen

---

## 2024-12-27 — Asset Structure & Modular Refactor

### Gjort

#### 1. Komplett Asset Directory Struktur
Opprettet full mappestruktur basert på GFX-ASSET-LIST.md:
- `backgrounds/dawn/` - sky.png, stars.png, sun.png
- `backgrounds/day/` - sky.png, clouds-far.png, clouds-near.png, sun.png
- `backgrounds/dusk/` - sky.png, stars.png, clouds.png, sun.png, moon.png
- `backgrounds/night/` - sky.png, stars.png, moon.png, clouds.png
- `backgrounds/land/` - mountains (3), trees (2), lighthouse.png, reeds.png
- `backgrounds/water/` - surface.png, reflection.png
- `backgrounds/underwater/` - gradient.png, lightrays.png, rocks (2), seaweed (2), particles.png, shadows.png
- `sprites/boat/` - boat.png, fisher.png, dog.png, bobber.png, lantern.png, rod.png
- `sprites/fish/surface/` - 4 surface creatures
- `sprites/fish/mid/` - 4 mid creatures
- `sprites/fish/deep/` - 4 deep creatures
- `sprites/fish/abyss/` - 4 abyss creatures
- `sprites/ui/` - catch-popup.png, journal-bg.png, sanity-bar.png, depth-meter.png, coin.png
- `sprites/effects/` - bubbles.png, splash.png, glow.png, tentacle.png

#### 2. Placeholder Art Generator
Laget Python-script (`generate_placeholders.py`) som genererer 54 placeholder PNG-filer:
- Gradient skies for alle 4 tider
- Prosedyrale fjell, trær, skyer
- Vannoverflate med bølger
- Tang og undervannselementer
- Fiske-silhuetter med riktige størrelser
- UI-elementer med rammer

#### 3. Modulær Refaktorering
Splittet `asset-ready.html` (3700+ linjer) til 13 separate moduler:

| Modul | Linjer | Beskrivelse |
|-------|--------|-------------|
| `js/config.js` | 114 | CONFIG, WEATHER, LORE, SHOP, NPC_DIALOGS |
| `js/palettes.js` | 58 | TIME_PALETTES, getTimePalette() |
| `js/game-state.js` | 101 | game objekt med all state |
| `js/creatures.js` | 72 | CREATURES, creature functions |
| `js/assets.js` | 253 | PARALLAX_LAYERS, SPRITES, asset loader |
| `js/fallbacks.js` | 425 | Prosedyrale tegne-funksjoner |
| `js/systems.js` | 314 | Weather, time, dog, lore, minigame, sanity |
| `js/npc.js` | 358 | Old Marsh, dock, shop system |
| `js/rendering.js` | 509 | Fish, boat, locations, lore bottles |
| `js/ui.js` | 185 | UI rendering, indicators |
| `js/save.js` | 144 | Save/Load system |
| `js/input.js` | 197 | Keyboard input handling |
| `js/main.js` | 205 | Game loop, init functions |

**Total: 2935 linjer** (mer lesbar og vedlikeholdbar)

#### 4. Ny Game Entry Point
Opprettet `game.html` som loader alle moduler i riktig rekkefølge.

### Filer opprettet
- `generate_placeholders.py` — Asset generator script
- `game.html` — Ny modular entry point
- `js/*.js` — 13 JavaScript moduler

### Tekniske beslutninger
- Bruker standard `<script>` tags for enkelthet (ingen bundler)
- Moduler lastes i dependency-rekkefølge
- Beholder `asset-ready.html` som backup/referanse
- Placeholder art bruker riktige størrelser fra GFX-ASSET-LIST.md
- Versjonsnummer oppdatert til 0.6

### Neste prioritet
- [ ] Teste at modulær versjon fungerer korrekt
- [ ] Lyd/musikk system
- [ ] Claude API-integrasjon for dynamisk NPC-dialog
- [ ] Ekte pixel art for å erstatte placeholders

### Notater
- Modularisering gjør det enklere å vedlikeholde og utvide
- Placeholder art har riktige proporsjoner for enkel utskifting
- Fish-sprites er organisert i underkataloger per dybdesone
- Generator-scriptet kan gjenbrukes for å lage nye placeholders

---

## 2024-12-27 — Game Design Document

### Gjort

#### Opprettet GAME-DESIGN.md
Komplett Game Design Document basert på Cast n Chill + Deep Regrets inspirasjon:
- **Kjernedesign-beslutninger** — Fri seiling, meny-basert landsby, full Lovecraft
- **Inspirasjonskilder** — "Cozy until it isn't" blanding
- **Kjerneloop** — Fisk → Selg → Kjøp → Dypere → Sanity tap → Transformasjon
- **Progresjonsstige** — Early (0-500g) → Mid (500-2000g) → Late (2000-5000g) → End (5000g+)
- **Transformasjonssystem** — 5 stages fra Human til Deep One
- **Verden** — 6000px bred med 6 soner (Sandbanke → Shallows → Sunset Cove → Innsmouth → Reef → Deep)
- **Dybdeprofil** — Sandbunn 40m, Vrak 100m, Abyss 200m+
- **Landsby meny-system** — Butikk, hvile, journal
- **Butikk-dialog** — Endrer seg basert på sanity
- **3 Endings** — The Deep One (Embrace), The Survivor (Resist), The Prophet (Secret)
- **Endless Mode** — Etter ending med achievements/completion
- **Cult/Lore** — Order of Dagon, fiskelore, environmental storytelling

### Filer opprettet
- `GAME-DESIGN.md` — Komplett Game Design Document

### Tekniske beslutninger
- GDD er separat fra teknisk dokumentasjon (SYSTEM-PROMPT.md)
- Bruker Markdown-tabeller og ASCII art for oversiktlighet
- Dokumentet fungerer som roadmap for implementering

### Neste prioritet
- [ ] Utvide verden til 6000px (fra 4000px)
- [ ] Implementere transformasjonssystem visuelt
- [ ] Legge til nye soner (Sandbanke, Sunset Cove)
- [ ] Implementere endings-system
- [ ] Endless Mode etter ending

### Notater
- Verden skal utvides fra 4000px til 6000px
- Transformasjon er inspirert av Deep Regrets brettspill
- "Cozy until it isn't" er kjernen i spillopplevelsen
- Multiple endings gir replay value

---

## 2024-12-27 — Expanded World & Transformation System

### Gjort

#### 1. Utvidet verden til 6000px
- Verden er nå 50% større (fra 4000px til 6000px)
- Lagt til 2 nye lokasjoner:
  - **Sandbank** (x=200) — Vestlig grense, grunt vann, trygt område
  - **Sunset Cove** (x=1000) — Vakker ved solnedgang, mystisk om natten
- Dock flyttet til sentrum (x=1500, omdøpt til "Innsmouth Harbor")
- Alle eksisterende lokasjoner reposisjonert for bedre progresjon

#### 2. Transformasjonssystem (Deep Regrets-inspirert)
- 5 stages basert på sanity:
  - **Human** (100-70) — Normal gameplay
  - **Touched** (70-40) — Fisk biter oftere
  - **Changing** (40-20) — "Noe er galt med deg"
  - **Becoming** (20-1) — Nesten monster
  - **Deep One** (0) — Full transformasjon
- Visuell indikator i UI med stage-navn og beskrivelse
- Physical change notifications ved stage-overgang
- Transformation bite bonus (høyere stage = fisk biter mer)
- Visuell data for fisker-sprite endring (skin color, eye size, gills, webbing)

#### 3. Innsmouth Village Menu
- [E] åpner nå village-meny i stedet for shop direkte
- Menu options:
  - **Old Marsh's Bait & Tackle** — Åpner butikken
  - **Rest Until Dawn** — Gjenopprett +30 sanity, skipper til dawn
  - **Fishing Journal** — Se alle fangede fisk
  - **Return to Sea** — Lukk menyen
- Rest-funksjon gjenoppretter også hundens happiness

#### 4. Fishing Journal/Bestiary
- [J] åpner journal fra hvor som helst
- Viser alle creatures organisert etter dybdesone
- Discovered creatures viser:
  - Navn og beskrivelse
  - Value, sanity loss, rarity
- Undiscovered creatures viser "???"
- Paginering mellom soner (Surface, Mid, Deep, Abyss)

#### 5. Story Flags System
- Tracking for endings:
  - metMarsh, heardWhispers, sawVision
  - foundAllLore, caughtUnnamed, reachedVoid
  - transformationStarted
- Creature zone tracking for transformation

### Endringer

**config.js:**
- Utvidet worldWidth til 6000
- Reposisjonert alle lokasjoner med maxDepth og zone
- Lagt til 2 nye lore fragments (14 total)
- Lagt til TRANSFORMATION config med stages og physicalSigns

**game-state.js:**
- Oppdatert locationBonuses med nye soner og sanityMod
- Lagt til transformation state (stage, totalSanityLost, creaturesCaught)
- Lagt til journal state (open, page, discovered)
- Lagt til villageMenu state
- Lagt til storyFlags for endings

**systems.js:**
- Lagt til transformation system (getTransformationStage, updateTransformation, etc.)
- Lagt til journal system (openJournal, closeJournal, addToJournal, drawJournal)
- Lagt til village menu system (openVillageMenu, restAtVillage, drawVillageMenu, villageMenuAction)

**rendering.js:**
- Lagt til drawSandbank() og drawSunsetCove()
- Oppdatert drawLocationFeatures() med nye lokasjoner

**npc.js:**
- Oppdatert dock prompt til "[E] Innsmouth Harbor"

**input.js:**
- Lagt til handleJournalInput() og handleVillageMenuInput()
- [E] åpner nå village menu i stedet for shop
- [J] toggle for journal
- Creature tracking ved fangst (addToJournal, storyFlags)

**save.js:**
- Versjon oppdatert til 0.7
- Lagrer transformation, journal.discovered, og storyFlags
- Loader nye state-felt med fallbacks

**game.html:**
- Versjon oppdatert til 0.7
- Kontrolltekst oppdatert med [J] Journal og [E] Harbor

### Tekniske beslutninger
- Village menu som hub gir bedre UX enn direkte shop-åpning
- Transformation-visuals er data-drevet for enkel sprite-bytte
- Journal bruker zone-paginering for oversiktlighet
- Story flags er forberedt for endings-implementering

### Neste prioritet
- [ ] Implementere endings-system (3 endings)
- [ ] Lyd/musikk
- [ ] Claude API-integrasjon for dynamisk NPC-dialog
- [ ] Lokasjonsbaserte creatures

### Notater
- Transformasjonssystemet er kjernen i "horror"-aspektet
- Rest-funksjonen balanserer sanity-drain i late-game
- Journal gir grunn til å utforske alle dybdesoner
- Village menu åpner for fremtidige features (tavern, church, etc.)

---

## 2024-12-27 — Endings, Achievements & Location-Based Creatures

### Gjort

#### 1. Endings System (3 endings)
- **The Deep One** (Embrace) — Triggers when sanity reaches 0
  - Full transformation sequence with scene text
  - Credits scene with ending description
  - Unlocks Endless Mode
- **The Survivor** (Resist) — Triggers when player leaves map after catching The Unnamed with sanity > 30
  - Escape sequence with bittersweet narrative
  - Credits and Endless Mode unlock
- **Prophet** (Secret) — Triggers with all lore, The Unnamed, and sanity 20-40
  - Ambiguous transcendence ending
  - Rarest achievement

#### 2. Achievements System (20 achievements)
- **Fishing achievements**: First Bite, Surface Dweller, Into the Blue, Depths Unknown, Abyss Walker
- **Wealth achievements**: Getting Started (100g), Thousandaire (1000g), Rich Beyond Reason (5000g)
- **Exploration achievements**: Edge of Nothing (The Void), Wanderer (all locations)
- **Lore achievements**: Curious Mind, Truth Seeker, Forbidden Knowledge
- **Sanity achievements**: Brink of Madness, Changed
- **Special achievements**: Good Boy (pet 50x), Storm Chaser, Night Fisher
- **Ending achievements**: One for each ending
- Achievement viewer with [A] keybind
- Pop-up notification when achievement unlocks

#### 3. Location-Based Creature Spawning
- Each location now has weighted creature pools:
  - Sandbank: 100% surface
  - Shallows: 80% surface, 20% mid
  - Sunset Cove: 60% surface, 40% mid
  - Dock: 90% surface, 10% mid
  - Reef: 20% surface, 70% mid, 10% deep
  - Shipwreck: 10% surface, 30% mid, 50% deep, 10% abyss
  - Trench: 10% mid, 60% deep, 30% abyss
  - Void: 20% deep, 80% abyss
- Weights adjusted by rod depth capability

#### 4. Endless Mode
- Unlocks after completing any ending
- Sanity reset to 50 for continued play
- Endless Mode indicator in UI
- Full save/load support

### Endringer

**config.js:**
- Added ENDINGS config with 3 ending definitions
- Added ACHIEVEMENTS config with 20 achievements

**game-state.js:**
- Added `ending` state (triggered, current, phase, timer, etc.)
- Added `endlessMode` boolean
- Added `achievements` state (unlocked, stats, notification, viewerOpen)
- Added `visitedLocations` to storyFlags

**systems.js:**
- Added ENDING_SCENES with narrative text for each ending
- Added ending functions: checkEnding(), triggerEnding(), updateEnding(), drawEndingScene(), startEndlessMode()
- Added achievement functions: unlockAchievement(), checkAchievements(), updateAchievementNotification(), drawAchievementNotification()
- Added achievements viewer: openAchievementsViewer(), closeAchievementsViewer(), drawAchievementsViewer()
- Added getLocationCreaturePool() for location-based creature weights

**creatures.js:**
- Updated getCreature() to use location-based pool weights
- Added transformation bite bonus integration

**main.js:**
- Integrated updateEnding(), checkEnding(), checkAchievements(), updateAchievementNotification()
- Added drawEndingScene(), drawAchievementsViewer(), drawAchievementNotification() to render
- Added Endless Mode indicator
- Track visited locations for achievements

**input.js:**
- Added handleEndingInput() for ending scene controls
- Added handleAchievementsViewerInput() for viewer navigation
- Added [A] keybind for achievements viewer toggle
- Track nightCatches and stormCatches on catch

**npc.js:**
- Track totalGoldEarned in shopAction() and sellAllFish()

**save.js:**
- Version updated to 0.8
- Added achievements, ending, and endlessMode to save data
- Added restoration of these states on load

**game.html:**
- Version updated to 0.8
- Updated controls text with [A] Achievements

### Tekniske beslutninger
- Endings use phase-based state machine (fadeout → scene → credits → complete)
- Achievements check runs every frame for immediate feedback
- Location weights combine with rod depth to prevent impossible catches
- Endless Mode is a flag that disables ending checks

### Neste prioritet
- [ ] Lyd/musikk system
- [ ] Claude API-integrasjon for dynamisk NPC-dialog
- [ ] Polering av endings (visuelle effekter, musikk)
- [ ] Mer lore content

### Notater
- Prophet ending er vanskeligst å oppnå (krever presisjon)
- Location-based creatures gir bedre grunn til å utforske
- Achievements gir lang-tid engagement
- Endless Mode lar spillere fortsette etter "winning"

---

## 2024-12-27 — Major Polish & Feature Expansion

### Gjort

#### 1. Visuell transformasjon av fiskeren
- Fiskerens utseende endrer seg basert på transformasjonsstadium
- Hudfarge går fra rosa → blek → grønnlig → turkis
- Øynene blir større ved lavere sanity
- Gjeller synlige ved stage 3+ (animert pustebevegelse)
- Webbed hands synlige ved stage 2+
- Glow-effekt rundt hodet ved transformasjon

#### 2. Endings polering
- Unik fargepallette per ending:
  - Deep One: blå/turkis toner
  - Survivor: varm gul/oransje
  - Prophet: lilla/mystisk
- Animerte partikler i ending-scener
- Ending-spesifikke visuelle effekter:
  - Deep One: stigende bobler
  - Survivor: lysstråler
  - Prophet: svirvlende symboler
- Pulserende tittel-glow
- Staggered fade-in for credits

#### 3. Achievement feedback forbedring
- Større achievement popup (270x80px)
- Pulserende gullramme
- Glow-effekt på skjermkanten
- Ikon med sirkulær bakgrunn
- Animerte sparkle-partikler
- Forbedret typography

#### 4. Tekst-basert lyd-simulering
- Lydeffekt-system som viser tekst:
  - `*splash*` ved kasting
  - `*creak*` ved båtbevegelse
  - `*BITE!*` ved fiskebitt
  - `*whirrrr*` ved reeling
  - `*caught!*` / `*CAUGHT!*` ved fangst
  - `*KRAKA-BOOM*` ved torden
  - `*whoosh*` ved bølger i storm
- Lydeffekter fader ut og stiger oppover
- Fargekodet basert på type

#### 5. Forbedrede vær-effekter
- **Regn**: Dråper på vannoverflaten med ripple-effekt
- **Tåke**: Rullende tåkelag i 3 dybder
- **Storm**:
  - Prosedyrale lyn-bolter med forgreninger
  - Lynnedslag med flash-effekt
  - Torden-lyd trigger

#### 6. Creature-interaksjoner
- **Double Catch** (5% sjanse): Fanger to av samme fisk
- **Predator Chase** (5-8% sjanse): Større fisk jager opp mindre
  - Harbor Cod → Whisper Eel
  - Pale Flounder → The Mimic
  - Glass Squid → Bone Angler
- **Abyss Call** (3% sjanse): Abyss-creatures kan "kalle" andre

#### 7. Tid/vær-baserte spawns
- 7 nye creatures med tid/vær-preferanser:
  - Dawn Skipjack (dawn only)
  - Storm Petrel Fish (storm only)
  - Fog Phantom (fog only)
  - Thunder Caller (storm only)
  - Twilight Dweller (dusk only)
  - Void Watcher (abyss, alltid)
- Creatures har 2x spawn-bonus i riktig tid/vær
- 0.2-0.3x spawn-sjanse uten riktig betingelse

#### 8. Minigame-variasjon per dybde
- **Surface (standard)**: Normal tracking
- **Mid (erratic)**: Fisken beveger seg uforutsigbart med plutselige retningsendringer
- **Deep (tugOfWar)**: Konstant drag på spillerens markør
- **Abyss (tentacles)**: Interferens-soner som blokkerer synlighet
- Lydeffekter integrert i minigame

#### 9. Dynamisk NPC-dialog utvidelse
- Kontekst-baserte dialoger:
  - Første besøk
  - Veteran-besøk (hver 10. gang)
  - Nattbesøk, duskbesøk, dawnbesøk
  - Storm-besøk
  - Etter Unnamed-fangst
  - Etter abyss-creatures
- Fishing hints fra Marsh
- Lore hints for å hjelpe spillere finne fragments
- Achievement-baserte kommentarer

#### 10. Lore-integrasjon forbedring
- Lore fragments har nå "hints" om creature-spawns
- 8 creatures har "secret info" som låses opp ved å finne relatert lore
- `getSecretCreatureInfo()` funksjon for journal-integrasjon

#### 11. Quality of Life UI forbedringer
- **[H] Hotkey Help**: Full oversikt over alle kontroller
- **Tutorial-system**: Kontekst-baserte tips for nye spillere
  - Vises automatisk ved tidlige handlinger
  - Forsvinner etter 3 fangster

#### 12. Stats-tracking system
- Utvidet stats:
  - `totalFishCaught`
  - `timePlayed` (i sekunder)
  - `longestSanityStreak`
  - `biggestCatch` per zone
- Stats vises i achievements viewer

### Endringer

**config.js:**
- Oppdatert LORE_FRAGMENTS med hints
- Lagt til SECRET_CREATURE_INFO
- Lagt til getSecretCreatureInfo()
- Utvidet NPC_DIALOGS med 10+ nye kategorier

**game-state.js:**
- Lagt til weather.lightningFlash
- Lagt til soundEffects array
- Lagt til hotkeyHelp og tutorial state
- Utvidet achievements.stats

**systems.js:**
- Lagt til sound effect system (addSoundEffect, updateSoundEffects, drawSoundEffects)
- Lagt til trigger-funksjoner for lydeffekter
- Forbedret drawWeatherEffects() med ripples, rullende tåke, lyn
- Lagt til drawLightningBolt()
- Lagt til MINIGAME_TYPES med 4 minigame-varianter
- Oppdatert startMinigame() og updateMinigame() for variasjon
- Forbedret drawEndingScene() med partikler og paletter
- Forbedret drawAchievementNotification() med glow og sparkles

**creatures.js:**
- Lagt til tid/vær-preferanser på creatures
- Lagt til 7 nye creatures
- Lagt til CREATURE_INTERACTIONS
- Lagt til getCreatureTimeWeatherBonus()
- Lagt til checkCreatureInteraction()
- Oppdatert getCreature() for tid/vær-bonuser

**npc.js:**
- Erstattet openShop() med kontekst-basert getContextualDialog()
- Prioritert dialog-system basert på spillstatus

**ui.js:**
- Lagt til drawHotkeyHelp()
- Lagt til drawTutorial()
- Lagt til drawStatsPanel()

**rendering.js:**
- Oppdatert drawBoatProcedural() med transformasjonsvisuals
- Lagt til gjeller, webbed hands, øye-endringer

**input.js:**
- Lagt til [H] for hotkey help
- Integrert lydeffekter ved kasting
- Utvidet stats-tracking ved fangst

**main.js:**
- Integrert updateSoundEffects()
- Integrert drawSoundEffects()
- Integrert drawHotkeyHelp() og drawTutorial()
- Lagt til ambient sound triggers
- Lagt til timePlayed tracking

### Tekniske beslutninger
- Lydeffekt-system bruker tekst i stedet for faktisk lyd (enklere, mer atmospherisk)
- Minigame-typer er data-drevet for enkel utvidelse
- NPC-dialog bruker prioritetssystem for kontekst-sensitivitet
- Lore-hints gir gameplay-verdi til collectibles

### Neste prioritet
- [ ] Faktisk lyd/musikk-system
- [ ] Claude API-integrasjon for dynamisk NPC-dialog
- [ ] Polering av minigame-visuals for nye typer
- [ ] Flere endings/endings variants

### Notater
- Tekst-basert lyd gir overraskende god atmosfære
- Tid/vær-creatures gir grunn til å fiske på forskjellige tidspunkt
- Predator-chase mekanikk gir "bonus catch" følelse
- Tutorial er subtil og ikke påtrengende

---

## 2024-12-27 — Touch Controls & Mobile Support

### Gjort

#### 1. Touch/Mobil-kontroller
- On-screen D-pad for bevegelse (venstre, høyre, opp, ned)
- Action-knapp som endrer tekst basert på game state (CAST/REEL/PULL/OK)
- Snarveisknapper for Pet Dog (🐕), Harbor (⚓), og Journal (📖)
- Automatisk deteksjon av touch-enheter
- Hold-to-move funksjonalitet for kontinuerlig bevegelse
- Fungerer også med mus for testing på desktop

#### 2. Mobil-optimalisering
- Viewport meta tag med user-scalable=no for å hindre zoom
- CSS media queries for touch devices (pointer: coarse)
- Skjuler tastatur-hints på mobil
- Landscape-optimalisert layout for mindre skjermer
- Touch events forhindrer default scroll/zoom oppførsel

#### 3. Responsiv UI
- Touch-knapper tilpasser seg skjermstørrelse
- Landskapsmodus har mindre knapper for bedre spillplass
- Semi-transparente knapper som ikke blokkerer spillet

### Endringer

**game.html:**
- Oppdatert viewport meta tag
- Lagt til ~100 linjer CSS for touch-kontroller
- Lagt til touch-controls div med D-pad og action-knapper
- Versjon oppdatert til 0.9

**js/input.js:**
- Lagt til touchState objekt for touch-tilstand
- Lagt til setupTouchControls() funksjon
- Lagt til handleTouchKeyDown() for å simulere tastaturtrykk
- Lagt til startHoldAction() og stopHoldAction() for kontinuerlig bevegelse
- Lagt til updateTouchActionButton() for dynamisk knappetekst

**js/main.js:**
- Integrert setupTouchControls() i window.onload
- Integrert updateTouchActionButton() i game loop

**js/save.js:**
- Versjon oppdatert til 0.9

### Tekniske beslutninger
- Touch-kontroller simulerer keyboard events for gjenbruk av eksisterende input-håndtering
- CSS media queries (pointer: coarse) brukes for touch-deteksjon
- Hold-intervall på 50ms gir jevn bevegelse uten å overbelaste
- Action-knapp oppdateres hver frame for responsiv feedback

### Neste prioritet
- [ ] Lyd/musikk system
- [ ] Claude API-integrasjon for dynamisk NPC-dialog
- [ ] Fullscreen-modus for mobil

### Notater
- Touch-kontroller fungerer også med mus for testing
- D-pad inkluderer alle 4 retninger (opp/ned for dybde, venstre/høyre for bevegelse)
- Landscape-modus optimalisert for telefoner

---

## 2025-12-28 — Cast n Chill Analyse (Research)

### Formål
Analysere Cast n Chill for å identifisere grafiske teknikker, gameplay-mekanikker og designvalg vi kan lære av for The Deep Ones.

### Cast n Chill — Oversikt

**Utvikler:** Wombat Brawler (2-person Aussie-studio)
**Utgivelse:** Juni 2025 på Steam
**Sjanger:** Cozy idle/active fishing game
**Inspirasjonskilde for:** The Deep Ones' visuelle stil og fiskemekanikk

---

### 1. Grafikk & Pixel Art Stil

#### Landskapsmaleri-tilnærming
- Ekstremt detaljert pixel art i "maleri"-stil
- Hvert område føles som et levende kunstverk
- Fokus på naturskjønnhet: trær, fjell, skyer, vann
- Sesongbaserte paletter (høstløv, solnedgang, nattehimmel)

#### Vanneffekter (hovedattraksjonen)
- **Refleksjoner**: Trær, skyer og fjell speiles i vannoverflaten
- **Dynamiske bølger**: Subtil bevegelse i vannoverflaten
- **Ripples**: Ender og fisk lager krusninger i vannet
- **Morgentåke**: Atmosfærisk tåke som svever over vannet
- Anmeldere kaller vanneffekten "mind-blowing" for pixel art

#### Detaljnivå
- Fugler som lander og letter
- Ender som svømmer forbi
- Fisk detaljert tegnet i journal
- Båten har subtil bob-animasjon
- Hunden som følgesvenn med egne animasjoner

---

### 2. Parallax & Dybde-system

#### Lagdelt bakgrunn
- Bruker klassisk parallax scrolling med multiple lag
- Bakgrunnslag beveger seg saktere enn forgrunnen
- Skaper illusjon av en "langt større naturlig verden"
- Beskrevet som "incredible landscapes across multiple layers"

#### Dybdeeffekt
- Nære elementer (båt, vann) i fullt tempo
- Trær/land i middels tempo
- Fjell i sakte tempo
- Himmel/skyer i veldig sakte tempo
- Resulterer i "huge amount of depth"

#### Lærdom for The Deep Ones
Vi har allerede 15+ parallax-lag, men kan forbedre:
- Mer detaljerte overgangsanimasjoner mellom lag
- Bedre dybdefølelse i undervannslayerne
- Atmosfæriske effekter som binder lagene sammen

---

### 3. Kamera & Undervanns-panorering ⭐

**NØKKELFUNN: Cast n Chill har dynamisk kamera-panorering!**

#### Hvordan det fungerer
1. **Startmodus**: Med enkel "bobber" ser du kun overflaten
2. **Med oppgradert lure**: Når du kaster, SYNKER kameraet ned under vann
3. **Undervannsvisning**: Du ser luren din synke ned, fisk svømmer rundt
4. **Dybdebasert**: Kameraet følger luren til riktig dybde
5. **Valgfritt**: Settings har "Only above" for å slå av undervannsview

#### Visuell overgang
- Gradvis panorering fra overflate til dybde
- Lysforhold endres (mørkere dypere ned)
- Fisk vises som animerte sprites på sine respektive dybder
- Undervannsbakgrunn med tang, steiner, lyseffekter

#### Implementering for The Deep Ones
```
FORSLAG: Undervanns-panorering ved kasting

Når spiller kaster:
1. Kamera begynner å panorere ned (smooth lerp)
2. Vannoverflate-linjen beveger seg oppover på skjermen
3. Undervannsverdenen blir synlig
4. Kameraet stopper ved snørets dybde
5. Fisk/creatures vises på sin dybde

Ved "bite" eller reel-in:
1. Kamera følger snøret/fisken
2. Ved fangst, panorerer tilbake til overflatevisning

Konfigurasjon:
- panSpeed: 0.05 (hastighet på panorering)
- maxPanDepth: avhengig av fiskestang
- returnDelay: 1.5s etter fangst
```

---

### 4. Fiskemekanikk

#### Kast & Venting
- Kaster ut snøret til valgt punkt
- Lure synker til sin naturlige dybde
- Fisk tiltrekkes av riktig lure-type
- Visuelt: du SER fisken nærme seg luren under vann

#### Reeling-mekanikk
- **Venstre museklikk/hold**: Reel inn snøret
- **Høyre museklikk/hold**: Slipp ut snøret (gi slakk)
- Ingen drag-system (kritisert av noen spillere)

#### Fiskekamp-indikator ⭐
- Når fisk kjemper hardt: **"Fyrverkeri"-lignende partikler** fra fiskens hode
- Visuell indikator som er mer intuitiv enn en bar
- Må slippe ut snøret når dette skjer
- Reel inn når fisken roer seg

#### Lærdom for The Deep Ones
Vår nåværende minigame bruker tension-bar. Alternativ:
- Legg til partikkel-effekt på fisken når den kjemper
- Kombiner bar med visuelle indikatorer
- "Glow" eller "shake" på snøret ved høy tension

---

### 5. Gameplay Loop & Progresjon

#### Kjerneloop
```
Fisk → Selg hos Rusty's → Kjøp utstyr → Nye områder → Repeat
```

#### Progresjonselementer
- **13 unike lokasjoner** (vi har 8)
- **50 fiskearter** i journal (vi har 16 + 7 tid/vær)
- **Trophy-fisk**: Største fangst per art lagres
- **Lisenssystem**: Må kjøpe tilgang til nye områder

#### Idle vs Active modus
- **Active**: Full kontroll, raskere progresjon
- **Idle/Passive**: Spillet fisker automatisk
- Offline progression: Tjener penger mens du er borte

#### Lærdom for The Deep Ones
- Vurder "idle fishing"-modus som gir sanity-tap over tid
- Trophy-tracking per fisketype (største/mest verdifulle)
- Mer tydelig progresjons-gate mellom områder

---

### 6. Tid & Atmosfære

#### Tid på døgnet
- Påvirker hvilke fisk som er tilgjengelige
- Legendary fish kun på spesifikke tider
- Visuell endring: soloppgang, dag, solnedgang, natt
- **Snooze-knapp**: Kan endre tid manuelt

#### Atmosfæriske detaljer
- Stjerner reflekteres i vannet om natten
- Fjell "blusher" med høstfarger
- Morgentåke som letter
- Solnedgangsglow på alt

---

### 7. Hva vi kan implementere

#### Høy prioritet (stor impact)

1. **Undervanns-panorering ved kasting**
   - Kameraet følger snøret ned
   - Viser undervannsverdenen aktivt
   - Gjør fisking mer visuelt engasjerende
   - Matcher vår eksisterende undervannsgrafikk

2. **Forbedrede vannrefleksjoner**
   - Vi har `drawWaterReflection()` allerede
   - Kan legge til refleksjon av himmel/skyer
   - Dynamisk bølge-distorsjon på refleksjoner

3. **Visuell fiskekamp-indikator**
   - Partikler/glow når fisk kjemper
   - Supplement til tension-bar, ikke erstatning
   - Mer atmosfærisk og intuitivt

#### Medium prioritet

4. **Trophy-tracking**
   - Lagre største fangst per fisketype
   - Vis i journal med vekt/verdi
   - Achievement for "alle trophies"

5. **Bedre fisk-visualisering**
   - Se fisken nærme seg luren under vann
   - Animert fiskebevegelse før bite

6. **Ripple-effekter**
   - Når bobber lander
   - Når fisk fanges
   - Når regn treffer vannet

#### Lavere prioritet (nice to have)

7. **Idle fishing-modus**
   - Automatisk fisking over tid
   - Balansert med sanity-tap
   - Passer til mobil-gameplay

8. **Flere lokasjoner**
   - Utvide fra 8 til 12+ områder
   - Mer variasjon i visuell stil

---

### 8. Teknisk implementeringsplan

#### Undervanns-panorering (hovedfeature)
```javascript
// Ny state i game-state.js
camera: {
    y: 0,              // Vertikal offset
    targetY: 0,        // Mål for smooth lerp
    panSpeed: 0.03,    // Hastighet på panorering
    mode: 'surface'    // 'surface' | 'underwater' | 'transitioning'
}

// I systems.js
function updateCameraPan() {
    if (game.fishing.casting || game.fishing.lineOut) {
        // Beregn måldybde basert på snøret
        const targetDepth = calculateLineDepth();
        game.camera.targetY = Math.min(targetDepth * 2, 300);
        game.camera.mode = 'underwater';
    } else {
        game.camera.targetY = 0;
        game.camera.mode = 'surface';
    }

    // Smooth interpolation
    game.camera.y += (game.camera.targetY - game.camera.y) * game.camera.panSpeed;
}

// I rendering.js - modifiser alle render-kall
function render() {
    ctx.save();
    ctx.translate(0, -game.camera.y);
    // ... eksisterende render-kode
    ctx.restore();
}
```

#### Fiskekamp-partikler
```javascript
// I creatures.js eller systems.js
function drawFishStruggleEffect(fish) {
    if (game.minigame.tension > 70) {
        // Tegn "fyrverkeri"-partikler fra fiskens posisjon
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 15 + 5;
            ctx.beginPath();
            ctx.arc(
                fish.x + Math.cos(angle) * distance,
                fish.y + Math.sin(angle) * distance,
                2, 0, Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, ${100 + Math.random() * 100}, 50, ${0.5 + Math.random() * 0.5})`;
            ctx.fill();
        }
    }
}
```

---

### Sammenligning: Cast n Chill vs The Deep Ones

| Aspekt | Cast n Chill | The Deep Ones | Vårt fokus |
|--------|--------------|---------------|------------|
| Tone | 100% cozy | Cozy → Horror | ✓ Unikt |
| Pixel art | Landskapsmaleri | Lovecraftian | ✓ Egen stil |
| Parallax | Multi-layer | 15+ layers | ✓ Allerede sterkt |
| Undervannspan | ✓ Ja | ✗ Nei (ennå) | **Prioritet** |
| Fiskekamp | Visuell | Tension bar | Kan forbedre |
| Idle mode | ✓ Ja | ✗ Nei | Vurderes |
| Progresjon | Lineær | Sanity-drevet | ✓ Unikt |
| NPCer | Statisk dialog | Dynamisk | ✓ Bedre |
| Endings | Ingen | 3 endings | ✓ Bedre |

---

### Konklusjon

Cast n Chill's største styrke er den **visuelle presentasjonen av fisking**, spesielt:
1. Undervanns-panorering som gjør fisking til en visuell opplevelse
2. Vannrefleksjoner som gir liv til overflaten
3. "Se fisken bite" fremfor bare å vente på RNG

The Deep Ones har allerede sterke unike elementer (horror, sanity, transformasjon, endings), men kan låne Cast n Chills undervanns-panorering for å gjøre fiskingen mer engasjerende.

**Anbefalt neste steg:**
Implementer undervanns-kamera-panorering som hovedfeature.

### Kilder
- [Steam Store](https://store.steampowered.com/app/3483740/Cast_n_Chill/)
- [VideoGamer Preview](https://www.videogamer.com/previews/cast-n-chill-fishing-for-compliments-charming-pixel-art-balmy-atmosphere/)
- [Well-Played Review](https://www.well-played.com.au/cast-n-chill-review/)
- [Vice Review](https://www.vice.com/en/article/cast-n-chill-is-an-idle-and-active-fishing-game-that-has-become-my-new-go-to-when-i-want-to-relax-review/)
- [The Indie Informer](https://the-indie-in-former.com/2025/06/20/cast-n-chill-is-the-perfect-playable-screensaver/)

---

## 2025-12-28 — Cast n Chill Features Implementert

### Gjort
Implementert alle planlagte features fra Cast n Chill-analysen:

1. **Undervanns-panorering** ⭐
   - Kameraet panorerer ned under vann når du fisker
   - Smooth lerp-basert bevegelse
   - Følger snørets dybde
   - Returnerer til overflaten ved fangst

2. **Forbedrede vannrefleksjoner**
   - Sky/himmel-shimmer på vannoverflaten
   - Båtrefleksjon med bølge-distorsjon
   - Ripple-ringer rundt båten
   - Sol/måne-refleksjonsbane ved dag/dusk

3. **Fiskekamp-partikler**
   - "Fyrverkeri"-effekt når fisk kjemper hardt (tension > 60%)
   - Partikler rundt fiske-ikonet i minigame
   - Pulserende glow ved høy tension (> 70%)
   - Orange/gule partikler med gravity

4. **Trophy-tracking per fisk**
   - Lagrer beste verdi og antall fangster per art
   - "FIRST CATCH!" melding for nye arter
   - "NEW RECORD!" ved ny beste fangst
   - Vises i catch-popup
   - Lagres/lastes med save-systemet

5. **Idle fishing-modus** [I]
   - Automatisk fisking hvert 15. sekund
   - 60% base fangstsjanse
   - Økt sanity-drain (1.5x) som trade-off
   - Progress-bar viser tid til neste fangst
   - Stopper automatisk ved full inventory

### Endringer

| Fil | Endring |
|-----|---------|
| `game-state.js` | Ny state: camera, trophies, fishStruggleParticles, idleFishing |
| `systems.js` | +450 linjer: updateCameraPan, trophy-system, idle-fishing, enhanced reflections |
| `main.js` | Integrert camera pan i render, la til nye update-calls |
| `rendering.js` | Utvidet catch popup med trophy info |
| `input.js` | Ny hotkey [I] for idle fishing, addTrophy ved fangst |
| `ui.js` | Oppdatert hotkey-hjelp med [I] |
| `save.js` | Lagrer/laster trophies |

### Nye funksjoner

```javascript
// Camera panning
updateCameraPan()
getCameraPanOffset()

// Fish struggle
updateFishStruggleParticles()
drawFishStruggleParticles()
drawFishStruggleIndicator()

// Trophies
addTrophy(creature)
getTrophyInfo(name)
getAllTrophies()
getTrophyProgress()
drawTrophyInfo(creature, x, y)

// Idle fishing
toggleIdleFishing()
updateIdleFishing(deltaTime)
drawIdleFishingIndicator()

// Enhanced reflections
drawEnhancedWaterReflection()
```

### Nye hotkeys
- **[I]** — Toggle idle fishing mode

### Testing
- Start spillet og cast snøret - kameraet skal panorere ned
- Få en fisk på kroken med høy tension - se partikkel-effekter
- Fang en fisk - se trophy info i popup
- Trykk [I] for å aktivere idle mode

### Notater
- Idle mode er balansert med økt sanity-drain
- Kamera-pan er subtil men merkbar
- Partikkel-effekten intensiveres med tension
- Trophies lagres persistent

---

## 2025-12-28 — Fix: Spawn Freeze Bug

### Problem
Spillet frøs og spilleren/båten spawnet ikke etter oppstart.

### Årsak
Bug i `updateCameraPan()` i `js/systems.js`:
- Linje 1706 brukte `rod.maxDepth` i stedet for `rod.depthMax`
- `maxDepth` ble `undefined` → beregningene ga `NaN`
- Camera offset ble `NaN` → `ctx.translate(0, NaN)` forhindret all rendering

### Løsning
```javascript
// Før (feil):
const maxDepth = rod ? rod.maxDepth : 30;

// Etter (riktig):
const maxDepth = rod ? rod.depthMax : 30;
```

### Endringer
- `js/systems.js` linje 1706: Rettet `rod.maxDepth` → `rod.depthMax`

### Testing
- Start spillet og trykk "NEW GAME"
- Båten og fiskeren skal nå vises korrekt
- Kast snøret og verifiser at kamera-pan fungerer

---

## 2025-12-28 — Fix: Robust NaN-håndtering i Camera System

### Problem
Spillet fortsatte å fryse og spilleren spawnet ikke, selv etter forrige fix.

### Årsak
Potensielle NaN-verdier i camera-systemet kunne fortsatt oppstå under visse omstendigheter:
- `getCurrentRod` kunne være undefined hvis kallt før npc.js var lastet
- `game.depth` eller `cam.y` kunne bli NaN ved edge cases
- Ingen defensive guards mot NaN-propagering
- Feil i update/render kunne stoppe hele game loop

### Løsning

#### 1. Defensive guards i updateCameraPan() (js/systems.js)
- Sjekker at camera-state eksisterer før bruk
- Bruker `typeof getCurrentRod === 'function'` i stedet for bare truthy-sjekk
- Fallback-verdier for alle variabler (maxDepth, depth, cam.maxPan, etc.)
- Final NaN-guard som setter cam.y = 0 hvis NaN oppstår

#### 2. Robust getCameraPanOffset() (js/systems.js)
- Sjekker at game.camera eksisterer
- Returnerer alltid gyldig tall (0 hvis NaN eller undefined)

#### 3. Error-håndtering i gameLoop() (js/main.js)
- try-catch rundt update() og render()
- Logger feil til console uten å stoppe game loop
- Spillet fortsetter å kjøre selv om en feil oppstår

### Endringer
- `js/systems.js`: Ny robust versjon av updateCameraPan() og getCameraPanOffset()
- `js/main.js`: try-catch i gameLoop()

### Testing
- Start spillet og trykk "NEW GAME"
- Båten og fiskeren skal vises korrekt
- Kast snøret - kamera-pan skal fungere uten frysing
- Åpne browser console (F12) for å se eventuelle feil-meldinger

---

## 2025-12-28 — Fix: Player Visibility & Camera Stuck Bug

### Problem
To relaterte bugs:
1. Spilleren/båten dukket ikke alltid opp på skjermen
2. Når man kastet snøret, panorerte kameraet ned og ble der (returnerte ikke til overflaten)

### Årsak
Problemet var i undervanns-kamera-panorering-systemet:
1. **For aggressiv panorering**: `depthPercent * maxPan * 1.5` kunne gi opptil 300px offset
2. **For treg retur**: `panSpeed = 0.03` var for tregt til å returnere til overflaten
3. **Manglende reset**: Kameraet ble ikke eksplisitt reset når spilleren gikk tilbake til 'sailing' state

### Løsning

#### 1. Redusert kamera-pan i updateCameraPan() (js/systems.js)
- Redusert maksimal pan fra 200px til 100px
- Redusert pan-multiplier fra 1.5 til 0.8
- Økt returhastighet (0.1 ved retur til overflaten)
- La til snap-to-zero når nær overflaten
- Forbedret NaN-guards

#### 2. Eksplisitt kamera-reset (js/input.js)
- Reset `camera.targetY` til 0 når spilleren avslutter fisking (space i 'waiting' state)
- Reset `camera.targetY` til 0 etter fangst (space i 'caught' state)
- Reset `targetDepth` til 0 ved begge tilfeller

#### 3. Kamera-reset i endMinigame() (js/systems.js)
- Reset kamera når fisken slipper unna og spilleren returnerer til 'sailing'

#### 4. Oppdatert standardverdier (js/game-state.js)
- Økt `panSpeed` fra 0.03 til 0.05
- Redusert `maxPan` fra 200 til 100

### Endringer
- `js/systems.js`: Ny robust versjon av updateCameraPan(), kamera-reset i endMinigame()
- `js/input.js`: Eksplisitt kamera-reset ved state-endringer
- `js/game-state.js`: Oppdaterte standardverdier for kamera

### Testing
- Start spillet og trykk "NEW GAME"
- Båten og fiskeren skal vises umiddelbart
- Kast snøret med SPACE - kameraet skal panorere nedover
- Trykk SPACE igjen - kameraet skal returnere til overflaten
- Fang en fisk - kameraet skal returnere til overflaten etter popup

---

## 2025-12-28 — Fix: Depth Controls & Camera Reset

### Problem
To problemer rapportert:
1. Spiller/båt dukket ikke opp på skjermen
2. Når man kastet snøret, gikk spillet ned til bunns og ble der - kunne ikke reele opp

### Årsak
1. **Reverserte piltaster**: ArrowUp/ArrowDown var reversert for dybdekontroll
   - ArrowUp økte dybden (gikk dypere) - forvirrende!
   - ArrowDown minsket dybden (gikk grunnere) - forvirrende!
   - Brukere forventer naturlig at Up = oppover (grunnere) og Down = nedover (dypere)

2. **Høy startdybde**: Når spilleren kastet snøret, ble targetDepth satt til 30m umiddelbart, som fikk kameraet til å panorere ned uten brukerens intensjon

3. **Manglende kamera-reset**: Kameraet ble ikke eksplisitt tilbakestilt ved spillstart

### Løsning

#### 1. Byttet ArrowUp/ArrowDown dybdekontroll (js/input.js)
```javascript
// Nå (riktig):
ArrowUp = decrease depth (go toward surface)
ArrowDown = increase depth (go toward bottom)
```

#### 2. Snøret starter ved overflaten (js/input.js)
- Når du kaster, er targetDepth nå 0 (overflate)
- Spilleren må aktivt trykke ArrowDown for å gå dypere
- Dette gir spilleren full kontroll

#### 3. Eksplisitt kamera-reset ved spillstart (js/main.js)
- startGame() og continueGame() resetter nå kamera til overflaten
- Sikrer at spillet alltid starter i korrekt tilstand

### Endringer
- `js/input.js`:
  - Byttet ArrowUp/ArrowDown logikk for dybdekontroll
  - Endret initial targetDepth til 0 ved kasting
- `js/main.js`:
  - Lagt til eksplisitt kamera og dybde-reset i startGame()
  - Lagt til eksplisitt kamera og dybde-reset i continueGame()

### Testing
1. Start spillet og trykk "NEW GAME"
2. Båten og fiskeren skal vises umiddelbart
3. Kast snøret med SPACE - snøret starter ved overflaten
4. Trykk ArrowDown for å senke snøret (øke dybde)
5. Trykk ArrowUp for å heve snøret (minske dybde)
6. Trykk SPACE for å dra inn snøret helt

### Notater
- Dybdekontroll er nå intuitiv: Up = opp, Down = ned
- Spilleren har full kontroll over dybden fra start
- Kamera-systemet returnerer nå pålitelig til overflaten

---

## Template for fremtidige entries

```markdown
## [DATO] — [TITTEL]

### Gjort
- Punkt 1
- Punkt 2

### Endringer
- `fil.js` — Beskrivelse av endring

### Neste
- Hva som skal gjøres

### Problemer
- Eventuelle issues

### Notater
- Tanker og ideer
```

---

*Logg oppdateres ved hver utviklingssesjon*
