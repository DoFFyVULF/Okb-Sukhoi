"use client";

import { RefObject, useEffect, useRef, useState } from "react";

const SKETCHFAB_UID = "222d91aa75e74be8ac2f24a834371144";
const SKETCHFAB_SRC = "https://static.sketchfab.com/api/latest/sketchfab.js";

function loadSketchfabScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    const w = window as any;
    if (w.Sketchfab) return resolve(w.Sketchfab);
    const existing = document.querySelector(`script[src="${SKETCHFAB_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(w.Sketchfab));
      existing.addEventListener("error", reject);
      return;
    }
    const s = document.createElement("script");
    s.src = SKETCHFAB_SRC;
    s.async = true;
    s.onload = () => resolve(w.Sketchfab);
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

/**
 * 3D-герой на Sketchfab: один вьювер, scroll-орbit (прокрутка страницы вращает
 * модель), dedup дублирующих нод, pan-камеры вправо на широких экранах,
 * free-look по кнопке/ESC, iframe-fallback при ошибке.
 * Возвращает { free, setFree } — компонент Hero управляет кнопкой через них.
 */
export function useSketchfabHero(stageRef: RefObject<HTMLDivElement | null>) {
  const [free, setFreeState] = useState(false);
  const freeRef = useRef(false);
  const modeRef = useRef<"none" | "api" | "iframe">("none");
  const apiRef = useRef<any>(null);
  const applyRef = useRef<(v: boolean) => void>(() => {});

  useEffect(() => {
    const stage = stageRef.current;
    const hero = document.getElementById("hero");
    if (!stage || !hero) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let th0 = 0;
    let phi = 0.2;
    let dist = 10;
    let tgt: number[] = [0, 0, 0];
    let autoA = 0;
    let dragA = 0;
    let camReady = false;
    let running = false;
    let heroVis = true;
    let api: any = null;

    const heroP = () => {
      const r = hero.getBoundingClientRect();
      return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    };
    const setCam = (p: number[], t: number[], d: number) => {
      try {
        if (api.setCamera) api.setCamera(p, t, d, 0);
        else api.lookat(p, t, d);
      } catch {
        /* noop */
      }
    };
    const dedup = () => {
      try {
        if (!api.getNodeMap) return;
        api.getNodeMap((map: Record<string, any>) => {
          // map is passed as first arg in some versions; normalize
        });
        api.getNodeMap((map: Record<string, any>) => {
          const names = Object.keys(map || {});
          const hidden: string[] = [];
          names.forEach((nm) => {
            if (/copy|dup|_2$|_002|002|\.001|second/i.test(nm)) {
              try {
                api.hide(map[nm]);
                hidden.push(nm);
              } catch {
                try {
                  api.hide([map[nm]]);
                  hidden.push(nm);
                } catch {
                  /* noop */
                }
              }
            }
          });
          if (hidden.length) console.info("[ОКБ] скрыты дубли:", hidden.join(", "));
        });
      } catch {
        /* noop */
      }
    };
    const fallback = () => {
      modeRef.current = "iframe";
      stage.innerHTML =
        '<div id="shield"></div><iframe title="Су-57 3D" src="https://sketchfab.com/models/' +
        SKETCHFAB_UID +
        '/embed?autostart=1&preload=1&transparent=1&autospin=0.4&camera=0&ui_theme=dark&ui_infos=0&ui_controls=0&ui_watermark=0&ui_watermark_link=0&ui_help=0&ui_settings=0&ui_fullscreen=0&ui_annotations=0&dnt=1" allow="autoplay; fullscreen" allowfullscreen style="width:100%;height:100%;border:0"></iframe>';
    };
    const loop = () => {
      if (!heroVis) {
        running = false;
        return;
      }
      if (modeRef.current === "api" && !freeRef.current && camReady) {
        if (!reduce) autoA += 0.0018;
        const a = th0 + autoA + heroP() * 2.6 + dragA;
        const cp = Math.cos(phi);
        const pos = [
          tgt[0] + dist * cp * Math.cos(a),
          tgt[1] + dist * Math.sin(phi),
          tgt[2] + dist * cp * Math.sin(a),
        ];
        if (window.innerWidth > 860) {
          let fx = tgt[0] - pos[0];
          let fy = tgt[1] - pos[1];
          let fz = tgt[2] - pos[2];
          const fl = Math.sqrt(fx * fx + fy * fy + fz * fz) || 1;
          fx /= fl;
          fy /= fl;
          fz /= fl;
          let rx = -fz;
          let rz = fx;
          const rl = Math.sqrt(rx * rx + rz * rz) || 1;
          rx /= rl;
          rz /= rl;
          const k = -dist * 0.2;
          const p2 = [pos[0] + rx * k, pos[1], pos[2] + rz * k];
          const t2 = [tgt[0] + rx * k, tgt[1], tgt[2] + rz * k];
          setCam(p2, t2, dist);
        } else {
          setCam(pos, tgt, dist);
        }
      }
      requestAnimationFrame(loop);
    };
    const runLoop = () => {
      if (running) return;
      running = true;
      requestAnimationFrame(loop);
    };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (en) => {
          heroVis = en[0].isIntersecting;
          if (heroVis) runLoop();
        },
        { threshold: 0.15 },
      ).observe(hero);
    }

    const apply = (v: boolean) => {
      freeRef.current = v;
      setFreeState(v);
      if (apiRef.current && modeRef.current === "api") {
        try {
          apiRef.current.setUserInteraction(v);
        } catch {
          /* noop */
        }
      }
      const s = document.getElementById("shield");
      if (s && modeRef.current === "iframe") s.style.display = v ? "none" : "block";
    };
    applyRef.current = apply;

    loadSketchfabScript()
      .then((Sketchfab) => {
        try {
          api = Sketchfab(stage);
          apiRef.current = api;
          api.init(
            SKETCHFAB_UID,
            {
              autostart: 1,
              preload: 1,
              transparent: 1,
              autospin: 0,
              camera: 0,
              ui_theme: "dark",
              ui_infos: 0,
              ui_controls: 0,
              ui_watermark: 0,
              ui_watermark_link: 0,
              ui_help: 0,
              ui_settings: 0,
              ui_fullscreen: 0,
              ui_annotations: 0,
              ui_ar: 0,
              ui_vr: 0,
              ui_sound: 0,
              dnt: 1,
              success: () => api.start(),
              error: () => fallback(),
            },
          );
          api.addEventListener("viewerready", () => {
            try {
              api.setUserInteraction(false);
            } catch {
              /* noop */
            }
            dedup();
            try {
              api.getUserCamera((c: any) => {
                tgt = c.target;
                dist = c.distance * 1.18;
                const dx = c.position[0] - tgt[0];
                const dy = c.position[1] - tgt[1];
                const dz = c.position[2] - tgt[2];
                th0 = Math.atan2(dz, dx);
                phi = Math.max(0.12, Math.asin(Math.max(-1, Math.min(1, dy / Math.max(0.001, dist)))));
                camReady = true;
                modeRef.current = "api";
                runLoop();
              });
            } catch {
              modeRef.current = "api";
              runLoop();
            }
          });
        } catch {
          fallback();
        }
      })
      .catch(() => fallback());

    const onPointerDown = (e: PointerEvent) => {
      if (modeRef.current !== "api" || freeRef.current) return;
      let x0 = e.clientX;
      const mv = (ev: PointerEvent) => {
        dragA += (ev.clientX - x0) * 0.005;
        x0 = ev.clientX;
      };
      const up = () => {
        window.removeEventListener("pointermove", mv);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", mv);
      window.addEventListener("pointerup", up);
    };
    stage.addEventListener("pointerdown", onPointerDown);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && freeRef.current) apply(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      stage.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [stageRef]);

  const setFree = (v: boolean) => applyRef.current(v);
  return { free, setFree };
}
