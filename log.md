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
