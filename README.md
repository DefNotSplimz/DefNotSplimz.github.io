# Datum Prototyping V5.4.2 — 404/privatliv bugfix

## Fejlen
404 og privatliv indlæste designet via `/css/pages-v5.4.1.css` og billeder via `/assets/...`.
Ved direkte åbning af HTML-filer (`file:///`) eller fejlopsatte undermappestier virkede disse ikke.
Tidligere browser-QA indlejrede aktiver under test og fangede dermed ikke denne fejl.

## Rettelse
- 404.html og privatliv.html har nu **indre CSS og indlejrede logo/fotos**, så de virker som selvstændige HTML-filer uden netadgang.
- Den almindelige stylesheet-sti er bevaret som supplerende mulighed på serveren.
- Absolutte forsidelinks til `/` bevares på serveren, mens en lille lokal HTML-hjælper omdirigerer dem til `index.html` ved `file:///`-test.
- Apache/LiteSpeed CSP opdateret med præcise SHA-256-hashes, uden `unsafe-inline`.
- Den øvrige hjemmeside, SEO/OG, materiale- og kompetenceafsnit er bevaret fra V5.4.1.

## Upload
**ZIP-filen er FLAD:** `index.html`, `404.html`, `privatliv.html`, `.htaccess`, `css/`, `js/` og `assets/` ligger i ZIP-roden.
Upload **alle disse filer og mapper til domænets webrod**, ikke en ekstra overmappe.
Kontrollér at `.htaccess` også uploades på Apache/LiteSpeed.

## Kontrol
- Dobbeltklik på `404.html` og `privatliv.html` lokalt: layout og billeder skal vises.
- Test `https://datumprototyping.dk/404.html` og `/privatliv.html` efter upload.
- Test en helt ugyldig adresse, fx `/findes-ikke/ekstra`, og kontrollér at den svarer med HTTP 404 og viser det designede indhold.
- Hvis webhotellet bruger andet end Apache/LiteSpeed, skal brugerdefineret 404-respons evt. konfigureres på værten.
- HTTPS og live-serverens respons kan ikke garanteres af lokale tests.
