/**
 * Machining_OS | High-Tech Logic
 * Version: 5.1 (Dynamic Gland Fill & Extended Optomechanics)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- VACUUM ELEMENTER ---
    const vacW = document.getElementById('vac-oring-w');
    const outVacH = document.getElementById('vac-h');
    const outVacB = document.getElementById('vac-b');
    const outVacFill = document.getElementById('vac-fill');

    // --- OPTICS ELEMENTER ---
    const optSelect = document.getElementById('optics-select');
    const optMajor = document.getElementById('opt-major');
    const optPitch = document.getElementById('opt-pitch');
    const optForm = document.getElementById('opt-form');

    // --- DATA: OPTICAL THREADS (Values in mm) ---
    const OPTICS_DB = {
        'sm05': { major: 13.589, pitch: 0.635, form: "60° UN (Thorlabs)" }, // 0.535"-40
        'sm1': { major: 26.289, pitch: 0.635, form: "60° UN (Thorlabs)" },  // 1.035"-40
        'sm2': { major: 51.689, pitch: 0.635, form: "60° UN (Thorlabs)" },  // 2.035"-40
        'sm3': { major: 77.089, pitch: 0.635, form: "60° UN (Thorlabs)" },  // 3.035"-40
        'c-mount': { major: 25.400, pitch: 0.794, form: "60° UN (Camera)" }, // 1"-32
        'rms': { major: 20.320, pitch: 0.706, form: "55° Whitworth (Microscope)" }, // 0.800"-36
        'm25': { major: 25.000, pitch: 0.750, form: "60° Metrisk" },
        'm27': { major: 27.000, pitch: 0.750, form: "60° Metrisk" }
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

        // Fyldningsgrad (Area of O-ring / Area of Gland)
        const a_oring = Math.PI * Math.pow(w / 2, 2);
        const a_gland = h * b;
        const fillPct = (a_oring / a_gland) * 100;

        outVacH.textContent = h.toFixed(2);
        outVacB.textContent = b.toFixed(2);
        outVacFill.textContent = fillPct.toFixed(1) + "%";

        // Advarsel ved overfyldning (Gummi kan ikke komprimeres, kun deformeres)
        if (fillPct > 90) {
            outVacFill.className = "font-black italic text-lg tracking-tighter text-red-500 tabular-nums";
        } else {
            outVacFill.className = "font-black italic text-lg tracking-tighter text-emerald-500 tabular-nums";
        }
        
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
            optForm.textContent = data.form;
            
            // Hvis det er RMS (Whitworth), vis advarsels-farve for at stoppe brug af 60° platte
            if (optSelect.value === 'rms') {
                optForm.className = "text-lg font-black text-red-500 italic uppercase tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]";
            } else {
                optForm.className = "text-lg font-black text-primary italic uppercase tracking-widest";
            }
            
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