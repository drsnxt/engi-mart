# ENGI-MART Backend & Data Status

**Role:** Backend / Data Executor  
**Database:** PostgreSQL 17 (Docker container `engimart-postgres` on port 5432) with `pg_trgm`  
**ORM:** Drizzle ORM  
**Date:** 2026-10-22  
**Status:** Complete, tested, and verified.

---

## 1. Scaffold Detection Note
- `SCAFFOLD_READY` flag file was polled at startup and was not explicitly written by the UI agent.
- However, the underlying Next.js scaffold (`src/app`, `src/lib/mock-data.ts`, `package.json`, `tsconfig.json`) was present and detected.
- All backend files were implemented in their dedicated ownership directories without touching any UI pages or package.json.

---

## 2. Database Schema (15 Tables)

Implemented in [`src/db/schema.ts`](file:///home/darshan/Projects/engi-mart/src/db/schema.ts) and pushed to PostgreSQL 17:

1. **`component_family`**: Top-level family taxonomy (e.g. "ESP32 Dev Boards", "Soil Moisture Sensors") with `search_aliases` array and category index.
2. **`component_variant`**: Canonical variant entity with `canonical_slug` (the primary identity, not MPN), specs JSONB, pack size, and unit label.
3. **`shop`**: SP Road shop registry (name, building, floor, stall number, phone, cluster ID).
4. **`shop_listing`**: Active offers per shop/variant with price in integer paise, categorical stock status, and confidence.
5. **`price_observation`**: Append-only price ledger with source provenance (`audit`, `bill`, `student`, `shop_whatsapp`, `import`) and timestamps.
6. **`substitution_edge`**: Curated replacement graph (`equivalent`, `pin_compatible`, `upgrade`, `downgrade`, `adapter_required`) with spec deltas.
7. **`bom_session`**: User session state with `public_token` (`viewId`), cryptographic `edit_token_hash`, mode (`bom` | `idea`), budget, and constraints.
8. **`bom_item`**: Individual BOM items with raw text, quantities, matched variant IDs, confidence, and user confirmation.
9. **`optimization_run`**: Audit log of optimizer inputs and serialized plan snapshots.
10. **`feedback`**: 3-tap post-trip feedback (`found`, `price_paid_paisa`, `price_sentiment`, notes).
11. **`unmatched_query`**: Unmatched search and BOM strings recorded for catalog roadmap prioritization.
12. **`match_override`**: Logs when users override an automated variant match.
13. **`substitution_override`**: Logs when students reject recommended substitutions.
14. **`plan_selection`**: Telemetry on whether users selected the Fastest or Cheapest plan.
15. **`search_impression`**: Search analytics recording presented variant IDs and click-throughs.

---

## 3. Seeded Adversarial Demo Data

Executed via [`scripts/seed.ts`](file:///home/darshan/Projects/engi-mart/scripts/seed.ts):
- **10 SP Road Shops**: Om Electronics, SP Road Robotics & Kits, Bangalore Circuit House, Mahaveer Electro Emporium, Silicon Components Centre (adversarial: no phone), Vishwa Electronics, Balaji Components (adversarial: 3rd floor penalty), etc.
- **20 Component Families**: Covering microcontrollers, sensors, actuators, power converters, passives, and consumables.
- **41 Component Variants**: Including ESP32 variants, CH340 Arduino clones, soil sensors, relay modules, motor drivers, displays, passives with pack sizes > 1.
- **105 Price Observations & 104 Active Shop Listings**:
  - **Stale Price Test**: ESP32 at Om Electronics priced at ₹220 from an audit 52 days ago; correctly triggers `STALE_DATA` and caps confidence <= 0.30.
  - **Fresh vs. Stale Contrast**: ESP32 at SP Road Robotics priced at ₹310 observed today with 0.9+ confidence.
  - **Out-of-Stock Test**: ESP32 at Silicon Components marked `out` of stock; verified to be excluded from solver allocations.
  - **Ambiguity Test**: "Soil sensor" resolves to 3 variants (Capacitive v1.2, Resistive FC-28, Capacitive v2.0); ESP32 resolves to 30-pin, 38-pin, and CAM.
  - **5V Relay + ESP32 Warning**: Paired in catalog with compatibility rule triggering `LogicLevelRule` error/warning due to 3.3V vs 5.0V delta.
  - **Clone Arduino with No MPN**: `arduino-uno-r3-ch340` seeded with `mpn: null` and manufacturer `Shenzhen Unbranded Clone`.
  - **Pack Size Normalization**: Resistors (20/pk), LEDs (10/pk), Jumpers (40/pk) rounded to billable packs.

---

## 4. Pure TS Core Algorithms & Verification

Implemented in [`src/core/`](file:///home/darshan/Projects/engi-mart/src/core/):
- **Confidence Formula** ([`src/core/confidence.ts`](file:///home/darshan/Projects/engi-mart/src/core/confidence.ts)):
  $$q_i = w_i \times 0.5^{(\text{age\_days}/14)}$$
  $$B = 1 - \prod(1 - q_i)$$
  $$C = \text{clamp}(B \times (0.65 + 0.25A + 0.10S), 0.05, 0.97)$$
  Capped at $\le 0.30$ if newest observation $> 45$ days.
- **Normalizer & Pack Rounding** ([`src/core/normalize.ts`](file:///home/darshan/Projects/engi-mart/src/core/normalize.ts)):
  Normalizes text, strips parenthetical spec notes, parses quantities (`4x`, `2 pcs`, `qty 5`), deduplicates rows, and computes `ceil(requestedQty / packSize)`.
- **Compatibility Engine** ([`src/core/compatibility.ts`](file:///home/darshan/Projects/engi-mart/src/core/compatibility.ts)):
  Evaluates `LogicLevelRule` (with 5V-tolerance exception), `VoltageRangeRule`, `BusMatchRule`, and `PowerBudgetRule`.
- **Basket Optimizer** ([`src/core/optimizer.ts`](file:///home/darshan/Projects/engi-mart/src/core/optimizer.ts)):
  Isomorphic solver evaluating shop subsets for:
  - **Fastest Plan ($k=1$ shop)**: ranked by coverage DESC, cost ASC, confidence DESC, walking ASC.
  - **Cheapest Plan ($k \le 2$ shops)**: ranked by coverage DESC, cost ASC, confidence DESC, stops ASC, walking ASC.
  - Includes deterministic walking time estimates and over-budget value cuts.

---

## 5. API Route Handlers

All routes implemented with strict Zod validation:
1. `GET /api/health`: Database connection check and timestamp.
2. `GET /api/catalog/search?q=&limit=`: Variant and family search; logs impressions.
3. `POST /api/sessions`: Creates session from BOM text or project idea; generates `viewId` and secret `editToken`.
4. `PATCH /api/sessions/[viewId]`: Authenticated via `X-Edit-Token` header; updates items, budget, or constraints.
5. `GET /api/sessions/[viewId]/run-sheet`: Compiles offline job card with shop-by-shop stops, stall numbers, item checklists, and price bands.
6. `POST /api/sessions/[viewId]/feedback`: Records 3-tap feedback and appends verified purchase prices to `price_observation`.

---

## 6. Test Suite & Build Verification

Executed commands:
- **Typecheck**: `pnpm typecheck` (`tsc --noEmit`) -> **0 errors**.
- **Unit & Integration Tests**: `pnpm vitest run` -> **8 tests passed (100%)** across `test/core.test.ts` and `test/api.test.ts`.
- **Production Build**: `pnpm build` (`next build`) -> **Compiled successfully**, generating all dynamic API routes.

---

## 7. Execution Commands

```bash
# Push schema migrations
pnpm drizzle-kit push

# Seed database
pnpm tsx scripts/seed.ts

# Run test suite
pnpm vitest run

# Run type checker
pnpm typecheck

# Start development server
pnpm dev
```

---

## 8. Unresolved Issues / Handoff Notes
- None. Backend and data infrastructure are fully operational, tested against Docker PostgreSQL 17, and ready for frontend integration.
