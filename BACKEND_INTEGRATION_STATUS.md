# ENGI-MART Backend Integration Status (Milestone 2)

**Scope:** Backend hardening, canonical BOM matching, public session read, run-sheet formatting, and real-session verification.  
**Date:** 2026-10-22  
**Database:** PostgreSQL 17 in Docker (`engimart-postgres` on port 5432) with `pg_trgm`  
**Test Suite:** 12 tests passed (100%) in Vitest; `tsc --noEmit` passed with 0 errors.

---

## 1. Summary of Changes

1. **Canonical 7-Line BOM Matching**:
   - Expanded catalog in [`scripts/seed.ts`](file:///home/darshan/Projects/engi-mart/scripts/seed.ts) to seed families and variants for:
     - 3-6V Mini Submersible Water Pump (`pump-submersible-3-6v`)
     - Silicone Tubing 6mm ID (`silicone-tubing-6mm-id`)
     - 5V 2A DC Power Adapter (`power-adapter-5v2a-dc`)
   - Implemented [`src/db/queries.ts`](file:///home/darshan/Projects/engi-mart/src/db/queries.ts) with `matchCatalogVariant`, utilizing `component_family.searchAliases`, variant `displayName`, `canonicalSlug`, and keyword disambiguators.
   - Preserved genuine ambiguity for generic queries: `"soil sensor"` and `"esp32"` return `matchedVariantId: null` with `matchMethod: "ambiguous"`, while `"ESP32 DevKit"` and `"capacitive soil moisture sensor"` resolve deterministically.

2. **Public Session Read Endpoint**:
   - Implemented `GET /api/sessions/[viewId]` in [`src/app/api/sessions/[viewId]/route.ts`](file:///home/darshan/Projects/engi-mart/src/app/api/sessions/[viewId]/route.ts).
   - Returns HTTP 404 for nonexistent sessions.
   - For valid sessions, returns session metadata (`title`, `budgetRupees`, `maxStops`, `walkingTolerance`) and items with matched variant `displayName`, `canonicalSlug`, `qty`, `packSize`, `unitLabel`, and computed `priceBand` (`priceLow`, `priceHigh`, `confidence`).

3. **Run-Sheet Human-Readable Formatting**:
   - Fixed [`src/app/api/sessions/[viewId]/run-sheet/route.ts`](file:///home/darshan/Projects/engi-mart/src/app/api/sessions/[viewId]/run-sheet/route.ts) and [`src/core/optimizer.ts`](file:///home/darshan/Projects/engi-mart/src/core/optimizer.ts) so allocated item names use `componentVariant.displayName` (or `bomItem.rawText`), eliminating raw UUIDs.
   - Includes full shop location cards: shop name, building, floor, stall number, and telephone link.
   - Preserves plan metrics, billable pack counts, item costs, warnings, and value cuts.

4. **Expanded Unit & Integration Test Suite**:
   - Added Edge Case 6 to [`test/core.test.ts`](file:///home/darshan/Projects/engi-mart/test/core.test.ts): walking-distance tie-breaking (ground floor beats 3rd floor).
   - Added 4 integration test suites to [`test/api.test.ts`](file:///home/darshan/Projects/engi-mart/test/api.test.ts) covering the canonical 7-line BOM, ambiguity checks, 404 responses, and run-sheet verification.

---

## 2. Canonical 7-Line BOM Verification Results

### Sample Session Details
- **Generated `viewId`**: `b_46cf01c238`
- **Session Title**: `Smart Plant Watering System`
- **Budget**: ₹1,500 (`150000` paise)

### Item Matching Results (7/7 Matched)

| # | Raw Input Text | Matched Variant Display Name | Canonical Slug | Method | Confidence | Price Band |
|---|---|---|---|---|---|---|
| 1 | `1x ESP32 DevKit` | ESP32 DevKit (WROOM-32 30-pin) | `esp32-wroom-32-30pin` | alias | 98% | ₹220–₹242 |
| 2 | `1x capacitive soil moisture sensor` | Capacitive Soil Moisture Sensor v1.2 | `soil-sensor-capacitive-v12` | alias | 98% | ₹85–₹91 |
| 3 | `1x 5V relay module` | 5V 1-Channel Relay Module (Optocoupler) | `relay-module-5v-1ch` | alias | 98% | ₹51–₹55 |
| 4 | `1x 3-6V submersible pump` | 3-6V Mini Submersible Water Pump | `pump-submersible-3-6v` | alias | 98% | ₹155–₹168 |
| 5 | `2m silicone tubing 6mm ID` | Silicone Tubing 6mm ID (Food Grade) | `silicone-tubing-6mm-id` | alias | 98% | ₹42–₹47 |
| 6 | `40x jumper wires male-male` | Male to Male Jumper Wires 20cm (pack of 40) | `jumper-wires-mm-40` | alias | 98% | ₹58–₹63 |
| 7 | `1x 5V 2A DC adapter` | 5V 2A DC Power Adapter (5.5/2.1mm) | `power-adapter-5v2a-dc` | alias | 98% | ₹132–₹142 |

### Ambiguity Verification
- Input: `1x soil sensor` -> `matchedVariantId: null`, `matchMethod: "ambiguous"`
- Input: `1x esp32` -> `matchedVariantId: null`, `matchMethod: "ambiguous"`

---

## 3. Run-Sheet Plan Output (`/api/sessions/[viewId]/run-sheet`)

### Fastest Plan (Single Shop, 7/7 Coverage)
- **Shop**: Om Electronics (Silver Tool Complex, 1st floor, Stall #14, Phone: `+91 98450 12345`)
- **Walking Estimate**: 6 minutes
- **Estimated Total**: ₹760 (Budget Upper Bound: ₹821)
- **Coverage**: 7/7 items
- **Allocated Items**:
  1. `ESP32 DevKit (WROOM-32 30-pin)` · 1 pack · ₹220 (97% conf)
  2. `Capacitive Soil Moisture Sensor v1.2` · 1 pack · ₹85 (96% conf)
  3. `5V 1-Channel Relay Module (Optocoupler)` · 1 pack · ₹55 (95% conf)
  4. `3-6V Mini Submersible Water Pump` · 1 pack · ₹160 (96% conf)
  5. `Silicone Tubing 6mm ID (Food Grade)` · 1 pack · ₹45 (96% conf)
  6. `Male to Male Jumper Wires 20cm (pack of 40)` · 1 pack · ₹60 (96% conf)
  7. `5V 2A DC Power Adapter (5.5/2.1mm)` · 1 pack · ₹135 (96% conf)

### Cheapest Plan (Up to 2 Shops, 7/7 Coverage)
- **Total**: ₹740 (Saves ₹20; Walking: 10 minutes)
- **Stops**: 2 shops (Bangalore Circuit House + Om Electronics)

---

## 4. Verification Commands

```bash
# Push migrations and seed data
pnpm drizzle-kit push
pnpm tsx scripts/seed.ts

# Run TypeScript static check (0 errors)
pnpm typecheck

# Run automated test suite (12 tests passed)
pnpm vitest run

# Run end-to-end verification script for canonical session
pnpm tsx scripts/verify-canonical-session.ts
```

---

## 5. Remaining Gaps & Parallel UI Notes
1. **Conflicting Route Segment Config in UI pages**:
   - The UI agent added `export const dynamic = "force-dynamic";` in `src/app/b/[viewId]/page.tsx`, `src/app/b/[viewId]/plans/page.tsx`, and `src/app/b/[viewId]/run/page.tsx`.
   - In Next.js 16.4 with `cacheComponents: true`, this route segment configuration is invalid and throws a build error during `next build` / Turbopack compilation.
   - *Resolution for UI Agent*: Remove `export const dynamic = "force-dynamic";` from those three page files so Turbopack dev and build compile without errors.
2. **Real Shop Data Notice**:
   - All seeded shop addresses, phone numbers, and prices remain illustrative demo data modeled after SP Road Bangalore.
