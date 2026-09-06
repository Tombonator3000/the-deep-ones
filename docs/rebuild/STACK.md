# The Stillwater Below v0.3 — stack and design decisions

6 September 2026. The canonical new game is `v2/`. Original root `index.html` and `js/` remain the prototype archive. This supersedes the v0.2 capability description.

## Why layered 2D

The requested camera is a side view of a long waterway, with a depth-following cutaway while fishing. Canvas2D with independently placed, moving layers fits that camera and the supplied painterly pixel references. Full 3D would add mesh production, materials, lighting and a different asset pipeline without solving a current gameplay requirement. This is a 2.5D presentation, not a free-camera 3D game.

| Responsibility | Choice and integration |
| --- | --- |
| Runtime | Vanilla JavaScript ES modules; game.js simulation, main.js real HTML controls |
| World | world.js: three continuous areas, physical docks, local depth zones, props and validated custom-area data |
| Content | content.js: six fish, three junk objects, three relics, four rods, three lures, boat upgrade and five sanity stages |
| Scene | render.js Canvas2D: camera follow, scrolling shores, fog, mountains, reflections, depth reveal and articulated actors |
| Asset import | art.js: source crops, edge-connected matte extraction, alpha trimming, cached night variants and a code-native ruin fallback |
| Editor | editor.js: object dragging, scale/parallax/height, dock/depth zones; save, JSON export/import, isolated playtest |
| Art | Codex image generation: original concept, reusable shores/dock/actors/objects, decorative sea chart and full Deep One |
| Audio | Original Web Audio ambience, music, rowing/motor and fishing feedback; enabled by user gesture |
| Saves | Version 3 device-local save, migrating version 2; editor/QA playtests preserve the campaign separately |
| Build | Vite 8.2.2 and npm lockfile; npm run build produces dist/ |
| Quality | Ten Node simulation/schema tests, real browser journeys, independent Astra critic, visible frame-time instrumentation |
| Delivery | Existing public Site and existing draft GitHub PR; same production identity |

## Cast n Chill loop → this game

Official descriptions establish a relaxed active/passive fishing loop: discover locations, catch and sell fish, improve equipment and pursue rarer catches. The supplied screenshots and user observations establish the requested physical boat travel, dock, journal, licenses/map and underwater camera behavior. The exact progressive cutaway follows the user's specification; it is not presented as reverse-engineered source code.

Here: sail along a large area → choose local depth/lure → cast, sink, hook, alternate reel/slack → keep or release → physically return to dock → sell, rest, upgrade or buy a license → visit deeper water. Keeping abnormal catches and relics costs sanity. Lower sanity changes the character, atmosphere and Marsh's response; relic order and location enable three ending choices. Junk makes the magnet a distinct fishing choice. The dog and resting recover composure.

Every area has a reachable dock. The map can be read anywhere, but travel requires being docked and owning the destination license. A menu cannot teleport the player home. Lengths: 7,200 / 8,400 / 9,600 world units; displayed horizontal distance uses 10 units per metre. Fishing depth is already in metres. The editor labels widths as world units.

## References and reuse decisions

- [Official press kit](https://www.wombatbrawler.com/cnc-press-kit) and [Steam description](https://store.steampowered.com/app/3483740/Cast_n_Chill/) support relaxed exploration, fish/gear progression and active/passive play. Idle play is not implemented here.
- [Neoseeker walkthrough](https://www.neoseeker.com/cast-n-chill/walkthrough) and [map locations](https://www.neoseeker.com/cast-n-chill/All_Map_Locations) were consulted through available indexed material; the complete guide could not be fetched. Supplied guide screenshots provide direct UI reference.
- [Developer discussion of the underwater camera](https://steamcommunity.com/app/3483740/discussions/0/686365108484448978/) is supporting context. The progressive reveal rule follows the owner's explicit request.
- [The Deep Ones design](https://github.com/Tombonator3000/the-deep-ones/blob/main/GAME-DESIGN.md) supplies sanity, fish/junk/relic, Marsh, transformation and ending direction.
- [Threejs-Awesome-Graphics-Agent-Skills](https://github.com/scottstts/Threejs-Awesome-Graphics-Agent-Skills) is MIT-licensed agent guidance, not an engine. Atmosphere/camera/validation ideas are useful; no package installed or code copied.
- [stylized-components](https://github.com/cortiz2894/stylized-components/blob/main/README.md) is an MIT-licensed Next/React Three Fiber/Three/GLSL stack. Water-depth/wave/sparkle concepts are relevant; components are not drop-in Canvas2D assets. No code reused. Reconsider GPU rendering if measured target-device water cost requires it.
- The owner's [Deep Regrets Digital](https://lovable.dev/projects/48af93e3-33a6-418b-b8ce-172095dc4d1a), inspected read-only at commit `7c4fa444c3a011102476095729a3ca832235bd60`, informed cursed-catch tradeoffs and useful relics. Its competitive scoring/card rules were not copied.

## Reproduce

```bash
npm ci
npm test
npm run build
npm run dev
```

Dev serves v2/; npm run preview serves built dist/. Agent browser validation uses supervised Sites preview. No game API keys or paid runtime service are needed.

The opt-in ?qa panel has a 5s warmup plus 120s frame sample, 390px layout toggle, drawing diagnostics and labelled isolated review scenes. F8 hides/shows it. Fixtures verify rendering, not earned campaign progress; exiting/reloading preserves the campaign. /qa/frame-baseline.html is a separate rAF control without game rendering.

Target: 60fps, p95 ≤17.5ms, p99 ≤20ms, no visibility interruptions or resizing. Current cloud data are in quality/PERFORMANCE.json; physical target-device 60fps remains unverified. Render CPU time does not measure GPU presentation.

## Remaining scope

Three long areas, six fish, three junk catches, three relics, four rods, three lures, one boat upgrade, five sanity stages and three basic endings. Four lighting choices use three painted backgrounds; dawn is a warm dusk variant. One custom-area editor slot with JSON import/export.

This is an expanded playable prototype, not the complete old eight-area/22-species campaign, a balanced commercial release, co-op, idle play or native builds. Audio listening/mix and physical phone input remain unverified. The 8.1/10 visual score applies to reviewed stills, not AAA or animation/performance certification.
