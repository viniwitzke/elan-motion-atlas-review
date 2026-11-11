export function mountHistory(rootPage,fullStory,signal){
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
const portion=(v,a,b)=>smooth((v-a)/(b-a));
const $=id=>rootPage.querySelector(`#${id}`);
const journey=$('journey'),opening=$('opening'),photo=$('photo'),photoScenesEl=$('photoScenes'),coverWord=$('coverWord'),storyCard=$('storyCard'),chaptersEl=$('chapters'),today=$('today'),prog=$('progress'),progFill=$('progressFill'),counter=$('stageCounter'),stageHeader=$('stageHeader');
const mediaReduce=matchMedia('(prefers-reduced-motion: reduce)');
let story=structuredClone(fullStory),articles=[],photoRuns=[],units=0, chapterUnit=1.20, anchor=.85, ending=1.45, running=false,lastState={unit:0},presentEl=null;
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function storySanitize(obj){
 if(!obj||typeof obj!=='object'||!Array.isArray(obj.milestones))throw Error('Inclua milestones como uma lista.');
 if(obj.milestones.length<1||obj.milestones.length>30)throw Error('Use entre 1 e 30 acontecimentos reais. Sem cronologia, use a proposta editorial separada.');
 const normalizeImage=(value,label)=>{if(value==null||value==='')return null;const src=String(value);if(!/^assets\/[\w.-]+\.(?:jpg|jpeg|png|webp)$/i.test(src))throw Error(label+' deve apontar para um arquivo local em assets/.');return src;};
 const milestones=obj.milestones.map((m,i)=>{if(!m.date||!m.title||!m.text)throw Error(`O marco ${i+1} precisa de data, título e texto.`);return{date:String(m.date).slice(0,30),title:String(m.title).slice(0,130),text:String(m.text).slice(0,900),image:normalizeImage(m.image,`Imagem do marco ${i+1}`),imageAlt:String(m.imageAlt||'Fotografia fornecida para ilustrar este capítulo; não necessariamente histórica').slice(0,180)}});
 // A imagem inicial DEVE ser a mesma que entra no primeiro marco, sem corte artificial.
 const photo=normalizeImage(milestones[0]?.image||obj.coverImage||'assets/pavilion.jpg','Imagem inicial');
 const presentImage=String(obj.presentImage||'assets/people.jpg');
 if(!/^assets\/[\w.-]+\.(?:jpg|jpeg|png|webp)$/i.test(photo)||!/^assets\/[\w.-]+\.(?:jpg|jpeg|png|webp)$/i.test(presentImage))throw Error('As fotografias devem estar em assets/nome-do-arquivo.jpg (ou png/webp).');
 return{clientName:String(obj.clientName||'Cliente'),intro:String(obj.intro||'Nossa História'),origin:String(obj.origin||'Aqui tudo começa.'),today:String(obj.today||'A história continua.'),present:String(obj.present||'Conheça o presente da empresa.'),coverImage:photo,presentImage,photoNote:String(obj.photoNote||'Fotografia fornecida pelo cliente; não necessariamente histórica.').slice(0,170),milestones};
}
function renderStory(data){
 story=storySanitize(data); const n=story.milestones.length;
 units=anchor+n*chapterUnit+ending;
 journey.style.setProperty('--journey-height',`calc(${units+1} * 100svh)`);
 $('storyIdentity').textContent=story.clientName; $('openingPhrase').textContent=story.intro; $('originPhrase').textContent=story.origin;
 $('todayCaption').textContent=story.today; $('presentText').textContent=story.present;
 // A timeline não depende de uma quantidade fixa de fotos. Se um marco não tiver imagem,
 // a última fotografia permitida continua visível, sem fabricar um registro de época.
 photoRuns=[];
 let effective=story.coverImage;
 story.milestones.forEach((m,i)=>{
   effective=m.image||effective;
   if(i===0||effective!==photoRuns[photoRuns.length-1].src){
     photoRuns.push({start:i,src:effective,alt:m.imageAlt});
   }
 });
 photoScenesEl.innerHTML=photoRuns.map((run,i)=>`<div class="photo__scene" data-run="${i}"><img src="${run.src}" alt="${escapeHTML(run.alt)}" loading="eager" decoding="async"></div>`).join('');
 photoRuns.forEach((run,i)=>{run.el=photoScenesEl.children[i];run.img=run.el.querySelector('img');});
 // O presente é a última fotografia da mesma cena; entra sobre o último capítulo,
 // sem criar uma seção genérica depois da timeline.
 if(!presentEl){presentEl=document.createElement('div');presentEl.className='photo__scene present-scene';photo.append(presentEl)}
 presentEl.innerHTML=`<img src="${story.presentImage}" alt="${escapeHTML(story.photoNote)}" loading="eager" decoding="async">`;
 presentEl.style.opacity='0';

 rootPage.querySelector('.stage__disclaimer').textContent=story.photoNote;

 $('linearStory').innerHTML='<div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase">Nossa História — Percurso cronológico</div><h2>'+escapeHTML(story.origin)+'</h2>'+story.milestones.map(m=>'<article><strong>'+escapeHTML(m.date)+'</strong><h3>'+escapeHTML(m.title)+'</h3><p>'+escapeHTML(m.text)+'</p></article>').join('')+'<article><strong>Presente</strong><p>'+escapeHTML(story.today)+'</p><p>'+escapeHTML(story.present)+'</p></article>';
 chaptersEl.innerHTML=story.milestones.map((m,i)=>`<article class="chapter" aria-label="${escapeHTML(m.date)} — ${escapeHTML(m.title)}"><div class="chapter__top"><span>TRAJETÓRIA · ${String(i+1).padStart(2,'0')}</span><span>${String(i+1).padStart(2,'0')} / ${String(n).padStart(2,'0')}</span></div><div class="chapter__year">${escapeHTML(m.date)}</div><h3 class="chapter__title">${escapeHTML(m.title)}</h3><p class="chapter__text">${escapeHTML(m.text)}</p><div class="chapter__bottom"><span>PRÓXIMO CAPÍTULO &nbsp; ↓</span><span class="small-circle" aria-hidden="true"></span></div></article>`).join('');
 articles=[...rootPage.querySelectorAll('.chapter')];

 rootPage.querySelectorAll('.lab button').forEach(btn=>{const isShort=(n===3);btn.classList.toggle('active',btn.id===(isShort?'short':'full'));btn.setAttribute('aria-pressed',String(btn.id===(isShort?'short':'full')))});
 refresh();
}
function interpolateFrame(e,start,end,t){e.style.left=lerp(start[0],end[0],t)+'px';e.style.top=lerp(start[1],end[1],t)+'px';e.style.width=lerp(start[2],end[2],t)+'px';e.style.height=lerp(start[3],end[3],t)+'px'}
function update(){
 if(signal.aborted)return;
 if(mediaReduce.matches){rootPage.querySelector('.story-reading').open=true;return}
 const vh=$('stage').clientHeight||innerHeight,vw=innerWidth,mobile=vw<=680,tablet=vw<=850;
 let u=clamp(-journey.getBoundingClientRect().top/vh,0,units);
 if(mediaReduce.matches)u=clamp(u,0,units);
 lastState.unit=u;lastState.milestoneIndex=Math.min(story.milestones.length-1,Math.max(0,Math.floor((u-anchor)/chapterUnit)));lastState.photoRuns=photoRuns.map(r=>({start:r.start,src:r.src}));
 const introImg=mobile?[vw*.06,vh*.47,vw*.88,vh*.42]:[vw*.52,vh*.16,vw*.42,vh*.72];
 const wide=[0,0,vw,vh];
 const dock=mobile?[vw*.06,Math.max(72,vh*.10),vw*.88,vh*.25]:tablet?[vw*.06,vh*.17,vw*.43,vh*.65]:[vw*.065,vh*.145,vw*.43,vh*.71];
 const cardBox=mobile?[vw*.06,vh*.39,vw*.88,vh*.54]:tablet?[vw*.53,vh*.17,vw*.41,vh*.65]:[vw*.53,vh*.145,vw*.41,vh*.71];
 const introToWide=0;
 const wideToDock=portion(u,.08,anchor);
 const scaleCrop=lerp(1.03,1.11,portion(u,.4,1.02));
 const midPhoto=introImg.map((v,i)=>lerp(v,wide[i],introToWide));
 const photoGoal=midPhoto.map((v,i)=>lerp(v,dock[i],wideToDock));
 const exitStart=anchor+story.milestones.length*chapterUnit;
 // Desfecho: a última fotografia cresce até ocupar a cena e o presente entra sobre ela.
 const expansion=portion(u,exitStart+.04,exitStart+.56);
 const frameNow=photoGoal.map((v,i)=>lerp(v,wide[i],expansion));
 interpolateFrame(photo,introImg,frameNow,1);
 // FOTO + ANO + TEXTO: mesma janela de troca de capítulo (.57 → .95 da unidade).
 // Cada foto tem seu próprio quadro dentro do mesmo enquadramento aprovado. Quando o
 // cliente não fornece foto para certo ano, mantemos a última foto sem fingir que é histórica.
 photo.style.opacity='1';
 photoRuns.forEach((run,k)=>{
   const arrival=k===0?1:portion(u,anchor+(run.start-1)*chapterUnit+chapterUnit*.57,anchor+(run.start-1)*chapterUnit+chapterUnit*.95);
   const next=photoRuns[k+1];
   const departure=!next?0:portion(u,anchor+(next.start-1)*chapterUnit+chapterUnit*.57,anchor+(next.start-1)*chapterUnit+chapterUnit*.95);
   const x=(k===0?0:(1-arrival)*100)-departure*100;
   run.el.style.transform=`translate3d(${x.toFixed(3)}%,0,0)`;
   run.el.style.visibility=(x<=-100.01||x>=100.01)?'hidden':'visible';
   run.el.setAttribute('aria-hidden',String(Math.abs(x)>=50));
   const drift=lerp(-8,8,portion(u,anchor+run.start*chapterUnit,anchor+(next?.start??story.milestones.length)*chapterUnit));
   run.img.style.transform=`translate3d(${drift.toFixed(2)}px,0,0) scale(${scaleCrop.toFixed(3)})`;
 });
 opening.style.opacity=String(1-portion(u,.16,.79));
 opening.setAttribute('aria-hidden',String(u>.79));
 opening.style.transform=`translate3d(${(-vw*.025*portion(u,.08,.85)).toFixed(1)}px,${(-vh*.06*portion(u,.09,.88)).toFixed(1)}px,0)`;
 const fullHold=portion(u,1.00,1.17)*(1-portion(u,1.25,1.64));
 coverWord.style.opacity=String(fullHold);
 coverWord.style.transform=`translateY(${lerp(42,0,portion(u,1.00,1.18))}px)`;
 const revealCard=portion(u,.40,anchor);
 interpolateFrame(storyCard,cardBox,cardBox,1);
 const cardRetract=1-portion(u,exitStart+.01,exitStart+.19);
 storyCard.style.opacity=String(revealCard*cardRetract);
 storyCard.setAttribute('aria-hidden',String(revealCard*cardRetract<.5));
 storyCard.style.pointerEvents=cardRetract>.5?'auto':'none';
 storyCard.style.background='#f4f1e8';
 const chrome=revealCard*(1-portion(u,exitStart+.01,exitStart+.18));
 stageHeader.style.opacity=String(chrome);
 prog.style.opacity=String(chrome);
 counter.style.opacity=String(chrome);
 const count=articles.length;
 let current=0;
 for(let i=0;i<count;i++){
  const pos=u-(anchor+i*chapterUnit);
  // Adjacent chapters slide in a shared physical viewport: the outgoing and
  // incoming panels always touch. This avoids empty space and survives reverse scroll.
  const prevPos=u-(anchor+(i-1)*chapterUnit);
  const incoming=i===0?1:portion(prevPos,chapterUnit*.57,chapterUnit*.95);
  const out=i===count-1?0:portion(pos,chapterUnit*.57,chapterUnit*.95);
  const x=(i===0?0:(1-incoming)*100)-out*100;
  const y=-Math.sin(Math.PI*out)*8;
  const depart=i===count-1?1-portion(u,exitStart+.01,exitStart+.34):1;
  const art=articles[i];art.style.opacity=String(depart);
  const date=art.querySelector('.chapter__year');
  date.style.fontSize=story.milestones[i].date.length>5?Math.min(vw*(mobile?.23:.108),art.clientWidth/(story.milestones[i].date.length*.68))+'px':'';
  art.style.transform=`translate3d(${x.toFixed(2)}%,${y.toFixed(2)}px,0)`;
  art.style.visibility=Math.abs(x)>=100?'hidden':'visible';art.setAttribute('aria-hidden',String(Math.abs(x)>=50||depart<.3));
  if(x>-50&&x<50&&depart>.3)current=i;
 }
 const presentReveal=portion(u,exitStart+.42,exitStart+.94);
 const message=portion(u,exitStart+.76,exitStart+1.22);
 if(presentEl){
  presentEl.style.opacity=String(presentReveal);
  presentEl.style.transform=`scale(${lerp(1.045,1,presentReveal).toFixed(3)})`;
  presentEl.setAttribute('aria-hidden',String(presentReveal<.5));
 }
 today.style.opacity=String(message);
 today.setAttribute('aria-hidden',String(message<.5));
 today.style.clipPath='none';
 today.style.transform=`translateY(${lerp(30,0,message).toFixed(1)}px)`;
 today.style.pointerEvents=message>.5?'auto':'none';
 const narrativeProgress=clamp((u-anchor)/(Math.max(.01,count*chapterUnit)));
 progFill.style.width=`${(narrativeProgress*100).toFixed(1)}%`;
 counter.textContent=`${String(u>exitStart-.3?count:current+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
}
function refresh(){if(running)return;running=true;requestAnimationFrame(()=>{update();running=false})}
mediaReduce.addEventListener('change',refresh,{signal});
addEventListener('scroll',refresh,{passive:true,signal});addEventListener('resize',refresh,{signal});

renderStory(fullStory);return {load:renderStory,render:update,get:()=>structuredClone(story),progress:()=>({...lastState,units,anchor,chapterUnit})};
}

export function mountHistoryEditorial(rootPage,story,signal){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const sections=[...rootPage.querySelectorAll('.he-reveal')];
 if(reduce.matches||!('IntersectionObserver'in window)){sections.forEach(s=>s.classList.add('is-in'));return {get:()=>structuredClone(story),state:()=>({mode:'editorial'})}}
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-in');observer.unobserve(entry.target)}
 },{rootMargin:'0px 0px -12% 0px'});
 sections.forEach(section=>observer.observe(section));
 requestAnimationFrame(()=>sections[0]?.classList.add('is-in'));
 addEventListener('pagehide',()=>observer.disconnect(),{signal});
 return {get:()=>structuredClone(story),state:()=>({mode:'editorial'})};
}
