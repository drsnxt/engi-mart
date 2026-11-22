import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal",
  description: "Legal notes, safety warnings, privacy and corrections for the ENGI-MART demo.",
};

export default function LegalPage() {
  return (
    <div className="container read-page">
      <Link href="/" className="crumb-back">
        <ArrowLeft size={12} aria-hidden="true" /> Start
      </Link>
      <p className="eyebrow" style={{ marginTop: 18 }}>
        Legal / plain language
      </p>
      <h1 className="page-title">Estimates, safety, corrections.</h1>
      <p className="lede">
        ENGI-MART is an independent student project. This demo is a planning aid, not a shop,
        marketplace, broker or authority on component authenticity.
      </p>
      <p className="read-meta">LAST UPDATED · 22 OCT 2026 · DEMO BUILD</p>

      <div className="read-note">
        Every shop, price, phone number, stall and observation in this build is demo data.
        Nothing here is a real offer or a claim about a real merchant.
      </div>

      <section className="read-section">
        <h2>No affiliation</h2>
        <p>
          ENGI-MART is not affiliated with RV College of Engineering administration, SP Road
          merchants, component manufacturers or online marketplaces. The RVCE reference
          describes the intended pilot audience only.
        </p>
      </section>

      <section className="read-section">
        <h2>Prices are estimates</h2>
        <p>
          Price bands and totals are student-reported or illustrative estimates. They are not
          quotations, reservations or guarantees of stock. Shops may charge more, less, or not
          stock an item. Confirm the part, specification and price before paying.
        </p>
      </section>

      <section className="read-section">
        <h2>Electrical safety</h2>
        <p>
          Electronics work can be dangerous. Mains AC (230 V), lithium-ion packs, high-current
          supplies, soldering irons and moving pumps can cause injury, fire or damage. Use
          isolation, fusing and appropriate enclosures. If you are unsure, ask a lab instructor
          or qualified engineer. This site does not provide electrical certification.
        </p>
        <p>
          Compatibility warnings are rule-based planning hints, not a safety review of your
          circuit. You remain responsible for wiring, isolation and testing.
        </p>
      </section>

      <section className="read-section">
        <h2>Clones and authenticity</h2>
        <p>
          SP Road stocks original, licensed and clone parts. ENGI-MART does not certify
          authenticity. Check markings, ratings, pinouts and manufacturer documentation.
          “Pin-compatible” does not mean “identical” in every respect.
        </p>
      </section>

      <section className="read-section">
        <h2>Privacy</h2>
        <p>
          This demo has no accounts, no analytics and no server-side BOM storage. Text you type
          into the start form stays in your browser and is not submitted. A production pilot
          would store only what is needed to render and share a plan, with an accessible privacy
          note and a deletion route.
        </p>
        <p>
          Share links to plans are intended to be public read-only. Do not put personal,
          sensitive or exam-related information in a shared BOM.
        </p>
      </section>

      <section className="read-section">
        <h2>Corrections and removal</h2>
        <p>
          If a production listing names a merchant incorrectly, or if you are a merchant who
          wants a listing corrected or removed, a correction contact will be published before
          the pilot. This demo contains no real merchant claims to correct.
        </p>
      </section>

      <section className="read-section">
        <h2>Licences</h2>
        <ul>
          <li>IBM Plex Sans and IBM Plex Mono — SIL Open Font License.</li>
          <li>Lucide icons — ISC License.</li>
          <li>Component datasheets and trademarks belong to their respective owners.</li>
        </ul>
      </section>

      <p className="read-meta" style={{ marginTop: 24 }}>
        READ THE <Link href="/method" className="text-link">METHOD</Link> FOR HOW ESTIMATES ARE BUILT.
      </p>
    </div>
  );
}
