# Veritrix Frontend

Vite + React + TypeScript dashboard for the AgentOps observability platform. This is a rebuild of the legacy Next.js frontend (`frontend/`) using a client-side SPA architecture.

## Tech stack

| Layer | Technology |
|---|---|
| Build tool | [Vite](https://vite.dev/) 8 |
| UI | React 19 + TypeScript |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui patterns (Radix primitives) |
| Auth | Clerk (`@clerk/react`) |
| Charts | Recharts |
| Package manager | pnpm |

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+
- AgentOps backend running locally (optional — see [Design mode](#design-mode))

## Getting started

```bash
cd frontend-new
pnpm install
cp .env.example .env
pnpm dev
```

The dev server starts at [http://localhost:5173](http://localhost:5173).

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | AgentOps App API (trace queries, settings) |
| `VITE_INGEST_URL` | `http://localhost:8001` | Ingest API URL (shown in SDK setup snippets) |
| `VITE_DESIGN_MODE` | `true` | Use mock data and skip Clerk auth |
| `VITE_CLERK_PUBLISHABLE_KEY` | — | Clerk publishable key (required when design mode is off) |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Type-check and produce a production build in `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run oxlint |

## Design mode

Set `VITE_DESIGN_MODE=true` to develop the UI without a running backend or Clerk account. In this mode:

- Auth guards are bypassed
- API calls are served from mock data in `src/lib/mock-*.ts`
- No `VITE_CLERK_PUBLISHABLE_KEY` is required

To connect to a real backend, set `VITE_DESIGN_MODE=false`, add your Clerk key, and start the backend services (see [`backend/README.md`](../backend/README.md)).

## Backend integration

The dashboard talks to two backend services:

| Service | Port | Used for |
|---|---|---|
| App API | 8000 | Traces, agents, metrics, org settings |
| Ingest API | 8001 | SDK setup / API key references |

All HTTP calls go through `src/lib/api.ts`. Components should not call the backend directly.

## Project structure

```
src/
├── pages/              # Route-level page components
├── components/
│   ├── auth/           # Clerk sign-in/up, auth guards
│   ├── dashboard/      # Shell, sidebar, shared layout
│   ├── traces/         # Trace list, filters, metrics
│   ├── trace-detail/   # Waterfall, tree, span drilldown
│   ├── metrics/        # Metrics overview charts
│   ├── settings/       # API keys, billing panels
│   ├── get-started/    # SDK onboarding flow
│   └── ui/             # Reusable primitives (button, card, tabs, …)
├── lib/
│   ├── api.ts          # Typed fetch wrappers for the App API
│   ├── types.ts        # Shared TypeScript types
│   ├── design-mode.ts  # Design mode flag helper
│   └── mock-*.ts       # Mock data for design mode
└── hooks/              # Shared React hooks
```

Path aliases: `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Routes

| Path | Page |
|---|---|
| `/projects` | Project dashboard (default) |
| `/get-started` | SDK installation wizard |
| `/traces` | Trace list |
| `/traces/:traceId` | Trace detail (waterfall, tree, agents) |
| `/metrics` | Metrics overview |
| `/mcp` | MCP integration docs |
| `/settings` | Org settings, API keys, billing |
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |
| `/welcome` | Post-signup onboarding |

## Clerk organization billing

Billing is owned by Clerk Organizations. In the Clerk Dashboard:

1. Enable **Billing for Organizations**.
2. Use Clerk's development payment gateway for the development instance.
3. Create publicly available organization plans with the slugs `hobby` and `pro`.
4. Add plan features and prices in Clerk; the frontend reads them from Clerk's pricing table.
5. Connect the production Clerk instance to the production Stripe account.

Clerk is the billing system of record. Stripe is connected through Clerk only; the app does not
create Stripe Checkout or Customer Portal sessions.

## Production build

```bash
pnpm build
```

Output is written to `dist/`. Serve it with any static file host, or run `pnpm preview` to test locally. Ensure the production environment sets `VITE_API_URL`, `VITE_INGEST_URL`, `VITE_CLERK_PUBLISHABLE_KEY`, and `VITE_DESIGN_MODE=false`.
