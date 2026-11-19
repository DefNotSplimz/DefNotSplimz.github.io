# V5.0.1 – footerlogo hotfix

Rettelse: Footerlogoet bevarer nu den korrekte vandrette proportion. Den ekstra højde skyldtes HTML-attributten `height="485"` kombineret med en tidligere CSS-regel, der kun ændrede billedets bredde. Header og øvrig struktur er bevaret.

# Datum Prototyping — V5.0

Statisk, lokal/hosting-klar hjemmeside med kun HTML, CSS, JavaScript og lokale billeder. Ingen databaser, kontaktformularer, tracking, cookies eller eksterne CDN-kald.

## Åbn lokalt
Åbn `index.html`. Navigation, indhold og billeder kan læses offline. Kopiér-knappen virker i browsere, der giver adgang til udklipsholderen (typisk HTTPS eller localhost); ved begrænset adgang vises forklaring.

## Upload
Upload **indholdet af mappen** til domænets webrod, ikke selve mappen. Bevar alle stier. Ved Apache/LiteSpeed behold `.htaccess`, ved Netlify behold `_redirects`. Test `https://datumprototyping.dk/`, `https://datumprototyping.dk/privatliv.html` og en ugyldig URL på live server.

## Mappestruktur
- `index.html`, `privatliv.html`, `404.html`
- `css/` (base, lag, V5-tilpasning, undersider)
- `js/main.js`
- `assets/brand/` (godkendt logo)
- `assets/icons/` (favicon- og touchikoner)
- `assets/images/` (illustrative visuelle motiver)
- `assets/og/` (delingsbillede)
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, `.htaccess`, `_redirects`, `.nojekyll`

## Særlige valg
- `02 / Kompetencer`: fem informationskort, ingen klik/pop-up og ingen numre.
- `03 / Materialer`: tre primære + fem sekundære billeder med forskudte højder; PLA/PETG/ASA uden billeder.
- `06 / Kontakt`: kun kopiérbar e-mailadresse og liste over relevante oplysninger i en mail. Ingen lagring eller afsendelse.
- Brand: mørkt tema, messingaccent og originalt, godkendt logo. Oxanium er navngivet i display-CSS, men **ingen fontfil distribueres**; browseren bruger en lokal fallback, hvis Oxanium ikke er installeret.
- Fotos er genererede illustrationer, ikke dokumenterede kundeopgaver eller billeder af et eget værksted.

## Efter upload – nødvendig kontrol
Kontrollér HTTPS, korrekt HTTP 404 status, interne stier, cache, privatlivstekst ift. faktisk hosting, delingspreview på relevante platforme og kopiering af e-mail i både mobil og desktopbrowser.


## Metadata / SEO / Social
- Hjemmesiden bruger canonical URL: https://datumprototyping.dk/
- Open Graph og Twitter metadata peger på /assets/og/og-default.jpg (1200x630).
- Forsiden indeholder JSON-LD for WebSite og Person.
- robots.txt og sitemap.xml er inkluderet.
- 404 og privatliv er markeret som noindex.

## V5.0.3 / godkendt OG-billede
- Godkendt delingsbillede: `assets/og/datum-prototyping-og-v5-0-3.jpg` (1200 × 630 px JPEG).
- `og-default.jpg` er også opdateret som kompatibilitetskopi.
- De nye Open Graph- og Twitter-billedadresser bruger versionsbestemt filnavn, så tidligere delingscaches ikke låser sig til det gamle billede.
- Fungerende Open Graph-kort kræver, at sitet er offentligt tilgængeligt via HTTPS. Bekræft med en ekstern delingsvalidator efter upload.
- **Drift forudsætter** upload af indholdet af denne mappe til domænets webrod samt en server der respekterer valgte redirect/404-regler.
