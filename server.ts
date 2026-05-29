import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Quick health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Precision Calculator and Technical Estimator
app.post('/api/estimate', async (req, res) => {
  try {
    const reqData = req.body;
    const processName = reqData.process || 'CNC-drejning';
    const material = reqData.material || 'Aluminium';
    const length = reqData.length || 0;
    const width = reqData.width || 0;
    const height = reqData.height || 0;
    const diameter = reqData.diameter || 0;
    const tolerance = reqData.tolerance || '±0.05 mm';
    const quantity = reqData.quantity || 1;
    const description = reqData.description || '';
    const name = reqData.name || 'Gæst';
    const hasDrawing = reqData.hasDrawing ? 'Ja' : 'Nej';
    const drawingName = reqData.drawingName || 'N/A';

    // Calculate a basic technical estimation as a fallback
    let materialUnitFactor = 1;
    if (material.toLowerCase().includes('titan')) materialUnitFactor = 3.0;
    else if (material.toLowerCase().includes('peek')) materialUnitFactor = 4.0;
    else if (material.toLowerCase().includes('rustfri')) materialUnitFactor = 2.0;
    else if (material.toLowerCase().includes('brass') || material.toLowerCase().includes('messing')) materialUnitFactor = 1.5;
    else if (material.toLowerCase().includes('pom')) materialUnitFactor = 1.0;
    else if (material.toLowerCase().includes('pla') || material.toLowerCase().includes('petg')) materialUnitFactor = 0.5;

    let processFactor = 1.0;
    if (processName.includes('print')) processFactor = 0.45;
    else if (processName.includes('manuel')) processFactor = 0.8;
    else if (processName.includes('fræsning_5')) processFactor = 1.6;

    let toleranceFactor = 1.0;
    if (tolerance.includes('0.002') || tolerance.includes('finere')) toleranceFactor = 2.5;
    else if (tolerance.includes('0.01')) toleranceFactor = 1.8;

    let quantityFactor = 1.0;
    if (quantity >= 100) quantityFactor = 0.6;
    else if (quantity >= 10) quantityFactor = 0.8;

    // We calculate in count of Sodas (sodavand) and Snacks (snackposer/barer)
    const baseSetupSnacks = Math.max(1, Math.round(2 * toleranceFactor * processFactor)); // 1-5 snacks for setup
    const baseUnitSodas = Math.max(1, Math.round(1 * materialUnitFactor * toleranceFactor * processFactor * quantityFactor)); // 1-6 sodas per unit
    const baseTotalSodas = Math.round(baseUnitSodas * quantity);

    let detailSection = '';
    if (processName.includes('print')) {
      detailSection = `- **Additive Metoder (3D-Print Lab)**: Vi kører opgaven i slidstærkt materiale (PLA / PETG) på vores CoreXY 3D-printere. Det er optimalt til fit-checks, ergonomiske design-dummies og geometrisk validering før eventuel efterfølgende spåntagning.`;
    } else if (processName.includes('manuel_drejning')) {
      detailSection = `- **Manuel Drejning**: Emnet spændes op i vores præcisions-drejebænk (Colchester) til hurtig og effektiv enkeltstyksforarbejdning. Velegnet til tilpasninger, enkle bøsninger, og opgaver uden behov for udtømmende CNC-programmering.`;
    } else if (processName.includes('manuel_fræsning')) {
      detailSection = `- **Manuel Fræsning**: Udføres på vores traditionelle fræsere. Ideelt til planside-fræsning, udboring af fiksturopsætninger, affasninger og enkle mellemstykker.`;
    } else if (processName.includes('slibning')) {
      detailSection = `- **Præcisionsslibning**: Vi anvender plansliber og rundslibning for at ramme de fineste tolerancer og mindste overfladeruhed på f.eks. hærdede stålemner.`;
    } else {
      detailSection = `- **CNC Drejning (Haas ST10)**: Forløb planlægges og afvikles med præcisionsprofiler på vores Haas CNC. Perfekt til snævre geometriske tolerancer.\n- **CNC Fræsning (Haas Mini Mill)**: Avancerede forløb med High-Speed Machining (HSM) med op til 10.000 RPM til at etablere fine lommer og komplekse overfladeforløb.`;
    }

    const fallbackEstimate = {
      estimatedCost: baseTotalSodas,
      unitCost: baseUnitSodas,
      setupCost: baseSetupSnacks,
      machineTimeMinutes: Math.round((15 + (length * 0.1)) * toleranceFactor * processFactor),
      recommendation: `Opgaven vurderes som realistisk. Kræver ${baseTotalSodas} stk. sodavand og ${baseSetupSnacks} stk. snacks til deling på værkstedet!`,
      feasible: true,
      feedback: `### Teknisk Vurdering & DFM-Noter\n\nDu har anmodet om en skolepraktik-fremstilling af emnet i **${material}** via processen **${processName}**.\n\n*   **Geometrisk volumen**: ${diameter > 0 ? `Ø${diameter}x` : ''}${length} mm ${width > 0 ? `x ${width} mm x ${height} mm` : ''}.\n*   **Tolerancekrav**: ${tolerance}.\n\n#### Betalingsmodel (Mekanismer for Skolepraktik)\nDa denne opgave løses som led i finmekanikeruddannelsen, må vi absolut **ikke modtage monetær betaling**. Arbejdet modregnes i stedet udelukkende symbolsk i **sodavand** (f.eks. Faxe Kondi, Coca Cola) og **snacks** (f.eks. Snickers-barer, chokolader eller chips) til deling i værkstedsmiljøet:\n\n*   **Opstillingspant (Snacks)**: **${baseSetupSnacks} stk.** til opstart og klargøring af maskinerne.\n*   **Produktionstakst (Sodavand)**: **${baseUnitSodas} stk.** kold dåsesodavand pr. færdiggjort emne.\n*   **Samlet takst for ${quantity} stk**: **${baseTotalSodas} dåser** + **${baseSetupSnacks} stk. snacks**.\n\n#### Værkstedets metoder & bearbejdningsplan\n${detailSection}\n\nJeg varetager selv programmering, udrustning og spåntagning under tryg og kyndig vejledning af vores faglærere på Stæhr Johansens Vej 7.`
    };

    // Check if GEMINI_API_KEY environment variable is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      console.warn('GEMINI_API_KEY is not configured or using placeholder. Returning high-fidelity procedural fallback estimate.');
      return res.json({
        ...fallbackEstimate,
        feedback: `*(Bemærk: Kører i offline-beregningstilstand)*\n\n` + fallbackEstimate.feedback
      });
    }

    const ai = getGeminiClient();

    const prompt = `Du er en højt specialiseret finmekanikerelev i Skolepraktik (SKP). Du har det primære ansvar for opgaverne på jeres alsidige maskinværksted beliggende på Stæhr Johansens Vej 7 på Frederiksberg.
Værkstedet råder over topmoderne bearbejdningsudstyr samt traditionelle maskiner og additive metoder:
1. CNC-afdeling: Haas Mini Mill (3-akset fræsning, High-Speed Machining op til 10.000 RPM) og Haas ST10 (CNC-drejebænk for mikro-tolerancer).
2. Manuel afdeling: Manuelle Colchester drejebænke med digital udlæsning (DRO) og robuste manuelle fræsere til hurtig spåntagning uden programmeringstid.
3. 3D-Print Lab: CoreXY FDM-printere til hurtige prototyper, ergonomiske formtestere og geometriske dummy-moduler i PLA/PETG.

Analyser følgende emnebeskrivelse og foreslåede data. Udarbejd en stram, professionel, letlæselig teknisk DFM-rapport (Design for Manufacturability), estimer maskintiden og giv gode herunder faglige råd i forhold til tolerancekravet, og om emnet er bedst spændt op i CNC, bearbejdet manuelt, eller om der kan spares tid ved at 3D-printe en hurtig dummy først.

Da dette er skolepraktik, er der tale om non-kommerciel uddannelsesfremstilling. Prisen må absolut ikke dækkes i penge, men skal som en sjov og hyggelig tradition udregnes i antal SODAVAND (f.eks. Faxe Kondi eller Coca Cola) og SNACKS (f.eks. chips eller chokoladebarer) til deling blandt eleverne på værkstedet.

Svar på DANSK og returner et JSON-objekt, der overholder denne grænseflade nøjagtigt:
{
  "estimatedCost": number (totalt rimeligt antal dåser SODAVAND til hele ordren, runder op),
  "unitCost": number (antal dåser SODAVAND per emne),
  "setupCost": number (antal poser SNACKS eller chokolade til maskinopstillingen),
  "machineTimeMinutes": number (estimeret gennemsnitlig maskintid per emne i minutter),
  "recommendation": "string (en skarp faglært anbefaling baseret på vores maskiners grænser på max 120 tegn)",
  "feasible": boolean (om opgaven kan løses på værkstedet på Stæhr Johansens Vej 7),
  "feedback": "string (smuk og letlæselig markdown, der gransker geometrien, forklarer spåntagningsprocessen pædagogisk med henvisning til værkstedets maskiner (Haas ST10, Haas Mini Mill, Colchester drejebænk, manuelle maskiner eller CoreXY 3D-printere), diskuterer materialet (f.eks. hvis PLA/PETG til 3D-print eller messing/stål/aluminium), uddyber råd til tolerancen samt slutter muntert af med betingelserne vedrørende sodavand og snacks til værkstedet)"
}

Her er specifikationerne:
- Bearbejdningsproces: ${processName}
- Materialevalg: ${material}
- Dimensioner: Længde: ${length} mm, Bredde: ${width} mm, Højde: ${height} mm, Diameter: ${diameter} mm (hvis det er et cirkulært emne)
- Ønsket tolerance: ${tolerance}
- Antal emner overslag: ${quantity} stk
- Beskrivelse af geometri/funktion: ${description}
- Fil/Model vedhæftet: ${hasDrawing} (Tegningsnavn: ${drawingName})
- Kundens navn: ${name}

Udarbejd et svar af utrolig høj sproglig kvalitet på dansk, hold det faglært og professionelt med et glimt i øjet.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['estimatedCost', 'unitCost', 'setupCost', 'machineTimeMinutes', 'recommendation', 'feasible', 'feedback'],
          properties: {
            estimatedCost: { type: Type.NUMBER },
            unitCost: { type: Type.NUMBER },
            setupCost: { type: Type.NUMBER },
            machineTimeMinutes: { type: Type.INTEGER },
            recommendation: { type: Type.STRING },
            feasible: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
          },
        },
      },
    });

    const textOutput = response.text;
    if (textOutput) {
      const parsedData = JSON.parse(textOutput.trim());
      return res.json(parsedData);
    } else {
      throw new Error('No text generated from Gemini');
    }
  } catch (error: any) {
    console.error('Error during AI quote generation:', error);
    // If anything fails (e.g. rate limit, invalid JSON), gracefully return fallback
    return res.status(200).json({
      estimatedCost: Math.round((req.body.quantity || 1) * 1.5),
      unitCost: 1.5,
      setupCost: 2,
      machineTimeMinutes: 20,
      recommendation: "Brug Haas Mini Mill eller Haas ST10. Afregnes i kolde sodavand og snacks!",
      feasible: true,
      feedback: `### Teknisk SKP Vurdering (Haas Mini Mill / ST10)\n\nDet kniber lidt med forbindelsen til vores AI i øjeblikket, men vi har genereret et automatisk overslag til dig:\n\n*   **Emne-proces**: ${req.body.process || 'Dreje/Fræse'}\n*   **Materiale**: ${req.body.material || 'Ikke angivet'}\n*   **Kvantitet**: ${req.body.quantity || 1} stk.\n\n#### Prisoverslag i Sodavand & Snacks\n- **Opstillings-snacks**: **2 stk.** snacks (Chips, Snickers eller Kanelgifler) til opstillingen på maskinen.\n- **Sodavand per emne**: **1-2 stk.** dåsesodavand (f.eks. Faxe Kondi / Coca-Cola) per færdigt styk.\n\nSend os en forespørgsel i formularen, så gransker jeg samt vores faglærer din tegning manuelt på vores værksted på Stæhr Johansens Vej 7!`
    });
  }
});

async function startServer() {
  // Vite integration for dev server or static file server in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CNC Mechanic Portfolio Server fully active on port ${PORT}`);
  });
}

startServer();
