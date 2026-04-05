/**
 * Machining_OS | Precision Geometry Logic
 * Version: 5.8 (Sine Bar, Chamfer Z, True Position & PCD Blueprint)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    // Sine Bar
    const sineL = document.getElementById('sine-l');
    const sineA = document.getElementById('sine-angle');
    const sineHText = document.getElementById('sine-h');

    // Chamfer Z (NY)
    const chamferA = document.getElementById('chamfer-a');
    const chamferDmax = document.getElementById('chamfer-d-max');
    const chamferDhole = document.getElementById('chamfer-d-hole');
    const chamferOutZ = document.getElementById('chamfer-out-z');

    // Coordinate Rotation
    const rotX = document.getElementById('rot-x');
    const rotY = document.getElementById('rot-y');
    const rotA = document.getElementById('rot-angle');
    const rotOutX = document.getElementById('rot-out-x');
    const rotOutY = document.getElementById('rot-out-y');

    // True Position (NY)
    const tpX = document.getElementById('tp-x');
    const tpY = document.getElementById('tp-y');
    const tpOut = document.getElementById('tp-out');

    // PCD
    const pcdDia = document.getElementById('pcd-dia');
    const pcdN = document.getElementById('pcd-n');
    const pcdStart = document.getElementById('pcd-start');
    const pcdList = document.getElementById('pcd-list');
    const pHolesG = document.getElementById('pcd-holes');

    // --- INITIALISERING ---
    function initGeometry() {
        calcSine();
        calcChamfer();
        calcRotation();
        calcTruePosition();
        calcPCD();
    }

    // --- SINUSLINEAL LOGIK (H = L * sin(α)) ---
    function calcSine() {
        const l = parseFloat(sineL.value);
        const a = parseFloat(sineA.value) || 0;
        const h = l * Math.sin(a * (Math.PI / 180));
        sineHText.textContent = Math.abs(h).toFixed(4);
    }

    // --- CHAMFER Z-DYBDE (Z = (D - d) / (2 * tan(α/2))) ---
    function calcChamfer() {
        const a = parseFloat(chamferA.value) || 90;
        const D = parseFloat(chamferDmax.value) || 0;
        const d = parseFloat(chamferDhole.value) || 0;

        if (D <= d) {
            chamferOutZ.textContent = "0.000";
            return;
        }

        const angleRad = (a / 2) * (Math.PI / 180);
        const z = (D - d) / (2 * Math.tan(angleRad));
        
        chamferOutZ.textContent = z.toFixed(3);
    }

    // --- KOORDINAT ROTATION (x' = x*cos - y*sin) ---
    function calcRotation() {
        const x = parseFloat(rotX.value) || 0;
        const y = parseFloat(rotY.value) || 0;
        const a = parseFloat(rotA.value) || 0;
        const rad = a * (Math.PI / 180);

        const nx = x * Math.cos(rad) - y * Math.sin(rad);
        const ny = x * Math.sin(rad) + y * Math.cos(rad);

        rotOutX.textContent = nx.toFixed(4);
        rotOutY.textContent = ny.toFixed(4);
    }

    // --- TRUE POSITION (TP = 2 * sqrt(dx^2 + dy^2)) ---
    function calcTruePosition() {
        const dx = parseFloat(tpX.value) || 0;
        const dy = parseFloat(tpY.value) || 0;

        const tp = 2 * Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        
        tpOut.textContent = tp.toFixed(4);
        
        // UX feedback hvis TP er out of bounds
        if (tp > 0.1) {
            tpOut.classList.replace('text-white', 'text-red-500');
        } else {
            tpOut.classList.replace('text-red-500', 'text-white');
        }
    }

    // --- PCD GENERATOR (Blueprint SVG) ---
    function calcPCD() {
        const d = parseFloat(pcdDia.value) || 0;
        const n = parseInt(pcdN.value) || 0;
        const start = parseFloat(pcdStart.value) || 0;
        
        if (d <= 0 || n <= 0) {
            pcdList.innerHTML = '';
            pHolesG.innerHTML = '';
            return;
        }

        let html = `
            <table class="w-full text-left text-[10px] font-mono tabular-nums">
                <tr class="text-zinc-600 bg-black sticky top-0 border-b border-zinc-800 z-10">
                    <th class="p-3">#</th>
                    <th class="p-3 text-primary">X (Relativ)</th>
                    <th class="p-3 text-primary">Y (Relativ)</th>
                </tr>`;

        let holesSVG = '';
        const r = d / 2;

        for (let i = 0; i < n; i++) {
            const angleDeg = start + (i * (360 / n));
            const angleRad = angleDeg * (Math.PI / 180);
            
            const x = r * Math.cos(angleRad);
            const y = r * Math.sin(angleRad);
            
            // X/Y Formatering (tilføj + hvis positiv for G-code læsbarhed)
            const xStr = (x >= 0 ? "+" : "") + x.toFixed(4);
            const yStr = (y >= 0 ? "+" : "") + y.toFixed(4);

            html += `
                <tr class="border-b border-zinc-900/50 hover:bg-primary/10 transition-colors group">
                    <td class="p-3 text-zinc-600 font-black group-hover:text-primary transition-colors">${i + 1}</td>
                    <td class="p-3 text-white font-bold">${xStr}</td>
                    <td class="p-3 text-white font-bold">${yStr}</td>
                </tr>`;

            // SVG Blueprint render (skaleret til radius=50px i 120x120 viewBox)
            const svgX = 60 + 50 * Math.cos(angleRad);
            const svgY = 60 - 50 * Math.sin(angleRad); // Inverteret Y for korrekt skærm-tegning
            
            // Cross ved hvert hul
            holesSVG += `
                <g class="transition-all hover:opacity-50">
                    <line x1="${svgX-2}" y1="${svgY}" x2="${svgX+2}" y2="${svgY}" stroke="#f59e0b" stroke-width="0.5"/>
                    <line x1="${svgX}" y1="${svgY-2}" x2="${svgX}" y2="${svgY+2}" stroke="#f59e0b" stroke-width="0.5"/>
                    <circle cx="${svgX}" cy="${svgY}" r="1.5" fill="none" stroke="#f59e0b" stroke-width="0.5" />
                    <text x="${svgX + 3}" y="${svgY - 3}" fill="#71717a" font-size="4" font-weight="bold">${i+1}</text>
                </g>`;
        }

        html += `</table>`;
        pcdList.innerHTML = html;
        pHolesG.innerHTML = holesSVG;
    }

    // --- EVENT LISTENERS ---
    [sineL, sineA].forEach(el => el.addEventListener('input', calcSine));
    [chamferA, chamferDmax, chamferDhole].forEach(el => el.addEventListener('input', calcChamfer));
    [rotX, rotY, rotA].forEach(el => el.addEventListener('input', calcRotation));
    [tpX, tpY].forEach(el => el.addEventListener('input', calcTruePosition));
    [pcdDia, pcdN, pcdStart].forEach(el => el.addEventListener('input', calcPCD));

    initGeometry();
});