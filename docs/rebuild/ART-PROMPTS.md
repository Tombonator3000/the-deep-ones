# The Stillwater Below — asset manifest and exact image prompts

Generated with the built-in `image_gen.imagegen` tool. Images are provisional art direction, not user-approved. No paid external image API or CLI was used. The files listed here are source assets; no image postprocessing was performed by the art agent.

## Manifest

| Source file | Actual dimensions | Role / status |
|---|---:|---|
| `/workspace/scratch/583f4b850b8e/art/concept-dusk.png` | 1672×941 | Provisional gameplay target; original output `generated_images/exec-4046684b-231a-4b03-b685-4e854fd2d0be.png` |
| `/workspace/scratch/583f4b850b8e/art/environment-dusk.png` | 1672×941 | Empty runtime background; original output `generated_images/exec-87f5bc99-5e74-4ff6-aef4-63f58b4fb4d7.png` |
| `/workspace/scratch/583f4b850b8e/art/environment-night.png` | 1672×941 | Matching empty night background; original output `generated_images/exec-4552067a-9ae4-4f25-b53e-ba2c14ae726e.png` |
| `/workspace/scratch/583f4b850b8e/generated_images/exec-924fa083-0e4d-46fe-9df0-26a6676dc5eb.png` | 1536×1024 RGB | Rejected transparent atlas: checkerboard baked into RGB |
| `/workspace/scratch/583f4b850b8e/generated_images/exec-f61a6584-83fd-4ce4-9498-b048189632e5.png` | 1774×887 RGB | Rejected transparent boat: checkerboard baked into RGB |
| `/workspace/scratch/583f4b850b8e/art/sprites-black-matte.png` | 1536×1024 RGB | Usable masking source; original output `generated_images/exec-fa1e4715-bd9b-49df-a9f7-710eb60c56f9.png` |

Generation did not honor the requested 54% waterline exactly. Concept waterline is around y469 / 941 (49.8%). Both production environments share waterline y496 / 941 = 0.5271. Runtime should use actual production waterline.

## Sprite crops and placement

Safe crops include margin. Coordinates are integer source pixels; crop tuple is x,y,width,height. Pivots are approximate placement anchors within each crop.

| Asset | Crop | Pivot |
|---|---|---|
| Boat | 90,25,1352,472 | 676,451 (waterline anchor) |
| Cod | 35,531,458,200 | 229,100 |
| Perch | 563,529,372,197 | 186,99 |
| Eel | 1004,574,502,142 | 251,71 |
| Squid | 35,770,479,203 | 240,102 |
| Anglerfish | 601,731,360,255 | 180,128 |
| Many-eyed fish | 1030,716,461,264 | 231,132 |

Boat rod-hand origin approximately 955,235 within boat crop. Suggested boat rendered width 17% of scene width; fish 2.8–5.2%. These are runtime layout recommendations, not edits to source assets.

Measured visible bounds at RGB max >28, expressed x0,y0,x1,y1 exclusive: boat 100,35,1432,486; cod 45,541,483,721; perch 573,539,925,716; eel 1014,584,1496,706; squid 45,780,504,963; angler 611,741,951,976; manyeye 1040,726,1481,970.

### Transparency and source versus runtime

The atlas and single-boat alpha requests both failed. Both returned RGB images containing drawn checkerboards. They are not transparent and must not be presented as production-alpha assets. Final source atlas deliberately uses a nearly pure black matte, verified background samples [0,0,0], [0,0,0], [0,1,0]. Runtime must derive a mask using an edge-connected near-black flood fill (starting threshold RGB max <=20–28, visually verify), or another explicit black-matte removal method. A blanket threshold risks deleting dark coat, hull, and eye interiors. The art agent did not create or validate that runtime mask. Source atlas stays unchanged.

## Exact prompts submitted

### 1 — original gameplay target

No referenced-image argument. The uploaded references had been visually inspected before generation.

```text
Use case: stylized-concept. Asset type: premium 2D indie fishing game gameplay target frame, working title The Stillwater Below (do not write title). Generate one landscape 16:9 image, 1536x864. Fixed perfectly side-on camera, a water cutaway: thin level waterline EXACTLY 54 percent from the top (y=467 on 864 canvas), above-water landscape top 54%, transparent underwater cross section bottom 46%. Fine hand-placed painterly PIXEL ART with coherent small 2px pixel clusters, jewel teal and russet palette, beautiful atmospheric depth. Not smooth illustration, not glossy cartoon, not low-poly, not photoreal. Tranquil autumn New England inlet at warm peach dusk. Weathered wooden dock enters from far left, little aged lighthouse with warm amber light on rocky right bank, rust red and gold trees framing both sides, tiny warm village windows, distant layered misty lavender mountains. Open central lake with generous breathing room. One modest side-on wooden dinghy at x45%, floating on the waterline, only 17% of full image width, adult fisherman with brimmed cap and forest-green coat seated facing RIGHT, scruffy cream terrier near LEFT prow, small warm lantern. A slender fishing rod curves right, fine line reaches a small fish underwater. Below water: rich clear muted jewel teal, a few sparse naturally proportioned small fish, kelp on edges, dark stone underwater ledges, one VERY SUBTLE drowned stone arch half lost in distant gloom; gentle dread, no overt monster. Waterline is a crisp horizontal thin luminous pixel ripple band all the way across. Landscape richly detailed but gameplay center open. No UI, no text, no logos, no borders. Match the reference spirit of fine painterly pixel scenery and clear side-on water cutaway, while creating an original New England scene.
```

### 2 — empty dusk environment

Referenced image: `/workspace/scratch/583f4b850b8e/art/concept-dusk.png`

```text
Use case: precise-object-edit. Edit target: the provided dusk fishing game scene. Create the production ENVIRONMENT ONLY background of exactly this same scene, same 16:9 size and fixed-side camera, same detailed fine painterly pixel art. Remove ALL boat, fisherman, dog, lantern from the boat, fishing rod, fishing line, hooked fish and ALL other fish or animals. Seamlessly reconstruct empty lake and underwater where they were. Preserve all existing dock, lighthouse, village, mountains, foliage, rocks, drowned arch, lighting, palette, reflections and pixel texture. One framing correction only: move the thin horizontal foreground waterline down to EXACTLY 54 percent image height (y508 in this 1672x941 image), so the open above-water lake extends 40 pixels lower, underwater region begins there. Keep lighthouse, dock tops, horizon and mountains in their current positions; extend dock pilings to meet lower waterline. Underwater floor/ledges stay at bottom. Make the distant underwater stone arch 25% fainter by underwater haze. No boat, no characters, no dog, no fish, no wildlife, no rod, no line, no text, no UI. This is an empty reusable gameplay background, not a new composition.
```

### 3 — night environment

Referenced image: `/workspace/scratch/583f4b850b8e/art/environment-dusk.png`

```text
Use case: lighting-weather. Edit target: provided empty production fishing scene. Change ONLY time of day and lighting into deep blue moonlight, quietly eerie cosmic-horror nocturne. Preserve pixel-perfect geography and framing: horizontal waterline at current y496 on 941 canvas, dock, lighthouse, village, mountains, underwater ledges and plants remain in identical positions and shapes, same 16:9 dimensions. Replace sunset with a dim crescent moon in upper sky, a few faint stars. Deep inky sapphire sky, muted violet mist, desaturated rust foliage, jewel dark teal underwater, silver-blue reflected moonlight. Lighthouse beacon glows amber with a very subtle soft beam over lake, tiny amber village windows. Faint drowned stone architecture below, arch barely discernible through teal haze, no new objects or monsters. Match existing fine detailed painterly pixel-art texture exactly. Keep usable midtone detail, do not crush everything to black. No boats, people, fish, animals, rod, line, UI, text, logos, border. Single complete moonlit environment frame.
```

### 4 — transparent atlas request, failed alpha

Referenced image: `/workspace/scratch/583f4b850b8e/art/concept-dusk.png`

```text
Use case: stylized-concept. Supporting style reference: provided detailed painterly pixel-art fishing scene. Generate a PRODUCTION SPRITE ATLAS on TRUE TRANSPARENT BACKGROUND with real alpha, no painted background, no checkerboard pixels. Landscape 1536x1024. Exactly seven separated sprite assets, no text or grid lines. TOP HALF y40-450: ONLY one LARGE side-on wooden dinghy, 1100 pixels wide centered horizontally, full silhouette in frame, weathered dark timber planks and slim hull. Old adult fisherman seated center-right facing RIGHT with brimmed cap, cream shirt and forest-green coat, forearms held forward for later rod attachment, but ABSOLUTELY NO ROD or fishing line. Scruffy cream terrier sits near LEFT prow, looking right. Small warm lantern near right end. NO water, shadow floor, wake or reflection; hull underside clean cutout. LOWER HALF: six separated side-view fish sprites centered in clean 3-column by 2-row grid, one species per cell with generous empty transparent margins. Row 1 centers x256,768,1280 y615: left harbor cod (muted olive silver, normal fish silhouette); middle gold and green perch; right long slender whisper eel (pale teal, subtly uncanny). Row 2 centers x256,768,1280 y870: left translucent glass squid with elegant short tentacles; middle pale bony anglerfish with restrained lure; right impossible dark teal fish with several tiny amber eyes. Each fish about 280 pixels long, fits its cell, complete profile. Everything matches reference's rich detailed FINE painterly PIXEL ART, small coherent crisp square pixel clusters, subdued colors, warm dusk rim light. Not glossy cartoon, not vector, not photoreal; clean readable production silhouettes. Boat must be one coherent asset with fisherman, dog and lantern; six fish separate below. No extra assets, no text, no labels. Genuinely transparent alpha is mandatory.
```

### 5 — transparent boat request, failed alpha

Referenced image: `/workspace/scratch/583f4b850b8e/generated_images/exec-924fa083-0e4d-46fe-9df0-26a6676dc5eb.png`

```text
Use case: background-extraction. Create ONE production boat sprite isolated with REAL TRANSPARENT ALPHA, PNG RGBA. The reference checkerboard is an error: remove it completely; do not paint checkerboard or any solid background. Keep ONLY the top boat asset: side-on weathered wooden dinghy with old seated fisherman facing RIGHT, forest-green coat and brimmed cap, cream scruffy terrier near left end, small lantern near right end, exactly the reference design. Remove every fish and all grid/background. Center complete boat silhouette in wide landscape image, generous transparent empty margin on every side. Preserve fine pixel-art texture and body proportions. No fishing rod, no fishing line, no water, no cast shadow, no reflection. Outside the boat, fisherman, dog and lantern the pixels must be TRANSPARENT alpha=0. This is a cutout asset, not an illustration of a checkerboard. Return true transparency.
```

### 6 — explicit black-matte fallback atlas

Referenced image: `/workspace/scratch/583f4b850b8e/generated_images/exec-924fa083-0e4d-46fe-9df0-26a6676dc5eb.png`

```text
Use case: precise-object-edit. Edit this sprite atlas, keeping EXACTLY all seven asset designs, positions, size, fine pixel texture, and 1536x1024 canvas. Change ONLY ALL BACKGROUND into pure uniform solid black #000000. Replace every checkerboard square, every gray/white background pixel, and every wavy artifact with FLAT PURE BLACK. Black background between and around all sprites, also any gaps around dog/fisherman and inside eel bend. No checkerboard anywhere. Do not use transparency; solid RGB black is explicitly wanted for runtime chroma masking. No background texture, no glow outside silhouettes, no gradients, no cast shadows, no water, no labels or UI. Preserve the one large boat with fisherman, terrier, and lantern in upper half. Preserve six fish in lower 3x2 grid (cod, gold-green perch, eel / glass squid, anglerfish, many-eyed dark teal fish). Clean crisp silhouettes with strict hard outline boundary against black. Keep creature interiors colored with visible dark teal / brown highlights, avoid pure black inside creatures where possible. Output exactly this clean production sprite atlas on flat #000000.
```

## Visual assessment

Strong landscape depth, coherent amber/teal lighting, readable boat and terrier, and attractive sapphire night transformation. Geography and waterline align between production environments. Treatment is smoother and painterlier than the supplied Cast n Chill references. Drowned arch is somewhat more visible than intended. Masking source is viable but must be converted or masked explicitly at runtime; no true-alpha sprite file was successfully generated.


### 7 — Old Marsh shop portrait

Source: `/workspace/scratch/583f4b850b8e/art/old-marsh.png` (1024×1536, opaque RGB). Original output: `/workspace/scratch/583f4b850b8e/generated_images/exec-fc41d0e3-0f00-4cd6-b9c3-dd8834e71eb5.png`. Referenced image: `/workspace/scratch/583f4b850b8e/art/environment-dusk.png`.

```text
Use case: stylized-concept. Asset type: runtime shopkeeper portrait scene for the cozy cosmic-horror fishing game The Stillwater Below. Supporting style reference: provided dusk environment, use its cohesive detailed painterly pixel-art treatment and rich muted colors. Generate ONE intimate 2:3 portrait image, approximately 1024x1536, full opaque scene. Old Marsh, a weathered older New England fisherman in his late sixties, white beard, moss-green knitted cap, worn indigo shirt and brown work apron. Waist-up behind the counter of his dim antique fishing tackle shop. Face near the upper third of the frame, sly tired expression, kind but knowing eyes, natural adult proportions. Warm amber lamplight from the left catches beard, cheek, worn canvas and wood grain. Behind him rows of antique green and amber glass fishing floats, old fishing reels, coiled twine and wood shelves. Intimate crafted composition with layered environmental storytelling, restrained mystery, fine coherent hand-placed pixel clusters and beautiful material texture. Match reference's premium fine painterly pixel-art style; not photorealistic, not glossy cartoon, not 3D, no exaggerated caricature. Deep muted teal shadows, indigo cloth, moss green and warm worn oak, amber highlights. No text, labels, lettering, UI, logo, watermark or border. One complete opaque shop portrait scene.
```

Inspected: strong character expression, convincing worn tackle-shop materials and amber side light, fine painterly pixel texture coherent with the environment. Face near upper third, no text or UI. Window invents a small matching dusk harbor view that strengthens visual continuity. Some tiny rope/wood details remain painterlier than strict hand-placed pixel art. Suitable full opaque runtime portrait, no masking needed.


### 8 — true daylight environment

Source `/workspace/scratch/583f4b850b8e/art/environment-day.png` (1672×941 RGB), original `/workspace/scratch/583f4b850b8e/generated_images/exec-8e852909-cb99-4afa-9f0a-8b7aeac74e0b.png`. Referenced `/workspace/scratch/583f4b850b8e/art/environment-dusk.png`.

```text
Use case: lighting-weather. Edit target: the supplied production dusk environment. Create a TRUE DAYLIGHT version, full opaque scene, same 1672x941 dimensions and precisely registered geography. Preserve every mountain, island, shore, dock, lighthouse, rock, underwater ledge, plant and drowned arch in its existing position and shape. Preserve the foreground horizontal waterline at y496 of 941. Change ONLY lighting and time of day. Cool pale overcast daytime sky with soft gray-white clouds, NO visible sun, NO sunset, NO pink or orange sky glow. Broad diffuse daylight. Remove the orange sunset reflection from the lake and replace it with pale cool sky reflections. Lighthouse lantern OFF, all house windows unlit, no amber electric glow. Golden autumn foliage remains subdued natural ochre and rust, not luminous orange. Clear jewel teal underwater with diffuse daylight penetration, retained usable detail and subtle deep gloom around submerged arch. Same premium fine painterly pixel-art texture, not photoreal, not glossy illustration. No boat, characters, animals, fish, fishing rod, line, UI, text or logo. Exact same composition, no zoom, no crop, no shifted shoreline. This is a runtime daylight state intended to crossfade with the original registered scene.
```

Inspected: genuine cool overcast daylight, no sunset, lighthouse and windows visibly off; waterline y496 retained and geography matches. Underwater is brighter with more readable arch than dusk, appropriately distinct state.

### 9 — alert boat pose on black matte

Source `/workspace/scratch/583f4b850b8e/art/sprites-alert-black-matte.png` (1536×1024 RGB), original `/workspace/scratch/583f4b850b8e/generated_images/exec-030683b2-2347-4395-ba38-93213a9f61bd.png`. Referenced `/workspace/scratch/583f4b850b8e/art/sprites-black-matte.png`.

```text
Use case: precise-object-edit. Edit the supplied black-matte production sprite atlas. Keep EXACTLY 1536x1024 canvas, black #000000 background, original boat hull geometry, boat position and size, lantern position, colors, texture and all six lower fish. Change ONLY the fisherman's upper body pose and dog's head pose to an alert fishing-fight reaction. Fisherman leans back slightly toward LEFT, shoulders tense, right forearm extended and taut toward RIGHT, right hand closed for holding a rod that will be drawn later (do not include any rod or line). His cap, face identity, forest-green coat and seated legs remain the same. Keep fisherman inside the original sprite's overall height. Dog remains seated in its exact location at left, turns head toward RIGHT water, ears perk alert, same scruffy cream terrier identity. CRITICAL registration: boat spans x100 to1432; hull bottom at y486; hull top and both prow ends exactly unchanged. Lantern exactly at existing position. Preserve boat silhouette pixel-for-pixel as closely as possible, no zoom, no reframing. No water, no wake, no shadow, no checkerboard, no transparency. Background stays pure solid black RGB for runtime masking. All fine painterly pixel-art treatment and warm amber dusk palette unchanged. This is a registered alternate character pose for the same boat sprite, not a new illustration.
```

Inspected: readable leaning-back alert pose and perked terrier. Boat ends, hull bottom and lantern register closely, but internal plank texture is repainted; not pixel-identical. Use same safe boat crop (90,25,1352,472) and waterline pivot (676,451). Alert rod-hand origin approximately (968,187) within crop, i.e. (1058,212) in atlas, versus original approx (955,235) within crop. Same edge-connected near-black masking requirement as normal atlas; RGB is not alpha. Best used as one discrete state change, not rapidly alternating animation frames, because texture can flicker.

## Final runtime import and registration

The canonical files are checked in under `v2/public/art/`: `environment-dusk.png`, `environment-day.png`, `environment-night.png`, `sprites.png`, `sprites-alert.png`, and `old-marsh.png`. The provisional concept is `docs/rebuild/concept-dusk.png`. Scratch paths above record generation provenance; they are not runtime dependencies.

Both boat poses use crop `(90,25,1352,472)`, pivot `(676,451)`. Idle rod hand is `(955,235)`; alert hand is `(968,187)` within that crop. The alert boat switches once for the whole bite/fight/catch interval, and briefly after the first abnormal discovery. The hull registration was inspected; repainted plank texture makes rapid alternation inappropriate. These are two held poses, not a fully articulated animation rig.

The initial runtime black-matte threshold of 29 damaged dark coat regions in the first review. Final edge-connected masking uses `RGB max < 8`, caches immutable ImageBitmaps, and preserves the RGB source atlases. The runtime mask and hand alignment were inspected in actual gameplay.

Final daytime uses the authored overcast background, not a sunset recolor. Dawn remains a warm variant of dusk. The lake refraction mask uses the production artwork's source coordinates and transforms with the crop; underwater refraction, moving mist, fish, rod, bobbing, reflection and feedback are independent runtime elements.

## v0.3 continuous-world art pass

The preceding sections describe the retained v0.2 assets. v0.3 uses separately articulated hull/body/forearm/dog/oar assets, not two whole-boat poses. The old whole-boat sprites remain a fallback and fish source. The following briefs summarize the generation constraints retained from the continuation; they are not represented as verbatim tool transcripts.

| Canonical file | Size | Purpose and alpha |
| --- | --- | --- |
| docs/rebuild/concept-continuous-waters.png | 1672×941 | Original target for continuous layered fishing scenery |
| v2/public/art/shoreline.png | 2172×724 | Four separated village/forest/lighthouse/reed shore groups; genuine alpha |
| v2/public/art/dock.png | 1672×941 | Side-view physical dock/shop scene; genuine alpha |
| v2/public/art/actors.png | 1536×1024 | Separated hull, human/early-transformed body, forearm, dog and oar; checker matte extracted at load |
| v2/public/art/objects.png | 1536×1024 | Boot, tin, net, compass, idol and journal; checker matte extracted at load |
| v2/public/art/sea-chart.png | 1672×941 | Decorative fictional parchment chart; opaque, exact pins/routes are separate HTML/SVG |
| v2/public/art/deep-one.png | 1536×1024 | Full seated gilled creature replacing weak late-stage face swap; checker matte extracted at load |

Generation briefs:
1. Continuous-water concept: original painterly pixel fishing world with multiple depth planes, distant mountains/town, independent shores, mist, long open water, small human/dog boat, understated Lovecraft dread. A visual target, not a functional screenshot.
2. Shore atlas: separate isolated autumn village, fir forest, lighthouse island and near-shore reeds, matched teal/amber palette, no baked full-scene background, suitable for separate parallax.
3. Dock: complete weathered physical wooden dock and small tackle outpost, side-on contact with water, pilings visible for underwater reveal; warm lamps and cohesive pixel-painted materials.
4. Actor atlas: separated boat hull, seated fisherman, early transformed body, forearm, terrier and oar; coherent proportions for code-driven articulation. No baked rod/line, scene, wake or reflection.
5. Catch objects: distinct boot, tin, net, compass, idol and journal in separated cells; weathered readable silhouettes and cohesive materials.
6. Decorative nautical chart: flat 16:9 parchment, original fictional New England coast; sheltered wooded mainland harbour lower left, ragged reef chain centre, ominous trench upper right; faded sage/teal engraving, coast hatching, firs, hills, hamlets, lighthouses, restrained waves, fine pixel-painted detail, warm ivory/sand. No text, labels, pins, routes, UI or frame. Original output exec-953100df-0058-4613-893c-50188ca243f9.png.
7. Full Deep One: use actors atlas as style reference; one right-facing seated hips-up creature, large amphibian head, protruding jaw, pale bulging amber eye, ridged gill neck, hunched back/fin spines, webbed hand bent to grip a future rod. No hat, hair or beard. Ragged open olive coat, teal-gray scaled head/neck/chest/hands; fine pixel painting, no glossy 3D/cartoon treatment. Dim cool moonlight and restrained lantern rim; no scene, boat, seat, rod or text. Transparency requested, but actual output contained a checker matte. Original output exec-c9ff5aff-b8c9-415d-afc7-60d12b711533.png.

### Runtime extraction and pivots

Unedited original generated files are retained. Runtime edge-connected flood masking removes near-black pixels with RGB max<8, or exterior neutral light checker pixels (lowest channel>175 and channel spread<28). Enclosed eyes and dark interior details are preserved. The new creature/shores are alpha-trimmed after cropping for consistent actual contact bounds. Checker sources are not advertised as genuine alpha.

Actors: hull(5,282,699,250), human(704,95,415,459), early deep(1138,96,392,460), forearm(57,680,424,183), dog(546,598,326,348), oar(861,711,655,137). Each is independently transformed around seat/elbow/hull pivots. Rod grip is attached to the visible hand; the late creature has a separate grip offset. The rod and line are runtime curves.

Shore: village(10,210,600,385), forest(615,250,490,345), island(1110,215,560,380), reeds(1690,290,460,305). Bounds trimmed to actual alpha before placement. Forest nominal width230 world units, other middle-distance shores480, scaled per world object. Reflections/contact ripples are rendered separately.

Objects: boot(0,0,512,500), tin(512,0,512,500), net(1024,0,512,500), compass(0,500,512,524), idol(512,500,512,524), journal(1024,500,512,524).

Night variants are cached once: actor/shore brightness .66, saturation .76 with cool source-atop tint; creature brightness .83, saturation .88; dock brightness .64/saturation .78. No per-frame sprite filtering. Ruin arches are a code-native textured bitmap, shared by editor preview and underwater runtime.

Final concept-to-runtime evidence: quality/v0.3/. The full late creature and cooler night rig raised the independent still-image score from7.9 to8.1. Texture consistency and contact interaction retain visible polish opportunities.
