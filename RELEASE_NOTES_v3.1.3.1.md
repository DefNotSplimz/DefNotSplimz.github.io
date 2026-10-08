# Datum Prototyping v3.1.3.1 — Footer Hotfix

- Fixed distorted footer logo caused by intrinsic HTML height conflicting with CSS width.
- Footer now explicitly preserves the logo aspect ratio with `height:auto`.
- Fixed the footer grid: it contained four top-level items but only three defined desktop columns.
- Added a proper 4-column desktop footer, 2×2 tablet layout and stacked mobile layout.
- Contact information now stays aligned at the right instead of falling into an implicit second grid row.
- Added a cache-busting stylesheet version to the homepage.
