# DATUM PROTOTYPING — V5.4.3 / CONTROLLED DEPTH

**22. november 2026 — fuld hjemmesidepakke**

## Hvad er nyt

Denne version bygger videre på V5.4.2 og giver hele hjemmesiden et sammenhængende atmosfærisk baggrundssystem. Designet bevarer den godkendte hero, indholdet, kortenes form, det varme messingfarvede brand og det billedfri FDM-overblik.

- **02 / KOMPETENCER:** Soft-focus værkstedslys, svag maskinatmosfære og D/P-ghost. Forsvinder bag de fotografiske kort.
- **03 / MATERIALER:** Børstet metal, køligt stålskær og varmt messingfelt; materialerne er stadig lette at skelne fra hinanden.
- **04 / MIN TILGANG:** Dæmpet engineering-grid med koordinatmarkeringer, 3 lyspunkter og en rolig visuel progression.
- **05 / OM DATUM:** Bevarer sit store foto, men får flere tone- og lyslag, uden portræt.
- **06 / KONTAKT:** Mørk, rolig afslutning med fokuseret messingglød omkring kontaktområdet.
- **Sektionsovergange:** Lys-sømme og bløde gradienter, der holder siden sammen ved scroll og zoom-out.
- **404 og privatliv:** Samme kontrollerede dybde, stadig selvstændige HTML-sider med indlejret CSS og egne billeder.

## Teknisk opbygning

- `index.html` — de seks sektioner; HTML-indholdet er synligt uden JavaScript.
- `404.html`, `privatliv.html` — offline-tolerante undersider med indlejret CSS/foto/logo.
- `css/site-v5.4.css` — hovedsidens eksisterende design.
- `css/flow-v5.4.1.css` — eksisterende, dekorative overgange.
- **`css/depth-v5.4.3.css`** — det nye lagdelte atmosfæresystem.
- `js/site-v5.4.3.js` — mobilmenu, mailkopiering, header, progress, hero-fit og en enkelt, diskret atmosfære-afsløring.
- `assets/backgrounds/` — optimerede webP-teksturer, bløde baggrundsbilleder, teknisk grid og ghosted D/P-motiver.
- `assets/images/` — selvstændige fotos til kompetencer/materialer, originale motiver bevaret.
- `assets/brand/`, `assets/icons/`, `assets/og/` — brand og delingsbillede (OG uændret).
- `.htaccess` — sikkerhedspolitik med opdateret SHA-256-hash til selvstændige undersider, status-404 for Apache/LiteSpeed.
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, `favicon.ico`.

## Offentliggørelse

1. Gem en kopi af din nuværende liveudgave.
2. Pak ZIP-filen ud. Dens indhold ligger **direkte i roden** — ikke i en ekstra versionsmappe.
3. Upload alle filer og mapper til domænets webrod. Husk `.htaccess`, hvis dit webhotel bruger Apache/LiteSpeed.
4. Kontrollér forsiden, mobilmenu og mailkopiering, samt `/privatliv.html`, `/404.html` og en ugyldig adresse.
5. Tjek at `https://datumprototyping.dk/assets/og/datum-prototyping-og-v5-0-3.jpg` stadig kan hentes.

Denne version er ikke automatisk publiceret til domænet.

## Test og begrænsninger

Se `docs/QA_V5.4.3.md`. Browserens politik blokerer direkte navigation til lokale `file://`- og `localhost`-adresser i testmiljøet; derfor er der testet en isoleret browsergengivelse af de samme HTML-, CSS-, JS- og billedfiler samt en særskilt kontrol af **alle faktiske lokale filstier**. 404/privatliv er gengivet med ekstern CSS fjernet, så de indlejrede designs testes. **Serverens faktiske HTTPS, HTTP-404 og offentlige sociale previews kan kun verificeres efter upload**.

Alle dekorative effekter er valgfrie: siden virker også uden JavaScript, og animationer er deaktiveret ved `prefers-reduced-motion`.
