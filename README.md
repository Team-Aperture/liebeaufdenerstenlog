# Liebe auf den ersten Log 💗🧭

### DIE KALIBRIERUNGSANLAGE — Sektor 12: Emotionale Verträglichkeit
*TESTEN. MESSEN. VERLIEBEN.*

**Ein zweisprachiges Geocaching-Datingspiel, das die Final-Koordinaten verrät.**
**A bilingual geocaching dating sim that hands the solver the final coordinates.**

Three assessments. Ten digits. One container.

Sector 12 of the facility has come back online, and it would like to measure
your emotional compatibility. Running the tests are the two mobile units:
**R-3MI**, who is delighted about everything and speaks German, and **V-TGM**,
who has opinions and speaks English. Three test subjects — three caches — are
waiting. Every assessment you *pass* releases part of the final coordinates onto
your GPSr. All three, and it locks on.

No frameworks, no build step, no dependencies, no external assets, and not a
single image or audio file: the art is drawn pixel by pixel in code and the
soundtrack is synthesised by a chiptune tracker at runtime. Open `index.html`
and it runs — including from `file://` on a phone with no signal.

---

## Play

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Or just double-click `index.html`.

**Controls.** Tap an answer, or press <kbd>1</kbd>–<kbd>4</kbd>.
<kbd>Enter</kbd> / <kbd>Space</kbd> advances and skips the typewriter. Tap
anywhere on the title screen to skip the cold-start sequence. Language, sound
and restart live in the top bar. Progress is saved in `localStorage` on the
player's own device.

**Sound is off until you turn it on** — browsers require a gesture before audio
may start, and nobody wants a geocaching page playing music at them unasked.

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

In **`sw.js`**, bump `const CACHE = "liebe-auf-den-ersten-log-v6"` to `-v7`,
`-v8`, and so on. The service worker serves the game offline, which means a
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

| Test subject | Releases | Digits |
|--------------|----------|--------|
| Petra Petling | A B C D | the latitude minutes and its first decimal |
| Nando Nano | E F G | the rest of the latitude, the longitude minutes |
| Mysti Five-Star | H I J | the longitude decimals |

A subject only releases its digits when you **pass**, which needs both a high
affection score *and* a high log-quality score — being charming is not enough,
you also have to be the kind of cacher who writes a decent log.

Each assessment is six scored beats, and two of them have exactly one right
answer:

* a **geocaching-knowledge check** — what you log when a cache is soaked but
  present, what a D 1.5 / T 5 rating actually means, what to do when your
  solved final lands outside the two-mile guideline;
* a **memory check** on something the subject told you three beats earlier.
  Petra says once that she never logs in ballpoint. Nando asks you not to grab
  him and to use the mirror. Mysti mentions twice how long her own puzzle took
  her — and then asks.

**The answers are shuffled.** Each beat's options are ordered by a hash of its
node id, so the correct one is as likely to be C or D as A — "always pick the
top option" is not a strategy. The shuffle is deterministic, so every player
sees the same order every time and a hint that says "it was C" stays true. The
salt (`SHUFFLE_SALT` in `js/game.js`) was chosen by searching for the flattest
spread: correct quiz answers land on A/B/C/D in a 1/2/2/2 split, and no two
consecutive quizzes share a letter.

A perfect run scores 14–15 affection and 10–12 log quality; passing needs 11 and
9. That forgives roughly one bad answer and nothing more. The meters show a tick
at the passing mark while an assessment is running, so you can see where you
stand. Near-miss and failed runs give you the scene, the joke and nothing else;
the facility lets you retake any assessment as often as you like, and a bad
retake never takes an earned pass away.

Once all three are passed the GPSr locks on and shows the full coordinates, the
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
| `js/audio.js` | The whole soundtrack and every sound effect, synthesised |
| `js/art.js` | Sprite grids, palettes, the 3×5 bitmap font, drawing primitives |
| `js/hosts.js` | R-3MI and V-TGM: procedural bodies, expressions, arm poses |
| `js/logo.js` | The Kalibrierungsanlage badge and the cold-start sequence |
| `js/scenes.js` | Backdrops, weather, particles, transitions, the stage |
| `js/story.js` | **All text.** Cast, UI strings, script, scoring thresholds |
| `js/game.js` | State, save/load, render loop, typewriter, GPSr panel |
| `tools/setup.html` | Cache-owner console — coordinates in, config block out |

Difficulty lives in `STORY.GOLD` and `STORY.SILVER` near the bottom of
`js/story.js`. Raising `GOLD` makes the digits harder to earn.

**The cache's own name is translated too.** `cacheName` and
`cacheNameLines` in `js/story.js` feed the badge's lower strip, the
title-screen heading, the in-game top bar and the browser tab. The
badge is drawn in the 3×5 bitmap font, which has no umlauts — keep a
replacement name to plain A–Z, digits and basic punctuation.

**The two units follow Kalibrierungsanlage canon:** R-3MI always speaks German
and V-TGM always speaks English, whichever language the interface is set to.
The half of the `{ de, en }` pair that is not the spoken line is shown as a
subtitle underneath. The engine decides which is which from `nativeLang` on the
cast entry, so a new character speaking a fixed language needs one field.

---

## What is in the box

- **Three assessments** with branching reactions, per-route ranks, a knowledge
  check and a memory check each, and a real ROT13 puzzle on Mysti's route
- **R-3MI and V-TGM** drawn procedurally, with nine expressions and eleven arm
  poses that blend rather than snap, floating emotes from their expression
  sheets, bubbling coolant tanks and coiled feed lines
- **The Kalibrierungsanlage badge** built in pixels — gauge, bevelled chrome
  plate, motto strip, certification tab — assembling after a cold-start log
- **Hand-authored pixel art** on a 320×180 backbuffer: animated backdrops,
  drifting clouds, rain with splashes, fireflies, bats, dust motes, a wandering
  Muggle with a dog, block-dissolve scene transitions, confetti, idle bob,
  blinking, reaction hops and recoils, and mouths that move while their owner
  is talking
- **A soundtrack with no audio files.** A small tracker: pulse waves at three
  duty cycles, triangle bass, filtered-noise percussion and a feedback delay,
  playing six tracks — one for the title and one per location — plus fourteen
  synthesised sound effects
- **A GPSr panel** that hunts for satellites, scrambles the digits it does not
  have yet, and flips them into place as you earn them
- **German and English**, switchable at any point mid-sentence
- **Offline-capable** — a service worker precaches everything, so the game
  works in the field where the signal does not
- Keyboard, mouse and touch controls; `prefers-reduced-motion` respected;
  live regions for screen readers
- **Built to run on a phone in a field.** The static half of every backdrop is
  baked once into an offscreen canvas and blitted; sprite variants are
  rasterised once and cached; limbs draw as spans rather than stamped discs;
  and the soundtrack stops when the tab is hidden. Together that is roughly
  60% fewer draw calls per frame than the naive version

---

## Related

Part of the Team_Aperture Kalibrierungsanlage series. R-3MI and V-TGM, their
colours and their two-language double act come from
[anlage-ii](https://github.com/Team-Aperture/anlage-ii); the badge follows the
house style of
[rundheitsprotokoll](https://github.com/Team-Aperture/rundheitsprotokoll).

## Disclaimer

Unofficial, non-commercial fan project. Not affiliated with, endorsed by or
sponsored by Geocaching HQ, Groundspeak, or any listing platform. All characters
and cache listings are fictional. Please cache responsibly, respect local rules,
and do not feed the Muggles.
