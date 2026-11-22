# DATUM V5.4.3 — QA

## Kontrolleret

| Test | Resultat |
|---|---|
| Hovedside: 13 viewportbredder (320–2560 px) | Bestået |
| 404: 5 viewportbredder (320–1920 px) | Bestået |
| Privatliv: 5 viewportbredder (320–1920 px) | Bestået |
| Vandret overflow | Ikke observeret |
| Manglende billeder | Ikke observeret |
| JavaScript pageerrors | Ikke observeret |
| Seks hovedsektioner, fem atmosfærelag | Bekræftet |
| Hero-tekst synlig og ikke afklippet | Bekræftet i layoutmålinger |
| Mobilmenu åbner og lukker | Bekræftet |
| Kopier mailadresse | Bekræftet i browser |
| Hovedside uden JavaScript (320, 390, 1440 px) | Bestået |
| 404/privatliv uden JavaScript og uden ekstern CSS | Bestået |
| Alle HTML/CSS/billedstier | Statisk valideret |
| CSP SHA-256 for inline styles/scripts | Verificeret |
| Node JS syntaks | Bestået |
| Godkendt OG-billede, robots og sitemap | Bevaret |

**Metode:** Headless Chromium renderede indholdet fra den faktiske HTML med originale CSS/JS aktiver og billeder indlejret til test. Den isolerede test bevarer CSS-regler og JS-logik, men **er ikke det samme som en end-to-end-test over det faktiske webhotel**. Derudover blev samtlige lokale filstier kontrolleret mod ZIP-indholdet. Testresultaterne kan findes i `QA_V5.4.3.json`.

**Kræver livekontrol:** HTTP-statuskode for ugyldige adresser, webhotellets sikkerhedsheaders, HTTPS og cacheopførsel samt sociale delingspreviews.

**Bevidst fravalgt:** Konstant parallax, partikler, aggressiv glow og tunge tredjepartsbiblioteker. Designet bruger CSS/optimerede lokalassets uden tredjepartsscripts og uden besøgsdata, der gemmes eller sendes af hjemmesiden.
