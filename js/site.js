(() => {
  const body = document.body;
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pageMain = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  const brandLink = document.querySelector('.site-header .logo');
  let menuLastFocus = null;

  const setInert = (nodes, value) => nodes.filter(Boolean).forEach(node => { node.inert = value; });
  const menuBackgroundNodes = [pageMain, footer, brandLink];

  function menuFocusables() {
    return [menuBtn, ...(mobileMenu?.querySelectorAll('a[href],button:not([disabled])') || [])]
      .filter(el => el && el.offsetParent !== null);
  }

  function openMenu() {
    if (!menuBtn || !mobileMenu) return;
    menuLastFocus = document.activeElement;
    body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Luk menu');
    mobileMenu.setAttribute('aria-hidden', 'false');
    setInert(menuBackgroundNodes, true);
    mobileMenu.querySelector('a')?.focus({ preventScroll: true });
  }

  function closeMenu({ restoreFocus = false } = {}) {
    if (!menuBtn || !mobileMenu) return;
    const wasOpen = body.classList.contains('menu-open');
    body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Åbn menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
    setInert(menuBackgroundNodes, false);
    if (wasOpen && restoreFocus) {
      const target = menuBtn.offsetParent !== null ? menuBtn : menuLastFocus;
      target?.focus?.({ preventScroll: true });
    }
    menuLastFocus = null;
  }

  menuBtn?.addEventListener('click', () => {
    if (body.classList.contains('menu-open')) closeMenu({ restoreFocus: true });
    else openMenu();
  });

  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu({ restoreFocus: false })));

  const handleDesktopChange = event => {
    if (event.matches && body.classList.contains('menu-open')) closeMenu({ restoreFocus: false });
  };
  desktopMq.addEventListener?.('change', handleDesktopChange);

  // Scroll to contact and focus the project description.
  document.querySelectorAll('[data-start-project]').forEach(el => {
    el.addEventListener('click', event => {
      const target = document.querySelector('#kontakt');
      if (!target) return;
      event.preventDefault();
      closeMenu({ restoreFocus: false });
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => document.querySelector('#message')?.focus({ preventScroll: true }), reducedMotion ? 0 : 450);
    });
  });

  // Highlight the section currently in view in the desktop navigation.
  const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]:not(.nav-cta)')];
  const observed = new Map();
  navLinks.forEach(link => {
    const selector = link.getAttribute('href');
    const section = selector && selector.length > 1 ? document.querySelector(selector) : null;
    if (section) {
      if (!observed.has(section)) observed.set(section, []);
      observed.get(section).push(link);
    }
  });
  if ('IntersectionObserver' in window && observed.size) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => { link.classList.remove('is-active'); link.removeAttribute('aria-current'); });
        (observed.get(entry.target) || []).forEach(link => { link.classList.add('is-active'); link.setAttribute('aria-current', 'location'); });
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    observed.forEach((_, section) => observer.observe(section));
  }

  // File picker display.
  const fileInput = document.querySelector('#file');
  const fileName = document.querySelector('.file-name');
  fileInput?.addEventListener('change', () => {
    if (fileName) fileName.textContent = fileInput.files?.[0]?.name || 'Ingen fil valgt';
    if (status && !status.classList.contains('error') && !status.classList.contains('success')) {
      status.textContent = fileInput.files?.[0]
        ? 'Filnavnet kommer med i skabelonen. Husk at vedhæfte selve filen manuelt i din mail.'
        : 'Når du fortsætter, kopieres en færdig mail-skabelon. En valgt fil skal vedhæftes manuelt i din mail.';
    }
  });

  // Contact flow: validate locally and copy a ready-to-paste email template.
  const form = document.querySelector('#project-form');
  const status = document.querySelector('.form-status');

  async function copyTextToClipboard(text) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for local/file previews and older browsers.
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } finally {
      textarea.remove();
    }
    return copied;
  }

  form?.addEventListener('submit', async event => {
    event.preventDefault();

    const fields = [
      form.querySelector('#name'),
      form.querySelector('#email'),
      form.querySelector('#message')
    ].filter(Boolean);

    const invalid = [];
    fields.forEach(field => {
      const valid = field.checkValidity() && field.value.trim().length > 0;
      field.setAttribute('aria-invalid', String(!valid));
      if (!valid) invalid.push(field);
    });

    if (invalid.length) {
      if (status) {
        status.textContent = 'Udfyld navn, e-mail og en kort beskrivelse af opgaven.';
        status.className = 'form-status error';
      }
      invalid[0].focus({ preventScroll: true });
      invalid[0].scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'center'
      });
      return;
    }

    const name = form.querySelector('#name')?.value.trim() || '';
    const email = form.querySelector('#email')?.value.trim() || '';
    const message = form.querySelector('#message')?.value.trim() || '';
    const selectedFile = fileInput?.files?.[0]?.name || '';

    const template = [
      'Til: datumprototyping@gmail.com',
      `Emne: Projektforespørgsel — ${name}`,
      '',
      'Hej Datum Prototyping',
      '',
      `Navn: ${name}`,
      `E-mail: ${email}`,
      '',
      'Kort om opgaven:',
      message,
      selectedFile ? '' : null,
      selectedFile ? `Fil: ${selectedFile} — husk at vedhæfte filen manuelt.` : null,
      '',
      'Venlig hilsen',
      name
    ].filter(line => line !== null).join('\n');

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonHTML = submitButton?.innerHTML;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = 'Kopierer… <span class="arrow">→</span>';
    }

    try {
      const copied = await copyTextToClipboard(template);

      if (!copied) throw new Error('Clipboard copy failed');

      if (status) {
        status.textContent = 'Skabelonen er kopieret. Indsæt den i din mail med Ctrl+V / Indsæt.';
        status.className = 'form-status success';
      }

      if (submitButton) {
        submitButton.innerHTML = 'Kopieret <span class="arrow">✓</span>';
      }

      window.setTimeout(() => {
        if (submitButton && originalButtonHTML) {
          submitButton.innerHTML = originalButtonHTML;
          submitButton.disabled = false;
        }
      }, 1800);
    } catch (error) {
      if (status) {
        status.textContent = 'Kunne ikke kopiere automatisk i denne browser. Prøv igen via HTTPS eller kopiér oplysningerne manuelt.';
        status.className = 'form-status error';
      }
      if (submitButton) {
        if (originalButtonHTML) submitButton.innerHTML = originalButtonHTML;
        submitButton.disabled = false;
      }
    }
  });

  form?.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.removeAttribute('aria-invalid');
      if (status?.classList.contains('error')) {
        status.textContent = 'Når du fortsætter, kopieres en færdig mail-skabelon. En valgt fil skal vedhæftes manuelt i din mail.';
        status.className = 'form-status';
      }
    });
  });

  // Fullscreen project viewer.
  const modal = document.querySelector('#project-modal');
  const modalContent = document.querySelector('#project-modal-content');
  const modalScroll = document.querySelector('.project-modal-scroll');
  const closeBtn = document.querySelector('.project-modal-close');
  const modalPanel = document.querySelector('.project-modal-panel');
  const backgroundNodes = [document.querySelector('.site-header'), mobileMenu, pageMain, footer].filter(Boolean);
  let currentProject = null;
  let triggerElement = null;
  let openedViaHistoryEntry = false;

  const slugFromHash = () => {
    const match = location.hash.match(/^#project\/([a-z0-9-]+)$/i);
    return match ? match[1].toLowerCase() : null;
  };
  const templateFor = slug => document.querySelector(`#project-template-${CSS.escape(slug)}`);

  function getModalFocusable() {
    if (!modal) return [];
    return [...modal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter(el => el.offsetParent !== null);
  }

  function renderProject(slug) {
    const template = templateFor(slug);
    if (!template || !modal || !modalContent) return false;
    modalContent.replaceChildren(template.content.cloneNode(true));
    const title = modalContent.querySelector('[data-project-title]')?.dataset.projectTitle || 'Projekt';
    modalPanel?.setAttribute('aria-label', title);
    const closeLabel = modal?.querySelector('.project-modal-close-label');
    if (closeLabel) closeLabel.textContent = 'Luk projekt';
    if (modalScroll) modalScroll.scrollTop = 0;
    return true;
  }

  function showProject(slug, { push = false, trigger = null } = {}) {
    if (!renderProject(slug) || !modal) return;
    closeMenu({ restoreFocus: false });
    currentProject = slug;
    triggerElement = trigger || document.querySelector(`[data-project="${CSS.escape(slug)}"]`) || null;

    if (push) {
      history.pushState({ project: slug }, '', `#project/${slug}`);
      openedViaHistoryEntry = true;
    } else {
      openedViaHistoryEntry = Boolean(history.state?.project);
    }

    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('project-open');
    setInert(backgroundNodes, true);
    requestAnimationFrame(() => closeBtn?.focus({ preventScroll: true }));
  }

  function hideProject({ restoreFocus = true } = {}) {
    if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('project-open');
    setInert(backgroundNodes, false);
    currentProject = null;
    openedViaHistoryEntry = false;
    modalContent?.replaceChildren();
    const restoreTarget = triggerElement;
    triggerElement = null;
    if (restoreFocus && restoreTarget?.isConnected) restoreTarget.focus({ preventScroll: true });
  }

  function requestClose() {
    if (!currentProject) return;
    if (openedViaHistoryEntry && history.length > 1) {
      history.back();
      return;
    }
    const returnHash = '#projekter';
    history.replaceState(null, '', returnHash);
    hideProject({ restoreFocus: true });
    document.querySelector(returnHash)?.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) return;
      event.preventDefault();
      const slug = card.dataset.project;
      if (slug) showProject(slug, { push: true, trigger: card });
    });
  });

  modal?.querySelectorAll('[data-project-close]').forEach(el => el.addEventListener('click', event => {
    event.preventDefault();
    requestClose();
  }));

  window.addEventListener('popstate', () => {
    const slug = slugFromHash();
    if (slug && templateFor(slug)) showProject(slug, { push: false });
    else hideProject({ restoreFocus: true });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (currentProject) requestClose();
      else if (body.classList.contains('menu-open')) closeMenu({ restoreFocus: true });
      return;
    }

    if (event.key !== 'Tab') return;

    if (currentProject && modal) {
      const focusable = getModalFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!modal.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }

    if (body.classList.contains('menu-open')) {
      const focusable = menuFocusables();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!focusable.includes(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const initialSlug = slugFromHash();
  if (initialSlug && templateFor(initialSlug)) {
    const openInitialProject = () => showProject(initialSlug, { push: false });
    if (document.readyState === 'complete') openInitialProject();
    else window.addEventListener('load', openInitialProject, { once: true });
  }
})();
