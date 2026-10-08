# Datum Prototyping v3.1.3 — SEO + Open Graph

## Metadata
Every public page now has a unique title, meta description, canonical URL, Danish hreflang, robots directives, complete Open Graph metadata and a complete Twitter/X large-image card.

## Preferred images
Nine page-specific 1200×630 social/search images were added under `images/og/`. The pages expose those images through both Open Graph and structured data.

## Structured data
- Organization
- Person
- WebSite
- WebPage
- Article for project cases
- TechArticle for FAI / setup documentation
- ProfilePage for the fagligt dossier
- BreadcrumbList

No unsupported address, certification, rating or review claims were added.

## Search infrastructure
- `robots.txt` cleaned up.
- `sitemap.xml` rebuilt with `lastmod=2026-10-08` and image entries.
- One H1 per public page.
- Missing image dimensions added to reduce layout shift.
- Local images use async decoding.
- Primary hero images are preloaded / high priority.

## QA
`SEO_AUDIT_v3.1.3.json` validates titles, descriptions, H1 count, OG/Twitter metadata, 1200×630 image assets, JSON-LD parsing, local references, sitemap XML and JavaScript syntax.
