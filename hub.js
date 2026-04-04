/**
 * Machining_OS | CNC Hub Logic
 * Version: 5.5 (5000% Precision Glass Update)
 * "Designet til absolut visuel kontrol og taktisk overblik"
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const machineSelect = document.getElementById('machine-select');
    const workMaterialSelect = document.getElementById('work-material');
    const toolSelect = document.getElementById('active-tool-select');
    const camStrategySelect = document.getElementById('cam-strategy');
    const inputAe = document.getElementById('input-ae');
    const inputAp = document.getElementById('input-ap');
    const tableBody = document.getElementById('setup-table-body');

    // Strategier bevaret 1:1
    const STRATEGIES = {
        '2D Adaptive Clearing': { mult_ae: 1.0, mult_ap: 1.0, vc_mult: 1.5 },
        '2D Pocket': { mult_ae: 0.8, mult_ap: 0.5, vc_mult: 1.0 },
        '2D Contour (Slet)': { mult_ae: 0.1, mult_ap: 1.5, vc_mult: 1.2 },
        'Slotting (Fuld spor)': { mult_ae: 2.5, mult_ap: 0.5, vc_mult: 0.8 }
    };

    function initHub() {
        // Udfyld UI fra shared_core DB
        machineSelect.innerHTML = Object.entries(MACHINING_DB.MACHINES)
            .filter(([_, m]) => m.type === 'cnc')
            .map(([k, m]) => `<option value="${k}">${m.name.toUpperCase()}</option>`).join('');

        workMaterialSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
            .map(([k, m]) => `<option value="${k}">${m.name}</option>`).join('');

        camStrategySelect.innerHTML = Object.keys(STRATEGIES).map(k => `<option value="${k}">${k.toUpperCase()}</option>`).join('');

        loadSavedData();
    }

    function loadSavedData() {
        renderToolCrib();
        renderSetupLog();
    }

    // --- VÆRKTØJSKRYBBE LOGIK (Design Opdateret) ---
    function renderToolCrib() {
        const tools = MachiningOS.getTools();
        // Dropdown opdatering
        toolSelect.innerHTML = '<option value="">-- SELECT_INSTRUMENT --</option>' + 
            tools.map(t => `<option value="${t.t}" data-d="${t.d}" data-z="${t.z}" data-mat="${t.mat}">T${t.t} // ${t.type.toUpperCase()} (Ø${t.d})</option>`).join('');
        
        // Tool-tabellen i Hubben (hvis den findes i DOM)
        const toolTable = document.getElementById('tool-table-body');
        if(toolTable) {
            toolTable.innerHTML = tools.map(t => `
                <tr class="border-b border-zinc-900 text-[11px] hover:bg-white/5 transition-all group">
                    <td class="p-4 text-white font-black italic tracking-tighter">T${t.t}</td>
                    <td class="p-4 text-zinc-400 font-bold uppercase">${t.type}</td>
                    <td class="p-4 text-primary font-black italic">${t.mat}</td>
                    <td class="p-4 font-mono text-zinc-500 font-bold">Ø ${parseFloat(t.d).toFixed(2)}</td>
                    <td class="p-4 text-right">
                        <button onclick="deleteToolFromHub('${t.t}')" class="label-micro !text-zinc-700 hover:!text-red-500 transition-colors !before:hidden uppercase font-black italic">WIPE</button>
                    </td>
                </tr>`).join('');
        }
    }

    window.deleteToolFromHub = (tNum) => {
        if(confirm(`Slet T${tNum} fra systemet?`)) {
            MachiningOS.deleteTool(tNum);
            renderToolCrib();
        }
    };

    // --- SETUP LOG LOGIK (Design Opdateret til 5000%) ---
    function renderSetupLog() {
        const logs = MachiningOS.getLogs('cnc');
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

    window.deleteRow = (id) => {
        MachiningOS.deleteLogEntry('cnc', parseInt(id));
        renderSetupLog();
    };

    document.getElementById('btn-save').addEventListener('click', () => {
        if(!toolSelect.value) {
            alert("PROTOCOL_ERROR: Ingen værktøj valgt.");
            return;
        }

        const entry = {
            tNum: `T${toolSelect.value}`,
            desc: `Ø${document.getElementById('hidden-d').value} ${document.getElementById('hidden-mat').value}`,
            strategy: camStrategySelect.value,
            rpm: document.getElementById('out-rpm').textContent,
            vf: document.getElementById('out-vf').textContent
        };
        MachiningOS.saveLogEntry('cnc', entry);
        renderSetupLog();
        
        // Visuel feedback på knappen
        const btn = document.getElementById('btn-save');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="text-emerald-500 animate-pulse">ENTRY_LOCKED_OK</span>';
        setTimeout(() => btn.innerHTML = originalText, 1500);
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
        if(confirm("CRITICAL: Vil du destruere hele log-historikken?")) {
            MachiningOS.clearLogs('cnc');
            renderSetupLog();
        }
    });

    // --- BEREGNING (Præcis data-rendering) ---
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

        // Rendering med tusindtalsseparator for industrielt look
        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-vc-range').textContent = Math.round(vc);
        document.getElementById('out-fz-range').textContent = fz.toFixed(4);

        // Gem session-tilstand
        MachiningOS.saveState({
            activeMachine: machineSelect.value,
            activeMat: workMaterialSelect.value,
            activeStrategy: camStrategySelect.value,
            ae: inputAe.value,
            ap: inputAp.value
        });
    }

    // Events for auto-beregning
    [machineSelect, workMaterialSelect, camStrategySelect, inputAe, inputAp].forEach(el => el.addEventListener('input', calculate));
    
    toolSelect.addEventListener('change', (e) => {
        const opt = e.target.options[e.target.selectedIndex];
        if(!opt.value) return;
        document.getElementById('hidden-d').value = opt.dataset.d;
        document.getElementById('hidden-z').value = opt.dataset.z;
        document.getElementById('hidden-mat').value = opt.dataset.mat;
        calculate();
    });

    // JSON Eksport (Beholdt som anmodet)
    document.getElementById('btn-export-json').addEventListener('click', () => {
        const data = MachiningOS.getLogs('cnc');
        const blob = new Blob([JSON.stringify(data, null, 4)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MachiningOS_SetupSheet_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    });

    initHub();
});