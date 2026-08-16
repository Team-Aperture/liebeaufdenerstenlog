# Liebe auf den ersten Log 💗🧭

**Ein chaotisches Geocaching-Datingspiel / A chaotic geocaching dating sim**

A small, standalone bilingual pixel-art visual novel about suspicious coordinates, excellent snacks and finding love where the satellite reception is worst.

## Play locally

No build step or dependencies are needed. Open `index.html` directly, or serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## GitHub Pages

This repository includes a Pages workflow in `.github/workflows/pages.yml`.

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Push to `main` (or run the workflow manually).

The workflow uploads the repository as a static Pages artifact and deploys it. If your default branch has another name, update the branch in the workflow trigger.

## Features

- German and English story text with a persistent language toggle
- Three cache-themed romance routes, branching choices and multiple endings
- Affection and log-quality stats, autosaved progress and restart
- Responsive keyboard, touch and mouse controls
- Code-drawn Canvas pixel art, CSS hearts and optional tiny WebAudio bleeps
- No frameworks, packages, external fonts, images or other assets

## Controls

Choose an answer by clicking/tapping it, or with <kbd>1</kbd>–<kbd>3</kbd>. Press <kbd>Enter</kbd> or <kbd>Space</kbd> to advance ordinary dialogue. Toggle sound and language from the top toolbar. Progress is saved automatically in `localStorage`.

## Disclaimer

This is an unofficial, non-commercial fan project made with affection for geocaching culture. It is not affiliated with, endorsed by, or sponsored by Groundspeak, Geocaching HQ, or any listing platform. All characters and cache listings are fictional. Please cache responsibly, respect local rules, and do not feed the Muggles.
