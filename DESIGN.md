# DESIGN.md: Stockrobber

## 1. Visual theme & atmosphere
**Nattlig handelsplats.** En djup skogsgrön nästan-svart grund (inte ren svart), loggans gröna som enda accent, marknadsrött bara där det betyder något: i graferna och i loggans staplar innan de vänder. Djup kommer från lager som rör sig olika fort, inte från dekoration.
Nyckelord: lugn, exakt, skräddad, självsäker. En mening: *en privat analytikers skrivbord klockan elva på kvällen.*
Interaktionsnivå: **L3** (pin, scroll-tidslinje, WebGL-hero, pekarrespons).

## 2. Color palette & roles
```css
:root {
  --sc-canvas: #0B110C;      /* rgb 11 17 12   grund */
  --sc-surface: #131C15;     /* rgb 19 28 21   ytor, meny */
  --sc-ink: #EDF2E8;         /* rgb 237 242 232 text */
  --sc-ink-soft: #A3B19C;    /* rgb 163 177 156 sekundär text, tonad grön */
  --sc-accent: #93C14D;      /* rgb 147 193 77 loggans gröna */
  --sc-accent-ink: #0B110C;  /* text på accent */
  --sr-red: #C2414B;         /* rgb 194 65 75  fallande candle */
  --sr-red-deep: #99222B;    /* loggans röda */
  /* ljust kapitel (medlemskap) */
  --sr-sage: #E6EFDA;        /* rgb 230 239 218 */
  --sr-sage-2: #D6E4C4;
  --sr-ink-dark: #13200F;
  --sr-ink-dark-soft: #4A5843;
  --sr-accent-deep: #3F6B17; /* accent på ljus grund, 5.6:1 mot sage */
}
```
Accent äger en roll: handlingar (knappar, fokus) och uppåtgående rörelse. Ingen gradienttext, inget neonsken.

## 3. Typography rules
- Display: **Archivo** variabel (wdth 100 till 125, wght 600 till 800). Bred, stabil, närbesläktad med loggans geometriska ordbild. Självhostad `fonts/archivo.woff2`.
- Text: **Geist** variabel, självhostad `fonts/geist.woff2`.
- Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`.
- Skala (rem): 0.8125 / 0.9375 / 1.0625 / 1.25 / 1.6 / 2.2 / 3.2 / clamp(2.6, 5.4vw, 5.6).
- Tracking: display −0.025em, brödtext normal. Radlängd max 62ch. `text-wrap: balance` på rubriker.
- Förbjudet: Inter som default, versaletiketter, serif-inslag i sans-rubrik.

## 4. Component stylings
- **Primärknapp** (`.btn`): accent-bakgrund, mörk text, 999px radie, 52px hög. Hover: ljusare accent + 2px lyft. Active: tryck ner 1px. Focus-visible: 3px ring i accent med 3px offset. Disabled: 45% opacitet, ingen pekare.
- **Sekundär länk** (`.link`): understrykning som ritas från vänster vid hover.
- **Meny** (`.bar`): transparent över hero, blir `--sc-surface` med 86% täckning och 12px blur efter 40px scroll. Undermenyer öppnas på hover, klick och tangentbord (Escape stänger).
- **Nivåkort** (`.tier`): olika storlek efter hierarki, ingen enhetlig kortmall. 3D-lutning och ljuskägla följer pekaren.
- **Dragspel** (`<details>`): plus som roterar till minus, innehållet glider fram.
- **Fält** (`.field`): 52px, hårfin kant, fokus = accentkant + ring. Felmeddelande under fältet i klartext.

## 5. Layout principles
12-kolumners rutnät, max 1320px, gutter `clamp(20px, 4vw, 56px)`. Varje akt byter ankare: hero höger, ingress vänster, bevis nere till vänster, medlemskap delad, kurs delad med boken till vänster, kontakt centrerad i två kolumner. Mer luft ovanför rubrik än under.

## 6. Depth & elevation
Djup = rörelseskillnad + ocklusion. Skuggor med offset: `0 30px 60px -20px rgb(0 0 0 / .55)` för boken, `0 20px 40px -24px rgb(19 32 15 / .35)` för kort på ljus grund. Inga gråa standardskuggor.

## 7. Animation & interaction
- Motor: scroll-craft (`js/scrollcraft.js`, oförändrad) för pin, cue, kinetic, reveal, parallax, tilt, spotlight, magnet, drift.
- Hero: Three.js-landskap av candlesticks (en enda WebGL-scen, pausas utanför bild). Lager: WebGL → ordbild → porträtt → rubrik → förgrundslinje.
- Signatur: portföljtickern i loggan (se BRIEF.md).
- Topp: CSS 3D-bok som vrider sig och öppnas, styrd av aktens progress.
- `prefers-reduced-motion`: inga pin-förflyttningar utöver motorns milda läge, WebGL renderar en stillbild, boken visas öppen, staplarna visar sluttillstånd.

## 8. Do's and don'ts
Do:
1. Behåll alla menyval, knappar och priser från originalet.
2. Riktiga rubriker och länkar i HTML, aldrig text inbakad i bild.
3. En accent, en röd för fallande kurs.
4. Varje akt byter ankare och teknik.
Don't:
1. Inga uppfunna siffror eller räknare.
2. Inget tankstreck (em dash) i synlig text.
3. Ingen "scrolla"-pil, inga `01 / 06`-räknare.
4. Ingen gradienttext, inget glow, ingen lila.
5. Ingen helskärmsmörkning för kontrast, bara lokal scrim.
6. Inga `transition: all`, ingen animation av width/height/top/left.
7. Inte mer än en WebGL-scen.
8. Inga versaletiketter ovanför varje rubrik.

## 9. Responsive behavior
Brytpunkter: 1100px (meny blir hamburgare), 860px (motorns mobilläge), 600px. Mobil hero: rubrik överst, porträtt nedtill, färre candlesticks och DPR max 1,5. Boken krymper och ligger ovanför kapitellistan. Tryckytor minst 44×44px. Ingen horisontell scroll vid 360px.
