# Datum Prototyping · Brandpakke

Retegnet vektorversion af det valgte koncept nr. 3: mikrometer, delvist tandhjul og orange buer. Geometri og typografi er forenklet fra billedskitsen; dette er ikke en automatisk sporing af den oprindelige illustration.

Åbn `brand-guide.html` for oversigt og anvendelse.

## Filer

- `logos/`: vandrette og stablede logoer, hver i farve til mørk/lys baggrund og ensfarvet hvid/sort. SVG og transparente PNG.
- `symbols/`: selvstændigt symbol i de samme fire farveversioner.
- `web/`: SVG-favicon, ICO, PNG i 16/32/48 px, Apple Touch Icon 180 px, webikoner 192/512 px, manifest og CSS-farver.
- `social/`: delingsbillede 1200 × 630 px og profilbillede 1024 × 1024 px.
- `workwear/`: forenklet ensfarvet symbol og stablet logo, sort/hvid, SVG og PNG.
- `source/`: original konceptreference og vektorernes typografikurver samt byggescript fra arbejdsrummet.

SVG er den foretrukne webfil. Bogstaverne er kurver; modtageren behøver ikke installere en skrifttype. PNG har transparent baggrund undtagen favicons, profil- og delingsbilleder. `on-dark` betyder lyst logo til mørk baggrund. `on-light` betyder mørkt logo til lys baggrund.

## Placering på hjemmesiden

Kopiér hele denne mappe til hjemmesidens `brand/`-mappe. Bevar filernes undermapper. Brug fx:

```html
<img class="datum-logo" src="/brand/logos/horizontal-on-dark.svg"
     width="1080" height="330" alt="Datum Prototyping">
<link rel="icon" href="/brand/web/favicon.ico" sizes="any">
<link rel="icon" href="/brand/web/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/brand/web/apple-touch-icon.png">
<link rel="manifest" href="/brand/web/site.webmanifest">
<meta property="og:image" content="https://datumprototyping.dk/brand/social/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Datum Prototyping – mikrometer og tandhjul">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://datumprototyping.dk/brand/social/og-image.png">
```

Manifestets ikonstier er relative til manifestet. Det installerer ikke offline-funktionalitet. Ved hosting under en undermappe skal webstier tilpasses. Pakken er ikke indsat i eller publiceret på hjemmesiden.

## Farver og luft

Orange `#FF6536`, mørk `#17232A`, varm hvid `#F5F3ED`, stålgrå `#B7C1C7`.

Hold mindst en halv mikrometer-rammetykkelses luft omkring logoet. Bevar proportionerne; ingen ekstra skygger, konturer eller gradienter. Brug fuldt logo fra cirka 240 px bredde vandret / 200 px stablet. Under dette bruges symbolet. Favicons bruger en mørk baggrund, så de fungerer i både lyse og mørke browserfaner.

## Arbejdstøj

Send SVG-filerne fra `workwear/` til leverandøren. De er forenklede tegninger til videre produktion, ikke færdige broderifiler (DST/PES). Leverandøren skal digitalisere sting, fastlægge minimumsstørrelse og lave en broderiprøve på det valgte stof. Start med at vurdere symbol i 60–80 mm bredde og fuldt logo i 100–120 mm; dette er forslag, ikke en garanteret produktionsgrænse. Brug den sorte/hvide variant til ensfarvet tryk. Ingen CMYK- eller Pantone-match er fastlagt.
