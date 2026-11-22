# ENGI-MART Visual Pass

**Date:** 2026-10-22  
**Scope:** typography, dark mode, route card, responsive QA, screenshot evidence  
**Status:** Complete. The pseudo-map has been removed; the start page now uses a vertical stop ladder.

## Direction

- Bench-sheet density with sharp 2 px borders and hairline rules.
- IBM Plex Sans for prose and IBM Plex Mono for data, labels and walk times.
- No rounded card treatment, no decorative shadows, no fake geography.
- Demo data is labelled in the page header, banners, run sheet and route card.

## Typography floor

Verified in-browser with computed styles; no visible text below 11 px.

| Role | Size |
| --- | --- |
| Body | 15 px / 1.5 |
| Table body | 13.5 px / 1.35 |
| Labels and eyebrows | 11.5 px |
| Mono data | 12 px |
| Route walk time / card header | 11 px mono caps |
| Section headings | 24–28 px |
| Page titles | 40–44 px desktop, 32–34 px mobile |

## Dark mode

- Palette: bg `#12110F`, surface `#1A1815`, elevated `#211E1A`, ink `#F4F0E8`, muted `#B0A89A`, hairline `#3A352D`, green `#5FB57A`, green-strong `#7DD394`, orange `#FF8A5B`, warning `#E3B341`, danger `#F87171`.
- Header Sun/Moon toggle writes `engi-mart:theme`.
- With no stored value, the page follows `prefers-color-scheme`.
- A `beforeInteractive` boot script applies the theme before paint, so dark-theme reloads do not flash light.
- QA confirmed system-dark → dark, toggle → light, reload → light.
- Run-sheet high-contrast mode remains scoped to that page and is white-on-black in both themes.

## Route ladder

`src/components/route-ladder.tsx` replaces the deleted `sp-road-schematic.tsx`.

- Header: `SP ROAD ROUTE` / `2 STOPS · DEMO`.
- Entrance → 4 min walk → ① Om Electronics (Silver Tool Complex · 1F · #14, 5 items · ₹220–250) → 8 min walk → ② Sai Sensors (Golcha Market · GF · #7, connector + sensor).
- One thin green route line, numbered circles, hairline header/footer rules.
- Shop name 14 px semibold, address/meta 12 px, walk time 11 px mono, note 11.5 px.
- Start-page copy is now “Ordered stops, no map SDK.”
- `/method` now says stop order and walking minutes are schematic estimates, not GPS or turn-by-turn directions.
- The route card is fixed demo content; it does not read the current session.

## Browser QA

`node .qa-visual.mjs`

| Check | Result |
| --- | --- |
| Viewports | 1440×900, 390×844 |
| Narrow check | 320×800 |
| Horizontal overflow | none on `/`, `/b/demo`, `/b/demo/plans`, `/b/demo/run`, live workspace/plans/run |
| Text below 11 px | none |
| Theme sync | light/dark applied on every checked route |
| System preference | dark honored |
| Toggle persistence | passed |
| Console/page errors | none |

## Screenshot index

**Route ladder**
- `screenshots/route-ladder-light-desktop.png`
- `screenshots/route-ladder-dark-desktop.png`
- `screenshots/route-ladder-light-mobile.png`
- `screenshots/route-ladder-dark-mobile.png`
- `screenshots/route-ladder-light-desktop-card.png`
- `screenshots/route-ladder-dark-desktop-card.png`
- `screenshots/route-ladder-light-mobile-card.png`
- `screenshots/route-ladder-dark-mobile-card.png`
- `screenshots/route-ladder-light-320.png`

**Full pages**
- `screenshots/light-home-desktop.png` / `screenshots/light-home-mobile.png`
- `screenshots/dark-home-desktop.png` / `screenshots/dark-home-mobile.png`
- `screenshots/light-demo-workspace-desktop.png` / `screenshots/dark-demo-workspace-desktop.png`
- `screenshots/light-demo-plans-desktop.png` / `screenshots/dark-demo-plans-desktop.png`
- `screenshots/light-demo-run-desktop.png` / `screenshots/dark-demo-run-desktop.png`
- Mobile equivalents use `-mobile.png`.

**Live session**
- `screenshots/light-dynamic-workspace-desktop.png`
- `screenshots/dark-dynamic-workspace-desktop.png`
- `screenshots/dark-dynamic-plans-desktop.png`
- `screenshots/dark-dynamic-run-desktop.png`
- `screenshots/integration-workspace-desktop.png`
- `screenshots/integration-plans-desktop.png`
- `screenshots/integration-run-fastest-desktop.png`
- `screenshots/integration-run-desktop.png`
- `screenshots/integration-workspace-mobile.png`
- `screenshots/integration-plans-mobile.png`
- `screenshots/integration-run-mobile.png`

## Remaining visual issues

1. **Static demo run sheet ignores `?plan=`.** Both plan links show the same 7-item, 2-stop sheet. `/b/[viewId]/run` does honour the plan query.
2. **Demo mock data is not fully self-consistent.** The static fastest plan names Sri Vinayaka Electronics; the demo run sheet uses Om Electronics and Sai Sensors.
3. **Route card is illustrative.** Its 5-item / ₹220–250 figures are sample copy, not the selected session.
4. **Browser coverage is Chromium only.** Safari and Firefox were not part of this pass.
5. **Extreme zoom is not re-verified.** The earlier 200%-zoom-at-390 px header overflow remains an open edge case.
6. **No real stock or shop feed.** All visuals are seeded demo data.
