// Original synthesized ambience/music; no third-party audio or API calls.
export class Soundscape {
  constructor(){this.context=null;this.master=null;this.enabled=false;this.lastNote=0;this.note=0;this.night=false;this.lastBird=0;this.lastReel=0;this.lastThunder=-100;}
  async start(){
    if(!this.context){
      const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;
      this.context=new Audio();const c=this.context;this.master=c.createGain();this.master.gain.value=0;this.master.connect(c.destination);
      const buffer=c.createBuffer(1,c.sampleRate*4,c.sampleRate),data=buffer.getChannelData(0);let value=0;
      for(let i=0;i<data.length;i++){value=(value+Math.random()*.035-.0175)*.98;data[i]=value;}
      const noise=c.createBufferSource();noise.buffer=buffer;noise.loop=true;
      const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=580;
      const gain=c.createGain();gain.gain.value=.34;noise.connect(filter).connect(gain).connect(this.master);noise.start();this.ambientGain=gain;this.ambientFilter=filter;
      const swell=c.createOscillator(),sg=c.createGain();swell.frequency.value=.17;sg.gain.value=.18;swell.connect(sg).connect(gain.gain);swell.start();
      this.noiseBuffer=buffer;
      this.motor=c.createOscillator();this.motor.type='triangle';this.motor.frequency.value=55;
      this.motorGain=c.createGain();this.motorGain.gain.value=0;this.motor.connect(this.motorGain).connect(this.master);this.motor.start();
    }
    try{await this.context.resume();this.enabled=true;this.master.gain.setTargetAtTime(.65,this.context.currentTime,.25);return true;}catch{return false;}
  }
  mute(){this.enabled=false;if(this.master)this.master.gain.setTargetAtTime(0,this.context.currentTime,.1);}
  tone(freq,duration=.5,volume=.1,type='sine'){
    if(!this.enabled||!this.context)return;const c=this.context,t=c.currentTime,o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g).connect(this.master);o.start(t);o.stop(t+duration+.02);
  }
  noise(duration=.35,volume=.1,freq=1600){if(!this.enabled||!this.noiseBuffer)return;const c=this.context,t=c.currentTime,n=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();n.buffer=this.noiseBuffer;f.type='bandpass';f.frequency.setValueAtTime(freq,t);f.frequency.exponentialRampToValueAtTime(Math.max(100,freq*.25),t+duration);g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);n.connect(f).connect(g).connect(this.master);n.start();n.stop(t+duration);}
  effect(kind){if(kind==='nibble'){this.noise(.08,.12,1800);this.tone(390,.08,.025);}else if(kind==='twitch'){this.noise(.08,.07,2200);}else if(kind==='bite'){this.tone(660,.15,.10);setTimeout(()=>this.tone(880,.25,.07),150);this.noise(.16,.22,1200);}else if(kind==='caught'){this.noise(.45,.4,600);this.tone(392,1,.08);setTimeout(()=>this.tone(587,1.5,.06),160);}else if(kind==='snap'){this.noise(.12,.7,4000);this.tone(85,.25,.12,'triangle');}else if(kind==='pet'){this.tone(350,.12,.025);this.tone(430,.18,.025);}else if(kind==='splash'){this.noise(.65,.8,850);this.tone(120,.3,.04,'triangle');}else if(kind==='cast')this.noise(.38,.5,3200);else if(kind==='retract')this.noise(.6,.16,2100);else if(kind==='anchor'){this.tone(145,.3,.09,'triangle');setTimeout(()=>this.noise(.55,.7,550),90);}else if(kind==='hook')this.tone(265,.13,.065,'triangle');else if(kind==='coin'){this.tone(1174,.5,.08);this.tone(1760,.35,.025);}else if(kind==='stage'||kind==='discovery'){this.tone(110,5.2,.034);this.tone(112,5.2,.024);}}
  tick(time,night,game){
    if(!this.enabled)return;
    if(game&&this.ambientGain){const w=game.weather,t=this.context.currentTime;this.ambientGain.gain.setTargetAtTime(.25+w.rain*.45+w.wind*.12,t,1);this.ambientFilter.frequency.setTargetAtTime(500+w.rain*1800,t,1);if(w.kind==='storm'&&time-this.lastThunder>23){this.lastThunder=time;this.noise(3.2,.55,180);this.tone(38,4,.045,'triangle');}}
    if(game&&this.motorGain){const speed=game.paused?0:Math.min(1,Math.abs(game.velocity)/240),t=this.context.currentTime;this.motorGain.gain.setTargetAtTime(speed*.034,t,.2);this.motor.frequency.setTargetAtTime(40+speed*35,t,.2);if(game.reeling&&!game.paused&&time-this.lastReel>.14){this.lastReel=time;this.noise(.065,.22,2400);this.tone(180+game.tension*170,.055,.012,'triangle');}if(time-this.lastBird>27&&!game.paused){this.lastBird=time;this.tone(night?130:760,night?3:.25,night?.012:.014);if(!night)setTimeout(()=>this.tone(940,.3,.01),180);}}
    if(time-this.lastNote<3.6)return;this.lastNote=time;const day=[146.83,220,293.66,329.63,220,196,293.66,440],dark=[146.83,155.56,220,293.66,207.65,146.83,311.13,220],unsettled=night||(game&&game.save.sanity<70);const f=(unsettled?dark:day)[this.note++%8];this.tone(f,3.2,.033,'triangle');this.tone(f*2,2,.012);
  }
}
