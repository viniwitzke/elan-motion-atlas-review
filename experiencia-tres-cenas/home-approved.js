export function mountApproved(rootPage,cfg,signal,skipIntro=false) {


  if(!cfg){console.error('Configuração do cliente ausente.');return;}
  const $=s=>rootPage.querySelector(s);
  const root=$('#track'),hero=$('.opening'),phi=$('.filosofia'),controls=$('.hero-controls');
  const image=$('#clientimage'),imageBox=$('.imagebox'),imageVeil=$('.image-veil');
  const copy=$('.copy'),seam=$('#seam'),brand=$('.identity');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=n=>Math.max(0,Math.min(1,n));
  const ease=n=>{const t=clamp(n);return t*t*(3-2*t)};
  const ramp=(p,start,duration)=>ease((p-start)/duration);
  let entered=false, scheduled=false, photoURL=null, playback=null;
  const params=new URLSearchParams(location.search);
  const initialVar=cfg.hero.variant==='b'?'b':'a';
  hero.dataset.variante=initialVar;
  function text(selector,value){const el=$(selector);if(el)el.textContent=value}
  text('.marca-topo',cfg.marca);text('.subtitulo-topo',cfg.subtituloMarca);
  text('.logo',cfg.marca);text('.atelier',cfg.subtituloMarca);
  text('.slogan',cfg.slogan||'');if(!cfg.slogan)hero.dataset.slogan='0';
  const poster=$('.media img');poster.src=cfg.hero.poster;
  if(cfg.hero.video){
    const v=document.createElement('video');Object.assign(v,{autoplay:true,loop:true,muted:true,playsInline:true});
    v.src=cfg.hero.video;v.addEventListener('playing',()=>{poster.style.opacity='0'});v.addEventListener('error',()=>{poster.style.opacity='1'});v.addEventListener('error',()=>v.remove());
    $('.media').insertBefore(v,poster);poster.classList.add('poster');v.play().catch(()=>{});
  }
  const ctaButton=$('.action button');let cta=ctaButton;
  if(/^\d{10,15}$/.test(cfg.whatsapp.numero)){
    const link=document.createElement('a'),url=new URL(`https://wa.me/${cfg.whatsapp.numero}`);
    url.searchParams.set('text',cfg.whatsapp.mensagem);link.href=url.href;link.target='_blank';link.rel='noopener';
    link.className='cta';link.innerHTML=ctaButton.innerHTML;link.setAttribute('aria-describedby','cta-status');
    ctaButton.replaceWith(link);cta=link;
  }else{ctaButton.addEventListener('click',()=>text('#cta-status','WhatsApp ainda não configurado. Nenhuma mensagem foi enviada.'))}
  function setHidden(el,hidden){
    if(el.inert!==hidden){if(hidden&&el.contains(document.activeElement))document.activeElement.blur();el.inert=hidden}
    if(el.getAttribute('aria-hidden')!==String(hidden))el.setAttribute('aria-hidden',String(hidden));
  }
  function alpha(el,a,dy=0){const t=clamp(a);el.style.opacity=t.toFixed(4);el.style.transform=`translate3d(0,${(dy*(1-t)).toFixed(2)}px,0)`}
  function setCase(which){
    const c=cfg.filosofia[which];if(!c)return;rootPage.dataset.case=which;
    image.src=c.image;image.alt=c.alt;image.style.objectPosition=`${c.x}% ${c.y}%`;
    const title=$('#headline');title.replaceChildren();
    for(const line of c.titulo){
      const wrapper=document.createElement('span');wrapper.className='title-row';
      const ink=document.createElement('span');ink.className='title-ink';
      const parts=line.split(/(<em>|<\/em>)/), italic=document.createElement('em');let inEm=false;
      for(const part of parts){
        if(part==='<em>'){inEm=true;continue}
        if(part==='</em>'){inEm=false;continue}
        if(part){if(inEm){italic.append(document.createTextNode(part));if(!ink.contains(italic))ink.append(italic)}else ink.append(document.createTextNode(part))}
      }
      wrapper.append(ink);title.append(wrapper);
    }
    text('#description',c.descricao);
    rootPage.querySelectorAll('.painel-teste button[data-case]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.case===which)));
    render();
  }
  function progress(){const d=$('.stage').clientHeight*(innerWidth<=680?1.55:1.95);return d>0?clamp((scrollY-root.offsetTop)/d):0}
  function render(){
    if(signal.aborted)return;
    scheduled=false;
    if(reduce.matches){
      phi.style.clipPath='none';imageBox.style.clipPath='none';imageBox.style.transform='none';
      image.style.transform='none';brand.style.opacity='1';seam.style.opacity='0';
      copy.style.opacity='1';copy.style.transform='none';
      for(const el of [...phi.querySelectorAll('.title-ink'),$('.eyebrow'),$('.description'),$('.editorial-cta'),$('.editorial-foot')]){el.style.opacity='1';el.style.transform='none'}
      setHidden(hero,false);setHidden(phi,false);setHidden(controls,!entered);return;
    }
    const p=progress();
    // H12 limpa aprovada: exatamente as mesmas janelas do movimento refinado.
    const reveal=ramp(p,.08,.70),left=100*(1-reveal),bottom=Math.min(100,left+10*(1-reveal));
    phi.style.clipPath=`polygon(${left.toFixed(3)}% 0,100% 0,100% 100%,${bottom.toFixed(3)}% 100%)`;
    seam.style.left=`${left.toFixed(3)}%`;seam.style.opacity=String(Math.pow(Math.sin(Math.PI*reveal),.7)*.72||0);
    brand.style.opacity=String(1-ramp(p,.14,.34));
    const photo=ramp(p,.24,.40);
    imageBox.style.clipPath=`inset(0 0 ${(100*(1-photo)).toFixed(3)}% 0)`;
    imageBox.style.transform=`translate3d(0,${((1-photo)*18).toFixed(2)}px,0)`;
    image.style.transform=`scale(${(1.092-.092*photo).toFixed(4)}) translate3d(0,${((1-photo)*1.8).toFixed(2)}%,0)`;
    imageVeil.style.opacity=String((1-ramp(p,.30,.32))*.50);
    copy.style.opacity='1';copy.style.transform='none';
    alpha($('.eyebrow'),ramp(p,.41,.16),14);
    for(const [i,row] of [...phi.querySelectorAll('.title-ink')].entries()){
      const k=ramp(p,.45+i*.065,.23);row.style.transform=`translate3d(0,${((1-k)*116).toFixed(2)}%,0)`;
    }
    alpha($('.description'),ramp(p,.61,.16),15);
    alpha($('.editorial-cta'),ramp(p,.69,.15),16);
    alpha($('.editorial-foot'),ramp(p,.78,.12),10);
    setHidden(controls,!entered||p>.16);setHidden(hero,p>.86);setHidden(phi,p<.16);
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
  const enter=()=>{entered=true;hero.dataset.entered='1';schedule()};
  if(reduce.matches||skipIntro){hero.classList.add("skip-intro");enter()}else{
    let t=setTimeout(enter,2700);signal.addEventListener("abort",()=>clearTimeout(t),{once:true});
    reduce.addEventListener('change',()=>{if(reduce.matches){clearTimeout(t);enter()}schedule()},{signal});
  }
  rootPage.querySelectorAll('.painel-teste button[data-variante]').forEach(button=>button.addEventListener('click',()=>{
    const next=button.dataset.variante,par=new URLSearchParams(location.search);par.set('variante',next);location.search=par.toString();
  }));
  rootPage.querySelectorAll('.painel-teste button[data-case]').forEach(button=>button.addEventListener('click',()=>setCase(button.dataset.case)));
  function stopPlayback(){if(playback){cancelAnimationFrame(playback);playback=null}}
  $('#replay')?.addEventListener('click',()=>{
    if(reduce.matches)return;
    stopPlayback();const duration=5100,start=performance.now(),distance=root.offsetHeight-innerHeight;
    scrollTo({top:root.offsetTop,behavior:'instant'});
    const frame=now=>{const p=ease((now-start)/duration)*.97;scrollTo({top:root.offsetTop+distance*p,behavior:'instant'});if(p<.969)playback=requestAnimationFrame(frame);else playback=null};
    playback=requestAnimationFrame(frame);
  });
  addEventListener('wheel',stopPlayback,{passive:true,signal});addEventListener('touchstart',stopPlayback,{passive:true,signal});
  const uploader=$('#foto-local');uploader?.addEventListener('change',e=>{
    const file=e.target.files?.[0];if(!file?.type.startsWith('image/'))return;
    if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(file);
    image.src=photoURL;image.alt='Fotografia local do usuário';image.style.objectPosition='50% 50%';
    const d=innerHeight*(innerWidth<=680?1.55:1.95);scrollTo({top:root.offsetTop+d*.96,behavior:'instant'});schedule();
  });
  addEventListener('pagehide',()=>{if(photoURL)URL.revokeObjectURL(photoURL)});
  addEventListener('scroll',schedule,{passive:true,signal});addEventListener('resize',schedule,{signal});
  reduce.addEventListener('change',schedule,{signal});
  setCase(Object.hasOwn(cfg.filosofia,cfg.filosofiaTipo)?cfg.filosofiaTipo:'ambiente');render();
  return {progress,render,ready:()=>entered};
}

