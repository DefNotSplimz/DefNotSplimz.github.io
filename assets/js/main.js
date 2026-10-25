/* Datum Prototyping / Experience v3.4.2 — method image initialization fix */
(()=>{
 const map={
  'cnc-mill':{n:'01',name:'CNC-FRÆSNING',desc:'Til former og detaljer, hvor CNC-værktøjsbaner giver god kontrol over geometri og gentagelighed.',uses:'Beslag, adaptere, lommer og specialgeometri',fit:'Prototyper, enkeltdele og mindre serier',criteria:'Geometri, værktøjsadgang og materiale'},
  'cnc-turn':{n:'02',name:'CNC-DREJNING',desc:'Når rotationssymmetriske dele skal bearbejdes med kontrollerede mål og ensartet geometri.',uses:'Aksler, bøsninger, gevind og afstandsstykker',fit:'Drejede prototyper og gentagne emner',criteria:'Diameter, opspænding og tolerancer'},
  'manual-mill':{n:'03',name:'MANUEL FRÆSNING',desc:'Direkte maskinbearbejdning med fleksibel opspænding, løbende vurdering og praktisk tilpasning.',uses:'Tilpasninger, spor, flader og enkle beslag',fit:'Enkeltstyk og ændringer undervejs',criteria:'Adgang, opspænding og bearbejdningsrækkefølge'},
  'manual-turn':{n:'04',name:'MANUEL DREJNING',desc:'Klassisk drejning, når et enkelt emne eller en reparation bedst løses direkte ved maskinen.',uses:'Bøsninger, aksler, pasninger og reparationer',fit:'Specialmål, enkeltdele og prototyper',criteria:'Opmåling, opspænding og emneform'},
  'printing':{n:'05',name:'3D-PRINT',desc:'FDM-print af funktionelle plastemner – hurtigt fra digital model til en fysisk del, der kan prøves og forbedres.',uses:'Prøveemner, holdere, kapslinger og fiksturer',fit:'Formprøver, testmodeller og funktionelle dele',criteria:'Materiale, lagretning og belastning'}
 };
 const buttons=[...document.querySelectorAll('.method-btn')],photo=document.getElementById('methodPhoto');let methodTimeout;
 // Use the selected method for the first render; do not require an interaction to show its image.
 const pick=(id, immediate=false)=>{
  const m=map[id];
  if(!m)return;
  buttons.forEach(b=>b.setAttribute('aria-selected',String(b.dataset.method===id)));
  clearTimeout(methodTimeout);
  if(!immediate)photo.style.opacity='.42';
  const render=()=>{
   photo.style.backgroundImage=`url("assets/images/${id}.webp")`;
   photo.setAttribute('aria-label',`Illustrationsfoto af ${m.name.toLowerCase()}`);
   document.getElementById('methodNumber').textContent=m.n;
   document.getElementById('methodCaption').textContent='VALGT PROCES / '+m.n;
   document.getElementById('methodLabel').textContent=m.name;
   document.getElementById('methodDescription').textContent=m.desc;
   document.querySelector('.dossier-heading span').textContent='METODEKORT / '+m.n;
   document.getElementById('methodApplications').textContent=m.uses;
   document.getElementById('methodSuitable').textContent=m.fit;
   document.getElementById('methodCriteria').textContent=m.criteria;
   photo.style.opacity='1';
  };
  if(immediate) render();
  else methodTimeout=setTimeout(render,100);
 };
 // Also keep HTML and state consistent if the default selected method changes later.
 pick(buttons.find(b=>b.getAttribute('aria-selected')==='true')?.dataset.method || 'cnc-mill',true);
 buttons.forEach((b,i)=>{b.addEventListener('click',()=>pick(b.dataset.method));b.addEventListener('keydown',e=>{if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();const next=(i+((e.key==='ArrowDown'||e.key==='ArrowRight')?1:-1)+buttons.length)%buttons.length;buttons[next].focus();pick(buttons[next].dataset.method)}})});
 const methodProject=document.getElementById('methodProject');methodProject.addEventListener('click',()=>{const btn=buttons.find(b=>b.getAttribute('aria-selected')==='true');const chosen=map[btn.dataset.method].name;document.getElementById('processInterest').value=chosen;document.getElementById('briefContextName').textContent=chosen;document.getElementById('briefContext').hidden=false});
 document.getElementById('briefClearContext').addEventListener('click',()=>{document.getElementById('processInterest').value='';document.getElementById('briefContext').hidden=true});
 const stages={
 discover:{n:'01',kicker:'UNDERSØG',label:'FORSTÅ FØR VI FREMSTILLER',title:'VI STARTER MED<br>DET, DER IKKE<br>VIRKER.',text:'Det kan være en løs skitse, en ødelagt reservedel, en CAD-fil eller et problem uden en oplagt løsning. Vi afklarer funktion, begrænsninger og hvilke oplysninger, der mangler.',image:'idea.webp',alt:'Skitser, digital model og fysisk prototype i et udviklingsforløb'},
 develop:{n:'02',kicker:'KONSTRUÉR',label:'MULIGHEDER BLIVER TIL GEOMETRI',title:'VI FORMER<br>DET, DER<br>MANGLER.',text:'En idé kan kræve opmåling, en ny CAD-model, materialevalg eller flere mulige konstruktioner. Formålet er at gøre den næste beslutning teknisk forståelig.',image:'cad.webp',alt:'CAD-konstruktion og teknisk tegning på en arbejdsstation'},
 realize:{n:'03',kicker:'REALISÉR',label:'FRA MODEL TIL BRUGBAR DEL',title:'VI FÅR<br>DET UD I<br>VIRKELIGHEDEN.',text:'Fremstillingsmetoden vælges efter opgavens krav. Derefter vurderes mål og funktion, og delens konstruktion kan justeres, hvis testen peger på en bedre løsning.',image:'inspection.webp',alt:'Illustration af kontrolmåling på en bearbejdet komponent'}
 };
 document.querySelectorAll('.process-step').forEach(b=>b.addEventListener('click',()=>{const x=stages[b.dataset.step];document.querySelectorAll('.process-step').forEach(p=>{p.classList.toggle('is-active',p===b);p.setAttribute('aria-pressed',String(p===b))});document.getElementById('processImage').src='assets/images/'+x.image;document.getElementById('processImage').alt=x.alt;document.getElementById('processIndex').textContent=x.n+' / '+x.kicker;document.getElementById('processVisualLabel').textContent=x.label;document.getElementById('processTitle').innerHTML=x.title;document.getElementById('processText').textContent=x.text}));
 const materialData={
  metals:{kicker:'01 / METALLER',title:'MATERIALET<br>SKAL PASSE<br>TIL OPGAVEN.',desc:'Fra aluminium og messing til almindeligt stål, rustfrit/syrefast stål og værktøjsstål. Valget afhænger af funktion, belastning, miljø og krav til bearbejdning.',chips:['ALUMINIUM','MESSING','STÅL','RUSTFRIT / SYREFAST STÅL','VÆRKTØJSSTÅL'],image:'materials.webp',imgAlt:'Illustration af forskellige metal- og plastemner',label:'METALBEARBEJDNING',caveat:'Materialekvalitet, mål og fremstillingsmulighed afklares for hver opgave.'},
  polymers:{kicker:'02 / PLAST & FDM',title:'FRA MASSIV<br>PLAST TIL<br>3D-PRINT.',desc:'POM (Delrin), akryl og nylon kan bearbejdes til præcise plastdele. Derudover fremstiller vi FDM-print i forskellige plastfilamenter, eksempelvis PLA. Bearbejdet plast og 3D-print er to forskellige metoder.',chips:['POM / DELRIN','AKRYL','NYLON','FDM-PLAST (FX PLA)'],image:'printing.webp',imgAlt:'FDM-3D-printer med sort plastemne i fremstilling',label:'BEARBEJDET PLAST / 3D-PRINT',caveat:'Filamenttype, holdbarhed og egnethed til opgaven vurderes individuelt.'}
 };
 const materialTabs=[...document.querySelectorAll('.material-tab')];
 const selectMaterial=(b)=>{const x=materialData[b.dataset.material];if(!x)return;materialTabs.forEach(t=>{t.classList.toggle('is-active',t===b);t.setAttribute('aria-selected',String(t===b))});document.getElementById('materialKicker').textContent=x.kicker;document.getElementById('materialTitle').innerHTML=x.title;document.getElementById('materialDescription').textContent=x.desc;const im=document.getElementById('materialImage');im.src='assets/images/'+x.image;im.alt=x.imgAlt;document.getElementById('materialPhotoLabel').textContent=x.label;document.getElementById('materialPhotoNumber').textContent='MATERIALER / '+x.kicker.slice(0,2);document.getElementById('materialCaveat').textContent=x.caveat;document.getElementById('materialExamples').replaceChildren(...x.chips.map(label=>{const span=document.createElement('span');span.textContent=label;return span}));};
 materialTabs.forEach((b,i)=>{b.addEventListener('click',()=>selectMaterial(b));b.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const direction=['ArrowRight','ArrowDown'].includes(e.key)?1:-1;const next=materialTabs[(i+direction+materialTabs.length)%materialTabs.length];next.focus();selectMaterial(next)}})});
 const briefTypes={
 'Idé':{title:'EN IDÉ.',hint:'Fortæl hvad du forestiller dig, og hvad løsningen skal kunne.',placeholder:'Hvad forestiller du dig, og hvad skal det bruges til?'},
 'Del':{title:'EN DEL.',hint:'En løs reservedel, noget der skal tilpasses eller en komponent du mangler.',placeholder:'Hvilken del har du brug for, og hvad skal den passe til?'},
 'Foto':{title:'ET FOTO.',hint:'Et billede kan være nok til at starte dialogen. Beskriv gerne hvad vi skal se.',placeholder:'Hvad viser billedet, og hvad har du brug for hjælp til?'},
 'Skitse':{title:'EN SKITSE.',hint:'En håndtegning er et fint udgangspunkt. Forklar kort hvad den skal bruges til.',placeholder:'Hvad viser din skitse, og hvad skal løsningen kunne?'},
 'CAD / tegning':{title:'EN TEGNING.',hint:'En CAD-fil eller tegning kan bruges som udgangspunkt for en vurdering.',placeholder:'Hvad skal fremstilles? Skriv gerne materiale, funktion eller særlige krav.'},
 'Ingen anelse':{title:'ET PROBLEM.',hint:'Du behøver ikke kende metoden. Beskriv blot hvad der ikke virker.',placeholder:'Hvad er problemet, og hvad ville en god løsning gøre for dig?'}
 };
 let kind='Idé';let preparedText='';
 const form=document.getElementById('projectForm'),details=document.getElementById('briefExtra'),expand=document.getElementById('briefDetailsToggle'),counter=document.getElementById('descriptionCounter'),description=document.getElementById('projectDescription'),files=document.getElementById('projectFiles');
 document.querySelectorAll('.brief-type').forEach(btn=>btn.addEventListener('click',()=>{kind=btn.dataset.kind;document.querySelectorAll('.brief-type').forEach(b=>{const active=b===btn;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});const type=briefTypes[kind];document.getElementById('briefTypeTitle').textContent=type.title;document.getElementById('briefTypeHint').textContent=type.hint;description.placeholder=type.placeholder;document.getElementById('briefOutcome').hidden=true;}));
 description.addEventListener('input',()=>{counter.textContent=description.value.length+' / 2500';document.getElementById('briefError').hidden=true});
 expand.addEventListener('click',()=>{details.hidden=!details.hidden;expand.setAttribute('aria-expanded',String(!details.hidden));document.getElementById('briefDetailsGlyph').textContent=details.hidden?'↗':'↘'});
 files.addEventListener('change',()=>{const all=[...files.files];document.getElementById('selectedFiles').textContent=all.length?all.map(f=>f.name).join('  ·  '):'';document.getElementById('fileNotice').textContent=all.length?'Filerne er kun valgt lokalt. Husk at vedhæfte dem selv i din e-mail.':'Filer uploades ikke her. Vedhæft dem selv, når du opretter din e-mail.'});
 const byId=id=>document.getElementById(id).value.trim();
 const buildBrief=()=>[
 'Hej Datum Prototyping,', '',
 'Jeg vil gerne høre om en mulig opgave.', '',
 'UDGANGSPUNKT: '+kind, '', 'METODEINTERESSE: '+(byId('processInterest')||'Åben for forslag'),'',
 'OPGAVEBESKRIVELSE:',byId('projectDescription'),'',
 'MATERIALE: '+(byId('projectMaterial')||'Ikke oplyst'),
 'ANTAL: '+(byId('projectQuantity')||'Ikke oplyst'),
 'MÅL / KRAV: '+(byId('projectSpecs')||'Ikke oplyst'),'',
 'FILER TIL VEDHÆFTNING: '+([...files.files].map(f=>f.name).join(', ')||'Ingen valgt'),
 'Bemærk: Eventuelle filer vedhæftes manuelt til denne mail.','',
 'KONTAKT:', 'Navn: '+byId('clientName'),
 'E-mail: '+byId('clientEmail'),
 'Telefon: '+(byId('clientPhone')||'Ikke oplyst'),
 'Firma: '+(byId('clientCompany')||'Privat / ikke oplyst'),'',
 'Med venlig hilsen',byId('clientName')
 ].join('\n');
 form.addEventListener('submit',event=>{event.preventDefault();const error=document.getElementById('briefError');if(!form.checkValidity()){error.hidden=false;form.reportValidity();return}error.hidden=true;preparedText=buildBrief();const outcome=document.getElementById('briefOutcome');outcome.hidden=false;document.getElementById('briefPreviewText').value=preparedText;document.getElementById('briefCopyStatus').textContent='';outcome.scrollIntoView({behavior:'smooth',block:'nearest'})});
 const copyToClipboard=async value=>{
   try{if(!navigator.clipboard||!navigator.clipboard.writeText)throw new Error('Clipboard API utilgængelig');await navigator.clipboard.writeText(value);return true}
   catch(e){const ta=document.createElement('textarea');ta.value=value;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';document.body.appendChild(ta);ta.focus();ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(err){}ta.remove();return ok}
 };
 document.getElementById('copyBriefEmail').addEventListener('click',async()=>{
   const address='DatumPrototyping@gmail.com';const status=document.getElementById('briefCopyStatus');
   const copied=await copyToClipboard(address);
   status.textContent=copied?'E-mailadressen er kopieret: '+address:'Kunne ikke kopiere automatisk. Markér adressen manuelt: '+address;
 });
 document.getElementById('copyBrief').addEventListener('click',async()=>{
   if(!preparedText)return;const status=document.getElementById('briefCopyStatus');
   const copied=await copyToClipboard(preparedText);
   status.textContent=copied?'Projektteksten er kopieret. Indsæt den i dit mailprogram.':'Kunne ikke kopiere automatisk. Markér og kopiér teksten i feltet ovenfor.';
 });
 const progress=document.getElementById('pageProgress'),globalNav=document.getElementById('nav');
 let raf=false;function scrollUI(){raf=false;const sc=document.documentElement.scrollTop||document.body.scrollTop;progress.style.width=(100*sc/Math.max(1,document.documentElement.scrollHeight-innerHeight))+'%';globalNav.classList.toggle('is-scrolled',sc>85)};
 addEventListener('scroll',()=>{if(!raf){raf=true;requestAnimationFrame(scrollUI)}},{passive:true});scrollUI();
 const menu=document.getElementById('menuButton'),nav=document.getElementById('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
})();
