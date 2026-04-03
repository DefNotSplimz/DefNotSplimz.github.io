document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const toolSelect = document.getElementById('active-tool-select');
    const workMaterialSelect = document.getElementById('work-material');
    const camStrategySelect = document.getElementById('cam-strategy');
    const inputAe = document.getElementById('input-ae');
    const inputAp = document.getElementById('input-ap');
    const toggleHsm = document.getElementById('toggle-hsm');
    
    const hiddenD = document.getElementById('hidden-d');
    const hiddenZ = document.getElementById('hidden-z');
    const hiddenMat = document.getElementById('hidden-mat');
    
    const outVcRange = document.getElementById('out-vc-range');
    const outFzRange = document.getElementById('out-fz-range');
    const outRpm = document.getElementById('out-rpm');
    const outVf = document.getElementById('out-vf');
    const outMrr = document.getElementById('out-mrr');
    const warningContainer = document.getElementById('warning-container');

    const tableBody = document.getElementById('setup-table-body');
    const toolTableBody = document.getElementById('tool-table-body');

    // --- FULL STRATEGY CONFIGURATION ---
    const STRATEGIES = {
        '2D Adaptive Clearing': { type: 'adaptive', ae_d: 0.15, ap_d: 1.5, vc_mult: 1.5 },
        '2D Pocket': { type: 'std', ae_d: 0.40, ap_d: 1.0, vc_mult: 1.0 },
        '2D Contour': { type: 'slet', ae_d: 0.05, ap_d: 2.0, vc_mult: 1.2 },
        'Face': { type: 'std', ae_d: 0.70, ap_d: 0.2, vc_mult: 1.0 },
        '3D Adaptive Clearing': { type: 'adaptive', ae_d: 0.12, ap_d: 2.0, vc_mult: 1.4 },
        'Parallel / Scallop': { type: 'slet', ae_d: 0.02, ap_d: 0.1, vc_mult: 1.3 },
        'Slotting': { type: 'std', ae_d: 1.0, ap_d: 0.5, vc_mult: 0.8 }
    };

    // --- FULL MATERIAL MATRIX (Optimum Data) ---
    const CUTTING_DATA = {
        'HM': {
            'ALU': { vc: 450, fz: 0.08 },
            'MESSING': { vc: 180, fz: 0.07 },
            'STAAL': { vc: 140, fz: 0.06 },
            'RUSTFAST': { vc: 85, fz: 0.04 },
            'VAERKTOJSSTAAL': { vc: 65, fz: 0.035 },
            'POM': { vc: 350, fz: 0.12 },
            'NYLON': { vc: 220, fz: 0.10 },
            'STOEBEJERN': { vc: 110, fz: 0.07 },
            'TITANIUM': { vc: 45, fz: 0.03 }
        },
        'HSS': {
            'ALU': { vc: 90, fz: 0.05 },
            'MESSING': { vc: 45, fz: 0.04 },
            'STAAL': { vc: 28, fz: 0.03 },
            'RUSTFAST': { vc: 18, fz: 0.02 },
            'VAERKTOJSSTAAL': { vc: 12, fz: 0.015 },
            'POM': { vc: 110, fz: 0.08 },
            'NYLON': { vc: 85, fz: 0.07 },
            'STOEBEJERN': { vc: 22, fz: 0.04 },
            'TITANIUM': { vc: 10, fz: 0.015 }
        }
    };

    function populateStrategies() {
        camStrategySelect.innerHTML = '<option value="">-- Vælg Strategi --</option>';
        for (const key in STRATEGIES) {
            camStrategySelect.innerHTML += `<option value="${key}">${key}</option>`;
        }
    }

    function renderToolCrib() {
        let tools = JSON.parse(localStorage.getItem('datum_tools')) || [];
        toolTableBody.innerHTML = '';
        toolSelect.innerHTML = '<option value="">-- Vælg Værktøj --</option>';
        
        tools.forEach(t => {
            toolSelect.innerHTML += `<option value="${t.t}" data-d="${t.d}" data-z="${t.z}" data-mat="${t.mat}">T${t.t} - ${t.type} (Ø${t.d})</option>`;
            const tr = document.createElement('tr');
            tr.className = "border-b border-zinc-900 text-xs font-mono text-zinc-400 bg-black/40";
            tr.innerHTML = `<td class="p-4 font-bold text-white">T${t.t}</td><td class="p-4">${t.type}</td><td class="p-4 text-primary">${t.mat}</td><td class="p-4">Ø${t.d}</td><td class="p-4 text-right"><button onclick="deleteTool(${t.t})" class="text-zinc-600 hover:text-red-500 font-bold uppercase tracking-widest text-[10px]">SLET</button></td>`;
            toolTableBody.appendChild(tr);
        });
    }

    function calculate() {
        const mat = workMaterialSelect.value;
        const strategyKey = camStrategySelect.value;
        const d = parseFloat(hiddenD.value) || 0;
        const z = parseFloat(hiddenZ.value) || 1;
        const toolMat = hiddenMat.value || 'HM';

        if (d === 0 || !strategyKey || !CUTTING_DATA[toolMat][mat]) return;

        const baseData = CUTTING_DATA[toolMat][mat];
        const strategy = STRATEGIES[strategyKey];

        // 1. Skærehastighed (Vc)
        const vc = baseData.vc * strategy.vc_mult;
        outVcRange.textContent = Math.round(vc);

        // 2. Tandtilspænding (fz)
        const fz = baseData.fz;
        outFzRange.textContent = fz.toFixed(3);

        // 3. RPM
        let n = (vc * 1000) / (Math.PI * d);
        n = Math.min(n, 10000); // Max Haas RPM
        outRpm.textContent = Math.round(n);

        // 4. Auto-engagement (Ae / Ap)
        let ae = d * strategy.ae_d;
        let ap = d * strategy.ap_d;
        
        inputAe.value = ae.toFixed(2);
        inputAp.value = ap.toFixed(2);

        // 5. RCT Factor (Radial Chip Thinning)
        let rct = 1;
        if (ae < (d * 0.5)) {
            rct = d / (2 * Math.sqrt(ae * (d - ae)));
        }

        // 6. Vf (Tilspænding)
        const effective_fz = fz * rct;
        let vf = n * z * effective_fz;
        
        if (!toggleHsm.checked) vf = Math.min(vf, 2500); 
        outVf.textContent = Math.round(vf);

        // 7. MRR
        outMrr.textContent = ((ae * ap * vf) / 1000).toFixed(1);

        // Advarsler
        warningContainer.innerHTML = '';
        if (rct > 1.2) addWarning("RCT Aktiv: Vf boostet pga. lav Ae", "primary");
    }

    function addWarning(msg, color) {
        warningContainer.innerHTML += `<div class="text-[9px] font-mono font-bold p-2 border border-${color}-500/20 bg-${color}-500/10 text-${color}-500 italic">! ${msg}</div>`;
    }

    // --- EVENT LISTENERS ---
    toolSelect.addEventListener('change', (e) => {
        const opt = e.target.options[e.target.selectedIndex];
        hiddenD.value = opt.dataset.d || 0;
        hiddenZ.value = opt.dataset.z || 0;
        hiddenMat.value = opt.dataset.mat || "";
        calculate();
    });

    [workMaterialSelect, camStrategySelect, inputAe, inputAp, toggleHsm].forEach(el => el.addEventListener('input', calculate));

    document.getElementById('btn-save-tool').addEventListener('click', (e) => {
        e.preventDefault();
        const tools = JSON.parse(localStorage.getItem('datum_tools')) || [];
        tools.push({
            t: document.getElementById('tool-t').value,
            type: document.getElementById('tool-type').value,
            holder: document.getElementById('tool-holder').value,
            mat: document.getElementById('tool-mat').value,
            d: document.getElementById('tool-d').value,
            z: document.getElementById('tool-z').value,
            stickout: document.getElementById('tool-stickout').value
        });
        localStorage.setItem('datum_tools', JSON.stringify(tools));
        renderToolCrib();
    });

    window.deleteTool = (t) => {
        let tools = JSON.parse(localStorage.getItem('datum_tools')) || [];
        tools = tools.filter(x => x.t != t);
        localStorage.setItem('datum_tools', JSON.stringify(tools));
        renderToolCrib();
    };

    document.getElementById('btn-save').addEventListener('click', () => {
        const tr = document.createElement('tr');
        tr.className = "border-b border-zinc-800 text-xs font-mono text-zinc-400 bg-black/40";
        tr.innerHTML = `<td class="p-4 font-bold text-white uppercase">${document.getElementById('input-wcs').value}</td><td class="p-4">T${toolSelect.value}</td><td class="p-4">${camStrategySelect.value}</td><td class="p-4 text-primary">${outRpm.textContent}</td><td class="p-4">${outVf.textContent}</td><td class="p-4">${document.getElementById('input-time').value} Min</td><td class="p-4 text-right print:hidden"><button onclick="this.parentElement.parentElement.remove()" class="text-zinc-600 hover:text-red-500 font-bold uppercase tracking-widest text-[10px]">SLET</button></td>`;
        tableBody.appendChild(tr);
    });

    populateStrategies();
    renderToolCrib();
});