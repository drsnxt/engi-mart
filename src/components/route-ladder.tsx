export function RouteLadder() {
  return (
    <div className="route-ladder">
      <div className="route-card-head">
        <span>SP ROAD ROUTE</span>
        <span>2 STOPS · DEMO</span>
      </div>

      <ol className="route-list">
        <li className="route-origin">
          <span className="route-origin-dot" aria-hidden="true" />
          <span className="route-origin-name">Entrance</span>
        </li>
        <li className="route-walk">
          <span>4 min walk</span>
        </li>
        <li className="route-stop">
          <span className="route-stop-num" aria-hidden="true">1</span>
          <div className="route-stop-copy">
            <strong>Om Electronics</strong>
            <span>Silver Tool Complex · 1F · #14</span>
            <span className="route-shop-meta">5 items · ₹220–250</span>
          </div>
        </li>
        <li className="route-walk">
          <span>8 min walk</span>
        </li>
        <li className="route-stop">
          <span className="route-stop-num" aria-hidden="true">2</span>
          <div className="route-stop-copy">
            <strong>Sai Sensors</strong>
            <span>Golcha Market · GF · #7</span>
            <span>connector + sensor</span>
          </div>
        </li>
      </ol>

      <p className="route-note">
        Schematic stop order, not GPS. Confirm the stall before travel.
      </p>
    </div>
  );
}
