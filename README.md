# Hydrafy

A water-tracking React Native + Expo app with a tiny droplet buddy named **Drip**
that morphs with your hydration. Runs entirely on-device — no accounts, no
backend.

Built from a Claude Design handoff. See "Design fidelity" below for the small
places this implementation diverges from the original brief.

## Setup

```bash
# 1. Install
npm install
# or
yarn install

# 2. Run on a device or simulator
npx expo start
#  → press i for iOS simulator
#  → press a for Android emulator
#  → or scan the QR with Expo Go on a physical phone
```

> **Notifications + the Expo Go limitation.** Local notifications work in Expo
> Go on Android but on iOS require a development build since SDK 53. If you
> want to test reminders end-to-end on iOS, run:
>
> ```bash
> npx expo run:ios     # builds a dev client
> ```

## What's implemented

### Onboarding (10 screens)
1. **Splash** — gradient + mascot intro
2. **Mascot intro** — buddy says hi
3. **Name your buddy** — text input + 5 chip suggestions
4. **Weight** — slider with kg / lbs toggle
5. **Activity** — Low / Medium / High cards
6. **Climate** — Cool / Moderate / Hot tiles
7. **Wake & sleep times** — native time picker
8. **Daily-goal reveal** — animated total + breakdown
9. **Notification permission** — requests `expo-notifications` perms
10. **All set** — confetti, finishes onboarding flag

All onboarding data is persisted to AsyncStorage. The flow is skipped on every
subsequent launch (see `@hydrafy/onboarded`).

### Core app
- **Home (Today)** — mascot inside a progress ring, % + ml readout, three
  quick-add tiles (250 ml / 500 ml / custom), today's entries with
  long-press-to-remove.
- **Custom amount** — bottom-sheet modal with slider + preset chips (50 → 1 000 ml).
- **Weekly history** — 7-day mini mascots, % per day, bar view.
- **You vs last week** — head-to-head mascots, side-by-side metric table.
- **Streaks & unlocks** — current streak card, wardrobe milestone grid, link to
  the wardrobe.
- **Wardrobe** — try on any unlocked cosmetic and save it as Drip's look.
- **Settings** — edit daily goal manually, toggle units (ml / oz), toggle
  reminders, pause for today, reset all data (confirm dialog).
- **Over 120 % / 150 % modals** — fire once per upward crossing.
  150 % copy references hyponatremia and offers a 2-hour pause.
- **Tip unlock modal** — surfaces a fresh tip at each 25 / 50 / 75 / 100 %
  milestone hit each day.

### Logic
- **Goal calc** (`src/utils/goal.js`):
  ```
  base   = weight_kg × 33 ml
  goal   = base × (1 + activityBoost + climateBoost)
  ceiling = 3 500 ml          // more isn't better
  ```
  Boosts: medium activity +10 %, high +20 %, hot climate +10 %.
- **Streak**: increments when crossing 100 % today *and* yesterday was also a
  hit; otherwise resets to 1.
- **Cosmetic unlocks**: 3-day Petal, 7-day Scarf, 14-day Cap, 30-day Crown,
  60-day Shades. Earned items appear in Wardrobe.
- **Reminders** (`src/hooks/useReminders.js`): schedules a notification every
  90 min between wake and sleep, picks copy based on whether you're behind /
  on track / ahead. Auto-cancels remaining reminders once the goal is hit.
- **Tips** (`src/utils/tips.js` + `src/constants/tips.js`): 30 hand-written
  tips bucketed into 25 / 50 / 75 / 100 % milestone tiers. Each milestone hit
  per day surfaces one fresh-or-recycled tip.

## Project structure

```
src/
├─ components/        // Mascot, Button, Card, Chip, ProgressRing,
│                    // LiquidFill, QuickAddTile, Dots, Icons, Text, …
├─ constants/         // colors (tokens), tips (30 tips), cosmetics
├─ hooks/             // useReminders
├─ navigation/        // RootNavigator (onboarding gate, tabs, modals)
├─ screens/
│  ├─ onboarding/     // 10 onboarding screens
│  ├─ Home.js
│  ├─ CustomAmount.js
│  ├─ History.js
│  ├─ VsLastWeek.js
│  ├─ Streaks.js
│  ├─ Wardrobe.js
│  ├─ Settings.js
│  ├─ Over120Warning.js
│  ├─ Over150Warning.js
│  └─ TipUnlock.js
├─ state/             // Zustand store (single source of truth)
├─ storage/           // AsyncStorage wrapper with namespaced keys
└─ utils/             // goal, date, tips, mascot state
App.js                // bootstraps fonts + hydrates store
index.js              // Expo entry
```

## State management — why Zustand

The brief left it to me. I picked **Zustand** for these reasons:

- **No provider hell.** A single `useStore(selector)` reads any slice; you
  don't have to compose 6 Context providers around `<App />`.
- **Cheap re-renders.** Selectors only trigger updates when the picked slice
  changes — important when the same state powers the mascot, ring, readout,
  and reminders simultaneously.
- **Tiny.** ~1 kB gzipped. The whole store is one file (`src/state/store.js`).
- **AsyncStorage is hand-rolled per slice** (see `src/storage/storage.js`)
  rather than via `zustand/middleware/persist`. This keeps the on-disk schema
  stable across rebuilds and avoids accidentally wiping unrelated namespaced
  keys.

## AsyncStorage schema

All keys are namespaced under `@hydrafy/`.

| Key                              | Shape                                                                    |
|----------------------------------|--------------------------------------------------------------------------|
| `@hydrafy/onboarded`             | `'true'`                                                                 |
| `@hydrafy/profile`               | `{ name, weightKg, weightUnit, activity, climate, wakeTime, sleepTime, createdAt }` |
| `@hydrafy/settings`              | `{ goalMl, displayUnit, remindersOn, pausedUntil }`                      |
| `@hydrafy/log/<YYYY-MM-DD>`      | `{ date, entries:[{id,ts,ml,kind}], totalMl, goalMl, pct, unlockedTipsToday:[] }` |
| `@hydrafy/history`               | `{ days: { 'YYYY-MM-DD': { totalMl, goalMl, pct, mascotState } } }` (last 60d cache) |
| `@hydrafy/streak`                | `{ current, longest, lastHitDate }`                                      |
| `@hydrafy/cosmetics`             | `{ ownedIds:[], wornId\|null }`                                          |
| `@hydrafy/tipsSeen`              | `[tipId, …]`                                                             |

## Mascot state machine

```
Hydration %        State           Vibe
─────────────────────────────────────────────────
   0 –  25         tired           droopy, dull, half-lidded eyes
  26 –  60         waking          neutral mouth, blush returning
  61 –  99         happy           smile, blush, faint sparkles
 100 – 119         glow            halo, big smile, max sparkles
 120 – 149         bloated         queasy mouth, sweat drops, coral wash
 150+              bloated_strong  X-eyes, deep coral wash
```

The mascot is a single SVG that morphs across the entire range with continuous
parameters (fill colors, eye openness, mouth path, blush, sparkles, body
squish, halo). State is just a bucketed label used for analytics / history.

## Design fidelity — where I diverged from the brief

- **Mascot is SVG, not Lottie.** The design ships a parameter-driven SVG
  droplet that morphs continuously across all hydration values. Replacing it
  with 5 discrete Lottie files would lose that continuous behaviour, so I
  ported the SVG directly via `react-native-svg`. If you want true Lottie
  later, install `lottie-react-native` and replace the `<Svg>` tree in
  `src/components/Mascot.js`. Keep the `pct` / `accessory` / `size` props the
  same and the rest of the app just works.
- **Goal ceiling 3 500 ml**, not 4 000 ml — matches the value shown on the
  design's Goal Reveal screen.
- **Base 33 ml/kg**, not 35 — matches the design's example math
  (`68 kg × 33 ml = 2 244 ml`).

Everything else (palette, type, component styles, screen layouts, mascot
states, onboarding copy) mirrors the design.

## Known TODOs

- **History export** — the Settings row exists but isn't wired up yet.
  Stub for a CSV writer + share-sheet hand-off.
- **Wake/sleep edit in Settings** — the row shows the current window but
  doesn't open the time picker yet.
- **App icon + splash assets** — `assets/icon.png` and `assets/splash.png`
  are referenced in `app.json` but not committed. Drop in your own or replace
  with Drip art.
- **Drag-to-reorder log entries** — currently only long-press to delete.
- **Tip card on Home** — the design shows an in-line tip card. v1 surfaces
  tips via the unlock modal only; in-line card is straightforward to add.

## v2 roadmap

- **Supabase-backed leaderboard** (opt-in). Local profiles stay local; only
  daily totals + a chosen handle sync.
- **Apple Health / Google Fit sync** for water intake (read + write).
- **Custom drink types** with caffeine / sugar / volume adjustments —
  e.g., "Coffee · 250 ml · counts as 200 ml hydration".
- **Apple Watch companion** — complication with current % + a one-tap log.
- **Home-screen widget** (iOS + Android) — same complication, big & small.
- **Hydration ML coach** — train a small on-device model on a user's
  drinking pattern and suggest personalized reminder timing.

## Credits

- Design exported from Claude Design (`claude.ai/design`).
- Fonts via `@expo-google-fonts`: Sora, Plus Jakarta Sans, JetBrains Mono.
- Icons hand-built to match the design's 22 px / 1.8 stroke / rounded set.
