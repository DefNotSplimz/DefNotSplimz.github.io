# QA — Datum Prototyping V5.4 / CONTROLLED IMPACT

## Automatiske filkontroller

**26 / 26 bestået.** Kilde: `QA_static_v5.4.json`.

Omfatter HTML-struktur, unik ID, dansk sprog, seks afsnit, fem kompetencer, otte bearbejdningsmaterialer, tre billedfri FDM-materialer, manglende lokale filer, billed-alt-tekster, ankermål, offentlig OG-metadata, korrekt billedformat (1200 × 630), robots/sitemap, manifestikoner, noindex på privatliv/404, selvstændige CSS/JS-filer, syntaktisk korrekt JavaScript og CSP-hash for JSON-LD.

## Browsergengivelse

**13 skærmbredder:** 320, 360, 390, 430, 620, 768, 900, 1024, 1280, 1440, 1838, 1920, 2560 px.

- Ingen vandret dokument-overflow.
- Alle hero-tekstens tegn kan være inden for tilgængelig tekstbredde.
- Ingen JavaScript-fejl i testen.
- Ingen manglende billedfiler efter indlæsning.
- Mobilmenu åbner (aria-expanded=true) og lukker ved navigation (aria-expanded=false).
- Kopiér-knappen viser positiv status i browserkontrollen.
- Separat test med JavaScript frakoblet ved 390 px: seks afsnit og synlig navigation, uden vandret overflow.

**Testmetode:** Chromium kunne ikke navigere til lokale `file://`- eller `localhost`-adresser i miljøet. Testen anvendte derfor et isoleret HTML-dokument med indlejrede *eksakte byte-kopier* af releasefilerne (HTML, CSS, JS, billeder). Layout, billeder og interaktioner blev afprøvet i denne gengivelse. Denne test beviser ikke webhotellets HTTP-headers, caching, 404-status eller sociale previews.

## Kontrol efter upload

1. Bekræft HTTPS og at ukendt URL giver **HTTP 404** (ikke en succes-side med 404-tekst).
2. Test browsernavigation, mobilmenu, mailkopiering og zoom på den publicerede hjemmeside.
3. Åbn `robots.txt`, `sitemap.xml`, `privatliv.html` og OG-billedets URL offentligt.
4. Test Facebook/LinkedIn previews på live-URL; sociale caches kan kræve genindlæsning.
5. Undersøg webhotellets faktiske cookie- og serverlogopsætning, inden privatlivsteksten betragtes som endelig.
