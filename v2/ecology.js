// Shared ecology: what is visible in the water also affects encounter weights.
export const ECOLOGY={
 cod:{areas:['cove','reef'],baits:{worm:.85,shrimp:1,jig:.45,blood:.25,offering:.08,magnet:.05}},
 perch:{areas:['cove','reef'],baits:{worm:1,shrimp:.7,jig:.8,blood:.2,offering:.1,magnet:.04}},
 eel:{areas:['cove','reef','abyss'],baits:{worm:.45,shrimp:.65,jig:.8,blood:1,offering:.5,magnet:.04}},
 squid:{areas:['reef','abyss'],baits:{worm:.12,shrimp:.8,jig:1,blood:.45,offering:.7,magnet:.03}},
 angler:{areas:['reef','abyss'],baits:{worm:.08,shrimp:.3,jig:.65,blood:1,offering:.85,magnet:.03}},
 choir:{areas:['abyss'],baits:{worm:.03,shrimp:.1,jig:.3,blood:.65,offering:1,magnet:.02}}
};
export const affinity=(id,lure)=>ECOLOGY[id]?.baits[lure]??.8;
export function schoolSpecies(area,index){const pool=Object.keys(ECOLOGY).filter(id=>ECOLOGY[id].areas.includes(area==='custom'?'cove':area));return pool[((index%pool.length)+pool.length)%pool.length];}
export const WEATHER={clear:{name:'Opphold',wind:.18,rain:0,fog:.12},wind:{name:'Frisk bris',wind:.75,rain:0,fog:.15},mist:{name:'Havtåke',wind:.13,rain:0,fog:.85},rain:{name:'Regnbyger',wind:.55,rain:.55,fog:.4},storm:{name:'Uvær',wind:1,rain:1,fog:.5}};
export function weatherFor(save,area){const cycles={cove:['clear','wind','mist','rain'],reef:['rain','wind','storm','mist'],abyss:['mist','storm','wind','rain']};const sequence=cycles[area]||cycles.cove;const kind=save.weather!=='auto'&&WEATHER[save.weather]?save.weather:sequence[(Math.floor(save.played/95)+save.day-1)%sequence.length];return {kind,...WEATHER[kind]};}
