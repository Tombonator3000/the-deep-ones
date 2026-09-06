# Actual v0.3 browser journey — 6 September 2026

Supervised Vite preview, cloud Chrome 151, desktop 1363×936/DPR1 and simulated 390px game container. Actions used visible UI. No hidden state, storage injection or fixtures were used for the campaign journey.

| Action | Observed result |
| --- | --- |
| Cast at 12–18m | Opaque water before casting; camera/cutaway opened as hook sank |
| Miss bite / over-tension fight | Escape and line-break paths returned to playable state |
| Alternate reel/slack | Skumringsabbor landed, value46; keep added it to inventory |
| Sail left to physical dock | Roughly360m return, distance decreased, boat faced left; dock control available only nearby |
| Sell catch | Money266→312, inventory cleared |
| Buy Blackthorn Reef license | Money312→172; destination available |
| Chart travel from dock | Abyss still locked at360; licensed reef opened at its own dock |
| Reload | 172coins, reef license, rod level1, journal3, empty inventory preserved |
| Create Brisvika in editor | Added ruin, dragged world x900→1098, saved and exported |
| Playtest custom area | Brisvika opened as labelled test with separate test resources |
| Exit test and reload | Campaign restored172/Blackthorn/journal3; custom area retained |
| Portrait controls/chart | No horizontal overflow390px; no-selection/touch-action styles; menus inside game container |
| Settings/audio | On/off UI responded; dawn/day/dusk/night produced usable distinct scenes |

Editor name initially failed to persist; fixed and save/playtest/restore repeated successfully. Chart label overlap corrected by moving the custom pin. File-picker import could not be exercised by the browser API; JSON roundtrip and malformed-schema cases are Node-tested.

## Separate visual fixtures

Visible QA controls loaded surface,60m depth,15-sanity transformation and post-Deep-One scenes. These are labelled **Isolert testscene** and preserve the campaign. They verify rendering, not earned relics/endings. Shallow/deep captures show a sinking cast; later actor/night changes are identified in the screenshot manifest.

The independent critic reviewed desktop, portrait, depth, chart and editor stills. Final score8.1/10 followed the full creature silhouette/night-lighting pass. Ten tests separately cover simulation, ending gates, sanity stages, transactions, migration and custom-world validation.

Physical touch, smooth continuous animation and auditory mix are not certified. Frame samples and the no-game control are in PERFORMANCE.json.

Final boundary check caught clipped boat/rod at the far edge. Added320world-unit camera margins at both ends; full boat and outward rod then stayed visible. Final fixed-source benchmark at the far reef boundary included a12m cast and unattended bite expiry; normal motion explicitly enabled. See final/boundary.jpg and PERFORMANCE.json.
