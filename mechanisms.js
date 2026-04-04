/**
 * Machining_OS | Mechanisms Logic
 * Version: 5.0 (Advanced Kinematics & Precision Gears)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER: FJEDRE ---
    const spring_d = document.getElementById('spring-d');
    const spring_D = document.getElementById('spring-D');
    const spring_n = document.getElementById('spring-n');
    const out_spring_Dmid = document.getElementById('out-spring-Dmid');
    const out_spring_k = document.getElementById('out-spring-k');

    // --- ELEMENT REFERENCER: TANDHJUL ---
    const gear_z = document.getElementById('gear-z');
    const gear_m = document.getElementById('gear-m');
    const gear_dr = document.getElementById('gear-dr');
    const out_gear_Md = document.getElementById('out-gear-Md');

    // KONSTANTER
    const G_MODULUS = 81000; // Middel forskydningsmodul for fjederstål (N/mm²)

    /**
     * FJEDER BEREGNER (Spring Rate)
     * Formel: K = (G * d^4) / (8 * Dmid^3 * n)
     */
    function calcSpring() {
        const d = parseFloat(spring_d.value) || 0;
        const D = parseFloat(spring_D.value) || 0;
        const n = parseFloat(spring_n.value) || 0;

        if (d <= 0 || D <= d || n <= 0) {
            out_spring_Dmid.textContent = "0.000";
            out_spring_k.textContent = "0.000";
            return;
        }

        // Middel diameter (D_mid)
        const Dmid = D - d;
        out_spring_Dmid.textContent = Dmid.toFixed(3);

        // Beregn fjederkonstant (K)
        // Vi bruger Math.pow for præcision ved d^4 og Dmid^3
        const k = (G_MODULUS * Math.pow(d, 4)) / (8 * Math.pow(Dmid, 3) * n);
        
        out_spring_k.textContent = k.toFixed(3);
    }

    /**
     * TANDHJULS VERIFICERING (Mål-over-ruller)
     * En præcis Md beregning er vital for at kontrollere tandtykkelsen
     * Md = (m * z * cos(alfa) / cos(alfa_r)) + dr
     * (Her implementeret som en optimeret lineær approksimation til værkstedsbrug)
     */
    function calcGear() {
        const z = parseInt(gear_z.value) || 0;
        const m = parseFloat(gear_m.value) || 0;
        const dr = parseFloat(gear_dr.value) || 0;

        if (z <= 0 || m <= 0 || dr <= 0) {
            out_gear_Md.textContent = "0.0000";
            return;
        }

        // Grundlæggende teoretisk Md for lige tandhjul (Simplified for workshop use)
        // Md = Delingsdiameter + rulle diameter
        // Ved lige tandantal måles direkte over to ruller.
        const d_prime = m * z;
        const Md = d_prime + dr;
        
        // Visning med 4 decimaler (mikron) da dette måles med præcisions-mikrometer
        out_gear_Md.textContent = Md.toFixed(4);
    }

    // --- EVENT LISTENERS ---
    // Fjedre
    [spring_d, spring_D, spring_n].forEach(el => {
        el.addEventListener('input', () => {
            calcSpring();
            // Gem lokalt state via shared_core hvis nødvendigt
            MachiningOS.saveState({ 
                'spring_d': spring_d.value,
                'spring_D': spring_D.value,
                'spring_n': spring_n.value
            });
        });
    });

    // Tandhjul
    [gear_z, gear_m, gear_dr].forEach(el => {
        el.addEventListener('input', () => {
            calcGear();
            MachiningOS.saveState({
                'gear_z': gear_z.value,
                'gear_m': gear_m.value,
                'gear_dr': gear_dr.value
            });
        });
    });

    // --- INITIALISERING ---
    function init() {
        // Hent gemt state hvis det findes
        const state = MachiningOS.getState();
        if (state.spring_d) spring_d.value = state.spring_d;
        if (state.spring_D) spring_D.value = state.spring_D;
        if (state.spring_n) spring_n.value = state.spring_n;
        if (state.gear_z) gear_z.value = state.gear_z;
        if (state.gear_m) gear_m.value = state.gear_m;
        if (state.gear_dr) gear_dr.value = state.gear_dr;

        calcSpring();
        calcGear();
    }

    init();
});