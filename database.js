// GLOBAL DATUM PROTOTYPING DATABASE
const threadDB = {
    'M': [
        { name: 'M3 x 0.50', d: 3, p: 0.5, drill: 2.5 },
        { name: 'M4 x 0.70', d: 4, p: 0.7, drill: 3.3 },
        { name: 'M5 x 0.80', d: 5, p: 0.8, drill: 4.2 },
        { name: 'M6 x 1.00', d: 6, p: 1.0, drill: 5.0 },
        { name: 'M8 x 1.25', d: 8, p: 1.25, drill: 6.8 },
        { name: 'M10 x 1.50', d: 10, p: 1.5, drill: 8.5 },
        { name: 'M12 x 1.75', d: 12, p: 1.75, drill: 10.2 },
        { name: 'M16 x 2.00', d: 16, p: 2.0, drill: 14.0 },
        { name: 'M20 x 2.50', d: 20, p: 2.5, drill: 17.5 }
    ],
    'MF': [
        { name: 'M8 x 1.00', d: 8, p: 1.0, drill: 7.0 },
        { name: 'M10 x 1.00', d: 10, p: 1.0, drill: 9.0 },
        { name: 'M10 x 1.25', d: 10, p: 1.25, drill: 8.8 },
        { name: 'M12 x 1.25', d: 12, p: 1.25, drill: 10.8 },
        { name: 'M12 x 1.50', d: 12, p: 1.5, drill: 10.5 },
        { name: 'M16 x 1.50', d: 16, p: 1.5, drill: 14.5 }
    ],
    'UNC': [
        { name: '#4-40 UNC', d: 2.845, p: 0.635, drill: 2.25 },
        { name: '#6-32 UNC', d: 3.505, p: 0.794, drill: 2.85 },
        { name: '#8-32 UNC', d: 4.166, p: 0.794, drill: 3.4 },
        { name: '#10-24 UNC', d: 4.826, p: 1.058, drill: 3.9 },
        { name: '1/4"-20 UNC', d: 6.350, p: 1.270, drill: 5.1 },
        { name: '5/16"-18 UNC', d: 7.938, p: 1.411, drill: 6.6 },
        { name: '3/8"-16 UNC', d: 9.525, p: 1.588, drill: 8.0 },
        { name: '1/2"-13 UNC', d: 12.700, p: 1.954, drill: 10.8 }
    ],
    'UNF': [
        { name: '#10-32 UNF', d: 4.826, p: 0.794, drill: 4.1 },
        { name: '1/4"-28 UNF', d: 6.350, p: 0.907, drill: 5.5 },
        { name: '5/16"-24 UNF', d: 7.938, p: 1.058, drill: 6.9 },
        { name: '3/8"-24 UNF', d: 9.525, p: 1.058, drill: 8.5 },
        { name: '1/2"-20 UNF', d: 12.700, p: 1.270, drill: 11.5 }
    ],
    'BSP': [
        { name: 'G 1/8" (28 TPI)', d: 9.728, p: 0.907, drill: 8.8 },
        { name: 'G 1/4" (19 TPI)', d: 13.157, p: 1.337, drill: 11.8 },
        { name: 'G 3/8" (19 TPI)', d: 16.662, p: 1.337, drill: 15.2 },
        { name: 'G 1/2" (14 TPI)', d: 20.955, p: 1.814, drill: 19.0 },
        { name: 'G 3/4" (14 TPI)', d: 26.441, p: 1.814, drill: 24.5 },
        { name: 'G 1" (11 TPI)', d: 33.249, p: 2.309, drill: 30.3 }
    ],
    'NPT': [
        { name: '1/8" NPT (27 TPI)', d: 10.287, p: 0.940, drill: 8.5 },
        { name: '1/4" NPT (18 TPI)', d: 13.716, p: 1.411, drill: 11.0 },
        { name: '3/8" NPT (18 TPI)', d: 17.145, p: 1.411, drill: 14.5 },
        { name: '1/2" NPT (14 TPI)', d: 21.336, p: 1.814, drill: 18.0 }
    ]
};