# Datum Prototyping — v8.3 Final Production QA

## Resultat

**0 åbne QA-fejl.**

Denne version er et produktions-pass oven på v8.2.1. Der er ikke lavet et nyt visuelt redesign; fokus har været på konsistens, responsiv robusthed, accessibility, dokumentintegration, SEO/social metadata og performance.

## Rettet i v8.3

- Projekt-popups åbner nu FAI og Setup Sheet direkte som de færdige PDF-dokumenter.
- FAI/Setup HTML-kilder er beholdt til print/redigering, men markeret `noindex,follow` og fjernet fra sitemap.
- Sitemap indeholder kun den kanoniske forside.
- Nyt Open Graph-billede matcher den nuværende visuelle retning og er markeret `PROCESVISUALISERING`.
- Open Graph/Twitter metadata er komplet med 1200×630 dimensioner.
- Minimal Organization JSON-LD er tilføjet uden opdigtede virksomhedsdata.
- Alle hjemmesidebilleder har eksplicit bredde/højde for at begrænse layout shift.
- Der er lavet 600 px responsive WebP-varianter oven på de eksisterende 900 px/full-size billeder.
- Hero preload bruger nu samme responsive image ladder som selve hero-billedet.
- Under-fold billeder er lazy-loaded; projekt-popupens hero prioriteres først, øvrige popupbilleder lazy-loades.
- Service- og projektvisualiseringer har diskret synlig provenance-label.
- Kontaktformularen forklarer nu tydeligt, at en valgt fil skal vedhæftes manuelt i mailen.
- Fokusmarkeringer og invalid-state er gjort tydelige for tastaturbrugere.
- Mobilmenuens JS-breakpoint er rettet fra 981 px til 901 px, så det matcher CSS og undgår scroll-lock/inert ved 901–980 px.
- Aktiv desktop-navigation ekskluderer CTA-knappen.
- Gammel stylesheet-versionering er fjernet; produktionen bruger `css/site.css`.
- Historiske release-notes og ubrugt CSS er fjernet fra selve produktionspakken.
- Ingen aktive cast shadows/text shadows er tilbage i website-CSS.

## Dokumentkontrol

- `fai-01.pdf` — 1 side — 595.276 x 841.89 pts (A4)
- `fai-02-camdisc.pdf` — 1 side — 595.276 x 841.89 pts (A4)
- `fai-03-flywheel.pdf` — 1 side — 595.276 x 841.89 pts (A4)
- `setup-tactable.pdf` — 2 sider — 595.276 x 841.89 pts (A4)

## Automatiske checks

- PASS — Homepage documents open PDFs directly
- PASS — Clipboard contact flow retained
- PASS — Generated visual provenance visible
- PASS — Responsive 600/900/full image ladder
- PASS — Sitemap contains no document pages
- PASS — Source document HTML is noindex
- PASS — Mobile JS breakpoint matches CSS
- PASS — Old CTAs removed
- PASS — New social image metadata

- PASS — lokale HTML/CSS/JS-referencer
- PASS — duplicate ID-kontrol
- PASS — image alt + width/height-kontrol
- PASS — formular-labels
- PASS — CSS parse
- PASS — JavaScript syntax (`node --check`)

## Performance snapshot

- Produktionspakke: 6.51 MB før ZIP.
- Største billedasset: 222.7 KB (`assets/tac-table-alt-02.webp`).
- Hero kan leveres som 600 / 900 / full-size WebP afhængigt af viewport.
- Alt under folden er lazy-loadet, hvor det giver mening.

## Responsive audit

Layoutet er kodet til følgende reelle skift:
- Desktop: >1100 px
- Compact desktop/tablet: 901–1100 px
- Mobilnavigation / stacked layout: ≤900 px
- Small mobile: ≤620 px
- Project viewer: ≤900 px og ≤520 px

Den tidligere JS/CSS-mismatch omkring 901–980 px er rettet. Ingen faste elementbredder i mobilreglerne overstiger viewporten.

## Efter upload

Lav ét live smoke-test på `datumprototyping.dk` for HTTPS, canonical URL, www/non-www redirect, cache headers og clipboard-permission. De ting afhænger af hostens konfiguration og kan ikke fastlåses i den statiske pakke.
