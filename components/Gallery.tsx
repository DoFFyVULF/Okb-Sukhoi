"use client";

import { GALLERY } from "@/data/content";

/** Галерея «КАДРЫ ДЕЖУРСТВА» — фото с Ken Burns-эффектом. */
export function Gallery() {
  return (
    <section id="gallery" className="sec">
      <div className="wrap">
        <p className="overline" data-rv>
          05 // ГАЛЕРЕЯ
        </p>
        <h2 className="h2" data-rv>
          КАДРЫ <em>ДЕЖУРСТВА</em>
        </h2>
        <div className="ggrid">
          {GALLERY.map((g, i) => (
            <figure key={i} className="gfig hc clip" data-rv>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <img src={g.src} alt={g.caption} loading="lazy" />
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
