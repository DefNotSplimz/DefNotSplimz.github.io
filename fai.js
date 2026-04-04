/**
 * Machining_OS | FAI Logic
 * Version: 5.0 (Precision Mechanic FAI)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const faiInputForm = document.getElementById('fai-input-form');
    const faiTableBody = document.getElementById('fai-table-body');
    const reportDate = document.getElementById('report-date');
    const finalStatusText = document.getElementById('final-status-text');

    // Job Info Elementer
    const faiProgram = document.getElementById('fai-program');
    const faiPart = document.getElementById('fai-part');
    const faiRev = document.getElementById('fai-rev');
    const faiMat = document.getElementById('fai-mat');

    let faiEntries = [];

    // --- INITIALISERING ---
    function initFAI() {
        // Hent persistent job info fra global kerne
        const state = MachiningOS.getState();
        faiProgram.textContent = state['job-program'] || '--';
        faiPart.textContent = state['job-part'] || '--';
        faiRev.textContent = state['job-rev'] || '--';
        faiMat.textContent = state['work-material'] || '--'; // Bør konverteres til navn, hvis nødvendigt

        reportDate.textContent = `Dato: ${new Date().toLocaleDateString('da-DK')}`;
        
        loadSavedFAI();
    }

    // --- FAI INDTASTNING & BEREGNING (Mikron Præcision) ---
    faiInputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nom = parseFloat(document.getElementById('fai-nom').value);
        const tol = parseFloat(document.getElementById('fai-tol').value);
        const act = parseFloat(document.getElementById('fai-act').value);

        if (isNaN(nom) || isNaN(tol) || isNaN(act)) return;

        // Formel: Afvigelse = Aktuelt - Nominel
        const dev = act - nom;
        
        // Formel: Status (Tjek om afvigelse er inden for tolerance)
        const isOk = Math.abs(dev) <= tol;

        const entry = {
            id: Date.now(),
            desc: document.getElementById('fai-desc').value,
            nom: nom,
            tol: tol,
            act: act,
            dev: dev,
            ok: isOk
        };

        // Gem i shared_core logs
        MachiningOS.saveLogEntry('fai_report', entry);
        faiInputForm.reset();
        renderFaiTable();
    });

    // --- RENDER & OPPDATERING ---
    function renderFaiTable() {
        faiEntries = MachiningOS.getLogs('fai_report');
        let overallOk = true;

        if (faiEntries.length === 0) {
            faiTableBody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-zinc-600 italic">Afventer verificering...</td></tr>`;
            finalStatusText.textContent = "Afventer_Data";
            finalStatusText.className = "text-3xl font-black text-white italic uppercase";
            return;
        }

        faiTableBody.innerHTML = faiEntries.map((entry, index) => {
            if (!entry.ok) overallOk = false;
            return `
            <tr class="border-b border-zinc-900 hover:bg-white/5 transition-colors">
                <td class="p-4 text-zinc-600 font-bold">${(index + 1).toString().padStart(2, '0')}</td>
                <td class="p-4 text-white text-left font-bold">${entry.desc}</td>
                <td class="p-4 text-zinc-400 font-black">${entry.nom.toFixed(3)}</td>
                <td class="p-4 text-primary font-bold">±${entry.tol.toFixed(3)}</td>
                <td class="p-4 text-white font-black">${entry.act.toFixed(4)}</td>
                <td class="p-4 ${entry.ok ? 'text-zinc-600' : 'text-red-500 font-black'}">${(entry.dev >= 0 ? '+' : '')}${entry.dev.toFixed(4)}</td>
                <td class="p-4">
                    <span class="px-3 py-1 text-[9px] font-black italic uppercase ${entry.ok ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-red-500/10 text-red-500 border border-red-500/30'}">
                        ${entry.ok ? 'PASS' : 'FAIL'}
                    </span>
                </td>
                <td class="p-4 text-right print:hidden"><button onclick="deleteFaiEntry(${entry.id})" class="text-zinc-600 hover:text-red-500 font-black">X</button></td>
            </tr>`;
        }).join('');

        // Opdater samlet status
        if (overallOk) {
            finalStatusText.textContent = "VERIFICERET";
            finalStatusText.className = "text-3xl font-black text-primary italic uppercase shadow-[0_0_20px_rgba(245,158,11,0.1)]";
        } else {
            finalStatusText.textContent = "AFVIST / AFVIGELSE";
            finalStatusText.className = "text-3xl font-black text-red-500 italic uppercase shadow-[0_0_20px_rgba(239,68,68,0.1)]";
        }
    }

    // --- GLOBALE FUNKTIONER ---
    window.deleteFaiEntry = (id) => {
        MachiningOS.deleteLogEntry('fai_report', id);
        renderFaiTable();
    };

    document.getElementById('btn-clear').addEventListener('click', () => {
        if(confirm("Vil du rydde hele FAI-rapporten?")) {
            MachiningOS.clearLogs('fai_report');
            renderFaiTable();
        }
    });

    document.getElementById('btn-print').addEventListener('click', () => window.print());

    function loadSavedFAI() {
        renderFaiTable();
    }

    initFAI();
});