'use strict';
(() => {
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  const menu=document.getElementById('menu-button');
  const nav=document.getElementById('primary-nav');
  if(menu && nav){
    const close=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Åbn menu');};
    menu.addEventListener('click',()=>{
      const opening=!nav.classList.contains('open');
      nav.classList.toggle('open',opening);
      menu.setAttribute('aria-expanded',String(opening));
      menu.setAttribute('aria-label',opening?'Luk menu':'Åbn menu');
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  }

  document.querySelectorAll('[data-material-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    const tag=btn.dataset.materialFilter;
    document.querySelectorAll('[data-material-filter]').forEach(b=>{
      const active=b===btn;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));
    });
    document.querySelectorAll('[data-material-tags]').forEach(card=>{
      card.classList.toggle('is-dim',tag!=='all' && !card.dataset.materialTags.split(',').includes(tag));
    });
  }));

  // Homepage: write the idea where it first occurs. Pass it locally to the editable brief.
  const ideaForm=document.getElementById('idea-start-form');
  if(ideaForm){
    const ideaField=document.getElementById('idea-start-text');
    const counter=document.getElementById('idea-start-counter');
    const status=document.getElementById('idea-transfer-status');
    const refreshCount=()=>{counter.textContent=ideaField.value.length+' / 2400';};
    ideaField.addEventListener('input',()=>{ideaField.setCustomValidity('');refreshCount();});
    document.querySelectorAll('[data-idea-starter]').forEach(button=>{
      button.addEventListener('click',()=>{
        const starter=button.getAttribute('data-idea-starter')||'';
        if(!ideaField.value.trim())ideaField.value=starter+' ';
        else if(!ideaField.value.includes(starter))ideaField.value=ideaField.value.replace(/\s*$/,'\n\n')+starter+' ';
        ideaField.focus();ideaField.setSelectionRange(ideaField.value.length,ideaField.value.length);
        refreshCount();
      });
    });
    ideaForm.addEventListener('submit',event=>{
      event.preventDefault();
      if(!ideaForm.reportValidity())return;
      const starterOnly=[...document.querySelectorAll('[data-idea-starter]')].some(b=>b.getAttribute('data-idea-starter')===ideaField.value.trim());
      if(starterOnly){ideaField.setCustomValidity('Tilføj lidt mere om din egen idé, før du fortsætter.');ideaField.reportValidity();return;}
      // Same-page draft transfer: never put the idea in a URL or send it to a server.
      const field=document.querySelector('#datum-ws-project-stage #problem');
      if(field && window.datumWorkspace){
        field.value=ideaField.value.trim();
        field.dispatchEvent(new Event('input',{bubbles:true}));
        const origin=document.querySelector('#datum-ws-project-stage [name="origin"][value="En idé"]');
        if(origin)origin.checked=true;
        try{
          window.datumWorkspace.open('projekt',{push:true,fromIdea:true});
          status.textContent='Din idé er med i formularen. Du kan altid ændre den – intet er sendt.';
        }catch(error){
          // Workspace did not open: preserve the draft in the current tab and
          // continue to the ordinary standalone form without exposing it in URL.
          try{sessionStorage.setItem('datum_idea_draft_v1',ideaField.value.trim());window.location.assign('projekt.html?fra=ide&udkast=1#problem');}
          catch(fallbackError){status.textContent='Kopiér idéen og åbn projektformularen manuelt.';status.setAttribute('role','alert');}
        }
      }else{
        try{
          sessionStorage.setItem('datum_idea_draft_v1',ideaField.value.trim());
          window.location.assign('projekt.html?fra=ide&udkast=1#problem');
        }catch(error){status.textContent='Kopiér idéen og åbn projektformularen manuelt.';status.setAttribute('role','alert');}
      }
    });
    refreshCount();
    const finalStart=document.getElementById('datum-final-start');
    if(finalStart){
      finalStart.addEventListener('click',event=>{
        if(!ideaField.value.trim())return; // normal navigation if no draft
        event.preventDefault();
        // Reuse the same validation and private session transfer as section 01.
        ideaForm.requestSubmit();
      });
    }
  }

  const form=document.getElementById('brief-form');
  if(!form)return;
  const params=new URLSearchParams(location.search);
  const kind=params.get('type');
  const typemap={
    reservedel:'En erstatningsdel',tilpasning:'En tilpasning eller adapter',ide:'En ny del eller idé',tegning:'En ny del eller idé'
  };
  const originMap={ide:'En idé',skitse:'En skitse',cad:'En CAD-fil',del:'En eksisterende del'};
  // Draft from homepage is inserted only on an explicitly requested transfer.
  if(params.get('udkast')==='1' && params.get('fra')==='ide'){
    try{
      const draft=sessionStorage.getItem('datum_idea_draft_v1');
      const field=form.elements.namedItem('problem');
      if(draft && field && !field.value){
        field.value=draft.substring(0,3000);
        const banner=document.createElement('p');
        banner.className='idea-draft-banner';
        banner.innerHTML='<strong>DIN IDÉ ER MED.</strong> Du kan rette i teksten herunder. Intet er sendt endnu.';
        const problemBlock=field.closest('.form-block');
        if(problemBlock)problemBlock.prepend(banner);
      }
      // It lives only long enough to move across pages, never in a URL or a server.
      sessionStorage.removeItem('datum_idea_draft_v1');
    }catch(error){ /* The project form remains usable if browser storage is disabled. */ }
  }
  let mapped=typemap[kind];
  if(mapped){const el=[...form.querySelectorAll('[name="type"]')].find(x=>x.value===mapped);if(el)el.checked=true;}
  let orig=originMap[params.get('fra')];
  if(!orig && kind==='tegning') orig='En CAD-fil';
  if(!orig && kind==='reservedel') orig='En eksisterende del';
  if(orig){const el=[...form.querySelectorAll('[name="origin"]')].find(x=>x.value===orig);if(el)el.checked=true;}
  const result=document.getElementById('result-section'), text=document.getElementById('result-text'), mail=document.getElementById('send-mail'), feedback=document.getElementById('result-feedback'), mailHint=document.getElementById('result-mail-hint');
  const mailAddress='DatumPrototyping@gmail.com';
  let lastBody='', lastSubject='';
  // A preview is no longer current once any answer changes.
  form.addEventListener('input',()=>{if(!result.hidden){result.hidden=true;feedback.textContent='';}});
  form.addEventListener('change',()=>{if(!result.hidden){result.hidden=true;feedback.textContent='';}});
  const clean=value=>String(value||'').trim();
  form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const data=new FormData(form);const name=clean(data.get('name')),email=clean(data.get('email'));
    const origin=clean(data.get('origin')),type=clean(data.get('type'));
    const problem=clean(data.get('problem')),size=clean(data.get('size'));
    const amount=clean(data.get('amount')),material=clean(data.get('material'));
    const details=clean(data.get('details'));
    const subject=`Forespørgsel til Datum / ${type} / ${name}`;
    const body=[
      'Hej Datum Prototyping','',
      'Jeg vil gerne høre, om denne opgave kan vurderes:','',
      `UDGANGSPUNKT\n${origin}`,'',
      `OPGAVETYPE\n${type}`,'',
      `HVAD DELEN SKAL KUNNE\n${problem}`,'',
      `CIRKA MÅL (MM)\n${size||'Ved ikke endnu'}`,'',
      `ANTAL\n${amount||'Ikke angivet'}`,'',
      `MATERIALE\n${material||'Ved ikke endnu'}`,'',
      `ANDRE OPLYSNINGER\n${details||'Ikke angivet'}`,'',
      'Jeg ved, at en forespørgsel ikke er en ordre.','',
      `KONTAKT\n${name}\n${email}`,'',
      'Venlig hilsen',name
    ].join('\n');
    text.value=`Til: ${mailAddress}\nEmne: ${subject}\n\n${body}`;
    lastBody=body;
    lastSubject=subject;
    // Large mailto URLs can be truncated by browser / email clients. For long text, copy first.
    const encodedBody=encodeURIComponent(body);
    const tooLong=encodedBody.length>1750;
    const safeBody=tooLong?'Min projektbeskrivelse er for lang til at blive indsat automatisk. Jeg indsætter den fulde tekst herunder.\n\n':body;
    mail.href='mailto:'+mailAddress+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(safeBody);
    mailHint.innerHTML=tooLong?
      'DIN BESKED ER LANG: Kopiér hele beskeden med knappen og indsæt den i dit e-mailprogram. Mailappen åbnes kun med en kort hjælpetekst.':
      'Modtager: <strong>'+mailAddress+'</strong> · Du kan også kopiere teksten til din egen webmail.';
    result.hidden=false;
    feedback.textContent='';
    result.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>document.getElementById('result-title')?.focus({preventScroll:true}),200);
  });
  mail.addEventListener('click',()=>{
    if(encodeURIComponent(lastBody).length>1750){feedback.textContent='Kopiér også hele teksten og indsæt den i din mail, inden du sender.';}
    else {feedback.textContent='Dit e-mailprogram skulle åbne nu. Beskeden er IKKE sendt af hjemmesiden.';}
  });
  document.getElementById('copy-brief').addEventListener('click',async()=>{
    try{
      if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(text.value);}
      else{ text.focus();text.select(); if(!document.execCommand('copy'))throw new Error('copy failed');}
      feedback.textContent='Teksten er kopieret. Ingen e-mail er sendt.';
    }catch(e){text.focus();text.select();feedback.textContent='Markér teksten og tryk Ctrl+C (eller Cmd+C på Mac) for at kopiere.';}
  });
})();
