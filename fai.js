/**
 * Machining_OS | FAI Logic
 * Version: 5.3 (Full ISO 286 Matrix Integration)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const faiInputForm = document.getElementById('fai-input-form');
    const faiTableBody = document.getElementById('fai-table-body');
    const reportDate = document.getElementById('report-date');
    const finalStatusText = document.getElementById('final-status-text');

    const faiStdSelect = document.getElementById('fai-std');
    const faiNomInput = document.getElementById('fai-nom');
    const faiTolUpInput = document.getElementById('fai-tol-up');
    const faiTolLowInput = document.getElementById('fai-tol-low');
    const faiDescInput = document.getElementById('fai-desc');

    const faiProgram = document.getElementById('fai-program');
    const faiPart = document.getElementById('fai-part');
    const faiRev = document.getElementById('fai-rev');
    const faiMat = document.getElementById('fai-mat');

    let faiEntries = [];

    // --- ISO 286 TOLERANCE DATABASE (19 Standards, op til Ø180mm) ---
    // Format: [Upper (+), Lower (-)] i mm.
    const ISO_DB = [
        { max: 3,
          H6: [0.006, 0], H7: [0.010, 0], H8: [0.014, 0], H9: [0.025, 0], H11: [0.060, 0], F7: [0.016, 0.006], G7: [0.012, 0.002], P7: [-0.006, -0.016],
          h6: [0, -0.006], h7: [0, -0.010], h8: [0, -0.014], h9: [0, -0.025], h11: [0, -0.060], f7: [-0.006, -0.016], g6: [-0.002, -0.008], m6: [0.008, 0.002], p6: [0.012, 0.006],
          js5: [0.002, -0.002], js6: [0.003, -0.003]
        },
        { max: 6,
          H6: [0.008, 0], H7: [0.012, 0], H8: [0.018, 0], H9: [0.030, 0], H11: [0.075, 0], F7: [0.022, 0.010], G7: [0.016, 0.004], P7: [-0.008, -0.020],
          h6: [0, -0.008], h7: [0, -0.012], h8: [0, -0.018], h9: [0, -0.030], h11: [0, -0.075], f7: [-0.010, -0.022], g6: [-0.004, -0.012], m6: [0.012, 0.004], p6: [0.020, 0.012],
          js5: [0.0025, -0.0025], js6: [0.004, -0.004]
        },
        { max: 10,
          H6: [0.009, 0], H7: [0.015, 0], H8: [0.022, 0], H9: [0.036, 0], H11: [0.090, 0], F7: [0.028, 0.013], G7: [0.020, 0.005], P7: [-0.009, -0.024],
          h6: [0, -0.009], h7: [0, -0.015], h8: [0, -0.022], h9: [0, -0.036], h11: [0, -0.090], f7: [-0.013, -0.028], g6: [-0.005, -0.014], m6: [0.015, 0.006], p6: [0.024, 0.015],
          js5: [0.003, -0.003], js6: [0.0045, -0.0045]
        },
        { max: 18,
          H6: [0.011, 0], H7: [0.018, 0], H8: [0.027, 0], H9: [0.043, 0], H11: [0.110, 0], F7: [0.034, 0.016], G7: [0.024, 0.006], P7: [-0.011, -0.029],
          h6: [0, -0.011], h7: [0, -0.018], h8: [0, -0.027], h9: [0, -0.043], h11: [0, -0.110], f7: [-0.016, -0.034], g6: [-0.006, -0.017], m6: [0.018, 0.007], p6: [0.029, 0.018],
          js5: [0.004, -0.004], js6: [0.0055, -0.0055]
        },
        { max: 30,
          H6: [0.013, 0], H7: [0.021, 0], H8: [0.033, 0], H9: [0.052, 0], H11: [0.130, 0], F7: [0.041, 0.020], G7: [0.028, 0.007], P7: [-0.014, -0.035],
          h6: [0, -0.013], h7: [0, -0.021], h8: [0, -0.033], h9: [0, -0.052], h11: [0, -0.130], f7: [-0.020, -0.041], g6: [-0.007, -0.020], m6: [0.021, 0.008], p6: [0.035, 0.022],
          js5: [0.0045, -0.0045], js6: [0.0065, -0.0065]
        },
        { max: 50,
          H6: [0.016, 0], H7: [0.025, 0], H8: [0.039, 0], H9: [0.062, 0], H11: [0.160, 0], F7: [0.050, 0.025], G7: [0.034, 0.009], P7: [-0.017, -0.042],
          h6: [0, -0.016], h7: [0, -0.025], h8: [0, -0.039], h9: [0, -0.062], h11: [0, -0.160], f7: [-0.025, -0.050], g6: [-0.009, -0.025], m6: [0.025, 0.009], p6: [0.042, 0.026],
          js5: [0.0055, -0.0055], js6: [0.008, -0.008]
        },
        { max: 80,
          H6: [0.019, 0], H7: [0.030, 0], H8: [0.046, 0], H9: [0.074, 0], H11: [0.190, 0], F7: [0.060, 0.030], G7: [0.040, 0.010], P7: [-0.020, -0.050],
          h6: [0, -0.019], h7: [0, -0.030], h8: [0, -0.046], h9: [0, -0.074], h11: [0, -0.190], f7: [-0.030, -0.060], g6: [-0.010, -0.029], m6: [0.030, 0.011], p6: [0.051, 0.032],
          js5: [0.0065, -0.0065], js6: [0.0095, -0.0095]
        },
        { max: 120,
          H6: [0.022, 0], H7: [0.035, 0], H8: [0.054, 0], H9: [0.087, 0], H11: [0.220, 0], F7: [0.071, 0.036], G7: [0.047, 0.012], P7: [-0.024, -0.059],
          h6: [0, -0.022], h7: [0, -0.035], h8: [0, -0.054], h9: [0, -0.087], h11: [0, -0.220], f7: [-0.036, -0.071], g6: [-0.012, -0.034], m6: [0.035, 0.013], p6: [0.059, 0.037],
          js5: [0.0075, -0.0075], js6: [0.011, -0.011]
        },
        { max: 180,
          H6: [0.025, 0], H7: [0.040, 0], H8: [0.063, 0], H9: [0.100, 0], H11: [0.250, 0], F7: [0.083, 0.043], G7: [0.054, 0.014], P7: [-0.028, -0.068],
          h6: [0, -0.025], h7: [0, -0.040], h8: [0, -0.063], h9: [0, -0.100], h11: [0, -0.250], f7: [-0.043, -0.083], g6: [-0.014, -0.039], m6: [0.040, 0.015], p6: [0.068, 0.043],
          js5: [0.009, -0.009], js6: [0.0125, -0.0125]
        }
    ];

    // --- INITIALISERING ---
    function initFAI() {
        const state = MachiningOS.getState();
        faiProgram.textContent = state['job-program'] || '--';
        faiPart.textContent = state['job-part'] || '--';
        faiRev.textContent = state['job-rev'] || '--';
        
        if (state['work-material'] && typeof MACHINING_DB !== 'undefined') {
            const mat = MACHINING_DB.MATERIALS[state['work-material']];
            faiMat.textContent = mat ? mat.name : state['work-material'];
        } else {
            faiMat.textContent = '--';
        }

        reportDate.textContent = `Dato: ${new Date().toLocaleDateString('da-DK')}`;
        
        loadSavedFAI();
    }

    // --- AUTO-FILL ISO TOLERANCER ---
    function updateIsoTolerance() {
        const std = faiStdSelect.value;
        const nom = parseFloat(faiNomInput.value);

        if (std === 'manual') {
            faiTolUpInput.readOnly = false;
            faiTolLowInput.readOnly = false;
            faiTolUpInput.classList.remove('bg-zinc-900/50', 'text-zinc-500');
            faiTolLowInput.classList.remove('bg-zinc-900/50', 'text-zinc-500');
            if (faiDescInput.value.startsWith('ISO')) faiDescInput.value = '';
            return;
        }

        // Lås felter
        faiTolUpInput.readOnly = true;
        faiTolLowInput.readOnly = true;
        faiTolUpInput.classList.add('bg-zinc-900/50', 'text-zinc-500');
        faiTolLowInput.classList.add('bg-zinc-900/50', 'text-zinc-500');

        if (!nom) {
            faiTolUpInput.value = '';
            faiTolLowInput.value = '';
            return;
        }

        const match = ISO_DB.find(r => nom <= r.max);
        if (match && match[std]) {
            const [upper, lower] = match[std];
            faiTolUpInput.value = upper;
            faiTolLowInput.value = lower;
            faiDescInput.value = `ISO ${std} Pasning`;
        } else {
            faiTolUpInput.value = 0;
            faiTolLowInput.value = 0;
            alert("PROTOCOL_ERROR: Nominel dimension overstiger 180mm. ISO database udløbet.");
        }
    }

    faiStdSelect.addEventListener('change', updateIsoTolerance);
    faiNomInput.addEventListener('input', updateIsoTolerance);

    // --- FAI INDTASTNING & BEREGNING ---
    faiInputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nom = parseFloat(faiNomInput.value);
        const up = parseFloat(faiTolUpInput.value) || 0;
        const low = parseFloat(faiTolLowInput.value) || 0;
        const act = parseFloat(document.getElementById('fai-act').value);

        if (isNaN(nom) || isNaN(act)) return;

        const dev = act - nom;
        const isOk = (dev <= up) && (dev >= low);

        let driftPct = 0;
        if (dev > 0 && up !== 0) driftPct = (dev / up) * 100;
        else if (dev < 0 && low !== 0) driftPct = (dev / low) * 100;

        const entry = {
            id: Date.now(),
            desc: faiDescInput.value,
            nom: nom,
            up: up,
            low: low,
            act: act,
            dev: dev,
            ok: isOk,
            drift: driftPct
        };

        MachiningOS.saveLogEntry('fai_report', entry);
        document.getElementById('fai-act').value = '';
        renderFaiTable();
    });

    // --- RENDER & OPPDATERING ---
    function renderFaiTable() {
        faiEntries = MachiningOS.getLogs('fai_report');
        let overallOk = true;

        if (faiEntries.length === 0) {
            faiTableBody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-zinc-600 italic font-mono text-[10px] uppercase">Afventer verificering...</td></tr>`;
            finalStatusText.textContent = "Afventer_Data";
            finalStatusText.className = "text-3xl font-black text-zinc-600 italic uppercase";
            return;
        }

        faiTableBody.innerHTML = faiEntries.map((entry, index) => {
            if (!entry.ok) overallOk = false;

            const upStr = (entry.up >= 0 ? '+' : '') + entry.up.toFixed(3);
            const lowStr = (entry.low >= 0 ? '+' : '') + entry.low.toFixed(3);
            const devStr = (entry.dev >= 0 ? '+' : '') + entry.dev.toFixed(4);

            let driftBar = 'bg-emerald-500';
            if (Math.abs(entry.drift) >= 80) driftBar = 'bg-red-500';
            else if (Math.abs(entry.drift) >= 50) driftBar = 'bg-primary';

            const driftWidth = Math.min(Math.abs(entry.drift), 100);

            return `
            <tr class="border-b border-zinc-900/50 hover:bg-white/5 transition-colors group">
                <td class="p-4 text-zinc-500 font-bold text-left">${(index + 1).toString().padStart(2, '0')}</td>
                <td class="p-4 text-white text-left font-bold">${entry.desc}</td>
                <td class="p-4 text-zinc-400 font-black">${entry.nom.toFixed(3)}</td>
                <td class="p-4 text-primary font-bold tracking-widest whitespace-nowrap">
                    <div class="flex flex-col leading-tight"><span class="text-white">${upStr}</span><span class="text-blue-500">${lowStr}</span></div>
                </td>
                <td class="p-4 text-white font-black text-lg">${entry.act.toFixed(4)}</td>
                <td class="p-4">
                    <div class="flex flex-col items-center gap-1 w-24 mx-auto">
                        <span class="${entry.ok ? 'text-zinc-400' : 'text-red-500 font-black'}">${devStr}</span>
                        <div class="w-full h-1 bg-zinc-900 rounded-full overflow-hidden print:hidden">
                            <div class="h-full ${driftBar} transition-all" style="width: ${driftWidth}%; margin-${entry.dev > 0 ? 'left' : 'right'}: auto;"></div>
                        </div>
                    </div>
                </td>
                <td class="p-4">
                    <span class="px-3 py-1 text-[9px] font-black italic uppercase ${entry.ok ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-red-500/10 text-red-500 border border-red-500/30'}">
                        ${entry.ok ? 'PASS' : 'FAIL'}
                    </span>
                </td>
                <td class="p-4 text-right print:hidden">
                    <button onclick="deleteFaiEntry(${entry.id})" class="label-micro !text-zinc-800 hover:!text-red-500 transition-all !before:hidden uppercase font-black italic cursor-pointer">Wipe</button>
                </td>
            </tr>`;
        }).join('');

        if (overallOk) {
            finalStatusText.textContent = "VERIFICERET";
            finalStatusText.className = "text-3xl font-black text-emerald-500 italic uppercase shadow-[0_0_20px_rgba(16,185,129,0.1)]";
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

    const btnClear = document.getElementById('btn-clear');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if(confirm("PROTOCOL_AUDIT: Vil du rydde hele den nuværende FAI-rapport?")) {
                MachiningOS.clearLogs('fai_report');
                renderFaiTable();
            }
        });
    }

    const btnPrint = document.getElementById('btn-print');
    if (btnPrint) {
        btnPrint.addEventListener('click', () => window.print());
    }

    function loadSavedFAI() {
        renderFaiTable();
    }

    initFAI();
});