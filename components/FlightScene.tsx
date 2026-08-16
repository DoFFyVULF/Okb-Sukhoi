"use client";

import { useEffect, useRef } from "react";
import { FLYBY_CRAFT } from "@/data/content";
import { fmt } from "@/lib/hooks";

/**
 * Секция «Пролёт»: scroll-сцена, три самолёта (Б — Су-35С, А — Су-57, С — Су-34)
 * пролетают слева-направо, HUD-телеметрия меняется, в финале — «РОЖДЁННЫЕ В НЕБЕ».
 */
export function FlightScene() {
  const secRef = useRef<HTMLDivElement>(null);
  const cARef = useRef<HTMLDivElement>(null);
  const cBRef = useRef<HTMLDivElement>(null);
  const cCRef = useRef<HTMLDivElement>(null);
  const spdRef = useRef<HTMLSpanElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const bankRef = useRef<HTMLSpanElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cA = cARef.current;
    const cB = cBRef.current;
    const cC = cCRef.current;
    const spd = spdRef.current;
    const alt = altRef.current;
    const bank = bankRef.current;
    const prog = progRef.current;
    const outro = outroRef.current;

    const pad = (n: number, l: number) => {
      let s = String(n);
      while (s.length < l) s = "0" + s;
      return s;
    };

    const outroCounters = () => {
      if (!outro) return;
      outro.querySelectorAll<HTMLElement>("[data-ocnt]").forEach((c) => {
        const t = parseFloat(c.getAttribute("data-ocnt") || "0");
        if (isNaN(t)) return;
        if (reduce) {
          c.textContent = fmt(t);
          return;
        }
        const t0 = performance.now();
        const step = (tp: number) => {
          const k = Math.min(1, (tp - t0) / 1300);
          const e = 1 - Math.pow(1 - k, 3);
          c.textContent = fmt(t * e);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    };

    const apply = (p: number) => {
      if (cA) cA.style.transform = `translateX(${-45 + p * 225}vw) rotate(${(p * 4).toFixed(2)}deg)`;
      if (cB) cB.style.transform = `translateX(${-30 + p * 195}vw) rotate(${(-p * 3).toFixed(2)}deg)`;
      if (cC) cC.style.transform = `translateX(${-70 + p * 285}vw) rotate(${(p * 6).toFixed(2)}deg)`;
      if (spd) spd.textContent = pad(Math.round(900 + p * 1700), 4);
      if (alt) alt.textContent = pad(Math.round(200 + p * 19800), 5);
      if (bank) bank.textContent = (3 + p * 3).toFixed(1) + "°";
      if (prog) prog.style.width = p * 100 + "%";
      if (outro) {
        if (p > 0.8 && !outro.classList.contains("show")) {
          outro.classList.add("show");
          outroCounters();
        } else if (p <= 0.72 && outro.classList.contains("show")) {
          outro.classList.remove("show");
        }
      }
    };

    let ticking = false;
    const upd = () => {
      ticking = false;
      const r = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      apply(p);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(upd);
      }
    };

    if (reduce) {
      apply(0.5);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", upd);
      upd();
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", upd);
    };
  }, []);

  return (
    <section id="flyby" ref={secRef}>
      <div className="fb-pin">
        <div id="fb-stars" className="bp" style={{ position: "absolute", inset: 0, opacity: 0.6 }}></div>
        <div className="hc" style={{ position: "absolute", inset: 16, pointerEvents: "none" }}>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
        <div
          className="mono"
          style={{ position: "absolute", top: 32, left: 32, zIndex: 20, fontSize: 11, letterSpacing: ".35em", color: "rgba(125,211,252,.7)" }}
        >
          03 // ПРОЛЁТ — СКРОЛЛ
        </div>
        <div id="fb-hud">
          V: <span id="fb-spd" className="o" ref={spdRef}>
            0900
          </span>{" "}
          KM/H
          <br />
          H: <span id="fb-alt" className="b" ref={altRef}>
            00200
          </span>{" "}
          M · КРЕН <span id="fb-bank" className="b" ref={bankRef}>
            3.0°
          </span>
        </div>

        <div
          id="craftB"
          className="craft"
          ref={cBRef}
          style={{ top: "12%", width: "min(18vw,260px)", opacity: 0.65, transform: "translateX(-30vw)" }}
        >
          <div className="trail" style={{ width: "20vw" }}></div>
          <img data-matte crossOrigin="anonymous" src={FLYBY_CRAFT.b} alt="Су-35С в пролёте" />
        </div>
        <div
          id="craftA"
          className="craft"
          ref={cARef}
          style={{ top: "30%", width: "min(34vw,540px)", transform: "translateX(-45vw)" }}
        >
          <div
            className="trail"
            style={{ width: "30vw", background: "linear-gradient(to left,rgba(255,122,26,.7),rgba(255,122,26,.25),transparent)" }}
          ></div>
          <img data-matte crossOrigin="anonymous" src={FLYBY_CRAFT.a} alt="Су-57 в пролёте" style={{ transform: "scaleX(-1)" }} />
        </div>
        <div
          id="craftC"
          className="craft"
          ref={cCRef}
          style={{ top: "52%", width: "min(46vw,700px)", opacity: 0.9, transform: "translateX(-70vw)" }}
        >
          <div className="trail" style={{ width: "40vw" }}></div>
          <img data-matte crossOrigin="anonymous" src={FLYBY_CRAFT.c} alt="Су-34 в пролёте" style={{ transform: "scaleX(-1)" }} />
        </div>

        <div id="fb-outro" ref={outroRef}>
          <div className="outro-in bp hc">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <p className="mono" style={{ fontSize: 11, letterSpacing: ".4em", color: "var(--flame)" }}>
              03.1 // ФИНАЛ ПРОЛЁТА
            </p>
            <h2 className="o-title">РОЖДЁННЫЕ В НЕБЕ</h2>
            <p className="o-lead">
              Самолёты ОКБ Сухого не просто летают — они раздвигают границы возможного. Управление вектором
              тяги, сверхманёвренность и крейсерский сверхзвук без форсажа — фирменный почерк школы Сухого.
            </p>
            <div className="o-tiles">
              <div className="o-tile">
                <div className="o-num">
                  <span data-ocnt="2600">0</span>
                  <i>КМ/Ч</i>
                </div>
                <div className="o-lab">МАКС. СКОРОСТЬ</div>
              </div>
              <div className="o-tile">
                <div className="o-num">
                  <span data-ocnt="2100">0</span>
                  <i>КМ/Ч</i>
                </div>
                <div className="o-lab">СВЕРХЗВУК БЕЗ ФОРСАЖА · СУ-57</div>
              </div>
              <div className="o-tile">
                <div className="o-num">
                  <span data-ocnt="20000">0</span>
                  <i>М</i>
                </div>
                <div className="o-lab">ПРАКТИЧЕСКИЙ ПОТОЛОК</div>
              </div>
              <div className="o-tile">
                <div className="o-num">
                  <span data-ocnt="9">0</span>
                  <i>G</i>
                </div>
                <div className="o-lab">МАКС. ПЕРЕГРУЗКА</div>
              </div>
            </div>
            <div className="o-super">
              <h3>СВЕРХМАНЁВРЕННОСТЬ</h3>
              <p>
                «Кобра Пугачёва», «кульбит», «блин» — фигуры высшего пилотажа за пределами сваливания, впервые
                выполненные на самолётах марки «Су». Управляемость там, где другие теряют управление, — главный
                принцип бюро.
              </p>
            </div>
            <div className="o-line mono">SU-27 → SU-35 → SU-57: КАЖДОЕ ПОКОЛЕНИЕ — ЭТАЛОН МАНЁВРЕННОСТИ</div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 0,
            right: 0,
            zIndex: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 288, height: 3, background: "rgba(255,255,255,.1)" }}>
            <div id="fb-prog" ref={progRef}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
