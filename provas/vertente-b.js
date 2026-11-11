(() => {
  const {gsap,ScrollTrigger}=window;
  if(!gsap||!ScrollTrigger){document.body.dataset.motionError='libraries';return;}
  gsap.registerPlugin(ScrollTrigger);
  const scene=document.querySelector('#sceneB'),stage=scene.querySelector('.camera-stage');
  const current=scene.querySelector('#cameraSlideFirst'),upcoming=scene.querySelector('#cameraSlideSecond');
  const currentInner=current.querySelector('img'),upcomingInner=upcoming.querySelector('img');
  const firstCopy=scene.querySelector('#filmFirst'),secondCopy=scene.querySelector('#filmSecond');
  const progress=scene.querySelector('#filmProgress');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const SPACING=106;
  let cam,scrollTl,introTl;
  function place(){
    [[current,currentInner,0],[upcoming,upcomingInner,SPACING]].forEach(([slide,img,pos])=>{
      const x=(pos-cam.pan)*cam.zoom;
      gsap.set(slide,{xPercent:x,scale:cam.zoom});
      gsap.set(img,{xPercent:-x*.1,scale:1+(1-cam.zoom)*.6});
    });
  }
  function build(){
    if(scrollTl) scrollTl.scrollTrigger?.kill();
    scrollTl?.kill(); introTl?.kill();
    gsap.set([current,upcoming,currentInner,upcomingInner,firstCopy,secondCopy,progress],{clearProps:'all'});
    cam={zoom:1,pan:0};
    if(reduce.matches){
      gsap.set(current,{xPercent:-106});gsap.set(upcoming,{xPercent:0,scale:1});
      gsap.set(firstCopy,{autoAlpha:0});gsap.set(secondCopy,{autoAlpha:1,y:0});
      gsap.set(progress,{scaleX:1});document.body.dataset.motion='reduced';return;
    }
    document.body.dataset.motion='active';
    place();
    gsap.set(firstCopy,{autoAlpha:0,y:60,filter:'blur(10px)'});
    gsap.set(secondCopy,{autoAlpha:0,y:32});
    introTl=gsap.timeline().to(firstCopy,{autoAlpha:1,y:0,filter:'blur(0px)',duration:1.55,ease:'power3.out'},.18);
    scrollTl=gsap.timeline({
      onUpdate:()=>{place();gsap.set(progress,{scaleX:scrollTl.progress()});},
      scrollTrigger:{id:'elan-cinema-b',trigger:scene,start:'top top',end:()=>'+='+Math.round(innerHeight*1.7),
        pin:stage,scrub:.35,anticipatePin:1,invalidateOnRefresh:true,
        onUpdate:self=>document.body.style.setProperty('--motion-progress',String(self.progress))}
    });
    scrollTl.to(cam,{zoom:.6,duration:.85,ease:'power3.inOut'},0)
      .to(cam,{pan:SPACING,duration:1.14,ease:'power3.inOut'},.35)
      .to(cam,{zoom:1,duration:.85,ease:'power3.inOut'},1.05)
      .to(firstCopy,{autoAlpha:0,y:-32,duration:.42,ease:'power2.inOut'},.23)
      .to(secondCopy,{autoAlpha:1,y:0,duration:.52,ease:'power3.out'},1.48)
      .to({hold:0},{hold:1,duration:.32},2.02);
    place();ScrollTrigger.refresh();
  }
  let t;
  addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(build,250)},{passive:true});
  reduce.addEventListener('change',build);
  build();
})();