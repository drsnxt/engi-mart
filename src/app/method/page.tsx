import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Method",
  description: "How ENGI-MART estimates prices, confidence, walking time and plan trade-offs.",
};

export default function MethodPage() {
  return (
    <div className="container read-page">
      <Link href="/" className="crumb-back">
        <ArrowLeft size={12} aria-hidden="true" /> Start
      </Link>
      <p className="eyebrow" style={{ marginTop: 18 }}>
        Method / version 0.1
      </p>
      <h1 className="page-title">How the numbers work.</h1>
      <p className="lede">
        ENGI-MART is an estimator, not a marketplace. This page explains the price bands,
        confidence numbers, walking times and plan trade-offs you see in the demo.
      </p>
      <p className="read-meta">PILOT · SP ROAD, BENGALURU · RVCE · DEMO BUILD</p>

      <div className="read-note">
        This build uses a seeded demo dataset. Shops, prices, stock and observations are
        illustrative and are not real shop quotes. No live shop feed is connected yet.
      </div>

      <section className="read-section">
        <h2>Estimates, not offers</h2>
        <p>
          A price band is a range built from price observations, not a reservation. The demo
          shows bands such as ₹220–250 with an age and report count. In production, bands use
          the interquartile range when there are enough observations; with fewer reports the
          band is the observed minimum–maximum, widened when confidence is low.
        </p>
        <p>
          We do not display fake precision. A band is honest about uncertainty; a single
          rupee value with no provenance is not.
        </p>
      </section>

      <section className="read-section">
        <h2>Confidence</h2>
        <p>
          Confidence combines three plain inputs: how recent the observations are, how
          reliable the source is, and how many independent reports exist. A price reported
          today by an audit counts more than a six-week-old student note. If the newest
          observation is more than 45 days old, the estimate is flagged stale and capped.
        </p>
        <p>
          Confidence is a communication tool, not a probability that a shop will honour a
          price. Stock and quotes can change before you arrive.
        </p>
      </section>

      <section className="read-section">
        <h2>Matching and compatibility</h2>
        <p>
          Parts are matched to a canonical component family first, then to a variant. Exact
          aliases and part numbers win; fuzzy catalog search is a fallback. Ambiguous input is
          shown as a choice, never silently guessed.
        </p>
        <p>
          Compatibility checks are deterministic rules over voltage, logic level, interface
          and package. The demo's relay warning is an example. An AI layer, when connected,
          may explain a rule result but cannot override it or invent a price.
        </p>
      </section>

      <section className="read-section">
        <h2>Fastest vs Cheapest</h2>
        <p>
          Fastest favours one shop and short walking. Cheapest allows up to two shops and
          chooses the lowest estimated total that still covers the list. Each item independently
          uses the cheapest available offer inside the chosen shop set. Coverage is considered
          before price.
        </p>
        <p>
          There is no hidden value-of-time constant. We show the estimated total, stop count
          and walking minutes, and you choose. Stop order and walking minutes are schematic
          estimates, not GPS or turn-by-turn directions. Confirm the stall before travel.
        </p>
      </section>

      <section className="read-section">
        <h2>What this demo does not do</h2>
        <ul>
          <li>No live stock, live pricing, reservations or payments.</li>
          <li>No login, uploads, OCR, delivery or chatbot.</li>
          <li>No claim that a shop will have a part when you arrive.</li>
          <li>No real shop phone numbers or merchant claims.</li>
        </ul>
      </section>

      <p className="read-meta" style={{ marginTop: 24 }}>
        QUESTIONS · corrections will be published before the pilot. See{" "}
        <Link href="/legal" className="text-link">
          Legal
        </Link>
        .
      </p>
    </div>
  );
}
