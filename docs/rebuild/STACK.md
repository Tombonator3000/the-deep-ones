# Production stack and capability status

6 September 2026. One canonical editable new slice: `v2/`. Original source in root `index.html` / `js/` is retained as the prototype archive. No duplicated editable game copy.

| Responsibility | Selection | Input → output / integration | Verified availability / reason |
| --- | --- | --- | --- |
| Representation | Fixed side-view 2D with depth in painted scenery and moving entities | Layered scene, visible underwater section, boat/fish/line rendered separately | Working Canvas2D scene; fits supplied references without free-camera 3D cost |
| Runtime | Vanilla JavaScript ES modules, Canvas2D | `game.js` simulation → `render.js` scene; `main.js` HTML UI | Working browser launch; old repository preference preserved |
| Build | Vite 8.2.2, Node 24.19.0, npm lockfile | `npm ci`, `npm run build` → `dist/` | Build executed successfully; no runtime framework |
| Art | Built-in imagegen, independent GPT-6 Astra art agent | Exact prompts → PNG concept, dusk/day/night scenery and idle/alert sprite atlases → runtime rectangles | Generated and inspected. RGB matte requires edge-connected canvas masking at load; not native alpha |
| Sound | Browser Web Audio | Original noise ambience and soft synthesized notes → user-enabled sound | Code integrated; sound starts from user gesture; listening verification separate |
| Saves | Device-local localStorage, versioned key | Validated state → atomic serialized save after transactions / every 15 s | Game-state roundtrip tested; browser reload verification recorded separately |
| Automated checks | Node built-in test runner | Public game actions, identical timed input at 30/60/120 Hz, malformed saves → results | Six meaningful game-flow tests pass; no extra test framework |
| Visual review | Independent GPT-6 Astra critic + cloud browser | Real controls → unedited screenshots → concrete corrections and scores | Three rounds requested; reports in `quality/`; numbers are subjective and do not certify AAA or performance |
| Performance | Visible opt-in `?qa=1` panel | 5 s warmup + 120 s rAF deltas, render CPU time, p95/p99 and interruptions | Cloud sample passed defined percentile gates at59.6fps; physical desktop/phone still requires on-device measurement |
| Delivery | Private Sites, static output; GitHub feature branch | Exact tested source → build archive → private URL | Private site registered; exact source and build prepared; deployment status returned by hosting service at delivery |

## Reproduction

```bash
npm ci
npm test
npm run build
npm run dev
```

`npm run dev` serves `v2/`. `npm run preview` serves the built `dist/`. For supervised agent-browser QA, use `sites-preview start` instead of starting a separate server. No API keys or paid services are needed by the game.

## Performance contract

Target 60 fps. Report p95 <=17.5 ms with stated vsync tolerance, p99 <=20 ms, stalls >50 ms, sample count, resolution, renderer, mean render cost and visibility interruptions. Cloud browser timing cannot establish physical Samsung S24 performance. A browser tab throttled by the test environment must be labeled invalid/unrepresentative, not passed by averaging or by substituting simulation unit tests.

## Remaining content scope

This slice has one continuous inlet, six species, three rods, four lighting modes derived from three authored environments (dawn is a warm dusk variant), one first-discovery story event, dog interaction, journal, shop and rest. It does not claim the old prototype's entire eight-location/22-species campaign or any of its three endings, co-op, idle mode, native export, or independently articulated character animation (two discrete authored boat/actor poses are included).
