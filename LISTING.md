# Listing-Text zum Kopieren / Ready-to-paste listing text

Replace `LINK` with your published URL (GitHub Pages, or wherever you host it)
and `GC-CODE` with your cache's code. The HTML block at the bottom is what you
actually paste into the geocaching.com listing editor — the platform allows a
conservative subset of HTML, and this stays inside it.

---

## Kurzbeschreibung / Short description

**DE**  Die Koordinaten oben sind nicht die Dose. Spiel das Datingspiel, gewinn
drei Herzen, bekomm zehn Ziffern.

**EN**  The posted coordinates are not the cache. Play the dating sim, win three
hearts, get ten digits.

---

## Langbeschreibung — Deutsch

> **Die Listing-Koordinaten sind nicht die Dose.** Sie sind eine Wiese. Eine
> schöne Wiese, aber eine Wiese.
>
> Du bist auf dem Mega-Event „Liebe auf den ersten Log“. Kommentiert wird es von
> zwei Drohnen: **T4-TC**, die alles großartig findet, und **D-NF**, der 4.112
> Fehlversuche und null Beziehungen geloggt hat.
>
> Drei Caches möchten mit dir ausgehen:
>
> * **Petra Petling** — klassisch, wasserdicht, emotional leicht feucht.
> * **Nando Nano** — winzig, magnetisch, schwer zu greifen.
> * **Mysti Fünf-Sterne** — kompliziert, rätselhaft, 47 Tabs offen.
>
> Jedes Date, das **richtig gut** läuft, gibt dir einen Teil der
> Final-Koordinaten. Charmant sein reicht nicht — du musst auch jemand sein, der
> anständige Logs schreibt. Alle drei Teile, und dein GPS rastet ein.
>
> Das Spiel läuft direkt im Browser, auf Handy wie Rechner, auf Deutsch und
> Englisch, ohne Installation und ohne Konto. Es funktioniert auch offline:
> einmal laden, dann geht es auch dort, wo kein Netz ist.
>
> **▶ Hier spielen: LINK**
>
> Am Ende zeigt dir das Spiel die Koordinaten, die Quersumme aller zehn Ziffern
> zum Selbstkontrollieren und einen Kopier-Knopf. Die Dose liegt innerhalb der
> üblichen Entfernung zu den Listing-Koordinaten.
>
> Bitte einen **Stift** mitbringen. Der Stift ist immer das Problem.
>
> *Alle Figuren sind erfunden. Bitte verantwortungsvoll cachen und die Muggel
> nicht füttern.*

---

## Long description — English

> **The posted coordinates are not the cache.** They are a field. A nice field,
> but a field.
>
> You are at the "Love at First Log" mega-event, commentated by two drones:
> **T4-TC**, who thinks everything is wonderful, and **D-NF**, who has logged
> 4,112 did-not-finds and zero relationships.
>
> Three caches would like to go out with you:
>
> * **Petra Petling** — classic, waterproof, emotionally a little damp.
> * **Nando Nano** — tiny, magnetic, hard to get hold of.
> * **Mysti Five-Star** — complicated, cryptic, 47 tabs open.
>
> Every date that goes **really** well releases part of the final coordinates.
> Being charming is not enough — you also have to be the sort of cacher who
> writes a decent log. Collect all three parts and your GPSr locks on.
>
> It runs in the browser on phone or desktop, in German and English, with no
> install and no account. It also works offline: load it once and it keeps
> working where the signal does not.
>
> **▶ Play here: LINK**
>
> At the end you get the coordinates, the cross-sum of all ten digits as a
> self-check, and a copy button. The container is within the usual distance of
> the posted coordinates.
>
> Please bring a **pen**. The pen is always the problem.
>
> *All characters are fictional. Please cache responsibly and do not feed the
> Muggles.*

---

## HTML für den Listing-Editor / HTML for the listing editor

```html
<p><strong>Die Listing-Koordinaten sind nicht die Dose.</strong> Sie sind eine
Wiese. Eine schöne Wiese, aber eine Wiese.</p>

<p>Du bist auf dem Mega-Event &bdquo;Liebe auf den ersten Log&ldquo;.
Kommentiert wird es von zwei Drohnen: <strong>T4-TC</strong>, die alles
gro&szlig;artig findet, und <strong>D-NF</strong>, der 4.112 Fehlversuche und
null Beziehungen geloggt hat.</p>

<p>Drei Caches m&ouml;chten mit dir ausgehen:</p>
<ul>
  <li><strong>Petra Petling</strong> &mdash; klassisch, wasserdicht, emotional leicht feucht.</li>
  <li><strong>Nando Nano</strong> &mdash; winzig, magnetisch, schwer zu greifen.</li>
  <li><strong>Mysti F&uuml;nf-Sterne</strong> &mdash; kompliziert, r&auml;tselhaft, 47 Tabs offen.</li>
</ul>

<p>Jedes Date, das <em>richtig gut</em> l&auml;uft, gibt dir einen Teil der
Final-Koordinaten. Alle drei Teile, und dein GPS rastet ein.</p>

<p><a href="LINK"><strong>&#9654; Hier spielen / Play here</strong></a></p>

<p>L&auml;uft im Browser auf Handy und Rechner, auf Deutsch und Englisch, ohne
Installation, ohne Konto, und auch offline. Am Ende bekommst du die
Koordinaten, die Quersumme aller zehn Ziffern zur Selbstkontrolle und einen
Kopier-Knopf.</p>

<hr>

<p><strong>The posted coordinates are not the cache.</strong> Play the dating
sim, win three hearts, collect ten digits. Three dates: Petra Petling
(classic, waterproof), Nando Nano (tiny, magnetic) and Mysti Five-Star
(complicated, cryptic). Every date that goes really well releases part of the
final coordinates.</p>

<p>Bitte einen Stift mitbringen. Der Stift ist immer das Problem. /
Please bring a pen. The pen is always the problem.</p>

<p><small>Alle Figuren sind erfunden. Bitte verantwortungsvoll cachen und die
Muggel nicht f&uuml;ttern. / All characters are fictional. Please cache
responsibly and do not feed the Muggles.</small></p>
```

---

## Hinweise für den Owner / Owner notes

- **Additional waypoints.** Set the parking / trailhead waypoints as usual. The
  game only produces the final.
- **Attributes.** Worth setting: *Available 24/7*, *Needs maintenance
  unlikely*, *Stealth required* if the final is muggle-adjacent, and whichever
  terrain attributes actually apply.
- **Checker.** Add a GeoCheck or Certitude checker and paste its URL into
  `checkerUrl` in `js/coords.js` — the game will then show a "Check solution"
  button next to the revealed coordinates.
- **Hint.** Put your hint in plain text into `tools/setup.html`; it is stored
  ROT13-encoded, exactly like a listing hint, and shown behind a disclosure
  in the GPSr panel.
- **Distance.** The final must be within the listing guideline distance of the
  posted coordinates (2 miles / ~3.2 km on geocaching.com). Set
  `distanceFromPostedMeters` if you would like the game to show solvers how far
  out it is.
