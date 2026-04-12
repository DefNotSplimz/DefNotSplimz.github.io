/**
 * Machining_OS | Manual Shop Logic
 * Version: 6.5 (Insert Geometry Matrix, Global Re, Ap Min, Kinematics)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const machineRadios = document.querySelectorAll('input[name="machine"]');
    const opTypeSelect = document.getElementById('op-type');
    const workMaterialSelect = document.getElementById('work-material');
    const toolMatSelect = document.getElementById('tool-mat');
    
    const inputDia = document.getElementById('input-dia');
    const labelDia = document.getElementById('label-dia');
    const colZRe = document.getElementById('col-z-re');
    const labelZRe = document.getElementById('label-z-re');
    const inputZRe = document.getElementById('input-z-re');

    const outVcRange = document.getElementById('out-vc-range');
    const outFzRange = document.getElementById('out-fz-range');
    const labelFzOut = document.getElementById('label-fz-out');
    const outFzUnit = document.getElementById('out-fz-unit');
    const outApMin = document.getElementById('out-ap-min');

    const modSpecial = document.getElementById('module-special');
    const modThread = document.getElementById('mod-thread');
    const threadStandard = document.getElementById('thread-standard');
    const threadSize = document.getElementById('thread-size');
    const modRa = document.getElementById('mod-ra');

    const outRpm = document.getElementById('out-rpm');
    const outVf = document.getElementById('out-vf');
    const outVfUnit = document.getElementById('out-vf-unit');
    const labelOutFeed = document.getElementById('label-out-feed');
    const rpmBar = document.getElementById('rpm-bar');
    const rpmPctText = document.getElementById('rpm-pct');
    const facingWarning = document.getElementById('facing-warning');
    const toolWarning = document.getElementById('tool-warning');
    const toolWarningText = document.getElementById('tool-warning-text');

    const outputSpecial = document.getElementById('output-special');
    const labelSpecialOut = document.getElementById('label-special-out');
    const outSpecialVal = document.getElementById('out-special-val');
    const infoSpecialDesc = document.getElementById('info-special-desc');
    const outputStandard = document.getElementById('output-standard');

    const tableBody = document.getElementById('setup-table-body');
    
    let currentData = {};

    // --- OPERATION MATRIX ---
    const MANUAL_OPS = {
        'manual_mill': {
            'mill_face': { name: 'Planfræsning', vc_m: 1.0, fz_m: 1.0, hide_zre: false, tool_d: true },
            'mill_side': { name: 'Kantfræsning', vc_m: 1.0, fz_m: 1.0, hide_zre: false, tool_d: true },
            'mill_slot': { name: 'Sporfræsning (Fuld)', vc_m: 0.8, fz_m: 0.7, hide_zre: false, tool_d: true },
            'mill_drill_hss': { name: 'Boring (HSS)', vc_m: 0.8, fz_m: 1.0, hide_zre: false, tool_d: true },
            'mill_drill_hm': { name: 'Boring (HM)', vc_m: 1.0, fz_m: 1.0, hide_zre: false, tool_d: true },
            'mill_ream': { name: 'Rivalisering', vc_m: 0.5, fz_m: 2.0, hide_zre: true, tool_d: true },
            'mill_boringhead': { name: 'Udborehoved (Boring Head)', vc_m: 1.2, fz_m: 0.2, hide_zre: true, tool_d: true }, 
            'mill_chamfer': { name: 'Undersænkning', vc_m: 0.5, fz_m: 0.5, hide_zre: false, tool_d: true },
            'tap': { name: 'Indvendig Gevind (Tap)', vc_m: 0.3, fz_m: 1.0, hide_zre: true, tool_d: true },
            'die': { name: 'Udvendig Gevind (Snit)', vc_m: 0.3, fz_m: 1.0, hide_zre: true, tool_d: false }
        },
        'manual_turn': {
            'turn_rough': { name: 'Skrub Drejning', vc_m: 1.0, fz_m: 1.0, hide_zre: false, tool_d: false },
            'turn_finish': { name: 'Slet Drejning (Ra)', vc_m: 1.3, fz_m: 1.0, hide_zre: false, tool_d: false },
            'turn_face': { name: 'Plan-Drejning (Facing)', vc_m: 1.0, fz_m: 0.8, hide_zre: false, tool_d: false }, 
            'turn_groove': { name: 'Afstikning / Spor', vc_m: 0.6, fz_m: 0.5, hide_zre: true, tool_d: false },
            'turn_thread': { name: 'Gevindskæring (Stål)', vc_m: 0.4, fz_m: 1.0, hide_zre: true, tool_d: false },
            'turn_drill': { name: 'Boring (Pinol)', vc_m: 0.8, fz_m: 1.0, hide_zre: true, tool_d: true },
            'turn_ream': { name: 'Rivalisering', vc_m: 0.5, fz_m: 2.0, hide_zre: true, tool_d: true },
            'tap': { name: 'Indvendig Gevind (Pinol)', vc_m: 0.3, fz_m: 1.0, hide_zre: true, tool_d: true },
            'die': { name: 'Udvendig Gevind (Snit)', vc_m: 0.3, fz_m: 1.0, hide_zre: true, tool_d: false }
        }
    };

    const THREAD_DB = {
        'M': { 'M1 x 0.25': 0.75, 'M1.2 x 0.25': 0.95, 'M1.6 x 0.35': 1.25, 'M2 x 0.4': 1.6, 'M2.5 x 0.45': 2.05, 'M3 x 0.5': 2.5, 'M4 x 0.7': 3.3, 'M5 x 0.8': 4.2, 'M6 x 1.0': 5.0, 'M8 x 1.25': 6.8, 'M10 x 1.5': 8.5, 'M12 x 1.75': 10.2, 'M16 x 2.0': 14.0 },
        'MF': { 'M6 x 0.75': 5.2, 'M8 x 1.0': 7.0, 'M10 x 1.0': 9.0, 'M12 x 1.25': 10.8, 'M12 x 1.5': 10.5, 'M16 x 1.5': 14.5 },
        'UNC': { 'No 2-56': 1.85, 'No 4-40': 2.35, 'No 6-32': 2.85, '1/4"-20': 5.1, '5/16"-18': 6.6, '3/8"-16': 8.0, '1/2"-13': 10.8 }
    };

    const ISO_DB = [
        { max: 3, H7: [0, 0.010], H6: [0, 0.006], h6: [0, -0.006], js5: [0.002, -0.002], g6: [-0.002, -0.008] },
        { max: 6, H7: [0, 0.012], H6: [0, 0.008], h6: [0, -0.008], js5: [0.0025, -0.0025], g6: [-0.004, -0.012] },
        { max: 10, H7: [0, 0.015], H6: [0, 0.009], h6: [0, -0.009], js5: [0.003, -0.003], g6: [-0.005, -0.014] },
        { max: 18, H7: [0, 0.018], H6: [0, 0.011], h6: [0, -0.011], js5: [0.004, -0.004], g6: [-0.006, -0.017] },
        { max: 30, H7: [0, 0.021], H6: [0, 0.013], h6: [0, -0.013], js5: [0.0045, -0.0045], g6: [-0.007, -0.020] },
        { max: 50, H7: [0, 0.025], H6: [0, 0.016], h6: [0, -0.016], js5: [0.0055, -0.0055], g6: [-0.009, -0.025] },
        { max: 80, H7: [0, 0.030], H6: [0, 0.019], h6: [0, -0.019], js5: [0.0065, -0.0065], g6: [-0.010, -0.029] },
        { max: 120, H7: [0, 0.035], H6: [0, 0.022], h6: [0, -0.022], js5: [0.0075, -0.0075], g6: [-0.012, -0.034] },
        { max: 180, H7: [0, 0.040], H6: [0, 0.025], h6: [0, -0.025], js5: [0.009, -0.009], g6: [-0.014, -0.039] }
    ];

    function initManual() {
        if (workMaterialSelect && typeof MACHINING_DB !== 'undefined') {
            workMaterialSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
                .map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');
        }
        
        const state = MachiningOS.getState();
        if (state['machine-select-manual']) {
            const rad = document.querySelector(`input[name="machine"][value="${state['machine-select-manual']}"]`);
            if (rad) rad.checked = true;
        }

        populateOperations();
        renderSetupLog();
    }

    function populateOperations() {
        const mKey = document.querySelector('input[name="machine"]:checked').value;
        const type = MACHINING_DB.MACHINES[mKey].type;
        const ops = MANUAL_OPS[type];
        
        opTypeSelect.innerHTML = Object.entries(ops).map(([k, v]) => `<option value="${k}" class="bg-zinc-900">${v.name}</option>`).join('');
        
        if (type === 'manual_mill') {
            labelFzOut.textContent = 'Target fz';
            outFzUnit.textContent = 'MM/Z';
            outVfUnit.textContent = 'MM/MIN';
            labelOutFeed.textContent = '// Bord-Tilspænding';
            labelZRe.textContent = 'Tænder (Z)';
            inputZRe.value = 4;
            inputZRe.step = 1;
        } else {
            labelFzOut.textContent = 'Target fn';
            outFzUnit.textContent = 'MM/REV';
            outVfUnit.textContent = 'MM/REV';
            labelOutFeed.textContent = '// Maskin-Tilspænding';
            labelZRe.textContent = 'Næseradius (Re)';
            inputZRe.value = 0.4;
            inputZRe.step = 0.1;
        }
        
        handleOperationChange();
    }

    function handleOperationChange() {
        const op = opTypeSelect.value;
        const mKey = document.querySelector('input[name="machine"]:checked').value;
        const type = MACHINING_DB.MACHINES[mKey].type;
        const opData = MANUAL_OPS[type][op];

        colZRe.style.display = opData.hide_zre ? 'none' : 'flex';
        labelDia.textContent = opData.tool_d ? 'Værktøj (D)' : 'Emne (D)';
        
        if(op === 'turn_face') facingWarning.classList.remove('hidden');
        else facingWarning.classList.add('hidden');

        modSpecial.classList.add('hidden'); modThread.classList.add('hidden'); modRa.classList.add('hidden');
        outputSpecial.classList.add('hidden'); outputStandard.classList.remove('hidden');

        if (op === 'tap' || op === 'die') {
            modSpecial.classList.remove('hidden'); modThread.classList.remove('hidden');
            outputStandard.classList.add('hidden'); outputSpecial.classList.remove('hidden');
            labelSpecialOut.textContent = op === 'tap' ? '// Forbor-Størrelse (Skær)' : '// Stangdiameter (Snit)';
            populateThreads();
        } else if (op === 'turn_finish') {
            modSpecial.classList.remove('hidden'); modRa.classList.remove('hidden');
        } else if (op === 'turn_thread') {
            modSpecial.classList.remove('hidden'); modThread.classList.remove('hidden');
            populateThreads();
        }
        calculate();
    }

    function populateThreads() {
        const std = threadStandard.value;
        threadSize.innerHTML = Object.entries(THREAD_DB[std]).map(([k,v]) => `<option value="${v}" class="bg-zinc-900">${k}</option>`).join('');
        calculate();
    }

    function calculateIso() {
        const d = parseFloat(document.getElementById('iso-dia').value);
        const resEl = document.getElementById('iso-result');
        const targetEl = document.getElementById('iso-target'); 

        if(!d) {
            resEl.textContent = "- / -";
            if(targetEl) targetEl.textContent = "DRO: -";
            return;
        }
        
        const cls = document.getElementById('iso-class').value;
        const match = ISO_DB.find(r => d <= r.max);
        
        if (match && match[cls]) {
            const [upper, lower] = match[cls];
            resEl.textContent = `${upper > 0 ? '+' : ''}${upper} / ${lower > 0 ? '+' : ''}${lower}`;
            resEl.classList.replace('text-zinc-500', 'text-primary');
            
            const middle = (upper + lower) / 2;
            const absoluteTarget = d + middle;
            if(targetEl) targetEl.textContent = `DRO Mål: ${absoluteTarget.toFixed(3)} mm`;
            
        } else {
            resEl.textContent = "Uden for tabel";
            resEl.classList.replace('text-primary', 'text-zinc-500');
            if(targetEl) targetEl.textContent = "DRO: -";
        }
    }

// --- BEREGNINGSKERNE ---
    function calculate() {
        const mKey = document.querySelector('input[name="machine"]:checked').value;
        const machine = MACHINING_DB.MACHINES[mKey];
        const op = opTypeSelect.value;
        const mat = MACHINING_DB.MATERIALS[workMaterialSelect.value];
        const toolMat = toolMatSelect.value;
        const d = parseFloat(inputDia.value) || 1;
        const zReVal = parseFloat(inputZRe.value) || 1;

        toolWarning.classList.add('hidden');
        outApMin.textContent = "-";

        const opData = MANUAL_OPS[machine.type][op];
        if (!opData) return;

        if (op === 'tap') {
            const drill = parseFloat(threadSize.value);
            outSpecialVal.textContent = drill.toFixed(2);
            infoSpecialDesc.textContent = `Forbor-størrelse til ${threadSize.options[threadSize.selectedIndex].text}`;
            currentData = { machine: mKey, op: "TAP", geom: "Ø"+drill.toFixed(2), rpm: "Lav", feed: "Manuel", note: "Brug Skæreolie" };
            return;
        }

        if (op === 'die') {
            const text = threadSize.options[threadSize.selectedIndex].text;
            let pitchVal = 1; let nomDia = parseFloat(text.match(/\d+/)[0]);
            if (text.includes('x')) pitchVal = parseFloat(text.split('x')[1]);
            else if (text.includes('-')) pitchVal = 25.4 / parseFloat(text.split('-')[1]);
            
            const rodDia = nomDia - (pitchVal * 0.1);
            
            outSpecialVal.textContent = rodDia.toFixed(2);
            infoSpecialDesc.textContent = `Ned-drejet Stangdiameter før ${text} snitbakke påføres.`;
            currentData = { machine: mKey, op: "DIE", geom: "Ø"+rodDia.toFixed(2), rpm: "Lav", feed: "Manuel", note: "Brug Skæreolie" };
            return;
        }

        // --- SKÆRGEOMETRI & KINEMATIK (GLOBAL ISO-P vs ISO-N) ---
        let base_vc = toolMat.includes('HM') ? mat.vc_hm : mat.vc_hss;
        let vc_penalty = 1.0;
        let fz_penalty = 1.0;
        
        const isAluInsert = toolMat === 'HM_ALU';
        const isSteelInsert = toolMat === 'HM_STEEL';
        
        // Matematisk vurdering af materiale (hvis 'type' tagget mangler i shared_core)
        const isHeavyMat = mat.type === 'heavy' || base_vc < 150;
        const isLightMat = mat.type === 'light' || base_vc >= 150;

        // GLOBAL MISMATCH DETECTOR (Gælder nu både Mill og Turn)
        if (isHeavyMat && isAluInsert) {
            toolWarning.classList.remove('hidden');
            toolWarningText.textContent = "ISO-N (Alu) skærgeometri anvendt i stål/hårdt materiale. Skæret vil splintre under tryk. Ekstrem Vc/Fz drossel anvendt.";
            vc_penalty = 0.3; fz_penalty = 0.5;
        } else if (isLightMat && isSteelInsert) {
            toolWarning.classList.remove('hidden');
            toolWarningText.textContent = "ISO-P (Stål) skærgeometri anvendt i blødt materiale. Risiko for rivning (Built-Up Edge) og gnidning. Drossel anvendt.";
            vc_penalty = 0.7; fz_penalty = 0.8;
        }
        
        // Specifik drejebænks-fysik (Minimum Ap pga. Næseradius)
        if (machine.type === 'manual_turn') {
            if (!opData.hide_zre) {
                const ap_min = zReVal * 0.6;
                outApMin.textContent = ap_min.toFixed(2);
            }
        }

        // Kalkulerer med straf
        let vc = base_vc * 0.55 * opData.vc_m * vc_penalty;
        let fz = mat.fz_ref * opData.fz_m * fz_penalty;
        let feedText = "";

        if (op === 'turn_finish') {
            const ra = parseFloat(document.getElementById('ra-target').value);
            const re = zReVal; 
            fz = Math.sqrt((ra * 8 * re) / 1000); 
        }

        let n = Math.min((vc * 1000) / (Math.PI * d), machine.maxRpm);

        if (op === 'turn_thread') {
            const text = threadSize.options[threadSize.selectedIndex].text;
            let pitchVal = 1;
            if (text.includes('x')) pitchVal = parseFloat(text.split('x')[1]);
            else if (text.includes('-')) pitchVal = 25.4 / parseFloat(text.split('-')[1]);
            
            fz = pitchVal; 
            feedText = pitchVal.toFixed(3);
        } else {
             if (machine.type === 'manual_mill' && !opData.hide_zre) {
                 feedText = Math.round(n * zReVal * fz);
             } else {
                 feedText = fz.toFixed(4);
             }
        }
        
        outVcRange.textContent = Math.round(vc);
        outFzRange.textContent = fz.toFixed(4);
        outRpm.textContent = Math.round(n);
        outVf.textContent = feedText;

        const pct = Math.min((n / machine.maxRpm) * 100, 100);
        rpmBar.style.width = `${pct}%`;
        rpmPctText.textContent = `${Math.round(pct)}%`;
        
        let zNote = '-';
        if (!opData.hide_zre) {
            zNote = machine.type === 'manual_mill' ? `Z${zReVal}` : `Re${zReVal}`;
        }
        currentData = { machine: mKey, op: opData.name.toUpperCase(), geom: "Ø"+d, rpm: Math.round(n), feed: feedText, note: zNote };
    }

    function renderSetupLog() {
        const logs = MachiningOS.getLogs('manual');
        if(tableBody) {
            tableBody.innerHTML = logs.map(entry => `
                <tr class="border-b border-zinc-900/50 bg-black/20 hover:bg-primary/[0.03] transition-all tabular-nums group" data-id="${entry.id}">
                    <td class="p-6"><span class="text-xl font-black italic tracking-tighter text-white">${entry.machine}</span></td>
                    <td class="p-6"><div class="flex flex-col"><span class="text-xs font-black text-zinc-300 uppercase italic tracking-tight">${entry.op}</span><span class="label-micro !text-[7px] !text-zinc-600 !before:hidden mt-1 uppercase print:hidden">Analog_Execution</span></div></td>
                    <td class="p-6"><span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">${entry.geom}</span></td>
                    <td class="p-6"><div class="flex flex-col"><span class="text-lg font-black italic text-primary tracking-tighter">${entry.rpm}</span><span class="text-[8px] font-mono text-primary/40 font-bold tracking-widest uppercase">REV_MIN</span></div></td>
                    <td class="p-6"><div class="flex flex-col"><span class="text-lg font-black italic text-white tracking-tighter">${entry.feed}</span><span class="text-[8px] font-mono text-zinc-600 font-bold tracking-widest uppercase">FEED</span></div></td>
                    <td class="p-6"><span class="text-[10px] font-bold text-primary uppercase tracking-widest">${entry.note}</span></td>
                    <td class="p-6 text-right print:hidden"><button onclick="deleteRow('${entry.id}')" class="label-micro !text-zinc-800 hover:!text-red-600 transition-all font-black !before:hidden italic uppercase tracking-widest">Remove_Entry</button></td>
                </tr>`).join('');
        }
    }

    window.deleteRow = (id) => {
        MachiningOS.deleteLogEntry('manual', parseInt(id));
        renderSetupLog();
    };

    machineRadios.forEach(r => r.addEventListener('change', () => {
        MachiningOS.saveState({ 'machine-select-manual': r.value });
        populateOperations();
    }));
    
    opTypeSelect.addEventListener('change', handleOperationChange);
    threadStandard.addEventListener('change', populateThreads);
    
    [workMaterialSelect, toolMatSelect, inputDia, inputZRe, threadSize, modRa].forEach(el => {
        if(el) el.addEventListener('input', calculate);
    });
    
    document.getElementById('iso-dia').addEventListener('input', calculateIso);
    document.getElementById('iso-class').addEventListener('input', calculateIso);

    const btnSave = document.getElementById('btn-save');
    if(btnSave) {
        btnSave.addEventListener('click', () => {
            MachiningOS.saveLogEntry('manual', currentData);
            renderSetupLog();
            const originalText = btnSave.innerHTML;
            btnSave.innerHTML = '<span class="text-emerald-500 animate-pulse uppercase tracking-widest italic font-black relative z-10">LOCKED_IN_DB</span>';
            setTimeout(() => btnSave.innerHTML = originalText, 1500);
        });
    }

    const btnClear = document.getElementById('btn-clear');
    if(btnClear) {
        btnClear.addEventListener('click', () => {
            if(confirm("CRITICAL: Vil du destruere hele den manuelle log?")) {
                MachiningOS.clearLogs('manual');
                renderSetupLog();
            }
        });
    }
    
    const btnPrint = document.getElementById('btn-print');
    if(btnPrint) {
        btnPrint.addEventListener('click', () => window.print());
    }

    initManual();
});