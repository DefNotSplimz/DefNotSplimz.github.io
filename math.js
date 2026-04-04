/**
 * Machining_OS | Shop Math Logic
 * Version: 5.0 (Precision Trig & Mass)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- TRIG ELEMENTER ---
    const trigA = document.getElementById('trig-a');
    const trigB = document.getElementById('trig-b');
    const trigC = document.getElementById('trig-c');
    const trigV = document.getElementById('trig-v');

    // --- MASS ELEMENTER ---
    const massMatSelect = document.getElementById('mass-material');
    const massDim1 = document.getElementById('mass-dim1');
    const massDim2 = document.getElementById('mass-dim2');
    const massOut = document.getElementById('mass-out');

    // --- BLANK ELEMENTER ---
    const blankN = document.getElementById('blank-n');
    const blankL = document.getElementById('blank-l');
    const blankCut = document.getElementById('blank-cut');
    const blankFace = document.getElementById('blank-face');
    const blankTotal = document.getElementById('blank-total');
    const blankWaste = document.getElementById('blank-waste');

    // --- INITIALISERING ---
    function initMath() {
        // Populer materialer fra shared_core DB
        massMatSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
            .map(([k, v]) => `<option value="${v.density}">${v.name}</option>`).join('');

        // Gendan state
        const state = MachiningOS.getState();
        if (state.last_mass_mat) massMatSelect.value = state.last_mass_mat;

        calculateMass();
        calculateBlank();
    }

    // --- TRIGONOMETRI LOGIK ---
    // Løser retvinklede trekanter baseret på to kendte værdier
    function calculateTrig(changedInput) {
        let a = parseFloat(trigA.value);
        let b = parseFloat(trigB.value);
        let c = parseFloat(trigC.value);
        let v = parseFloat(trigV.value); // Grader

        // Vi nulstiller ikke alt, men beregner manglende baseret på hvad der blev ændret
        // Case: Kendt a og b
        if (changedInput === 'trig-a' || changedInput === 'trig-b') {
            if (a > 0 && b > 0) {
                c = Math.sqrt(a*a + b*b);
                v = Math.atan(a/b) * (180/Math.PI);
            }
        } 
        // Case: Kendt v og c
        else if (changedInput === 'trig-v' || changedInput === 'trig-c') {
            if (v > 0 && c > 0) {
                let rad = v * (Math.PI/180);
                a = c * Math.sin(rad);
                b = c * Math.cos(rad);
            }
        }

        // Opdater felter (undtagen det brugeren lige har rettet i)
        if (changedInput !== 'trig-a') trigA.value = a ? a.toFixed(4) : "";
        if (changedInput !== 'trig-b') trigB.value = b ? b.toFixed(4) : "";
        if (changedInput !== 'trig-c') trigC.value = c ? c.toFixed(4) : "";
        if (changedInput !== 'trig-v') trigV.value = v ? v.toFixed(3) : "";
    }

    // --- MASSE BEREGNING ---
    function calculateMass() {
        const density = parseFloat(massMatSelect.value); // g/cm³
        const d1 = parseFloat(massDim1.value) || 0;
        const d2 = parseFloat(massDim2.value) || 0;

        // Antag rundstang som standard: (pi * r² * h)
        const radiusCm = (d1 / 2) / 10;
        const lengthCm = d2 / 10;
        const volumeCm3 = Math.PI * Math.pow(radiusCm, 2) * lengthCm;

        const weightKg = (volumeCm3 * density) / 1000;
        massOut.textContent = weightKg.toFixed(3);

        MachiningOS.saveState({ 'last_mass_mat': massMatSelect.value });
    }

    // --- BLANK SIZE LOGIK ---
    function calculateBlank() {
        const n = parseInt(blankN.value) || 0;
        const l = parseFloat(blankL.value) || 0;
        const cut = parseFloat(blankCut.value) || 0;
        const face = parseFloat(blankFace.value) || 0;

        // Total = (l + cut) * n + face
        const total = ((l + cut) * n) + face;
        const theoretical = l * n;
        const wastePercent = total > 0 ? ((total - theoretical) / total) * 100 : 0;

        blankTotal.textContent = Math.ceil(total);
        blankWaste.textContent = Math.round(wastePercent);
    }

    // --- EVENT LISTENERS ---
    document.querySelectorAll('.trig-input').forEach(el => {
        el.addEventListener('input', (e) => calculateTrig(e.target.id));
    });

    [massMatSelect, massDim1, massDim2].forEach(el => el.addEventListener('input', calculateMass));
    [blankN, blankL, blankCut, blankFace].forEach(el => el.addEventListener('input', calculateBlank));

    initMath();
});