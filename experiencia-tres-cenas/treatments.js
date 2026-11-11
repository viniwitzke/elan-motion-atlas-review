import {clamp,ramp,mix,gate,onScroll} from './motion.js';

export function mountTreatments(page,cfg,signal){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const tracks=[...page.querySelectorAll('.treatment-track')];
 const groups=tracks.map((track,index)=>({
  track,index,stage:track.querySelector('.treatment-stage'),cards:[...track.querySelectorAll('.treatment-card')],
  heading:track.querySelector('.treatment-heading'),caption:track.querySelector('.gallery-caption'),
  variant:track.dataset.variant||'original'
 }));
 const allCards=groups.flatMap(g=>g.cards);
 let state={};

 function toggle(card,on){
  card.classList.toggle('selected',on);
  const button=card.querySelector('.card-toggle');
  button.setAttribute('aria-expanded',String(on));
  card.querySelector('.card-content').inert=!on;
 }
 function closeOthers(card){for(const other of allCards)if(other!==card)toggle(other,false)}

 // Variante A: fileira com alturas diferentes, bottom alinhado ao final; a primeira
 // fotografia abre grande e encolhe até virar o primeiro card da própria fileira.
 function renderOriginal(g,W,H,p,flow){
  const cards=g.cards,n=cards.length,middle=Math.floor(n/2),shrink=Math.min(1,5/n),spacing=W*.198*shrink;
  const cw=Math.min(W*.183,360)*shrink,baseH=H*.53,factors=[1.04,.94,1,.9,1.02];
  const align=ramp(p,.45,.62),ready=flow||p>=.625,entry=ramp(p,.08,.55);
  const leadIndex=cards.findIndex(card=>!card.classList.contains('typographic'));
  g.heading.style.transform=flow?'':`translateY(${-H*.13*align}px) scale(${mix(1,.58,align)})`;
  const subtitle=g.heading.querySelector('p');if(subtitle)subtitle.style.opacity=flow?'1':String(1-align);
  cards.forEach((card,i)=>{
   if(flow){
    const top=g.stage.getBoundingClientRect().top+card.offsetTop;
    const arrival=reduce.matches?1:ramp(innerHeight-top,0,innerHeight*.55);
    card.style.width='';card.style.height='';card.style.opacity='1';
    card.style.transform=`translateY(${(1-arrival)*32}px)`;
    card.classList.add('is-settled');gate(card,true);card.classList.toggle('is-ready',true);
    return;
   }
   const rank=i-middle,dist=Math.abs(rank),delay=dist===0?0:dist===1?.08:.17;
   const move=ramp(p,.23+delay,.55+delay),x=(i-(n-1)/2)*spacing;
   const h=baseH*factors[i%factors.length],yAlign=(baseH-h)/2;
   let y=mix(H*(dist===0?.44:dist===1?.72:.97),H*(dist===0?-.18:dist===1?.07:.23),move);y=mix(y,yAlign,align);
   const zoom=i===middle?mix(1.28,1,align):1,isLead=i===leadIndex;
   card.style.width=(isLead?mix(W*.38,cw,entry):cw)+'px';
   card.style.height=(isLead?mix(H*.64,h,entry):h)+'px';
   card.style.transform=`translate(-50%,-50%) translate(${(isLead?mix(W*.23,x,entry):x).toFixed(2)}px,${(isLead?mix(H*.02,y,entry):y).toFixed(2)}px) scale(${isLead?mix(1,zoom,entry):zoom})`;
   card.style.opacity=String(isLead?1:ramp(p,.20+delay,.36+delay));
   card.style.zIndex=String(10-dist);
   const settled=isLead||align>=.55;card.classList.toggle('is-settled',settled);
   gate(card,isLead||ready);card.classList.toggle('is-ready',ready);
  });
  if(g.caption)g.caption.style.opacity=ready?'1':'0';
  return {align,ready};
 }

 // Variante B: grelha editorial assimétrica, proporções variadas, cards tipográficos
 // nobres e reorganização pelo scroll. Vale para 6+ itens; o primeiro grupo conduz
 // a mesma abertura foto→card da variante A.
 function renderExpanded(g,W,H,p,flow){
  const cards=g.cards,n=cards.length,align=ramp(p,.30,.74),ready=flow||p>=.42;
  g.heading.style.transform=flow?'':`scale(${mix(1,.52,align)})`;
  const subtitle=g.heading.querySelector('p');if(subtitle)subtitle.style.opacity=flow?'1':String(1-align);
  if(flow){
   cards.forEach(card=>{
    const top=g.stage.getBoundingClientRect().top+card.offsetTop;
    const arrival=reduce.matches?1:ramp(innerHeight-top,0,innerHeight*.5);
    card.style.width='';card.style.height='';card.style.opacity='1';
    card.style.transform=reduce.matches?'':`translateY(${(1-arrival)*28}px)`;
    card.classList.add('is-settled');gate(card,true);card.classList.toggle('is-ready',true);
   });
   return {align,ready};
  }
  const columns=W<=1024?3:n>6?4:Math.min(3,n),rows=Math.ceil(n/columns),gutter=W*.025,left=W*.055;
  const available=W-left*2-gutter*(columns-1),weights=[1.18,.82,1.05,.95].slice(0,columns),sum=weights.reduce((a,b)=>a+b,0);
  const widths=weights.map(w=>w/sum*available),topY=Math.max(220,H*.235),rowHeight=(H-topY-56)/rows;
  cards.forEach((card,i)=>{
   const col=i%columns,row=Math.floor(i/columns),w=widths[col],h=rowHeight*(card.classList.contains('typographic')?1:(col%2?.79:.96));
   const x=left+widths.slice(0,col).reduce((a,b)=>a+b,0)+col*gutter,y=topY+row*rowHeight+(rowHeight-h);
   const arrival=ramp(p,.07+(i%3)*.045,.43+(i%3)*.06),first=i===0&&g.index===0;
   const initialW=first?W*.35:w,initialH=first?H*.65:h;
   card.style.width=mix(initialW,w,align)+'px';
   card.style.height=mix(initialH,h,align)+'px';
   card.style.transform=`translate(${mix(first?W*.58:x+(col-1)*W*.06,x,align).toFixed(2)}px,${(first?mix(H*.23,y,align):mix(H*(1.05+(i%3)*.13),y,arrival)).toFixed(2)}px)`;
   card.style.opacity=String(first?1:arrival);
   card.style.zIndex=String(10-(i%columns));
   const settled=first||arrival>=.9;card.classList.toggle('is-settled',settled);
   gate(card,first||arrival>=.85);card.classList.toggle('is-ready',ready);
  });
  return {align,ready};
 }

 function render(){
  const W=innerWidth,flow=W<720||reduce.matches;
  groups.forEach(g=>{
   g.track.classList.toggle('flow-gallery',flow);
   const H=g.stage.clientHeight||innerHeight;
   const p=flow?1:clamp(-g.track.getBoundingClientRect().top/(g.track.offsetHeight-H));
   const result=g.variant==='expanded'?renderExpanded(g,W,H,p,flow):renderOriginal(g,W,H,p,flow);
   if(g.index===0)state={...result,p,count:g.cards.length,variant:g.variant,flow,groups:groups.length};
  });
  if(groups[0]?.variant==='expanded')state={...state,count:groups.reduce((a,g)=>a+g.cards.length,0)};
 }

 for(const card of allCards){
  toggle(card,false);
  const button=card.querySelector('.card-toggle');
  card.querySelector('.card-close').addEventListener('click',()=>{toggle(card,false);button.focus({preventScroll:true})},{signal});
  button.addEventListener('click',()=>{const open=!card.classList.contains('selected');closeOthers(card);toggle(card,open)},{signal});
  card.addEventListener('keydown',e=>{if(e.key==='Escape'&&card.classList.contains('selected')){toggle(card,false);button.focus()}},{signal});
  card.addEventListener('pointerenter',e=>{
   if(e.pointerType==='mouse'&&card.classList.contains('is-ready')&&card.classList.contains('is-settled')){closeOthers(card);toggle(card,true)}
  },{signal});
  card.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!card.contains(document.activeElement))toggle(card,false)},{signal});
  card.addEventListener('focusout',e=>{if(!card.contains(e.relatedTarget))toggle(card,false)},{signal});
 }
 onScroll(render,signal);
 function anchor(hash){
  const card=allCards.find(c=>'#'+c.id===hash);if(!card)return;
  const g=groups.find(group=>group.cards.includes(card));
  if(state.flow)card.scrollIntoView({block:'center'});
  else scrollTo(0,g.track.offsetTop+.72*(g.track.offsetHeight-g.stage.clientHeight));
  // O scroll ancora no próximo quadro; abrir antes disso marcava o card como
  // inert (ainda em p=0) e o foco caía no body, fechando o detalhe na hora.
  requestAnimationFrame(()=>{
   if(signal.aborted)return;
   render();gate(card,true);closeOthers(card);toggle(card,true);card.querySelector('.card-toggle').focus({preventScroll:true});
  });
 }
 return {state:()=>state,render,anchor};
}
