# QA — V3.5.6 / Precision Desk

## Gennemført
- JS-syntaks: `main.js` og `precision.js` kontrolleret uden syntaksfejl.
- Lokale asset-referencer i HTML og CSS kontrolleret, ingen manglende lokale filer.
- Ny sektion testet isoleret i Chromium på 1440, 820, 390 og 320 px. Ingen vandret overflow eller JS-fejl i disse tests.
- Alle fire valg testet for korrekt indhold og `aria-pressed`-status.
- Kontaktgenvej testet for overførsel af valgt fokus til projektkontekst. Kontrolleret i isoleret testmiljø med tilknyttede formfelter.
- Ingen ændringer i eksisterende logo, billeder, privatlivsside eller formularens to kopieringsknapper.

## Begrænsning
Automatiseret direkte browserindlæsning af den fulde projektmappe blev blokeret af testmiljøets netværksregler. En isoleret HTML-udgave af de ændrede sektioner blev testet, men hele hjemmesidens samlede flow bør testes i dit rigtige hostingmiljø. Test også den store selvstændige HTML-demo manuelt.
