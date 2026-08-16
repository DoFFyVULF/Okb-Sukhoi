"use client";

import { useEffect, useRef, useState } from "react";
import { WEAPONS, type WeaponIcon } from "@/data/content";
import { useCounterObserver, fmt } from "@/lib/hooks";

const ICONS: Record<WeaponIcon, string> = {
  aa: '<svg viewBox="0 0 72 28" width="56" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M66 14 54 8 20 8 14 14 20 20 54 20Z"/><path d="M20 8 12 2v6M20 20 12 26v-6M14 14H5"/><circle cx="59" cy="14" r="2.2"/></svg>',
  ag: '<svg viewBox="0 0 72 28" width="56" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M66 14 54 9 18 9 12 14 18 19 54 19Z"/><path d="M36 9 28 1M36 19 28 27M18 9l-6-5v5M18 19l-6 5v-5M12 14H4"/></svg>',
  cr: '<svg viewBox="0 0 72 28" width="56" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M66 14q-2-5-12-5H20l-8 5 8 5h34q10 0 12-5Z"/><path d="M34 9 26 2l-8 7M34 19l-8 7-8-7M12 14H4"/></svg>',
  bomb: '<svg viewBox="0 0 40 48" width="36" height="42" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 44c-7-5-9-12-9-19h18c0 7-2 14-9 19Z"/><path d="M14 25v-9M26 25v-9M10 16h20M20 16v-6"/></svg>',
  gun: '<svg viewBox="0 0 72 28" width="56" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 11h40M4 17h40"/><rect x="44" y="7" width="16" height="14"/><path d="M60 11h8M60 17h8M64 14h4"/></svg>',
};

const TABS = [
  { key: "aa", label: "ВОЗДУХ–ВОЗДУХ" },
  { key: "ag", label: "ВОЗДУХ–ПОВЕРХНОСТЬ" },
  { key: "bomb", label: "КОРРЕКТИРУЕМЫЕ БОМБЫ" },
  { key: "gun", label: "ПУШЕЧНОЕ" },
];

export function Weapons() {
  const [active, setActive] = useState("aa");
  const ref = useRef<HTMLDivElement>(null);
  useCounterObserver(ref, [active]);
  const cfg = WEAPONS[active];

  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        grid.querySelectorAll<HTMLElement>(".wbar i").forEach((b) => {
          b.style.width = b.getAttribute("data-w") + "%";
        });
      }),
    );
  }, [active]);

  return (
    <section id="weapons" className="sec">
      <div className="wrap">
        <p className="overline" data-rv>
          04 // ВООРУЖЕНИЕ
        </p>
        <h2 className="h2" data-rv>
          КОМПЛЕКС <em>ПРИМЕНЕНИЯ</em>
        </h2>
        <div className="tabs" role="tablist" aria-label="Категории вооружения" data-rv>
          {TABS.map((t) => (
            <button
              key={t.key}
              className="wp-tab clip-btn"
              role="tab"
              aria-selected={active === t.key}
              data-tab={t.key}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div id="wp-grid" className="wgrid" ref={ref}>
          {cfg.items.map((w, i) => (
            <article key={w.name} className="wcard hc clip card-in" style={{ animationDelay: i * 70 + "ms" }}>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <div className="head">
                <div className="ic" dangerouslySetInnerHTML={{ __html: ICONS[w.icon] }}></div>
                <div>
                  <h3>{w.name}</h3>
                  <div className="sub">{w.type.toUpperCase()}</div>
                </div>
              </div>
              <p className="desc">{w.desc}</p>
              <div className="stats">
                {w.stats.map((s, j) => {
                  const num = parseFloat(String(s.value));
                  const isN = !isNaN(num);
                  return (
                    <div key={j}>
                      <div className="v">{isN ? <span data-wcnt={num}>0</span> : s.value}</div>
                      <div className="l">
                        {s.label}
                        {s.unit ? " " + s.unit : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="wbar-row">
                <span
                  className="mono"
                  style={{ fontSize: 9, color: "rgba(255,255,255,.4)", whiteSpace: "nowrap" }}
                >
                  ШКАЛА ДАЛЬНОСТИ
                </span>
                <div className={"wbar" + (active === "gun" ? " flame" : "")}>
                  <i data-w={Math.min(100, Math.round((w.range / cfg.scale) * 100))}></i>
                </div>
                <span className="mono" style={{ fontSize: 10, color: "var(--ice)", whiteSpace: "nowrap" }}>
                  ≈ {fmt(w.range)} {cfg.unit}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
