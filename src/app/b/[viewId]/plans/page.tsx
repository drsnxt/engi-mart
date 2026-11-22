import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getWorkspace } from "@/server/workspace";
import { inrFromPaisa, inrRange, pct } from "@/lib/format";


export const instant = false;

export const metadata: Metadata = {
  title: "Compare plans",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ viewId: string }> };

export default async function PlansPage({ params }: PageProps) {
  const { viewId } = await params;
  const workspace = await getWorkspace(viewId);
  if (!workspace) notFound();

  const { session, plans, items } = workspace;
  const rows = [plans.fastest, plans.cheapest];

  return (
    <div className="container page plans-page">
      <div className="crumb-row">
        <Link href={`/b/${session.publicToken}`} className="crumb-back">
          <ArrowLeft size={12} aria-hidden="true" /> Bench sheet
        </Link>
        <span className="crumb-meta">Plan comparison · {session.publicToken}</span>
      </div>

      <header className="plans-head">
        <p className="eyebrow">Plan comparison / live solve</p>
        <h1 className="page-title">Two ways to buy the same list.</h1>
        <p className="lede" style={{ marginTop: 10, maxWidth: 680 }}>
          Fastest is cheaper only because one item is missing; add it as a second stop to
          compare like for like. Coverage is compared before total.
        </p>
        <div className="plans-sub">
          <span>{session.title}</span>
          <span>{items.length} items</span>
          <span>Budget {session.budgetPaisa ? inrFromPaisa(session.budgetPaisa) : "not set"}</span>
          <span>Seeded estimates</span>
        </div>
      </header>

      <div className="demo-banner" style={{ marginTop: 14 }} role="note">
        <strong>Seeded estimate</strong>
        <span style={{ flex: 1, minWidth: 220 }}>
          Totals are computed from demo listings. They are not live shop prices or
          reservations. Confirm before you travel.
        </span>
        <Link href="/method" className="text-link">Method</Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 14,
          marginTop: 22,
          alignItems: "start",
        }}
      >
        {rows.map((plan, index) => {
          const isBest = plan.id === "cheapest";
          return (
            <article className={`plan-card ${isBest ? "is-best" : ""}`} key={plan.id}>
              <div className="plan-card-head">
                <div className="plan-above">
                  <span className="eyebrow">Option {String(index + 1).padStart(2, "0")}</span>
                  {isBest ? (
                    <span className="rec-badge"><Check size={8} aria-hidden="true" /> Cheapest</span>
                  ) : null}
                </div>
                <span className="plan-name">
                  {plan.id === "fastest"
                    ? `Fastest · ${plan.coverageCount} of ${plan.totalItems}`
                    : plan.coverageCount === plan.totalItems
                      ? "Cheapest · full basket"
                      : `Cheapest · ${plan.coverageCount} of ${plan.totalItems}`}
                </span>
                <span className="plan-tagline">
                  {plan.id === "fastest" ? "One shop. Shortest walk." : "Up to two shops. Lowest full total."}
                </span>
              </div>

              <div className="plan-card-total">
                <span>Estimated total</span>
                <strong>{inrRange(plan.estimatedTotalPaisa, plan.budgetUpperBoundPaisa)}</strong>
              </div>

              <dl className="plan-card-rows">
                <div className="plan-card-row">
                  <dt>Shops</dt>
                  <dd>{plan.shopIds.length} stop{plan.shopIds.length === 1 ? "" : "s"}</dd>
                </div>
                <div className="plan-card-row">
                  <dt>Walking</dt>
                  <dd>{plan.walkingMinutes} min</dd>
                </div>
                <div className="plan-card-row">
                  <dt>Coverage</dt>
                  <dd>{plan.coverageCount} / {plan.totalItems}</dd>
                </div>
                <div className="plan-card-row">
                  <dt>Confidence</dt>
                  <dd>{pct(plan.planConfidence)}</dd>
                </div>
                <div className="plan-card-row">
                  <dt>Missing</dt>
                  <dd>
                    {plan.missingItems.length === 0
                      ? "None"
                      : plan.missingItems.map((item) => item.rawText).join(", ")}
                  </dd>
                </div>
                <div className="plan-card-row">
                  <dt>Shops used</dt>
                  <dd>{plan.shopNames.length > 0 ? plan.shopNames.join(" · ") : "No full plan"}</dd>
                </div>
              </dl>

              {plan.warnings.length > 0 ? (
                <div style={{ padding: "0 13px 11px" }}>
                  <div className="summary-warning" style={{ margin: 0 }}>
                    <AlertTriangle size={12} aria-hidden="true" />
                    <span>{plan.warnings.join(" ").replace(/\b1 items\b/g, "1 item")}</span>
                  </div>
                </div>
              ) : null}

              <div className="plan-card-cta">
                <Link
                  href={`/b/${session.publicToken}/run?plan=${plan.id}`}
                  className={`btn ${isBest ? "btn-primary" : "btn-quiet"}`}
                >
                  Choose {plan.id} <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="matrix-note">
        <span>Estimates only.</span>
        <span>·</span>
        <span>No hidden value-of-time constant.</span>
        <span>·</span>
        <span>{plans.cheapest.shopIds.length} shops on the cheapest plan.</span>
      </div>

      <div className="plans-actions">
        <Link href={`/b/${session.publicToken}`} className="btn btn-quiet">
          <ArrowLeft size={13} aria-hidden="true" /> Back to bench sheet
        </Link>
        <Link href={`/b/${session.publicToken}/run?plan=cheapest`} className="btn btn-primary">
          Open cheapest run sheet <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>
          SEEDED DATA · NO LIVE RESERVATIONS
        </span>
      </div>
    </div>
  );
}
