# Pulse — Personal Health Tracker

A single-user weight / food / fasting / exercise / photos / roadmap tracker, built as a static React app and hosted on GitHub Pages.

**Live:** https://gogi7.github.io/goranfitnesspersonal/

## Development

```bash
npm install
npm run dev
```

Open the URL Vite prints. Data is stored in `localStorage` (text) and IndexedDB (photo blobs) — everything is local to the browser.

## Build

```bash
npm run build
npm run preview
```

## Deploy

Push to `master` or `claude/build-github-pages-app-yxJCN`. GitHub Actions (`.github/workflows/deploy.yml`) builds the app and publishes `dist/` to GitHub Pages. First deploy requires enabling Pages in the repo:

1. Repo → **Settings → Pages**
2. Source: **GitHub Actions**

## Data

- **Text data** (weight, food, fasting, exercise, prefs, photo metadata) lives in `localStorage` under the key `pulse:v1`.
- **Photo blobs** live in IndexedDB under `pulse:photo:<id>` via `idb-keyval`.
- Backup/restore via **Settings → Backup** (exports everything except photo binaries).

Photos never leave the device.

## Source layout

```
src/
  main.tsx            entry
  App.tsx             responsive shell + routing
  styles/             tokens.css, health.css (from design handoff), app.css
  lib/                types, store, health math, IndexedDB wrapper
  components/         shared + forms
  routes/             Dashboard, Weight, Food, Fasting, Exercise, Photos, Roadmap, Settings
design/               original design handoff (reference only)
```

Design handoff lives in `design/design_handoff_pulse_health_tracker/`.
