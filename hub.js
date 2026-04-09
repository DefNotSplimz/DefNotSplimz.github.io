/**
 * Machining_OS | CNC Hub Logic
 * Version: 6.1 (Spot Drilling + Tapping Bypass)
 */

document.addEventListener('DOMContentLoaded', () => {
    const machineSelect = document.getElementById('machine-select');
    const workMaterialSelect = document.getElementById('work-material');
    const toolSelect = document.getElementById('active-tool-select');
    const camStrategySelect = document.getElementById('cam-strategy');
    
    // Dynamiske felter
    const wrapperAe = document.getElementById('wrapper-ae');
    const wrapperAp = document.getElementById('wrapper-ap');
    const labelAe = document.getElementById('label-ae');
    const labelAp = document.getElementById('label-ap');
    const inputAe = document.getElementById('input-ae');
    const inputAp = document.getElementById('input-ap');
    
    // Toggles
    const toggleHsm = document.getElementById('toggle-hsm');
    const toggleFinish = document.getElementById('toggle-finish');
    const toggleSafe = document.getElementById('toggle-safe');
    const tableBody = document.getElementById('setup-table-body');

    // Komplet F360 Strategi Matrix
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
                const s = STRATEGIES[k];
                return `<option value="${k}">[${s.cat}] ${k.toUpperCase()}</option>`;
            }).join('');
        }
        
        const state = MachiningOS.getState();
        if (state.hsmActive !== undefined) toggleHsm.checked = state.hsmActive;
        if (state.finishActive !== undefined) toggleFinish.checked = state.finishActive;
        if (state.safeActive !== undefined) toggleSafe.checked = state.safeActive;

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
        renderToolCrib();
        renderSetupLog();
    }

    function renderToolCrib() {
        const tools = MachiningOS.getTools();
        if(toolSelect) {
            toolSelect.innerHTML = '<option value="">-- SELECT_INSTRUMENT --</option>' + 
                tools.sort((a,b) => parseInt(a.t) - parseInt(b.t)).map(t => {
                    const specLabel = t.cat === 'turn' ? `Re${t.re}` : `Ø${t.d}`;
                    const zData = t.cat === 'turn' ? 1 : t.z;
                    return `<option value="${t.t}" data-d="${t.d}" data-z="${zData}" data-mat="${t.mat}" data-cat="${t.cat}">T${t.t} // ${t.type.toUpperCase()} (${specLabel})</option>`;
                }).join('');
        }
    }

    function calculate() {
        const machine = MACHINING_DB.MACHINES[machineSelect.value];
        const mat = MACHINING_DB.MATERIALS[workMaterialSelect.value];
        const strategy = STRATEGIES[camStrategySelect.value];
        const d = parseFloat(document.getElementById('hidden-d').value) || 0;
        
        if (d === 0 || !mat || !strategy) return;

        const isHM = document.getElementById('hidden-mat').value === 'HM';
        const baseVc = isHM ? mat.vc_hm : mat.vc_hss;
        
        const isHSM = toggleHsm.checked;
        const isFinish = toggleFinish.checked;
        const isSafe = toggleSafe.checked;

        const activeVcMult = isHSM ? strategy.vc_mult : 1.0;
        let vc = baseVc * activeVcMult;
        let fz = mat.fz_ref * strategy.fz_mult;

        if (isFinish) {
            vc *= 1.25;
            fz *= 0.50;
        }

        if (isSafe) {
            vc *= 0.70;
            fz *= 0.70;
        }
        
        const n = Math.min((vc * 1000) / (Math.PI * d), machine.maxRpm);
        const z = parseFloat(document.getElementById('hidden-z').value) || 1;
        
        let vf = 0;
        
        // STRATEGI-BYPASS: Håndtering af Gevindskæring vs. Fræsning
        if (camStrategySelect.value === 'Tapping (Gevind)') {
            // For tapping udgør 'fz' gevindets pitch. Antal skær (Z) ignoreres brutalt.
            vf = n * fz; 
        } else {
            // Standard fræsning og standard boring (inkl. Spot Drill)
            vf = n * z * fz;
        }

        // F360 Derivater (Optimeret for maskinel overlevelse)
        const rampRpm = n;
        const leadInFeed = vf * 0.80;  // 80% for at reducere chok ved indtræden
        const leadOutFeed = vf * 0.80; // 80% for rent exit
        const transFeed = vf * 1.50;   // 150% til repositionering i planet
        const rampFeed = vf * 0.60;    // 60% for at beskytte bundskær under rampe
        const plungeFeed = vf * 0.33; 
        const plungePerRev = plungeFeed / n || 0;

        // Core Updates
        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vc-range').textContent = Math.round(vc);
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-fz-range').textContent = fz.toFixed(4);

        // F360 Matrix Updates
        document.getElementById('out-ramp-rpm').textContent = Math.round(rampRpm).toLocaleString('da-DK');
        document.getElementById('out-lead-in').textContent = Math.round(leadInFeed).toLocaleString('da-DK');
        document.getElementById('out-lead-out').textContent = Math.round(leadOutFeed).toLocaleString('da-DK');
        document.getElementById('out-trans').textContent = Math.round(transFeed).toLocaleString('da-DK');
        document.getElementById('out-ramp-feed').textContent = Math.round(rampFeed).toLocaleString('da-DK');
        document.getElementById('out-plunge').textContent = Math.round(plungeFeed).toLocaleString('da-DK');
        document.getElementById('out-plunge-rev').textContent = plungePerRev.toFixed(4);

        MachiningOS.saveState({
            activeMachine: machineSelect.value,
            activeMat: workMaterialSelect.value,
            activeStrategy: camStrategySelect.value,
            ae: inputAe.value,
            ap: inputAp.value,
            hsmActive: isHSM,
            finishActive: isFinish,
            safeActive: isSafe
        });
    }

    [machineSelect, workMaterialSelect, inputAe, inputAp, toggleHsm, toggleFinish, toggleSafe].forEach(el => {
        if(el) el.addEventListener('change', calculate);
        if(el && el.type === 'number') el.addEventListener('input', calculate);
    });
    
    if(camStrategySelect) {
        camStrategySelect.addEventListener('change', updateStrategyUI);
    }

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
                    <td class="p-6">
                        <span class="text-xl font-black italic tracking-tighter text-white">T${entry.tNum.replace('T','')}</span>
                    </td>
                    <td class="p-6">
                        <div class="flex flex-col">
                            <span class="text-xs font-black text-zinc-300 uppercase italic tracking-tight">${entry.desc}</span>
                            <span class="label-micro !text-[7px] !text-zinc-600 !before:hidden mt-1 uppercase print:hidden">Validated_Tooling_Protocol</span>
                        </div>
                    </td>
                    <td class="p-6">
                        <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">${entry.strategy}</span>
                    </td>
                    <td class="p-6">
                        <div class="flex flex-col">
                            <span class="text-lg font-black italic text-primary tracking-tighter">${entry.rpm}</span>
                            <span class="text-[8px] font-mono text-primary/40 font-bold tracking-widest uppercase">REV_MIN</span>
                        </div>
                    </td>
                    <td class="p-6">
                        <div class="flex flex-col">
                            <span class="text-lg font-black italic text-white tracking-tighter">${entry.vf}</span>
                            <span class="text-[8px] font-mono text-zinc-600 font-bold tracking-widest uppercase">MM_MIN</span>
                        </div>
                    </td>
                    <td class="p-6 text-right print:hidden">
                        <button onclick="deleteRow('${entry.id}')" class="label-micro !text-zinc-800 hover:!text-red-600 transition-all font-black !before:hidden italic uppercase tracking-widest">Remove_Entry</button>
                    </td>
                </tr>`).join('');
        }
    }

    window.deleteRow = (id) => {
        MachiningOS.deleteLogEntry('cnc', parseInt(id));
        renderSetupLog();
    };

    const btnSave = document.getElementById('btn-save');
    if(btnSave) {
        btnSave.addEventListener('click', () => {
            if(!toolSelect.value) {
                alert("PROTOCOL_ERROR: Ingen værktøj valgt.");
                return;
            }
            
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
            btnSave.innerHTML = '<span class="text-emerald-500 animate-pulse">ENTRY_LOCKED_OK</span>';
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