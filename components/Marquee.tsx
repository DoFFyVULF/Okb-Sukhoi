"use client";

const ITEMS = ["СУ-27", "СУ-30СМ", "СУ-34", "СУ-35С", "СУ-57", "СУ-75"];

/** Бесконечная бегущая строка с моделями бюро. */
export function Marquee() {
  const track = (
    <>
      {ITEMS.map((t) => (
        <span key={t}>
          {t} <b>•</b>
        </span>
      ))}
      {ITEMS.map((t) => (
        <span key={t + "2"}>
          {t} <b>•</b>
        </span>
      ))}
    </>
  );
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">{track}</div>
    </div>
  );
}
