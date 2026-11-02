/* DATUM / static email-only interactions. No form submission or local storage. */
'use strict';
(() => {
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
  const menu=document.getElementById('menu-button');
  const nav=document.getElementById('primary-nav');
  if(menu && nav){
    const close=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Åbn menu');};
    menu.addEventListener('click',()=>{const opening=!nav.classList.contains('open');nav.classList.toggle('open',opening);menu.setAttribute('aria-expanded',String(opening));menu.setAttribute('aria-label',opening?'Luk menu':'Åbn menu');});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  }
  document.querySelectorAll('[data-material-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    const tag=btn.dataset.materialFilter;
    document.querySelectorAll('[data-material-filter]').forEach(b=>{const active=b===btn;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
    document.querySelectorAll('[data-material-tags]').forEach(card=>card.classList.toggle('is-dim',tag!=='all'&&!card.dataset.materialTags.split(',').includes(tag)));
  }));
  const email='DatumPrototyping@gmail.com';
  const fallbackCopy=(value)=>{
    const field=document.createElement('textarea');field.value=value;field.readOnly=true;
    field.style.cssText='position:fixed;top:0;left:-9999px;opacity:0';document.body.appendChild(field);
    field.focus();field.select();const success=document.execCommand('copy');field.remove();
    if(!success)throw new Error('clipboard unavailable');
  };
  document.addEventListener('click',async event=>{
    const btn=event.target.closest('[data-copy-email]');if(!btn)return;
    const card=btn.closest('.datum-email-card');const status=card?.querySelector('[data-email-feedback]');
    try{
      if(navigator.clipboard && window.isSecureContext)await navigator.clipboard.writeText(email);
      else fallbackCopy(email);
      if(status)status.textContent='Mailadressen er kopieret. Indsæt den i din mailtjeneste, og skriv din egen besked.';
    }catch(error){if(status)status.textContent='Kopiering blev blokeret. Markér mailadressen ovenfor, og kopiér den manuelt.';}
  });
})();
