import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Footprints,
  Store,
} from "lucide-react";
import { bomItems, demoSession, inr, priceBand } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Smart Plant Watering — Bench sheet",
  description: "Demo BOM workspace for the ENGI-MART Bench Sheet.",
  robots: { index: false, follow: false },
};

export default function DemoWorkspacePage() {
  const headroomLow = demoSession.budget - demoSession.estimateHigh;
  const headroomHigh = demoSession.budget - demoSession.estimateLow;

  return (
    <div className="container page">
      <div className="crumb-row">
        <Link href="/" className="crumb-back">
          <ArrowLeft size={12} aria-hidden="true" /> Start
        </Link>
        <span className="crumb-meta">
          Demo session · read-only · updated {demoSession.updated}
        </span>
      </div>

      <header className="workspace-titlebar">
        <div>
          <p className="eyebrow">BOM workspace / {demoSession.mode}</p>
          <h1>{demoSession.project}</h1>
          <p className="lede" style={{ marginTop: 6, fontSize: 15 }}>
            7 components · target board {demoSession.board} · budget {inr(demoSession.budget)}
          </p>
        </div>
        <div className="title-actions">
          <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>
            READ-ONLY DEMO
          </span>
          <Link href="/b/demo/run" className="btn btn-primary">
            Open run sheet <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className="demo-banner demo-strip" role="note">
        <strong>Demo data</strong>
        <span style={{ flex: 1, minWidth: 220 }}>
          Seeded components, shops and price bands. Not live inventory and not real shop
          quotes. Confirm every price before travel.
        </span>
        <Link href="/method" className="text-link">
          Method
        </Link>
      </div>

      <div className="workspace">
        <section className="bench" aria-labelledby="bom-heading">
          <div className="bench-head">
            <h2 id="bom-heading">Bill of materials</h2>
            <span className="bench-mapped">
              <span className="mapped-ok">7 of 7</span> mapped to the demo catalog
            </span>
          </div>

          <div className="table-wrap">
            <table className="bench-table" aria-label="Demo bill of materials">
              <caption className="sr-only">
                Demo bill of materials with quantity, specification, match status and
                estimated price band.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="col-idx">
                    #
                  </th>
                  <th scope="col" className="col-item">
                    Component
                  </th>
                  <th scope="col" className="col-qty">
                    Qty
                  </th>
                  <th scope="col" className="col-spec">
                    Specification
                  </th>
                  <th scope="col" className="col-status">
                    Status
                  </th>
                  <th scope="col" className="col-price">
                    Est. price
                  </th>
                  <th scope="col" className="col-conf">
                    Conf.
                  </th>
                </tr>
              </thead>
              <tbody>
                {bomItems.map((item, index) => (
                  <ItemRows key={item.id} item={item} index={index} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="bom-cards" aria-label="Demo bill of materials">
            {bomItems.map((item, index) => (
              <BomCard key={item.id} item={item} index={index} />
            ))}
          </div>

          <div className="bench-foot">
            <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>
              7 ROWS · {demoSession.stops} SHOPS · DEMO CATALOG
            </span>
            <span className="spacer" />
            <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>
              Row editing is not wired in this UI scaffold.
            </span>
          </div>
          <p className="table-footnote">
            Price bands are p25–p75 style estimates from the seeded dataset. Age is shown per
            row. A “spec warning” is a deterministic rule result, not a preference.
          </p>
        </section>

        <aside className="summary" aria-labelledby="summary-heading">
          <div className="summary-head">
            <div className="summary-head-row">
              <h2 className="summary-title" id="summary-heading">
                Plan summary
              </h2>
              <span className="demo-tag" style={{ fontSize: 11.5 }}>
                DEMO
              </span>
            </div>
            <p className="summary-range">
              {inr(demoSession.estimateLow)}–{inr(demoSession.estimateHigh).replace("₹", "")}
            </p>
            <p className="summary-range-label">Estimated basket · not a reservation</p>

            <div className="ruler" aria-label={`Estimated total ${inr(demoSession.estimateLow)} to ${inr(demoSession.estimateHigh)} against a budget of ${inr(demoSession.budget)}`}>
              <div className="ruler-track">
                <div className="ruler-fill" style={{ width: "64%" }} />
                <div className="ruler-marker" style={{ left: "64%" }} aria-hidden="true" />
              </div>
              <div className="ruler-labels">
                <span>₹0</span>
                <span>BUDGET {inr(demoSession.budget)}</span>
              </div>
              <div className="ruler-caption">
                <span>Budget left</span>
                <strong>
                  {inr(headroomLow)}–{inr(headroomHigh).replace("₹", "")}
                </strong>
              </div>
            </div>
          </div>

          <div className="summary-stats">
            <div className="summary-stat">
              <span>
                <Store size={13} aria-hidden="true" /> Shops
              </span>
              <strong>{demoSession.stops} stops</strong>
            </div>
            <div className="summary-stat">
              <span>
                <Footprints size={13} aria-hidden="true" /> Walking
              </span>
              <strong>{demoSession.walkingMinutes} min</strong>
            </div>
            <div className="summary-stat">
              <span>
                <Check size={13} aria-hidden="true" /> Coverage
              </span>
              <strong>
                {demoSession.mappedCount} / {demoSession.itemCount}
              </strong>
            </div>
            <div className="summary-stat">
              <span>
                <Clock3 size={13} aria-hidden="true" /> Confidence
              </span>
              <strong className="conf-meter">
                <span className="conf-track" aria-hidden="true">
                  <span className="conf-fill" style={{ width: `${demoSession.confidence}%` }} />
                </span>
                {demoSession.confidence}%
              </strong>
            </div>
          </div>

          <div className="summary-warning">
            <AlertTriangle size={13} aria-hidden="true" />
            <span>
              1 spec warning: relay coil is 5 V, ESP32 GPIO is 3.3 V logic.{" "}
              <Link href="#bom-heading">Review row 3</Link>.
            </span>
          </div>

          <div className="summary-actions">
            <Link href="/b/demo/plans" className="btn btn-primary btn-block">
              Compare plans <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <p className="summary-provenance">
            ESTIMATE · 11 demo observations · newest 2d old
            <br />
            Sources are seeded; no live shop feed is connected.
          </p>
        </aside>
      </div>

      <div className="mobile-compare">
        <div>
          <span className="mc-label">Plan summary · demo</span>
          <span className="mc-value">
            {inr(demoSession.estimateLow)}–{inr(demoSession.estimateHigh).replace("₹", "")} ·{" "}
            {demoSession.stops} stops
          </span>
          <span className="mc-meta">
            {demoSession.walkingMinutes} min walking · {demoSession.confidence}% confidence
          </span>
        </div>
        <Link href="/b/demo/plans" className="btn">
          Compare plans
        </Link>
      </div>
    </div>
  );
}

function BomCard({
  item,
  index,
}: {
  item: (typeof bomItems)[number];
  index: number;
}) {
  const reportedShort = item.reported.replace("reported ", "").split(" · ")[0];

  return (
    <article className={`bom-card ${item.status === "warning" ? "bom-card--warning" : ""}`}>
      <div className="bom-card-head">
        <span className="bom-card-idx">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="bom-card-name">{item.name}</h3>
        <span className="bom-card-qty">×{item.qty}</span>
      </div>
      <p className="bom-card-variant">{item.variant}</p>
      <p className="bom-card-spec">{item.spec}</p>
      <div className="bom-card-bottom">
        <span
          className={`status-chip ${
            item.status === "warning" ? "status-chip--warn" : "status-chip--ok"
          }`}
        >
          {item.status === "warning" ? (
            <AlertTriangle size={11} aria-hidden="true" />
          ) : (
            <Check size={11} aria-hidden="true" />
          )}
          {item.statusLabel}
        </span>
        <span className="bom-card-price">
          {priceBand(item.priceLow, item.priceHigh)}
          <span className="conf">
            {reportedShort} · {item.confidence}%
          </span>
        </span>
      </div>
      {item.note && item.status !== "warning" ? (
        <p className="bom-card-note">{item.note}</p>
      ) : null}
      {item.warning ? (
        <div className="bom-card-warning">
          <p className="warning-title">Spec warning · {item.warning.title}</p>
          <p className="warning-body">{item.warning.body}</p>
          <div className="warning-actions" aria-label="Suggested fixes (demo only)">
            {item.warning.options.map((option) => (
              <span className="chip" key={option}>
                {option}
              </span>
            ))}
          </div>
          <p className="table-footnote">Suggested fixes are illustrative in this demo.</p>
        </div>
      ) : null}
    </article>
  );
}

function ItemRows({
  item,
  index,
}: {
  item: (typeof bomItems)[number];
  index: number;
}) {
  const reportedShort = item.reported.replace("reported ", "").split(" · ")[0];

  return (
    <>
      <tr className={item.status === "warning" ? "warning-cell" : undefined}>
        <td className="col-idx">{String(index + 1).padStart(2, "0")}</td>
        <td className="col-item">
          <span className="item-name">{item.name}</span>
          <span className="item-variant">{item.variant}</span>
          <span className="mobile-spec">{item.spec}</span>
          {item.note && item.status !== "warning" ? (
            <span className="row-note">{item.note}</span>
          ) : null}
        </td>
        <td className="col-qty">
          <span className="qty-val">×{item.qty}</span>
        </td>
        <td className="col-spec">
          <span className="spec-cell">{item.spec}</span>
        </td>
        <td className="col-status">
          <span
            className={`status-chip ${
              item.status === "warning" ? "status-chip--warn" : "status-chip--ok"
            }`}
          >
            {item.status === "warning" ? (
              <AlertTriangle size={11} aria-hidden="true" />
            ) : (
              <Check size={11} aria-hidden="true" />
            )}
            {item.statusLabel}
          </span>
        </td>
        <td className="col-price">
          <span className="price-cell">
            {priceBand(item.priceLow, item.priceHigh)}
            <span className="conf">
              {reportedShort} · {item.confidence}%
            </span>
          </span>
        </td>
        <td className="col-conf">{item.confidence}%</td>
      </tr>
      {item.warning ? (
        <tr>
          <td colSpan={7} className="warning-detail">
            <div className="warning-inner">
              <AlertTriangle size={15} aria-hidden="true" />
              <div>
                <p className="warning-title">Spec warning · {item.warning.title}</p>
                <p className="warning-body">{item.warning.body}</p>
                <div className="warning-actions" aria-label="Suggested fixes (demo only)">
                  {item.warning.options.map((option) => (
                    <span className="chip" key={option}>
                      {option}
                    </span>
                  ))}
                </div>
                <p className="table-footnote" style={{ marginTop: 7 }}>
                  Suggested fixes are illustrative in this demo. Compatibility checks run
                  before pricing.
                </p>
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
