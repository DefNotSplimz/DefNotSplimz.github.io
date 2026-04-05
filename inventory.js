/**
 * Machining_OS | Inventory & Tool Crib Logic
 * Version: 5.8 (Advanced Tool Geometry & Tube Stock Engine)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const stockForm = document.getElementById('stock-form');
    const toolForm = document.getElementById('tool-form');
    const inventoryTableBody = document.getElementById('inventory-table-body');
    const toolTableBody = document.getElementById('tool-table-body');
    const matSelect = document.getElementById('work-material');
    const totalWeightDisplay = document.getElementById('total-stock-weight');

    // Tool Form Elementer
    const toolCatSelect = document.getElementById('tool-cat');
    const toolTypeSelect = document.getElementById('tool-type');
    const labelToolD = document.getElementById('label-tool-d');
    const labelToolZ = document.getElementById('label-tool-z');
    const inputToolZ = document.getElementById('tool-z');
    const labelToolLc = document.getElementById('label-tool-lc');
    const inputToolLc = document.getElementById('tool-lc');

    // Stock Form Elementer
    const stockTypeSelect = document.getElementById('stock-type');
    const lblStockDim1 = document.getElementById('lbl-stock-dim1');
    const inputStockDim1 = document.getElementById('stock-dim1');
    const wrapperStockDim2 = document.getElementById('wrapper-stock-dim2');
    const lblStockDim2 = document.getElementById('lbl-stock-dim2');
    const inputStockDim2 = document.getElementById('stock-dim2');

    // Værktøjs-Klassifikation DB
    const TOOL_TYPES = {
        mill: ['Endmill (Slet)', 'Endmill (Skrub)', 'Toroid (Bullnose)', 'Ballmill', 'Facemill', 'Chamfer / Spot', 'Bor (Drill)', 'Reamer', 'Gevindfræser'],
        turn: ['CNMG (Skrub)', 'WNMG (Skrub)', 'DNMG (Slet)', 'VNMG (Fin-Slet)', 'CCMT (Alu)', 'DCGT (Alu)', 'Borestang', 'Stikstål (Groove)', 'Gevindstål']
    };

    // --- INITIALISERING ---
    function initInventory() {
        if (matSelect && typeof MACHINING_DB !== 'undefined') {
            matSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
                .map(([k, v]) => `<option value="${k}" class="bg-zinc-900">${v.name}</option>`).join('');
        }
        
        toolCatSelect.addEventListener('change', updateToolForm);
        updateToolForm(); 

        stockTypeSelect.addEventListener('change', updateStockForm);
        updateStockForm();

        renderStock();
        renderCrib();
    }

    // --- DYNAMISK TOOL FORM LOGIK ---
    function updateToolForm() {
        const cat = toolCatSelect.value;
        toolTypeSelect.innerHTML = TOOL_TYPES[cat].map(t => `<option value="${t}" class="bg-zinc-900">${t}</option>`).join('');
        
        if (cat === 'mill') {
            labelToolD.textContent = 'Fræser Ø (mm)';
            labelToolZ.textContent = 'Teeth (Z)';
            inputToolZ.placeholder = 'f.eks. 4';
            inputToolZ.step = "1";
            labelToolLc.textContent = 'Skærelængde Lc / Re';
            inputToolLc.placeholder = 'Længde eller Rad';
        } else {
            labelToolD.textContent = 'Platte-Str / Skaft';
            labelToolZ.textContent = 'Næseradius (Re)';
            inputToolZ.placeholder = 'f.eks. 0.8';
            inputToolZ.step = "0.01";
            labelToolLc.textContent = 'Indgrebsvinkel (KAPR)';
            inputToolLc.placeholder = 'f.eks. 95°';
        }
    }

    // --- DYNAMISK STOCK FORM LOGIK ---
    function updateStockForm() {
        const type = stockTypeSelect.value;
        
        if (type === 'round') {
            lblStockDim1.textContent = 'Yder-Ø (mm)';
            inputStockDim1.placeholder = '50';
            wrapperStockDim2.classList.add('hidden');
        } else if (type === 'flat') {
            lblStockDim1.textContent = 'Bredde X (mm)';
            inputStockDim1.placeholder = '100';
            lblStockDim2.textContent = 'Højde Y (mm)';
            inputStockDim2.placeholder = '20';
            wrapperStockDim2.classList.remove('hidden');
        } else if (type === 'tube') {
            lblStockDim1.textContent = 'Yder-Ø (mm)';
            inputStockDim1.placeholder = '50';
            lblStockDim2.textContent = 'Godstykkelse (mm)';
            inputStockDim2.placeholder = '5';
            wrapperStockDim2.classList.remove('hidden');
        }
    }

    // --- VÆRKTØJSSTYRING (INSTRUMENT CRIB) ---
    function renderCrib() {
        const tools = MachiningOS.getTools();
        if (tools.length === 0) {
            toolTableBody.innerHTML = `<tr><td colspan="5" class="p-12 text-center text-zinc-700 italic font-mono uppercase text-[10px] tracking-widest">Crib_Empty // Intet værktøj registreret.</td></tr>`;
            return;
        }

        toolTableBody.innerHTML = tools.sort((a,b) => parseInt(a.t) - parseInt(b.t)).map(t => {
            // Formater specifikationer afhængig af type og data-tilgængelighed
            let spec = "";
            if (t.cat === 'mill') {
                spec = `Ø${parseFloat(t.d).toFixed(1)} / Z${t.z}`;
                if (t.lc) spec += ` / Lc ${t.lc}`;
            } else {
                spec = `Str ${t.d} / Re ${parseFloat(t.z).toFixed(2)}`;
                if (t.lc) spec += ` / ${t.lc}°`;
            }

            const opColor = t.cat === 'turn' ? 'text-blue-500' : 'text-zinc-300';

            return `
            <tr class="hover:bg-white/5 transition-colors group">
                <td class="p-4 text-white font-black italic tracking-tighter text-lg">T${t.t.padStart(2, '0')}</td>
                <td class="p-4 ${opColor} uppercase font-black tracking-wider text-xs">${t.type}</td>
                <td class="p-4 font-mono text-zinc-400">${spec}</td>
                <td class="p-4 text-primary font-black text-xs">${t.mat}</td>
                <td class="p-4 text-right">
                    <button onclick="deleteCribTool('${t.t}')" class="label-micro !text-zinc-800 hover:!text-red-500 transition-all !before:hidden uppercase font-black italic cursor-pointer">Wipe</button>
                </td>
            </tr>`;
        }).join('');
    }

    toolForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const cat = toolCatSelect.value;
        const newTool = {
            t: document.getElementById('tool-t').value,
            cat: cat,
            type: document.getElementById('tool-type').value,
            d: document.getElementById('tool-d').value,
            z: document.getElementById('tool-z').value,
            lc: document.getElementById('tool-lc').value || null, // Nyt felt
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
        MachiningOS.deleteTool(tNum);
        renderCrib();
    };

    // --- LAGERSTYRING (STOCK LOG) ---
    function calculateItemWeight(matKey, type, dim1, dim2, lengthMm) {
        const material = MACHINING_DB.MATERIALS[matKey];
        const density = material ? material.density : 2.7; // Fallback
        let volumeCm3 = 0;

        const d1 = parseFloat(dim1) || 0;
        const d2 = parseFloat(dim2) || 0;
        const L = parseFloat(lengthMm) || 0;

        if (type === 'round') {
            const r = d1 / 2;
            volumeCm3 = Math.PI * Math.pow(r / 10, 2) * (L / 10);
        } 
        else if (type === 'flat') {
            volumeCm3 = (d1 / 10) * (d2 / 10) * (L / 10);
        }
        else if (type === 'tube') {
            const rOut = d1 / 2;
            const rIn = rOut - d2; // d2 = Godstykkelse (Wall Thickness)
            if (rIn > 0) {
                const volOut = Math.PI * Math.pow(rOut / 10, 2) * (L / 10);
                const volIn = Math.PI * Math.pow(rIn / 10, 2) * (L / 10);
                volumeCm3 = volOut - volIn;
            }
        }
        return (volumeCm3 * density) / 1000; // Return i Kg
    }

    stockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const matKey = matSelect.value;
        const type = stockTypeSelect.value;
        const dim1 = inputStockDim1.value;
        const dim2 = inputStockDim2.value;
        const len = parseFloat(document.getElementById('stock-len').value);

        if (!dim1 || isNaN(len)) return;

        const weight = calculateItemWeight(matKey, type, dim1, dim2, len);
        
        let displayDim = dim1;
        let typeName = "Rund";
        if (type === 'flat') { displayDim = `${dim1}x${dim2}`; typeName = "Blok"; }
        if (type === 'tube') { displayDim = `Ø${dim1}x${dim2}T`; typeName = "Rør"; }

        const entry = {
            id: Date.now(),
            matKey: matKey,
            matName: MACHINING_DB.MATERIALS[matKey] ? MACHINING_DB.MATERIALS[matKey].name : matKey,
            type: typeName,
            dim: displayDim, 
            len: len, 
            weight: weight
        };

        MachiningOS.saveLogEntry('inventory_stock', entry);
        
        const btn = document.getElementById('btn-submit-stock');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="text-emerald-500 animate-pulse">STOCK_UPDATED</span>';
        setTimeout(() => btn.innerHTML = originalText, 1500);

        stockForm.reset();
        updateStockForm();
        renderStock();
    });

    function renderStock() {
        const stock = MachiningOS.getLogs('inventory_stock');
        let totalKg = 0;

        if (stock.length === 0) {
            inventoryTableBody.innerHTML = `<tr><td colspan="6" class="p-12 text-center text-zinc-700 italic font-mono uppercase text-[10px] tracking-widest">Stock_Empty</td></tr>`;
            totalWeightDisplay.innerHTML = `0.000 <small class="text-sm">kg</small>`;
            return;
        }

        inventoryTableBody.innerHTML = stock.reverse().map(item => {
            totalKg += item.weight;
            return `
            <tr class="hover:bg-white/5 transition-colors group">
                <td class="p-4 text-white font-black text-xs">${item.matName}</td>
                <td class="p-4 text-zinc-500 uppercase italic text-xs font-bold">${item.type}</td>
                <td class="p-4 text-zinc-300 font-mono text-sm tracking-tight">${item.dim}</td>
                <td class="p-4 text-white font-mono text-sm">${item.len} <span class="text-[10px] text-zinc-600">mm</span></td>
                <td class="p-4 text-primary font-black italic text-sm">${item.weight.toFixed(3)} <span class="text-[10px]">kg</span></td>
                <td class="p-4 text-right">
                    <button onclick="deleteStockItem(${item.id})" class="label-micro !text-zinc-800 hover:!text-red-500 !before:hidden uppercase font-black italic cursor-pointer">Wipe</button>
                </td>
            </tr>`;
        }).join('');

        totalWeightDisplay.innerHTML = `${totalKg.toFixed(3)} <small class="text-sm">kg</small>`;
    }

    window.deleteStockItem = (id) => {
        MachiningOS.deleteLogEntry('inventory_stock', id);
        renderStock();
    };

    initInventory();
});