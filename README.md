# Datum Prototyping — lokal gennemgang

Denne mappe er den samlede lokale version. Den er ikke udgivet. Den tidligere Sites-version og GitHub-projektet er ikke ændret af denne gennemgang.

## Indhold

- `index.html`, `style.css`, `app.js`: siden, designet og funktionerne.
- `brand/`: det leverede logo og favicon.
- `images/`: optimerede billeder til portrætter, projekter og procesgalleri.
- `documents/`: de tre FAI-rapporter og Tac Tables setup sheet.
- `documents/images/`: dokumenternes originale tegninger og rendering.

Åbn `index.html` i en browser eller servér hele mappen via en lokal webserver. Kontaktgeneratoren fungerer uden en afsendelsestjeneste. Browserens udklipsholder kræver normalt localhost eller HTTPS; ellers markeres teksten til manuel kopiering. Download som tekstfil er også tilgængelig.

## Ændringer

- Ensartede projektvinduer med billeder, materiale, proces, udfordring, løsning og dokumentlinks.
- Flame Eater Engine har links til FAI 01, 02 og 03. Tac Table har sit setup sheet.
- Kontaktgenerator med seks opgavetyper, materiale, antal, levering, grundlag og valgfri kontaktinformation. Teksten genereres på knaptryk og kan redigeres, kopieres eller hentes som .txt. Intet sendes automatisk eller gemmes i browserlager.
- Mobilmenu, større trykflader, tilpasset typografi, dialoger med egen rulning og fast luk-knap. Escape lukker, og fokus vender tilbage til projektknappen.
- Billederne viser hele projekterne og portrættet. De fem store AI-billeder er konverteret til WebP fra ca. 10,5 MB til 0,56 MB samlet.
- Procesgalleriet bruger renderinger og kontrolfoto fra det eksisterende GitHub-projekt i stedet for udsnit af referencebilledet.
- Dokumenternes indhold og måleværdier er bevaret fra kildefilerne; deres layout er tilpasset skærm og udskrift. Brede tabeller kan rulles vandret på mobil.

## Verifikation

Automatiseret browsertest i Chrome ved 320, 390, 768, 1024 og 1440 px: ingen vandret side-overflow. Alle tre projektvinduer kontrolleret ved hver bredde, korrekt antal dokumentlinks og fokusretur efter Escape. Alle seks skabelontyper, redigeret download, kopiering og besked om ændrede valg kontrolleret. Alle fire dokumenter åbner uden manglende billeder. Siden kontrolleret med 200 % tekststørrelse.

Visningerne er testet i browser med simulerede skærmstørrelser, ikke på fysiske telefoner. Google Fonts kræver internet; siden har lokale systemskrifter som fallback. Tekniske måleværdier i de leverede rapporter er ikke genmålt eller fagligt certificeret i denne gennemgang.

## Senere udgivelse

Upload hele denne mappe som én samlet statisk side, når udgivelse bliver aftalt. Der er ingen serverdel eller automatisk e-mailafsendelse. Bevar relative stier, så dokumenter, billeder og logo følger med.
