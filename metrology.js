/**
 * Machining_OS | Metrology Logic
 * Version: 5.7 (Thermal Sync, Sine Bar Protocol & M87 Stack Validation)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    // Thermal
    const workMaterialSelect = document.getElementById('work-material');
    const lengthInput = document.getElementById('length-input');
    const tempRange = document.getElementById('temp-range');
    const deltaValText = document.getElementById('delta-val');
    const tempValDisplay = document.getElementById('temp-val');
    const thermalWarning = document.getElementById('thermal-warning');
    const thermalIcon = document.getElementById('thermal-icon');
    
    // Sine Bar
    const sineLengthInput = document.getElementById('sine-length');
    const sineAngleInput = document.getElementById('sine-angle');
    const sineResultText = document.getElementById('sine-result');
    const btnSendToStack = document.getElementById('btn-send-to-stack');

    // Gauge Blocks
    const targetDimInput = document.getElementById('target-dim');
    const stackResultContainer = document.getElementById('stack-result');

    // --- INITIALISERING ---
    function initMetrology() {
        if (workMaterialSelect && typeof MACHINING_DB !== 'undefined') {
            workMaterialSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
                .map(([k, v]) => `<option value="${v.thermal}" class="bg-zinc-900">${v.name} (${v.thermal} µm)</option>`).join('');
        }

        const state = MachiningOS.getState();
        if (state['work-material']) {
            const matCode = state['work-material'];
            if(MACHINING_DB.MATERIALS[matCode]) {
                workMaterialSelect.value = MACHINING_DB.MATERIALS[matCode].thermal;
            }
        }

        calcThermal();
        calcSineBar();
    }

    // --- TERMISK LOGIK (PRÆCISION) ---
    function calcThermal() {
        const alpha = parseFloat(workMaterialSelect.value) / 1000000; 
        const L = parseFloat(lengthInput.value) || 0;
        const T = parseFloat(tempRange.value);
        const dT = T - 20.0;

        const dL = alpha * L * dT;

        tempValDisplay.textContent = T.toFixed(1) + "°C";
        deltaValText.textContent = (dL >= 0 ? "+" : "") + dL.toFixed(4);

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

    // --- SINUSLINEAL LOGIK (NY) ---
    function calcSineBar() {
        const L = parseFloat(sineLengthInput.value);
        const angleDeg = parseFloat(sineAngleInput.value);
        
        if(isNaN(L) || isNaN(angleDeg)) return;

        // Omregn grader til radianer og udregn modstående katete (Højde)
        const angleRad = angleDeg * (Math.PI / 180);
        const H = L * Math.sin(angleRad);
        
        sineResultText.textContent = H.toFixed(4);
    }

    // --- GAUGE BLOCK COMBINATOR (M87 STANDARD) ---
    function calculatePrecisionStack() {
        let val = parseFloat(targetDimInput.value);
        if (isNaN(val) || val < 1.0) {
            stackResultContainer.innerHTML = '';
            return;
        }

        const stack = [];
        let remain = Math.round(val * 1000) / 1000;

        // 1. Mikron-serie (1.001 - 1.009)
        let d3 = Math.round((remain % 0.01) * 1000) / 1000;
        if (d3 > 0) {
            let block = 1.000 + d3;
            stack.push(block);
            remain = Math.round((remain - block) * 1000) / 1000;
        }

        // 2. Hundrededel-serie (1.01 - 1.49)
        let decimalPart = Math.round((remain % 1) * 100) / 100; 
        if (decimalPart > 0 || remain < 0.5) {
            let block = 0;
            if (decimalPart >= 0.50) {
                block = 1.00 + (decimalPart - 0.50);
            } else {
                if(decimalPart > 0) {
                    block = 1.00 + decimalPart;
                }
            }
            if(block >= 1.01 && block <= 1.49) {
                stack.push(block);
                remain = Math.round((remain - block) * 1000) / 1000;
            }
        }

        // 3. Halve (0.50 - 9.50)
        if (Math.round((remain % 1) * 10) / 10 === 0.5) {
            let rMod10 = Math.round((remain % 10) * 10) / 10;
            if (rMod10 > 0) {
                stack.push(rMod10);
                remain = Math.round((remain - rMod10) * 1000) / 1000;
            }
        } else {
            let rMod10 = Math.round((remain % 10));
            if (rMod10 > 0) {
                stack.push(rMod10);
                remain = Math.round((remain - rMod10) * 1000) / 1000;
            }
        }

        // 4. Tiere (10, 20, 30... 100)
        while (remain >= 10) {
            let block = Math.min(Math.floor(remain / 10) * 10, 100);
            stack.push(block);
            remain = Math.round((remain - block) * 1000) / 1000;
        }

        // Sortering af stakken (Største klods nederst for stabilitet)
        stack.sort((a,b) => b - a);

        stackResultContainer.innerHTML = stack.map(b => `
            <div class="flex justify-between items-center p-4 border border-zinc-800 bg-zinc-900/40 hover:border-primary/40 transition-all group">
                <div class="flex flex-col">
                    <span class="text-[8px] font-mono text-zinc-600 uppercase group-hover:text-primary transition-colors">ISO 3650 / Grade 0</span>
                    <span class="text-white font-black font-mono">Måleklods</span>
                </div>
                <span class="text-primary font-black font-mono text-2xl tracking-tighter">${b.toFixed(3)} <small class="text-[10px]">mm</small></span>
            </div>
        `).join('');

        if (Math.abs(remain) > 0.001) {
            stackResultContainer.innerHTML += `
                <div class="p-3 mt-2 border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-mono italic">
                    ! Advarsel: Restafvigelse på ${remain.toFixed(3)} mm. M87 sæt kan ikke danne denne kombination eksakt.
                </div>`;
        }
    }

    // --- EVENT LISTENERS ---
    [workMaterialSelect, lengthInput, tempRange].forEach(el => {
        el.addEventListener('input', calcThermal);
    });

    [sineLengthInput, sineAngleInput].forEach(el => {
        el.addEventListener('input', calcSineBar);
    });

    targetDimInput.addEventListener('input', calculatePrecisionStack);

    btnSendToStack.addEventListener('click', () => {
        // Hent højde, rund af til 3 decimaler og fyr den i klodsprogrammet
        const h = parseFloat(sineResultText.textContent);
        targetDimInput.value = h.toFixed(3);
        
        // Blink feedback
        const origText = btnSendToStack.innerHTML;
        btnSendToStack.innerHTML = '<span class="text-emerald-500 animate-pulse uppercase">DATA_OVERFØRT_OK</span>';
        setTimeout(() => btnSendToStack.innerHTML = origText, 1000);
        
        calculatePrecisionStack();
    });

    initMetrology();
});