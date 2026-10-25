# Datum Prototyping – kontrol af personlig navnebrug

Grundlag: Den hjemmeside, der blev leveret i den uploadede RAR-fil.

## Udførte ændringer
- `index.html`: Navnekortet under “Hvem er Datum Prototyping?” viser nu **GLEN.** i stedet for et navn fordelt over to linjer.
- `assets/js/main-v358.js`: Den interaktive “Personen”-fane viser nu **Glen**.
- `assets/js/main.js`: Samme rettelse i den sekundære JavaScript-kopi.
- `CHANGELOG_V3.5.7.md`: Historisk beskrivelse omtaler nu kun **Glen**.

## Kontrol
- Gennemgang af de aktive HTML-filer, begge udgaver af JavaScript, CSS, metadata, sitemap, manifest, README og changelogs.
- Søgning efter både fuldt navn og efternavnsdele i alle relevante tekstbaserede filer: Ingen fund i den færdige pakke.
- Øvrige oplysninger og firmanavnet **Datum Prototyping** er bevaret.
- Billeder, scripts og stylesheets er med; `.git`-historikken er bevidst ikke med i den uploadbare projektpakke.

## Upload
Upload alle filer og mapper fra pakken samlet til din eksisterende webrod. JavaScript-filen `assets/js/main-v358.js` skal følge med, ellers kan den tidligere værdi fortsat vises i “Personen”-fanen. Udskift ikke kun `index.html`.
