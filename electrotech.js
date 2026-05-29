/**
 * Machining_OS | Electro-Mech Logic
 * Version: 5.1 (Geckodrive Inductance Engine & True Axis Resolution)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- AXIS RESOLUTION ELEMENTER ---
    const axisSteps = document.getElementById('axis-steps');
    const axisMicro = document.getElementById('axis-micro');
    const axisRatio = document.getElementById('axis-ratio');
    const axisPitch = document.getElementById('axis-pitch');
    const outRes = document.getElementById('axis-res');
    const outMicron = document.getElementById('axis-micron-text');

    // --- STEPPER DRIVE KINETICS ELEMENTER ---
    const stepMh = document.getElementById('step-mh');
    const stepA = document.getElementById('step-a');
    const outV = document.getElementById('step-v');
    const outW = document.getElementById('step-w');

    // --- TORQUE ELEMENTER ---
    const torqueIn = document.getElementById('torque-in');
    const torqueNm = document.getElementById('torque-nm');
    const torqueNcm = document.getElementById('torque-ncm');

    // --- BEREGNINGER ---

    /**
     * Akse Opløsning
     * Formel: Resolution = Pitch / (Steps * Microstepping * GearRatio)
     */
    function calculateResolution() {
        const steps = parseFloat(axisSteps.value) || 200;
        const micro = parseFloat(axisMicro.value) || 1;
        const ratio = parseFloat(axisRatio.value) || 1;
        const pitch = parseFloat(axisPitch.value) || 5;

        if (steps <= 0 || micro <= 0 || ratio <= 0 || pitch <= 0) {
            outRes.textContent = "0.0000";
            outMicron.textContent = "Ugyldige parametre";
            return;
        }

        const pulsesPerRev = steps * micro * ratio;
        const res = pitch / pulsesPerRev;
        
        outRes.textContent = res.toFixed(4);
        outMicron.textContent = `${(res * 1000).toFixed(3)} Mikron pr. Pulse`;

        // Gem state
        MachiningOS.saveState({ 
            'axis_steps': steps, 
            'axis_micro': micro,
            'axis_ratio': ratio,
            'axis_pitch': pitch
        });
    }

    /**
     * Stepper PSU Sizing (Geckodrive Formel)
     * Formel: V_opt = 32 * sqrt(L i mH)
     * Watt = V_opt * Ampere (Max teoretisk pr. akse)
     */
    function calculateDriveKinetics() {
        const mH = parseFloat(stepMh.value) || 0;
        const amps = parseFloat(stepA.value) || 0;

        if (mH > 0 && amps > 0) {
            const vOpt = 32 * Math.sqrt(mH);
            const watts = vOpt * amps;
            
            outV.textContent = vOpt.toFixed(1);
            outW.textContent = Math.round(watts);
        } else {
            outV.textContent = "0.0";
            outW.textContent = "0";
        }

        MachiningOS.saveState({ 'step_mh': mH, 'step_a': amps });
    }

    /**
     * Moment Konvertering
     */
    function calculateTorque() {
        const ozin = parseFloat(torqueIn.value) || 0;
        
        // 1 oz-in = 0.00706155 Nm
        const nm = ozin * 0.00706155;
        
        torqueNm.textContent = nm.toFixed(2);
        torqueNcm.textContent = (nm * 100).toFixed(1);

        MachiningOS.saveState({ 'torque_in': ozin });
    }

    // --- EVENT LISTENERS ---
    [axisSteps, axisMicro, axisRatio, axisPitch].forEach(el => {
        el.addEventListener('change', calculateResolution);
        el.addEventListener('input', calculateResolution);
    });

    [stepMh, stepA].forEach(el => el.addEventListener('input', calculateDriveKinetics));
    torqueIn.addEventListener('input', calculateTorque);

    // --- INITIALISERING ---
    function init() {
        const state = MachiningOS.getState();
        
        if (state.axis_steps) axisSteps.value = state.axis_steps;
        if (state.axis_micro) axisMicro.value = state.axis_micro;
        if (state.axis_ratio) axisRatio.value = state.axis_ratio;
        if (state.axis_pitch) axisPitch.value = state.axis_pitch;
        
        if (state.step_mh) stepMh.value = state.step_mh;
        if (state.step_a) stepA.value = state.step_a;
        if (state.torque_in) torqueIn.value = state.torque_in;

        calculateResolution();
        calculateDriveKinetics();
        calculateTorque();
    }

    init();
});