# Prototype audit — 6 September 2026

Independent read-only GPT-6 Astra audit of baseline `b25609d8`. Static source evidence, not a claim of complete runtime testing of the old prototype.

The original implementation contains 17 JavaScript files, about 11,434 lines, 22 fish, 8 locations, 4 rods, 4 lures, 3 boats, 14 lore fragments, 5 transformation stages, 21 achievements and 3 endings. Synthesized audio exists. README/design status lists are stale.

## Reasons for isolated replacement slice
- `js/config.js` uses a 480×270 canvas, while journal, village, achievements and settings draw panels larger than it. Mouse hitbox geometry differs again (`js/systems.js`, `js/settings.js`, `js/input.js`).
- Movement in `js/input.js` uses keydown repetition rather than elapsed held-input time.
- Bite probability (`js/main.js`), reeling (`js/systems.js`) and several sanity changes are applied per frame; speed depends on frame rate.
- Creature selection (`js/creatures.js`) mostly considers location and rod capability rather than selected line depth; weighting is not normalized after modifiers.
- Menus do not consistently stop simulation or consume irrelevant inputs.
- Idle fishing changes to waiting, then exits on subsequent updates because the state is no longer sailing.
- Dog petting gives repeated sanity with no cooldown.
- Save data omits some collection/transformation state, while transaction saves wait for shop close.
- Time-of-day variants reuse asset IDs and overwrite each other. Start/Continue forcibly disable sprites. Assets mix resolutions and scaling rules.

No missing-function crash is established. Early suspected missing `getCreatureForDepth` / `drawTutorial` definitions were found in `js/creatures.js` and `js/ui.js`; that initial hypothesis was retracted.

## Reused design, not unreviewed runtime
Cozy harbor, dog, Old Marsh, catch/sell/upgrade/deeper loop, optional release, composure tradeoff, illustrated journal and authored short creature descriptions. The new slice uses a separate versioned save namespace and elapsed-time simulation. It does not silently migrate or delete the old save.

The full old campaign, eight locations, transformation sprites, achievements, endings and idle mode remain future porting decisions. New six-species slice scope is explicit in `BRIEF.md`.
