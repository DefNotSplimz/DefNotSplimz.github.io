import { useState, useEffect, useRef } from 'react';
import { COMPLETED_PROJECTS, MATERIAL_DATA_DB } from '../utils';
import { CompletedProject } from '../types';
import { 
  Wrench, 
  Cpu, 
  FileText, 
  Check, 
  ChevronRight, 
  Info, 
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

interface PartGalleryProps {
  activeTabOutside?: 'completed' | 'materials' | 'machines';
  showTabs?: boolean;
}

export default function PartGallery({ activeTabOutside, showTabs = true }: PartGalleryProps) {
  const [internalTab, setInternalTab] = useState<'completed' | 'materials' | 'machines'>('machines');
  const activeTab = activeTabOutside || internalTab;
  const setActiveTab = (tab: 'completed' | 'materials' | 'machines') => {
    setInternalTab(tab);
  };

  // Completed SKP selections
  const [selectedSkpPart, setSelectedSkpPart] = useState<CompletedProject>(COMPLETED_PROJECTS[0]);
  const [selectedMachineId, setSelectedMachineId] = useState<string>('haas-lathe');

  // Interactive FAI and simulator states
  const [activeFaiReportIndex, setActiveFaiReportIndex] = useState<number>(0);
  const [rotationTheta, setRotationTheta] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Safe requestAnimationFrame ticking for the mechanical simulator
  useEffect(() => {
    if (!isRotating) return;
    let animId: number;
    const tick = () => {
      setRotationTheta((prev) => (prev + 3) % 360);
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isRotating]);

  return (
    <div id="machining-deck" className="space-y-8 select-none font-sans text-[#e2edf8]">
      
      {/* Tab bar redesigned as highly technical CNC console switches */}
      {showTabs && (
        <div className="flex flex-wrap gap-2.5 bg-[#0b1420] border border-[#1a3554] p-3 rounded-xl text-white font-mono shadow-xl">
          <button
            onClick={() => setActiveTab('machines')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'machines'
                ? 'bg-[#bdff00] text-black font-extrabold shadow-lg shadow-[#bdff00]/15'
                : 'bg-[#0f2136] text-[#8fa3ba] hover:bg-[#132840] hover:text-white border border-[#1a3554]'
            }`}
          >
            <Cpu size={13} strokeWidth={2.5} />
            <span>[F1: Værkstedets Maskiner]</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'materials'
                ? 'bg-[#bdff00] text-black font-extrabold shadow-lg shadow-[#bdff00]/15'
                : 'bg-[#0f2136] text-[#8fa3ba] hover:bg-[#132840] hover:text-white border border-[#1a3554]'
            }`}
          >
            <Wrench size={13} strokeWidth={2.5} />
            <span>[F2: Værkstedets Råstoffer]</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'completed'
                ? 'bg-[#bdff00] text-black font-extrabold shadow-lg shadow-[#bdff00]/15'
                : 'bg-[#0f2136] text-[#8fa3ba] hover:bg-[#132840] hover:text-white border border-[#1a3554]'
            }`}
          >
            <Award size={13} strokeWidth={2.5} />
            <span>[F3: Prototype Galleri]</span>
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 0: INTERACTIVE WORKSHOP MACHINES OVERVIEW */}
      {/* ==================================================================== */}
      {activeTab === 'machines' && (
        <div id="machines-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left list of machines */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-mono text-[#8fa3ba] uppercase tracking-widest block font-bold">
              // TEKNISK PROTOKOL FOR MASKINPARKEN
            </span>

            <div className="space-y-3">
              {[
                {
                  id: 'haas-lathe',
                  title: 'Haas ST-10 CNC Drejecenter',
                  type: 'CNC COMPUTER-STYRING',
                  precision: '< 5 µm (Mikron)',
                  status: 'KLAR TIL DRIFT'
                },
                {
                  id: 'haas-mill-1',
                  title: 'Haas Mini Mill CNC #1 (HSM)',
                  type: 'CNC - 10k RPM / HSM',
                  precision: '< 5-10 µm',
                  status: 'OPGRADERET METODE / KLAR'
                },
                {
                  id: 'haas-mill-2',
                  title: 'Haas Mini Mill CNC #2 (Standard)',
                  type: 'CNC - 10k RPM',
                  precision: '< 10 µm',
                  status: 'KLAR TIL DRIFT'
                },
                {
                  id: 'weiler-lathe',
                  title: 'Weiler Matador Manuel Drejebænk',
                  type: 'MANUEL FINMEKANIK',
                  precision: '< 3 µm (Præcision)',
                  status: 'KLAR TIL SKRUB & SLET'
                },
                {
                  id: 'deckel-mill',
                  title: 'Deckel FP1 Universal Fræser',
                  type: 'MANUEL / UNIVERSAL FRÆSNING',
                  precision: '+/- 10 µm',
                  status: 'OPERATØR OPERATIV'
                },
                {
                  id: 'haas-desktop-mill',
                  title: 'Haas Desktop Mill (10 stk)',
                  type: 'CNC LÆRING & PROTOTYPER',
                  precision: '< 15 µm',
                  status: '10 MASKINER KLAR TIL DRIFT'
                }
              ].map((m) => {
                const isSelected = selectedMachineId === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMachineId(m.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-[#132840] border-[#bdff00] shadow-lg shadow-[#bdff00]/5 text-white'
                        : 'bg-[#0f2136] border-[#1a3554] hover:border-[#bdff00]/4 transition-colors text-[#e2edf8]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#bdff00]" />
                    )}
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[8.5px] font-mono font-bold text-[#bdff00] bg-[#081320] border border-[#bdff00]/30 px-1.5 py-0.5 rounded-sm">
                            {m.type}
                          </span>
                          <span className="text-[8.5px] font-mono text-[#8fa3ba]">
                            Præcision: {m.precision}
                          </span>
                        </div>
                        <h5 className="font-display font-bold text-white text-sm uppercase tracking-tight group-hover:text-[#bdff00] transition-colors">
                          {m.title}
                        </h5>
                        <p className="text-[11px] text-[#8fa3ba] line-clamp-1 mt-1 font-sans font-light">
                          Status: {m.status} // Opsyn aktivt
                        </p>
                      </div>
                      <ChevronRight size={13} className="text-[#8fa3ba] group-hover:translate-x-0.5 mt-2 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel detailed diagnostic overview */}
          <div className="lg:col-span-7 bg-[#0f2136]/90 border border-[#1a3554] rounded-xl p-6 space-y-6 shadow-xl">
            
            {/* Find selected machine details */}
            {(() => {
              const machineDetails: Record<string, {
                title: string;
                subtitle: string;
                power: string;
                maxRPM: string;
                axes: string;
                tolerances: string;
                faglærer: string;
                bestUse: string;
                desc: string;
                codePrefix: string;
                hasLaser?: boolean;
              }> = {
                'haas-lathe': {
                  title: 'Haas ST-10 Super CNC-Drejecenter',
                  subtitle: 'Fuldautomatisk præcisions-drejebænk til mikronskarpe tolerancer',
                  power: '11.2 kW Spindelmotor',
                  maxRPM: '6.000 RPM (Konstant overfladehastighed G96)',
                  axes: '2-akset (X, Z-retning)',
                  tolerances: 'Indenfor H7/g6 (< 5 µm præcision)',
                  faglærer: 'Kræver fuld godkendelse af instruktøren før start',
                  bestUse: 'Slebede aksler, Stirling-stempler, præcisionsbøsninger og parringsemner',
                  desc: 'Vores primære CNC-drejebænk. Den styres af standard Fanuc/Haas G-koder, som vi genererer og simulerer. Perfekt til repeterbar og mikronsøgende serieproduktion.',
                  codePrefix: 'HAAS_ST10_ACTIVE_M08'
                },
                'haas-mill-1': {
                  title: 'Haas Mini Mill CNC #1 (Med HSM & 10k RPM)',
                  subtitle: 'Lodret bearbejdningscenter opgraderet med High Speed Machining',
                  power: '5.5 kW Spindelmotor m. remdrevet moment',
                  maxRPM: '10.000 RPM opgraderet spindeltop',
                  axes: '3-akset (X, Y, Z) med aktiv High Speed Machining (HSM)',
                  tolerances: 'Indenfor 5-10 µm toleranceramme',
                  faglærer: 'Opsætning, HSM indstillinger og skruestik-rethed skal godkendes af faglærer før kørsel',
                  bestUse: 'Aluminiumsfræsning, riller, komplekse formkonturer som Stirling-dele, højhastigheds bearbejdning',
                  desc: 'Vores ene af de to ens Mini Mills, fuldt opgraderet med 10.000 omdrejninger i spindlen og udstyret med Haas HSM-option (High Speed Machining). Den avancerede look-ahead funktion gør os i stand til at køre komplekse baner med ekstremt høje tilspændinger og minimal sporafvigelse.',
                  codePrefix: 'HAAS_MINIMILL_1_HSM'
                },
                'haas-mill-2': {
                  title: 'Haas Mini Mill CNC #2 (10k RPM)',
                  subtitle: 'Lodret bearbejdningscenter opgraderet med højhastighedsspindel',
                  power: '5.5 kW Spindelmotor m. remdrevet moment',
                  maxRPM: '10.000 RPM opgraderet spindeltop',
                  axes: '3-akset (X, Y, Z)',
                  tolerances: 'Indenfor 10 µm toleranceramme',
                  faglærer: 'Opsætning og nulpunktsparametre skal verificeres af faglærer før kørsel',
                  bestUse: 'Motorflanger, O-ringsriller, kilebænkspor, boringer og gevindskæring',
                  desc: 'Vores anden Mini Mill. Ligesom nummer 1 er den opgraderet med en kraftig 10.000 omdrejninger spindel til højere skærehastighed i bløde metaller som aluminium og messing, men den kører normal kontrolinterpolering uden det specielle HSM-modul.',
                  codePrefix: 'HAAS_MINIMILL_2_STD'
                },
                'weiler-lathe': {
                  title: 'Weiler Matador Manuel Præcisionsdrejebænk',
                  subtitle: 'Tysk legende inden for manuel finmekanik og drejning',
                  power: '3.0 kW mekanisk gearboksspindel',
                  maxRPM: '3.550 RPM trinløs hastighedsindstilling',
                  axes: 'Manuel krydsslæde (X, Z)',
                  tolerances: 'Fingerspidsfornemmelse (helt ned til < 3 µm føling)',
                  faglærer: 'Valgfri rådgivning – husk dog altid at fjerne spændenøglen fra spændepatronen!',
                  bestUse: 'Pasbøsninger, tappe, gevindskæring manuelt og indledende skrubdrejning',
                  desc: 'En sand maskinarbejder-favorit på værkstedet. Weiler Matador er kendt for sin uforlignelige præcision, silkebløde slædegang og uovertrufne driftsikkerhed. Det absolut bedste valg, når vi laver hurtige testemner eller præcise manuelle pasninger.',
                  codePrefix: 'WEILER_MATADOR_MANUAL'
                },
                'deckel-mill': {
                  title: 'Deckel FP1 Universal Fræser',
                  subtitle: 'Klasseværelsets tyske værktøjsfræser med ultimativ alsidighed',
                  power: '1.5 kW mekanisk kraftoverførsel',
                  maxRPM: '2.000 RPM',
                  axes: '3-akset manuel slædeføring med digital udlæsning (DRO)',
                  tolerances: 'Indenfor +/- 10 µm manuelt',
                  faglærer: 'Husk grundig smøring af vanger før opstart og korrekt opspænding',
                  bestUse: 'Kilebænkspor, svalehalespor, vinkelfræsning og reparationsopgaver',
                  desc: 'Deckel FP1 er den ultimative manuelle værktøjsfræser. Det geniale modulopbyggede design gør det muligt at ombygge maskinen mellem horisontal- og vertikalfræsning på få minutter. Den digitale Heidenhain-skærm gør koordinatboring til en leg.',
                  codePrefix: 'DECKEL_FP1_ACTIVE'
                },
                'haas-desktop-mill': {
                  title: 'Haas Desktop Mill (10 stk)',
                  subtitle: 'Kompakte undervisnings- og prototypefræsere med Haas NGC-kontrol',
                  power: '0.75 kW kompakt højhastighedsspindel',
                  maxRPM: '15.000 RPM',
                  axes: '3-akset (X, Y, Z) med fuld Next Generation Control (NGC)',
                  tolerances: 'Indenfor +/- 15 µm i blødere emner',
                  faglærer: 'Udelukkende POM, Nylon og let aluminium tørt (maskinen har intet aktivt kølevæskesystem)',
                  bestUse: 'Små plast- og aluminiumsprototyper, graveringer samt træning i Haas NGC-styring',
                  desc: 'Vi har en hel flåde på 10 stk Haas Desktop Mills på værkstedet. Selvom de hovedsageligt tjener som undervisningsplatforme til at lære os Haas NGC-grænsefladen at kende, kan de sagtens anvendes til rigtigt maskinarbejde på mindre emner. Grundet fraværet af et aktivt emulsions-kølesystem kører vi udelukkende tør bearbejdning i POM, Nylon og mindre emner i aluminium.',
                  codePrefix: 'HAAS_DESKTOP_NGC'
                }
              };

              const currentMachine = machineDetails[selectedMachineId] || machineDetails['haas-lathe'];

              return (
                <div className="space-y-6">
                  {/* Title Header */}
                  <div className="border-b border-[#1a3554] pb-4">
                    <span className="text-[10px] font-mono text-[#bdff00] font-bold uppercase tracking-wider block">
                      MASKIN-DIAGNOSTIK & KAPACITET
                    </span>
                    <h5 className="font-display font-black text-white text-md uppercase mt-1">
                      {currentMachine.title}
                    </h5>
                    <p className="text-xs text-[#bdff00]/85 font-mono mt-1 font-bold">
                      {currentMachine.subtitle}
                    </p>
                  </div>

                  {/* Descriptive text */}
                  <div className="space-y-2 select-text">
                    <span className="text-[10px] font-mono text-[#8fa3ba] uppercase tracking-widest block font-bold">// DOKUMENTERET ERFARING</span>
                    <p className="text-xs text-[#8fa3ba] leading-relaxed font-sans font-light">
                      {currentMachine.desc}
                    </p>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-[#081320] p-4 border border-[#1a3554] rounded-lg font-mono text-xs select-text text-[#8fa3ba]">
                    <div className="space-y-2">
                      <p className="flex justify-between pb-1 border-b border-[#11263d]">
                        <span>Arbejdseffekt:</span>
                        <span className="text-white font-bold">{currentMachine.power}</span>
                      </p>
                      <p className="flex justify-between pb-1 border-b border-[#11263d]">
                        <span>Maks. hastighed:</span>
                        <span className="text-white font-bold">{currentMachine.maxRPM}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Aktive akser:</span>
                        <span className="text-white font-bold">{currentMachine.axes}</span>
                      </p>
                    </div>

                    <div className="space-y-2 border-l border-[#1a3554] pl-4">
                      <p className="flex justify-between pb-1 border-b border-[#11263d]">
                        <span>Opnåelig tolerance:</span>
                        <span className="text-[#bdff00] font-black">{currentMachine.tolerances}</span>
                      </p>
                      <p className="flex justify-between pb-1 border-b border-[#11263d]">
                        <span>Driftsniveau:</span>
                        <span className="text-[#bdff00] font-bold">Selvkørende (100% tillid)</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Optimal emnetype:</span>
                        <span className="text-white font-bold truncate">{currentMachine.bestUse.split(' ')[0]}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: GLEN'S COMPLETED PROJECTS SHOWCASE */}
      {/* ==================================================================== */}
      {activeTab === 'completed' && (
        <div id="completed-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Vertical Selector Navigation */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-mono text-[#8fa3ba] uppercase tracking-widest block font-bold">
              // INDEX OVER VERIFICEREDE EMNELØB
            </span>

            <div className="space-y-3">
              {COMPLETED_PROJECTS.map((project) => {
                const isSelected = selectedSkpPart.id === project.id;
                return (
                  <div
                    key={project.id}
                    onClick={() => {
                      setSelectedSkpPart(project);
                      setActiveFaiReportIndex(0);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-[#132840] border-[#bdff00] text-white shadow-lg'
                        : 'bg-[#0f2136] border-[#1a3554] hover:border-[#bdff00]/40 hover:bg-[#132a44] text-[#e2edf8]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#bdff00]" />
                    )}
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[8.5px] font-mono font-bold text-[#bdff00] bg-[#081320] px-1.5 py-0.5 border border-[#bdff00]/30 rounded-sm">
                            {project.tolerance}
                          </span>
                          <span className="text-[8.5px] font-mono text-[#8fa3ba]">
                            {project.date}
                          </span>
                        </div>
                        <h5 className="font-display font-bold text-white text-sm uppercase tracking-tight group-hover:text-[#bdff00] transition-colors">
                          {project.title}
                        </h5>
                        <p className="text-[11px] text-[#8fa3ba] line-clamp-1 mt-1 font-sans font-light">
                          {project.process}
                        </p>
                      </div>
                      <ChevronRight size={13} className="text-[#8fa3ba] group-hover:translate-x-0.5 mt-2 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CNC / Finmekanisk Kvalitetsstempel */}
            <div className="bg-[#081320] text-white rounded-xl p-5 border border-[#1a3554] hover:border-[#bdff00]/50 transition-colors shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none">
                <Award size={64} className="text-[#bdff00]" />
              </div>
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#bdff00] animate-pulse" />
                  <span className="text-[9px] font-mono text-[#bdff00] uppercase font-bold tracking-wider">
                    DATUM PROTOTYPING // OFFICIEL VERIFIKATION
                  </span>
                </div>
                <h6 className="font-display font-extrabold text-sm tracking-tight uppercase text-white">
                  100% Eget Værksted & Design
                </h6>
                <p className="text-xs text-[#8fa3ba] font-sans font-light leading-relaxed">
                  Velkommen til det nye **Datum Prototyping**. Hvert emne i dette galleri er fremstillet, målt og kvalitetssikret direkte af Glen på vores egne CNC- og manuelle maskiner. Vi har indlejret hele vores faglige produktportfolio for lokal fremvisning.
                </p>
                <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-mono text-[#bdff00] font-bold">
                  <span>● FRÆSNING ✓</span>
                  <span>● DREJNING ✓</span>
                  <span>● METROLOGI ✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Blueprint Inspect Box */}
          <div className="lg:col-span-7 bg-[#0f2136] border border-[#1a3554] rounded-xl p-6 space-y-6 shadow-xl">
            
            <div className="flex justify-between items-start border-b border-[#1a3554]/50 pb-4 flex-wrap gap-2">
              <div>
                <span className="text-[9px] font-mono text-[#bdff00] font-bold uppercase tracking-wider block">
                  FABRIKATIONS DATA & MÅLEPROTOKOL
                </span>
                <h5 className="font-display font-black text-white text-md uppercase mt-1">
                  {selectedSkpPart.title}
                </h5>
              </div>
              <span className="text-[9px] font-mono text-[#8fa3ba]">{selectedSkpPart.date}</span>
            </div>

            {/* Descriptive texts */}
            <p className="text-xs text-[#8fa3ba] leading-relaxed font-sans font-light">
              {selectedSkpPart.description}
            </p>

            {/* Static specifications list */}
            <div className="grid grid-cols-2 gap-4 bg-[#081320] p-4 border border-[#1a3554] rounded-lg font-mono text-xs text-[#8fa3ba]">
              <div className="space-y-2">
                <p className="flex justify-between pb-1 border-b border-[#11263d]">
                  <span>Råstof:</span>
                  <span className="text-white font-bold">{selectedSkpPart.material}</span>
                </p>
                <p className="flex justify-between pb-1 border-b border-[#11263d]">
                  <span>Maskine:</span>
                  <span className="text-white">{selectedSkpPart.machine}</span>
                </p>
                <p className="flex justify-between">
                  <span>Overflade:</span>
                  <span className="text-white">{selectedSkpPart.finish}</span>
                </p>
              </div>

              <div className="space-y-2 border-l border-[#1a3554] pl-4">
                <p className="flex justify-between pb-1 border-b border-[#11263d]">
                  <span>Tolerance:</span>
                  <span className="text-[#bdff00] font-bold">{selectedSkpPart.tolerance}</span>
                </p>
                <p className="flex justify-between pb-1">
                  <span>Dimensioner:</span>
                  <span className="text-white">{selectedSkpPart.dimensions}</span>
                </p>
              </div>
            </div>

            {/* 3D Fusion 360 Simulated Rendering */}
            {selectedSkpPart.has3dRendering && (
              <div className="bg-[#081320] rounded-xl p-4 border border-[#1a3554] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#bdff00] uppercase tracking-wider font-bold">
                    // AUTOMATISK 3D SIMULERING // AUTODESK FUSION 360 MODEL
                  </span>
                  <button 
                    onClick={() => setIsRotating(!isRotating)}
                    className="text-[9px] font-mono px-2.5 py-1 rounded-lg bg-[#0f2136] hover:bg-[#1a3554] text-[#e2edf8] border border-[#1a3554] transition cursor-pointer"
                  >
                    {isRotating ? '■ PAUSE' : '▶ AFSPIL'}
                  </button>
                </div>
                
                {/* SVG Live Simulation Graphic of a Flame Licker Atmospheric Engine Cylinder and Flywheel assembly */}
                <div className="relative h-44 bg-[#081320] border border-[#1a3554] rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#bdff00_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Rotating background lines and crosshair */}
                  <div className="absolute top-2 left-3 font-mono text-[8px] text-[#8fa3ba]">
                    DIAG_GRID: AUTO // RECP: OK
                  </div>
                  <div className="absolute bottom-2 right-3 font-mono text-[8.5px] text-[#bdff00] font-bold">
                    ROTATION: {rotationTheta}°
                  </div>

                  <svg width="280" height="150" className="relative z-10 overflow-visible">
                    {/* Draw Cylinder block at left */}
                    <rect x="25" y="55" width="70" height="40" rx="3" fill="#13243a" stroke="#1d3725" strokeWidth="1.5" />
                    {/* Cooling fins on cylinder block */}
                    {[35, 45, 55, 65, 75, 85].map((finX) => (
                      <line key={finX} x1={finX} y1="50" x2={finX} y2="100" stroke="#1a3554" strokeWidth="1.5" />
                    ))}
                    
                    {/* Cylinder Bushing Inner Bore */}
                    <rect x="25" y="65" width="70" height="20" fill="#081320" stroke="#bdff00" strokeWidth="1" strokeDasharray="3 1" opacity="0.4" />
                    <text x="32" y="61" fill="#8fa3ba" fontSize="6.5" fontFamily="monospace">Ø18 H6</text>

                    {/* Flame source at left inlet opening */}
                    <g transform="translate(10, 75)">
                      <rect x="-5" y="10" width="10" height="25" fill="#13243a" />
                      <polygon 
                        points="0,-16 -6,0 6,0" 
                        fill="#F59E0B" 
                        className="animate-pulse" 
                        style={{
                          transformOrigin: '0px 0px',
                          transform: `scale(${1 + Math.sin((rotationTheta * Math.PI) / 30) * 0.15})`,
                          opacity: (rotationTheta > 90 && rotationTheta < 270) ? 0.35 : 0.95
                        }}
                      />
                      <polygon 
                        points="0,-10 -3,0 3,0" 
                        fill="#EF4444" 
                        style={{
                          transformOrigin: '0px 0px',
                          transform: `scale(${1 + Math.sin((rotationTheta * Math.PI) / 30) * 0.1})`,
                          opacity: (rotationTheta > 90 && rotationTheta < 270) ? 0.25 : 0.95
                        }}
                      />
                    </g>

                    {/* Piston position calculation block */}
                    {(() => {
                      const rad = (rotationTheta * Math.PI) / 180;
                      const amp = 13;
                      const pistonX = 42 + Math.cos(rad) * amp;
                      const shaftX = 175;
                      const shaftY = 75;
                      const crankX = shaftX + Math.cos(rad) * 16;
                      const crankY = shaftY + Math.sin(rad) * 16;
                      const valveOpen = rotationTheta < 185;
                      const valveAngle = valveOpen ? -25 : 0;

                      return (
                        <>
                          {/* Inner Piston (made of graphite/iron) */}
                          <rect x={pistonX} y="67" width="22" height="16" rx="1.5" fill="#e2edf8" stroke="#bdff00" strokeWidth="1" />
                          <circle cx={pistonX + 11} cy="75" r="2.5" fill="#bdff00" />

                          {/* Valve Reed Flap (at left entrance of cylinder x=25) */}
                          <line 
                            x1="25" 
                            y1="57" 
                            x2="25" 
                            y2="93" 
                            stroke="#EF4444" 
                            strokeWidth="2" 
                            style={{
                              transform: `rotate(${valveAngle}deg)`,
                              transformOrigin: '25px 57px',
                              transition: 'transform 0.1s ease-out'
                            }}
                          />
                          <text x="5" y="49" fill="#EF4444" fontSize="6" fontFamily="monospace" fontWeight="bold">
                            {valveOpen ? "FLAP: ÅBEN (SUGEFASE)" : "FLAP: LUKKET (VAKUUM)"}
                          </text>

                          {/* Connecting Rod */}
                          <line 
                            x1={pistonX + 11} 
                            y1="75" 
                            x2={crankX} 
                            y2={crankY} 
                            stroke="#8fa3ba" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                          />

                          {/* Flywheel outer ring representing Ø80 mm */}
                          <circle cx={shaftX} cy={shaftY} r="35" fill="none" stroke="#1a3554" strokeWidth="3" />
                          <circle cx={shaftX} cy={shaftY} r="32" fill="none" stroke="#13243a" strokeWidth="1" />
                          
                          {/* Flywheel spokes rotating */}
                          <g transform={`translate(${shaftX}, ${shaftY}) rotate(${rotationTheta})`}>
                            <line x1="0" y1="-32" x2="0" y2="32" stroke="#8fa3ba" strokeWidth="1.5" />
                            <line x1="-32" y1="0" x2="32" y2="0" stroke="#8fa3ba" strokeWidth="1.5" />
                            <path d="M -16,0 A 16,16 0 0,0 16,0 Z" fill="#bdff00" opacity="0.15" />
                            <circle cx="16" cy="0" r="3" fill="#bdff00" />
                          </g>

                          {/* Flywheel center axle hub */}
                          <circle cx={shaftX} cy={shaftY} r="6" fill="#081320" stroke="#8fa3ba" strokeWidth="1" />
                          <circle cx={shaftX} cy={shaftY} r="2.5" fill="#bdff00" />
                        </>
                      );
                    })()}
                  </svg>
                </div>
                
                {/* External link with beautiful custom visual */}
                <div className="flex flex-col sm:flex-row gap-2 justify-between items-center bg-[#081320] p-2.5 rounded border border-[#1a3554]">
                  <span className="text-[10.5px] font-sans text-[#8fa3ba] font-light text-center sm:text-left">
                    Se fuld CAD-fil, montagetegninger og maskinkørselsvideoer:
                  </span>
                  <a 
                    href={selectedSkpPart.renderingUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#bdff00] hover:bg-lime-400 text-black font-mono text-[10.5px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shrink-0"
                  >
                    <span>{selectedSkpPart.renderLabel || 'Se i Fusion 360'}</span>
                    <Sparkles size={11} />
                  </a>
                </div>
              </div>
            )}

            {/* FAI Reports metrology section */}
            {selectedSkpPart.faiReports && selectedSkpPart.faiReports.length > 0 && (
              <div className="border border-[#1a3554] rounded-lg overflow-hidden space-y-0 bg-[#081320] shadow-xl font-sans">
                <div className="bg-[#0f2136] px-4 py-3 border-b border-[#1a3554] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[8.5px] font-mono text-[#8fa3ba] block font-bold tracking-wider">
                      METROLOGI-REPORT // 100% VERIFICERET AF DATUM
                    </span>
                    <h6 className="text-white font-sans font-bold text-xs uppercase tracking-tight flex items-center gap-1.5 mt-0.5">
                      <Award size={13} className="text-[#bdff00]" />
                      Målerapport (First Article Inspection)
                    </h6>
                  </div>
                  
                  {/* Tab options for the 3 pieces with FAI reports */}
                  <div className="flex bg-[#081320] p-1 rounded-lg gap-1 border border-[#1a3554] self-start sm:self-auto">
                    {selectedSkpPart.faiReports.map((report, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveFaiReportIndex(idx)}
                        className={`px-2 py-0.5 text-[9.5px] font-mono font-bold rounded transition cursor-pointer ${
                          activeFaiReportIndex === idx
                            ? 'bg-[#bdff00] text-black shadow-sm'
                            : 'text-[#8fa3ba] hover:text-white'
                        }`}
                      >
                        Del {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Print of active FAI Sheet */}
                {(() => {
                  const r = selectedSkpPart.faiReports[activeFaiReportIndex] || selectedSkpPart.faiReports[0];
                  return (
                    <div className="p-4 space-y-3.5 bg-[#081320]">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] border-b border-[#1a3554]/50 pb-2 text-[#8fa3ba] font-mono">
                        <div>
                          <span>EMNENAVN:</span> <br />
                          <span className="text-white font-sans font-bold uppercase">{r.partName}</span>
                        </div>
                        <div>
                          <span>MÅLEPROTOKOL ID:</span> <br />
                          <span className="text-white font-bold">{r.faiId}</span>
                        </div>
                        <div>
                          <span>KONTROLLANT:</span> <br />
                          <span className="text-white font-sans">{r.inspector}</span>
                        </div>
                      </div>

                      {/* Dimension measurement table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono min-w-[500px]">
                          <thead>
                            <tr className="bg-[#0f2136] text-[#8fa3ba] text-[9px] uppercase font-bold tracking-wider border-b border-[#1a3554]">
                              <th className="py-2 px-2 font-mono">Kontrolpunkt / Geometri</th>
                              <th className="py-2 px-2 font-mono">Nominel</th>
                              <th className="py-2 px-2 font-mono">Tolerance</th>
                              <th className="py-2 px-2 font-mono">Aktuelt Mål</th>
                              <th className="py-2 px-2 font-mono">Afvigelse</th>
                              <th className="py-2 px-2 font-mono">Måleværktøj</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1a3554]/45 text-[10.5px] text-[#e2edf8]">
                            {r.measuredDimensions.map((dim, dIdx) => {
                              const nominalNum = parseFloat(dim.nominal.replace(/[^0-9.]/g, ''));
                              const actualNum = parseFloat(dim.actual.replace(/[^0-9.]/g, ''));
                              const deviation = !isNaN(nominalNum) && !isNaN(actualNum)
                                ? `${(actualNum - nominalNum) >= 0 ? '+' : ''}${(actualNum - nominalNum).toFixed(3)} mm`
                                : '0.000 mm';

                              return (
                                <tr key={dIdx} className="hover:bg-[#132840]/30">
                                  <td className="py-1.5 px-2 font-sans font-medium text-white text-[11px]">{dim.feature}</td>
                                  <td className="py-1.5 px-2 text-[#8fa3ba]">{dim.nominal}</td>
                                  <td className="py-1.5 px-2 text-[#8fa3ba]">{dim.tolerance}</td>
                                  <td className="py-1.5 px-2 text-[#bdff00] font-bold">{dim.actual}</td>
                                  <td className="py-1.5 px-2 text-[#8fa3ba]">{deviation}</td>
                                  <td className="py-1.5 px-2 text-[#8fa3ba] font-sans text-[10px] leading-snug">{dim.instrument}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#bdff00]/10 border border-[#bdff00]/30 text-[#bdff00] text-[10.5px] px-3 py-1.5 rounded-lg font-semibold">
                        <Check size={12} className="stroke-[3]" />
                        <span>KVALITETSGODKENDT: Den fysiske mekaniske del opfylder samtlige tolerancerammer.</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Operational note block */}
            <div className="bg-[#291e08]/40 border border-[#b45309]/30 p-4 rounded-xl text-xs text-amber-400 space-y-1.5 font-sans font-light">
              <span className="font-mono text-[9px] uppercase font-bold text-amber-400 tracking-wider block">
                // INSPEKTERINGS-KOMMENTAR FRA VÆRKSTEDET
              </span>
              <p className="italic leading-relaxed text-[#e2edf8] font-sans text-xs">
                "{selectedSkpPart.notes}"
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: ADVANCED MATERIAL PARAMETERS */}
      {/* ==================================================================== */}
      {activeTab === 'materials' && (
        <div id="materials-tab" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(MATERIAL_DATA_DB).map((key) => {
            const data = MATERIAL_DATA_DB[key];
            return (
              <div key={key} className="bg-[#0f2136] border border-[#1a3554] hover:border-[#00e5ff] transition-all rounded-xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-[#1a3554]/50 pb-2.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#bdff00] bg-[#081320] border border-[#bdff00]/40 px-2 py-0.5 rounded-sm">
                      {data.alloyName}
                    </span>
                    <span className="text-[9.5px] font-mono text-[#00e5ff] font-bold">
                      {data.machinability}% BEARBEJD
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-display font-medium text-white text-md uppercase tracking-tight">
                      {data.name}
                    </h5>
                    <p className="text-[11px] text-[#8fa3ba] font-mono tracking-wider">
                      Kemisk sammensætning: <span className="text-white font-sans font-light italic">{data.chemicalComposition}</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-[#8fa3ba] uppercase font-bold tracking-wider">Fordele:</span>
                    <ul className="space-y-1 text-xs text-[#e2edf8] font-sans list-none font-light leading-relaxed">
                      {data.advantages.map((adv, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#00e5ff] text-[9px] mt-0.5 shrink-0">■</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-[#8fa3ba] uppercase font-bold tracking-wider text-rose-400">Ulemper:</span>
                    <ul className="space-y-1 text-xs text-[#e2edf8] font-sans list-none font-light leading-relaxed">
                      {data.disadvantages.map((dis, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-400 text-[9px] mt-0.5 shrink-0">■</span>
                          <span>{dis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 bg-[#081320] border border-[#1a3554]/50 rounded-lg p-3 mt-2.5">
                    <span className="text-[8.5px] font-mono text-[#8fa3ba] uppercase font-bold tracking-wider block mb-0.5">
                      Primær Anvendelse:
                    </span>
                    <p className="text-xs text-[#e2edf8] font-sans font-normal leading-relaxed">
                      {data.bestUse}
                    </p>
                  </div>

                  <div className="space-y-2 bg-[#291c05]/40 border border-[#b45309]/30 rounded-lg p-3 mt-2">
                    <span className="text-[8.5px] font-mono text-amber-400 uppercase font-bold tracking-wider block">
                      Konkrete Projekteksempler:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#e2edf8] font-sans list-none font-light leading-relaxed">
                      {data.examples.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 text-[8px] mt-1 shrink-0">✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                <div className="pt-4 border-t border-[#1a3554]/50 mt-5 font-mono text-[10px] text-[#8fa3ba] flex justify-between items-center">
                  <span>MASSEFYLDE (DENSITET):</span>
                  <span className="text-white font-bold font-mono text-[10.5px]">{data.density.toFixed(2)} g/cm³</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
