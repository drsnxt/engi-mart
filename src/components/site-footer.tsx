import Link from "next/link";
import { Wordmark } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">
            <Wordmark />
          </div>
          <p className="footer-note" style={{ marginTop: 9 }}>
            Independent RVCE student pilot for SP Road, Bengaluru. Demo build — all prices,
            shops and observations are illustrative, not live shop quotes. Confirm stock and
            price before you travel.
          </p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/">Start</Link>
          <Link href="/b/demo">Example bench sheet</Link>
          <Link href="/b/demo/plans">Plans</Link>
          <Link href="/b/demo/run">Run sheet</Link>
          <Link href="/method">Method</Link>
          <Link href="/legal">Legal</Link>
        </nav>
      </div>
    </footer>
  );
}
