"use client";

import { RefObject, useEffect, useRef, useState } from "react";

const RM = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");

/* ----------------------------- next-app hooks (сохранены) ----------------------------- */

export function useScramble(
  target: string,
  active: boolean,
  opts?: { durationFrames?: number; chars?: string },
): string {
  const [text, setText] = useState(target);
  useEffect(() => {
    if (!active) return;
    const chars =
      opts?.chars ??
      "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789#%*+=/";
    const total = target.length;
    const frames = opts?.durationFrames ?? 30;
    let raf = 0;
    let frame = 0;
    const tick = () => {
      frame += 1;
      const progress = Math.min(frame / frames, 1);
      const revealed = Math.floor(progress * total);
      let out = "";
      for (let i = 0; i < total; i++) {
        const ch = target[i];
        if (i < revealed || ch === " ") out += ch;
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      setText(out);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setText(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, opts?.chars, opts?.durationFrames]);
  return text;
}

export function useCountUp(target: number, active: boolean, durationMs = 1700): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);
  return val;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function useIsDesktop(breakpoint = 768): boolean {
  return useMediaQuery(`(min-width: ${breakpoint}px)`);
}

/* ----------------------------- reveal + counters (порт из vanilla) ----------------------------- */

/** Наблюдает все [data-rv] на странице и добавляет .rv-in при появлении. */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-rv]"));
    if (!("IntersectionObserver" in window) || RM()) {
      els.forEach((e) => e.classList.add("rv-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("rv-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function runCounter(el: HTMLElement) {
  const target = parseFloat(
    el.getAttribute("data-cnt") || el.getAttribute("data-wcnt") || "0",
  );
  const pre = el.getAttribute("data-pre") || "";
  if (isNaN(target)) return;
  if (RM()) {
    el.textContent = pre + fmt(target);
    return;
  }
  const isW = el.hasAttribute("data-wcnt");
  const t0 = performance.now();
  const dur = isW ? 1100 : 1400;
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = pre + fmt(target * e);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Счётчики внутри контейнера `ref`: наблюдает [data-cnt] и [data-wcnt],
 * запускает count-up при появлении во вьюпорте. Перезапускается при смене `deps`
 * (например, при смене вкладки вооружения).
 */
export function useCounterObserver<T extends HTMLElement>(
  ref: RefObject<T | null>,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-cnt],[data-wcnt]"));
    if (!("IntersectionObserver" in window) || RM()) {
      els.forEach(runCounter);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCounter(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
