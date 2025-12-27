# The Deep Ones — Game Design Document

> "The sea does not give back what it takes. But sometimes... it gives something else."

---

## Kjernedesign-beslutninger

| Aspekt | Beslutning |
|--------|-----------|
| Navigasjon | Fri seiling, kontinuerlig sidescrolling |
| Landsby | Meny-basert (popup ved brygge) |
| Progresjon | Penger → utstyr → større fisk |
| Lovecraft | FULL (Dagon, transformasjon, cult) |
| Ending | Story + endless mode (bli en Deep One?) |
| Inspirasjon | Cast n Chill + Deep Regrets |

---

## Inspirasjonskilder

### Cast n Chill
- Avslappende fiskegameplay
- Pixel art estetikk
- Cozy atmosfære
- Idle-vennlig

### Deep Regrets (brettspill)
- Lovecraftian fishing horror
- Transformasjonsmekanikk (bli monster)
- Sanity/corruption system
- Balanse mellom profitt og menneskelighet
- "The fish change you"

### Vår blanding

```
Cast n Chill    ████████░░░░░░░░    Deep Regrets
   (cozy)                              (horror)
                    ↑
              THE DEEP ONES
         "Cozy until it isn't"
```

---

## Spillstruktur

### Kjerneloop

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   FISK → SELG → KJØP UTSTYR → FISK DYPERE      │
│     ↓                              ↓            │
│   SANITY TAP ←←←←←←←←←←←←←← RARE FISK          │
│     ↓                              ↓            │
│   TRANSFORMASJON ←←←←←← ABYSS CREATURES        │
│     ↓                                           │
│   ENDING (eller endless)                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Progresjonsstige

#### EARLY GAME (0-500g)
- Start rod: Max 30m
- Område: Shallows + Landsby
- Fisk: Surface creatures
- Sanity: Stabilt
- Tone: Cozy fishing sim

#### MID GAME (500-2000g)
- Steel rod: Max 60m
- Område: + Reef
- Fisk: Mid creatures
- Sanity: Begynner å synke
- Hints: Rare dialoger, merkelige fisk
- Tone: Noe er galt...

#### LATE GAME (2000-5000g)
- Deep rod: Max 100m
- Område: + The Deep
- Fisk: Deep creatures
- Sanity: Kritisk lav
- Events: Visjoner, NPCer endrer seg
- Tone: Full horror

#### ENDGAME (5000g+)
- Abyss rod: Max 150m+
- Område: Abyss Gate
- Fisk: The Old Ones
- Sanity: Transformasjon starter
- Choice: Embrace eller resist?
- Endings: Multiple

---

## Transformasjonssystem

Inspirert av Deep Regrets. Jo lavere sanity, jo mer "endres" spilleren:

| Sanity | Stage | Effekter |
|--------|-------|----------|
| 100-70 | HUMAN | Normal gameplay, normal grafikk |
| 70-40 | TOUCHED | Fisk biter oftere, ser "ting" i vannet, noen NPC-er reagerer |
| 40-20 | CHANGING | Fysiske endringer på sprite?, Deep creatures er mindre fiendtlige, butikkpriser øker (de stoler ikke på deg), kan "høre" fiskene |
| 20-1 | BECOMING | Nesten monster, Abyss fisk snakker til deg, landsbyen stenger?, special endings unlocked |
| 0 | THE DEEP ONE | Ending trigger, du ER en av dem nå |

### Visuell transformasjon av spilleren

```
HUMAN:        🧍 Normal fisker
TOUCHED:      🧍 Blekere hud, store øyne
CHANGING:     🧍 Gjellelignende trekk, webbed hands?
BECOMING:     🧍 Nesten fisk-menneske hybrid
DEEP ONE:     🐟 Full transformasjon
```

---

## Verden (Sidescroller)

### Total bredde: ~6000px (6 skjermer)

```
|←── 1000px ──→|←── 1000px ──→|←── 1000px ──→|←── 1000px ──→|←── 1000px ──→|←── 1000px ──→|

   SANDBANKE      SHALLOWS       SUNSET         INNSMOUTH       THE REEF        THE DEEP
   (grense)                       COVE           (LANDSBY)

   Kan ikke      Trygt           Vakkert        ⚓ Brygge       Korall         Mørke
   seile         Max 40m         Max 50m        🏪 Butikk       Skipsvrak      Ingen bunn?
   lenger                                       🛖 (hvile)      Max 100m
                                                                               ??? ABYSS GATE
                 Tutorial        Farming        Hub             Challenge      Endgame
                 zone            zone                           zone           zone
```

### Dybdeprofil (sidevisning)

```
0m   ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈  OVERFLATE
     |        |           |           |            |            |
20m  |   _____|_____      |           |           |            |
     |  /           \     |           |           |            |
40m  |_/ SANDBUNN    \____|           |           |            |
                          |           |           |            |
60m                       |___        |           |            |
                              \_______|           |            |
80m                                   |           |            |
                                      |      _____|            |
100m                                  |_____/VRAK  \___        |
                                                       \       |
120m                                                    \______|
                                                               |
150m                                                           |
                                                               |
200m                                                       ▼ ABYSS
                                                         (ingen bunn)
```

---

## Landsby: Meny-system

### Når båten er ved brygga

```
┌─────────────────────────────────────────────┐
│                                             │
│              INNSMOUTH COVE                 │
│         ═══════════════════════             │
│                                             │
│    [🏪 OLD MARSH'S BAIT & TACKLE]          │
│         Kjøp og selg                        │
│                                             │
│    [🛖 HVIL TIL NESTE DAG]                 │
│         Gjenopprett sanity                  │
│                                             │
│    [📖 JOURNAL]                            │
│         Fangster og lore                    │
│                                             │
│    [⚓ FORLAT BRYGGA]                       │
│         Fortsett fiske                      │
│                                             │
└─────────────────────────────────────────────┘
```

### Butikk-meny (Old Marsh)

```
┌─────────────────────────────────────────────┐
│  OLD MARSH'S BAIT & TACKLE                  │
│  ══════════════════════════                 │
│                                             │
│  "Hva har du til meg i dag, fisker?"        │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ SELG FANGST                         │    │
│  │                                     │    │
│  │ 3x Harbor Cod ............ 30g      │    │
│  │ 1x Whisper Eel ........... 35g      │    │
│  │ 1x Glass Squid ........... 60g      │    │
│  │                         ──────      │    │
│  │ TOTAL:                   125g       │    │
│  │                                     │    │
│  │ [SELG ALT]                          │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ KJØP UTSTYR                         │    │
│  │                                     │    │
│  │ 🎣 STENGER                          │    │
│  │ Old Bamboo (30m) ........ EID       │    │
│  │ Steel Spinner (60m) ..... 200g      │    │
│  │ Deep Diver (100m) ....... 500g      │    │
│  │ Abyss Caller (150m) ..... 1500g 🔒  │    │
│  │                                     │    │
│  │ 🪱 AGNER                            │    │
│  │ 🚤 BÅTER                            │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Dine penger: 847g                          │
│                                             │
│  [TILBAKE]                                  │
└─────────────────────────────────────────────┘
```

### Butikk-dialog endrer seg med sanity

| Sanity | Dialog |
|--------|--------|
| 100-70 | "God fangst! Været ser fint ut i morgen også." |
| 70-40 | "Du ser... sliten ut. Få litt hvile, kanskje?" |
| 40-20 | "...Hva har du gjort med øynene dine? De ser... annerledes ut." |
| <20 | "Du burde ikke vært her. De andre begynner å snakke." |

---

## Endings

### Ending 1: "The Deep One" (Embrace)
- Sanity når 0
- Velger å "bli med dem"
- Siste scene: Svømmer ned i avgrunnen
- Credits over undervannsbilder
- **Unlocks:** Endless Mode som Deep One

### Ending 2: "The Survivor" (Resist)
- Sanity holdes over 20 til slutt
- Finner måte å "forsegle" avgrunnen?
- Forlater Innsmouth for godt
- Bittersøtt slutt
- **Unlocks:** Endless Mode som Human

### Ending 3: "The Prophet" (Secret)
- Spesifikke fangster i riktig rekkefølge
- Lærer "sannheten"
- Ambiguous ending
- **Unlocks:** ???

### Endless Mode
Etter ending kan man fortsette:
- Ingen sanity-konsekvenser (eller justerte)
- Fokus på samling og optimalisering
- Achievements / completion
- "New Game+" med bedre start?

---

## Cult / Lore elementer

### The Order of Dagon
- Hintes til gjennom hele spillet
- Noen NPCer er medlemmer?
- Symboler i landsbyen
- Fisk-statuer, rare inskripsjoner

### Fiskelore (journal entries)

Hver fangst legger til lore:

**PROPHET FISH**
> "De lokale kaller den 'The Speaker'. De sier hvis du hører den hviske navnet ditt, er det for sent. Ingen vet for sent for hva."

**THE CONGREGATION**
> "Ikke en fisk. Flere fisk. De svømmer i formasjon til de... ikke gjør det lenger. Nå er de ett. De puster sammen."

### Environmental storytelling
- Forlatre fiskebåter i The Deep
- Gamle anker med merkelige symboler
- Undervannsruiner (ved lav sanity?)
- Fyrtårnet blinker i morse? (lore hint)

---

## Implementering: Neste steg

### 1. Verden-struktur
- [ ] Utvid canvas til 6000px bred
- [ ] Implementer kamera som følger båt
- [ ] Lag sone-overganger med unik grafikk

### 2. Meny-system
- [ ] Brygge-trigger
- [ ] Butikk UI
- [ ] Journal UI

### 3. Progresjon
- [ ] Utstyr-system (stenger, agn, båter)
- [ ] Save/load (localStorage)

### 4. Transformasjon
- [ ] Visuell endring av fisker-sprite
- [ ] Sanity-avhengig dialog

### 5. Endings
- [ ] Story flags
- [ ] Ending triggers
- [ ] Credits scene

---

## Referanse-dokumenter

| Dokument | Innhold |
|----------|---------|
| `SYSTEM-PROMPT.md` | Teknisk oversikt |
| `GFX-ASSET-LIST.md` | Alle sprites |
| `ASSET-GUIDE.md` | Hvordan lage assets |
| `agents.md` | AI-instruksjoner |
| `log.md` | Utviklingslogg |

---

*"The sea does not give back what it takes. But sometimes... it gives something else."*
