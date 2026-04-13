/**
 * Machining_OS | CNC Hub Logic
 * Version: 6.4 (Full Kinematic & Feedrate Restoration)
 */

document.addEventListener('DOMContentLoaded', () => {
    const machineSelect = document.getElementById('machine-select');
    const workMaterialSelect = document.getElementById('work-material');
    const toolSelect = document.getElementById('active-tool-select');
    const camStrategySelect = document.getElementById('cam-strategy');
    
    const wrapperAe = document.getElementById('wrapper-ae');
    const wrapperAp = document.getElementById('wrapper-ap');
    const labelAe = document.getElementById('label-ae');
    const labelAp = document.getElementById('label-ap');
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

    const KC_VALUES = {
        'alu': 700,
        'plastic': 200,
        'brass': 600,
        'steel': 1600,
        'stainless': 2200,
        'toolsteel': 2400,
        'titanium': 2000
    };

    const STRATEGIES = {
        '2D Adaptive Clearing': { cat: '2D', vc_mult: 1.5, fz_mult: 1.2, ae_label: 'Optimal_Load (Ae)', ap_label: 'Max_Stepdown (Ap)', show_ae: true, show_ap: true },
        '2D Pocket': { cat: '2D', vc_mult: 1.0, fz_mult: 1.0, ae_label: 'Stepover (Ae)', ap_label: 'Max_Stepdown (Ap)', show_ae: true, show_ap: true },
        '2D Contour': { cat: '2D', vc_mult: 1.0, fz_mult: 1.0, ae_label: 'Ikke_Relevant', ap_label: 'Multiple_Depths (Ap)', show_ae: false, show_ap: true },
        'Face (Planfræsning)': { cat: '2D', vc_mult: 1.2, fz_mult: 1.0, ae_label: 'Stepover (Ae)', ap_label: 'Pass_Depth (Ap)', show_ae: true, show_ap: true },
        'Slotting (Fuld_Spor)': { cat: '2D', vc_mult: 0.8, fz_mult: 0.8, ae_label: 'Ikke_Relevant', ap_label: 'Max_Stepdown (Ap)', show_ae: false, show_ap: true },
        'Bore (Cirkulær_Fræs)': { cat: '2D', vc_mult: 1.0, fz_mult: 0.5, ae_label: 'Pitch', ap_label: 'Ikke_Relevant', show_ae: true, show_ap: false },

        '3D Adaptive Clearing': { cat: '3D', vc_mult: 1.5, fz_mult: 1.2, ae_label: 'Optimal_Load (Ae)', ap_label: 'Max_Stepdown (Ap)', show_ae: true, show_ap: true },
        '3D Pocket Clearing': { cat: '3D', vc_mult: 1.0, fz_mult: 1.0, ae_label: 'Stepover (Ae)', ap_label: 'Max_Stepdown (Ap)', show_ae: true, show_ap: true },
        'Parallel (3D)': { cat: '3D', vc_mult: 1.0, fz_mult: 1.0, ae_label: 'Stepover (Ae)', ap_label: 'Ikke_Relevant', show_ae: true, show_ap: false },
        'Scallop (3D)': { cat: '3D', vc_mult: 1.0, fz_mult: 1.0, ae_label: 'Stepover (Ae)', ap_label: 'Ikke_Relevant', show_ae: true, show_ap: false },
        'Contour (3D)': { cat: '3D', vc_mult: 1.0, fz_mult: 1.0, ae_label: 'Ikke_Relevant', ap_label: 'Max_Stepdown (Ap)', show_ae: false, show_ap: true },

        'Spot Drill (Centrerboring)': { cat: 'HOLE', vc_mult: 0.8, fz_mult: 0.5, ae_label: 'Ikke_Relevant', ap_label: 'Dybde/Fas (Z)', show_ae: false, show_ap: true },
        'Drilling (Standard)': { cat: 'HOLE', vc_mult: 0.8, fz_mult: 1.0, ae_label: 'Ikke_Relevant', ap_label: 'Peck_Depth (Q)', show_ae: false, show_ap: true },
        'Tapping (Gevind)': { cat: 'HOLE', vc_mult: 0.3, fz_mult: 1.0, ae_label: 'Ikke_Relevant', ap_label: 'Ikke_Relevant', show_ae: false, show_ap: false }
    };

    function initHub() {
        if (machineSelect) {
            machineSelect.innerHTML = Object.entries(MACHINING_DB.MACHINES)
                .filter(([_, m]) => m.type === 'cnc')
                .map(([k, m]) => `<option value="${k}">${m.name.toUpperCase()}</option>`).join('');
        }
        if (workMaterialSelect) {
            workMaterialSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
                .map(([k, m]) => `<option value="${k}">${m.name}</option>`).join('');
        }
        if (camStrategySelect) {
            camStrategySelect.innerHTML = Object.keys(STRATEGIES).map(k => {
                return `<option value="${k}">[${STRATEGIES[k].cat}] ${k.toUpperCase()}</option>`;
            }).join('');
        }
        
        updateStrategyUI();
        loadSavedData();
    }

    function updateStrategyUI() {
        const strategy = STRATEGIES[camStrategySelect.value];
        if (!strategy) return;
        labelAe.textContent = strategy.ae_label;
        labelAp.textContent = strategy.ap_label;
        wrapperAe.style.display = strategy.show_ae ? 'flex' : 'none';
        wrapperAp.style.display = strategy.show_ap ? 'flex' : 'none';
        calculate();
    }

    function loadSavedData() {
        const tools = MachiningOS.getTools();
        if(toolSelect) {
            toolSelect.innerHTML = '<option value="">-- SELECT_INSTRUMENT --</option>' + 
                tools.sort((a,b) => parseInt(a.t) - parseInt(b.t)).map(t => {
                    const specLabel = t.cat === 'turn' ? `Re${t.re}` : `Ø${t.d}`;
                    return `<option value="${t.t}" data-d="${t.d}" data-z="${t.z}" data-mat="${t.mat}">T${t.t} // ${t.type.toUpperCase()} (${specLabel})</option>`;
                }).join('');
        }
        renderSetupLog();
    }

    function calculate() {
        protocolError.classList.add('hidden');
        const machineKey = machineSelect.value;
        const matKey = workMaterialSelect.value;
        const machine = MACHINING_DB.MACHINES[machineKey];
        const mat = MACHINING_DB.MATERIALS[matKey];
        const strategy = STRATEGIES[camStrategySelect.value];
        
        const d = parseFloat(document.getElementById('hidden-d').value) || 0;
        const z = parseFloat(document.getElementById('hidden-z').value) || 1;
        const ae = parseFloat(inputAe.value) || 0;
        const ap = parseFloat(inputAp.value) || 0;
        const stickout = parseFloat(inputStickout.value) || 0;
        const cel = parseFloat(inputCel.value) || 0;
        
        if (d === 0 || !mat || !strategy) return;

        if (strategy.show_ap && ap > cel) {
            protocolError.classList.remove('hidden');
            protocolErrorText.innerHTML = `AP (${ap}mm) overstiger Skærlængde/CEL (${cel}mm).<br>Stammen vil friktionssvejse i godset og knække værktøjet.`;
            document.getElementById('out-rpm').textContent = "ERR";
            document.getElementById('out-vf').textContent = "ERR";
            document.getElementById('out-mrr').textContent = "0.0";
            return;
        }

        const isHM = document.getElementById('hidden-mat').value === 'HM';
        const baseVc = isHM ? mat.vc_hm : mat.vc_hss;
        
        let vc = baseVc * (toggleHsm.checked ? strategy.vc_mult : 1.0);
        let target_hm = mat.fz_ref * strategy.fz_mult; 
        
        let thinning_mult = 1.0;
        let true_fz = target_hm;
        if (strategy.show_ae && ae > 0 && ae < (d * 0.5)) {
            thinning_mult = Math.sqrt(d / (4 * ae));
            if (thinning_mult > 4.0) thinning_mult = 4.0;
            true_fz = target_hm * thinning_mult;
        }

        let deflection_mult = 1.0;
        const ld_ratio = stickout / d;
        if (ld_ratio > 3.0 && strategy.cat !== 'HOLE') {
            deflection_mult = 3.0 / ld_ratio; 
            vc *= deflection_mult;
            true_fz *= deflection_mult;
        }

        if (toggleFinish.checked) { vc *= 1.25; true_fz *= 0.50; }
        if (toggleSafe.checked) { vc *= 0.70; true_fz *= 0.70; }
        
        const n = Math.min((vc * 1000) / (Math.PI * d), machine.maxRpm);
        let vf = (camStrategySelect.value === 'Tapping (Gevind)') ? (n * true_fz) : (n * z * true_fz);

        let mrr = 0;
        let power_kw = 0;
        let power_pct = 0;
        
        const machine_kw = machine.kw || 5.6; 
        const kc = KC_VALUES[matKey] || 1500;

        if (strategy.show_ae && strategy.show_ap && ae > 0 && ap > 0) {
            mrr = (ae * ap * vf) / 1000;
            power_kw = (mrr * kc) / 60000;
            power_pct = (power_kw / machine_kw) * 100;
        }

        if (power_pct > 100) {
            protocolError.classList.remove('hidden');
            protocolErrorText.innerHTML = `SPINDEL STALL: Operation kræver ${power_kw.toFixed(1)} kW.<br>Maskinen har kun ${machine_kw.toFixed(1)} kW til rådighed. Drosl Ae eller Ap.`;
            document.getElementById('out-rpm').textContent = "ERR";
            document.getElementById('out-vf').textContent = "ERR";
            return;
        }

        const rampRpm = n;
        const leadInFeed = vf * 0.80;  
        const leadOutFeed = vf * 0.80; 
        const transFeed = vf * 1.50;   
        const rampFeed = vf * 0.60;    
        const plungeFeed = vf * 0.33; 
        const plungePerRev = n > 0 ? plungeFeed / n : 0;

        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vc-range').textContent = Math.round(vc);
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-fz-range').textContent = true_fz.toFixed(4);
        
        document.getElementById('out-thinning').textContent = thinning_mult.toFixed(2) + 'x';
        document.getElementById('out-deflection').textContent = deflection_mult.toFixed(2) + 'x';
        
        document.getElementById('out-mrr').textContent = mrr.toFixed(1);
        document.getElementById('out-power').textContent = power_kw.toFixed(1) + ' kW';
        
        const loadEl = document.getElementById('out-load');
        loadEl.textContent = Math.round(power_pct);
        loadEl.className = `text-xl font-black font-mono italic tracking-tighter ${power_pct > 85 ? 'text-red-500' : 'text-white'}`;

        document.getElementById('out-ramp-rpm').textContent = Math.round(rampRpm).toLocaleString('da-DK');
        document.getElementById('out-lead-in').textContent = Math.round(leadInFeed).toLocaleString('da-DK');
        document.getElementById('out-lead-out').textContent = Math.round(leadOutFeed).toLocaleString('da-DK');
        document.getElementById('out-trans').textContent = Math.round(transFeed).toLocaleString('da-DK');
        document.getElementById('out-ramp-feed').textContent = Math.round(rampFeed).toLocaleString('da-DK');
        document.getElementById('out-plunge').textContent = Math.round(plungeFeed).toLocaleString('da-DK');
        document.getElementById('out-plunge-rev').textContent = plungePerRev.toFixed(4);
    }

    [machineSelect, workMaterialSelect, inputAe, inputAp, inputStickout, inputCel, toggleHsm, toggleFinish, toggleSafe].forEach(el => {
        if(el) {
            el.addEventListener('change', calculate);
            if(el.type === 'number') el.addEventListener('input', calculate);
        }
    });
    if(camStrategySelect) camStrategySelect.addEventListener('change', updateStrategyUI);

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

    function renderSetupLog() {
        const logs = MachiningOS.getLogs('cnc');
        if(tableBody) {
            tableBody.innerHTML = logs.map(entry => `
                <tr class="border-b border-zinc-900/50 bg-black/20 hover:bg-primary/[0.03] transition-all tabular-nums group" data-id="${entry.id}">
                    <td class="p-6"><span class="text-xl font-black italic tracking-tighter text-white">${entry.tNum}</span></td>
                    <td class="p-6"><div class="flex flex-col"><span class="text-xs font-black text-zinc-300 uppercase italic tracking-tight">${entry.desc}</span><span class="label-micro !text-[7px] !text-zinc-600 !before:hidden mt-1 uppercase print:hidden">Validated_Tooling_Protocol</span></div></td>
                    <td class="p-6"><span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">${entry.strategy}</span></td>
                    <td class="p-6"><div class="flex flex-col"><span class="text-lg font-black italic text-primary tracking-tighter">${entry.rpm}</span><span class="text-[8px] font-mono text-primary/40 font-bold tracking-widest uppercase">REV_MIN</span></div></td>
                    <td class="p-6"><div class="flex flex-col"><span class="text-lg font-black italic text-white tracking-tighter">${entry.vf}</span><span class="text-[8px] font-mono text-zinc-600 font-bold tracking-widest uppercase">MM_MIN</span></div></td>
                    <td class="p-6 text-right print:hidden"><button onclick="deleteRow('${entry.id}')" class="label-micro !text-zinc-800 hover:!text-red-600 transition-all font-black !before:hidden italic uppercase tracking-widest">Remove_Entry</button></td>
                </tr>`).join('');
        }
    }
    window.deleteRow = (id) => { MachiningOS.deleteLogEntry('cnc', parseInt(id)); renderSetupLog(); };

    const btnSave = document.getElementById('btn-save');
    if(btnSave) {
        btnSave.addEventListener('click', () => {
            if(!toolSelect.value) return;
            
            const isFinish = toggleFinish.checked ? " [FINISH]" : "";
            const isSafe = toggleSafe.checked ? " [SAFE]" : "";
            
            const entry = {
                tNum: `T${toolSelect.value}`,
                desc: `Str. ${document.getElementById('hidden-d').value} ${document.getElementById('hidden-mat').value}`,
                strategy: camStrategySelect.value + isFinish + isSafe,
                rpm: document.getElementById('out-rpm').textContent,
                vf: document.getElementById('out-vf').textContent
            };
            MachiningOS.saveLogEntry('cnc', entry);
            renderSetupLog();
            
            const originalText = btnSave.innerHTML;
            btnSave.innerHTML = '<span class="text-emerald-500 animate-pulse uppercase tracking-widest italic font-black relative z-10">ENTRY_LOCKED_OK</span>';
            setTimeout(() => btnSave.innerHTML = originalText, 1500);
        });
    }

    const btnClear = document.getElementById('btn-clear');
    if(btnClear) {
        btnClear.addEventListener('click', () => {
            if(confirm("CRITICAL: Vil du destruere hele log-historikken?")) {
                MachiningOS.clearLogs('cnc');
                renderSetupLog();
            }
        });
    }

    const btnPrint = document.getElementById('btn-print');
    if(btnPrint) {
        btnPrint.addEventListener('click', () => {
            window.print();
        });
    }

    const btnExport = document.getElementById('btn-export-json');
    if(btnExport) {
        btnExport.addEventListener('click', () => {
            const data = MachiningOS.getLogs('cnc');
            const blob = new Blob([JSON.stringify(data, null, 4)], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MachiningOS_SetupSheet_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
        });
    }

    initHub();
});