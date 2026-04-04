/**
 * Machining_OS | Inventory Logic
 * Version: 5.0 (Material Logistics & Mass Calculation)
 */

document.addEventListener('DOMContentLoaded', () => {
    const stockForm = document.getElementById('stock-form');
    const inventoryTableBody = document.getElementById('inventory-table-body');
    const matSelect = document.getElementById('work-material');
    const totalWeightDisplay = document.getElementById('total-stock-weight');

    // --- INITIALISERING ---
    function initInventory() {
        // Udfyld materialer fra global DB
        matSelect.innerHTML = Object.entries(MACHINING_DB.MATERIALS)
            .map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');

        renderInventory();
    }

    // --- VÆGTBEREGNING (Mikron Præcision) ---
    function calculateItemWeight(matKey, type, dimStr, lengthMm) {
        const material = MACHINING_DB.MATERIALS[matKey];
        const density = material.density; // g/cm³
        let volumeCm3 = 0;

        if (type === 'round') {
            const diameter = parseFloat(dimStr);
            const radius = diameter / 2;
            // Volumen = pi * r² * h (konverter mm til cm: /10)
            volumeCm3 = (Math.PI * Math.pow(radius / 10, 2)) * (lengthMm / 10);
        } else {
            // Antag BxH format (f.eks. 50x10)
            const parts = dimStr.toLowerCase().split('x');
            const width = parseFloat(parts[0]);
            const height = parts[1] ? parseFloat(parts[1]) : width;
            volumeCm3 = (width / 10) * (height / 10) * (lengthMm / 10);
        }

        // Vægt i kg = (Volumen * Densitet) / 1000
        return (volumeCm3 * density) / 1000;
    }

    // --- FORM HANDLING ---
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
            type: type === 'round' ? 'Rund' : 'Flad/Plade',
            dim: dim,
            len: len,
            weight: weight
        };

        MachiningOS.saveLogEntry('inventory_stock', entry);
        stockForm.reset();
        renderInventory();
    });

    // --- RENDER LOGIK ---
    function renderInventory() {
        const stock = MachiningOS.getLogs('inventory_stock');
        let totalKg = 0;

        if (stock.length === 0) {
            inventoryTableBody.innerHTML = `<tr><td colspan="6" class="p-12 text-center text-zinc-700 italic font-mono uppercase text-[10px]">Lageret er tomt. Registrér råmateriale ovenfor.</td></tr>`;
            totalWeightDisplay.textContent = "0.00 kg";
            return;
        }

        inventoryTableBody.innerHTML = stock.map(item => {
            totalKg += item.weight;
            return `
            <tr class="hover:bg-white/5 transition-colors border-b border-zinc-900/50">
                <td class="p-4 text-white font-black">${item.matName}</td>
                <td class="p-4 text-zinc-500 uppercase italic">${item.type}</td>
                <td class="p-4 text-white">${item.dim} mm</td>
                <td class="p-4 text-white">${item.len} mm</td>
                <td class="p-4 text-primary font-bold">${item.weight.toFixed(3)} kg</td>
                <td class="p-4 text-right">
                    <button onclick="deleteStockItem(${item.id})" class="text-zinc-700 hover:text-red-500 font-black">SLET</button>
                </td>
            </tr>`;
        }).join('');

        totalWeightDisplay.textContent = `${totalKg.toFixed(2)} kg`;
    }

    window.deleteStockItem = (id) => {
        MachiningOS.deleteLogEntry('inventory_stock', id);
        renderInventory();
    };

    initInventory();
});