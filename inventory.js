/**
 * Machining_OS | Inventory & Tool Crib Logic v8.6
 * Tactical UI Update
 */

document.addEventListener('DOMContentLoaded', () => {
    const stockForm = document.getElementById('stock-form');
    const toolForm = document.getElementById('tool-form');
    const inventoryTableBody = document.getElementById('inventory-table-body');
    const toolTableBody = document.getElementById('tool-table-body');
    const matSelect = document.getElementById('work-material');
    const totalWeightDisplay = document.getElementById('total-stock-weight');

    const toolCatSelect = document.getElementById('tool-cat');
    const toolTypeSelect = document.getElementById('tool-type');
    const stockTypeSelect = document.getElementById('stock-type');

    const TOOL_TYPES = {
        mill: ['Endmill (Slet)', 'Endmill (Skrub)', 'Toroid', 'Ballmill', 'Facemill', 'Chamfer', 'Drill', 'Threadmill'],
        turn: ['CNMG (Skrub)', 'WNMG (Skrub)', 'DNMG (Slet)', 'CCMT', 'Borestang', 'Gevindstål']
    };

    function initInventory() {
        if (matSelect && typeof MACHINING_DB !== 'undefined') {
            matSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
                .map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');
        }
        toolCatSelect.addEventListener('change', updateToolForm);
        stockTypeSelect.addEventListener('change', updateStockForm);
        updateToolForm(); 
        updateStockForm();
        renderStock();
        renderCrib();
    }

    function updateToolForm() {
        const cat = toolCatSelect.value;
        toolTypeSelect.innerHTML = TOOL_TYPES[cat].map(t => `<option value="${t}">${t.toUpperCase()}</option>`).join('');
    }

    function updateStockForm() {
        const type = stockTypeSelect.value;
        const wrapper2 = document.getElementById('wrapper-stock-dim2');
        if (type === 'round') {
            document.getElementById('lbl-stock-dim1').textContent = 'Ø (mm)';
            wrapper2.classList.add('hidden');
        } else {
            document.getElementById('lbl-stock-dim1').textContent = type === 'flat' ? 'Width (X)' : 'Outer-Ø';
            document.getElementById('lbl-stock-dim2').textContent = type === 'flat' ? 'Height (Y)' : 'Wall-T';
            wrapper2.classList.remove('hidden');
        }
    }

    function renderCrib() {
        const tools = MachiningOS.getTools();
        if (tools.length === 0) {
            toolTableBody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-zinc-800 font-bold uppercase italic text-[9px]">Crib_Empty</td></tr>`;
            return;
        }
        toolTableBody.innerHTML = tools.sort((a,b) => parseInt(a.t) - parseInt(b.t)).map(t => `
            <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="py-4 text-primary font-black italic">T${t.t.padStart(2, '0')}</td>
                <td class="py-4 text-white font-bold uppercase text-[9px]">${t.type}</td>
                <td class="py-4 text-zinc-500 font-mono text-[9px]">Ø${t.d} / Z${t.z} / ${t.mat}</td>
                <td class="py-4 text-right"><button onclick="deleteCribTool('${t.t}')" class="text-zinc-800 hover:text-red-500 font-black italic uppercase">Wipe</button></td>
            </tr>`).join('');
    }

    toolForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTool = {
            t: document.getElementById('tool-t').value,
            cat: toolCatSelect.value,
            type: toolTypeSelect.value,
            d: document.getElementById('tool-d').value,
            z: document.getElementById('tool-z').value,
            lc: document.getElementById('tool-lc').value,
            mat: document.getElementById('tool-mat').value
        };
        MachiningOS.saveTool(newTool);
        toolForm.reset(); updateToolForm(); renderCrib();
    });

    window.deleteCribTool = (tNum) => { MachiningOS.deleteTool(tNum); renderCrib(); };

    function renderStock() {
        const stock = MachiningOS.getLogs('inventory_stock');
        let totalKg = 0;
        if (stock.length === 0) {
            inventoryTableBody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-zinc-800 font-bold uppercase italic text-[9px]">Stock_Empty</td></tr>`;
            totalWeightDisplay.innerHTML = `0.000 <small class="text-xs uppercase">kg</small>`;
            return;
        }
        inventoryTableBody.innerHTML = stock.reverse().map(item => {
            totalKg += item.weight;
            return `
            <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="py-4 text-white font-bold">${item.matName}</td>
                <td class="py-4 text-zinc-500 font-mono text-[9px] uppercase">${item.type} // ${item.dim} x ${item.len}mm</td>
                <td class="py-4 text-primary font-black italic">${item.weight.toFixed(3)} kg</td>
                <td class="py-4 text-right"><button onclick="deleteStockItem(${item.id})" class="text-zinc-800 hover:text-red-500 font-black italic uppercase">Wipe</button></td>
            </tr>`;
        }).join('');
        totalWeightDisplay.innerHTML = `${totalKg.toFixed(3)} <small class="text-xs uppercase font-bold text-zinc-500">kg</small>`;
    }

    stockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Vægtberegningslogik (Bibeholdt fra v5.8)
        const d1 = parseFloat(document.getElementById('stock-dim1').value);
        const d2 = parseFloat(document.getElementById('stock-dim2')?.value) || 0;
        const L = parseFloat(document.getElementById('stock-len').value);
        const mat = MACHINING_DB.MATERIALS[matSelect.value];
        let vol = 0;
        
        if (stockTypeSelect.value === 'round') vol = Math.PI * Math.pow(d1/20, 2) * (L/10);
        else if (stockTypeSelect.value === 'flat') vol = (d1/10) * (d2/10) * (L/10);
        else vol = (Math.PI * Math.pow(d1/20, 2) * (L/10)) - (Math.PI * Math.pow((d1/2 - d2)/10, 2) * (L/10));

        const entry = {
            id: Date.now(),
            matName: mat.name,
            type: stockTypeSelect.value.toUpperCase(),
            dim: stockTypeSelect.value === 'flat' ? `${d1}x${d2}` : `Ø${d1}`,
            len: L,
            weight: (vol * mat.density) / 1000
        };
        MachiningOS.saveLogEntry('inventory_stock', entry);
        stockForm.reset(); updateStockForm(); renderStock();
    });

    window.deleteStockItem = (id) => { MachiningOS.deleteLogEntry('inventory_stock', id); renderStock(); };
    initInventory();
});