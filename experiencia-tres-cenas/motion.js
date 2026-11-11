export const clamp = v => Math.max(0,Math.min(1,v));
export const ease = v => {const t=clamp(v);return t*t*(3-2*t)};
export const ramp = (v,a,b) => ease((v-a)/(b-a));
export const mix = (a,b,t) => a+(b-a)*t;
export function rect(el,a,b,t){for(const [i,k] of ['left','top','width','height'].entries())el.style[k]=mix(a[i],b[i],t)+'px'}
export function gate(el,visible){el.inert=!visible;el.setAttribute('aria-hidden',String(!visible))}
export function onScroll(render,signal){let queued=false;const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;if(!signal.aborted)render()})}};addEventListener('scroll',schedule,{passive:true,signal});addEventListener('resize',schedule,{signal});matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',schedule,{signal});render();return schedule}
export function bandProgress(p,count=8){return Array.from({length:count},(_,i)=>ramp(p,i*.035,.72+i*.035))}
export function paintBands(bands,progress){const complete=progress.every(p=>p===1);bands.forEach((el,i)=>{el.style.clipPath=complete?(i===0?'none':'inset(0 100% 0 0)'):`inset(${Math.max(0,i/bands.length*100-.06)}% ${100*(1-progress[i])}% ${Math.max(0,(1-(i+1)/bands.length)*100-.06)}% 0)`})}
// Hiro-kiii/Scroll-Transition script.js: paired SVG blinds, driven by the shared native scroll clock.
export function createBlinds(group,count=30){const ns='http://www.w3.org/2000/svg';return Array.from({length:count},(_,i)=>{const y=1-(i+.5)/count,h=.5/count;const top=document.createElementNS(ns,'rect'),bottom=document.createElementNS(ns,'rect');for(const r of [top,bottom]){r.setAttribute('x','0');r.setAttribute('width','1');r.setAttribute('fill','white');group.append(r)}return {top,bottom,y,h}})}
export function openBlinds(blinds,p){blinds.forEach((b,i)=>{const t=ramp(p,i*.009,.72+i*.009);b.top.setAttribute('y',b.y-b.h*t);b.bottom.setAttribute('y',b.y);for(const r of [b.top,b.bottom])r.setAttribute('height',t?(b.h+.0002)*t:0)})}
