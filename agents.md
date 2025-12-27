# Agents.md — AI Development Instructions

## For Claude / AI Assistants

Når du jobber med dette prosjektet:

### Alltid
1. **Les `GAME-DESIGN.md`** for spilldesign og visjon
2. **Les `SYSTEM-PROMPT.md`** for teknisk kontekst
3. **Logg alt arbeid** til `log.md` med dato og beskrivelse
4. **Følg filstrukturen** definert i system prompt
5. **Behold prosedyral fallback** når du legger til nye visuelle elementer
6. **Test at spillet kjører** før du avslutter

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

**Versjon:** 0.9 (Touch Controls & Mobile Support)

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
- [x] Utvidet verden (6000px) med scrolling
- [x] 8 unike lokasjoner med visuelle features
- [x] Vær-system (5 værtyper)
- [x] Lore fragments / collectibles (14 stk)
- [x] Hund som gameplay-element
- [x] Naturlig tid-progresjon
- [x] Minimap og lokasjonsindikatorer
- [x] Save/Load system med LocalStorage
- [x] Lore collection viewer ([L] keybind)
- [x] Auto-save ved viktige hendelser
- [x] Continue-knapp på title screen
- [x] Modulær kode-struktur (13 JS-moduler)
- [x] Komplett asset directory-struktur
- [x] Placeholder art for alle 63 assets
- [x] Transformasjonssystem (5 stages: Human → Deep One)
- [x] Innsmouth Village meny med Rest-funksjon
- [x] Fishing Journal/Bestiary ([J] keybind)
- [x] Story flags for endings
- [x] Endings-system (3 endings: Deep One, Survivor, Prophet)
- [x] Endless Mode etter ending
- [x] Lokasjonsbaserte creatures (weighted spawning)
- [x] Achievements-system (20 achievements)
- [x] Achievements viewer ([A] keybind)
- [x] Touch/mobil-kontroller med on-screen buttons

**Neste prioritet:**
- [ ] Claude API-integrasjon for dynamisk NPC-dialog
- [ ] Lyd/musikk
- [ ] Polering av endings (visuelle effekter)

---

## Kontakt

Prosjekteier: Tom (game developer)
Kommunikasjon: Norsk foretrukket
