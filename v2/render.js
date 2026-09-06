import {FISH,CATCHES,getCatch,clamp} from './game.js';
import {SPRITES,canvas,image,makeSprite,makeRuins,trimAlpha} from './art.js';
export {SPRITES};
const mix=(a,b,t)=>a+(b-a)*t;
export class Renderer{
 constructor(game){this.game=game;this.back=document.querySelector('#landscape');this.front=document.querySelector('#scene');this.bg=this.back.getContext('2d',{alpha:false});this.ctx=this.front.getContext('2d');this.sprites={};this.assets={};this.failures=[];this.time=0;this.camera=0;this.reveal=0;this.effects=[];this.petTime=-100;this.uneaseUntil=0;this.lastBackground='';this.lastArea='';this.fishes=Array.from({length:90},(_,i)=>({x:i*113.77+200,depth:5+(i*13.1)%135,id:FISH[i%6].id,speed:(i%2?1:-1)*(7+i%5*2),phase:i*2.3}));this.resize();new ResizeObserver(()=>this.resize()).observe(document.querySelector('#game'));}
 async load(){
  const names=['environment-dusk','environment-night','environment-day','sprites','sprites-alert','shoreline','dock','actors','objects','deep-one'];const loaded=await Promise.all(names.map(n=>image(`${import.meta.env.BASE_URL}art/${n}.png`)));
  names.forEach((n,i)=>{this.assets[n]=loaded[i];if(!loaded[i])this.failures.push(n);});
  if(this.assets.sprites)for(const[id,rect]of Object.entries(SPRITES))this.sprites[id]=makeSprite(this.assets.sprites,rect);
  if(this.assets['sprites-alert'])this.sprites.boatAlert=makeSprite(this.assets['sprites-alert'],SPRITES.boat);
  const shore=this.assets.shoreline;if(shore){const rects={village:[10,210,600,385],forest:[615,250,490,345],island:[1110,215,560,380],reeds:[1690,290,460,305]};for(const[id,r]of Object.entries(rects))this.sprites[id]=trimAlpha(makeSprite(shore,r));}
  // Production cutout coordinates are documented in ART-PROMPTS.md.
  this.loadActors();this.loadObjects();this.sprites.ruins=makeRuins();if(this.assets['deep-one'])this.sprites.creature=trimAlpha(makeSprite(this.assets['deep-one'],[0,0,this.assets['deep-one'].width,this.assets['deep-one'].height],'checker'));
  this.nightSprites={};for(const[id,sp]of Object.entries(this.sprites)){const n=canvas(sp.width,sp.height),nc=n.getContext('2d');nc.filter=id==='creature'?'brightness(.83) saturate(.88)':'brightness(.66) saturate(.76)';nc.drawImage(sp,0,0);nc.filter='none';nc.globalCompositeOperation='source-atop';nc.globalAlpha=.14;nc.fillStyle='#244b6b';nc.fillRect(0,0,n.width,n.height);this.nightSprites[id]=window.createImageBitmap?await createImageBitmap(n):n;}
  if(this.assets.dock){const n=canvas(this.assets.dock.width,this.assets.dock.height),nc=n.getContext('2d');nc.filter='brightness(.64) saturate(.78)';nc.drawImage(this.assets.dock,0,0);this.assets.dockNight=window.createImageBitmap?await createImageBitmap(n):n;}
  if(window.createImageBitmap)for(const id of Object.keys(this.sprites))this.sprites[id]=await createImageBitmap(this.sprites[id]);
  this.paintBackground(true);return this.failures;
 }
 loadActors(){const a=this.assets.actors;if(!a)return;for(const[id,r]of Object.entries({hull:[5,282,699,250],human:[704,95,415,459],deep:[1138,96,392,460],arm:[57,680,424,183],dog:[546,598,326,348],oar:[861,711,655,137]}))this.sprites[id]=makeSprite(a,r,'checker');}
 loadObjects(){const a=this.assets.objects;if(!a)return;for(const[id,r]of Object.entries({boot:[0,0,512,500],tin:[512,0,512,500],net:[1024,0,512,500],compass:[0,500,512,524],idol:[512,500,512,524],journal:[1024,500,512,524]}))this.sprites[id]=makeSprite(a,r,'checker');}
 resize(){const r=document.querySelector('#game').getBoundingClientRect();this.mobile=r.width<600;this.W=Math.min(1800,Math.round(r.width));this.H=Math.round(r.height*this.W/r.width);this.unit=this.W/(this.mobile?660:1420);for(const c of[this.back,this.front]){c.width=this.W;c.height=this.H;}this.water=this.H*.68;this.lastBackground='';this.ctx.imageSmoothingEnabled=true;}
 sprite(id){return this.light()==='night'?(this.nightSprites?.[id]||this.sprites[id]):this.sprites[id];}
 light(){const s=this.game.save;if(s.light!=='auto')return s.light;return s.cycle<.2?'dawn':s.cycle<.54?'day':s.cycle<.78?'dusk':'night';}
 worldX(x,p=1){return(x-this.camera*p)*this.unit;}
 boatPose(){const bw=270*this.unit;return{x:this.worldX(this.game.save.x),y:this.water+4*this.unit+Math.sin(this.time*1.4)*1.8,bw,bh:bw*472/1352};}
 environment(){return this.assets['environment-'+(this.light()==='night'?'night':this.light()==='day'?'day':'dusk')];}
 paintBackground(force=false){
  const key=[this.light(),this.game.area.id,this.W,this.H,Math.round(this.camera*.13),Math.round(this.water)].join('/');if(!force&&key===this.lastBackground)return;this.lastBackground=key;
  const c=this.bg,W=this.W,H=this.H,wl=this.water,im=this.environment(),horizon=wl*.68;
  const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,this.light()==='night'?'#0b1735':'#71576b');sky.addColorStop(.46,this.light()==='night'?'#304161':'#dd9c77');sky.addColorStop(1,'#123e49');c.fillStyle=sky;c.fillRect(0,0,W,H);
  if(im){
   const tileW=W*1.72,offset=-(this.camera*.075*this.unit)%tileW;
   for(let i=-1;i<2;i++){c.save();c.translate(offset+i*tileW,0);if(i%2){c.translate(tileW,0);c.scale(-1,1);}c.drawImage(im,320,0,1010,333,0,0,tileW,horizon);c.restore();}
   // Keep source ripples at their natural aspect instead of stretching a
   // tiny strip across the full lake height.
   const rowH=Math.max(16,W/850*18);
   for(let y=horizon,j=0;y<H;y+=rowH,j++)c.drawImage(im,410+(j%3)*7,405+(j%4)*18,820,18,0,y,W,rowH+.5);
  }
  const water=c.createLinearGradient(0,horizon,0,H);water.addColorStop(0,'#12364100');water.addColorStop(.5,'#0b3c4633');water.addColorStop(1,'#082e3c99');c.fillStyle=water;c.fillRect(0,horizon,W,H-horizon);
  if(this.game.area.tint!=='cove'){c.fillStyle=this.game.area.tint==='abyss'?'#20263d':'#31545b';c.globalAlpha=this.game.area.tint==='abyss'?.35:.20;c.fillRect(0,0,W,H);c.globalAlpha=1;}
  if(this.light()==='dawn'){c.fillStyle='#e5b7b0';c.globalAlpha=.12;c.fillRect(0,0,W,H);c.globalAlpha=1;}
 }
 fish(c,id,x,y,w,flip=false,phase=0,alpha=1){const sp=this.sprites[id],h=sp?w*sp.height/sp.width:w*.42;c.save();c.translate(x,y);if(flip)c.scale(-1,1);c.globalAlpha=alpha;if(sp){if(getCatch(id)?.kind!=='fish'){c.rotate(Math.sin(phase*.35)*.04);c.drawImage(sp,-w/2,-h/2,w,h);}else for(let i=0;i<5;i++){const sw=sp.width/5,dy=Math.sin(phase-i*.45)*(4-i)*w*.007;c.drawImage(sp,i*sw,0,sw,sp.height,-w/2+i*w/5,-h/2+dy,w/5+.4,h);}}else{c.fillStyle=getCatch(id)?.color||'#afa57d';c.beginPath();c.ellipse(0,0,w*.36,h*.35,0,0,Math.PI*2);c.fill();}c.restore();}
 specimen(id){const c=canvas(560,290);this.fish(c.getContext('2d'),id,280,145, getCatch(id)?.kind==='fish'?360:220,false,0);c.setAttribute('role','img');c.setAttribute('aria-label',getCatch(id)?.local||id);return c;}
 addEffect(type){if(type==='pet')this.petTime=this.time;if(type==='discovery')this.uneaseUntil=this.time+8;if(['splash','cast','caught','anchor'].includes(type))this.effects.push({type,time:this.time,x:this.game.save.x+this.game.save.facing*190});if(type==='area'){this.camera=Math.max(0,this.game.save.x-420);this.lastArea='';}}
 landscape(c){
  const g=this.game,u=this.unit,wl=this.water,t=this.time;
  for(const o of g.area.objects.filter(o=>o.type!=='ruins'&&o.type!=='reeds').sort((a,b)=>a.parallax-b.parallax)){
   const sp=this.sprite(o.type);if(!sp)continue;const x=this.worldX(o.x,o.parallax),w=(o.type==='forest'?230:480)*o.scale*u,h=w*sp.height/sp.width,y=wl*(.71+(o.parallax-.4)*.48)+o.y*u;
   if(x+w<this.W*-.2||x-w>this.W*1.2)continue;
   c.save();c.globalAlpha=.65+o.parallax*.35;c.drawImage(sp,x-w/2,y-h,w,h);
   c.translate(x,y);c.scale(1,-.24);c.globalAlpha=.24;c.drawImage(sp,-w/2,-h,w,h);c.restore();
   c.save();c.strokeStyle=this.light()==='night'?'#a2bec4':'#c7d8c9';
   for(let j=0;j<34;j++){const px=x-w*.49+j*w/34,py=y-3*u+Math.sin(j*2.7+t)*3*u,len=w*(.013+(j%4)*.006);c.globalAlpha=.85;c.drawImage(this.back,px,py,len,2.5*u,px,py,len,2.5*u);c.globalAlpha=.22+Math.sin(j+t)*.09;c.lineWidth=1;c.beginPath();c.moveTo(px,py);c.lineTo(px+len*.8,py);c.stroke();}c.restore();
  }
  const fogCount=g.save.reduced?2:5;
  for(let i=0;i<fogCount;i++){const x=(((i*560+t*(6+i)+this.camera*-.23)*u)%(this.W+600*u))+100*u,y=wl*(.60+i*.035);c.save();c.translate(x,y);c.scale((300+i*35)*u,9*u);const fog=c.createRadialGradient(0,0,0,0,0,1);fog.addColorStop(0,g.stage.id==='human'?'#c9dfd529':'#b8a3bf29');fog.addColorStop(1,'#c9dfd500');c.globalAlpha=.4+g.area.fog;c.fillStyle=fog;c.fillRect(-1,-1,2,2);c.restore();}
 }
 underwater(c){
  if(this.reveal<.005)return;const g=this.game,s=g.save,W=this.W,H=this.H,wl=this.water,t=this.time,u=this.unit,im=this.environment();
  c.save();c.globalAlpha=this.reveal;c.beginPath();c.rect(0,wl,W,H-wl);c.clip();c.fillStyle='#103b45';c.fillRect(0,wl,W,H-wl);
  if(im){const tw=W*1.6,off=-(this.camera*.42*u)%tw;for(let i=-1;i<2;i++){c.save();c.translate(off+i*tw,wl);if(i%2){c.translate(tw,0);c.scale(-1,1);}c.drawImage(im,0,498,1672,443,0,0,tw,Math.max(380*u,H-wl));c.restore();}}
  const dark=c.createLinearGradient(0,wl,0,H);dark.addColorStop(0,'#13657733');dark.addColorStop(.6,'#071e3677');dark.addColorStop(1,'#020f23ed');c.fillStyle=dark;c.fillRect(0,wl,W,H-wl);
  if(s.sanity<40){c.fillStyle='#40254a';c.globalAlpha=.15*this.reveal;c.fillRect(0,wl,W,H-wl);c.globalAlpha=this.reveal;}
  if(!s.reduced){const ray=c.createLinearGradient(0,wl,0,H);ray.addColorStop(0,'#b1e5d315');ray.addColorStop(1,'#b1e5d300');c.fillStyle=ray;for(let i=0;i<5;i++){const x=(i*.27-.2)*W+Math.sin(t*.13+i)*25;c.beginPath();c.moveTo(x,wl);c.lineTo(x+W*.06,wl);c.lineTo(x-W*.05,H);c.lineTo(x-W*.14,H);c.fill();}}
  const visible=Math.max(30,g.depth*1.25+8);this.depthScale=Math.max(.6,(H-(this.mobile?218:174)-wl)/visible);
  for(const o of g.area.objects.filter(o=>o.type==='ruins')){const sp=this.sprites.ruins,x=this.worldX(o.x,o.parallax),w=380*o.scale*u,h=w*sp.height/sp.width,y=wl+18+Math.max(8,o.y)*this.depthScale+h*.3;if(x+w>0&&x-w<W&&Math.max(8,o.y)<visible+20){c.save();c.globalAlpha=.42*this.reveal;c.drawImage(sp,x-w/2,y-h,w,h);c.restore();}}
  for(const f of this.fishes){const def=getCatch(f.id);if(f.depth>visible||f.depth<def.depth[0]||f.depth>Math.min(def.depth[1],g.zone.depth))continue;const x=this.worldX((f.x+t*f.speed+12000)%12000);if(x< -60||x>W+60)continue;this.fish(c,f.id,x,wl+18+f.depth*this.depthScale,46*u,f.speed<0,t*3+f.phase,(s.discovery||!def.loss?.65:.16)*this.reveal);}
  if(s.sanity<70||t<this.uneaseUntil){this.fish(c,'choir',W*.72+Math.sin(t*.1)*W*.12,H*.77,420*u,true,t*.4,Math.max(.06,(70-s.sanity)/170)*this.reveal);}
  c.fillStyle='#bdddd6';for(let i=0;i<45;i++){const x=((i*83-t*4-this.camera*.5*u)%W+W)%W,y=wl+((i*61.7-t*(3+i%2))%(H-wl)+(H-wl))%(H-wl);c.globalAlpha=(.13+Math.sin(i+t)*.06)*this.reveal;c.fillRect(x,y,1.3,1.3);}c.restore();
 }
 dock(c){const im=this.light()==='night'?(this.assets.dockNight||this.assets.dock):this.assets.dock;if(!im)return;const w=820*this.unit,h=w*im.height/im.width,x=this.worldX(this.game.area.dockX)-w*.92,wl=this.water,y=wl-h*.77;if(x+w<0||x>this.W)return;c.save();c.beginPath();c.rect(0,0,this.W,wl+12);c.clip();c.drawImage(im,x,y,w,h);c.restore();if(this.reveal>.01){c.save();c.beginPath();c.rect(0,wl+12,this.W,this.H-wl);c.clip();c.globalAlpha=.42*this.reveal;c.drawImage(im,x,y,w,h);c.restore();}c.save();c.fillStyle='#e5c788';c.font=`${Math.max(12,14*this.unit)}px Georgia`;c.textAlign='center';c.fillText(this.game.area.id==='cove'?'MARSH · AGN & UTSTYR':'MARSH · UTPOST',x+w*.31,y+h*.62);c.restore();}
 actor(c,p){
  const g=this.game,t=this.time,d=g.save.facing,sp=this.sprite('boat'),rock=Math.sin(t*.9)*.009+Math.sin(t*3.2)*Math.min(.014,Math.abs(g.velocity)*.00008);
  c.save();c.translate(p.x,p.y);c.scale(d,1);c.rotate(rock);
  const alert=['bite','fight'].includes(g.phase),boat=alert&&this.sprites.boatAlert?this.sprite('boatAlert'):sp;
  if(this.sprites.hull)this.drawRig(c,p);else if(boat)c.drawImage(boat,-p.bw/2,-p.bh*.955,p.bw,p.bh);
  const creature=g.save.sanity<20||g.stage.id==='deep',cast=g.phase==='casting'?Math.sin(clamp(g.elapsed/.85,0,1)*Math.PI):0,rx=p.bw*((creature?.24:.22)-cast*.06),ry=-p.bw*((creature?.333:.278)+cast*.15),work=g.phase==='fight'&&g.reeling?Math.sin(t*11)*.012:0;
  const tipX=rx+p.bw*(.48-cast*.48),tipY=ry-p.bw*(.25+cast*.24)+g.tension*p.bw*.16;
  c.strokeStyle='#392c1a';c.lineWidth=Math.max(2,3*this.unit);c.beginPath();c.moveTo(rx,ry);c.quadraticCurveTo(rx+p.bw*.24,ry-p.bw*(.35+cast*.4)+work*p.bw,tipX,tipY);c.stroke();c.strokeStyle='#d5b777';c.lineWidth=Math.max(.7,this.unit);c.stroke();
  const lamp=c.createRadialGradient(p.bw*.35,-p.bw*.225,0,p.bw*.35,-p.bw*.225,p.bw*.24);lamp.addColorStop(0,'#fbd07755');lamp.addColorStop(.2,'#f9b8331a');lamp.addColorStop(1,'#f9b83300');c.fillStyle=lamp;c.fillRect(p.bw*.1,-p.bh,p.bw*.5,p.bh*1.5);
  c.restore();this.rodTip={x:p.x+d*tipX,y:p.y+tipY};
  const reflected=this.sprite('hull')||boat;
  if(reflected){c.save();c.beginPath();c.rect(0,p.y,this.W,this.H-p.y);c.clip();c.translate(p.x,p.y+.5);c.scale(d,-.24);c.globalAlpha=.22*(1-this.reveal*.85);if(this.sprites.hull)c.drawImage(reflected,-p.bw/2,-p.bw*.278,p.bw,p.bw*250/699*.80);else c.drawImage(reflected,-p.bw/2,-p.bh*.955,p.bw,p.bh);c.restore();}
  c.save();c.strokeStyle='#d8e1cc';c.lineWidth=1.2;for(let i=0;i<13;i++){const a=i/12,x=p.x-p.bw*.46+a*p.bw*.92,y=this.water-1-Math.pow((a-.5)*2,2)*8*this.unit+Math.sin(i*2.7+t*2)*1.7,len=p.bw*(.015+i%3*.006);c.globalAlpha=.35;c.drawImage(this.back,x,y,len,2*this.unit,x,y,len,2*this.unit);c.globalAlpha=.18+Math.sin(t*2+i)*.05;c.beginPath();c.moveTo(x,y);c.lineTo(x+len,y);c.stroke();}c.restore();
  if(t-this.petTime<2.3){c.save();c.fillStyle='#f7dba5';c.font='22px Georgia';c.globalAlpha=1-(t-this.petTime)/2.3;c.fillText('♡',p.x-d*p.bw*.25,p.y-p.bh-(t-this.petTime)*12);c.restore();}
 }
 drawRig(c,p){
  const t=this.time,g=this.game,b=p.bw,rig=this.light()==='night'?this.nightSprites:this.sprites,monster=(g.save.sanity<20||g.stage.id==='deep')&&rig.creature,working=g.phase==='fight'&&g.reeling,casting=g.phase==='casting',rowing=Math.abs(g.velocity)>15;
  const lean=casting?-Math.sin(g.elapsed/.85*Math.PI)*.15:working?Math.sin(t*5)*.025:rowing?Math.sin(t*3.6)*.035:Math.sin(t)*.005;
  c.save();c.translate(-b*.01,-b*.14);c.rotate(lean);const w=b*.34,h=w*459/415;
  // Upper body, independent forearm and dog are articulated around seat/elbow pivots.
  if(monster){const mh=b*(g.stage.id==='deep'?.52:.49),mw=mh*monster.width/monster.height;c.drawImage(monster,-b*.21,-mh,mw,mh);}else{
  const body=rig.human,deep=rig.deep,amount=g.stage.id==='human'?0:g.stage.id==='touched'?.18:g.stage.id==='changing'?.52:g.stage.id==='becoming'?.88:1;
  c.save();c.beginPath();c.moveTo(-w*.38,-h);c.lineTo(w,-h);c.lineTo(w,-h*.46);c.lineTo(w*.32,-h*.46);c.lineTo(w*.32,-h*.12);c.lineTo(w,-h*.12);c.lineTo(w,0);c.lineTo(-w*.38,0);c.closePath();c.clip();c.drawImage(body,-w*.38,-h,w,h);if(deep&&amount){c.globalAlpha=amount;c.drawImage(deep,-w*.38,-h,w,h);}c.restore();
  c.save();c.translate(w*.16,-h*.36);c.rotate(casting?-Math.sin(g.elapsed/.85*Math.PI)*.9:working?Math.sin(t*9)*.08:rowing?Math.sin(t*3.6)*.22:0);c.drawImage(rig.arm,0,-b*.046,b*.21,b*.091);c.restore();}c.restore();
  c.save();c.translate(-b*.28,-b*.14);c.rotate(Math.sin(t*1.9)*.018+(t-this.petTime<2.3?Math.sin(t*11)*.028:0));const dw=b*.20;c.drawImage(rig.dog,-dw/2,-dw*348/326,dw,dw*348/326);c.restore();
  if(rowing){c.save();c.translate(b*.05,-b*.16);c.rotate(.45+Math.sin(t*3.6)*.38);c.drawImage(rig.oar,-b*.05,-b*.018,b*.57,b*.119);c.restore();}
  c.drawImage(rig.hull,-b/2,-b*.278,b,b*250/699*.80);
 }
 line(c,p){const g=this.game;if(!['casting','sinking','waiting','bite','fight','retrieving'].includes(g.phase))return;const t=this.time,dir=g.save.facing,tip=this.rodTip;let x=p.x+dir*p.bw*.94+Math.sin(t*1.4)*5,y=this.water+18+g.depth*(this.depthScale||3);
  if(g.phase==='casting'){const k=clamp(g.elapsed/.85,0,1);x=mix(tip.x,x,k);y=mix(tip.y,this.water,k)-Math.sin(k*Math.PI)*p.bw*.30;}else if(g.phase==='retrieving'){const k=clamp(g.elapsed/.9,0,1);x=mix(x,tip.x,k);y=mix(y,tip.y,k);}
  c.save();c.strokeStyle=g.tension>.8?'#f3ae79':'#eedcbc';c.lineWidth=Math.max(.9,1.35*this.unit);c.globalAlpha=.9;c.beginPath();c.moveTo(tip.x,tip.y);
  let entryX=x,previous=tip;for(let i=1;i<=26;i++){const k=i/26,slack=Math.sin(k*Math.PI)*(1-g.tension)*8;const px=mix(tip.x,x,k)+Math.sin(k*8-t*3)*slack,py=mix(tip.y,y,k)+Math.sin(k*Math.PI)*10*(1-g.tension);if(previous.y<=this.water&&py>=this.water)entryX=mix(previous.x,px,(this.water-previous.y)/(py-previous.y));previous={x:px,y:py};c.lineTo(px,py);}c.stroke();if(['bite','fight'].includes(g.phase)){const glow=c.createRadialGradient(x,y,0,x,y,65*this.unit);glow.addColorStop(0,'#cfe9b42b');glow.addColorStop(1,'#cfe9b400');c.fillStyle=glow;c.fillRect(x-65*this.unit,y-65*this.unit,130*this.unit,130*this.unit);for(let i=0;i<6;i++){c.fillStyle='#e5d8a478';c.fillRect(x+Math.sin(i*3.1+t)*30*this.unit,y+Math.cos(i*4.3+t)*15*this.unit,2,2);}}c.fillStyle=g.save.lure==='jig'?'#99f9d1':'#f4ce7f';c.beginPath();c.arc(x,y,2.5,0,Math.PI*2);c.fill();
  if(g.pending&&g.phase!=='casting'&&g.phase!=='retrieving'){const approach=g.phase==='waiting'?clamp(g.elapsed/g.waitFor,0,1):1,fx=x+dir*((1-approach)*160*this.unit+22*this.unit);this.fish(c,g.pending.id,fx,y, getCatch(g.pending.id)?.kind==='fish'?80*this.unit:38*this.unit,dir>0,t*(g.phase==='fight'?10:4),.3+approach*.65);}
  if(g.phase==='bite'){c.strokeStyle='#ffe0a1';c.lineWidth=2;c.beginPath();c.ellipse(entryX,this.water,15+Math.sin(t*9)*4,4,0,0,Math.PI*2);c.stroke();}
  if(g.phase!=='casting'&&g.phase!=='retrieving'){c.font='12px Arial';c.fillStyle='#e1d3ad';c.textAlign=dir>0?'left':'right';c.fillText(`${g.depth.toFixed(1)} m`,x+dir*14,y-29);}c.restore();
 }
 draw(dt){
  if(this.diagnosticBlank){this.ctx.clearRect(0,0,this.W,this.H);return;}
  // Keep the hull and outward cast visible at both physical area boundaries.
  const g=this.game,s=g.save,edge=320;if(this.lastArea!==s.area){this.lastArea=s.area;this.camera=clamp(s.x-(this.mobile?240:480),-edge,g.area.width-this.W/this.unit+edge);this.lastBackground='';}
  this.time+=s.reduced?dt*.35:dt;
  const target=clamp(s.x-(this.W/this.unit)*(s.facing>0?.39:.61),-edge,g.area.width-this.W/this.unit+edge);this.camera=mix(this.camera,target,1-Math.exp(-dt*3.6));
  const show=['sinking','waiting','bite','fight','retrieving'].includes(g.phase);this.reveal=mix(this.reveal,show?1:0,1-Math.exp(-dt*3));
  const rest=this.H*(this.mobile?.67:.73),cut=this.H*(this.mobile?.47:.53)-Math.min(g.depth,150)*this.H*.0012;this.water=mix(this.water,mix(rest,Math.max(this.mobile?180:130,cut),this.reveal),1-Math.exp(-dt*3.5));
  this.paintBackground();const c=this.ctx,W=this.W,H=this.H,t=this.time,wl=this.water;c.clearRect(0,0,W,H);
  // Water refraction uses the cached scene and stays behind all physical actors.
  if(!s.reduced&&!this.skipRefraction){c.save();c.globalAlpha=.32;for(let y=wl*.69;y<H;y+=8){const dx=(Math.sin(t*.9+y*.071)+Math.sin(t*1.4-y*.035)*.4)*2.5;c.drawImage(this.back,0,y,W,5,dx,y,W,5);}c.restore();}
  this.landscape(c);this.underwater(c);this.dock(c);
  c.save();for(let i=0;i<175;i++){const x=((i*83.7-this.camera*.55*this.unit+t*(i%2?3:-2))%W+W)%W,y=this.reveal>.2?wl-14+Math.sin(i*3.7)*10:wl*.70+(i*31.7)%(this.H-wl*.70);c.globalAlpha=.10+(Math.sin(t+i)+1)*.065;c.fillStyle=i%4?'#b1dfd4':'#f5cb88';c.fillRect(x,y,4+i%18,1);}if(this.reveal>.02){c.globalAlpha=this.reveal*.65;c.fillStyle='#bfdcd1';c.strokeStyle='#bfdcd1';c.lineWidth=1.5;c.beginPath();for(let x=0;x<=W;x+=6){const y=wl+Math.sin(x*.034+t*1.6)*.75+Math.sin(x*.077-t)*.45;if(x)c.lineTo(x,y);else c.moveTo(x,y);}c.stroke();}c.restore();
  const p=this.boatPose();this.actor(c,p);this.line(c,p);
  if(Math.abs(g.velocity)>10){c.save();c.strokeStyle='#d1e3d0';for(let i=0;i<8;i++){const age=((t*1.5+i*.17)%1),x=p.x-s.facing*(p.bw*.38+age*90*this.unit);c.globalAlpha=(1-age)*.3;c.beginPath();c.ellipse(x,wl+3,8+age*36,2+age*5,0,0,Math.PI*2);c.stroke();}c.restore();}
  c.save();c.strokeStyle='#dae4c8';this.effects=this.effects.filter(e=>t-e.time<2.4);for(const e of this.effects){const age=t-e.time;c.globalAlpha=(1-age/2.4)*.55;c.beginPath();c.ellipse(this.worldX(e.x),wl,6+age*42,2+age*5,0,0,Math.PI*2);c.stroke();}c.restore();
  // Nearby islands drift faster than the boat's camera to establish depth.
  for(const o of g.area.objects.filter(o=>o.type==='reeds')){const sp=this.sprite('reeds');if(!sp)continue;const x=this.worldX(o.x,o.parallax),w=590*o.scale*this.unit,h=w*sp.height/sp.width;if(x+w<0||x>W)continue;c.save();c.globalAlpha=.65*(1-this.reveal*.8);c.drawImage(sp,x-w/2,H-h*.67,w,h);c.restore();}
 }
}
