/* DATUM PROTOTYPING / Privacy page navigation */
(()=>{
 const nav=document.getElementById('nav');
 const menu=document.getElementById('menuButton');
 const progress=document.getElementById('pageProgress');
 if(menu&&nav){
   menu.addEventListener('click',()=>{
     const open=nav.classList.toggle('menu-open');
     menu.setAttribute('aria-expanded',String(open));
     menu.setAttribute('aria-label',open?'Luk menu':'Åbn menu');
     menu.textContent=open?'×':'☰';
   });
   document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Åbn menu');menu.textContent='☰';}));
 }
 let scheduled=false;
 const update=()=>{
  scheduled=false;
  const y=document.documentElement.scrollTop||document.body.scrollTop;
  if(progress)progress.style.width=100*y/Math.max(1,document.documentElement.scrollHeight-window.innerHeight)+'%';
  if(nav)nav.classList.toggle('is-scrolled',y>85);
 };
 window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});
 update();
})();
