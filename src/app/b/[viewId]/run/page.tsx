import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, Footprints, Phone } from "lucide-react";
import { getWorkspace } from "@/server/workspace";
import { inrFromPaisa, inrRange, pct } from "@/lib/format";


export const instant = false;

export const metadata: Metadata = {
  title: "Run sheet",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ viewId: string }>;
  searchParams: Promise<{ plan?: string | string[] }>;
};

export default async function RunPage({ params, searchParams }: PageProps) {
  const { viewId } = await params;
  const query = await searchParams;
  const workspace = await getWorkspace(viewId);
  if (!workspace) notFound();

  const { session, plans, items, shops } = workspace;
  const requested = Array.isArray(query.plan) ? query.plan[0] : query.plan;
  const plan = requested === "fastest" ? plans.fastest : plans.cheapest;
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const shopsById = new Map(shops.map((shop) => [shop.id, shop]));

  return (
    <div className="container run-page">
      <div className="run-top">
        <Link href={`/b/${session.publicToken}`} className="crumb-back">
          <ArrowLeft size={12} aria-hidden="true" /> Bench sheet
        </Link>
        <div className="run-toolbar">
          <Link
            href={`/b/${session.publicToken}/run?plan=fastest`}
            className={`btn btn-sm ${plan.id === "fastest" ? "btn-primary" : "btn-quiet"}`}
          >
            Fastest
          </Link>
          <Link
            href={`/b/${session.publicToken}/run?plan=cheapest`}
            className={`btn btn-sm ${plan.id === "cheapest" ? "btn-primary" : "btn-quiet"}`}
          >
            Cheapest
          </Link>
        </div>
      </div>

      <div className="demo-banner" style={{ marginBottom: 12 }} role="note">
        <strong>Seeded run sheet</strong>
        <span style={{ flex: 1, minWidth: 200 }}>
          Confirm stock by phone before travel. Prices are estimates, not reservations.
        </span>
        <Link href={`/b/${session.publicToken}/plans`} className="text-link">Compare</Link>
      </div>

      <article className="run-card" aria-labelledby="run-title">
        <header className="run-card-head">
          <div className="run-kicker">
            <strong>ENGI-MART RUN SHEET</strong>
            <span>SP ROAD · SEEDED DATA</span>
          </div>
          <h1 className="run-project" id="run-title">{session.title}</h1>
          <div className="run-sub">
            <span>{plan.id === "fastest" ? "Fastest" : "Cheapest"} · {plan.coverageCount} of {plan.totalItems} items</span>
            <span>{plan.shopIds.length} shop{plan.shopIds.length === 1 ? "" : "s"}</span>
            <span>read-only</span>
          </div>
          <div className="run-head-metrics">
            <div>
              <span className="run-metric-label">Est. basket</span>
              <span className="run-metric-value">{inrRange(plan.estimatedTotalPaisa, plan.budgetUpperBoundPaisa)}</span>
            </div>
            <div>
              <span className="run-metric-label">Budget</span>
              <span className="run-metric-value">{session.budgetPaisa ? inrFromPaisa(session.budgetPaisa) : "—"}</span>
            </div>
            <div>
              <span className="run-metric-label">Walking</span>
              <span className="run-metric-value">{plan.walkingMinutes} min</span>
            </div>
            <div>
              <span className="run-metric-label">Confidence</span>
              <span className="run-metric-value" style={{ color: "var(--accent)" }}>{pct(plan.planConfidence)}</span>
            </div>
          </div>
          {plan.missingItems.length > 0 ? (
            <p className="run-missing">
              Missing: {plan.missingItems.map((item) => item.rawText).join(", ")}. Add a
              second stop for full coverage.
            </p>
          ) : null}
        </header>

        <div className="run-stops">
          {plan.shopIds.length === 0 ? (
            <p className="table-footnote" style={{ padding: "18px 0" }}>
              No shop covers any item in this plan yet.
            </p>
          ) : null}
          {plan.shopIds.map((shopId, index) => {
            const shop = shopsById.get(shopId);
            const allocations = plan.allocations.filter((allocation) => allocation.shopId === shopId);
            const subtotal = allocations.reduce((sum, allocation) => sum + allocation.totalCostPaisa, 0);
            return (
              <section className="run-stop" key={shopId} aria-labelledby={`stop-${shopId}`}>
                <div className="stop-head">
                  <span className="stop-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="stop-shop" id={`stop-${shopId}`}>{shop?.name ?? "Shop"}</h2>
                    <p className="stop-address">
                      {[shop?.building, shop?.floor, shop?.stallNo].filter(Boolean).join(" · ") || "SP Road"}
                    </p>
                    <p className="stop-walk">
                      <Footprints size={11} aria-hidden="true" /> schematic walking estimate
                    </p>
                  </div>
                  {shop?.phone ? (
                    <a href={`tel:${shop.phone}`} className="call-btn" aria-label={`Call ${shop.name}`}>
                      <Phone size={13} aria-hidden="true" /> Call
                    </a>
                  ) : (
                    <span className="call-btn" aria-hidden="true" title="No phone on record">No phone</span>
                  )}
                </div>

                <ul className="run-items">
                  {allocations.map((allocation) => {
                    const item = itemsById.get(allocation.bomItemId);
                    return (
                      <li className="run-item" key={allocation.bomItemId}>
                        <input
                          type="checkbox"
                          className="run-check"
                          id={`check-${allocation.bomItemId}`}
                          aria-label={`Mark ${item?.rawText ?? "item"} bought`}
                        />
                        <label className="run-item-label" htmlFor={`check-${allocation.bomItemId}`}>
                          <span>{item?.rawText ?? "Component"}</span>
                          <span className="run-item-qty">
                            ×{allocation.requestedQty}
                            {allocation.packSize > 1 ? ` · pk ${allocation.packSize}` : ""}
                          </span>
                        </label>
                        <span className="run-item-price">{inrFromPaisa(allocation.totalCostPaisa)}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="stop-note mono" style={{ fontSize: 11.5 }}>
                  SHOP SUBTOTAL {inrFromPaisa(subtotal)} · {allocations.length} ITEM{allocations.length === 1 ? "" : "S"}
                </p>
              </section>
            );
          })}
        </div>

        <div className="run-total">
          <div>
            <span className="run-total-label">{plan.id} plan total</span>
            <span className="run-total-value">
              {inrRange(plan.estimatedTotalPaisa, plan.budgetUpperBoundPaisa)}
            </span>
          </div>
          <div className="run-total-right">
            <span>COVERAGE {plan.coverageCount} / {plan.totalItems}</span>
            <span>{plan.id === "cheapest" ? "CHEAPEST" : "FASTEST"}</span>
          </div>
        </div>

        {plan.warnings.length > 0 ? (
          <div className="run-foot">
            <p>
              <AlertTriangle size={10} aria-hidden="true" style={{ display: "inline", marginRight: 4 }} />
              {plan.warnings[0].replace(/\b1 items\b/g, "1 item")}
            </p>
          </div>
        ) : null}

        <footer className="run-foot">
          <p>
            Seeded demo estimates only. No live stock, reservation or real shop quote. Call
            ahead and verify the exact part before paying.
          </p>
          <p className="mono" style={{ fontSize: 11.5 }}>
            SESSION {session.publicToken} · {plan.shopIds.length} STOP{plan.shopIds.length === 1 ? "" : "S"} · {plan.walkingMinutes} MIN WALKING
          </p>
        </footer>
      </article>

      <div className="plans-actions">
        <Link href={`/b/${session.publicToken}/plans`} className="btn btn-quiet">
          <ArrowLeft size={13} aria-hidden="true" /> Back to plans
        </Link>
        <Link href={`/b/${session.publicToken}`} className="btn btn-primary">
          Bench sheet <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
