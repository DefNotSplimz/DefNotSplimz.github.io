// ==========================================================================
// GLOBAL DATUM PROTOTYPING DATABASE // FINAL_INFRASTRUCTURE_REV_11
// ==========================================================================

// --- 1. MATERIAL MASTER DATA ---
// kc: Skærekraft (N/mm2), alpha: Udvidelse (µm/mK), eModul: GPa, rm: MPa, rho: g/cm3
const materialDB = {
    'automat': { 
        name: '11SMn30 (Automatstål)', kc: 1500, alpha: 11.5, eModul: 210, rm: 550, rho: 7.85, 
        machinability: '100%', corrosion: 'Lav', weld: 'Nej', finish: 'God' 
    },
    'alu': { 
        name: 'Alu 6082-T6', kc: 700, alpha: 23.1, eModul: 70, rm: 310, rho: 2.70, 
        machinability: '95%', corrosion: 'Høj', weld: 'Ja', finish: 'Fremragende' 
    },
    'rustfast': { 
        name: 'AISI 316L (Syrefast)', kc: 2400, alpha: 16.0, eModul: 193, rm: 600, rho: 7.95, 
        machinability: '45%', corrosion: 'Max', weld: 'Ja', finish: 'Svær' 
    },
    'vaerktoej': { 
        name: '1.2379 (D2)', kc: 2200, alpha: 11.0, eModul: 210, rm: 850, rho: 7.70, 
        machinability: '40%', corrosion: 'Middel', weld: 'Nej', finish: 'God' 
    },
    'messing': { 
        name: 'CuZn39Pb3', kc: 600, alpha: 19.0, eModul: 97, rm: 450, rho: 8.50, 
        machinability: '110%', corrosion: 'Høj', weld: 'Nej', finish: 'Blank' 
    },
    'pom': { 
        name: 'POM-C (Acetal)', kc: 150, alpha: 110, eModul: 3, rm: 65, rho: 1.41, 
        machinability: '120%', corrosion: 'Max', weld: 'Nej', finish: 'Glat' 
    },
    'nylon': { 
        name: 'PA6 (Nylon)', kc: 150, alpha: 80, eModul: 3, rm: 80, rho: 1.15, 
        machinability: '80%', corrosion: 'Høj', weld: 'Nej', finish: 'Rå' 
    }
};

const kcValues = Object.fromEntries(Object.entries(materialDB).map(([k, v]) => [k, v.kc]));

// --- 2. THREAD MASTER DATABASE ---
const threadDB = {
    'M': [
        { name: 'M2 x 0.40', d: 2, p: 0.4, drill: 1.6 },
        { name: 'M2.5 x 0.45', d: 2.5, p: 0.45, drill: 2.05 },
        { name: 'M3 x 0.50', d: 3, p: 0.5, drill: 2.5 },
        { name: 'M4 x 0.70', d: 4, p: 0.7, drill: 3.3 },
        { name: 'M5 x 0.80', d: 5, p: 0.8, drill: 4.2 },
        { name: 'M6 x 1.00', d: 6, p: 1.0, drill: 5.0 },
        { name: 'M8 x 1.25', d: 8, p: 1.25, drill: 6.8 },
        { name: 'M10 x 1.50', d: 10, p: 1.5, drill: 8.5 },
        { name: 'M12 x 1.75', d: 12, p: 1.75, drill: 10.2 },
        { name: 'M14 x 2.00', d: 14, p: 2.0, drill: 12.0 },
        { name: 'M16 x 2.00', d: 16, p: 2.0, drill: 14.0 },
        { name: 'M20 x 2.50', d: 20, p: 2.5, drill: 17.5 },
        { name: 'M24 x 3.00', d: 24, p: 3.0, drill: 21.0 }
    ],
    'MF': [
        { name: 'M6 x 0.75', d: 6, p: 0.75, drill: 5.2 },
        { name: 'M8 x 0.75', d: 8, p: 0.75, drill: 7.2 },
        { name: 'M8 x 1.00', d: 8, p: 1.0, drill: 7.0 },
        { name: 'M10 x 1.00', d: 10, p: 1.0, drill: 9.0 },
        { name: 'M10 x 1.25', d: 10, p: 1.25, drill: 8.8 },
        { name: 'M12 x 1.00', d: 12, p: 1.0, drill: 11.0 },
        { name: 'M12 x 1.25', d: 12, p: 1.25, drill: 10.8 },
        { name: 'M12 x 1.50', d: 12, p: 1.5, drill: 10.5 },
        { name: 'M14 x 1.50', d: 14, p: 1.5, drill: 12.5 },
        { name: 'M16 x 1.50', d: 16, p: 1.5, drill: 14.5 }
    ],
    'UNC': [
        { name: '#4-40 UNC', d: 2.84, p: 0.635, drill: 2.35 },
        { name: '#6-32 UNC', d: 3.51, p: 0.794, drill: 2.85 },
        { name: '#8-32 UNC', d: 4.17, p: 0.794, drill: 3.50 },
        { name: '#10-24 UNC', d: 4.83, p: 1.058, drill: 3.90 },
        { name: '1/4"-20 UNC', d: 6.35, p: 1.270, drill: 5.10 },
        { name: '5/16"-18 UNC', d: 7.94, p: 1.411, drill: 6.60 },
        { name: '3/8"-16 UNC', d: 9.53, p: 1.588, drill: 8.00 },
        { name: '1/2"-13 UNC', d: 12.70, p: 1.954, drill: 10.80 }
    ],
    'UNF': [
        { name: '#10-32 UNF', d: 4.83, p: 0.794, drill: 4.10 },
        { name: '1/4"-28 UNF', d: 6.35, p: 0.907, drill: 5.50 },
        { name: '5/16"-24 UNF', d: 7.94, p: 1.058, drill: 6.90 },
        { name: '3/8"-24 UNF', d: 9.53, p: 1.058, drill: 8.50 },
        { name: '1/2"-20 UNF', d: 12.70, p: 1.270, drill: 11.50 }
    ],
    'BSP': [
        { name: 'G 1/8" (28)', d: 9.73, p: 0.907, drill: 8.80 },
        { name: 'G 1/4" (19)', d: 13.16, p: 1.337, drill: 11.80 },
        { name: 'G 3/8" (19)', d: 16.66, p: 1.337, drill: 15.25 },
        { name: 'G 1/2" (14)', d: 20.96, p: 1.814, drill: 19.00 }
    ]
};

// --- 3. FASTENER DATA ---
const fastDB = {
    'din912': {
        'm3': { c: 3.2, l: 3.4, hd: 5.5, hz: 3.0 },
        'm4': { c: 4.3, l: 4.5, hd: 7.0, hz: 4.0 },
        'm5': { c: 5.3, l: 5.5, hd: 8.5, hz: 5.0 },
        'm6': { c: 6.4, l: 6.6, hd: 10.0, hz: 6.0 },
        'm8': { c: 8.4, l: 9.0, hd: 13.0, hz: 8.0 },
        'm10': { c: 10.5, l: 11.0, hd: 16.0, hz: 10.0 },
        'm12': { c: 13.0, l: 14.0, hd: 18.0, hz: 12.0 }
    },
    'din7991': {
        'm3': { c: 3.2, l: 3.4, hd: 6.72, hz: 1.86 },
        'm4': { c: 4.3, l: 4.5, hd: 8.96, hz: 2.48 },
        'm5': { c: 5.3, l: 5.5, hd: 11.20, hz: 3.10 },
        'm6': { c: 6.4, l: 6.6, hd: 13.44, hz: 3.72 },
        'm8': { c: 8.4, l: 9.0, hd: 17.92, hz: 4.96 },
        'm10': { c: 10.5, l: 11.0, hd: 22.40, hz: 6.20 }
    }
};

// --- 4. UNIT CONVERSION CONSTANTS ---
const conversion = {
    inchToMm: 25.4,
    mmToInch: 0.0393700787,
    fractions: [
        { f: "1/64", d: 0.0156 }, { f: "1/32", d: 0.0313 }, { f: "1/16", d: 0.0625 },
        { f: "1/8", d: 0.125 }, { f: "1/4", d: 0.25 }, { f: "1/2", d: 0.5 }, { f: "1", d: 1.0 }
    ]
};

// --- 5. ISO 286 TOLERANCE DATA ---
const isoRanges = [3, 6, 10, 18, 30, 50, 80, 120, 180];
const IT = {
    5: [4, 5, 6, 8, 9, 11, 13, 15, 18],
    6: [6, 8, 9, 11, 13, 16, 19, 22, 25],
    7: [10, 12, 15, 18, 21, 25, 30, 35, 40],
    8: [14, 18, 22, 27, 33, 39, 46, 54, 63],
    9: [25, 30, 36, 43, 52, 62, 74, 87, 100]
};
const fdMatrix = {
    'h': [0, 0, 0, 0, 0, 0, 0, 0, 0],
    'js': [0, 0, 0, 0, 0, 0, 0, 0, 0],
    'g': [-2, -4, -5, -6, -7, -9, -10, -12, -14],
    'f': [-6, -10, -13, -16, -20, -25, -30, -36, -43],
    'e': [-14, -20, -25, -32, -40, -50, -60, -72, -85],
    'd': [-20, -30, -40, -50, -65, -80, -100, -120, -145],
    'k': [0, 1, 1, 2, 2, 2, 3, 3, 3],
    'p': [6, 12, 15, 18, 22, 26, 32, 37, 43]
};

// --- 6. TAPER PRESETS (Konus) ---
const taperPresets = {
    'mt1': { maj: 12.065, min: 9.396, l: 53.5 },
    'mt2': { maj: 17.780, min: 14.534, l: 64.0 },
    'mt3': { maj: 23.825, min: 19.822, l: 81.0 },
    'sk40': { maj: 44.450, min: 25.0, l: 68.4 }
};

// --- 7. STOCK ALLOWANCES ---
const stockAllowances = {
    'round_bar': {
        'up_to_20': 1.0,
        'up_to_50': 2.0,
        'up_to_100': 3.0,
        'above_100': 5.0
    },
    'plate': {
        'thickness': 0.5,
        'xy_margin': 5.0
    },
    'cut_off_margin': 3.5 
};

// --- 8. ISO 965 THREAD TOLERANCES (6H & 6g) ---
const threadTols = {
    ext_6g: { 
        major_max: (d) => d,
        major_min: (d, p) => d - (0.180 * Math.pow(p, 0.2) + 0.008 * Math.pow(p, 2)),
        pitch_max: (d, p) => d - 0.649519 * p - (0.020 * Math.pow(p, 0.4) + 0.012 * Math.pow(p, 1.2)),
        pitch_min: (d, p) => d - 0.649519 * p - (0.020 * Math.pow(p, 0.4) + 0.150 * Math.pow(p, 1.2))
    },
    int_6H: { 
        minor_min: (d, p) => d - 1.082532 * p,
        minor_max: (d, p) => d - 1.082532 * p + (0.150 * Math.pow(p, 0.4) + 0.120 * Math.pow(p, 1.2)),
        pitch_min: (d, p) => d - 0.649519 * p,
        pitch_max: (d, p) => d - 0.649519 * p + (0.090 * Math.pow(p, 0.4) + 0.080 * Math.pow(p, 1.2))
    }
};

// --- 9. G-CODE & M-CODE REFERENCE (ULTIMATE CROSS-SYSTEM ARCHIVE) ---
const codeDB = {
    'G': [
        // ISO / UNIVERSAL STANDARD
        { 
            system: 'ISO', code: 'G00', name: 'Rapid Positioning', 
            desc: 'Hurtig bevægelse (Ikke-skærende)', 
            longDesc: 'Maskinen flytter akserne med maksimal hastighed til slutpunktet. ADVARSEL: Akserne kører uafhængigt, så banen er ikke nødvendigvis en ret linje. Brug aldrig G00 tæt på emnet uden en sikkerhedsafstand ($R_{plane}$).',
            syntax: 'G00 X[val] Y[val] Z[val]', 
            params: { 'X/Y/Z': 'Koordinater for slutpunkt' } 
        },
        { 
            system: 'ISO', code: 'G01', name: 'Linear Interpolation', 
            desc: 'Lineær skæring med Feedrate', 
            longDesc: 'Bevæger værktøjet i en ret linje med den definerede tilspænding ($F$). Dette er fundamentet for al koordineret bearbejdning. Kræver at en F-værdi er aktiv.',
            syntax: 'G01 X.. Y.. Z.. F..', 
            params: { 'F': 'Tilspænding (mm/min eller mm/omdr)' } 
        },
        { 
            system: 'ISO', code: 'G02', name: 'Circular CW', 
            desc: 'Cirkulær bue (Med uret)', 
            longDesc: 'Udfører en bue med uret. Kan programmeres med R (Radius) eller I, J, K (Center-offset fra startpunkt). I/J/K er mere stabile end R ved fulde cirkler.',
            syntax: 'G02 X.. Y.. R.. / I.. J..', 
            params: { 'R': 'Radius', 'I/J/K': 'X/Y/Z center-offset' } 
        },
        { 
            system: 'ISO', code: 'G03', name: 'Circular CCW', 
            desc: 'Cirkulær bue (Mod uret)', 
            longDesc: 'Samme logik som G02, men mod urets retning. Kritisk ved fræsning af lommer eller gevindfræsning (Climb Milling).',
            syntax: 'G03 X.. Y.. R..', 
            params: { 'R': 'Radius' } 
        },
        { 
            system: 'ISO', code: 'G04', name: 'Dwell', 
            desc: 'Pause i afvikling', 
            longDesc: 'Stopper akse-bevægelse i et defineret tidsrum, mens spindlen kører videre. Bruges ofte til at sikre en pæn overflade i bunden af et hul eller ved afstikning.',
            syntax: 'G04 P[ms] / X[sek]', 
            params: { 'P': 'Millisekunder (ISO)', 'X': 'Sekunder' } 
        },
        { 
            system: 'ISO', code: 'G41', name: 'Cutter Comp Left', 
            desc: 'Radiuskompensering (Venstre)', 
            longDesc: 'Forskyder værktøjet til venstre for den programmerede bane. Gør det muligt at bruge emnets faktiske tegningmål og justere tolerancer via D-offset tabellen på maskinen.',
            syntax: 'G41 D[nr] X.. Y..', 
            params: { 'D': 'Værktøjsdiameter-offset nummer' } 
        },
        { 
            system: 'ISO', code: 'G42', name: 'Cutter Comp Right', 
            desc: 'Radiuskompensering (Højre)', 
            longDesc: 'Samme som G41, men forskyder til højre. Bruges primært ved modløbsfræsning eller specielle drejeoperationer.',
            syntax: 'G42 D[nr] X.. Y..', 
            params: { 'D': 'Diameter offset' } 
        },
        { 
            system: 'ISO', code: 'G43', name: 'Tool Length Comp', 
            desc: 'Længdekompensering', 
            longDesc: 'Aktiverer værktøjets længde-offset (H-kode). Uden G43 ved maskinen ikke, hvor værktøjsspidsen er i forhold til spindel-næsen. Livsfarligt at glemme.',
            syntax: 'G43 H[nr] Z[val]', 
            params: { 'H': 'Højde-offset nummer', 'Z': 'Sikkerhedshøjde' } 
        },
        { 
            system: 'ISO', code: 'G83', name: 'Peck Drilling', 
            desc: 'Dybdeboring (Spåntømning)', 
            longDesc: 'Borer ind til dybde Q, trækker sig helt ud til R-planet for at tømme spåner og lade kølevæske smøre boret. Essentielt ved huller dybere end $3 \times D$.',
            syntax: 'G83 Z.. R.. Q.. F..', 
            params: { 'Q': 'Dybde pr. hug', 'R': 'Startplan' } 
        },
        { 
            system: 'ISO', code: 'G96', name: 'CSS Constant Surface Speed', 
            desc: 'Konstant skærehastighed (Drej)', 
            longDesc: 'Maskinen justerer automatisk RPM ($n$) baseret på den aktuelle diameter for at holde $v_c$ konstant. Giver optimal overflade og ensartet værktøjsslid.',
            syntax: 'G96 S[vc] M03', 
            params: { 'S': 'Skærehastighed i m/min' } 
        },
        { 
            system: 'ISO', code: 'G97', name: 'Constant Spindle Speed', 
            desc: 'Konstant RPM', 
            longDesc: 'Annullerer G96 og låser maskinen til et fast omdrejningstal. Bruges til boring eller gevindskæring på drejebænk.',
            syntax: 'G97 S[rpm] M03', 
            params: { 'S': 'Omdrejninger pr. minut' } 
        },

        // HAAS SPECIFIC
        { 
            system: 'Haas', code: 'G12', name: 'Circular Pocket CW', 
            desc: 'Fræs cirkulær lomme (Med uret)', 
            longDesc: 'Haas-specifik cyklus der fræser en komplet cirkulær lomme med kun én linje kode. Den håndterer selv ind- og udkørsel (Lead-in/out).',
            syntax: 'G12 I[rad] K[slet] Q[step] F..', 
            params: { 'I': 'Radius', 'K': 'Sletmål', 'Q': 'Radial stepover' } 
        },
        { 
            system: 'Haas', code: 'G47', name: 'Text Engraving', 
            desc: 'Gravering af tekst', 
            longDesc: 'Gør det muligt at gravere tekst eller serienumre direkte via G-kode uden CAM. Kan bruge sekventielle serienumre.',
            syntax: 'G47 P0 X.. Y.. J[size] (TEXT)', 
            params: { 'J': 'Teksthøjde', 'P': '0=Literal, 1=Serienr' } 
        },
        { 
            system: 'Haas', code: 'G187', name: 'Setting Accuracy', 
            desc: 'Styrer præcision vs. hastighed', 
            longDesc: 'Fortæller kontrolenheden, hvor tæt den skal følge banen i hjørner. P1 (Grov) giver hurtig kørsel, P3 (Fin) giver maksimal præcision på bekostning af tid.',
            syntax: 'G187 P[1-3] E[tol]', 
            params: { 'P': 'Accuracy level', 'E': 'Toleranceværdi' } 
        },

        // FANUC SPECIFIC
        { 
            system: 'Fanuc', code: 'G71', name: 'Roughing Cycle (Turning)', 
            desc: 'Skrub-cyklus til drejebænk', 
            longDesc: 'Den kraftigste cyklus til drejning. Definerer en profil i underprogram eller mellem linje P og Q, og maskinen beregner selv alle skrub-passager.',
            syntax: 'G71 U.. R.. / G71 P.. Q.. U.. W.. F..', 
            params: { 'U': 'Skæredybde / Sletmål X', 'W': 'Sletmål Z' } 
        },
        { 
            system: 'Fanuc', code: 'G76', name: 'Threading Cycle', 
            desc: 'Multi-pass gevindskæring', 
            longDesc: 'Automatisk cyklus til gevindskæring på drejebænk. Håndterer flere passager med faldende skæredybde for at skåne værktøjet.',
            syntax: 'G76 P[mål] Q[min] R..', 
            params: { 'P': 'Gevind-output spec', 'Q': 'Min. skæredybde' } 
        }
    ],
    'M': [
        { 
            system: 'ISO', code: 'M00', name: 'Program Stop', 
            desc: 'Obligatorisk stop', 
            longDesc: 'Stopper alt. Bruges til manuelle indgreb som vending af emne eller måling. Kræver "Cycle Start" for at fortsætte.',
            syntax: 'M00', 
            params: {} 
        },
        { 
            system: 'ISO', code: 'M01', name: 'Optional Stop', 
            desc: 'Valgfrit stop', 
            longDesc: 'Stopper kun hvis "Optional Stop" knappen på panelet er aktiveret. God til at tjekke det første emne i en serie.',
            syntax: 'M01', 
            params: {} 
        },
        { 
            system: 'ISO', code: 'M06', name: 'Tool Change', 
            desc: 'Værktøjsskift', 
            longDesc: 'Kalder det værktøj, der er defineret med T. Stopper spindel og flytter til skifteposition. Husk altid at have kølemiddel (M09) slukket før skift.',
            syntax: 'T[nr] M06', 
            params: { 'T': 'Værktøjsnummer' } 
        },
        { 
            system: 'ISO', code: 'M08', name: 'Coolant ON', 
            desc: 'Kølemiddel (Flood)', 
            longDesc: 'Starter standard kølevæske. Uden smøring og køling brænder du dine platter af på sekunder i stål.',
            syntax: 'M08', 
            params: {} 
        },
        { 
            system: 'Haas', code: 'M88', name: 'Through Spindle Coolant', 
            desc: 'Køling gennem spindel (TSC)', 
            longDesc: 'Højtrykskøling direkte gennem værktøjet. Kritisk til dybdeboring og High-Speed fræsning for at fjerne spåner fra lommen.',
            syntax: 'M88', 
            params: {} 
        },
        { 
            system: 'Haas', code: 'M97', name: 'Local Subroutine', 
            desc: 'Kald underprogram i samme fil', 
            longDesc: 'Springer til et linjenummer (P) og kører koden indtil M99. Genialt til gentagne operationer som f.eks. at fræse 10 ens huller.',
            syntax: 'M97 P[linje]', 
            params: { 'P': 'Linjenummer (N)' } 
        }
    ]
};