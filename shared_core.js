/**
 * Machining_OS | Shared Core Logic
 * Version: 5.6 (Precision Glass // Unified Data Source & Manual Types)
 */

const MACHINING_DB = {
    MATERIALS: {
        'ALU': { 
            name: 'Aluminium (6082-T6)', 
            vc_hm: 450, vc_hss: 90, fz_ref: 0.08, 
            density: 2.71, kc1: 700, mc: 0.25,
            ui_color: '#10b981'
        },
        'MESSING': { 
            name: 'Messing (Ms58)', 
            vc_hm: 180, vc_hss: 45, fz_ref: 0.07, 
            density: 8.47, kc1: 600, mc: 0.22,
            ui_color: '#10b981'
        },
        'STAAL': { 
            name: 'Konstruktionsstål (S355)', 
            vc_hm: 140, vc_hss: 28, fz_ref: 0.06, 
            density: 7.85, kc1: 1500, mc: 0.25,
            ui_color: '#3b82f6'
        },
        'RUSTFAST': { 
            name: 'Rustfast (AISI 316)', 
            vc_hm: 85, vc_hss: 16, fz_ref: 0.04, 
            density: 8.00, kc1: 1900, mc: 0.24,
            ui_color: '#fbbf24'
        },
        'VAERKTOJSSTAAL': { 
            name: 'Værktøjsstål (1.2379)', 
            vc_hm: 65, vc_hss: 12, fz_ref: 0.035, 
            density: 7.70, kc1: 2100, mc: 0.25,
            ui_color: '#1e3a8a'
        },
        'POM': { 
            name: 'POM-C (Acetal)', 
            vc_hm: 350, vc_hss: 100, fz_ref: 0.12, 
            density: 1.41, kc1: 150, mc: 0.20,
            ui_color: '#f4f4f5'
        },
        'NYLON': { 
            name: 'Nylon (PA6)', 
            vc_hm: 220, vc_hss: 80, fz_ref: 0.10, 
            density: 1.14, kc1: 120, mc: 0.20,
            ui_color: '#f4f4f5'
        },
        'TITANIUM': { 
            name: 'Titanium (Gr. 5)', 
            vc_hm: 45, vc_hss: 10, fz_ref: 0.03, 
            density: 4.43, kc1: 1300, mc: 0.23,
            ui_color: '#ef4444'
        }
    },
    MACHINES: {
        'HAAS_MINI': { name: 'Haas Mini Mill', maxRpm: 10000, maxFeed: 15000, type: 'cnc' },
        'HAAS_ST10': { name: 'Haas ST-10', maxRpm: 6000, maxFeed: 12000, type: 'cnc' },
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
        if (index !== -1) {
            tools[index] = tool;
        } else {
            tools.push(tool);
        }
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
                    window.dispatchEvent(new CustomEvent('os-state-change', { detail: { key: id, value: e.target.value } }));
                });
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', MachiningOS.initSharedFields);