export const CONFIG = Object.freeze({ saveKey: 'stillwater-below-v2', capacity: 8, moveSpeed: 0.105, daySeconds: 420, petCooldown: 45 });
export const RODS = [
  { name: 'Den gamle bambusstanga', depth: 18, price: 0, strength: 1, detail: 'Slitt kork. Gode minner. Trygg i grunt vann.' },
  { name: 'Marshs dypvannsstang', depth: 40, price: 90, strength: 1.2, detail: 'Lengre line. Til steder lyset sjelden når.' },
  { name: 'Loddet fra vraket', depth: 70, price: 240, strength: 1.4, detail: 'Noen har risset et navn i metallet. Ditt.' },
];
export const FISH = [
  { id: 'cod', name: 'Harbor Cod', local: 'Havnetorsk', depth: [0, 18], value: 38, loss: 0, weight: 1.6, length: 42, color: '#aaac7a', text: 'En helt vanlig torsk. Det er godt at noen ting fortsatt er det.', note: 'I grunna, mellom brygga og skjærene. Biter på nesten hva som helst.' },
  { id: 'perch', name: 'Midnight Perch', local: 'Skumringsabbor', depth: [8, 22], value: 46, loss: 0, weight: 0.9, length: 28, color: '#cda767', text: 'Stripene blir mørkere etter solnedgang. Ingen på kaia synes det er rart.', note: 'Liker det siste lyset, rett under den varme overflaten.' },
  { id: 'eel', name: 'Whisper Eel', local: 'Hviskeål', depth: [22, 40], value: 84, loss: 14, weight: 2.3, length: 81, color: '#80b6a7', text: 'Du hørte den før du så den. Stemmen var den samme som i barndomshjemmet ditt.', note: 'Nedenfor 22 meter. Den svømmer mot linen når resten av stimen snur.' },
  { id: 'squid', name: 'Glass Squid', local: 'Glassblekksprut', depth: [30, 50], value: 108, loss: 19, weight: 3.1, length: 63, color: '#abdbd7', text: 'Gjennomsiktig. Du kan se hva den har spist. Det var ikke en fisk.', note: 'Dypt under fyret. Lanternen din skinner tvers gjennom den.' },
  { id: 'angler', name: 'Bone Angler', local: 'Beinulke', depth: [44, 65], value: 152, loss: 25, weight: 5.8, length: 77, color: '#d9cbab', text: 'Lyset er vakkert. Du vil se på det litt til. Bare litt til.', note: 'Under 44 meter. Når dens lys tennes, slukker de andre.' },
  { id: 'choir', name: 'The Congregation', local: 'Menigheten', depth: [58, 70], value: 240, loss: 35, weight: 8.6, length: 109, color: '#8ec1b5', text: 'Flere fisk. Én pust. Du slipper blikket fra dem, men de slipper ikke deg.', note: 'Lengst ute. Dypest nede. Old Marsh vil ikke snakke om den.' },
];
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const number = (v, fallback, min, max) => Number.isFinite(v) ? clamp(v, min, max) : fallback;
export function freshSave() { return { version: 2, money: 20, sanity: 100, rod: 0, inventory: [], journal: {}, caught: 0, day: 1, cycle: .70, x: .43, targetDepth: 12, discovery: false, petAt: -100, played: 0, muted: true, reduced: false, light: 'auto' }; }
export function validateSave(raw) {
  if (!raw || raw.version !== 2) return freshSave();
  const s = freshSave();
  for (const [k, min, max] of [['money',0,1e7],['sanity',0,100],['rod',0,2],['caught',0,1e6],['day',1,1e5],['cycle',0,1],['x',.17,.82],['targetDepth',4,70],['played',0,1e9],['petAt',-100,1e9]]) s[k] = number(raw[k],s[k],min,max);
  s.rod = Math.floor(s.rod); s.day = Math.floor(s.day);
  s.inventory = Array.isArray(raw.inventory) ? raw.inventory.filter(x => FISH.some(f => f.id===x)).slice(0,CONFIG.capacity) : [];
  for (const f of FISH) if (Number.isFinite(raw.journal?.[f.id]) && raw.journal[f.id]>0) s.journal[f.id] = Math.floor(clamp(raw.journal[f.id],1,1e6));
  s.discovery = raw.discovery === true;
  s.muted = raw.muted !== false; s.reduced = raw.reduced === true;
  s.light = ['auto','dawn','day','dusk','night'].includes(raw.light) ? raw.light : 'auto';
  s.targetDepth = clamp(s.targetDepth,4,Math.min(RODS[s.rod].depth,s.x < .28 ? 18 : s.x < .62 ? 40 : 70));
  return s;
}
export class FishingGame {
  constructor(save = freshSave(), random = Math.random) {
    this.save = validateSave(save); this.random = random; this.phase='ready'; this.depth=0; this.elapsed=0;
    this.tension=0; this.progress=0; this.reeling=false; this.resistance=0; this.pending=null;
    this.move=0; this.travel=false; this.events=[]; this.paused=false; this.message=''; this.castTime=0;
  }
  get maxDepth() { return Math.min(RODS[this.save.rod].depth,this.save.x<.28?18:this.save.x<.62?40:70); }
  get location() { return this.save.x<.28 ? 'Old Marshs brygge' : this.save.x<.62 ? 'Stillwater Cove' : 'Det sunkne kapellet'; }
  emit(type, data) { this.events.push({type,data}); }
  setDepth(value) { if (this.phase==='ready') this.save.targetDepth=clamp(value,4,this.maxDepth); }
  selectFish() {
    const s=this.save;
    if (!s.caught) return FISH[0];
    if (!s.discovery && s.targetDepth>=22) return FISH[2];
    const pool=FISH.filter(f=>s.targetDepth>=f.depth[0]&&s.targetDepth<=f.depth[1]);
    return pool[Math.floor(this.random()*pool.length)]||FISH[0];
  }
  cast() {
    if (this.phase!=='ready'||this.paused||this.travel) return false;
    if (this.save.inventory.length>=CONFIG.capacity) { this.emit('toast','Fiskekassa er full. Ta fangsten til brygga.'); return false; }
    this.pending=this.selectFish(); this.phase='casting'; this.elapsed=0; this.depth=0;
    this.move=0; this.castTime=0; this.waitFor=3+this.random()*2; this.emit('cast'); return true;
  }
  action() {
    if (this.paused) return;
    if (this.phase==='ready') this.cast();
    else if (this.phase==='bite') { this.phase='fight'; this.elapsed=0; this.progress=0; this.tension=.12; this.reeling=true; this.emit('hook'); }
    else if (this.phase==='fight') this.reeling=!this.reeling;
  }
  cancel() {
    if (!['casting','waiting','bite','fight'].includes(this.phase)) return;
    this.phase='ready'; this.depth=0; this.pending=null; this.reeling=false; this.emit('toast','Linen er inne igjen. Havet kan vente.');
  }
  land() {
    this.phase='caught'; this.reeling=false; this.depth=0; this.emit('caught',this.pending);
  }
  resolveCatch(keep) {
    if(this.phase!=='caught'||!this.pending) return false;
    const f=this.pending;
    if(keep&&this.save.inventory.length>=CONFIG.capacity) return false;
    this.save.journal[f.id]=(this.save.journal[f.id]||0)+1; this.save.caught++;
    if(keep) { this.save.inventory.push(f.id); this.save.sanity=clamp(this.save.sanity-f.loss,0,100); }
    else this.save.sanity=clamp(this.save.sanity+2,0,100);
    if(f.loss&&!this.save.discovery) { this.save.discovery=true; this.emit('discovery',keep); }
    this.pending=null; this.phase='ready'; this.emit('save');
    if(this.save.sanity===0) this.emit('threshold');
    return true;
  }
  sell() {
    if(this.save.x>.28||!this.paused) return 0;
    const amount=this.save.inventory.reduce((sum,id)=>sum+(FISH.find(f=>f.id===id)?.value||0),0);
    this.save.money+=amount; this.save.inventory=[]; this.emit('save'); return amount;
  }
  buyRod(index) {
    const rod=RODS[index];
    if(!this.paused||this.save.x>.28||index!==this.save.rod+1||!rod||this.save.money<rod.price) return false;
    this.save.money-=rod.price; this.save.rod=index; this.emit('save'); return true;
  }
  pet() {
    if(this.paused||this.phase==='caught') return false;
    if(this.save.played-this.save.petAt<CONFIG.petCooldown) {this.emit('pet',false);return false;}
    this.save.petAt=this.save.played;this.save.sanity=clamp(this.save.sanity+4,0,100);this.emit('pet',true);this.emit('save');return true;
  }
  rest() { if(this.save.x>.28||!this.paused)return;this.save.sanity=100;this.save.day++;this.save.cycle=.12;this.save.light='auto';this.emit('save'); }
  toDock() { if(this.phase==='caught')return;this.cancel();this.travel=true;this.move=0; }
  tick(dt) {
    if(this.paused)return;
    dt=clamp(dt,0,.05);this.save.played+=dt;this.elapsed+=dt;this.castTime+=dt;
    this.save.cycle+=dt/CONFIG.daySeconds;if(this.save.cycle>=1){this.save.cycle-=1;this.save.day++;}
    if(this.travel) {this.save.x=Math.max(.20,this.save.x-dt*.18);if(this.save.x<=.20){this.travel=false;this.emit('dock');}}
    else if(this.phase==='ready')this.save.x=clamp(this.save.x+this.move*CONFIG.moveSpeed*dt,.17,.82);
    this.save.targetDepth=clamp(this.save.targetDepth,4,this.maxDepth);
    if(this.phase==='casting'){this.depth=this.save.targetDepth*Math.min(1,this.elapsed/.9);if(this.elapsed>=.9){this.phase='waiting';this.elapsed=0;this.emit('splash');}}
    else if(this.phase==='waiting'&&this.elapsed>=this.waitFor){this.phase='bite';this.elapsed=0;this.emit('bite');}
    else if(this.phase==='bite'&&this.elapsed>12){this.phase='ready';this.depth=0;this.emit('toast','Den slapp taket. Prøv et nytt kast.');}
    else if(this.phase==='fight') {
      this.resistance=(Math.sin(this.elapsed*1.8)+1)/2;
      if(this.reeling){this.tension+=dt*(.06+this.resistance*.24)/RODS[this.save.rod].strength;this.progress+=dt*(.21-this.resistance*.13);}
      else {this.tension-=dt*.37;this.progress-=dt*.022;}
      this.tension=clamp(this.tension,0,1);this.progress=clamp(this.progress,0,1);
      this.depth=this.save.targetDepth*(1-this.progress);
      if(this.tension>=1){this.phase='ready';this.pending=null;this.depth=0;this.reeling=false;this.emit('snap');}
      else if(this.progress>=1)this.land();
      else if(this.elapsed>100){this.cancel();this.emit('toast','Fisken fant veien hjem.');}
    }
  }
}
