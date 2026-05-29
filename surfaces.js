/**
 * Machining_OS | Tribology & Finish Logic
 * Version: 5.2 (Expanded Fluid Dynamics & Dynamic Abrasive Matrix)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const raInput = document.getElementById('input-ra');
    const outRz = document.getElementById('out-rz');
    const outN = document.getElementById('out-n-grade');
    const outProcess = document.getElementById('out-process');

    const abrasiveTableBody = document.getElementById('abrasive-table-body');

    const lubeApp = document.getElementById('lube-app');
    const lubeName = document.getElementById('lube-name');
    const lubeVg = document.getElementById('lube-vg');
    const lubeBase = document.getElementById('lube-base');
    const lubeNote = document.getElementById('lube-note');

    // --- ROUGHNESS CONVERSION DATA ---
    const N_GRADES = [
        { maxRa: 0.025, n: "N1", p: "Super Finish / Lapning" },
        { maxRa: 0.05, n: "N2", p: "Lapning" },
        { maxRa: 0.1, n: "N3", p: "Fin Lapning / Polering" },
        { maxRa: 0.2, n: "N4", p: "Polering / Spejl" },
        { maxRa: 0.4, n: "N5", p: "Fin Slibning / Honing" },
        { maxRa: 0.8, n: "N6", p: "Slibning / Fin Drejning" },
        { maxRa: 1.6, n: "N7", p: "Rivalisering / Fin Fræsning" },
        { maxRa: 3.2, n: "N8", p: "Standard Fræs / Drej" },
        { maxRa: 6.3, n: "N9", p: "Boring / Skrub Fræs" },
        { maxRa: 12.5, n: "N10", p: "Grov Skrub" },
        { maxRa: 25, n: "N11", p: "Grov Støbning / Savning" },
        { maxRa: 50, n: "N12", p: "Flammeskæring / Smedning" }
    ];

    // --- ABRASIVES DB (FEPA STANDARD) ---
    const ABRASIVES_DB = [
        { grit: 80, micron: "~200", ra: "3.2 - 6.3", desc: "Grov afgratning / Rustfjernelse" },
        { grit: 120, micron: "~125", ra: "1.6 - 3.2", desc: "Standard slibning" },
        { grit: 240, micron: "~58", ra: "0.8 - 1.6", desc: "Fin slibning (Før maling)" },
        { grit: 400, micron: "~35", ra: "0.4 - 0.8", desc: "Slet slibning (Før eloxering)" },
        { grit: 600, micron: "~26", ra: "0.2 - 0.4", desc: "Mat-polering" },
        { grit: 1000, micron: "~18", ra: "0.1 - 0.2", desc: "Pre-polering" },
        { grit: 2000, micron: "~10", ra: "0.05 - 0.1", desc: "Højglans forberedelse" },
        { grit: 3000, micron: "~6", ra: "< 0.05", desc: "Spejl-polering / Lapning" }
    ];

    // --- LUBRICATION DATA (UDVIDET) ---
    const LUBRICANTS = {
        'cnc_alu': { name: "Blaser Blasocut / TRIM", vg: "Blanding: 7-10%", base: "Mineralsk Emulsion (Vand)", note: "Modvirker opbygningsskær (BUE) i alu. Skift jævnligt for at undgå bakterier." },
        'cnc_steel': { name: "Hocut 795 / TRIM MicroSol", vg: "Blanding: 8-12%", base: "Semi-Syntetisk High Pressure", note: "EP (Extreme Pressure) additiver sikrer lang standtid i rustfast og sejt stål." },
        'tap_alu': { name: "Isopropyl Alkohol / Sprit", vg: "Ultra-Light", base: "Ren Alkohol / Aerosol (WD-40)", note: "Fordamper og køler lynhurtigt. Efterlader gevindet rent og forhindrer mikrosvejsninger i alu." },
        'tap_steel': { name: "Rocol RTD / MolyDrop", vg: "Heavy / Paste", base: "Sulphur / Extreme Pressure", note: "Tyktflydende gevindpasta. Reducerer friktion drastisk ved skæring af M-gevind i 316L og værktøjsstål." },
        'ways': { name: "Mobil Vactra No. 2", vg: "ISO VG 68", base: "Tackified Mineral", note: "Standard vangeolie. Forhindrer stick-slip på horisontale og vertikale maskinvanger." },
        'spindle': { name: "Mobil Velocity No. 3", vg: "ISO VG 2", base: "Ultra-Light Mineral", note: "Special-olie til High-Speed CNC spindel-lejer (10.000+ RPM)." },
        'protect': { name: "Boeshield T-9 / CRC SP-350", vg: "Film-forming", base: "Paraffin / Voks", note: "Fortrænger vand og efterlader en tynd, ikke-klistrende rustbeskyttende hinde på bearbejdede stålemner." },
        'clocks': { name: "Moebius 9010", vg: "Light", base: "Syntetisk Finolie", note: "Standard instrument-olie. Nedbrydes ikke og hærder ikke over tid." },
        'vacuum': { name: "Krytox LVP", vg: "Grease", base: "PFPE / High Vacuum", note: "Ultra-lavt damptryk. Afgasser ikke. Essentiel til O-ringe i vakuum- og clean-room kamre." }
    };

    // --- RENDER ABRASIVES ---
    function renderAbrasives() {
        abrasiveTableBody.innerHTML = ABRASIVES_DB.map((a, index) => {
            // Fremhæv specifikke kornstørrelser som 'milepæle'
            let rowClass = "border-b border-zinc-900/50 hover:bg-white/5 transition-colors";
            let gritClass = "text-white font-bold";
            
            if (a.grit === 400 || a.grit === 3000) {
                gritClass = "text-primary font-black";
            } else if (a.grit === 80 || a.grit === 1000) {
                gritClass = "text-zinc-300 font-bold";
            }

            return `
            <tr class="${rowClass}">
                <td class="py-3 ${gritClass}">${a.grit}</td>
                <td class="py-3">${a.micron}</td>
                <td class="py-3 text-white font-bold">${a.ra}</td>
                <td class="py-3 text-right font-sans text-[9px] text-zinc-500 uppercase tracking-widest">${a.desc}</td>
            </tr>`;
        }).join('');
    }

    // --- CONVERSION LOGIK ---
    function updateRoughness() {
        const ra = parseFloat(raInput.value) || 0;
        
        // 1. Rz Approksimation (Tommelfingerregel: Rz = ~4x til 7x Ra for drej/fræs, vi bruger 4.5 som gennemsnit)
        const rz = ra * 4.5;
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
        renderAbrasives();

        const state = MachiningOS.getState();
        if (state.last_ra) raInput.value = state.last_ra;
        if (state.last_lube_app) lubeApp.value = state.last_lube_app;

        updateRoughness();
        updateLubricant();
    }

    init();
});