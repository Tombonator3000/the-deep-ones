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
