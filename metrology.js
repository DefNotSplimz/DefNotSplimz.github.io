/**
 * Machining_OS | Metrology Logic
 * 500% Optimization: Thermal Compensation & Precision Stacking
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const workMaterialSelect = document.getElementById('work-material');
    const lengthInput = document.getElementById('length-input');
    const tempRange = document.getElementById('temp-range');
    const deltaValText = document.getElementById('delta-val');
    const tempValDisplay = document.getElementById('temp-val');
    const thermalWarning = document.getElementById('thermal-warning');
    const thermalIcon = document.getElementById('thermal-icon');
    
    const targetDimInput = document.getElementById('target-dim');
    const stackResultContainer = document.getElementById('stack-result');

    // --- INITIALISERING ---
    function initMetrology() {
        // Hent materialer fra global DB
        workMaterialSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
            .map(([k, v]) => `<option value="${v.thermal}">${v.name} (${v.thermal} µm)</option>`).join('');

        // Synkroniser med global state
        const state = MachiningOS.getState();
        if (state['work-material']) {
            // Find den termiske værdi der matcher materialekoden
            const matCode = state['work-material'];
            const thermalVal = MACHINING_DB.MATERIALS[matCode].thermal;
            workMaterialSelect.value = thermalVal;
        }

        calcThermal();
    }

    // --- TERMISK LOGIK (PRÆCISION) ---
    function calcThermal() {
        const alpha = parseFloat(workMaterialSelect.value) / 1000000; // µm/m·K til m/m·K
        const L = parseFloat(lengthInput.value) || 0;
        const T = parseFloat(tempRange.value);
        const dT = T - 20.0; // Difference fra standard 20°C

        // ΔL = α * L * ΔT
        const dL = alpha * L * dT;

        // UI Opdatering
        tempValDisplay.textContent = T.toFixed(1) + "°C";
        deltaValText.textContent = (dL >= 0 ? "+" : "") + dL.toFixed(4);

        // Visuel Feedback
        if (Math.abs(dL) < 0.0001) {
            deltaValText.parentElement.className = "text-6xl font-black italic tracking-tighter tabular-nums text-white";
            thermalWarning.textContent = "Nominel reference temperatur. Ingen afvigelse.";
            thermalIcon.className = "w-12 h-12 flex items-center justify-center border border-zinc-800 text-zinc-800";
            thermalIcon.innerHTML = '<span class="font-black">OK</span>';
        } else if (dL > 0) {
            deltaValText.parentElement.className = "text-6xl font-black italic tracking-tighter tabular-nums text-red-500";
            thermalWarning.textContent = `Emnet er udvidet med ${(dL * 1000).toFixed(1)} µm. Træk dette tal fra din måling.`;
            thermalIcon.className = "w-12 h-12 flex items-center justify-center border border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
            thermalIcon.innerHTML = '<span class="font-black">EXP</span>';
        } else {
            deltaValText.parentElement.className = "text-6xl font-black italic tracking-tighter tabular-nums text-blue-500";
            thermalWarning.textContent = `Emnet er trukket sammen med ${(Math.abs(dL) * 1000).toFixed(1)} µm. Læg dette tal til din måling.`;
            thermalIcon.className = "w-12 h-12 flex items-center justify-center border border-blue-500/30 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]";
            thermalIcon.innerHTML = '<span class="font-black">CON</span>';
        }
    }

    // --- GAUGE BLOCK COMBINATOR (OPTIMAL ALGORITME) ---
    // En professionel algoritme, der eliminerer decimaler fra højre mod venstre for at minimere stakken.
    function calculatePrecisionStack() {
        let val = parseFloat(targetDimInput.value);
        if (isNaN(val) || val <= 0) {
            stackResultContainer.innerHTML = '';
            return;
        }

        const stack = [];
        let remain = Math.round(val * 10000) / 10000;

        // 1. Mikron-trin (4. decimal: .0001 - .0009)
        // Her antages et finmekanisk sæt med 1.0001 trin.
        let d4 = Math.round((remain % 0.001) * 10000) / 10000;
        if (d4 > 0) {
            let block = 1.000 + d4; 
            stack.push(block);
            remain = Math.round((remain - block) * 10000) / 10000;
        }

        // 2. Tusindedele (3. decimal: .001 - .009)
        let d3 = Math.round((remain % 0.01) * 1000) / 1000;
        if (d3 > 0) {
            let block = 1.000 + d3;
            stack.push(block);
            remain = Math.round((remain - block) * 10000) / 10000;
        }

        // 3. Hundrededele (2. decimal: .01 - .49)
        let d2 = Math.round((remain % 0.5) * 100) / 100;
        if (d2 > 0) {
            let block = 1.00 + d2;
            if (block < 1.00) block = 1.01; // Sikkerhed for små klodser
            stack.push(block);
            remain = Math.round((remain - block) * 10000) / 10000;
        }

        // 4. Halve og hele (0.5 - 9.5)
        let d1 = Math.round((remain % 10) * 2) / 2;
        if (d1 > 0) {
            stack.push(d1);
            remain = Math.round((remain - d1) * 10000) / 10000;
        }

        // 5. Store klodser (10, 20, 30...)
        while (remain >= 10) {
            let block = Math.min(Math.floor(remain / 10) * 10, 100);
            stack.push(block);
            remain = Math.round((remain - block) * 10000) / 10000;
        }

        // Render resultater
        stackResultContainer.innerHTML = stack.map(b => `
            <div class="flex justify-between items-center p-4 border border-zinc-800 bg-zinc-900/40 hover:border-primary/40 transition-all group">
                <div class="flex flex-col">
                    <span class="text-[8px] font-mono text-zinc-600 uppercase group-hover:text-primary transition-colors">DIN 861 / Grade 0</span>
                    <span class="text-white font-black font-mono">Måleklods</span>
                </div>
                <span class="text-primary font-black font-mono text-xl tracking-tighter">${b.toFixed(4)} <small class="text-[10px]">mm</small></span>
            </div>
        `).join('');

        if (Math.abs(remain) > 0.0001) {
            stackResultContainer.innerHTML += `
                <div class="p-3 border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-mono italic">
                    ! Advarsel: Restafvigelse på ${remain.toFixed(4)} mm. Klodssæt utilstrækkeligt til denne kombination.
                </div>`;
        }
    }

    // --- EVENT LISTENERS ---
    [workMaterialSelect, lengthInput, tempRange].forEach(el => {
        el.addEventListener('input', calcThermal);
    });

    targetDimInput.addEventListener('input', calculatePrecisionStack);

    // Initial kørsel
    initMetrology();
});