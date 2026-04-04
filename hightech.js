/**
 * Machining_OS | High-Tech Logic
 * Version: 5.0 (Vacuum Engineering & Optomechanics)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- VACUUM ELEMENTER ---
    const vacW = document.getElementById('vac-oring-w');
    const outVacH = document.getElementById('vac-h');
    const outVacB = document.getElementById('vac-b');

    // --- OPTICS ELEMENTER ---
    const optSelect = document.getElementById('optics-select');
    const optMajor = document.getElementById('opt-major');
    const optPitch = document.getElementById('opt-pitch');

    // --- DATA: OPTICAL THREADS (Values in mm) ---
    const OPTICS_DB = {
        'sm05': { major: 13.589, pitch: 0.635 }, // 0.535"-40
        'sm1': { major: 26.289, pitch: 0.635 },  // 1.035"-40
        'sm2': { major: 51.689, pitch: 0.635 },  // 2.035"-40
        'c-mount': { major: 25.400, pitch: 0.794 } // 1"-32
    };

    /**
     * VACUUM GLAND CALCULATION
     * Finmekanisk standard for statisk højvakuum:
     * - Høj kompression (25-30%) for at sikre gastæthed.
     * - Plads til termisk ekspansion af gummi (Fyldningsgrad ca. 75-85%).
     */
    function calculateVacuumGland() {
        const w = parseFloat(vacW.value);
        
        // Statisk vakuum kompression (ca. 27%)
        const h = w * 0.73;
        // Sporbredden skal tillade gummiet at flyde (typisk w * 1.15)
        const b = w * 1.15;

        outVacH.textContent = h.toFixed(2);
        outVacB.textContent = b.toFixed(2);
        
        // Gem state via Shared Core
        MachiningOS.saveState({ 'last_vac_w': vacW.value });
    }

    /**
     * OPTICAL THREAD LOOKUP
     */
    function updateOptics() {
        const data = OPTICS_DB[optSelect.value];
        if (data) {
            optMajor.textContent = data.major.toFixed(3);
            optPitch.textContent = data.pitch.toFixed(3);
            
            // Gem state via Shared Core
            MachiningOS.saveState({ 'last_opt_val': optSelect.value });
        }
    }

    // --- EVENT LISTENERS ---
    vacW.addEventListener('change', calculateVacuumGland);
    optSelect.addEventListener('change', updateOptics);

    // --- INITIALISERING ---
    function init() {
        const state = MachiningOS.getState();
        if (state.last_vac_w) vacW.value = state.last_vac_w;
        if (state.last_opt_val) optSelect.value = state.last_opt_val;

        calculateVacuumGland();
        updateOptics();
    }

    init();
});