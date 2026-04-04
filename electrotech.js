/**
 * Machining_OS | Electro-Mech Logic
 * Version: 5.0 (Signal Precision & Power Dynamics)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ENCODER ELEMENTER ---
    const encPpr = document.getElementById('enc-ppr');
    const encPitch = document.getElementById('enc-pitch');
    const outRes = document.getElementById('enc-res');
    const outMicron = document.getElementById('enc-micron-text');

    // --- OHM / POWER ELEMENTER ---
    const ohmV = document.getElementById('ohm-v');
    const ohmA = document.getElementById('ohm-a');
    const outW = document.getElementById('ohm-w');
    const outR = document.getElementById('ohm-r');

    // --- TORQUE ELEMENTER ---
    const torqueIn = document.getElementById('torque-in');
    const torqueNm = document.getElementById('torque-nm');
    const torqueNcm = document.getElementById('torque-ncm');

    // --- BEREGNINGER ---

    function calculateEncoder() {
        const ppr = parseFloat(encPpr.value) || 0;
        const pitch = parseFloat(encPitch.value) || 0;

        if (ppr <= 0 || pitch <= 0) {
            outRes.textContent = "0.0000";
            outMicron.textContent = "Ugyldige parametre";
            return;
        }

        // Opløsning = Stigning / PPR
        const res = pitch / ppr;
        outRes.textContent = res.toFixed(4);
        outMicron.textContent = `${(res * 1000).toFixed(2)} Mikron pr. step`;

        // Gem state
        MachiningOS.saveState({ 'last_ppr': ppr, 'last_pitch': pitch });
    }

    function calculateOhm() {
        const v = parseFloat(ohmV.value) || 0;
        const a = parseFloat(ohmA.value) || 0;

        if (v > 0 && a > 0) {
            // P = V * I
            outW.textContent = (v * a).toFixed(1);
            // R = V / I
            outR.textContent = (v / a).toFixed(2);
        } else {
            outW.textContent = "0.0";
            outR.textContent = "0.00";
        }
    }

    function calculateTorque() {
        const ozin = parseFloat(torqueIn.value) || 0;
        
        // 1 oz-in = 0.00706155 Nm
        const nm = ozin * 0.00706155;
        
        torqueNm.textContent = nm.toFixed(2);
        torqueNcm.textContent = (nm * 100).toFixed(1);
    }

    // --- EVENT LISTENERS ---
    [encPpr, encPitch].forEach(el => el.addEventListener('input', calculateEncoder));
    [ohmV, ohmA].forEach(el => el.addEventListener('input', calculateOhm));
    torqueIn.addEventListener('input', calculateTorque);

    // --- INITIALISERING ---
    function init() {
        const state = MachiningOS.getState();
        if (state.last_ppr) encPpr.value = state.last_ppr;
        if (state.last_pitch) encPitch.value = state.last_pitch;

        calculateEncoder();
        calculateOhm();
        calculateTorque();
    }

    init();
});