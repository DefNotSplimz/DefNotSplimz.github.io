/**
 * Machining_OS | Standards Library Logic
 * Version: 5.1 (Bearing Decoder, O-Ring Gland Protocol & Fastener Engine)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER: FASTENER ---
    const fastSize = document.getElementById('fast-size');
    const fastTap = document.getElementById('fast-tap');
    const fastClear = document.getElementById('fast-clear');
    const fastCbD = document.getElementById('fast-cb-d');
    const fastCbH = document.getElementById('fast-cb-h');

    // --- ELEMENT REFERENCER: BEARING ---
    const bearCode = document.getElementById('bear-code');
    const outBearD = document.getElementById('bear-d');
    const outBearOD = document.getElementById('bear-D');
    const outBearB = document.getElementById('bear-B');
    const outBearSuffix = document.getElementById('bear-suffix');

    // --- ELEMENT REFERENCER: ORING ---
    const oringCs = document.getElementById('oring-cs');
    const oringApp = document.getElementById('oring-app');
    const outOrL = document.getElementById('oring-l');
    const outOrT = document.getElementById('oring-t');
    const outOrR = document.getElementById('oring-r');


    // --- DATA: FASTENER (ISO 273 / DIN 974) ---
    const FASTENER_DB = {
        'M3': { tap: 2.5, clear: 3.4, cb_d: 6.0, cb_h: 3.4 },
        'M4': { tap: 3.3, clear: 4.5, cb_d: 8.0, cb_h: 4.4 },
        'M5': { tap: 4.2, clear: 5.5, cb_d: 10.0, cb_h: 5.4 },
        'M6': { tap: 5.0, clear: 6.6, cb_d: 11.0, cb_h: 6.4 },
        'M8': { tap: 6.8, clear: 9.0, cb_d: 15.0, cb_h: 8.6 },
        'M10': { tap: 8.5, clear: 11.0, cb_d: 18.0, cb_h: 10.6 },
        'M12': { tap: 10.2, clear: 13.5, cb_d: 20.0, cb_h: 12.6 },
        'M16': { tap: 14.0, clear: 17.5, cb_d: 26.0, cb_h: 16.6 },
        'M20': { tap: 17.5, clear: 22.0, cb_d: 33.0, cb_h: 20.6 }
    };

    // --- DATA: BEARING (Standard SKF Deep Groove 60, 62, 63 series up to 10) ---
    const BEARING_DB = {
        '6000': { D: 26, B: 8 }, '6001': { D: 28, B: 8 }, '6002': { D: 32, B: 9 }, '6003': { D: 35, B: 10 }, '6004': { D: 42, B: 12 },
        '6005': { D: 47, B: 12 }, '6006': { D: 55, B: 13 }, '6007': { D: 62, B: 14 }, '6008': { D: 68, B: 15 }, '6009': { D: 75, B: 16 }, '6010': { D: 80, B: 16 },
        
        '6200': { D: 30, B: 9 }, '6201': { D: 32, B: 10 }, '6202': { D: 35, B: 11 }, '6203': { D: 40, B: 12 }, '6204': { D: 47, B: 14 },
        '6205': { D: 52, B: 15 }, '6206': { D: 62, B: 16 }, '6207': { D: 72, B: 17 }, '6208': { D: 80, B: 18 }, '6209': { D: 85, B: 19 }, '6210': { D: 90, B: 20 },
        
        '6300': { D: 35, B: 11 }, '6301': { D: 37, B: 12 }, '6302': { D: 42, B: 13 }, '6303': { D: 47, B: 14 }, '6304': { D: 52, B: 15 },
        '6305': { D: 62, B: 17 }, '6306': { D: 72, B: 19 }, '6307': { D: 80, B: 21 }, '6308': { D: 90, B: 23 }, '6309': { D: 100, B: 25 }, '6310': { D: 110, B: 27 }
    };

    // --- DATA: O-RING GLANDS (Parker AS568) ---
    // Format: { d: Spordybde (L), w: Sporbredde (T), r: Radius }
    const ORING_DB = {
        '1.78': { stat_rad: { d: 1.30, w: 2.40, r: '0.2-0.4' }, stat_ax: { d: 1.30, w: 2.60, r: '0.2-0.4' }, dyn_pneu: { d: 1.45, w: 2.40, r: '0.2-0.4' } },
        '2.62': { stat_rad: { d: 2.00, w: 3.60, r: '0.3-0.6' }, stat_ax: { d: 2.00, w: 3.80, r: '0.3-0.6' }, dyn_pneu: { d: 2.25, w: 3.60, r: '0.3-0.6' } },
        '3.53': { stat_rad: { d: 2.80, w: 4.80, r: '0.4-0.8' }, stat_ax: { d: 2.80, w: 5.00, r: '0.4-0.8' }, dyn_pneu: { d: 3.10, w: 4.80, r: '0.4-0.8' } },
        '5.33': { stat_rad: { d: 4.30, w: 7.10, r: '0.4-0.8' }, stat_ax: { d: 4.30, w: 7.50, r: '0.4-0.8' }, dyn_pneu: { d: 4.70, w: 7.10, r: '0.4-0.8' } },
        '6.99': { stat_rad: { d: 5.70, w: 9.50, r: '0.8-1.2' }, stat_ax: { d: 5.70, w: 10.00, r: '0.8-1.2' }, dyn_pneu: { d: 6.10, w: 9.50, r: '0.8-1.2' } }
    };


    // --- LOGIK: FASTENER ---
    function updateFastener() {
        const data = FASTENER_DB[fastSize.value];
        if(!data) return;

        fastTap.innerHTML = `${data.tap.toFixed(1)} <small class="text-[10px] font-normal text-zinc-500">mm</small>`;
        fastClear.innerHTML = `${data.clear.toFixed(1)} <small class="text-[10px] font-normal text-primary/50">mm</small>`;
        fastCbD.textContent = data.cb_d.toFixed(1);
        fastCbH.textContent = data.cb_h.toFixed(1);

        MachiningOS.saveState({ 'fast_size': fastSize.value });
    }

    // --- LOGIK: BEARING DECODER ---
    function decodeBearing() {
        const input = bearCode.value.toUpperCase().trim();
        
        // Regex: Finder grundkode (F.eks 6204) og alt efter (Suffix)
        const match = input.match(/^([6][023][0-9]{2})(.*)$/);
        
        if (match) {
            const baseCode = match[1];
            let suffixCode = match[2].replace(/[^A-Z0-9]/g, ''); // Fjern bindestreger og skråstreger for nemmere match

            const data = BEARING_DB[baseCode];
            
            if (data) {
                // Beregn Bore (d) ud fra de to sidste cifre
                const boreCode = parseInt(baseCode.slice(-2));
                let d = 0;
                if (boreCode === 0) d = 10;
                else if (boreCode === 1) d = 12;
                else if (boreCode === 2) d = 15;
                else if (boreCode === 3) d = 17;
                else if (boreCode >= 4) d = boreCode * 5;

                outBearD.textContent = d;
                outBearOD.textContent = data.D;
                outBearB.textContent = data.B;

                // Suffix Translation
                let suffixText = "ÅBENT LEJE (INGEN TÆTNING)";
                if (suffixCode.includes('2RS')) suffixText = "2X GUMMIPAKDÅSER (STØVTÆT)";
                else if (suffixCode.includes('RS')) suffixText = "1X GUMMIPAKDÅSE";
                else if (suffixCode.includes('ZZ') || suffixCode.includes('2Z')) suffixText = "2X STÅLSKÆRME";
                else if (suffixCode.includes('Z')) suffixText = "1X STÅLSKÆRM";

                if (suffixCode.includes('C3')) suffixText += " // C3 SLØR";
                if (suffixCode.includes('C4')) suffixText += " // C4 SLØR (EKSTREM)";

                outBearSuffix.textContent = suffixText;
                
                MachiningOS.saveState({ 'bear_code': input });
                return;
            }
        }
        
        // Hvis regex fejler eller koden ikke er i DB
        outBearD.textContent = "--";
        outBearOD.textContent = "--";
        outBearB.textContent = "--";
        outBearSuffix.textContent = "UKENDT KODE / IKKE I DB";
    }

    // --- LOGIK: O-RING GLAND ---
    function updateOring() {
        const cs = oringCs.value;
        const app = oringApp.value;
        
        const data = ORING_DB[cs][app];
        if(!data) return;

        outOrL.textContent = data.d.toFixed(2);
        outOrT.textContent = data.w.toFixed(2);
        outOrR.textContent = data.r;

        MachiningOS.saveState({ 'oring_cs': cs, 'oring_app': app });
    }

    // --- EVENT LISTENERS ---
    fastSize.addEventListener('change', updateFastener);
    bearCode.addEventListener('input', decodeBearing);
    [oringCs, oringApp].forEach(el => el.addEventListener('change', updateOring));

    // --- INITIALISERING ---
    function init() {
        const state = MachiningOS.getState();
        
        if (state.fast_size) fastSize.value = state.fast_size;
        if (state.bear_code) bearCode.value = state.bear_code;
        if (state.oring_cs) oringCs.value = state.oring_cs;
        if (state.oring_app) oringApp.value = state.oring_app;

        updateFastener();
        decodeBearing();
        updateOring();
    }

    init();
});