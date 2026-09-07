# The Stillwater Below — new game slice

**Working title; the old prototype is preserved below.** The new editable game is in [`v2/`](v2/), with detailed original dusk/night artwork, real fishing tension, six discoveries, Old Marsh's shop, equipment, companion dog and device-local progress.

```bash
npm ci
npm run dev
```

Build: `npm run build`. Game-flow checks: `npm test`. The built output is `dist/`.

Read the [current brief](docs/rebuild/BRIEF.md), [prototype audit](docs/rebuild/PROTOTYPE-AUDIT.md), [stack and scope](docs/rebuild/STACK.md), and [actual art prompts](docs/rebuild/ART-PROMPTS.md). The new slice uses its own save key and does not overwrite old prototype saves.

## Original prototype archive

The sections below document the older game. Their feature counts and roadmap are historical, not the status of the new slice. Original root `index.html`, `js/` and art are retained.

# 🐙 The Deep Ones

> *"The fish bite back... in ways you can't forget."*

A cozy cosmic horror fishing game inspired by Cast n Chill and Lovecraft.

![Game Preview](preview.gif)

---

## 🎮 Play

**[Play in Browser](https://[username].github.io/the-deep-ones/)** *(GitHub Pages)*

Or clone and open `index.html` locally.

---

## 📖 About

**The Deep Ones** is a relaxing fishing game with a dark undertone. Fish in a quiet New England coastal town, but the deeper you cast, the *wronger* things become.

### Features
- 🌊 **Multi-layer parallax** pixel art graphics
- 🌅 **4 times of day** — Dawn, Day, Dusk, Night
- 🐟 **16 eldritch creatures** across 4 depth zones
- 🧠 **Sanity system** that affects visuals
- 🐕 **Loyal dog companion** (yes, you can pet it)
- 🎣 **Cast n Chill inspired** gameplay loop

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `SPACE` | Cast / Reel / Confirm |
| `↑` `↓` | Adjust depth |
| `←` `→` | Move boat |
| `J` | Toggle journal |
| `T` | Cycle time of day |
| `D` | Toggle debug panel |

---

## 🐙 Creatures

### Surface (0-20m) — "The Familiar"
- Harbor Cod
- Pale Flounder
- Whisper Eel
- Midnight Perch

### Mid (20-55m) — "The Unsettling"
- Glass Squid
- Bone Angler
- The Mimic
- Prophet Fish

### Deep (55-90m) — "The Wrong"
- Congregation Fish
- The Listener
- Drowned Sailor's Friend
- Memory Leech

### Abyss (90-120m) — "The Old Ones"
- Dagon's Fingerling
- The Dreaming One
- Mother Hydra's Tear
- The Unnamed

---

## 🎨 Contributing Art

The game uses a **sprite-ready architecture** with procedural fallbacks.

See [`ASSET-GUIDE.md`](ASSET-GUIDE.md) for:
- File structure
- Sprite specifications
- Animation guidelines
- Color palettes

---

## 🛠️ Development

```bash
# Clone
git clone https://github.com/[username]/the-deep-ones.git

# Open in browser
open index.html

# Or use a local server
python -m http.server 8000
```

### For AI Assistants
See [`agents.md`](agents.md) and [`SYSTEM-PROMPT.md`](SYSTEM-PROMPT.md) for development context.

---

## 📋 Roadmap

- [x] Core fishing mechanics
- [x] Parallax layer system
- [x] Sanity system
- [x] Asset-ready architecture
- [ ] NPC shopkeeper (with AI dialogue)
- [ ] Shop system (rods, lures, boats)
- [ ] Sound & music
- [ ] Narrative fragments
- [ ] Multiple endings
- [ ] Idle mode

---

## 🙏 Inspiration

- **[Cast n Chill](https://store.steampowered.com/app/3483740/Cast_n_Chill/)** — Gameplay & visual style
- **H.P. Lovecraft** — Cosmic horror & creatures
- **Sunless Sea** — Narrative tone
- **Stardew Valley** — Cozy progression

---

## 📜 License

MIT License — Feel free to fork and make it your own!

---

## 👤 Author

Made with 🐙 by Tom

---

*Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn*
*...but keep it cozy.*
