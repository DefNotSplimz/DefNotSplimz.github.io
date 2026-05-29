/**
 * Machining_OS | Analytics & Dynamics Logic
 * Version: 5.8 (CAM MRR Engine + Health Telemetry Merge)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ELEMENT REFERENCER: CAM DYNAMICS
    // ==========================================
    const camMat = document.getElementById('cam-mat');
    const inputD = document.getElementById('cam-d');
    const inputZ = document.getElementById('cam-z');
    const inputVc = document.getElementById('cam-vc');
    const inputAe = document.getElementById('cam-ae');
    const inputAp = document.getElementById('cam-ap');
    const inputFz = document.getElementById('cam-fz');
    
    const txtAePct = document.getElementById('ae-pct-text');
    const txtApRatio = document.getElementById('ap-ratio-text');
    const rctAlert = document.getElementById('chip-thinning-alert');
    const outFzAdj = document.getElementById('cam-fz-adj');

    const outRpm = document.getElementById('out-rpm');
    const outFeed = document.getElementById('out-feed');
    const outMrr = document.getElementById('out-mrr');
    const outPower = document.getElementById('out-power');
    const powerWrapper = document.getElementById('power-wrapper');

    // ==========================================
    // ELEMENT REFERENCER: MACHINE HEALTH
    // ==========================================
    const machineSelect = document.getElementById('machine-select');
    const runoutForm = document.getElementById('runout-form');
    const runoutTableBody = document.getElementById('runout-table-body');
    const tir0Input = document.getElementById('tir-0');
    const tir180Input = document.getElementById('tir-180');
    const btnSaveTir = document.getElementById('btn-save-tir');

    const coolantBrix = document.getElementById('coolant-brix');
    const coolantPh = document.getElementById('coolant-ph');
    const coolantResultBox = document.getElementById('coolant-result');
    const coolantStatus = document.getElementById('coolant-status');
    const coolantAction = document.getElementById('coolant-action');

    const chkOil = document.getElementById('chk-oil');
    const chkSkim = document.getElementById('chk-skim');
    const chkGeo = document.getElementById('chk-geo');

    // ==========================================
    // INITIALISERING (BEGGE SYSTEMER)
    // ==========================================
    function initAnalytics() {
        // Populer DB Selectors
        if (typeof MACHINING_DB !== 'undefined') {
            if (camMat) {
                camMat.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
                    .map(([k, v]) => `<option value="${k}" class="bg-zinc-900">${v.name}</option>`).join('');
                camMat.value = 'STAAL'; // Default
            }
            if (machineSelect) {
                machineSelect.innerHTML = Object.entries(MACHINING_DB.MACHINES)
                    .map(([k, m]) => `<option value="${k}" class="bg-zinc-900">${m.name}</option>`).join('');
            }
        }

        // Hent Globalt State
        const state = MachiningOS.getState();
        
        // CAM State
        if (state.cam_d) inputD.value = state.cam_d;
        if (state.cam_z) inputZ.value = state.cam_z;
        if (state.cam_ae) inputAe.value = state.cam_ae;
        if (state.cam_ap) inputAp.value = state.cam_ap;
        
        // Health State
        if (state['machine-select']) machineSelect.value = state['machine-select'];
        if (state['coolant-brix']) coolantBrix.value = state['coolant-brix'];
        if (state['coolant-ph']) coolantPh.value = state['coolant-ph'];
        if (state['chk-oil'] !== undefined) chkOil.checked = state['chk-oil'];
        if (state['chk-skim'] !== undefined) chkSkim.checked = state['chk-skim'];
        if (state['chk-geo'] !== undefined) chkGeo.checked = state['chk-geo'];

        // Kør opstarts-beregninger
        loadMaterialDefaults(false); 
        calculateDynamics();
        renderTirLogs();
        calcCoolantHealth();
    }

    // ==========================================
    // LOGIK: CAM DYNAMICS ENGINE
    // ==========================================
    function loadMaterialDefaults(overwriteUser = true) {
        const mat = MACHINING_DB.MATERIALS[camMat.value];
        if (mat && overwriteUser) {
            inputVc.value = mat.vc_hm;
            inputFz.value = mat.fz_ref;
            calculateDynamics();
        }
    }

    function calculateDynamics() {
        const D = parseFloat(inputD.value) || 10;
        const Z = parseInt(inputZ.value) || 4;
        const Vc = parseFloat(inputVc.value) || 100;
        let Ae = parseFloat(inputAe.value) || 1;
        const Ap = parseFloat(inputAp.value) || 10;
        const Fz = parseFloat(inputFz.value) || 0.05;
        const mat = MACHINING_DB.MATERIALS[camMat.value];

        if (D <= 0 || Z <= 0 || Ae <= 0 || Ap <= 0 || !mat) {
            resetOutputs();
            return;
        }

        if (Ae > D) Ae = D; // Fysik-begrænsning

        txtAePct.textContent = `${((Ae / D) * 100).toFixed(1)}% Stepover`;
        txtApRatio.textContent = `${(Ap / D).toFixed(1)}xD Dybde`;

        // 1. Spindle Speed (RPM)
        const N = (Vc * 1000) / (Math.PI * D);

        // 2. Radial Chip Thinning (RCT)
        let Fz_actual = Fz;
        if (Ae < (D / 2)) {
            const rct_factor = D / (2 * Math.sqrt(Ae * (D - Ae)));
            Fz_actual = Fz * rct_factor;
            
            outFzAdj.textContent = Fz_actual.toFixed(3);
            rctAlert.classList.remove('hidden');
        } else {
            rctAlert.classList.add('hidden');
        }

        // 3. Feedrate (Vf) i mm/min
        const Vf = N * Z * Fz_actual;

        // 4. Material Removal Rate (Q) i cm³/min
        const Q = (Ap * Ae * Vf) / 1000;

        // 5. Net Spindle Power (Pc) i kW vha. Specifik Skærekraft (Kc)
        let hm = Fz;
        if (Ae < D) {
            hm = Fz_actual * Math.sqrt(Ae / D);
        }

        const kc = mat.kc1 * Math.pow(hm, -mat.mc);
        const Pc = (Ap * Ae * Vf * kc) / 60000000;

        // Opdater DOM
        outRpm.textContent = Math.round(N);
        outFeed.textContent = Math.round(Vf);
        outMrr.textContent = Q.toFixed(1);
        outPower.textContent = Pc.toFixed(2);

        if (Pc > 5.5) {
            powerWrapper.classList.remove('text-white');
            powerWrapper.classList.add('text-red-500', 'drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]');
        } else {
            powerWrapper.classList.add('text-white');
            powerWrapper.classList.remove('text-red-500', 'drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]');
        }

        MachiningOS.saveState({ 'cam_d': D, 'cam_z': Z, 'cam_ae': Ae, 'cam_ap': Ap });
    }

    function resetOutputs() {
        outRpm.textContent = "0";
        outFeed.textContent = "0";
        outMrr.textContent = "0.0";
        outPower.textContent = "0.00";
    }

    // ==========================================
    // LOGIK: MACHINE HEALTH (T.I.R. & COOLANT)
    // ==========================================
    runoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const m0 = parseFloat(tir0Input.value) || 0;
        const m180 = parseFloat(tir180Input.value) || 0;
        const tirValue = Math.abs(m0 - m180);

        const entry = {
            date: new Date().toLocaleDateString('da-DK', { day: '2-digit', month: 'short', year: 'numeric' }),
            tir: tirValue,
            mKey: machineSelect.value,
            status: tirValue <= 5 ? 'INDEN FOR SPEC' : 'SERVICE KRÆVES'
        };

        MachiningOS.saveLogEntry('machine_tir', entry);
        
        tir0Input.value = ''; tir180Input.value = '';
        const origText = btnSaveTir.innerHTML;
        btnSaveTir.innerHTML = '<span class="text-emerald-500 animate-pulse">LOGGET_I_DB</span>';
        setTimeout(() => btnSaveTir.innerHTML = origText, 1500);

        renderTirLogs();
    });

    function renderTirLogs() {
        const logs = MachiningOS.getLogs('machine_tir').filter(l => l.mKey === machineSelect.value);
        
        if (logs.length === 0) {
            runoutTableBody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-zinc-600 italic uppercase font-mono text-[10px]">Ingen måledata fundet for denne maskine.</td></tr>`;
            return;
        }

        runoutTableBody.innerHTML = logs.reverse().map((l) => `
            <tr class="border-b border-zinc-900/50 hover:bg-white/5 transition-colors group">
                <td class="p-3 text-zinc-500 font-bold">${l.date}</td>
                <td class="p-3 text-white font-black">${l.tir.toFixed(3)} µm</td>
                <td class="p-3 text-zinc-400">Spindel-næse</td>
                <td class="p-3">
                    <span class="text-[9px] font-black italic uppercase ${l.tir <= 5 ? 'text-primary' : 'text-red-500'}">
                        ${l.status}
                    </span>
                </td>
                <td class="p-3 text-right">
                    <button onclick="deleteTirLog(${l.id})" class="label-micro !text-zinc-800 hover:!text-red-500 transition-all !before:hidden uppercase font-black italic cursor-pointer">Wipe</button>
                </td>
            </tr>`).join('');
    }

    window.deleteTirLog = (id) => {
        MachiningOS.deleteLogEntry('machine_tir', id);
        renderTirLogs();
    };

    function calcCoolantHealth() {
        const brix = parseFloat(coolantBrix.value);
        const ph = parseFloat(coolantPh.value);

        if (isNaN(brix) || isNaN(ph)) {
            coolantStatus.textContent = "AVENTER_DATA";
            coolantStatus.className = "text-2xl font-black italic tracking-tighter text-zinc-600 uppercase";
            coolantAction.textContent = "Indtast aflæsninger for at køre diagnostik.";
            coolantResultBox.className = "p-6 border border-zinc-800 bg-zinc-900/20 text-center transition-all duration-300";
            return;
        }

        let isWarning = false, isCritical = false;
        let messages = [];

        if (brix < 6.0) { isCritical = true; messages.push("Kritisk lav koncentration! Høj risiko for rust."); } 
        else if (brix < 7.5) { isWarning = true; messages.push("Lav koncentration. Risiko for korrosion."); } 
        else if (brix > 11.0) { isWarning = true; messages.push("Høj koncentration. Risiko for skumning."); }

        if (ph < 8.0) { isCritical = true; messages.push("Kritisk lav pH! Bakterievækst detekteret."); } 
        else if (ph < 8.5) { isWarning = true; messages.push("Faldende pH. Hold øje med væsken."); } 
        else if (ph > 9.5) { isWarning = true; messages.push("Høj pH. Risiko for dermatitis (Hudirritation)."); }

        if (isCritical) {
            coolantStatus.textContent = "SYSTEM_FAILURE";
            coolantStatus.className = "text-2xl font-black italic tracking-tighter text-red-500 uppercase";
            coolantResultBox.className = "p-6 border border-red-500/30 bg-red-500/5 text-center transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]";
        } else if (isWarning) {
            coolantStatus.textContent = "WARNING_DETECTED";
            coolantStatus.className = "text-2xl font-black italic tracking-tighter text-primary uppercase";
            coolantResultBox.className = "p-6 border border-primary/30 bg-primary/5 text-center transition-all";
        } else {
            coolantStatus.textContent = "SYSTEM_OPTIMAL";
            coolantStatus.className = "text-2xl font-black italic tracking-tighter text-emerald-500 uppercase";
            coolantResultBox.className = "p-6 border border-emerald-500/30 bg-emerald-500/5 text-center transition-all";
            messages.push("Kølemiddel er inden for ISO-specifikationer for spåntagning.");
        }
        coolantAction.innerHTML = messages.join("<br>");
    }

    // ==========================================
    // EVENT LISTENERS BINDING
    // ==========================================
    [camMat, inputD, inputZ, inputVc, inputAe, inputAp, inputFz].forEach(el => {
        if(el) {
            el.addEventListener('input', calculateDynamics);
            if(el.tagName === 'SELECT') el.addEventListener('change', loadMaterialDefaults);
        }
    });

    if(machineSelect) {
        machineSelect.addEventListener('change', () => {
            MachiningOS.saveState({ 'machine-select': machineSelect.value });
            renderTirLogs();
        });
    }

    [coolantBrix, coolantPh].forEach(el => {
        if(el) {
            el.addEventListener('input', () => {
                calcCoolantHealth();
                MachiningOS.saveState({ 'coolant-brix': coolantBrix.value, 'coolant-ph': coolantPh.value });
            });
        }
    });

    [chkOil, chkSkim, chkGeo].forEach(el => {
        if(el) el.addEventListener('change', () => MachiningOS.saveState({ [el.id]: el.checked }));
    });

    // Boot
    initAnalytics();
});