# DESIGN.md: Stockrobber, privatbank-utgåvan

## 1. Visual theme & atmosphere
**Privatbank.** Ljust benvitt papper, djupt skogsgrön text, loggans gröna som enda accent. Lugnt, exakt, trovärdigt. Rörelse bara där den betyder något.
En mening: *en analysrapport från ett gammalt bankhus, satt med modern typografi.*
Interaktionsnivå: **L2 med en L3-topp** (pin på hero och kurs, inga WebGL-scener).

## 2. Color palette & roles
```css
:root {
  --paper: #F1F2EC;      /* rgb 241 242 236  grund */
  --paper-2: #E6E9E0;    /* rgb 230 233 224  kursens kapitel */
  --sc-ink: #102419;     /* rgb 16 36 25     text, knappar */
  --sc-ink-soft: #4C5A50;/* rgb 76 90 80     sekundär text */
  --forest: #12271B;     /* rgb 18 39 27     mörka band: bevis, sidfot, bok */
  --bone: #ECEFE6;       /* text på forest */
  --bone-soft: #A9B8AA;
  --green: #93C14D;      /* loggans gröna, bara på mörk grund */
  --green-ink: #3D6A1F;  /* samma ton, djup nog för text på papper */
  --red: #A8323B;        /* fallande candle, felmeddelanden */
}
```
Hårt klipp mellan papper och skog (bevis, sidfot). Inga gradienter som dekor, inget glow.

## 3. Typography rules
- Rubriker: **Source Serif 4** variabel (opsz + wght), vikt 400 till 500. Vald för att den bär en banks och en finansrapports tradition utan att bli nostalgisk. Självhostad `fonts/source-serif-4.woff2`.
- Text: **Hanken Grotesk** variabel, självhostad `fonts/hanken-grotesk.woff2`.
- Fallback: `"Iowan Old Style", Georgia, serif` respektive `system-ui, sans-serif`.
- Skala: 0.875 / 0.9375 / 1.0625 / 1.125 / 1.6 / 2.2 / 3.3 / 4.4 / 6.6 rem.
- Tracking −0.02em på stora rubriker. Radlängd max ca 42ch i ingress, 62ch i brödtext.
- Inga versaletiketter, ingen enstaka färgad eller kursiv nyckelordsbetoning.

## 4. Component stylings
- **Knapp** (`.btn`): forest-bakgrund, bone-text, 3px radie, 52px. Hover: forest-2. Active: mörkare. Focus-visible: 2px grön ring med 3px offset. Disabled: 45 %.
- **Länk** (`.link`): hårfin understrykning som drar sig undan vid hover.
- **Meny**: transparent på papper, blir 94 % papper med hårlinje vid scroll. Undermenyer på hover, klick och tangentbord (Escape stänger). Mobil: helskärm med serif-rubriker.
- **Medlemskap** (`.plan`): inga kort. Kolumner med en övre linje; Exklusiv markeras med en 3px grön linje.
- **Dragspel**: plus som blir minus, innehållet glider fram.
- **Fält**: bara underlinje, fokus = 2px grön underlinje, fel = röd linje + text under.

## 5. Layout principles
Max 1280px + gutter `clamp(20px, 5vw, 72px)`. Hero: text vänster, bild höger. Ingress: text vänster, graf höger. Bevis: rubrik vänster, bild full bredd. Medlemskap: rubrik + två kolumner. Kurs: bok vänster, text höger. Kontakt: rubrik vänster, formulär höger.

## 6. Depth & elevation
Djup från lager (hero) och från boken i 3D. En enda mjuk skugga under porträttet och boken. Inga kortskuggor.

## 7. Animation & interaction
- Motor: scroll-craft (`js/scrollcraft.js`, oförändrad).
- Laddning (ett enda orkestrerat ögonblick): ramen vecklas upp, porträttet stiger fram, rubrikens ord reser sig, kurslinjen ritas.
- Hero-lager på scroll: vågor (−28px i sidled), rosett (roterar 22°), ram (sjunker och krymper 4 %), porträtt (stiger 22px), kurslinje (stiger 110px). Pekaren förskjuter lagren några pixlar.
- Ingress: meningarna ljusnar i läsordning, grafen ritas och vänder.
- Topp: 3D-boken vrider sig och öppnas, kapitlen bockas av.
- Signatur: portföljtickern i loggan.
- `prefers-reduced-motion`: inga förflyttningar, all text full styrka, boken öppen, tickern i sluttillstånd.

## 8. Do's and don'ts
Do: behåll alla menyval, knappar och priser; riktig HTML för all text; en accent; byt ankare mellan sektionerna.
Don't:
1. Inga kort med skugga i rader.
2. Ingen WebGL, inget glow, inga gradienttexter.
3. Inga versaletiketter eller ögonbryn över varje rubrik.
4. Inga tankstreck (em dash) i synlig text.
5. Inga påhittade siffror.
6. Ingen magnetknapp, ingen "scrolla"-pil, ingen progressbar.
7. Ingen `transition: all`.
8. Logogrönt (#93C14D) aldrig som text på papper.

## 9. Responsive behavior
Brytpunkter 1100 (hamburgermeny), 860 (en kolumn), 600 (kortare hero). Tryckytor minst 44px. Ingen horisontell scroll vid 360px.
