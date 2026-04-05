/**
 * Machining_OS | Mechanisms Logic
 * Version: 5.1 (Involute Gear Generator & Material-Specific Spring Dynamics)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER: FJEDRE ---
    const springMat = document.getElementById('spring-mat');
    const spring_d = document.getElementById('spring-d');
    const spring_D = document.getElementById('spring-D');
    const spring_n = document.getElementById('spring-n');
    const out_spring_Dmid = document.getElementById('out-spring-Dmid');
    const out_spring_k = document.getElementById('out-spring-k');
    const out_spring_Ls = document.getElementById('out-spring-Ls');
    const springWarning = document.getElementById('spring-warning');

    // --- ELEMENT REFERENCER: TANDHJUL ---
    const gear_m = document.getElementById('gear-m');
    const gear_z = document.getElementById('gear-z');
    const gear_pa = document.getElementById('gear-pa');
    const out_gear_da = document.getElementById('gear-out-da');
    const out_gear_d = document.getElementById('gear-out-d');
    const out_gear_df = document.getElementById('gear-out-df');
    const out_gear_h = document.getElementById('gear-out-h');
    const out_gear_db = document.getElementById('gear-out-db');


    /**
     * FJEDER BEREGNER (Spring Rate & Dynamics)
     * K = (G * d^4) / (8 * Dmid^3 * n)
     * Ls = d * (n + 2) (Antager lukkede og slebne ender)
     * C = Dmid / d (Fjederindeks - dikterer producerbarhed)
     */
    function calcSpring() {
        const G_MODULUS = parseFloat(springMat.value);
        const d = parseFloat(spring_d.value) || 0;
        const D = parseFloat(spring_D.value) || 0;
        const n = parseFloat(spring_n.value) || 0;

        if (d <= 0 || D <= d || n <= 0) {
            out_spring_Dmid.textContent = "0.00";
            out_spring_k.textContent = "0.00";
            out_spring_Ls.textContent = "0.00";
            springWarning.classList.add('hidden');
            return;
        }

        const Dmid = D - d;
        out_spring_Dmid.textContent = Dmid.toFixed(2);

        // Fjederkonstant (N/mm)
        const k = (G_MODULUS * Math.pow(d, 4)) / (8 * Math.pow(Dmid, 3) * n);
        out_spring_k.textContent = k.toFixed(2);

        // Blokhøjde (Solid Height)
        const Ls = d * (n + 2);
        out_spring_Ls.textContent = Ls.toFixed(2);

        // Producerbarheds-tjek (Spring Index C)
        const C = Dmid / d;
        if (C < 4) {
            springWarning.innerHTML = `! Fjederindeks (C=${C.toFixed(1)}) er under 4.<br>Nærmest umulig at vikle uden at knække tråden. Øg D eller sænk d.`;
            springWarning.classList.remove('hidden');
        } else if (C > 12) {
            springWarning.innerHTML = `! Fjederindeks (C=${C.toFixed(1)}) er over 12.<br>Risiko for ustabilitet og udknækning. Sænk D eller øg d.`;
            springWarning.classList.remove('hidden');
        } else {
            springWarning.classList.add('hidden');
        }
    }

    /**
     * TANDHJULS GENERATOR (Spur Gear Geometry)
     * Standard formler for lige fortanding.
     */
    function calcGear() {
        const m = parseFloat(gear_m.value) || 0;
        const z = parseInt(gear_z.value) || 0;
        const pa_deg = parseFloat(gear_pa.value) || 20;

        if (m <= 0 || z <= 0) {
            out_gear_da.textContent = "0.00";
            out_gear_d.textContent = "0.00";
            out_gear_df.textContent = "0.00";
            out_gear_h.textContent = "0.00";
            out_gear_db.textContent = "0.000";
            return;
        }

        // Delecirkel (Pitch Dia) = m * z
        const d = m * z;
        out_gear_d.textContent = d.toFixed(2);

        // Topcirkel (Outside Dia) = m * (z + 2)
        const da = m * (z + 2);
        out_gear_da.textContent = da.toFixed(2);

        // Fodcirkel (Root Dia) = m * (z - 2.5)  (Standard 1.25m clearance)
        const df = m * (z - 2.5);
        out_gear_df.textContent = df.toFixed(2);

        // Tanddybde (Whole Depth) = 2.25 * m
        const h = 2.25 * m;
        out_gear_h.textContent = h.toFixed(2);

        // Grundcirkel (Base Dia) = d * cos(trykvinkel)
        const pa_rad = pa_deg * (Math.PI / 180);
        const db = d * Math.cos(pa_rad);
        out_gear_db.textContent = db.toFixed(3);
    }

    // --- EVENT LISTENERS ---
    [springMat, spring_d, spring_D, spring_n].forEach(el => {
        if(el) {
            el.addEventListener('input', () => {
                calcSpring();
                MachiningOS.saveState({ 
                    'spring_mat': springMat.value,
                    'spring_d': spring_d.value,
                    'spring_D': spring_D.value,
                    'spring_n': spring_n.value
                });
            });
        }
    });

    [gear_m, gear_z, gear_pa].forEach(el => {
        if(el) {
            el.addEventListener('input', () => {
                calcGear();
                MachiningOS.saveState({
                    'gear_m': gear_m.value,
                    'gear_z': gear_z.value,
                    'gear_pa': gear_pa.value
                });
            });
        }
    });

    // --- INITIALISERING ---
    function init() {
        const state = MachiningOS.getState();
        
        if (state.spring_mat) springMat.value = state.spring_mat;
        if (state.spring_d) spring_d.value = state.spring_d;
        if (state.spring_D) spring_D.value = state.spring_D;
        if (state.spring_n) spring_n.value = state.spring_n;
        
        if (state.gear_m) gear_m.value = state.gear_m;
        if (state.gear_z) gear_z.value = state.gear_z;
        if (state.gear_pa) gear_pa.value = state.gear_pa;

        calcSpring();
        calcGear();
    }

    init();
});