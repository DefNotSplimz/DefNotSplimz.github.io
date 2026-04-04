/**
 * Machining_OS | CNC Hub Logic
 * Version: 5.1 (Memory & Persistent Log)
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
    const toolTableBody = document.getElementById('tool-table-body');

    const STRATEGIES = {
        '2D Adaptive Clearing': { mult_ae: 1.0, mult_ap: 1.0, vc_mult: 1.5 },
        '2D Pocket': { mult_ae: 0.8, mult_ap: 0.5, vc_mult: 1.0 },
        '2D Contour (Slet)': { mult_ae: 0.1, mult_ap: 1.5, vc_mult: 1.2 },
        'Slotting (Fuld spor)': { mult_ae: 2.5, mult_ap: 0.5, vc_mult: 0.8 }
    };

    function initHub() {
        // Udfyld UI fra shared_core
        machineSelect.innerHTML = Object.entries(MACHINING_DB.MACHINES)
            .filter(([_, m]) => m.type === 'cnc')
            .map(([k, m]) => `<option value="${k}">${m.name}</option>`).join('');

        workMaterialSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
            .map(([k, m]) => `<option value="${k}">${m.name}</option>`).join('');

        camStrategySelect.innerHTML = Object.keys(STRATEGIES).map(k => `<option value="${k}">${k}</option>`).join('');

        loadSavedData();
    }

    function loadSavedData() {
        renderToolCrib();
        renderSetupLog();
    }

    // --- VÆRKTØJSKRYBBE LOGIK ---
    function renderToolCrib() {
        const tools = MachiningOS.getTools();
        toolSelect.innerHTML = '<option value="">-- Vælg Værktøj --</option>' + 
            tools.map(t => `<option value="${t.t}" data-d="${t.d}" data-z="${t.z}" data-mat="${t.mat}">T${t.t} - ${t.type} (Ø${t.d})</option>`).join('');
        
        toolTableBody.innerHTML = tools.map(t => `
            <tr class="border-b border-zinc-900 text-xs hover:bg-white/5 transition-colors">
                <td class="p-3 text-white font-black">T${t.t}</td>
                <td class="p-3">${t.type}</td>
                <td class="p-3 text-primary">${t.mat}</td>
                <td class="p-3">Ø${t.d}</td>
                <td class="p-3 text-right"><button onclick="deleteToolFromHub('${t.t}')" class="text-zinc-600 hover:text-red-500 font-black">SLET</button></td>
            </tr>`).join('');
    }

    window.deleteToolFromHub = (tNum) => {
        MachiningOS.deleteTool(tNum);
        renderToolCrib();
    };

    document.getElementById('btn-save-tool').addEventListener('click', (e) => {
        e.preventDefault();
        const tool = {
            t: document.getElementById('tool-t').value,
            type: document.getElementById('tool-type').value,
            mat: document.getElementById('tool-mat').value,
            d: document.getElementById('tool-d').value,
            z: document.getElementById('tool-z').value
        };
        MachiningOS.saveTool(tool);
        renderToolCrib();
    });

    // --- SETUP LOG LOGIK ---
    function renderSetupLog() {
        const logs = MachiningOS.getLogs('cnc');
        tableBody.innerHTML = logs.map(entry => `
            <tr class="border-b border-zinc-800 bg-black/40 hover:bg-primary/5 transition-colors" data-id="${entry.id}">
                <td class="p-4 text-white font-bold">${entry.tNum}</td>
                <td class="p-4 text-zinc-400">${entry.desc}</td>
                <td class="p-4">${entry.strategy}</td>
                <td class="p-4 text-primary font-bold">${entry.rpm}</td>
                <td class="p-4 text-white font-bold">${entry.vf}</td>
                <td class="p-4 text-right print:hidden"><button onclick="deleteRow('${entry.id}')" class="text-zinc-600 hover:text-red-500 font-black">SLET</button></td>
            </tr>`).join('');
    }

    window.deleteRow = (id) => {
        MachiningOS.deleteLogEntry('cnc', parseInt(id));
        renderSetupLog();
    };

    document.getElementById('btn-save').addEventListener('click', () => {
        const entry = {
            tNum: `T${toolSelect.value}`,
            desc: `Ø${document.getElementById('hidden-d').value} ${document.getElementById('hidden-mat').value}`,
            strategy: camStrategySelect.value,
            rpm: document.getElementById('out-rpm').textContent,
            vf: document.getElementById('out-vf').textContent
        };
        MachiningOS.saveLogEntry('cnc', entry);
        renderSetupLog();
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
        if(confirm("Vil du slette hele loggen?")) {
            MachiningOS.clearLogs('cnc');
            renderSetupLog();
        }
    });

    // --- BEREGNING (Kort version for overblik) ---
    function calculate() {
        const machine = MACHINING_DB.MACHINES[machineSelect.value];
        const mat = MACHINING_DB.MATERIALS[workMaterialSelect.value];
        const strategy = STRATEGIES[camStrategySelect.value];
        const d = parseFloat(document.getElementById('hidden-d').value) || 0;
        
        if (d === 0 || !mat) return;

        const vc = (document.getElementById('hidden-mat').value === 'HM' ? mat.vc_hm : mat.vc_hss) * strategy.vc_mult;
        const n = Math.min((vc * 1000) / (Math.PI * d), machine.maxRpm);
        const fz = mat.fz_ref;
        const vf = n * (parseFloat(document.getElementById('hidden-z').value) || 1) * fz;

        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-vc-range').textContent = Math.round(vc);
        document.getElementById('out-fz-range').textContent = fz.toFixed(4);
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

    initHub();
});