/**
 * Minimal class-name joiner (no external deps).
 * Filters out falsy values and joins with a single space.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Clamp a number into the inclusive [min, max] range.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Format a number with thin-space grouping (ru-RU style) without decimals.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}
