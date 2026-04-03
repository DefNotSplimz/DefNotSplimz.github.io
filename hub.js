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
    const hiddenStickout = document.createElement('input'); // Til midlertidig lagring af udlæg
    hiddenStickout.type = 'hidden';

    const outVcRange = document.getElementById('out-vc-range');
    const outFzRange = document.getElementById('out-fz-range');
    const outRpm = document.getElementById('out-rpm');
    const outVf = document.getElementById('out-vf');
    const outMrr = document.getElementById('out-mrr');
    const warningContainer = document.getElementById('warning-container');

    const tableBody = document.getElementById('setup-table-body');
    const toolTableBody = document.getElementById('tool-table-body');

    // --- STRATEGI KONFIGURATION ---
    // mult_ae/ap bruges til at skalere materialets max-grænser baseret på CAM-strategien
    const STRATEGIES = {
        '2D Adaptive Clearing': { type: 'adaptive', mult_ae: 1.0, mult_ap: 1.0, vc_mult: 1.5 },
        '2D Pocket': { type: 'std', mult_ae: 0.8, mult_ap: 0.5, vc_mult: 1.0 },
        '2D Contour': { type: 'slet', mult_ae: 0.1, mult_ap: 1.5, vc_mult: 1.2 },
        'Face': { type: 'std', mult_ae: 1.5, mult_ap: 0.1, vc_mult: 1.0 },
        '3D Adaptive Clearing': { type: 'adaptive', mult_ae: 0.8, mult_ap: 1.2, vc_mult: 1.4 },
        'Parallel / Scallop': { type: 'slet', mult_ae: 0.05, mult_ap: 0.1, vc_mult: 1.3 },
        'Slotting': { type: 'std', mult_ae: 1.0, mult_ap: 0.5, vc_mult: 0.8 }
    };

    // --- MATERIALE MATRIX (Med specifikke grænser for HM og HSS) ---
    // ae_lim / ap_lim angiver max indgreb som en faktor af diameteren (D)
    const CUTTING_DATA = {
        'HM': {
            'ALU': { vc: 450, fz: 0.08, ae_lim: 0.40, ap_lim: 2.0 },
            'MESSING': { vc: 180, fz: 0.07, ae_lim: 0.25, ap_lim: 1.5 },
            'STAAL': { vc: 140, fz: 0.06, ae_lim: 0.15, ap_lim: 1.0 },
            'RUSTFAST': { vc: 85, fz: 0.04, ae_lim: 0.10, ap_lim: 0.8 },
            'VAERKTOJSSTAAL': { vc: 65, fz: 0.035, ae_lim: 0.08, ap_lim: 0.5 },
            'POM': { vc: 350, fz: 0.12, ae_lim: 0.50, ap_lim: 2.5 },
            'NYLON': { vc: 220, fz: 0.10, ae_lim: 0.40, ap_lim: 2.0 },
            'STOEBEJERN': { vc: 110, fz: 0.07, ae_lim: 0.20, ap_lim: 1.2 },
            'TITANIUM': { vc: 45, fz: 0.03, ae_lim: 0.07, ap_lim: 0.4 }
        },
        'HSS': {
            'ALU': { vc: 90, fz: 0.05, ae_lim: 0.20, ap_lim: 1.0 },
            'MESSING': { vc: 45, fz: 0.04, ae_lim: 0.15, ap_lim: 0.8 },
            'STAAL': { vc: 28, fz: 0.03, ae_lim: 0.10, ap_lim: 0.5 },
            'RUSTFAST': { vc: 18, fz: 0.02, ae_lim: 0.05, ap_lim: 0.3 },
            'VAERKTOJSSTAAL': { vc: 12, fz: 0.015, ae_lim: 0.05, ap_lim: 0.2 },
            'POM': { vc: 110, fz: 0.08, ae_lim: 0.30, ap_lim: 1.5 },
            'NYLON': { vc: 85, fz: 0.07, ae_lim: 0.25, ap_lim: 1.2 },
            'STOEBEJERN': { vc: 22, fz: 0.04, ae_lim: 0.10, ap_lim: 0.6 },
            'TITANIUM': { vc: 10, fz: 0.015, ae_lim: 0.04, ap_lim: 0.15 }
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
            toolSelect.innerHTML += `<option value="${t.t}" data-d="${t.d}" data-z="${t.z}" data-mat="${t.mat}" data-stickout="${t.stickout}">T${t.t} - ${t.type} (Ø${t.d})</option>`;
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
        const stickout = parseFloat(hiddenStickout.value) || (d * 3); // Default 3xD hvis ikke angivet

        if (d === 0 || !strategyKey || !CUTTING_DATA[toolMat][mat]) return;

        const baseData = CUTTING_DATA[toolMat][mat];
        const strategy = STRATEGIES[strategyKey];

        // --- STABILITETS BEREGNING (L/D Forhold) ---
        const ld_ratio = stickout / d;
        let stability_factor = 1.0;

        // Hvis værktøjet er langt, reduceres data for at undgå vibrationer
        if (ld_ratio > 3) stability_factor = 0.8;
        if (ld_ratio > 5) stability_factor = 0.5;
        if (ld_ratio > 7) stability_factor = 0.25;

        // --- AP & AE BEREGNING ---
        // Baseret på diameter, værktøjsmateriale-grænser, strategi-faktorer og stabilitet
        let ap = d * baseData.ap_lim * strategy.mult_ap * stability_factor;
        let ae = d * baseData.ae_lim * strategy.mult_ae * stability_factor;
        
        inputAe.value = ae.toFixed(2);
        inputAp.value = ap.toFixed(2);

        // --- SKÆREDATA BEREGNING ---
        const vc = baseData.vc * strategy.vc_mult * stability_factor;
        const fz = baseData.fz * stability_factor;
        
        outVcRange.textContent = Math.round(vc);
        outFzRange.textContent = fz.toFixed(3);

        // RPM
        let n = (vc * 1000) / (Math.PI * d);
        n = Math.min(n, 10000); // Max Haas RPM
        outRpm.textContent = Math.round(n).toLocaleString('da-DK');

        // RCT Factor (Radial Chip Thinning)
        let rct = 1;
        if (ae < (d * 0.5)) {
            rct = d / (2 * Math.sqrt(ae * (d - ae)));
        }

        // Vf (Tilspænding)
        const effective_fz = fz * rct;
        let vf = n * z * effective_fz;
        
        if (!toggleHsm.checked) vf = Math.min(vf, 2500); // Limit uden HSM
        outVf.textContent = Math.round(vf).toLocaleString('da-DK');

        // MRR (Material Removal Rate)
        outMrr.textContent = ((ae * ap * vf) / 1000).toFixed(1);

        // --- ADVARSLER ---
        warningContainer.innerHTML = '';
        if (rct > 1.2) addWarning("RCT Aktiv: Vf boostet pga. lav Ae", "primary");
        if (ld_ratio > 4) addWarning(`Højt udlæg (L/D: ${ld_ratio.toFixed(1)}): Data droslet for stabilitet`, "primary");
        if (ap > (d * 2.5)) addWarning("Kritisk Ap: Risiko for værktøjshavari", "red");
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
        hiddenStickout.value = opt.dataset.stickout || 0;
        calculate();
    });

    [workMaterialSelect, camStrategySelect, inputAe, inputAp, toggleHsm].forEach(el => {
        el.addEventListener('input', calculate);
    });

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
        tr.innerHTML = `
            <td class="p-4 font-bold text-white uppercase">${document.getElementById('input-wcs').value}</td>
            <td class="p-4">T${toolSelect.value}</td>
            <td class="p-4">${camStrategySelect.value}</td>
            <td class="p-4 text-primary">${outRpm.textContent}</td>
            <td class="p-4">${outVf.textContent}</td>
            <td class="p-4">${document.getElementById('input-time').value} Min</td>
            <td class="p-4 text-right print:hidden"><button onclick="this.parentElement.parentElement.remove()" class="text-zinc-600 hover:text-red-500 font-bold uppercase tracking-widest text-[10px]">SLET</button></td>
        `;
        tableBody.appendChild(tr);
    });

    document.getElementById('btn-print')?.addEventListener('click', () => window.print());

    populateStrategies();
    renderToolCrib();
});