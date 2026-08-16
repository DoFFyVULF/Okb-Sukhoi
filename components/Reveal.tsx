"use client";

import { useReveal } from "@/lib/hooks";
import { useMatting } from "@/lib/matting";

/**
 * Глобальный «эффект-обвязка»: запускает reveal-анимации всех [data-rv]
 * и runtime alpha-matting всех <img data-matte> на странице. Рендерит null.
 */
export function Reveal() {
  useReveal();
  useMatting();
  return null;
}
