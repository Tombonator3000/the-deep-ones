# The Stillwater Below — leveranse og Gauntlet-resultat

6. september 2026. Dette er en spillbar første del med ny grafikk og ny, avgrenset spillmotor. Den gamle prototypens komplette kampanje er ikke gjenoppbygd. Kildegrunnlag: `b25609d8be952085f85797dd4a178813ad5b256e`. De eksakte filene som er testet og bygget identifiseres av `BUILD-FINGERPRINT.json` i denne mappen; rapporten følger samme kildeversjon.

## Hva som fungerer

Du kan ro, velge dybde, kaste, sette kroken, veksle mellom sveiving og slakk, miste eller lande fisk, beholde eller slippe fangsten fri, selge hos Old Marsh, kjøpe bedre stang og finne den første unormale arten. Fiskekasse, penger, stang, loggbok og sinnsro lagres lokalt. Bris kan klappes, og hvile ved brygga gjenoppretter sinnsroen. Lyd må aktiveres av spilleren.

Den faktiske brukerreisen er dokumentert i `USER-JOURNEY.md`: torsk + abbor ga 84 mynt; startbeløpet 20 ble til 104, stanga kostet 90, og 14 sto igjen. På 24 meters dybde ble hviskeålen fanget og beholdt. Sinnsro 86, tre oppdagede arter, stang og penger overlevde ny innlasting. Ingen skjult manipulering av spilltilstand ble brukt for denne testen.

## Krav og resultat

| Krav | Status | Bevis / begrensning |
| --- | --- | --- |
| Sammenhengende fangst → handel → oppgradering → unormal oppdagelse | PASS | Faktisk brukerreise gjennom synlige kontroller |
| Lagre og fortsette | PASS | Ny innlasting gjenopprettet de observerte verdiene |
| Regler, pause, tidsuavhengig simulering og transaksjonsvern | PASS | Seks meningsfulle Node-tester; samme tidsbestemte input ved 30/60/120 Hz |
| Byggbar leveranse | PASS | Vite-produksjonsbygg gjennomført; låste avhengigheter |
| Lesbare spill-, bok- og butikkflater | PASS på observerte størrelser | 1363×936, simulert 390 px bredde og faktisk 500×824 nettleserflate; fysisk berøringsskjerm ikke kontrollert |
| Visuell helhetsvurdering >8/10, med 10 = moderne AAA | FAIL / åpen | Uavhengig Astra: 6,5 → 7,4 → 7,8; vurderingsankeret ble beholdt |
| Skymåling med definerte frame-grenser | PASS | 120 s, 59,6 fps, p95/p99 16,8 ms; fire intervaller >50 ms |
| Vedvarende 60 fps på representativ målmaskin og produksjonsbygg | UNVERIFIED | Skymålinger beskrives separat; de sertifiserer ikke spillerens PC eller telefon |
| Lyd | Delvis verifisert | På/av virker i UI. Lyttetest og miks er ikke verifisert |

## Tre korrigerende runder

| Runde | Observert problem | Gjennomført rettelse og kontroll |
| --- | --- | --- |
| 1 — 6,5/10 | Mobiloverlapp, skadet mørk sprite, lys natt under vann, liten kampmåler, flat loggbok | Containerbasert oppstilling; mattegrense 29 → 8; nattkontrast; større måler med framgang; papir og innbinding |
| 2 — 7,4/10 | Morgengry ikke valgbart, usynlig lukkeknapp over butikkbildet, solnedgang også om dagen, statiske reaksjoner | Gyldig valgfelt; fast kontraststerk lukkeknapp; nytt dagslysbilde; egen reaksjonspose |
| 3 — 7,8/10 | Kontinuerlig bevegelseskvalitet utilstrekkelig dokumentert | Overflaterefleksjoner og tåke beveger seg separat; fisker/hund reagerer ved napp; hånd/stang og skrog undersøkt i faktisk napp. Helhetskravet er fortsatt åpent |

Fullstendige, uavhengige rapporter og uendrede skjermbilder ligger i `round-1/`, `round-2/` og `round-3/`. Skår er en subjektiv kritikervurdering, ikke et ytelsesmål eller en sertifisering.

## Konsept og faktisk spill

Det foreløpige målet er `docs/rebuild/concept-dusk.png`. De leverte bakgrunnene er opprinnelig genererte illustrasjoner; båt, fisk, line, refleksjoner, tåke og tilbakemeldinger tegnes separat. All tekst, alle knapper og alle menyer er faktiske HTML-elementer.

| Referansetrekk | Faktisk implementering | Gjenværende forskjell |
| --- | --- | --- |
| Rolig høstvik, fjell og fyr over et synlig dyp | Samme kystgeometri og sammenhengende utsnitt | Konseptets vannlinje var ca.49,8 %; produksjonsbildenes er 52,71 % og er brukt konsekvent |
| Liten trebåt, fisker, hund og varm lykt | To registrerte båtposer; dynamisk stang, dupping og refleksjon | To holdte positurer, ingen komplett animasjonsrigg |
| Levende vann og tåke | Maskert overflatebrytning, undervannsstriper, glimt og bevegelig tåke | Sammenhengende kvalitet må vurderes under stabile opptaksforhold |
| Tydelig døgnstemning | Tre tegnede miljøer: skumring, overskyet dag og natt | Morgengry bruker en varm variant av skumringsbildet |
| Lovecraft-inspirert uro | Dybdekrav, unormale arter, sinnsrovalg, hvisking og kort skyggeeffekt | Et første møte; ingen ferdig historie med alle gamle avslutninger |

`runtime/dusk.jpg` og `runtime/day-narrow.jpg` viser siste spillflate. `runtime/shop.jpg` og `runtime/whisper-eel.jpg` viser den gjennomførte handels-/fangstreisen før siste miljøpass. De er skjermbilder fra spillet og er ikke retusjert.

## Ytelse og testmiljø

Første skymåling ga ca.1–2 fps, også med animert lag avslått og tilnærmet 0 ms tegnetid. Det peker mot begrensning i testmiljøets levering av frames; årsaken er ikke bevist. Lav tegnetid alene ble ikke brukt som 60-fps-bevis. Etter at spillflaten var aktiv og ble brukt, viste samme nettleser 60 fps. Avsluttende prøve: **59,6 fps**, **p95 16,8 ms**, **p99 16,8 ms**, fire intervaller over 50 ms, 7153 frames på 120 sekunder, 0 synlighetsavbrudd, én oppløsning **1363×936 / DPR 1**, gjennomsnittlig tegnetid 0,27 ms. De valgte skymålingsgrensene bestod. Råresultat, arbeidslast og begrensninger finnes i `PERFORMANCE.json`.

Måleverktøyet bruker 5 sekunders oppvarming, deretter 120 sekunder med requestAnimationFrame-intervaller. Tersklene er p95 ≤17,5 ms (liten vsync-toleranse), p99 ≤20 ms; pauser i synlighet gjør målingen ugyldig. Det måler også antall intervaller over 50 ms og CPU-tid for tegning. GPU-tid og minneprofil er ikke målt. Testing i denne økten brukte den overvåkede Vite-forhåndsvisningen og sky-Chrome 151; produksjonsbygget er laget fra de samme kildefilene, men et produksjonsbygg på fysisk målmaskin må testes separat.

## Neste avgrensede steg

1. Åpne produksjonsbygget på vanlig PC og ønsket telefon. Gjenta målingen med `?qa=1` ved samme grafikkinnstilling, inkludert kast, kamp, fangst, butikk og reise. Dokumenter maskin, oppløsning og p95/p99.
2. Spill inn 20–30 sekunder med stabil bildefrekvens. La kritikeren vurdere særlig vann, figurreaksjoner og overganger mot det uendrede konseptmålet. Lag sammenhengende figuranimasjon der opptaket viser et konkret behov.
3. Utvid deretter én sone med neste fortellingshendelse og fiskbare funn. Behold de fungerende reglene og lagringsformatet mens mer av den gamle idébanken velges ut.

Ingen bakgrunnsjobb fortsetter utviklingen etter denne leveransen. Endringer skal vurderes videre fra denne dokumenterte prototypen.

Et ekstra lesende bevegelsespass finnes i `round-3/motion-addendum.md`. Tre påfølgende bilder bekreftet flyttende fisk, båt/stang og vannmønstre med stabil kyst og skrog. Helhetsskåren ble stående på 7,8; dette ble ikke brukt til å hevde sammenhengende figuranimasjon. Den eneste kodeendringen etter dette visuelle passet reparerte målepanelets ferdigmelding og gjorde oppløsningsendringer ugyldige i ytelsestesten. Den endelige målingen brukte denne rettelsen.
