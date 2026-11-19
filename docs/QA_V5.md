# Datum Prototyping V5 – teknisk kontrolliste

## Gennemført i isoleret browsermiljø
- HTML, CSS og JavaScript er adskilt; ingen inline `<style>` eller inline `<script>` i `index.html`.
- Ingen formularer, login, kontaktoplysninger sendt via hjemmesidens JavaScript eller eksternt indlæste scripts.
- Seks hovedafsnit på forsiden, fem ikke-klikbare kompetencekort, otte materialekort og tre tekstbaserede FDM-kort.
- Alle lokale HTML-referencer til billeder, CSS, JavaScript og favicon er kontrolleret for eksisterende filer.
- JavaScript syntakstjek med `node --check` bestået.
- Browser-rendering ved 320, 360, 390, 768, 1024, 1440 og 1920 px uden vandret overflow og JavaScript-fejl.
- Mobilmenu åbner/lukker ved klik og navigation; kopiér-mailfunktionen giver korrekt feedback i test.
- Alle billedaktiver kan indlæses og afkodes i isoleret render.
- Kortene i Øvrige materialer har forskudte højder på desktop og mobil.

## Skal verificeres på livehosting
- HTTPS og certifikat.
- `404.html` leveres med reel HTTP 404-status; `.htaccess` gælder kun Apache/LiteSpeed. Netlify kan bruge `_redirects`.
- Delingspreview for https://datumprototyping.dk/assets/og/og-default.jpg.
- Gennemgå privatlivstekst op imod faktisk hostings driftslogs og øvrige behandling.
- Test klipbord på fysiske iOS/Android/desktopbrowsere og tastaturnavigation i praksis.

## Kendt forskel fra brandmaster
Den præcise Oxanium-familie følger ikke som fontfil i denne pakke; dynamisk overskriftstekst bruger en eksplicit fallback hvor Oxanium ikke er installeret. Det godkendte Datum-logo er bevaret som billedaktiv.
