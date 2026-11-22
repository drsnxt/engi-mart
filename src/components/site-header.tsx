import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="ENGI-MART home">
      <span className="pin-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span>
        <span className="wordmark-text">ENGI-MART</span>
        <span className="wordmark-sub">SP ROAD / RVCE PILOT</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Wordmark />
        <span className="header-rule" aria-hidden="true" />
        <span className="header-tag">
          <strong>SP ROAD</strong>
          BENGALURU · PILOT
        </span>
        <nav className="header-nav" aria-label="Primary">
          <Link href="/">Start</Link>
          <Link href="/method">Method</Link>
          <Link href="/legal">Legal</Link>
        </nav>
        <ThemeToggle />
        <span className="demo-tag" title="This build uses seeded demo data">
          <span className="demo-dot" aria-hidden="true" />
          DEMO
        </span>
      </div>
    </header>
  );
}
