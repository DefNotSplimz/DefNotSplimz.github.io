/**
 * Machining_OS | Shop Math Logic
 * Version: 5.1 (Intelligent Trig Solver, Chord Math & Bar Stock Optimizer)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENT REFERENCER: TRIGONOMETRI ---
    const trigA = document.getElementById('trig-a');
    const trigB = document.getElementById('trig-b');
    const trigC = document.getElementById('trig-c');
    const trigAlpha = document.getElementById('trig-alpha');
    const trigResetBtn = document.getElementById('trig-reset');
    const trigInputs = [trigA, trigB, trigC, trigAlpha];

    // --- ELEMENT REFERENCER: KORDE & PILHØJDE ---
    const chordW = document.getElementById('chord-w');
    const chordH = document.getElementById('chord-h');
    const outChordR = document.getElementById('chord-out-r');
    const outChordAng = document.getElementById('chord-out-ang');

    // --- ELEMENT REFERENCER: BAR STOCK OPTIMIZER ---
    const barLength = document.getElementById('bar-length');
    const partLength = document.getElementById('part-length');
    const barKerf = document.getElementById('bar-kerf');
    const barFace = document.getElementById('bar-face');
    const outBarParts = document.getElementById('bar-out-parts');
    const outBarYield = document.getElementById('bar-out-yield');
    const outBarScrap = document.getElementById('bar-out-scrap');
    const outBarReq = document.getElementById('bar-out-req');


    // --- LOGIK: TRIGONOMETRI SOLVER ---
    function handleTrigInput() {
        // Tæl hvor mange inputs der har en værdi
        let activeInputs = trigInputs.filter(input => input.value !== '');
        
        // Når præcis to felter er udfyldt, lås dem og beregn resten
        if (activeInputs.length === 2) {
            trigInputs.forEach(input => {
                if (input.value === '') {
                    input.readOnly = true;
                    input.classList.add('bg-zinc-900/50', 'text-zinc-500', 'border-zinc-800/50');
                    input.classList.remove('text-primary', 'text-white');
                }
            });
            solveTriangle();
        }
    }

    function solveTriangle() {
        let a = parseFloat(trigA.value);
        let b = parseFloat(trigB.value);
        let c = parseFloat(trigC.value);
        let alpha = parseFloat(trigAlpha.value);
        
        const RAD = Math.PI / 180;
        const DEG = 180 / Math.PI;

        // Scenarie 1: Kendt A og B
        if (!isNaN(a) && !isNaN(b)) {
            c = Math.sqrt((a*a) + (b*b));
            alpha = Math.atan(a/b) * DEG;
            updateTrigUI(a, b, c, alpha);
        }
        // Scenarie 2: Kendt A og C
        else if (!isNaN(a) && !isNaN(c)) {
            if (a >= c) return alert("Fejl: Hypotenuse (C) skal være længere end katete (A).");
            b = Math.sqrt((c*c) - (a*a));
            alpha = Math.asin(a/c) * DEG;
            updateTrigUI(a, b, c, alpha);
        }
        // Scenarie 3: Kendt B og C
        else if (!isNaN(b) && !isNaN(c)) {
            if (b >= c) return alert("Fejl: Hypotenuse (C) skal være længere end katete (B).");
            a = Math.sqrt((c*c) - (b*b));
            alpha = Math.acos(b/c) * DEG;
            updateTrigUI(a, b, c, alpha);
        }
        // Scenarie 4: Kendt A og Alpha
        else if (!isNaN(a) && !isNaN(alpha)) {
            b = a / Math.tan(alpha * RAD);
            c = a / Math.sin(alpha * RAD);
            updateTrigUI(a, b, c, alpha);
        }
        // Scenarie 5: Kendt B og Alpha
        else if (!isNaN(b) && !isNaN(alpha)) {
            a = b * Math.tan(alpha * RAD);
            c = b / Math.cos(alpha * RAD);
            updateTrigUI(a, b, c, alpha);
        }
        // Scenarie 6: Kendt C og Alpha
        else if (!isNaN(c) && !isNaN(alpha)) {
            a = c * Math.sin(alpha * RAD);
            b = c * Math.cos(alpha * RAD);
            updateTrigUI(a, b, c, alpha);
        }
    }

    function updateTrigUI(a, b, c, alpha) {
        trigA.value = a.toFixed(3);
        trigB.value = b.toFixed(3);
        trigC.value = c.toFixed(3);
        trigAlpha.value = alpha.toFixed(3);
    }

    function resetTrig() {
        trigInputs.forEach(input => {
            input.value = '';
            input.readOnly = false;
            input.classList.remove('bg-zinc-900/50', 'text-zinc-500', 'border-zinc-800/50');
        });
        trigA.classList.add('text-primary');
        trigAlpha.classList.add('text-primary');
        trigB.classList.add('text-white');
        trigC.classList.add('text-white');
    }


    // --- LOGIK: KORDE & PILHØJDE (Circular Segment) ---
    function calcChord() {
        const w = parseFloat(chordW.value);
        const h = parseFloat(chordH.value);

        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
            outChordR.textContent = "0.000";
            outChordAng.textContent = "0.00";
            return;
        }

        // Radius: R = (W^2 / 8H) + (H / 2)
        const R = (Math.pow(w, 2) / (8 * h)) + (h / 2);
        
        // Vinkel: Theta = 2 * asin((W/2) / R)
        const thetaRad = 2 * Math.asin((w / 2) / R);
        const thetaDeg = thetaRad * (180 / Math.PI);

        outChordR.textContent = R.toFixed(3);
        outChordAng.textContent = thetaDeg.toFixed(2);

        MachiningOS.saveState({ 'chord_w': w, 'chord_h': h });
    }


    // --- LOGIK: BAR STOCK OPTIMIZER ---
    function calcBarStock() {
        const L_bar = parseFloat(barLength.value) || 0;
        const L_part = parseFloat(partLength.value) || 0;
        const kerf = parseFloat(barKerf.value) || 0;
        const face = parseFloat(barFace.value) || 0;

        if (L_bar <= 0 || L_part <= 0) {
            outBarParts.textContent = "0";
            outBarYield.textContent = "0.0";
            outBarScrap.textContent = "0.0 mm";
            return;
        }

        // Det totale forbrug pr. produceret emne (inkl. sav og afdrejning)
        const reqPerPart = L_part + kerf + face;
        
        // Beregn antal mulige emner (rundet ned)
        const maxParts = Math.floor(L_bar / reqPerPart);
        
        // Beregn rest (Scrap)
        const totalUsed = maxParts * reqPerPart;
        const scrap = L_bar - totalUsed;
        
        // Beregn udnyttelsesgrad i % (Kun the faktiske emnelængde tæller som "udnyttet" værdi)
        const yieldPct = ((maxParts * L_part) / L_bar) * 100;

        outBarParts.textContent = maxParts;
        outBarReq.textContent = reqPerPart.toFixed(1) + " mm";
        outBarScrap.textContent = scrap.toFixed(1) + " mm";
        
        outBarYield.textContent = yieldPct.toFixed(1);
        
        // Farveskift baseret på yield
        outBarYield.parentElement.className = `text-4xl font-black italic tracking-tighter tabular-nums ${yieldPct > 80 ? 'text-emerald-500' : (yieldPct > 60 ? 'text-primary' : 'text-red-500')}`;

        MachiningOS.saveState({ 
            'bar_length': L_bar, 
            'part_length': L_part, 
            'bar_kerf': kerf, 
            'bar_face': face 
        });
    }

    // --- EVENT LISTENERS ---
    trigInputs.forEach(input => input.addEventListener('input', handleTrigInput));
    trigResetBtn.addEventListener('click', resetTrig);

    [chordW, chordH].forEach(el => el.addEventListener('input', calcChord));

    [barLength, partLength, barKerf, barFace].forEach(el => el.addEventListener('input', calcBarStock));

    // --- INITIALISERING ---
    function init() {
        const state = MachiningOS.getState();
        
        if (state.chord_w) chordW.value = state.chord_w;
        if (state.chord_h) chordH.value = state.chord_h;
        
        if (state.bar_length) barLength.value = state.bar_length;
        if (state.part_length) partLength.value = state.part_length;
        if (state.bar_kerf) barKerf.value = state.bar_kerf;
        if (state.bar_face) barFace.value = state.bar_face;

        calcChord();
        calcBarStock();
    }

    init();
});