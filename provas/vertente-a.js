/**
 * ÉLAN / T00 / prova A.
 * Coreografia adaptada de C09–23, Codrops, SlideshowAnimations (MIT).
 * Fonte auditada: NPE Motion Library / .demos-dist/demos/slideshow-animations/js/demo23/slideshow.js
 * Port: sequência e easings do original, transformada em timeline GSAP scrub reversível.
 * Não importa fotografia, tipografia, navegação ou Observer do autor.
 */
(() => {
  const {gsap,ScrollTrigger}=window;
  if(!gsap||!ScrollTrigger){console.error('GSAP or ScrollTrigger missing');return;}
  gsap.registerPlugin(ScrollTrigger);
  const scene=document.querySelector('#sceneA');
  const stage=scene.querySelector('.pinned-canvas');
  const reveal=scene.querySelector('#revealPhoto');
  const incoming=scene.querySelector('.reveal-photo__img');
  const current=scene.querySelector('#openingType');
  const copy=scene.querySelector('#settledCopy');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const band=(top,bottom,lean)=>'polygon(0% '+(top+lean)+'%,100% '+(top-lean)+'%,100% '+(bottom-lean)+'%,0% '+(bottom+lean)+'%)';
  let timeline;
  function build(){
    ScrollTrigger.getAll().forEach(x=>{if(x.vars.id==='elan-reveal-a')x.kill();});
    if(timeline){timeline.kill();timeline=null;}
    gsap.set([current,copy,incoming,reveal],{clearProps:'all'});
    if(motion.matches){
      gsap.set(current,{autoAlpha:0});
      gsap.set(reveal,{clipPath:'none'});
      gsap.set(incoming,{scale:1,yPercent:0});
      gsap.set(copy,{autoAlpha:1,y:0});
      return;
    }
    gsap.set(reveal,{clipPath:band(50,50,5)});
    gsap.set(incoming,{scale:1.4,yPercent:6});
    gsap.set(copy,{autoAlpha:0,y:35});
    timeline=gsap.timeline({
      scrollTrigger:{
        id:'elan-reveal-a',
        trigger:scene,
        start:'top top',
        end:()=>'+='+Math.round(window.innerHeight*2.35),
        pin:stage,
        anticipatePin:1,
        scrub:true,
        invalidateOnRefresh:true
      }
    });
    timeline.addLabel('start',0)
      .fromTo(reveal,{clipPath:band(50,50,5)},
        {duration:.8,ease:'power3.out',clipPath:band(39,61,0)},'start')
      .to(reveal,{duration:1,ease:'power4.inOut',clipPath:band(0,100,0)},'start+=0.55')
      .fromTo(incoming,{scale:1.4,yPercent:6},
        {duration:1.6,ease:'expo.inOut',scale:1,yPercent:0},'start')
      .fromTo(current,{scale:1,filter:'brightness(100%)'},
        {duration:1.55,ease:'power3.inOut',scale:1.15,filter:'brightness(35%)'},'start')
      .to(current,{autoAlpha:0,duration:.35,ease:'power2.out'},'start+=0.68')
      .fromTo(copy,{autoAlpha:0,y:35},
        {autoAlpha:1,y:0,duration:.54,ease:'power2.out'},'start+=1.25')
      .to({hold:0},{hold:1,duration:.65,ease:'none'},'start+=1.75');
    ScrollTrigger.refresh();
  }
  let resizeTimer;
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(build,150)},{passive:true});
  motion.addEventListener('change',build);
  build();
})();