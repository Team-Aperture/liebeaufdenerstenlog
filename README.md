# Liebe auf den ersten Log 💗🧭

**Ein zweisprachiges Geocaching-Datingspiel, das die Final-Koordinaten verrät.**
**A bilingual geocaching dating sim that hands the solver the final coordinates.**

Three dates. Ten digits. One container.

You are at a mega-event with two commentary drones — **T4-TC**, who thinks
everything is wonderful, and **D-NF**, who has logged 4,112 did-not-finds and
zero relationships. Three caches want to go out with you. Each date that goes
*really* well releases part of the final coordinates onto your GPSr. All three,
and it locks on.

No frameworks, no build step, no dependencies, no external assets. Open
`index.html` and it runs — including from `file://` on a phone with no signal.

---

## Play

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Or just double-click `index.html`.

**Controls.** Tap an answer, or press <kbd>1</kbd>–<kbd>3</kbd>.
<kbd>Enter</kbd> / <kbd>Space</kbd> advances and skips the typewriter.
Language, sound and restart live in the top bar. Progress is saved in
`localStorage` on the player's own device.

---

## For cache owners

This is built to be adopted. Point it at your own final coordinates and publish
it as your puzzle cache's solution page.

### 1. Set your coordinates

Open **`tools/setup.html`** in a browser. Paste your final coordinates in
whatever format you have them —

```
N 50° 07.462 E 008° 41.235      N50 07.462 E008 41.235
5007.462N 00841.235E            N 50 07 27.7 E 008 41 14.1
N50.12437 E8.68725              N 47° 22,150 E 008° 32,400
```

— fill in the listing details, press **Generate**, and paste the resulting
`CACHE_CONFIG` block over the one near the top of **`js/coords.js`**.

The tool round-trips every value and shows you what the game will display, so
you can confirm it decodes back to your real coordinates before you publish.
It runs entirely in your browser; nothing is uploaded anywhere.

### 2. Bump the cache version

In **`sw.js`**, change `const CACHE = "liebe-auf-den-ersten-log-v2"` to `-v3`,
`-v4`, and so on. The service worker serves the game offline, which means a
returning player would otherwise keep the old coordinates forever.

### 3. Publish

Push to GitHub and enable Pages (**Settings → Pages → Source: GitHub Actions**).
The included workflow in `.github/workflows/pages.yml` deploys the repository
as a static site. Then link that URL from your listing —
`LISTING.md` has ready-to-paste listing text in German and English.

### How the reveal works

The ten unknown digits of the final are labelled **A** through **J**:

```
N dd° AB.CDE     E ddd° FG.HIJ
```

| Date | Releases | Digits |
|------|----------|--------|
| Petra Petling | A B C D | the latitude minutes and its first decimal |
| Nando Nano | E F G | the rest of the latitude, the longitude minutes |
| Mysti Five-Star | H I J | the longitude decimals |

A date only releases its digits at **GOLD** rank, which needs both a high
affection score *and* a high log-quality score — being charming is not enough,
you also have to be the kind of cacher who writes a decent log. Silver and DNF
endings give you the scene, the joke and nothing else; the hub lets you redo
any date as often as you like, and a bad redo never takes an earned GOLD away.

Once all three are GOLD the GPSr locks on and shows the full coordinates, the
cross-sum of all ten digits as a self-check, a copy button, a map link, and an
optional link to your checker.

### About the masking — read this before you rely on it

The coordinates are **not** stored in this repository as plain text. They are
stored as ten masked digits, and each route's slice is masked with its own
keystream derived from that route's seal.

The mask is digit-wise addition modulo 10, chosen for one specific property:
*every* key produces well-formed, plausible coordinates. Somebody who skims
the source and guesses gets a valid-looking coordinate pair with no way to tell
it apart from the real one.

**This is obfuscation, not encryption.** The game is a static page, so
everything needed to compute the answer is, by definition, on the solver's
machine. It defeats "view source", the network tab, and casual poking. It does
not defeat somebody who sits down and reads the JavaScript properly — no
client-side puzzle does. If that matters for your cache, pair this with a
checker (GeoCheck, Certitude) and treat the in-game reveal as the reward for
playing rather than as the only gate.

Set `masked: false` in the config if you want plain digits while testing your
own build.

---

## Customising

Everything a player reads lives in **`js/story.js`** as `{ de, en }` pairs —
the cast, the interface strings, every line of dialogue, the rank texts and the
generated log entry. Translating the game or rewriting the jokes for your own
cache means editing that one file and nothing else.

| File | What is in it |
|------|---------------|
| `js/coords.js` | Cache config, the digit mask, coordinate formatting |
| `js/art.js` | Sprite grids, palettes, the 3×5 bitmap font, drawing primitives |
| `js/scenes.js` | Backdrops, weather, particles, the stage layout |
| `js/story.js` | **All text.** Cast, UI strings, script, scoring thresholds |
| `js/game.js` | State, save/load, render loop, typewriter, GPSr panel |
| `tools/setup.html` | Cache-owner console — coordinates in, config block out |

Difficulty lives in `STORY.GOLD` and `STORY.SILVER` at the bottom of
`js/story.js`. Raising `GOLD` makes the digits harder to earn.

---

## What is in the box

- **Three date routes** with branching reactions, per-route ranks, and a real
  ROT13 puzzle on Mysti's route
- **Hand-authored pixel art** on a 320×180 backbuffer — animated backdrops,
  drifting clouds, rain, fireflies, bats, a wandering Muggle with a dog, idle
  bob, blinking, and mouths that move while their owner is talking
- **A GPSr panel** that hunts for satellites, scrambles the digits it does not
  have yet, and flips them into place as you earn them
- **German and English**, switchable at any point mid-sentence
- **Offline-capable** — a service worker precaches everything, so the game
  works in the field where the signal does not
- Keyboard, mouse and touch controls; `prefers-reduced-motion` respected;
  live regions for screen readers

---

## Disclaimer

Unofficial, non-commercial fan project. Not affiliated with, endorsed by or
sponsored by Geocaching HQ, Groundspeak, or any listing platform. All characters
and cache listings are fictional. Please cache responsibly, respect local rules,
and do not feed the Muggles.
