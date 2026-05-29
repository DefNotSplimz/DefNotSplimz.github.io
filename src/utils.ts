import { CompletedProject } from './types';

// Completely fresh, advanced mechanical projects physically made by Glen
export const COMPLETED_PROJECTS: CompletedProject[] = [
  {
    id: 'vakuum-motor',
    title: 'Højpræcisions Vakuum Motor (Atmosfærisk Maskine)',
    description: 'En fuldt funktionel atmosfærisk vakuummotor (flammeæder/fire-eater), fremstillet med ekstremt fine tolerancer for at sikre, at undertrykket kan overvinde mekanisk friktion uden tætningringe på stemplet. Motoren har gennemgået omfattende testkørsler under faglærerovervågning og er dokumenteret med 3 fulde First Article Inspection (FAI) målerapporter for nøglekomponenterne samt en fuldstændig 3D samlings-rendering i Autodesk Fusion.',
    material: 'Aluminium 6082-T6, Messing MS58 & Støbejern',
    machine: 'Haas Mini Mill CNC, Haas ST-10, Weiler Matador & Deckel FP1',
    dimensions: 'Totalhøjde: 125 mm // Svinghjul: Ø80 mm',
    tolerance: 'Boringer ned til +0.008 mm (H6/H7 pasninger)',
    finish: 'Ra 0.15 µm (Honet cylinderbane)',
    process: 'CNC-fræsning (HSM), Præcisionsdrejning, Manuel Honing & Plangeometrisk Overfladeslibning',
    date: 'Maj 2026',
    notes: 'Det tætningsfrie arbejdsstempel i grafit/støbejern kører i en præcisionshonet messingbøsning med under 0.01 mm radial frigang.',
    has3dRendering: true,
    renderingUrl: 'https://ais-dev-cbctzrpzbubtfq7fd4zlw5-415594499881.europe-west2.run.app/',
    renderLabel: 'Vis Integreret 3D Autodesk Fusion Model',
    faiReports: [
      {
        partName: 'Cylinderbøsning (Bore)',
        faiId: 'FAI-VM-001',
        inspector: 'Glen (Datum Prototyping)',
        measuredDimensions: [
          { feature: 'Indvendig Cylinderdiameter', nominal: 'Ø18.000 mm', tolerance: '+0.011 / +0.000 mm (H6)', actual: 'Ø18.006 mm', status: 'GODKENDT', instrument: 'Mitutoyo Holtest Indvendigt 3-punkts Mikrometerskrue' },
          { feature: 'Rundhed (Ovalitet)', nominal: '< 0.003 mm', tolerance: 'Max 0.005 mm', actual: '0.002 mm', status: 'GODKENDT', instrument: 'Mitutoyo Måleur m/ Vippearm i målestand' },
          { feature: 'Cylinderbane Længde', nominal: '42.00 mm', tolerance: '±0.05 mm', actual: '42.02 mm', status: 'OK', instrument: 'Mitutoyo Digitalt Skydelære' }
        ]
      },
      {
        partName: 'Arbejdsstempel (Piston)',
        faiId: 'FAI-VM-002',
        inspector: 'Glen (Datum Prototyping)',
        measuredDimensions: [
          { feature: 'Udvendig Diameter (Sletdrejet)', nominal: 'Ø17.988 mm', tolerance: '-0.006 / -0.015 mm', actual: 'Ø17.981 mm', status: 'GODKENDT', instrument: 'Mitutoyo Digital Udendørs Mikrometerskrue (0-25mm)' },
          { feature: 'Krydspindshul Boringsdiameter', nominal: 'Ø4.000 mm', tolerance: '+0.012 / 0.000 mm', actual: 'Ø4.005 mm', status: 'OK', instrument: 'Brocheret pasdorn m/ måleur' },
          { feature: 'Overfladeruhed (Ra)', nominal: 'Ra 0.40 µm', tolerance: '< Ra 0.60 µm', actual: 'Ra 0.32 µm', status: 'GODKENDT', instrument: 'Diavite DH-8 Præcisions-Ruhedsmåler' }
        ]
      },
      {
        partName: 'Svinghjul (Flywheel)',
        faiId: 'FAI-VM-003',
        inspector: 'Glen (Datum Prototyping)',
        measuredDimensions: [
          { feature: 'Ydre Diameter (Afdrejet)', nominal: 'Ø80.00 mm', tolerance: '±0.10 mm', actual: 'Ø80.04 mm', status: 'OK', instrument: 'Mitutoyo Skydelære 150mm' },
          { feature: 'Centernav Boring (Akselpasning)', nominal: 'Ø10.000 mm', tolerance: '+0.015 / +0.002 mm (K7)', actual: 'Ø10.008 mm', status: 'GODKENDT', instrument: 'Mitutoyo Indvendig Mikrometerskrue' },
          { feature: 'Planløb (Svinghjulskrans)', nominal: '< 0.02 mm', tolerance: 'Max 0.05 mm', actual: '0.012 mm', status: 'GODKENDT', instrument: 'Flange-måleur på magnetfod under rotation' }
        ]
      }
    ]
  },
  {
    id: 'tba-placeholder-1',
    title: '[TBA] Afventer Emnedata',
    description: 'Reserveret plads til næste finmekaniske maskineringsturnus eller kundeprojekt. Glen tilføjer detaljer løbende efter færdig bearbejdning og kvalitetsmåling.',
    material: 'Afventer råstofvalg...',
    machine: 'Afventer maskineopstilling...',
    dimensions: '-',
    tolerance: '-',
    finish: '-',
    process: 'Planlagt emnekørsel',
    date: 'TBA',
    notes: 'Kvalitetskontrol og fuld FAI rapport oprettes direkte i systemet her så snart emnet er godkendt.'
  },
  {
    id: 'tba-placeholder-2',
    title: '[TBA] Kommende Prototype',
    description: 'Ledig plads i Glens personlige prototypegalleri for Datum Prototyping. Emnebeskrivelse og tegninger indlæses snarest.',
    material: 'Afventer råstofvalg...',
    machine: 'Afventer maskineopstilling...',
    dimensions: '-',
    tolerance: '-',
    finish: '-',
    process: 'Planlagt emnekørsel',
    date: 'TBA',
    notes: 'Kvalitetskontrol og fuld FAI rapport oprettes direkte i systemet her så snart emnet er godkendt.'
  }
];

// Rich, non-repetitive Material Database with real cutting data & diagnostic facts for our simulator
export interface MaterialMachiningData {
  id: string;
  name: string;
  alloyName: string;
  density: number; // g/cm³
  machinability: number; // Percentage 0-100%
  baseVcSpeed: number; // m/min (Recommended cutting speed for carbide tools)
  baseFeedPerTooth: number; // mm/tooth
  coolantRequired: 'emulsion' | 'dry' | 'oil' | 'compressed_air';
  advantages: string[];
  disadvantages: string[];
  bestUse: string;
  chemicalComposition: string;
  examples: string[];
}

export const MATERIAL_DATA_DB: Record<string, MaterialMachiningData> = {
  aluminium: {
    id: 'aluminium',
    name: 'Aluminium',
    alloyName: 'EN AW-6082-T6',
    density: 2.70,
    machinability: 90,
    baseVcSpeed: 250,
    baseFeedPerTooth: 0.12,
    coolantRequired: 'emulsion',
    advantages: [
      'Ekstremt let at bearbejde og giver en helt suveræn, glansfuld overfladefinish ved høje skærehastigheder.',
      'Lang levetid på skæreværktøjet på grund af den lave hårdhed og lave slidvirkning.'
    ],
    disadvantages: [
      'Kan nemt koldsvejse og klistre og smelte fast på skæret (især under tør fræsning), hvilket kan knække værktøjet.',
      'Meget blødt metal; bliver utrolig let ridset eller mærket ved uforsigtig spændekraft i skruestik og spændetang.'
    ],
    bestUse: 'Finmekaniske letvægtsflanger, dæksler, Stirling-komponenter og køleprofiler.',
    chemicalComposition: 'AlSi1MgMn (Hærdbar aluminiumslegering)',
    examples: [
      'Elektronikkabinetter, huse og dæksler med lav vægt',
      'Effektive køleprofiler og kølesvøb til varmeafledning',
      'Præcisions-kileremskiver og motorkomponenter i modelbyg',
      'Frontpaneler, drejeknapper og beslag med flot anodiseret overflade'
    ]
  },
  messing_ms58: {
    id: 'messing_ms58',
    name: 'Automatmessing',
    alloyName: 'CuZn39Pb3 (MS58)',
    density: 8.50,
    machinability: 95,
    baseVcSpeed: 160,
    baseFeedPerTooth: 0.10,
    coolantRequired: 'compressed_air',
    advantages: [
      'Brækker automatisk i bittesmå spåner (korte spåner) under bearbejdning, hvilket forhindrer farlige fuglereder på patronen.',
      'Ekstremt lave skærekræfter samt fremragende naturlig glidekoefficient uden fedtsmøring.'
    ],
    disadvantages: [
      'Frembringer meget fint messingstøv, som dækker guider og kan trænge ind bag maskinens afskærmning.',
      'Skørt materiale; tåler kun moderate trækbelastninger og har lav slagstyrke.'
    ],
    bestUse: 'Glidelagre, dyser, specialiserede sejlholdere, gevindbøsninger og pneumatiske fittings.',
    chemicalComposition: 'Cu: 58%, Pb: 3%, Zn: 39%',
    examples: [
      'Selvsmørende glidelagre, pasbøsninger og styremuffer',
      'Finere dyser, fittings og slangekoblinger til luft og vand',
      'Maritime ornamenter, sejlholdere og skrueøjer med høj holdbarhed',
      'Præcisions-kontakter, klemterminaler og elektronisk forbindelsesmateriel'
    ]
  },
  normalt_staal: {
    id: 'normalt_staal',
    name: 'Normalt Stål',
    alloyName: 'C45 (W.Nr. 1.0503)',
    density: 7.85,
    machinability: 60,
    baseVcSpeed: 90,
    baseFeedPerTooth: 0.08,
    coolantRequired: 'emulsion',
    advantages: [
      'Meget alsidigt konstruktionsstål med god mekanisk styrke, sejhed og fremragende gevindskæringsegenskaber.',
      'Utrolig prisbilligt og nemt at skaffe på ethvert traditionelt maskinværksted.'
    ],
    disadvantages: [
      'Korroderer (ruster) ekstremt hurtigt uden konstant efterbehandling, f.eks. brunering eller WD-40 olie.',
      'Kan danne meget lange, seje spåner ved for lave tilspændinger, hvilket kræver aktiv overvågning under grovdrejning.'
    ],
    bestUse: 'Transmissionsaksler, passpindler, kraftige monteringsbøjler, tappe og mekaniske flanger.',
    chemicalComposition: 'C: 0.45%, Si: 0.25%, Mn: 0.65%',
    examples: [
      'Gjorte maskinaksler, spindler, transmissionsaksler og tappe',
      'Tandhjul, drivremshjul og robuste mekaniske koblinger',
      'Tunge montagebeslag, vinkelbøjler og maskinfødder',
      'Forskellige typer slidstærke gevindskårne bolte og tappe'
    ]
  },
  rustfrit_316: {
    id: 'rustfrit_316',
    name: 'Rustfast / Rustfrit Stål',
    alloyName: 'AISI 316L (EN 1.4404)',
    density: 7.98,
    machinability: 35,
    baseVcSpeed: 55,
    baseFeedPerTooth: 0.05,
    coolantRequired: 'oil',
    advantages: [
      'Uovertruffen korrosions- og syrebestandighed i aggressive væsker, saltvand og fødevaremiljøer.',
      'Ekstremt stor mekanisk sejhed og glimrende slidtolerance under ekstreme temperaturer.'
    ],
    disadvantages: [
      'Sejt og hårdt at bearbejde. Hvis skæret dvæler ét sekund, arbejdshærder materialets overflade øjeblikkeligt.',
      'Ultrahøj varmeudvikling direkte på skærkanten slider voldsomt hurtigt på hårdmetalværktøjer.'
    ],
    bestUse: 'Kemiske flanger, aksler til marine- og offshoreapplikationer, mælkefeedfittings og syrefaste beslag.',
    chemicalComposition: 'Cr: 17%, Ni: 12%, Mo: 2.2%, C < 0.03%',
    examples: [
      'Marinebeslag, hængsler og aksler til lystbåde og offshore',
      'Fødevaregodkendte rørfittings, tragte og slagterimaskineri',
      'Medicinsk instrumentarium og sterile laboratoriebeslag',
      'Udendørs eksponerede skruer, tappe, gevindstænger og flanger'
    ]
  },
  vaerktoej_arne: {
    id: 'vaerktoej_arne',
    name: 'Værktøjsstål / Arnestål',
    alloyName: 'Oliehærdende Værktøjsstål (Arne / O1)',
    density: 7.82,
    machinability: 45,
    baseVcSpeed: 65,
    baseFeedPerTooth: 0.06,
    coolantRequired: 'emulsion',
    advantages: [
      'Kan efter bearbejdning nemt oliehærdes op til over 60 HRC hårdhed med minimal dimensionsændring.',
      'Ualmindelig fin slidstyrke og robusthed efter hærdningsprocessen, hvilket sikrer evig levetid.'
    ],
    disadvantages: [
      'Materialet er i ubehandlet tilstand relativt tungt at skære i, og kræver robuste, vibrationsfrie opspændinger.',
      'Helt umuligt at sletdreje eller fræse med konventionelt værktøj, når emnet først er hærdet (kræver slibning).'
    ],
    bestUse: 'Snitværktøjer, præcisionstornadoer, matricer, dorn, hærdede pasbøsninger og måleinstrumenter.',
    chemicalComposition: 'C: 0.95%, Mn: 1.2%, Cr: 0.5%, W: 0.5%',
    examples: [
      'Snitværktøjer, stansebøsninger, matricer og stempler',
      'Hærdede styrestifter, pasbøsninger og centreringsdorne',
      'Præcisionstolke, gevindmåledorne og robuste måleværktøjer',
      'Skæreblade, maskinknive og matricer med ekstrem æg-holdbarhed'
    ]
  },
  plast_pom: {
    id: 'plast_pom',
    name: 'POM / Delrin',
    alloyName: 'Ertacetal C / POM-C',
    density: 1.41,
    machinability: 100,
    baseVcSpeed: 220,
    baseFeedPerTooth: 0.15,
    coolantRequired: 'compressed_air',
    advantages: [
      'Absorberer næsten intet væske/vand – bevarer ekstrem høj dimensionsstabilitet i fugtige rammer.',
      'Meget taknemmeligt at spåntage og efterlader helt skarpe, smukke og gratfri yderkanter med nyslebne skær.'
    ],
    disadvantages: [
      'Varmefølsomt; materialet deformerer eller begynder at smelte, hvis spændehastigheden er for høj i forhold til fremføringen.',
      'Har en tendens til at give efter (fjedre) under hårdt skæretryk på grund af plasticitet.'
    ],
    bestUse: 'Tandhjul, glidemuffer, tætningsringe, isoleringsbeslag og finmekaniske glidebøsninger.',
    chemicalComposition: 'Polyoxymethylen copolymer',
    examples: [
      'Støjsvage plastictandhjul, tandstænger og koblingsled',
      'Glideplader, glideskinner, føringer og muffer uden ekstern smøring',
      'Isolerende bøsninger, afstandsstykker og el-tekniske huse',
      'Mekaniske prototyper og fødevaregodkendte maskindele'
    ]
  },
  akryl_pmma: {
    id: 'akryl_pmma',
    name: 'Akryl',
    alloyName: 'PMMA (Plexiglas)',
    density: 1.18,
    machinability: 75,
    baseVcSpeed: 100,
    baseFeedPerTooth: 0.08,
    coolantRequired: 'emulsion',
    advantages: [
      'Helt glasklart og transparent råstof, der giver direkte visuelt indblik til f.eks. dæksler.',
      'Kan opnå en absolut spejlblank glansoverflade med den korrekte polering og fine sletspåner.'
    ],
    disadvantages: [
      'Ekstremt skørt plastikmateriale. Det flækker eller splintrer lynhurtigt ved højt spændetryk i skruestikken.',
      'Meget lavt smeltepunkt; spånerne kan smelte sammen til en fast, uopløselig klump om fræsehovedet.'
    ],
    bestUse: 'Værkstedsskueglas, beskyttelsesskærme, transparente dæksler og dekorative emner.',
    chemicalComposition: 'Polymethylmethacrylat',
    examples: [
      'Transparente beskyttelsesskærme og maskinafdækninger på værkstedet',
      'Skueglas til tryktanke og beholdere med væskeniveauvisning',
      'Dekorative displays, lyspaneler, infoskærme og udstillingskasser',
      'Præcisionskabinetter with fuldt visuelt indsyn til spindler og mekanik'
    ]
  },
  nylon_pa6: {
    id: 'nylon_pa6',
    name: 'Nylon',
    alloyName: 'PA 6 (Polyamid 6)',
    density: 1.13,
    machinability: 85,
    baseVcSpeed: 140,
    baseFeedPerTooth: 0.12,
    coolantRequired: 'compressed_air',
    advantages: [
      'Fantastisk slidstyrke, hårdhed og sejhed, hvilket udelukker friktioners slitage ved mekanisk glidning.',
      'Høj vibrationsdæmpende evne samt fremragende modstandsdygtighed over for kemiske smøremidler.'
    ],
    disadvantages: [
      'Hygroskopisk; Nylon optager løbende omgivende luftfugtighed, hvilket ændrer de kritiske tolerancemål over tid.',
      'Ekstremt sejt at afgratte. Efterlader lange seje plasttråde på kanterne, der skal fjernes med saks eller kniv.'
    ],
    bestUse: 'Slidplader, dæmpende tandhjul, kileremskiver, styreruller og stødsikre plastbøsninger.',
    chemicalComposition: 'Polyamid 6',
    examples: [
      'Slidstærke styreruller, sværlasthjul og remskiver m/ lydløs gang',
      'Kraftige kileremsskiver og dæmpende tandhjul til industrimaskiner',
      'Kemisk resistente tætningsskiver og skraberblade',
      'Stødsikre maskinbøsninger og vibrationsdæmpende mellemlægsskiver'
    ]
  }
};

// ============================================================================
// ISO 286 SYSTEM FOR LIMITS AND FITS (PASNINGSBEREGNING TYPE-A)
// Real dynamic micrometer calculation engine for Danish engineers!
// Calculates deviations in microns (µm) based on diameter group and standard tolerance
// ============================================================================

export interface FitResult {
  nominalSize: number;
  fitCode: string; // e.g. "H7", "g6"
  isHole: boolean;
  upperDeviation: number; // in µm (e.g., +21)
  lowerDeviation: number; // in µm (e.g., 0)
  maxLimit: number; // in mm
  minLimit: number; // in mm
  typeOfFitDescription: string;
}

// Group definitions: lower bound inclusive, upper bound exclusive (except for very small values)
const ISO_SIZE_GROUPS = [
  { min: 0, max: 3 },
  { min: 3, max: 6 },
  { min: 6, max: 10 },
  { min: 10, max: 18 },
  { min: 18, max: 30 },
  { min: 30, max: 50 },
  { min: 50, max: 80 },
  { min: 80, max: 120 }
];

// Exact values in microns (µm) for standard fits
// Maps size group index to [upperDeviation, lowerDeviation] in micrometers (µm)
const FIT_DEVIATION_TABLES: Record<string, number[][]> = {
  // HOLES (Inward tolerance)
  H7: [
    [10, 0],   // 0-3 mm
    [12, 0],   // 3-6 mm
    [15, 0],   // 6-10 mm
    [18, 0],   // 10-18 mm
    [21, 0],   // 18-30 mm
    [25, 0],   // 30-50 mm
    [30, 0],   // 50-80 mm
    [35, 0]    // 80-120 mm
  ],
  H8: [
    [14, 0],
    [18, 0],
    [22, 0],
    [27, 0],
    [33, 0],
    [39, 0],
    [46, 0],
    [54, 0]
  ],
  H11: [
    [60, 0],
    [75, 0],
    [90, 0],
    [110, 0],
    [130, 0],
    [160, 0],
    [190, 0],
    [220, 0]
  ],

  // SHAFTS - SLIDING / PRESS (Outward tolerance)
  g6: [
    [-2, -8],    // 0-3 mm
    [-4, -12],   // 3-6 mm
    [-5, -14],   // 6-10 mm
    [-6, -17],   // 10-18 mm
    [-7, -20],   // 18-30 mm
    [-9, -25],   // 30-50 mm
    [-10, -29],  // 50-80 mm
    [-12, -34]   // 80-120 mm
  ],
  h6: [
    [0, -6],
    [0, -8],
    [0, -9],
    [0, -11],
    [0, -13],
    [0, -16],
    [0, -19],
    [0, -22]
  ],
  f7: [
    [-6, -16],
    [-10, -22],
    [-13, -28],
    [-16, -34],
    [-20, -41],
    [-25, -50],
    [-30, -60],
    [-36, -71]
  ],
  k6: [
    [6, 0],
    [9, 1],
    [10, 1],
    [12, 1],
    [15, 2],
    [18, 2],
    [21, 2],
    [25, 3]
  ],
  p6: [
    [12, 6],
    [20, 12],
    [24, 15],
    [29, 18],
    [35, 22],
    [42, 26],
    [51, 32],
    [59, 37]
  ]
};

export function calculateISOFit(nominalSize: number, fitCode: string): FitResult | null {
  if (nominalSize <= 0 || nominalSize > 120) return null;

  // Find size group
  const groupIndex = ISO_SIZE_GROUPS.findIndex(g => nominalSize >= g.min && nominalSize <= g.max);
  if (groupIndex === -1) return null;

  const deviations = FIT_DEVIATION_TABLES[fitCode];
  if (!deviations) return null;

  const [dur, dlr] = deviations[groupIndex];
  const isHole = fitCode.startsWith('H');

  const upperDeviation = dur;
  const lowerDeviation = dlr;

  const maxLimit = nominalSize + upperDeviation / 1000;
  const minLimit = nominalSize + lowerDeviation / 1000;

  // Fit categories in Danish workshop vocabulary
  let typeOfFitDescription = 'Standard dimension';
  if (isHole) {
    if (fitCode === 'H7') typeOfFitDescription = 'Præcis, tæt udboring. Ideel til lejeskåle, positioneringshuller og tæt pasning.';
    if (fitCode === 'H8') typeOfFitDescription = 'Mellemstor toleranceboring. God til styrestifter og akseldæksler.';
    if (fitCode === 'H11') typeOfFitDescription = 'Grov udboring / frigangsmål. Ingen præcisionsglidekrav.';
  } else {
    if (fitCode === 'g6') typeOfFitDescription = 'Løbende pasning (Glidepasning). Let at skyde sammen i hånden under oliefilm. Varmefri rotation.';
    if (fitCode === 'h6') typeOfFitDescription = 'Tæt pasning (Skubbe-pasning). Ingen mærkbar slør, glider mærkbart stramt sammen i hånden.';
    if (fitCode === 'f7') typeOfFitDescription = 'Frigangpasning (Løs pasning). Bruges til kileremskiver, tandhjul eller aksler med mærkbar ekspansionsrum.';
    if (fitCode === 'k6') typeOfFitDescription = 'Let pressepasning (Mellempasning). Kan samles med lette slag fra en plastikhammer eller dorn.';
    if (fitCode === 'p6') typeOfFitDescription = 'Tung pressepasning (Fast pasning). Kræver hydraulisk presse eller krympning (opvarmning af emne).';
  }

  return {
    nominalSize,
    fitCode,
    isHole,
    upperDeviation,
    lowerDeviation,
    maxLimit,
    minLimit,
    typeOfFitDescription
  };
}
