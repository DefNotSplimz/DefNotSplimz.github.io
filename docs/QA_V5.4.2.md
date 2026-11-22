# QA — Datum Prototyping V5.4.2

## Reproduceret fejl
`404.html` og `privatliv.html` benyttede `/css/pages-v5.4.1.css` og `/assets/...`. Ved direkte filåbning (`file:///`) kan sådanne rod-relative URL'er pege uden for hjemmesidemappen. Det fremgår af brugerens screenshot som ustylet HTML og manglende billeder.

## Rettelse
- Indlejret sidernes komplette CSS i hver HTML-fil.
- Indlejret de nødvendige billeder (logo, baggrund og favicon) som billeddata.
- Bevaret eksternt CSS-link som serverfallback.
- CSP tilrettet med præcise SHA-256-hashes for sidernes indlejrede CSS og lokale link-hjælper.
- Ved lokal filåbning konverterer en lille hjælper forside-/kontaktlinks til `index.html` og `index.html#kontakt`. På domænet bevares absolute rodlinks.
- ZIP er flat-pakket med `index.html`, `.htaccess`, `css/`, `js/`, `assets/`, `404.html` og `privatliv.html` direkte i ZIP-rod.

## Kontroller
- 18 browsergengivelser: begge sider ved 320, 360, 390, 620, 768, 1024, 1440, 1838 og 2560 px.
- Browseren indlæste den fulde ændrede HTML fra filen, med ekstern CSS deaktiveret. Ingen CSS, billeder eller scripts blev injiceret af testen. Browseren modtog en meta-CSP svarende til serverens CSP (undtagen `frame-ancestors`, som ikke understøttes i meta).
- Ingen manglende billeder, vandret overflow, CSP-styleblokering eller JavaScript-fejl.
- 404-siden blev også testet uden JavaScript; logo, baggrund og CSS blev gengivet.
- ZIP-struktur og krævede filstier er kontrolleret.

## Begrænsning
Denne testbrowser blokerer direkte `file://`-navigation og localhost-HTTP, så **hverken direkte filåbning eller en ægte server-404-respons** kunne testes ende-til-ende. Testen verificerede i stedet, at CSS og billedaktiver er indlejret i HTML og gengiver korrekt uden eksterne ressourcer. Den offentlige hosting skal fortsat verificeres efter upload, inklusive at en ugyldig URL svarer med HTTP 404.
