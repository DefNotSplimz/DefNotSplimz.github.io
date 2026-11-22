# Datum Prototyping V5.4.1 – Testprotokol

## Ændringer
- Fem diskrete messingfarvede kapitelovergange tilføjet mellem forsiden seks sektioner.
- 404-side fuldstændigt redesignet med genbrug af lokal hero-fotografi, navigationslinks og korrekt branding.
- Privatlivsside redesignet med billedhero, fire læsbare emneafsnit og eksisterende faktuelle formuleringer.
- Ingen nye formularer, eksterne ressourcer, cookies eller tracking.

## Kontroller
- **30 responsive browsergengivelser:** Forside, 404 og privatliv på 320, 360, 390, 620, 768, 900, 1024, 1440, 1838 og 2560 px.
- Manglende billeder: **0**. Vandret overflow: **0**. JavaScript-fejl: **0**.
- Mobilmenu: åbner og lukker ved navigation.
- Mailkopiering: gav status "Mailadressen er kopieret." i isoleret test.
- Uden JavaScript: forsiden, indhold og navigation er synlige.
- Reduceret bevægelse: overgange er slået fra.
- Lokale ressourcer og SVG/PNG/WEBP: filstier kontrolleret.
- HTML: en enkelt H1 pr. side. Noindex på privatliv og 404.
- OG-billede, sitemap, robots.txt og CSP-hash til JSON-LD: kontrolleret.
- Node.js-kontrol af JavaScript-syntaks: bestået.

**Browserbegrænsning:** Testbrowseren blokerer direkte localhost/file-URL. Gengivelserne er derfor udført af det faktiske lokale HTML/CSS/JS og de lokale billedbytes i en isoleret offline-side. Selve HTTPS-, HTTP 404-status- og hostingopsætningen kan kun kontrolleres efter upload.

## Oversigter
- `404-1440.png`, `404-390.png`
- `privacy-1440.png`, `privacy-390.png`
- `homepage-desktop-1440.jpg`, `homepage-mobile-390.jpg`
- `qa-results.json` – browsermålinger

## Uafklaret hos webhost
- Apache/LiteSpeed skal respektere `.htaccess` med `ErrorDocument 404 /404.html`, eller hostingen skal konfigurere tilsvarende rigtigt 404-response.
- Tjek HTTPS og eksterne sociale previews på live-domænet.
