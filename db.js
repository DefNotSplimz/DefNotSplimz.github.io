const cutDB = {
    "Alu 6082-T6": {
        coolant: "Emulsion / Sprit", note: "Brug polerede skær (CCGT/DCGT). Undgå ægopbygning.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 400, fz: 0.15}, HSS: {vc: 100, fz: 0.08} },
                fin:   { HM: {vc: 600, fz: 0.05}, HSS: {vc: 120, fz: 0.03} },
                slot:  { HM: {vc: 300, fz: 0.10}, HSS: {vc: 80,  fz: 0.05} },
                drill: { HM: {vc: 150, f: 0.15},  HSS: {vc: 60,  f: 0.10} }
            },
            LATHE: {
                rough: { HM: {vc: 500, f: 0.30},  HSS: {vc: 120, f: 0.15} },
                fin:   { HM: {vc: 800, f: 0.08},  HSS: {vc: 150, f: 0.05} },
                groove:{ HM: {vc: 300, f: 0.12},  HSS: {vc: 80,  f: 0.06} },
                drill: { HM: {vc: 150, f: 0.15},  HSS: {vc: 60,  f: 0.10} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 250, fz: 0.10}, HSS: {vc: 80, fz: 0.08} },
                fin:   { HM: {vc: 350, fz: 0.04}, HSS: {vc: 100, fz: 0.02} },
                slot:  { HM: {vc: 150, fz: 0.06}, HSS: {vc: 60, fz: 0.04} },
                drill: { HM: {vc: 100, f: 0.12},  HSS: {vc: 50, f: 0.10} }
            },
            LATHE: {
                rough: { HM: {vc: 250, f: 0.20},  HSS: {vc: 80, f: 0.12} },
                fin:   { HM: {vc: 400, f: 0.05},  HSS: {vc: 100, f: 0.03} },
                groove:{ HM: {vc: 150, f: 0.08},  HSS: {vc: 60, f: 0.05} },
                drill: { HM: {vc: 100, f: 0.12},  HSS: {vc: 50, f: 0.10} }
            }
        }
    },
    "Alu 7075-T6 (Ergal)": {
        coolant: "Emulsion / Sprit", note: "Aerospace Alu. Nær stål-styrke, kort spån. Slider på HSS.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 350, fz: 0.15}, HSS: {vc: 80, fz: 0.06} },
                fin:   { HM: {vc: 500, fz: 0.05}, HSS: {vc: 100, fz: 0.03} },
                slot:  { HM: {vc: 250, fz: 0.08}, HSS: {vc: 60,  fz: 0.04} },
                drill: { HM: {vc: 120, f: 0.12},  HSS: {vc: 50,  f: 0.08} }
            },
            LATHE: {
                rough: { HM: {vc: 450, f: 0.25},  HSS: {vc: 100, f: 0.12} },
                fin:   { HM: {vc: 600, f: 0.08},  HSS: {vc: 120, f: 0.05} },
                groove:{ HM: {vc: 250, f: 0.10},  HSS: {vc: 70,  f: 0.05} },
                drill: { HM: {vc: 120, f: 0.12},  HSS: {vc: 50,  f: 0.08} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 200, fz: 0.08}, HSS: {vc: 60, fz: 0.06} },
                fin:   { HM: {vc: 300, fz: 0.03}, HSS: {vc: 80, fz: 0.02} },
                slot:  { HM: {vc: 120, fz: 0.05}, HSS: {vc: 50, fz: 0.03} },
                drill: { HM: {vc: 80,  f: 0.10},  HSS: {vc: 40, f: 0.08} }
            },
            LATHE: {
                rough: { HM: {vc: 200, f: 0.15},  HSS: {vc: 60, f: 0.10} },
                fin:   { HM: {vc: 300, f: 0.05},  HSS: {vc: 80, f: 0.03} },
                groove:{ HM: {vc: 120, f: 0.08},  HSS: {vc: 40, f: 0.04} },
                drill: { HM: {vc: 80,  f: 0.10},  HSS: {vc: 40, f: 0.08} }
            }
        }
    },
    "Messing Ms58": {
        coolant: "Tør / Let Emulsion", note: "Slib spånvinkel til 0° på HSS bor, ellers hugger boret fast.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 200, fz: 0.15}, HSS: {vc: 80, fz: 0.10} },
                fin:   { HM: {vc: 300, fz: 0.05}, HSS: {vc: 100, fz: 0.05} },
                slot:  { HM: {vc: 150, fz: 0.10}, HSS: {vc: 60, fz: 0.06} },
                drill: { HM: {vc: 120, f: 0.15},  HSS: {vc: 50, f: 0.12} }
            },
            LATHE: {
                rough: { HM: {vc: 300, f: 0.30},  HSS: {vc: 100, f: 0.15} },
                fin:   { HM: {vc: 400, f: 0.05},  HSS: {vc: 120, f: 0.05} },
                groove:{ HM: {vc: 200, f: 0.12},  HSS: {vc: 80,  f: 0.08} },
                drill: { HM: {vc: 120, f: 0.15},  HSS: {vc: 50,  f: 0.12} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 150, fz: 0.10}, HSS: {vc: 60, fz: 0.08} },
                fin:   { HM: {vc: 200, fz: 0.04}, HSS: {vc: 80, fz: 0.03} },
                slot:  { HM: {vc: 100, fz: 0.06}, HSS: {vc: 45, fz: 0.05} },
                drill: { HM: {vc: 80,  f: 0.12},  HSS: {vc: 40, f: 0.10} }
            },
            LATHE: {
                rough: { HM: {vc: 180, f: 0.20},  HSS: {vc: 80, f: 0.12} },
                fin:   { HM: {vc: 250, f: 0.05},  HSS: {vc: 100, f: 0.04} },
                groove:{ HM: {vc: 120, f: 0.10},  HSS: {vc: 50, f: 0.06} },
                drill: { HM: {vc: 80,  f: 0.12},  HSS: {vc: 40, f: 0.10} }
            }
        }
    },
    "Fosforbronze CuSn8": {
        coolant: "Emulsion", note: "Sejt og slidstærkt. Giver uregelmæssige spåner. Kræver skarpt værktøj.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 140, fz: 0.10}, HSS: {vc: 40, fz: 0.06} },
                fin:   { HM: {vc: 180, fz: 0.04}, HSS: {vc: 50, fz: 0.03} },
                slot:  { HM: {vc: 100, fz: 0.06}, HSS: {vc: 30, fz: 0.04} },
                drill: { HM: {vc: 80,  f: 0.10},  HSS: {vc: 25, f: 0.08} }
            },
            LATHE: {
                rough: { HM: {vc: 200, f: 0.20},  HSS: {vc: 50, f: 0.10} },
                fin:   { HM: {vc: 250, f: 0.05},  HSS: {vc: 60, f: 0.05} },
                groove:{ HM: {vc: 120, f: 0.08},  HSS: {vc: 35, f: 0.05} },
                drill: { HM: {vc: 80,  f: 0.10},  HSS: {vc: 25, f: 0.08} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 100, fz: 0.08}, HSS: {vc: 30, fz: 0.05} },
                fin:   { HM: {vc: 130, fz: 0.03}, HSS: {vc: 40, fz: 0.02} },
                slot:  { HM: {vc: 70,  fz: 0.05}, HSS: {vc: 20, fz: 0.03} },
                drill: { HM: {vc: 60,  f: 0.08},  HSS: {vc: 20, f: 0.06} }
            },
            LATHE: {
                rough: { HM: {vc: 120, f: 0.15},  HSS: {vc: 40, f: 0.08} },
                fin:   { HM: {vc: 160, f: 0.04},  HSS: {vc: 50, f: 0.04} },
                groove:{ HM: {vc: 80,  f: 0.06},  HSS: {vc: 25, f: 0.04} },
                drill: { HM: {vc: 60,  f: 0.08},  HSS: {vc: 20, f: 0.06} }
            }
        }
    },
    "Automatstål 11SMn30": {
        coolant: "Emulsion / Olie", note: "Blylegeret for max bearbejdelighed. Kort spån.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 150, fz: 0.15}, HSS: {vc: 40, fz: 0.08} },
                fin:   { HM: {vc: 200, fz: 0.05}, HSS: {vc: 50, fz: 0.04} },
                slot:  { HM: {vc: 120, fz: 0.10}, HSS: {vc: 30, fz: 0.05} },
                drill: { HM: {vc: 100, f: 0.15},  HSS: {vc: 35, f: 0.10} }
            },
            LATHE: {
                rough: { HM: {vc: 220, f: 0.30},  HSS: {vc: 50, f: 0.15} },
                fin:   { HM: {vc: 280, f: 0.08},  HSS: {vc: 60, f: 0.05} },
                groove:{ HM: {vc: 150, f: 0.12},  HSS: {vc: 35, f: 0.08} },
                drill: { HM: {vc: 100, f: 0.15},  HSS: {vc: 35, f: 0.10} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 100, fz: 0.10}, HSS: {vc: 30, fz: 0.06} },
                fin:   { HM: {vc: 130, fz: 0.04}, HSS: {vc: 40, fz: 0.03} },
                slot:  { HM: {vc: 80,  fz: 0.06}, HSS: {vc: 20, fz: 0.04} },
                drill: { HM: {vc: 70,  f: 0.12},  HSS: {vc: 25, f: 0.08} }
            },
            LATHE: {
                rough: { HM: {vc: 140, f: 0.20},  HSS: {vc: 40, f: 0.12} },
                fin:   { HM: {vc: 180, f: 0.05},  HSS: {vc: 50, f: 0.04} },
                groove:{ HM: {vc: 100, f: 0.08},  HSS: {vc: 25, f: 0.05} },
                drill: { HM: {vc: 70,  f: 0.12},  HSS: {vc: 25, f: 0.08} }
            }
        }
    },
    "Konst. stål S355": {
        coolant: "Emulsion", note: "Standard maskinstål. Bliver sejt og river ved for lave hastigheder.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 110, fz: 0.12}, HSS: {vc: 25, fz: 0.06} },
                fin:   { HM: {vc: 150, fz: 0.05}, HSS: {vc: 35, fz: 0.03} },
                slot:  { HM: {vc: 80,  fz: 0.08}, HSS: {vc: 20, fz: 0.04} },
                drill: { HM: {vc: 70,  f: 0.12},  HSS: {vc: 25, f: 0.08} }
            },
            LATHE: {
                rough: { HM: {vc: 160, f: 0.25},  HSS: {vc: 30, f: 0.12} },
                fin:   { HM: {vc: 220, f: 0.08},  HSS: {vc: 40, f: 0.05} },
                groove:{ HM: {vc: 110, f: 0.10},  HSS: {vc: 20, f: 0.06} },
                drill: { HM: {vc: 70,  f: 0.12},  HSS: {vc: 25, f: 0.08} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 70, fz: 0.08}, HSS: {vc: 20, fz: 0.05} },
                fin:   { HM: {vc: 100, fz: 0.03}, HSS: {vc: 28, fz: 0.02} },
                slot:  { HM: {vc: 50, fz: 0.05}, HSS: {vc: 15, fz: 0.03} },
                drill: { HM: {vc: 50, f: 0.10},  HSS: {vc: 20, f: 0.06} }
            },
            LATHE: {
                rough: { HM: {vc: 100, f: 0.18},  HSS: {vc: 25, f: 0.10} },
                fin:   { HM: {vc: 140, f: 0.05},  HSS: {vc: 35, f: 0.04} },
                groove:{ HM: {vc: 70,  f: 0.06},  HSS: {vc: 15, f: 0.04} },
                drill: { HM: {vc: 50,  f: 0.10},  HSS: {vc: 20, f: 0.06} }
            }
        }
    },
    "Støbejern GG25": {
        coolant: "TØR", note: "Skærevæske danner slibepasta med grafitstøvet. Kør tørt med sug.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 140, fz: 0.15}, HSS: {vc: 35, fz: 0.08} },
                fin:   { HM: {vc: 180, fz: 0.06}, HSS: {vc: 45, fz: 0.04} },
                slot:  { HM: {vc: 100, fz: 0.10}, HSS: {vc: 25, fz: 0.05} },
                drill: { HM: {vc: 90,  f: 0.15},  HSS: {vc: 30, f: 0.10} }
            },
            LATHE: {
                rough: { HM: {vc: 180, f: 0.30},  HSS: {vc: 40, f: 0.15} },
                fin:   { HM: {vc: 250, f: 0.10},  HSS: {vc: 50, f: 0.06} },
                groove:{ HM: {vc: 120, f: 0.12},  HSS: {vc: 25, f: 0.08} },
                drill: { HM: {vc: 90,  f: 0.15},  HSS: {vc: 30, f: 0.10} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 90, fz: 0.10}, HSS: {vc: 25, fz: 0.06} },
                fin:   { HM: {vc: 120, fz: 0.04}, HSS: {vc: 35, fz: 0.03} },
                slot:  { HM: {vc: 60, fz: 0.06}, HSS: {vc: 18, fz: 0.04} },
                drill: { HM: {vc: 60, f: 0.12},  HSS: {vc: 20, f: 0.08} }
            },
            LATHE: {
                rough: { HM: {vc: 110, f: 0.20},  HSS: {vc: 30, f: 0.12} },
                fin:   { HM: {vc: 150, f: 0.06},  HSS: {vc: 40, f: 0.05} },
                groove:{ HM: {vc: 80,  f: 0.08},  HSS: {vc: 20, f: 0.05} },
                drill: { HM: {vc: 60,  f: 0.12},  HSS: {vc: 20, f: 0.08} }
            }
        }
    },
    "Sejhærdet 42CrMo4": {
        coolant: "Emulsion / Olie", note: "Høj trækstyrke. Æder fasen på HSS bor lynhurtigt.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 80,  fz: 0.10}, HSS: {vc: 18, fz: 0.05} },
                fin:   { HM: {vc: 110, fz: 0.04}, HSS: {vc: 25, fz: 0.02} },
                slot:  { HM: {vc: 60,  fz: 0.06}, HSS: {vc: 12, fz: 0.03} },
                drill: { HM: {vc: 50,  f: 0.10},  HSS: {vc: 15, f: 0.06} }
            },
            LATHE: {
                rough: { HM: {vc: 100, f: 0.20},  HSS: {vc: 20, f: 0.10} },
                fin:   { HM: {vc: 140, f: 0.06},  HSS: {vc: 30, f: 0.04} },
                groove:{ HM: {vc: 70,  f: 0.08},  HSS: {vc: 15, f: 0.05} },
                drill: { HM: {vc: 50,  f: 0.10},  HSS: {vc: 15, f: 0.06} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 50, fz: 0.06}, HSS: {vc: 12, fz: 0.04} },
                fin:   { HM: {vc: 75, fz: 0.03}, HSS: {vc: 18, fz: 0.02} },
                slot:  { HM: {vc: 35, fz: 0.04}, HSS: {vc: 8,  fz: 0.02} },
                drill: { HM: {vc: 30, f: 0.08},  HSS: {vc: 10, f: 0.05} }
            },
            LATHE: {
                rough: { HM: {vc: 70, f: 0.15},  HSS: {vc: 15, f: 0.08} },
                fin:   { HM: {vc: 100, f: 0.05},  HSS: {vc: 22, f: 0.03} },
                groove:{ HM: {vc: 50, f: 0.06},  HSS: {vc: 10, f: 0.04} },
                drill: { HM: {vc: 30, f: 0.08},  HSS: {vc: 10, f: 0.05} }
            }
        }
    },
    "Værktøjsstål (D2/O1)": {
        coolant: "Emulsion / Skæreolie", note: "Bearbejdes blødglødet. Ekstremt abrasivt, slider lynhurtigt værktøj.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 50, fz: 0.08}, HSS: {vc: 12, fz: 0.04} },
                fin:   { HM: {vc: 70, fz: 0.03}, HSS: {vc: 16, fz: 0.02} },
                slot:  { HM: {vc: 35, fz: 0.05}, HSS: {vc: 8,  fz: 0.02} },
                drill: { HM: {vc: 40, f: 0.08},  HSS: {vc: 10, f: 0.05} }
            },
            LATHE: {
                rough: { HM: {vc: 70, f: 0.15},  HSS: {vc: 15, f: 0.08} },
                fin:   { HM: {vc: 90, f: 0.05},  HSS: {vc: 20, f: 0.03} },
                groove:{ HM: {vc: 50, f: 0.06},  HSS: {vc: 10, f: 0.04} },
                drill: { HM: {vc: 40, f: 0.08},  HSS: {vc: 10, f: 0.05} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 30, fz: 0.05}, HSS: {vc: 8,  fz: 0.03} },
                fin:   { HM: {vc: 45, fz: 0.02}, HSS: {vc: 12, fz: 0.01} },
                slot:  { HM: {vc: 20, fz: 0.03}, HSS: {vc: 5,  fz: 0.02} },
                drill: { HM: {vc: 25, f: 0.06},  HSS: {vc: 6,  f: 0.04} }
            },
            LATHE: {
                rough: { HM: {vc: 45, f: 0.12},  HSS: {vc: 10, f: 0.06} },
                fin:   { HM: {vc: 60, f: 0.04},  HSS: {vc: 15, f: 0.02} },
                groove:{ HM: {vc: 35, f: 0.04},  HSS: {vc: 8,  f: 0.03} },
                drill: { HM: {vc: 25, f: 0.06},  HSS: {vc: 6,  f: 0.04} }
            }
        }
    },
    "Rustfri 304": {
        coolant: "Emulsion / Tyk Olie", note: "Tendens til klæb på skæret (BUE). Hold altid værktøjet i snit.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 90, fz: 0.08}, HSS: {vc: 18, fz: 0.04} },
                fin:   { HM: {vc: 120, fz: 0.04},HSS: {vc: 25, fz: 0.02} },
                slot:  { HM: {vc: 70, fz: 0.05}, HSS: {vc: 12, fz: 0.03} },
                drill: { HM: {vc: 60, f: 0.10},  HSS: {vc: 15, f: 0.06} }
            },
            LATHE: {
                rough: { HM: {vc: 110, f: 0.20}, HSS: {vc: 20, f: 0.10} },
                fin:   { HM: {vc: 150, f: 0.08}, HSS: {vc: 30, f: 0.04} },
                groove:{ HM: {vc: 80,  f: 0.08}, HSS: {vc: 15, f: 0.05} },
                drill: { HM: {vc: 60,  f: 0.10}, HSS: {vc: 15, f: 0.06} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 60, fz: 0.05}, HSS: {vc: 12, fz: 0.03} },
                fin:   { HM: {vc: 80, fz: 0.02}, HSS: {vc: 18, fz: 0.02} },
                slot:  { HM: {vc: 45, fz: 0.03}, HSS: {vc: 8,  fz: 0.02} },
                drill: { HM: {vc: 40, f: 0.08},  HSS: {vc: 10, f: 0.05} }
            },
            LATHE: {
                rough: { HM: {vc: 70, f: 0.15},  HSS: {vc: 15, f: 0.08} },
                fin:   { HM: {vc: 100, f: 0.05}, HSS: {vc: 22, f: 0.03} },
                groove:{ HM: {vc: 50, f: 0.05},  HSS: {vc: 10, f: 0.04} },
                drill: { HM: {vc: 40, f: 0.08},  HSS: {vc: 10, f: 0.05} }
            }
        }
    },
    "Rustfri 316L": {
        coolant: "Højtryk / Skærepasta", note: "Syrefast. Deformationshærder lynhurtigt ved stilstand i hullet!",
        CNC: {
            MILL: {
                rough: { HM: {vc: 75, fz: 0.06}, HSS: {vc: 15, fz: 0.03} },
                fin:   { HM: {vc: 95, fz: 0.03}, HSS: {vc: 20, fz: 0.02} },
                slot:  { HM: {vc: 55, fz: 0.04}, HSS: {vc: 10, fz: 0.02} },
                drill: { HM: {vc: 50, f: 0.08},  HSS: {vc: 12, f: 0.05} }
            },
            LATHE: {
                rough: { HM: {vc: 90, f: 0.18},  HSS: {vc: 18, f: 0.08} },
                fin:   { HM: {vc: 120, f: 0.06}, HSS: {vc: 25, f: 0.04} },
                groove:{ HM: {vc: 65, f: 0.06},  HSS: {vc: 12, f: 0.04} },
                drill: { HM: {vc: 50, f: 0.08},  HSS: {vc: 12, f: 0.05} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 45, fz: 0.04}, HSS: {vc: 10, fz: 0.02} },
                fin:   { HM: {vc: 60, fz: 0.02}, HSS: {vc: 14, fz: 0.01} },
                slot:  { HM: {vc: 30, fz: 0.03}, HSS: {vc: 6,  fz: 0.01} },
                drill: { HM: {vc: 30, f: 0.06},  HSS: {vc: 8,  f: 0.04} }
            },
            LATHE: {
                rough: { HM: {vc: 55, f: 0.12},  HSS: {vc: 12, f: 0.06} },
                fin:   { HM: {vc: 75, f: 0.04},  HSS: {vc: 18, f: 0.03} },
                groove:{ HM: {vc: 40, f: 0.04},  HSS: {vc: 8,  f: 0.03} },
                drill: { HM: {vc: 30, f: 0.06},  HSS: {vc: 8,  f: 0.04} }
            }
        }
    },
    "Duplex 1.4462": {
        coolant: "Emulsion / Tyk Olie", note: "Dobbelt-struktur. Voldsomt sejt. Undgå små tilspændinger.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 50, fz: 0.06}, HSS: {vc: 10, fz: 0.03} },
                fin:   { HM: {vc: 70, fz: 0.03}, HSS: {vc: 15, fz: 0.02} },
                slot:  { HM: {vc: 35, fz: 0.04}, HSS: {vc: 7,  fz: 0.02} },
                drill: { HM: {vc: 40, f: 0.08},  HSS: {vc: 8,  f: 0.04} }
            },
            LATHE: {
                rough: { HM: {vc: 65, f: 0.15},  HSS: {vc: 12, f: 0.08} },
                fin:   { HM: {vc: 90, f: 0.06},  HSS: {vc: 18, f: 0.04} },
                groove:{ HM: {vc: 45, f: 0.06},  HSS: {vc: 8,  f: 0.04} },
                drill: { HM: {vc: 40, f: 0.08},  HSS: {vc: 8,  f: 0.04} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 30, fz: 0.04}, HSS: {vc: 6,  fz: 0.02} },
                fin:   { HM: {vc: 45, fz: 0.02}, HSS: {vc: 10, fz: 0.01} },
                slot:  { HM: {vc: 20, fz: 0.03}, HSS: {vc: 5,  fz: 0.01} },
                drill: { HM: {vc: 25, f: 0.05},  HSS: {vc: 6,  f: 0.03} }
            },
            LATHE: {
                rough: { HM: {vc: 40, f: 0.10},  HSS: {vc: 8,  f: 0.06} },
                fin:   { HM: {vc: 60, f: 0.04},  HSS: {vc: 12, f: 0.02} },
                groove:{ HM: {vc: 30, f: 0.04},  HSS: {vc: 6,  f: 0.03} },
                drill: { HM: {vc: 25, f: 0.05},  HSS: {vc: 6,  f: 0.03} }
            }
        }
    },
    "Titan G5 (TiAl6V4)": {
        coolant: "Rigelig Emulsion/Olie", note: "Leder ikke varme, værktøjet optager alt. Brandfare ved tynde spåner.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 50, fz: 0.06}, HSS: {vc: 12, fz: 0.03} },
                fin:   { HM: {vc: 70, fz: 0.03}, HSS: {vc: 16, fz: 0.02} },
                slot:  { HM: {vc: 35, fz: 0.04}, HSS: {vc: 8,  fz: 0.02} },
                drill: { HM: {vc: 40, f: 0.08},  HSS: {vc: 10, f: 0.04} }
            },
            LATHE: {
                rough: { HM: {vc: 60, f: 0.15},  HSS: {vc: 15, f: 0.08} },
                fin:   { HM: {vc: 85, f: 0.06},  HSS: {vc: 20, f: 0.04} },
                groove:{ HM: {vc: 45, f: 0.06},  HSS: {vc: 10, f: 0.04} },
                drill: { HM: {vc: 40, f: 0.08},  HSS: {vc: 10, f: 0.04} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 30, fz: 0.04}, HSS: {vc: 8,  fz: 0.02} },
                fin:   { HM: {vc: 45, fz: 0.02}, HSS: {vc: 12, fz: 0.01} },
                slot:  { HM: {vc: 20, fz: 0.03}, HSS: {vc: 5,  fz: 0.01} },
                drill: { HM: {vc: 25, f: 0.05},  HSS: {vc: 6,  f: 0.03} }
            },
            LATHE: {
                rough: { HM: {vc: 40, f: 0.10},  HSS: {vc: 10, f: 0.06} },
                fin:   { HM: {vc: 55, f: 0.04},  HSS: {vc: 14, f: 0.02} },
                groove:{ HM: {vc: 30, f: 0.04},  HSS: {vc: 6,  f: 0.03} },
                drill: { HM: {vc: 25, f: 0.05},  HSS: {vc: 6,  f: 0.03} }
            }
        }
    },
    "Inconel 718": {
        coolant: "Højtryk (Nødvendigt)", note: "Nikkel superlegering. HSS er komplet ubrugeligt.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 30, fz: 0.03}, HSS: {vc: 0, fz: 0} },
                fin:   { HM: {vc: 45, fz: 0.02}, HSS: {vc: 0, fz: 0} },
                slot:  { HM: {vc: 20, fz: 0.02}, HSS: {vc: 0, fz: 0} },
                drill: { HM: {vc: 20, f: 0.05},  HSS: {vc: 0, f: 0} }
            },
            LATHE: {
                rough: { HM: {vc: 35, f: 0.10},  HSS: {vc: 0, f: 0} },
                fin:   { HM: {vc: 50, f: 0.04},  HSS: {vc: 0, f: 0} },
                groove:{ HM: {vc: 25, f: 0.04},  HSS: {vc: 0, f: 0} },
                drill: { HM: {vc: 20, f: 0.05},  HSS: {vc: 0, f: 0} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 15, fz: 0.02}, HSS: {vc: 0, fz: 0} },
                fin:   { HM: {vc: 25, fz: 0.01}, HSS: {vc: 0, fz: 0} },
                slot:  { HM: {vc: 10, fz: 0.01}, HSS: {vc: 0, fz: 0} },
                drill: { HM: {vc: 10, f: 0.03},  HSS: {vc: 0, f: 0} }
            },
            LATHE: {
                rough: { HM: {vc: 20, f: 0.08},  HSS: {vc: 0, f: 0} },
                fin:   { HM: {vc: 30, f: 0.03},  HSS: {vc: 0, f: 0} },
                groove:{ HM: {vc: 15, f: 0.03},  HSS: {vc: 0, f: 0} },
                drill: { HM: {vc: 10, f: 0.03},  HSS: {vc: 0, f: 0} }
            }
        }
    },
    "POM-C (Acetal)": {
        coolant: "Luft / Vand", note: "Krymper marginalt efter bearbejdning. Brug knivskarpe, positive skær.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 300, fz: 0.15}, HSS: {vc: 100, fz: 0.12} },
                fin:   { HM: {vc: 450, fz: 0.06}, HSS: {vc: 150, fz: 0.05} },
                slot:  { HM: {vc: 200, fz: 0.10}, HSS: {vc: 80,  fz: 0.08} },
                drill: { HM: {vc: 120, f: 0.15},  HSS: {vc: 60,  f: 0.12} }
            },
            LATHE: {
                rough: { HM: {vc: 350, f: 0.25},  HSS: {vc: 120, f: 0.20} },
                fin:   { HM: {vc: 500, f: 0.08},  HSS: {vc: 180, f: 0.06} },
                groove:{ HM: {vc: 250, f: 0.10},  HSS: {vc: 80,  f: 0.08} },
                drill: { HM: {vc: 120, f: 0.15},  HSS: {vc: 60,  f: 0.12} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 150, fz: 0.10}, HSS: {vc: 80,  fz: 0.10} },
                fin:   { HM: {vc: 250, fz: 0.04}, HSS: {vc: 120, fz: 0.04} },
                slot:  { HM: {vc: 100, fz: 0.06}, HSS: {vc: 50,  fz: 0.06} },
                drill: { HM: {vc: 80,  f: 0.12},  HSS: {vc: 40,  f: 0.10} }
            },
            LATHE: {
                rough: { HM: {vc: 200, f: 0.20},  HSS: {vc: 100, f: 0.15} },
                fin:   { HM: {vc: 300, f: 0.05},  HSS: {vc: 150, f: 0.05} },
                groove:{ HM: {vc: 120, f: 0.08},  HSS: {vc: 60,  f: 0.06} },
                drill: { HM: {vc: 80,  f: 0.12},  HSS: {vc: 40,  f: 0.10} }
            }
        }
    },
    "PA6 (Nylon)": {
        coolant: "Emulsion", note: "Smelter let. Vandbaseret køling anbefales for at holde temp nede.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 225, fz: 0.12}, HSS: {vc: 80, fz: 0.10} },
                fin:   { HM: {vc: 350, fz: 0.05}, HSS: {vc: 120, fz: 0.04} },
                slot:  { HM: {vc: 150, fz: 0.08}, HSS: {vc: 60, fz: 0.06} },
                drill: { HM: {vc: 100, f: 0.15},  HSS: {vc: 50, f: 0.12} }
            },
            LATHE: {
                rough: { HM: {vc: 250, f: 0.20},  HSS: {vc: 100, f: 0.15} },
                fin:   { HM: {vc: 400, f: 0.06},  HSS: {vc: 150, f: 0.05} },
                groove:{ HM: {vc: 180, f: 0.08},  HSS: {vc: 60,  f: 0.06} },
                drill: { HM: {vc: 100, f: 0.15},  HSS: {vc: 50,  f: 0.12} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 120, fz: 0.08}, HSS: {vc: 60, fz: 0.08} },
                fin:   { HM: {vc: 200, fz: 0.03}, HSS: {vc: 90, fz: 0.03} },
                slot:  { HM: {vc: 80,  fz: 0.05}, HSS: {vc: 40, fz: 0.05} },
                drill: { HM: {vc: 60,  f: 0.10},  HSS: {vc: 30, f: 0.08} }
            },
            LATHE: {
                rough: { HM: {vc: 150, f: 0.15},  HSS: {vc: 80, f: 0.12} },
                fin:   { HM: {vc: 250, f: 0.04},  HSS: {vc: 120, f: 0.04} },
                groove:{ HM: {vc: 100, f: 0.06},  HSS: {vc: 40, f: 0.05} },
                drill: { HM: {vc: 60,  f: 0.10},  HSS: {vc: 30, f: 0.08} }
            }
        }
    },
    "PTFE (Teflon)": {
        coolant: "Luft / Ingen", note: "Giver ekstremt meget efter for skæretryk. Svært at holde snævre tolerancer.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 250, fz: 0.15}, HSS: {vc: 100, fz: 0.12} },
                fin:   { HM: {vc: 400, fz: 0.06}, HSS: {vc: 150, fz: 0.05} },
                slot:  { HM: {vc: 180, fz: 0.10}, HSS: {vc: 80,  fz: 0.08} },
                drill: { HM: {vc: 120, f: 0.15},  HSS: {vc: 60,  f: 0.12} }
            },
            LATHE: {
                rough: { HM: {vc: 300, f: 0.25},  HSS: {vc: 120, f: 0.20} },
                fin:   { HM: {vc: 450, f: 0.08},  HSS: {vc: 180, f: 0.06} },
                groove:{ HM: {vc: 200, f: 0.10},  HSS: {vc: 80,  f: 0.08} },
                drill: { HM: {vc: 120, f: 0.15},  HSS: {vc: 60,  f: 0.12} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 150, fz: 0.10}, HSS: {vc: 80,  fz: 0.10} },
                fin:   { HM: {vc: 250, fz: 0.04}, HSS: {vc: 120, fz: 0.04} },
                slot:  { HM: {vc: 100, fz: 0.06}, HSS: {vc: 50,  fz: 0.06} },
                drill: { HM: {vc: 80,  f: 0.10},  HSS: {vc: 40,  f: 0.08} }
            },
            LATHE: {
                rough: { HM: {vc: 180, f: 0.20},  HSS: {vc: 100, f: 0.15} },
                fin:   { HM: {vc: 300, f: 0.05},  HSS: {vc: 150, f: 0.05} },
                groove:{ HM: {vc: 120, f: 0.08},  HSS: {vc: 60,  f: 0.06} },
                drill: { HM: {vc: 80,  f: 0.10},  HSS: {vc: 40,  f: 0.08} }
            }
        }
    },
    "PEEK": {
        coolant: "Emulsion / Luft", note: "High-end termoplast. Kræver stor frivinkel for ikke at opbygge varme.",
        CNC: {
            MILL: {
                rough: { HM: {vc: 160, fz: 0.10}, HSS: {vc: 50, fz: 0.06} },
                fin:   { HM: {vc: 220, fz: 0.04}, HSS: {vc: 70, fz: 0.03} },
                slot:  { HM: {vc: 100, fz: 0.06}, HSS: {vc: 35, fz: 0.04} },
                drill: { HM: {vc: 80,  f: 0.10},  HSS: {vc: 30, f: 0.06} }
            },
            LATHE: {
                rough: { HM: {vc: 200, f: 0.15},  HSS: {vc: 60, f: 0.10} },
                fin:   { HM: {vc: 300, f: 0.05},  HSS: {vc: 80, f: 0.04} },
                groove:{ HM: {vc: 120, f: 0.06},  HSS: {vc: 40, f: 0.04} },
                drill: { HM: {vc: 80,  f: 0.10},  HSS: {vc: 30, f: 0.06} }
            }
        },
        MAN: {
            MILL: {
                rough: { HM: {vc: 80,  fz: 0.06}, HSS: {vc: 30, fz: 0.04} },
                fin:   { HM: {vc: 120, fz: 0.02}, HSS: {vc: 45, fz: 0.02} },
                slot:  { HM: {vc: 50,  fz: 0.04}, HSS: {vc: 20, fz: 0.02} },
                drill: { HM: {vc: 40,  f: 0.06},  HSS: {vc: 15, f: 0.04} }
            },
            LATHE: {
                rough: { HM: {vc: 100, f: 0.10},  HSS: {vc: 40, f: 0.08} },
                fin:   { HM: {vc: 150, f: 0.03},  HSS: {vc: 55, f: 0.03} },
                groove:{ HM: {vc: 60,  f: 0.04},  HSS: {vc: 25, f: 0.03} },
                drill: { HM: {vc: 40,  f: 0.06},  HSS: {vc: 15, f: 0.04} }
            }
        }
    }
};

const threadDB = [
    { id: "M3", type: "M", pitch: 0.50, dCut: 2.50, dRoll: 2.80, ext: 2.90, din76: "1.6 x 0.4", note: "Metrisk Standard" },
    { id: "M4", type: "M", pitch: 0.70, dCut: 3.30, dRoll: 3.70, ext: 3.90, din76: "2.1 x 0.5", note: "Metrisk Standard" },
    { id: "M5", type: "M", pitch: 0.80, dCut: 4.20, dRoll: 4.65, ext: 4.90, din76: "2.5 x 0.6", note: "Metrisk Standard" },
    { id: "M6", type: "M", pitch: 1.00, dCut: 5.00, dRoll: 5.55, ext: 5.90, din76: "3.0 x 0.7", note: "Metrisk Standard" },
    { id: "M8", type: "M", pitch: 1.25, dCut: 6.80, dRoll: 7.40, ext: 7.85, din76: "4.0 x 0.9", note: "Metrisk Standard" },
    { id: "M10", type: "M", pitch: 1.50, dCut: 8.50, dRoll: 9.30, ext: 9.85, din76: "4.5 x 1.1", note: "Metrisk Standard" },
    { id: "M12", type: "M", pitch: 1.75, dCut: 10.20, dRoll: 11.20, ext: 11.80, din76: "5.0 x 1.3", note: "Metrisk Standard" },
    { id: "M14", type: "M", pitch: 2.00, dCut: 12.00, dRoll: 13.10, ext: 13.80, din76: "6.0 x 1.5", note: "Metrisk Standard" },
    { id: "M16", type: "M", pitch: 2.00, dCut: 14.00, dRoll: 15.10, ext: 15.80, din76: "6.0 x 1.5", note: "Metrisk Standard" },
    { id: "M20", type: "M", pitch: 2.50, dCut: 17.50, dRoll: 18.90, ext: 19.80, din76: "7.5 x 1.8", note: "Metrisk Standard" },
    { id: "M24", type: "M", pitch: 3.00, dCut: 21.00, dRoll: 22.70, ext: 23.80, din76: "9.0 x 2.1", note: "Metrisk Standard" },
    { id: "M8x1", type: "MF", pitch: 1.00, dCut: 7.00, dRoll: 7.55, ext: 7.90, din76: "-", note: "Finmetrisk" },
    { id: "M10x1", type: "MF", pitch: 1.00, dCut: 9.00, dRoll: 9.55, ext: 9.90, din76: "-", note: "Finmetrisk" },
    { id: "M12x1.5", type: "MF", pitch: 1.50, dCut: 10.50, dRoll: 11.30, ext: 11.85, din76: "-", note: "Finmetrisk" },
    { id: "M16x1.5", type: "MF", pitch: 1.50, dCut: 14.50, dRoll: 15.30, ext: 15.85, din76: "-", note: "Finmetrisk" },
    { id: "M20x1.5", type: "MF", pitch: 1.50, dCut: 18.50, dRoll: 19.30, ext: 19.85, din76: "-", note: "Finmetrisk" },
    { id: "G 1/8\"", type: "G", pitch: "0.907 (28 TPI)", dCut: 8.80, dRoll: "-", ext: 9.73, din76: "-", note: "Cylindrisk Rørgevind (BSP)" },
    { id: "G 1/4\"", type: "G", pitch: "1.337 (19 TPI)", dCut: 11.80, dRoll: "-", ext: 13.16, din76: "-", note: "Cylindrisk Rørgevind (BSP)" },
    { id: "G 3/8\"", type: "G", pitch: "1.337 (19 TPI)", dCut: 15.25, dRoll: "-", ext: 16.66, din76: "-", note: "Cylindrisk Rørgevind (BSP)" },
    { id: "G 1/2\"", type: "G", pitch: "1.814 (14 TPI)", dCut: 18.60, dRoll: "-", ext: 20.95, din76: "-", note: "Cylindrisk Rørgevind (BSP)" },
    { id: "1/4\"-20 UNC", type: "UNC", pitch: "1.270 (20 TPI)", dCut: 5.10, dRoll: 5.80, ext: 6.35, din76: "-", note: "Amerikansk Grov" },
    { id: "5/16\"-18 UNC", type: "UNC", pitch: "1.411 (18 TPI)", dCut: 6.60, dRoll: 7.30, ext: 7.94, din76: "-", note: "Amerikansk Grov" },
    { id: "3/8\"-16 UNC", type: "UNC", pitch: "1.588 (16 TPI)", dCut: 8.00, dRoll: 8.80, ext: 9.52, din76: "-", note: "Amerikansk Grov" },
    { id: "1/2\"-13 UNC", type: "UNC", pitch: "1.954 (13 TPI)", dCut: 10.80, dRoll: 11.80, ext: 12.70, din76: "-", note: "Amerikansk Grov" },
    { id: "5/8\"-11 UNC", type: "UNC", pitch: "2.309 (11 TPI)", dCut: 13.50, dRoll: 14.80, ext: 15.87, din76: "-", note: "Amerikansk Grov" },
    { id: "1/4\"-28 UNF", type: "UNF", pitch: "0.907 (28 TPI)", dCut: 5.50, dRoll: 5.95, ext: 6.35, din76: "-", note: "Amerikansk Fin" },
    { id: "5/16\"-24 UNF", type: "UNF", pitch: "1.058 (24 TPI)", dCut: 6.90, dRoll: 7.45, ext: 7.94, din76: "-", note: "Amerikansk Fin" },
    { id: "3/8\"-24 UNF", type: "UNF", pitch: "1.058 (24 TPI)", dCut: 8.50, dRoll: 9.05, ext: 9.52, din76: "-", note: "Amerikansk Fin" },
    { id: "1/2\"-20 UNF", type: "UNF", pitch: "1.270 (20 TPI)", dCut: 11.50, dRoll: 12.10, ext: 12.70, din76: "-", note: "Amerikansk Fin" },
    { id: "NPT 1/8\"", type: "NPT", pitch: "0.940 (27 TPI)", dCut: 8.50, dRoll: "-", ext: "-", din76: "-", note: "Konisk Rør (Kræver rømmer)" },
    { id: "NPT 1/4\"", type: "NPT", pitch: "1.411 (18 TPI)", dCut: 11.10, dRoll: "-", ext: "-", din76: "-", note: "Konisk Rør (Kræver rømmer)" },
    { id: "1/4\" BSW", type: "BSW", pitch: "1.270 (20 TPI)", dCut: 5.10, dRoll: "-", ext: 6.35, din76: "-", note: "Whitworth 55° profil" },
    { id: "3/8\" BSW", type: "BSW", pitch: "1.588 (16 TPI)", dCut: 7.90, dRoll: "-", ext: 9.52, din76: "-", note: "Whitworth 55° profil" },
    { id: "1/2\" BSW", type: "BSW", pitch: "2.117 (12 TPI)", dCut: 10.50, dRoll: "-", ext: 12.70, din76: "-", note: "Whitworth 55° profil" },
    { id: "Tr 16x4", type: "TR", pitch: 4.00, dCut: 12.50, dRoll: "-", ext: 16.00, din76: "-", note: "Trapez gevind 30°" },
    { id: "Tr 20x4", type: "TR", pitch: 4.00, dCut: 16.50, dRoll: "-", ext: 20.00, din76: "-", note: "Trapez gevind 30°" }
];

const staticDB = [
    { cat: "GDT", title: "Form Tolerancer", data: ["Ligehed (▬): Linje på flade", "Planhed (▱): Fladens afvigelse", "Rundhed (○): 2D Tværsnit", "Cylindricitet (⌭): 3D Form"], note: "Formtolerancer refererer ALDRIG til et datum." },
    { cat: "GDT", title: "Orientering & Placering", data: ["Parallelitet (∥): Ift. Datum", "Vinkelrethed (⊥): 90° ift. Datum", "Position (⌖): Centerets placering", "Koncentricitet (◎): Akser flugter"], note: "Kræver altid en datum-reference." },
    { cat: "GDT", title: "Overfladeruhed (Ra / Rz)", data: ["N8: Ra 3.2 µm / Rz ~12 µm", "N7: Ra 1.6 µm / Rz ~6 µm", "N6: Ra 0.8 µm / Rz ~3 µm", "N5: Ra 0.4 µm / Rz ~1.5 µm", "N4: Ra 0.2 µm / Rz ~0.8 µm"], note: "Sammenhæng mellem ISO N-skala, gennemsnit (Ra) og max-dybde (Rz)." },
    { cat: "GCODE", title: "M-Koder (Haas Fræs/Drej)", data: ["M00: Ubetinget Stop", "M01: Optional Stop", "M03: Spindel CW", "M04: Spindel CCW", "M06: Værktøjsskift", "M08/M09: Køling TIL / FRA", "M19: Spindelorientering", "M30: Program Slut"], note: "Maskinspecifikke funktionskoder." },
    { cat: "GCODE", title: "G-Koder (Bevægelse/Nulpunkt)", data: ["G00: Ilnavigering", "G01: Linæer interpolation", "G02/G03: Cirkulær CW/CCW", "G43: Værktøjslængde Kompensation", "G54-G59: Arbejdsnulpunkter"], note: "Cirkulær interpolation kræver R eller I/K." },
    { cat: "GCODE", title: "G-Koder (Cykler Fræs/Drej)", data: ["G71: Skrubcyklus (Z-Akse Drej)", "G72: Skrubcyklus (Plan Drej)", "G76: Gevindskæringscyklus (Drej)", "G81: Standard Boring", "G82: Boring m. ophold i bund", "G83: Peck Boring (Udkast)"], note: "Husk G80 for at annullere aktive borecykler." },
    { cat: "GCODE", title: "M-Koder (Underprogrammer)", data: ["M97: Lokalt underprogramkald", "M98: Eksternt underprogramkald", "M99: Retur fra underprogram / Loop"], note: "Brug 'P' for programnummer og 'L' for antal gentagelser." },
    { cat: "MATERIALE", title: "Termisk Udvidelse", data: ["Alu: 23.4 µm/(m·K)", "Messing: 20.0 µm/(m·K)", "Rustfri (316): 16.0 µm/(m·K)", "Stål: 12.0 µm/(m·K)"], note: "Krympning: ΔL = α * L * ΔT." },
    { cat: "MATERIALE", title: "Hårdhed", data: ["20 HRC = 226 HB = 760 N/mm²", "40 HRC = 371 HB = 1250 N/mm²", "60 HRC = 600 HB"], note: "Rockwell C til Trækstyrke." },
    { cat: "MATERIALE", title: "Vægtfylde (Densitet)", data: ["Stål / Jern: 7.85 g/cm³", "Rustfri Stål: 7.95 g/cm³", "Aluminium: 2.70 g/cm³", "Messing/Bronze: 8.50 g/cm³", "Titanium: 4.50 g/cm³", "POM-C / Acetal: 1.41 g/cm³"], note: "Bruges til beregning af emnevægt. V = L * B * H * Densitet." },
    { cat: "ISO", title: "Vendeplatter Nomenklatur", data: ["Form: C(80°), D(55°), T(60°), V(35°)", "Frivinkel: N(0°), C(7°), P(11°)", "Tolerance: M (Støbt), G (Sleben)", "Næseradius: 04(R0.4), 08(R0.8)"], note: "Eks. CNMG120408." }
];