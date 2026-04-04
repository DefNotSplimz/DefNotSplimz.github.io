/**
 * Machining_OS | Inventory & Tool Crib Logic
 * Version: 5.7 (Milling & Turning Dynamic Dropdown Fix)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const stockForm = document.getElementById('stock-form');
    const toolForm = document.getElementById('tool-form');
    const inventoryTableBody = document.getElementById('inventory-table-body');
    const toolTableBody = document.getElementById('tool-table-body');
    const matSelect = document.getElementById('work-material');
    const totalWeightDisplay = document.getElementById('total-stock-weight');

    // Tool Form Elementer (Ny Logik til Drej/Fræs)
    const toolCatSelect = document.getElementById('tool-cat');
    const toolTypeSelect = document.getElementById('tool-type');
    const labelToolD = document.getElementById('label-tool-d');
    const labelToolZ = document.getElementById('label-tool-z');
    const inputToolZ = document.getElementById('tool-z');

    // Værktøjs-Klassifikation DB
    const TOOL_TYPES = {
        mill: ['Endmill', 'Facemill', 'Ballmill', 'Drill', 'Spot Drill', 'Reamer', 'Undersænker', 'Thread Mill', 'Slitting Saw'],
        turn: ['HM Platte', 'HSS Værktøj', 'Borestang', 'Drill', 'Gevindstål', 'Stikstål', 'Kopistål']
    };

    // --- INITIALISERING ---
    function initInventory() {
        if (matSelect && typeof MACHINING_DB !== 'undefined') {
            matSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
                .map(([k, v]) => `<option value="${k}" class="bg-zinc-900">${v.name}</option>`).join('');
        }
        
        // Aktiver dynamisk dropdown
        if (toolCatSelect) {
            toolCatSelect.addEventListener('change', updateToolForm);
            updateToolForm(); // Kør den én gang ved opstart for at fylde listen
        }

        renderStock();
        renderCrib();
    }

    // Dynamisk Form Logik
    function updateToolForm() {
        const cat = toolCatSelect.value;
        // Injektér <option> tags baseret på valgt kategori
        toolTypeSelect.innerHTML = TOOL_TYPES[cat].map(t => `<option value="${t}" class="bg-zinc-900">${t}</option>`).join('');
        
        // Tilpas labels og placeholder-data til drej/fræs
        if (cat === 'mill') {
            labelToolD.textContent = 'Ø (mm)';
            labelToolZ.textContent = 'Teeth (Z)';
            inputToolZ.placeholder = 'f.eks. 4';
            inputToolZ.step = "1";
        } else {
            labelToolD.textContent = 'Dim / Str';
            labelToolZ.textContent = 'Radius (Re)';
            inputToolZ.placeholder = 'f.eks. 0.8';
            inputToolZ.step = "0.01";
        }
    }

    // --- VÆRKTØJSSTYRING (INSTRUMENT CRIB) ---
    function renderCrib() {
        const tools = MachiningOS.getTools();
        if (tools.length === 0) {
            toolTableBody.innerHTML = `<tr><td colspan="5" class="p-12 text-center text-zinc-700 italic font-mono uppercase text-[10px]">Crib_Empty // Intet værktøj registreret.</td></tr>`;
            return;
        }

        toolTableBody.innerHTML = tools.sort((a,b) => parseInt(a.t) - parseInt(b.t)).map(t => {
            const spec = t.cat === 'turn' 
                ? `Dim ${parseFloat(t.d).toFixed(2)} // Re ${t.re}` 
                : `Ø ${parseFloat(t.d).toFixed(2)} mm // Z${t.z}`;
            const opColor = t.cat === 'turn' ? 'text-blue-500' : 'text-zinc-400';

            return `
            <tr class="hover:bg-white/5 transition-colors border-b border-zinc-900/50 group">
                <td class="p-4 text-white font-black italic tracking-tighter text-lg">T${t.t}</td>
                <td class="p-4 ${opColor} uppercase font-black">${t.type}</td>
                <td class="p-4 font-mono text-zinc-500 tracking-tight">${spec}</td>
                <td class="p-4 text-primary font-black italic">${t.mat}</td>
                <td class="p-4 text-right">
                    <button onclick="deleteCribTool('${t.t}')" class="label-micro !text-zinc-800 hover:!text-red-500 transition-all !before:hidden uppercase font-black italic">Wipe</button>
                </td>
            </tr>`;
        }).join('');
    }

    toolForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const cat = toolCatSelect.value;
        const zValue = document.getElementById('tool-z').value;

        const newTool = {
            t: document.getElementById('tool-t').value,
            cat: cat,
            type: document.getElementById('tool-type').value,
            d: document.getElementById('tool-d').value,
            z: cat === 'mill' ? zValue : null,
            re: cat === 'turn' ? zValue : null,
            mat: document.getElementById('tool-mat').value
        };

        MachiningOS.saveTool(newTool);
        
        const btn = document.getElementById('btn-submit-tool');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="text-emerald-500 animate-pulse">LOCKED_IN_DB</span>';
        setTimeout(() => btn.innerHTML = originalText, 1500);

        toolForm.reset();
        updateToolForm(); 
        renderCrib();
    });

    window.deleteCribTool = (tNum) => {
        if(confirm(`PROTOCOL_AUDIT: Slet T${tNum} permanent?`)) {
            MachiningOS.deleteTool(tNum);
            renderCrib();
        }
    };

    // --- LAGERSTYRING (STOCK LOG) ---
    function calculateItemWeight(matKey, type, dimStr, lengthMm) {
        const material = MACHINING_DB.MATERIALS[matKey];
        const density = material.density || 2.7;
        let volumeCm3 = 0;

        if (type === 'round') {
            const diameter = parseFloat(dimStr);
            const radius = diameter / 2;
            volumeCm3 = (Math.PI * Math.pow(radius / 10, 2)) * (lengthMm / 10);
        } else {
            const parts = dimStr.toLowerCase().split('x');
            const width = parseFloat(parts[0]);
            const height = parts[1] ? parseFloat(parts[1]) : width;
            volumeCm3 = (width / 10) * (height / 10) * (lengthMm / 10);
        }
        return (volumeCm3 * density) / 1000;
    }

    stockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const matKey = matSelect.value;
        const type = document.getElementById('stock-type').value;
        const dim = document.getElementById('stock-dim').value;
        const len = parseFloat(document.getElementById('stock-len').value);

        if (!dim || isNaN(len)) return;

        const weight = calculateItemWeight(matKey, type, dim, len);
        const entry = {
            id: Date.now(),
            matKey: matKey,
            matName: MACHINING_DB.MATERIALS[matKey].name,
            type: type === 'round' ? 'Rund' : 'Flad',
            dim: dim, len: len, weight: weight
        };

        MachiningOS.saveLogEntry('inventory_stock', entry);
        
        const btn = document.getElementById('btn-submit-stock');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="text-emerald-500 animate-pulse">STOCK_UPDATED</span>';
        setTimeout(() => btn.innerHTML = originalText, 1500);

        stockForm.reset();
        renderStock();
    });

    function renderStock() {
        const stock = MachiningOS.getLogs('inventory_stock');
        let totalKg = 0;

        if (stock.length === 0) {
            inventoryTableBody.innerHTML = `<tr><td colspan="6" class="p-12 text-center text-zinc-700 italic font-mono uppercase text-[10px]">Stock_Empty</td></tr>`;
            totalWeightDisplay.textContent = "0.00 kg";
            return;
        }

        inventoryTableBody.innerHTML = stock.map(item => {
            totalKg += item.weight;
            return `
            <tr class="hover:bg-white/5 transition-colors border-b border-zinc-900/50">
                <td class="p-4 text-white font-black">${item.matName}</td>
                <td class="p-4 text-zinc-500 uppercase italic">${item.type}</td>
                <td class="p-4 text-white font-mono">${item.dim} mm</td>
                <td class="p-4 text-white font-mono">${item.len} mm</td>
                <td class="p-4 text-primary font-bold italic">${item.weight.toFixed(3)} kg</td>
                <td class="p-4 text-right">
                    <button onclick="deleteStockItem(${item.id})" class="label-micro !text-zinc-800 hover:!text-red-500 !before:hidden uppercase font-black italic">Wipe</button>
                </td>
            </tr>`;
        }).join('');

        totalWeightDisplay.textContent = `${totalKg.toFixed(2)} kg`;
    }

    window.deleteStockItem = (id) => {
        MachiningOS.deleteLogEntry('inventory_stock', id);
        renderStock();
    };

    initInventory();
});