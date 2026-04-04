/**
 * Machining_OS | Tribology & Finish Logic
 * Version: 5.0 (Surface Integrity & ISO Standards)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const raInput = document.getElementById('input-ra');
    const outRz = document.getElementById('out-rz');
    const outN = document.getElementById('out-n-grade');
    const outProcess = document.getElementById('out-process');

    const lubeApp = document.getElementById('lube-app');
    const lubeName = document.getElementById('lube-name');
    const lubeVg = document.getElementById('lube-vg');
    const lubeBase = document.getElementById('lube-base');
    const lubeNote = document.getElementById('lube-note');

    // --- ROUGHNESS CONVERSION DATA ---
    const N_GRADES = [
        { maxRa: 0.025, n: "N1", p: "Super Finish / Lapping" },
        { maxRa: 0.05, n: "N2", p: "Lapping" },
        { maxRa: 0.1, n: "N3", p: "Fine Lapping / Polishing" },
        { maxRa: 0.2, n: "N4", p: "Polishing / Mirror" },
        { maxRa: 0.4, n: "N5", p: "Fine Grinding" },
        { maxRa: 0.8, n: "N6", p: "Grinding / Fine Turning" },
        { maxRa: 1.6, n: "N7", p: "Reaming / Fine Milling" },
        { maxRa: 3.2, n: "N8", p: "Milling / Turning" },
        { maxRa: 6.3, n: "N9", p: "Drilling / Planing" },
        { maxRa: 12.5, n: "N10", p: "Rough Milling" },
        { maxRa: 25, n: "N11", p: "Rough Casting" },
        { maxRa: 50, n: "N12", p: "Forging" }
    ];

    // --- LUBRICATION DATA ---
    const LUBRICANTS = {
        'spindle': { name: "Mobil Velocity No. 3", vg: "2", base: "Ultra-Light Mineral", note: "For high-speed spindle bearings (10k+ RPM)." },
        'ways': { name: "Mobil Vactra No. 2", vg: "68", base: "Tackified Mineral", note: "Prevents stick-slip on machine guideways." },
        'clocks': { name: "Moebius 9010", vg: "Light", base: "Synthetic Fine Oil", note: "Standard oil for high-precision instruments and watches." },
        'cutting': { name: "Rocol RTD Liquid", vg: "Heavy", base: "Extreme Pressure", note: "Direct application for reaming and tapping in tough alloys." },
        'vacuum': { name: "Krytox LVP", vg: "Grease", base: "PFPE / High Vacuum", note: "Ultra-low vapor pressure. Safe for high vacuum systems." }
    };

    // --- CONVERSION LOGIK ---
    function updateRoughness() {
        const ra = parseFloat(raInput.value) || 0;
        
        // 1. Rz Approksimation (Statistisk faktor 4 for bearbejdning)
        const rz = ra * 4;
        outRz.textContent = rz.toFixed(2);

        // 2. N-Grade & Process matching
        let grade = "N12";
        let process = "Forging";

        for (let i = 0; i < N_GRADES.length; i++) {
            if (ra <= N_GRADES[i].maxRa) {
                grade = N_GRADES[i].n;
                process = N_GRADES[i].p;
                break;
            }
        }

        outN.textContent = grade;
        outProcess.textContent = process;

        // Gem state
        MachiningOS.saveState({ 'last_ra': ra });
    }

    // --- SMØRE LOGIK ---
    function updateLubricant() {
        const key = lubeApp.value;
        const data = LUBRICANTS[key];

        lubeName.textContent = data.name;
        lubeVg.textContent = data.vg;
        lubeBase.textContent = data.base;
        lubeNote.textContent = data.note;

        // Gem state
        MachiningOS.saveState({ 'last_lube_app': key });
    }

    // --- EVENT LISTENERS ---
    raInput.addEventListener('input', updateRoughness);
    lubeApp.addEventListener('change', updateLubricant);

    // --- INITIALISERING ---
    function init() {
        const state = MachiningOS.getState();
        if (state.last_ra) raInput.value = state.last_ra;
        if (state.last_lube_app) lubeApp.value = state.last_lube_app;

        updateRoughness();
        updateLubricant();
    }

    init();
});