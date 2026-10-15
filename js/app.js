(() => {
  'use strict';

  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  const headerBrand = document.querySelector('.site-header .brand');

  const setInert = (nodes, value) => {
    nodes.filter(Boolean).forEach(node => { node.inert = value; });
  };

  /* Mobile menu */
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuBackground = [main, footer, headerBrand];
  let menuLastFocus = null;

  function menuFocusables() {
    return [menuButton, ...(mobileMenu?.querySelectorAll('a[href],button:not([disabled])') || [])]
      .filter(el => el && el.offsetParent !== null);
  }

  function openMenu() {
    if (!menuButton || !mobileMenu) return;
    menuLastFocus = document.activeElement;
    body.classList.add('menu-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Luk menu');
    mobileMenu.setAttribute('aria-hidden', 'false');
    setInert(menuBackground, true);
    mobileMenu.querySelector('a')?.focus({ preventScroll: true });
  }

  function closeMenu({ restoreFocus = false } = {}) {
    if (!menuButton || !mobileMenu) return;
    const wasOpen = body.classList.contains('menu-open');
    body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Åbn menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
    setInert(menuBackground, false);
    if (wasOpen && restoreFocus) {
      (menuButton.offsetParent !== null ? menuButton : menuLastFocus)?.focus?.({ preventScroll: true });
    }
    menuLastFocus = null;
  }

  menuButton?.addEventListener('click', () => {
    body.classList.contains('menu-open') ? closeMenu({ restoreFocus: true }) : openMenu();
  });
  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  desktopMq.addEventListener?.('change', event => {
    if (event.matches && body.classList.contains('menu-open')) closeMenu();
  });

  /* Active desktop navigation */
  const navLinks = [...document.querySelectorAll('[data-nav-link]')];
  const observedSections = new Map();
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const section = href?.startsWith('#') ? document.querySelector(href) : null;
    if (!section) return;
    if (!observedSections.has(section)) observedSections.set(section, []);
    observedSections.get(section).push(link);
  });

  if ('IntersectionObserver' in window && observedSections.size) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      });
      (observedSections.get(visible.target) || []).forEach(link => {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .1, .25] });
    observedSections.forEach((_, section) => observer.observe(section));
  }

  /* Quick intake */
  const intakeState = { har: 'USIKKER', galt: 'ANDET', brug: 'USIKKER' };

  document.querySelectorAll('.quick-options').forEach(group => {
    group.addEventListener('click', event => {
      const button = event.target.closest('.quick-option');
      if (!button) return;
      group.querySelectorAll('.quick-option').forEach(item => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      intakeState[group.dataset.group] = button.dataset.value;
    });
  });

  function syncIntakeToContact() {
    const has = document.querySelector('#has');
    const need = document.querySelector('#need');
    const usage = document.querySelector('#usage');
    if (has) has.value = intakeState.har;
    if (need) need.value = intakeState.galt;
    if (usage) usage.value = intakeState.brug;
    renderMail();
  }

  function goToContact() {
    closeMenu();
    syncIntakeToContact();
    const target = document.querySelector('#start');
    if (!target) return;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    const delay = reducedMotion ? 0 : 520;
    window.setTimeout(() => document.querySelector('#desc')?.focus({ preventScroll: true }), delay);
  }

  document.querySelectorAll('[data-go-contact]').forEach(element => {
    element.addEventListener('click', event => {
      event.preventDefault();
      goToContact();
    });
  });

  /* Email generator */
  const hasLabels = {
    'DEL': 'en eksisterende del',
    'FOTO': 'et foto',
    'SKITSE': 'en skitse',
    'IDÉ': 'en idé',
    'CAD': 'en CAD-fil',
    'USIKKER': 'et udgangspunkt, men ikke en færdig løsning endnu'
  };
  const needLabels = {
    'UDGÅET': 'en del, der ikke længere kan skaffes',
    'DEFEKT': 'en del, der er defekt',
    'PASSER IKKE': 'en del, der ikke passer',
    'ÆNDRING': 'noget, der skal ændres eller tilpasses',
    'NY IDÉ': 'en ny idé, der skal gøres fysisk',
    'ANDET': 'en opgave, jeg gerne vil have vurderet'
  };
  const usageLabels = {
    '1 STK': 'én del',
    'PROTOTYPE': 'en prototype',
    'LILLE SERIE': 'en mindre serie',
    'USIKKER': 'at få omfanget vurderet først'
  };
  const materialLabels = {
    'USIKKER': 'Jeg er ikke sikker på materialet endnu.',
    'ALUMINIUM': 'Materialet er aluminium.',
    'MESSING': 'Materialet er messing.',
    'STÅL': 'Materialet er stål.',
    'RUSTFAST': 'Materialet er rustfast stål.',
    'VÆRKTØJSSTÅL': 'Materialet er værktøjsstål.',
    'POM': 'Materialet er POM.',
    'AKRYL': 'Materialet er akryl.',
    'NYLON': 'Materialet er nylon.',
    'FDM': 'Jeg forestiller mig en 3D-printet plastdel.',
    'ANDET': 'Materialet er et andet end valgmulighederne ovenfor.'
  };
  const subjectLabels = {
    'UDGÅET': 'Udgået reservedel',
    'DEFEKT': 'Defekt del',
    'PASSER IKKE': 'Tilpasning af del',
    'ÆNDRING': 'Ændring / tilpasning',
    'NY IDÉ': 'Prototype / ny idé',
    'ANDET': 'Ny opgave'
  };

  function renderMail() {
    const has = document.querySelector('#has')?.value || 'USIKKER';
    const need = document.querySelector('#need')?.value || 'ANDET';
    const usage = document.querySelector('#usage')?.value || 'USIKKER';
    const material = document.querySelector('#material')?.value || 'USIKKER';
    const desc = document.querySelector('#desc')?.value.trim() || '';
    const customerName = document.querySelector('#customerName')?.value.trim() || '';
    const phone = document.querySelector('#phone')?.value.trim() || '';

    const subject = `Forespørgsel – ${subjectLabels[need] || 'Ny opgave'}`;
    let bodyText = `Hej Datum Prototyping\n\nJeg vil gerne høre, om du kan vurdere en opgave.\n\nJeg står med ${needLabels[need] || 'en opgave'}. Jeg har ${hasLabels[has] || 'noget materiale, jeg kan sende'}, og jeg forventer at få brug for ${usageLabels[usage] || 'en løsning i mindre omfang'}. ${materialLabels[material] || ''}\n\nKort om opgaven:\n${desc || '[Beskriv kort hvad der skal løses]'}\n\nJeg vedhæfter de billeder, skitser eller filer, jeg har, hvis det er relevant.\n\nVenlig hilsen\n${customerName || '[Navn]'}`;
    if (phone) bodyText += `\nTlf. ${phone}`;

    const preview = document.querySelector('#mailPreview');
    const mailto = document.querySelector('#mailtoLink');
    if (preview) preview.textContent = bodyText;
    if (mailto) mailto.href = `mailto:datumprototyping@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  }

  ['has', 'need', 'usage', 'material', 'customerName', 'phone', 'desc'].forEach(id => {
    document.querySelector(`#${id}`)?.addEventListener('input', renderMail);
  });

  async function copyText(text) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.setAttribute('readonly', '');
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } finally { temp.remove(); }
    return copied;
  }

  document.querySelector('#copyMail')?.addEventListener('click', async event => {
    renderMail();
    const button = event.currentTarget;
    const status = document.querySelector('#formStatus');
    const original = button.textContent;
    try {
      const copied = await copyText(document.querySelector('#mailPreview')?.textContent || '');
      if (!copied) throw new Error('Clipboard copy failed');
      button.textContent = 'Kopieret ✓';
      if (status) status.textContent = 'Mailteksten er kopieret til udklipsholderen.';
    } catch {
      if (status) status.textContent = 'Kunne ikke kopiere automatisk. Brug ‘Åbn mail’ — teksten indsættes automatisk i din mail.';
    }
    window.setTimeout(() => { button.textContent = original; }, 1600);
  });

  /* Project viewer */
  const modal = document.querySelector('#project-modal');
  const modalPanel = document.querySelector('.project-modal__panel');
  const modalContent = document.querySelector('#project-modal-content');
  const modalScroll = document.querySelector('.project-modal__scroll');
  const closeButton = document.querySelector('.project-modal__close');
  const modalBackground = [document.querySelector('.site-header'), mobileMenu, main, footer].filter(Boolean);
  let currentProject = null;
  let triggerElement = null;
  let openedViaHistory = false;

  const projectSlugFromHash = () => {
    const match = location.hash.match(/^#project\/([a-z0-9-]+)$/i);
    return match ? match[1].toLowerCase() : null;
  };
  const projectTemplate = slug => document.querySelector(`#project-template-${slug}`);

  function modalFocusables() {
    return [...(modal?.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])') || [])]
      .filter(el => el.offsetParent !== null);
  }

  function renderProject(slug) {
    const template = projectTemplate(slug);
    if (!template || !modalContent) return false;
    modalContent.replaceChildren(template.content.cloneNode(true));
    const title = modalContent.querySelector('[data-project-title]')?.dataset.projectTitle || 'Projekt';
    modalPanel?.setAttribute('aria-label', title);
    if (modalScroll) modalScroll.scrollTop = 0;
    return true;
  }

  function showProject(slug, { push = false, trigger = null } = {}) {
    if (!modal || !renderProject(slug)) return;
    closeMenu();
    currentProject = slug;
    triggerElement = trigger || document.querySelector(`[data-project="${slug}"]`) || null;
    if (push) {
      history.pushState({ project: slug }, '', `#project/${slug}`);
      openedViaHistory = true;
    } else {
      openedViaHistory = Boolean(history.state?.project);
    }
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('project-open');
    setInert(modalBackground, true);
    requestAnimationFrame(() => closeButton?.focus({ preventScroll: true }));
  }

  function hideProject({ restoreFocus = true } = {}) {
    if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('project-open');
    setInert(modalBackground, false);
    currentProject = null;
    openedViaHistory = false;
    modalContent?.replaceChildren();
    const target = triggerElement;
    triggerElement = null;
    if (restoreFocus && target?.isConnected) target.focus({ preventScroll: true });
  }

  function requestProjectClose() {
    if (!currentProject) return;
    if (openedViaHistory && history.length > 1) {
      history.back();
      return;
    }
    history.replaceState(null, '', '#projekter');
    hideProject({ restoreFocus: true });
  }

  document.querySelectorAll('[data-project]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) return;
      event.preventDefault();
      const slug = link.dataset.project;
      if (slug) showProject(slug, { push: true, trigger: link });
    });
  });
  modal?.querySelectorAll('[data-project-close]').forEach(el => el.addEventListener('click', event => {
    event.preventDefault();
    requestProjectClose();
  }));
  window.addEventListener('popstate', () => {
    const slug = projectSlugFromHash();
    if (slug && projectTemplate(slug)) showProject(slug, { push: false });
    else hideProject({ restoreFocus: true });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (currentProject) requestProjectClose();
      else if (body.classList.contains('menu-open')) closeMenu({ restoreFocus: true });
      return;
    }
    if (event.key !== 'Tab') return;

    if (currentProject && modal) {
      const focusable = modalFocusables();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!modal.contains(document.activeElement)) {
        event.preventDefault(); first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
      return;
    }

    if (body.classList.contains('menu-open') && mobileMenu) {
      const focusable = menuFocusables();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  // Deep-link project on initial load.
  const initialProject = projectSlugFromHash();
  if (initialProject && projectTemplate(initialProject)) showProject(initialProject, { push: false });

  syncIntakeToContact();
})();
