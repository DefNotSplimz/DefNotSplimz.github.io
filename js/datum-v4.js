/** DATUM V4 – case media controls; preserves existing modal navigation. */
(() => {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  modal.addEventListener('click', event => {
    const button = event.target.closest('button[data-gallery-src]');
    if (!button || !modal.contains(button)) return;
    const image = modal.querySelector('.project-detail__hero img');
    const src = button.getAttribute('data-gallery-src');
    if (!image || !src || !/^assets\/[a-z0-9\-]+\.webp$/i.test(src)) return;
    image.src = src;
    image.alt = button.getAttribute('data-gallery-alt') || 'Projektbillede';
    modal.querySelector('.project-detail__hero')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
  });
})();
