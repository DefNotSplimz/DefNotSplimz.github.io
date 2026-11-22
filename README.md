# Datum Prototyping — V5.4 / CONTROLLED IMPACT

**Komplet statisk hjemmeside** — dansk, responsiv, uden formularer, cookies, tracking eller backend.

## Publicering

1. Pak ZIP-filen ud.
2. Upload **indholdet** af mappen `DatumPrototyping_V5.4_CONTROLLED_IMPACT/` til dit domænes webrod (ofte `public_html` eller tilsvarende). Undlad at placere selve mappen som et ekstra undermappeniveau.
3. Kontrollér `https://datumprototyping.dk/`, `https://datumprototyping.dk/privatliv.html`, `https://datumprototyping.dk/robots.txt`, `https://datumprototyping.dk/sitemap.xml`, `https://datumprototyping.dk/assets/og/datum-prototyping-og-v5-0-3.jpg` og en ugyldig sti.
4. Test mobilmenu, anker-navigation og knappen **KOPIÉR** til e-mailadressen på den offentlige side.

**Hosting:** `.htaccess` er målrettet Apache/LiteSpeed. `_redirects` giver 404-routing på kompatible statiske platforme. Andre webservere skal konfigureres separat for at give korrekt HTTP 404-status. HTTPS og serverens eventuelle logning styres af webhotellet.

## Design

- Nyt samlet designsystem med mørke materialer, varme messingdetaljer og stærk billedkomposition.
- Hero: en beskadiget del med den godkendte punchline **DIT PROBLEM. MIN UDFORDRING.**
- Fem kompetencefelter, tre primære og fem øvrige materialer samt **billedfri** FDM-materialer (PLA, PETG, ASA).
- Visuel proces: problem → analyse → mulig løsning. Billeder er illustrative, ikke kundecases.
- Personlig præsentation uden at hævde ejerskab over maskiner eller eget værksted.
- E-mailkontakt med vejledning og kopieringsfunktion, men ingen formular eller dataindsamling.

## Filer

- `index.html` — startside med meta, Open Graph, Twitter og JSON-LD.
- `css/site-v5.4.css` — alle layoutregler; inkluderer mobil, fokusmarkering og reduceret bevægelse.
- `js/site-v5.4.js` — mobilmenu, e-mailkopiering, scrollindikator, navigation og robust skriftstørrelsestilpasning.
- `assets/brand/` — det godkendte Datum-lockup samt messingfarvet DP-symbol.
- `assets/images/` — lokale, optimerede WebP-billeder og teknisk SVG-illustration.
- `assets/icons/` — tilpassede favicon- og appikoner i **hvid/messing**.
- `assets/og/` — det tidligere godkendte OG-billede, uændret.
- `privatliv.html`, `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `.htaccess`, `_redirects`.
- `docs/` — lokale previewbilleder og QA-noter.

## Vigtig funktionalitet

Siden har **ikke** en kontaktformular. Kopiér-knappen benytter Clipboard API med lokal fallback; brugeren selv sender e-mail. Hvis JavaScript er deaktiveret, er indhold og navigationslinks stadig synlige.

## Tekniske begrænsninger

- Systemskrifttyper bruges, så udseendet kan variere lidt på forskellige platforme. Der leveres ingen eksterne webfonts.
- Browserbilleder til `docs/` er lavet af en isoleret gengivelse af de nøjagtige HTML/CSS/JS- og billedfiler, da denne QA-browser ikke kan navigere til lokale fil- eller localhost-adresser.
- Den endelige kontrol af Apache 404-status, cache og offentlige sociale previews skal udføres efter publicering.
