/**
 * Machining_OS | Machine Health Logic
 * Version: 5.0 (Precision Diagnostics)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const machineSelect = document.getElementById('machine-select');
    const runoutForm = document.getElementById('runout-form');
    const runoutTableBody = document.getElementById('runout-table-body');
    const tir0Input = document.getElementById('tir-0');
    const tir180Input = document.getElementById('tir-180');

    // --- INITIALISERING ---
    function initAnalytics() {
        // Udfyld maskiner fra global DB
        machineSelect.innerHTML = Object.entries(MACHINING_DB.MACHINES)
            .map(([k, m]) => `<option value="${k}">${m.name}</option>`).join('');

        // Synkroniser med global state
        const state = MachiningOS.getState();
        if (state['machine-select']) {
            machineSelect.value = state['machine-select'];
        }

        renderTirLogs();
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
        
        // Nulstil og opdater
        tir0Input.value = '';
        tir180Input.value = '';
        renderTirLogs();
    });

    function renderTirLogs() {
        const logs = MachiningOS.getLogs('machine_tir').filter(l => l.mKey === machineSelect.value);
        
        if (logs.length === 0) {
            runoutTableBody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-zinc-600 italic uppercase font-mono text-[10px]">Ingen måledata fundet for denne maskine.</td></tr>`;
            return;
        }

        // Vis de nyeste målinger først
        runoutTableBody.innerHTML = logs.reverse().map((l, index) => `
            <tr class="border-b border-zinc-900 hover:bg-white/5 transition-colors">
                <td class="p-3 text-zinc-500">${l.date}</td>
                <td class="p-3 text-red-500 font-black">${l.tir.toFixed(1)} µm</td>
                <td class="p-3 text-zinc-400">Spindel-næse (100mm dorn)</td>
                <td class="p-3">
                    <span class="text-[9px] font-black italic uppercase ${l.tir <= 5 ? 'text-primary' : 'text-red-600'}">
                        ${l.status}
                    </span>
                </td>
                <td class="p-3 text-right">
                    <button onclick="deleteTirLog(${l.id})" class="text-zinc-700 hover:text-red-500 font-black">X</button>
                </td>
            </tr>`).join('');
    }

    // Global slet-funktion til knappen i tabellen
    window.deleteTirLog = (id) => {
        MachiningOS.deleteLogEntry('machine_tir', id);
        renderTirLogs();
    };

    // --- EVENT LISTENERS ---
    machineSelect.addEventListener('change', () => {
        MachiningOS.saveState({ 'machine-select': machineSelect.value });
        renderTirLogs();
    });

    initAnalytics();
});