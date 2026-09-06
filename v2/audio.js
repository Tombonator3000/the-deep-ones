// Original synthesized ambience/music; no third-party audio or API calls.
export class Soundscape {
  constructor(){this.context=null;this.master=null;this.enabled=false;this.lastNote=0;this.note=0;this.night=false;}
  async start(){
    if(!this.context){
      const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;
      this.context=new Audio();const c=this.context;this.master=c.createGain();this.master.gain.value=0;this.master.connect(c.destination);
      const buffer=c.createBuffer(1,c.sampleRate*4,c.sampleRate),data=buffer.getChannelData(0);let value=0;
      for(let i=0;i<data.length;i++){value=(value+Math.random()*.035-.0175)*.98;data[i]=value;}
      const noise=c.createBufferSource();noise.buffer=buffer;noise.loop=true;
      const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=580;
      const gain=c.createGain();gain.gain.value=.34;noise.connect(filter).connect(gain).connect(this.master);noise.start();
      const swell=c.createOscillator(),sg=c.createGain();swell.frequency.value=.17;sg.gain.value=.18;swell.connect(sg).connect(gain.gain);swell.start();
    }
    try{await this.context.resume();this.enabled=true;this.master.gain.setTargetAtTime(.65,this.context.currentTime,.25);return true;}catch{return false;}
  }
  mute(){this.enabled=false;if(this.master)this.master.gain.setTargetAtTime(0,this.context.currentTime,.1);}
  tone(freq,duration=.5,volume=.1,type='sine'){
    if(!this.enabled||!this.context)return;const c=this.context,t=c.currentTime,o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g).connect(this.master);o.start(t);o.stop(t+duration+.02);
  }
  effect(kind){if(kind==='bite'){this.tone(660,.15,.12);setTimeout(()=>this.tone(880,.25,.08),150);}else if(kind==='caught'){this.tone(392,1,.1);setTimeout(()=>this.tone(587,1.5,.08),160);}else if(kind==='snap')this.tone(85,.25,.18,'triangle');else if(kind==='pet'){this.tone(350,.12,.025);this.tone(430,.18,.025);}else if(kind==='splash')this.tone(120,.45,.07,'triangle');else if(kind==='coin')this.tone(1174,.5,.08);else if(kind==='discovery'){this.tone(110,5.2,.034);this.tone(112,5.2,.024);}}
  tick(time,night){if(!this.enabled||time-this.lastNote<3.6)return;this.lastNote=time;const day=[146.83,220,293.66,329.63,220,196,293.66,440],dark=[146.83,155.56,220,293.66,207.65,146.83,311.13,220];const f=(night?dark:day)[this.note++%8];this.tone(f,3.2,.043,'triangle');this.tone(f*2,2,.016);}
}
