# Independent visual/gameplay review — Stillwater Below v0.2

Review date: 2026-09-06. Live URL: http://terminal.local:4173/?qa=1 . Fixed side-view 2D scene reviewed on desktop 1363×936 and application QA 390×936 portrait container (not a physical-device test). Scale: 10 means contemporary AAA production quality; no rescaling for project size. No repository edits performed.

## Provisional score: 6.5 / 10

The landscape art direction is the strongest element, around 8/10 for a still composition: warm autumn forest, New England harbor buildings, sunset/mist depth, inviting lantern and dog, and a coherent underwater cross-section. Runtime closely follows the supplied concept in palette, geography, mood, and readable division of water/air. This is convincing visual direction for a small atmospheric game. It does not yet demonstrate >8/10 contemporary production quality as a running game.

What materially holds the score back:

1. Actor cutouts are visibly damaged/speckled compared with the softer environment. The fisherman's coat in particular has missing-looking dark pixels and looks like noisy camouflage. The boat, fish and dog need consistent clean mattes, edge treatment, lighting, and expressive animation. Root identified matte threshold as likely cause and plans a correction; that correction was not yet inspected for this score.
2. Animation delivery in this cloud browser is extremely sparse despite document.hidden=false and zero visibility interruptions. A normal cast took roughly minutes to get to bite. Diagnostic samples were 4 frames/3 measured seconds, 15/9, 124/66, 135/73,165/90. Closing the other game tab did not restore normal delivery. This prevents a credible judgement of living motion, feel, or full gameplay completion. It is a measured limitation of this run, not proof that end-user hardware behaves identically. Need renderer cost versus frame delivery diagnosis and a valid smooth-runtime repeat.
3. Fight hierarchy is underpowered. Tension is an ~8px stripe, catch progress a very thin unlabeled line, and a 12m disabled depth slider remains prominent while another number shows remaining distance. Enlarge the fight state, label distance/progress, give safe/warning zones stronger separation, and deemphasize irrelevant depth setup while fighting. Hooked fish movement/rod loading should support the same feedback visibly.
4. Night retains very bright teal underwater rays that resemble daytime shafts. A deeper blue/less saturated underwater treatment with localized lantern/moonlight and selective disturbing motion would better connect the two halves and sell the tonal turn.
5. Portrait originally had severe title/location overlap and bottom controls stacked on top of each other. Root fixed this during review; a fresh portrait screenshot confirms top title/currency/place and bottom cast/movement/pet/journal/dock all fit without overlap. This specific blocker is resolved at tested 390×936 container size. Shorter phones still need separate checking.
6. Journal has clean hierarchy and fits portrait, but flat beige paper and simple grid feel like UI scaffolding rather than an authored collectible object. Avoid revealing unknown names through img alt text: current unknown tiles expose full names (Whisper Eel, etc.) in the accessibility tree.

## Real actions observed

- Opened fresh game tab, inspected desktop dusk and clean night state.
- Switched portrait using provided UI; identified overlap; rechecked after root patch.
- Cast at12m, observed casting, waiting, bite; clicked to hook/reel and clicked again to slack. Hooked fish and tension/progress feedback rendered. Slow frame delivery stopped completion.
- Opened settings, selected Natt, returned to water. Settings instructions clearly explain click-to-toggle and hold Space. Gameplay paused during native dialog.
- Opened empty journal in portrait, inspected typography, unknown specimens and layout. Dialog fits and close affordance is clear.
- Catch modal, kept/released specimen, dock selling/upgrading, first abnormal eel not yet verified through this browser path. Do not report those as passed from this review.
- No app errors observed in inspected logs; extension metadata errors excluded.

## Evidence

- /workspace/scratch/critic-dusk.jpg — clean desktop waiting state, dusk.
- /workspace/scratch/critic-night.jpg — clean desktop waiting state, night.
- /workspace/scratch/critic-fight.jpg — desktop active fight, before HUD/art corrections.
- /workspace/scratch/critic-portrait-fixed.jpg — repaired390px portrait active fight.
- /workspace/scratch/critic-journal-portrait.jpg — empty journal in repaired portrait.

Score remains provisional until smooth frame delivery and full catch→sell→upgrade→abnormal discovery user path are inspected. Do not substitute concept art or engine unit tests for missing runtime evidence.

## Completed diagnostic (not production acceptance benchmark)

120 seconds,202frames,average1.68fps,p95/p99 both1016.5ms,124stalls>50ms,meanRender0.46ms,interruptions0,canvas390×936,DPR1,gateFAIL. Measurement included layout change and open journal, so it is diagnostic only. Very low renderer call cost together with ~1second frame intervals suggests sparse browser frame scheduling/delivery rather than a CPU-heavy renderer, but this is an inference, not a proven cause. Document visibility remained visible at inspected point. Browser tab9 left open in journal (fight paused); root may resume ownership.
