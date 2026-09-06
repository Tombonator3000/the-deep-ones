import test from 'node:test';
import assert from 'node:assert/strict';
import { FishingGame, freshSave, validateSave, CONFIG } from '../game.js';

function advance(g,seconds,hz=60){for(let i=0;i<Math.ceil(seconds*hz);i++)g.tick(1/hz);}
function catchFish(g,hz=60,fixedInputs=false){
  assert.equal(g.cast(),true);let seconds=0;
  while(g.phase!=='bite'&&seconds<10){g.tick(1/hz);seconds+=1/hz;}
  assert.equal(g.phase,'bite');g.action();
  while(g.phase==='fight'&&seconds<60){
    if(fixedInputs)g.reeling=g.elapsed%4<2.6;
    else if(g.tension>.65)g.reeling=false;else if(g.tension<.18)g.reeling=true;
    g.tick(1/hz);seconds+=1/hz;
  }
  assert.equal(g.phase,'caught');return seconds;
}
test('normal fishing -> sale -> new rod -> first abnormal discovery, persists without duplication',()=>{
  const g=new FishingGame(freshSave(),()=>0);
  catchFish(g);assert.equal(g.pending.id,'cod');g.resolveCatch(true);
  catchFish(g);g.resolveCatch(true);assert.equal(g.save.inventory.length,2);
  g.toDock();advance(g,3);assert.equal(g.save.x,.20);g.paused=true;
  assert.equal(g.sell(),76);assert.equal(g.sell(),0);assert.equal(g.save.money,96);
  assert.equal(g.buyRod(1),true);assert.equal(g.save.money,6);assert.equal(g.buyRod(1),false);
  g.paused=false;g.save.x=.4;g.setDepth(24);catchFish(g);assert.equal(g.pending.id,'eel');
  g.resolveCatch(true);assert.equal(g.resolveCatch(true),false);assert.equal(g.save.sanity,86);assert.equal(g.save.discovery,true);
  const restored=new FishingGame(JSON.parse(JSON.stringify(g.save)));
  assert.equal(restored.save.money,6);assert.equal(restored.save.rod,1);assert.deepEqual(restored.save.inventory,['eel']);assert.equal(restored.save.journal.eel,1);
});
test('depth/location/rod jointly constrain catches; releasing records discovery without sanity loss',()=>{
  const s=freshSave();s.caught=1;s.rod=1;s.x=.2;
  const g=new FishingGame(s,()=>0);g.setDepth(40);assert.equal(g.save.targetDepth,18);assert.equal(g.selectFish().id,'cod');
  g.save.x=.4;g.setDepth(24);catchFish(g);assert.equal(g.pending.id,'eel');g.resolveCatch(false);
  assert.equal(g.save.sanity,100);assert.deepEqual(g.save.inventory,[]);assert.equal(g.save.journal.eel,1);assert.equal(g.save.discovery,true);
});
test('30 / 60 / 120 fps produce comparable fishing time and held movement',()=>{
  // Replay the same time-based player inputs at each refresh rate. A feedback
  // controller sampled at different rates is not the same input sequence.
  const results=[30,60,120].map(hz=>{const g=new FishingGame(freshSave(),()=>.2);g.move=1;advance(g,2,hz);const x=g.save.x;g.move=0;return{time:catchFish(g,hz,true),x};});
  assert.ok(Math.max(...results.map(r=>r.time))-Math.min(...results.map(r=>r.time))<.25);
  for(const r of results)assert.ok(Math.abs(r.x-.64)<1e-9);
});
test('continuous reeling can snap line; paused menus freeze progression',()=>{
  const g=new FishingGame(freshSave(),()=>0);g.cast();advance(g,5);g.action();
  const elapsed=g.elapsed;g.paused=true;advance(g,30);assert.equal(g.elapsed,elapsed);assert.equal(g.phase,'fight');
  g.paused=false;advance(g,15);assert.equal(g.phase,'ready');assert.equal(g.save.caught,0);assert.equal(g.save.inventory.length,0);assert.ok(g.events.some(e=>e.type==='snap'));
});
test('save validation rejects malformed fields and excessive inventory',()=>{
  const s=validateSave({version:2,money:'Infinity',sanity:-500,rod:999,inventory:Array(20).fill('cod').concat('unknown'),journal:{cod:2,eel:'many',hacker:50},x:NaN,light:'bad'});
  assert.equal(s.money,20);assert.equal(s.sanity,0);assert.equal(s.rod,2);assert.equal(s.inventory.length,CONFIG.capacity);assert.deepEqual(s.journal,{cod:2});assert.equal(s.x,.43);assert.equal(s.light,'auto');
  assert.deepEqual(validateSave({version:1,money:700}),freshSave());
});
test('dog cooldown, full basket and shop constraints prevent reward exploits',()=>{
  const g=new FishingGame(freshSave());g.save.sanity=50;assert.equal(g.pet(),true);assert.equal(g.pet(),false);assert.equal(g.save.sanity,54);
  g.save.inventory=Array(CONFIG.capacity).fill('cod');assert.equal(g.cast(),false);
  assert.equal(g.sell(),0);g.save.money=1000;assert.equal(g.buyRod(1),false);
});
