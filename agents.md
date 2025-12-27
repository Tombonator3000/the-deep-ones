# Agents.md — AI Development Instructions

## For Claude / AI Assistants

Når du jobber med dette prosjektet:

### Alltid
1. **Les `SYSTEM-PROMPT.md`** først for full kontekst
2. **Logg alt arbeid** til `log.md` med dato og beskrivelse
3. **Følg filstrukturen** definert i system prompt
4. **Behold prosedyral fallback** når du legger til nye visuelle elementer
5. **Test at spillet kjører** før du avslutter

### Kode-stil
- Vanilla JavaScript, ingen frameworks
- Kommentarer på engelsk, kommunikasjon på norsk
- Hold funksjoner små og fokuserte
- Bruk `CONFIG` objektet for konfigurerbare verdier

### Når du lager nye features
1. Definer feature i `log.md` først
2. Implementer med prosedyral fallback
3. Legg til sprite-config i `SPRITES` objektet
4. Oppdater `ASSET-GUIDE.md` hvis nye assets trengs
5. Test alle fire tider på døgnet

### Git commits
Bruk conventional commits:
- `feat:` Ny funksjonalitet
- `fix:` Bug fix
- `art:` Asset-relatert
- `docs:` Dokumentasjon
- `refactor:` Kode-omstrukturering

### Prioritering
1. Gameplay først, polish etterpå
2. Prosedyral grafikk → Sprite support
3. Core loop → Additional features
4. Single player → Multiplayer (hvis aktuelt)

---

## Nåværende Status

**Versjon:** 0.5 (Save/Load & Lore Viewer Update)

**Ferdig:**
- [x] Parallax layer system
- [x] 4 tider på døgnet
- [x] 16 creatures med descriptions
- [x] Sanity system med utvidede effekter
- [x] Fishing mechanics med minigame
- [x] Prosedyral grafikk
- [x] Sprite-ready arkitektur
- [x] NPC Old Marsh med butikk
- [x] Butikk-system (selg fisk, kjøp utstyr)
- [x] Progression-system (stenger, agn, båter)
- [x] Inventory-system
- [x] Utvidet verden (4000px) med scrolling
- [x] 6 unike lokasjoner med visuelle features
- [x] Vær-system (5 værtyper)
- [x] Lore fragments / collectibles (12 stk)
- [x] Hund som gameplay-element
- [x] Naturlig tid-progresjon
- [x] Minimap og lokasjonsindikatorer
- [x] Save/Load system med LocalStorage
- [x] Lore collection viewer ([L] keybind)
- [x] Auto-save ved viktige hendelser
- [x] Continue-knapp på title screen

**Neste prioritet:**
- [ ] Claude API-integrasjon for dynamisk NPC-dialog
- [ ] Lyd/musikk
- [ ] Lokasjonsbaserte creatures
- [ ] Fishing journal / bestiary
- [ ] Achievements

---

## Kontakt

Prosjekteier: Tom (game developer)
Kommunikasjon: Norsk foretrukket
