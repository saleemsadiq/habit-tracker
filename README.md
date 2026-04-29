# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built with Next.js, React, TypeScript, and Tailwind CSS. All data is persisted locally using localStorage — no backend or external database required.

---

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Vitest** for unit and integration tests
- **React Testing Library** for component tests
- **Playwright** for end-to-end tests
- **localStorage** for persistence

---

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn, note i used yarn installation because of my bad network since yarn gave me flexibility when downloading dependencies

### Installation

```bash
git clone https://github.com/YOUR-USERNAME/habit-tracker.git
cd habit-tracker
yarn install --ignore-engines
```

### Running the App

```bash
yarn dev
or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running the Tests

### Unit Tests (with coverage report)

```bash
yarn test:unit
you can also use npm to run the tests , you must only use yarn when installing dependencies since it has a package lock
```

### Integration Tests

```bash
yarn test:integration
```

### End-to-End Tests

Make sure the dev server is running first:

```bash
yarn dev
```

Then in a separate terminal:

```bash
yarn test:e2e
```

### Run All Tests

```bash
yarn test
```

---

## Coverage Report

Coverage is generated automatically when running `yarn test:unit`. The minimum threshold is 80% line coverage for files inside `src/lib/`. Current coverage is **96.87%**.

---

## Local Persistence Structure

All data is stored in the browser's localStorage using three keys:

### `habit-tracker-users`
Stores an array of registered users:
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "password": "plaintext",
    "createdAt": "2026-04-29T00:00:00.000Z"
  }
]
```

### `habit-tracker-session`
Stores the currently logged in user's session or null:
```json
{
  "userId": "uuid",
  "email": "user@example.com"
}
```

### `habit-tracker-habits`
Stores all habits across all users:
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Drink Water",
    "description": "Stay hydrated",
    "frequency": "daily",
    "createdAt": "2026-04-29T00:00:00.000Z",
    "completions": ["2026-04-29"]
  }
]
```

---

## PWA Support

The app is installable as a Progressive Web App:

- **`public/manifest.json`** — defines the app name, colors, icons and display mode
- **`public/sw.js`** — service worker that caches static assets and allows the app shell to load offline after first visit
- **Icons** — 192x192 and 512x512 PNG icons in `public/icons/`

The service worker uses a **network-first strategy** for page navigation (always tries the network, falls back to cache when offline) and a **cache-first strategy** for static assets.

The service worker is registered in `src/app/page.tsx` on the client side.

---

## Assumptions and Trade-offs

- **Passwords are stored in plaintext** in localStorage. This is intentional for this stage since there is no backend. In a real production app, passwords would be hashed on a secure server.
- **No token expiry** — sessions persist indefinitely until the user logs out.
- **Single frequency** — only daily habits are supported as specified in the requirements.
- **No pagination** — all habits are loaded and displayed at once.
- **Node.js version** — the project was developed with Node.js 23.9.0. The `--ignore-engines` flag may be needed during installation due to peer dependency version constraints.

---

## Test File Map

### Unit Tests — `tests/unit/`

| File | What it verifies |
|------|-----------------|
| `slug.test.ts` | `getHabitSlug` converts habit names to URL-friendly slugs, handles spaces, special characters and case |
| `validators.test.ts` | `validateHabitName` rejects empty names, names over 60 characters, and returns trimmed valid values |
| `streaks.test.ts` | `calculateCurrentStreak` counts consecutive days correctly, handles duplicates, gaps and empty arrays |
| `habits.test.ts` | `toggleHabitCompletion` adds and removes dates correctly, never mutates the original habit object |

### Integration Tests — `tests/integration/`

| File | What it verifies |
|------|-----------------|
| `auth-flow.test.tsx` | Signup creates a session, duplicate emails are rejected, login restores session, invalid credentials show error |
| `habit-form.test.tsx` | Empty name shows validation error, creating habit renders card, editing preserves immutable fields, delete requires confirmation, completion toggles streak |

### End-to-End Tests — `tests/e2e/`

| File | What it verifies |
|------|-----------------|
| `app.spec.ts` | Full user journeys in real Chromium browser — splash redirect, auth protection, signup, login, habit creation, completion, persistence after reload, logout, and offline app shell loading |

---

## Implementation Map

| Requirement | Implementation |
|-------------|---------------|
| Routes | `src/app/page.tsx`, `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/app/dashboard/page.tsx` |
| Auth logic | `src/lib/auth.ts` |
| localStorage | `src/lib/storage.ts` |
| Slug utility | `src/lib/slug.ts` |
| Validator | `src/lib/validators.ts` |
| Streak calculator | `src/lib/streaks.ts` |
| Habit toggle | `src/lib/habits.ts` |
| Constants | `src/lib/constants.ts` |
| Types | `src/types/auth.ts`, `src/types/habit.ts` |
| Components | `src/components/` |
| PWA | `public/manifest.json`, `public/sw.js`, `public/icons/` |
