# ENGI-MART

AI-assisted component discovery and local price optimization for engineering students — starting with the electronics shops of SP Road, Bengaluru.

Paste a parts list (or describe a project), get matched components, compare a **Fastest** single-shop plan against a **Cheapest** two-shop plan, and carry a mobile run sheet around the market. Prices and shop details in this repo are **seeded demo data**, not live quotes.

**Current state:** pilot-ready demo, live database-backed sessions working end to end. See [`PLAN.md`](PLAN.md) for the verified state, remaining milestones, and the resume checklist.

## Stack

- Next.js 16 (App Router, `cacheComponents`) · React 19 · TypeScript strict
- Tailwind v4 · Base UI · lucide-react
- Neon Postgres · Drizzle ORM
- Vitest · Playwright
- Deploy target: Netlify (`netlify.toml`)

## Quick start

```bash
pnpm install
cp .env.example .env    # fill in the Neon connection strings

pnpm db:push            # create/sync the schema
pnpm db:seed            # seed the SP Road demo catalog

pnpm dev                # http://localhost:3000
```

Prefer a local database? `docker compose up -d db` starts Postgres 17 on `5432`; point `DATABASE_URL` at `postgresql://postgres:postgres@localhost:5432/engimart`.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Pooled Neon connection used by the app |
| `DATABASE_URL_UNPOOLED` | For migrations | Direct Neon connection used by `drizzle-kit` |
| `AI_PROVIDER` | No | `mock` (default) selects the deterministic local provider |
| `NEXT_PUBLIC_APP_URL` | No | Absolute app URL used in metadata/links |

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest unit + API integration tests (needs `DATABASE_URL`) |
| `pnpm db:push` | Push the Drizzle schema (local iteration) |
| `pnpm db:seed` | Seed shops, families, variants, listings, observations |
| `pnpm db:verify` | Run the canonical 7-line BOM verification script |
| `pnpm netlify:patch` | Patch a manual Netlify function deploy |

Browser QA (dev server + seeded DB required):

```bash
node .qa-integration.mjs
node .qa-visual.mjs
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Start form: paste a BOM or describe an idea |
| `/b/demo` | Static demo bench sheet |
| `/b/demo/plans` | Static demo Fastest vs Cheapest |
| `/b/demo/run` | Static demo run sheet |
| `/b/[viewId]` | Live bench sheet for a created session |
| `/b/[viewId]/plans` | Live plan comparison |
| `/b/[viewId]/run` | Live run sheet (`?plan=fastest\|cheapest`) |
| `/method`, `/legal` | Method notes and limitations |
| `GET /api/health` | DB health probe |
| `GET /api/catalog/search` | Catalog search + impression logging |
| `POST /api/sessions` | Create a session from BOM text or an idea |
| `GET/PATCH /api/sessions/[viewId]` | Public session read / token-gated update |
| `GET /api/sessions/[viewId]/run-sheet` | Compiled offline job card |
| `POST /api/sessions/[viewId]/feedback` | 3-tap post-trip feedback |

Session edit tokens are returned once on creation and stored in `localStorage` as `engi-mart:edit:<viewId>`.

## Architecture

```text
src/
  app/            routes + API handlers (App Router)
  components/     start form, route ladder, header/footer, theme toggle
  core/           pure logic: normalize, match confidence, compatibility, optimizer
  db/             Drizzle schema, connection, catalog queries
  lib/            AI provider, mock demo data, tokens, validation, formatting
  server/         DB-backed workspace loader
scripts/          seed + canonical verification
test/             core unit tests + API integration tests
```

## Limitations

- All shops, prices, phone numbers, and stock are seeded demo data. No reservations, checkout, or payments.
- The catalog matcher leaves genuinely ambiguous input (`esp32`, `soil sensor`) unmatched; resolution UI is planned.
- Idea mode uses a deterministic mock provider.
- Run-sheet checkboxes are not yet persisted; no offline cache.
- Public session links are the access model; there is no auth.
- Visual QA so far is Chromium-only.

The forward plan, ordered milestones, and acceptance criteria live in [`PLAN.md`](PLAN.md).
