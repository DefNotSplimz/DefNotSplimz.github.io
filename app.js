'use strict';
const projects={
flame:{title:'Flame Eater Engine',index:'01 / MODELMOTOR',image:'flame-engine.webp',material:'Messing · aluminium · stål',process:'Manuel fræsning og drejning',focus:'Pasning mellem cylinder og stempel',intro:'Flame Eater Engine er det projekt, jeg er mest stolt af. Jeg fremstillede selv alle delene bortset fra kuglelejerne, som er indkøbt.',challenge:'Den største udfordring var at få pasningen mellem cylinder og stempel rigtig. Her mødes kravene til bevægelse og tæthed i to dele, der skal fungere sammen.',solution:'Motoren kører tørt uden smøring, så jeg justerede løbende pasningen mellem cylinder og stempel. Jeg brugte GO/NO-GO-lærer til målkontrol og afprøvede delene sammen undervejs. De tre FAI-rapporter dokumenterer kontrollen af cylinder og stempel, knast og svinghjul.',learning:'At kontrollere de kritiske mål undervejs og tænke pasninger ind som en del af konstruktionen.',docs:[['FAI 01','Cylinder og stempel','fai-01.html'],['FAI 02','Knast (Cam Disc)','fai-02-camdisc.html'],['FAI 03','Svinghjul','fai-03-flywheel.html']]},
ring:{title:'Ring Bender',index:'02 / SPECIALVÆRKTØJ',image:'ring-bender.webp',material:'Aluminium 6082 · stål',process:'CNC-fræsning · Haas Mini Mill',focus:'Stivhed under bukning',intro:'En manuel ringbøjer, hvor jeg har arbejdet med at erstatte en eftergivende, 3D-printet konstruktion med et stivere værktøj i metal.',challenge:'Det tidligere 3D-printede værktøj gav for meget efter under bukning. Konstruktionen skulle derfor være stivere og bedre kunne optage belastningen.',solution:'Bearbejdet aluminium og stål erstatter den fleksible konstruktion. De belastede flader og de enkelte deles samspil er centrale for løsningen.',learning:'At materialevalg og stivhed er afgørende, når en CAD-model skal fungere som værktøj i praksis.',docs:[]},
tac:{title:'Tac Table',index:'03 / CNC-BEARBEJDNING',image:'tac-table.webp',material:'EN AW-6082-T6',process:'CNC-fræsning · Haas Mini Mill',focus:'Opspænding og planhed',intro:'En plade med aflange spor, bearbejdet fra et 30 mm tykt råemne til en færdig tykkelse på 10 mm.',challenge:'Når meget materiale fjernes, kan indre spændinger trække emnet skævt. Planhed og en stabil opspænding er derfor centrale i processen.',solution:'Bearbejdningen er opdelt i operationer med skrubning, løsning og genopspænding. Lavt spændemoment før sletbearbejdning hjælper med at begrænse deformation. Setup sheetet samler værktøjer, nulpunktsskift og kontrolpunkter.',learning:'At rækkefølgen af operationer og måden, emnet spændes op på, er lige så vigtig som selve værktøjsbanerne.',docs:[['SETUP SHEET','Tac Table · værktøjer og operationer','setup-tactable.html']]}
};
const dialog=document.querySelector('#project-dialog');let opener=null;
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',event=>{
if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();
const p=projects[button.dataset.project];opener=button;
document.querySelector('#project-index').textContent=p.index;
document.querySelector('#project-content').innerHTML=`<figure class="dialog-visual"><img src="images/${p.image}" alt="Visualisering af ${p.title}" width="1536" height="1024"><figcaption>AI-visualisering baseret på min CAD-rendering.</figcaption></figure><div class="dialog-copy"><h2 id="project-title">${p.title}</h2><p class="dialog-intro">${p.intro}</p><dl class="project-facts"><div><dt>Materiale</dt><dd>${p.material}</dd></div><div><dt>Proces</dt><dd>${p.process}</dd></div><div><dt>Fokus</dt><dd>${p.focus}</dd></div></dl><div class="project-story"><section><h3>Udfordringen</h3><p>${p.challenge}</p></section><section><h3>Min fremgangsmåde</h3><p>${p.solution}</p></section></div><section class="project-learning"><h3>Det tager jeg med videre</h3><p>${p.learning}</p></section>${p.docs.length?`<section class="project-documents"><h3>Dokumentation</h3><p>${p.docs.length===3?'Tre FAI-rapporter (First Article Inspection) med mål og kontrolresultater.':'Opspænding, værktøjsliste og operationsrækkefølge.'}</p><div class="doc-links">${p.docs.map(d=>`<a href="documents/${d[2]}"><span class="doc-kind">${d[0]}</span><strong>${d[1]}</strong><span aria-hidden="true">→</span></a>`).join('')}</div></section>`:''}</div>`;
dialog.showModal();document.body.classList.add('dialog-open');dialog.scrollTop=0;dialog.querySelector('.dialog-close').focus();
}));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');opener?.focus();});
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
const form=document.querySelector('#request-form'),result=document.querySelector('#template-result'),output=document.querySelector('#request-template'),status=document.querySelector('#template-status'),stale=document.querySelector('#template-stale');
const types={prototype:['Prototype','Jeg vil gerne have hjælp til en prototype.','Formål og hvad prototypen skal afprøve'],part:['Enkeltstående del / reservedel','Jeg vil gerne have hjælp til en enkeltstående del eller reservedel.','Funktion, mål og hvad delen skal passe sammen med'],series:['Mindre serie','Jeg vil gerne have vurderet en mindre serie.','Funktion, ensartethed og eventuelle gentagne leverancer'],cad:['CAD / konstruktion','Jeg vil gerne have hjælp til CAD og konstruktion.','Funktion, pladsforhold og ønsket filformat'],fixture:['Fikstur / specialværktøj','Jeg vil gerne have hjælp til et fikstur eller specialværktøj.','Emnet, belastningen og hvordan værktøjet skal bruges'],other:['Afklaring af opgave','Jeg har en idé, som jeg gerne vil have hjælp til at afklare.','Min idé og det, jeg har brug for hjælp til']};
form.addEventListener('input',()=>{if(!result.hidden)stale.hidden=false;});
form.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(form),type=types[f.get('type')],get=k=>String(f.get(k)||'').trim();const assets=f.getAll('assets');
output.value=get('contact-kind')==='job'?`Emne: Job og faglig dialog\n\nHej Glen,\n\n${get('job-description')||'[Beskriv muligheden eller det, du gerne vil tale om]'}\n\nJeg hører gerne fra dig.\n\nVenlig hilsen\n${get('name')||'[Dit navn]'}${get('email')?'\n'+get('email'):''}`:`Emne: Forespørgsel — ${type[0]}\n\nHej Glen,\n\n${type[1]}\n\n${type[2]}:\n${get('description')||'[Beskriv opgaven her]'}\n\nMateriale: ${get('material')}\nAntal: ${get('quantity')||'Ikke afklaret'}\nØnsket levering: ${get('deadline')||'Efter aftale'}\n\nGrundlag, jeg kan sende:\n${assets.length?assets.map(x=>'• '+x).join('\n'):'Jeg har endnu ikke tegninger eller filer klar.'}\n\nKritiske mål og tolerancer: [Angiv krav, eller skriv at de skal afklares]\n\nKan du vurdere, om opgaven passer til dine muligheder, og hvilket grundlag du eventuelt mangler?\n\nVenlig hilsen\n${get('name')||'[Dit navn]'}${get('email')?'\n'+get('email'):''}`;
result.hidden=false;stale.hidden=true;status.textContent='Udkastet er klar. Tilpas teksten, kopiér den, og send den fra din egen mail.';output.focus();
});
document.querySelector('#copy-template').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(output.value);status.textContent='Teksten er kopieret.';}catch{output.focus();output.select();status.textContent='Teksten er markeret. Brug Kopiér på din enhed, eller hent tekstfilen.';}});
document.querySelector('#download-template').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([output.value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='datum-forespoergsel.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Dit beskedudkast er hentet som tekstfil.';});




document.querySelector("#copy-email").addEventListener("click",async()=>{
 const message=document.querySelector("#email-copy-status");
 const fallback=document.querySelector("#email-copy-fallback");
 try{await navigator.clipboard.writeText("datumprototyping@gmail.com");fallback.hidden=true;message.textContent="Mailadressen er kopieret.";}
 catch{fallback.hidden=false;fallback.focus();fallback.select();message.textContent="Adressen er markeret. Vælg Kopiér på din enhed.";}
});


function setContactKind(kind){
 document.querySelector('[name="contact-kind"][value="'+kind+'"]').checked=true;
 for(const [id,active] of [['task-fields',kind==='task'],['job-fields',kind==='job']]){const field=document.getElementById(id);field.hidden=!active;field.disabled=!active;}
 if(!result.hidden)stale.hidden=false;
}
form.querySelectorAll('[name="contact-kind"]').forEach(r=>r.addEventListener('change',()=>setContactKind(r.value)));
document.querySelectorAll('[data-contact-kind]').forEach(a=>a.addEventListener('click',()=>setContactKind(a.dataset.contactKind)));
form.addEventListener('invalid',e=>{const details=e.target.closest('details');if(details)details.open=true;},true);
