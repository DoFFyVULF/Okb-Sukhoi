"use client";

import { useEffect } from "react";

export function Footer() {
  useEffect(() => {
    const yr = document.getElementById("yr");
    if (yr) yr.textContent = String(new Date().getFullYear());
  }, []);

  return (
    <footer>
      <div className="wrap">
        <div className="ghost">ОКБ СУХОГО</div>
        <div className="fgrid3">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <svg width="22" height="22" viewBox="0 0 32 32" style={{ color: "var(--steel)" }} aria-hidden="true">
                <path d="M16 2 28 26 16 20 4 26Z" fill="currentColor" />
              </svg>
              <span className="disp" style={{ fontSize: 14, letterSpacing: ".22em" }}>
                ОКБ СУХОГО
              </span>
            </div>
            <p>
              Неофициальный фан-сайт. Не аффилирован с АО «Компания „Сухой"» и ОАК. 3D-модель Су-57 — Sketchfab
              (встроенный вьювер). Характеристики — по открытым источникам.
            </p>
          </div>
          <div className="col">
            <div className="head">// НАВИГАЦИЯ</div>
            <a href="#history">ИСТОРИЯ</a>
            <a href="#fleet">САМОЛЁТЫ</a>
            <a href="#weapons">ВООРУЖЕНИЕ</a>
            <a href="#gallery">ГАЛЕРЕЯ</a>
          </div>
          <div className="col">
            <div className="head">// ТЕХНИКА</div>
            <div>3D: Sketchfab Viewer API · scroll-orbit</div>
            <div style={{ marginBottom: 8 }}>PNG: runtime alpha-matting</div>
            <div style={{ color: "rgba(255,122,26,.8)" }}>
              © <span id="yr">2026</span> · ФАН-ПРОЕКТ
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
