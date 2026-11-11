/**
 * ÉLAN / T00 / prova B.
 * Coreografia adaptada de C09–24, Codrops, SlideshowAnimations (MIT).
 * Fonte auditada: NPE Motion Library / .demos-dist/demos/slideshow-animations/js/demo24/slideshow.js
 * Mantidos: ZOOM=.6, GAP=6, camera.zoom/pan, place(), easings e intervalos da timeline original.
 * Adaptação: ScrollTrigger pin + scrub reversível e copy com pausa de leitura; sem Observer global.
 */
(() => {
  const {gsap,ScrollTrigger}=window;
  if(!gsap||!ScrollTrigger){console.error('GSAP or ScrollTrigger missing');return;}
  gsap.registerPlugin(ScrollTrigger);
  const scene=document.querySelector('#sceneB'),stage=scene.querySelector('.camera-stage');
  const current=scene.querySelector('#cameraSlideFirst');
  const upcoming=scene.querySelector('#cameraSlideSecond');
  const currentInner=current.querySelector('img'),upcomingInner=upcoming.querySelector('img');
  const firstCopy=scene.querySelector('#filmFirst'),secondCopy=scene.querySelector('#filmSecond');
  const progress=scene.querySelector('#filmProgress');
  const ZOOM=.6,GAP=6,spacing=100+GAP;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let timeline,cam;
  function place(){
    [[current,currentInner,0],[upcoming,upcomingInner,spacing]].forEach(([slide,inner,at])=>{
      const x=(at-cam.pan)*cam.zoom;
      gsap.set(slide,{xPercent:x,scale:cam.zoom});
      gsap.set(inner,{xPercent:-x*.1,scale:1+(1-cam.zoom)*.6});
    });
  }
  function build(){
    ScrollTrigger.getAll().forEach(x=>{if(x.vars.id==='elan-cinema-b')x.kill()});
    if(timeline){timeline.kill();timeline=null;}
    gsap.set([current,upcoming,currentInner,upcomingInner,firstCopy,secondCopy,progress],{clearProps:'all'});
    cam={zoom:1,pan:0};
    if(motion.matches){
      gsap.set(current,{xPercent:-106});
      gsap.set(upcoming,{xPercent:0,scale:1});
      gsap.set(firstCopy,{autoAlpha:0});
      gsap.set(secondCopy,{autoAlpha:1,y:0});
      gsap.set(progress,{scaleX:1});
      return;
    }
    place();
    gsap.set(firstCopy,{autoAlpha:1,y:0});
    gsap.set(secondCopy,{autoAlpha:0,y:29});
    timeline=gsap.timeline({
      onUpdate:()=>{
        place();
        gsap.set(progress,{scaleX:timeline.progress()});
      },
      scrollTrigger:{
        id:'elan-cinema-b',
        trigger:scene,
        start:'top top',
        end:()=>'+='+Math.round(window.innerHeight*2.5),
        pin:stage,
        scrub:true,
        anticipatePin:1,
        invalidateOnRefresh:true
      }
    });
    timeline.addLabel('start',0)
      .to(cam,{duration:.8,ease:'power3.inOut',zoom:ZOOM},'start')
      .to(cam,{duration:1.1,ease:'power3.inOut',pan:spacing},'start+=0.35')
      .to(cam,{duration:.8,ease:'power3.inOut',zoom:1},'start+=1.05')
      .to(firstCopy,{autoAlpha:0,y:-28,duration:.35,ease:'power2.inOut'},'start+=0.15')
      .fromTo(secondCopy,{autoAlpha:0,y:29},
        {autoAlpha:1,y:0,duration:.42,ease:'power2.out'},'start+=1.48')
      .to({hold:0},{hold:1,duration:.78,ease:'none'},'start+=1.9');
    place();
    ScrollTrigger.refresh();
  }
  let resizeTimer;
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(build,150)},{passive:true});
  motion.addEventListener('change',build);
  build();
})();