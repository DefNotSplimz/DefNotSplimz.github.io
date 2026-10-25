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
 const methodProject=document.getElementById('methodProject');methodProject.addEventListener('click',()=>{const btn=buttons.find(b=>b.getAttribute('aria-selected')==='true');const chosen=map[btn.dataset.method].name;document.getElementById('processInterest').value=chosen;document.getElementById('briefContextName').textContent=chosen;document.getElementById('briefContextSource').textContent='FRA KOMPETENCEOVERSIGTEN:';document.getElementById('briefContext').hidden=false;resetPreview()});
 document.getElementById('briefClearContext').addEventListener('click',()=>{document.getElementById('processInterest').value='';document.getElementById('briefContext').hidden=true;resetPreview()});
 // V3.5.5 — Process Workbench; one coherent example across all three phases.
 const stages={
  discover:{n:'01',kicker:'UNDERSØG',label:'FORSTÅ FØR VI FREMSTILLER',title:'FØRST<br>FORSTÅR VI<br>PROBLEMET.',text:'Hvad er det, der ikke virker – eller som endnu ikke findes? Vi afklarer funktion, mål, omgivelser og det, vi mangler at vide, før vi vælger en fremstillingsmetode.',start:'Et foto, en ødelagt del, en skitse eller blot en forklaring.',focus:'Funktion, pasform, brugssituation og begrænsninger.',outcome:'Et tydeligere billede af problemet og næste skridt.',example:'Et beslag er knækket, og en erstatning kan ikke købes. Vi begynder med den gamle del, fotos og en forklaring på, hvordan den skal belastes og monteres.',context:'Afklaring af idé eller problem',image:'idea.webp',alt:'Illustration af skitse, konstruktion og en fysisk mekanisk del'},
  develop:{n:'02',kicker:'KONSTRUÉR',label:'GØR BEHOVET TIL EN MULIG LØSNING',title:'VI FINDER<br>EN VEJ<br>VIDERE.',text:'Ud fra det afklarede behov vurderer vi form, materiale og fremstillingsmetode. Det kan indebære opmåling, en CAD-model, en forenklet konstruktion eller en hurtig test i plast.',start:'En funktion, omtrentlige mål eller en eksisterende del.',focus:'Geometri, materialevalg, tolerancebehov og bearbejdelighed.',outcome:'Et forslag eller et digitalt grundlag, der kan vurderes.',example:'Det knækkede beslag måles op. En ny model kan få ændret godstykkelse eller hulplacering, hvis funktionen og pladsen tillader en mere holdbar løsning.',context:'Konstruktion eller redesign',image:'cad.webp',alt:'CAD-konstruktion og teknisk tegning på en arbejdsstation'},
  realize:{n:'03',kicker:'REALISÉR',label:'FRA PLAN TIL FYSISK DEL',title:'VI FÅR<br>IDÉEN UD I<br>VIRKELIGHEDEN.',text:'Vi fremstiller den aftalte del med den metode, der passer til opgaven – manuel bearbejdning, CNC eller 3D-print. Derefter vurderes relevante mål, pasform og funktion.',start:'En aftalt geometri, materiale og relevante krav.',focus:'Opspænding, fremstillingsrækkefølge, finish og kontrol.',outcome:'En fysisk del til afprøvning – og mulighed for justering.',example:'En ny del fremstilles i et passende materiale og kontrolleres op imod de aftalte mål. Den prøves i samlingen, og eventuelle ændringer kan danne grundlag for en ny version.',context:'Fremstilling og kontrol',image:'inspection.webp',alt:'Illustration af kontrolmåling på en bearbejdet komponent'}
 };
 const processButtons=[...document.querySelectorAll('.process-step')];
 let currentProcess='discover';
 const showProcess=(key)=>{
  const stage=stages[key];if(!stage)return;currentProcess=key;
  processButtons.forEach(b=>{const selected=b.dataset.step===key;b.classList.toggle('is-active',selected);b.setAttribute('aria-pressed',String(selected))});
  const img=document.getElementById('processImage');img.src='assets/images/'+stage.image;img.alt=stage.alt;
  document.getElementById('processIndex').textContent=stage.n+' / '+stage.kicker;
  document.getElementById('processVisualLabel').textContent=stage.label;
  document.getElementById('processPosition').textContent='FASE '+stage.n+' / 03';
  document.getElementById('processWatermark').textContent=stage.n;
  document.getElementById('processTitle').innerHTML=stage.title;
  for(const [id,k] of [['processText','text'],['processStart','start'],['processFocus','focus'],['processOutcome','outcome'],['processExample','example']]) document.getElementById(id).textContent=stage[k];
 };
 processButtons.forEach((button,i)=>{button.addEventListener('click',()=>showProcess(button.dataset.step));button.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();const next=(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+processButtons.length)%processButtons.length;processButtons[next].focus();showProcess(processButtons[next].dataset.step)}})});
 showProcess(currentProcess);
 document.getElementById('processCta').addEventListener('click',()=>{
  const stage=stages[currentProcess];document.getElementById('processInterest').value=stage.context;
  document.getElementById('briefContextName').textContent=stage.context;
  document.getElementById('briefContextSource').textContent='FRA UDVIKLINGSPROCESSEN:';
  document.getElementById('briefContext').hidden=false;resetPreview();
 });
 // V3.5.7 — About Datum Prototyping: founder, work and future (no simulated achievements).
 const aboutData={
  person:{number:'01 / 03',eyebrow:'01 / MENNESKET BAG',title:'FAGET ER<br>PERSONLIGT.',text:'Glen er i gang med uddannelsen til finmekaniker, med forventet svendebrev i april 2027. Datum Prototyping bygger på erfaring fra virkelige bearbejdningsopgaver og et ønske om hele tiden at blive dygtigere.',a:'BAG NAVNET',av:'Glen',b:'NÆSTE MILEPÆL',bv:'Svendebrev / forventet april 2027'},
  work:{number:'02 / 03',eyebrow:'02 / DEN PRAKTISKE TILGANG',title:'FUNKTION<br>FØR FORM.',text:'En god løsning begynder med at forstå, hvad delen skal kunne. Vi vurderer manuelle metoder, CNC og 3D-print efter opgavens behov – og taler åbent om, hvad der kræver yderligere afklaring.',a:'FREMGANGSMÅDE',av:'Forstå → konstruér → fremstille',b:'FOKUS',bv:'Pasform, funktion og realistisk udførelse'},
  future:{number:'03 / 03',eyebrow:'03 / RETNINGEN',title:'AMBITIONEN<br>ER STØRRE.',text:'Målet er over tid at udvikle Datum Prototyping til en stærk dansk samarbejdspartner inden for specialfremstilling, prototyper og R&D. Det er en retning, vi arbejder hen imod – ikke noget vi påstår allerede at være.',a:'I DAG',av:'Selvstændigt, personligt værkstedsprojekt',b:'PÅ SIGT',bv:'Mere udvikling, engineering og R&D'}
 };
 const aboutTabs=[...document.querySelectorAll('.about-tab')];
 function selectAbout(key){const item=aboutData[key];if(!item)return;aboutTabs.forEach(button=>{const on=button.dataset.about===key;button.classList.toggle('is-active',on);button.setAttribute('aria-selected',String(on));button.tabIndex=on?0:-1});const panel=document.getElementById('aboutStoryPanel');panel.setAttribute('aria-labelledby','aboutTab-'+key);document.getElementById('aboutChapterCounter').textContent=item.number;document.getElementById('aboutStoryEyebrow').textContent=item.eyebrow;document.getElementById('aboutStoryTitle').innerHTML=item.title;document.getElementById('aboutStoryText').textContent=item.text;for(const [id,value] of [['aboutFactLabel1',item.a],['aboutFactValue1',item.av],['aboutFactLabel2',item.b],['aboutFactValue2',item.bv]])document.getElementById(id).textContent=value;}
 aboutTabs.forEach((button,i)=>{button.addEventListener('click',()=>selectAbout(button.dataset.about));button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();let n=event.key==='Home'?0:event.key==='End'?aboutTabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+aboutTabs.length)%aboutTabs.length;aboutTabs[n].focus();selectAbout(aboutTabs[n].dataset.about)})});
 selectAbout('person');
 const materialData={
  metals:{kicker:'01 / METALLER',title:'MATERIALET<br>SKAL PASSE<br>TIL OPGAVEN.',desc:'Fra aluminium og messing til almindeligt stål, rustfrit/syrefast stål og værktøjsstål. Valget afhænger af funktion, belastning, miljø og krav til bearbejdning.',chips:['ALUMINIUM','MESSING','STÅL','RUSTFRIT / SYREFAST STÅL','VÆRKTØJSSTÅL'],image:'materials.webp',imgAlt:'Illustration af forskellige metal- og plastemner',label:'METALBEARBEJDNING',caveat:'Materialekvalitet, mål og fremstillingsmulighed afklares for hver opgave.'},
  polymers:{kicker:'02 / PLAST & FDM',title:'FRA MASSIV<br>PLAST TIL<br>3D-PRINT.',desc:'POM (Delrin), akryl og nylon kan bearbejdes til præcise plastdele. Derudover fremstiller vi FDM-print i forskellige plastfilamenter, eksempelvis PLA. Bearbejdet plast og 3D-print er to forskellige metoder.',chips:['POM / DELRIN','AKRYL','NYLON','FDM-PLAST (FX PLA)'],image:'printing.webp',imgAlt:'FDM-3D-printer med sort plastemne i fremstilling',label:'BEARBEJDET PLAST / 3D-PRINT',caveat:'Filamenttype, holdbarhed og egnethed til opgaven vurderes individuelt.'}
 };
 const materialTabs=[...document.querySelectorAll('.material-tab')];
 const selectMaterial=(b)=>{const x=materialData[b.dataset.material];if(!x)return;materialTabs.forEach(t=>{t.classList.toggle('is-active',t===b);t.setAttribute('aria-selected',String(t===b))});document.getElementById('materialKicker').textContent=x.kicker;document.getElementById('materialTitle').innerHTML=x.title;document.getElementById('materialDescription').textContent=x.desc;const im=document.getElementById('materialImage');im.src='assets/images/'+x.image;im.alt=x.imgAlt;document.getElementById('materialPhotoLabel').textContent=x.label;document.getElementById('materialPhotoNumber').textContent='MATERIALER / '+x.kicker.slice(0,2);document.getElementById('materialCaveat').textContent=x.caveat;document.getElementById('materialExamples').replaceChildren(...x.chips.map(label=>{const span=document.createElement('span');span.textContent=label;return span}));};
 materialTabs.forEach((b,i)=>{b.addEventListener('click',()=>selectMaterial(b));b.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const direction=['ArrowRight','ArrowDown'].includes(e.key)?1:-1;const next=materialTabs[(i+direction+materialTabs.length)%materialTabs.length];next.focus();selectMaterial(next)}})});

 // V3.5.3 — six in-depth opportunity dossiers. These are examples, not claimed customer cases.
 const opportunityData={
  oneoff:{tag:'01 / 06 — UNIKT EMNE',title:'ONE-OF-ONE & SPECIALDELE',intro:'Når en standardkomponent ikke passer, kan en enkelt specialdel være den mest direkte løsning. Det kan være et nyt mål, en særlig form eller en funktion, der kræver tilpasning.',examples:[
   ['Specialholder til en bestemt genstand','En lille fræset eller 3D-printet holder med den rigtige hulafstand, vinkel eller frigang.'],
   ['Bøsning i utraditionelle mål','Én drejet bøsning eller et afstandsstykke, hvor standardmål ikke passer til samlingen.'],
   ['Unik mekanisk komponent','En særlig knap, kobling eller monteringsdel udviklet efter pladsen og funktionen.']
  ],input:'Send gerne et foto, en simpel skitse, omtrentlige mål og en forklaring på, hvad delen skal gøre.',kind:'Idé'},
  prototype:{tag:'02 / 06 — UDVIKLING',title:'PROTOTYPER',intro:'En prototype gør det muligt at undersøge pasform og funktion, før man beslutter sig for den endelige løsning. Den behøver ikke ligne et færdigt produkt fra første forsøg.',examples:[
   ['Første formprøve i FDM','Et 3D-print i plast til at kontrollere form, ergonomi eller monteringspunkter.'],
   ['Funktionel metalprototype','Et enkelt fræset eller drejet emne til afprøvning af mekanisk funktion eller samling.'],
   ['Version 02 efter en test','Små ændringer af hulplacering, frigang eller form, når den første prøve viser, hvad der skal forbedres.']
  ],input:'Fortæl hvad prototypen skal afprøve. En idé, håndskitse eller CAD-model er et godt udgangspunkt.',kind:'Idé'},
  replacement:{tag:'03 / 06 — RESERVEDEL',title:'ØDELAGTE & UDGÅEDE DELE',intro:'En knækket eller udgået reservedel kan nogle gange opmåles og fremstilles igen. Andre gange er det bedre at ændre konstruktionen, så den passer til det aktuelle behov.',examples:[
   ['Knækket beslag eller holdebeslag','En ny del efter den gamle, eventuelt med tilpasset geometri, hvor det giver mening.'],
   ['Slidt bøsning eller afstandsstykke','Opmåling af en slidt drejedel og vurdering af en erstatning i egnet materiale.'],
   ['Udgået plastikdel','En manglende plastkomponent, der kan undersøges til bearbejdning eller 3D-print ud fra foto, mål og anvendelse.']
  ],input:'Medbring eller fotografér helst den gamle del og dens monteringssted. Sikkerhedskritiske dele kræver særskilt vurdering.',kind:'Del'},
  adapter:{tag:'04 / 06 — TILPASNING',title:'ADAPTERE & BESLAG',intro:'Nogle gange fungerer delene hver for sig, men passer ikke sammen. Et lille beslag, en adapter eller et afstandsstykke kan gøre hele forskellen.',examples:[
   ['Adapter mellem to mål','En tilpasset overgang eller bøsning, der forbinder komponenter med forskellige dimensioner.'],
   ['Beslag med særlig hulafstand','Et monteringsbeslag, hvor standardvarer ikke matcher hulmønster, vinkel eller pladsforhold.'],
   ['Afstandsskiver og afstandsstykker','Drejede ringe eller simple afstandsdele, der giver korrekt placering eller frigang.']
  ],input:'Oplys gerne begge tilslutningsmål, hulafstande, billeder og de belastninger, der er relevante.',kind:'Del'},
  fixture:{tag:'05 / 06 — HJÆLPEMIDDEL',title:'FIKSTURER & HJÆLPEMIDLER',intro:'Et godt hjælpemiddel gør en opgave nemmere at udføre eller gentage. Det kan være en enkel holder, en boreguide eller en mere målrettet opspænding.',examples:[
   ['Bore- eller monteringsguide','En lille jig, som hjælper med at placere boringer eller dele ensartet.'],
   ['Emneholder eller opspændingsplade','En specialformet holder, der understøtter et emne under arbejde eller samling.'],
   ['Simpelt kontrolhjælpemiddel','En pasnings- eller placeringsskabelon, der gør det lettere at kontrollere en gentagen opgave.']
  ],input:'Beskriv arbejdsgangen, hvilken del der skal holdes, og hvad hjælpemidlet skal gøre lettere.',kind:'Idé'},
  series:{tag:'06 / 06 — GENTAGELSE',title:'SMÅ SERIER & FORBEDRINGER',intro:'Når den første del fungerer, kan der være brug for flere. En eksisterende konstruktion kan også forbedres ud fra erfaring med brug, montage eller slid.',examples:[
   ['En håndfuld ens bøsninger','Flere drejede dele i samme mål, hvor antal og gentagelighed vurderes efter opgaven.'],
   ['Gentagne beslag eller adaptere','En mindre serie ens komponenter frem for flere individuelle fremstillinger.'],
   ['Redesign af en eksisterende del','Justering af form, materiale eller monteringsprincip, når en første udgave har vist begrænsninger.']
  ],input:'Fortæl ønsket antal, om du har en eksisterende prøve eller tegning, og hvilke ændringer du ønsker.',kind:'Del'}
 };
 const opportunityKeys=Object.keys(opportunityData);
 const opDialog=document.getElementById('opportunityDialog');
 const opExamples=document.getElementById('opDialogExamples');
 let opportunitySelected='oneoff';
 let opportunityTrigger=null;
 function showOpportunity(key){
   const item=opportunityData[key];if(!item)return;
   opportunitySelected=key;
   document.getElementById('opDialogNum').textContent=item.tag;
   document.getElementById('opDialogTitle').textContent=item.title;
   document.getElementById('opDialogIntro').textContent=item.intro;
   document.getElementById('opDialogInput').textContent=item.input;
   document.getElementById('opDialogPosition').textContent=String(opportunityKeys.indexOf(key)+1).padStart(2,'0')+' / 06';
   opExamples.replaceChildren(...item.examples.map(([title,desc],i)=>{
     const row=document.createElement('div');row.className='op-dialog-example';
     const num=document.createElement('span');num.textContent=String(i+1).padStart(2,'0');
     const content=document.createElement('div');const heading=document.createElement('h3');heading.textContent=title;
     const text=document.createElement('p');text.textContent=desc;
     content.append(heading,text);row.append(num,content);return row;
   }));
   if(opDialog.open)opDialog.scrollTop=0;
 }
 document.querySelectorAll('.opportunity-open').forEach(btn=>btn.addEventListener('click',()=>{
   opportunityTrigger=btn;showOpportunity(btn.dataset.opportunity);opDialog.showModal();
 }));
 document.getElementById('opDialogClose').addEventListener('click',()=>opDialog.close());
 opDialog.addEventListener('click',e=>{if(e.target===opDialog)opDialog.close()});
 opDialog.addEventListener('close',()=>{opportunityTrigger?.focus({preventScroll:true})});
 document.getElementById('opDialogPrev').addEventListener('click',()=>showOpportunity(opportunityKeys[(opportunityKeys.indexOf(opportunitySelected)+5)%6]));
 document.getElementById('opDialogNext').addEventListener('click',()=>showOpportunity(opportunityKeys[(opportunityKeys.indexOf(opportunitySelected)+1)%6]));
 document.getElementById('opDialogCta').addEventListener('click',e=>{
   e.preventDefault();const item=opportunityData[opportunitySelected];
   document.getElementById('processInterest').value=item.title;
   document.getElementById('briefContextName').textContent=item.title;
   document.getElementById('briefContextSource').textContent='FRA MULIGHEDER:';
   document.getElementById('briefContext').hidden=false;resetPreview();
   document.querySelector(`.brief-type[data-kind="${item.kind}"]`)?.click();
   opportunityTrigger=null;opDialog.close();
   document.getElementById('projekt').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
   history.replaceState(null,'','#projekt');
 });

 const briefTypes={
 'Idé':{title:'EN IDÉ.',hint:'Fortæl hvad du forestiller dig, og hvad løsningen skal kunne.',placeholder:'Hvad forestiller du dig, og hvad skal det bruges til?'},
 'Del':{title:'EN DEL.',hint:'En løs reservedel, noget der skal tilpasses eller en komponent du mangler.',placeholder:'Hvilken del har du brug for, og hvad skal den passe til?'},
 'Foto':{title:'ET FOTO.',hint:'Et billede kan være nok til at starte dialogen. Beskriv gerne hvad vi skal se.',placeholder:'Hvad viser billedet, og hvad har du brug for hjælp til?'},
 'Skitse':{title:'EN SKITSE.',hint:'En håndtegning er et fint udgangspunkt. Forklar kort hvad den skal bruges til.',placeholder:'Hvad viser din skitse, og hvad skal løsningen kunne?'},
 'CAD / tegning':{title:'EN TEGNING.',hint:'En CAD-fil eller tegning kan bruges som udgangspunkt for en vurdering.',placeholder:'Hvad skal fremstilles? Skriv gerne materiale, funktion eller særlige krav.'},
 'Ingen anelse':{title:'ET PROBLEM.',hint:'Du behøver ikke kende metoden. Beskriv blot hvad der ikke virker.',placeholder:'Hvad er problemet, og hvad ville en god løsning gøre for dig?'}
 };
 let kind='Idé';let goal='';let preparedText='';
 const form=document.getElementById('projectForm'),details=document.getElementById('briefExtra'),expand=document.getElementById('briefDetailsToggle'),counter=document.getElementById('descriptionCounter'),description=document.getElementById('projectDescription'),files=document.getElementById('projectFiles');
 const getValidContact=()=>document.getElementById('clientName').value.trim().length>0&&document.getElementById('clientEmail').validity.valid&&document.getElementById('clientEmail').value.trim().length>0;
 const resetPreview=()=>{document.getElementById('briefOutcome').hidden=true;preparedText=''};
 const updateProjectLive=()=>{
   const hasTask=description.value.trim().length>=10;
   const hasContact=getValidContact();
   const count=1+Number(hasTask)+Number(hasContact);
   document.getElementById('briefLiveCount').textContent=String(count).padStart(2,'0')+' / 03';
   document.getElementById('briefLiveBar').style.width=(count/3*100)+'%';
   document.getElementById('briefLiveText').textContent=hasTask?(hasContact?'Du kan nu gennemse din projektbrief.':'Opgaven er beskrevet. Tilføj dine kontaktoplysninger.'): 'Start med at beskrive, hvad der skal løses.';
   document.getElementById('snapshotTask').textContent=hasTask?'OPGAVE BESKREVET':'OPGAVE AFVENTER';
   document.getElementById('snapshotContact').textContent=hasContact?'KONTAKT KLAR':'KONTAKT AFVENTER';
   document.getElementById('briefStage2').classList.toggle('is-ready',hasTask);
   document.getElementById('briefStage3').classList.toggle('is-ready',hasContact);
   document.getElementById('briefSubmit').classList.toggle('is-complete',hasTask&&hasContact);
 };
 const briefExamples={
   'Idé':'“Jeg har en idé til et lille beslag, der skal holde en sensor. Jeg kender ikke målene endnu, men det skal kunne skrues fast.”',
   'Del':'“Jeg mangler en bøsning til en maskine. Den gamle del er slidt, og jeg har den liggende, så den kan måles op.”',
   'Foto':'“Jeg har taget billeder af et beslag, som skal laves om. Den nye del skal passe på samme montering.”',
   'Skitse':'“Jeg har tegnet en simpel skitse af en adapter. Den skal forbinde to dele med forskellige hulafstande.”',
   'CAD / tegning':'“Jeg har en STEP-fil til en prototype i aluminium. Jeg vil gerne høre, om geometrien kan fremstilles, og om der er noget, der bør tilpasses.”',
   'Ingen anelse':'“En plastdel i mit udstyr er gået i stykker. Jeg ved ikke, hvad den hedder, men jeg kan vise den og forklare, hvad den gjorde.”'
 };
 const exampleToggle=document.getElementById('briefExampleToggle'),exampleBox=document.getElementById('briefExample');
 exampleToggle.addEventListener('click',()=>{exampleBox.hidden=!exampleBox.hidden;exampleToggle.setAttribute('aria-expanded',String(!exampleBox.hidden))});
 document.querySelectorAll('.brief-goal-chip').forEach(btn=>btn.addEventListener('click',()=>{goal=goal===btn.dataset.goal?'':btn.dataset.goal;document.querySelectorAll('.brief-goal-chip').forEach(b=>{const chosen=b.dataset.goal===goal;b.classList.toggle('is-selected',chosen);b.setAttribute('aria-pressed',String(chosen))});resetPreview()}));
 form.addEventListener('input',event=>{if(event.target!==description){resetPreview()}updateProjectLive()});
 form.addEventListener('change',()=>{resetPreview();updateProjectLive()});
 updateProjectLive();
 document.querySelectorAll('.brief-type').forEach(btn=>btn.addEventListener('click',()=>{kind=btn.dataset.kind;document.querySelectorAll('.brief-type').forEach(b=>{const active=b===btn;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});const type=briefTypes[kind];document.getElementById('briefTypeTitle').textContent=type.title;document.getElementById('briefTypeHint').textContent=type.hint;description.placeholder=type.placeholder;exampleBox.textContent=briefExamples[kind];resetPreview();updateProjectLive();}));
 description.addEventListener('input',()=>{counter.textContent=description.value.length+' / 2500';document.getElementById('briefError').hidden=true;resetPreview();updateProjectLive()});
 expand.addEventListener('click',()=>{details.hidden=!details.hidden;expand.setAttribute('aria-expanded',String(!details.hidden));document.getElementById('briefDetailsGlyph').textContent=details.hidden?'↗':'↘'});
 files.addEventListener('change',()=>{const all=[...files.files];document.getElementById('selectedFiles').textContent=all.length?all.map(f=>f.name).join('  ·  '):'';document.getElementById('fileNotice').textContent=all.length?'Filerne er kun valgt lokalt. Husk at vedhæfte dem selv i din e-mail.':'Filer uploades ikke her. Vedhæft dem selv, når du opretter din e-mail.'});
 const byId=id=>document.getElementById(id).value.trim();
 const buildBrief=()=>[
 'Hej Datum Prototyping,', '',
 'Jeg vil gerne høre om en mulig opgave.', '',
 'UDGANGSPUNKT: '+kind, '', 'OPGAVETYPE / METODE: '+(byId('processInterest')||'Åben for forslag'),'',
 'OPGAVEBESKRIVELSE:',byId('projectDescription'),'','VIGTIGST FOR MIG: '+(goal||'Ikke oplyst'),'',
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
