import { FISH, clamp } from './game.js';

export const SPRITES={boat:[90,25,1352,472],cod:[35,531,458,200],perch:[563,529,372,197],eel:[1004,574,502,142],squid:[35,770,479,203],angler:[601,731,360,255],choir:[1030,716,461,264]};
const surface=.5271;
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function image(src){return new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src;});}
// The source atlas has an explicit black matte, not alpha. Mask only the
// edge-connected matte once at runtime; dark interiors/eyes remain intact.
function makeSprite(atlas,rect){
  const [sx,sy,w,h]=rect,c=canvas(w,h),ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(atlas,sx,sy,w,h,0,0,w,h);
  const pixels=ctx.getImageData(0,0,w,h),d=pixels.data,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let read=0,write=0;
  const add=i=>{if(i<0||i>=seen.length||seen[i])return;seen[i]=1;const j=i*4;if(Math.max(d[j],d[j+1],d[j+2])<8)queue[write++]=i;};
  for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
  while(read<write){const i=queue[read++];d[i*4+3]=0;if(i%w)add(i-1);if(i%w<w-1)add(i+1);add(i-w);add(i+w);}
  ctx.putImageData(pixels,0,0);return c;
}
export class Renderer {
  constructor(game){
    this.game=game;this.back=document.querySelector('#landscape');this.front=document.querySelector('#scene');this.bg=this.back.getContext('2d',{alpha:false});this.ctx=this.front.getContext('2d');
    this.sprites={};this.assets={};this.failures=[];this.lastBackground='';this.effects=[];this.time=0;this.petTime=-100;this.uneaseUntil=0;
    this.fishes=Array.from({length:19},(_,i)=>({x:((i*137.37)%1000)/1000,y:.1+((i*91)%600)/760,id:i<10?(i%3?'cod':'perch'):FISH[2+(i%4)].id,speed:(i%2?1:-1)*(.011+(i%4)*.005),size:.025+(i%3)*.005,phase:i*2.78}));
    this.resize();new ResizeObserver(()=>this.resize()).observe(document.querySelector('#game'));
  }
  async load(){
    const loaded=await Promise.all(['environment-dusk','environment-night','sprites','environment-day','sprites-alert'].map(n=>image(`${import.meta.env.BASE_URL}art/${n}.png`)));
    ['dusk','night','atlas','day','alert'].forEach((n,i)=>{this.assets[n]=loaded[i];if(!loaded[i])this.failures.push(n);});
    if(this.assets.atlas)for(const [id,rect]of Object.entries(SPRITES))this.sprites[id]=makeSprite(this.assets.atlas,rect);
    if(this.assets.alert)this.sprites.boatAlert=makeSprite(this.assets.alert,SPRITES.boat);
    // Immutable bitmaps avoid repeatedly uploading CPU-backed matte canvases.
    if(window.createImageBitmap)for(const id of Object.keys(this.sprites))this.sprites[id]=await createImageBitmap(this.sprites[id]);
    this.paintBackground(true);return this.failures;
  }
  resize(){
    const rect=document.querySelector('#game').getBoundingClientRect();this.mobile=rect.width<570;this.W=Math.min(1672,Math.round(rect.width));this.H=Math.round(rect.height*this.W/rect.width);
    for(const c of [this.back,this.front]){c.width=this.W;c.height=this.H;}this.water=this.H*surface;this.ctx.imageSmoothingEnabled=true;this.lastBackground='';
  }
  light(){
    const s=this.game.save;if(s.light!=='auto')return s.light;
    return s.cycle<.20?'dawn':s.cycle<.54?'day':s.cycle<.78?'dusk':'night';
  }
  paintBackground(force=false){
    const light=this.light(),s=this.game.save,key=`${light}/${Math.round(this.W)}/${Math.round(this.H)}/${Math.round(s.x*18)}`;
    if(key===this.lastBackground&&!force)return;this.lastBackground=key;
    const {bg:ctx,W,H}=this,im=this.assets[light==='night'?'night':light==='day'?'day':'dusk']||this.assets.dusk;
    ctx.fillStyle='#123c44';ctx.fillRect(0,0,W,H);
    if(im){
      const scale=Math.max(W/im.width,H/im.height),cw=W/scale,ch=H/scale;
      const sx=(im.width-cw)*clamp(.5+(s.x-.43)*.13,0,1),sy=clamp(im.height*surface-ch*surface,0,im.height-ch);
      ctx.drawImage(im,sx,sy,cw,ch,0,0,W,H);this.water=(im.height*surface-sy)*scale;this.crop={sx,sy,scale};
    }else{const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#755268');g.addColorStop(.52,'#d0a17c');g.addColorStop(.53,'#1f6569');g.addColorStop(1,'#071e29');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
    if(light==='night'){ctx.fillStyle='#06112d';ctx.globalAlpha=.38;ctx.fillRect(0,this.water,W,H-this.water);ctx.globalAlpha=1;}
    if(light==='dawn'){ctx.fillStyle='#c5b8dc';ctx.globalAlpha=.10;ctx.fillRect(0,0,W,H*.55);ctx.globalAlpha=1;}
  }
  boatPose(){const W=this.W,bw=W*(this.mobile?.40:.175);return{x:this.game.save.x*W,y:this.water+Math.sin(this.time*1.2)*1.5,bw,bh:bw*472/1352};}
  fish(ctx,id,x,y,w,flip=false,phase=0,alpha=1){
    const sprite=this.sprites[id],h=sprite?w*sprite.height/sprite.width:w*.42;
    ctx.save();ctx.translate(x,y);if(flip)ctx.scale(-1,1);ctx.globalAlpha=alpha;
    if(sprite){
      // Four vertical strips make the tail swim independently of the head.
      for(let i=0;i<4;i++){const sw=sprite.width/4,dx=-w/2+i*w/4,dy=Math.sin(phase-i*.55)*(3-i)*w*.012;ctx.drawImage(sprite,i*sw,0,sw,sprite.height,dx,-h/2+dy,w/4+.3,h);}
    }else{ctx.fillStyle=FISH.find(f=>f.id===id)?.color||'#b5c7af';ctx.beginPath();ctx.ellipse(0,0,w*.38,h*.34,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(-w*.3,0);ctx.lineTo(-w*.55,-h*.4);ctx.lineTo(-w*.55,h*.4);ctx.fill();}
    ctx.restore();
  }
  specimen(id){const c=canvas(560,290),ctx=c.getContext('2d');this.fish(ctx,id,280,145,id==='eel'?440:360,false,0);c.setAttribute('role','img');c.setAttribute('aria-label',FISH.find(f=>f.id===id)?.name||id);return c;}
  addEffect(type){if(type==='pet')this.petTime=this.time;if(type==='discovery')this.uneaseUntil=this.time+8;if(type==='splash'||type==='cast'||type==='caught')this.effects.push({type,time:this.time,x:this.game.save.x+.1});}
  surfaceMotion(){
    if(!this.crop||this.game.save.reduced)return;
    const {ctx:c,W,H,time:t,water:wl}=this,{sx,sy,scale}=this.crop;
    const point=([x,y])=>[(x-sx)*scale,(y-sy)*scale];
    // The mask follows the authored shoreline in source coordinates, so it
    // stays registered when portrait crops or boat movement change the view.
    const shore=[[390,326],[1180,326],[1255,363],[1420,405],[1672,464],[1672,496],[0,496],[0,430],[305,373]].map(point);
    c.save();c.beginPath();shore.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.clip();c.globalAlpha=.42;
    const start=Math.max(0,Math.ceil((326-sy)*scale)),row=Math.max(3,4*scale);
    for(let y=start;y<wl-1;y+=row){
      const height=Math.min(row,wl-y),wave=(Math.sin(t*.72+y*.058)+Math.sin(t*1.07-y*.039)*.35)*scale*1.65;
      c.drawImage(this.back,0,y,W,height,wave,y,W,height);
    }
    c.restore();
    // Slow, thin mist crosses the distant water behind all interactive actors.
    for(let i=0;i<3;i++){
      const [x,y]=point([490+i*245+Math.sin(t*.045+i)*30,320+i%2*12]);
      c.save();c.translate(x,y);c.scale((170+i*16)*scale,(8+i%2*3)*scale);
      const mist=c.createRadialGradient(0,0,0,0,0,1);mist.addColorStop(0,this.light()==='night'?'#bacbd315':'#d2dedc1c');mist.addColorStop(1,'#bcd1d000');
      c.fillStyle=mist;c.fillRect(-1,-1,2,2);c.restore();
    }
  }
  draw(dt){
    if(this.diagnosticBlank){this.ctx.clearRect(0,0,this.W,this.H);return;}
    this.time+=this.game.save.reduced?dt*.3:dt;this.paintBackground();
    const {ctx:c,W,H,time:t,water:wl}=this,s=this.game.save,g=this.game;c.clearRect(0,0,W,H);this.surfaceMotion();
    if(!s.reduced){
      // Refracted strips are drawn from the cached artwork; never redrawn scenery.
      c.save();c.globalAlpha=.23;for(let y=wl+4;y<H*.87;y+=12){const dx=Math.sin(t*1.1+y*.041)*2.4;c.drawImage(this.back,0,y,W,6,dx,y,W,6);}c.restore();
      const ray=c.createLinearGradient(0,wl,0,H*.85);ray.addColorStop(0,'#b6ebdd0c');ray.addColorStop(1,'#b6ebdd00');c.fillStyle=ray;
      c.globalAlpha=this.light()==='night'?.2:1;
      for(let i=0;i<4;i++){const x=W*(.3+i*.16)+Math.sin(t*.1+i)*20;c.beginPath();c.moveTo(x,wl);c.lineTo(x+W*.06,wl);c.lineTo(x-W*.04,H*.88);c.lineTo(x-W*.10,H*.88);c.fill();}c.globalAlpha=1;
    }
    c.save();c.beginPath();c.rect(0,wl+3,W,H-wl);c.clip();
    for(const f of this.fishes){
      if(!g.paused)f.x+=f.speed*dt*(s.reduced?.5:1);if(f.x>1.08)f.x=-.08;if(f.x<-.08)f.x=1.08;
      const y=wl+f.y*(H-wl)*.86+Math.sin(t*.7+f.phase)*5,night=this.light()==='night';
      if(FISH.findIndex(v=>v.id===f.id)>1&&!s.discovery){this.fish(c,f.id,f.x*W,y,f.size*W,true,t*3+f.phase,.07);continue;}
      this.fish(c,f.id,f.x*W,y,W*f.size*(this.mobile?1.8:1),f.speed<0,t*3+f.phase,night?.55:.65);
    }
    if(s.sanity<80||t<this.uneaseUntil){
      const opacity=Math.max(clamp((80-s.sanity)/100,0,.4),.10*clamp((this.uneaseUntil-t)/2,0,1)),x=W*(.5+Math.sin(t*.07)*.2),y=H*.82;
      this.fish(c,'choir',x,y,W*.37,true,t*.25,opacity);c.fillStyle=`rgba(48,29,69,${opacity*.3})`;c.fillRect(0,wl,W,H-wl);
    }
    c.fillStyle='#bddfce';for(let i=0;i<44;i++){const x=((i*173.53+t*(i%2?2:-1))%W+W)%W,y=wl+((i*79.8-t*(2+i%3))%(H-wl)+(H-wl))%(H-wl);c.globalAlpha=.1+Math.sin(i+t)*.06;c.fillRect(x,y,1.2,1.2);}c.globalAlpha=1;c.restore();
    // Surface glints follow the water plane.
    c.save();for(let i=0;i<62;i++){const x=(i*73.8+t*(i%2?2:-2))%W,y=wl-18+Math.sin(i*3.7)*15;c.globalAlpha=.08+(Math.sin(t*.9+i)+1)*.065;c.fillStyle=i%3?'#c3eee1':'#efc17a';c.fillRect(x,y,5+i%15,1);}c.restore();
    const alert=['bite','fight','caught'].includes(g.phase)||t<this.uneaseUntil;
    const p=this.boatPose(),sprite=alert&&this.sprites.boatAlert?this.sprites.boatAlert:this.sprites.boat;let rock=Math.sin(t*.8)*.005+(g.move||g.travel?Math.sin(t*2)*.008:0);
    // Reflection is a live transform of the same boat sprite, clipped at water.
    if(sprite){c.save();c.beginPath();c.rect(0,wl,W,H-wl);c.clip();c.translate(p.x,p.y+4);c.scale(1,-.43);c.rotate(rock);c.globalAlpha=.23;c.drawImage(sprite,-p.bw/2,-p.bh*.955,p.bw,p.bh);c.restore();}
    c.save();c.translate(p.x,p.y);c.rotate(rock);
    if(sprite)c.drawImage(sprite,-p.bw/2,-p.bh*.955,p.bw,p.bh);else{c.fillStyle='#744c35';c.fillRect(-p.bw/2,-p.bh*.35,p.bw,p.bh*.35);c.fillStyle='#cbb999';c.fillRect(0,-p.bh*.85,p.bw*.08,p.bh*.6);}
    const hand=alert&&this.sprites.boatAlert?[968,187]:[955,235];
    const rx=p.bw*(hand[0]/1352-.5),ry=-p.bh*.955+p.bh*(hand[1]/472),fighting=g.phase==='fight';
    const castArc=g.phase==='casting'?Math.sin(clamp(g.elapsed/.9,0,1)*Math.PI)*.5:0;
    const tipX=rx+p.bw*(.47-castArc*.2),tipY=ry-p.bw*(.23+castArc)+(fighting?g.tension*p.bw*.10:0);
    c.strokeStyle='#322e24';c.lineWidth=2.7;c.beginPath();c.moveTo(rx,ry);c.quadraticCurveTo(rx+p.bw*.2,ry-p.bw*.3,tipX,tipY);c.stroke();
    c.strokeStyle='#d5bb86';c.lineWidth=.9;c.stroke();
    const lampX=p.bw*.37,lampY=-p.bh*.44,light=c.createRadialGradient(lampX,lampY,0,lampX,lampY,p.bw*.18);light.addColorStop(0,'#f8bd452e');light.addColorStop(.5,'#f8bd450b');light.addColorStop(1,'#f8bd4500');c.fillStyle=light;c.fillRect(lampX-p.bw*.2,lampY-p.bw*.2,p.bw*.4,p.bw*.4);
    c.restore();
    if(['casting','waiting','bite','fight'].includes(g.phase)){
      const fraction=g.depth/70,hookX=p.x+p.bw*.84+Math.sin(t*1.7)*5,hookY=wl+28+fraction*(H-wl-110);
      c.save();c.strokeStyle=g.tension>.8?'#d5a076':'#e0d6ad';c.globalAlpha=.85;c.lineWidth=1;c.beginPath();c.moveTo(p.x+tipX,p.y+tipY);c.quadraticCurveTo(hookX+Math.sin(t)*6,wl-8,hookX,hookY);c.stroke();
      c.fillStyle=g.phase==='bite'?'#ffd992':'#d8bf8e';c.beginPath();c.arc(hookX,hookY,2.5,0,Math.PI*2);c.fill();
      if(g.pending){const approach=g.phase==='waiting'?clamp(g.elapsed/g.waitFor,0,1):1,fx=hookX+(1-approach)*W*.14;this.fish(c,g.pending.id,fx+W*.026,hookY,W*(this.mobile?.083:.043),true,t*6,approach*.6+.3);}
      if(g.phase==='bite'){c.strokeStyle='#f7d391';c.lineWidth=1.4;c.beginPath();c.ellipse(hookX,wl,14+Math.sin(t*8)*3,3,0,0,Math.PI*2);c.stroke();}c.restore();
    }
    c.save();c.strokeStyle='#bbdbc7';this.effects=this.effects.filter(e=>t-e.time<2);for(const e of this.effects){const age=t-e.time;c.globalAlpha=(1-age/2)*.4;c.beginPath();c.ellipse(e.x*W,wl,5+age*36,1+age*4,0,0,Math.PI*2);c.stroke();}c.restore();
    if(t-this.petTime<2.5){c.save();c.font=`${this.mobile?19:22}px Georgia`;c.fillStyle='#efd4b3';c.globalAlpha=1-(t-this.petTime)/2.5;c.fillText('♡',p.x-p.bw*.25,p.y-p.bh-12-(t-this.petTime)*12);c.restore();}
    if(this.light()==='night'){
      c.save();c.globalCompositeOperation='screen';const angle=Math.sin(t*.18)*.13;c.translate(W*.904,H*.11);c.rotate(angle);const beam=c.createLinearGradient(-W*.45,0,0,0);beam.addColorStop(0,'#e2c99300');beam.addColorStop(1,'#e2c99313');c.fillStyle=beam;c.beginPath();c.moveTo(0,0);c.lineTo(-W*.45,-H*.025);c.lineTo(-W*.45,H*.06);c.closePath();c.fill();c.restore();
    }
  }
}
