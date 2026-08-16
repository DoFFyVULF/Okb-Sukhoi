"use client";

import { useEffect } from "react";

/**
 * Прелоадер: прогресс-бар загрузки 3D-модели + управление классами body
 * (booting/js/matting/ready) для корректного старта reveal- и line-mask анимаций.
 */
export function Preloader() {
  useEffect(() => {
    document.body.classList.add("booting", "js", "matting");
    const bar = document.getElementById("ld-bar");
    const pct = document.getElementById("ld-pct");
    let ld = 0;
    const t = setInterval(() => {
      ld = Math.min(100, ld + 6 + Math.random() * 13);
      if (bar) bar.style.width = ld + "%";
      if (pct) pct.textContent = Math.round(ld) + "%";
      if (ld >= 100) {
        clearInterval(t);
        setTimeout(() => {
          const l = document.getElementById("loader");
          if (l) l.classList.add("done");
          document.body.classList.add("ready");
          document.body.classList.remove("booting");
        }, 250);
      }
    }, 70);
    return () => clearInterval(t);
  }, []);

  return (
    <div id="loader">
      <div className="hc" style={{ position: "absolute", inset: 24 }}>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div
        className="mono"
        style={{ fontSize: 11, letterSpacing: ".35em", color: "rgba(125,211,252,.8)" }}
      >
        ЗАГРУЗКА 3D-МОДЕЛИ // СУ-57 · PBR
      </div>
      <div style={{ width: 256, height: 3, background: "rgba(79,140,255,.15)", overflow: "hidden" }}>
        <div id="ld-bar"></div>
      </div>
      <div id="ld-pct" className="mono" style={{ color: "var(--flame)", fontSize: 14 }}>
        0%
      </div>
    </div>
  );
}
