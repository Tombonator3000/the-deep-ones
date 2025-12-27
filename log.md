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
