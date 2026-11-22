# ENGI-MART UI Status

> **Historical scaffold snapshot.** Current live-session behavior is in
> [`INTEGRATION_STATUS.md`](INTEGRATION_STATUS.md), and the final visual pass is in
> [`VISUAL_PASS.md`](VISUAL_PASS.md). The start form now creates real sessions, and the
> schematic map was removed in favour of a vertical stop ladder.

**Date:** 22 Oct 2026  
**Scope:** scaffold, Bench Sheet UI/UX, browser QA  
**Status:** UI scaffold complete. Demo-only data. Dev server running at **http://localhost:3000** (HTTP 200 verified).

## What works

### Scaffold
- Next.js **16.4.2** App Router, React 19.3, TypeScript strict, Tailwind v4, Base UI, lucide-react.
- Installed app deps: drizzle-orm, postgres, zod, @base-ui/react, lucide-react.
- Installed dev deps: drizzle-kit, tsx, vitest, playwright.
- `docker-compose.yml` added with Postgres 17 (`db` service only). DB not started by this agent.
- Existing files preserved: `EL.pptx`, `EL_Template*.pptx`, `index.md`, `.cortex/`. Nothing under `src/db`, `src/core`, `src/app/api`, `src/lib/ai`, `src/lib/tokens.ts`, `src/lib/validation.ts`, `drizzle.config.ts`, or `scripts/seed.ts` was touched.
- `SCAFFOLD_READY` written after install and successful dev boot.
- Demo labelling appears in the header, page banners, footer, and run sheet. No real shop prices are claimed.

### `/` — start
- Wordmark/header: ENGI-MART, SP ROAD / RVCE PILOT, Start/Method/Legal, DEMO tag.
- Dual input tabs: **Paste BOM** / **Describe idea**.
- Target board select (ESP32 DevKit, Arduino Uno, Raspberry Pi Pico, Not sure yet).
- 3 RVCE starter chips (Sem-5 IoT node, L298N line-follower, Plant monitor) populate the paste field.
- Clearly labelled example BOM notice, Clear table and Reset example actions.
- Vertical SP Road stop-ladder preview and provenance sample.
- Submitting opens `/b/demo` (seeded demo; no parser/backend wired in UI).

### `/b/demo` — bench sheet
- Semantic BOM table on desktop with component, qty, spec, status, price band, confidence, provenance age.
- Responsive mobile BOM cards replace the table below 700 px.
- One visible deterministic spec warning on the 5 V relay row (3.3 V ESP32 logic).
- Sticky plan summary: ₹820–960 estimate, budget ruler, 2 shops, 12 min walking, 7/7 coverage, 82% confidence, Compare plans CTA.
- Mobile sticky compare dock repeats estimate, stops, walking, confidence and CTA.
- Desktop table + mobile cards have no horizontal overflow at 390 px.

### `/b/demo/plans`
- Fastest vs Cheapest comparison matrix with total, shops, walking, coverage, confidence and trade-off.
- Cheapest is highlighted with a 2 px ink outline and Recommended badge.
- Expandable `<details>` shop-by-shop breakdowns.
- Responsive mobile plan cards replace the matrix below 700 px.
- Choose plan CTAs open the run sheet with `?plan=fastest|cheapest`.
- Prices labelled estimates, not reservations.

### `/b/demo/run`
- Mobile-first job-card run sheet: 2 shop stops, floor/stall addresses, walking times, tel links.
- 7 checkboxes with checked-price total updates and remaining-item count.
- Sticky total bar; high-contrast “Sunlight mode” toggle scoped to this page.
- WhatsApp share button builds a demo summary and opens `wa.me` in a new tab.
- Responsive at 390×844; 48 px touch rows.
- Does **not** claim offline caching — banner explicitly says it is not cached offline yet.

### `/method`, `/legal`
- Short plain-text pages covering estimates, confidence, matching, plan trade-offs, demo limits, no affiliation, electrical safety, privacy and licences.

### Browser QA
- Playwright checks passed: 2 tabs, starter loading, board selection, start → `/b/demo` navigation, 7 mobile BOM cards, warning visibility, 2 mobile plan cards, plan → run navigation, 7 checkboxes, checked total update, high-contrast toggle on/off, 2 tel links, WhatsApp popup, `/method` + `/legal` render.
- No page errors or console errors on the checked routes.
- No horizontal overflow at 390 px and 320 px.

## Screenshots

Saved in `screenshots/` at the requested viewports (viewport capture, not full page):

| Route | Desktop 1440×900 | Mobile 390×844 |
| --- | --- | --- |
| `/` | `screenshots/home-desktop.png` | `screenshots/home-mobile.png` |
| `/b/demo` | `screenshots/bom-desktop.png` | `screenshots/bom-mobile.png` |
| `/b/demo/plans` | `screenshots/plans-desktop.png` | `screenshots/plans-mobile.png` |
| `/b/demo/run` | `screenshots/run-desktop.png` | `screenshots/run-mobile.png` |

## Commands

```bash
pnpm install
pnpm dev                 # http://localhost:3000
pnpm typecheck           # tsc --noEmit
pnpm build
docker compose up -d db  # Postgres 17, when backend work needs it
```

## Verification results

**`pnpm typecheck`**
```
$ tsc --noEmit
typecheck_exit=0
```
Passed.

**`pnpm build`**
```
✓ Compiled successfully in 811ms
✓ Running next.config.ts took 20ms
Running TypeScript ...
Finished TypeScript in 1861ms
✓ Generating static pages (12/12) in 411ms
```
Passed. Static routes include `/`, `/b/demo`, `/b/demo/plans`, `/b/demo/run`, `/method`, `/legal`. Build output also lists API routes added by the parallel backend agent; this UI does not consume them yet.

**Dev server:** `curl` → HTTP 200 on `/` and `/b/demo`.

## Unresolved / intentionally not built

- **Demo data only.** All shops, prices, phone numbers and observations come from `src/lib/mock-data.ts`; none are real.
- **No parser, matching API or AI integration in the UI.** Start form submission always opens the seeded `/b/demo` sheet. BOM rows are read-only; Add row/Re-parse are not wired.
- **Spec-warning fixes are display-only chips.** They do not add a level shifter, switch the relay, or record an override.
- **Run sheet state is local to the page.** Checkboxes reset on reload and are not persisted in `localStorage`. No service worker/offline caching.
- **Demo run sheet ignores plan selection.** Both demo `?plan=` links render the same sheet. Live `/b/[viewId]/run` plans are selected correctly.
- **WhatsApp share** uses the current browser URL in the message; on localhost this is a local link, not a public share URL.
- **Zoom edge case:** no overflow at 320/390 px, but an approximation of 200% zoom at a 390 px viewport (195 CSS px) overflows the header/nav and start form. Header/nav reflow at very narrow widths is unresolved.
- Backend APIs/database are owned by the parallel agent and are not verified here.
- Not built (per scope): auth, payments, delivery, maps SDK, chatbot, admin, OCR, live stock, checkout.
