"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock3,
  Footprints,
  MapPin,
  Phone,
  Share2,
  Sun,
} from "lucide-react";
import { demoSession, inr, priceBand, runStops } from "@/lib/mock-data";

const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.5-4.3a8.5 8.5 0 1 1 15.5-4.6Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M8.7 8.4c.2-.4.5-.4.8-.4h.3c.2 0 .4.1.5.4l.6 1.4c.1.3 0 .5-.2.7l-.4.5c-.1.2-.1.4 0 .6.4.7 1 1.3 1.8 1.7.2.1.4.1.6 0l.5-.5c.2-.2.4-.3.7-.2l1.5.7c.3.1.4.3.4.6 0 .8-.4 1.5-1 1.9-.5.4-1.2.5-2.4.1-1.9-.7-3.5-2.2-4.3-4.1-.4-1.1-.4-2.2.1-2.9Z"
      fill="currentColor"
    />
  </svg>
);

export function RunSheetClient() {
  const [highContrast, setHighContrast] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [shareNote, setShareNote] = useState("");

  const allItems = useMemo(() => runStops.flatMap((stop) => stop.items), []);
  const totals = useMemo(() => {
    const picked = allItems.filter((item) => checked[item.id]);
    return {
      low: picked.reduce((sum, item) => sum + item.priceLow * item.qty, 0),
      high: picked.reduce((sum, item) => sum + item.priceHigh * item.qty, 0),
      count: picked.length,
    };
  }, [allItems, checked]);

  const allChecked = allItems.length > 0 && allItems.every((item) => checked[item.id]);

  function toggle(id: string) {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
  }

  function shareOnWhatsApp() {
    const message = [
      "ENGI-MART demo run sheet: Smart Plant Watering",
      `Est. ${inr(demoSession.estimateLow)}–${inr(demoSession.estimateHigh).replace("₹", "")} · ${demoSession.stops} stops · ${demoSession.itemCount} items`,
      "1. Om Electronics — Silver Tool Complex, 1st floor #14",
      "2. Sai Sensors — Golcha Market, ground floor #7",
      `Demo sheet: ${typeof window !== "undefined" ? window.location.href : ""}`,
      "Prices are illustrative, not real shop quotes.",
    ].join("\n");
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setShareNote("WhatsApp share opened with the demo summary.");
  }

  return (
    <div className={highContrast ? "run-hc" : undefined}>
      <div className="container run-page">
        <div className="run-top">
          <Link href="/b/demo" className="crumb-back">
            <ArrowLeft size={12} aria-hidden="true" /> Bench sheet
          </Link>
          <div className="run-toolbar">
            <button
              type="button"
              className="btn btn-quiet btn-sm"
              aria-pressed={highContrast}
              onClick={() => setHighContrast((value) => !value)}
              title="Toggle sunlight high-contrast mode"
            >
              <Sun size={13} aria-hidden="true" />
              {highContrast ? "Contrast: high" : "High contrast"}
            </button>
            <button type="button" className="btn btn-sm btn-primary" onClick={shareOnWhatsApp}>
              <WhatsAppIcon />
              WhatsApp
            </button>
          </div>
        </div>

        <div className="demo-banner" style={{ marginBottom: 12 }} role="note">
          <strong>Demo run sheet</strong>
          <span style={{ flex: 1, minWidth: 200 }}>
            Illustrative shops and price bands. Call ahead. This sheet is not live stock and
            does not cache offline yet.
          </span>
        </div>

        <article className="run-card" aria-labelledby="run-title">
          <header className="run-card-head">
            <div className="run-kicker">
              <strong>ENGI-MART RUN SHEET</strong>
              <span>SP ROAD · 22 OCT · DEMO</span>
            </div>
            <h1 className="run-project" id="run-title">
              {demoSession.project}
            </h1>
            <div className="run-sub">
              <span>7 items · 2 shops</span>
              <span>target {demoSession.board}</span>
              <span>read-only demo</span>
            </div>
            <div className="run-head-metrics">
              <div>
                <span className="run-metric-label">Est. basket</span>
                <span className="run-metric-value">
                  {inr(demoSession.estimateLow)}–{inr(demoSession.estimateHigh).replace("₹", "")}
                </span>
              </div>
              <div>
                <span className="run-metric-label">Budget</span>
                <span className="run-metric-value">{inr(demoSession.budget)}</span>
              </div>
              <div>
                <span className="run-metric-label">Walking</span>
                <span className="run-metric-value">{demoSession.walkingMinutes} min</span>
              </div>
              <div>
                <span className="run-metric-label">Confidence</span>
                <span className="run-metric-value" style={{ color: "var(--accent)" }}>
                  {demoSession.confidence}%
                </span>
              </div>
            </div>
          </header>

          <div className="run-stops">
            {runStops.map((stop) => (
              <section className="run-stop" key={stop.id} aria-labelledby={`stop-${stop.id}`}>
                <div className="stop-head">
                  <span className="stop-num" aria-hidden="true">
                    {String(stop.order).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="stop-shop" id={`stop-${stop.id}`}>
                      {stop.shop}
                    </h2>
                    <p className="stop-address">
                      {stop.building} · {stop.floor} · {stop.stall}
                    </p>
                    <p className="stop-walk">
                      <Footprints size={11} aria-hidden="true" /> {stop.walking}
                    </p>
                  </div>
                  <a
                    href={`tel:${stop.phone}`}
                    className="call-btn"
                    aria-label={`Call ${stop.shop} at ${stop.phone}`}
                  >
                    <Phone size={13} aria-hidden="true" />
                    Call
                  </a>
                </div>
                <p className="stop-note">{stop.note}</p>
                <ul className="run-items">
                  {stop.items.map((item) => (
                    <li
                      key={item.id}
                      className={`run-item ${checked[item.id] ? "is-checked" : ""}`}
                    >
                      <input
                        type="checkbox"
                        className="run-check"
                        id={`check-${item.id}`}
                        checked={Boolean(checked[item.id])}
                        onChange={() => toggle(item.id)}
                      />
                      <label className="run-item-label" htmlFor={`check-${item.id}`}>
                        <span>{item.name}</span>
                        <span className="run-item-qty">×{item.qty}</span>
                      </label>
                      <span className="run-item-price">{priceBand(item.priceLow, item.priceHigh)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div
            className="run-total"
            aria-live="polite"
            aria-label={`Checked ${totals.count} of 7 items, ${inr(totals.low)} to ${inr(totals.high)}`}
          >
            <div>
              <span className="run-total-label">
                {totals.count === 0 ? "Nothing checked yet" : `${totals.count} checked`}
              </span>
              <span className="run-total-value">
                {totals.count === 0
                  ? `Est. ${inr(demoSession.estimateLow)}–${inr(demoSession.estimateHigh).replace("₹", "")}`
                  : `${inr(totals.low)}–${inr(totals.high).replace("₹", "")}`}
              </span>
            </div>
            <div className="run-total-right">
              <span>BUDGET {inr(demoSession.budget)}</span>
              <span>{allChecked ? "LIST COMPLETE" : `${7 - totals.count} REMAIN`}</span>
            </div>
          </div>

          <div className="run-actions">
            <button type="button" className="btn btn-primary" onClick={shareOnWhatsApp}>
              <Share2 size={14} aria-hidden="true" />
              Share on WhatsApp
            </button>
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => setHighContrast((value) => !value)}
              aria-pressed={highContrast}
            >
              <Sun size={14} aria-hidden="true" />
              {highContrast ? "Turn off high contrast" : "Sunlight mode"}
            </button>
          </div>

          <footer className="run-foot">
            <p>
              <MapPin size={10} aria-hidden="true" style={{ display: "inline", marginRight: 3 }} />
              Confirm stock by phone before you travel. Prices are last-reported estimates,
              not guaranteed. Demo sheet · no live shop feed.
            </p>
            <p>
              <Clock3 size={10} aria-hidden="true" style={{ display: "inline", marginRight: 3 }} />
              Suggested order: Om Electronics 1st, then Sai Sensors. Both in the Silver Tool
              / Golcha cluster.
            </p>
            {shareNote ? (
              <p role="status" className="mono" style={{ color: "var(--accent)" }}>
                <Check size={10} aria-hidden="true" style={{ display: "inline", marginRight: 3 }} />
                {shareNote}
              </p>
            ) : null}
          </footer>
        </article>

        <p className="hc-note">
          HIGH CONTRAST IS SCOPED TO THIS RUN SHEET. CHECKBOXES AND TOTALS ARE LOCAL TO THIS
          DEMO PAGE.
        </p>
      </div>
    </div>
  );
}
