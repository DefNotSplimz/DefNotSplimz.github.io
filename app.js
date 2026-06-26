// ==========================================
// 00. GLOBAL STATE ENGINE
// ==========================================
let currentMode = 'CNC'; 
let currentOp = 'MILL';
let currentTool = 'HM';
let currentTab = 'SKÆREDATA';
let activeMaterial = "Alu 6082-T6";
let activeThread = "M8";

function switchTab(tabName) {
    currentTab = tabName;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if(btn.innerText.toUpperCase().includes(tabName) || (tabName === 'TERMINAL' && btn.innerText.includes('Terminal'))) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    document.getElementById('lbl-tab').innerText = tabName === 'TERMINAL' ? 'Terminal' : (tabName === 'SKÆREDATA' ? 'Skæredata' : (tabName === 'PASNINGER' ? 'Pasninger' : tabName));

    const views = ['view-skaeredata', 'view-gevind', 'view-pasninger', 'view-grid', 'view-terminal'];
    views.forEach(v => {
        const el = document.getElementById(v);
        if(el) { el.classList.add('hidden'); el.classList.remove('flex'); }
    });

    const hardwareToggles = document.getElementById('hardware-toggles');

    if (tabName === 'SKÆREDATA') {
        document.getElementById('view-skaeredata').classList.remove('hidden');
        document.getElementById('view-skaeredata').classList.add('flex');
        hardwareToggles.classList.remove('opacity-30', 'pointer-events-none');
        renderMaterialList();
        renderSkaeredata();
    } 
    else if (tabName === 'GEVIND') {
        document.getElementById('view-gevind').classList.remove('hidden');
        document.getElementById('view-gevind').classList.add('flex');
        hardwareToggles.classList.add('opacity-30', 'pointer-events-none');
        renderThreadList();
        renderThreadData();
    }
    else if (tabName === 'PASNINGER') {
        document.getElementById('view-pasninger').classList.remove('hidden');
        document.getElementById('view-pasninger').classList.add('flex');
        hardwareToggles.classList.add('opacity-30', 'pointer-events-none');
        document.getElementById('iso-nom').focus();
    }
    else if (tabName === 'TERMINAL') {
        document.getElementById('view-terminal').classList.remove('hidden');
        document.getElementById('view-terminal').classList.add('flex');
        hardwareToggles.classList.add('opacity-30', 'pointer-events-none');
        document.getElementById('calc-cmd').focus();
    }
    else {
        document.getElementById('view-grid').classList.remove('hidden');
        document.getElementById('view-grid').classList.add('flex');
        hardwareToggles.classList.add('opacity-30', 'pointer-events-none');
        renderStaticGrid(tabName);
    }
}

function setMode(mode) {
    currentMode = mode;
    document.getElementById('btn-cnc').className = mode === 'CNC' ? "toggle-btn active-cnc px-4 py-1.5" : "toggle-btn inactive px-4 py-1.5";
    document.getElementById('btn-man').className = mode === 'MAN' ? "toggle-btn active-man px-4 py-1.5" : "toggle-btn inactive px-4 py-1.5";
    if(currentTab === 'SKÆREDATA') renderSkaeredata();
}

function setOp(op) {
    currentOp = op;
    document.getElementById('btn-mill').className = op === 'MILL' ? "toggle-btn active-op px-4 py-1.5" : "toggle-btn inactive px-4 py-1.5";
    document.getElementById('btn-lathe').className = op === 'LATHE' ? "toggle-btn active-op px-4 py-1.5" : "toggle-btn inactive px-4 py-1.5";
    document.getElementById('sd-z-container').style.display = op === 'LATHE' ? 'none' : 'flex';
    if(currentTab === 'SKÆREDATA') renderSkaeredata();
}

function setTool(tool) {
    currentTool = tool;
    document.getElementById('btn-hm').className = tool === 'HM' ? "toggle-btn active-op px-4 h-full" : "toggle-btn inactive px-4 h-full";
    document.getElementById('btn-hss').className = tool === 'HSS' ? "toggle-btn active-op px-4 h-full" : "toggle-btn inactive px-4 h-full";
    if(currentTab === 'SKÆREDATA') renderSkaeredata();
}

// ==========================================
// 01. HOTKEYS
// ==========================================
document.addEventListener('keydown', (e) => {
    const cmdInput = document.getElementById('calc-cmd');
    const isoNom = document.getElementById('iso-nom');
    
    // Aktiver terminal
    if (e.key === '/' && currentTab === 'TERMINAL' && document.activeElement !== cmdInput) {
        e.preventDefault();
        cmdInput.focus();
    }
    
    // Escape rydder afhængig af context
    if (e.key === 'Escape') {
        if(currentTab === 'TERMINAL') {
            cmdInput.value = '';
            parseCommand('');
            cmdInput.blur();
        } else if (currentTab === 'PASNINGER') {
            isoNom.value = '';
            document.getElementById('iso-hole').value = '';
            document.getElementById('iso-shaft').value = '';
            calculateISO();
            isoNom.focus();
        }
    }

    // Ctrl+M toggles CNC/MANUAL uanset fanen
    if (e.ctrlKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setMode(currentMode === 'CNC' ? 'MAN' : 'CNC');
    }
});

// ==========================================
// 02. SKÆREDATA ENGINE
// ==========================================
function renderMaterialList() {
    const list = document.getElementById('mat-list');
    list.innerHTML = "";
    Object.keys(cutDB).forEach(matName => {
        const div = document.createElement('div');
        div.className = `list-item ${matName === activeMaterial ? 'active' : ''}`;
        div.innerText = matName;
        div.onclick = () => {
            activeMaterial = matName;
            renderMaterialList();
            renderSkaeredata();
        };
        list.appendChild(div);
    });
}

function renderSkaeredata() {
    const matData = cutDB[activeMaterial];
    if(!matData) return;

    document.getElementById('sd-title').innerText = activeMaterial;
    document.getElementById('sd-note').innerText = matData.note;

    const out = document.getElementById('sd-output');
    out.classList.remove('opacity-100');
    
    setTimeout(() => {
        out.innerHTML = "";
        const data = matData[currentMode][currentOp];
        const d = parseFloat(document.getElementById('sd-dia').value) || 10;
        const z = parseFloat(document.getElementById('sd-z').value) || 4;
        const raKrav = document.getElementById('sd-ra').value;
        const re = parseFloat(document.getElementById('sd-re').value) || 0.4;

        const cards = [
            { title: "Skrub", raw: data.rough, color: "text-blue-400" },
            { title: "Slet", raw: data.fin, color: "text-purple-400" },
            { title: currentOp === 'MILL' ? "Sporfræsning" : "Stik / Spor", raw: currentOp === 'MILL' ? data.slot : data.groove, color: "text-teal-400" },
            { title: "Boring", raw: data.drill, color: "text-amber-400" }
        ];

        cards.forEach(c => {
            let spec = c.raw[currentTool];
            
            if(!spec || spec.vc === 0) {
                out.innerHTML += `
                    <div class="bg-zinc-800/20 border border-zinc-700/50 p-6 rounded-xl flex flex-col justify-center items-center h-full min-h-[220px]">
                        <span class="text-xs font-semibold ${c.color} uppercase tracking-wider mb-2">${c.title}</span>
                        <span class="text-sm font-medium text-zinc-500 uppercase tracking-widest">Ikke Anbefalet</span>
                    </div>
                `;
                return;
            }

            spec = { ...spec };
            let cardTitleExtra = "";

            if (c.title === "Slet" && raKrav !== "std") {
                const ra = parseFloat(raKrav);
                const fCalc = Math.sqrt((ra * 8 * re) / 1000);
                
                if (currentOp === 'MILL') spec.fz = fCalc;
                else spec.f = fCalc;
                
                cardTitleExtra = `<span class="ml-3 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-medium tracking-normal normal-case">Ra ${ra} µm</span>`;
            }

            let rpm = Math.round((spec.vc * 1000) / (Math.PI * d));
            if(currentMode === 'CNC' && rpm > 10000) rpm = 10000;
            if(currentMode === 'MAN' && rpm > 3000) rpm = 3000;

            let feedLabel = "";
            let feedVal = "";
            let feedCalc = "";
            let fzDec = cardTitleExtra !== "" ? 3 : 2;

            if (c.title === "Boring") {
                feedLabel = "Tilsp. pr. omdr (f)";
                feedVal = `${spec.f.toFixed(fzDec)} mm/o`;
                if(currentMode === 'CNC' && currentOp === 'MILL') {
                    const vf = Math.round(spec.f * rpm);
                    feedCalc = `<div class="mt-auto pt-4 border-t border-zinc-800/80 flex justify-between items-end"><span class="text-xs text-zinc-400 font-medium">Z-Tilspænding (Vf)</span><span class="text-lg font-mono font-semibold text-zinc-100">${vf} <span class="text-xs text-zinc-500 font-sans">mm/min</span></span></div>`;
                } else {
                    feedCalc = `<div class="mt-auto pt-4 border-t border-zinc-800/80 flex justify-between items-end"><span class="text-xs text-zinc-400 font-medium">Tilspænding</span><span class="text-xs font-medium text-zinc-500">G99 / Gearkasse</span></div>`;
                }
            } else if (currentOp === 'MILL') {
                feedLabel = "Tilsp. pr. tand (fz)";
                feedVal = `${spec.fz.toFixed(fzDec)} mm`;
                const vf = Math.round(spec.fz * z * rpm);
                feedCalc = `<div class="mt-auto pt-4 border-t border-zinc-800/80 flex justify-between items-end"><span class="text-xs text-zinc-400 font-medium">Bordtilspænding (Vf)</span><span class="text-lg font-mono font-semibold text-zinc-100">${vf} <span class="text-xs text-zinc-500 font-sans">mm/min</span></span></div>`;
            } else {
                feedLabel = "Tilsp. pr. omdr (f)";
                feedVal = `${spec.f.toFixed(fzDec)} mm/o`;
                feedCalc = `<div class="mt-auto pt-4 border-t border-zinc-800/80 flex justify-between items-end"><span class="text-xs text-zinc-400 font-medium">Tilspænding</span><span class="text-xs font-medium text-zinc-500">G99 / Gearkasse</span></div>`;
            }

            out.innerHTML += `
                <div class="bg-zinc-800/20 border border-zinc-700/50 p-6 rounded-xl flex flex-col h-full min-h-[220px]">
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-xs font-semibold uppercase tracking-wider ${c.color} flex items-center">${c.title} ${cardTitleExtra}</span>
                        <span class="text-[10px] font-medium text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md">${currentTool}</span>
                    </div>
                    <div class="text-3xl font-semibold font-mono text-zinc-100 mb-1">${rpm} <span class="text-sm text-zinc-500 font-sans font-medium">RPM</span></div>
                    <div class="text-sm text-zinc-400 mb-6 font-mono">Vc = ${spec.vc} <span class="text-xs font-sans">m/min</span></div>
                    
                    <div class="flex justify-between items-end mb-4">
                        <span class="text-sm text-zinc-400">${feedLabel}</span>
                        <span class="text-sm font-mono font-medium text-zinc-100">${feedVal}</span>
                    </div>
                    ${feedCalc}
                </div>
            `;
        });

        out.innerHTML += `
            <div class="col-span-full mt-2 bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-xl flex items-center justify-between">
                <span class="text-sm text-zinc-400 font-medium">Anbefalet Køling</span>
                <span class="text-sm text-zinc-100 font-semibold">${matData.coolant}</span>
            </div>
        `;

        out.classList.add('opacity-100');
    }, 50);
}

// Bind DOM elements for Skæredata if they exist
const sdDia = document.getElementById('sd-dia');
if(sdDia) {
    sdDia.addEventListener('input', renderSkaeredata);
    document.getElementById('sd-z').addEventListener('input', renderSkaeredata);
    document.getElementById('sd-ra').addEventListener('change', renderSkaeredata);
    document.getElementById('sd-re').addEventListener('input', renderSkaeredata);
}

// ==========================================
// 03. GEVIND ENGINE
// ==========================================
function renderThreadList() {
    const list = document.getElementById('thread-list');
    list.innerHTML = "";
    threadDB.forEach(th => {
        const div = document.createElement('div');
        div.className = `list-item ${th.id === activeThread ? 'active' : ''}`;
        div.innerText = th.id;
        div.onclick = () => {
            activeThread = th.id;
            renderThreadList();
            renderThreadData();
        };
        list.appendChild(div);
    });
}

function renderThreadData() {
    const th = threadDB.find(t => t.id === activeThread);
    if(!th) return;

    const out = document.getElementById('thread-output');
    out.classList.remove('opacity-100');

    setTimeout(() => {
        out.innerHTML = `
            <div class="bg-zinc-800/30 border border-zinc-700/50 p-8 rounded-xl relative overflow-hidden">
                <div class="text-xs text-rose-400 font-semibold tracking-wider uppercase mb-2">Gevind Specifikation</div>
                <h2 class="text-4xl font-semibold font-mono text-zinc-100 mb-8">${th.id} <span class="text-lg text-zinc-500 block mt-2 font-sans font-medium">${th.note}</span></h2>
                
                <div class="grid grid-cols-2 gap-8 mb-8">
                    <div class="bg-zinc-900/50 p-5 rounded-lg border border-zinc-800/80">
                        <div class="text-xs text-zinc-500 font-medium mb-1">Skæretap Bor-Ø</div>
                        <div class="text-3xl font-mono font-semibold text-zinc-100">${th.dCut} <span class="text-sm text-zinc-500 font-sans">mm</span></div>
                    </div>
                    <div class="bg-zinc-900/50 p-5 rounded-lg border border-zinc-800/80">
                        <div class="text-xs text-zinc-500 font-medium mb-1">Rulletap Bor-Ø</div>
                        <div class="text-3xl font-mono font-semibold ${th.dRoll === '-' ? 'text-zinc-600' : 'text-blue-400'}">${th.dRoll} <span class="text-sm text-zinc-500 font-sans">mm</span></div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-6 border-t border-zinc-800/80 pt-8">
                    <div>
                        <div class="text-xs text-zinc-500 font-medium mb-1">Stigning (P/TPI)</div>
                        <div class="text-lg font-mono font-medium text-zinc-300">${th.pitch}</div>
                    </div>
                    <div>
                        <div class="text-xs text-zinc-500 font-medium mb-1">Udv. Dreje-Ø</div>
                        <div class="text-lg font-mono font-medium text-zinc-300">${th.ext}</div>
                    </div>
                    <div>
                        <div class="text-xs text-zinc-500 font-medium mb-1">DIN 76 Frigang</div>
                        <div class="text-lg font-mono font-medium text-zinc-300">${th.din76}</div>
                    </div>
                </div>
            </div>
        `;
        out.classList.add('opacity-100');
    }, 50);
}

// ==========================================
// 04. STATIC GRID ENGINE
// ==========================================
function renderStaticGrid(cat) {
    const matrix = document.getElementById('static-matrix');
    matrix.innerHTML = "";
    const filtered = staticDB.filter(item => item.cat === cat);

    filtered.forEach(item => {
        const dataLines = item.data.map(line => {
            const splitIndex = line.indexOf(":");
            if(splitIndex !== -1) {
                const label = line.substring(0, splitIndex).trim();
                const value = line.substring(splitIndex + 1).trim();
                return `<div class="flex justify-between items-end border-b border-zinc-800/50 pb-2 mb-2 last:border-0 last:mb-0 last:pb-0">
                            <span class="text-sm text-zinc-400">${label}</span>
                            <span class="text-sm font-mono font-medium text-zinc-100 text-right max-w-[60%]">${value}</span>
                        </div>`;
            }
            return `<div class="text-sm text-zinc-300 py-1">${line}</div>`;
        }).join('');

        let catColor = 'text-zinc-400';
        if(item.cat === 'GCODE') catColor = 'text-pink-400';
        else if(item.cat === 'GDT' || item.cat === 'ISO') catColor = 'text-amber-400';
        else if(item.cat === 'MATERIALE') catColor = 'text-slate-400';

        matrix.innerHTML += `
            <div class="bg-zinc-800/30 border border-zinc-700/50 p-6 rounded-xl flex flex-col shadow-sm">
                <div class="text-xs font-semibold uppercase tracking-wider mb-3 ${catColor}">${item.cat}</div>
                <h2 class="text-lg font-semibold text-zinc-100 mb-5">${item.title}</h2>
                <div class="flex-grow flex flex-col mb-4">${dataLines}</div>
                <div class="text-xs text-zinc-500 pt-4 border-t border-zinc-800/80 mt-auto leading-relaxed">${item.note}</div>
            </div>`;
    });
}

// ==========================================
// 05. ISO 286 ENGINE (PASNINGER)
// ==========================================
const IT = {
    5: [4, 5, 6, 8, 9, 11, 13, 15], 6: [6, 8, 9, 11, 13, 16, 19, 22], 7: [10, 12, 15, 18, 21, 25, 30, 35],
    8: [14, 18, 22, 27, 33, 39, 46, 54], 9: [25, 30, 36, 43, 52, 62, 74, 87], 10: [40, 48, 58, 70, 84, 100, 120, 140], 11: [60, 75, 90, 110, 130, 160, 190, 220]
};
const fdShaft = {
    'd': { t: 'es', v: [-20, -30, -40, -50, -65, -80, -100, -120] }, 'e': { t: 'es', v: [-14, -20, -25, -32, -40, -50, -60, -72] },
    'f': { t: 'es', v: [-6, -10, -13, -16, -20, -25, -30, -36] }, 'g': { t: 'es', v: [-2, -4, -5, -6, -7, -9, -10, -12] },
    'h': { t: 'es', v: [0, 0, 0, 0, 0, 0, 0, 0] }, 'j': { t: 'ei', v: [-2, -4, -4, -5, -5, -6, -6, -6] },
    'k': { t: 'ei', v: [0, 1, 1, 1, 2, 2, 2, 3] }, 'm': { t: 'ei', v: [2, 4, 6, 7, 8, 9, 11, 13] },
    'n': { t: 'ei', v: [4, 8, 10, 12, 15, 17, 20, 23] }, 'p': { t: 'ei', v: [6, 12, 15, 18, 22, 26, 32, 37] },
    'r': { t: 'ei', v: [10, 15, 19, 23, 28, 34, 41, 48] }, 's': { t: 'ei', v: [14, 19, 23, 27, 35, 43, 53, 59] }
};

function calculateISO() {
    const nomStr = document.getElementById('iso-nom').value;
    const holeStr = document.getElementById('iso-hole').value.trim();
    const shaftStr = document.getElementById('iso-shaft').value.trim();
    const output = document.getElementById('iso-output');

    if(!nomStr || isNaN(nomStr) || nomStr <= 0 || nomStr > 120) {
        output.innerHTML = "<div class='col-span-full text-zinc-500 text-sm'>Venter på nominelt mål (Ø1 - Ø120 mm).</div>";
        output.classList.add('opacity-100');
        return;
    }

    const nom = parseFloat(nomStr);
    let idx = nom <= 3 ? 0 : nom <= 6 ? 1 : nom <= 10 ? 2 : nom <= 18 ? 3 : nom <= 30 ? 4 : nom <= 50 ? 5 : nom <= 80 ? 6 : 7;
    let html = "", h_ES = null, h_EI = null, s_es = null, s_ei = null;

    if(holeStr.length >= 2) {
        const letter = holeStr.charAt(0).toLowerCase();
        const grade = parseInt(holeStr.slice(1));
        if(IT[grade] && fdShaft[letter]) {
            const it_val = IT[grade][idx], fd = fdShaft[letter].v[idx];
            if(fdShaft[letter].t === 'es') { h_EI = -fd; h_ES = h_EI + it_val; } else { h_ES = -fd; h_EI = h_ES - it_val; }
            html += generateToleranceCard('Hul', holeStr.toUpperCase(), nom, h_ES, h_EI, 'text-blue-400');
        }
    }
    if(shaftStr.length >= 2) {
        const letter = shaftStr.charAt(0).toLowerCase();
        const grade = parseInt(shaftStr.slice(1));
        if(IT[grade] && fdShaft[letter]) {
            const it_val = IT[grade][idx], fd = fdShaft[letter].v[idx];
            if(fdShaft[letter].t === 'es') { s_es = fd; s_ei = s_es - it_val; } else { s_ei = fd; s_es = s_ei + it_val; }
            html += generateToleranceCard('Aksel', shaftStr.toLowerCase(), nom, s_es, s_ei, 'text-amber-500');
        }
    }

    if(h_ES !== null && s_es !== null) {
        const maxClearance = h_ES - s_ei, minClearance = h_EI - s_es;
        let fitType = "Overgangspasning", color = "text-purple-400";
        if(minClearance > 0) { fitType = "Løbe/Glidepasning"; color = "text-teal-400"; }
        else if(maxClearance < 0) { fitType = "Prespasning"; color = "text-red-400"; }
        html += `
            <div class="col-span-full bg-zinc-800/30 border border-zinc-700/50 p-6 rounded-xl mt-2 shadow-sm flex justify-between items-center">
                <div>
                    <div class="text-xs text-zinc-500 font-medium mb-1">Montage Analyse</div>
                    <div class="text-xl font-semibold ${color}">${fitType}</div>
                </div>
                <div class="text-right">
                    <div class="text-sm text-zinc-400 mb-1">Max Spillerum: <span class="text-zinc-100 font-mono font-medium">${maxClearance > 0 ? '+' : ''}${maxClearance} µm</span></div>
                    <div class="text-sm text-zinc-400">Min Spillerum: <span class="text-zinc-100 font-mono font-medium">${minClearance > 0 ? '+' : ''}${minClearance} µm</span></div>
                </div>
            </div>`;
    }
    if(html === "") html = "<div class='col-span-full text-zinc-500 text-sm'>Indtast gyldig tolerance (fx. H7, g6).</div>";
    output.innerHTML = html;
    output.classList.add('opacity-100');
}

function generateToleranceCard(type, name, nom, upper, lower, accentClass) {
    const uStr = upper > 0 ? `+${upper}` : upper, lStr = lower > 0 ? `+${lower}` : lower;
    const upperAbs = (nom + (upper/1000)).toFixed(3), lowerAbs = (nom + (lower/1000)).toFixed(3);
    return `
        <div class="bg-zinc-800/30 border border-zinc-700/50 p-6 rounded-xl shadow-sm">
            <div class="text-xs font-semibold tracking-wider uppercase mb-5 ${accentClass}">${type} Tolerance</div>
            <div class="flex justify-between items-start mb-6">
                <div class="text-3xl font-semibold text-zinc-100 font-mono">Ø${nom} <span class="text-xl text-zinc-400">${name}</span></div>
                <div class="text-right font-mono text-sm font-medium flex flex-col justify-end h-10 gap-1">
                    <div class="${upper > 0 ? 'text-teal-400' : (upper < 0 ? 'text-red-400' : 'text-zinc-400')}">${uStr} µm</div>
                    <div class="${lower > 0 ? 'text-teal-400' : (lower < 0 ? 'text-red-400' : 'text-zinc-400')}">${lStr} µm</div>
                </div>
            </div>
            <div class="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/80 font-mono text-sm text-zinc-400 flex justify-between">
                <div>Max: <span class="text-zinc-100 font-medium">Ø${upperAbs}</span></div>
                <div>Min: <span class="text-zinc-100 font-medium">Ø${lowerAbs}</span></div>
            </div>
        </div>`;
}

const isoNomEl = document.getElementById('iso-nom');
if(isoNomEl) {
    isoNomEl.addEventListener('input', calculateISO);
    document.getElementById('iso-hole').addEventListener('input', calculateISO);
    document.getElementById('iso-shaft').addEventListener('input', calculateISO);
}

// ==========================================
// 06. TERMINAL KALKULATOR ENGINE
// ==========================================
function parseCommand(q) {
    const output = document.getElementById('calc-output');
    output.innerHTML = "";
    let matchFound = false;

    // Spindelhastighed
    const rpmMatch = q.match(/(?:vc|v)\s*(\d+\.?\d*)\s*(?:d|ø)\s*(\d+\.?\d*)/);
    if (rpmMatch) {
        const vc = parseFloat(rpmMatch[1]);
        const d = parseFloat(rpmMatch[2]);
        let rpm = Math.round((vc * 1000) / (Math.PI * d));
        let warning = (rpm > 10000) ? "<div class='text-red-400 text-sm mt-3'>Bemærk: Haas Mini Mill max RPM (10.000) overskredet.</div>" : "";
        rpm = rpm > 10000 ? 10000 : rpm;
        output.innerHTML = `<div class="bg-zinc-800/40 border border-zinc-700/50 p-6 rounded-xl shadow-sm"><div class="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-4">Resultat: Spindelhastighed</div><div class="text-3xl font-mono font-semibold text-zinc-100 mb-4">${rpm} RPM</div><div class="flex gap-8 text-sm text-zinc-400"><div>Mål: <span class="font-mono">Ø${d} mm</span></div><div>Ønsket Vc: <span class="font-mono">${vc} m/min</span></div></div>${warning}</div>`;
        matchFound = true;
    }

    // Overfladeruhed
    const raMatch = q.match(/(?:fz|f)\s*(\d+\.?\d*)\s*(?:re|r)\s*(\d+\.?\d*)/);
    if (raMatch) {
        const f = parseFloat(raMatch[1]);
        const r = parseFloat(raMatch[2]);
        const ra = ((Math.pow(f, 2) * 1000) / (8 * r)).toFixed(2);
        output.innerHTML = `<div class="bg-zinc-800/40 border border-zinc-700/50 p-6 rounded-xl shadow-sm"><div class="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-4">Resultat: Overfladeruhed</div><div class="text-3xl font-mono font-semibold text-zinc-100 mb-4">Ra ~${ra} µm</div><div class="flex gap-8 text-sm text-zinc-400"><div>Tilspænding (f): <span class="font-mono">${f} mm/o</span></div><div>Næseradius: <span class="font-mono">${r} mm</span></div></div></div>`;
        matchFound = true;
    }

    // Skæretid
    const timeMatch = q.match(/(?:tid|t)\s*(?:l)\s*(\d+\.?\d*)\s*(?:f|vf)\s*(\d+\.?\d*)/);
    if(timeMatch) {
        const l = parseFloat(timeMatch[1]);
        const vf = parseFloat(timeMatch[2]);
        const totalMinutes = l / vf;
        const mins = Math.floor(totalMinutes);
        const secs = Math.round((totalMinutes - mins) * 60);
        output.innerHTML = `<div class="bg-zinc-800/40 border border-zinc-700/50 p-6 rounded-xl shadow-sm"><div class="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-4">Resultat: Skæretid</div><div class="text-3xl font-mono font-semibold text-zinc-100 mb-4">${mins} min ${secs} sek</div><div class="flex gap-8 text-sm text-zinc-400"><div>Længde i snit: <span class="font-mono">${l} mm</span></div><div>Bordtilspænding (Vf): <span class="font-mono">${vf} mm/min</span></div></div></div>`;
        matchFound = true;
    }

    // Gevindtilspænding
    const tapMatch = q.match(/(?:p|stigning)\s*(\d+\.?\d*)\s*(?:s|rpm|n)\s*(\d+\.?\d*)/);
    if(tapMatch) {
        const p = parseFloat(tapMatch[1]);
        const s = parseFloat(tapMatch[2]);
        const vf = (p * s).toFixed(1);
        output.innerHTML = `<div class="bg-zinc-800/40 border border-zinc-700/50 p-6 rounded-xl shadow-sm"><div class="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-4">Resultat: Gevindtilspænding</div><div class="text-3xl font-mono font-semibold text-zinc-100 mb-4">F = ${vf} mm/min</div><div class="flex gap-8 text-sm text-zinc-400"><div>Stigning: <span class="font-mono">${p} mm</span></div><div>Spindel: <span class="font-mono">${s} RPM</span></div></div></div>`;
        matchFound = true;
    }

    // Borespids
    const tipMatch = q.match(/(?:bor|spids)\s*(?:d|ø)\s*(\d+\.?\d*)\s*(?:v|a)\s*(\d+\.?\d*)/);
    if(tipMatch) {
        const d = parseFloat(tipMatch[1]);
        const v = parseFloat(tipMatch[2]);
        const rad = (v / 2) * (Math.PI / 180);
        const depth = ((d / 2) / Math.tan(rad)).toFixed(2);
        output.innerHTML = `<div class="bg-zinc-800/40 border border-zinc-700/50 p-6 rounded-xl shadow-sm"><div class="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-4">Resultat: Borespids Kompensation</div><div class="text-3xl font-mono font-semibold text-zinc-100 mb-4">Z = ${depth} mm</div><div class="flex gap-8 text-sm text-zinc-400"><div>Bor-Ø: <span class="font-mono">${d} mm</span></div><div>Spidsvinkel: <span class="font-mono">${v}°</span></div></div><div class="text-sm text-zinc-500 mt-4 border-t border-zinc-800/80 pt-3">Læg <span class="font-mono text-zinc-300">${depth} mm</span> til tegningsdybden for at få fuld Ø i bunden.</div></div>`;
        matchFound = true;
    }

    // Konus
    const konusMatch = q.match(/(?:konus)\s*(?:d1|d)\s*(\d+\.?\d*)\s*(?:d2|d)\s*(\d+\.?\d*)\s*(?:l)\s*(\d+\.?\d*)/);
    if(konusMatch) {
        const D = parseFloat(konusMatch[1]);
        const d = parseFloat(konusMatch[2]);
        const L = parseFloat(konusMatch[3]);
        const rad = Math.atan((D - d) / (2 * L));
        const degHalf = rad * (180 / Math.PI);
        const degTotal = degHalf * 2;
        output.innerHTML = `<div class="bg-zinc-800/40 border border-zinc-700/50 p-6 rounded-xl shadow-sm"><div class="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-4">Resultat: Konus Vinkel</div><div class="text-2xl font-mono font-semibold text-zinc-100 mb-2">Topslæde Indstilling: ${degHalf.toFixed(2)}°</div><div class="text-lg font-mono font-medium text-zinc-400 mb-4">Total Topvinkel: ${degTotal.toFixed(2)}°</div><div class="flex gap-8 text-sm text-zinc-400"><div>Forhold: <span class="font-mono">1 : ${((2*L)/(D-d)).toFixed(1)}</span></div></div></div>`;
        matchFound = true;
    }

    // Sinuslineal
    const sinMatch = q.match(/(?:sin|sinus)\s*(?:v|a)\s*(\d+\.?\d*)\s*(?:l)\s*(\d+\.?\d*)/);
    if(sinMatch) {
        const v = parseFloat(sinMatch[1]);
        const l = parseFloat(sinMatch[2]);
        const rad = v * (Math.PI / 180);
        const height = (Math.sin(rad) * l).toFixed(3);

        function getGaugeBlocks(target) {
            let blocks = [];
            let t = Math.round(target * 1000) / 1000;
            if (t <= 0) return ["Ingen"];
            if (t < 0.5) return ["For lav til std. sæt"];

            let th = Math.round(t * 1000) % 10;
            if (th > 0) {
                let b = 1.0 + (th / 1000);
                if (t >= b) { blocks.push(b); t = Math.round((t - b) * 1000) / 1000; }
            }

            let h = Math.round(t * 100) % 100;
            if (h > 0) {
                let b = 1.0;
                if (h >= 50 && t >= (1.0 + (h-50)/100)) { b += (h - 50) / 100; }
                else if (t >= 1.0 + h/100) { b += h / 100; }
                if (b > 1.0 && t >= b) { blocks.push(b); t = Math.round((t - b) * 1000) / 1000; }
            }

            let tens = Math.floor(t / 10) * 10;
            while (tens >= 100) { blocks.push(100); t = Math.round((t - 100) * 1000) / 1000; tens -= 100; }
            if (tens > 0 && t >= tens) { blocks.push(tens); t = Math.round((t - tens) * 1000) / 1000; }

            if (t > 0) blocks.push(t);

            return blocks.sort((a,b) => b - a).map(n => n.toFixed(3));
        }

        const blockStack = getGaugeBlocks(parseFloat(height)).join(" + ");

        output.innerHTML = `<div class="bg-zinc-800/40 border border-zinc-700/50 p-6 rounded-xl shadow-sm"><div class="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-4">Resultat: Sinuslineal</div><div class="text-3xl font-mono font-semibold text-zinc-100 mb-4">Højde = ${height} mm</div><div class="flex gap-8 text-sm text-zinc-400 mb-5"><div>Vinkel: <span class="font-mono">${v}°</span></div><div>Lineal Længde: <span class="font-mono">${l} mm</span></div></div><div class="text-sm text-zinc-300 border-t border-zinc-800/80 pt-4 leading-relaxed"><div class="text-zinc-500 font-medium mb-1">Passklods-Stack (M112/M87 sæt):</div><span class="font-mono text-blue-400 text-lg">${blockStack}</span></div></div>`;
        matchFound = true;
    }

    // Delecirkel
    const boltMatch = q.match(/(?:bolt|hul)\s*(?:d|ø)\s*(\d+\.?\d*)\s*(?:n)\s*(\d+)/);
    if(boltMatch) {
        const d = parseFloat(boltMatch[1]);
        const n = parseInt(boltMatch[2]);
        const vinkel = (360 / n).toFixed(2);
        output.innerHTML = `<div class="bg-zinc-800/40 border border-zinc-700/50 p-6 rounded-xl shadow-sm"><div class="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-4">Resultat: Delecirkel</div><div class="text-3xl font-mono font-semibold text-zinc-100 mb-4">Vinkel: ${vinkel}°</div><div class="flex gap-8 text-sm text-zinc-400"><div>Antal huller: <span class="font-mono">${n}</span></div><div>Delecirkel-Ø: <span class="font-mono">${d} mm</span></div></div></div>`;
        matchFound = true;
    }

    if(!matchFound && q !== "") {
        output.innerHTML = `<div class="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex items-center justify-center h-24"><span class="text-zinc-500 text-sm">Ugyldig syntaks. Se referencemanual.</span></div>`;
    }
}

function injectCalc(query) {
    const input = document.getElementById('calc-cmd');
    input.value = query;
    input.focus();
    parseCommand(query);
}

const calcCmdEl = document.getElementById('calc-cmd');
if(calcCmdEl) {
    calcCmdEl.addEventListener('input', (e) => parseCommand(e.target.value.toLowerCase()));
}