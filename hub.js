/**
 * Machining_OS | CNC Hub Logic v8.0
 * Physics-Driven Simulation Engine // BUGFIX: NULL-SAFE
 */

document.addEventListener('DOMContentLoaded', () => {
    // Grundlæggende DOM Referencer
    const machineSelect = document.getElementById('machine-select');
    const workMaterialSelect = document.getElementById('work-material');
    const toolSelect = document.getElementById('active-tool-select');
    const camStrategySelect = document.getElementById('cam-strategy');
    const toggleManual = document.getElementById('toggle-manual');
    const manualInputs = document.getElementById('manual-inputs');
    
    // Strategi-database
    const STRATEGIES = {
        '2D Adaptive Clearing': { vc_mult: 1.5, fz_mult: 1.2, show_ae: true, show_ap: true },
        '2D Pocket': { vc_mult: 1.0, fz_mult: 1.0, show_ae: true, show_ap: true },
        'Face (Plan)': { vc_mult: 1.2, fz_mult: 1.0, show_ae: true, show_ap: true },
        'Drilling (Standard)': { vc_mult: 0.8, fz_mult: 1.0, show_ae: false, show_ap: true },
        'Tapping (Gevind)': { vc_mult: 0.3, fz_mult: 1.0, show_ae: false, show_ap: false }
    };

    function calculate() {
        const protocolError = document.getElementById('protocol-error');
        const protocolErrorText = document.getElementById('protocol-error-text');
        if (protocolError) protocolError.classList.add('hidden');

        // Hent databaser
        const machine = MACHINING_DB.MACHINES[machineSelect.value];
        const mat = MACHINING_DB.MATERIALS[workMaterialSelect.value];
        const strategy = STRATEGIES[camStrategySelect.value];
        
        // Sikkerhedscheck: Mangler database-referencer? [cite: 2026-03-11]
        if (!machine || !mat || !strategy) return;

        let d, z, toolMat;
        
        // HYBRID LOGIK: Manuel vs Inventory [cite: 2026-03-11]
        if (toggleManual && toggleManual.checked) {
            d = parseFloat(document.getElementById('manual-d')?.value) || 0;
            z = parseFloat(document.getElementById('manual-z')?.value) || 1;
            toolMat = document.getElementById('manual-mat')?.value || 'HM';
            if (toolSelect) toolSelect.disabled = true;
            if (manualInputs) manualInputs.classList.remove('hidden');
        } else {
            d = parseFloat(document.getElementById('hidden-d')?.value) || 0;
            z = parseFloat(document.getElementById('hidden-z')?.value) || 1;
            toolMat = document.getElementById('hidden-mat')?.value || 'HM';
            if (toolSelect) toolSelect.disabled = false;
            if (manualInputs) manualInputs.classList.add('hidden');
        }

        const ae = parseFloat(document.getElementById('input-ae')?.value) || 0;
        const ap = parseFloat(document.getElementById('input-ap')?.value) || 0;
        const stickout = parseFloat(document.getElementById('input-stickout')?.value) || 0;

        // Stop hvis diameter er nul [cite: 2026-03-11]
        if (d === 0) return;

        // 1. FYSISK SIMULERING: Skærehastighed (Vc) [cite: 2026-03-11]
        const hardnessFactor = Math.sqrt(150 / mat.hb);
        let vc = (toolMat === 'HM' ? mat.vc_hm : mat.vc_hss) * hardnessFactor;
        if (document.getElementById('toggle-hsm')?.checked) vc *= strategy.vc_mult;
        
        let n = Math.min((vc * 1000) / (Math.PI * d), machine.maxRpm);

        // 2. CHIP THINNING
        let base_fz = d * mat.fz_ref * strategy.fz_mult;
        let thinning_mult = (ae > 0 && ae < (d * 0.5)) ? Math.min(d / (2 * Math.sqrt(d * ae - Math.pow(ae, 2))), 3.0) : 1.0;
        let true_fz = base_fz * thinning_mult;

        // 3. UDBØJNINGS-ANALYSE (Deflection) [cite: 2026-03-11]
        const E = (toolMat === 'HM' ? MACHINING_DB.PHYSICS.E_MODULUS_HM : MACHINING_DB.PHYSICS.E_MODULUS_HSS) * 1000;
        const I = (Math.PI * Math.pow(d, 4)) / 64;
        const force_kc = mat.kc1 * Math.pow(true_fz, 1 - mat.mc);
        const force_total = (force_kc * ap * ae) / d;
        const deflection = (force_total * Math.pow(stickout, 3)) / (3 * E * I);
        
        let deflection_penalty = deflection > 0.02 ? 0.02 / deflection : 1.0;
        if (deflection_penalty < 1.0) {
            vc *= Math.sqrt(deflection_penalty); 
            true_fz *= deflection_penalty;
            n = Math.min((vc * 1000) / (Math.PI * d), machine.maxRpm);
        }

        // 4. POWER & MOMENT TJEK [cite: 2026-03-11]
        const vf = n * z * true_fz;
        const mrr = (ae * ap * vf) / 1000;
        const power_kw = (mrr * mat.kc1) / 60000;
        const torque_nm = (9550 * power_kw) / n;

        if (torque_nm > (machine.maxNm * MACHINING_DB.PHYSICS.TORQUE_EFFICIENCY) && protocolErrorText) {
            protocolError.classList.remove('hidden');
            protocolErrorText.innerHTML = `TORQUE LIMIT: ${torque_nm.toFixed(1)} Nm overstiger maskinens grænse.`;
        }

        // --- RENDER OUTPUT ---
        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-load').textContent = Math.round((power_kw / machine.kw) * 100);
        document.getElementById('out-deflection').textContent = deflection_penalty.toFixed(2) + 'x';
        document.getElementById('out-power').textContent = power_kw.toFixed(1) + ' kW';
    }

    // Event Listeners: Reagerer på alle ændringer [cite: 2026-03-11]
    const inputElements = [
        'machine-select', 'work-material', 'cam-strategy', 'toggle-manual',
        'manual-d', 'manual-z', 'manual-mat', 'input-ae', 'input-ap', 
        'input-stickout', 'toggle-hsm'
    ];

    inputElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', calculate);
            if (el.type === 'number') el.addEventListener('input', calculate);
        }
    });

    if (toolSelect) {
        toolSelect.addEventListener('change', (e) => {
            const opt = e.target.options[e.target.selectedIndex];
            if (!opt.value) return;
            document.getElementById('hidden-d').value = opt.dataset.d;
            document.getElementById('hidden-z').value = opt.dataset.z;
            document.getElementById('hidden-mat').value = opt.dataset.mat;
            calculate();
        });
    }

    function initHub() {
        if (machineSelect) {
            machineSelect.innerHTML = Object.entries(MACHINING_DB.MACHINES)
                .map(([k, m]) => `<option value="${k}">${m.name.toUpperCase()}</option>`).join('');
        }
        if (workMaterialSelect) {
            workMaterialSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
                .map(([k, m]) => `<option value="${k}">${m.name}</option>`).join('');
        }
        if (camStrategySelect) {
            camStrategySelect.innerHTML = Object.keys(STRATEGIES)
                .map(k => `<option value="${k}">${k.toUpperCase()}</option>`).join('');
        }
        loadSavedData();
        calculate(); // Start første beregning
    }

    function loadSavedData() {
        const tools = MachiningOS.getTools();
        if (toolSelect) {
            toolSelect.innerHTML = '<option value="">-- SELECT_TOOL --</option>' + 
                tools.map(t => `<option value="${t.t}" data-d="${t.d}" data-z="${t.z}" data-mat="${t.mat}">T${t.t} (Ø${t.d})</option>`).join('');
        }
        renderSetupLog();
    }

    function renderSetupLog() {
        const logs = MachiningOS.getLogs('cnc');
        if (tableBody) {
            tableBody.innerHTML = logs.map(entry => `
                <tr class="border-b border-zinc-900/50">
                    <td class="py-3 font-black text-white">${entry.tNum}</td>
                    <td class="py-3 text-zinc-400 font-mono text-[10px] uppercase">${entry.strategy}</td>
                    <td class="py-3 text-primary font-black italic">${entry.rpm}</td>
                    <td class="py-3 text-white font-black italic">${entry.vf}</td>
                    <td class="py-3 text-right"><button onclick="deleteRow('${entry.id}')" class="text-[8px] text-zinc-700 hover:text-red-500 uppercase">Remove</button></td>
                </tr>`).join('');
        }
    }

    window.deleteRow = (id) => { MachiningOS.deleteLogEntry('cnc', id); renderSetupLog(); };

    document.getElementById('btn-save')?.addEventListener('click', () => {
        const entry = {
            tNum: toggleManual?.checked ? 'M-T' : `T${toolSelect.value}`,
            strategy: camStrategySelect.value,
            rpm: document.getElementById('out-rpm').textContent,
            vf: document.getElementById('out-vf').textContent
        };
        MachiningOS.saveLogEntry('cnc', entry);
        renderSetupLog();
    });

    initHub();
});