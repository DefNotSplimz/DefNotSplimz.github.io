document.addEventListener('DOMContentLoaded', () => {
    const machineRadios = document.querySelectorAll('input[name="machine"]');
    const opTypeSelect = document.getElementById('op-type');
    const workMaterialSelect = document.getElementById('work-material');
    const toolMatSelect = document.getElementById('tool-mat');
    
    const inputDia = document.getElementById('input-dia');
    const inputZ = document.getElementById('input-z');
    const labelDia = document.getElementById('label-dia');
    const colDia = document.getElementById('col-dia');
    const colZ = document.getElementById('col-z-flutes');
    const standardDataBox = document.getElementById('standard-data-box');
    
    const inputVc = document.getElementById('input-vc');
    const inputFz = document.getElementById('input-fz');
    const labelFz = document.getElementById('label-fz');
    
    const badgeVc = document.getElementById('badge-vc');
    const badgeFz = document.getElementById('badge-fz');
    
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
    const infoRaSuggestion = document.getElementById('info-ra-suggestion');
    const outputStandard = document.getElementById('output-standard');

    const btnSave = document.getElementById('btn-save');
    const btnClear = document.getElementById('btn-clear');
    const btnPrint = document.getElementById('btn-print');
    const tableBody = document.getElementById('setup-table-body');
    const setupSheetContainer = document.getElementById('setup-sheet-container');

    let currentData = {};

    const MACHINE_LIMITS = {
        'deckel': 2000,
        'weiler': 2400,
        'drill': 3000
    };

    const manualCuttingDataMatrix = {
        'HM': {
            'ALU': { vc: 150, fz_base: 0.10 },
            'MESSING': { vc: 100, fz_base: 0.08 },
            'STAAL': { vc: 80, fz_base: 0.08 },
            'RUSTFAST': { vc: 50, fz_base: 0.05 },
            'VAERKTOJSSTAAL': { vc: 40, fz_base: 0.04 },
            'DELRIN': { vc: 200, fz_base: 0.15 },
            'NYLON': { vc: 150, fz_base: 0.12 }
        },
        'HSS': { 
            'ALU': { vc: 60, fz_base: 0.08 },
            'MESSING': { vc: 40, fz_base: 0.06 },
            'STAAL': { vc: 22, fz_base: 0.05 },
            'RUSTFAST': { vc: 12, fz_base: 0.03 },
            'VAERKTOJSSTAAL': { vc: 10, fz_base: 0.02 },
            'DELRIN': { vc: 80, fz_base: 0.12 },
            'NYLON': { vc: 50, fz_base: 0.10 }
        }
    };

    const THREAD_DATA = {
        'M': {
            'M3 x 0.5': 2.5, 'M4 x 0.7': 3.3, 'M5 x 0.8': 4.2, 'M6 x 1.0': 5.0, 
            'M8 x 1.25': 6.8, 'M10 x 1.5': 8.5, 'M12 x 1.75': 10.2, 'M16 x 2.0': 14.0, 'M20 x 2.5': 17.5
        },
        'MF': {
            'M6 x 0.75': 5.2, 'M8 x 1.0': 7.0, 'M10 x 1.0': 9.0, 'M10 x 1.25': 8.8, 
            'M12 x 1.25': 10.8, 'M12 x 1.5': 10.5, 'M16 x 1.5': 14.5
        },
        'G': {
            'G 1/8"': 8.8, 'G 1/4"': 11.8, 'G 3/8"': 15.25, 'G 1/2"': 19.0, 
            'G 3/4"': 24.5, 'G 1"': 30.25
        },
        'UNC': {
            '1/4" - 20': 5.1, '5/16" - 18': 6.6, '3/8" - 16': 8.0, '1/2" - 13': 10.8
        },
        'UNF': {
            '1/4" - 28': 5.5, '5/16" - 24': 6.9, '3/8" - 24': 8.5, '1/2" - 20': 11.5
        }
    };

    const ISO_RANGES = [
        { max: 6, H7: "+12 / 0", h6: "0 / -8", f7: "-10 / -22", g6: "-4 / -12", m6: "+12 / +4" },
        { max: 10, H7: "+15 / 0", h6: "0 / -9", f7: "-13 / -28", g6: "-5 / -14", m6: "+15 / +6" },
        { max: 18, H7: "+18 / 0", h6: "0 / -11", f7: "-16 / -34", g6: "-6 / -17", m6: "+18 / +7" },
        { max: 30, H7: "+21 / 0", h6: "0 / -13", f7: "-20 / -41", g6: "-7 / -20", m6: "+21 / +8" },
        { max: 50, H7: "+25 / 0", h6: "0 / -16", f7: "-25 / -50", g6: "-9 / -25", m6: "+25 / +9" },
        { max: 80, H7: "+30 / 0", h6: "0 / -19", f7: "-30 / -60", g6: "-10 / -29", m6: "+30 / +11" }
    ];

    const todayStr = new Date().toISOString().split('T')[0];
    setupSheetContainer.setAttribute('data-date', todayStr);

    function getActiveMachine() {
        return document.querySelector('input[name="machine"]:checked').value;
    }

    function populateOperations() {
        const machine = getActiveMachine();
        opTypeSelect.innerHTML = '';
        
        if (machine === 'deckel') {
            opTypeSelect.innerHTML = `
                <option value="mill_std">Standard Fræsning</option>
                <option value="drill">Boring (Bor)</option>
                <option value="ream">Rivalføring (Reaming)</option>
                <option value="tap">Gevindskæring (Tap)</option>
            `;
            toolMatSelect.value = 'HSS';
        } else if (machine === 'weiler') {
            opTypeSelect.innerHTML = `
                <option value="turn_rough">Skrub Drejning</option>
                <option value="turn_finish">Slet Drejning (Ra Mål)</option>
                <option value="part">Afstikning (Parting)</option>
                <option value="thread_ext">Udvendig Gevind (Slæde)</option>
                <option value="knurl">Rulletering (Knurling)</option>
                <option value="drill">Boring (Centrum)</option>
                <option value="tap">Gevind (Indvendig Tap)</option>
            `;
            toolMatSelect.value = 'HM';
        } else if (machine === 'drill') {
            opTypeSelect.innerHTML = `
                <option value="drill">Standard Boring</option>
                <option value="ream">Rivalføring (Reaming)</option>
                <option value="tap">Gevindskæring (Tap)</option>
            `;
            toolMatSelect.value = 'HSS';
        }
        handleOperationChange();
    }

    function populateThreads() {
        const standard = threadStandard.value;
        const sizes = THREAD_DATA[standard];
        threadSize.innerHTML = '';
        for (const [key, val] of Object.entries(sizes)) {
            threadSize.innerHTML += `<option value="${val}" data-name="${key}">${key}</option>`;
        }
        calculate();
    }

    function handleOperationChange() {
        const op = opTypeSelect.value;
        const machine = getActiveMachine();

        modSpecial.classList.add('hidden');
        modThread.classList.add('hidden');
        modKnurl.classList.add('hidden');
        modRa.classList.add('hidden');
        standardDataBox.classList.remove('hidden');
        outputSpecial.classList.add('hidden');
        outputStandard.classList.remove('hidden');
        infoRaSuggestion.classList.add('hidden');
        colZ.style.display = 'flex';
        colDia.style.display = 'flex';

        if (op === 'drill' || op === 'tap' || op === 'ream') {
            toolMatSelect.value = 'HSS';
            toolMatSelect.disabled = true;
            toolMatSelect.classList.add('opacity-50');
        } else {
            toolMatSelect.disabled = false;
            toolMatSelect.classList.remove('opacity-50');
        }

        if (machine === 'deckel' && op === 'mill_std') {
            labelDia.textContent = 'Fræser Dia (D)';
            labelFz.textContent = 'fz (mm/tand)';
            outVfUnit.textContent = 'MM/MIN';
            labelOutFeed.textContent = '// Bord-Tilspænding';
        } else if (machine === 'drill' || op === 'drill' || op === 'ream') {
            labelDia.textContent = 'Bor Dia (D)';
            labelFz.textContent = 'fn (mm/omdr)';
            colZ.style.display = 'none';
            outVfUnit.textContent = 'MM/OMDR';
            labelOutFeed.textContent = '// Fremføring';
        } else if (machine === 'weiler') {
            labelDia.textContent = 'Emne Dia (D)';
            labelFz.textContent = 'fn (mm/omdr)';
            colZ.style.display = 'none';
            outVfUnit.textContent = 'MM/OMDR';
            labelOutFeed.textContent = '// Slæde-Tilspænding';
        }

        if (op === 'tap') {
            modSpecial.classList.remove('hidden');
            modThread.classList.remove('hidden');
            specialTitle.textContent = '// Gevindskæring (Indvendig)';
            standardDataBox.classList.add('hidden'); 
            outputStandard.classList.add('hidden');
            outputSpecial.classList.remove('hidden');
            labelSpecialOut.textContent = '// Bor-Størrelse';
            infoSpecialDesc.textContent = "Forboring til valgt gevind";
            colDia.style.display = 'none'; 
            populateThreads();
        } else if (op === 'knurl') {
            modSpecial.classList.remove('hidden');
            modKnurl.classList.remove('hidden');
            specialTitle.textContent = '// Rulletering (Forming)';
            standardDataBox.classList.add('hidden');
            outputStandard.classList.add('hidden');
            outputSpecial.classList.remove('hidden');
            labelSpecialOut.textContent = '// Start Dia (Blank)';
            infoSpecialDesc.textContent = "Drej emnet til dette mål før rulletering";
            colDia.style.display = 'none';
        } else if (op === 'turn_finish') {
            modSpecial.classList.remove('hidden');
            modRa.classList.remove('hidden');
            specialTitle.textContent = '// Overfladekrav (Ra)';
            infoRaSuggestion.classList.remove('hidden');
            inputFz.disabled = true;
            inputFz.classList.add('opacity-50');
        } else {
            inputFz.disabled = false;
            inputFz.classList.remove('opacity-50');
        }

        autoFillCuttingData();
    }

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

    function autoFillCuttingData() {
        const op = opTypeSelect.value;
        const toolMat = toolMatSelect.value;
        const workMat = workMaterialSelect.value;
        let d = parseFloat(inputDia.value) || 0;

        if (op === 'tap' || op === 'knurl') {
            calculate();
            return;
        }

        if (toolMat && workMat && manualCuttingDataMatrix[toolMat] && manualCuttingDataMatrix[toolMat][workMat]) {
            const data = manualCuttingDataMatrix[toolMat][workMat];
            let baseVc = data.vc;
            let baseFz = data.fz_base;

            if (op === 'drill') {
                baseVc = baseVc * 0.8; 
                baseFz = d > 10 ? 0.15 : (d > 5 ? 0.10 : 0.05); 
            } else if (op === 'ream') {
                baseVc = baseVc * 0.5; 
                baseFz = baseFz * 2.0; 
            } else if (op === 'part') {
                baseVc = baseVc * 0.5; 
                baseFz = 0.05; 
            } else if (op === 'thread_ext') {
                baseVc = 10; 
                baseFz = 1.0; 
            }

            inputVc.value = Math.round(baseVc);
            setBadgeStatus('badge-vc', 'AUTO');
            
            if (op !== 'turn_finish') {
                inputFz.value = Math.round(baseFz * 1000) / 1000;
                setBadgeStatus('badge-fz', 'AUTO');
            }
            
        } else {
            if(badgeVc) badgeVc.classList.add('hidden');
            if(badgeFz) badgeFz.classList.add('hidden');
        }
        calculate();
    }

    function calculateIso() {
        const d = parseFloat(isoDia.value);
        const cls = isoClass.value;
        
        if (!d || d <= 0) {
            isoResult.textContent = "- / -";
            return;
        }

        let match = ISO_RANGES.find(r => d <= r.max);
        if (!match && d > 80) match = ISO_RANGES[ISO_RANGES.length - 1]; 
        
        if (match && match[cls]) {
            isoResult.textContent = match[cls] + " µm";
            isoResult.className = "font-mono text-sm font-bold text-primary";
        } else {
            isoResult.textContent = "N/A";
            isoResult.className = "font-mono text-sm font-bold text-red-500";
        }
    }

    function calculate() {
        const machine = getActiveMachine();
        const op = opTypeSelect.value;
        
        if (op === 'tap') {
            const drillSize = parseFloat(threadSize.value).toFixed(1);
            outSpecialVal.textContent = drillSize;
            
            const selOpt = threadSize.options[threadSize.selectedIndex];
            currentData = {
                id: Date.now().toString(),
                machine: machine.toUpperCase(),
                opStr: `TAP (${selOpt.getAttribute('data-name')})`,
                geomStr: `-`,
                rpm: 'Føling',
                feed: `Bor: Ø${drillSize}`,
                note: `Husk skæreolie`,
                warning: false
            };
            return;
        }

        if (op === 'knurl') {
            const d = parseFloat(knurlDia.value) || 0;
            const pitch = parseFloat(knurlPitch.value) || 0;
            const blankDia = (d - (pitch / 3)).toFixed(2);
            outSpecialVal.textContent = blankDia;

            currentData = {
                id: Date.now().toString(),
                machine: 'DREJEBÆNK',
                opStr: `RULLETERING`,
                geomStr: `Pitch: ${pitch}mm`,
                rpm: 'Lav RPM',
                feed: `Start Ø: ${blankDia}`,
                note: `Brug massivt tryk & olie`,
                warning: false
            };
            return;
        }

        const vc = parseFloat(inputVc.value) || 0;
        let fz = parseFloat(inputFz.value) || 0;
        const d = parseFloat(inputDia.value) || 0;
        const z = parseFloat(inputZ.value) || 1;

        if (d === 0) {
            outRpm.textContent = "0";
            outVf.textContent = "0";
            warningRpm.classList.add('hidden');
            return;
        }

        if (op === 'turn_finish') {
            const ra = parseFloat(raTarget.value);
            const re = parseFloat(raRadius.value);
            fz = Math.sqrt((ra * 8 * re) / 1000);
            inputFz.value = fz.toFixed(3);
            setBadgeStatus('badge-fz', 'AUTO');
        }

        let n_theoretical = (vc * 1000) / (Math.PI * d);
        let max_rpm = MACHINE_LIMITS[machine];
        let n_actual = Math.min(n_theoretical, max_rpm);
        let limitEnforced = n_theoretical > max_rpm;

        if (limitEnforced) {
            warningRpm.classList.remove('hidden');
        } else {
            warningRpm.classList.add('hidden');
        }
        
        let vf = 0;
        let feedStr = "";
        let opName = opTypeSelect.options[opTypeSelect.selectedIndex].text;
        let note = "";

        if (machine === 'deckel' && op === 'mill_std') {
            vf = n_actual * z * fz;
            outVf.textContent = Math.round(vf).toLocaleString('da-DK');
            feedStr = `${Math.round(vf)} mm/min`;
        } else {
            vf = fz; 
            outVf.textContent = vf.toFixed(3);
            feedStr = `${vf.toFixed(3)} mm/rev`;
            
            if (op === 'turn_finish') note = `Krav: Ra ${raTarget.value}`;
        }

        outRpm.textContent = Math.round(n_actual).toLocaleString('da-DK');

        currentData = {
            id: Date.now().toString(),
            machine: machine === 'deckel' ? 'FRÆSER' : (machine === 'weiler' ? 'DREJEBÆNK' : 'BOREMASKINE'),
            opStr: `${opName} / ${workMaterialSelect.value || '?' }`,
            geomStr: `Ø${d}`,
            rpm: Math.round(n_actual),
            feed: feedStr,
            note: note || "-",
            warning: limitEnforced
        };
    }

    function saveOperation() {
        let setups = JSON.parse(localStorage.getItem('datum_manual_log')) || [];
        setups.push(currentData);
        localStorage.setItem('datum_manual_log', JSON.stringify(setups));
        renderTable();
    }

    function removeOperation(id) {
        let setups = JSON.parse(localStorage.getItem('datum_manual_log')) || [];
        setups = setups.filter(op => op.id !== id);
        localStorage.setItem('datum_manual_log', JSON.stringify(setups));
        renderTable();
    }

    function renderTable() {
        if (!tableBody) return;
        let setups = JSON.parse(localStorage.getItem('datum_manual_log')) || [];
        tableBody.innerHTML = '';

        if (setups.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-zinc-600 font-mono text-[10px] uppercase italic">// Ingen_Data_Fundet</td></tr>`;
            return;
        }

        setups.forEach(row => {
            const tr = document.createElement('tr');
            tr.className = "border-b border-zinc-800 text-xs font-mono text-zinc-400 bg-[#09090b] hover:bg-zinc-900 transition-colors";
            
            const warningDisplay = row.warning ? `text-primary font-bold print:text-black` : `text-white print:text-black`;
            const noteDisplay = row.note !== "-" ? `<span class="text-primary font-bold print:text-black">${row.note}</span>` : `<span class="text-zinc-600">-</span>`;

            tr.innerHTML = `
                <td class="p-4 font-bold text-white print:text-black">${row.machine}</td>
                <td class="p-4">${row.opStr}</td>
                <td class="p-4">${row.geomStr}</td>
                <td class="p-4"><span class="${warningDisplay}">${row.rpm}</span></td>
                <td class="p-4"><span class="${warningDisplay}">${row.feed}</span></td>
                <td class="p-4">${noteDisplay}</td>
                <td class="p-4 text-right print:hidden">
                    <button class="delete-btn text-[10px] text-zinc-600 hover:text-red-500 uppercase tracking-widest font-bold cursor-pointer transition-colors" data-id="${row.id}">Slet</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                removeOperation(e.target.getAttribute('data-id'));
            });
        });
    }

    machineRadios.forEach(radio => radio.addEventListener('change', populateOperations));
    opTypeSelect.addEventListener('change', handleOperationChange);
    
    workMaterialSelect.addEventListener('change', autoFillCuttingData);
    toolMatSelect.addEventListener('change', autoFillCuttingData);
    
    threadStandard.addEventListener('change', populateThreads);
    threadSize.addEventListener('change', calculate);
    knurlDia.addEventListener('input', calculate);
    knurlPitch.addEventListener('change', calculate);
    raTarget.addEventListener('change', calculate);
    raRadius.addEventListener('change', calculate);

    isoDia.addEventListener('input', calculateIso);
    isoClass.addEventListener('change', calculateIso);

    if(btnPrint) btnPrint.addEventListener('click', () => window.print());

    inputs.forEach(input => input.addEventListener('input', (e) => {
        if (e.target.id === 'input-vc') setBadgeStatus('badge-vc', 'OVERRIDE');
        if (e.target.id === 'input-fz') setBadgeStatus('badge-fz', 'OVERRIDE');
        if (e.target.id === 'input-dia') autoFillCuttingData();
        calculate();
    }));
    
    if(btnSave) {
        btnSave.addEventListener('click', (e) => {
            e.preventDefault();
            saveOperation();
        });
    }

    if(btnClear) {
        btnClear.addEventListener('click', () => {
            if(confirm("Er du sikker på, du vil slette loggen?")) {
                localStorage.removeItem('datum_manual_log');
                renderTable();
            }
        });
    }

    populateOperations();
    renderTable();
});