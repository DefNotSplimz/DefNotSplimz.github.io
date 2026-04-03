document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const inputs = document.querySelectorAll('#cnc-form input');
    const radios = document.querySelectorAll('input[name="operation"]');
    const workMaterialSelect = document.getElementById('work-material');
    const camStrategySelect = document.getElementById('cam-strategy');
    const opIntentSelect = document.getElementById('op-intent'); // NY: Skrub/Slet dropdown
    const inputCoolant = document.getElementById('input-coolant');
    const toggleHsm = document.getElementById('toggle-hsm');
    const hsmWrapper = document.getElementById('hsm-wrapper');
    const wrapperEngagement = document.getElementById('wrapper-engagement');
    
    // Job Kontekst Referencer
    const jobInputs = document.querySelectorAll('#job-form input');
    const outJobProgram = document.getElementById('out-job-program');
    const outJobPart = document.getElementById('out-job-part');
    const outJobRev = document.getElementById('out-job-rev');
    const outJobStock = document.getElementById('out-job-stock');
    const outJobFixture = document.getElementById('out-job-fixture');
    const outJobZero = document.getElementById('out-job-zero');

    const btnSaveTool = document.getElementById('btn-save-tool');
    const toolTableBody = document.getElementById('tool-table-body');
    const toolSelect = document.getElementById('active-tool-select');
    
    const btnSave = document.getElementById('btn-save');
    const btnClear = document.getElementById('btn-clear');
    const btnPrint = document.getElementById('btn-print');
    const btnExportJson = document.getElementById('btn-export-json');
    const importJsonInput = document.getElementById('import-json');
    const tableBody = document.getElementById('setup-table-body');
    const setupSheetContainer = document.getElementById('setup-sheet-container');
    const outTotalTime = document.getElementById('out-total-time');
    const printTotalTime = document.getElementById('print-total-time');
    
    const hiddenD = document.getElementById('hidden-d');
    const hiddenZ = document.getElementById('hidden-z');
    const hiddenMat = document.getElementById('hidden-mat');
    const hiddenHolder = document.getElementById('hidden-holder');
    const hiddenStdStickout = document.getElementById('hidden-std-stickout'); 
    
    const inputDia = document.getElementById('input-dia');
    const labelDia = document.getElementById('label-dia');
    const inputVc = document.getElementById('input-vc');
    const inputFz = document.getElementById('input-fz');
    const inputStickout = document.getElementById('input-stickout');
    const inputAe = document.getElementById('input-ae');
    const inputAp = document.getElementById('input-ap');
    const inputQa = document.getElementById('input-qa');
    const inputTime = document.getElementById('input-time');
    const labelFz = document.getElementById('label-fz');
    
    const badgeVc = document.getElementById('badge-vc');
    const badgeFz = document.getElementById('badge-fz');
    const badgeStickout = document.getElementById('badge-stickout');
    
    const outRpm = document.getElementById('out-rpm');
    const outVf = document.getElementById('out-vf');
    const warningRpm = document.getElementById('warning-rpm');
    const warningHsm = document.getElementById('warning-hsm');
    const warningStickout = document.getElementById('warning-stickout');
    const infoRct = document.getElementById('info-rct');

    // --- KONSTANTER & MASTER DATA ---
    const MAX_RPM_MILL = 10000;
    const MAX_RPM_LATHE = 6000;
    const MAX_VF_NO_HSM = 2500;
    
    let currentData = {};

    // Standardværdier optimeret til "Skrub" (Roughing)
    const cuttingDataMatrix = {
        'HM': {
            'ALU': { vc: 400, fz_base: 0.08 },
            'MESSING': { vc: 200, fz_base: 0.06 },
            'STAAL': { vc: 120, fz_base: 0.05 },
            'RUSTFAST': { vc: 80, fz_base: 0.04 },
            'VAERKTOJSSTAAL': { vc: 60, fz_base: 0.03 },
            'DELRIN': { vc: 300, fz_base: 0.10 },
            'NYLON': { vc: 200, fz_base: 0.08 }
        },
        'HSS': {
            'ALU': { vc: 100, fz_base: 0.05 },
            'MESSING': { vc: 60, fz_base: 0.04 },
            'STAAL': { vc: 25, fz_base: 0.03 },
            'RUSTFAST': { vc: 15, fz_base: 0.02 },
            'VAERKTOJSSTAAL': { vc: 12, fz_base: 0.015 },
            'DELRIN': { vc: 100, fz_base: 0.08 },
            'NYLON': { vc: 80, fz_base: 0.06 }
        }
    };

    // Logisk mapning af strategier: Er det standard skrub eller slet?
    const strategyIntentMap = {
        '2D Adaptive Clearing': 'skrub',
        '2D Pocket': 'skrub',
        'Face': 'slet',
        '2D Contour': 'slet',
        'Slot': 'skrub',
        'Trace': 'slet',
        'Thread': 'slet',
        'Bore': 'skrub',
        'Circular': 'slet',
        'Engrave': 'slet',
        '2D Chamfer': 'slet',
        '3D Adaptive Clearing': 'skrub',
        '3D Pocket Clearing': 'skrub',
        'Steep and Shallow': 'slet',
        'Flat': 'slet',
        'Parallel': 'slet',
        'Scallop': 'slet',
        '3D Contour': 'slet',
        'Ramp': 'skrub',
        'Pencil': 'slet',
        'Horizontal': 'slet',
        'Spiral': 'slet',
        'Radial': 'slet',
        'Morphed Spiral': 'slet',
        'Project': 'slet',
        'Blend': 'slet',
        'Morph': 'slet',
        'Corner': 'slet',
        'Flow': 'slet',
        'Deburr': 'slet',
        'Geodesic': 'slet',
        'Turning Face': 'slet',
        'Turning Profile Roughing': 'skrub',
        'Turning Profile Finishing': 'slet',
        'Turning Groove Roughing': 'skrub',
        'Turning Groove Finishing': 'slet',
        'Turning Adaptive Roughing': 'skrub',
        'Turning Groove': 'slet',
        'Turning Single Groove': 'slet',
        'Turning Thread': 'slet',
        'Turning Chamfer': 'slet',
        'Turning Part': 'slet',
        'Turning Trace': 'slet'
    };

    const today = new Date();
    setupSheetContainer.setAttribute('data-date', today.toISOString().split('T')[0]);

    // ==========================================
    // SYSTEM I/O (EKSPORT / IMPORT)
    // ==========================================

    function exportHubData() {
        saveJobContext(); 
        const hubState = {
            version: "1.0",
            timestamp: new Date().toISOString(),
            jobContext: JSON.parse(localStorage.getItem('datum_job_context')) || {},
            toolCrib: JSON.parse(localStorage.getItem('datum_tools')) || [],
            setupSheet: JSON.parse(localStorage.getItem('datum_setups')) || []
        };
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hubState, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `DATUM_HUB_${hubState.jobContext.program || 'EXPORT'}.json`);
        document.body.appendChild(dlAnchorElem);
        dlAnchorElem.click();
        dlAnchorElem.remove();
    }

    function importHubData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const hubState = JSON.parse(e.target.result);
                if(hubState.jobContext && hubState.toolCrib && hubState.setupSheet) {
                    localStorage.setItem('datum_job_context', JSON.stringify(hubState.jobContext));
                    localStorage.setItem('datum_tools', JSON.stringify(hubState.toolCrib));
                    localStorage.setItem('datum_setups', JSON.stringify(hubState.setupSheet));
                    
                    loadJobContext();
                    renderToolCrib();
                    renderTable();
                    alert("System_Data successfully indlæst.");
                } else {
                    alert("Import_Fejl: Korrupt eller ugyldig Datum JSON fil.");
                }
            } catch (err) {
                alert("Import_Fejl: Kunne ikke parse JSON filen.");
            }
        };
        reader.readAsText(file);
        event.target.value = ''; 
    }

    if(btnExportJson) btnExportJson.addEventListener('click', exportHubData);
    if(importJsonInput) importJsonInput.addEventListener('change', importHubData);

    // ==========================================
    // JOB KONTEKST LOGIK
    // ==========================================

    function loadJobContext() {
        const jobData = JSON.parse(localStorage.getItem('datum_job_context')) || {
            program: '', part: '', rev: '01', stock: '', fixture: '', zero: ''
        };
        
        document.getElementById('job-program').value = jobData.program;
        document.getElementById('job-part').value = jobData.part;
        document.getElementById('job-rev').value = jobData.rev;
        document.getElementById('job-stock').value = jobData.stock;
        document.getElementById('job-fixture').value = jobData.fixture;
        document.getElementById('job-zero').value = jobData.zero;

        updatePrintHeader(jobData);
    }

    function saveJobContext() {
        const jobData = {
            program: document.getElementById('job-program').value,
            part: document.getElementById('job-part').value,
            rev: document.getElementById('job-rev').value,
            stock: document.getElementById('job-stock').value,
            fixture: document.getElementById('job-fixture').value,
            zero: document.getElementById('job-zero').value
        };
        localStorage.setItem('datum_job_context', JSON.stringify(jobData));
        updatePrintHeader(jobData);
    }

    function updatePrintHeader(data) {
        if(outJobProgram) outJobProgram.textContent = data.program || '-';
        if(outJobPart) outJobPart.textContent = data.part || '-';
        if(outJobRev) outJobRev.textContent = data.rev || '-';
        if(outJobStock) outJobStock.textContent = data.stock || '-';
        if(outJobFixture) outJobFixture.textContent = data.fixture || '-';
        if(outJobZero) outJobZero.textContent = data.zero || '-';
    }

    // ==========================================
    // UI STATUS LOGIK (Auto vs Override)
    // ==========================================

    function setBadgeStatus(badgeId, status) {
        const badge = document.getElementById(badgeId);
        if (!badge) return;
        badge.classList.remove('hidden');
        if (status === 'AUTO') {
            badge.textContent = 'AUTO';
            badge.className = 'text-[8px] font-mono font-bold tracking-widest uppercase text-primary border border-primary/30 px-1 bg-primary/10';
        } else {
            badge.textContent = 'OVERRIDE';
            badge.className = 'text-[8px] font-mono font-bold tracking-widest uppercase text-zinc-500 border border-zinc-800 px-1 bg-zinc-900';
        }
    }

    // ==========================================
    // CAM STRATEGI LOGIK
    // ==========================================
    
    function updateStrategyDropdown() {
        const op = document.querySelector('input[name="operation"]:checked').value;
        camStrategySelect.innerHTML = '';

        if (op === 'milling') {
            hsmWrapper.style.display = 'flex';
            wrapperEngagement.style.display = 'grid';
            labelDia.textContent = 'Værktøj Dia (D)';
            inputDia.disabled = true;
            inputDia.classList.add('opacity-50');
            inputDia.value = hiddenD.value || 0;
            
            camStrategySelect.innerHTML = `
                <optgroup label="2D Operations">
                    <option value="2D Adaptive Clearing">2D Adaptive Clearing</option>
                    <option value="2D Pocket">2D Pocket</option>
                    <option value="Face">Face</option>
                    <option value="2D Contour">2D Contour</option>
                    <option value="Slot">Slot</option>
                    <option value="Trace">Trace</option>
                    <option value="Thread">Thread</option>
                    <option value="Bore">Bore</option>
                    <option value="Circular">Circular</option>
                    <option value="Engrave">Engrave</option>
                    <option value="2D Chamfer">2D Chamfer</option>
                </optgroup>
                <optgroup label="3D Operations">
                    <option value="3D Adaptive Clearing">3D Adaptive Clearing</option>
                    <option value="3D Pocket Clearing">3D Pocket Clearing</option>
                    <option value="Steep and Shallow">Steep and Shallow</option>
                    <option value="Flat">Flat</option>
                    <option value="Parallel">Parallel</option>
                    <option value="Scallop">Scallop</option>
                    <option value="3D Contour">3D Contour</option>
                    <option value="Ramp">Ramp</option>
                    <option value="Pencil">Pencil</option>
                    <option value="Horizontal">Horizontal</option>
                    <option value="Spiral">Spiral</option>
                    <option value="Radial">Radial</option>
                    <option value="Morphed Spiral">Morphed Spiral</option>
                    <option value="Project">Project</option>
                    <option value="Blend">Blend</option>
                    <option value="Morph">Morph</option>
                    <option value="Corner">Corner</option>
                    <option value="Flow">Flow</option>
                    <option value="Deburr">Deburr</option>
                    <option value="Geodesic">Geodesic</option>
                </optgroup>
            `;
        } else {
            hsmWrapper.style.display = 'none';
            wrapperEngagement.style.display = 'none';
            labelDia.textContent = 'Emne Dia (D)';
            inputDia.disabled = false;
            inputDia.classList.remove('opacity-50');
            if (inputDia.value == 0) inputDia.value = 50; 
            
            camStrategySelect.innerHTML = `
                <optgroup label="Turning Operations">
                    <option value="Turning Face">Turning Face</option>
                    <option value="Turning Profile Roughing">Turning Profile Roughing</option>
                    <option value="Turning Profile Finishing">Turning Profile Finishing</option>
                    <option value="Turning Groove Roughing">Turning Groove Roughing</option>
                    <option value="Turning Groove Finishing">Turning Groove Finishing</option>
                    <option value="Turning Adaptive Roughing">Turning Adaptive Roughing</option>
                    <option value="Turning Groove">Turning Groove</option>
                    <option value="Turning Single Groove">Turning Single Groove</option>
                    <option value="Turning Thread">Turning Thread</option>
                    <option value="Turning Chamfer">Turning Chamfer</option>
                    <option value="Turning Part">Turning Part</option>
                    <option value="Turning Trace">Turning Trace</option>
                </optgroup>
            `;
        }
        
        // Sæt default intent baseret på det første element der vises
        handleStrategyChange();
    }

    function handleStrategyChange() {
        const strategy = camStrategySelect.value;
        if (strategyIntentMap[strategy]) {
            opIntentSelect.value = strategyIntentMap[strategy];
        }
        autoFillCuttingData();
    }

    // ==========================================
    // VÆRKTØJSKRYBBE LOGIK
    // ==========================================

    function saveToolToCrib(e) {
        e.preventDefault();
        const t = document.getElementById('tool-t').value;
        const type = document.getElementById('tool-type').value;
        const holder = document.getElementById('tool-holder').value;
        const mat = document.getElementById('tool-mat').value;
        const d = document.getElementById('tool-d').value;
        const z = document.getElementById('tool-z').value;
        const stickout = document.getElementById('tool-stickout').value;

        if(!t || !d || !z || !stickout) return;

        let tools = JSON.parse(localStorage.getItem('datum_tools')) || [];
        const existingIndex = tools.findIndex(tool => tool.t === t);
        const newTool = { t, type, holder, mat, d, z, stickout };
        
        if(existingIndex >= 0) {
            tools[existingIndex] = newTool;
        } else {
            tools.push(newTool);
        }

        tools.sort((a, b) => parseInt(a.t) - parseInt(b.t));
        localStorage.setItem('datum_tools', JSON.stringify(tools));
        
        renderToolCrib();
        document.getElementById('tool-t').value = parseInt(t) + 1;
    }

    function renderToolCrib() {
        let tools = JSON.parse(localStorage.getItem('datum_tools')) || [];
        
        if(toolTableBody) {
            toolTableBody.innerHTML = '';
            if (tools.length === 0) {
                toolTableBody.innerHTML = `<tr><td colspan="7" class="py-4 text-center text-zinc-600 font-mono text-[10px] uppercase italic">// Krybbe_Tom</td></tr>`;
            }

            tools.forEach(tool => {
                const tr = document.createElement('tr');
                tr.className = "border-b border-zinc-900 text-xs font-mono text-zinc-400";
                tr.innerHTML = `
                    <td class="py-3 font-bold text-white">T${tool.t}</td>
                    <td class="py-3">${tool.type} <span class="text-zinc-600">(${tool.holder})</span></td>
                    <td class="py-3 font-bold ${tool.mat === 'HM' ? 'text-primary' : 'text-zinc-300'}">${tool.mat}</td>
                    <td class="py-3">${tool.d}</td>
                    <td class="py-3">${tool.z}</td>
                    <td class="py-3">${tool.stickout} mm</td>
                    <td class="py-3 text-right">
                        <button class="delete-tool-btn text-[10px] text-zinc-600 hover:text-red-500 uppercase font-bold cursor-pointer transition-colors" data-t="${tool.t}">Slet</button>
                    </td>
                `;
                toolTableBody.appendChild(tr);
            });

            document.querySelectorAll('.delete-tool-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    let tools = JSON.parse(localStorage.getItem('datum_tools')) || [];
                    tools = tools.filter(t => t.t !== e.target.getAttribute('data-t'));
                    localStorage.setItem('datum_tools', JSON.stringify(tools));
                    renderToolCrib();
                });
            });
        }

        if(toolSelect) {
            const currentSelection = toolSelect.value;
            toolSelect.innerHTML = '<option value="">-- Definer --</option>';
            tools.forEach(tool => {
                toolSelect.innerHTML += `<option value="${tool.t}" data-d="${tool.d}" data-z="${tool.z}" data-mat="${tool.mat}" data-holder="${tool.holder}" data-stickout="${tool.stickout}">T${tool.t} - ${tool.type} (${tool.holder}, Ø${tool.d})</option>`;
            });
            if(currentSelection) toolSelect.value = currentSelection;
        }
    }

    // ==========================================
    // AUTO-UDFYLD LOGIK & FASE-KOMPENSATION
    // ==========================================

    function autoFillCuttingData() {
        const op = document.querySelector('input[name="operation"]:checked').value;
        const toolMat = hiddenMat.value;
        const workMat = workMaterialSelect.value;
        const phase = opIntentSelect.value; // 'skrub' eller 'slet'
        const d = parseFloat(hiddenD.value) || 0;

        if (toolMat && workMat && cuttingDataMatrix[toolMat] && cuttingDataMatrix[toolMat][workMat]) {
            const data = cuttingDataMatrix[toolMat][workMat];
            
            // Kompensation for Finishing (Sletning)
            let baseVc = data.vc;
            let baseFz = data.fz_base;

            if (phase === 'slet') {
                baseVc = baseVc * 1.25; // Hæv Vc 25% for overflade
                baseFz = baseFz * 0.50; // Sænk fz 50% for tolerance
            }

            inputVc.value = Math.round(baseVc);
            setBadgeStatus('badge-vc', 'AUTO');
            
            if(op === 'milling' && d > 0) {
                let scaledFz = baseFz * (d / 10);
                inputFz.value = Math.round(scaledFz * 1000) / 1000;
                setBadgeStatus('badge-fz', 'AUTO');
            } else if (op === 'turning') {
                inputFz.value = Math.round(baseFz * 1000) / 1000;
                setBadgeStatus('badge-fz', 'AUTO');
            }
        } else {
            if(badgeVc) badgeVc.classList.add('hidden');
            if(badgeFz) badgeFz.classList.add('hidden');
        }
        calculate();
    }

    // ==========================================
    // BEREGNER LOGIK & RCT
    // ==========================================

    function calculate() {
        const op = document.querySelector('input[name="operation"]:checked').value;
        const hsmActive = toggleHsm.checked;
        const vc = parseFloat(inputVc.value) || 0;
        const fz = parseFloat(inputFz.value) || 0;
        const wcs = document.getElementById('input-wcs').value || "G54";
        const activeStickout = parseFloat(inputStickout.value) || 0;
        const standardStickout = parseFloat(hiddenStdStickout.value) || 0;
        const coolant = inputCoolant ? inputCoolant.value : "Flood (M8)";
        const qa = inputQa ? inputQa.value : "";
        const camTime = parseFloat(inputTime.value) || 0;
        const phase = opIntentSelect.value;
        
        const ae = parseFloat(inputAe.value) || 0;
        const ap = parseFloat(inputAp.value) || 0;

        let strategy = camStrategySelect.value || (op === 'milling' ? 'Fræsning' : 'Drejning');
        
        const d = parseFloat(inputDia.value) || 0;
        const z = parseFloat(hiddenZ.value) || 1;
        const t = toolSelect.value || "?";
        const holderInfo = hiddenHolder.value || "";

        if (d === 0) {
            outRpm.textContent = "0";
            outVf.textContent = "0";
            warningRpm.classList.add('hidden');
            warningHsm.classList.add('hidden');
            warningStickout.classList.add('hidden');
            infoRct.classList.add('hidden');
            return;
        }

        if (activeStickout > standardStickout && standardStickout > 0) {
            warningStickout.classList.remove('hidden');
        } else {
            warningStickout.classList.add('hidden');
        }

        let n_theoretical = (vc * 1000) / (Math.PI * d);
        let max_rpm = op === 'milling' ? MAX_RPM_MILL : MAX_RPM_LATHE;
        let n_actual = Math.min(n_theoretical, max_rpm);
        let limitEnforced = n_theoretical > max_rpm;

        if (limitEnforced) {
            warningRpm.classList.remove('hidden');
        } else {
            warningRpm.classList.add('hidden');
        }
        
        let rct_factor = 1;
        let isRctActive = false;

        if (op === 'milling' && ae > 0 && ae < (d / 2)) {
            rct_factor = d / (2 * Math.sqrt(ae * (d - ae)));
            isRctActive = true;
        }

        if (isRctActive) {
            infoRct.classList.remove('hidden');
        } else {
            infoRct.classList.add('hidden');
        }

        let effective_fz = fz * rct_factor;
        let vf = op === 'milling' ? n_actual * z * effective_fz : n_actual * fz;
        let hsmLimitEnforced = false;

        if (op === 'milling' && !hsmActive && vf > MAX_VF_NO_HSM) {
            vf = MAX_VF_NO_HSM;
            hsmLimitEnforced = true;
            warningHsm.classList.remove('hidden');
        } else {
            warningHsm.classList.add('hidden');
        }

        outRpm.textContent = Math.round(n_actual).toLocaleString('da-DK');
        outVf.textContent = Math.round(vf).toLocaleString('da-DK');

        if(hsmLimitEnforced) {
            strategy = `${strategy} (CAPPED)`;
        }

        // Tilføj fase-label til strategi-strengen hvis det ikke allerede fremgår
        const strategyDisplay = `${strategy} [${phase.toUpperCase()}]`;

        currentData = {
            id: Date.now().toString(),
            strategy: strategyDisplay,
            coolant: coolant,
            qa: qa,
            time: camTime,
            wcs: wcs.toUpperCase(),
            t: `T${t}`,
            holder: holderInfo,
            stickout: activeStickout,
            ap: ap,
            ae: ae,
            rpm: Math.round(n_actual),
            feed: Math.round(vf),
            warning: limitEnforced || hsmLimitEnforced,
            isMilling: op === 'milling'
        };
    }

    // ==========================================
    // SETUP SHEET LOGIK
    // ==========================================

    function saveOperation() {
        if (!toolSelect.value) {
            alert("Fejl: Vælg et værktøj fra krybben før du gemmer.");
            return;
        }
        
        let setups = JSON.parse(localStorage.getItem('datum_setups')) || [];
        setups.push(currentData);
        localStorage.setItem('datum_setups', JSON.stringify(setups));
        renderTable();
        
        inputTime.value = 0;
    }

    function removeOperation(id) {
        let setups = JSON.parse(localStorage.getItem('datum_setups')) || [];
        setups = setups.filter(op => op.id !== id);
        localStorage.setItem('datum_setups', JSON.stringify(setups));
        renderTable();
    }

    function renderTable() {
        if (!tableBody) return;
        let setups = JSON.parse(localStorage.getItem('datum_setups')) || [];
        tableBody.innerHTML = '';
        
        let totalMins = 0;

        if (setups.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-zinc-600 font-mono text-[10px] uppercase italic">// Ingen_Data_Fundet</td></tr>`;
            if(outTotalTime) outTotalTime.textContent = "0.0 Min";
            if(printTotalTime) printTotalTime.textContent = "0.0 Min";
            return;
        }

        setups.forEach(row => {
            totalMins += (row.time || 0);

            const tr = document.createElement('tr');
            tr.className = "border-b border-zinc-800 text-xs font-mono text-zinc-400 bg-[#09090b] hover:bg-zinc-900 transition-colors";
            
            const warningDisplay = row.warning ? `text-primary font-bold print:text-black` : `text-white print:text-black`;
            const engagementDisplay = row.isMilling ? `${row.ap} / ${row.ae}` : `- / -`;
            
            let timeQaStr = "";
            if (row.time > 0) timeQaStr += `${row.time} Min`;
            if (row.qa) timeQaStr += timeQaStr ? `<br><span class="text-primary font-black print:text-black">${row.qa}</span>` : `<span class="text-primary font-black print:text-black">${row.qa}</span>`;
            if (!timeQaStr) timeQaStr = `<span class="text-zinc-600 print:text-black">-</span>`;

            tr.innerHTML = `
                <td class="p-4 uppercase font-bold text-white print:text-black">${row.wcs}</td>
                <td class="p-4 font-bold text-white print:text-black">
                    ${row.t}<br>
                    <span class="text-[9px] font-normal text-zinc-500 print:text-zinc-800">${row.holder || ''} (${row.stickout}mm)</span>
                </td>
                <td class="p-4 ${row.strategy.includes('CAPPED') ? 'text-primary print:text-black' : ''}">${row.strategy}</td>
                <td class="p-4">${row.coolant}</td>
                <td class="p-4 font-bold">${engagementDisplay}</td>
                <td class="p-4"><span class="${warningDisplay}">${row.rpm}</span></td>
                <td class="p-4"><span class="${warningDisplay}">${row.feed}</span></td>
                <td class="p-4">${timeQaStr}</td>
                <td class="p-4 text-right print:hidden">
                    <button class="delete-btn text-[10px] text-zinc-600 hover:text-red-500 uppercase tracking-widest font-bold cursor-pointer transition-colors" data-id="${row.id}">Slet</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        if(outTotalTime) outTotalTime.textContent = `${totalMins.toFixed(1)} Min`;
        if(printTotalTime) printTotalTime.textContent = `${totalMins.toFixed(1)} Min`;

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                removeOperation(e.target.getAttribute('data-id'));
            });
        });
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================

    if(toolSelect) {
        toolSelect.addEventListener('change', (e) => {
            const op = document.querySelector('input[name="operation"]:checked').value;
            const selectedOption = e.target.options[e.target.selectedIndex];
            if(selectedOption.value !== "") {
                hiddenD.value = selectedOption.getAttribute('data-d');
                hiddenZ.value = selectedOption.getAttribute('data-z');
                hiddenMat.value = selectedOption.getAttribute('data-mat');
                hiddenHolder.value = selectedOption.getAttribute('data-holder');
                
                const stdStickout = selectedOption.getAttribute('data-stickout');
                hiddenStdStickout.value = stdStickout;
                inputStickout.value = stdStickout;
                setBadgeStatus('badge-stickout', 'AUTO');

                if (op === 'milling') {
                    inputDia.value = hiddenD.value;
                    inputAe.value = hiddenD.value; 
                }
            } else {
                hiddenD.value = 0;
                hiddenZ.value = 0;
                hiddenMat.value = "";
                hiddenHolder.value = "";
                hiddenStdStickout.value = 0;
                inputStickout.value = "";
                if (op === 'milling') {
                    inputDia.value = 0;
                    inputAe.value = 0;
                }
                if(badgeStickout) badgeStickout.classList.add('hidden');
            }
            autoFillCuttingData();
        });
    }

    if(workMaterialSelect) workMaterialSelect.addEventListener('change', autoFillCuttingData);
    if(camStrategySelect) camStrategySelect.addEventListener('change', handleStrategyChange);
    if(opIntentSelect) opIntentSelect.addEventListener('change', autoFillCuttingData);
    if(inputCoolant) inputCoolant.addEventListener('change', calculate);
    if(toggleHsm) toggleHsm.addEventListener('change', calculate);
    
    if(btnPrint) btnPrint.addEventListener('click', () => {
        saveJobContext();
        window.print();
    });

    jobInputs.forEach(input => input.addEventListener('input', saveJobContext));

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(e.target.value === 'turning') {
                labelFz.textContent = 'Tilspænding / fn (mm/omdr)';
            } else {
                labelFz.textContent = 'Tilspænding / fz (mm/tand)';
            }
            updateStrategyDropdown();
        });
    });

    inputs.forEach(input => input.addEventListener('input', (e) => {
        if (e.target.id === 'input-vc') setBadgeStatus('badge-vc', 'OVERRIDE');
        if (e.target.id === 'input-fz') setBadgeStatus('badge-fz', 'OVERRIDE');
        if (e.target.id === 'input-stickout') setBadgeStatus('badge-stickout', 'OVERRIDE');
        calculate();
    }));
    
    if(btnSaveTool) btnSaveTool.addEventListener('click', saveToolToCrib);
    if(btnSave) {
        btnSave.addEventListener('click', (e) => {
            e.preventDefault();
            saveOperation();
        });
    }

    if(btnClear) {
        btnClear.addEventListener('click', () => {
            if(confirm("Bekræft sletning af samtlige data (Job, Værktøj og Log).")) {
                localStorage.removeItem('datum_setups');
                localStorage.removeItem('datum_tools');
                localStorage.removeItem('datum_job_context');
                loadJobContext();
                renderToolCrib();
                renderTable();
            }
        });
    }

    // Initial opsætning
    loadJobContext();
    renderToolCrib();
    updateStrategyDropdown();
    renderTable();
});