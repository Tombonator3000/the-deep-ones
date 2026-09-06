export const SPRITES={boat:[90,25,1352,472],cod:[35,531,458,200],perch:[563,529,372,197],eel:[1004,574,502,142],squid:[35,770,479,203],angler:[601,731,360,255],choir:[1030,716,461,264]};
export function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
export function image(src){return new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src;});}
// The source atlas has an explicit black matte, not alpha. Mask only the
// edge-connected matte once at runtime; dark interiors/eyes remain intact.
export function makeSprite(atlas,rect,matte='black'){
  const [sx,sy,w,h]=rect,c=canvas(w,h),ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(atlas,sx,sy,w,h,0,0,w,h);
  const pixels=ctx.getImageData(0,0,w,h),d=pixels.data,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let read=0,write=0;
  const add=i=>{if(i<0||i>=seen.length||seen[i])return;seen[i]=1;const j=i*4,hi=Math.max(d[j],d[j+1],d[j+2]),lo=Math.min(d[j],d[j+1],d[j+2]);if(d[j+3]===0||(matte==='checker'?lo>175&&hi-lo<28:hi<8))queue[write++]=i;};
  for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
  while(read<write){const i=queue[read++];d[i*4+3]=0;if(i%w)add(i-1);if(i%w<w-1)add(i+1);add(i-w);add(i+w);}
  ctx.putImageData(pixels,0,0);return c;
}

export function trimAlpha(source){
 const c=source.getContext('2d'),w=source.width,h=source.height,d=c.getImageData(0,0,w,h).data;let left=w,top=h,right=0,bottom=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>24){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 if(right<=left||bottom<=top)return source;const out=canvas(right-left+1,bottom-top+1);out.getContext('2d').drawImage(source,left,top,out.width,out.height,0,0,out.width,out.height);return out;
}

// A reusable, code-native stone arch for authored underwater landmarks.
export function makeRuins(){
 const out=canvas(440,330),c=out.getContext('2d');
 const block=(x,y,w,h,i)=>{c.fillStyle=['#35565b','#29454f','#476367','#3a5056'][i%4];c.fillRect(x,y,w,h);c.fillStyle='#6b807a66';c.fillRect(x+2,y+2,w-4,3);c.fillStyle='#172e3e';c.fillRect(x,y+h-3,w,3);for(let j=0;j<8;j++){c.fillStyle=j%2?'#233e4966':'#8c948144';c.fillRect(x+4+(i*13+j*17)%(w-8),y+6+(i*7+j*9)%(h-9),3+j%4,2);} };
 for(let row=0;row<6;row++){block(66+(row%2)*3,121+row*27,61,25,row);block(292-(row%2)*3,121+row*27,62,25,row+2);}
 for(let i=0;i<11;i++){const a=Math.PI+(i+.5)/11*Math.PI;c.save();c.translate(211+114*Math.cos(a),132+100*Math.sin(a));c.rotate(a+Math.PI/2);block(-17,-24,33,47,i);c.restore();}
 for(let i=0;i<12;i++)block(34+i*31+(i%3)*5,285+(i%3)*9,37+i%4*7,18+i%3*7,i);
 c.strokeStyle='#314e46';c.lineWidth=3;for(let i=0;i<19;i++){const x=40+i*19;c.beginPath();c.moveTo(x,317);c.bezierCurveTo(x-12,275-i%4*10,x+15,255-i%3*17,x+5,225-i%5*11);c.stroke();}
 c.strokeStyle='#8bb2a269';c.lineWidth=2;c.beginPath();c.arc(211,40,12,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(211,26);c.lineTo(205,48);c.lineTo(220,37);c.stroke();return out;
}
