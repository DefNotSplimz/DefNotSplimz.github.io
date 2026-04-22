/**
 * Machining_OS | CNC Hub Logic v9.1
 * Physics-Driven Simulation Engine // Dynamic Optimal Load Matrix
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
        '2D Chamfer (Fas)':     { vc_mult: 1.0, fz_mult: 0.7 },
        'Slot (Spor)':          { vc_mult: 0.8, fz_mult: 0.7 },
        'Bore (Cirkulær)':      { vc_mult: 1.0, fz_mult: 1.0 },
        'Thread Mill (Gevind)': { vc_mult: 0.8, fz_mult: 0.6 },
        '3D Adaptive Clearing': { vc_mult: 1.5, fz_mult: 1.1 },
        'Parallel (Slet)':      { vc_mult: 1.2, fz_mult: 0.6 },
        'Scallop (Overflade)':  { vc_mult: 1.2, fz_mult: 0.6 },
        'Drilling (Standard)':  { vc_mult: 0.8, fz_mult: 1.0 },
        'Tapping (Gevind)':     { vc_mult: 0.3, fz_mult: 1.0 }
    };

    function calculate() {
        const protocolError = document.getElementById('protocol-error');
        if (protocolError) protocolError.classList.add('hidden');

        // 1. DATA ACQUISITION [cite: 2026-03-11]
        const machine = MACHINING_DB.MACHINES[machineSelect.value || 'HAAS_MINI'];
        const mat = MACHINING_DB.MATERIALS[workMaterialSelect.value || 'ALU'];
        const strategy = STRATEGIES[camStrategySelect.value] || STRATEGIES['2D Pocket'];

        let d = 0, z = 1, toolMat = 'HM', toolType = 'ENDMILL (SLET)';
        
        if (toggleManual && toggleManual.checked) {
            d = parseFloat(document.getElementById('manual-d')?.value) || 0;
            z = parseFloat(document.getElementById('manual-z')?.value) || 1;
            toolMat = document.getElementById('manual-mat')?.value || 'HM';
            toolType = document.getElementById('manual-type')?.value || 'ENDMILL (SLET)';
            if (toolSelect) toolSelect.disabled = true;
            manualInputs.classList.remove('hidden');
        } else {
            d = parseFloat(document.getElementById('hidden-d')?.value) || 0;
            z = parseFloat(document.getElementById('hidden-z')?.value) || 1;
            toolMat = document.getElementById('hidden-mat')?.value || 'HM';
            toolType = document.getElementById('hidden-type')?.value || 'ENDMILL (SLET)';
            if (toolSelect) toolSelect.disabled = false;
            manualInputs.classList.add('hidden');
        }

        const ae = parseFloat(document.getElementById('input-ae')?.value) || 0;
        const ap = parseFloat(document.getElementById('input-ap')?.value) || 0;
        const stickout = parseFloat(document.getElementById('input-stickout')?.value) || 25;

        if (d <= 0) { 
            ['out-rpm', 'out-vf', 'out-fz', 'out-vf-plunge', 'out-load'].forEach(id => document.getElementById(id).textContent = "0");
            return; 
        }

        // 2. DYNAMIC OPTIMAL LOAD (AE) RECOMMENDATION [cite: 2026-03-11]
        const geo = MACHINING_DB.GEOMETRY_FACTORS[toolType.toUpperCase()] || { vc_mod: 1.0, fz_mod: 1.0, ae_mod: 1.0 };
        let rec_ae = d * (mat.ae_ref || 0.1) * geo.ae_mod;
        
        // Deflection Check: Reducer anbefalet AE hvis værktøjet har stort udhæng [cite: 2026-03-11]
        const E = (MACHINING_DB.PHYSICS[`E_MODULUS_${toolMat.toUpperCase().replace('-', '')}`] || 210) * 1000;
        const I = (Math.PI * Math.pow(d, 4)) / 64;
        const stiffness_factor = (3 * E * I) / Math.pow(stickout, 3);
        if (stiffness_factor < 1000) rec_ae *= 0.7; // 30% straf for manglende stivhed
        
        document.getElementById('rec-ae').textContent = rec_ae.toFixed(2);

        // 3. SPEED & FEED SIMULATION
        const hardnessFactor = Math.sqrt(150 / mat.hb);
        const matKey = `vc_${toolMat.toLowerCase().replace('-', '')}`;
        let base_vc = mat[matKey] || mat.vc_hss;

        if (base_vc === 0) { document.getElementById('out-rpm').textContent = "ERR"; return; }

        let vc_calc = base_vc * hardnessFactor * geo.vc_mod;
        let fz_calc = d * (mat.fz_ref || 0.002) * (strategy.fz_mult || 1.0) * (geo.fz_mod || 1.0);

        if (document.getElementById('toggle-hsm')?.checked) vc_calc *= strategy.vc_mult;
        if (document.getElementById('toggle-safe')?.checked) { vc_calc *= 0.7; fz_calc *= 0.7; }
        if (document.getElementById('toggle-finish')?.checked) { vc_calc *= 1.25; fz_calc *= 0.5; }

        // 4. PHYSICAL LIMITS (Chip Thinning & Deflection)
        let thinning_mult = (ae > 0 && ae < (d * 0.5)) ? Math.min(d / (2 * Math.sqrt(d * ae - Math.pow(ae, 2))), 3.0) : 1.0;
        let true_fz = fz_calc * thinning_mult;

        const force_total = (mat.kc1 * Math.pow(true_fz, 1 - mat.mc) * ap * ae) / d;
        const deflection = (force_total * Math.pow(stickout, 3)) / (3 * E * I);
        let deflection_penalty = deflection > 0.02 ? 0.02 / deflection : 1.0;
        if (deflection_penalty < 1.0) { vc_calc *= Math.sqrt(deflection_penalty); true_fz *= deflection_penalty; }

        // 5. RENDERING
        let n = Math.min((vc_calc * 1000) / (Math.PI * d), machine.maxRpm);
        const vf = n * z * true_fz;
        
        document.getElementById('out-rpm').textContent = Math.round(n).toLocaleString('da-DK');
        document.getElementById('out-vc').textContent = Math.round((n * Math.PI * d) / 1000).toLocaleString('da-DK');
        document.getElementById('out-vf').textContent = Math.round(vf).toLocaleString('da-DK');
        document.getElementById('out-fz').textContent = true_fz.toFixed(4);
        document.getElementById('out-vf-plunge').textContent = Math.round(n * (fz_calc * 0.5)).toLocaleString('da-DK');
        document.getElementById('out-deflection').textContent = deflection_penalty.toFixed(2) + 'x';
        document.getElementById('out-load').textContent = Math.round((((ae * ap * vf) / 1000 * mat.kc1) / 60000 / (machine.kw || 5.6)) * 100) || 0;
    }

    // Navigation & Event Listeners [cite: 2026-03-11]
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
    
    triggers.forEach(id => {
        const el = typeof id === 'string' ? document.getElementById(id) : id;
        el?.addEventListener('change', calculate);
    });

    ['manual-d', 'manual-z', 'input-ae', 'input-ap', 'input-stickout'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculate);
    });

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