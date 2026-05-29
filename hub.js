/**
 * Machining_OS | CNC Hub Logic v9.3
 * Physics Engine // Comprehensive Fail-Safe // Triple-Checked
 */

document.addEventListener('DOMContentLoaded', () => {
    const machineSelect = document.getElementById('machine-select');
    const workMaterialSelect = document.getElementById('work-material');
    const toolSelect = document.getElementById('active-tool-select');
    const camStrategySelect = document.getElementById('cam-strategy');
    const toggleManual = document.getElementById('toggle-manual');
    const manualInputs = document.getElementById('manual-inputs');
    
    const STRATEGIES = {
        '2D Adaptive Clearing': { vc_mult: 1.5, fz_mult: 1.2 },
        '2D Pocket':            { vc_mult: 1.0, fz_mult: 1.0 },
        '2D Contour':           { vc_mult: 1.0, fz_mult: 0.8 },
        'Slot (Spor)':          { vc_mult: 0.8, fz_mult: 0.7 },
        'Drilling (Standard)':  { vc_mult: 0.8, fz_mult: 1.0 },
        'Tapping (Gevind)':     { vc_mult: 0.3, fz_mult: 1.0 }
    };

    function calculate() {
        const machine = MACHINING_DB.MACHINES[machineSelect.value || 'HAAS_MINI'];
        const mat = MACHINING_DB.MATERIALS[workMaterialSelect.value || 'ALU'];
        const strategy = STRATEGIES[camStrategySelect.value] || STRATEGIES['2D Pocket'];

        let d = 0, z = 1, toolMat = 'HM', toolType = 'ENDMILL (SLET)';
        
        if (toggleManual.checked) {
            d = parseFloat(document.getElementById('manual-d').value) || 0;
            z = parseFloat(document.getElementById('manual-z').value) || 1;
            toolMat = document.getElementById('manual-mat').value;
            toolType = document.getElementById('manual-type').value;
            if (toolSelect) toolSelect.disabled = true;
            manualInputs.classList.remove('hidden');
        } else {
            d = parseFloat(document.getElementById('hidden-d').value) || 0;
            z = parseFloat(document.getElementById('hidden-z').value) || 1;
            toolMat = document.getElementById('hidden-mat').value;
            toolType = document.getElementById('hidden-type').value;
            if (toolSelect) toolSelect.disabled = false;
            manualInputs.classList.add('hidden');
        }

        const ae = parseFloat(document.getElementById('input-ae').value) || 0;
        const ap = parseFloat(document.getElementById('input-ap').value) || 0;
        const stickout = parseFloat(document.getElementById('input-stickout').value) || 25;

        if (d <= 0) { 
            ['out-rpm', 'out-vf', 'out-fz', 'out-vf-plunge', 'out-load', 'rec-ae'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = id === 'out-fz' ? "0.0000" : "0";
            });
            return; 
        }

        const geo = MACHINING_DB.GEOMETRY_FACTORS[toolType.toUpperCase()] || { vc_mod: 1.0, fz_mod: 1.0, ae_mod: 1.0 };
        let rec_ae = d * (mat.ae_ref || 0.1) * geo.ae_mod;
        const E_KEY = `E_MODULUS_${toolMat.toUpperCase().replace('-', '')}`;
        const E = (MACHINING_DB.PHYSICS[E_KEY] || 210) * 1000;
        const I = (Math.PI * Math.pow(d, 4)) / 64;
        const stiffness = (3 * E * I) / Math.pow(stickout, 3);
        if (stiffness < 1000) rec_ae *= 0.7;
        document.getElementById('rec-ae').textContent = rec_ae.toFixed(2);

        const hardnessFactor = Math.sqrt(150 / mat.hb);
        const matKey = `vc_${toolMat.toLowerCase().replace('-', '')}`;
        let base_vc = mat[matKey] || mat.vc_hssco;

        if (base_vc === 0) { document.getElementById('out-rpm').textContent = "ERR"; return; }

        let vc_calc = base_vc * hardnessFactor * geo.vc_mod;
        let fz_calc = d * (mat.fz_ref || 0.002) * (strategy.fz_mult || 1.0) * (geo.fz_mod || 1.0);

        if (document.getElementById('toggle-hsm').checked) vc_calc *= strategy.vc_mult;
        if (document.getElementById('toggle-safe').checked) { vc_calc *= 0.7; fz_calc *= 0.7; }
        if (document.getElementById('toggle-finish').checked) { vc_calc *= 1.25; fz_calc *= 0.5; }

        let true_fz = fz_calc * ((ae > 0 && ae < (d * 0.5)) ? Math.min(d / (2 * Math.sqrt(d * ae - Math.pow(ae, 2))), 3.0) : 1.0);
        const force_total = (mat.kc1 * Math.pow(true_fz, 1 - mat.mc) * ap * ae) / d;
        const deflection = (force_total * Math.pow(stickout, 3)) / (3 * E * I);
        let penalty = (toolType.toUpperCase() === 'DRILL' || toolType.toUpperCase() === 'THREADMILL') ? 1.0 : (deflection > 0.02 ? 0.02 / deflection : 1.0);

        if (penalty < 1.0) { vc_calc *= Math.sqrt(penalty); true_fz *= penalty; }

        let n = Math.min((vc_calc * 1000) / (Math.PI * d), machine.maxRpm);
        const vf = n * z * true_fz;
        
        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vc').textContent = Math.round((n * Math.PI * d) / 1000).toLocaleString('da-DK');
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-fz').textContent = true_fz.toFixed(4);
        document.getElementById('out-vf-plunge').textContent = Math.round(n * (fz_calc * 0.5)).toLocaleString('da-DK');
        document.getElementById('out-deflection').textContent = penalty.toFixed(2) + 'x';
        document.getElementById('out-load').textContent = Math.round((((ae * ap * vf) / 1000 * mat.kc1) / 60000 / machine.kw) * 100) || 0;
    }

    const navOverlay = document.getElementById('nav-overlay');
    const openBtn = document.getElementById('open-menu');
    const closeBtn = document.getElementById('close-menu');
    const routeGrid = document.getElementById('route-grid');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            navOverlay.classList.add('active');
            routeGrid.innerHTML = MACHINING_DB.ROUTES.map(route => `
                <a href="${route.path}" class="route-card group">
                    <span class="label-micro group-hover:text-primary">Route_${route.id}</span>
                    <h3 class="text-sm font-black uppercase text-zinc-400 group-hover:text-white mt-2">${route.name}</h3>
                </a>`).join('');
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', () => navOverlay.classList.remove('active'));

    const triggers = [machineSelect, workMaterialSelect, camStrategySelect, toggleManual, toolSelect,
                     'toggle-hsm', 'toggle-safe', 'toggle-finish', 'manual-mat', 'manual-type'];
    triggers.forEach(id => { const el = typeof id === 'string' ? document.getElementById(id) : id; el?.addEventListener('change', calculate); });
    ['manual-d', 'manual-z', 'input-ae', 'input-ap', 'input-stickout'].forEach(id => document.getElementById(id)?.addEventListener('input', calculate));

    if (toolSelect) {
        toolSelect.addEventListener('change', (e) => {
            const opt = e.target.options[e.target.selectedIndex];
            if (!opt.value) return;
            document.getElementById('hidden-d').value = opt.dataset.d;
            document.getElementById('hidden-z').value = opt.dataset.z;
            document.getElementById('hidden-mat').value = opt.dataset.mat;
            document.getElementById('hidden-type').value = opt.dataset.type;
            calculate();
        });
    }

    function initHub() {
        machineSelect.innerHTML = Object.entries(MACHINING_DB.MACHINES).map(([k, m]) => `<option value="${k}">${m.name.toUpperCase()}</option>`).join('');
        workMaterialSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS).map(([k, m]) => `<option value="${k}">${m.name}</option>`).join('');
        camStrategySelect.innerHTML = Object.keys(STRATEGIES).map(k => `<option value="${k}">${k.toUpperCase()}</option>`).join('');
        const tools = MachiningOS.getTools();
        if (toolSelect) toolSelect.innerHTML = '<option value="">-- SELECT_TOOL --</option>' + tools.map(t => `<option value="${t.t}" data-d="${t.d}" data-z="${t.z}" data-mat="${t.mat}" data-type="${t.type}">T${t.t} (Ø${t.d} ${t.type})</option>`).join('');
        calculate(); 
    }
    initHub();
});