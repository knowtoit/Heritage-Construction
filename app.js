const menu=document.querySelector('.menu'),nav=document.querySelector('.nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close ✕':'Menu ☰'});
nav?.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu ☰'}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu ☰';menu.focus()}});
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});button.classList.add('active');button.setAttribute('aria-pressed','true');document.querySelectorAll('.project').forEach(p=>p.hidden=button.dataset.filter!=='all'&&p.dataset.category!==button.dataset.filter)}));
document.querySelector('.form')?.addEventListener('submit',e=>{e.preventDefault();document.querySelector('.form-status').textContent='Preview only — your enquiry has not been sent. We’ll connect this form to Heritage’s confirmed email before launch.'});

const header=document.querySelector('.header');
const draftBanner=document.querySelector('.draft');
function updateHeader(){
  const bannerHeight=draftBanner?.offsetHeight||0;
  header?.style.setProperty('--header-offset',`${Math.max(0,bannerHeight-window.scrollY)}px`);
  header?.classList.toggle('scrolled',window.scrollY>40);
}
window.addEventListener('scroll',updateHeader,{passive:true});
window.addEventListener('resize',updateHeader);
window.addEventListener('pageshow',updateHeader);
updateHeader();

// Gentle section navigation, including links arriving from other pages.
let sectionScrollFrame;
function stopSectionScroll(){cancelAnimationFrame(sectionScrollFrame)}
function scrollToSection(target){
  stopSectionScroll();
  const start=window.scrollY;
  const offset=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;
  const end=Math.max(0,Math.min(target.getBoundingClientRect().top+start-offset,document.documentElement.scrollHeight-innerHeight));
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){window.scrollTo({top:end,behavior:'instant'});return}
  const duration=1300;
  const started=performance.now();
  function step(now){
    const progress=Math.min((now-started)/duration,1);
    const eased=progress<.5?4*progress**3:1-((-2*progress+2)**3)/2;
    window.scrollTo({top:start+(end-start)*eased,behavior:'instant'});
    if(progress<1)sectionScrollFrame=requestAnimationFrame(step);
  }
  sectionScrollFrame=requestAnimationFrame(step);
}
function isSamePage(url){return url.origin===location.origin&&url.pathname.replace(/index\.html$/,'')===location.pathname.replace(/index\.html$/,'')}
function sectionTarget(hash){try{return document.getElementById(decodeURIComponent(hash.slice(1)))}catch{return null}}
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const url=new URL(link.href,location.href);
  if(!isSamePage(url)||!url.hash||link.classList.contains('skip'))return;
  const target=sectionTarget(url.hash);
  if(!target)return;
  event.preventDefault();
  history.pushState(null,'',url.hash);
  scrollToSection(target);
 });
window.addEventListener('wheel',stopSectionScroll,{passive:true});
window.addEventListener('touchstart',stopSectionScroll,{passive:true});
window.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End','Escape',' '].includes(event.key))stopSectionScroll()});
