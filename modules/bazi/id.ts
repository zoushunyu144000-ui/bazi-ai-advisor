// Browser/Node portable deterministic UUID.
// Replaces node:crypto so the deterministic engine can run client-side
// (static export computes the chart in the browser).
const NAMESPACE='bazi-ai-advisor:deterministic-engine';

function sha1Sync(message:string):Uint8Array {
  const bytes=new TextEncoder().encode(message);
  const ml=bytes.length*8;
  const withOne=bytes.length+1;
  const total=Math.ceil((withOne+8)/64)*64;
  const padded=new Uint8Array(total);
  padded.set(bytes);
  padded[bytes.length]=0x80;
  const view=new DataView(padded.buffer);
  view.setUint32(total-4,ml>>>0,false);
  view.setUint32(total-8,Math.floor(ml/0x100000000),false);

  let h0=0x67452301,h1=0xEFCDAB89,h2=0x98BADCFE,h3=0x10325476,h4=0xC3D2E1F0;
  const w=new Uint32Array(80);
  for(let i=0;i<total;i+=64){
    for(let j=0;j<16;j++) w[j]=view.getUint32(i+j*4,false);
    for(let j=16;j<80;j++){
      const v=w[j-3]^w[j-8]^w[j-14]^w[j-16];
      w[j]=(v<<1)|(v>>>31);
    }
    let a=h0,b=h1,c=h2,d=h3,e=h4;
    for(let j=0;j<80;j++){
      let f:number,k:number;
      if(j<20){f=(b&c)|((~b)&d);k=0x5A827999;}
      else if(j<40){f=b^c^d;k=0x6ED9EBA1;}
      else if(j<60){f=(b&c)|(b&d)|(c&d);k=0x8F1BBCDC;}
      else{f=b^c^d;k=0xCA62C1D6;}
      const tmp=(((a<<5)|(a>>>27))+f+e+k+(w[j]>>>0))>>>0;
      e=d;d=c;c=(b<<30)|(b>>>2);b=a;a=tmp;
    }
    h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0;
  }
  const out=new Uint8Array(20);
  const ov=new DataView(out.buffer);
  ov.setUint32(0,h0,false);ov.setUint32(4,h1,false);ov.setUint32(8,h2,false);ov.setUint32(12,h3,false);ov.setUint32(16,h4,false);
  return out;
}

export function deterministicUuid(payload:string):string {
  const bytes=sha1Sync(`${NAMESPACE}\0${payload}`).subarray(0,16);
  bytes[6]=(bytes[6]&0x0f)|0x50;
  bytes[8]=(bytes[8]&0x3f)|0x80;
  const hex=Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
