# Datum Prototyping · Website V4.0

**Status:** Klar til upload på statisk hosting. Bygget oven på V3.9, med V3.8.6-layoutet som fundament. V4.0 ændrer projektvisninger, dokumentgenerator og dokumentstandarder; slogan og eksisterende brandretning er bevaret.

## Start

- Åbn `index.html` på en lokal webserver eller publicér alle filerne i roden af din statiske hosting.
- Åbn en projektcase via kortet **Flame Eater**, **Ring Bender** eller **Tac Table**.
- Åbn `studio/index.html` for **Datum Document Studio** og printklar dokumentgenerering.
- Åbn en blank standard i `standards/`, eller hent den tilsvarende PDF direkte fra studio.

## V4.0 indeholder

**Projektcases:** Ny case-header, projektnummer, tekniske metadata, fotos, billedvælger på Ring Bender/Tac Table, understøttede dokumentlinks og genvej til Document Studio. De eksisterende projektskabeloner og modal-navigation bruges stadig.

**Document Studio:** Fem dokumenttyper i en klientbaseret generator: FAI, setup sheet, procesark, kontrolark og job traveler. Redigér oplysninger, tilføj/fjern rækker, se forhåndsvisning, print/gem PDF, eksporter selvstændig HTML, eksporter/importer JSON, og gem lokalt i den aktuelle browser.

**Printstandarder:** Tomme A4-dokumenter under `standards/` i både HTML og PDF. FAI, proces, kontrol og traveler er A4 portræt; setup er A4 landskab.

**Tidligere projektark:** `documents/` indeholder tre FAI'er til Flame Eater og det eksisterende todelte Tac Table-setup sheet. PDF-udgaverne er genereret igen fra deres tilhørende HTML med gældende CSS. Eksisterende registrerede projektmålinger er bevaret.

**Importable arkivdata:** Under `studio/presets/` findes JSON fra de tidligere FAI'er og Tac Table-værktøjslisten. De er **ikke uafhængigt verificerede** og importeres uden automatisk godkendelse. Kontroller tegningsrevision, specifikationer, målinger og måleinstrumenter før anvendelse.

## Kontrolsikkerhed

- Manglende måling → **AFVENTER**.
- Ugyldigt tal/grænsepar → **UGYLDIGT MÅLEGRUNDLAG**.
- Måling uden for min./maks. → **AFVIGELSE / HOLD**.
- Måling inden for min./maks. → **INDENFOR**, men det er **ikke** lig med frigivelse.
- Frigivelse kræver dokumenteret kontrol og ansvarlig signatur uden for generatorens automatiske status. En browserformular er ikke et akkrediteret kvalitetssystem.

## Upload og hosting

Siden er statisk og kræver ikke database, build-tool, Node-server eller backend. `CNAME` er bevaret for `datumprototyping.dk`. Udpak ZIP-filen, og upload **alle filer og mapper fra ZIP-filens rod**. `index.html` skal ligge direkte i webroden.

**Efter upload:** Kontrollér font-indlæsning (Google Fonts), begge modalformater, alle dokumentlinks, Document Studio-eksport, PDF-print, mailto-funktion, mobilmenu og ikoner direkte på live-domænet. Lokale tests erstatter ikke et testbesøg på produktionshosting.

## V4.0 QA

QA er kørt mod filernes HTML, CSS, JS, billeder, PDF'er og interne links. Browserfunktioner er testet ved 390, 768 og 1440 px på lokalt indlæst, asset-inline rendering. Alle fem standarder er printet til PDF og kontrolleret for A4-sideformat og ikke-tomme sider. De eksisterende ark er konverteret igen til PDF og kontrolleret for sidetal. **Begrænsning:** Live hosting og fontleverandørernes eksterne forbindelser er ikke verificeret.

Se `UPLOAD-CHECKLIST.md` for komplet checkliste.
