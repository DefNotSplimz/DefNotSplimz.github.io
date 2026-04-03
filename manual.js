document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const machineRadios = document.querySelectorAll('input[name="machine"]');
    const opTypeSelect = document.getElementById('op-type');
    const workMaterialSelect = document.getElementById('work-material');
    const toolMatSelect = document.getElementById('tool-mat');
    
    const inputDia = document.getElementById('input-dia');
    const inputZ = document.getElementById('input-z');
    const labelDia = document.getElementById('label-dia');
    const colDia = document.getElementById('col-dia');
    const colZ = document.getElementById('col-z-flutes');
    
    const outVcRange = document.getElementById('out-vc-range');
    const outFzRange = document.getElementById('out-fz-range');
    const labelFzRange = document.getElementById('label-fz-range');
    const outFzUnit = document.getElementById('out-fz-unit');

    const modSpecial = document.getElementById('module-special');
    const specialTitle = document.getElementById('special-title');
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

    // --- MASKIN LIMITS ---
    const MACHINE_LIMITS = {
        'deckel': 2500,
        'weiler': 2200,
        'drill': 3000
    };

    // --- NY DATA MATRIX (Sikre Intervaller) ---
    // Indeholder alle 7 materialer fra din HTML
    const CUTTING_DATA_MATRIX = {
        'HM': {
            'ALU': { vc: [150, 300], fz: [0.05, 0.15] },
            'MESSING': { vc: [80, 150], fz: [0.04, 0.12] },
            'STAAL': { vc: [70, 130], fz: [0.05, 0.12] },
            'RUSTFAST': { vc: [40, 70], fz: [0.03, 0.08] },
            'VAERKTOJSSTAAL': { vc: [30, 60], fz: [0.02, 0.06] },
            'DELRIN': { vc: [150, 250], fz: [0.10, 0.25] },
            'NYLON': { vc: [100, 200], fz: [0.08, 0.20] }
        },
        'HSS': { 
            'ALU': { vc: [40, 80], fz: [0.03, 0.10] },
            'MESSING': { vc: [30, 50], fz: [0.03, 0.08] },
            'STAAL': { vc: [18, 28], fz: [0.02, 0.08] },
            'RUSTFAST': { vc: [8, 14], fz: [0.01, 0.04] },
            'VAERKTOJSSTAAL': { vc: [6, 12], fz: [0.01, 0.03] },
            'DELRIN': { vc: [60, 100], fz: [0.05, 0.15] },
            'NYLON': { vc: [40, 80], fz: [0.04, 0.12] }
        }
    };

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

    function populateOperations() {
        const machine = getActiveMachine();
        opTypeSelect.innerHTML = '';
        if (machine === 'deckel') {
            opTypeSelect.innerHTML = `<option value="mill_face">Planfræsning</option><option value="mill_std">Spor/Kant Fræsning</option><option value="drill">Boring</option><option value="tap">Gevindboring</option>`;
            toolMatSelect.value = 'HSS';
        } else if (machine === 'weiler') {
            opTypeSelect.innerHTML = `<option value="turn_rough">Skrub Drejning</option><option value="turn_finish">Slet Drejning (Ra)</option><option value="knurl">Rulletering</option><option value="drill">Centrumsboring</option><option value="tap">Gevindboring</option>`;
            toolMatSelect.value = 'HM';
        } else {
            opTypeSelect.innerHTML = `<option value="drill">Standard Boring</option><option value="tap">Gevindboring</option>`;
            toolMatSelect.value = 'HSS';
        }
        handleOperationChange();
    }

    function handleOperationChange() {
        const op = opTypeSelect.value;
        const machine = getActiveMachine();
        
        modSpecial.classList.add('hidden');
        modThread.classList.add('hidden'); modKnurl.classList.add('hidden'); modRa.classList.add('hidden');
        outputSpecial.classList.add('hidden'); outputStandard.classList.remove('hidden');
        colZ.style.display = (machine === 'deckel') ? 'flex' : 'none';

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

        // Labels opdateres efter maskine
        if (machine === 'deckel') {
            labelDia.textContent = 'Fræser Dia (D)'; labelFzRange.textContent = '// Anbefalet fz (mm/z)';
            outFzUnit.textContent = 'MM/Z'; outVfUnit.textContent = 'MM/MIN'; labelOutFeed.textContent = '// Bord-Tilspænding';
        } else {
            labelDia.textContent = 'Værktøj/Emne Dia'; labelFzRange.textContent = '// Anbefalet fn (mm/rev)';
            outFzUnit.textContent = 'MM/REV'; outVfUnit.textContent = 'MM/REV'; labelOutFeed.textContent = '// Manuel Tilspænding';
        }
        calculate();
    }

    function populateThreads() {
        const std = threadStandard.value;
        threadSize.innerHTML = '';
        for (const [key, val] of Object.entries(THREAD_DATA[std])) {
            threadSize.innerHTML += `<option value="${val}" data-name="${key}">${key}</option>`;
        }
        calculate();
    }

    // --- BEREGNER KERNE ---
    function calculate() {
        const machine = getActiveMachine();
        const op = opTypeSelect.value;
        const mat = workMaterialSelect.value;
        const tool = toolMatSelect.value;
        const d = parseFloat(inputDia.value) || 1;
        const z = parseFloat(inputZ.value) || 1;

        if (op === 'tap') {
            const drill = parseFloat(threadSize.value).toFixed(1);
            outSpecialVal.textContent = drill;
            infoSpecialDesc.textContent = "Forboring til " + threadSize.options[threadSize.selectedIndex].text;
            currentData = { machine: machine.toUpperCase(), opStr: "TAP", geomStr: "Ø"+drill, rpm: "Lav", feed: "Manuel", note: "Brug olie" };
            return;
        }

        if (op === 'knurl') {
            const dia = parseFloat(knurlDia.value) || 0;
            const p = parseFloat(knurlPitch.value);
            const blank = (dia - (p/3)).toFixed(2);
            outSpecialVal.textContent = blank;
            infoSpecialDesc.textContent = "Drej emnet til dette mål før rulletering";
            currentData = { machine: "WEILER", opStr: "KNURL", geomStr: "Ø"+blank, rpm: "Lav", feed: "Manuel", note: "Massivt tryk" };
            return;
        }

        // Hent data fra matrix
        const data = CUTTING_DATA_MATRIX[tool][mat];
        let [vcMin, vcMax] = data.vc;
        let [fzMin, fzMax] = data.fz;

        // Justeringer for boring
        if (op.includes('drill')) { vcMin *= 0.7; vcMax *= 0.7; }

        // Vis intervaller
        outVcRange.textContent = `${vcMin} - ${vcMax}`;
        outFzRange.textContent = `${fzMin} - ${fzMax}`;

        // Beregn Target (Gennemsnit)
        const vcAvg = (vcMin + vcMax) / 2;
        const fzAvg = (fzMin + fzMax) / 2;
        
        let n = (vcAvg * 1000) / (Math.PI * d);
        const maxRpm = MACHINE_LIMITS[machine];
        if (n > maxRpm) { n = maxRpm; warningRpm.classList.remove('hidden'); } 
        else { warningRpm.classList.add('hidden'); }

        outRpm.textContent = Math.round(n);
        
        if (machine === 'deckel') {
            const vf = n * z * fzAvg;
            outVf.textContent = Math.round(vf);
            currentData = { machine: "DECKEL", opStr: op + "/" + mat, geomStr: "Ø"+d, rpm: Math.round(n), feed: Math.round(vf) + " mm/min", note: "-" };
        } else {
            outVf.textContent = fzAvg.toFixed(3);
            currentData = { machine: "WEILER", opStr: op + "/" + mat, geomStr: "Ø"+d, rpm: Math.round(n), feed: fzAvg.toFixed(3) + " mm/rev", note: "-" };
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
    [workMaterialSelect, toolMatSelect, inputDia, inputZ].forEach(el => el.addEventListener('input', calculate));
    [threadStandard, threadSize, knurlDia, knurlPitch, raTarget, raRadius].forEach(el => el.addEventListener('input', calculate));
    [isoDia, isoClass].forEach(el => el.addEventListener('input', calculateIso));

    btnSave.addEventListener('click', () => {
        const row = document.createElement('tr');
        row.className = "border-b border-zinc-800 text-xs font-mono text-zinc-400";
        row.innerHTML = `<td class="p-4 text-white font-bold">${currentData.machine}</td><td class="p-4">${currentData.opStr}</td><td class="p-4">${currentData.geomStr}</td><td class="p-4 text-primary">${currentData.rpm}</td><td class="p-4">${currentData.feed}</td><td class="p-4 text-primary">${currentData.note}</td><td class="p-4 text-right print:hidden"><button class="text-zinc-600 hover:text-red-500 font-bold" onclick="this.parentElement.parentElement.remove()">SLET</button></td>`;
        tableBody.appendChild(row);
    });

    if(btnClear) btnClear.addEventListener('click', () => tableBody.innerHTML = '');
    if(btnPrint) btnPrint.addEventListener('click', () => window.print());

    populateOperations();
});