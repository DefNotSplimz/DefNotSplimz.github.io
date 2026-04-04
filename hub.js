/**
 * Machining_OS | CNC Hub Logic
 * Version: 5.6 (Multi-Operation Compatibility)
 */

document.addEventListener('DOMContentLoaded', () => {
    const machineSelect = document.getElementById('machine-select');
    const workMaterialSelect = document.getElementById('work-material');
    const toolSelect = document.getElementById('active-tool-select');
    const camStrategySelect = document.getElementById('cam-strategy');
    const inputAe = document.getElementById('input-ae');
    const inputAp = document.getElementById('input-ap');
    const tableBody = document.getElementById('setup-table-body');

    const STRATEGIES = {
        '2D Adaptive Clearing': { mult_ae: 1.0, mult_ap: 1.0, vc_mult: 1.5 },
        '2D Pocket': { mult_ae: 0.8, mult_ap: 0.5, vc_mult: 1.0 },
        '2D Contour (Slet)': { mult_ae: 0.1, mult_ap: 1.5, vc_mult: 1.2 },
        'Slotting (Fuld spor)': { mult_ae: 2.5, mult_ap: 0.5, vc_mult: 0.8 }
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
            camStrategySelect.innerHTML = Object.keys(STRATEGIES).map(k => `<option value="${k}">${k.toUpperCase()}</option>`).join('');
        }
        loadSavedData();
    }

    function loadSavedData() {
        renderToolCrib();
        renderSetupLog();
    }

    // --- VÆRKTØJSKRYBBE LOGIK ---
    function renderToolCrib() {
        const tools = MachiningOS.getTools();
        
        if(toolSelect) {
            toolSelect.innerHTML = '<option value="">-- SELECT_INSTRUMENT --</option>' + 
                tools.sort((a,b) => parseInt(a.t) - parseInt(b.t)).map(t => {
                    const specLabel = t.cat === 'turn' ? `Re${t.re}` : `Ø${t.d}`;
                    // Hvis det er et drejeværktøj sættes z=1 matematisk for at bevare formlens logik i beregneren
                    const zData = t.cat === 'turn' ? 1 : t.z;
                    return `<option value="${t.t}" data-d="${t.d}" data-z="${zData}" data-mat="${t.mat}" data-cat="${t.cat}">T${t.t} // ${t.type.toUpperCase()} (${specLabel})</option>`;
                }).join('');
        }
    }

    // --- BEREGNING ---
    function calculate() {
        const machine = MACHINING_DB.MACHINES[machineSelect.value];
        const mat = MACHINING_DB.MATERIALS[workMaterialSelect.value];
        const strategy = STRATEGIES[camStrategySelect.value];
        const d = parseFloat(document.getElementById('hidden-d').value) || 0;
        
        if (d === 0 || !mat) return;

        const isHM = document.getElementById('hidden-mat').value === 'HM';
        const baseVc = isHM ? mat.vc_hm : mat.vc_hss;
        const vc = baseVc * strategy.vc_mult;
        
        const n = Math.min((vc * 1000) / (Math.PI * d), machine.maxRpm);
        const fz = mat.fz_ref;
        const z = parseFloat(document.getElementById('hidden-z').value) || 1;
        const vf = n * z * fz;

        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-vc-range').textContent = Math.round(vc);
        document.getElementById('out-fz-range').textContent = fz.toFixed(4);

        MachiningOS.saveState({
            activeMachine: machineSelect.value,
            activeMat: workMaterialSelect.value,
            activeStrategy: camStrategySelect.value,
            ae: inputAe.value,
            ap: inputAp.value
        });
    }

    [machineSelect, workMaterialSelect, camStrategySelect, inputAe, inputAp].forEach(el => {
        if(el) el.addEventListener('input', calculate);
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

    // --- SETUP LOG LOGIK ---
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
                            <span class="label-micro !text-[7px] !text-zinc-600 !before:hidden mt-1 uppercase">Validated_Tooling_Protocol</span>
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

            const entry = {
                tNum: `T${toolSelect.value}`,
                desc: `Str. ${document.getElementById('hidden-d').value} ${document.getElementById('hidden-mat').value}`,
                strategy: camStrategySelect.value,
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