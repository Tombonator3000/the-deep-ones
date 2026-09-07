# The Stillwater Below — provisional title, new game slice

Owner request: 6 September 2026. Source baseline: `b25609d8be952085f85797dd4a178813ad5b256e`.

## Experience
Take a small boat and your dog into a beautiful autumn inlet. Cast to a chosen depth, watch fish approach, and alternate reeling with giving slack. Bring your catch to Old Marsh, buy a longer line, and return for something that should not be alive. Keeping an impossible catch trades composure for money and knowledge; releasing it is a meaningful alternative. Quiet, waiting and natural sound matter as much as the bite.

The old prototype remains the design archive. This is a new representative slice in `v2/`, not a claim that the entire old game's campaign, endings or locations have been rebuilt. The original `index.html` and `js/` remain intact.

## Representation and delivery
| Approach | Fit | Decision |
| --- | --- | --- |
| Detailed 2D scene layers + animated sprites, fixed side camera | Matches supplied cutaway composition; direct interaction; modest GPU cost | Selected |
| Godot 2D desktop | Strong longer-term authoring option, but requires a new engine/build workflow | Revisit if desktop export or larger content pipeline demands it |
| Free-camera 3D | Extra modeling and camera cost without a requested gameplay benefit | Not selected |

Deliver in a browser first, desktop and touch controls, landscape preferred with usable portrait layout. Preserve vanilla JavaScript and Canvas2D. Add Vite only for modules, reliable preview and reproducible static builds. Save progress locally on the current device under a separate versioned key; no backend or API key needed. No migration of old save data without a defined compatibility contract.

## Observable acceptance criteria
1. Player can move, choose depth, cast, hook, reel/release tension, land or lose a fish, keep/release it, sell at the dock, buy an upgrade, and reach the first abnormal catch through normal controls.
2. Catches, money, equipment and discoveries survive reload; corrupt/unavailable local storage does not crash the game. Menus pause the fishing simulation.
3. Actual scenery, boat scale, waterline, palette and light match the fixed provisional generated reference. Water, fish, boat, line, fog and feedback move independently. Concepts are labeled separately from runtime captures.
4. Pointer, keyboard and touch layouts have visible usable controls, no hidden required actions or horizontal overflow. Journal and shop look like objects in this world.
5. Test sustained 60 fps with resolution, browser/hardware, render load, frame-time percentiles and stalls recorded. Cloud evidence is not evidence for a physical Samsung S24. Aim p95 <=17.5 ms (vsync tolerance) and p99 <=20 ms. A failed performance gate remains open.

## Gauntlet
Independent GPT-6 Astra critic, authorized by owner. Assess composition, craft, atmosphere, motion, UI and concept fidelity honestly, 0–10, with 10 defined as contemporary top-tier production quality. Target >8; no score inflation, and no average score cancels a broken acceptance criterion. Review desktop dusk/night, fishing/catch/shop/journal and portrait. Correct major gaps and recapture. After three failed attempts at the same issue, investigate or record the actual limitation.

## Art handoff
Generated dusk concept -> inspected provisional target -> clean dusk/night environment images and black-matte character/creature atlas -> documented runtime crop rectangles/pivots and edge-connected masking -> real Canvas rendering -> unedited browser screenshots -> critic corrections. Real controls and text are HTML, not painted into the background.

## Sources checked
- Owner's original design and code: https://github.com/Tombonator3000/the-deep-ones
- Supplied Cast n Chill screenshots: composition, sprite scale, underwater view, field journal and map.
- Supplied Neoseeker guide: https://www.neoseeker.com/cast-n-chill/walkthrough — direct retrieval returned HTTP 403; search indexing available, full guide not read.
- Official game description: https://store.steampowered.com/app/3483740/Cast_n_Chill/ — fishing, selling, upgrading, new waters and companion loop.
- Build compatibility: https://vite.dev/guide/ — Node 20.19+/22.12+; local Node 24.19.0.
- Rendering: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas — cache static work, avoid repeated heavy drawing and use requestAnimationFrame.

## Name candidates
**The Stillwater Below** (provisional): peaceful water and something underneath. Other directions: **A Quiet Kind of Dread**, **Blackwater Almanac**, **The Last Good Catch**. No availability/trademark clearance claimed.
