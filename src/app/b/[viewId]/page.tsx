import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Clock3, Footprints, Store } from "lucide-react";
import { getWorkspace, type WorkspaceItem } from "@/server/workspace";
import { inrFromPaisa, inrRange, pct } from "@/lib/format";


export const instant = false;

export const metadata: Metadata = {
  title: "Bench sheet",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ viewId: string }> };

function listingBand(item: WorkspaceItem) {
  const inStock = item.offers.filter((offer) => offer.stockStatus !== "out");
  const pool = inStock.length > 0 ? inStock : item.offers;
  if (pool.length === 0) return null;
  const prices = pool.map((offer) => offer.pricePaisa);
  return { low: Math.min(...prices), high: Math.max(...prices) };
}

function itemConfidence(item: WorkspaceItem): number | null {
  if (item.matchConfidence !== null) return item.matchConfidence;
  if (item.offers.length === 0) return null;
  return Math.max(...item.offers.map((offer) => offer.confidence ?? 0));
}

function statusFor(item: WorkspaceItem) {
  if (!item.variant) return { label: "Unmatched", kind: "warn" as const };
  if (item.offers.length === 0) return { label: "No local listing", kind: "warn" as const };
  if (item.offers.every((offer) => offer.stockStatus === "out")) {
    return { label: "Out of stock", kind: "warn" as const };
  }
  if (item.offers.every((offer) => (offer.confidence ?? 0) < 0.35)) {
    return { label: "Low confidence", kind: "warn" as const };
  }
  return { label: "Matched", kind: "ok" as const };
}

export default async function WorkspacePage({ params }: PageProps) {
  const { viewId } = await params;
  const workspace = await getWorkspace(viewId);
  if (!workspace) notFound();

  const { session, items, plans } = workspace;
  const plan = plans.cheapest;
  const matched = items.filter((item) => item.variant).length;
  const budget = session.budgetPaisa;
  const budgetFill = budget ? Math.min(100, Math.round((plan.budgetUpperBoundPaisa / budget) * 100)) : 0;
  const headroom = budget ? budget - plan.budgetUpperBoundPaisa : null;

  return (
    <div className="container page">
      <div className="crumb-row">
        <Link href="/" className="crumb-back">
          <ArrowLeft size={12} aria-hidden="true" /> Start
        </Link>
        <span className="crumb-meta">
          Session {session.publicToken} · read-only · {session.mode === "bom" ? "pasted BOM" : "project idea"}
        </span>
      </div>

      <header className="workspace-titlebar">
        <div>
          <p className="eyebrow">BOM workspace / live plan</p>
          <h1>{session.title}</h1>
          <p className="lede" style={{ marginTop: 6, fontSize: 15 }}>
            {items.length} components · seeded catalog · budget{" "}
            {budget ? inrFromPaisa(budget) : "not set"}
          </p>
        </div>
        <div className="title-actions">
          <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>
            READ-ONLY
          </span>
          <Link href={`/b/${session.publicToken}/plans`} className="btn btn-primary">
            Compare plans <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className="demo-banner demo-strip" role="note">
        <strong>Seeded catalog</strong>
        <span style={{ flex: 1, minWidth: 220 }}>
          Price bands are estimates from demo observations. Not live inventory and not real
          shop quotes. Confirm stock and price before travel.
        </span>
        <Link href="/method" className="text-link">
          Method
        </Link>
      </div>

      <div className="workspace">
        <section aria-labelledby="live-bom-heading">
          <div className="bench-head">
            <h2 id="live-bom-heading">Bill of materials</h2>
            <span className="bench-mapped">
              <span className="mapped-ok">{matched} of {items.length}</span> matched
            </span>
          </div>

          <div className="table-wrap">
            <table className="bench-table" aria-label="Bill of materials and local estimates">
              <caption className="sr-only">
                Bill of materials with quantity, estimate, confidence and match status.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="col-idx">#</th>
                  <th scope="col" className="col-item">Component</th>
                  <th scope="col" className="col-qty">Qty</th>
                  <th scope="col" className="col-price">Est. price</th>
                  <th scope="col" className="col-status">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const band = listingBand(item);
                  const status = statusFor(item);
                  const confidence = itemConfidence(item);
                  return (
                    <tr key={item.id}>
                      <td className="col-idx">{String(index + 1).padStart(2, "0")}</td>
                      <td className="col-item">
                        <span className="item-name">{item.rawText}</span>
                        <span className="item-variant">
                          {item.variant
                            ? `${item.variant.displayName} · ${item.variant.familyName}`
                            : "No catalog match"}
                        </span>
                        <span className="row-note">
                          {!item.variant
                            ? "This row cannot enter a purchase plan until it is matched."
                            : band === null
                              ? "No local listing found. Consider an online source."
                              : item.note || `${item.offers.length} listing${item.offers.length === 1 ? "" : "s"} · ${item.variant.unitLabel}`}
                        </span>
                      </td>
                      <td className="col-qty"><span className="qty-val">×{item.qty}</span></td>
                      <td className="col-price">
                        <span className="price-cell">
                          {band ? inrRange(band.low, band.high) : "unmatched"}
                          {confidence !== null ? (
                            <span className="conf">{pct(confidence)} match</span>
                          ) : null}
                        </span>
                      </td>
                      <td className="col-status">
                        <span className={`status-chip ${status.kind === "ok" ? "status-chip--ok" : "status-chip--warn"}`}>
                          {status.kind === "ok" ? <Check size={11} aria-hidden="true" /> : <AlertTriangle size={11} aria-hidden="true" />}
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="table-footnote">
            Rows are read-only in this milestone. Price bands show the seeded listing range;
            confidence is the stored match confidence or listing confidence.
          </p>
        </section>

        <aside className="summary" aria-labelledby="live-summary-heading">
          <div className="summary-head">
            <div className="summary-head-row">
              <h2 className="summary-title" id="live-summary-heading">Plan summary</h2>
              <span className="demo-tag">CHEAPEST</span>
            </div>
            <p className="summary-range">
              {inrRange(plan.estimatedTotalPaisa, plan.budgetUpperBoundPaisa)}
            </p>
            <p className="summary-range-label">Estimated basket · not a reservation</p>

            {budget ? (
              <div className="ruler" aria-label="Estimate against budget">
                <div className="ruler-track">
                  <div className="ruler-fill" style={{ width: `${budgetFill}%` }} />
                  <div className="ruler-marker" style={{ left: `${budgetFill}%` }} aria-hidden="true" />
                </div>
                <div className="ruler-labels">
                  <span>₹0</span>
                  <span>BUDGET {inrFromPaisa(budget)}</span>
                </div>
                <div className="ruler-caption">
                  <span>Budget headroom</span>
                  <strong style={{ color: headroom !== null && headroom < 0 ? "var(--danger)" : undefined }}>
                    {headroom !== null && headroom >= 0 ? inrFromPaisa(headroom) : headroom !== null ? `${inrFromPaisa(Math.abs(headroom))} over` : "—"}
                  </strong>
                </div>
              </div>
            ) : null}
          </div>

          <div className="summary-stats">
            <div className="summary-stat">
              <span><Store size={13} aria-hidden="true" /> Shops</span>
              <strong>{plan.shopIds.length} stop{plan.shopIds.length === 1 ? "" : "s"}</strong>
            </div>
            <div className="summary-stat">
              <span><Footprints size={13} aria-hidden="true" /> Walking</span>
              <strong>{plan.walkingMinutes} min</strong>
            </div>
            <div className="summary-stat">
              <span><Check size={13} aria-hidden="true" /> Coverage</span>
              <strong>{plan.coverageCount} / {plan.totalItems}</strong>
            </div>
            <div className="summary-stat">
              <span><Clock3 size={13} aria-hidden="true" /> Confidence</span>
              <strong>{pct(plan.planConfidence)}</strong>
            </div>
          </div>

          {plan.missingItems.length > 0 || plan.warnings.length > 0 ? (
            <div className="summary-warning">
              <AlertTriangle size={13} aria-hidden="true" />
              <span>
                {plan.missingItems.length > 0
                  ? `${plan.missingItems.length} ${plan.missingItems.length === 1 ? "item" : "items"} missing: ${plan.missingItems.map((item) => item.rawText).join(", ")}.`
                  : plan.warnings[0]}
              </span>
            </div>
          ) : null}

          <div className="summary-actions">
            <Link href={`/b/${session.publicToken}/plans`} className="btn btn-primary btn-block">
              Compare plans <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="summary-actions" style={{ borderTop: 0, paddingTop: 0 }}>
            <Link href={`/b/${session.publicToken}/run?plan=cheapest`} className="btn btn-quiet btn-block">
              Open run sheet
            </Link>
          </div>
          <p className="summary-provenance">
            CHEAPEST PLAN · ESTIMATE + UPPER BAND
            <br />
            Seeded data only. No live shop feed.
          </p>
        </aside>
      </div>
    </div>
  );
}
