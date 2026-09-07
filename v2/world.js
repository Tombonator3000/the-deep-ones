// One schema is shared by game, chart and visual editor.
export const WORLD_VERSION=1;
export const LAYER_TYPES=['island','forest','village','reeds','ruins'];
export const AREAS=[
 {id:'cove',name:'Stillwater Cove',subtitle:'Der alt fremdeles virker normalt',width:7200,dockX:480,price:0,maxDepth:60,tint:'cove',fog:.35,
 zones:[{x:0,depth:18,name:'Old Marshs brygge'},{x:1100,depth:30,name:'Bjørkevika'},{x:2800,depth:42,name:'Tåkeskogen'},{x:4800,depth:60,name:'Det sunkne kapellet'}],
 objects:[{type:'village',x:200,y:0,scale:1,parallax:.48},{type:'island',x:1650,y:0,scale:1.2,parallax:.60},{type:'forest',x:2850,y:0,scale:1.8,parallax:.42},{type:'reeds',x:1800,y:0,scale:.8,parallax:1.08},{type:'island',x:4000,y:0,scale:1.1,parallax:.7},{type:'village',x:5000,y:0,scale:.65,parallax:.4},{type:'forest',x:6500,y:0,scale:1.6,parallax:.65},{type:'ruins',x:5400,y:45,scale:1.2,parallax:.9}],relic:'compass',relicAt:4900,relicDepth:24,map:[24,72]},
 {id:'reef',name:'Blackthorn Reef',subtitle:'Vrakene ligger tettere enn skjærene',width:8400,dockX:500,price:140,maxDepth:100,tint:'reef',fog:.5,
 zones:[{x:0,depth:30,name:'Den gamle fergekaia'},{x:1500,depth:55,name:'Enkeskjærene'},{x:3600,depth:80,name:'Vrakbeltet'},{x:5900,depth:100,name:'Klokkedypet'}],
 objects:[{type:'forest',x:700,y:0,scale:1.4,parallax:.45},{type:'island',x:2100,y:0,scale:1.5,parallax:.65},{type:'ruins',x:3800,y:50,scale:1.5,parallax:.9},{type:'island',x:4600,y:0,scale:1.8,parallax:.65},{type:'village',x:6300,y:0,scale:.5,parallax:.38},{type:'forest',x:7500,y:0,scale:1.3,parallax:.65},{type:'reeds',x:7900,y:0,scale:1.3,parallax:1.08}],relic:'journal',relicAt:5800,relicDepth:48,map:[54,45]},
 {id:'abyss',name:'Dagon’s Reach',subtitle:'På kartet står det bare: ikke kast anker',width:9600,dockX:520,price:360,maxDepth:150,tint:'abyss',fog:.72,
 zones:[{x:0,depth:45,name:'Det siste naustet'},{x:1700,depth:80,name:'De navnløse øyene'},{x:3900,depth:115,name:'Den stille menigheten'},{x:6900,depth:150,name:'Avgrunnsporten'}],
 objects:[{type:'village',x:200,y:0,scale:.65,parallax:.55},{type:'forest',x:1800,y:0,scale:1.4,parallax:.55},{type:'island',x:3900,y:0,scale:1.9,parallax:.65},{type:'ruins',x:6100,y:85,scale:1.8,parallax:.85},{type:'island',x:7200,y:0,scale:1.3,parallax:.65},{type:'forest',x:8800,y:0,scale:1.8,parallax:.6}],relic:'idol',relicAt:7200,relicDepth:85,map:[79,22]}
];
const valid=(v,a,b)=>typeof v==='number'&&Number.isFinite(v)&&v>=a&&v<=b;
export function validateWorld(raw){
 if(!raw||raw.version!==1||!raw.area||typeof raw.area!=='object')throw new Error('Dette er ikke et Stillwater-brett (versjon 1).');const a=raw.area;
 if(typeof a.name!=='string'||a.name.trim().length<2||a.name.length>60)throw new Error('Brettet trenger et navn på 2–60 tegn.');
 if(!valid(a.width,3000,16000)||!valid(a.dockX,250,a.width-300)||!valid(a.maxDepth,18,150))throw new Error('Bredde, brygge eller dybde er utenfor grensene.');
 if(!Array.isArray(a.objects)||a.objects.length>60||!Array.isArray(a.zones)||a.zones.length<1||a.zones.length>12)throw new Error('Brettet kan ha 1–12 dybdesoner og opptil 60 landskapselementer.');
 const objects=a.objects.map(o=>{if(!LAYER_TYPES.includes(o.type)||!valid(o.x,0,a.width)||!valid(o.y,-100,150)||!valid(o.scale,.2,3)||!valid(o.parallax,.15,1.2))throw new Error('Et landskapselement har ugyldige verdier.');return {type:o.type,x:o.x,y:o.y,scale:o.scale,parallax:o.parallax};});
 const zones=a.zones.map(z=>{if(!valid(z.x,0,a.width)||!valid(z.depth,4,a.maxDepth)||typeof z.name!=='string'||z.name.length>60)throw new Error('En dybdesone er ugyldig.');return {x:z.x,depth:z.depth,name:z.name};}).sort((a,b)=>a.x-b.x);zones[0].x=0;
 return {id:'custom',name:a.name.trim(),subtitle:'Ditt eget farvann',width:a.width,dockX:a.dockX,maxDepth:a.maxDepth,price:0,tint:['cove','reef','abyss'].includes(a.tint)?a.tint:'cove',fog:valid(a.fog,0,1)?a.fog:.4,objects,zones,relic:null,relicAt:0,relicDepth:0,map:[64,82]};
}
export const worldExport=area=>({version:WORLD_VERSION,area:JSON.parse(JSON.stringify(area))});
