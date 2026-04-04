document.addEventListener('DOMContentLoaded', () => {
    // --- MACHINE LIBRARY ---
    const MACHINE_LIBRARY = {
        'DECKEL': { name: 'Manuel Fræs (Deckel)', maxRpm: 2500, type: 'mill' },
        'WEILER_MATADOR': { name: 'Manual Drej (Weiler Matador)', maxRpm: 3550, type: 'turn' }
    };

    // --- MATERIAL DATA ---
    const MATERIAL_DATA = {
        'ALU': { name: 'Aluminium', vc: [40, 80], fz: [0.03, 0.10], vc_hm_factor: 3.5 },
        'MESSING': { name: 'Messing', vc: [30, 50], fz: [0.03, 0.08], vc_hm_factor: 3.0 },
        'STAAL': { name: 'Stål', vc: [18, 28], fz: [0.02, 0.08], vc_hm_factor: 3.0 },
        'RUSTFAST': { name: 'Rustfast stål', vc: [8, 14], fz: [0.01, 0.04], vc_hm_factor: 2.5 },
        'VAERKTOJSSTAAL': { name: 'Værktøjsstål', vc: [6, 12], fz: [0.01, 0.03], vc_hm_factor: 2.5 },
        'POM': { name: 'POM (Acetal)', vc: [60, 100], fz: [0.05, 0.15], vc_hm_factor: 3.0 },
        'NYLON': { name: 'Nylon (PA6)', vc: [40, 80], fz: [0.04, 0.12], vc_hm_factor: 3.0 }
    };

    // --- ELEMENT REFERENCER ---
    const machineRadios = document.querySelectorAll('input[name="machine"]');
    const opTypeSelect = document.getElementById('op-type');
    const workMaterialSelect = document.getElementById('work-material');
    const toolMatSelect = document.getElementById('tool-mat');
    const inputDia = document.getElementById('input-dia');
    const inputZ = document.getElementById('input-z');
    const labelDia = document.getElementById('label-dia');
    const colZ = document.getElementById('col-z-flutes');

    const outVcRange = document.getElementById('out-vc-range');
    const outFzRange = document.getElementById('out-fz-range');
    const outFzUnit = document.getElementById('out-fz-unit');
    const labelFzOut = document.getElementById('label-fz-out');

    const modSpecial = document.getElementById('module-special');
    const modThread = document.getElementById('mod-thread');
    const threadStandard = document.getElementById('thread-standard');
    const threadSize = document.getElementById('thread-size');
    const modKnurl = document.getElementById('mod-knurl');
    const knurlDia = document.getElementById('knurl-dia');
    const knurlPitch = document.getElementById('knurl-pitch');
    const modRa = document.getElementById('mod-ra');
    const raTarget = document.getElementById('ra-target');
    const raRadius = document.getElementById('ra-radius');

    const isoDia = document.getElementById('iso-dia');
    const isoClass = document.getElementById('iso-class');
    const isoResult = document.getElementById('iso-result');

    const outRpm = document.getElementById('out-rpm');
    const outVf = document.getElementById('out-vf');
    const outVfUnit = document.getElementById('out-vf-unit');
    const labelOutFeed = document.getElementById('label-out-feed');
    const warningRpm = document.getElementById('warning-rpm');
    const rpmBar = document.getElementById('rpm-bar');
    const rpmPctText = document.getElementById('rpm-pct');

    const outputSpecial = document.getElementById('output-special');
    const labelSpecialOut = document.getElementById('label-special-out');
    const outSpecialVal = document.getElementById('out-special-val');
    const infoSpecialDesc = document.getElementById('info-special-desc');
    const outputStandard = document.getElementById('output-standard');

    const btnSave = document.getElementById('btn-save');
    const btnClear = document.getElementById('btn-clear');
    const btnPrint = document.getElementById('btn-print');
    const tableBody = document.getElementById('setup-table-body');

    let currentData = {};

    const THREAD_DATA = {
        'M': { 'M3 x 0.5': 2.5, 'M4 x 0.7': 3.3, 'M5 x 0.8': 4.2, 'M6 x 1.0': 5.0, 'M8 x 1.25': 6.8, 'M10 x 1.5': 8.5, 'M12 x 1.75': 10.2, 'M16 x 2.0': 14.0 },
        'MF': { 'M8 x 1.0': 7.0, 'M10 x 1.0': 9.0, 'M12 x 1.5': 10.5 },
        'G': { 'G 1/8"': 8.8, 'G 1/4"': 11.8, 'G 1/2"': 19.0 },
        'UNC': { '1/4"-20': 5.1, '3/8"-16': 8.0 },
        'UNF': { '1/4"-28': 5.5, '3/8"-24': 8.5 }
    };

    const ISO_RANGES = [
        { max: 10, H7: "+15/0", h6: "0/-9", f7: "-13/-28" },
        { max: 18, H7: "+18/0", h6: "0/-11", f7: "-16/-34" },
        { max: 30, H7: "+21/0", h6: "0/-13", f7: "-20/-41" },
        { max: 50, H7: "+25/0", h6: "0/-16", f7: "-25/-50" }
    ];

    // --- UI HÅNDTERING ---
    function getActiveMachine() { return document.querySelector('input[name="machine"]:checked').value; }

    function init() {
        workMaterialSelect.innerHTML = Object.entries(MATERIAL_DATA).map(([k,v]) => `<option value="${k}">${v.name}</option>`).join('');
        populateOperations();
    }

    function populateOperations() {
        const mKey = getActiveMachine();
        const machine = MACHINE_LIBRARY[mKey];
        opTypeSelect.innerHTML = '';
        
        if (machine.type === 'mill') {
            opTypeSelect.innerHTML = `<option value="mill_std">Fræsning (Spor/Kant)</option><option value="drill">Boring</option><option value="tap">Gevindboring</option>`;
            colZ.style.display = 'flex';
            labelDia.textContent = 'Værktøj Dia (D)';
            labelFzOut.textContent = 'Beregnet fz';
            outFzUnit.textContent = 'MM/Z';
            outVfUnit.textContent = 'MM/MIN';
            labelOutFeed.textContent = '// Bord-Tilspænding';
        } else {
            opTypeSelect.innerHTML = `<option value="turn_std">Drejning</option><option value="turn_finish">Slet Drejning (Ra)</option><option value="knurl">Rulletering</option><option value="drill">Centrumsboring</option><option value="tap">Gevindboring</option>`;
            colZ.style.display = 'none';
            labelDia.textContent = 'Emne Dia (D)';
            labelFzOut.textContent = 'Beregnet fn';
            outFzUnit.textContent = 'MM/REV';
            outVfUnit.textContent = 'MM/REV';
            labelOutFeed.textContent = '// Manuel Tilspænding';
        }
        handleOperationChange();
    }

    function handleOperationChange() {
        const op = opTypeSelect.value;
        modSpecial.classList.add('hidden');
        modThread.classList.add('hidden'); modKnurl.classList.add('hidden'); modRa.classList.add('hidden');
        outputSpecial.classList.add('hidden'); outputStandard.classList.remove('hidden');

        if (op === 'tap') {
            modSpecial.classList.remove('hidden'); modThread.classList.remove('hidden');
            outputStandard.classList.add('hidden'); outputSpecial.classList.remove('hidden');
            labelSpecialOut.textContent = '// Bor-Størrelse';
            populateThreads();
        } else if (op === 'knurl') {
            modSpecial.classList.remove('hidden'); modKnurl.classList.remove('hidden');
            outputStandard.classList.add('hidden'); outputSpecial.classList.remove('hidden');
            labelSpecialOut.textContent = '// Start Dia (Blank)';
        } else if (op === 'turn_finish') {
            modSpecial.classList.remove('hidden'); modRa.classList.remove('hidden');
        }
        calculate();
    }

    function populateThreads() {
        const std = threadStandard.value;
        threadSize.innerHTML = Object.entries(THREAD_DATA[std]).map(([k,v]) => `<option value="${v}">${k}</option>`).join('');
        calculate();
    }

    // --- HUD OPDATERING ---
    function updateVisualHUD(rpm, maxRpm) {
        const pct = Math.min((rpm / maxRpm) * 100, 100);
        rpmBar.style.width = `${pct}%`;
        rpmBar.style.backgroundColor = pct > 90 ? '#ef4444' : (pct > 70 ? '#f59e0b' : '#f59e0b');
        rpmPctText.textContent = `${Math.round(pct)}%`;
    }

    // --- BEREGNER KERNE ---
    function calculate() {
        const mKey = getActiveMachine();
        const machine = MACHINE_LIBRARY[mKey];
        const op = opTypeSelect.value;
        const matKey = workMaterialSelect.value;
        const mat = MATERIAL_DATA[matKey];
        const toolMat = toolMatSelect.value;
        const d = parseFloat(inputDia.value) || 1;
        const z = parseFloat(inputZ.value) || 1;

        if (op === 'tap') {
            const drill = parseFloat(threadSize.value).toFixed(1);
            outSpecialVal.textContent = drill;
            infoSpecialDesc.textContent = "Forboring til " + threadSize.options[threadSize.selectedIndex].text;
            currentData = { machine: mKey, opStr: "TAP", geomStr: "Ø"+drill, rpm: "Lav", feed: "Manuel", note: "Brug olie" };
            return;
        }

        if (op === 'knurl') {
            const blank = (parseFloat(knurlDia.value) - (parseFloat(knurlPitch.value)/3)).toFixed(2);
            outSpecialVal.textContent = blank;
            infoSpecialDesc.textContent = "Drej emnet til dette mål før rulletering";
            currentData = { machine: mKey, opStr: "KNURL", geomStr: "Ø"+blank, rpm: "Lav", feed: "Manuel", note: "Massivt tryk" };
            return;
        }

        // Vc justering
        const hmFactor = toolMat === 'HM' ? mat.vc_hm_factor : 1.0;
        let vcMin = mat.vc[0] * hmFactor;
        let vcMax = mat.vc[1] * hmFactor;
        let [fzMin, fzMax] = mat.fz;

        if (op.includes('drill')) { vcMin *= 0.7; vcMax *= 0.7; }
        if (op === 'turn_finish') { 
            const ra = parseFloat(raTarget.value);
            const re = parseFloat(raRadius.value);
            const fn_calc = Math.sqrt((ra * 8 * re) / 1000);
            fzMin = fn_calc * 0.8; fzMax = fn_calc * 1.2;
        }

        outVcRange.textContent = `${Math.round(vcMin)} - ${Math.round(vcMax)}`;
        outFzRange.textContent = `${fzMin.toFixed(2)} - ${fzMax.toFixed(2)}`;

        const vcAvg = (vcMin + vcMax) / 2;
        const fzAvg = (fzMin + fzMax) / 2;
        
        let n = (vcAvg * 1000) / (Math.PI * d);
        if (n > machine.maxRpm) { n = machine.maxRpm; warningRpm.classList.remove('hidden'); } 
        else { warningRpm.classList.add('hidden'); }

        outRpm.textContent = Math.round(n);
        updateVisualHUD(n, machine.maxRpm);
        
        if (machine.type === 'mill') {
            const vf = n * z * fzAvg;
            outVf.textContent = Math.round(vf);
            currentData = { machine: mKey, opStr: op + "/" + matKey, geomStr: "Ø"+d, rpm: Math.round(n), feed: Math.round(vf) + " mm/min", note: "-" };
        } else {
            outVf.textContent = fzAvg.toFixed(3);
            currentData = { machine: mKey, opStr: op + "/" + matKey, geomStr: "Ø"+d, rpm: Math.round(n), feed: fzAvg.toFixed(3) + " mm/rev", note: "-" };
        }
    }

    function calculateIso() {
        const d = parseFloat(isoDia.value);
        const cls = isoClass.value;
        const match = ISO_RANGES.find(r => d <= r.max);
        isoResult.textContent = match ? match[cls] + " µm" : "N/A";
    }

    // --- EVENT LISTENERS ---
    machineRadios.forEach(r => r.addEventListener('change', populateOperations));
    opTypeSelect.addEventListener('change', handleOperationChange);
    [workMaterialSelect, toolMatSelect, inputDia, inputZ, threadStandard, threadSize, knurlDia, knurlPitch, raTarget, raRadius].forEach(el => el.addEventListener('input', calculate));
    [isoDia, isoClass].forEach(el => el.addEventListener('input', calculateIso));

    btnSave.addEventListener('click', () => {
        const tr = document.createElement('tr');
        tr.className = "border-b border-zinc-800 text-xs font-mono text-zinc-400 bg-black/40";
        tr.innerHTML = `<td class="p-4 font-bold text-white uppercase">${currentData.machine}</td><td class="p-4">${currentData.opStr}</td><td class="p-4">${currentData.geomStr}</td><td class="p-4 text-primary">${currentData.rpm}</td><td class="p-4">${currentData.feed}</td><td class="p-4 text-primary">${currentData.note}</td><td class="p-4 text-right print:hidden"><button onclick="this.parentElement.parentElement.remove()" class="text-zinc-600 hover:text-red-500 font-bold uppercase tracking-widest text-[10px]">SLET</button></td>`;
        tableBody.appendChild(tr);
    });

    btnClear.addEventListener('click', () => tableBody.innerHTML = '');
    btnPrint.addEventListener('click', () => window.print());

    init();
});