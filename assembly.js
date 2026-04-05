/**
 * Machining_OS | Assembly Logic
 * Version: 5.1 (Thermal Interference & Precision Fits + Global State Sync)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const workMaterialSelect = document.getElementById('work-material');
    const shrinkDiaInput = document.getElementById('shrink-dia');
    const shrinkOverlapInput = document.getElementById('shrink-overlap');
    const shrinkResText = document.getElementById('shrink-res');
    const shrinkWarning = document.getElementById('shrink-warning');

    // --- INITIALISERING ---
    function initAssembly() {
        // Udfyld materialer fra global DB (med 'bg-zinc-900' for dark-mode læsbarhed)
        if (workMaterialSelect && typeof MACHINING_DB !== 'undefined') {
            workMaterialSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
                .map(([k, v]) => `<option value="${v.thermal}" class="bg-zinc-900">${v.name}</option>`).join('');
        }

        // Synkroniser med global state
        const state = MachiningOS.getState();
        
        if (state['work-material']) {
            const matCode = state['work-material'];
            if(MACHINING_DB.MATERIALS[matCode]) {
                workMaterialSelect.value = MACHINING_DB.MATERIALS[matCode].thermal;
            }
        }
        
        // Hent specifikke Assembly-data
        if (state['shrink_dia']) shrinkDiaInput.value = state['shrink_dia'];
        if (state['shrink_overlap']) shrinkOverlapInput.value = state['shrink_overlap'];

        calcShrinkFit();
    }

    /**
     * KRYMPEPASNINGS BEREGNER
     * Formel: Delta T = Overlap / (Diameter * Alfa)
     * Vi tilføjer en sikkerhedsmargin (20%) for varmetab under montage.
     */
    function calcShrinkFit() {
        const alpha = parseFloat(workMaterialSelect.value) / 1000000; // Konverter µm/m·K til m/m·K
        const D = parseFloat(shrinkDiaInput.value) || 0;
        const overlap = parseFloat(shrinkOverlapInput.value) || 0;

        if (D <= 0 || alpha <= 0 || overlap <= 0) {
            shrinkResText.textContent = "0";
            shrinkWarning.textContent = "Indtast valide dimensioner for beregning.";
            shrinkResText.classList.remove('text-red-500', 'text-primary');
            shrinkResText.classList.add('text-white');
            return;
        }

        // Teoretisk temperaturstigning over 20°C (stuetemp)
        const deltaT = overlap / (D * alpha);
        
        // Final temperatur inkl. 20% buffer til transport/håndtering
        const targetTemp = 20 + (deltaT * 1.2);

        // UI Opdatering
        shrinkResText.textContent = Math.ceil(targetTemp);

        // Dynamiske advarsler baseret på materialegrænser
        if (targetTemp > 350) {
            shrinkWarning.innerHTML = `<span class="text-red-500 font-black">! KRITISK ADVARSEL:</span> Temperatur overstiger 350°C. Risiko for ændring i materialehærdning (anløbning). Overvej flydende nitrogen til inderdelen.`;
            shrinkResText.classList.remove('text-primary', 'text-white');
            shrinkResText.classList.add('text-red-500');
        } else if (targetTemp > 200) {
            shrinkWarning.textContent = "BEMÆRK: Emnet skal opvarmes jævnt (f.eks. i ovn). Brug varmehandsker.";
            shrinkResText.classList.remove('text-red-500', 'text-white');
            shrinkResText.classList.add('text-primary');
        } else {
            shrinkWarning.textContent = "Sikker montage. Beregnet ud fra 20°C reference med 20% termisk buffer.";
            shrinkResText.classList.remove('text-red-500', 'text-primary');
            shrinkResText.classList.add('text-white');
        }
    }

    // --- EVENT LISTENERS ---
    [workMaterialSelect, shrinkDiaInput, shrinkOverlapInput].forEach(el => {
        if(el) {
            el.addEventListener('input', () => {
                calcShrinkFit();
                
                // Gem projekt-tilstand (Diameter og Overlap) i localStorage
                MachiningOS.saveState({
                    'shrink_dia': shrinkDiaInput.value,
                    'shrink_overlap': shrinkOverlapInput.value
                });
            });
        }
    });

    // Start modulet
    initAssembly();
});