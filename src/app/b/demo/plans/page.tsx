import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Footprints,
  Store,
} from "lucide-react";
import { demoSession, inr, plans } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Compare plans — Smart Plant Watering",
  description: "Demo comparison of Fastest and Cheapest SP Road purchase plans.",
  robots: { index: false, follow: false },
};

export default function DemoPlansPage() {
  const fastest = plans.find((plan) => plan.key === "fastest")!;
  const cheapest = plans.find((plan) => plan.key === "cheapest")!;
  const fastestLabel = `Fastest · ${fastest.coverage.replace(" / ", " of ")}`;
  const cheapestLabel = "Cheapest · full basket";

  return (
    <div className="container page plans-page">
      <div className="crumb-row">
        <Link href="/b/demo" className="crumb-back">
          <ArrowLeft size={12} aria-hidden="true" /> Bench sheet
        </Link>
        <span className="crumb-meta">Plan comparison · demo session</span>
      </div>

      <header className="plans-head">
        <p className="eyebrow">Plan comparison / 2 plans</p>
        <h1 className="page-title">Two ways to buy the same list.</h1>
        <p className="lede" style={{ marginTop: 10, maxWidth: 680 }}>
          Fastest is cheaper only because one item is missing; add it as a second stop to
          compare like for like. Cheapest covers everything and adds 8 minutes of walking.
        </p>
        <div className="plans-sub">
          <span>{demoSession.project}</span>
          <span>7 items</span>
          <span>Budget {inr(demoSession.budget)}</span>
          <span>Demo prices</span>
        </div>
      </header>

      <div className="demo-banner" style={{ marginTop: 14 }} role="note">
        <strong>Demo comparison</strong>
        <span style={{ flex: 1, minWidth: 220 }}>
          Totals are illustrative. Walking minutes are schematic estimates, not GPS
          directions.
        </span>
        <Link href="/method" className="text-link">
          Method
        </Link>
      </div>

      <div className="compare-wrap" style={{ overflowX: "auto", marginTop: 20 }}>
        <table className="compare">
          <caption className="sr-only">
            Comparison of the fastest and cheapest demo purchase plans by total, stops,
            walking, coverage, confidence and trade-off.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="compare-rowhead">
                Plan
              </th>
              <th scope="col" className="compare-plan">
                <div className="plan-above">
                  <span className="eyebrow">Option 01</span>
                </div>
                <span className="plan-name">{fastestLabel}</span>
                <span className="plan-tagline">{fastest.tagline}</span>
              </th>
              <th scope="col" className="compare-plan is-best">
                <div className="plan-above">
                  <span className="eyebrow">Option 02</span>
                  <span className="rec-badge">
                    <Check size={8} aria-hidden="true" /> Recommended
                  </span>
                </div>
                <span className="plan-name">{cheapestLabel}</span>
                <span className="plan-tagline">{cheapest.tagline}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="compare-rowhead">
                Est. total
              </th>
              <td className="compare-value">
                <span className="plan-total">
                  {inr(fastest.totalLow)}–{inr(fastest.totalHigh).replace("₹", "")}
                </span>
              </td>
              <td className="compare-value is-best">
                <span className="plan-total">
                  {inr(cheapest.totalLow)}–{inr(cheapest.totalHigh).replace("₹", "")}
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row" className="compare-rowhead">
                Shops
              </th>
              <td className="compare-value">
                <Store size={13} aria-hidden="true" /> {fastest.shops} stop
              </td>
              <td className="compare-value is-best">
                <Store size={13} aria-hidden="true" /> {cheapest.shops} stops
              </td>
            </tr>
            <tr>
              <th scope="row" className="compare-rowhead">
                Walking
              </th>
              <td className="compare-value">
                <Footprints size={13} aria-hidden="true" /> {fastest.walkingMinutes} min
              </td>
              <td className="compare-value is-best">
                <Footprints size={13} aria-hidden="true" /> {cheapest.walkingMinutes} min
              </td>
            </tr>
            <tr>
              <th scope="row" className="compare-rowhead">
                Coverage
              </th>
              <td className="compare-value">
                <span>
                  {fastest.coverage}
                  <span className="compare-sub">1 item missing</span>
                </span>
              </td>
              <td className="compare-value is-best">
                <span>
                  {cheapest.coverage}
                  <span className="compare-sub">Complete list</span>
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row" className="compare-rowhead">
                Confidence
              </th>
              <td className="compare-value">
                <Clock3 size={13} aria-hidden="true" /> {fastest.confidence}%
              </td>
              <td className="compare-value is-best">
                <Clock3 size={13} aria-hidden="true" /> {cheapest.confidence}%
              </td>
            </tr>
            <tr>
              <th scope="row" className="compare-rowhead">
                Trade-off
              </th>
              <td className="compare-value">{fastest.tradeoff}</td>
              <td className="compare-value is-best">{cheapest.tradeoff}</td>
            </tr>
            <tr>
              <th scope="row" className="compare-rowhead">
                Select
              </th>
              <td className="compare-value">
                <Link href="/b/demo/run?plan=fastest" className="btn btn-quiet btn-sm">
                  Choose Fastest <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </td>
              <td className="compare-value is-best">
                <Link href="/b/demo/run?plan=cheapest" className="btn btn-primary btn-sm">
                  Choose Cheapest <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="plan-cards" aria-label="Plan comparison cards">
        {plans.map((plan, index) => (
          <article className={`plan-card ${plan.recommended ? "is-best" : ""}`} key={plan.key}>
            <div className="plan-card-head">
              <div className="plan-above">
                <span className="eyebrow">Option {String(index + 1).padStart(2, "0")}</span>
                {plan.recommended ? (
                  <span className="rec-badge">
                    <Check size={8} aria-hidden="true" /> Recommended
                  </span>
                ) : null}
              </div>
              <span className="plan-name">
                {plan.key === "fastest" ? fastestLabel : plan.key === "cheapest" ? cheapestLabel : plan.name}
              </span>
              <span className="plan-tagline">{plan.tagline}</span>
            </div>
            <div className="plan-card-total">
              <span>Estimated total</span>
              <strong>
                {inr(plan.totalLow)}–{inr(plan.totalHigh).replace("₹", "")}
              </strong>
            </div>
            <dl className="plan-card-rows">
              <div className="plan-card-row">
                <dt>Shops</dt>
                <dd>{plan.shops}</dd>
              </div>
              <div className="plan-card-row">
                <dt>Walking</dt>
                <dd>{plan.walkingMinutes} min</dd>
              </div>
              <div className="plan-card-row">
                <dt>Coverage</dt>
                <dd>{plan.coverage}</dd>
              </div>
              <div className="plan-card-row">
                <dt>Confidence</dt>
                <dd>{plan.confidence}%</dd>
              </div>
              <div className="plan-card-row">
                <dt>Trade-off</dt>
                <dd>{plan.tradeoff}</dd>
              </div>
            </dl>
            <div className="plan-card-cta">
              <Link
                href={`/b/demo/run?plan=${plan.key}`}
                className={`btn ${plan.recommended ? "btn-primary" : "btn-quiet"}`}
              >
                Choose {plan.name} <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="matrix-note">
        <span>Prices are estimates, not reservations.</span>
        <span>·</span>
        <span>No plan hidden behind a login.</span>
        <span>·</span>
        <span>1 stop is cheap in time, not in coverage.</span>
      </div>

      <div className="tradeoff-strip">
        <div className="tradeoff-card">
          <strong>Where Fastest loses</strong>
          {fastest.caveat}
        </div>
        <div className="tradeoff-card">
          <strong>Where Cheapest wins</strong>
          Save ₹60–80 and cover all 7 items. The extra stop is 8 minutes from the first;
          both are inside the same cluster.
        </div>
      </div>

      <section className="breakdowns" aria-labelledby="breakdown-heading">
        <h2 id="breakdown-heading">Shop-by-shop breakdown</h2>
        <div className="breakdown-grid">
          {plans.map((plan) => (
            <details className="breakdown" key={plan.key} open={plan.key === "cheapest"}>
              <summary>
                <span>
                  {plan.name} · {plan.shops} {plan.shops === 1 ? "shop" : "shops"}
                </span>
                <span className="summary-right">
                  {inr(plan.totalLow)}–{inr(plan.totalHigh).replace("₹", "")}
                  <ChevronDown size={13} className="chev" aria-hidden="true" />
                </span>
              </summary>
              {plan.shopBreakdown.map((shop) => (
                <div className="shop-row" key={shop.shop}>
                  <div className="shop-row-top">
                    <span className="shop-name">{shop.shop}</span>
                    <span className="shop-subtotal">{shop.subtotal}</span>
                  </div>
                  <p className="shop-address">
                    {shop.area} · {shop.floor} · walk {shop.walking}
                  </p>
                  <p className="shop-items">{shop.items}</p>
                </div>
              ))}
              <p className="breakdown-note">
                {plan.key === "cheapest" ? (
                  <>
                    <AlertTriangle
                      size={11}
                      aria-hidden="true"
                      style={{ display: "inline", color: "var(--warn)", marginRight: 4 }}
                    />
                    Relay row still needs a spec decision before purchase.
                  </>
                ) : (
                  "Add the missing sensor as a second stop or order online. Demo only."
                )}
              </p>
            </details>
          ))}
        </div>
      </section>

      <div className="plans-actions">
        <Link href="/b/demo" className="btn btn-quiet">
          <ArrowLeft size={13} aria-hidden="true" /> Back to bench sheet
        </Link>
        <Link href="/b/demo/run" className="btn btn-primary">
          Open the recommended run sheet <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>
          DEMO · NO LIVE RESERVATIONS
        </span>
      </div>
    </div>
  );
}
