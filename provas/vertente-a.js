(() => {
  const {gsap, ScrollTrigger} = window;
  if (!gsap || !ScrollTrigger) { document.body.dataset.motionError='libraries'; return; }
  gsap.registerPlugin(ScrollTrigger);
  const scene=document.querySelector('#sceneA'), stage=scene.querySelector('.pinned-canvas');
  const reveal=scene.querySelector('#revealPhoto'), incoming=reveal.querySelector('img');
  const current=scene.querySelector('#openingType'), copy=scene.querySelector('#settledCopy');
  const overline=current.querySelector('.editorial-overline'), heading=current.querySelector('h1'), bottom=current.querySelector('.opening-bottom');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const band=(top,bottom,lean=0)=>'polygon(0% '+(top+lean)+'%,100% '+(top-lean)+'%,100% '+(bottom-lean)+'%,0% '+(bottom+lean)+'%)';
  let scrollTl, introTl;
  function build(){
    if(scrollTl) scrollTl.scrollTrigger?.kill();
    scrollTl?.kill(); introTl?.kill();
    gsap.set([reveal,incoming,current,copy,overline,heading,bottom],{clearProps:'all'});
    if(reduce.matches){
      gsap.set(current,{autoAlpha:0}); gsap.set(reveal,{clipPath:'none'});
      gsap.set(copy,{autoAlpha:1,y:0}); document.body.dataset.motion='reduced'; return;
    }
    document.body.dataset.motion='active';
    gsap.set(reveal,{clipPath:band(50,50,0)});
    gsap.set(incoming,{scale:1.26,yPercent:4});
    gsap.set(copy,{autoAlpha:0,y:38});
    gsap.set(overline,{autoAlpha:0,y:18});
    gsap.set(heading,{autoAlpha:0,y:64,scale:.94,filter:'blur(12px)'});
    gsap.set(bottom,{autoAlpha:0,y:20});
    introTl=gsap.timeline({defaults:{ease:'power3.out'}})
      .to(overline,{autoAlpha:1,y:0,duration:.9},.12)
      .to(heading,{autoAlpha:1,y:0,scale:1,filter:'blur(0px)',duration:1.35},.26)
      .to(bottom,{autoAlpha:1,y:0,duration:.9},.78);
    scrollTl=gsap.timeline({
      scrollTrigger:{id:'elan-reveal-a',trigger:scene,start:'top top',end:()=>'+='+Math.round(innerHeight*1.55),pin:stage,scrub:.35,anticipatePin:1,invalidateOnRefresh:true,
        onUpdate:self=>document.body.style.setProperty('--motion-progress',String(self.progress))}
    });
    scrollTl.to(reveal,{clipPath:band(37,63),duration:.7,ease:'power3.out'},0)
      .to(reveal,{clipPath:band(0,100),duration:1,ease:'power3.inOut'},.48)
      .to(incoming,{scale:1,yPercent:0,duration:1.5,ease:'power3.inOut'},0)
      .to(current,{autoAlpha:0,scale:1.09,duration:.6,ease:'power2.inOut'},.62)
      .to(copy,{autoAlpha:1,y:0,duration:.7,ease:'power3.out'},1.12)
      .to({hold:0},{hold:1,duration:.35},1.8);
    ScrollTrigger.refresh();
  }
  let resizeTimer;
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(build,250)},{passive:true});
  reduce.addEventListener('change',build);
  build();
})();