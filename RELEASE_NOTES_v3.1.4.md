# Datum Prototyping v3.1.4 — Full Site QA + Hardening

## What was audited
The complete website package was checked across the homepage, all three project case studies, all FAI/setup documents, the professional dossier, the 404 page, SEO assets, manifest, sitemap, email signature, CSS and JavaScript.

## Fixes

### Layout / imagery
- Corrected all raster `<img>` intrinsic width/height values to the real file dimensions.
- This includes the homepage hero and the project/404 brand logos, where old dimensions had the wrong aspect ratio.
- Added intrinsic dimensions to SVG document graphics.
- Kept the v3.1.3.1 footer fix and added final responsive hardening.
- Added a global safe `height:auto` baseline for ordinary images while preserving explicit cover-image rules.

### Brand assets / performance
- Added an exact downscaled lossless v3.1 UI logo: `brand/02_WEB/datum-v3.1-ui-logo.webp`.
- The web UI logo is ~90% smaller than the full master PNG while retaining the approved brand artwork.
- Homepage/project/document navigation now uses the optimized UI asset.
- Print documents still use the clean flat vector artwork.

### Project navigation
- Homepage project cards now navigate directly to the dedicated case-study pages.
- Removed the legacy click interception that opened duplicate project content in a modal.
- The dedicated pages are now the actual primary project experience, matching their SEO/canonical structure.

### CSS / JavaScript
- Project CSS was bundled from 11 requests down to 1 (`project-v314.css`) while preserving the existing cascade order.
- Homepage behavior is consolidated into `site-v314.js`.
- Removed duplicate menu/header listeners from runtime.
- Added an IntersectionObserver fallback.
- Added mobile-menu outside-click, Escape and desktop-resize cleanup.
- Hardened the message-builder logic and copy/download fallbacks.
- `documents.js` is now null-safe.

### Footer / contact
- Footer remains a proper 4-column desktop layout, 2×2 tablet layout and single-column mobile layout.
- Website and email in the footer are now clickable.
- Footer logo sizing is explicitly aspect-ratio safe.

### 404
- Rebuilt as a clean standalone v3.1 page rather than stacking legacy stylesheets.
- Removed duplicate CSS references.
- Corrected `HÅNDVÆRKET LIGGER I DETALJEN.`

### Email signature
- Fixed the public signature-logo URL from the nonexistent `/brand/email/...` path to `/brand/04_EMAIL/...`.
- Added explicit image height for stable email rendering.

### PWA / manifest
- Rebuilt root `site.webmanifest` against the actual 192×192 and 512×512 assets.
- All public pages reference the same manifest.

### Dossier / documents
- Re-rendered the downloadable dossier PDF from the current HTML.
- Updated dossier footer date to October 2026.
- Standardized the awkward GO/NO-GO wording to `GO/NO-GO-kontrol`.
- Verified print output:
  - FAI 01: 1 page
  - FAI 02: 1 page
  - FAI 03: 1 page
  - Tac Table Setup Sheet: 2 pages
  - Fagligt dossier: 2 pages

## Automated QA result
`QA_v3.1.4.json` contains the machine-readable result. All included checks pass with zero recorded failures.

The checks cover:
- missing local resources
- broken internal anchors
- duplicate IDs
- H1 structure
- required page metadata
- accessible form labels
- image aspect/dimension consistency
- CSS parse validity
- JavaScript syntax
- SEO / OG / Twitter fields
- JSON-LD parsing
- unique titles/descriptions
- sitemap/indexability parity
- manifest icon dimensions
- email signature asset path
- project-page navigation behavior

## Runtime-test note
Interactive Chromium rendering is unavailable in this container environment. The homepage and technical print documents were additionally smoke-rendered with WeasyPrint; JavaScript was syntax-checked and the DOM/resource structure was validated statically.
