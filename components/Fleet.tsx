"use client";

import { useRef } from "react";
import { FLEET, PLANES } from "@/data/content";
import { useCounterObserver } from "@/lib/hooks";

export function Fleet() {
  const ref = useRef<HTMLDivElement>(null);
  useCounterObserver(ref);

  return (
    <section id="fleet" className="sec bp">
      <div className="wrap">
        <p className="overline" data-rv>
          02 // МОДЕЛЬНЫЙ РЯД
        </p>
        <h2 className="h2" data-rv>
          СЕМЕЙСТВО <em>«СУ»</em>
        </h2>
        <div id="fleet-grid" className="fgrid" ref={ref}>
          {FLEET.map((p) => (
            <article
              key={p.id}
              className="fcard hc clip"
              data-rv
              onPointerMove={(e) => {
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                if (!window.matchMedia("(pointer:fine)").matches) return;
                const el = e.currentTarget;
                const r = el.getBoundingClientRect();
                const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
                const ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
                el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <div className="top">
                <h3>{p.name}</h3>
                <span className="gen">{p.gen}</span>
              </div>
              <div className="imgbox">
                <div className="glow"></div>
                <img
                  data-matte
                  crossOrigin="anonymous"
                  src={PLANES[p.id]}
                  alt={`${p.name} — вырезанный PNG, прозрачный фон`}
                  loading="lazy"
                  style={p.flip ? { transform: "scaleX(-1)" } : undefined}
                />
              </div>
              <div className="role">{p.role.toUpperCase()}</div>
              <p className="desc">{p.desc}</p>
              <div className="stats">
                {p.stats.map((s, i) => (
                  <div key={i}>
                    <div className="v">
                      <span data-cnt={s.value}>0</span>
                    </div>
                    <div className="l">
                      {s.label} {s.unit}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
