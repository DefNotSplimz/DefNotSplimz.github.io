/**
 * Machining_OS | Material Science Logic
 * Version: 5.0 (Heat Treat & Galvanic Control)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const htSelect = document.getElementById('ht-material');
    const htTemp = document.getElementById('ht-temp');
    const htMedium = document.getElementById('ht-medium');
    const htHrc = document.getElementById('ht-hrc');
    const htNote = document.getElementById('ht-note');

    const physDens = document.getElementById('phys-dens');
    const physAlpha = document.getElementById('phys-alpha');
    const physAe = document.getElementById('phys-ae');
    const physFz = document.getElementById('phys-fz');

    const galA = document.getElementById('gal-a');
    const galB = document.getElementById('gal-b');
    const galStatus = document.getElementById('gal-status');
    const galIndicator = document.getElementById('gal-indicator');
    const galAdvice = document.getElementById('gal-advice');

    // --- DATA: HEAT TREATMENT ---
    const HT_DB = {
        '1.2510': { temp: "780-820°C", medium: "OIL", hrc: "62-64 HRC", note: "O1 stål. Meget stabilt. Forvarm til 600°C før hærdning." },
        '1.2379': { temp: "1020-1040°C", medium: "AIR", hrc: "58-62 HRC", note: "D2 stål. Ekstrem slidstyrke. Kræver langsom køling i stillestående luft." },
        '1.2842': { temp: "790-820°C", medium: "OIL", hrc: "63-65 HRC", note: "Standard værktøjsstål til dorn og måleværktøj." },
        '1.1730': { temp: "800-840°C", medium: "WATER", hrc: "50-54 HRC", note: "C45. Hærder kun i overfladen. Risiko for revner i vand." }
    };

    // --- DATA: GALVANIC SERIES (Index 0 is most noble/cathodic) ---
    const GALVANIC_SERIES = [
        { name: "Rustfast Stål (AISI 316/Passiv)", potential: 1, advice: "Meget ædelt materiale. Risiko for korrosion på modpart." },
        { name: "Messing / Bronze", potential: 3, advice: "Kobberlegering. God mod rustfast, kritisk mod aluminium." },
        { name: "Stål / Støbejern", potential: 7, advice: "Standard konstruktion. Kræver overfladebehandling ved kontakt med ædle metaller." },
        { name: "Aluminium (6000-serie)", potential: 10, advice: "Uædelt materiale. Vil korrodere (ofre sig) i kontakt med messing eller stål." }
    ];

    // --- LOGIK: HEAT TREAT UPDATE ---
    function updateHeatTreat() {
        const data = HT_DB[htSelect.value];
        htTemp.textContent = data.temp;
        htMedium.textContent = data.medium;
        htHrc.textContent = data.hrc;
        htNote.textContent = data.note;

        // Opdater også de fysiske konstanter hvis materialet findes i core
        // Vi simulerer et opslag mod den globale MACHINING_DB
        const matKey = htSelect.value === '1.2379' ? 'VAERKTOJSSTAAL' : 'STAAL';
        const coreMat = MACHINING_DB.MATERIALS[matKey];
        
        if(coreMat) {
            physDens.textContent = coreMat.density + " g/cm³";
            physAlpha.textContent = coreMat.thermal + " µm/m·K";
            physAe.textContent = (coreMat.ae_lim * 100).toFixed(0) + "% Ø";
            physFz.textContent = coreMat.fz_ref + " mm/z";
        }
    }

    // --- LOGIK: GALVANIC COMPATIBILITY ---
    function updateGalvanic() {
        const indexA = parseInt(galA.value);
        const indexB = parseInt(galB.value);
        const diff = Math.abs(indexA - indexB);

        const dataA = GALVANIC_SERIES.find(m => m.potential === indexA);
        const dataB = GALVANIC_SERIES.find(m => m.potential === indexB);

        if (diff === 0) {
            galStatus.textContent = "OPTIMAL";
            galStatus.className = "text-4xl font-black italic tracking-tighter text-white";
            galIndicator.className = "w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
            galAdvice.textContent = "Samme materiale-kategori. Ingen risiko for galvanisk tæring.";
        } else if (diff <= 3) {
            galStatus.textContent = "STABLE";
            galStatus.className = "text-4xl font-black italic tracking-tighter text-primary";
            galIndicator.className = "w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(245,158,11,0.5)]";
            galAdvice.textContent = "Acceptabelt i tørre miljøer. Ved fugt bør isolering (skiver/fedt) overvejes.";
        } else {
            galStatus.textContent = "CRITICAL";
            galStatus.className = "text-4xl font-black italic tracking-tighter text-red-500";
            galIndicator.className = "w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
            galAdvice.textContent = `Høj risiko! ${dataA.potential > dataB.potential ? dataA.name : dataB.name} vil korrodere kraftigt. Kræver total elektrisk isolering.`;
        }
    }

    // --- INITIALISERING ---
    function init() {
        // Populer Galvanisk selector
        const options = GALVANIC_SERIES.map(m => `<option value="${m.potential}">${m.name}</option>`).join('');
        galA.innerHTML = options;
        galB.innerHTML = options;
        galB.selectedIndex = 3; // Standard: Aluminium mod noget andet

        htSelect.addEventListener('change', updateHeatTreat);
        [galA, galB].forEach(el => el.addEventListener('change', updateGalvanic));

        updateHeatTreat();
        updateGalvanic();
    }

    init();
});