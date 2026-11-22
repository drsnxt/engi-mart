# ENGI-MART — Plan to Completion

**Last verified:** 2026-11-22  
**Current state:** pilot-ready demo. Live DB-backed sessions work end to end; the app is not production-complete yet.  
**This file is the single forward plan.** The other `*_STATUS.md` files are historical snapshots, not task lists.

---

## 0. Resume here

```bash
git clone https://github.com/drsnxt/engi-mart.git
cd engi-mart
pnpm install
cp .env.example .env        # fill in the Neon pooled + unpooled URLs

pnpm db:push                # sync schema
pnpm db:seed                # seed SP Road demo catalog
pnpm dev                    # http://localhost:3000

pnpm typecheck && pnpm test && pnpm build   # must all pass
```

Then pick the first unchecked task in [Milestone 1](#milestone-1--baseline-hygiene--demo-consistency). Work top to bottom; each milestone leaves `main` green.

---

## 1. Verified state (2026-11-22)

| Area | State | Evidence |
| --- | --- | --- |
| Start form → session | **Working** | `POST /api/sessions`, edit token stored in `localStorage`, redirect to `/b/<viewId>` |
| BOM paste parsing | **Working** | `src/core/normalize.ts`; quantities and pack rounding tested |
| Idea → BOM | **Mock only** | `getAiProvider()` always returns `MockAiProvider` (`src/lib/ai/index.ts`) |
| Catalog matching | **Working, partial UX** | Alias/keyword matching; ambiguous rows stay unmatched with no resolution UI |
| Optimizer (fastest / cheapest) | **Working** | `src/core/optimizer.ts`; coverage, budget, walking, confidence |
| Live workspace / plans / run pages | **Working** | `/b/[viewId]`, `/b/[viewId]/plans`, `/b/[viewId]/run` |
| Run sheet API | **Working** | `GET /api/sessions/[viewId]/run-sheet` |
| Session editing | **API only** | `PATCH /api/sessions/[viewId]` exists; no edit UI and no re-match flow |
| Feedback | **API only** | `POST .../feedback` exists; no form on the run page |
| Substitutions | **Schema only** | `substitution_edge` / `substitution_override` unused; optimizer called with `allowSubstitutes: false` |
| Telemetry | **Partial** | Search impressions and unmatched queries write; `plan_selection` is unused |
| Static demo | **Working, inconsistent** | `/b/demo/run` ignores `?plan=`; demo plan/run shops disagree |
| Database | **Working** | 15 Drizzle tables; schema applied with `db:push`; no committed migrations |
| Tests | **12/12 passing** | `test/core.test.ts` (6), `test/api.test.ts` (6, live DB) |
| Typecheck / build | **Passing** | `tsc --noEmit` clean; `next build` produces 15 routes |
| CI | **Missing** | No `.github/workflows` |
| Offline run sheet | **Missing** | Checkbox state is in-memory; no service worker/manifest |
| Auth / rate limiting | **Missing (deliberate for pilot)** | Public `viewId` links are the access model |
| Visual QA | **Chromium only** | 1440/390/320 px pass; 200%-zoom-at-390 px header overflow open |

**Definition of done for the pilot:** a student can describe a project or paste a BOM, resolve ambiguous parts, edit the list, compare plans, open a truthful run sheet, check items off without losing state, submit feedback, and the whole flow runs on a public URL with reproducible deploys and green CI.

---

## Milestone 1 — Baseline hygiene & demo consistency

**Goal:** a clean clone is understandable and every demo page tells the same story.  
**Estimate:** 0.5–1 day

- [ ] Make `/b/demo`, `/b/demo/plans`, and `/b/demo/run` read from one source (`src/lib/mock-data.ts`), and make `/b/demo/run?plan=fastest|cheapest` select the matching plan.
- [ ] Reconcile demo shop names, totals, item counts, and walking times across plan cards and run sheet.
- [ ] Replace the create-next-app `README.md` with real setup, env, scripts, architecture, and docs index.
- [ ] Add `src/app/b/[viewId]/loading.tsx` and `error.tsx` (and demo equivalents if useful) so DB/network failures have a real state.
- [ ] Complete `.env.example` (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AI_PROVIDER`, `NEXT_PUBLIC_APP_URL`).
- [ ] Add a short "pilot limitations" section to `/method` covering seeded prices, no reservations, public links, no offline cache.

**Acceptance:** both demo plan links open the correct plan; demo data has no contradictions; README setup works from a fresh clone; no unhandled route errors.

---

## Milestone 2 — Close the session loop (edit + disambiguation)

**Goal:** users can fix a wrong or unresolved BOM instead of starting over.  
**Estimate:** 2–3 days

- [ ] Add an edit mode to `/b/[viewId]`: change raw text/qty, add and remove rows, edit budget and max stops.
- [ ] Wire `PATCH /api/sessions/[viewId]` with `X-Edit-Token` read from `engi-mart:edit:<viewId>`; show a clear read-only state when the token is absent or rejected (401).
- [ ] Re-run catalog matching for edited rows, persist `match_override` when a user replaces an automatic match, and re-solve plans after save.
- [ ] Add a disambiguation picker for `matchMethod: "ambiguous"` / unmatched rows: show catalog candidates, let the user confirm one, persist `userConfirmed` and `match_override`, and log unresolved strings to `unmatched_query`.
- [ ] Add API tests for edit authorization, re-match, and ambiguous resolution.

**Acceptance:** a token-holder can edit a live session, plans update immediately, ambiguous items become confirmed matches, and a token-less visitor sees a read-only sheet.

---

## Milestone 3 — Feedback loop & substitutions

**Goal:** the run sheet closes the data loop and the optimizer can offer alternatives.  
**Estimate:** 1–2 days

- [ ] Add the 3-tap feedback form to `/b/[viewId]/run` (found / not found, price paid, price sentiment, optional note) and POST it to the existing endpoint.
- [ ] Verify feedback appends a `price_observation` and updates the listing/confidence path; add a test for the round trip.
- [ ] Record `plan_selection` when a user chooses Fastest or Cheapest.
- [ ] Surface `substitution_edge` suggestions on unmatched or out-of-stock rows (`equivalent`, `pin_compatible`, `adapter_required`) with spec deltas.
- [ ] Allow the optimizer to consider substitutes behind a flag; log `substitution_override` when a user rejects one.
- [ ] Add compatibility warnings to substituted items (reuse `src/core/compatibility.ts`).

**Acceptance:** feedback persists and affects confidence; plan choice is measurable; substitutions are explainable, optional, and logged.

---

## Milestone 4 — Real AI provider

**Goal:** idea mode works beyond the canned templates without making the app depend on a model.  
**Estimate:** 1–2 days

- [ ] Add a real `AiProvider` implementation selected by `AI_PROVIDER` (keep `mock` as the default and test mode).
- [ ] Validate model output with Zod; map candidate slugs through `matchCatalogVariant` rather than trusting model IDs.
- [ ] Add timeout, retry/fallback to mock, and a user-visible "could not parse, edit manually" path.
- [ ] Cover the provider with fixture-based tests; never require a live key in CI.

**Acceptance:** `AI_PROVIDER=mock` needs no key and stays deterministic; a configured provider parses a free-text idea into a reviewable BOM; provider failure degrades to paste/edit rather than a 500.

---

## Milestone 5 — Offline run sheet

**Goal:** the run sheet is usable in a crowded SP Road building with poor signal.  
**Estimate:** 1 day

- [ ] Persist checked items per `viewId` + plan in `localStorage`; restore on reload.
- [ ] Decide PWA scope: if implementing, add a manifest and a service worker that caches the run route and its assets; otherwise keep the "not cached offline" banner and do not claim offline support.
- [ ] Add a "saved on this device" indicator and a clear reset action.
- [ ] Test reload, plan switch, and (if PWA) offline navigation.

**Acceptance:** checks survive reload and plan switches; offline behavior matches the copy on the page exactly.

---

## Milestone 6 — Production readiness

**Goal:** reproducible deploys, guarded endpoints, and evidence the pilot holds up.  
**Estimate:** 2–3 days

- [ ] Generate and commit Drizzle migrations (`pnpm db:generate`); use `drizzle-kit migrate` for deployed environments and keep `db:push` for local iteration.
- [ ] Add GitHub Actions CI: install, typecheck, test, build on every push/PR; make it required on `main`.
- [ ] Add rate limiting and basic abuse controls to session creation, feedback, and catalog search; return 429 with `Retry-After`.
- [ ] Add security headers (CSP, `Referrer-Policy`, `X-Content-Type-Options`, frame denial) and confirm session pages stay `noindex`.
- [ ] Document and verify Netlify production setup: `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` (migrations), `NEXT_PUBLIC_APP_URL`; confirm the manual `scripts/patch-netlify-function.mjs` step is no longer needed or document why it is.
- [ ] Add structured server logging and an error-reporting hook; keep `/api/health` as the uptime probe.
- [ ] Accessibility pass: axe on all routes, keyboard-only run sheet, focus states, and the 200%-zoom header overflow fix.
- [ ] Firefox and WebKit smoke tests for the main flow (Playwright already installed).
- [ ] Re-seed/verify production data and record the final pilot URL in this file.

**Acceptance:** CI is green from a clean clone; production deploy creates and reads a real session; migrations are reproducible; rate limits and headers verified; no critical accessibility issues; the pilot URL is documented.

---

## Explicitly out of scope for the pilot

Live shop stock or price feeds, reservations, checkout/payments, delivery, user accounts/auth, GPS or maps SDK, admin console, bill OCR, multi-city expansion. Revisit only after the pilot validates the run-sheet loop.

## Open decisions

1. **Access model:** keep public `viewId` links, or add lightweight auth/expiring links before sharing outside RVCE?
2. **AI provider:** which provider/model and budget for idea mode?
3. **Substitutions:** include in the pilot, or keep as a post-pilot differentiator?
4. **Offline:** full PWA, or localStorage-only with honest copy?
5. **Real data:** which SP Road shops will supply verified prices, and who owns updates?

## Verification commands

```bash
pnpm typecheck
pnpm test
pnpm build
node .qa-integration.mjs   # requires a running dev server + seeded DB
node .qa-visual.mjs        # writes screenshots/
```

## Document map

| File | Purpose |
| --- | --- |
| `PLAN.md` | **This file.** Forward plan and resume point. |
| `README.md` | Setup, scripts, architecture, routes. |
| `index.md` | Product narrative and pitch. |
| `BACKEND_STATUS.md` | Historical: schema, seed data, core algorithms, APIs. |
| `BACKEND_INTEGRATION_STATUS.md` | Historical: canonical BOM matching, run-sheet formatting. |
| `INTEGRATION_STATUS.md` | Historical: live session UI wiring and QA evidence. |
| `UI_STATUS.md` | Historical: scaffold snapshot (superseded). |
| `VISUAL_PASS.md` | Historical: typography, dark mode, responsive evidence. |
| `SCAFFOLD_READY` | Scaffold generation marker. |
| `AGENTS.md` | Next.js agent rules injected by `next dev`. |
