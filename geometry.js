/**
 * Machining_OS | Precision Geometry Logic
 * 500% Optimization: Sine Bar, PCD Visuals & Coordinate Rotation
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCER ---
    const sineL = document.getElementById('sine-l');
    const sineA = document.getElementById('sine-angle');
    const sineHText = document.getElementById('sine-h');

    const rotX = document.getElementById('rot-x');
    const rotY = document.getElementById('rot-y');
    const rotA = document.getElementById('rot-angle');
    const rotOutX = document.getElementById('rot-out-x');
    const rotOutY = document.getElementById('rot-out-y');

    const pcdDia = document.getElementById('pcd-dia');
    const pcdN = document.getElementById('pcd-n');
    const pcdStart = document.getElementById('pcd-start');
    const pcdList = document.getElementById('pcd-list');
    const pHolesG = document.getElementById('pcd-holes');

    // --- INITIALISERING ---
    function initGeometry() {
        calcSine();
        calcRotation();
        calcPCD();
    }

    // --- SINUSLINEAL LOGIK (H = L * sin(α)) ---
    function calcSine() {
        const l = parseFloat(sineL.value);
        const a = parseFloat(sineA.value) || 0;
        const h = l * Math.sin(a * (Math.PI / 180));
        sineHText.textContent = h.toFixed(4);
    }

    // --- KOORDINAT ROTATION LOGIK ---
    // Essentielt for finmekanikere når et emne er spændt skævt op.
    function calcRotation() {
        const x = parseFloat(rotX.value) || 0;
        const y = parseFloat(rotY.value) || 0;
        const a = parseFloat(rotA.value) || 0;
        const rad = a * (Math.PI / 180);

        // Standard rotations-matrix formel
        const nx = x * Math.cos(rad) - y * Math.sin(rad);
        const ny = x * Math.sin(rad) + y * Math.cos(rad);

        rotOutX.textContent = nx.toFixed(4);
        rotOutY.textContent = ny.toFixed(4);
    }

    // --- PCD GENERATOR (Med SVG Preview) ---
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
            <table class="w-full text-left text-[10px] font-mono">
                <tr class="text-zinc-600 bg-black sticky top-0 border-b border-zinc-800">
                    <th class="p-3">Hul #</th><th class="p-3 text-primary">X (Relativ)</th><th class="p-3 text-primary">Y (Relativ)</th>
                </tr>`;

        let holesSVG = '';
        const r = d / 2;

        for (let i = 0; i < n; i++) {
            const angleDeg = start + (i * (360 / n));
            const angleRad = angleDeg * (Math.PI / 180);
            
            // X = R * cos(a), Y = R * sin(a)
            const x = r * Math.cos(angleRad);
            const y = r * Math.sin(angleRad);
            
            html += `
                <tr class="border-b border-zinc-900 hover:bg-primary/5 transition-colors">
                    <td class="p-3 text-zinc-500 font-black">${i + 1}</td>
                    <td class="p-3 text-white font-bold">${x.toFixed(4)}</td>
                    <td class="p-3 text-white font-bold">${y.toFixed(4)}</td>
                </tr>`;

            // SVG holes (center 60,60, scale radius to fit 50px)
            const svgX = 60 + 50 * Math.cos(angleRad);
            const svgY = 60 - 50 * Math.sin(angleRad); // SVG Y er inverteret
            holesSVG += `<circle cx="${svgX}" cy="${svgY}" r="2" fill="#f59e0b" />`;
            holesSVG += `<text x="${svgX + 4}" y="${svgY - 4}" fill="#71717a" font-size="4">${i+1}</text>`;
        }

        html += `</table>`;
        pcdList.innerHTML = html;
        pHolesG.innerHTML = holesSVG;
    }

    // --- EVENT LISTENERS ---
    [sineL, sineA].forEach(el => el.addEventListener('input', calcSine));
    [rotX, rotY, rotA].forEach(el => el.addEventListener('input', calcRotation));
    [pcdDia, pcdN, pcdStart].forEach(el => el.addEventListener('input', calcPCD));

    initGeometry();
});