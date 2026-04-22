/**
 * Machining_OS | CNC Hub Logic v8.9
 * Physics-Driven Simulation Engine // Geometric Correction // tactical UI
 */

document.addEventListener('DOMContentLoaded', () => {
    const machineSelect = document.getElementById('machine-select');
    const workMaterialSelect = document.getElementById('work-material');
    const toolSelect = document.getElementById('active-tool-select');
    const camStrategySelect = document.getElementById('cam-strategy');
    const toggleManual = document.getElementById('toggle-manual');
    const manualInputs = document.getElementById('manual-inputs');
    const toggleHsm = document.getElementById('toggle-hsm');
    const toggleSafe = document.getElementById('toggle-safe');
    const toggleFinish = document.getElementById('toggle-finish');

    const STRATEGIES = {
        '2D Adaptive Clearing': { vc_mult: 1.5, fz_mult: 1.2 },
        '2D Pocket':            { vc_mult: 1.0, fz_mult: 1.0 },
        '2D Contour':           { vc_mult: 1.0, fz_mult: 0.8 },
        '2D Chamfer (Fas)':     { vc_mult: 1.0, fz_mult: 0.7 },
        'Slot (Spor)':          { vc_mult: 0.8, fz_mult: 0.7 },
        'Bore (Cirkulær)':      { vc_mult: 1.0, fz_mult: 1.0 },
        'Thread Mill (Gevind)': { vc_mult: 0.8, fz_mult: 0.6 },
        'Trace / Engrave':      { vc_mult: 1.2, fz_mult: 0.5 },
        '3D Adaptive Clearing': { vc_mult: 1.5, fz_mult: 1.1 },
        'Parallel (Slet)':      { vc_mult: 1.2, fz_mult: 0.6 },
        'Scallop (Overflade)':  { vc_mult: 1.2, fz_mult: 0.6 },
        'Drilling (Standard)':  { vc_mult: 0.8, fz_mult: 1.0 },
        'Tapping (Gevind)':     { vc_mult: 0.3, fz_mult: 1.0 }
    };

    function calculate() {
        const protocolError = document.getElementById('protocol-error');
        if (protocolError) protocolError.classList.add('hidden');

        const machine = MACHINING_DB.MACHINES[machineSelect.value || 'HAAS_MINI'];
        const mat = MACHINING_DB.MATERIALS[workMaterialSelect.value || 'ALU'];
        const strategy = STRATEGIES[camStrategySelect.value || '2D Pocket'];

        let d = 0, z = 1, toolMat = 'HM', toolType = 'ENDMILL (SLET)';
        
        if (toggleManual && toggleManual.checked) {
            d = parseFloat(document.getElementById('manual-d')?.value) || 0;
            z = parseFloat(document.getElementById('manual-z')?.value) || 1;
            toolMat = document.getElementById('manual-mat')?.value || 'HM';
            toolType = document.getElementById('manual-type')?.value || 'ENDMILL (SLET)';
            if (toolSelect) toolSelect.disabled = true;
            if (manualInputs) manualInputs.classList.remove('hidden');
        } else {
            d = parseFloat(document.getElementById('hidden-d')?.value) || 0;
            z = parseFloat(document.getElementById('hidden-z')?.value) || 1;
            toolMat = document.getElementById('hidden-mat')?.value || 'HM';
            toolType = document.getElementById('hidden-type')?.value || 'ENDMILL (SLET)';
            if (toolSelect) toolSelect.disabled = false;
            if (manualInputs) manualInputs.classList.add('hidden');
        }

        const ae = parseFloat(document.getElementById('input-ae')?.value) || 0;
        const ap = parseFloat(document.getElementById('input-ap')?.value) || 0;
        const stickout = parseFloat(document.getElementById('input-stickout')?.value) || 25;

        if (d <= 0) return;

        // 1. DYNAMIC LOOKUPS
        const hardnessFactor = Math.sqrt(150 / mat.hb);
        const geo = MACHINING_DB.GEOMETRY_FACTORS[toolType.toUpperCase()] || { vc_mod: 1.0, fz_mod: 1.0 };
        const matKey = `vc_${toolMat.toLowerCase().replace('-', '')}`;
        let base_vc = mat[matKey] || mat.vc_hss;
        
        if (base_vc === 0) { document.getElementById('out-rpm').textContent = "ERR"; return; }

        // 2. SCALE CALCULATION [cite: 2026-03-11]
        let vc_calc = base_vc * hardnessFactor * geo.vc_mod; // Værktøjstype påvirker nu Vc [cite: 2026-03-11]
        let fz_calc = d * mat.fz_ref * strategy.fz_mult * geo.fz_mod; // Værktøjstype påvirker nu fz [cite: 2026-03-11]

        if (toggleHsm && toggleHsm.checked) vc_calc *= strategy.vc_mult;
        if (toggleSafe && toggleSafe.checked) { vc_calc *= 0.70; fz_calc *= 0.70; }
        if (toggleFinish && toggleFinish.checked) { vc_calc *= 1.25; fz_calc *= 0.50; }

        // 3. CHIP THINNING & DEFLECTION
        let thinning_mult = (ae > 0 && ae < (d * 0.5)) ? Math.min(d / (2 * Math.sqrt(d * ae - Math.pow(ae, 2))), 3.0) : 1.0;
        let true_fz = fz_calc * thinning_mult;

        const E = (MACHINING_DB.PHYSICS[`E_MODULUS_${toolMat.toUpperCase().replace('-', '')}`] || 210) * 1000;
        const I = (Math.PI * Math.pow(d, 4)) / 64;
        const force_total = (mat.kc1 * Math.pow(true_fz, 1 - mat.mc) * ap * ae) / d;
        const deflection = (force_total * Math.pow(stickout, 3)) / (3 * E * I);
        
        let deflection_penalty = deflection > 0.02 ? 0.02 / deflection : 1.0;
        if (deflection_penalty < 1.0) { vc_calc *= Math.sqrt(deflection_penalty); true_fz *= deflection_penalty; }

        // 4. FINAL RENDERING
        let n = Math.min((vc_calc * 1000) / (Math.PI * d), machine.maxRpm);
        const vf = n * z * true_fz;
        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-fz').textContent = true_fz.toFixed(4);
        document.getElementById('out-vf-plunge').textContent = Math.round(n * (fz_calc * 0.5)).toLocaleString('da-DK');
        document.getElementById('out-deflection').textContent = deflection_penalty.toFixed(2) + 'x';
        document.getElementById('out-load').textContent = Math.round((((ae * ap * vf) / 1000 * mat.kc1) / 60000 / (machine.kw || 5.6)) * 100) || 0;
    }

    // Menu Logic
    const navOverlay = document.getElementById('nav-overlay');
    const openBtn = document.getElementById('open-menu');
    const closeBtn = document.getElementById('close-menu');
    const routeGrid = document.getElementById('route-grid');

    function renderTacticalMenu() {
        if (!routeGrid) return;
        routeGrid.innerHTML = MACHINING_DB.ROUTES.map(route => `
            <a href="${route.path}" class="route-card p-6 block group">
                <span class="label-micro !text-[7px] text-zinc-600 group-hover:text-primary">Route_${route.id}</span>
                <h3 class="text-sm font-black uppercase text-zinc-400 group-hover:text-white mt-2">${route.name}</h3>
                <p class="text-[6px] text-zinc-700 mt-1 uppercase font-bold tracking-widest">${route.level}_LEVEL</p>
            </a>`).join('');
    }

    if (openBtn) openBtn.addEventListener('click', () => { navOverlay.classList.add('active'); renderTacticalMenu(); });
    if (closeBtn) closeBtn.addEventListener('click', () => navOverlay.classList.remove('active'));

    // Input Listeners
    [machineSelect, workMaterialSelect, camStrategySelect, toggleManual, toggleHsm, toggleSafe, toggleFinish, document.getElementById('manual-mat'), document.getElementById('manual-type')].forEach(el => el?.addEventListener('change', calculate));
    ['manual-d', 'manual-z', 'input-ae', 'input-ap', 'input-stickout'].forEach(id => document.getElementById(id)?.addEventListener('input', calculate));

    if (toolSelect) {
        toolSelect.addEventListener('change', (e) => {
            const opt = e.target.options[e.target.selectedIndex];
            if (!opt.value) return;
            document.getElementById('hidden-d').value = opt.dataset.d;
            document.getElementById('hidden-z').value = opt.dataset.z;
            document.getElementById('hidden-mat').value = opt.dataset.mat;
            document.getElementById('hidden-type').value = opt.dataset.type; // Gemmer nu også typen [cite: 2026-03-11]
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