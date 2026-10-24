# DATUM PROTOTYPING — V3.5 KVALITETSKONTROL

## Omfang
Kosmetisk og responsiv gennemgang af `index.html` og `privatliv.html`, med fokus på typografi, afstande, justering, små labels, navigation, formular og materialevælger. Godkendt logo, billeder, farvepalette, punchline og funktionalitet er bevaret.

## Justeringer
- Overskriftshierarki: optisk justeret bogstavmellemrum, linjeafstand og punktummets luft.
- Hero og sektionsoverskrifter: mere ensartet vertikal rytme.
- Metodevælger og dossier: alignment, linjeskift og klikflader.
- R&D/idéfasen, præcisionssektion, materialer og Om: konsistente spacing-regler.
- Materialevalg på mobil: tre responsivt lige brede faner uden vandret sidescroll.
- Lang overskrift under Om: skalerer ned på meget smalle mobiler i stedet for at løbe ud over siden.
- Formular: ens afstande og kontaktknapper i 44px+ højde.
- Footer og privatlivspolitik: linkfarver, linjeafstand og balanceret opsætning.
- Ankerlinks tager højde for fast navigation.

## Automatisk testet
- Skærmbredder: 1440, 1100, 820, 390 og 320 px.
- Ingen vandret sidescroll på disse bredder.
- Ingen JavaScript-sidefejl i de gennemførte interaktionstests.
- Det første CNC-fræsningsbillede er indlæst fra start.
- Metodeskift, udviklingsfase, materialevalg og projektbrief fungerer i browserkontrollen.
- Projektbrief viser fortsat `KOPIÉR E-MAIL` og `KOPIÉR TEKST`.
- Mobilmenu åbner og lukker.
- Privatlivssiden har samme farvesystem og ingen vandret overflow ved 390 px.
- Alle lokale `src`/`href`/CSS-billedstier findes; JS-syntaks og CSS-parsing kontrolleret.

## Ved offentliggørelse
Test også på det rigtige domæne i Safari, Chrome og Firefox samt eksterne ressourcer, e-mailkopiering og delingsbillede over HTTPS. Privatlivspolitikkens juridiske og driftsmæssige oplysninger kræver fortsat verificering inden lancering.
