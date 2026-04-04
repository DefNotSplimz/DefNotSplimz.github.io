/**
 * Machining_OS | Standards Library Logic
 * Version: 5.0 (Bearing Lookup & O-Ring Calc)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- BEARING ELEMENTER ---
    const bearSeries = document.getElementById('bearing-series');
    const bearBore = document.getElementById('bearing-bore');
    const outD = document.getElementById('bear-D');
    const outB = document.getElementById('bear-B');
    const outRef = document.getElementById('bear-ref');

    // --- ORING ELEMENTER ---
    const oringW = document.getElementById('oring-w');
    const oringApp = document.getElementById('oring-app');
    const outOrH = document.getElementById('oring-h');
    const outOrB = document.getElementById('oring-b');

    // --- DATA: BEARING TABLE (Subset of standard metric) ---
    const BEARING_DB = {
        '60': { '10': [26, 8], '12': [28, 8], '15': [32, 9], '17': [35, 10], '20': [42, 12] },
        '62': { '10': [30, 9], '12': [32, 10], '15': [35, 11], '17': [40, 12], '20': [47, 14] },
        '63': { '10': [35, 11], '12': [37, 12], '15': [42, 13], '17': [47, 14], '20': [52, 15] }
    };

    // --- LOGIK: BEARING LOOKUP ---
    function updateBearing() {
        const series = bearSeries.value;
        const bore = bearBore.value;
        
        if (BEARING_DB[series] && BEARING_DB[series][bore]) {
            const data = BEARING_DB[series][bore];
            outD.textContent = data[0];
            outB.textContent = data[1];
            outRef.textContent = `${series}${bore.padStart(2, '0')}`;
            
            // Gem state
            MachiningOS.saveState({ 'last_bear_bore': bore, 'last_bear_series': series });
        } else {
            outD.textContent = "--";
            outB.textContent = "--";
            outRef.textContent = "N/A";
        }
    }

    // --- LOGIK: O-RING GLAND (Standard approximations) ---
    function calculateORing() {
        const w = parseFloat(oringW.value);
        const isStatic = oringApp.value === 'static';
        
        let h, b;

        if (isStatic) {
            // Statisk tætning (ca. 20-25% kompression)
            h = w * 0.77;
            b = w * 1.35;
        } else {
            // Dynamisk tætning (ca. 10-15% kompression for lav friktion)
            h = w * 0.88;
            b = w * 1.20;
        }

        outOrH.textContent = h.toFixed(2);
        outOrB.textContent = b.toFixed(2);
    }

    // --- EVENT LISTENERS ---
    [bearSeries, bearBore].forEach(el => el.addEventListener('input', updateBearing));
    [oringW, oringApp].forEach(el => el.addEventListener('change', calculateORing));

    // --- INITIALISERING ---
    function init() {
        const state = MachiningOS.getState();
        if (state.last_bear_bore) bearBore.value = state.last_bear_bore;
        if (state.last_bear_series) bearSeries.value = state.last_bear_series;

        updateBearing();
        calculateORing();
    }

    init();
});