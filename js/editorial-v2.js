/* Datum Editorial V2 / progressive visual enhancements.
   Zero dependencies; no interaction is required to use the site. */
(() => {
  'use strict';
  const bar = document.getElementById('scroll-progress-fill');
  if (bar) {
    let busy = false;
    const update = () => {
      const doc = document.documentElement;
      const distance = Math.max(1, doc.scrollHeight - window.innerHeight);
      bar.style.width = `${Math.min(100, Math.max(0, 100 * window.scrollY / distance)).toFixed(2)}%`;
      busy = false;
    };
    const request = () => {
      if (busy) return;
      busy = true;
      window.requestAnimationFrame(update);
    };
    document.addEventListener('scroll', request, {passive:true});
    window.addEventListener('resize', request, {passive:true});
    update();
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const items = document.querySelectorAll('.feature-project,.project-tile,.service-card,.signature-inner h2,.process-item,.concept-drawing');
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('did-appear');
      reveal.unobserve(entry.target);
    });
  }, {threshold:0.1, rootMargin:'0px 0px -24px 0px'});
  items.forEach(item => reveal.observe(item));
})();
