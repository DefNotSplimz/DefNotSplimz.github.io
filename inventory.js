/**
 * Machining_OS | Inventory & Tool Crib Logic v9.3
 * Tactical UI // BUGFIX: ARRAY REVERSAL
 */

document.addEventListener('DOMContentLoaded', () => {
    const stockForm = document.getElementById('stock-form');
    const toolForm = document.getElementById('tool-form');
    const inventoryTableBody = document.getElementById('inventory-table-body');
    const toolTableBody = document.getElementById('tool-table-body');
    const matSelect = document.getElementById('work-material');
    const totalWeightDisplay = document.getElementById('total-stock-weight');

    function renderStock() {
        const stock = MachiningOS.getLogs('inventory_stock');
        let totalKg = 0;
        if (stock.length === 0) {
            inventoryTableBody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-zinc-800 font-bold uppercase italic text-[9px]">Stock_Empty</td></tr>`;
            totalWeightDisplay.innerHTML = `0.000 <small class=\"text-xs\">kg</small>`;
            return;
        }
        inventoryTableBody.innerHTML = [...stock].reverse().map(item => {
            totalKg += item.weight;
            return `
            <tr class=\"hover:bg-white/[0.02] transition-colors\">
                <td class=\"py-4 text-white font-bold\">${item.matName}</td>
                <td class=\"py-4 text-zinc-500 font-mono text-[9px] uppercase\">${item.type} // ${item.dim} x ${item.len}mm</td>
                <td class=\"py-4 text-primary font-black italic\">${item.weight.toFixed(3)} kg</td>
                <td class=\"py-4 text-right\"><button onclick=\"deleteStockItem(${item.id})\" class=\"text-zinc-800 hover:text-red-500 font-black italic uppercase\">Wipe</button></td>
            </tr>`;
        }).join('');
        totalWeightDisplay.innerHTML = `${totalKg.toFixed(3)} <small class=\"text-xs uppercase font-bold text-zinc-500\">kg</small>`;
    }

    stockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const d1 = parseFloat(document.getElementById('stock-dim1').value);
        const d2 = parseFloat(document.getElementById('stock-dim2')?.value) || 0;
        const L = parseFloat(document.getElementById('stock-len').value);
        const mat = MACHINING_DB.MATERIALS[matSelect.value];
        let vol = 0;
        if (document.getElementById('stock-type').value === 'round') vol = Math.PI * Math.pow(d1/20, 2) * (L/10);
        else if (document.getElementById('stock-type').value === 'flat') vol = (d1/10) * (d2/10) * (L/10);
        else vol = (Math.PI * Math.pow(d1/20, 2) * (L/10)) - (Math.PI * Math.pow((d1/2 - d2)/10, 2) * (L/10));
        const entry = { id: Date.now(), matName: mat.name, type: document.getElementById('stock-type').value.toUpperCase(), dim: document.getElementById('stock-type').value === 'flat' ? `${d1}x${d2}` : `Ø${d1}`, len: L, weight: (vol * mat.density) / 1000 };
        MachiningOS.saveLogEntry('inventory_stock', entry);
        stockForm.reset(); renderStock();
    });

    window.deleteStockItem = (id) => { MachiningOS.deleteLogEntry('inventory_stock', id); renderStock(); };
    
    // (Værktøjs-logik bevares præcis som v8.6)
    toolForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTool = {
            t: document.getElementById('tool-t').value,
            cat: document.getElementById('tool-cat').value,
            type: document.getElementById('tool-type').value,
            d: document.getElementById('tool-d').value,
            z: document.getElementById('tool-z').value,
            lc: document.getElementById('tool-lc').value,
            mat: document.getElementById('tool-mat').value
        };
        MachiningOS.saveTool(newTool);
        toolForm.reset(); renderCrib();
    });

    function renderCrib() {
        const tools = MachiningOS.getTools();
        toolTableBody.innerHTML = tools.sort((a,b) => parseInt(a.t) - parseInt(b.t)).map(t => `
            <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="py-4 text-primary font-black italic">T${t.t.padStart(2, '0')}</td>
                <td class="py-4 text-white font-bold uppercase text-[9px]">${t.type}</td>
                <td class="py-4 text-zinc-500 font-mono text-[9px]">Ø${t.d} / Z${t.z} / ${t.mat}</td>
                <td class="py-4 text-right"><button onclick="deleteCribTool('${t.t}')" class="text-zinc-800 hover:text-red-500 font-black italic uppercase">Wipe</button></td>
            </tr>`).join('');
    }
    window.deleteCribTool = (tNum) => { MachiningOS.deleteTool(tNum); renderCrib(); };

    if (matSelect) matSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');
    renderStock(); renderCrib();
});