# ENGI-MART UI Integration Status

**Date:** 2026-10-22  
**Scope:** DB-backed session flow, dynamic Bench Sheet / plans / run sheet, coverage-aware copy, UI-only changes  
**Status:** Working against the seeded Postgres database. Seeded estimates only; no live stock or reservations.

## What is wired

### Start → session
- `/` posts the pasted BOM, budget, stop limit and target board to `POST /api/sessions`.
- The edit token is stored under `engi-mart:edit:<viewId>`.
- On success the browser navigates to `/b/<viewId>`.
- Create-time title defaults:
  - Paste mode: `SP Road parts list`.
  - Idea mode: the first six words of the idea, title-cased.
  - Idea mode with no usable text: `Project parts list`.
- The first BOM component is never used as the page title.
- The title is only assigned when the session is created. A later edited title is not regenerated on read.
- Loading and request-error states are visible on the start form.

### `/b/[viewId]`
- Loads the persisted session, BOM rows, variants, listings and shops through `src/server/workspace.ts`.
- Renders the real matched rows and calls `solveBasket` for the plan summary.
- Shows item count, matched count, cheapest estimate, coverage, stops, walking and confidence.
- Missing-item warnings come from the optimizer result rather than static copy.
- Uses `export const instant = false`; `force-dynamic` is not used because the app runs `cacheComponents: true`.

### `/b/[viewId]/plans`
- Compares the live `fastest` and `cheapest` results.
- Labels are coverage-aware:
  - `Fastest · 6 of 7`
  - `Cheapest · full basket`
- The page states: “Fastest is cheaper only because one item is missing; add it as a second stop to compare like for like.”
- Each card exposes stops, walking, coverage, confidence, missing items and shops used.
- Plan CTAs open `/b/<viewId>/run?plan=fastest` or `?plan=cheapest`.

### `/b/[viewId]/run`
- Resolves the requested plan from the query string.
- Header shows plan and coverage, e.g. `Fastest · 6 of 7 items`.
- Shows the missing item in the header for incomplete plans.
- Stops, allocations, subtotals and checks all come from the selected live plan.
- Total, coverage and stop count are plan-specific.
- Footer no longer duplicates the missing-item warning.

## Verification

End-to-end run with `.qa-integration.mjs`:

| Check | Result |
| --- | --- |
| New session | `b_929b12dc99` |
| Paste-mode title | `SP Road parts list` |
| Idea-mode title | `Balcony Plant Watering Rig With ESP32` |
| Stored edit token | `true` |
| Workspace rows | `7` |
| Matching | `7 of 7 matched` |
| Cheapest estimate | `₹740–805` |
| Plan cards | `2` |
| Plan labels | `Fastest · 6 of 7`, `Cheapest · full basket` |
| Fastest coverage | `Fastest · 6 of 7 items`, `1 shop` |
| Fastest missing item | `40x jumper wires, male–male` |
| Fastest run stops | `1` |
| Cheapest coverage | `Cheapest · 7 of 7 items`, `2 shops` |
| Cheapest run checks | `7` |
| Cheapest total | `₹740–805` |
| Mobile overflow | none at 390 px on workspace, plans or run |
| Console/page errors | none |

**Screenshots**
- `screenshots/integration-workspace-desktop.png`
- `screenshots/integration-plans-desktop.png`
- `screenshots/integration-run-fastest-desktop.png`
- `screenshots/integration-run-desktop.png`
- `screenshots/integration-workspace-mobile.png`
- `screenshots/integration-plans-mobile.png`
- `screenshots/integration-run-mobile.png`
- `screenshots/dark-dynamic-plans-desktop.png`
- `screenshots/dark-dynamic-run-desktop.png`

**Commands**
```bash
pnpm typecheck   # exit 0
pnpm build       # exit 0
node .qa-integration.mjs
node .qa-visual.mjs
```

Production build: 15 static/dynamic routes generated successfully; `/b/[viewId]`, `/b/[viewId]/plans` and `/b/[viewId]/run` are partial-prerender routes with `instant = false`.

## Remaining issues

1. **Static demo run sheet ignores the plan query.** `/b/demo/run?plan=fastest` and `?plan=cheapest` both render the same 7-item, 2-stop demo sheet. The live `/b/[viewId]/run` flow does select the requested plan correctly. This was left as-is because the static demo plan totals, shop names and run-stop data are inconsistent beyond the run-sheet query; fixing it safely would require a larger demo-data reconciliation.
2. **Static demo plan data is illustrative and internally inconsistent.** The demo fastest card names Sri Vinayaka Electronics, while the demo run sheet uses Om Electronics and Sai Sensors. This does not affect live sessions.
3. **Seeded data only.** Prices, stock, phone numbers and observations are demo records. There is no live inventory, reservation, checkout or payment flow.
4. **Edit tokens are stored but there is no edit UI.** The token is retained for a future edit flow.
5. **No auth.** Public session links are the access mechanism.
6. **No offline run sheet.** Checkbox state is local to the page and resets on reload.
