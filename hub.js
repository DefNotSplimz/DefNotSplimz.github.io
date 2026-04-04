document.addEventListener('DOMContentLoaded', () => {
    const MACHINE_LIBRARY = {
        'HAAS_MINI_MILL': { maxRpm: 10000, maxFeed: 15000, type: 'cnc' },
        'HAAS_ST10': { maxRpm: 6000, maxFeed: 12000, type: 'cnc' }
    };

    const MATERIAL_DATA = {
        'ALU': { name: 'Aluminium', vc: 450, fz: 0.08, ae_lim: 0.40, ap_lim: 2.0 },
        'MESSING': { name: 'Messing', vc: 180, fz: 0.07, ae_lim: 0.25, ap_lim: 1.5 },
        'STAAL': { name: 'Stål', vc: 140, fz: 0.06, ae_lim: 0.15, ap_lim: 1.0 },
        'RUSTFAST': { name: 'Rustfast', vc: 85, fz: 0.04, ae_lim: 0.10, ap_lim: 0.8 },
        'VAERKTOJSSTAAL': { name: 'Værktøjsstål', vc: 65, fz: 0.035, ae_lim: 0.08, ap_lim: 0.5 },
        'POM': { name: 'POM (Acetal)', vc: 350, fz: 0.12, ae_lim: 0.50, ap_lim: 2.5 },
        'NYLON': { name: 'Nylon', vc: 220, fz: 0.10, ae_lim: 0.40, ap_lim: 2.0 },
        'STOEBEJERN': { name: 'Støbejern', vc: 110, fz: 0.07, ae_lim: 0.20, ap_lim: 1.2 },
        'TITANIUM': { name: 'Titanium', vc: 45, fz: 0.03, ae_lim: 0.07, ap_lim: 0.4 }
    };

    const STRATEGIES = {
        '2D Adaptive Clearing': { mult_ae: 1.0, mult_ap: 1.0, vc_mult: 1.5 },
        '2D Pocket': { mult_ae: 0.8, mult_ap: 0.5, vc_mult: 1.0 },
        '2D Contour': { mult_ae: 0.1, mult_ap: 1.5, vc_mult: 1.2 },
        'Face': { mult_ae: 1.5, mult_ap: 0.1, vc_mult: 1.0 }
    };

    const machineSelect = document.getElementById('machine-select');
    const toolSelect = document.getElementById('active-tool-select');
    const workMaterialSelect = document.getElementById('work-material');
    const camStrategySelect = document.getElementById('cam-strategy');
    const inputAe = document.getElementById('input-ae');
    const inputAp = document.getElementById('input-ap');
    const toggleHsm = document.getElementById('toggle-hsm');
    const hiddenD = document.getElementById('hidden-d');
    const hiddenZ = document.getElementById('hidden-z');
    const hiddenMat = document.getElementById('hidden-mat');
    const hiddenStickout = document.getElementById('hidden-stickout');

    function init() {
        workMaterialSelect.innerHTML = Object.entries(MATERIAL_DATA).map(([k,v]) => `<option value="${k}">${v.name}</option>`).join('');
        camStrategySelect.innerHTML = Object.keys(STRATEGIES).map(k => `<option value="${k}">${k}</option>`).join('');
        renderToolCrib();
    }

    function updateVisualHUD(ae, ap, d, rpm, maxRpm) {
        const rpmPct = Math.min((rpm / maxRpm) * 100, 100);
        document.getElementById('rpm-bar').style.width = `${rpmPct}%`;
        document.getElementById('rpm-bar').style.backgroundColor = rpmPct > 90 ? '#ef4444' : '#f59e0b';
        document.getElementById('rpm-pct').textContent = `${Math.round(rpmPct)}%`;

        const ratio = Math.min(ae / d, 1);
        const angle = ratio * 180;
        const x = 50 + 45 * Math.sin(angle * Math.PI / 180);
        const y = 50 - 45 * Math.cos(angle * Math.PI / 180);
        const largeArc = angle > 180 ? 1 : 0;
        document.getElementById('hud-ae-path').setAttribute('d', `M 50 50 L 50 5 A 45 45 0 ${largeArc} 1 ${x} ${y} Z`);
        document.getElementById('hud-ap-fill').style.height = `${Math.min((ap/(d*2))*100, 100)}%`;
    }

    function calculate() {
        const machine = MACHINE_LIBRARY[machineSelect.value];
        const d = parseFloat(hiddenD.value) || 0;
        const toolMat = hiddenMat.value || 'HM';
        if (d === 0 || !MATERIAL_DATA[workMaterialSelect.value]) return;

        const base = MATERIAL_DATA[workMaterialSelect.value];
        const strat = STRATEGIES[camStrategySelect.value];
        const ld = (parseFloat(hiddenStickout.value) || (d*3)) / d;
        const stability = ld > 4 ? 0.7 : 1.0;

        const vc = base.vc * strat.vc_mult * (toolMat === 'HSS' ? 0.2 : 1.0) * stability;
        const fz = base.fz * stability;
        const n = Math.min((vc * 1000) / (Math.PI * d), machine.maxRpm);

        let ae = d * base.ae_lim * strat.mult_ae * stability;
        let ap = d * base.ap_lim * strat.mult_ap * stability;
        inputAe.value = ae.toFixed(2); inputAp.value = ap.toFixed(2);

        const rct = ae < (d * 0.5) ? d / (2 * Math.sqrt(ae * (d - ae))) : 1;
        let vf = n * (parseFloat(hiddenZ.value) || 1) * fz * rct;
        if (!toggleHsm.checked) vf = Math.min(vf, 2500);

        document.getElementById('out-vc-range').textContent = Math.round(vc);
        document.getElementById('out-fz-range').textContent = fz.toFixed(3);
        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        updateVisualHUD(ae, ap, d, n, machine.maxRpm);
    }

    function renderToolCrib() {
        const tools = JSON.parse(localStorage.getItem('datum_tools')) || [];
        toolSelect.innerHTML = '<option value="">-- Vælg Værktøj --</option>' + tools.map(t => `<option value="${t.t}" data-d="${t.d}" data-z="${t.z}" data-mat="${t.mat}" data-stickout="${t.stickout}">T${t.t} - ${t.type} (Ø${t.d})</option>`).join('');
        document.getElementById('tool-table-body').innerHTML = tools.map(t => `<tr class="border-b border-zinc-900 text-xs"><td>T${t.t}</td><td>${t.type}</td><td class="text-primary">${t.mat}</td><td>Ø${t.d}</td><td class="text-right"><button onclick="deleteTool(${t.t})" class="text-zinc-600">SLET</button></td></tr>`).join('');
    }

    toolSelect.addEventListener('change', (e) => {
        const opt = e.target.options[e.target.selectedIndex];
        hiddenD.value = opt.dataset.d || 0; hiddenZ.value = opt.dataset.z || 0; hiddenMat.value = opt.dataset.mat || ""; hiddenStickout.value = opt.dataset.stickout || 0;
        calculate();
    });

    [machineSelect, workMaterialSelect, camStrategySelect, inputAe, inputAp, toggleHsm].forEach(el => el.addEventListener('input', calculate));

    document.getElementById('btn-save-tool').addEventListener('click', (e) => {
        e.preventDefault();
        const tools = JSON.parse(localStorage.getItem('datum_tools')) || [];
        tools.push({ t: document.getElementById('tool-t').value, type: document.getElementById('tool-type').value, mat: document.getElementById('tool-mat').value, d: document.getElementById('tool-d').value, z: document.getElementById('tool-z').value, stickout: document.getElementById('tool-stickout').value });
        localStorage.setItem('datum_tools', JSON.stringify(tools));
        renderToolCrib();
    });

    window.deleteTool = (t) => {
        const tools = JSON.parse(localStorage.getItem('datum_tools')) || [];
        localStorage.setItem('datum_tools', JSON.stringify(tools.filter(x => x.t != t)));
        renderToolCrib();
    };

    document.getElementById('btn-save').addEventListener('click', () => {
        document.getElementById('setup-table-body').innerHTML += `<tr class="border-b border-zinc-800 text-xs bg-black/40"><td class="p-4 uppercase">G54</td><td class="p-4">T${toolSelect.value}</td><td class="p-4">${camStrategySelect.value}</td><td class="p-4 text-primary">${document.getElementById('out-rpm').textContent}</td><td class="p-4">${document.getElementById('out-vf').textContent}</td><td class="p-4 text-right"><button onclick="this.parentElement.parentElement.remove()" class="text-zinc-600">SLET</button></td></tr>`;
    });

    document.getElementById('btn-print').addEventListener('click', () => window.print());
    document.getElementById('btn-clear').addEventListener('click', () => document.getElementById('setup-table-body').innerHTML = '');
    init();
});