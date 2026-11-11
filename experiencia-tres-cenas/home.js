import {mountApproved} from './home-approved.js';
import {clamp,ramp,mix,onScroll,gate} from './motion.js';

/* Isolated three-scene direction study.
   H00/H01/H12 is the untouched approved engine; only the subsequent passage is authored here.
   Third-scene strip choreography is a new adaptation, not a port of Codrops C09 source. */
export function mountHome(page,cfg,signal,skipIntro){
  const approved=mountApproved(page,cfg,signal,skipIntro);
  const track=page.querySelector('#track'),stage=page.querySelector('.stage');
  const phi=page.querySelector('.filosofia'),box=page.querySelector('.imagebox');
  const media=page.querySelector('.opening');
  const original=cfg.filosofia[cfg.filosofiaTipo].image;
  const selections=cfg.tratamentos.slice(0,Math.min(cfg.tratamentos.length,5));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const k=innerWidth<=680?1.55:1.95;
  const thirdStart=k+.12;
  const expandEnd=k+1.22;
  const stripsStart=k+1.01;
  const stripsEnd=k+2.08;
  const infoStart=k+1.82;
  const total=k+3.2;
  const third=document.createElement('section');
  third.className='theater';
  third.setAttribute('aria-label','Experiência dos tratamentos');
  third.setAttribute('aria-hidden','true');
  third.inert=true;
  third.innerHTML=`
   <div class="theater-expander"><img class="theater-source" src="${original}" alt="" /><div class="theater-slices" aria-hidden="true"></div><div class="theater-shade"></div></div>
   <div class="theater-editorial">
      <span class="theater-kicker">ÉLAN / EXPERIÊNCIAS</span>
      <div class="theater-main"><p class="theater-index" aria-live="polite">01 / ${String(selections.length).padStart(2,'0')}</p>
        <h2 class="theater-title">Tratamento 01</h2>
        <p class="theater-description">Explore os cuidados e conheça os tratamentos.</p>
        <a class="theater-cta" data-npe-link href="tratamentos.html#tratamento-0">CONHECER O TRATAMENTO <span aria-hidden="true">↗</span></a></div>
      <div class="theater-bottom"><span>ESCOLHA SUA EXPERIÊNCIA</span><div class="theater-nav">
      <button type="button" class="theater-prev" aria-label="Tratamento anterior">←</button>
      <button type="button" class="theater-next" aria-label="Próximo tratamento">→</button></div></div>
   </div>
  `;
  stage.append(third);
  const expander=third.querySelector('.theater-expander');
  const slices=third.querySelector('.theater-slices');
  const title=third.querySelector('.theater-title');
  const text=third.querySelector('.theater-description');
  const index=third.querySelector('.theater-index');
  const link=third.querySelector('.theater-cta');
  const pieces=[];
  for(let i=0;i<8;i++){
    const image=document.createElement('img');
    image.src=selections[0]?.image||'assets/room.jpg';
    image.alt='';
    image.className='theater-slice';
    image.style.clipPath=`inset(${i*12.5}% 0 ${(7-i)*12.5}% 0)`;
    slices.append(image);
    pieces.push(image);
  }
  let selected=0,changing=false,phase=0;
  function setData(id){
    const item=selections[id];
    if(!item)return;
    selected=id;
    title.textContent=item.title||item.nome||`Tratamento ${id+1}`;
    text.textContent=item.text||'Conheça os cuidados disponíveis.';
    index.textContent=`${String(id+1).padStart(2,'0')} / ${String(selections.length).padStart(2,'0')}`;
    link.href=`tratamentos.html#tratamento-${id}`;
    link.setAttribute('aria-label',`Conhecer ${title.textContent}`);
  }
  setData(0);
  async function go(delta){
    if(changing||reduced.matches||phase<.97)return;
    const dest=(selected+delta+selections.length)%selections.length;
    if(dest===selected)return;
    changing=true;
    const item=selections[dest],image=item.image;
    pieces.forEach(p=>{p.src=image;p.style.transition='none';p.style.transform='translateX(105%)'});
    await Promise.all(pieces.map(p=>p.decode().catch(()=>{})));
    if(signal.aborted){changing=false;return}
    pieces.forEach((p,i)=>p.animate([{transform:'translateX(105%)'},{transform:'translateX(0%)'}],{duration:950,delay:i*67,easing:'cubic-bezier(.77,0,.18,1)',fill:'forwards'}));
    await new Promise(resolve=>setTimeout(resolve,150));
    setData(dest);
    await new Promise(resolve=>setTimeout(resolve,1450));
    pieces.forEach(p=>{p.style.transform='translateX(0%)';p.getAnimations().forEach(a=>a.cancel())});
    changing=false;
  }
  third.querySelector('.theater-prev').addEventListener('click',()=>go(-1),{signal});
  third.querySelector('.theater-next').addEventListener('click',()=>go(1),{signal});
  const fallback=()=>{third.style.visibility='visible';third.style.opacity='1';third.style.position='relative';third.style.height='auto';expander.removeAttribute('style');pieces.forEach((p,i)=>p.style.transform=i===0?'none':'translateX(110%)');third.querySelector('.theater-editorial').style.opacity='1';gate(third,true);};
  const state={scene:0,expansion:0,reveal:0};
  function render(){
    if(signal.aborted)return;
    if(reduced.matches){track.style.height='auto';fallback();return;}
    const h=stage.clientHeight||innerHeight;
    track.style.height=`${(total+1)*100}svh`;
    const u=clamp((scrollY-track.offsetTop)/(h*total))*total;
    const expansion=ramp(u,thirdStart,expandEnd);
    const reveal=ramp(u,stripsStart,stripsEnd);
    const info=ramp(u,infoStart,infoStart+.72);
    phase=info;
    state.scene=u<thirdStart?u<k*.75?1:2:3;
    state.expansion=expansion;state.reveal=reveal;
    const active=u>thirdStart+.007;
    third.style.visibility=active?'visible':'hidden';
    third.style.opacity='1';
    gate(third,info>.84);
    if(!active)return;
    const source=box.getBoundingClientRect(),surface=stage.getBoundingClientRect();
    const sourceX=source.x-surface.x,sourceY=source.y-surface.y;
    const rect=[sourceX,sourceY,source.width,source.height];
    const dest=[0,0,stage.clientWidth,stage.clientHeight];
    expander.style.left=mix(rect[0],dest[0],expansion)+'px';
    expander.style.top=mix(rect[1],dest[1],expansion)+'px';
    expander.style.width=mix(rect[2],dest[2],expansion)+'px';
    expander.style.height=mix(rect[3],dest[3],expansion)+'px';
    expander.style.borderRadius=`${(1-expansion)*4}px`;
    pieces.forEach((piece,i)=>{
      if(selected!==0&&phase>=.97)return;
      const t=ramp(reveal,i*.065,.58+i*.065);
      piece.style.transform=`translate3d(${(1-t)*102}%,0,0)`;
    });
    const editorial=third.querySelector('.theater-editorial');
    editorial.style.opacity=info.toFixed(4);
    editorial.style.transform=`translate3d(0,${((1-info)*35).toFixed(2)}px,0)`;
    // Avoid trapping navigation in an occluded scene.
    phi.inert=u>infoStart+.5;
  }
  onScroll(render,signal);
  return {render,state:()=>({...state,...(approved.state?.()||{})}),approved,
    ranges:()=>({hero:[0,k*.2],filosofia:[k*.2,thirdStart],tratamentos:[thirdStart,total]})};
}
