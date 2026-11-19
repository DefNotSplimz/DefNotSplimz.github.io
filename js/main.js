(() => {
'use strict';
document.documentElement.classList.add('js-ready');
const nav = document.querySelector('#siteNav');
const toggle = document.querySelector('#menuToggle');
const copyButton = document.querySelector('#copyEmail');
const email = 'datumprototyping@gmail.com';
const links = [...(nav?.querySelectorAll('a[href^="#"]') || [])];
const sections = [...document.querySelectorAll('main > section[id]')];
const progressBar = document.querySelector('#scrollMeter');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');

function setMenu(open) {
 if (!nav || !toggle) return;
 nav.classList.toggle('open', open);
 toggle.setAttribute('aria-expanded', String(open));
 toggle.setAttribute('aria-label', open ? 'Luk menu' : 'Åbn menu');
 toggle.textContent = open ? 'LUK ✕' : 'MENU ☰';
}
if (nav && toggle) {
 toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
 for (const link of links) link.addEventListener('click', () => setMenu(false));
 document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); } });
 document.addEventListener('click', event => { if (nav.classList.contains('open') && !nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false); });
 window.addEventListener('resize', () => { if (window.innerWidth > 950) setMenu(false); }, {passive:true});
}

const liveStatus = document.querySelector('#copyStatus');
async function copyAddress() {
 if (!copyButton) return;
 let success = false;
 try {
   if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(email); success=true; }
 } catch(_) { /* use local fallback */ }
 if (!success) {
   const field = document.createElement('textarea');
   field.value=email; field.setAttribute('readonly','');
   field.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';
   document.body.appendChild(field); field.focus(); field.select();
   try { success = document.execCommand('copy'); } catch(_) {}
   field.remove();
 }
 if (success) {
   copyButton.textContent='MAILADRESSE KOPIERET';
   if (liveStatus) liveStatus.textContent='Mailadressen er kopieret.';
 } else {
   copyButton.textContent='MARKÉR MAILADRESSEN';
   if (liveStatus) liveStatus.textContent='Kunne ikke kopiere automatisk. Markér adressen ved siden af knappen.';
 }
 window.setTimeout(() => { copyButton.textContent='KOPIÉR MAILADRESSE'; },2200);
}
copyButton?.addEventListener('click',copyAddress);

let scheduled=false;
function updateOnScroll() {
 scheduled=false;
 const limit=document.documentElement.scrollHeight-window.innerHeight;
 if (progressBar) progressBar.style.transform=`scaleX(${limit>0?Math.min(1,Math.max(0,window.scrollY/limit)):0})`;
 const line=window.scrollY+Math.min(window.innerHeight*.35,260);
 let active=sections[0]?.id;
 for (const section of sections) if (section.offsetTop <= line) active=section.id;
 for (const link of links) {
   const selected=link.getAttribute('href')==='#'+active;
   link.classList.toggle('active',selected);
   if(selected) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
 }
 const hero=document.querySelector('.hero-photo');
 if (hero) hero.style.transform=reduceMotion.matches?'none':
   window.scrollY<window.innerHeight*1.5 ? `translate3d(0,${Math.min(45,window.scrollY*.055)}px,0) scale(1.025)` : 'none';
}
function scheduleScrollUpdate() { if (!scheduled) {scheduled=true;window.requestAnimationFrame(updateOnScroll);} }
window.addEventListener('scroll',scheduleScrollUpdate,{passive:true});
window.addEventListener('resize',scheduleScrollUpdate,{passive:true});
updateOnScroll();
if (finePointer.matches && !reduceMotion.matches) {
 for (const card of document.querySelectorAll('.material-card,.step,.about-value')) {
   card.classList.add('has-local-light');
   card.addEventListener('pointermove', e => {
     const rect=card.getBoundingClientRect();
     card.style.setProperty('--spot-x',`${((e.clientX-rect.left)/rect.width*100).toFixed(1)}%`);
     card.style.setProperty('--spot-y',`${((e.clientY-rect.top)/rect.height*100).toFixed(1)}%`);
   },{passive:true});
 }
}
})();
