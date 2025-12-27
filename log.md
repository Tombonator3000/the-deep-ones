# The Deep Ones — Development Log

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
