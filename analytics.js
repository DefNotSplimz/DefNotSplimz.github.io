/**
 * Machining_OS | Machine Health Logic
 * Version: 5.1 (TIR Database, Coolant Health Engine & Persistent Checklists)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    // TIR Modul
    const machineSelect = document.getElementById('machine-select');
    const runoutForm = document.getElementById('runout-form');
    const runoutTableBody = document.getElementById('runout-table-body');
    const tir0Input = document.getElementById('tir-0');
    const tir180Input = document.getElementById('tir-180');
    const btnSaveTir = document.getElementById('btn-save-tir');

    // Coolant Modul
    const coolantBrix = document.getElementById('coolant-brix');
    const coolantPh = document.getElementById('coolant-ph');
    const coolantResultBox = document.getElementById('coolant-result');
    const coolantStatus = document.getElementById('coolant-status');
    const coolantAction = document.getElementById('coolant-action');

    // Vedligehold Checklists
    const chkOil = document.getElementById('chk-oil');
    const chkSkim = document.getElementById('chk-skim');
    const chkGeo = document.getElementById('chk-geo');

    // --- INITIALISERING ---
    function initAnalytics() {
        // Udfyld maskiner fra global DB
        machineSelect.innerHTML = Object.entries(MACHINING_DB.MACHINES)
            .map(([k, m]) => `<option value="${k}" class="bg-zinc-900">${m.name}</option>`).join('');

        // Gendan states fra localStorage
        const state = MachiningOS.getState();
        
        if (state['machine-select']) machineSelect.value = state['machine-select'];
        if (state['coolant-brix']) coolantBrix.value = state['coolant-brix'];
        if (state['coolant-ph']) coolantPh.value = state['coolant-ph'];
        
        if (state['chk-oil'] !== undefined) chkOil.checked = state['chk-oil'];
        if (state['chk-skim'] !== undefined) chkSkim.checked = state['chk-skim'];
        if (state['chk-geo'] !== undefined) chkGeo.checked = state['chk-geo'];

        renderTirLogs();
        calcCoolantHealth();
    }

    // --- SPINDEL RUNOUT (T.I.R.) LOGIK ---
    runoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const m0 = parseFloat(tir0Input.value) || 0;
        const m180 = parseFloat(tir180Input.value) || 0;
        
        // Total Indicator Reading (T.I.R) er differencen mellem max og min
        const tirValue = Math.abs(m0 - m180);

        const entry = {
            date: new Date().toLocaleDateString('da-DK', { day: '2-digit', month: 'short', year: 'numeric' }),
            tir: tirValue,
            mKey: machineSelect.value,
            status: tirValue <= 5 ? 'INDEN FOR SPEC' : 'SERVICE KRÆVES'
        };

        // Gem i persistent log via shared_core
        MachiningOS.saveLogEntry('machine_tir', entry);
        
        // Nulstil input og visuel bekræftelse
        tir0Input.value = '';
        tir180Input.value = '';
        
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

        // Vis de nyeste målinger først
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

    // Global slet-funktion til knappen i tabellen
    window.deleteTirLog = (id) => {
        MachiningOS.deleteLogEntry('machine_tir', id);
        renderTirLogs();
    };

    // --- COOLANT HEALTH ENGINE (NY) ---
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

        let isWarning = false;
        let isCritical = false;
        let messages = [];

        // Evaluering af Koncentration (Brix)
        if (brix < 6.0) {
            isCritical = true;
            messages.push("Kritisk lav koncentration! Høj risiko for maskinrust og værktøjsbrud. Tilsæt ren emulsion straks.");
        } else if (brix >= 6.0 && brix < 7.5) {
            isWarning = true;
            messages.push("Lav koncentration. Risiko for korrosion. Tilsæt emulsion.");
        } else if (brix > 11.0) {
            isWarning = true;
            messages.push("Høj koncentration. Økonomisk spild og risiko for skumning. Tilsæt vand.");
        }

        // Evaluering af pH (Bakterier / Kemi)
        if (ph < 8.0) {
            isCritical = true;
            messages.push("Kritisk lav pH! Sur tilstand indikerer bakterievækst og nedbrydning. Risiko for hudirritation. Skift tank eller tilsæt biocid.");
        } else if (ph >= 8.0 && ph < 8.5) {
            isWarning = true;
            messages.push("Faldende pH. Bakterier kan være under udvikling. Hold øje.");
        } else if (ph > 9.5) {
            isWarning = true;
            messages.push("Høj pH / For alkalisk. Risiko for dermatitis (Hudirritation) og misfarvning af aluminium.");
        }

        // Output Formattering
        if (isCritical) {
            coolantStatus.textContent = "SYSTEM_FAILURE";
            coolantStatus.className = "text-2xl font-black italic tracking-tighter text-red-500 uppercase";
            coolantResultBox.className = "p-6 border border-red-500/30 bg-red-500/5 text-center transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
        } else if (isWarning) {
            coolantStatus.textContent = "WARNING_DETECTED";
            coolantStatus.className = "text-2xl font-black italic tracking-tighter text-primary uppercase";
            coolantResultBox.className = "p-6 border border-primary/30 bg-primary/5 text-center transition-all duration-300";
        } else {
            coolantStatus.textContent = "SYSTEM_OPTIMAL";
            coolantStatus.className = "text-2xl font-black italic tracking-tighter text-emerald-500 uppercase";
            coolantResultBox.className = "p-6 border border-emerald-500/30 bg-emerald-500/5 text-center transition-all duration-300";
            messages.push("Kølemiddel er inden for ISO-specifikationer for spåntagning.");
        }

        coolantAction.innerHTML = messages.join("<br>");
    }

    // --- EVENT LISTENERS ---
    machineSelect.addEventListener('change', () => {
        MachiningOS.saveState({ 'machine-select': machineSelect.value });
        renderTirLogs();
    });

    [coolantBrix, coolantPh].forEach(el => {
        el.addEventListener('input', () => {
            calcCoolantHealth();
            MachiningOS.saveState({
                'coolant-brix': coolantBrix.value,
                'coolant-ph': coolantPh.value
            });
        });
    });

    [chkOil, chkSkim, chkGeo].forEach(el => {
        el.addEventListener('change', () => {
            MachiningOS.saveState({
                [el.id]: el.checked
            });
        });
    });

    initAnalytics();
});