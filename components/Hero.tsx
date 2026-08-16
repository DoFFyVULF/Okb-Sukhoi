"use client";

import { useRef } from "react";
import { useSketchfabHero } from "@/lib/sketchfab";

/**
 * Hero: один 3D-самолёт (Су-57, Sketchfab Viewer) + богатые HUD-паттерны
 * анимаций — вращение модели по скроллу, free-look по кнопке/ESC, радар-кольцо,
 * line-mask reveal заголовка, телеметрия, vignette, уголки-скобки.
 */
export function Hero() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { free, setFree } = useSketchfabHero(stageRef);

  return (
    <section id="hero">
      <div className="bp" style={{ position: "absolute", inset: 0, opacity: 0.5 }}></div>
      <div className="hero-radar" aria-hidden="true"></div>
      <div id="stage" ref={stageRef} aria-label="Интерактивная 3D-модель истребителя Су-57"></div>
      <div className="vig"></div>
      <div className="hc" style={{ position: "absolute", inset: 16, zIndex: 12, pointerEvents: "none" }}>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>

      <div className="tel r">
        HUD:// TELEMETRY
        <br />
        ALT 20 000 M
        <br />
        SPD 2 600 KM/H
        <br />
        MACH 2.35
        <br />
        MODE: ФОРСАЖ <span style={{ color: "var(--flame)" }}>▲</span>
      </div>
      <div className="tel l">
        ЛТХ:// ПАК ФА
        <br />
        ЭПР ≈ 0.1–1 М²
        <br />
        ДВ: АЛ-41Ф1 ×2
      </div>

      <div className="h3tag">3D:// SKETCHFAB PBR · СКРОЛЛ ВРАЩАЕТ МОДЕЛЬ · DRAG — ДОВОРОТ</div>

      <div className="wrap hwrap">
        <div className="hinner">
          <p
            className="lm d1 mono"
            style={{ fontSize: 11, letterSpacing: ".4em", color: "rgba(125,211,252,.85)", marginBottom: 20 }}
          >
            <span>// ОПЫТНО-КОНСТРУКТОРСКОЕ БЮРО · ОСН. 1939</span>
          </p>
          <h1 className="hero-title">
            <span className="lm d2">
              <span>ОКБ</span>
            </span>
            <span className="lm d3">
              <span className="grad">СУХОГО</span>
            </span>
          </h1>
          <p
            className="lm d3"
            style={{ marginTop: 24, color: "rgba(255,255,255,.72)", fontSize: 15, textShadow: "0 2px 24px rgba(5,7,13,.9)" }}
          >
            <span>
              Авиационные системы поколения «4++» и «5»: от Су-2 до Су-57 и Су-75. Чертёжная точность.
              Форсажная динамика.
            </span>
          </p>
          <div className="lm d3" style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a className="btn btn-steel clip-btn" href="#fleet">
              САМОЛЁТЫ
            </a>
            <a className="btn btn-flame clip-btn" href="#weapons">
              ВООРУЖЕНИЕ
            </a>
            <button
              id="inBtn"
              className="btn btn-ice clip-btn"
              type="button"
              onClick={() => setFree(!free)}
            >
              {free ? "✕ ЗАВЕРШИТЬ ОСМОТР" : "▶ СВОБОДНЫЙ ОСМОТР"}
            </button>
          </div>
          <div
            className="lm d3 mono"
            style={{ marginTop: 14, fontSize: 10, letterSpacing: ".12em", color: "rgba(255,255,255,.4)" }}
          >
            <span>
              {free
                ? "drag — вращение · колесо — зум · ESC — выход"
                : "прокрутка вращает модель · drag — доворот"}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          color: "rgba(255,255,255,.45)",
        }}
      >
        <span className="mono" style={{ fontSize: 10, letterSpacing: ".3em" }}>
          SCROLL
        </span>
        <svg className="chev" width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M1 1l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
