# Actual browser journey — 6 September 2026

Environment: the supervised Vite preview of `v2/`, cloud Chrome 151, desktop canvas 1363 × 936 at DPR 1. This was a real UI journey using the visible cast/reel/slack, keep, dock, sell, buy and return controls. No save injection or hidden game-state mutation was used. The final source fingerprint is recorded in `BUILD-FINGERPRINT.json`.

| Step | Observed result | Status |
| --- | --- | --- |
| Cast, hook, reel without enough slack | Line snapped; failure message; returned to ready | PASS |
| Miss the bite window | Fish escaped; new cast available | PASS |
| Alternate reeling and slack; keep first cod | Harbor Cod, 38 coins value; inventory 1; journal 1 | PASS |
| Catch and keep second fish | Midnight Perch, 46 coins value; inventory 2; journal 2 | PASS |
| Return to Old Marsh | Boat moved to dock and shop opened; sale offered 84 | PASS |
| Sell both fish | Starting 20 + 84 = 104 coins; inventory cleared | PASS |
| Buy 90-coin deep-water rod | 14 coins left; rod marked in boat | PASS |
| Return to cove | Maximum depth 40 m; chosen depth 24 m | PASS |
| Fish at 24 m with new rod | Whisper Eel landed; 84-coin value, 14 composure cost displayed | PASS |
| Keep abnormal catch | Composure 86; journal 3/6; inventory 1/8 | PASS |
| Navigate to the preview again | 14 coins, 86 composure, 40 m rod, 24 m depth, journal 3/6 and inventory 1/8 restored | PASS |

Capture evidence: `runtime/shop.jpg` shows the purchased rod and 14-coin balance. `runtime/whisper-eel.jpg` shows the abnormal catch and the explicit keep/release tradeoff. These are unedited runtime screenshots, not concepts.

The browser delivered roughly 1–2 animation frames/second during most of this journey. Automated Playwright clicks sometimes timed out while the control was visibly enabled. Direct pointer clicks worked; the controller read the visible tension meter and spaced actions to avoid acting on a stale frame. The game remained completable, but this is not a smoothness pass. Fixed bounded simulation substeps prevent game time from depending directly on frame count. The equivalent-input automated test separately compares 30, 60 and 120 Hz.

Release, full inventory, pet cooldown, malformed saves, pause, sequential upgrade and duplicate-transaction guards are covered by the pure simulation tests. That coverage is not labeled an additional browser journey. Physical touch, sustained target-device performance, auditory mix quality and the old campaign are outside the verified evidence above.

Final benchmark follow-up, same final source fingerprint: a further real cast/hook/reel/slack/catch/**release** journey completed at normal cloud frame delivery. Journal open/close, keyboard activation of boat movement, shop open and return to boat also worked. The 120-second measurement and its limits are in `PERFORMANCE.json`.
