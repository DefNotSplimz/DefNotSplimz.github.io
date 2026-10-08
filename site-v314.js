'use strict';
(()=>{
  const header=document.querySelector('[data-header]');
  const menu=document.querySelector('.menu-toggle');
  const nav=document.querySelector('#main-nav');
  const form=document.querySelector('#request-form');
  const result=document.querySelector('#template-result');
  const output=document.querySelector('#request-template');
  const status=document.querySelector('#template-status');
  const stale=document.querySelector('#template-stale');

  const syncHeader=()=>header?.classList.toggle('is-scrolled',window.scrollY>20);
  syncHeader();
  window.addEventListener('scroll',syncHeader,{passive:true});

  const setMenu=(open)=>{
    if(!menu||!nav)return;
    menu.setAttribute('aria-expanded',String(open));
    nav.classList.toggle('is-open',open);
    const icon=menu.querySelector('span');
    if(icon)icon.textContent=open?'−':'+';
  };
  menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus();}
  });
  document.addEventListener('click',e=>{
    if(menu?.getAttribute('aria-expanded')==='true'&&!e.target.closest('.site-header'))setMenu(false);
  });
  window.addEventListener('resize',()=>{if(window.innerWidth>820)setMenu(false);},{passive:true});

  const revealEls=[...document.querySelectorAll('.section,.capability-strip article')];
  revealEls.forEach(el=>el.setAttribute('data-reveal',''));
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}
    }),{threshold:.08});
    revealEls.forEach(el=>io.observe(el));
  }else{
    revealEls.forEach(el=>el.classList.add('is-visible'));
  }

  const types={
    prototype:['Prototype','Jeg vil gerne have hjælp til en prototype.','Formål og hvad prototypen skal afprøve'],
    part:['Enkeltstående del / reservedel','Jeg vil gerne have hjælp til en enkeltstående del eller reservedel.','Funktion, mål og hvad delen skal passe sammen med'],
    series:['Mindre serie','Jeg vil gerne have vurderet en mindre serie.','Funktion, ensartethed og eventuelle gentagne leverancer'],
    cad:['CAD / konstruktion','Jeg vil gerne have hjælp til CAD og konstruktion.','Funktion, pladsforhold og ønsket filformat'],
    fixture:['Fikstur / specialværktøj','Jeg vil gerne have hjælp til et fikstur eller specialværktøj.','Emnet, belastningen og hvordan værktøjet skal bruges'],
    other:['Afklaring af opgave','Jeg har en idé, som jeg gerne vil have hjælp til at afklare.','Min idé og det, jeg har brug for hjælp til']
  };

  const markStale=()=>{if(result&&!result.hidden&&stale)stale.hidden=false;};
  form?.addEventListener('input',markStale);

  const setContactKind=(kind)=>{
    const radio=document.querySelector(`[name="contact-kind"][value="${kind}"]`);
    if(radio)radio.checked=true;
    [['task-fields',kind==='task'],['job-fields',kind==='job']].forEach(([id,active])=>{
      const field=document.getElementById(id);
      if(field){field.hidden=!active;field.disabled=!active;}
    });
    markStale();
  };
  form?.querySelectorAll('[name="contact-kind"]').forEach(r=>r.addEventListener('change',()=>setContactKind(r.value)));
  document.querySelectorAll('[data-contact-kind]').forEach(a=>a.addEventListener('click',()=>setContactKind(a.dataset.contactKind)));
  form?.addEventListener('invalid',e=>{e.target.closest('details')?.setAttribute('open','');},true);

  form?.addEventListener('submit',e=>{
    e.preventDefault();
    if(!output||!result)return;
    const f=new FormData(form);
    const get=k=>String(f.get(k)||'').trim();
    const kind=get('contact-kind')||'task';
    const assets=f.getAll('assets');
    if(kind==='job'){
      output.value=`Emne: Job og faglig dialog

Hej Glen,

${get('job-description')||'[Beskriv muligheden eller det, du gerne vil tale om]'}

Jeg hører gerne fra dig.

Venlig hilsen
${get('name')||'[Dit navn]'}${get('email')?'\n'+get('email'):''}`;
    }else{
      const type=types[get('type')]||types.other;
      output.value=`Emne: Forespørgsel — ${type[0]}

Hej Glen,

${type[1]}

${type[2]}:
${get('description')||'[Beskriv opgaven her]'}

Materiale: ${get('material')||'Ikke afklaret'}
Antal: ${get('quantity')||'Ikke afklaret'}
Ønsket levering: ${get('deadline')||'Efter aftale'}

Grundlag, jeg kan sende:
${assets.length?assets.map(x=>'• '+x).join('\n'):'Jeg har endnu ikke tegninger eller filer klar.'}

Kritiske mål og tolerancer: [Angiv krav, eller skriv at de skal afklares]

Kan du vurdere, om opgaven passer til dine muligheder, og hvilket grundlag du eventuelt mangler?

Venlig hilsen
${get('name')||'[Dit navn]'}${get('email')?'\n'+get('email'):''}`;
    }
    result.hidden=false;
    if(stale)stale.hidden=true;
    if(status)status.textContent='Udkastet er klar. Tilpas teksten, kopiér den, og send den fra din egen mail.';
    output.focus();
    result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  });

  document.querySelector('#copy-template')?.addEventListener('click',async()=>{
    if(!output)return;
    try{
      await navigator.clipboard.writeText(output.value);
      if(status)status.textContent='Teksten er kopieret.';
    }catch{
      output.focus();output.select();
      if(status)status.textContent='Teksten er markeret. Brug Kopiér på din enhed, eller hent tekstfilen.';
    }
  });

  document.querySelector('#download-template')?.addEventListener('click',()=>{
    if(!output)return;
    const url=URL.createObjectURL(new Blob([output.value],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');
    a.href=url;a.download='datum-forespoergsel.txt';
    document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    if(status)status.textContent='Dit beskedudkast er hentet som tekstfil.';
  });

  document.querySelector('#copy-email')?.addEventListener('click',async()=>{
    const message=document.querySelector('#email-copy-status');
    const fallback=document.querySelector('#email-copy-fallback');
    try{
      await navigator.clipboard.writeText('datumprototyping@gmail.com');
      if(fallback)fallback.hidden=true;
      if(message)message.textContent='Mailadressen er kopieret.';
    }catch{
      if(fallback){fallback.hidden=false;fallback.focus();fallback.select();}
      if(message)message.textContent='Adressen er markeret. Vælg Kopiér på din enhed.';
    }
  });
})();
