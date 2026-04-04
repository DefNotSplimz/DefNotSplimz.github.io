/**
 * Machining_OS | Shared Core Logic
 * Version: 5.1 (Persistent Data Edition)
 */

const MACHINING_DB = {
    MATERIALS: {
        'ALU': { name: 'Aluminium (6082-T6)', vc_hm: 450, vc_hss: 90, fz_ref: 0.08, thermal: 23.1, density: 2.71, ae_lim: 0.40, ap_lim: 2.0 },
        'MESSING': { name: 'Messing (Ms58)', vc_hm: 180, vc_hss: 45, fz_ref: 0.07, thermal: 18.5, density: 8.47, ae_lim: 0.25, ap_lim: 1.5 },
        'STAAL': { name: 'Konstruktionsstål (S355)', vc_hm: 140, vc_hss: 28, fz_ref: 0.06, thermal: 12.0, density: 7.85, ae_lim: 0.15, ap_lim: 1.0 },
        'RUSTFAST': { name: 'Rustfast (AISI 316)', vc_hm: 85, vc_hss: 16, fz_ref: 0.04, thermal: 16.0, density: 8.00, ae_lim: 0.10, ap_lim: 0.8 },
        'VAERKTOJSSTAAL': { name: 'Værktøjsstål (1.2379)', vc_hm: 65, vc_hss: 12, fz_ref: 0.035, thermal: 11.0, density: 7.70, ae_lim: 0.08, ap_lim: 0.5 },
        'POM': { name: 'POM-C (Acetal)', vc_hm: 350, vc_hss: 100, fz_ref: 0.12, thermal: 110.0, density: 1.41, ae_lim: 0.50, ap_lim: 2.5 },
        'NYLON': { name: 'Nylon (PA6)', vc_hm: 220, vc_hss: 80, fz_ref: 0.10, thermal: 90.0, density: 1.14, ae_lim: 0.40, ap_lim: 2.0 },
        'TITANIUM': { name: 'Titanium (Gr. 5)', vc_hm: 45, vc_hss: 10, fz_ref: 0.03, thermal: 8.6, density: 4.43, ae_lim: 0.07, ap_lim: 0.4 }
    },
    MACHINES: {
        'HAAS_MINI': { name: 'Haas Mini Mill', maxRpm: 10000, maxFeed: 15000, type: 'cnc' },
        'HAAS_ST10': { name: 'Haas ST-10', maxRpm: 6000, maxFeed: 12000, type: 'cnc' },
        'DECKEL': { name: 'Deckel FP1', maxRpm: 2500, maxFeed: 1000, type: 'manual' },
        'WEILER': { name: 'Weiler Matador', maxRpm: 3550, maxFeed: 2000, type: 'manual' }
    }
};

const MachiningOS = {
    // --- STATE MANAGEMENT ---
    saveState: (data) => {
        const currentState = JSON.parse(localStorage.getItem('machining_os_state')) || {};
        localStorage.setItem('machining_os_state', JSON.stringify({ ...currentState, ...data }));
    },
    getState: () => JSON.parse(localStorage.getItem('machining_os_state')) || {},

    // --- LOGGING (Setup Sheets) ---
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
        logs = logs.filter(log => log.id !== id);
        localStorage.setItem(`machining_os_log_${moduleKey}`, JSON.stringify(logs));
    },
    clearLogs: (moduleKey) => localStorage.removeItem(`machining_os_log_${moduleKey}`),

    // --- TOOL CRIB (Universal) ---
    saveTool: (tool) => {
        const tools = JSON.parse(localStorage.getItem('machining_os_tools')) || [];
        tools.push(tool);
        localStorage.setItem('machining_os_tools', JSON.stringify(tools));
    },
    getTools: () => JSON.parse(localStorage.getItem('machining_os_tools')) || [],
    deleteTool: (tNum) => {
        let tools = JSON.parse(localStorage.getItem('machining_os_tools')) || [];
        tools = tools.filter(t => t.t !== tNum);
        localStorage.setItem('machining_os_tools', JSON.stringify(tools));
    },

    // --- UI HELPERS ---
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