import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, Footprints, MapPin } from "lucide-react";
import { StartForm } from "@/components/start-form";
import { RouteLadder } from "@/components/route-ladder";

export const metadata: Metadata = {
  title: "SP Road, optimized",
  description:
    "Paste a BOM or describe a project. Get a demo SP Road purchase plan with shop stops, price bands and a run sheet.",
};

export default function StartPage() {
  return (
    <div className="container start-main">
      <section className="start-hero" aria-labelledby="start-heading">
        <div className="start-hero-copy">
          <p className="eyebrow">SP Road, Bengaluru / RVCE pilot</p>
          <h1 className="page-title" id="start-heading">
            Paste your parts list.
            <br />
            We'll find it on SP Road.
          </h1>
          <p className="lede">
            Turn a messy BOM into a verified local purchase plan — matched components,
            honest price bands, and the fewest shop stops that still cover the build.
          </p>
          <div className="start-meta" aria-label="Pilot facts">
            <span>
              <MapPin size={12} aria-hidden="true" /> SP Road · ~1,500 shops
            </span>
            <span>
              <Footprints size={12} aria-hidden="true" /> Ordered stops, no map SDK
            </span>
            <span>
              <Clock3 size={12} aria-hidden="true" /> One trip, not three
            </span>
          </div>
        </div>
        <div className="route-card" aria-label="SP Road stop preview">
          <RouteLadder />
        </div>
      </section>

      <div className="start-grid">
        <section aria-label="Start a parts list">
          <StartForm />
        </section>

        <aside className="side-stack" aria-label="How ENGI-MART works">
          <div className="brief-block">
            <h2>How the bench sheet works</h2>
            <ol className="brief-steps">
              <li>
                <span className="step-num">01</span>
                <div>
                  <p className="step-title">Drop in a list, or a rough idea</p>
                  <p className="step-copy">
                    Paste one part per line. Choose a starter or describe the build — you
                    review every matched row.
                  </p>
                </div>
              </li>
              <li>
                <span className="step-num">02</span>
                <div>
                  <p className="step-title">Resolve the specs that matter</p>
                  <p className="step-copy">
                    Logic levels, coil voltages, package and pinout are checked before
                    price. Ambiguity stays visible.
                  </p>
                </div>
              </li>
              <li>
                <span className="step-num">03</span>
                <div>
                  <p className="step-title">Walk one plan</p>
                  <p className="step-copy">
                    Fastest or cheapest. Take the run sheet: shop, floor, stall, phone,
                    price band, checklist.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="provenance-card">
            <div className="provenance-head">
              <span className="eyebrow">Price provenance</span>
              <span className="demo-tag">SAMPLE</span>
            </div>
            <p className="price mono">₹220–250</p>
            <p className="provenance-line">reported 3d ago · 2 reports · 86%</p>
            <p className="provenance-note">
              Every price carries an age, source count and confidence band. Estimates are
              useful; certainty is not for sale.
            </p>
          </div>

          <div className="demo-banner">
            <strong>Demo dataset</strong>
            <span style={{ flex: 1, minWidth: 180 }}>
              Shops, prices and stock are illustrative.{" "}
              <Link className="text-link" href="/method">
                How estimates work
              </Link>
            </span>
          </div>
        </aside>
      </div>

      <div
        className="mono"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 18px",
          marginTop: 32,
          paddingTop: 13,
          borderTop: "1px solid var(--hairline)",
          fontSize: 12,
          letterSpacing: "0.01em",
          color: "var(--ink-muted)",
        }}
      >
        <span>Scope / BOM → local plan</span>
        <span>No checkout</span>
        <span>No live stock</span>
        <span>No account</span>
        <Link href="/b/demo" className="text-link-green" style={{ marginLeft: "auto" }}>
          Open the demo bench sheet <ArrowRight size={11} style={{ display: "inline" }} />
        </Link>
      </div>
    </div>
  );
}
