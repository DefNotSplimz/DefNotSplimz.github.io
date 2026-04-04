/**
 * Machining_OS | Manual Shop Logic
 * Precision Mechanic Update (4 decimals & Global Sync)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const machineRadios = document.querySelectorAll('input[name="machine"]');
    const opTypeSelect = document.getElementById('op-type');
    const workMaterialSelect = document.getElementById('work-material');
    const toolMatSelect = document.getElementById('tool-mat');
    const inputDia = document.getElementById('input-dia');
    const labelDia = document.getElementById('label-dia');

    const outVcRange = document.getElementById('out-vc-range');
    const outFzRange = document.getElementById('out-fz-range');
    const labelFzOut = document.getElementById('label-fz-out');
    const outFzUnit = document.getElementById('out-fz-unit');

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

    const outputSpecial = document.getElementById('output-special');
    const labelSpecialOut = document.getElementById('label-special-out');
    const outSpecialVal = document.getElementById('out-special-val');
    const infoSpecialDesc = document.getElementById('info-special-desc');
    const outputStandard = document.getElementById('output-standard');

    const tableBody = document.getElementById('setup-table-body');
    
    let currentData = {};

    // --- FINMEKANISK GEVIND DATABASE (M1 - M16) ---
    const THREAD_DB = {
        'M': { 'M1 x 0.25': 0.75, 'M1.2 x 0.25': 0.95, 'M1.6 x 0.35': 1.25, 'M2 x 0.4': 1.6, 'M2.5 x 0.45': 2.05, 'M3 x 0.5': 2.5, 'M4 x 0.7': 3.3, 'M5 x 0.8': 4.2, 'M6 x 1.0': 5.0, 'M8 x 1.25': 6.8, 'M10 x 1.5': 8.5, 'M12 x 1.75': 10.2 },
        'MF': { 'M6 x 0.75': 5.2, 'M8 x 1.0': 7.0, 'M10 x 1.0': 9.0, 'M12 x 1.25': 10.8, 'M12 x 1.5': 10.5 },
        'UNC': { 'No 2-56': 1.85, 'No 4-40': 2.35, 'No 6-32': 2.85, '1/4"-20': 5.1, '3/8"-16': 8.0 }
    };

    // --- ISO PASNINGS DATABASE (mm) ---
    const ISO_DB = [
        { max: 3, H7: [0, 0.010], H6: [0, 0.006], h6: [0, -0.006], js5: [0.002, -0.002], g6: [-0.002, -0.008] },
        { max: 6, H7: [0, 0.012], H6: [0, 0.008], h6: [0, -0.008], js5: [0.0025, -0.0025], g6: [-0.004, -0.012] },
        { max: 10, H7: [0, 0.015], H6: [0, 0.009], h6: [0, -0.009], js5: [0.003, -0.003], g6: [-0.005, -0.014] },
        { max: 18, H7: [0, 0.018], H6: [0, 0.011], h6: [0, -0.011], js5: [0.004, -0.004], g6: [-0.006, -0.017] },
        { max: 30, H7: [0, 0.021], H6: [0, 0.013], h6: [0, -0.013], js5: [0.0045, -0.0045], g6: [-0.007, -0.020] }
    ];

    // --- INITIALISERING ---
    function initManual() {
        // Hent materialer fra global DB
        workMaterialSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
            .map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');
        
        populateOperations();

        // Synk global state ved start
        const state = MachiningOS.getState();
        if (state['machine-select']) {
            const rad = document.querySelector(`input[name="machine"][value="${state['machine-select']}"]`);
            if (rad) rad.checked = true;
        }
        if (state['work-material']) workMaterialSelect.value = state['work-material'];
    }

    function populateOperations() {
        const mKey = document.querySelector('input[name="machine"]:checked').value;
        const type = MACHINING_DB.MACHINES[mKey].type;
        
        opTypeSelect.innerHTML = type === 'mill' 
            ? `<option value="mill_std">Fræsning (Spor/Kant)</option><option value="drill">Boring (HSS)</option><option value="tap">Gevindboring</option>`
            : `<option value="turn_std">Skrub Drejning</option><option value="turn_finish">Slet Drejning (Ra)</option><option value="drill">Centrumsboring</option><option value="tap">Gevindboring</option>`;
        
        labelDia.textContent = type === 'mill' ? 'Værktøj Dia (D)' : 'Emne Dia (D)';
        labelFzOut.textContent = type === 'mill' ? 'Mål fz' : 'Mål fn';
        outFzUnit.textContent = type === 'mill' ? 'MM/Z' : 'MM/REV';
        outVfUnit.textContent = type === 'mill' ? 'MM/MIN' : 'MM/REV';
        labelOutFeed.textContent = type === 'mill' ? '// Bord-Tilspænding' : '// Manuel Tilspænding';
        
        handleOperationChange();
    }

    function handleOperationChange() {
        const op = opTypeSelect.value;
        modSpecial.classList.add('hidden'); modThread.classList.add('hidden'); modRa.classList.add('hidden');
        outputSpecial.classList.add('hidden'); outputStandard.classList.remove('hidden');

        if (op === 'tap') {
            modSpecial.classList.remove('hidden'); modThread.classList.remove('hidden');
            outputStandard.classList.add('hidden'); outputSpecial.classList.remove('hidden');
            labelSpecialOut.textContent = '// Forbor-Størrelse (Skær)';
            populateThreads();
        } else if (op === 'turn_finish') {
            modSpecial.classList.remove('hidden'); modRa.classList.remove('hidden');
        }
        calculate();
    }

    function populateThreads() {
        const std = threadStandard.value;
        threadSize.innerHTML = Object.entries(THREAD_DB[std]).map(([k,v]) => `<option value="${v}">${k}</option>`).join('');
        calculate();
    }

    // --- BEREGNINGSKERNE ---
    function calculate() {
        const mKey = document.querySelector('input[name="machine"]:checked').value;
        const machine = MACHINING_DB.MACHINES[mKey];
        const op = opTypeSelect.value;
        const mat = MACHINING_DB.MATERIALS[workMaterialSelect.value];
        const toolMat = toolMatSelect.value;
        const d = parseFloat(inputDia.value) || 1;

        if (op === 'tap') {
            const drill = parseFloat(threadSize.value);
            outSpecialVal.textContent = drill.toFixed(2);
            infoSpecialDesc.textContent = `Hulstørrelse til ${threadSize.options[threadSize.selectedIndex].text}`;
            currentData = { machine: mKey, op: "TAP", geom: "Ø"+drill, rpm: "Lav", feed: "Manuel", note: "Brug skæreolie" };
            return;
        }

        // Finmekanisk logik: Reducer Vc til manuelle maskiner (pga. stabilitet og varme)
        let vc = (toolMat === 'HM' ? mat.vc_hm : mat.vc_hss) * 0.55; 
        let fz = mat.fz_ref;

        if (op === 'turn_finish') {
            const ra = parseFloat(document.getElementById('ra-target').value);
            const re = parseFloat(document.getElementById('ra-radius').value);
            // Finmekanisk formel for overfladeruhed
            fz = Math.sqrt((ra * 8 * re) / 1000); 
        }

        let n = Math.min((vc * 1000) / (Math.PI * d), machine.maxRpm);
        
        outVcRange.textContent = Math.round(vc);
        outFzRange.textContent = fz.toFixed(4);
        outRpm.textContent = Math.round(n);
        
        const vf = machine.type === 'mill' ? (n * 4 * fz) : fz; 
        outVf.textContent = machine.type === 'mill' ? Math.round(vf) : fz.toFixed(4);

        // Gauge Opdatering
        const pct = Math.min((n / machine.maxRpm) * 100, 100);
        rpmBar.style.width = `${pct}%`;
        rpmPctText.textContent = `${Math.round(pct)}%`;
        
        currentData = { machine: mKey, op: op, geom: "Ø"+d, rpm: Math.round(n), feed: outVf.textContent, note: "-" };
    }

    function calculateIso() {
        const d = parseFloat(document.getElementById('iso-dia').value);
        const cls = document.getElementById('iso-class').value;
        const match = ISO_DB.find(r => d <= r.max);
        const resEl = document.getElementById('iso-result');
        
        if (match && match[cls]) {
            const [lower, upper] = match[cls];
            resEl.textContent = `${upper > 0 ? '+' : ''}${upper} / ${lower > 0 ? '+' : ''}${lower} mm`;
            resEl.classList.remove('text-zinc-500');
            resEl.classList.add('text-primary');
        } else {
            resEl.textContent = "Uden for tabel";
            resEl.classList.add('text-zinc-500');
        }
    }

    // --- EVENT LISTENERS ---
    machineRadios.forEach(r => r.addEventListener('change', () => {
        MachiningOS.saveState({ 'machine-select': r.value });
        populateOperations();
    }));
    
    opTypeSelect.addEventListener('change', handleOperationChange);
    [workMaterialSelect, toolMatSelect, inputDia, threadStandard, threadSize, modRa].forEach(el => el.addEventListener('input', calculate));
    document.getElementById('iso-dia').addEventListener('input', calculateIso);
    document.getElementById('iso-class').addEventListener('input', calculateIso);

    document.getElementById('btn-save').addEventListener('click', () => {
        const row = `<tr class="border-b border-zinc-800 bg-black/40 hover:bg-primary/5 transition-colors">
            <td class="p-4 font-bold text-white uppercase">${currentData.machine}</td><td class="p-4">${currentData.op}</td>
            <td class="p-4">${currentData.geom}</td><td class="p-4 text-primary font-bold">${currentData.rpm}</td>
            <td class="p-4">${currentData.feed}</td><td class="p-4 text-primary italic">${currentData.note}</td>
            <td class="p-4 text-right print:hidden"><button class="text-zinc-600 hover:text-red-500 font-bold" onclick="this.closest('tr').remove()">SLET</button></td></tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    document.getElementById('btn-clear').addEventListener('click', () => tableBody.innerHTML = '');
    document.getElementById('btn-print').addEventListener('click', () => window.print());

    initManual();
});