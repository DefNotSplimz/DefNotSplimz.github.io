# Datum Prototyping v3.5.8 / CSS & JS version correction

## Hvorfor?
Screenshots fra v3.5.7 viste nye komponenter (Muligheder-kort og Process Workbench) uden deres typografi, grid og farver. I den komplette v3.5.7-projektpakke findes de relevante CSS-regler, og de vises korrekt med de aktuelle styles. Det tyder på at HTML og CSS/JS med forskellige versioner blev indlæst sammen, eksempelvis fra browsercache eller en delvist opdateret server. Det er ikke muligt at fastslå den præcise årsag uden netværksloggen fra det miljø, hvor fejlen blev observeret.

## Ændringer
- index.html og privatliv.html refererer nu til **nye fysiske filnavne**, ikke gamle cachede stier.
- assets/css/style-v358.css
- assets/css/precision-v358.css
- assets/js/main-v358.js
- assets/js/precision-v358.js
- assets/js/privacy-v358.js
- De gamle, enslydende asset-navne er ikke med i V3.5.8, så de ikke ved en fejl blandes ind i en ny installation.
- Design, billeder, indhold og formularflow er bevaret fra V3.5.7.

## SÅDAN UDGIVES DEN KORREKT
1. Pak ZIP-filen ud og upload **hele indholdet af DATUM_Prototyping_Website_v3.5.8** til webroden. Ikke kun index.html.
2. Kontrollér at filerne ovenfor eksisterer på serveren med de præcise navne, inkl. store/små bogstaver.
3. Kontrollér at `https://datumprototyping.dk/assets/css/style-v358.css` og `https://datumprototyping.dk/assets/js/main-v358.js` ikke giver 404.
4. Genindlæs hjemmesiden. Ryd evt. server-/CDN-cache, hvis der stadig ses gammelt indhold.
5. Efter opdatering skal 02 / Muligheder vise et trekolonne-kortlayout på desktop og 02 / Tilgangen vise tre procestaster og mørkt procespanel. Hvis de stadig ser ud som ren tekst, undersøg DevTools > Network for 404, 403 eller forkert MIME-type.

## Lokal afprøvning
Åbn index.html fra den udpakkede mappe. Ved upload er det en fordel at teste på et HTTP(S)-domæne, da nogle browsere begrænser funktioner under file://.

## Afgrænsning
Denne opdatering er en fil-/cacheintegritetsrettelse og ikke et redesign. Der er ikke foretaget ændringer i de juridiske eller tekniske kapacitetsudsagn.
