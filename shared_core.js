/**
 * Machining_OS | Shared Core Logic v8.0
 * Physics Engine & Metrology Data Matrix
 */

const MACHINING_DB = {
    PHYSICS: {
        E_MODULUS_HM: 600,  // GPa (Carbide) [cite: 2026-03-11]
        E_MODULUS_HSS: 210, // GPa (High Speed Steel) [cite: 2026-03-11]
        TORQUE_EFFICIENCY: 0.85
    },
    MATERIALS: {
        'ALU': { 
            name: 'Aluminium (6082-T6)', hb: 95, 
            vc_hm: 450, vc_hss: 90, fz_ref: 0.025, 
            density: 2.71, kc1: 700, mc: 0.25,
            thermal: 23.6, ui_color: '#10b981'
        },
        'MESSING': { 
            name: 'Messing (Ms58)', hb: 120, 
            vc_hm: 180, vc_hss: 45, fz_ref: 0.020, 
            density: 8.47, kc1: 600, mc: 0.22,
            thermal: 20.5, ui_color: '#10b981'
        },
        'STAAL': { 
            name: 'Konstruktionsstål (S355)', hb: 170, 
            vc_hm: 220, vc_hss: 30, fz_ref: 0.015, 
            density: 7.85, kc1: 1500, mc: 0.25,
            thermal: 12.0, ui_color: '#3b82f6'
        },
        'RUSTFAST': { 
            name: 'Rustfast (AISI 316L)', hb: 190, 
            vc_hm: 80, vc_hss: 15, fz_ref: 0.008, 
            density: 8.00, kc1: 1900, mc: 0.24,
            thermal: 16.0, ui_color: '#fbbf24'
        },
        'VAERKTOJSSTAAL': { 
            name: 'Værktøjsstål (1.2379)', hb: 230, 
            vc_hm: 65, vc_hss: 12, fz_ref: 0.006, 
            density: 7.70, kc1: 2100, mc: 0.25,
            thermal: 10.5, ui_color: '#1e3a8a'
        },
        'POM': { 
            name: 'POM-C (Acetal)', hb: 30, 
            vc_hm: 500, vc_hss: 120, fz_ref: 0.040, 
            density: 1.41, kc1: 150, mc: 0.20,
            thermal: 110.0, ui_color: '#f4f4f5'
        },
        'TITANIUM': { 
            name: 'Titanium (Gr. 5)', hb: 330, 
            vc_hm: 45, vc_hss: 10, fz_ref: 0.010, 
            density: 4.43, kc1: 1300, mc: 0.23,
            thermal: 8.6, ui_color: '#ef4444'
        }
    },
    MACHINES: {
        'HAAS_MINI': { name: 'Haas Mini Mill', maxRpm: 10000, maxFeed: 15000, kw: 5.6, maxNm: 23, type: 'cnc' },
        'HAAS_ST10': { name: 'Haas ST-10', maxRpm: 6000, maxFeed: 12000, kw: 11.2, maxNm: 101, type: 'cnc' },
        'DECKEL': { name: 'Deckel FP1', maxRpm: 2500, maxFeed: 1000, type: 'manual_mill' },
        'WEILER': { name: 'Weiler Matador', maxRpm: 3550, maxFeed: 2000, type: 'manual_turn' }
    }
};

const MachiningOS = {
    saveState: (data) => {
        const currentState = JSON.parse(localStorage.getItem('machining_os_state')) || {};
        localStorage.setItem('machining_os_state', JSON.stringify({ ...currentState, ...data }));
    },
    getState: () => JSON.parse(localStorage.getItem('machining_os_state')) || {},
    saveLogEntry: (moduleKey, entry) => {
        const logs = JSON.parse(localStorage.getItem(`machining_os_log_${moduleKey}`)) || [];
        entry.id = Date.now();
        logs.push(entry);
        localStorage.setItem(`machining_os_log_${moduleKey}`, JSON.stringify(logs));
        return entry;
    },
    getLogs: (moduleKey) => JSON.parse(localStorage.getItem(`machining_os_log_${moduleKey}`)) || [],
    deleteLogEntry: (moduleKey, id) => {
        let logs = JSON.parse(localStorage.getItem(`machining_os_log_${moduleKey}`)) || [];
        logs = logs.filter(log => log.id.toString() !== id.toString());
        localStorage.setItem(`machining_os_log_${moduleKey}`, JSON.stringify(logs));
    },
    clearLogs: (moduleKey) => localStorage.removeItem(`machining_os_log_${moduleKey}`),
    saveTool: (tool) => {
        let tools = JSON.parse(localStorage.getItem('machining_os_tools')) || [];
        const index = tools.findIndex(t => t.t === tool.t);
        if (index !== -1) { tools[index] = tool; } else { tools.push(tool); }
        localStorage.setItem('machining_os_tools', JSON.stringify(tools));
    },
    getTools: () => JSON.parse(localStorage.getItem('machining_os_tools')) || [],
    deleteTool: (tNum) => {
        let tools = JSON.parse(localStorage.getItem('machining_os_tools')) || [];
        tools = tools.filter(t => t.t !== tNum);
        localStorage.setItem('machining_os_tools', JSON.stringify(tools));
    },
    initSharedFields: () => {
        const state = MachiningOS.getState();
        const commonInputs = ['job-part', 'job-program', 'job-rev', 'work-material', 'machine-select'];
        commonInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (state[id]) el.value = state[id];
                el.addEventListener('change', (e) => {
                    MachiningOS.saveState({ [id]: e.target.value });
                });
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', MachiningOS.initSharedFields);