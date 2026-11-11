import './client.js';
import {cfg,validate} from './content.js';
import {mountHome} from './home.js';
import {mountHistory,mountHistoryEditorial} from './history.js';
import {mountTreatments} from './treatments.js';
validate(cfg);
for(const [key,value] of Object.entries(cfg.identity))document.documentElement.style.setProperty('--'+key,value);
if(cfg.fontFile){const face=new FontFace('Client',`url(${cfg.fontFile})`);face.load().then(f=>{document.fonts.add(f);document.documentElement.style.setProperty('--serif','Client, Georgia, serif')}).catch(()=>{})}
let controller,busy=false,seenHome=false,pendingHistory=null;
try{seenHome=sessionStorage.getItem('elan-intro')==='1'}catch{}
const menu=document.querySelector('#menuToggle'),nav=document.querySelector('.site-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.focus()}});
// Contraste da navegação fixa: sobre o papel do rodapé e da coluna H12 o branco desaparecia.
const navBar=document.querySelector('.site-nav'),navBrand=document.querySelector('.nav-brand'),navLinks=document.querySelector('#mainLinks');
// A cor da navegação fixa segue o que está de fato pintado sob cada zona dela: papel
// (H12, diferenciais, rodapé) pede verde, fotografia e superfície escura pedem branco.
// A leitura é de empilhamento (hit-test), não de geometria: o rodapé fica atrás da
// superfície da rota e não pode inverter a barra antes de aparecer de verdade.
const PAPER='.filosofia,.elementis-panel,.site-footer,.linear-story,.he-opening,.he-identity';
const MEDIA='.imagebox,.story-card,.media,.panel-bg,.elementis-photo,.elementis-background,.image-band,.he-present,.he-cover';
function paperAt(x,y){  // O bloco de diferenciais é revelado por máscara e as faixas escondidas não respondem
  // ao teste de empilhamento: quem sabe a revelação é o próprio movimento (home.js).
  if(document.body.dataset.diffOpen==='1')return true;
 for(const el of document.elementsFromPoint(x,y)){
  if(el===document.documentElement||el===document.body||navBar.contains(el))continue;
  return !!el.closest(PAPER)&&!el.closest(MEDIA);
 }
 return false;
}
const midX=el=>{const r=el.getBoundingClientRect();return r.left+r.width/2};
const narrow=()=>matchMedia('(max-width:680px)').matches;
function syncNav(){
 if(!navBar)return;
 const compact=narrow();
 // No mobile a barra cruza fotografia e papel em poucos pixels: em vez de adivinhar a
 // superfície sob cada palavra, a barra rolada ganha fundo próprio e texto branco fixo.
 navBar.classList.toggle('is-scrolled',scrollY>8);
 if(compact){navBrand?.classList.remove('on-light');navLinks?.classList.remove('on-light');menu.classList.remove('on-light');navBar.classList.remove('on-light');return}
 const y=navBar.offsetHeight*.55;
 const brandLight=navBrand?paperAt(midX(navBrand),y):false;
 const menuLight=menu.offsetParent?paperAt(midX(menu),y):brandLight;
 const linksLight=navLinks&&getComputedStyle(navLinks).display!=='none'?paperAt(midX(navLinks),y):menuLight;
 navBrand?.classList.toggle('on-light',brandLight);
 navLinks?.classList.toggle('on-light',linksLight);
 menu.classList.toggle('on-light',menuLight);
 navBar.classList.toggle('on-light',brandLight&&linksLight);
}
let navFrame=0,navLast=0,navTimer=0,navSettle=0;
// Leitura de estilos no scroll: no máximo uma vez a cada 120 ms, mas sempre com uma
// última passada depois que a rolagem assenta — senão um salto único ficava com a cor velha.
const queueNav=()=>{
 // As máscaras e o painel H12 só ficam no lugar definitivo no último quadro da rolagem;
 // a passada de acomodação é quem corrige a cor quando o scroll para sobre papel.
 clearTimeout(navSettle);navSettle=setTimeout(syncNav,240);
 if(navFrame||navTimer)return;
 navFrame=requestAnimationFrame(()=>{
  navFrame=0;
  // A leitura sai depois do quadro que aplica as máscaras, não antes dele.
  const wait=Math.max(0,120-(performance.now()-navLast))+16;
  navTimer=setTimeout(()=>{navTimer=0;navLast=performance.now();syncNav()},wait);
 });
};
addEventListener('scroll',queueNav,{passive:true});addEventListener('resize',queueNav);
async function mount(){
 controller?.abort();controller=new AbortController();const {signal}=controller,page=document.querySelector('main');
 const route=page.dataset.page;document.body.dataset.activeRoute=route;document.body.dataset.diffOpen='0';
 const paths={home:'index.html',treatments:'tratamentos.html',history:'nossa-historia.html'};
 document.querySelectorAll('#mainLinks a').forEach(a=>{if(a.getAttribute('href')===paths[route])a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 const component=route==='home'?mountHome(page,cfg,signal,seenHome):route==='history'?(cfg.historia.mode==='editorial'?mountHistoryEditorial(page,cfg.historia,signal):mountHistory(page,cfg.historia,signal)):mountTreatments(page,cfg,signal);
 if(route==='home'&&cfg.logo){const logo=page.querySelector('.logo');logo.textContent='';const image=document.createElement('img');image.src=cfg.logo;image.alt=cfg.marca;image.className='logo-image';logo.append(image)}
 page.style.setProperty('--paper',cfg.identity.paper);page.style.setProperty('--forest',cfg.identity.forest);page.style.setProperty('--gold',cfg.identity.gold);
 if(cfg.fontFile)page.style.setProperty('--serif','Client, Georgia, serif');
 if(route==='home'){seenHome=true;try{sessionStorage.setItem('elan-intro','1')}catch{}}
 for(const a of page.querySelectorAll('[data-whatsapp]')){
  if(cfg.whatsapp.numero){const url=new URL(`https://wa.me/${cfg.whatsapp.numero}`);url.searchParams.set('text',cfg.whatsapp.mensagem);a.href=url.href;a.target='_blank';a.rel='noopener'}
  else a.addEventListener('click',e=>{e.preventDefault();const status=page.querySelector('#contact-status');status.textContent='Contato do cliente ainda não configurado.';status.scrollIntoView({block:'center',behavior:'instant'})},{signal});
 }
 for(const image of page.querySelectorAll('img'))image.addEventListener('error',()=>{if(!image.dataset.fallback){image.dataset.fallback='1';image.src=cfg.hero.poster;image.alt='Imagem alternativa de apresentação'}},{signal});
 if(route==='treatments'&&location.hash)component.anchor(location.hash);
 syncNav();requestAnimationFrame(syncNav);
 window.ELAN={route,component,config:cfg,navigate,busy:()=>busy};
 if(new URLSearchParams(location.search).has('qa')){let overlay=document.querySelector('.qa-overlay');if(!overlay){overlay=document.createElement('output');overlay.className='qa-overlay';document.body.append(overlay)}const update=()=>overlay.textContent=`${route} · scrollY=${Math.round(scrollY)} · ${JSON.stringify(component.state?.()||component.progress?.())}`;addEventListener('scroll',update,{passive:true,signal});update()}
}
const allowed=new Set(['index.html','tratamentos.html','nossa-historia.html']);
async function navigate(url,mode='push'){
 url=new URL(url,location.href);if(busy){pendingHistory={url,mode};return}
 if(mode==='push'&&url.pathname===location.pathname){if(url.hash&&window.ELAN.route==='treatments')window.ELAN.component.anchor(url.hash);return}
 busy=true;let overlay;
 try{
  const response=await fetch(url);if(!response.ok)throw Error('Rota indisponível');const doc=new DOMParser().parseFromString(await response.text(),'text/html'),next=doc.querySelector('main');if(!next)throw Error('Rota sem conteúdo');
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
   overlay=document.createElement('div');overlay.className='route-preview';overlay.setAttribute('aria-hidden','true');
   const image=document.createElement('img');image.src=next.dataset.page==='home'?cfg.hero.poster:next.dataset.page==='history'?cfg.historia.coverImage:cfg.tratamentos.find(t=>t.image)?.image||cfg.hero.poster;image.style.cssText='width:100%;height:100%;object-fit:cover';overlay.append(image);document.body.append(overlay);
   nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');
   await image.decode().catch(()=>{});
   // N1 V5 / prova 02: original photographic wipe keyframes, duration and easing.
   await overlay.animate([{clipPath:'inset(0 100% 0 0)',transform:'translateX(2.5%)'},{clipPath:'inset(0 0 0 0)',transform:'translateX(0%)'}],{duration:1150,easing:'cubic-bezier(.76,0,.19,1)',fill:'forwards'}).finished;
  }
  controller?.abort();document.querySelector('main').replaceWith(next);document.title=doc.title;document.querySelector('meta[name="description"]').content=doc.querySelector('meta[name="description"]').content;
  document.querySelector('link[rel="canonical"]')?.remove();const canonical=doc.querySelector('link[rel="canonical"]');if(canonical)document.head.append(canonical);
  if(mode==='push')history.pushState({},'',url);scrollTo({top:0,behavior:'instant'});nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');await mount();next.focus({preventScroll:true});
  if(overlay){
   // A chegada só é revelada depois de montar a rota; a foto não desaparece num corte.
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   await overlay.animate([{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 0 100%)'}],{duration:650,easing:'cubic-bezier(.76,0,.19,1)',fill:'forwards'}).finished;
  }
 }catch(error){console.error(error);location.assign(url.href)}finally{overlay?.remove();busy=false;if(pendingHistory){const pending=pendingHistory;pendingHistory=null;navigate(pending.url,pending.mode)}}
}
document.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;const a=e.target.closest('a[data-npe-link]');if(!a)return;const url=new URL(a.href);if(url.origin!==location.origin||!allowed.has(url.pathname.split('/').pop()))return;e.preventDefault();navigate(url)});
addEventListener('popstate',()=>navigate(location.href,'none'));
history.scrollRestoration='manual';mount();
