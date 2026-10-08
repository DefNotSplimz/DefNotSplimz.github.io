# Datum Prototyping Website v3.1.4

Direction 01 + Brand v3.1.

This build is the full-site QA/hardening release after the v3.1.3 SEO pass and v3.1.3.1 footer hotfix.

## Primary runtime files
- `index.html`
- `direction01-v314.css`
- `site-v314.js`
- `project-v314.css`
- `error-v314.css`
- `documents/document-v312.css`
- `documents/document-v311.css`
- `documents/dossier.css`
- `documents/documents.js`

## Brand / web assets
- UI logo: `brand/02_WEB/datum-v3.1-ui-logo.webp`
- Favicons and app icons: `brand/02_WEB/`
- Full brand package: `brand/`

## QA
See `QA_v3.1.4.json`.

The release checks:
- local links and assets
- anchors and DOM IDs
- image intrinsic dimensions
- forms and labels
- CSS parsing
- JavaScript syntax
- SEO / Open Graph / Twitter metadata
- JSON-LD
- sitemap parity
- web manifest icons
- email signature asset path
- technical-document print rendering

## Deployment
Upload the contents of this folder to the site root for `datumprototyping.dk`.
`CNAME`, `robots.txt`, `sitemap.xml` and `site.webmanifest` are included.
