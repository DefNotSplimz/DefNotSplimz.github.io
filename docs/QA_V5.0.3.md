# Datum Prototyping V5.0.3 – OG/SEO + regressionstest

## Ændringer fra V5.0.2
- Det godkendte OG-billede er integreret uden omkomprimering eller visuelle ændringer.
- Den versionerede OG-URL er `https://datumprototyping.dk/assets/og/datum-prototyping-og-v5-0-3.jpg`.
- `assets/og/og-default.jpg` er også opdateret som kompatibilitetskopi.
- `og:image`, `og:image:secure_url` og `twitter:image` peger alle på det nye billede.
- Alt-teksterne beskriver den valgte visuelle identitet.
- Det gamle V4.3-kommentarfelt i `index.html` er rettet til V5.0.3.

## Kontroller, der er gennemført
- Det nye OG-billede matcher den godkendte original **byte-for-byte** og er 1200 × 630 px JPEG.
- Metadatakontrol: `<title>`, description, canonical, Open Graph-felter, Twitter Card, JSON-LD, `robots` og sitemap: **bestået**.
- Alle lokale `src`/`href`-stier i HTML og `url(...)`-henvisninger i CSS: **eksisterer**.
- Offentliggjorte filer hentet på en lokal Python HTTP-server: `/`, `index.html`, `privatliv.html`, `404.html`, `robots.txt`, `sitemap.xml`, manifest og OG JPEG returnerede HTTP 200.
- `js/main.js` syntakskontrol: **bestået**.
- Isoleret browsergengivelse af samme HTML/CSS/JS/billeder ved **320, 360, 390, 768, 1024, 1440 og 1920 px**: ingen vandret overflow, manglende billeder eller registrerede JavaScript-fejl.
- Mobilmenu: åbne, navigere og lukke ved 390 og 768 px: **bestået**.
- Kopiering af mailadressen: **bestået** med synlig og tilgængelig statusfeedback.
- Navigation uden JavaScript på 390 px: **bestået**.
- Footerlogoets bredde/højde-forhold er bevaret på alle testede bredder.

## Begrænsninger / tjek efter upload
1. Testbrowseren nægter at åbne lokale `file://` og `localhost`-adresser. Den visuelle test blev derfor udført med indlejrede kopier af de faktiske lokale filer. Den lokale HTTP-server blev testet særskilt.
2. Apache/LiteSpeed `.htaccess`-regler, brugerens webhotel og reel HTTP 404-status er **ikke** verificeret på livehosten.
3. Facebook/LinkedIn/Discord kan cache previews. Den versionerede OG-fil reducerer risikoen, men **live crawlers kan ikke verificeres før offentliggørelse**.
4. Siden er ikke uploadet til `datumprototyping.dk`. HTTPS og offentligt adgang til OG-filen skal kontrolleres efter deployment.

## Upload
Upload **indholdet i mappen** `DatumPrototyping_V5.0.3_OG_Final/` til webroden, ikke selve mappen, så `/assets/og/datum-prototyping-og-v5-0-3.jpg` kan åbnes direkte via domænet.
