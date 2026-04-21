/**
 * Machining_OS | CNC Hub Logic v8.7
 * Physics-Driven Simulation Engine // Complete Fusion 360 Matrix Sync // Tactical Navigation
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
        '3D Pocket (Skrub)':    { vc_mult: 1.0, fz_mult: 1.0 },
        'Parallel (Slet)':      { vc_mult: 1.2, fz_mult: 0.6 },
        'Scallop (Overflade)':  { vc_mult: 1.2, fz_mult: 0.6 },
        '3D Contour (Z-level)': { vc_mult: 1.0, fz_mult: 0.7 },
        'Pencil (Hjørner)':     { vc_mult: 0.9, fz_mult: 0.5 },
        'Steep & Shallow':      { vc_mult: 1.1, fz_mult: 0.7 },
        'Drilling (Standard)':  { vc_mult: 0.8, fz_mult: 1.0 },
        'Tapping (Gevind)':     { vc_mult: 0.3, fz_mult: 1.0 }
    };

    function calculate() {
        const protocolError = document.getElementById('protocol-error');
        if (protocolError) protocolError.classList.add('hidden');

        const machine = MACHINING_DB.MACHINES[machineSelect.value || 'HAAS_MINI'];
        const mat = MACHINING_DB.MATERIALS[workMaterialSelect.value || 'ALU'];
        const strategy = STRATEGIES[camStrategySelect.value || '2D Pocket'];

        let d = 0, z = 1, toolMat = 'HM';
        
        if (toggleManual && toggleManual.checked) {
            d = parseFloat(document.getElementById('manual-d')?.value) || 0;
            z = parseFloat(document.getElementById('manual-z')?.value) || 1;
            toolMat = 'HM';
            if (toolSelect) toolSelect.disabled = true;
            if (manualInputs) manualInputs.classList.remove('hidden');
        } else {
            d = parseFloat(document.getElementById('hidden-d')?.value) || 0;
            z = parseFloat(document.getElementById('hidden-z')?.value) || 1;
            toolMat = document.getElementById('hidden-mat')?.value || 'HM';
            if (toolSelect) toolSelect.disabled = false;
            if (manualInputs) manualInputs.classList.add('hidden');
        }

        const ae = parseFloat(document.getElementById('input-ae')?.value) || 0;
        const ap = parseFloat(document.getElementById('input-ap')?.value) || 0;
        const stickout = parseFloat(document.getElementById('input-stickout')?.value) || 25;

        if (d <= 0) return;

        // 1. PHYSICAL SCALING
        const hardnessFactor = Math.sqrt(150 / mat.hb);
        let vc_calc = (toolMat === 'HM' ? mat.vc_hm : mat.vc_hss) * hardnessFactor;
        let fz_calc = d * mat.fz_ref * strategy.fz_mult;

        if (toggleHsm && toggleHsm.checked) vc_calc *= strategy.vc_mult;
        if (toggleSafe && toggleSafe.checked) { vc_calc *= 0.70; fz_calc *= 0.70; }
        if (toggleFinish && toggleFinish.checked) { vc_calc *= 1.25; fz_calc *= 0.50; }

        // 2. CHIP THINNING
        let thinning_mult = (ae > 0 && ae < (d * 0.5)) ? Math.min(d / (2 * Math.sqrt(d * ae - Math.pow(ae, 2))), 3.0) : 1.0;
        let true_fz = fz_calc * thinning_mult;

        // 3. DEFLECTION
        const E = (toolMat === 'HM' ? MACHINING_DB.PHYSICS.E_MODULUS_HM : MACHINING_DB.PHYSICS.E_MODULUS_HSS) * 1000;
        const I = (Math.PI * Math.pow(d, 4)) / 64;
        const force_total = (mat.kc1 * Math.pow(true_fz, 1 - mat.mc) * ap * ae) / d;
        const deflection = (force_total * Math.pow(stickout, 3)) / (3 * E * I);
        
        let deflection_penalty = deflection > 0.02 ? 0.02 / deflection : 1.0;
        if (deflection_penalty < 1.0) {
            vc_calc *= Math.sqrt(deflection_penalty);
            true_fz *= deflection_penalty;
        }

        // 4. COMMAND GENERATION
        let n = Math.min((vc_calc * 1000) / (Math.PI * d), machine.maxRpm);
        const vf = n * z * true_fz;
        const vc_actual = (n * Math.PI * d) / 1000;
        const vf_plunge = n * (fz_calc * 0.5);
        const f_rev_plunge = vf_plunge / n;

        // --- RENDER ---
        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vc').textContent = Math.round(vc_actual).toLocaleString('da-DK');
        document.getElementById('out-rpm-ramp').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-fz').textContent = true_fz.toFixed(4);
        document.getElementById('out-vf-lead').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-vf-ramp').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-vf-plunge').textContent = Math.round(vf_plunge).toLocaleString('da-DK');
        document.getElementById('out-f-rev-plunge').textContent = f_rev_plunge.toFixed(4);
        const power_kw = ((ae * ap * vf) / 1000 * mat.kc1) / 60000;
        document.getElementById('out-load').textContent = Math.round((power_kw / (machine.kw || 5.6)) * 100) || 0;
        document.getElementById('out-deflection').textContent = deflection_penalty.toFixed(2) + 'x';
    }

    // --- TACTICAL MENU LOGIC [cite: 2026-03-11] ---
    const navOverlay = document.getElementById('nav-overlay');
    const openBtn = document.getElementById('open-menu');
    const closeBtn = document.getElementById('close-menu');
    const routeGrid = document.getElementById('route-grid');

    function renderTacticalMenu() {
        if (!routeGrid) return;
        routeGrid.innerHTML = MACHINING_DB.ROUTES.map(route => `
            <a href="${route.path}" class="route-card p-6 block group">
                <div class="route-marker"></div>
                <span class="label-micro !text-[7px] text-zinc-600 group-hover:text-primary transition-colors">Route_${route.id}</span>
                <h3 class="text-sm font-black uppercase text-zinc-400 group-hover:text-white transition-colors mt-2">${route.name}</h3>
                <p class="text-[6px] text-zinc-700 mt-1 uppercase font-bold tracking-[0.2em] group-hover:text-zinc-500">${route.level}_LEVEL</p>
            </a>
        `).join('');
    }

    if (openBtn) openBtn.addEventListener('click', () => { navOverlay.classList.add('active'); renderTacticalMenu(); });
    if (closeBtn) closeBtn.addEventListener('click', () => navOverlay.classList.remove('active'));
    document.addEventListener('keydown', (e) => { if (e.key === "Escape") navOverlay.classList.remove('active'); });

    // Listeners
    [machineSelect, workMaterialSelect, camStrategySelect, toggleManual, toggleHsm, toggleSafe, toggleFinish].forEach(el => el?.addEventListener('change', calculate));
    ['manual-d', 'manual-z', 'input-ae', 'input-ap', 'input-stickout'].forEach(id => document.getElementById(id)?.addEventListener('input', calculate));

    if (toolSelect) {
        toolSelect.addEventListener('change', (e) => {
            const opt = e.target.options[e.target.selectedIndex];
            if (!opt.value) return;
            document.getElementById('hidden-d').value = opt.dataset.d;
            document.getElementById('hidden-z').value = opt.dataset.z;
            document.getElementById('hidden-mat').value = opt.dataset.mat;
            calculate();
        });
    }

    function initHub() {
        if (machineSelect) machineSelect.innerHTML = Object.entries(MACHINING_DB.MACHINES).map(([k, m]) => `<option value="${k}">${m.name.toUpperCase()}</option>`).join('');
        if (workMaterialSelect) workMaterialSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS).map(([k, m]) => `<option value="${k}">${m.name}</option>`).join('');
        if (camStrategySelect) camStrategySelect.innerHTML = Object.keys(STRATEGIES).map(k => `<option value="${k}">${k.toUpperCase()}</option>`).join('');
        const tools = MachiningOS.getTools();
        if (toolSelect) toolSelect.innerHTML = '<option value="">-- SELECT_TOOL --</option>' + tools.map(t => `<option value="${t.t}" data-d="${t.d}" data-z="${t.z}" data-mat="${t.mat}">T${t.t} (Ø${t.d})</option>`).join('');
        calculate(); 
    }
    initHub();
});