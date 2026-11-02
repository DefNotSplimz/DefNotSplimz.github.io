/* DATUM / WORKSPACE V2.10: progressive, accessible navigation enhancement. */
(()=>{
  'use strict';
  // Only the homepage owns the integrated project component. On standalone
  // HTML pages the existing links must work as ordinary navigation rather
  // than opening an incomplete workspace. This also provides a clean fallback
  // when the enhanced one-page experience is unavailable.
  if(!document.getElementById('start-her')) return;
  const content = {
    cnc: {
      label:'01 / PRÆCISIONSBEARBEJDNING', heading:'CNC <span>& MANUEL.</span>',
      intro:'Fire metoder. Ét mål: den rigtige løsning til din del.',
      page:'cnc.html', link:'HELE GUIDEN TIL BEARBEJDNING', cta:'STIL ET SPØRGSMÅL',
      options:[
        {name:'CNC-fræsning',number:'01',title:'FORMER, FLADER & KONTURER.',image:'datum-cnc.webp',tag:'CNC / FRÆSNING',body:'Roterende skærende værktøj bearbejder et fastspændt emne. Relevant når delen eksempelvis kræver præcise flader, lommer, huller eller flere bearbejdede sider.',features:['Beslag, fiksturer og adaptere','Konturer, lommer og boringer','Digitalt forberedte værktøjsbaner','Værktøjsadgang og opspænding vurderes'],note:'CNC-fræsning er en mulighed, ikke et krav. Realistisk fremstilling vurderes ud fra den konkrete del.'},
        {name:'CNC-drejning',number:'02',title:'RUNDE DELE. PRÆCISE MÅL.',image:'datum-turning.webp',tag:'CNC / DREJNING',body:'Emnet roterer mod et skærende værktøj. Det gør drejning relevant til aksler, bøsninger, afstandsstykker og cylindriske emner med funktionelle diametre.',features:['Aksler og afstandsbøsninger','Diameter, pasning og koncentrisk form','Trin, spor og eventuelt gevind','Opspænding og støtte vurderes'],note:'Lange eller tynde emner kan kræve særlige løsninger ved opspænding og bearbejdning.'},
        {name:'Manuel fræsning',number:'03',title:'DIREKTE KONTROL. FLEKSIBELT ARBEJDE.',image:'datum-manual-milling.webp',tag:'MANUEL / FRÆSNING',body:'Konventionel fræsning giver direkte kontrol over processen ved maskinen. Det kan være en god vej til enkeltdele, mindre tilpasninger og detaljer, hvor et CNC-program ikke giver den største fordel.',features:['Enkeltdele og ændringer','Flader, spor og boringer','Trinvis kontrol ved maskinen','Valg af opspænding og værktøj'],note:'Manuel bearbejdning er en selvstændig præcisionsmetode, ikke bare efterarbejde.'},
        {name:'Manuel drejning',number:'04',title:'HÅNDVÆRK MED PRÆCISION.',image:'datum-manual-turning.webp',tag:'MANUEL / DREJNING',body:'Konventionel drejning til runde emner, hvor direkte maskinbetjening og individuel tilpasning er den mest praktiske fremstillingsvej.',features:['Bøsninger og aksler','Tilpasning af diametre og længder','Gevind og udvalgte detaljer','Skræddersyet enkeltstyksarbejde'],note:'Valg af metode afhænger af opgaven, tolerancerne og den tilgængelige maskinopsætning.'}
      ]
    },
    cad: {
      label:'02 / UDVIKLING & KONSTRUKTION',heading:'FRA TANKE <span>TIL MODEL.</span>',
      intro:'Fra den første tanke til en model, der kan undersøges og fremstilles.',
      page:'cad-cam.html', link:'LÆS MERE OM CAD / CAM', cta:'STIL ET SPØRGSMÅL',
      options:[
        {name:'Konstruktion',number:'01',title:'FORMEN KOMMER FØR MASKINEN.',image:'datum-cad-cam.webp',tag:'CAD / 3D-MODEL',body:'Fra skitse, mål eller en løs tanke til en digital model. Form og funktion kan undersøges, inden noget bliver fremstillet.',features:['3D-modeller og mekanisk geometri','Dimensioner og pasform','Justeringer og mulige versioner','En mere konkret retning for idéen'],note:'En CAD-model er ikke nødvendig, når du kontakter Datum.'},
        {name:'CAM-programmering',number:'02',title:'FRA GEOMETRI TIL VÆRKTØJSBANE.',image:'datum-cnc.webp',tag:'CAM / BEARBEJDNING',body:'Når en form skal CNC-bearbejdes, kan CAM bruges til at planlægge operationer, værktøjsbaner og bearbejdningsrækkefølge.',features:['Opsætning og referencer','Råmateriale og værktøjsvalg','Værktøjsbaner til den konkrete geometri','Kontrol og simulering før bearbejdning'],note:'CAM er ét skridt i fremstillingen – manuel bearbejdning kan være bedre til andre opgaver.'},
        {name:'Forbedring & afprøvning',number:'03',title:'FØRSTE VERSION ER ET UDGANGSPUNKT.',image:'datum-fdm.webp',tag:'UDVIKLING / TEST',body:'En prototype kan afklare pasning, form eller funktion. Når noget ikke virker som tænkt, kan konstruktionen justeres, før næste version fremstilles.',features:['Prototypeovervejelser','FDM som mulighed til test','Tilpasning af geometri','Praktisk iteration efter behov'],note:'Udviklingsmuligheder og tidsforbrug vurderes individuelt for hver idé.'}
      ]
    },
    materialer: {
      label:'03 / MATERIALEVALG',heading:'MATERIALET <span>GØR FORSKELLEN.</span>',
      intro:'Fortæl hvad delen skal kunne. Så undersøger vi materialet.',
      page:'materialer.html',link:'SE DEN FULDE MATERIALEGUIDE',cta:'SPØRG OM MATERIALE',
      options:[
        {name:'Aluminium',number:'01',title:'LET, ALSIDIGT & BEARBEJDELIGT.',image:'datum-material-aluminium.webp',tag:'METAL / ALUMINIUM',body:'Aluminium er et ofte relevant udgangspunkt til beslag, mekaniske dele og prototyper, hvor lav vægt og god bearbejdelighed er nyttigt.',features:['Lav vægt','Gode muligheder for bearbejdning','Mange anvendelser til specialdele','Legering vælges efter funktionen'],note:'Styrke og overfladeegenskaber afhænger af den specifikke legering og behandling.'},
        {name:'Stål / rustfast',number:'02',title:'STYRKE, SLID & MODSTAND.',image:'datum-material-steel.webp',tag:'METAL / STÅL',body:'Stål vælges ofte, hvor styrke, stivhed og slidstyrke er vigtige. Rustfaste kvaliteter kan være relevante, når miljøet stiller særlige krav.',features:['Styrke og slidstyrke','Forskellige stålkvaliteter','Mulighed for korrosionsbestandighed','Overvejelse af vægt og bearbejdning'],note:'Rustfast betyder ikke korrosionsfri i alle miljøer; den relevante kvalitet vælges efter anvendelsen.'},
        {name:'Messing',number:'03',title:'PRÆCISE DETALJER. FLOT FINISH.',image:'datum-material-brass.webp',tag:'METAL / MESSING',body:'Messing kan være velegnet til små mekaniske detaljer, bøsninger og specialkomponenter, hvor bearbejdelighed og overfladeudtryk spiller en rolle.',features:['God bearbejdelighed i mange kvaliteter','Fine detaljer','Karakteristisk finish','Relevans til bøsninger og små emner'],note:'Messinglegeringer har forskellige egenskaber og bør vurderes efter behov.'},
        {name:'Teknisk plast',number:'04',title:'ANDRE EGENSKABER. NYE MULIGHEDER.',image:'datum-material-plastic.webp',tag:'PLAST / TEKNISKE MATERIALER',body:'Teknisk plast kan være relevant, når lav vægt, elektrisk isolering, lav friktion eller bestemte slid- og miljøegenskaber er vigtige.',features:['Lav vægt','Mulighed for isolering','Udvalgte glide- og sliddele','Funktion og temperatur vurderes'],note:'Materialevalg afhænger blandt andet af temperatur, belastning og miljø.'}
      ]
    },
    om: {
      label:'04 / HVAD ER DATUM?',heading:'ÉN MAND. <span>INGEN SMÅ AMBITIONER.</span>',
      intro:'Ét menneske. Præcision, nysgerrighed og plads til usædvanlige idéer.',
      page:'om-datum.html',link:'LÆS HELE HISTORIEN',cta:'STIL ET SPØRGSMÅL',
      options:[
        {name:'Fagligheden',number:'01',title:'HÅNDVÆRKET SOM FUNDAMENT.',image:'datum-metal-detail.webp',tag:'NU / UNDER OPBYGNING',body:'Datum udvikles sideløbende med finmekanikeruddannelsen med speciale i CNC-bearbejdning. Fokus er på praktisk erfaring, præcision og faglig udvikling. Betalte opgaver tilbydes endnu ikke.',features:['Finmekanisk faglighed','CNC og manuel bearbejdning','CAD/CAM og materialeforståelse','Faglige idéer undersøges'],note:'Der loves ikke en fast maskinpark eller produktionskapacitet, som endnu ikke er etableret.'},
        {name:'Arbejdsformen',number:'02',title:'UNDERSØG FØRST.',image:'datum-cad-cam.webp',tag:'METODE / DIALOG',body:'En besøgende kan starte med en tanke, en skitse eller en eksisterende del. Målet er at afklare det vigtigste og finde en realistisk teknisk vej – uden unødvendige mellemled.',features:['Direkte dialog','Nysgerrighed før begrænsninger','Fokus på delens funktion','Ærlige vurderinger'],note:'Ikke alle idéer kan fremstilles, men det skal være nemt at spørge.'},
        {name:'Visionen',number:'03',title:'ET DANSK NAVN AT REGNE MED.',image:'datum-hero.webp',tag:'FREMTID / PROTOTYPING',body:'Målet er et respekteret dansk one-man værksted med plads til CNC, prototyper og praktisk udvikling. Ikke større for størrelsens skyld – men stærkere på faglighed og problemløsning.',features:['Ét menneske bag værkstedet','Prototype- og udviklingsfokus','Langsigtet faglig ambition','Egne digitale hjælpemidler udvikles'],note:'Visionen er et fremtidigt mål, ikke en påstand om en allerede etableret virksomhed.'}
      ]
    }
  };
  const panelPaths={'cnc.html':'cnc','cad-cam.html':'cad','materialer.html':'materialer','om-datum.html':'om','projekt.html':'projekt'};
  const order=['cnc','cad','materialer','om','projekt'];
  const names={cnc:'CNC & MANUEL',cad:'CAD / CAM',materialer:'MATERIALER',om:'OM DATUM',projekt:'SPØRGSMÅL'};
  const params=new URLSearchParams(location.search);
  const initial=params.get('workspace');
  const state={key:null,index:0,opener:null,pushed:false,closingTimer:null};
  const root=document.createElement('div');root.id='datum-workspace-root';root.className='datum-workspace-root';root.hidden=true;
  root.innerHTML=`<div class="datum-ws-shade" data-ws-close aria-hidden="true"></div>
    <section class="datum-ws-panel" role="dialog" aria-modal="true" aria-labelledby="datum-ws-title" tabindex="-1">
      <div class="datum-ws-top"><div class="datum-ws-brand"><img src="assets/brand/datum-logo.svg" alt="Datum Prototyping" width="645" height="196"><i aria-hidden="true"></i><span>ONE EXPERIENCE</span></div><button type="button" class="datum-ws-close" aria-label="Luk workspace" data-ws-close>×</button></div>
      <nav class="datum-ws-switcher" aria-label="Skift workspace">${order.map(k=>`<button type="button" data-ws-switch="${k}" aria-pressed="false">${names[k]}</button>`).join('')}</nav>
      <div class="datum-ws-scroll">
       <div class="datum-ws-explore-view" id="datum-ws-explore-view">
        <div class="datum-ws-intro"><div class="datum-ws-eyebrow" id="datum-ws-label"></div><h2 id="datum-ws-title"></h2><p id="datum-ws-intro"></p></div>
        <div class="datum-ws-tabs" id="datum-ws-tabs" role="tablist" aria-label="Vælg emne"></div>
        <article class="datum-ws-detail" id="datum-ws-detail" role="tabpanel" tabindex="0" aria-live="off"></article>
        <div class="datum-ws-bottom"><a class="datum-ws-cta" href="projekt.html">STIL ET SPØRGSMÅL <span aria-hidden="true">↗</span></a><span class="datum-ws-full">VÆLG ET EMNE OVENFOR</span></div>
        <div class="datum-ws-footnote">BILLEDERNE ER KONCEPTVISUALISERINGER – IKKE DATUMS EGET VÆRKSTED ELLER TIDLIGERE KUNDEEMNER.</div>
       </div>
       <div class="datum-ws-project-view" id="datum-ws-project-view" hidden><div class="datum-ws-intro"><div class="datum-ws-eyebrow">05 / SPØRGSMÅL</div><h2 id="datum-ws-project-title">SKRIV EN <span>E-MAIL.</span></h2><p>Ingen kontaktformular. Har du et spørgsmål om Datum, kan du selv sende en almindelig e-mail fra din foretrukne mailtjeneste.</p></div><div class="datum-ws-email"><div class="datum-email-card" aria-label="Kontakt via e-mail">
  <span class="datum-email-kicker">DIREKTE E-MAIL / INGEN FORMULAR</span>
  <h3>HAR DU ET <em>SPØRGSMÅL?</em></h3>
  <p>Har du spørgsmål om Datum, CNC eller en idé, du går og tænker på? Skriv selv fra den mailtjeneste, du foretrækker.</p>
  <div class="datum-email-address"><span>E-MAILADRESSE</span><strong>DatumPrototyping@gmail.com</strong></div>
  <div class="datum-email-actions"><button type="button" class="datum-email-copy" data-copy-email>KOPIÉR MAILADRESSE <span aria-hidden="true">⧉</span></button><a class="datum-email-optional" href="mailto:DatumPrototyping@gmail.com">Åbn mailapp (valgfrit) ↗</a></div>
  <p class="datum-email-feedback" data-email-feedback role="status" aria-live="polite"></p>
  <p class="datum-email-note">Der indtastes eller sendes ingen besked gennem hjemmesiden. Datum tager endnu ikke imod betalte opgaver eller bestillinger. <a href="privatliv.html">Læs om privatliv</a>.</p>
</div></div></div>
      </div>
    </section>`;
  document.body.append(root);
  const $=s=>root.querySelector(s);
  const panel=$('.datum-ws-panel');const scroller=$('.datum-ws-scroll');
    const backgroundRegions=[...document.querySelectorAll('body > header,body > main,body > footer')];
  const setBackgroundInert=value=>backgroundRegions.forEach(el=>{el.inert=value;});
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const detailParam=key=>key==='projekt'?null:content[key]?.options[state.index]?.number;
  const urlFor=(key)=>{const u=new URL(location.href);u.searchParams.set('workspace',key);u.searchParams.delete('detail');const detail=detailParam(key);if(detail)u.searchParams.set('detail',detail);return u.pathname+u.search+u.hash;};
  const clearUrl=()=>{const u=new URL(location.href);u.searchParams.delete('workspace');u.searchParams.delete('detail');return u.pathname+u.search+u.hash;};
  function drawDetails(){
    const data=content[state.key];if(!data)return;
    const detail=data.options[state.index];
    root.querySelectorAll('.datum-ws-tab').forEach((btn,i)=>{const active=i===state.index;btn.setAttribute('aria-selected',String(active));btn.tabIndex=active?0:-1;});
    $('#datum-ws-detail').setAttribute('aria-labelledby','datum-ws-tab-'+state.index);
    $('#datum-ws-detail').innerHTML=`<div class="datum-ws-feature-layout"><figure class="datum-ws-feature-media"><img src="assets/images/${esc(detail.image)}" alt="Konceptvisualisering: ${esc(detail.name)}" loading="eager"><figcaption><span class="datum-ws-media-id">${esc(detail.number)} <i aria-hidden="true"></i> ${esc(detail.tag)}</span><span>KONCEPTVISUALISERING</span></figcaption></figure><div class="datum-ws-feature-content"><div class="datum-ws-feature-kicker"><span>${esc(detail.tag)}</span><span>${esc(detail.number)} / ${String(data.options.length).padStart(2,'0')}</span></div><h3>${esc(detail.title)}</h3><p>${esc(detail.body)}</p><div class="datum-ws-points" aria-label="Vigtige egenskaber">${detail.features.map((f,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span>${esc(f)}</div>`).join('')}</div></div></div><details class="datum-ws-detail-note"><summary>TEKNISK OVERVEJELSE <span aria-hidden="true">+</span></summary><p>${esc(detail.note)}</p></details>`;
  }
  function selectIndex(index,{updateURL=true}={}){
    if(!content[state.key])return;
    state.index=Math.max(0,Math.min(content[state.key].options.length-1,index));
    drawDetails();
    if(updateURL){try{history.replaceState({datumWorkspace:state.key},'',urlFor(state.key));}catch(e){}}
  }
  function show(key,{push=false,restoreFocus=true,detail=null}={}){
    if(key!=='projekt'&&!content[key])return;
    clearTimeout(state.closingTimer);
    const first=!state.key;
    if(first&&restoreFocus)state.opener=document.activeElement;
    state.key=key;state.index=0;document.body.dataset.activeWorkspace=key;
    const project=key==='projekt';
    $('#datum-ws-explore-view').hidden=project;
    $('#datum-ws-project-view').hidden=!project;
    if(project){
      const title=$('#datum-ws-project-title');panel.setAttribute('aria-labelledby',title.id);
    }else{
      panel.setAttribute('aria-labelledby','datum-ws-title');
      const d=content[key];
      $('#datum-ws-label').textContent=d.label;
      $('#datum-ws-title').innerHTML=d.heading;
      $('#datum-ws-intro').textContent=d.intro;
      const tabs=$('#datum-ws-tabs');tabs.innerHTML=d.options.map((v,i)=>`<button type="button" class="datum-ws-tab" role="tab" id="datum-ws-tab-${i}" aria-controls="datum-ws-detail" aria-selected="false" tabindex="-1" data-ws-tab="${i}"><span class="tab-index">${v.number} /</span>${esc(v.name)}</button>`).join('');
      const cta=$('.datum-ws-cta');cta.textContent=d.cta+' ↗';cta.href='projekt.html';
      state.index=detail?Math.max(0,d.options.findIndex(x=>x.number===detail)):0;
      drawDetails();
    }
    root.querySelectorAll('[data-ws-switch]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.wsSwitch===key)));
    scroller.scrollTop=0;
    root.hidden=false;document.body.classList.add('datum-ws-lock');setBackgroundInert(true);
    requestAnimationFrame(()=>root.classList.add('is-open'));
    if(push){try{const dest=urlFor(key);if(state.pushed)history.replaceState({datumWorkspace:key},'',dest);else history.pushState({datumWorkspace:key},'',dest);state.pushed=true;}catch(e){}}
    if(first) $('.datum-ws-close').focus({preventScroll:true});
    else root.querySelector('[data-ws-switch="'+key+'"]').focus({preventScroll:true});
  }
  function hide({historyNavigation=true,restore=true}={}){
    if(!state.key)return;
    const canBack=historyNavigation&&state.pushed;
    state.key=null;state.pushed=false;delete document.body.dataset.activeWorkspace;
    root.classList.remove('is-open');document.body.classList.remove('datum-ws-lock');setBackgroundInert(false);
    if(canBack){try{history.back();}catch(e){}}
    else if(historyNavigation){try{history.replaceState(null,'',clearUrl());}catch(e){}}
    state.closingTimer=setTimeout(()=>{if(!state.key)root.hidden=true;},340);
    if(restore&&state.opener&&state.opener.isConnected)state.opener.focus({preventScroll:true});
    state.opener=null;
  }
  window.datumWorkspace={open:(key,opts={})=>show(key,{push:true,...opts}),close:()=>hide(),get current(){return state.key;}};
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link||link.hasAttribute('download')||link.target==='_blank'||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
    const raw=link.getAttribute('href')||'';
    if(raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('//')||raw.includes('://')||raw.startsWith('/'))return;
    const local=raw.replace(/^\.\//,'').split('?')[0];
    if(local.includes('/')||local.includes('#'))return;
    const key=panelPaths[local.toLowerCase()];if(!key||raw.includes('#'))return;
    // Enhance the real link only after successful opening; otherwise let the
    // browser follow the ordinary HTML URL rather than trapping navigation.
    try{show(key,{push:true});event.preventDefault();}
    catch(error){console.error('Workspace kunne ikke åbnes; bruger almindelig side.',error);}
  });
  root.addEventListener('click',e=>{
    if(e.target.closest('[data-ws-close]')){hide();return;}
    const switchBtn=e.target.closest('[data-ws-switch]');
    if(switchBtn){
      const key=switchBtn.dataset.wsSwitch;
      try{show(key,{push:true});}
      catch(error){console.error('Workspace-skift fejlede; åbner almindelig side.',error);window.location.assign(key==='projekt'?'projekt.html':content[key].page);}
      return;
    }
    const tab=e.target.closest('[data-ws-tab]');if(tab){selectIndex(Number(tab.dataset.wsTab));return;}
  });
  root.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();hide();return;}
    if(e.key==='Tab'){
      const items=[...root.querySelectorAll('button,a[href],input,textarea,select,[tabindex="0"]')].filter(el=>el.getClientRects().length&&!el.disabled&&getComputedStyle(el).visibility!=='hidden');
      if(!items.length)return;
      const first=items[0],last=items[items.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
    if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)&&document.activeElement.matches('.datum-ws-tab')){
      e.preventDefault();const len=content[state.key].options.length;
      let index=e.key==='Home'?0:e.key==='End'?len-1:(state.index+(e.key==='ArrowRight'?1:-1)+len)%len;
      selectIndex(index);$('#datum-ws-tab-'+state.index).focus();
    }
  });
  window.addEventListener('popstate',()=>{
    const query=new URLSearchParams(location.search);
    const key=query.get('workspace');
    if(content[key]||key==='projekt'){
      const same=state.key===key;
      if(!same){show(key,{push:false,restoreFocus:false,detail:query.get('detail')});state.pushed=false;}
      else if(key!=='projekt'){selectIndex(Math.max(0,content[key].options.findIndex(x=>x.number===query.get('detail'))),{updateURL:false});}
    }else if(state.key)hide({historyNavigation:false});
  });
  if(content[initial]||initial==='projekt'){
    show(initial,{push:false,restoreFocus:false,detail:params.get('detail')});state.pushed=false;
  }
})();
