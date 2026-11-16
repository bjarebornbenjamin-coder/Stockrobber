# BRIEF: Stockrobber, premium-ombyggnad

> **Version 2 (privatbank).** Kunden valde: ny riktning "Privatbank" (ljus, lugn, redaktionell, serif-rubriker, sparsamt grönt, få men exakta animationer), nytt typsnitt och ny hero-lösning, samt "ta bort slop". Allt nedan om den mörka versionen gäller version 1.
>
> **Version 2, ändrat:** WebGL-heron och konturtexten borttagna. Ny hero: porträttet står framför ett graverat sedel-medaljong (guilloché i SVG) i en skogsgrön ram och bryter ramens överkant. Tagit bort: progressbar, korn, glow, magnetknapp, 3D-lutande kort, ljuskäglor, versaletiketter. Toppen (boken) och signaturen (portföljtickern) behölls.

**Self-authored under explicit creative delegation.** Uppdraget: "förbättra men behålla samma funktioner som stockrobber.com. Elegant, premium, animationer, lager och 3D. Använd loggan och bilderna från nuvarande hemsida." Intervjufrågorna nedan är besvarade av mig utifrån skärmdumparna; inget är ett citat från kunden.

## Evidens (från skärmdumpar)
- Logga: portfölj med staplar (grön, grön, röd, röd, grön) + ordbild STOCK (fet) ROBBER (tunn). Grön #92C14D, röd #99222B, svart bakgrund.
- Meny: Patreon, Lilla aktieskolan (undermeny), Kurser, Om Stockrobber (undermeny), Kontakt, varukorg.
- Hero: porträtt i ljusblå kavaj mot mörk bakgrund med grafer. Rubrik "Önskar du att bli framgångsrik på börsen genom tekniska och fundamentala analyser?" Knapp "Mer om utbildningen".
- Ingress: "Det är många som känner att lönen inte riktigt räcker till för de upplevelser eller de finansiella ..." (resten syns inte).
- Patreon: "Sveriges mest framgångsrika Patreon*", "*2021, enligt TV4 Nyhetsmorgon", grönt foto av topplista.
- Nivåer: VIP-medlemskap (Läs mer-dragspel med förmåner), Exklusiv (Läs mer, Bli medlem, 295 kr/mån). Ljus salviagrön kortbakgrund.
- Kurs: "Investera i en komplett utbildning inom fundamental analys och maximera din avkastning", checklista som börjar med "Introduktion: Beskrivning av kursen och vad läsaren kan förvänta sig", bokmockup.
- Tillgänglighetsknapp (tredjepartswidget) nere till höger.

## Antaganden (måste verifieras av kunden)
- Resten av ingresstexten, kurskapitel 2 till 5, Exklusiv-nivåns innehåll, VIP-pris och undermenyernas punkter är inte synliga i underlaget och är skrivna som platshållare.
- Alla externa länkar (Patreon, kurssidor, varukorg) ligger samlade i `js/site.js` (`LINKS`).

## De åtta frågorna (författade)
1. **Känsla:** lugn självsäkerhet, nattlig handelsplats, trovärdig lärare. Referenser: en Bloomberg-terminal i ett mörkt rum, ett skräddat kostymfoder, Michael Manns nattbilder.
2. **Resan:** möt läraren och frågan → känn igen problemet (lönen räcker inte) → bevis (Sveriges mest framgångsrika Patreon) → välj medlemskap → kursen öppnas → kontakt.
3. **Energi:** lugn hero, stigande i ingressen, tyst och tydlig i bevis, luftig i medlemskap, högst i kursen, lugnt avslut.
4. **Känslokurva och topp:** se nedan.
5. **Det ingen annan sida gör:** loggans staplar är en levande graf. De röda staplarna vänder till gröna i takt med att besökaren läser, och vid avslutet står hela portföljen i en uppåtgående trend.
6. **Avstånd från premium-minimal:** premium-minimal med en mörk, filmisk kant. Inte maximalistiskt.
7. **En värld eller scener:** separata scener som delar samma natt (en mörk grund), med ett ljust kapitel för medlemskapen.
8. **Tillgångar:** logga (PNG), porträtt och topplistefoto ur skärmdumpar. Inget genereras med AI. Porträtt frilagt med rembg.

## Känslokurva
| Akt | Känsla | Vad på skärmen orsakar den |
|---|---|---|
| 1 Hero | nyfikenhet | Porträttet står framför ett 3D-landskap av candlesticks som kameran glider in i |
| 2 Ingress | igenkänning, sedan hopp | Ingressen byggs rad för rad medan en röd, hackig graf vänder och blir grön |
| 3 Bevis | förtroende | Topplistefotot vecklas ut, en tyst rubrik och en fotnot |
| 4 Medlemskap | lätthet | Hårt klipp till ljus salvia, två nivåer att välja mellan |
| 5 Kurs (TOPP) | förväntan som löses ut | En 3D-bok vrider sig mot läsaren och öppnar pärmen, kapitlen bockas av |
| 6 Kontakt | lugn | Allt stillnar, loggans staplar står gröna |

**Toppen:** "Boken öppnade sig när jag scrollade." Akt 5, längst scrollutrymme (3,2 vh).
**Det är sidan där** loggan börjar i rött och slutar i grönt medan du läser.

## Grammatik
Filmisk one-shot med ett hårt klipp (medlemskapen). Skälet: ett enda resonemang med en båge (fråga → bevis → val), och kundens meny (fem länkar + varukorg) behövs. De andra grammatikerna förbjuder antingen en fast meny (Chaptered editorial, Typographic poster, Split stage) eller förutsätter en produkt som visas live (Live surface), ett galleri (Gallery) eller ett kontinuerligt kameraflyg (Continuous world).

## Signaturrörelse
**Portföljtickern:** de fem staplarna i loggan (SVG) styrs av hela sidans scrollposition. Stapel 3 och 4 börjar röda och låga; när ingressen vänder blir stapel 3 grön, efter beviset stapel 4, och i avslutet står alla fem i stigande ordning. Hover på loggan ger ett litet tickerryck. Ingen siffra visas, bara riktning.

## Tystnad
Mellan bevis (akt 3) och medlemskap (akt 4) finns en avsiktlig andningspaus i form av det ljusa klippet.
