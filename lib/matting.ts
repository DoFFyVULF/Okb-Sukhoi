"use client";

import { useEffect } from "react";

// Фон на исходниках — светлый (белый/светло-серый, ~250 по каждому каналу),
// с лёгким градиентом/оттенком внутри кадра. Достаточно порога по яркости:
// белый фон «светлее» любой детали самолёта. (Раньше стоял жёсткий
// max-min<16 — он ловил только чисто-серые пиксели по краю и заливка
// останавливалась на 1px-бордюре, оставляя весь белый фон.)
const isBG = (r: number, g: number, b: number) => r > 205 && g > 205 && b > 205;

/**
 * Runtime alpha-matting: загружает PNG, удаляет белый фон (flood-fill от краёв),
 * оставляет самую большую связную компоненту, делает остальное прозрачным.
 * Возвращает dataURL с прозрачным фоном либо исходный src при ошибке.
 *
 * Картинка грузится через fetch()+blob-URL, а не через <img crossorigin>:
 * так canvas гарантированно «чистый» (same-origin blob) и чтение getImageData
 * не падает из-за кэша CDN, отданного без CORS-заголовков для <img>.
 */
async function matteOne(src: string): Promise<string> {
  let objectUrl: string | null = null;
  try {
    const resp = await fetch(src, { mode: "cors" });
    if (!resp.ok) return src;
    const blob = await resp.blob();
    objectUrl = URL.createObjectURL(blob);

    const im = new Image();
    im.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      im.onload = () => resolve();
      im.onerror = () => reject(new Error("matte: image load failed"));
      im.src = objectUrl!;
    });

    const w = im.naturalWidth;
    const h = im.naturalHeight;
    const N = w * h;
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const cx = cv.getContext("2d", { willReadFrequently: true });
    if (!cx) return src;
    cx.drawImage(im, 0, 0);
    const id = cx.getImageData(0, 0, w, h);
    const d = id.data;

    const removed = new Uint8Array(N);
    const q = new Int32Array(N);
    let qt = 0;
    const push = (i: number) => {
      removed[i] = 1;
      q[qt++] = i;
    };
    for (let x = 0; x < w; x++) {
      if (isBG(d[x * 4], d[x * 4 + 1], d[x * 4 + 2])) push(x);
      const iB = (h - 1) * w + x;
      if (isBG(d[iB * 4], d[iB * 4 + 1], d[iB * 4 + 2])) push(iB);
    }
    for (let y = 0; y < h; y++) {
      const iL = y * w;
      if (isBG(d[iL * 4], d[iL * 4 + 1], d[iL * 4 + 2])) push(iL);
      const iR = iL + w - 1;
      if (isBG(d[iR * 4], d[iR * 4 + 1], d[iR * 4 + 2])) push(iR);
    }
    // BFS-заливка фона. ВАЖНО: отдельный указатель чтения `head` — нельзя
    // читать из той же позиции, куда сеяли края (иначе заливка начнётся
    // ПОСЛЕ всех посеянных пикселей и прочитает пустые ячейки, т.е. не пойдёт).
    let head = 0;
    while (head < qt) {
      const i = q[head++];
      const px = i % w;
      const py = (i - px) / w;
      let j: number;
      if (px > 0) {
        j = i - 1;
        if (!removed[j] && isBG(d[j * 4], d[j * 4 + 1], d[j * 4 + 2])) push(j);
      }
      if (px < w - 1) {
        j = i + 1;
        if (!removed[j] && isBG(d[j * 4], d[j * 4 + 1], d[j * 4 + 2])) push(j);
      }
      if (py > 0) {
        j = i - w;
        if (!removed[j] && isBG(d[j * 4], d[j * 4 + 1], d[j * 4 + 2])) push(j);
      }
      if (py < h - 1) {
        j = i + w;
        if (!removed[j] && isBG(d[j * 4], d[j * 4 + 1], d[j * 4 + 2])) push(j);
      }
    }

    const lab = new Int32Array(N);
    const stk = new Int32Array(N);
    let cur = 0;
    let best = 1;
    let bestSz = 0;
    for (let s = 0; s < N; s++) {
      if (removed[s] || lab[s]) continue;
      cur++;
      let sz = 0;
      let sh = 0;
      let stt = 1;
      stk[0] = s;
      lab[s] = cur;
      while (sh < stt) {
        const k = stk[sh++];
        sz++;
        const kx = k % w;
        const ky = (k - kx) / w;
        let m: number;
        if (kx > 0) {
          m = k - 1;
          if (!removed[m] && !lab[m]) {
            lab[m] = cur;
            stk[stt++] = m;
          }
        }
        if (kx < w - 1) {
          m = k + 1;
          if (!removed[m] && !lab[m]) {
            lab[m] = cur;
            stk[stt++] = m;
          }
        }
        if (ky > 0) {
          m = k - w;
          if (!removed[m] && !lab[m]) {
            lab[m] = cur;
            stk[stt++] = m;
          }
        }
        if (ky < h - 1) {
          m = k + w;
          if (!removed[m] && !lab[m]) {
            lab[m] = cur;
            stk[stt++] = m;
          }
        }
      }
      if (sz > bestSz) {
        bestSz = sz;
        best = cur;
      }
    }
    for (let p = 0; p < N; p++) {
      if (removed[p] || lab[p] !== best) d[p * 4 + 3] = 0;
    }
    cx.putImageData(id, 0, 0);
    return cv.toDataURL("image/png");
  } catch {
    return src;
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Группирует все <img data-matte> по src и применяет маттинг.
 * До готовности картинки скрыты (через body.matting + CSS), после — добавляется
 * класс `matted`. При ошибке (CORS/сеть) показывается оригинал.
 */
export function useMatting(readyClass = "matted", timeoutMs = 5000) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.classList.add("matting");
    const groups: Record<string, HTMLImageElement[]> = {};
    document.querySelectorAll<HTMLImageElement>("img[data-matte]").forEach((g) => {
      const src = g.getAttribute("src");
      if (src) (groups[src] ||= []).push(g);
    });
    Object.entries(groups).forEach(([src, imgs]) => {
      matteOne(src).then((url) => {
        imgs.forEach((g) => {
          g.src = url;
          g.classList.add(readyClass);
        });
      });
    });
    const t = setTimeout(() => {
      document
        .querySelectorAll<HTMLImageElement>("img[data-matte]")
        .forEach((g) => g.classList.add(readyClass));
    }, timeoutMs);
    return () => clearTimeout(t);
  }, [readyClass, timeoutMs]);
}
