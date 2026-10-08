(()=>{
  const header=document.querySelector('[data-header]');
  const onScroll=()=>header?.classList.toggle('is-scrolled',window.scrollY>20);
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
  // app.js also binds the menu; keep this listener only for +/− icon state.
  menu?.addEventListener('click',()=>{setTimeout(()=>{const open=menu.getAttribute('aria-expanded')==='true';const icon=menu.querySelector('span');if(icon)icon.textContent=open?'−':'+'},0)});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{const icon=menu?.querySelector('span');if(icon)icon.textContent='+'}));
  document.querySelectorAll('.section,.capability-strip article').forEach(el=>el.setAttribute('data-reveal',''));
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
})();
