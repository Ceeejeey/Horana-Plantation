# Horana Plantations — Monorepo

Turborepo monorepo with a React web app, Firebase Cloud Functions backend, and Firestore database.

## Structure

```
apps/web/              # React + Vite frontend
packages/functions/    # Firebase HTTPS Functions (Express API)
packages/shared/       # Shared types & API client
```

## Prerequisites

- Node.js 20+
- Firebase CLI (`npm i -g firebase-tools` or use `npx firebase`)
- A Firebase project (update `.firebaserc` with your project id)

## Setup

```bash
npm install
cp .env.example .env
# Set GEMINI_API_KEY in packages/functions/.env when using the Functions emulator
```

### Release gate (Coming Soon vs live app)

Firestore document **`appConfig/release`** controls visibility:

| Field | Value | Result |
|-------|-------|--------|
| `released` | `false` | Coming Soon page |
| `released` | `true` | Full annual report app |

**Create in Firebase Console:** Firestore → `appConfig` collection → document `release` → boolean field `released`.

Or use the release scripts (requires **`firebase login`** once — global CLI install alone is not enough):

```bash
firebase login          # one-time, in any terminal
firebase login:list     # verify you are logged in

# Site live — full app
npm run release:on

# Back to coming soon
npm run release:off

# Check current flag
npm run release:status
```

If login still fails, download a service account key from Firebase Console → Project settings → Service accounts, save as `firebase-service-account.json` in the project root (gitignored).

With Firestore emulator running:

```bash
npm run release:on:emu
npm run release:off:emu
```

The web app listens to Firestore in real time; toggling `released` updates the UI without redeploying.

## Development

**Terminal 1 — Firebase emulators (API + Firestore):**

```bash
npm run build --workspace=@horana/shared
npm run build --workspace=@horana/functions
npx firebase emulators:start --only functions,firestore
```

**Terminal 2 — Web app (proxies `/api` → functions emulator):**

```bash
npm run dev --workspace=@horana/web
```

Open http://localhost:3000

Or run everything via Turbo (web only; start emulators separately):

```bash
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all `dev` tasks (Turbo) |
| `npm run build` | Build all packages |
| `npm test` | Run Jest across workspaces |
| `npm run lint` | Typecheck all packages |
| `npm run firebase:deploy` | Deploy Hosting, Functions, Firestore rules |

## Deploy (Firebase)

Project: **`annual-report-hpl`** (see `.firebaserc`).

### One-time setup

```bash
npm install
cp .env.example .env                    # Vite / Firebase web config (build time)
cp packages/functions/.env.example packages/functions/.env.annual-report-hpl
# Edit GEMINI_API_KEY in packages/functions/.env.annual-report-hpl

firebase login
firebase use annual-report-hpl
```

### Deploy everything (Hosting + Functions + Firestore rules)

```bash
npm run firebase:deploy
```

This script builds the monorepo, deploys, then runs live smoke tests against  
`https://annual-report-hpl.web.app`.

| Command | Deploys |
|---------|---------|
| `npm run firebase:deploy` | hosting + functions + firestore |
| `npm run firebase:deploy:hosting` | web app only |
| `npm run firebase:deploy:functions` | API only |
| `npm run firebase:deploy:firestore` | rules + indexes |
| `npm run firebase:test:live` | smoke tests only (no deploy) |

### What gets deployed

- **Hosting** → `apps/web/dist` (built automatically via `firebase.json` predeploy)
- **Functions** → `packages/functions` Express app as HTTPS function `api`
- **Rewrites** → `/api/**` on Hosting proxied to `api` function
- **Firestore** → `firestore.rules`, `firestore.indexes.json`

Live URLs:

- Site: https://annual-report-hpl.web.app  
- Health: https://annual-report-hpl.web.app/api/health  

If `firebase login` expires, run `firebase login --reauth` before deploy.

### Functions first-time setup (required once per GCP project)

If deploy fails with `gcf-admin-robot` or “App Engine instance”:

1. Open [Google Cloud App Engine](https://console.cloud.google.com/appengine?project=annual-report-hpl)
2. **Create Application** (region e.g. `us-central`), accept terms
3. Wait ~5 minutes, then: `npm run firebase:deploy:functions`

Until Functions deploy, the site loads but `/api/*` returns 404. The web app still works via **Firestore** for the release gate.

### Verify production

```bash
npm run firebase:test:live
```

Expected when fully deployed:

- ✓ `https://annual-report-hpl.web.app/` — SPA  
- ✓ `.../api/health` — `{ "status": "ok" }`  
- ✓ `.../api/app/release-status` — `{ "released": boolean }`

## Environment

| Variable | Where | Purpose |
|----------|-------|---------|
| `GEMINI_API_KEY` | Functions | Gemini AI chat |
| `VITE_API_BASE_URL` | Web | API base (empty = same origin via Hosting rewrite) |

## Testing

```bash
npm test
```

Jest is configured per package and aggregated at the repo root via `jest.config.ts`.
