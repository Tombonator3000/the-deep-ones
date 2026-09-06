# The Stillwater Below v0.3 — Gauntlet result

6 September2026. Expanded playable prototype from the owner's Cast n Chill × Lovecraft brief. Original game source retained. This supersedes v0.2; old reports are in v0.2-archive/, and root round-1/,round-2/,round-3/,runtime/ images are historical v0.2 evidence. Current hashes: BUILD-FINGERPRINT.json.

## Implemented

Three long scrollable waterways with physical docks, direction-aware sailing and following camera. Separate scenery/fog/reflections and articulated fisherman/dog/oar. Underwater is hidden until a cast, then opens as the line sinks. Line curves, sways and reacts to casts/fights.

Depth/lure selection, tension, fish/junk/relic catches, keep/release tradeoffs, journal, sales, four rods, three lures, boat upgrade, licenses and map travel from dock. Five sanity stages visibly transform the character; three basic endings have distinct rule gates. Visual editor: object placement, depth zones, dock, save, JSON export/import and isolated playtest. Version2 saves migrate to3.

## Gates

| Gate | Result | Evidence/limit |
| --- | --- | --- |
| Travel→catch→dock→sell→license→new area→reload | PASS | Real visible browser journey in USER-JOURNEY.md |
| Simulation/save/editor rules | PASS | Ten tests, timed input30/60/120Hz, all three ending gates |
| Production build | PASS | Vite build; files identified by fingerprint |
| Portrait/no-selection controls | PASS on observed layout | 390px game container; physical phone untested |
| Independent visual review >8/10 | PASS for reviewed stills | Astra7.3→7.7→7.9→8.1, 10 anchored to modern AAA |
| 60fps frame-time target | NOT VERIFIED on target hardware | Cloud samples fail; no-game control also very slow. Raw current data in PERFORMANCE.json |
| SFX/music | Implemented, partly verified | UI activation works; no listening/mix pass |
| Editor import | Schema PASS; file picker unverified | Save/export/playtest/restore through UI; JSON rules tested separately |

## Corrective visual rounds

| Round | Critic | Corrections in next pass |
| --- | --- | --- |
|1|7.3|Natural-aspect water sampling, contact/reflections, smaller lighthouse, softer lower vignette|
|2|7.7|Shore contact occlusion, line-entry ripples, clearer fish focus; editor ruin preview/portrait chart|
|3|7.9|Full creature replacing weak hat/coat transformation; cached cool night lighting; rod grip aligned|
|4|8.1|Creature head, hunched silhouette and webbed hands read without HUD; boat fits night. Final lantern anchor corrected before final capture|

Round notes and unedited screenshots: v0.3/. This is a subjective still-image score, not earned progression, continuous animation or60fps certification. Remaining gaps: water/sprite texture consistency, environmental interaction and supporting-interface polish. It is not a claim of finished AAA quality.

## Performance interpretation

Cached silhouettes/scenery/night variants reduce drawing work. Low measured CPU drawing cost does not prove completed GPU/display frames. A bare requestAnimationFrame page, no game code/images/audio/Canvas, also performed poorly in the same cloud browser. This suggests an environment scheduling limitation; the cause is not established and does not turn a failed game sample into a pass.

Normal-motion and reduced-motion samples are distinguished in PERFORMANCE.json. The archived v0.2 59.6fps result is not evidence for v0.3. Production-build measurement on representative desktop/phone remains required.

## Remaining scope

Three areas, six fish, three junk objects, three relics. Not the full old eight-area/22-species campaign, co-op, idle mode, full narrative/balance pass or native packaging. One custom world stored at a time; JSON export preserves additional boards. Dawn uses warmed dusk art. Cutout/water texture seams, audio mix and physical touch remain open.

Stack/research and the two suggested Three.js repositories: docs/rebuild/STACK.md. Delivery uses the same public Site and existing draft PR.
