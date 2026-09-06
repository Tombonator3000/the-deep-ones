import { FishingGame, CONFIG, FISH, RODS, freshSave, validateSave, clamp } from './game.js';
import { Renderer } from './render.js';
import { Soundscape } from './audio.js';

const $=s=>document.querySelector(s);
const icon=(body)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
const icons={sound:icon('<path d="M11 5 6 9H3v6h3l5 4zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>'),mute:icon('<path d="M11 5 6 9H3v6h3l5 4zM16 9l5 6m0-6-5 6"/>'),settings:icon('<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="#173a39"/><circle cx="15" cy="17" r="3" fill="#173a39"/>'),book:icon('<path d="M12 5C8 2 4 3 2 4v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-2-10 1v15M5 7l4 1M5 11l4 1m7-4 3-1m-3 5 3-1"/>'),dock:icon('<path d="M3 12h18M5 12v9m14-9v9M3 8l9-6 9 6M7 11V6m10 5V6M2 19c3-2 4 2 7 0s5 2 8 0 4 1 5 0"/>'),hook:icon('<path d="M15 3v13a6 6 0 1 1-12 0v-4l4 4M12 3h6"/>')};
$('#audio').innerHTML=icons.mute;$('#settings').innerHTML=icons.settings;$('#journal-icon').innerHTML=icons.book;$('#dock-icon').innerHTML=icons.dock;$('#cast-icon').innerHTML=icons.hook;
let storageWarning='';
function load(){try{const raw=localStorage.getItem(CONFIG.saveKey);return raw?validateSave(JSON.parse(raw)):freshSave();}catch{storageWarning='Den lagrede turen kunne ikke leses. Du kan starte en ny tur.';return freshSave();}}
const game=new FishingGame(load()),renderer=new Renderer(game),audio=new Soundscape();
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)game.save.reduced=true;
const modal=$('#modal'),content=$('#modal-content');let modalType='',toastUntil=0,whisperUntil=0,lastUi=0,oldPhase='',journalFish='cod',previousFocus=null;
function persist(){try{localStorage.setItem(CONFIG.saveKey,JSON.stringify(game.save));}catch{storageWarning='Nettleseren kunne ikke lagre turen. Du kan spille videre, men framgangen kan gå tapt ved lukking.';toast(storageWarning);}}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');toastUntil=performance.now()+5000;}
function whisper(text){$('#whisper').textContent=text;$('#whisper').classList.add('visible');whisperUntil=performance.now()+8000;}
function clearInput(){game.move=0;game.reeling=false;}
function openModal(type,html){previousFocus=document.activeElement;clearInput();game.paused=true;modalType=type;modal.dataset.view=type;content.innerHTML=html;$('#close-modal').hidden=type==='catch';if(!modal.open)modal.showModal();modal.scrollTop=0;content.scrollTop=0;}
function closeModal(){if(modalType==='catch')return;modal.close();modalType='';game.paused=false;clearInput();previousFocus?.focus?.();persist();}
$('#close-modal').addEventListener('click',closeModal);modal.addEventListener('cancel',e=>{e.preventDefault();closeModal();});
modal.addEventListener('click',e=>{if(e.target===modal&&modalType!=='catch'){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
function catchModal(f){
  const first=!game.save.journal[f.id];
  openModal('catch',`<section class="catch-modal ${f.loss?'eldritch':''}"><div class="paper-kicker">${first?'EN NY OPPDAGELSE':'I FISKERENS HENDER'} · ${f.loss?'NOE ER GALT':'FANGST NR. '+(game.save.caught+1)}</div><h2 class="paper-title">${f.name}</h2><div class="book-sub">${f.local}</div><div id="catch-art"></div><div class="fish-stats"><div><strong>${f.length} cm</strong>LENGDE</div><div><strong>${f.weight.toFixed(1)} kg</strong>VEKT</div><div><strong>${f.value} ◈</strong>VERDI</div></div><p class="paper-copy">${f.text}</p>${f.loss?`<div class="field-note">Beholder du den, mister du ${f.loss} sinnsro. Oppdagelsen føres i loggboka uansett.</div>`:''}<div class="paper-actions"><button class="paper-button" id="keep">Legg i fiskekassa</button><button class="paper-button secondary" id="release">Slipp fri</button></div></section>`);
  $('#catch-art').append(renderer.specimen(f.id));
  for(const [id,keep]of [['keep',true],['release',false]])$('#'+id).onclick=()=>{game.resolveCatch(keep);modalType='';modal.close();game.paused=false;toast(keep?`${f.local} ligger i fiskekassa. Ta den med til Old Marsh.`:`${f.local} svømmer videre. Oppdagelsen er i loggboka.`);persist();$('#cast').focus();};
}
function journal(){
  const f=FISH.find(f=>f.id===journalFish),known=!!game.save.journal[f.id],found=Object.keys(game.save.journal).length;
  openModal('journal',`<div class="book"><section class="book-left"><div class="paper-kicker">FISKERENS FELTNOTATER</div><h2 class="paper-title">${known?f.name:'Ukjent farvann'}</h2><div class="book-sub">${known?f.local:'NOEN HEMMELIGHETER MÅ FISKES OPP'}</div><div id="journal-art"></div><p class="paper-copy">${known?f.text:'Den første siden er fortsatt blank. Kast linen i grunna, og se hva du finner.'}</p><div class="field-note">${known?f.note:'«Skriv ned det du ser. Ikke det du tror du så.» — Old Marsh'}</div>${known?`<p class="book-sub">FANGSTER: ${game.save.journal[f.id]} · ${f.length} CM · ${f.weight.toFixed(1)} KG</p>`:''}</section><section><div class="paper-kicker">STILLWATER COVE</div><h2 class="paper-title">Fangstjournal</h2><p class="book-sub">${found} AV ${FISH.length} ARTER OPPDAGET</p><div class="book-grid">${FISH.map(f=>`<button class="specimen-tile ${game.save.journal[f.id]?'':'unknown'} ${journalFish===f.id?'active':''}" data-fish="${f.id}" aria-label="${game.save.journal[f.id]?f.name:'Ukjent art'}"><span class="tile-art"></span><span>${game.save.journal[f.id]?f.local:'???'}</span></button>`).join('')}</div><div class="field-note">${game.save.discovery?'Den første hviskingen<br>«Jeg kjente igjen stemmen. Bris ville ikke se på fangsten.»':'18. oktober<br>Fyret blinker. Marsh har tent i ovnen. Det er fortsatt tid til ett kast til.'}</div><p class="build-note">Både beholdte og frigitte fangster havner i boka.</p></section></div>`);
  if(known)$('#journal-art').append(renderer.specimen(f.id));
  for(const button of content.querySelectorAll('[data-fish]')){const art=renderer.specimen(button.dataset.fish);if(!game.save.journal[button.dataset.fish]){art.setAttribute('aria-label','Ukjent art');art.setAttribute('aria-hidden','true');}button.querySelector('.tile-art').append(art);button.onclick=()=>{journalFish=button.dataset.fish;journal();};}
}
function shop(){
  const s=game.save,value=s.inventory.reduce((a,id)=>a+FISH.find(f=>f.id===id).value,0);
  const dialogue=s.sanity<40?'«Du ligner på noen jeg kjente. Han kom aldri tilbake.»':s.discovery?'«Den ålen ... Ikke ta den med inn. La kassa stå ute.»':'«God kveld. Vanlig fisk betaler regningene. Husk det.»';
  openModal('shop',`<div class="shop-layout"><aside class="shop-portrait"><img src="${import.meta.env.BASE_URL}art/old-marsh.png" alt="Old Marsh i den varme fiskebutikken sin"><div><span>OLD MARSH</span><p>Han kjenner vannet.<br>Og det som kjenner deg.</p></div></aside><section class="shop-detail"><div class="paper-kicker">INNSMOUTH · SIDEN 1891</div><h2 class="paper-title">Marshs agn & utstyr</h2><p class="paper-copy">${dialogue}</p><div class="shop-summary"><div><strong>${s.inventory.length} fisk i kassa</strong><p>${value?`Dagens fangst er verdt ${value} mynt.`:'Det er stille i kassa. Slik bør det være.'}</p></div><button id="sell" class="paper-button" ${value?'':'disabled'}>Selg for ${value} ◈</button></div><div class="paper-kicker">ET LENGRE SNØRE, ET DYPERE MØRKE</div>${RODS.map((r,i)=>`<div class="shop-rod"><div><h3>${r.name}</h3><p>${r.depth} meter · ${r.detail}</p></div>${i<=s.rod?'<span class="tag">'+(i===s.rod?'I BÅTEN':'EID')+'</span>':`<button class="paper-button secondary" data-rod="${i}" ${i===s.rod+1&&s.money>=r.price?'':'disabled'}>${r.price} ◈</button>`}</div>`).join('')}<div class="paper-actions"><button id="rest" class="paper-button secondary">Hvil til morgenen</button><button id="leave" class="paper-button">Tilbake til båten</button></div><p class="build-note">Du har ${s.money} mynt. Hvile gjenoppretter sinnsroen.<br>Lengre line hjelper først når du ror ut på dypere vann.</p></section></div>`);
  $('#sell').onclick=()=>{const earned=game.sell();if(earned){audio.effect('coin');persist();shop();toast(`Old Marsh betalte ${earned} mynt.`);}};
  for(const b of content.querySelectorAll('[data-rod]'))b.onclick=()=>{if(game.buyRod(+b.dataset.rod)){audio.effect('coin');persist();shop();toast('Ny stang i båten. Ro ut, og prøv minst 22 meters dybde.');}};
  $('#rest').onclick=()=>{game.rest();closeModal();toast('Du sov til lyset kom tilbake. Bris lå ved døra.');};$('#leave').onclick=()=>{closeModal();game.save.x=.36;game.setDepth(Math.min(24,RODS[game.save.rod].depth));persist();};
}
async function toggleAudio(){if(audio.enabled){audio.mute();game.save.muted=true;}else{const ok=await audio.start();game.save.muted=!ok;if(!ok)toast('Lyd kunne ikke startes i denne nettleseren.');}updateAudio();persist();}
function updateAudio(){const on=audio.enabled;$('#audio').innerHTML=on?icons.sound:icons.mute;$('#audio').setAttribute('aria-label',on?'Slå av lyd':'Slå på lyd');$('#audio').title=on?'Slå av lyd':'Slå på lyd';}
function settings(){
  openModal('settings',`<div class="paper-kicker">EN STUND PÅ VANNET</div><h2 class="paper-title">Din fisketur</h2><div class="settings-row"><label for="sound-setting">Lyd og musikk</label><input id="sound-setting" type="checkbox" ${audio.enabled?'checked':''}></div><div class="settings-row"><label for="reduced">Roligere bevegelser</label><input id="reduced" type="checkbox" ${game.save.reduced?'checked':''}></div><div class="settings-row"><label for="light">Lys over vannet</label><select id="light"><option value="auto">Følg døgnet</option><option value="dawn">Morgengry</option><option value="day">Dag</option><option value="dusk">Skumring</option><option value="night">Natt</option></select></div><div class="paper-divider"></div><p class="instructions"><strong>Slik fisker du</strong><br>Ro med ← →. Velg dybde med glidebryteren eller ↑ ↓.<br>Kast, og vent til fisken biter. Trykk for å sveive, trykk igjen for å gi slakk. Slakk linen før måleren når høyre kant.<br>På tastatur kan du holde <kbd>Space</kbd> for å sveive og slippe for å gi slakk.<br><kbd>J</kbd> Loggbok · <kbd>B</kbd> Brygga · <kbd>P</kbd> Klapp Bris · <kbd>Esc</kbd> Meny</p><div class="paper-actions"><button id="resume" class="paper-button">Tilbake til vannet</button><button id="new-trip" class="paper-button secondary">Start på nytt</button></div><p class="build-note">Turen lagres automatisk på denne enheten.<br>The Stillwater Below · første kapittel · v0.2</p>`);
  $('#sound-setting').onchange=toggleAudio;$('#reduced').onchange=e=>{game.save.reduced=e.target.checked;persist();};$('#light').value=game.save.light;$('#light').onchange=e=>{game.save.light=e.target.value;persist();};$('#resume').onclick=closeModal;
  $('#new-trip').onclick=()=>{openModal('reset',`<div class="paper-kicker">EN NY BEGYNNELSE</div><h2 class="paper-title">Legge denne turen bak deg?</h2><p class="paper-copy">Fangster, penger og oppdagelser fra denne utgaven slettes på denne enheten.</p><div class="paper-actions"><button id="reset-confirm" class="paper-button">Start ny tur</button><button id="reset-cancel" class="paper-button secondary">Behold turen</button></div>`);$('#reset-cancel').onclick=settings;$('#reset-confirm').onclick=()=>{game.save=freshSave();game.phase='ready';game.pending=null;game.travel=false;game.depth=0;audio.mute();updateAudio();closeModal();persist();};};
}
$('#settings').onclick=settings;$('#audio').onclick=toggleAudio;$('#journal').onclick=journal;
$('#dock').onclick=()=>{if(game.save.x<=.28){game.cancel();shop();}else game.toDock();};
$('#pet').onclick=()=>game.pet();$('#cast').onclick=()=>{game.action();if(!game.save.muted&&!audio.enabled)audio.start().then(updateAudio);};$('#cancel').onclick=()=>game.cancel();
$('#depth').oninput=e=>game.setDepth(+e.target.value);$('#depth').onchange=persist;
for(const [id,direction]of [['left',-1],['right',1]]){
  const b=$('#'+id);b.onpointerdown=e=>{if(game.phase!=='ready'||game.paused)return;game.travel=false;game.move=direction;b.setPointerCapture(e.pointerId);};
  b.onpointerup=b.onpointercancel=()=>{game.move=0;persist();};b.onlostpointercapture=()=>game.move=0;
  b.onclick=e=>{if(e.detail===0&&game.phase==='ready'){game.save.x=clamp(game.save.x+direction*.055,.17,.82);persist();}};
}
document.addEventListener('keydown',e=>{
  if(modal.open)return;if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();
  if(e.code==='ArrowLeft'||e.code==='ArrowRight'){game.travel=false;game.move=e.code==='ArrowLeft'?-1:1;}
  if(e.code==='ArrowUp')game.setDepth(game.save.targetDepth-1);if(e.code==='ArrowDown')game.setDepth(game.save.targetDepth+1);
  if(e.repeat)return;
  if(e.code==='Space'){if(game.phase==='fight')game.reeling=true;else game.action();}
  if(e.code==='KeyJ')journal();if(e.code==='KeyP')game.pet();if(e.code==='KeyB')$('#dock').click();if(e.code==='Escape')settings();
});
document.addEventListener('keyup',e=>{if(e.code==='ArrowLeft'&&game.move===-1||e.code==='ArrowRight'&&game.move===1)game.move=0;if(e.code==='Space')game.reeling=false;});
window.addEventListener('blur',clearInput);document.addEventListener('visibilitychange',()=>{clearInput();last=performance.now();if(document.hidden){persist();metrics.interruptions++;}});window.addEventListener('pagehide',persist);
function ui(now){
  const g=game,s=g.save,phase=g.phase;
  const quiet={dawn:'Morgenen ligger stille. Prøv et kast.',day:'Dagslyset når grunna. Prøv et kast.',dusk:'En stille kveld. Prøv et kast.',night:'Bare ett kast til. Så hjem.'};
  const texts={ready:['Kast linen',quiet[renderer.light()],'Velg dybde, og se hva som biter.'],casting:['Kaster …','Linen finner veien ned.',''],waiting:['Venter på napp','La stillheten vare litt.','Fisken nærmer seg. Vent på napp.'],bite:['Napp! Sveiv inn','Der! Noe tok agnet.','Trykk for å sette kroken.'],fight:[g.reeling?'Gi slakk':'Sveiv inn','',''],caught:['Fangst om bord','','']};
  const text=texts[phase];$('#cast-label').textContent=g.travel?'På vei til brygga …':text[0];$('#cast').disabled=['casting','waiting','caught'].includes(phase)||g.travel;$('#cast').classList.toggle('reeling',phase==='fight'&&g.reeling);
  $('#hint').textContent=g.travel?'Hjem før mørket.':text[1];$('#subhint').textContent=g.travel?'Old Marsh har fyr i ovnen.':text[2];$('#fish-tip').hidden=phase==='fight'||modal.open;
  $('#fight').hidden=phase!=='fight'||modal.open;$('#fight').classList.toggle('danger',g.tension>.78);$('#fight-label').textContent=g.tension>.78?'GI SLAKK NÅ':g.resistance>.66?'FISKEN TREKKER':'DEN GIR ETTER';$('#tension').style.width=(g.tension*100)+'%';$('#catch-progress').style.width=(g.progress*100)+'%';$('#distance').textContent=g.depth.toFixed(1)+' m igjen';$('#catch-progress-label').textContent=Math.round(g.progress*100)+' % inne';
  $('#cancel').hidden=!['casting','waiting','bite','fight'].includes(phase);$('#left').disabled=$('#right').disabled=phase!=='ready';$('#depth').disabled=phase!=='ready';$('#depth').max=g.maxDepth;$('#depth').value=s.targetDepth;
  $('#depth-value').textContent=Math.round(s.targetDepth)+' m';$('#depth-limit').textContent=g.maxDepth+' m maks';$('#money').textContent=s.money;$('#sanity-bar').style.width=s.sanity+'%';$('#sanity-number').textContent=Math.round(s.sanity);$('#sanity-label').textContent=s.sanity<40?'HOLDE FAST':'SINNSRO';$('#location').textContent=g.location;
  const lights={dawn:'MORGENGRY',day:'DAGSLYS',dusk:'SKUMRING',night:'NATT'};$('#clock').textContent=`DAG ${s.day} · ${lights[renderer.light()]}`;
  $('#journal-count').textContent=Object.keys(s.journal).length+' / '+FISH.length;$('#bag-count').textContent=s.inventory.length+' / '+CONFIG.capacity+' fisk';$('#dock').querySelector('span:nth-child(2)').textContent=s.x<=.28?'Old Marsh':'Til brygga';
  if(now>toastUntil)$('#toast').classList.remove('visible');if(now>whisperUntil)$('#whisper').classList.remove('visible');
  if(oldPhase!==phase){if(phase==='bite')$('#cast').focus({preventScroll:true});oldPhase=phase;}
}
function events(){
  for(const e of game.events.splice(0)){
    if(e.type==='save')persist();if(e.type==='toast')toast(e.data);
    if(['cast','splash','caught','pet','discovery'].includes(e.type))renderer.addEffect(e.type);
    audio.effect(e.type);
    if(e.type==='caught')catchModal(e.data);
    if(e.type==='snap')toast('Linen røk. Gi litt mer slakk når fisken trekker.');
    if(e.type==='pet')toast(e.data?'Bris legger hodet i hånda di. +4 sinnsro.':'Bris blir liggende tett inntil deg.');
    if(e.type==='discovery')whisper('Under båten sier noe navnet ditt.');
    if(e.type==='dock')shop();
    if(e.type==='threshold'){whisper('Du hører vannet puste. Det er på tide å dra hjem.');game.toDock();}
  }
}
// Visible, opt-in measurement UI. No testing hooks modify the simulation.
const params=new URLSearchParams(location.search),qa=params.has('qa');
const metrics={frames:[],costs:[],start:0,duration:0,active:false,interruptions:0,result:null,live:[],renderLive:[],layouts:new Set()};
let metricsPanel;
if(qa){
  metricsPanel=document.createElement('aside');metricsPanel.className='quality-panel';metricsPanel.innerHTML='<strong>RUNTIME · GAUNTLET</strong><button id="measure">Mål 120 sekunder</button><button id="portrait">Vis 390 px portrett</button><button id="blank-test">Kontroll: slå av animert lag</button><button id="qa-hide">Skjul målepanel</button><pre id="live-metrics"></pre><pre id="metrics">Klar. 5 s oppvarming + 120 s måling.</pre>';
  $('#game').append(metricsPanel);
  $('#measure').onclick=()=>{metrics.frames=[];metrics.costs=[];metrics.start=performance.now();metrics.active=true;metrics.interruptions=0;metrics.result=null;metrics.layouts.clear();};
  $('#portrait').onclick=()=>{document.documentElement.classList.toggle('view-portrait');$('#portrait').textContent=document.documentElement.classList.contains('view-portrait')?'Vis full bredde':'Vis 390 px portrett';};
  $('#qa-hide').onclick=()=>{metricsPanel.hidden=true;};
  $('#blank-test').onclick=()=>{renderer.diagnosticBlank=!renderer.diagnosticBlank;metrics.live=[];metrics.renderLive=[];metrics.active=false;$('#blank-test').textContent=renderer.diagnosticBlank?'Kontroll: slå på animert lag':'Kontroll: slå av animert lag';};
  document.addEventListener('keydown',e=>{if(e.code==='F8')metricsPanel.hidden=!metricsPanel.hidden;});
}
function record(now,delta,cost){
  if(qa){metrics.live.push(delta);metrics.renderLive.push(cost);if(metrics.live.length>60){metrics.live.shift();metrics.renderLive.shift();}const sum=metrics.live.reduce((a,b)=>a+b,0);$('#live-metrics').textContent=`${renderer.diagnosticBlank?'KONTROLL UTEN ANIMERT LAG':'HELE SPILLSCENEN'}\nLevert: ${(1000*metrics.live.length/sum).toFixed(1)} fps\nTegning: ${(metrics.renderLive.reduce((a,b)=>a+b,0)/metrics.renderLive.length).toFixed(2)} ms\nSynlighet: ${document.visibilityState}\n${navigator.userAgent}`;}
  if(!metrics.active)return;const age=(now-metrics.start)/1000;
  if(age>5&&age<=125&&!document.hidden){metrics.frames.push(delta);metrics.costs.push(cost);metrics.layouts.add(`${renderer.W}×${renderer.H}`);}
  if(age>=125){
    metrics.active=false;const a=[...metrics.frames].sort((a,b)=>a-b),avg=a.reduce((x,y)=>x+y,0)/Math.max(1,a.length),p=q=>a[Math.min(a.length-1,Math.floor(a.length*q))]||0;
    metrics.result={durationSeconds:120,frames:a.length,averageFps:+(1000/avg).toFixed(2),p95Ms:+p(.95).toFixed(2),p99Ms:+p(.99).toFixed(2),stallsOver50ms:a.filter(x=>x>50).length,meanRenderMs:+(metrics.costs.reduce((a,b)=>a+b,0)/Math.max(1,a.length)).toFixed(2),interruptions:metrics.interruptions,canvas:`${renderer.W}×${renderer.H}`,observedCanvases:[...metrics.layouts],devicePixelRatio:devicePixelRatio,renderer:'Canvas2D / cloud Chrome',gate:metrics.interruptions||!a.length||metrics.layouts.size!==1?'INVALID':p(.95)<=17.5&&p(.99)<=20?'PASS':'FAIL'};
    if(qa)$('#metrics').textContent=JSON.stringify(metrics.result,null,2);
    return;
  }
  if(qa&&Math.floor(now/500)!==Math.floor((now-delta)/500))$('#metrics').textContent=metrics.result?JSON.stringify(metrics.result,null,2):`${age<5?'Oppvarming':'Måler'} ${Math.floor(Math.max(0,age-5))} / 120 s\n${metrics.frames.length} frames\nCanvas ${renderer.W} × ${renderer.H}\nAvbrudd: ${metrics.interruptions}`;
}
let last=performance.now();
function frame(now){
  const delta=now-last;last=now;const dt=document.hidden?0:Math.min(delta/1000,1);
  // Fixed bounded substeps decouple real fishing time from sparse rendering.
  // A returning hidden tab resets last, so absence never drains the player.
  let remaining=dt;while(remaining>0){const step=Math.min(remaining,.025);game.tick(step);events();remaining-=step;}
  const start=performance.now();renderer.draw(dt);const cost=performance.now()-start;audio.tick(game.save.played,renderer.light()==='night');
  if(now-lastUi>100){ui(now);lastUi=now;}record(now,delta,cost);requestAnimationFrame(frame);
}
renderer.load().then(failures=>{const loading=$('#loading');loading.style.opacity='0';setTimeout(()=>loading.remove(),850);if(failures.length)toast('Noe av grafikken kunne ikke lastes. Spillet bruker enklere reservegrafikk.');else if(storageWarning)toast(storageWarning);ui(performance.now());requestAnimationFrame(frame);});
setInterval(()=>{if(!document.hidden)persist();},15000);
