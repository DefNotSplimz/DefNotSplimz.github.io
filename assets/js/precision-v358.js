/* Datum Prototyping v3.5.6 — Precision Desk: examples, not shop capability claims */
(()=>{
 const items={
  dimensions:{n:'01',eyebrow:'NÅR MÅLET ER AFGØRENDE',title:'DET RIGTIGE<br>MÅL, DER HVOR<br>DET TÆLLER.',symbol:'±',description:'Et kritisk mål kræver mere omtanke end et tal på en tegning. Vi ser på funktion, valgt materiale og hvilken tolerance der faktisk er nødvendig og mulig at kontrollere.',value:'Ø20,00 <span>±0,05</span>',reference:'Eksempel på et målsat emne. Tolerancen er kun en illustration – ikke en generel kapacitet eller et løfte om en bestemt pasning.',left:'NEDRE MÅL / 19,95',right:'ØVRE MÅL / 20,05',why:'Er målet afgørende for pasform, bevægelse eller montering?',send:'En skitse, et foto, et relevant mål eller en eksisterende del.',check:'Metode, måleudstyr og realistiske krav til netop den opgave.',context:'Mål og tolerancer'},
  fits:{n:'02',eyebrow:'NÅR TO DELE SKAL SAMARBEJDE',title:'PASNINGER<br>DER FAKTISK<br>FUNGERER.',symbol:'↔',description:'En aksel og en bøsning skal måske kunne glide, rotere eller sidde fast. Vi ser på det praktiske samspil, før vi aftaler mål og en mulig pasning.',value:'HUL <span>↔ AKSEL</span>',reference:'Eksempel: en ny bøsning skal passe til en eksisterende aksel. Samlingens funktion bestemmer, om der skal være frigang eller fast greb.',left:'FUNKTION / BEVÆGELSE',right:'KRAV / MONTERING',why:'Skal delene glide, dreje, centrere eller fastlåses?',send:'Gerne både de dele, der skal passe sammen – eller deres relevante mål.',check:'Opmåling, materialer, tolerancer og kontrol af samspillet.',context:'Pasninger og samling'},
  surface:{n:'03',eyebrow:'NÅR OVERFLADEN ER EN DEL AF FUNKTIONEN',title:'FINISH ER<br>MERE END<br>UDSEENDE.',symbol:'≋',description:'En overflade kan have betydning for berøring, tætning, bevægelse og udseende. Vi vurderer bearbejdningsspor, kanter, grater og finish efter delens brug.',value:'FORM <span>+ FINISH</span>',reference:'Eksempel: en synlig aluminiumskomponent skal være behagelig at håndtere og fri for generende grater – mens en kontaktflade kan have særlige funktionskrav.',left:'OVERFLADE / ANVENDELSE',right:'KANTER / EFTERBEHANDLING',why:'Er delen synlig, i kontakt med andre dele eller tæt på hænder?',send:'Et referencefoto eller beskrivelse af, hvordan overfladen skal bruges.',check:'Værktøj, bearbejdningsstrategi, afgratning og mulig efterbehandling.',context:'Overflade og finish'},
  control:{n:'04',eyebrow:'NÅR VI SKAL VIDE AT DET PASSER',title:'MÅLINGER<br>MED ET<br>FORMÅL.',symbol:'✓',description:'Kontrollen skal svare til delens krav. Nogle dimensioner kan tjekkes med skydelære; andre kan kræve mikrometer, måleur eller en praktisk pasningsprøve.',value:'MÅL <span>→ KONTROL</span>',reference:'Eksempel: et beslag skal passe på eksisterende bolthuller. Hulafstand, placering og den faktiske montering kan være vigtigere end at kontrollere alle mål ens.',left:'KRITISKE MÅL',right:'FUNKTIONSKONTROL',why:'Hvilke mål eller egenskaber afgør, om delen kan bruges?',send:'Tegning, oplyste tolerancekrav eller moddel til afprøvning.',check:'Relevant målemetode, mulighed for afprøvning og aftalt dokumentation.',context:'Kontrol og afprøvning'}
 };
 const choices=[...document.querySelectorAll('.precision-choice')];
 if(!choices.length)return;
 let selected='dimensions';
 const $=id=>document.getElementById(id);
 function choose(key){const d=items[key];if(!d)return;selected=key;
  choices.forEach(b=>{const on=b.dataset.precision===key;b.classList.toggle('is-current',on);b.setAttribute('aria-pressed',String(on))});
  $('precisionDetailIndex').textContent='VALGT FOKUS / '+d.n;
  $('precisionDetailEyebrow').textContent=d.eyebrow;
  $('precisionDetailTitle').innerHTML=d.title;
  $('precisionDetailSymbol').textContent=d.symbol;
  $('precisionDetailDescription').textContent=d.description;
  $('precisionReferenceIndex').textContent=d.n+' / 04';
  $('precisionReferenceValue').innerHTML=d.value;
  $('precisionReferenceCopy').textContent=d.reference;
  $('precisionReferenceLeft').textContent=d.left;
  $('precisionReferenceRight').textContent=d.right;
  $('precisionWhy').textContent=d.why;
  $('precisionSend').textContent=d.send;
  $('precisionCheck').textContent=d.check;
 }
 choices.forEach((b,i)=>{
  b.addEventListener('click',()=>choose(b.dataset.precision));
  b.addEventListener('keydown',e=>{
   if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft'].includes(e.key))return;
   e.preventDefault();const n=(i+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1)+choices.length)%choices.length;
   choices[n].focus();choose(choices[n].dataset.precision);
  });
 });
 choose(selected);
 $('precisionProjectLink').addEventListener('click',()=>{
  const d=items[selected];
  $('processInterest').value=d.context;
  $('briefContextName').textContent=d.context;
  $('briefContextSource').textContent='FRA PRECISION DESK:';
  $('briefContext').hidden=false;
  const outcome=$('briefOutcome');if(outcome)outcome.hidden=true;
  const form=$('projectForm');if(form)form.dispatchEvent(new Event('change',{bubbles:true}));
  const specs=$('projectSpecs');if(specs && !specs.value.trim()) specs.placeholder='Beskriv evt. relevante mål, pasning eller finish – du behøver ikke kende en tolerance.';
 });
})();
