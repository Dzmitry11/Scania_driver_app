# Scania Driver Companion

Scania Driver Companion is a privacy-first, non-diagnostic web app for Scania/TRATON truck drivers.
It supports quick shift check-ins and transforms self-reported inputs into trends and conservative
safety flags.

## Product Purpose

The app is designed to improve:
- fuel efficiency
- operational reliability
- road safety

It does this by supporting the most important variable in transport operations: the driver condition.

Driver fatigue, sleep quality, stress, and wellbeing influence driving behavior. Better condition
generally correlates with smoother driving, reduced wear, fewer incidents, and stronger customer trust.

## User Value (Driver Perspective)

The app enables drivers to complete short check-ins in under one minute:
- pre-shift
- mid-shift
- post-shift

From those check-ins, the app provides:
- personal trend visibility
- conservative, explainable safety flags
- documentation support for clinician/workflow reporting

The app does **not** provide diagnosis or treatment advice.

## Safety & Medical Boundaries

- Non-diagnostic only.
- No treatment guidance.
- No emergency triage decisions.
- Safety flags are documentation-oriented and conservative.
- Escalation language points users to safe next steps and healthcare professionals when appropriate.

## Privacy Model

- Data is stored locally in browser `localStorage`.
- No backend persistence in this project.
- No automatic cloud sync.
- Export is user-initiated only.
- Clear-all is user-initiated only.

## High-Level Architecture

The app is a client-side SPA (single-page application) built with React + Vite.

### Layers

1. UI Layer
- Page components in `src/pages`
- Shared layout/navigation in `src/components`
- Reusable primitives in `src/components/ui` (shadcn/ui)

2. Domain Layer
- Core types in `src/types/health.ts`
- Risk/signal computation logic in `src/lib/riskSignals.ts`
- Report translations in `src/lib/translations.ts`

3. Data Access Layer
- Local persistence functions in `src/lib/storage.ts`
- JSON serialization/deserialization wrappers around `localStorage`

4. App Shell & Routing
- Route setup in `src/App.tsx`
- Entry point in `src/main.tsx`

## Routing & User Flow

Defined in `src/App.tsx`:

- `Onboarding` gates first-time use.
- If profile is complete:
  - `/` -> Driver dashboard
  - `/log` -> Shift check-ins
  - `/vitals` -> Weekly vitals input/history
  - `/habits` -> Lifestyle habits logging
  - `/illness` -> Illness episode tracking
  - `/womens-health` -> Optional women’s health tracking
  - `/trends` -> Trends and safety flags
  - `/report` -> Exportable clinician-style report
  - `/profile` -> Driver profile and data management

## Core Modules

### `src/pages/Dashboard.tsx`
- Main home screen
- Shift check-in completion state (3/day)
- Safety flags summary
- Quick actions
- About dialog with Scania/TRATON value proposition

### `src/pages/DailyLog.tsx`
- Pre-shift, mid-shift, post-shift tabs
- Captures sleep/wellbeing/stress/symptoms/lifestyle indicators
- Stores logs by date

### `src/lib/riskSignals.ts`
- Computes conservative risk/safety signals from:
  - blood pressure trends
  - sleep/stress patterns
  - illness episode severity/temperature
  - major weight changes

### `src/pages/DoctorReportPage.tsx`
- Generates clinician-friendly report layout
- Uses translated labels (`src/lib/translations.ts`)
- Includes disclaimers and observed data summaries

### `src/lib/storage.ts`
- Centralized key/value access to browser storage
- Supports:
  - profile read/write
  - daily logs
  - vitals
  - habits
  - illness episodes
  - cycle entries
  - export and full reset

## Data Model (Summary)

Core interfaces live in `src/types/health.ts`:
- `UserProfile`
- `MorningLog`, `MiddayLog`, `EveningLog`
- `BloodPressureReading`
- `HabitLog`
- `IllnessEpisode` (+ symptom/temperature/medication entries)
- `CycleEntry`
- `RiskSignal`

## Local Storage Schema

Defined in `src/lib/storage.ts` via key map:
- `pma_profile`
- `pma_height_weight`
- `pma_morning_logs`
- `pma_midday_logs`
- `pma_evening_logs`
- `pma_bp_readings`
- `pma_habit_logs`
- `pma_illness_episodes`
- `pma_cycle_entries`

## UI/Design System

- Tailwind CSS tokenized theme in `src/index.css`
- Scania/Tegel-inspired color mapping and spacing choices
- shadcn/ui primitives for consistency and accessibility
- Mobile-first layout with fixed bottom navigation

## Project Structure

```text
src/
  App.tsx                     # Router and onboarding gate
  main.tsx                    # React bootstrap
  index.css                   # Theme tokens and global styles
  types/
    health.ts                 # Domain types
  lib/
    storage.ts                # localStorage persistence API
    riskSignals.ts            # Conservative signal engine
    translations.ts           # Report language strings
    utils.ts                  # Shared helpers
  components/
    AppLayout.tsx             # Common page shell
    BottomNav.tsx             # Main navigation
    Disclaimer.tsx            # Persistent safety disclaimer
    ui/                       # shadcn/ui building blocks
  pages/
    Onboarding.tsx
    Dashboard.tsx
    DailyLog.tsx
    WeeklyVitals.tsx
    HabitsPage.tsx
    IllnessEpisodePage.tsx
    WomensHealthPage.tsx
    TrendsPage.tsx
    DoctorReportPage.tsx
    ProfilePage.tsx
    NotFound.tsx
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install

```sh
npm install
```

### Run (development)

```sh
npm run dev
```

By default Vite uses the configured dev server options (or CLI overrides if passed).

### Build (production)

```sh
npm run build
```

### Preview production build

```sh
npm run preview
```

## Available Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - create production build in `dist/`
- `npm run build:dev` - build using development mode
- `npm run preview` - preview build output locally
- `npm run lint` - run ESLint
- `npm run test` - run Vitest once
- `npm run test:watch` - run Vitest in watch mode

## Non-Functional Notes

- Entirely client-side; no backend trust boundary in this repo.
- `localStorage` is simple and fast, but not secure for sensitive regulated data.
- Safety logic is intentionally conservative and explainable.
- Large bundle warnings are currently expected; code splitting can be improved later.

## Recommended Next Evolution

1. Add authentication and role-based access control for fleet operations.
2. Move storage to secure backend APIs with consent and audit trails.
3. Add configurable fleet-level dashboards with anonymized aggregates.
4. Introduce stricter clinical governance on signal rules and copy.
5. Add E2E tests for key driver journeys (onboarding, check-ins, report export).
