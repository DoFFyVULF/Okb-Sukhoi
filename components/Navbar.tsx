"use client";

/**
 * Верхняя панель (#topbar): лого-дельта, якоря, статус-индикатор.
 * SYS:OK намеренно не переносим (по требованию).
 */
export function Navbar() {
  return (
    <header id="topbar">
      <div className="wrap in">
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="26" height="26" viewBox="0 0 32 32" style={{ color: "var(--steel)" }} aria-hidden="true">
            <path d="M16 2 28 26 16 20 4 26Z" fill="currentColor" />
          </svg>
          <span className="disp" style={{ fontSize: 14, letterSpacing: ".22em" }}>
            ОКБ СУХОГО
          </span>
        </a>
        <nav>
          <a href="#history">ИСТОРИЯ</a>
          <a href="#fleet">САМОЛЁТЫ</a>
          <a href="#flyby">ПРОЛЁТ</a>
          <a href="#weapons">ВООРУЖЕНИЕ</a>
          <a href="#gallery">ГАЛЕРЕЯ</a>
        </nav>
        <div
          className="mono"
          style={{ fontSize: 10, color: "rgba(255,255,255,.4)", display: "flex", alignItems: "center", gap: 8 }}
        >
          <span
            className="blink"
            style={{ width: 6, height: 6, background: "var(--flame)", display: "inline-block", borderRadius: "50%" }}
          ></span>
          ONLINE
        </div>
      </div>
    </header>
  );
}
