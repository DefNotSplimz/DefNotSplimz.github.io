/**
 * Machining_OS | CNC Hub Logic v7.0
 * Intelligent Diameter-Scaled Feed & Speed System
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Referencer
    const machineSelect = document.getElementById('machine-select');
    const workMaterialSelect = document.getElementById('work-material');
    const toolSelect = document.getElementById('active-tool-select');
    const camStrategySelect = document.getElementById('cam-strategy');
    
    const inputAe = document.getElementById('input-ae');
    const inputAp = document.getElementById('input-ap');
    const inputStickout = document.getElementById('input-stickout');
    const inputCel = document.getElementById('input-cel');
    
    const toggleHsm = document.getElementById('toggle-hsm');
    const toggleFinish = document.getElementById('toggle-finish');
    const toggleSafe = document.getElementById('toggle-safe');
    
    const protocolError = document.getElementById('protocol-error');
    const protocolErrorText = document.getElementById('protocol-error-text');
    const tableBody = document.getElementById('setup-table-body');

    // KOMPLET MATERIALE INDEKS V2
    const UPDATED_MATERIALS = {
        'plastic': { name: 'Plastic (POM/PE/Nylon)', vc_hm: 500, vc_hss: 120, fz_factor: 0.040, kc: 200 },
        'alu': { name: 'Alu 6082-T6', vc_hm: 400, vc_hss: 80, fz_factor: 0.025, kc: 700 },
        'brass': { name: 'Messing Ms58', vc_hm: 180, vc_hss: 40, fz_factor: 0.020, kc: 600 },
        'steel': { name: 'Stål S355 / Konstruktion', vc_hm: 220, vc_hss: 30, fz_factor: 0.015, kc: 1600 },
        'stainless': { name: 'AISI 316L / Rustfast', vc_hm: 80, vc_hss: 15, fz_factor: 0.008, kc: 2200 },
        'toolsteel': { name: 'Værktøjsstål (Hærdet)', vc_hm: 60, vc_hss: 10, fz_factor: 0.006, kc: 2400 },
        'titanium': { name: 'Titanium Grade 5', vc_hm: 50, vc_hss: 8, fz_factor: 0.010, kc: 2000 }
    };

    // STRATEGI LOGIK
    const STRATEGIES = {
        '2D Adaptive Clearing': { vc_mult: 1.5, fz_mult: 1.2, show_ae: true, show_ap: true },
        '2D Pocket': { vc_mult: 1.0, fz_mult: 1.0, show_ae: true, show_ap: true },
        '2D Contour': { vc_mult: 1.0, fz_mult: 1.0, show_ae: false, show_ap: true },
        '2D Chamfer (Fas)': { vc_mult: 1.0, fz_mult: 0.8, show_ae: true, show_ap: true },
        'Face (Planfræsning)': { vc_mult: 1.2, fz_mult: 1.0, show_ae: true, show_ap: true },
        'Slotting (Fuld_Spor)': { vc_mult: 0.8, fz_mult: 0.8, show_ae: false, show_ap: true },
        'Drilling (Standard)': { vc_mult: 0.8, fz_mult: 1.0, show_ae: false, show_ap: true }
    };

    function initHub() {
        if (machineSelect) {
            machineSelect.innerHTML = Object.entries(MACHINING_DB.MACHINES)
                .filter(([_, m]) => m.type === 'cnc')
                .map(([k, m]) => `<option value="${k}">${m.name.toUpperCase()}</option>`).join('');
        }
        if (workMaterialSelect) {
            workMaterialSelect.innerHTML = Object.entries(UPDATED_MATERIALS)
                .map(([k, m]) => `<option value="${k}">${m.name}</option>`).join('');
        }
        if (camStrategySelect) {
            camStrategySelect.innerHTML = Object.keys(STRATEGIES)
                .map(k => `<option value="${k}">${k.toUpperCase()}</option>`).join('');
        }
        loadSavedData();
    }

    function calculate() {
        protocolError.classList.add('hidden');
        const machine = MACHINING_DB.MACHINES[machineSelect.value];
        const mat = UPDATED_MATERIALS[workMaterialSelect.value];
        const strategy = STRATEGIES[camStrategySelect.value];
        
        const d = parseFloat(document.getElementById('hidden-d').value) || 0;
        const z = parseFloat(document.getElementById('hidden-z').value) || 1;
        const ae = parseFloat(inputAe.value) || 0;
        const ap = parseFloat(inputAp.value) || 0;
        const stickout = parseFloat(inputStickout.value) || 0;
        const cel = parseFloat(inputCel.value) || 0;
        
        if (d === 0 || !mat) return;

        // 1. DYNAMISK FZ BEREGNING (Scaled by Diameter) [cite: 2026-03-11]
        let base_fz = d * mat.fz_factor * strategy.fz_mult;

        // 2. SPEED BEREGNING
        const isHM = document.getElementById('hidden-mat').value === 'HM';
        let vc = isHM ? mat.vc_hm : mat.vc_hss;
        if (toggleHsm.checked) vc *= strategy.vc_mult;
        
        let n = Math.min((vc * 1000) / (Math.PI * d), machine.maxRpm);

        // 3. CHIP THINNING KOMPENSATION
        let thinning_mult = 1.0;
        if (ae > 0 && ae < (d * 0.5) && camStrategySelect.value !== '2D Chamfer (Fas)') {
            thinning_mult = d / (2 * Math.sqrt(d * ae - Math.pow(ae, 2)));
            thinning_mult = Math.min(thinning_mult, 3.0);
        }
        let true_fz = base_fz * thinning_mult;

        // 4. DEFLECTION & STICKOUT PENALTY [cite: 2026-03-11]
        const ld_ratio = stickout / d;
        let deflection_mult = 1.0;
        if (ld_ratio > 4.0) {
            deflection_mult = Math.pow(4.0 / ld_ratio, 2);
            vc *= deflection_mult;
            true_fz *= deflection_mult;
            n = Math.min((vc * 1000) / (Math.PI * d), machine.maxRpm);
        }

        // 5. EKSEKVERING AF FEEDRATE
        if (toggleFinish.checked) { vc *= 1.25; true_fz *= 0.50; }
        if (toggleSafe.checked) { vc *= 0.70; true_fz *= 0.70; }
        
        const vf = n * z * true_fz;

        // 6. THERMODYNAMICS (MRR & LOAD)
        const mrr = (ae * ap * vf) / 1000;
        const power_kw = (mrr * mat.kc) / 60000;
        const power_pct = (power_kw / (machine.kw || 5.6)) * 100;

        if (power_pct > 100) {
            protocolError.classList.remove('hidden');
            protocolErrorText.innerHTML = `SPINDEL STALL: Operation kræver ${power_kw.toFixed(1)} kW. Drosl Ae eller Ap.`;
        }

        // --- RENDER ---
        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-fz-range').textContent = true_fz.toFixed(4);
        document.getElementById('out-mrr').textContent = mrr.toFixed(1);
        document.getElementById('out-load').textContent = Math.round(power_pct);
        document.getElementById('out-thinning').textContent = thinning_mult.toFixed(2) + 'x';
        document.getElementById('out-deflection').textContent = deflection_mult.toFixed(2) + 'x';
        
        // Derivative Feeds
        document.getElementById('out-ramp-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-lead-in').textContent = Math.round(vf * 0.8).toLocaleString('da-DK');
        document.getElementById('out-plunge').textContent = Math.round(vf * 0.33).toLocaleString('da-DK');
    }

    // EVENT LISTENERS
    [machineSelect, workMaterialSelect, inputAe, inputAp, inputStickout, inputCel, toggleHsm, toggleFinish, toggleSafe, camStrategySelect].forEach(el => {
        if(el) el.addEventListener('change', calculate);
        if(el && el.type === 'number') el.addEventListener('input', calculate);
    });

    if(toolSelect) {
        toolSelect.addEventListener('change', (e) => {
            const opt = e.target.options[e.target.selectedIndex];
            if(!opt.value) return;
            document.getElementById('hidden-d').value = opt.dataset.d;
            document.getElementById('hidden-z').value = opt.dataset.z;
            document.getElementById('hidden-mat').value = opt.dataset.mat;
            calculate();
        });
    }

    function loadSavedData() {
        const tools = MachiningOS.getTools();
        if(toolSelect) {
            toolSelect.innerHTML = '<option value="">-- SELECT_INSTRUMENT --</option>' + 
                tools.sort((a,b) => parseInt(a.t) - parseInt(b.t)).map(t => {
                    return `<option value="${t.t}" data-d="${t.d}" data-z="${t.z}" data-mat="${t.mat}">T${t.t} // ${t.type.toUpperCase()} (Ø${t.d})</option>`;
                }).join('');
        }
        renderSetupLog();
    }

    function renderSetupLog() {
        const logs = MachiningOS.getLogs('cnc');
        if(tableBody) {
            tableBody.innerHTML = logs.map(entry => `
                <tr class="border-b border-zinc-900/50 bg-black/20 hover:bg-primary/[0.03] transition-all tabular-nums">
                    <td class="p-6"><span class="text-xl font-black italic text-white">${entry.tNum}</span></td>
                    <td class="p-6"><span class="text-xs font-black text-zinc-300 uppercase italic">${entry.desc}</span></td>
                    <td class="p-6"><span class="text-[10px] font-bold text-zinc-500 uppercase">${entry.strategy}</span></td>
                    <td class="p-6"><span class="text-lg font-black italic text-primary">${entry.rpm}</span></td>
                    <td class="p-6"><span class="text-lg font-black italic text-white">${entry.vf}</span></td>
                    <td class="p-6 text-right"><button onclick="deleteRow('${entry.id}')" class="label-micro !text-zinc-800 hover:!text-red-600 transition-all">Remove</button></td>
                </tr>`).join('');
        }
    }

    window.deleteRow = (id) => { MachiningOS.deleteLogEntry('cnc', parseInt(id)); renderSetupLog(); };

    const btnSave = document.getElementById('btn-save');
    if(btnSave) {
        btnSave.addEventListener('click', () => {
            if(!toolSelect.value) return;
            const entry = {
                tNum: `T${toolSelect.value}`,
                desc: `Str. ${document.getElementById('hidden-d').value} ${document.getElementById('hidden-mat').value}`,
                strategy: camStrategySelect.value,
                rpm: document.getElementById('out-rpm').textContent,
                vf: document.getElementById('out-vf').textContent
            };
            MachiningOS.saveLogEntry('cnc', entry);
            renderSetupLog();
        });
    }

    initHub();
});