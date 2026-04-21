# Handoff: Pulse — Personal Health Tracker

## Overview

**Pulse** is a personal health tracker for Goran Babić — a 41y/o, 180cm, 107kg network engineer and recreational tennis player in ANZ — designed to support safe, sustainable weight loss (109.4 kg → 79 kg) via weight logging, full macro food logging, flexible-plan fasting, low-impact exercise tracking, progress photos, and a projection roadmap that recalculates live against a chosen weekly pace (0.5 / 0.75 / 1.0 kg/wk).

Primary surfaces: **mobile** (iPhone 393×852, bottom-tab nav, 7 screens) and **web** (1240px, side-nav, 6 sub-pages). Both are designed to be built as a single responsive React app.

## About the Design Files

The files in this bundle are **design references created as a single HTML prototype** (`Pulse Health Tracker.html`) wrapping a set of inline-Babel JSX modules. They are **not production code to copy verbatim** — they use CDN React/Babel, no build step, no routing, no persistence, and mock data in `data.jsx`.

**Your job**: recreate these designs in the target codebase's existing environment (React + Vite/Next, React Native, SwiftUI, etc.) using its established patterns — routing, state (Redux/Zustand/Context), forms, API layer, and component library. If no environment exists yet, **use React + Vite + TypeScript + Tailwind** (or the app's preferred CSS solution); it's the closest match to the prototype's idiom.

Match the visual design pixel-for-pixel. Re-architect the code.

## Fidelity

**High-fidelity.** Pixel-perfect mockups with final colors, typography, spacing, shadows, radii, hover states, micro-interactions, and copy. Use the exact tokens in `src/tokens.css`. The roadmap's three variations (A linear timeline, B trajectory arc, C milestone cards) are all final designs — pick one as the default and expose the others as user-selectable views, or ship just one based on user testing.

## Design System

This app is built on the **Socket Atlas Design System** — an Airbnb-inspired internal system. Full token file at `src/tokens.css`; key rules:

- **Canvas** pure `#ffffff`; no off-white body tint. Hairlines (`1px solid #ebebeb`) do the dividing work.
- **Rausch Red** `#ff385c` is the ONLY brand accent — used sparingly on primary CTAs, risk fills, favorite hearts, key wordmark accent. Never on general links, never on selection highlights (selection uses **dark border**, `1.5px solid #222222`).
- **Text** `#222222` (never pure black). Muted `#6a6a6a`. Subtle `#b0b0b0`.
- **Typography** Airbnb Cereal VF at 500/600/700 (substitute Inter from Google Fonts — it's what the prototype uses). Signature **negative letter-spacing of `-0.44px`** on display and card titles — non-negotiable, this is what makes it look "Airbnb".
- **Spacing** 8pt grid with 4pt half-steps. Card interior padding 12–16px. Section rhythm 32–48px.
- **Radii** 32px (hero tile) · 20px (cards) · 12px (inputs) · 8px (buttons) · 999px (pills).
- **Shadows** Three-layer system — NOT a single blur. See `tokens.css` `--sa-shadow-1/2/3`. Card hover lifts L1 → L2 + `translateY(-1px)` over 200ms.
- **Motion** `200ms` default, `cubic-bezier(0.2, 0, 0, 1)`. No bounces, no scale on UI chrome.
- **Focus** dark outline (`0 0 0 2px #fff, 0 0 0 4px #222`), never Rausch — red stays reserved for brand and risk.

## Screens / Views

### Mobile (7 screens, bottom-tab nav)

Tab bar is fixed-bottom, 5 items: **Home · Weight · Food · Fasting · Exercise**. Photos and Roadmap are reached from the Home dashboard.

#### 1. Dashboard (`MobileDashboard`)
- **Purpose**: Daily glance — where am I, what's left to eat today, is the fast running, what's next?
- **Layout**: Scrolling vertical stack inside a 393×852 safe area.
  - **Hero card** — greeting ("Morning, Goran"), today's weight `107.0 kg` with a **−2.4 kg since 1 Apr** badge (Rausch tint fill, Rausch text), progress ring around current weight showing ~8.6% of the way to 79 kg.
  - **Today's plan row** — 3 tiles: calories remaining, fasting hours remaining, next workout suggestion.
  - **Macros ring trio** — P / C / F radial progress rings with `current/target` numbers below.
  - **Quick log FAB row** — 4 chips: Log weight, Log food, Start/end fast, Log workout.
  - **Roadmap preview** — mini sparkline + "Est. 79 kg by early Nov 2026" CTA → opens full Roadmap.
- **Components**: `px-card`, `ProgressRing`, `px-pill`, `px-btn is-primary`.
- **Copy**: Neutral, declarative. "1,323 kcal left · 420 to go in fast · Tennis tonight, 18:30".

#### 2. Weight (`MobileWeight`)
- **Purpose**: Log weight, see trend, see projection.
- **Layout**:
  - **Big number** — current weight, 48/700 `-0.44px`.
  - **Delta row** — "−2.4 kg · 3 weeks" with Rausch text.
  - **Trend chart** (`WeightTrendChart`) — svg line chart, past 3 weeks solid, projection dashed to goal date, goal line hairline dashed. Y range = `goal − 2` to `start + 2`. X-axis shows month markers.
  - **Log list** — reverse-chron entries, each row: date · weight · delta-from-prev.
  - **Primary CTA** — "Log weight" bottom-fixed.

#### 3. Food (`MobileFood`)
- **Purpose**: Full P/C/F logging per meal.
- **Layout**:
  - **Top bar** — date picker (today default), kcal progress bar `eaten / target` with remaining badge.
  - **Macro trio** — 3 rings: Protein 75/160g, Carbs 96/165g, Fat 41/55g. Use `--sa-rausch` fill for remaining, hairline ring for track.
  - **Meal groups** — Breakfast · Lunch · Snack · Dinner. Each is a `px-card` with a meal header (time, kcal total) and entry rows (name · kcal · p/c/f meta).
  - **Add food FAB** — bottom-fixed primary button opens a search sheet (not prototyped — build as modal with recent + search).

#### 4. Fasting (`MobileFasting`)
- **Purpose**: Pick-per-day plan (16:8, 18:6, OMAD, custom). Start, view progress, end.
- **Layout**:
  - **Plan selector** — segmented control of 4 plans, selected shows dark border.
  - **Ring** — very large circular progress ring (280px), center shows elapsed hours `13:42` (50/800 `-0.44px`), below: "of 16:00 goal · on track".
  - **Start/End time row** — 2 inline fields.
  - **Primary CTA** — "End fast" (if active) / "Start fast" (if idle).
  - **History strip** — last 7 days as horizontal cards (plan · hours · ✓/✗).

#### 5. Exercise (`MobileExercise`)
- **Purpose**: Log workouts. Flag low-impact (user has "stone legs"; no running / soccer).
- **Layout**:
  - **Today** header with date.
  - **Impact filter** — 3 pills: All · Low · Medium (selected has dark border).
  - **Suggestion card** — Rausch-tint banner: "Tennis ✓ · Swim ✓ · Cycle ✓ · Running ✗ (stone legs)". Small copy.
  - **Log list** — entries: type · duration · kcal · impact dot (green low / amber med / red high).
  - **Primary CTA** — "Log workout".

#### 6. Photos (`MobilePhotos`)
- **Purpose**: Private body progress. Grid + side-by-side compare + before/after slider.
- **Layout**:
  - **Toggle** — "Grid · Compare · Slider".
  - **Grid view**: 2-col grid of square tiles, each `20px` radius, hairline border. Tile shows date and weight overlay bottom-left.
  - **Compare view**: 2 picker pills ("Before: 1 Apr" / "After: 21 Apr") → side-by-side tiles with delta banner below.
  - **Slider view**: full-bleed tile with a centered vertical drag handle (Rausch color) wiping between before/after.
  - **Primary CTA** — "Add photo".
- **Placeholders**: the prototype uses neutral silhouettes. Production uses user-uploaded photos, stored privately (local-first if possible; encrypted at rest if cloud).

#### 7. Roadmap (`MobileRoadmap`) — reached from Dashboard CTA
- **Purpose**: "If I stay on track, where will I be when?"
- **Layout**:
  - **Pace selector** — 3 pills: `0.5 kg/wk · 0.75 · 1.0` (default 1.0 per user). Changing pace recalculates dates and all downstream milestones live.
  - **Summary card** — "At 1.0 kg/wk, you'll hit 79 kg in **~28 weeks** — early Nov 2026." Bold date in Rausch.
  - **Timeline stops** (Variation A, user-picked) — vertical timeline:
    - Baseline · 1 Apr 2026 · 109.4 kg · ✓ done
    - Today · 21 Apr 2026 · 107.0 kg · current (Rausch dot)
    - 25% milestone · date · weight · label
    - 50% · · ·
    - 75% · · ·
    - Goal · 79.0 kg

### Web (desktop, 1240px)

Left sidebar (240px) with wordmark + 6 nav items: **Dashboard · Weight · Food · Fasting · Exercise · Photos · Roadmap**. Main column, 80px horizontal page padding.

#### Web Dashboard (`WebDashboard`)
Two-column hero:
- **Left (big)** — full `WeightTrendChart` at 720×240, with a Rausch delta badge top-right.
- **Right (meta)** — 3 stacked stat cards: BMI (25.9 · "just above healthy"), TDEE (`2,743 kcal/d`), Target kcal (`1,643`).

Below: a **3-tile row** (Today's kcal · Fasting · Next workout), an **inline mini-roadmap** (`InlineRoadmap`), and a **photo strip** of recent progress photos.

#### Web Weight (`WebWeight`), Food, Fasting, Exercise, Photos
Direct analogues of the mobile screens, laid out more generously. Chart grows to 1100×320. Food table uses 5 columns (name · kcal · P · C · F · time). Photos grid is 4-col.

#### Web Roadmap (`WebRoadmap`)
**Three variations to ship**:
- **A · Timeline** (`RoadmapTimeline`) — horizontal line with 6 nodes (Baseline / Today / 4 milestones / Goal). Dates above, weights below. Rausch accents for Today + Goal. **Default view per user.**
- **B · Trajectory arc** (`RoadmapArc`) — large SVG arc from start to goal, dots on the arc mark milestones, path is split into traveled (solid Rausch) and projected (dashed).
- **C · Milestone cards** (`RoadmapStack`) — vertical stack of milestone cards, each a `px-card` with date · weight · label · status (done / current / upcoming).

All three share the same data (`buildMilestones`) and respond to the same pace pills. Build them as 3 React components switched by a segmented control at the top of the page.

## Interactions & Behavior

- **Pace pills on Roadmap** — click to switch between 0.5 / 0.75 / 1.0 kg/wk. All milestones recompute dates (`buildMilestones` in `data.jsx`) with 200ms cross-fade on the numbers.
- **Log buttons (weight / food / fasting / workout)** — open modal sheets (bottom-sheet on mobile, centered modal on web). Validate inputs, save to local state, update all dependent calculations.
- **Card hover (web)** — shadow L1 → L2, `translateY(-1px)`, 200ms `cubic-bezier(0.2, 0, 0, 1)`.
- **Pill hover** — fill `#f7f7f7`, border unchanged.
- **Button hover** — primary darkens `#ff385c → #e31c5f`. Press `→ #d70466` (no shrink).
- **Photo slider drag** — pointer-drag the vertical handle between 0% and 100%; handle has Rausch fill and a 4px arrows glyph.
- **Trend chart** — hovering a dot shows a dark tooltip with date + weight. Projection line is dashed (`stroke-dasharray: 4 4`); goal line hairline dashed.
- **Empty states** — one neutral sentence + one underlined action link. E.g. "No photos yet. Add your first."
- **Focus rings** — always dark (`0 0 0 2px #fff, 0 0 0 4px #222`), never Rausch.
- **No emoji anywhere.** Only `·` (middot) and `→` (right arrow) are permitted non-alphanumeric glyphs.

## State Management

Recommended shape (use whatever the target app already has — Zustand/Redux/Context all fine):

```ts
interface AppState {
  user: {
    name: string; dob: string; heightCm: number;
    startWeight: number; startDate: string;   // baseline (1 Apr, 109.4)
    goalWeight: number;                        // 79.0
    activityFactor: number;                    // 1.375 lightly active
    conditions: string[];                      // ['Prefer low-impact', 'No running / soccer']
  };
  weightLog: Array<{ date: string; kg: number }>;
  foodLog: Array<{ id: string; date: string; meal: 'Breakfast'|'Lunch'|'Snack'|'Dinner';
                   time: string; name: string; kcal: number; p: number; c: number; f: number }>;
  fasting: {
    active: boolean; startedAt: string | null; plan: '16:8'|'18:6'|'OMAD'|'custom'; goalHours: number;
    history: Array<{ date: string; plan: string; hours: number; completed: boolean }>;
  };
  exerciseLog: Array<{ id: string; date: string; type: string; minutes: number;
                       kcal: number; impact: 'low'|'med'|'high' }>;
  photos: Array<{ id: string; date: string; weightKg: number; uri: string /* private */ }>;
  prefs: {
    paceKgPerWeek: 0.5 | 0.75 | 1.0;  // default 1.0
    fastingPlanDefault: '16:8' | '18:6' | 'OMAD';
  };
}
```

Derived values (compute, don't store):
- `currentWeight = weightLog.at(-1).kg`
- `lostKg = startWeight - currentWeight`
- `progressPct = lostKg / (startWeight - goalWeight)`
- `bmi = kg / (m*m)`
- `bmr` via Mifflin–St Jeor; `tdee = bmr * activityFactor`
- `targetKcal = tdee - (paceKgPerWeek * 7700 / 7)` (1 kg fat ≈ 7,700 kcal)
- `projectedGoalDate = startDate + ceil((startWeight − goalWeight) / paceKgPerWeek) weeks`
- `milestones`: split delta into 4 equal chunks; each chunk's date = `startDate + i * chunkWeeks`

All math in `src/data.jsx`; port to `src/lib/health.ts` in the target codebase.

## Design Tokens

See `src/tokens.css` for the full list. Key values:

**Color**
| Token | Value | Use |
|---|---|---|
| `--sa-bg` | `#ffffff` | canvas |
| `--sa-surface-alt` | `#f7f7f7` | hover tint |
| `--sa-fg` | `#222222` | primary text |
| `--sa-fg-muted` | `#6a6a6a` | meta |
| `--sa-fg-subtle` | `#b0b0b0` | tertiary |
| `--sa-divider` | `#ebebeb` | hairlines |
| `--sa-rausch` | `#ff385c` | brand accent, risk-critical, CTAs |
| `--sa-rausch-dark` | `#e31c5f` | primary hover |
| `--sa-rausch-tint` | `#fff0f3` | subtle fills |
| risk-high/moderate/low | `#f59e0b` / `#fbbf24` / `#16a34a` | macro / intensity dots |

**Typography** — Inter (or Airbnb Cereal VF when licensed), weights 500/600/700 only. `-0.44px` letter-spacing on display + card title sizes; 0 on body/meta. Scales:

| Size | Weight | Tracking | Use |
|---|---|---|---|
| 48 | 700 | -0.44 | hero numbers (weight display) |
| 32 | 700 | -0.44 | page titles |
| 24 | 600 | -0.44 | section titles |
| 16 | 600 | -0.44 | card titles |
| 14 | 500 | 0 | body |
| 13 | 500 | 0 | meta row |
| 11 | 600 | +0.5 UPPER | caption, modality pills |

**Spacing** — 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px.

**Radii** — 32 / 20 / 12 / 8 / 999.

**Shadows** — three literal layers (see `tokens.css` `--sa-shadow-1/2/3`). Don't collapse them into one blur.

**Motion** — `200ms cubic-bezier(0.2, 0, 0, 1)` default; `320ms cubic-bezier(0.2, 0.8, 0.2, 1)` for entering elements.

## Assets

- **Logo** — `src/` has no external logo; prototype uses an inline Rausch-red wordmark "Pulse" (200 level weight, negative tracking). Replace with the product's real logo in production.
- **Icons** — Lucide (MIT, CDN) at 1.5px stroke, rounded caps. Already the Airbnb-silhouette substitute used across the prototype. Install via `npm i lucide-react`.
- **Progress photos** — prototype uses neutral silhouettes. Production: user-uploaded. Store privately (local-first preferred; if cloud, encrypt at rest).
- **Fonts** — Inter from Google Fonts (prototype). Swap for Airbnb Cereal VF if licensed.

## Files

All files live under `src/` and `Pulse Health Tracker.html` at the root:

- `Pulse Health Tracker.html` — the loader (canvas + React/Babel CDN scripts). Open in a browser to see all screens on one canvas.
- `src/tokens.css` — design tokens.
- `src/health.css` — app-level styles (`px-card`, `px-btn`, `px-pill`, `px-mob`, etc.).
- `src/data.jsx` — seed data (USER, WEIGHT_LOG, FOOD_TODAY, FASTING, EXERCISE_LOG, PHOTOS) + health math (`bmi`, `bmr`, `tdee`, `projectTimeline`, `buildMilestones`).
- `src/components.jsx` — shared: `WeightTrendChart`, `ProgressRing`, `Icon`, `PhotoTile`, etc.
- `src/mobile.jsx` — all 7 mobile screens as components.
- `src/web.jsx` — web dashboard + sub-pages + 3 roadmap variations.
- `src/ios-frame.jsx` — iPhone chrome for the canvas (cosmetic — discard in production).
- `src/design-canvas.jsx` — canvas wrapper (discard in production).

## Build recommendations

1. **Scaffold** — `npm create vite@latest pulse -- --template react-ts`. Add Tailwind if preferred, or keep vanilla CSS with `tokens.css` imported globally.
2. **Port tokens first** — copy `tokens.css` to `src/styles/tokens.css`, import in `main.tsx`. Do NOT modify values.
3. **Port the health math** — `data.jsx` → `src/lib/health.ts` with typed signatures. Unit-test `projectTimeline` and `buildMilestones`.
4. **Port shared components** — `WeightTrendChart` (SVG, no lib needed), `ProgressRing`, icons (swap to `lucide-react`).
5. **Build screens** — mobile first (it's the hero flow), each as a route (`/`, `/weight`, `/food`, `/fasting`, `/exercise`, `/photos`, `/roadmap`). Use React Router or Next.js app router.
6. **State & persistence** — Zustand + `persist` middleware backed by `localStorage` (or the platform's secure storage for photos).
7. **Add real data layer later** — stub an API interface; wire to a backend when ready. Don't block UI on it.

## Open questions / gotchas

- **Units** — prototype is metric (kg, cm, kcal). If shipping to users who prefer imperial, add a Settings toggle.
- **Photo privacy** — spec says private. On-device only is simplest; if syncing, add encryption + explicit consent.
- **Medical disclaimer** — this is a personal tool; add "Not medical advice. Consult a clinician before aggressive deficit" on the Roadmap page when the 1.0 kg/wk pace is active.
- **Safe-area** — mobile screens are designed at 393×852; respect iOS safe areas for notch/home indicator, and Android gesture bars.
- **Accessibility** — all interactive elements need 44px min hit area, visible dark focus rings, AA contrast (the palette complies), reduced-motion respected on all 200ms transitions.
