export const FISH = [
  { kind: 'fish', id: 'cod', name: 'Harbor Cod', local: 'Havnetorsk', depth: [0, 38], value: 38, loss: 0, weight: 1.6, length: 42, color: '#aaac7a', text: 'En helt vanlig torsk. Det er godt at noen ting fortsatt er det.', note: 'I grunna, mellom brygga og skjærene. Biter på nesten hva som helst.' },
  { kind: 'fish', id: 'perch', name: 'Midnight Perch', local: 'Skumringsabbor', depth: [8, 52], value: 46, loss: 0, weight: 0.9, length: 28, color: '#cda767', text: 'Stripene blir mørkere etter solnedgang. Ingen på kaia synes det er rart.', note: 'Liker det siste lyset, rett under den varme overflaten.' },
  { kind: 'fish', id: 'eel', name: 'Whisper Eel', local: 'Hviskeål', depth: [22, 85], value: 84, loss: 14, weight: 2.3, length: 81, color: '#80b6a7', text: 'Du hørte den før du så den. Stemmen var den samme som i barndomshjemmet ditt.', note: 'Nedenfor 22 meter. Den svømmer mot linen når resten av stimen snur.' },
  { kind: 'fish', id: 'squid', name: 'Glass Squid', local: 'Glassblekksprut', depth: [40, 110], value: 108, loss: 19, weight: 3.1, length: 63, color: '#abdbd7', text: 'Gjennomsiktig. Du kan se hva den har spist. Det var ikke en fisk.', note: 'Dypt under fyret. Lanternen din skinner tvers gjennom den.' },
  { kind: 'fish', id: 'angler', name: 'Bone Angler', local: 'Beinulke', depth: [65, 150], value: 152, loss: 25, weight: 5.8, length: 77, color: '#d9cbab', text: 'Lyset er vakkert. Du vil se på det litt til. Bare litt til.', note: 'Under 65 meter. Når dens lys tennes, slukker de andre.' },
  { kind: 'fish', id: 'choir', name: 'The Congregation', local: 'Menigheten', depth: [95, 150], value: 240, loss: 35, weight: 8.6, length: 109, color: '#8ec1b5', text: 'Flere fisk. Én pust. Du slipper blikket fra dem, men de slipper ikke deg.', note: 'Lengst ute. Dypest nede. Old Marsh vil ikke snakke om den.' },
];
export const RODS=[
 {name:'Den gamle bambusstanga',depth:30,price:0,strength:1,detail:'En trofast stang for bukta.'},
 {name:'Marshs dypvannsstang',depth:60,price:90,strength:1.22,detail:'Når ned til de første hemmelighetene.'},
 {name:'Loddet fra vraket',depth:100,price:240,strength:1.45,detail:'Sterkere snelle. Linen synger i vinden.'},
 {name:'Avgrunnskalleren',depth:150,price:560,strength:1.7,detail:'Til det siste mørket. Hold godt fast.'}
];
export const LURES=[
 {id:'worm',name:'Meitemark',price:0,detail:'Abborens favoritt. God til havnetorsk i grunna.'},
 {id:'shrimp',name:'Saltreke',price:45,detail:'Torsk elsker reke. Blekksprut undersøker den også.'},
 {id:'jig',name:'Lysende pilk',price:65,detail:'Best til glassblekksprut. Ål følger lyset.'},
 {id:'magnet',name:'Bergingsmagnet',price:80,detail:'Berg skrap og relikvier. Fisk liker sjelden metall.'},
 {id:'blood',name:'Blodagn',price:110,detail:'Lokker hviskeål og beinulke fra mørket.'},
 {id:'offering',name:'Den tause offerkroken',price:240,detail:'Menigheten samler seg rundt den. Brukes i avgrunnen.'}
];
export const BOATS=[
 {name:'Den gamle sjekta',price:0,capacity:8,speed:1,detail:'Fars trebåt. Lett, liten og kjent.'},
 {name:'Rødvinge',price:180,capacity:14,speed:1.38,detail:'En smal rød sjekte. 14 plasser, 38 % raskere.'},
 {name:'Marshs arbeidsbåt',price:480,capacity:22,speed:1.65,detail:'Blå motorbåt med lavt akterhus. 22 plasser, 65 % raskere.'},
 {name:'Den bleke fergen',price:880,capacity:18,speed:1.48,detail:'Et beinblekt skrog. 18 plasser, 25 % mindre sinnsrotap.'}
];
export const EQUIPMENT=[
 {id:'line',name:'Flettet sjøline',price:75,detail:'25 % langsommere økning i linetrekk under kamp.'},
 {id:'reel',name:'Messingsnelle',price:125,detail:'20 % raskere innsveiving når fisken gir etter.'},
 {id:'lamp',name:'Vokterens lykt',price:160,detail:'20 % mindre sinnsrotap fra unormale fangster.'}
];
export const OBJECTS=[
 {id:'boot',kind:'junk',name:'The Other Boot',local:'En gammel støvel',depth:[0,55],value:8,loss:0,weight:1.1,length:31,color:'#746555',text:'Venstrestøvel. Hver eneste gang.',note:'Skrap kan selges til Marsh. Magneten finner mer.'},
 {id:'tin',kind:'junk',name:'Rust & Salt',local:'Rusten hermetikk',depth:[0,70],value:6,loss:0,weight:.3,length:15,color:'#a68d71',text:'Etiketten lover fersk makrell. Den har løyet i førti år.',note:'Finnes i grunne viker og ved brygger.'},
 {id:'net',kind:'junk',name:'Ghost Net',local:'Et forlatt garn',depth:[18,150],value:18,loss:0,weight:2.2,length:84,color:'#8c9b7c',text:'Noe har bitt seg ut. Gjennom knutene.',note:'Vrakbeltet er fullt av gammel fiskeredskap.'},
 {id:'compass',kind:'relic',name:'The Untrue North',local:'Kompasset uten nord',depth:[24,60],value:0,loss:5,weight:.4,length:12,color:'#d1b276',text:'Nåla peker ned. På baksiden: «Kapellet husker veien.»',note:'Ved kapellet lengst øst i Stillwater, under 24 meter. Første del av forseglingen.'},
 {id:'journal',kind:'relic',name:'The Last Log',local:'Den druknedes journal',depth:[48,100],value:0,loss:8,weight:.7,length:24,color:'#a6946e',text:'Siste innføring er datert i morgen. Skriften er din.',note:'I Klokkedypet på Blackthorn, under 48 meter. Andre del av forseglingen.'},
 {id:'idol',kind:'relic',name:'The Patient God',local:'Dagons lille avgud',depth:[85,150],value:0,loss:12,weight:2.4,length:29,color:'#6da69e',text:'Den er varm. Det som venter nedenfor har holdt i den lenge.',note:'Ved Avgrunnsporten, under 85 meter. Siste del. Ta vare på mennesket i deg.'}
];
export const CATCHES=[...FISH,...OBJECTS];
export const getCatch=id=>CATCHES.find(f=>f.id===id);
export const STAGES=[{id:'human',name:'Menneske',min:70},{id:'touched',name:'Berørt',min:40},{id:'changing',name:'I forandring',min:20},{id:'becoming',name:'Nesten en av dem',min:1},{id:'deep',name:'En Deep One',min:0}];
export const stageFor=sanity=>STAGES.find(s=>sanity>=s.min)||STAGES[4];
