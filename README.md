# Stockrobber, ny premiumsida

Statisk sida (HTML, CSS, JS). Ingen byggprocess behövs. Allt ligger i den här mappen.

```
index.html          sidan
css/site.css        design (färger, typsnitt, layout)
css/scrollcraft.css scroll-motorns grund (rör inte)
js/site.js          meny, formulär, loggans ticker, boken. LÄNKAR LIGGER HÖGST UPP HÄR
js/hero3d.js        3D-scenen i heron (Three.js)
js/scrollcraft.js   scroll-motorn (rör inte)
assets/             porträtt, topplista, favicon, delningsbild
fonts/ vendor/      självhostade typsnitt och Three.js
BRIEF.md DESIGN.md  designbeslut
```

## Testa lokalt

```bash
cd stockrobber
```

```bash
python3 -m http.server 4500
```

Öppna http://localhost:4500. Sidan måste köras via en server; att dubbelklicka på `index.html` fungerar inte på grund av JavaScript-modulerna.

## Lägg upp på Vercel

### Alternativ A: via GitHub (rekommenderas)
1. Skapa ett nytt repo på GitHub och ladda upp innehållet i den här mappen (eller be mig pusha det åt dig).
2. Gå till https://vercel.com/new och logga in med GitHub.
3. Välj repot och klicka **Import**.
4. Framework Preset: **Other**. Build Command: lämna tomt. Output Directory: lämna tomt (roten).
5. Klicka **Deploy**. Du får en adress som `stockrobber.vercel.app`.
6. Varje gång du ändrar något i repot publiceras sidan om automatiskt.

### Alternativ B: via terminalen

```bash
npm i -g vercel
```

```bash
cd stockrobber
```

```bash
vercel
```

Svara på frågorna (ny project, katalog `./`, inga build-inställningar). När förhandsversionen ser bra ut:

```bash
vercel --prod
```

### Koppla domänen stockrobber.com
1. I Vercel: projektet → **Settings → Domains** → lägg till `stockrobber.com` och `www.stockrobber.com`.
2. Vercel visar vilka DNS-poster du ska lägga in hos din domänleverantör (normalt en A-post för `stockrobber.com` och en CNAME för `www`). Använd exakt de värden Vercel visar.

**Viktigt innan du flyttar domänen:** dagens sida har fler sidor än startsidan (Lilla aktieskolan, kurssidor, Om Stockrobber, Kontakt) och en varukorg/kassa. Den här mappen innehåller bara den nya startsidan. Peka inte om domänen förrän de andra sidorna och kassan har en plats. Ett vanligt upplägg: behåll den nuvarande sidan (t.ex. på `butik.stockrobber.com`) för kurser och kassa, och länka dit från den nya startsidan via `LINKS` i `js/site.js`.

## Saker att fylla i innan lansering
Allt utom texter ligger i `LINKS` högst upp i `js/site.js`:

| Nyckel | Vad |
|---|---|
| `patreonVip`, `patreonExklusiv` | Länkar till respektive nivå på Patreon |
| `kurs`, `kurser` | Kurssidan och översikten över kurser |
| `cart` | Varukorgen |
| `skolaGrunder`, `skolaTeknisk`, `skolaFundamental` | Undersidor till Lilla aktieskolan |
| `omMig`, `media`, `faq` | Undersidor till Om Stockrobber |
| `formEndpoint` | Mottagare för kontaktformuläret, t.ex. ett gratis Formspree-formulär |
| `email` | Reserv: öppnar besökarens e-postprogram om `formEndpoint` saknas |

Texter som är **platshållare** (syntes inte i underlaget) och som du bör byta ut i `index.html`:
- Ingressens andra och tredje rad (sektionen efter heron).
- Kurskapitel 2 till 5 (markerade med `data-todo="kapitel"`).
- Exklusiv-nivåns beskrivning (`data-todo="exklusiv-innehall"`) och VIP-priset (står nu "Se pris på Patreon").
- Undermenyernas rubriker (Börsens grunder, Teknisk analys, Fundamental analys, Om mig, I media, Vanliga frågor).

Övrigt:
- `og:image` i `index.html` bör ändras till en full adress, t.ex. `https://stockrobber.com/assets/og.jpg`, när domänen är på plats.
- Porträttet är frilagt från en skärmdump (735 px brett). Skicka originalfotot i högre upplösning så blir det skarpare på stora skärmar.
- Loggan är ritad om som SVG efter den befintliga PNG-loggan (originalet ligger i `assets/logo-original.png`). Har ni loggan som vektorfil kan ordbilden bytas mot den.
- Tillgänglighetswidgeten från den gamla sidan (den blå knappen) är inte med. Den kan läggas tillbaka med samma skript som tidigare.

## Licenser
Three.js (MIT), Archivo och Geist (SIL Open Font License), scroll-craft-motorn (MIT).

## Heron: svara på frågan
Rubriken är en fråga, så heron har två svarsknappar ("Ja. Jag vill följa analyserna" / "Ja. Jag vill lära mig grunderna"). Ett klick för besökaren direkt till Vägvalet med fråga 1 redan besvarad. Händelsen `sr_hero_answer` skickas till `window.dataLayer`. Hero-bilden är originalfotot från den gamla sidan (`assets/hero-photo.webp`), med sin egen bakgrund, som tonar ut i graferna.

## Vägvalet (medlemskapssektionen)
Besökaren svarar på två frågor och rätt erbjudande (VIP, Exklusiv eller kursen) lyfts fram i kortleken, med en kort motivering och köpknapp. Valet sparas i webbläsaren (localStorage) och följer med nedåt sidan i en liten list längst ner. "Visa alla tre sida vid sida" visar en vanlig jämförelse.

- Texterna för frågor och kort finns i `index.html` (sektionen `#medlemskap`), motiveringarna i `OFFERS` i `js/site.js`.
- Varje val skickar händelsen `sr_path` till `window.dataLayer` om Google Tag Manager finns på sidan, så att du kan mäta vilka vägar som väljs och konverterar.
