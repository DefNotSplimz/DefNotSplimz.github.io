# Datum Prototyping V4.0 · Uploadcheckliste

## Kontrolleret før levering

- [x] `index.html`, `404.html`, `privatliv.html` og alle fem standarders HTML kan parses.
- [x] Ingen ugyldige lokale `href`/`src`-referencer, `srcset`-filer eller CSS-ressource-URL'er fundet i gennemgangen.
- [x] Alle JavaScript-filer består Node-syntakstjek.
- [x] JSON-presets kan parses og er mærket som ikke-uafhængigt-verificerede.
- [x] PNG/JPG/WEBP/ICO og SVG blev kontrolleret for læsbar filstruktur.
- [x] Mobilmenu, åbning/lukning af alle tre projektcases ved 390, 768 og 1440 px.
- [x] Billedvalg i Ring Bender-casen.
- [x] FAI, setup, proces, kontrol og traveler valg i generator.
- [x] Eksport af JSON og selvstændig HTML, import af ældre FAI-data.
- [x] Manglende måling forbliver afventende; uden for tolerance giver HOLD.
- [x] Generatorens eksporterede HTML er konverteret til A4 PDF uden frigivelsesfejl.
- [x] Fem printblanketter: alle **én A4-side** (setup i landskab).
- [x] Eksisterende projektdokumenter: tre A4-FAI’er á én side og ét setup sheet á to A4-landskabssider.
- [x] CNAME, robots og sitemap med eksisterende domæne bevaret.

## Manuelt efter upload på live-domain (ikke muligt at verificere her)

- [ ] Åbn `https://datumprototyping.dk/` på desktop og mobil.
- [ ] Kontroller **Chakra Petch** og øvrige skrifttyper med netværksadgang.
- [ ] Åbn alle tre projekter, galleri og tilhørende FAI-/setup-dokumenter.
- [ ] Åbn `studio/index.html`, opret et nyt FAI og print som PDF.
- [ ] Tjek retur-/ankernavigation, kontaktformularens e-mailgenerator og `mailto:`.
- [ ] Tjek navigation, ikon, privatlivsside, 404-side, socialt delingsbillede, DNS/HTTPS og crawlbarhed.
- [ ] Verificér historiske FAI-måledata mod originale måleprotokoller, inden de bruges som produktionsfrigivelse.

## Deploy

Upload **ZIP-filens indhold**, ikke ZIP-mappen som et ekstra niveau. For GitHub Pages skal `index.html` og `CNAME` ligge i repository-/deploy-roden. Alle `assets/`, `css/`, `js/`, `documents/`, `standards/` og `studio/` mapper skal bevares med samme relative stier.
