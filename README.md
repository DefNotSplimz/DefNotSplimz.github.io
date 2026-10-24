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
