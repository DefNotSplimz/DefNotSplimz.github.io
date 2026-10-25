# DATUM PROTOTYPING — WEBSITE V3.4

## Projektstruktur

```
index.html
favicon.ico
apple-touch-icon.png
site.webmanifest
robots.txt
sitemap.xml
assets/
  css/style.css
  js/main.js
  images/   (alle godkendte fotos, logo og social/delingsbilleder)
  icons/    (favicon, mobil- og app-ikoner)
```

**Brand:** Titanium / Glacier. **Design, tekst og interaktioner:** uændrede i forhold til godkendt V3.3, bortset fra organisatoriske assets og manglende ikonressourcer.

### Implementering

1. Upload alt indhold af denne mappe samlet til roden af `https://datumprototyping.dk/`.
2. Bevar mappenavne og filplaceringer præcis som i ZIP-filen. `index.html` refererer til de lokale CSS-, JS- og billedfiler.
3. Sørg for HTTPS, og kontrollér at `/assets/images/og-datum-prototyping.jpg` er offentligt tilgængelig. OG-bots kan ikke læse lokale `file://`-demoer.
4. Brug ikke demoens billeder som dokumentation for faktiske egne faciliteter: billederne er AI-genererede illustrationsfotos.
5. Kontaktformularen sender ikke direkte; den klargør projektbrief til kopiering. Brugeren vedhæfter selv sine eventuelle filer til e-mail.

### Grafik og ikoner

- `assets/images/logo.png` — godkendt fuldt Datum Prototyping-logo (ikke rentegnet her)
- `assets/icons/datum-d-symbol.png` — beskåret originalt D-symbol til ikoner, ikke en nyfortolket logoform
- `favicon.ico`, `assets/icons/favicon-*` — browserikoner
- `apple-touch-icon.png` — Apple/iOS bogmærkeikon
- `assets/icons/android-chrome-*` — ikoner til Android/hjemskærm
- `assets/images/og-datum-prototyping.jpg` — 1200 × 630, Open Graph / Twitter
- `assets/images/hero-mobile.webp` — alternativ beskæring (ligger klar som billedasset, anvendes ikke i V3.4 layoutet)

### Font

Cabin hentes fortsat fra Google Fonts (med eksisterende lokale fallback-skrifter). Ingen fontfiler er medleveret.

### Test

Kontrollér ved deployment at alle ressourcer indlæses med HTTP 200, at procesvælger/ R&D-faser/materialer virker, og at kopieringsknapperne fungerer fra HTTPS eller localhost.


## Opdatering v3.4.1 — Privatlivspolitik

- `privatliv.html` er tilføjet som selvstændig, responsiv side med samme brand og ikonfiler som forsiden.
- `assets/js/privacy.js` håndterer mobilmenu og scrollindikator på privatlivssiden.
- Privatlivspolitikken linker tilbage til forsiden, og forsiden linker til den fra footer og projektformular.
- `sitemap.xml` indeholder nu `/privatliv.html`.
- Hjemmesidens formular indsamler og sender ikke oplysninger automatisk; besøg og kopieringsfunktioner beskrives i privatlivsteksten.

### Kontrollér før offentliggørelse

Dette er et tekstudkast, som tager udgangspunkt i V3.4-koden — ikke en juridisk godkendelse.

1. Bekræft den faktiske juridiske dataansvarlige, eventuelt CVR og kontaktadresse.
2. Bekræft din webhosting, logning, databehandlere og opbevarings-/slettefrister.
3. Afgør om Google Fonts skal indlæses fra Google, eller hostes lokalt. Direkte Google Fonts-forbindelser er oplyst i teksten; kontrollér overførsel og retligt grundlag.
4. Bekræft, at der ikke er tilføjet cookies, tracking eller eksterne integrationer på den offentlige hosting.
5. Gennemgå tekstens faktiske formuleringer og procedure for opbevaring/sletning med den driftsansvarlige.

Hvis du ændrer hosting, e-mailudbyder, kontaktformular eller analytics, skal privatlivspolitikken opdateres tilsvarende.


## Opdatering V3.4.2 — CNC-fræsningsbillede ved første indlæsning

- Rettet den forældede inline-billedsti `assets/cnc-mill.webp` til `assets/images/cnc-mill.webp` i `index.html`.
- Metodevælgeren initialiserer nu den valgte metode synkront ved indlæsning, så billede, beskrivelse og metodekort svarer til den valgte knap fra starten.
- CSS, øvrige sektioner og projektformularen er uændrede.


## V3.5 — Samlet spacing- og typografikontrol

- Ingen ændringer i godkendt logo, billeder, punchline eller formularens funktionalitet.
- Optisk justering af overskrifternes bogstavafstand, linjeafstand og punktum i hero.
- Ensretning af små sektionslabels, knapper, opgavekort og brødteksters læsbarhed.
- Forbedret alignment og mellemrum i navigation, metodekort, R&D, materialer, Om og kontakt.
- Materialevælgeren er nu 3 lige brede faner på små skærme (i stedet for faner, der stikker udenfor).
- Scroll-target offset følger den faste navigations højde.
- Forbedrede knapstørrelser og formatering ved 320–390 px samt mellembrede skærme.
- Privatlivspolitikken er bibeholdt og bruger det fælles stylesheet.

Designet skal efter upload gennemgås i de faktisk installerede browsere med udgangspunkt i disse responsive kontroller.


## V3.5.1 — Open Graph-forbedring
- Ny `assets/images/og-datum-prototyping-v2.jpg` (2400 × 1260), fotograferet illustration og separat, skarp typografi.
- `og-datum-prototyping-v2-master.png` (tabsfri PNG-master) og `og-datum-prototyping-v2-1200.jpg` (1200 × 630 kompatibilitetseksempel).
- `index.html`: `og:image`, `og:image:secure_url`, `twitter:image` opdateret til nyt cachebrydende URL-navn samt korrekte billeddimensioner.
- Den tidligere OG-fil er bevaret som arkiv, så intet andet fra hjemmesiden brydes.
- Upload hele mappen, og tjek derefter Social Sharing-previews via crawler. Sociale platforme kan cache gamle versioner.
- AI-genereret foto er brandillustration, ikke dokumentation for egne maskiner eller kundeprojekter.


## Opdatering 3.5.2 — Muligheder & materialer
- Materialer opdelt i metaller og plast/FDM med alle relevante materialer.
- Bearbejdet plast adskilt tydeligt fra 3D-print.
- Selvstændigt område med 6 eksempler på mulige opgaver: one-of-one, prototyper, genskabelse, adaptere/beslag, fiksturer og små serier.
- CTA til projektformular; ingen andre sektioner ændret.
