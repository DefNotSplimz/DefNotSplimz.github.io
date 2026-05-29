import { useState, useEffect, FormEvent } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Cpu, 
  Layers, 
  Mail, 
  MapPin, 
  Clock,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Zap,
  Wrench,
  Binary,
  ArrowRight,
  Info,
  ChevronRight,
  Sparkles,
  Activity,
  Gauge,
  Award,
  LogOut,
  Atom,
  Coins,
  Compass,
  FileText,
  Plus,
  Trash2,
  AlertTriangle,
  Hammer
} from 'lucide-react';
import PartGallery from './components/PartGallery';
import { calculateISOFit, MATERIAL_DATA_DB } from './utils';
import { motion, AnimatePresence } from 'motion/react';

const qaData: Record<string, { question: string; answerTitle: string; answerContent: string }> = {
  why: {
    question: "Fra Låsesmed til Finmekaniker-lærling?",
    answerTitle: "Fra bevægelige låsedele til CNC micro-tolerancer",
    answerContent: "Jeg startede faktisk med en drøm om at blive Låsesmed. Jeg har altid syntes, at de mange bevægelige dele i mekaniske låse var fascinerende, og jeg ville gerne gøre en direkte forskel for folk, hvor jeg kan.\n\nMen da jeg endnu ikke havde kørekort (hvilket jeg stadig arbejder på), mødte jeg afslag de steder, jeg søgte læreplads. Sammen med mine undervisere undersøgte jeg derfor Finmekaniker-uddannelsen, som deler grundforløb med Låsesmed.\n\nDet viste sig at være et lykketræf! Jeg fandt hurtigt ud af, at jeg havde en særlig snilde til at håndtere de manuelle maskiner bedre end låsesmedene – og endda bedre end nogle af de andre finmekanikere på holdet. Derfra voksede min store interesse for alvor frem."
  },
  school: {
    question: "Hvordan ser hverdagen ud i Skolepraktikken (SKP)?",
    answerTitle: "Et levende, professionelt værkstedsmiljø",
    answerContent: "Vores hold har faktisk ikke noget fast navn, men hverdagen på SKP'en er fyldt med gang i den! Det er bevidst bygget op til at simulere en rigtig, professionel læreplads og hverdagen på et maskinværksted.\n\nMeget af tiden går med de opgaver, som instruktørerne stiller os, eller spændende selvvalgte projekter. Jeg blev hurtigt introduceret til vores CNC-styrede maskiner, og jeg vidste med det samme, at det var her, jeg hørte hjemme – mens andre på holdet foretrækker at stå ved de klassiske manuelle maskiner."
  },
  pride: {
    question: "Hvad er din hidtil største faglige stolthed?",
    answerTitle: "Messing-sejlholderen: Min allerførste kundebestilling",
    answerContent: "Min absolut største faglige stolthed til dato var det første rigtige emne, jeg fik udefra og skulle fremstille. Det var en specialbygget sejlholder i messing til en af vores instruktører ovre fra TEC's smedeafdeling.\n\nSelvom det måske lyder som en simpel opgave for en erfaren operatør, vil den del altid have en helt speciel plads i mit hjerte. Den gav mig en fantastisk følelse i kroppen af at have leveret et rigtigt, værdifuldt stykke faglært arbejde fra bunden."
  },
  errors: {
    question: "Hvad sker der, når tolerancen skrider eller et mål overskrides?",
    answerTitle: "Tolerancer skal respekteres – fejl bruges til optimering",
    answerContent: "Man er selvfølgelig altid dybt spændt og håber inderligt, at man ikke har overskredet eller underskredet målene, når man tager den endelige måling med mikrometeret.\n\nMen da vi mennesker ikke er fejlfrie, sker der fejl af og til – det er en uundgåelig del af læringen. Når et mål skrider, finder vi ud af, nøjagtigt hvor fejlen opstod (G-kode, opspænding, slidt værktøj eller forkert skæredata), justerer parametrene på maskinen og starter forfra på en ny del med et smil."
  },
  teacher: {
    question: "Hvordan er samarbejdet med instruktørerne på TEC?",
    answerTitle: "Hvordan jeg blev døbt \"CNC-gutten\"",
    answerContent: "Vi har ikke faste klasselærere – her i SKP'en kalder vi dem bare for vores instruktører. Som på enhver anden læreplads vil ens instruktører stole mere og mere på én, jo mere man beviser sin selvstændighed, præcision og modenhed.\n\nDet var præcis derved, jeg fik tildelt øgenavnet \"CNC-gutten\" på værkstedet. Jeg lærte nemlig lynhurtigt mig selv, præcis hvordan vores Haas-maskiner kørte og fungerede. I dag kan jeg helt uden hjælp udefra programmere, sætte op og køre både mine egne og mine kammeraters CNC-programmer."
  },
  bribe: {
    question: "Hvad holder operatøren i gang i løbet af en lang dag på CNC'en?",
    answerTitle: "Uofficielt brændstof: Monster & Lidl-croissanter",
    answerContent: "Fordi vi kører under skolepraktik, må vi selvfølgelig ikke tage imor penge for vores hjælp til prototyper på værkstedet. Men der er ét uofficielt brændstof, der altid virker fantastisk på mig:\n\nStik mig 2 Monster Energidrikke (enten de klassiske hvide eller de grønne), så er min CNC-energi sikret for resten af dagen! Kombinerer du det med en af de sprøde, gode smørcroissanter fra Lidl, slår du aldrig fejl. Det er den absolut bedste bestikkelse, man kan bringe til operatørkonsollen!"
  },
  future: {
    question: "Hvad er den helt store fremtidsdrøm som finmekaniker?",
    answerTitle: "Eget garagemaskinværksted ligesom på YouTube",
    answerContent: "Den helt ultimative fremtidsdrøm er at blive selvstændig og opbygge mit helt eget fuldt udrustede præcisionsværksted hjemme i garagen.\n\nJeg er personligt utrolig inspireret af en YouTuber ved navn \"Inheritance Machining\". Han arvede et gammelt maskinværksted efter sin morfar og har lært sig selv alt op inden for faget fra bunden af. At køre sin egen butik, skabe skræddersyede dele og lade kreativiteten råde i sit eget værksted – det er det absolut fedeste mål, jeg arbejder henimod."
  }
};

export const MACHINE_LIST = [
  { id: 'haas-lathe', name: 'Haas ST-10 CNC-Drejebænk', short: 'Haas ST-10', icon: '⚡' },
  { id: 'haas-mill-1', name: 'Haas Mini Mill #1 (HSM)', short: 'Mini Mill #1 (HSM)', icon: '🌀' },
  { id: 'haas-mill-2', name: 'Haas Mini Mill #2', short: 'Mini Mill #2', icon: '💠' },
  { id: 'weiler-lathe', name: 'Weiler Matador Manuel Drejebænk', short: 'Weiler Matador', icon: '⚙️' },
  { id: 'deckel-mill', name: 'Deckel FP1 Universal Fræser', short: 'Deckel FP1', icon: '📐' },
  { id: 'haas-desktop-mill', name: 'Haas Desktop Mill', short: 'Desktop Mill', icon: '💻' }
];

export default function App() {
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'skills' | 'portfolio' | 'requisition'>('home');
  const [hoveredSection, setHoveredSection] = useState<'about' | 'skills' | 'portfolio' | 'requisition'>('about');
  const [selectedQAId, setSelectedQAId] = useState<string>('why');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  
  // Real simulated machine status metrics (µm Precision telemetry)
  const [machineX, setMachineX] = useState<string>('125.045');
  const [machineY, setMachineY] = useState<string>('84.182');
  const [machineZ, setMachineZ] = useState<string>('-12.850');
  const [coolantLevel, setCoolantLevel] = useState<number>(98);
  const [spindleSpeed, setSpindleSpeed] = useState<number>(1800);
  const [spindleLoad, setSpindleLoad] = useState<number>(24);

  // Requisition Interactive Job Drawer state
  const [customerName, setCustomerName] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [projectDesc, setProjectDesc] = useState<string>('');
  const [reqMaterial, setReqMaterial] = useState<string>('');
  const [reqLength, setReqLength] = useState<string>('');
  const [reqDiameter, setReqDiameter] = useState<string>('');
  const [reqFitCode, setReqFitCode] = useState<string>('');
  const [suppliesOwnMaterial, setSuppliesOwnMaterial] = useState<boolean>(false);
  const [candyType, setCandyType] = useState<string>('');
  const [reqProcess, setReqProcess] = useState<string>('');
  const [reqRoughness, setReqRoughness] = useState<string>('');
  const [reqToleranceClass, setReqToleranceClass] = useState<string>('');
  const [reqThread, setReqThread] = useState<string>('');
  const [reqCoolant, setReqCoolant] = useState<string>('emulsion');
  const [reqPriority, setReqPriority] = useState<string>('');
  const [reqHasDrawing, setReqHasDrawing] = useState<string>('');

  // Ongoing projects state with localStorage persistence
  const [ongoingProjects, setOngoingProjects] = useState<any[]>(() => {
    const saved = localStorage.getItem('glen_ongoing_projects_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => {
          if (!p.machines) {
            let machines: string[] = [];
            const statusLower = (p.status || '').toLowerCase();
            if (statusLower.includes('haas st') || statusLower.includes('drej')) machines.push('haas-lathe');
            if (statusLower.includes('weiler') || statusLower.includes('manuel drej')) machines.push('weiler-lathe');
            if (statusLower.includes('deckel') || statusLower.includes('universal fræs')) machines.push('deckel-mill');
            if (statusLower.includes('mini mill') || statusLower.includes('fræs')) machines.push('haas-mill-1');
            if (machines.length === 0) {
              machines = ['haas-lathe'];
            }
            return { ...p, machines };
          }
          return p;
        });
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'p1',
        name: 'Vakuum-koblingsflanger (Ø60mm)',
        client: 'Niels Bohr Institutet (Laboratorie-forskning)',
        material: 'aluminium',
        machines: ['haas-mill-1', 'haas-mill-2'],
        progress: 30,
        priority: 'medium',
        addedAt: '2026-05-28'
      },
      {
        id: 'p2',
        name: 'Special-geardæksel med O-ringsnot',
        client: 'Sørensen Maskinteknik ApS (Ekstern kunde)',
        material: 'plast_pom',
        machines: ['deckel-mill', 'haas-mill-1'],
        progress: 75,
        priority: 'high',
        addedAt: '2026-05-27'
      },
      {
        id: 'p3',
        name: 'Messingbøsninger til gearkasse-renovering',
        client: 'Mogens (Privat - Veteranbil-restaurering)',
        material: 'messing_ms58',
        machines: ['weiler-lathe'],
        progress: 100,
        priority: 'low',
        addedAt: '2026-05-25'
      },
      {
        id: 'p4',
        name: 'Hærdede pasbolte til stansesnit',
        client: 'Dansk Værktøjsfabrik A/S (Ekstern partner)',
        material: 'vaerktoej_arne',
        machines: ['haas-lathe', 'weiler-lathe'],
        progress: 15,
        priority: 'high',
        addedAt: '2026-05-28'
      }
    ];
  });

  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [adminPasscode, setAdminPasscode] = useState<string>('');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return localStorage.getItem('glen_admin_authorized') === 'true';
  });
  const [passcodeError, setPasscodeError] = useState<string>('');

  const [newProjName, setNewProjName] = useState<string>('');
  const [newProjClient, setNewProjClient] = useState<string>('');
  const [newProjMaterial, setNewProjMaterial] = useState<string>('aluminium');
  const [newProjMachines, setNewProjMachines] = useState<string[]>(['haas-lathe']);
  const [newProjProgress, setNewProjProgress] = useState<number>(30);
  const [newProjPriority, setNewProjPriority] = useState<string>('medium');

  // Trigger state sync on list update
  useEffect(() => {
    localStorage.setItem('glen_ongoing_projects_v2', JSON.stringify(ongoingProjects));
  }, [ongoingProjects]);

  const handleVerifyPasscode = (e: FormEvent) => {
    e.preventDefault();
    // Default secret passcode for Glen: '0406933547'
    if (adminPasscode === '0406933547') {
      setIsAuthorized(true);
      localStorage.setItem('glen_admin_authorized', 'true');
      setPasscodeError('');
      setAdminPasscode('');
    } else {
      setPasscodeError('Ugyldig operatør-kode! Adgang nægtet.');
      setIsAuthorized(false);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthorized(false);
    localStorage.removeItem('glen_admin_authorized');
    setIsAdminPanelOpen(false);
  };

  const handleAddProject = (e: FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjClient.trim()) return;
    const newProj = {
      id: 'p_' + Date.now(),
      name: newProjName.trim(),
      client: newProjClient.trim(),
      material: newProjMaterial,
      machines: newProjMachines.length > 0 ? newProjMachines : ['haas-lathe'],
      progress: Math.min(100, Math.max(0, Number(newProjProgress) || 0)),
      priority: newProjPriority,
      addedAt: new Date().toISOString().split('T')[0]
    };
    setOngoingProjects([...ongoingProjects, newProj]);
    setNewProjName('');
    setNewProjClient('');
    setNewProjMachines(['haas-lathe']);
    setNewProjProgress(30);
    setNewProjPriority('medium');
  };

  const handleDeleteProject = (id: string) => {
    setOngoingProjects(ongoingProjects.filter(p => p.id !== id));
  };

  const handleUpdateProgress = (id: string, newProgress: number) => {
    setOngoingProjects(ongoingProjects.map(p => 
      p.id === id ? { ...p, progress: Math.min(100, Math.max(0, newProgress)) } : p
    ));
  };

  const handleUpdatePriority = (id: string, newPriority: string) => {
    setOngoingProjects(ongoingProjects.map(p => 
      p.id === id ? { ...p, priority: newPriority } : p
    ));
  };

  const handleUpdateClient = (id: string, newClient: string) => {
    setOngoingProjects(ongoingProjects.map(p => 
      p.id === id ? { ...p, client: newClient } : p
    ));
  };

  const handleUpdateName = (id: string, newName: string) => {
    setOngoingProjects(ongoingProjects.map(p => 
      p.id === id ? { ...p, name: newName } : p
    ));
  };

  const handleUpdateMaterial = (id: string, newMaterial: string) => {
    setOngoingProjects(ongoingProjects.map(p => 
      p.id === id ? { ...p, material: newMaterial } : p
    ));
  };

  const handleUpdateMachines = (id: string, newMachines: string[]) => {
    setOngoingProjects(ongoingProjects.map(p => 
      p.id === id ? { ...p, machines: newMachines } : p
    ));
  };

  // Refresh live timestamps & telemetry noise
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('da-DK', { timeZone: 'UTC', hour12: false }) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const coordInterval = setInterval(() => {
      setMachineX((125.040 + Math.random() * 0.008).toFixed(3));
      setMachineY((84.180 + Math.random() * 0.004).toFixed(3));
      setMachineZ((-12.850 + Math.random() * 0.002).toFixed(3));
      setSpindleLoad(Math.floor(18 + Math.random() * 12));
      setSpindleSpeed(Math.floor(4200 + Math.random() * 300));
      setCoolantLevel(prev => Math.max(90, prev - (Math.random() > 0.85 ? 1 : 0)));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(coordInterval);
    };
  }, []);

  // Compute fit limits live for the requisition docket drawing!
  const nominalValueFloat = parseFloat(reqDiameter) || 0;
  const computedFitOfDocket = nominalValueFloat > 0 && reqFitCode ? calculateISOFit(nominalValueFloat, reqFitCode) : null;

  // Live cutter spindle speed calculator according to DATRON next style
  const materialSpeedInfo = reqMaterial && MATERIAL_DATA_DB[reqMaterial]
    ? MATERIAL_DATA_DB[reqMaterial]
    : {
        id: '',
        name: '[Vælg råmateriale]',
        alloyName: '',
        density: 2.7,
        machinability: 0,
        baseVcSpeed: 0,
        baseFeedPerTooth: 0,
        coolantRequired: 'emulsion' as const,
        advantages: [],
        disadvantages: [],
        bestUse: '',
        chemicalComposition: '',
        examples: []
      };

  const reqEmailTemplate = `================================================================================
REKVISITIONSKORT FOR PROTOTYPEFREMSTILLING // TEKNISK SKOLEPRAKTIK (TEC)
================================================================================
Reference:       DATUM-PROTO-${projectName ? projectName.toUpperCase().trim().replace(/[^A-Z0-9]/ig, '-') : 'UDEFINERET'}
Dato:            ${new Date().toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' })}
Prioritering:    ${
  reqPriority === 'express' ? 'HASTER [Eksamensdeadline]' :
  reqPriority === 'standard' ? 'STANDARD [Normal produktionscyklus]' :
  reqPriority === 'low' ? 'LAV [Hyggeprojekt / Fleksibel levering]' :
  '[IKKE VALGT - Standardprioritet gælder]'
}
Bestiller:       ${customerName ? customerName.trim() : '[Mangler Bestiller-navn]'}
Faglært tilsyn:  Skolepraktikinstruktør, TEC Frederiksberg

--------------------------------------------------------------------------------
1. EMNETEKNISKE GEOMETRISPECIFIKATIONER
--------------------------------------------------------------------------------
Bearbejdningstype:  ${
  reqProcess === 'cnc-turning' ? 'CNC Drejning (Haas ST-10 Drejecenter)' :
  reqProcess === 'cnc-milling' ? 'CNC Fræsning (Haas Mini Mill 3-akset)' :
  reqProcess === 'manual-turning' ? 'Præcisionsdrejning (Manuel letdrejebænk / Weiler Matador)' :
  reqProcess === 'manual-milling' ? 'Manuel fræsning (Universalfræser / Deckel FP1)' :
  '[IKKE VALGT]'
}
Råmateriale:        ${
  reqMaterial && MATERIAL_DATA_DB[reqMaterial]
    ? `${MATERIAL_DATA_DB[reqMaterial].name} (${MATERIAL_DATA_DB[reqMaterial].alloyName}) - [${MATERIAL_DATA_DB[reqMaterial].bestUse}]`
    : '[IKKE VALGT]'
}
Tegningstegning:    ${
  reqHasDrawing === 'yes' ? 'JA - STEP- eller PDF-tegning haves (bør vedhæftes i e-mailen!)' :
  reqHasDrawing === 'no' ? 'NEJ - Ingen separat filtegning (bygges kun ud fra beskrivelsen)' :
  '[IKKE VALGT - Ingen tegning-info angivet]'
}
Udvendige mål:      ${reqDiameter ? `Ø ${reqDiameter} mm` : '[Diameter mangler]'} x ${reqLength ? `${reqLength} mm` : '[Længde mangler]'}

Præcision og pasning:
- Diameter-mål:      ${reqDiameter ? `Ø ${reqDiameter} mm` : '[Mangler nominalværdi]'}
- Særlig pasning:    ${
  reqFitCode 
    ? `ISO 286-2 "${reqFitCode}" (${
        computedFitOfDocket 
          ? `Toleranceområde: ${computedFitOfDocket.upperDeviation > 0 ? '+' : ''}${computedFitOfDocket.upperDeviation} µm / ${computedFitOfDocket.lowerDeviation > 0 ? '+' : ''}${computedFitOfDocket.lowerDeviation} µm`
          : 'Mangler tolerancegrænse'
      })`
    : 'Ingen specifik ISO pasningsklasse angivet (Standard toleranceskema gælder)'
}
- Toleranceskema:    ISO 2768-${reqToleranceClass ? reqToleranceClass.toUpperCase() : 'M (Middel maskintolerance som default)'}
- Overfladefinish:   ${reqRoughness ? `Overfladeruhed ${reqRoughness}` : 'Standard fræseruhed (Ra 3.2 µm)'}
- Gevindskæring:     ${reqThread === 'none' || !reqThread ? 'Ingen indvendig/udvendig gevindskæring' : `Metrisk gevindtype: ${reqThread}`}

--------------------------------------------------------------------------------
2. DRIFTS- OG VÆRKSTEDSBETINGELSER
--------------------------------------------------------------------------------
Råmateriale-levering: ${
  suppliesOwnMaterial 
    ? 'JA - Bestiller medbringer selv eget råstof til maskinhallen på Stæhr Johansens Vej 7.' 
    : 'NEJ - Bestiller anmoder om værkstedets assistance til fremskaffelse samt lagerudtag.'
}
Uofficiel værkstedsvaluta (Bestikkelse til holdet):
- ${candyType ? `Bestiller ryster op med: "${candyType}"` : '[IKKE ANGIVET - Husk at medbringe slikkurv som uofficielt værkstedsbrændstof]'}

Yderligere projektbeskrivelse og tegningbetingelser:
"${projectDesc ? projectDesc.trim() : 'Ingen yderligere instruktioner eller betingelser angivet.'}"

BEMÆRK: Denne rekvisitionsrapport er maskingenereret via DATUM PROTOTYPING-systemet.
Det færdige emne fremstilles i faglæreropsyn på værkstedet på TEC Frederiksberg. 
Mekaniske blueprints, STEP-modeller og Fusion 360-filer fremsendes særskilt.
================================================================================`;

  const handleCopyReqTemplate = () => {
    navigator.clipboard.writeText(reqEmailTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 3000);
  };

  const handlePrintDraftingSheet = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#081019] text-[#e2edf8] flex flex-col font-sans relative select-none overflow-x-hidden pb-12 studio-grid studio-canvas">
      
      {/* Top Telemetry system HUD bar */}
      <div className="no-print bg-[#0f2136]/95 border-b border-[#1a3554] text-[10px] px-6 py-2.5 flex justify-between items-center z-50 sticky top-0 backdrop-blur-md font-mono text-[#8fa3ba]">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#bdff00] micro-pulse" />
          <span className="font-bold tracking-wider text-[#e2edf8]">
            SYSTEM: ONLINE // X_OFFS: <span className="text-white">{machineX}</span> // Z_OFFS: <span className="text-white">{machineZ}</span>
          </span>
        </div>
        
        <p className="text-[#8fa3ba] hidden lg:block tracking-widest font-light text-[9.5px]">
          HAAS TELEMETRY: SPINDLE: <span className="text-[#bdff00] font-bold">{spindleSpeed} RPM</span> // LOAD: <span className="text-white">{spindleLoad}%</span> // COOLER_M08: <span className="text-[#00e5ff] font-bold">{coolantLevel}%</span>
        </p>

        <div className="flex items-center gap-2 text-[#e2edf8]">
          <Clock className="w-3.5 h-3.5 text-[#bdff00]" />
          <span>{currentTime || 'CALCULATING CLOCKS...'}</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between relative z-10">
        
        <AnimatePresence mode="wait">
          {activeSection === 'home' ? (
            <motion.div 
              key="main-menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center my-auto py-8 w-full max-w-6xl mx-auto space-y-10"
            >
              {/* Centered Brand Header & CNC Status Block */}
              <div className="text-center space-y-3 max-w-2xl select-none">
                <div className="inline-flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#bdff00] rounded flex flex-col items-center justify-center relative shadow-lg shadow-[#bdff00]/15">
                    <span className="font-display font-black text-xl text-black select-none mt-0.5">D</span>
                    <div className="absolute top-0.5 left-0.5 w-[3px] h-[3px] bg-black rounded-full mt-0.5 ml-0.5" />
                    <div className="absolute top-0.5 right-0.5 w-[3px] h-[3px] bg-black rounded-full mt-0.5 mr-0.5" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-black tracking-widest text-white uppercase leading-none">
                      DATUM <span className="font-light text-[#bdff00]">PROTOTYPING</span>
                    </h2>
                  </div>
                </div>
                
                <p className="text-[10px] font-mono tracking-widest text-[#bdff00] uppercase block font-bold">
                  OS v2.4 // FINMEKANISK KONTROLHUB // TEC FREDERIKSBERG
                </p>
                
                <p className="text-xs text-[#8fa3ba] font-sans font-light leading-relaxed pt-2 max-w-xl mx-auto">
                  Skolepraktik på <strong className="text-white">TEC Frederiksberg</strong> under faglærertilsyn. Vi fræser og drejer dine emneblueprints i aluminium, stål, messing eller POM mod betaling af bland-selv-slik og kolde sodavand!
                </p>
              </div>

              {/* Centered Grid of 4 Massive DATRON next Touch-Screen Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                
                {/* BUTTON 1: Hvem er jeg? (CAM Assistant / Operatør) */}
                <motion.button
                  onClick={() => setActiveSection('about')}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-[#0f2136]/90 border border-[#1a3554] hover:border-[#bdff00] rounded-xl p-5 text-left flex flex-col justify-between h-[360px] cursor-pointer transition-all hover:shadow-2xl hover:shadow-[#bdff00]/10 relative overflow-hidden"
                >
                  {/* Flat CAM assistant UI block */}
                  <div className="h-28 bg-[#081320] rounded-lg border border-[#162e4c] p-3 flex flex-col justify-between font-mono text-[9px] select-none mb-3">
                    <div className="flex justify-between items-center text-[#bdff00] text-[8px] font-bold">
                      <span>CAM ASSISTANT</span>
                      <span>ID: OPERATOR_GLEN</span>
                    </div>
                    <div className="flex items-center gap-2 border-l-2 border-[#bdff00] pl-2 py-1">
                      <div className="w-5 h-5 rounded-full bg-[#bdff00]/20 flex items-center justify-center text-[#bdff00] font-bold text-[8px]">
                        G
                      </div>
                      <div>
                        <p className="text-white font-bold leading-none">Glen</p>
                        <p className="text-[7.5px] text-[#8fa3ba] mt-0.5">Finmekaniker Elev • TEC SKP</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-[7px] text-[#8fa3ba] border-t border-[#132840] pt-1">
                      <span>STATUS: SELVKØRENDE</span>
                      <span>VERSION: G54.V2</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#081320] border border-[#bdff00]/35 text-[#bdff00]">
                          [ F1 ]
                        </span>
                        <span className="text-[8px] font-mono text-[#8fa3ba] uppercase">SYS_ABOUT_GLEN</span>
                      </div>
                      <h4 className="font-display font-medium uppercase text-sm tracking-wider text-white group-hover:text-[#bdff00] transition-colors">
                        &quot;Hvem er jeg?&quot;
                      </h4>
                      <p className="text-[11px] text-[#8fa3ba] mt-2 font-light font-sans leading-relaxed">
                        Mød Glen, finmekaniker-elev på TEC Frederiksberg. Læs om min passion for drejebænke, skolerobusthed og millimeterpræcision.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1a3554] flex items-center justify-between font-mono text-[9px] text-[#bdff00]">
                      <span>OPERATØR SPECIFIKATIONER</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>

                {/* BUTTON 2: Hvad kan jeg (Tool Management & Maskiner) */}
                <motion.button
                  onClick={() => setActiveSection('skills')}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-[#0f2136]/90 border border-[#1a3554] hover:border-[#00e5ff] rounded-xl p-5 text-left flex flex-col justify-between h-[360px] cursor-pointer transition-all hover:shadow-2xl hover:shadow-[#00e5ff]/10 relative overflow-hidden"
                >
                  {/* Flat Tool life/status bar UI */}
                  <div className="h-28 bg-[#081320] rounded-lg border border-[#162e4c] p-3 flex flex-col justify-between font-mono text-[9px] select-none mb-3">
                    <div className="flex justify-between items-center text-[#00e5ff] text-[8px] font-bold">
                      <span>TOOL MANAGEMENT</span>
                      <span>ACTIVE: 6 TOOLS</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[8px] text-[#e2edf8]">
                        <span className="text-[#8fa3ba]">#1 HAAS ST-10:</span>
                        <span className="text-white font-bold">CNC TURRET</span>
                      </div>
                      <div className="flex justify-between text-[8px] text-[#e2edf8]">
                        <span className="text-[#8fa3ba]">#2 DECKEL FP1:</span>
                        <span className="text-white font-bold">UNIVERSAL DRO</span>
                      </div>
                      <div className="flex justify-between text-[8px] text-[#e2edf8]">
                        <span className="text-[#8fa3ba]">#3 DESKTOP MILLS:</span>
                        <span className="text-[#bdff00] font-bold">10 x HAAS NGC</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#132840] h-1 rounded-full overflow-hidden">
                      <div className="bg-[#00e5ff] h-full w-[85%]" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#081320] border border-[#00e5ff]/35 text-[#00e5ff]">
                          [ F2 ]
                        </span>
                        <span className="text-[8px] font-mono text-[#8fa3ba] uppercase">SYS_WORKSHOP_GEAR</span>
                      </div>
                      <h4 className="font-display font-medium uppercase text-sm tracking-wider text-white group-hover:text-[#00e5ff] transition-colors">
                        &quot;Hvad kan jeg&quot;
                      </h4>
                      <p className="text-[11px] text-[#8fa3ba] mt-2 font-light font-sans leading-relaxed">
                        Udforsk vores Haas CNC-værktøjsmaskiner, manuelle Schweizer-drejebænke samt skæredata for aluminium, messing, stål og POM.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1a3554] flex items-center justify-between font-mono text-[9px] text-[#00e5ff]">
                      <span>MASKINPARK & RÅSTOFFER</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>

                {/* BUTTON 3: Hvad har jeg lavet (Program Management / Portfolio) */}
                <motion.button
                  onClick={() => setActiveSection('portfolio')}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-[#0f2136]/90 border border-[#1a3554] hover:border-amber-500 rounded-xl p-5 text-left flex flex-col justify-between h-[360px] cursor-pointer transition-all hover:shadow-2xl hover:shadow-amber-950/10 relative overflow-hidden"
                >
                  {/* G-Code and Folder list widget */}
                  <div className="h-28 bg-[#081320] rounded-lg border border-[#162e4c] p-3 flex flex-col justify-between font-mono text-[9px] select-none mb-3">
                    <div className="flex justify-between items-center text-amber-500 text-[8px] font-bold">
                      <span>PROGRAM DIRECTORY</span>
                      <span>ACTIVE: G-CODE</span>
                    </div>
                    <div className="space-y-1 pt-1 text-[8px]">
                      <p className="font-bold text-white flex items-center gap-1">
                        <span className="text-amber-500">📁</span> PROG_VAKUUM_MOTOR.nc
                      </p>
                      <p className="text-[#8fa3ba] pl-3 leading-none">↳ N010 G90 G21 G54</p>
                      <p className="text-[#8fa3ba] pl-3 leading-none">↳ N020 M03 S10000 M08</p>
                    </div>
                    <div className="flex justify-between text-[7px] text-[#8fa3ba] border-t border-[#132840] pt-1">
                      <span>SIZE: 4.8 KB</span>
                      <span>CHECKSUM: OK</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#081320] border border-amber-500/35 text-amber-400">
                          [ F3 ]
                        </span>
                        <span className="text-[8px] font-mono text-[#8fa3ba] uppercase">SYS_PORTFOLIO</span>
                      </div>
                      <h4 className="font-display font-medium uppercase text-sm tracking-wider text-white group-hover:text-amber-400 transition-colors">
                        &quot;Hvad har jeg lavet&quot;
                      </h4>
                      <p className="text-[11px] text-[#8fa3ba] mt-2 font-light font-sans leading-relaxed">
                        Anskaf et komplet overblik over maskinarbejde. Se min samling af afgangsprojekter, Stirling-motorer og præcisionsdrejede emner.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1a3554] flex items-center justify-between font-mono text-[9px] text-amber-400">
                      <span>PROJEKT ARKIV</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>

                {/* BUTTON 4: Hvordan kan jeg hjælpe dig (Work Piece Setup & G54) */}
                <motion.button
                  onClick={() => setActiveSection('requisition')}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-[#0f2136]/90 border border-[#1a3554] hover:border-[#bdff00] rounded-xl p-5 text-left flex flex-col justify-between h-[360px] cursor-pointer transition-all hover:shadow-2xl hover:shadow-[#bdff00]/10 relative overflow-hidden"
                >
                  {/* Work piece crosshair calibration target */}
                  <div className="h-28 bg-[#081320] rounded-lg border border-[#162e4c] p-3 flex flex-col justify-between font-mono text-[9px] select-none mb-3">
                    <div className="flex justify-between items-center text-[#bdff00] text-[8px] font-bold">
                      <span>WORK PIECE SETUP</span>
                      <span>ACTIVE OFFSET</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <div className="space-y-0.5 text-left text-[8px]">
                        <p className="text-white font-bold">G54 state: <span className="text-[#bdff00]">CLEAR</span></p>
                        <p className="text-[#8fa3ba] truncate w-24">Bribe: Pepsi & Slik</p>
                      </div>
                      {/* Flat touch calibration graphic */}
                      <div className="w-8 h-8 rounded-full border border-dashed border-[#bdff00]/40 flex items-center justify-center relative">
                        <div className="absolute w-4 h-px bg-[#bdff00]/60" />
                        <div className="absolute h-4 w-px bg-[#bdff00]/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#bdff00]" />
                      </div>
                    </div>
                    <div className="flex justify-between text-[7px] text-[#8fa3ba] border-t border-[#132840] pt-1">
                      <span>STOCK: Ø20x60mm</span>
                      <span>G54 STATE: CALIBRATED</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#081320] border border-[#bdff00]/35 text-[#bdff00]">
                          [ F4 ]
                        </span>
                        <span className="text-[8px] font-mono text-[#8fa3ba] uppercase">SYS_REQUISITIONS</span>
                      </div>
                      <h4 className="font-display font-medium uppercase text-sm tracking-wider text-white group-hover:text-[#bdff00] transition-colors">
                        &quot;Hvordan kan jeg hjælpe dig&quot;
                      </h4>
                      <p className="text-[11px] text-[#8fa3ba] mt-2 font-light font-sans leading-relaxed">
                        Her er der hvor folk kan klikke ind for at bestille mig og min hjælp. Udfyld din lynhurtige prototype-rekvisition.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1a3554] flex items-center justify-between font-mono text-[9px] text-[#bdff00]">
                      <span>REKVISITIONSKOLONNE</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>

              </div>

              {/* Ongoing Projects and Workload Board Section */}
              <div className="w-full bg-[#0f2136]/90 border border-[#1a3554] rounded-xl overflow-hidden shadow-2xl relative">
                {/* Board header */}
                <div className="bg-[#10243d] px-5 py-3 border-b border-[#1a3554] flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Activity className="text-[#bdff00] w-4 h-4" />
                    <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                      Nuværende og fremtidige projekter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAuthorized && (
                      <button
                        onClick={handleLogoutAdmin}
                        className="px-3 py-1 bg-[#201012] border border-red-500/20 text-red-400 font-mono text-[9px] uppercase font-semibold rounded-md hover:text-white hover:bg-red-500/10 transition-all flex items-center gap-1 cursor-pointer"
                        title="Log ud af administrator-tilstand"
                      >
                        <span>🔒 LOG UD</span>
                      </button>
                    )}
                    <button
                      onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
                      className="px-3 py-1 bg-[#081320] border border-[#1a3554] text-[#8fa3ba] font-mono text-[9px] uppercase font-bold rounded-md hover:text-[#bdff00] hover:border-[#bdff00]/40 transition-[colors,border] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Settings size={11} className={isAdminPanelOpen ? 'animate-spin' : ''} />
                      <span>{isAdminPanelOpen ? 'SKJUL PANEL' : 'ÅBEN OPERATØR-PANEL'}</span>
                    </button>
                  </div>
                </div>

                {/* Dashboard summary statistics row */}
                {(() => {
                  const activeProjects = ongoingProjects.filter(p => p.progress < 100);
                  const activeCount = activeProjects.length;
                  const highPriorityCount = activeProjects.filter(p => p.priority === 'high' || p.priority === 'critical').length;
                  
                  // Clever dynamic workload algorithm!
                  const totalLoad = Math.min(100, Math.max(10, activeCount * 22 + highPriorityCount * 12));
                  
                  let loadLevelText = "LEDIG KAPACITET";
                  let loadColorClass = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
                  let loadDotClass = "bg-emerald-400";
                  let loadDescription = "Jeg har masser af ledig tid i maskinhallen lige nu! Send endelig din bestilling ind via rekvisitionen ovenfor.";

                  if (totalLoad > 80) {
                    loadLevelText = "MAKSIMALT PRESSET";
                    loadColorClass = "text-red-400 border-red-500/30 bg-red-500/10";
                    loadDotClass = "bg-red-500 animate-ping";
                    loadDescription = "Advarsel: Værkstedet kører på absolut maks-spidstid! Længere ventetid må forventes på ikke-kritiske opgaver.";
                  } else if (totalLoad > 50) {
                    loadLevelText = "HØJ BELASTNING";
                    loadColorClass = "text-amber-400 border-amber-500/30 bg-amber-500/10";
                    loadDotClass = "bg-amber-400";
                    loadDescription = "Der er pænt meget gang i maskinerne i SKP'en lige nu. Forvent en smule forlænget ekspeditionstid.";
                  } else if (totalLoad > 20) {
                    loadLevelText = "NORMAL BELASTNING";
                    loadColorClass = "text-[#00e5ff] border-[#00e5ff]/30 bg-[#00e5ff]/10";
                    loadDotClass = "bg-[#00e5ff]";
                    loadDescription = "Normal stabil drift. Der arbejdes flittigt på opgaver, men der er plads til nye spænde projekter i køen.";
                  }

                  return (
                    <div className="p-5 border-b border-[#1a3554]/60 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-4 space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-[#8fa3ba] uppercase tracking-wider block">GLENS AKTUELLE BELASTNINGSGRAD:</span>
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-display font-black text-white tracking-tight">{totalLoad}%</span>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border uppercase rounded-md flex items-center gap-1.5 ${loadColorClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${loadDotClass}`} />
                              {loadLevelText}
                            </span>
                          </div>
                        </div>

                        {/* Custom workload bar indicator */}
                        <div className="h-2 bg-[#081320] rounded-full overflow-hidden border border-[#162e4c]">
                           <div 
                            className={`h-full transition-all duration-500 ${
                              totalLoad > 80 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 
                              totalLoad > 50 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                              'bg-gradient-to-r from-emerald-500 to-[#bdff00]'
                            }`} 
                            style={{ width: `${totalLoad}%` }} 
                          />
                        </div>

                        <p className="text-[11px] text-[#8fa3ba] font-sans leading-relaxed">
                          {loadDescription}
                        </p>
                      </div>

                      {/* General statistics boxes */}
                      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-[#081320] p-3 rounded-lg border border-[#1a3554]/50 flex flex-col justify-between">
                          <span className="text-[8px] font-mono text-[#8fa3ba] uppercase tracking-wider block">PROJEKTER I KØ (AKTUELLE)</span>
                          <span className="text-xl font-display font-black text-white block mt-1">{activeCount} aktive</span>
                          <span className="text-[9px] font-mono text-[#00e5ff] mt-1">// Bestillinger i gang på værkstedet</span>
                        </div>

                        <div className="bg-[#081320] p-3 rounded-lg border border-[#1a3554]/50 flex flex-col justify-between">
                          <span className="text-[8px] font-mono text-[#8fa3ba] uppercase tracking-wider block">KRITISKE DEADLINES</span>
                          <span className="text-xl font-display font-black text-red-400 block mt-1">{highPriorityCount} hastesager</span>
                          <span className="text-[9px] font-mono text-[#8fa3ba] mt-1">// Fuld fokus på CNC-drejning/fræsning</span>
                        </div>

                        <div className="bg-[#081320] p-3 rounded-lg border border-[#1a3554]/50 flex flex-col justify-between">
                          <span className="text-[8px] font-mono text-[#8fa3ba] uppercase tracking-wider block">FÆRDIGGJORTE PROJEKTER</span>
                          <span className="text-xl font-display font-black text-emerald-400 block mt-1">
                            {ongoingProjects.filter(p => p.progress === 100).length} stk
                          </span>
                          <span className="text-[9px] font-mono text-emerald-400/80 mt-1">// Klar til afhentning på TEC</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ================= ADMIN OPERATOR CONTROL PANEL ================= */}
                <AnimatePresence>
                  {isAdminPanelOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-5 bg-[#0a1827] border-b border-[#1a3554] space-y-4 font-sans text-xs overflow-hidden"
                    >
                      {!isAuthorized ? (
                        /* Secure Lock Screen Gate */
                        <div className="max-w-md mx-auto py-4 px-6 bg-[#06111d] border border-[#1a3554] rounded-xl shadow-lg space-y-4">
                          <div className="text-center space-y-1">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 mb-2">
                              <span>🔒</span>
                            </div>
                            <h4 className="text-white font-bold text-sm tracking-tight font-sans">Operatør-godkendelse påkrævet</h4>
                            <p className="text-xs text-[#8fa3ba]">
                              Dette panel er låst for almindelige besøgende på siden. Kun Glen kan tilføje, slette og opdatere skemaet.
                            </p>
                          </div>

                          <form onSubmit={handleVerifyPasscode} className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-[#8fa3ba] uppercase font-bold block">Indtast adgangskode</label>
                              <div className="relative">
                                <input
                                  type="password"
                                  value={adminPasscode}
                                  onChange={(e) => {
                                    setAdminPasscode(e.target.value);
                                    setPasscodeError('');
                                  }}
                                  placeholder="••••••••"
                                  className="w-full bg-[#081320] border border-[#1a3554] p-2 rounded-lg text-white font-mono tracking-widest text-center focus:border-[#bdff00] outline-none text-xs"
                                  autoFocus
                                />
                              </div>
                              {passcodeError && (
                                <p className="text-red-400 font-mono text-[9px] text-center mt-1">⚠️ {passcodeError}</p>
                              )}
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2 bg-[#bdff00] hover:bg-[#a6e000] text-black font-mono text-[10px] font-black uppercase rounded-lg transition-colors cursor-pointer"
                            >
                              Bekræft operatør-adgang
                            </button>

                            <div className="pt-2 border-t border-[#112435] text-center">
                              <span className="text-[8.5px] font-mono text-[#8fa3ba]/65 italic">
                                standard test-kode: 0406933547
                              </span>
                            </div>
                          </form>
                        </div>
                      ) : (
                        /* Normal Admin Operator Form when authorized */
                        <>
                          <div className="flex items-center justify-between border-b border-[#1a3554]/60 pb-2 text-[#bdff00]">
                            <div className="flex items-center gap-2">
                              <Terminal size={14} />
                              <span className="font-mono text-[9px] font-bold uppercase tracking-wider">
                                KONTROLKONSOL: ADMINISTRER IGANGVÆRENDE PRODUKTIONSKØ
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded">
                              ✓ ADMINISTRATOR-STATUS: GLEN
                            </span>
                          </div>

                          <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-[#8fa3ba] uppercase font-bold block">PROJEKT / EMNE NAVN <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={newProjName}
                                onChange={(e) => setNewProjName(e.target.value)}
                                placeholder="F.eks. Cylinderhoved til vakuum-motor"
                                className="w-full bg-[#081320] border border-[#1a3554] p-2 rounded-lg text-white font-semibold focus:border-[#bdff00] outline-none text-xs"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-[#8fa3ba] uppercase font-bold block">BESTILLER / KUNDE <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={newProjClient}
                                onChange={(e) => setNewProjClient(e.target.value)}
                                placeholder="F.eks. Sørensen Maskinteknik, eller Rasmus (Elev)"
                                className="w-full bg-[#081320] border border-[#1a3554] p-2 rounded-lg text-white font-semibold focus:border-[#bdff00] outline-none text-xs"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-[#8fa3ba] uppercase font-bold block">INVOLVEREDE MASKINER <span className="text-[#bdff00]">*</span></label>
                              <div className="grid grid-cols-2 gap-1 p-1 bg-[#081320] border border-[#1a3554] rounded-lg max-h-[82px] overflow-y-auto custom-scrollbar">
                                {MACHINE_LIST.map((m) => {
                                  const isSelected = newProjMachines.includes(m.id);
                                  return (
                                    <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => {
                                        setNewProjMachines(prev => 
                                          prev.includes(m.id)
                                            ? prev.filter(id => id !== m.id)
                                            : [...prev, m.id]
                                        );
                                      }}
                                      className={`px-1.5 py-1 text-[9px] font-mono uppercase rounded text-left border flex items-center gap-1 transition-colors cursor-pointer ${
                                        isSelected 
                                          ? 'border-[#bdff00] text-[#bdff00] bg-[#bdff00]/10 font-bold' 
                                          : 'border-[#112435] text-[#8fa3ba] hover:border-[#1a3554] bg-[#050e17]'
                                      }`}
                                    >
                                      <span>{isSelected ? '✓' : '＋'}</span>
                                      <span className="truncate">{m.short}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-[#8fa3ba] uppercase font-bold block">RÅMATERIALE</label>
                              <select
                                value={newProjMaterial}
                                onChange={(e) => setNewProjMaterial(e.target.value)}
                                className="w-full bg-[#081320] border border-[#1a3554] p-2 rounded-lg text-white focus:border-[#bdff00] outline-none text-xs font-semibold"
                              >
                                <option value="aluminium">🥈 Aluminium (6082-T6)</option>
                                <option value="messing_ms58">👑 Automatmessing (CuZn39Pb3)</option>
                                <option value="normalt_staal">🛡️ Normalt Stål (C45)</option>
                                <option value="rustfrit_316">🌊 Syrefast Rustfrit (316L)</option>
                                <option value="vaerktoej_arne">🔨 Værktøjsstål (Arnestål)</option>
                                <option value="plast_pom">🖤 Plast POM-C / Delrin</option>
                                <option value="akryl_pmma">🔮 Akryl / Plexiglas</option>
                                <option value="nylon_pa6">🧶 Nylon / PA 6</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-[#8fa3ba] uppercase font-bold block">OPGAVE PRIORITET</label>
                              <select
                                value={newProjPriority}
                                onChange={(e) => setNewProjPriority(e.target.value)}
                                className="w-full bg-[#081320] border border-[#1a3554] p-2 rounded-lg text-white focus:border-[#bdff00] outline-none text-xs font-semibold"
                              >
                                <option value="low">Lav (Kan ligge og køre i mellemskoletider)</option>
                                <option value="medium">Normal (Standard skoleforløb)</option>
                                <option value="high">Høj (Nærmer sig deadline/hovedforløb)</option>
                                <option value="critical">🚨 Kritisk (Skal prioriteres øjeblikkeligt!)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-[#8fa3ba] uppercase font-bold block">FREMDRIFT ({newProjProgress}%)</label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={newProjProgress}
                                  onChange={(e) => setNewProjProgress(Number(e.target.value))}
                                  className="flex-1 accent-[#bdff00] h-1"
                                />
                                <button
                                  type="submit"
                                  className="bg-[#bdff00] hover:bg-[#a6e000] text-black font-mono text-[10px] font-extrabold uppercase px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                                >
                                  <Plus size={12} className="stroke-[3px]" />
                                  <span>TILFØJ EMNE</span>
                                </button>
                              </div>
                            </div>
                          </form>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ================= REAL SCHEDULE TABLE ================= */}
                <div className="overflow-x-auto text-[11.5px] font-sans">
                  {ongoingProjects.length === 0 ? (
                    <div className="p-8 text-center text-[#8fa3ba] font-light">
                      <p>Ingen igangværende projekter i produktionstaskerne lige nu.</p>
                      <button 
                        onClick={() => setIsAdminPanelOpen(true)}
                        className="text-[#bdff00] underline mt-1 font-mono text-xs uppercase"
                      >
                        [ Klik her for at tilføje dit første projekt ]
                      </button>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse font-sans">
                      <thead>
                        <tr className="bg-[#0b1725] border-b border-[#1a3554] font-mono text-[9px] text-[#8fa3ba] tracking-wider uppercase select-none">
                          <th className="py-3 px-4 pl-6 w-24">PRIORITET</th>
                          <th className="py-3 px-4 w-44">BESTILLER / KUNDE</th>
                          <th className="py-3 px-4">PROJEKT / EMNE</th>
                          <th className="py-3 px-4 w-36">RÅMATERIALE</th>
                          <th className="py-3 px-4 w-56">INVOLVEREDE MASKINER</th>
                          <th className="py-3 px-4 pr-6 text-right w-44">FREMDRIFT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1a3554]/40 bg-[#0c1e30]/40">
                        {ongoingProjects.map((project: any) => {
                          const matInfo = MATERIAL_DATA_DB[project.material] || { name: project.material };
                          
                          // Priorities classes
                          let priorityBadge = "text-emerald-400 border-emerald-500/25 bg-emerald-500/5";
                          let priorityLabel = "LAV";
                          if (project.priority === 'critical') {
                            priorityBadge = "text-red-400 border-red-500/40 bg-red-500/10 animate-pulse";
                            priorityLabel = "AKUT / KRITISK";
                          } else if (project.priority === 'high') {
                            priorityBadge = "text-orange-400 border-orange-500/25 bg-orange-500/5";
                            priorityLabel = "HØJ";
                          } else if (project.priority === 'medium') {
                            priorityBadge = "text-[#00e5ff] border-[#00e5ff]/25 bg-[#00e5ff]/5";
                            priorityLabel = "NORMAL";
                          }

                          return (
                            <tr key={project.id} className="hover:bg-[#10243d]/45 transition-colors group">
                              {/* 1. SEPARATE COLUMN: Priority */}
                              <td className="py-3.5 px-4 pl-6 align-top">
                                {isAdminPanelOpen && isAuthorized ? (
                                  <select
                                    value={project.priority}
                                    onChange={(e) => handleUpdatePriority(project.id, e.target.value)}
                                    className="bg-[#050e17] border border-[#1a3554] p-1.5 text-[10px] text-white rounded outline-none focus:border-[#bdff00] font-mono font-bold cursor-pointer"
                                  >
                                    <option value="low">LAV</option>
                                    <option value="medium">NORM</option>
                                    <option value="high">HØJ</option>
                                    <option value="critical">AKUT</option>
                                  </select>
                                ) : (
                                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 border rounded uppercase ${priorityBadge}`}>
                                    {priorityLabel}
                                  </span>
                                )}
                              </td>

                              {/* 2. SEPARATE COLUMN: Bestiller / Kunde */}
                              <td className="py-3.5 px-4 align-top">
                                {isAdminPanelOpen && isAuthorized ? (
                                  <div className="space-y-1">
                                    <input
                                      type="text"
                                      value={project.client}
                                      onChange={(e) => handleUpdateClient(project.id, e.target.value)}
                                      className="bg-[#050e17] border border-[#1a3554] px-1.5 py-1 text-xs text-white rounded w-full outline-none focus:border-[#bdff00] font-semibold"
                                    />
                                    <span className="text-[8px] text-[#8fa3ba] font-mono block">Oprettet: {project.addedAt}</span>
                                  </div>
                                ) : (
                                  <div className="space-y-0.5">
                                    <p className="text-[#e2edf8] font-bold text-xs">{project.client}</p>
                                    <p className="text-[9px] text-[#8fa3ba] font-mono">Dato: {project.addedAt}</p>
                                  </div>
                                )}
                              </td>

                              {/* Column 3: Project description */}
                              <td className="py-3.5 px-4 align-top">
                                {isAdminPanelOpen && isAuthorized ? (
                                  <input
                                    type="text"
                                    value={project.name}
                                    onChange={(e) => handleUpdateName(project.id, e.target.value)}
                                    className="bg-[#050e17] border border-[#1a3554] px-1.5 py-1 text-xs text-white rounded w-full outline-none focus:border-[#bdff00] font-semibold"
                                  />
                                ) : (
                                  <p className="text-white font-semibold font-mono text-xs leading-snug">{project.name}</p>
                                )}
                              </td>

                              {/* Column 4: Chosen raw material */}
                              <td className="py-3.5 px-4 align-top">
                                {isAdminPanelOpen && isAuthorized ? (
                                  <select
                                    value={project.material}
                                    onChange={(e) => handleUpdateMaterial(project.id, e.target.value)}
                                    className="bg-[#050e17] border border-[#1a3554] p-1 text-[10px] text-white rounded outline-none focus:border-[#bdff00] font-semibold max-w-[130px] cursor-pointer"
                                  >
                                    <option value="aluminium">🥈 Alu (6082)</option>
                                    <option value="messing_ms58">👑 Messing</option>
                                    <option value="normalt_staal">🛡️ Stål (C45)</option>
                                    <option value="rustfrit_316">🌊 Rustfrit</option>
                                    <option value="vaerktoej_arne">🔨 Værktøjsstål</option>
                                    <option value="plast_pom">🖤 POM-C</option>
                                    <option value="akryl_pmma">🔮 Akryl</option>
                                    <option value="nylon_pa6">🧶 Nylon</option>
                                  </select>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#081320] border border-[#1a3554] text-[#8fa3ba]">
                                    {project.material === 'plast_pom' ? '🖤' :
                                     project.material === 'messing_ms58' ? '👑' :
                                     project.material === 'rustfrit_316' ? '🌊' :
                                     project.material === 'aluminium' ? '🥈' : '🔩'}{' '}
                                    {matInfo.name}
                                  </span>
                                )}
                              </td>

                              {/* Column 5: Involverede maskiner */}
                              <td className="py-3.5 px-4 align-top">
                                {isAdminPanelOpen && isAuthorized ? (
                                  <div className="grid grid-cols-2 gap-1.5 max-w-[210px]">
                                    {MACHINE_LIST.map((m) => {
                                      const isSelected = project.machines?.includes(m.id);
                                      return (
                                        <button
                                          key={m.id}
                                          type="button"
                                          onClick={() => {
                                            const current = project.machines || [];
                                            const next = current.includes(m.id)
                                              ? current.filter((id: string) => id !== m.id)
                                              : [...current, m.id];
                                            handleUpdateMachines(project.id, next);
                                          }}
                                          className={`px-1.5 py-0.5 text-[8.5px] font-mono uppercase rounded transition-colors text-left border flex items-center gap-1 cursor-pointer truncate ${
                                            isSelected 
                                              ? 'border-[#bdff00] text-[#bdff00] bg-[#bdff00]/10 font-bold' 
                                              : 'border-[#112435] text-[#8fa3ba] hover:border-slate-500 bg-[#050e17]'
                                          }`}
                                          title={m.name}
                                        >
                                          <span>{isSelected ? '✓' : '＋'}</span>
                                          <span className="truncate">{m.short}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {project.machines && project.machines.length > 0 ? (
                                      project.machines.map((mId: string) => {
                                        const mach = MACHINE_LIST.find(m => m.id === mId);
                                        return mach ? (
                                          <span key={mId} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-[#081320] border border-[#00e5ff]/20 text-[#00e5ff]" title={mach.name}>
                                            <span>{mach.icon}</span>
                                            <span>{mach.short}</span>
                                          </span>
                                        ) : null;
                                      })
                                    ) : (
                                      <span className="text-[#8fa3ba] font-mono text-[9px] italic">[Ingen maskiner angivet]</span>
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* Column 6: Live progress percentage bar */}
                              <td className="py-3.5 px-4 pr-6 align-top text-right w-44">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center text-[10px] font-mono">
                                    {isAdminPanelOpen && isAuthorized ? (
                                      <button
                                        onClick={() => handleDeleteProject(project.id)}
                                        className="text-red-400 hover:text-red-500 transition-colors flex items-center gap-1 font-mono text-[9px] cursor-pointer"
                                        title="Slet dette igangværende projekt"
                                      >
                                        <Trash2 size={11} />
                                        <span>SLET</span>
                                      </button>
                                    ) : (
                                      <span className="text-[9px] text-[#8fa3ba] tracking-tight uppercase">STATUS</span>
                                    )}
                                    <span className="text-white font-extrabold">{project.progress}%</span>
                                  </div>

                                  {isAdminPanelOpen && isAuthorized ? (
                                    <input 
                                      type="range" 
                                      min="0" 
                                      max="100" 
                                      value={project.progress} 
                                      onChange={(e) => handleUpdateProgress(project.id, Number(e.target.value))}
                                      className="w-full accent-[#bdff00] h-1 cursor-pointer"
                                    />
                                  ) : (
                                    <div className="h-1.5 bg-[#081320] rounded-full overflow-hidden border border-[#1a3554]/30">
                                      <div 
                                        className={`h-full rounded-full transition-all duration-300 ${
                                          project.progress === 100 ? 'bg-emerald-400' : 'bg-[#bdff00]'
                                        }`} 
                                        style={{ width: `${project.progress}%` }} 
                                      />
                                    </div>
                                  )}

                                  {project.progress === 100 && (
                                    <span className="text-[8px] font-mono font-bold text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 rounded-full inline-block mt-1">
                                      ✅ AFSLUTTET • KLAR TIL AFHENTNING
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Bottom Safety Status Card */}
              <div className="w-full bg-[#0f2136]/80 border border-[#1a3554] rounded-xl p-4 flex justify-between items-center text-[10.5px] font-mono text-[#8fa3ba] select-none">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="text-[#bdff00] w-4 h-4 shrink-0" />
                  MASKIN-SIKKERHED CODE: <strong className="text-white uppercase font-bold">EN ISO 13849-1 APPROVED</strong>
                </span>
                <span className="hidden sm:block">SKOLEPRAKTIK VÆRKSTEDSPORTAL // TEC FREDERIKSBERG - FINMEKANIKER</span>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="sub-panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 flex-1 py-4 flex flex-col"
            >
              {/* Back to Home controller button (ESC-key style) */}
              <div className="no-print flex justify-between items-center border-b border-[#1a3554] pb-4">
                <button
                  onClick={() => setActiveSection('home')}
                  className="px-4 py-2 bg-[#0f2136] border border-[#1a3554] text-[#e2edf8] font-mono text-[11px] font-bold uppercase tracking-widest rounded-lg hover:text-[#bdff00] hover:border-[#bdff00]/50 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <LogOut size={13} className="rotate-180" />
                  <span>← ESC // TILBAGE TIL HOVEDMENU</span>
                </button>

                <div className="flex items-center gap-2.5 text-xs font-mono text-[#8fa3ba] uppercase">
                  <span>Aktiv Modul:</span>
                  <span className="text-[#bdff00] font-bold">
                    {activeSection === 'about' && 'HVEM ER JEG? // INTRODUKTION'}
                    {activeSection === 'skills' && 'HVAD KAN JEG // MASKINPARK & RÅSTOFFER'}
                    {activeSection === 'portfolio' && 'HVAD HAR JEG LAVET // PORTFOLIO'}
                    {activeSection === 'requisition' && 'HVORDAN KAN JEG HJÆLPE DIG // REKVISITION'}
                  </span>
                </div>
              </div>

              {/* Renders relevant interactive element dashboard based on menu selection */}
              <div className="flex-1">
                {activeSection === 'about' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Glen personal specification dossier */}
                    <div className="lg:col-span-5 bg-[#0f2136] border border-[#1a3554] p-6 rounded-xl flex flex-col justify-between space-y-6 shadow-xl">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 select-none">
                          <div className="h-16 w-16 bg-[#bdff00] rounded-xl flex flex-col items-center justify-center relative shadow-lg shadow-[#bdff00]/15">
                            <span className="font-display font-black text-2xl text-black">G</span>
                            <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-black rounded-full" />
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-black rounded-full" />
                          </div>
                          <div>
                            <h3 className="text-xl font-display font-black text-white tracking-wider uppercase leading-none">
                              GLEN
                            </h3>
                            <span className="text-[9px] font-mono tracking-wider text-[#00e5ff] bg-[#081320] border border-[#00e5ff]/30 px-2 py-0.5 rounded font-bold uppercase block mt-1 select-none">
                              Finmekanik-elev / &quot;CNC-gutten&quot;
                            </span>
                          </div>
                        </div>

                        <div className="h-px bg-[#1a3554] my-2" />

                        <div className="space-y-3 font-sans text-xs text-[#e2edf8] leading-relaxed font-light select-text">
                          <p>
                            Hej! Mit navn er <strong className="text-white font-semibold">Glen</strong>. Jeg læser til finmekaniker på <strong className="text-[#bdff00] font-semibold">TEC Frederiksberg</strong> under dagligt opsyn og vejledning af vores værkstedsinstruktører.
                          </p>
                          <p>
                            Min rejse startede som låsesmed, hvor min fascination af bevægelige dele blev vakt. Siden fandt jeg min sande hylde i finmekanikken og blev på værkstedet døbt <strong className="text-white font-semibold">&quot;CNC-gutten&quot;</strong> pga. min flair for selvstændig Haas CNC-programmering.
                          </p>
                          <p>
                            Gennem vores skolepraktik på Stæhr Johansens Vej 7 arbejder jeg med mikronskarpe tolerancer og fuldautomatiske emnekørsler – altid med fokus på absolut præcision og godt håndværk.
                          </p>
                        </div>
                      </div>

                      {/* Diagnostic specs table view */}
                      <div className="bg-[#081320] border border-[#1a3554] p-4 rounded-xl font-mono text-[10px] text-[#8fa3ba] space-y-2.5 select-text">
                        <span className="text-[9px] text-[#bdff00] font-bold uppercase tracking-wider block border-b border-[#11263d] pb-1 select-none">
                          // OPERATØR DOSSIER METADATA
                        </span>
                        <div className="flex justify-between">
                          <span>STANDBY_CAMPUS:</span>
                          <span className="text-white font-bold">TEC FREDERIKSBERG SKP</span>
                        </div>
                        <div className="flex justify-between">
                          <span>VÆRKSTEDSTENDENS:</span>
                          <span className="text-[#bdff00] font-bold">HAAS CNC & DATA-DREVET</span>
                        </div>
                        <div className="flex justify-between">
                          <span>INDSPÆNDINGS_TYP:</span>
                          <span className="text-white font-bold">METRISK CHUCK / SKRUESTIK</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PROFIL_ØGENAVN:</span>
                          <span className="text-[#00e5ff] font-bold">&quot;CNC-GUTTEN&quot;</span>
                        </div>
                        <div className="flex justify-between">
                          <span>BETALINGS_STANDARD:</span>
                          <span className="text-amber-400 font-bold">Monster & Lidl-croissant</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Interactive Terminal with Glen's Q&A insights (In Danish) */}
                    <div className="lg:col-span-7 bg-[#0f2136] border border-[#1a3554] rounded-xl p-6 flex flex-col justify-between min-h-[460px] relative overflow-hidden select-none shadow-2xl">
                      {/* Blueprint-style underlying grid pattern using modern DATRON next theme */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(189,255,0,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(189,255,0,0.012)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                      <div className="space-y-6 relative h-full">
                        <div className="flex justify-between items-start border-b border-[#1a3554] pb-4 select-none">
                          <div>
                            <span className="text-[9px] text-[#00e5ff] font-bold tracking-widest block uppercase">// GLEN_SPECS // DIAGNOSTIC TERMINAL</span>
                            <p className="font-semibold text-white uppercase mt-1">Spørg operatøren om skolepraktikken</p>
                          </div>
                          <span className="text-[9px] font-mono text-[#00e5ff] border border-[#1a3554] px-2.5 py-0.5 rounded-lg bg-[#081320]">F1_INSIGHTS</span>
                        </div>

                        {/* Interactive prompt-style selection chips */}
                        <div className="flex flex-wrap gap-2 py-1">
                          {[
                            { id: 'why', label: 'Låsesmed-rejsen', q: 'Hvorfor finmekaniker?' },
                            { id: 'school', label: 'Hverdagen i SKP', q: 'Værkstedet og arbejdet' },
                            { id: 'pride', label: 'Faglige stolthed', q: 'Messing-sejlholder' },
                            { id: 'errors', label: 'Hvis målene skrider', q: 'Håndtering af afvigelser' },
                            { id: 'teacher', label: 'Vores instruktører', q: 'CNC-gutten opsyn' },
                            { id: 'bribe', label: 'Sandt brændstof ⚡', q: 'Monstere & Lidl Croissant' },
                            { id: 'future', label: 'Fremtidsdrøm 🛠️', q: 'Garagen og YouTube' },
                          ].map((chip) => (
                            <button
                              key={chip.id}
                              onClick={() => setSelectedQAId(chip.id)}
                              className={`px-3 py-2 text-[10.5px] font-mono font-bold uppercase border tracking-wider transition-colors cursor-pointer rounded-lg ${
                                selectedQAId === chip.id
                                  ? 'bg-[#bdff00] border-[#bdff00] text-black font-extrabold shadow-md shadow-[#bdff00]/20'
                                  : 'bg-[#132840] hover:bg-[#1a3554] border-[#1a3554] text-[#8fa3ba] hover:text-white'
                              }`}
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>

                        {/* Active QA Feed readout block */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedQAId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.18 }}
                            className="bg-[#081320] border border-[#1a3554] p-5 rounded-xl space-y-3 shadow-inner"
                          >
                            <div className="flex justify-between items-center text-[9px] font-mono text-[#00e5ff]/85">
                              <span>SPØRGSMÅL: {qaData[selectedQAId]?.question.toUpperCase()}</span>
                              <span className="text-[#bdff00] font-bold">// DOKUMENTERET_SVAR</span>
                            </div>
                            <h4 className="text-white text-sm font-bold font-mono tracking-tight">
                              &quot;{qaData[selectedQAId]?.answerTitle}&quot;
                            </h4>
                            <p className="text-[#e2edf8] text-[11.5px] leading-relaxed font-sans font-light whitespace-pre-line select-text">
                              {qaData[selectedQAId]?.answerContent}
                            </p>
                          </motion.div>
                        </AnimatePresence>

                      </div>

                      <div className="border-t border-[#1a3554] pt-3 mt-4 flex justify-between font-mono text-[9px] text-[#00e5ff] select-none">
                        <span>OPERATOR STATUS: TRÆNENDE & SKARPBENT</span>
                        <span>MÅLERAMME: ISO PASNINGER PRO</span>
                        <span>TEC FREDERIKSBERG SKP</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div className="bg-[#0f2136] border border-[#1a3554] p-6 rounded-xl shadow-xl">
                    {/* Render the core PartGallery component with showTabs enabled so the user can see everything Glen can do */}
                    <PartGallery showTabs={true} />
                  </div>
                )}

                {activeSection === 'portfolio' && (
                  <div className="bg-[#0f2136] border border-[#1a3554] p-6 rounded-xl shadow-xl">
                    {/* Render completed view of PartGallery for completed SKP projects portfolio */}
                    <PartGallery activeTabOutside="completed" showTabs={false} />
                  </div>
                )}

                {activeSection === 'requisition' && (
                  <div className="space-y-12 animate-fade-in">
                    
                    {/* DATRON next style quick workshop alert */}
                    <div className="bg-[#1c0d0d]/40 border-2 border-red-500 p-5 flex justify-between items-center flex-wrap gap-4 rounded-2xl">
                      <div className="flex items-start gap-4">
                        <Info className="text-red-400 shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="font-mono text-xs text-red-400 font-bold uppercase tracking-wider">
                            VÆRKSTEDSOPLYSNING // DATUM PROTOTYPING
                          </p>
                          <p className="text-xs text-[#8fa3ba] mt-1 leading-relaxed font-light">
                            Vi har <strong className="text-white">fuld tilladelse til at nægte eller afvise</strong> at fremstille din bestilling, såfremt vi ikke har mulighed for at skaffe eller tilvejebringe dit valgte materiale på værkstedet.
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono border-2 border-red-500/40 text-red-400 bg-red-500/10 px-3 py-1.5 uppercase font-black tracking-widest rounded-xl shrink-0">
                        BETINGELSER
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Beautiful DATRON next-configured input form covering 6 columns */}
                      <div className="lg:col-span-6 space-y-6">
                        <div className="bg-[#0f2136] border-2 border-[#1a3554] p-6 rounded-2xl space-y-6">
                          <div className="flex justify-between items-center border-b border-[#1a3554] pb-3">
                            <span className="text-[10px] font-mono text-[#8fa3ba] uppercase tracking-widest font-black block">
                              // REKVISITIONSDEKLARATION & PARAMETRE
                            </span>
                            <span className="text-[9px] font-mono text-[#bdff00] uppercase font-bold text-right">
                              [ ALL-IN-ONE SIMPLE DESIGN ]
                            </span>
                          </div>

                          {/* Friendly guide banner for anyone using the page */}
                          <div className="bg-[#162e4c]/40 border border-[#1a3554] p-4 rounded-xl text-xs space-y-1.5">
                            <p className="font-bold text-white flex items-center gap-1.5 font-sans">
                              <span className="text-[#bdff00]">💡</span> Superenkel bestilling for alle!
                            </p>
                            <p className="text-[#8fa3ba] leading-relaxed font-sans text-[11px]">
                              Uanset om du er <strong>NASA-ingeniør</strong> eller <strong>Hr. Hansen</strong> med en knækket cykelstang: Udfyld de påkrævede felter herunder. Vores kloge generator oversætter det helt automatisk til korrekte ISO-pasningsmål og maskindata!
                            </p>
                          </div>

                          {/* ================= SECTION A: MANDATORY FIELDS ================= */}
                          <div className="border border-red-500/20 bg-red-950/10 p-4 rounded-xl space-y-4">
                            <div className="flex justify-between items-center border-b border-red-500/10 pb-2">
                              <h5 className="text-[10.5px] uppercase font-mono text-red-400 font-bold tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                1. DETTE SKAL UDFYLDES (PÅKRÆVET STAMDATA)
                              </h5>
                              <span className="text-[8px] font-mono text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded uppercase font-bold bg-red-500/5">
                                Obligatorisk
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-red-300 uppercase font-black tracking-wide block">
                                  Bestiller / Kunde / Virksomhed: <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={customerName}
                                  onChange={(e) => setCustomerName(e.target.value)}
                                  className="w-full bg-[#081320] text-white border border-[#1a3554] focus:border-red-500 focus:ring-1 focus:ring-red-500 p-2.5 rounded-xl text-xs outline-none font-sans"
                                  placeholder="f.eks. Jensen Maskinteknik, Carsten (Privat) eller Rasmus (Elev)"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-red-300 uppercase font-black tracking-wide block">
                                  Projekt / Delens Navn: <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={projectName}
                                  onChange={(e) => setProjectName(e.target.value)}
                                  className="w-full bg-[#081320] text-white border border-[#1a3554] focus:border-red-500 focus:ring-1 focus:ring-red-500 p-2.5 rounded-xl text-xs outline-none font-sans"
                                  placeholder="f.eks. Knækket cykelstang / Satellitkobling"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-red-300 uppercase font-black tracking-wide block">
                                Hvilken grundform skal delen have? <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={reqProcess}
                                onChange={(e) => setReqProcess(e.target.value)}
                                className={`w-full bg-[#081320] border p-2.5 rounded-xl text-xs outline-none font-sans font-bold transition-colors ${
                                  reqProcess ? 'text-[#bdff00] border-[#1a3554]' : 'text-slate-400 border-red-500/40 focus:border-red-500'
                                }`}
                                required
                              >
                                <option value="">-- Vælg grundform --</option>
                                <option value="cnc-turning">🟢 Rund del (f.eks. en aksel, mønt, leje eller cylindrisk stang - Drejebænk)</option>
                                <option value="cnc-milling">🟦 Flad del med kanter (f.eks. et beslag, en klods, plade med huller - Fræser)</option>
                                <option value="manual-turning">⚙️ Simpel rund reparationsdel (Nemt og hurtigt at lave manuelt)</option>
                                <option value="manual-milling">📐 Helt fladplade eller spor (Planfræset manuelt)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-red-300 uppercase font-black tracking-wide block">
                                Hvilket materiale skal delen laves af? <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={reqMaterial}
                                onChange={(e) => setReqMaterial(e.target.value)}
                                className={`w-full bg-[#081320] border p-2.5 rounded-xl text-xs outline-none font-sans font-bold transition-colors ${
                                  reqMaterial ? 'text-[#bdff00] border-[#1a3554]' : 'text-slate-400 border-red-500/40 focus:border-red-500'
                                }`}
                                required
                              >
                                <option value="">-- Vælg råmateriale --</option>
                                <option value="aluminium">🥈 Aluminium (EN AW-6082-T6 - Letvægt, optimal spåntageevne)</option>
                                <option value="messing_ms58">👑 Automatmessing (CuZn39Pb3 MS58 - Glidelagre & fittings)</option>
                                <option value="normalt_staal">🛡️ Normalt Stål (C45 Sejhærdbar - Robust konstruktionsstål)</option>
                                <option value="rustfrit_316">🌊 Syrefast / Rustfrit Stål (AISI 316L - Marine & saltvandsbeslag)</option>
                                <option value="vaerktoej_arne">🔨 Værktøjsstål / Arnestål (Oliehærdende O1 - Snitværktøjer)</option>
                                <option value="plast_pom">🖤 Plast POM-C / Delrin (Ertacetal C - Slidstærk, vandafvisende)</option>
                                <option value="akryl_pmma">🔮 Akryl / Plexiglas (PMMA - Glasklart transparent finish)</option>
                                <option value="nylon_pa6">🧶 Nylon / Polyamid (PA 6 - Stødabsorberende & slidvanger)</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-red-300 uppercase font-black tracking-wide block">
                                  Tykkelse / Diameter (mm): <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={reqDiameter}
                                  onChange={(e) => {
                                     const val = e.target.value;
                                     if (!isNaN(parseFloat(val)) || val === '') {
                                       setReqDiameter(val);
                                     }
                                  }}
                                  className="w-full bg-[#081320] text-[#bdff00] border border-[#1a3554] focus:border-red-500 focus:ring-1 focus:ring-red-500 p-2.5 rounded-xl text-xs outline-none font-mono font-bold"
                                  placeholder="f.eks. 20"
                                  required
                                />
                                <div className="text-[9px] text-[#8fa3ba] font-sans leading-tight mt-1 space-y-0.5 select-none font-light">
                                  <p>✏️ <span className="text-white">6-8 mm</span> = Som en blyant</p>
                                  <p>🪙 <span className="text-white">22 mm</span> = Som en 20-krone</p>
                                  <p>🥤 <span className="text-white">50-65 mm</span> = Sodavandsdåse</p>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-red-300 uppercase font-black tracking-wide block">
                                  Totallængde (mm): <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={reqLength}
                                  onChange={(e) => {
                                     const val = e.target.value;
                                     if (!isNaN(parseFloat(val)) || val === '') {
                                       setReqLength(val);
                                     }
                                  }}
                                  className="w-full bg-[#081320] text-white border border-[#1a3554] focus:border-red-500 focus:ring-1 focus:ring-red-500 p-2.5 rounded-xl text-xs outline-none font-mono"
                                  placeholder="f.eks. 60"
                                  required
                                />
                                <div className="text-[9px] text-[#8fa3ba] font-sans leading-tight mt-1 space-y-0.5 select-none font-light">
                                  <p>🪵 <span className="text-white">35 mm</span> = Tændstikæske</p>
                                  <p>💳 <span className="text-white">85 mm</span> = Som et dankort</p>
                                  <p>📏 <span className="text-white">150-200 mm</span> = Skolelineal</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-red-300 uppercase font-black tracking-wide block">
                                Har du en færdig tegning? (STEP / PDF) <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={reqHasDrawing}
                                onChange={(e) => setReqHasDrawing(e.target.value)}
                                className={`w-full bg-[#081320] border p-2.5 rounded-xl text-xs outline-none font-sans font-bold transition-colors ${
                                  reqHasDrawing ? 'text-[#bdff00] border-[#1a3554]' : 'text-slate-400 border-red-500/40 focus:border-red-500'
                                }`}
                                required
                              >
                                <option value="">-- Vælg tegningstatus --</option>
                                <option value="yes">📐 Ja, jeg har digital tegning (STEP-model eller PDF-blueprint)</option>
                                <option value="no">❌ Nej, jeg har kun ovenstående mål og beskrivelse</option>
                              </select>
                              <p className="text-[10px] text-red-400/80 font-sans leading-tight mt-1">
                                💡 <strong>Note:</strong> Tegningen skal vedhæftes i den efterfølgende e-mail til værkstedet, hvis det overhovedet er muligt!
                              </p>
                            </div>
                          </div>

                          {/* ================= SECTION B: OPTIONAL FIELDS ================= */}
                          <div className="border border-cyan-500/20 bg-cyan-950/5 p-4 rounded-xl space-y-4">
                            <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2">
                              <h5 className="text-[10.5px] uppercase font-mono text-cyan-400 font-bold tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                2. VALGFRIT (AVANCEREDE OPTIONS / TILPASNINGER)
                              </h5>
                              <span className="text-[8px] font-mono text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded uppercase font-bold bg-cyan-500/5">
                                Valgfrit
                              </span>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-cyan-300 uppercase font-bold block">
                                Særlig pasning:
                              </label>
                              <select
                                value={reqFitCode}
                                onChange={(e) => setReqFitCode(e.target.value)}
                                className="w-full bg-[#081320] text-white border border-[#1a3554] focus:border-cyan-400 p-2.5 rounded-xl text-xs outline-none font-sans"
                              >
                                <option value="">-- Ingen specifik pasningsklasse (Valgfrit / Standard) --</option>
                                <option value="H11">❌ Nej, delen skal bare laves selvstændigt uden pasning</option>
                                <option value="g6">🚴 Slippasning (Glider let og roterer nemt - f.eks. cykelhjul - g6)</option>
                                <option value="h6">🤚 Skubpasning (Helt tæt, skilles ad med fingrene - h6)</option>
                                <option value="H7">🎯 Boring klasse H7 (Slørfri akselføring - H7)</option>
                                <option value="k6">🔨 Let pressepasning (Bankes let på plads med hammer - k6)</option>
                                <option value="p6">🚀 Fast pressepasning (Krympning/hydraulisk presse - p6)</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-cyan-300 uppercase font-bold block">
                                  Nøjagtighedsklasse:
                                </label>
                                <select
                                  value={reqToleranceClass}
                                  onChange={(e) => setReqToleranceClass(e.target.value)}
                                  className="w-full bg-[#081320] text-white border border-[#1a3554] focus:border-cyan-400 p-2.5 rounded-xl text-xs outline-none font-sans"
                                >
                                  <option value="">-- Middel normaltolerance (Valgfrit) --</option>
                                  <option value="c">Grov tolerance (Simple beslag/cykelstativer - ±0.5 mm)</option>
                                  <option value="m">Normal maskintolerance (Standard cykeldele - ±0.1 mm)</option>
                                  <option value="f">Fin tolerance / NASA (Højpræcisionsgear - ±0.03 mm)</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-cyan-300 uppercase font-bold block">
                                  Overflade-ruhed:
                                </label>
                                <select
                                  value={reqRoughness}
                                  onChange={(e) => setReqRoughness(e.target.value)}
                                  className="w-full bg-[#081320] text-white border border-[#1a3554] focus:border-cyan-400 p-2.5 rounded-xl text-xs outline-none font-sans"
                                >
                                  <option value="">-- Standard råfinish Ra 3.2 (Valgfrit) --</option>
                                  <option value="Ra 3.2">Grov overflade (Du kan ane fræsesporene - Ra 3.2)</option>
                                  <option value="Ra 1.6">Pæn overflade (Almindelig fin glat finish - Ra 1.6)</option>
                                  <option value="Ra 0.8">Super glat / Pyntefinish (Flot spejlglans - Ra 0.8)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-cyan-300 uppercase font-bold block">
                                Skal der skæres gevind?
                              </label>
                              <select
                                value={reqThread}
                                onChange={(e) => setReqThread(e.target.value)}
                                className="w-full bg-[#081320] text-white border border-[#1a3554] focus:border-cyan-400 p-2.5 rounded-xl text-xs outline-none font-sans"
                              >
                                <option value="">-- Gevind ikke nødvendigt (Valgfrit) --</option>
                                <option value="none">Nej, der skal ikke laves gevindskæring</option>
                                <option value="M3x0.5">Ja, M3 miniskrue (Gevindstigning: 0.5 mm)</option>
                                <option value="M4x0.7">Ja, M4 skrue (Gevindstigning: 0.7 mm)</option>
                                <option value="M5x0.8">Ja, M5 standardskrue (Gevindstigning: 0.8 mm)</option>
                                <option value="M6x1.0">Ja, M6 standardbolt (Gevindstigning: 1.0 mm)</option>
                                <option value="M8x1.25">Ja, M8 robust bolt (Gevindstigning: 1.25 mm)</option>
                                <option value="M10x1.5">Ja, M10 maskinbolt (Gevindstigning: 1.5 mm)</option>
                                <option value="M12x1.75">Ja, M12 kraftig rammebolt (Gevindstigning: 1.75 mm)</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-cyan-300 uppercase font-bold block">
                                  Hvor hurtigt skal du bruge den?
                                </label>
                                <select
                                  value={reqPriority}
                                  onChange={(e) => setReqPriority(e.target.value)}
                                  className="w-full bg-[#081320] text-white border border-[#1a3554] focus:border-cyan-400 p-2.5 rounded-xl text-xs outline-none font-sans"
                                >
                                  <option value="">-- Standard cyklus (1-2 uger) (Valgfrit) --</option>
                                  <option value="low">☕ Hyggeprojekt (Tag bare al den tid du skal bruge)</option>
                                  <option value="standard">🕒 Normal (Klar inden for 1-2 uger når der er skoletid)</option>
                                  <option value="express">🔥 DET BRÆNDER / EKSAMEN! (Deadline inden for få dage!)</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-cyan-300 uppercase font-bold block">
                                  Bestikkelse med slik/sodavand:
                                </label>
                                <input
                                  type="text"
                                  value={candyType}
                                  onChange={(e) => setCandyType(e.target.value)}
                                  className="w-full bg-[#081320] text-[#bdff00] border border-[#1a3554] p-2.5 rounded-xl text-xs outline-none font-sans italic"
                                  placeholder="f.eks. Bland-selv-slik & kold Pepsi Max"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-cyan-300 uppercase font-bold block">
                                Beskrivelse af formål / Særlige ønsker:
                              </label>
                              <textarea
                                value={projectDesc}
                                rows={2}
                                onChange={(e) => setProjectDesc(e.target.value)}
                                className="w-full bg-[#081320] text-white border border-[#1a3554] p-2.5 rounded-xl text-xs outline-none font-sans font-light"
                                placeholder="F.eks. Skal passe på min cykelstang, eller monteres i fysikapparat..."
                              />
                            </div>

                            {/* Checks self materials */}
                            <div className="flex items-center gap-3 py-2 border-t border-[#1a3554]/30 select-none">
                              <input
                                type="checkbox"
                                id="supply-material"
                                checked={suppliesOwnMaterial}
                                onChange={(e) => setSuppliesOwnMaterial(e.target.checked)}
                                className="h-4 w-4 bg-[#081320] accent-[#bdff00] border-[#1a3554] cursor-pointer rounded-lg shrink-0"
                              />
                              <label htmlFor="supply-material" className="text-xs text-[#e2edf8] cursor-pointer select-none font-sans leading-tight">
                                Jeg medbringer selv eget råmateriale til maskinhallen
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Toolkit buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={handleCopyReqTemplate}
                            className="flex-1 px-5 py-4 bg-[#0f2136] hover:bg-[#1a3554] border border-[#1a3554] text-[#e2edf8] text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {copiedTemplate ? (
                              <>
                                <Check size={13} className="text-[#bdff00] animate-pulse" />
                                <span className="text-[#bdff00]">KOPIERET OK!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} className="text-[#00e5ff]" />
                                <span>KOPIER TEKST TIL E-MAIL</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={handlePrintDraftingSheet}
                            className="px-6 py-4 bg-[#bdff00] hover:bg-[#a6e000] text-black text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#bdff00]/10"
                          >
                            <Printer size={13} />
                            <span>UDSKRIV MÅLEPROTOKOL</span>
                          </button>
                        </div>

                      </div>

                      {/* Right: Gorgeous live-updating Email text preview box styled in DATRON next engineering format */}
                      <div className="lg:col-span-6 bg-[#0b1622] text-[#e2edf8] border-2 border-[#1a3554] rounded-2xl p-6 font-mono text-xs shadow-2xl relative hover:border-[#bdff00]/30 transition-all overflow-hidden flex flex-col justify-between min-h-[620px]">
                        
                        {/* Underlay Grid pattern for engineering aesthetics */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(189,255,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(189,255,0,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                        
                        <div className="space-y-5 relative h-full flex flex-col flex-grow">
                          
                          {/* Title block */}
                          <div className="flex justify-between items-start border-b border-[#1a3554] pb-4">
                            <div>
                              <span className="text-[9px] text-[#bdff00] font-bold tracking-widest block uppercase">// DATRON NEXT EMAIL COMPILER</span>
                              <h4 className="font-bold text-[14px] text-white uppercase mt-0.5">GENERERET E-MAIL TEKST</h4>
                            </div>
                            <div className="text-right text-[9px] text-[#00e5ff] font-bold flex flex-col items-end">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-[#00e5ff]/10 text-[#00e5ff] uppercase text-[8px] tracking-wide animate-pulse mb-1">
                                ● SYNCED
                              </span>
                              <p className="uppercase mt-0.5 font-mono text-[#8fa3ba] text-[8.5px]">STATUS: DRAFT GENERATED</p>
                            </div>
                          </div>

                          {/* Email Content Container */}
                          <div className="flex-1 flex flex-col min-h-0 bg-[#050e17] border border-[#1a3554] rounded-xl p-4 shadow-inner relative">
                            {/* Copy indicator on preview top bar */}
                            <div className="flex justify-between items-center text-[9px] text-[#8fa3ba] border-b border-[#1a3554]/40 pb-2 mb-3 select-none">
                              <span>SND: DIN_EMAIL@TEC.DK</span>
                              <span>RCV: glci1@elev.tec.dk</span>
                            </div>

                            {/* Actual pre-formatted live email preview */}
                            <pre className="flex-grow text-[11px] text-[#e2edf8] font-mono leading-relaxed overflow-y-auto whitespace-pre-wrap select-all pr-2 max-h-[380px] custom-scrollbar focus:outline-none">
                              {reqEmailTemplate}
                            </pre>

                            {/* Live quick copy button inside preview container container */}
                            <button
                              onClick={handleCopyReqTemplate}
                              className="absolute bottom-3 right-3 bg-[#0f2136] hover:bg-[#1a3554] text-white border border-[#1a3554] p-2 rounded-lg transition-all shadow-md group cursor-pointer"
                              title="Kopier tekst"
                            >
                              {copiedTemplate ? (
                                <Check size={14} className="text-[#bdff00] animate-bounce" />
                              ) : (
                                <Copy size={14} className="text-[#00e5ff] group-hover:text-[#bdff00] transition-colors" />
                              )}
                            </button>
                          </div>

                          {/* Live calculator of Mass and Spindle speeds (shown as technical metrics in container footer) */}
                          <div className="grid grid-cols-2 gap-2 text-center text-[10px] border-t border-[#1a3554] pt-4">
                            <div className="bg-[#081320] p-2 rounded-lg border border-[#1a3554]/60">
                              <span className="text-[8px] text-[#8fa3ba] uppercase block">Emnevægt</span>
                              <strong className="text-[#bdff00] font-bold">
                                {(Math.PI * Math.pow(nominalValueFloat / 20, 2) * ((parseFloat(reqLength) || 60) / 10) * (materialSpeedInfo.density || 2.7)).toFixed(1)} g
                              </strong>
                            </div>
                            <div className="bg-[#081320] p-2 rounded-lg border border-[#1a3554]/60">
                              <span className="text-[8px] text-[#8fa3ba] uppercase block">Tolerance ISO</span>
                              <strong className="text-white font-bold">±{computedFitOfDocket ? Math.abs(computedFitOfDocket.upperDeviation) : 15} µm</strong>
                            </div>
                          </div>

                          {/* Bestiller checklist */}
                          <div className="border-t border-[#1a3554] pt-4 text-[10px] space-y-2 select-none">
                            <span className="text-[8px] text-[#8fa3ba] font-black uppercase tracking-widest block">// BESTILLER TJEKLISTE FOR VÆRKSTEDSOPGAVE</span>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-sans">
                              <p className="flex items-center gap-2 text-white text-[10.5px]">
                                <span className="text-[#bdff00] font-mono text-xs">✔</span> Bestiller: <span className="text-[#8fa3ba] truncate max-w-[120px]">{customerName}</span>
                              </p>
                              <p className="flex items-center gap-2 text-white text-[10.5px]">
                                <span className={`${suppliesOwnMaterial ? 'text-[#bdff00]' : 'text-amber-400'} font-mono text-xs`}>
                                  {suppliesOwnMaterial ? '✔' : '⚡'}
                                </span> {suppliesOwnMaterial ? 'Råmateriale klarlagt' : 'Godkendes via faglærer'}
                              </p>
                              <p className="flex items-center gap-2 text-white text-[10.5px]">
                                <span className={`${candyType.length > 5 ? 'text-[#bdff00]' : 'text-amber-500'} font-mono text-xs`}>
                                  {candyType.length > 5 ? '✔' : '⚠'}
                                </span> Bestikkelse: <span className="text-[#bdff00] truncate max-w-[100px]">{candyType}</span>
                              </p>
                              <p className="flex items-center gap-2 text-white text-[10.5px]">
                                <span className="text-[#bdff00] font-mono text-xs">✔</span> Tilsyn: Faglærer på TEC
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Footer copyright informational (Danish styling) */}
      <footer className="no-print border-t border-[#1a3554] mt-12 pt-8 text-[#8fa3ba] select-none text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs font-mono space-y-2">
          <p>© {new Date().getFullYear()} Datum Prototyping — Præcisionsdrej- & maskinarbejde på Frederiksberg. TEC Frederiksberg.</p>
          <div className="flex justify-center gap-6 text-[10px] text-[#8fa3ba]/70">
            <span>PLATFORM: HAAS_TELEMETRY ACTIVE</span>
            <span className="text-[#bdff00] font-bold">SLIK_BESTIKKELSE SYSTEM: AKTIVERET</span>
          </div>
        </div>
      </footer>

      {/* ==================================================================== */}
      {/* STRICT BLACK/WHITE PRINT DOSSIER (Printed template paper) */}
      {/* ==================================================================== */}
      <div className="print-only hidden print:block text-black bg-white p-8 space-y-10 h-screen w-full font-mono text-xs leading-relaxed">
        
        {/* Print Title Block */}
        <div className="border-b-2 border-black pb-4 text-center">
          <h2 className="text-lg font-bold uppercase tracking-widest">DATUM PROTOTYPING // G54 MÅLEPROTOKOL</h2>
          <p className="text-[10px] uppercase mt-1">Elevdrevet Finmekaniker Værksted — TEC Frederiksberg, Stæhr Johansens Vej 7</p>
          <p className="text-[9px] mt-1 text-stone-500">Tegningsnummer: DP-{Math.floor(1000 + Math.random() * 9000).toString()} // FAGLÆRER-OPSYN PROTOKOL</p>
        </div>

        {/* Print details */}
        <div className="grid grid-cols-2 gap-8 text-xs border border-black p-4 bg-stone-50">
          <div>
            <p className="font-bold underline uppercase mb-1.5">Projektspecifikationer:</p>
            <p><strong>Emne Navn:</strong> {projectName}</p>
            <p><strong>Bestiller / Kunde:</strong> {customerName}</p>
            <p><strong>Råmateriale:</strong> {MATERIAL_DATA_DB[reqMaterial]?.name.toUpperCase() || reqMaterial.toUpperCase()}</p>
            <p><strong>Beskrivelse:</strong> {projectDesc}</p>
          </div>
          <div className="border-l border-black pl-5">
            <p className="font-bold underline uppercase mb-1.5">Tolerance-Mål & Grænser (ISO 286):</p>
            <p><strong>Nominel diameter:</strong> Ø {nominalValueFloat.toFixed(3)} mm</p>
            <p><strong>Pasningstolerance:</strong> {reqFitCode}</p>
            {computedFitOfDocket && (
              <>
                <p><strong>Afvigelse:</strong> {computedFitOfDocket.upperDeviation > 0 ? '+' : ''}{computedFitOfDocket.upperDeviation} / {computedFitOfDocket.lowerDeviation} µm</p>
                <p><strong>Grænsemål Max:</strong> {computedFitOfDocket.maxLimit.toFixed(3)} mm</p>
                <p><strong>Grænsemål Min:</strong> {computedFitOfDocket.minLimit.toFixed(3)} mm</p>
              </>
            )}
          </div>
        </div>

        {/* Blueprint display */}
        <div className="border border-black p-6 flex flex-col items-center justify-center bg-white">
          <p className="text-[9px] text-stone-500 mb-4 tracking-widest">BLUEPRINT TEGLING (MÅLEFORHOLD 1:1)</p>
          <svg className="w-full max-w-md aspect-video" viewBox="0 0 320 120">
            <rect x="70" y="32" width="110" height="46" fill="none" stroke="black" strokeWidth="1.5" />
            <rect x="180" y="42" width="70" height="26" fill="none" stroke="black" strokeWidth="1.5" />
            <line x1="10" y1="55" x2="310" y2="55" stroke="black" strokeWidth="0.5" strokeDasharray="5 5" />
            
            <line x1="70" y1="95" x2="250" y2="95" stroke="black" strokeWidth="0.75" />
            <path d="M70 91 L70 99 M250 91 L250 99" stroke="black" strokeWidth="0.75" />
            <text x="160" y="88" fill="black" fontSize="9" textAnchor="middle">L= {reqLength} mm</text>
            <text x="210" y="37" fill="black" fontSize="9">Ø {reqDiameter} {reqFitCode}</text>
          </svg>
        </div>

        {/* Validation details */}
        <div className="grid grid-cols-2 gap-10 pt-8 text-xs font-mono">
          <div className="border-t border-black pt-3">
            <p className="uppercase font-bold">Godkendt af CNC Operatør (Glen):</p>
            <div className="h-10" />
            <p className="text-[10px] text-stone-500">Signatur / Dato: __________________________</p>
          </div>
          <div className="border-t border-black pt-3">
            <p className="uppercase font-bold">Godkendt af Faglærer (TEC Frederiksberg):</p>
            <div className="h-10" />
            <p className="text-[10px] text-stone-500">Signatur / Dato: __________________________</p>
          </div>
        </div>

        {/* Bribe validation footer */}
        <div className="pt-6 text-center text-[10px] text-stone-600 italic border-t border-dashed border-stone-300">
          * Emnet bearbejdes som et uddannelsesmæssigt emneløb på Frederiksberg. Arbejdet honoreres udelukkende i en medbragt pose bland-selv-slik og to kolde drikkevarer til deling.
        </div>

      </div>

    </div>
  );
}
