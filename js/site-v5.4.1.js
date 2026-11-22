'use strict';
// Every section is readable without JavaScript. JS enhances navigation and feedback only.
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');
(() => {
  const menu = document.getElementById('menuButton');
  const nav = document.getElementById('nav');
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const copy = document.getElementById('copyEmail');
  const copyStatus = document.getElementById('copyStatus');
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  function closeMenu() {
    if (!menu || !nav) return;
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Åbn menu');
    document.body.classList.remove('menu-open');
  }
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const opening = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', opening);
      menu.setAttribute('aria-expanded', String(opening));
      menu.setAttribute('aria-label', opening ? 'Luk menu' : 'Åbn menu');
      document.body.classList.toggle('menu-open', opening);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {if(e.key === 'Escape') closeMenu();});
    document.addEventListener('click', e => {
      if(nav.classList.contains('is-open') && !nav.contains(e.target) && !menu.contains(e.target)) closeMenu();
    });
    window.addEventListener('resize', () => {if(window.innerWidth > 900) closeMenu();}, {passive:true});
  }

  if (copy && copyStatus) copy.addEventListener('click', async () => {
    const email = 'datumprototyping@gmail.com';
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(email);
      else {
        const input = document.createElement('textarea');
        input.value = email;
        input.setAttribute('readonly', '');
        input.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(input);
        input.select();
        const worked = document.execCommand('copy');
        input.remove();
        if (!worked) throw new Error('copy failed');
      }
      copyStatus.textContent = 'Mailadressen er kopieret.';
    } catch {
      copyStatus.textContent = 'Automatisk kopiering er ikke tilgængelig. Markér og kopiér adressen ovenfor.';
    }
  });

  let scheduled = false;
  function update() {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    if(progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / max))})`;
    if(header) header.classList.toggle('is-scrolled', scrollY > 48);
    scheduled = false;
  }
  addEventListener('scroll', () => {if(!scheduled){scheduled = true; requestAnimationFrame(update);}}, {passive:true});
  update();

  // Fit each exact phrase by *measuring its rendered glyphs*, including font fallback and zoom.
  const heading = document.getElementById('hero-title');
  const copyBox = document.querySelector('.hero-copy');
  if (heading && copyBox) {
    const parts = [...heading.children];
    const ranges = parts.map(el => {const r = document.createRange(); r.selectNodeContents(el);return r;});
    function fit() {
      heading.style.removeProperty('font-size');
      let size = parseFloat(getComputedStyle(heading).fontSize);
      const available = Math.max(0, Math.min(copyBox.clientWidth - 4, document.documentElement.clientWidth - 36));
      if (!Number.isFinite(size) || available <= 0) return;
      for(let i=0;i<5;i++) {
        const widest = Math.max(...ranges.map(range => range.getBoundingClientRect().width));
        if (widest <= available) break;
        size = Math.max(18, size * (available / widest) * .985);
        heading.style.fontSize = `${size.toFixed(2)}px`;
      }
    }
    let queued = false;
    const queue = () => {if (!queued) {queued=true;requestAnimationFrame(()=>{queued=false;fit();});}};
    queue();
    addEventListener('resize',queue,{passive:true});
    if(window.visualViewport) visualViewport.addEventListener('resize',queue,{passive:true});
    if('ResizeObserver' in window) {
      let last = -1;
      new ResizeObserver(entries => {
        const w = Math.round(entries[0].contentRect.width);
        if(w!==last){last=w;queue();}
      }).observe(copyBox);
    }
    if(document.fonts?.ready) document.fonts.ready.then(queue);
  }

  // Section-based navigation highlight; no animation is required to see content.
  if('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === '#'+entry.target.id));
    }), {rootMargin:'-36% 0px -51% 0px'});
    document.querySelectorAll('main > section[id]').forEach(s => observer.observe(s));
  }
})();


// Section joins: purely decorative, never controls content visibility.
(() => {
  const seams = document.querySelectorAll('.chapter-join');
  if (!seams.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    seams.forEach(seam => seam.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, {threshold: 0.25, rootMargin: '0px 0px -6% 0px'});
  seams.forEach(seam => io.observe(seam));
})();
