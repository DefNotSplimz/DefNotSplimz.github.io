/**
 * Machining_OS | Material Science Logic
 * Version: 5.1 (Mass Engine & True Anodic Index Galvanic Control)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER: MASS ENGINE ---
    const massMaterial = document.getElementById('mass-material');
    const massShape = document.getElementById('mass-shape');
    const massX = document.getElementById('mass-x');
    const massY = document.getElementById('mass-y');
    const massZ = document.getElementById('mass-z');
    const massD = document.getElementById('mass-d');
    const massCl = document.getElementById('mass-cl');
    const dimBlock = document.getElementById('dim-block');
    const dimCyl = document.getElementById('dim-cyl');
    const massDensOut = document.getElementById('mass-dens-out');
    const massKgOut = document.getElementById('mass-kg-out');

    // --- ELEMENT REFERENCER: HT & PHYSICAL ---
    const htSelect = document.getElementById('ht-material');
    const htTemp = document.getElementById('ht-temp');
    const htMedium = document.getElementById('ht-medium');
    const htHrc = document.getElementById('ht-hrc');
    const htNote = document.getElementById('ht-note');
    
    const physMatName = document.getElementById('phys-mat-name');
    const physVc = document.getElementById('phys-vc');
    const physAlpha = document.getElementById('phys-alpha');
    const physKc1 = document.getElementById('phys-kc1');
    const physIndex = document.getElementById('phys-index');

    // --- ELEMENT REFERENCER: GALVANIC ---
    const galA = document.getElementById('gal-a');
    const galB = document.getElementById('gal-b');
    const galEnv = document.getElementById('gal-env');
    const galDelta = document.getElementById('gal-delta');
    const galStatus = document.getElementById('gal-status');
    const galIndicator = document.getElementById('gal-indicator');
    const galAdvice = document.getElementById('gal-advice');

    // --- DATA: HEAT TREATMENT ---
    const HT_DB = {
        '1.2510': { temp: "780-820°C", medium: "OIL", hrc: "62-64", note: "O1 stål. Meget stabilt. Forvarm til 600°C før hærdning.", map: 'VAERKTOJSSTAAL' },
        '1.2379': { temp: "1020-1040°C", medium: "AIR", hrc: "58-62", note: "D2 stål. Ekstrem slidstyrke. Langsom køling i stillestående luft.", map: 'VAERKTOJSSTAAL' },
        '1.2842': { temp: "790-820°C", medium: "OIL", hrc: "63-65", note: "O2 stål. Standard til dorn og måleværktøj.", map: 'VAERKTOJSSTAAL' },
        '1.1730': { temp: "800-840°C", medium: "WATER", hrc: "50-54", note: "C45U. Hærder kun i overfladen. Risiko for revner i vand.", map: 'STAAL' },
        '17-4PH': { temp: "480°C", medium: "AIR", hrc: "44", note: "Condition H900 (Precipitation Hardening). Hold i 1 time, derefter luftkøl.", map: 'RUSTFAST' },
        '6082-T6': { temp: "160-190°C", medium: "AIR", hrc: "105 HB", note: "Kunstig ældning (Artificial Aging) efter opløsningsglødning. Tidsafhængig.", map: 'ALU' }
    };

    // --- DATA: TRUE ANODIC INDEX (Volt vs saturated calomel electrode) ---
    const ANODIC_INDEX = [
        { name: "Guld / Platin", v: -0.15 },
        { name: "Titanium / Ti-legeringer", v: -0.30 },
        { name: "Sølv / Nikkel (Solid)", v: -0.40 },
        { name: "Messing / Bronze", v: -0.45 },
        { name: "Kobber / Kobbernikkel", v: -0.35 },
        { name: "Rustfast Stål (Passiveret)", v: -0.25 },
        { name: "Rustfast Stål (Aktiv/Ubehandlet)", v: -0.50 },
        { name: "Tin / Bly", v: -0.65 },
        { name: "Konstruktionsstål / Støbejern", v: -0.85 },
        { name: "Aluminium (2000 Serie)", v: -0.75 },
        { name: "Aluminium (6000/7000 Serie)", v: -0.90 },
        { name: "Zink (Galvaniseret Stål)", v: -1.20 },
        { name: "Magnesiumlegeringer", v: -1.75 }
    ];

    // --- LOGIK: MASS ENGINE ---
    function updateMass() {
        const matKey = massMaterial.value;
        if (!matKey || !MACHINING_DB.MATERIALS[matKey]) return;
        
        const density = MACHINING_DB.MATERIALS[matKey].density; // g/cm3
        massDensOut.textContent = density.toFixed(2) + " g/cm³";

        let volume_cm3 = 0;

        if (massShape.value === 'block') {
            const x = parseFloat(massX.value) || 0;
            const y = parseFloat(massY.value) || 0;
            const z = parseFloat(massZ.value) || 0;
            volume_cm3 = (x * y * z) / 1000;
        } else {
            const d = parseFloat(massD.value) || 0;
            const l = parseFloat(massCl.value) || 0;
            const r = d / 2;
            volume_cm3 = (Math.PI * Math.pow(r, 2) * l) / 1000;
        }

        const mass_kg = (volume_cm3 * density) / 1000;
        massKgOut.textContent = mass_kg.toFixed(3) + " kg";
    }

    // --- LOGIK: HEAT TREAT & PHYSICAL PROPERTIES ---
    function updateHeatTreat() {
        const key = htSelect.value;
        const data = HT_DB[key];
        
        htTemp.textContent = data.temp;
        htMedium.textContent = data.medium;
        htHrc.textContent = data.hrc + (data.hrc.includes('HB') ? '' : ' HRC');
        htNote.textContent = data.note;

        // Opdater Physical Context dynamisk baseret på HT valget
        const coreMat = MACHINING_DB.MATERIALS[data.map];
        if (coreMat) {
            physMatName.textContent = coreMat.name;
            physVc.textContent = coreMat.vc_hm;
            physAlpha.textContent = coreMat.thermal;
            physKc1.textContent = coreMat.kc1 + " MPa";
            
            // Machinability Index: Simpel klassifikation baseret på specifik skærekraft
            let machIndex = "Medium";
            if (coreMat.kc1 < 800) machIndex = "Fremragende";
            else if (coreMat.kc1 > 1800) machIndex = "Kritisk / Tung";
            
            physIndex.textContent = machIndex;
        }
    }

    // --- LOGIK: GALVANIC COMPATIBILITY (True Volts) ---
    function updateGalvanic() {
        const vA = parseFloat(galA.value);
        const vB = parseFloat(galB.value);
        const limit = parseFloat(galEnv.value);
        
        // Beregn absolut spændingsforskel
        const deltaV = Math.abs(vA - vB);
        galDelta.textContent = deltaV.toFixed(2);

        // UI Reset
        const baseBox = "mt-12 p-8 border border-zinc-800 relative overflow-hidden transition-all duration-500 ";

        if (deltaV === 0) {
            galResultBox(baseBox + "bg-zinc-900/20", "text-white", "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]", "OPTIMAL", "Samme anodiske index. Ingen risiko for galvanisk tæring.");
        } else if (deltaV <= limit) {
            galResultBox(baseBox + "bg-primary/5 border-primary/20", "text-primary", "bg-primary shadow-[0_0_15px_rgba(245,158,11,0.5)]", "STABLE", `Delta V (${deltaV.toFixed(2)}V) er under grænsen på ${limit}V. Acceptabel integration.`);
        } else {
            // Find den mest anodiske (den der ofres) - Den der er mest negativ (lavest værdi) korroderer.
            const anodicName = vA < vB ? galA.options[galA.selectedIndex].text : galB.options[galB.selectedIndex].text;
            
            galResultBox(baseBox + "bg-red-500/5 border-red-500/30", "text-red-500", "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]", "CRITICAL_RISK", `! KORROSION PÅVIST. ${anodicName} vil ofre sig og korrodere hurtigt. Delta V (${deltaV.toFixed(2)}V) overstiger ${limit}V tilladt for miljøet.`);
        }
    }

    function galResultBox(boxClass, textClass, indicatorClass, statusText, adviceText) {
        document.getElementById('gal-result').className = boxClass;
        galStatus.className = `text-lg md:text-2xl lg:text-4xl font-black italic tracking-tighter ${textClass}`;
        galDelta.className = `text-5xl font-black italic tracking-tighter tabular-nums ${textClass}`;
        galIndicator.className = `w-4 h-4 rounded-full ${indicatorClass}`;
        galStatus.textContent = statusText;
        galAdvice.textContent = adviceText;
    }

    // --- INITIALISERING ---
    function init() {
        // Populer Global Material Selector til Mass Engine
        if (massMaterial && typeof MACHINING_DB !== 'undefined') {
            massMaterial.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
                .map(([k, v]) => `<option value="${k}" class="bg-zinc-900">${v.name}</option>`).join('');
        }

        // Populer Anodic Index selector
        const options = ANODIC_INDEX.map(m => `<option value="${m.v}" class="bg-zinc-900">${m.name} (${m.v}V)</option>`).join('');
        galA.innerHTML = options;
        galB.innerHTML = options;
        
        // Sæt standard scenarie: Alu 6000 mod Rustfast Aktiv
        galA.selectedIndex = 10; 
        galB.selectedIndex = 6;  

        // UI toggles for Mass Engine
        massShape.addEventListener('change', (e) => {
            if(e.target.value === 'block') {
                dimBlock.classList.remove('hidden');
                dimCyl.classList.add('hidden');
            } else {
                dimBlock.classList.add('hidden');
                dimCyl.classList.remove('hidden');
            }
            updateMass();
        });

        // Event Listeners
        [massMaterial, massX, massY, massZ, massD, massCl].forEach(el => el.addEventListener('input', updateMass));
        htSelect.addEventListener('change', updateHeatTreat);
        [galA, galB, galEnv].forEach(el => el.addEventListener('change', updateGalvanic));

        // Start
        updateMass();
        updateHeatTreat();
        updateGalvanic();
    }

    init();
});