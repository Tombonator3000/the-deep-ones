import {ECOLOGY,affinity,schoolSpecies,weatherFor} from './ecology.js';
import {STORY,objective} from './story.js';
import {AREAS,validateWorld,worldExport} from './world.js';
import {FISH,RODS,LURES,BOATS,EQUIPMENT,OBJECTS,CATCHES,getCatch,stageFor} from './content.js';
export {FISH,RODS,LURES,BOATS,EQUIPMENT,OBJECTS,CATCHES,getCatch,stageFor};
export const CONFIG=Object.freeze({saveKey:'stillwater-below-v2',capacity:8,moveSpeed:235,acceleration:2.8,daySeconds:540,petCooldown:60,dockRadius:145,sinkSpeed:9});
export const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export function freshSave(){return {version:4,boats:[0],equipment:[],weather:'auto',diary:{letter:1},storyRead:[],money:20,sanity:100,rod:0,boat:0,lure:'worm',lures:['worm'],licenses:['cove'],area:'cove',inventory:[],journal:{},relics:[],relicOrder:[],caught:0,day:1,cycle:.66,x:760,facing:1,targetDepth:12,discovery:false,petAt:-100,played:0,muted:true,reduced:false,light:'auto',ending:null,endless:false,customWorld:null,visited:['cove']};}
const numeric=(v,f,a,b)=>Number.isFinite(v)?clamp(v,a,b):f;
export function validateSave(raw){
 if(!raw||![2,3,4].includes(raw.version))return freshSave();const s=freshSave(),legacy=raw.version===2;
 for(const [k,a,b]of [['money',0,1e7],['sanity',0,100],['rod',0,3],['boat',0,3],['caught',0,1e6],['day',1,1e5],['cycle',0,1],['targetDepth',4,150],['played',0,1e9],['petAt',-100,1e9]])s[k]=numeric(raw[k],s[k],a,b);
 s.rod=Math.floor(s.rod);s.boat=Math.floor(s.boat);s.day=Math.floor(s.day);s.caught=Math.floor(s.caught);
 s.boats=[...new Set([0,s.boat,...(Array.isArray(raw.boats)?raw.boats.filter(i=>Number.isInteger(i)&&BOATS[i]):[])])];s.equipment=Array.isArray(raw.equipment)?[...new Set(raw.equipment.filter(id=>EQUIPMENT.some(e=>e.id===id)))]:[];s.weather=['auto','clear','wind','mist','rain','storm'].includes(raw.weather)?raw.weather:'auto';s.diary={letter:1};for(const c of STORY)if(Number.isFinite(raw.diary?.[c.id]))s.diary[c.id]=Math.floor(numeric(raw.diary[c.id],1,1,1e5));s.storyRead=Array.isArray(raw.storyRead)?raw.storyRead.filter(id=>STORY.some(c=>c.id===id)):[];
 s.licenses=[...new Set(['cove',...(Array.isArray(raw.licenses)?raw.licenses.filter(x=>AREAS.some(a=>a.id===x)):[])])];
 s.lures=[...new Set(['worm',...(Array.isArray(raw.lures)?raw.lures.filter(x=>LURES.some(a=>a.id===x)):[])])];s.lure=s.lures.includes(raw.lure)?raw.lure:'worm';
 if(raw.customWorld){try{s.customWorld=worldExport(validateWorld(raw.customWorld));}catch{/* Keep the campaign playable if an imported map is broken. */}}
 s.area=s.licenses.includes(raw.area)?raw.area:raw.area==='custom'&&s.customWorld?'custom':'cove';const area=s.area==='custom'?s.customWorld.area:AREAS.find(a=>a.id===s.area);
 s.x=legacy?760:numeric(raw.x,area.dockX+280,100,area.width-100);s.facing=raw.facing===-1?-1:1;
 s.inventory=Array.isArray(raw.inventory)?raw.inventory.filter(id=>getCatch(id)&&getCatch(id).kind!=='relic').slice(0,BOATS[s.boat].capacity):[];
 for(const f of CATCHES)if(Number.isFinite(raw.journal?.[f.id])&&raw.journal[f.id]>0)s.journal[f.id]=Math.floor(clamp(raw.journal[f.id],1,1e6));
 s.relics=Array.isArray(raw.relics)?[...new Set(raw.relics.filter(id=>OBJECTS.some(f=>f.id===id&&f.kind==='relic')))]:[];
 s.relicOrder=Array.isArray(raw.relicOrder)?raw.relicOrder.filter(id=>s.relics.includes(id)).slice(0,3):[...s.relics];s.visited=Array.isArray(raw.visited)?[...new Set(['cove',...raw.visited.filter(id=>s.licenses.includes(id))])]:['cove'];
 s.discovery=raw.discovery===true;s.muted=raw.muted!==false;s.reduced=raw.reduced===true;s.light=['auto','dawn','day','dusk','night'].includes(raw.light)?raw.light:'auto';s.ending=['human','deep','prophet'].includes(raw.ending)?raw.ending:null;s.endless=!!s.ending&&raw.endless===true;
 s.targetDepth=clamp(s.targetDepth,4,Math.min(RODS[s.rod].depth,area.maxDepth));return s;
}
export class FishingGame{
 constructor(save=freshSave(),random=Math.random){this.save=validateSave(save);this.random=random;this.phase='ready';this.depth=0;this.elapsed=0;this.castTime=0;this.tension=0;this.progress=0;this.reeling=false;this.resistance=0;this.pending=null;this.move=0;this.velocity=0;this.anchored=false;this.events=[];this.paused=false;this.castDepth=0;this.dockNotice=false;this.nibbleCount=0;this.twitches=0;this.lastTwitch=-100;this.nibblePulse=0;this.syncStory(false);}
 get weather(){return weatherFor(this.save,this.area.tint);}
 get objective(){return objective(this.save);}
 get unreadStory(){return Object.keys(this.save.diary).filter(id=>!this.save.storyRead.includes(id)).length;}
 syncStory(notify=true){let added=false;for(const c of STORY)if(c.when(this.save)&&!this.save.diary[c.id]){this.save.diary[c.id]=this.save.day;added=true;}if(added&&notify)this.emit('story');}
 chooseLure(id){if(!['ready','waiting','sinking'].includes(this.phase)||!this.save.lures.includes(id))return false;this.save.lure=id;if(this.phase==='waiting')this.beginApproach();this.emit('save');return true;}
 beginApproach(){this.phase='waiting';this.elapsed=0;this.waitFor=(3+this.random()*2)*(this.save.lure==='jig'?.8:1);this.pending=this.selectCatch();this.twitches=0;this.nibblePulse=0;}
 twitch(){if(!['waiting','nibbling'].includes(this.phase)||this.paused||this.save.played-this.lastTwitch<.6)return false;this.lastTwitch=this.save.played;this.twitches++;this.nibblePulse=1;this.emit('twitch');if(this.twitches>3)this.scareFish();return true;}
 scareFish(){this.emit('depart');this.emit('toast','Den svømte videre. La agnet få ro.');this.beginApproach();this.waitFor+=2;}
 get area(){return this.save.area==='custom'&&this.save.customWorld?this.save.customWorld.area:AREAS.find(a=>a.id===this.save.area)||AREAS[0];}
 get zone(){return [...this.area.zones].reverse().find(z=>this.save.x>=z.x)||this.area.zones[0];}
 get maxDepth(){return Math.min(RODS[this.save.rod].depth,this.zone.depth,this.area.maxDepth);}
 get location(){return this.atDock?this.area.id==='cove'?'Old Marshs brygge':this.area.zones[0].name:this.zone.name;}
 get atDock(){return Math.abs(this.save.x-this.area.dockX)<=CONFIG.dockRadius;}
 get capacity(){return BOATS[this.save.boat].capacity;}
 get stage(){return stageFor(this.save.endless&&this.save.ending==='deep'?0:this.save.sanity);}
 get gateReady(){return this.save.area==='abyss'&&this.save.x>this.area.width-1700&&this.save.relics.length===3;}
 get priceMultiplier(){return this.save.sanity<40&&!this.save.endless?1.15:1;}
 price(v){return Math.ceil(v*this.priceMultiplier);}
 emit(type,data){this.events.push({type,data});}
 setMove(d){if(this.paused||this.phase!=='ready')return;this.move=clamp(d,-1,1);if(d){this.anchored=false;this.save.facing=d>0?1:-1;}}
 anchor(){if(this.phase!=='ready'||this.paused)return;this.anchored=!this.anchored;this.move=0;if(this.anchored)this.velocity=0;this.emit('anchor');}
 setDepth(v){if(['ready','sinking','waiting'].includes(this.phase)){this.save.targetDepth=clamp(Number(v)||4,4,this.maxDepth);if(this.phase==='waiting'&&Math.abs(this.depth-this.save.targetDepth)>.2){this.phase='sinking';this.elapsed=0;this.pending=null;}}}
 selectCatch(){
  const s=this.save,a=this.area,d=this.depth;if(!s.caught)return FISH[0];
  if(a.relic&&!s.relics.includes(a.relic)&&s.x>=a.relicAt&&d>=a.relicDepth)return getCatch(a.relic);
  if(!s.discovery&&d>=22)return getCatch('eel');
  if(this.random()<(s.lure==='magnet'?.65:.14)){const pool=OBJECTS.filter(f=>f.kind==='junk'&&d>=f.depth[0]&&d<=f.depth[1]);if(pool.length)return pool[Math.floor(this.random()*pool.length)];}
  const pool=FISH.filter(f=>d>=f.depth[0]&&d<=f.depth[1]&&ECOLOGY[f.id].areas.includes(a.tint||'cove'));const near=schoolSpecies(a.tint,Math.floor(s.x/600));const weighted=pool.flatMap(f=>Array.from({length:Math.max(1,Math.round(affinity(f.id,s.lure)*12*(near===f.id?1.8:1)))},()=>f));return weighted[Math.floor(this.random()*weighted.length)]||FISH[0];
 }
 cast(){if(this.phase!=='ready'||this.paused)return false;if(this.save.inventory.length>=this.capacity){this.emit('toast','Kassa er full. Kjør tilbake til brygga og selg fangsten.');return false;}this.move=0;this.velocity=0;this.anchored=true;this.pending=null;this.phase='casting';this.elapsed=0;this.depth=0;this.castTime=0;this.tension=0;this.progress=0;this.emit('cast');return true;}
 action(){if(this.paused)return;if(this.phase==='ready')this.cast();else if(this.phase==='bite'){this.phase='fight';this.elapsed=0;this.progress=0;this.tension=.12;this.reeling=true;this.castDepth=this.depth;this.emit('hook');}else if(this.phase==='nibbling')this.scareFish();else if(this.phase==='fight')this.reeling=!this.reeling;}
 cancel(){if(!['casting','sinking','waiting','nibbling','bite','fight'].includes(this.phase))return;this.phase='retrieving';this.elapsed=0;this.retrieveDepth=this.depth;this.pending=null;this.reeling=false;this.emit('retract');}
 land(){this.phase='caught';this.reeling=false;this.depth=0;this.emit('caught',this.pending);}
 resolveCatch(keep){
  if(this.phase!=='caught'||!this.pending)return false;const f=this.pending,s=this.save,before=this.stage.id;if(keep&&f.kind!=='relic'&&s.inventory.length>=this.capacity)return false;
  s.journal[f.id]=(s.journal[f.id]||0)+1;s.caught++;
  if(keep){if(f.kind==='relic'){if(!s.relics.includes(f.id)){s.relics.push(f.id);s.relicOrder.push(f.id);}}else s.inventory.push(f.id);if(!s.endless)s.sanity=clamp(s.sanity-Math.ceil(f.loss*(s.equipment.includes('lamp')?.8:1)*(s.boat===3?.75:1)),0,100);}
  else if(f.kind!=='junk'&&!s.endless)s.sanity=clamp(s.sanity+2,0,100);
  if(f.loss&&!s.discovery){s.discovery=true;this.emit('discovery',keep);}this.pending=null;this.phase='ready';this.syncStory();this.emit('save');if(before!==this.stage.id)this.emit('stage',this.stage);if(s.sanity===0&&!s.ending)this.emit('ending-choice');return true;
 }
 sell(){if(!this.atDock||!this.paused)return 0;const n=this.save.inventory.reduce((sum,id)=>sum+(getCatch(id)?.value||0),0);this.save.money+=n;this.save.inventory=[];this.syncStory();this.emit('save');return n;}
 purchase(price,apply){if(!this.atDock||!this.paused||this.save.money<this.price(price))return false;this.save.money-=this.price(price);apply();this.emit('save');return true;}
 buyRod(i){if(!Number.isInteger(i)||i!==this.save.rod+1||!RODS[i])return false;return this.purchase(RODS[i].price,()=>this.save.rod=i);}
 buyBoat(i=1){if(!Number.isInteger(i)||!BOATS[i]||this.save.boats.includes(i)||this.save.inventory.length>BOATS[i].capacity)return false;return this.purchase(BOATS[i].price,()=>{this.save.boats.push(i);this.save.boat=i;});}
 equipBoat(i){if(!this.atDock||!this.paused||!this.save.boats.includes(i)||this.save.inventory.length>BOATS[i].capacity)return false;this.save.boat=i;this.emit('save');return true;}
 buyEquipment(id){const e=EQUIPMENT.find(e=>e.id===id);if(!e||this.save.equipment.includes(id))return false;return this.purchase(e.price,()=>this.save.equipment.push(id));}
 buyLure(id){const l=LURES.find(l=>l.id===id);if(!l||this.save.lures.includes(id))return false;return this.purchase(l.price,()=>{this.save.lures.push(id);this.save.lure=id;});}
 buyLicense(id){const a=AREAS.find(a=>a.id===id);if(!a||this.save.licenses.includes(id))return false;return this.purchase(a.price,()=>this.save.licenses.push(id));}
 visit(id){const custom=id==='custom'&&this.save.customWorld;if(!this.atDock||this.phase!=='ready'||!this.paused||(!custom&&!this.save.licenses.includes(id)))return false;const a=custom?this.save.customWorld.area:AREAS.find(a=>a.id===id);if(!a)return false;this.save.area=id;this.save.x=a.dockX;this.save.facing=1;this.velocity=0;this.move=0;this.anchored=true;this.save.targetDepth=Math.min(12,this.maxDepth);if(!this.save.visited.includes(id))this.save.visited.push(id);this.syncStory();this.emit('area');this.emit('save');return true;}
 pet(){if(this.paused||this.phase==='caught')return false;if(this.save.played-this.save.petAt<CONFIG.petCooldown){this.emit('pet',false);return false;}this.save.petAt=this.save.played;if(!this.save.endless)this.save.sanity=clamp(this.save.sanity+4,0,100);this.emit('pet',true);this.emit('save');return true;}
 rest(){if(!this.atDock||!this.paused)return false;if(!this.save.endless)this.save.sanity=clamp(this.save.sanity+35,0,100);this.save.day++;this.save.cycle=.12;this.save.light='auto';this.emit('save');return true;}
 finish(kind){const s=this.save;if(s.ending)return false;if(!['deep','human','prophet'].includes(kind))return false;if(kind==='deep'&&s.sanity>0&&!this.gateReady)return false;if(kind==='human'&&(!this.gateReady||s.sanity<20))return false;if(kind==='prophet'&&(!this.gateReady||s.sanity>=40||s.relicOrder.join(',')!=='compass,journal,idol'))return false;s.ending=kind;s.endless=false;if(kind==='deep')s.sanity=0;this.syncStory();this.emit('save');return true;}
 continueEndless(){if(!this.save.ending)return false;this.save.endless=true;this.phase='ready';this.pending=null;this.depth=0;this.emit('save');return true;}
 tick(dt){
  if(this.paused)return;dt=clamp(dt,0,.05);const s=this.save;s.played+=dt;this.elapsed+=dt;this.castTime+=dt;this.nibblePulse=Math.max(0,this.nibblePulse-dt*2.5);s.cycle+=dt/CONFIG.daySeconds;if(s.cycle>=1){s.cycle-=1;s.day++;}
  if(this.phase==='ready'){const target=this.anchored?0:this.move*CONFIG.moveSpeed*BOATS[s.boat].speed*(1-this.weather.wind*.08);this.velocity+=(target-this.velocity)*(1-Math.exp(-dt*CONFIG.acceleration));if(Math.abs(this.velocity)<.2)this.velocity=0;s.x=clamp(s.x+this.velocity*dt,100,this.area.width-100);if(s.x<=100||s.x>=this.area.width-100)this.velocity=0;if(this.atDock&&!this.dockNotice){this.dockNotice=true;this.emit('toast','Brygga er her. Legg til for å besøke Marsh.');}if(!this.atDock)this.dockNotice=false;}
  s.targetDepth=clamp(s.targetDepth,4,this.maxDepth);
  if(this.phase==='casting'&&this.elapsed>=.85){this.phase='sinking';this.elapsed=0;this.emit('splash');}
  else if(this.phase==='sinking'){const delta=s.targetDepth-this.depth;this.depth+=Math.sign(delta)*Math.min(Math.abs(delta),dt*CONFIG.sinkSpeed);if(Math.abs(delta)<.15){this.depth=s.targetDepth;this.beginApproach();}}
  else if(this.phase==='waiting'&&this.elapsed>=this.waitFor){if(this.pending.kind!=='fish'){this.phase='bite';this.elapsed=0;this.emit('bite');}else{this.phase='nibbling';this.elapsed=0;this.nibbleCount=1+Math.floor(this.random()*3);this.nibblePulse=1;this.emit('nibble');}}
  else if(this.phase==='nibbling'&&this.elapsed>=.72){this.elapsed=0;this.nibbleCount--;if(this.nibbleCount>0){this.nibblePulse=1;this.emit('nibble');}else if(!s.caught||this.random()<Math.min(.95,.16+affinity(this.pending.id,s.lure)*.72+Math.min(this.twitches,2)*.035)){this.phase='bite';this.emit('bite');}else this.scareFish();}
  else if(this.phase==='bite'&&this.elapsed>12){this.cancel();this.emit('toast','Den slapp taket. Prøv igjen.');}
  else if(this.phase==='retrieving'){this.depth=this.retrieveDepth*(1-clamp(this.elapsed/.9,0,1));if(this.elapsed>=.9){this.phase='ready';this.depth=0;}}
  else if(this.phase==='fight'){this.resistance=(Math.sin(this.elapsed*1.8)+1)/2;const easy=this.pending?.kind!=='fish';if(this.reeling){this.tension+=dt*(.065+this.resistance*(easy?.09:.24))/RODS[s.rod].strength*(s.equipment.includes('line')?.75:1);this.progress+=dt*(easy?.27:.20-this.resistance*.11)*(s.equipment.includes('reel')?1.2:1);}else{this.tension-=dt*.39;this.progress-=dt*.014;}this.tension=clamp(this.tension,0,1);this.progress=clamp(this.progress,0,1);this.depth=this.castDepth*(1-this.progress);if(this.tension>=1){this.cancel();this.emit('snap');}else if(this.progress>=1)this.land();else if(this.elapsed>100){this.cancel();this.emit('toast','Fisken fant veien hjem.');}}
 }
}
