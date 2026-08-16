"use client";

import { useRef } from "react";
import { useCounterObserver } from "@/lib/hooks";
import { FACT_SU57 } from "@/data/content";

const TIMELINE = [
  {
    year: "29.07.1939",
    title: "Рождение бюро",
    text: "Постановление СНК СССР о создании опытного конструкторского бюро. Главным конструктором назначен Павел Осипович Сухой.",
  },
  {
    year: "1940",
    title: "Завод № 51 · Су-2 в серии",
    text: "Бюро получает производственную базу; ближний бомбардировщик Су-2 запускается в серию — первая боевая машина КБ.",
  },
  {
    year: "1950–1970-е",
    title: "Эпоха сверхзвука",
    text: "Перехватчики ПВО Су-9, Су-11, Су-15; ударные машины фронтовой авиации Су-17, Су-24, Су-25.",
  },
  {
    year: "1977",
    title: "Первый полёт Су-27",
    text: "Начало легендарного семейства: интегральная компоновка, ЭДСУ, высочайшая манёвренность.",
    hot: true,
  },
  {
    year: "1990–2000-е",
    title: "Су-30 · Су-33 · Су-34",
    text: "Многоцелевые и палубные машины, фронтовой бомбардировщик с броневой кабиной — семейство закрывает все ниши боевой авиации.",
  },
  {
    year: "2010 · 2021",
    title: "Су-57 (ПАК ФА) · Су-75 Checkmate",
    text: "Первый полёт истребителя пятого поколения Су-57; в 2021-м представлен лёгкий тактический Су-75 Checkmate.",
    hot: true,
  },
];

export function History() {
  const ref = useRef<HTMLDivElement>(null);
  useCounterObserver(ref);

  return (
    <section id="history" className="sec">
      <div className="wrap">
        <p className="overline" data-rv>
          01 // ИСТОРИЯ
        </p>
        <h2 className="h2" data-rv>
          ВОСЕМЬ ДЕСЯТИЛЕТИЙ
          <br />
          <em>НА ПЕРЕДОВОМ РУБЕЖЕ</em>
        </h2>
        <ol className="tl">
          {TIMELINE.map((e) => (
            <li key={e.year} className={e.hot ? "hot" : ""} data-rv>
              <div className="yr">{e.year}</div>
              <div className="card clip">
                <h3>{e.title}</h3>
                <p>{e.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="fact hc clip" data-rv>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <div className="num">
            <span data-cnt="100" data-pre="≈">
              ≈ 100
            </span>
          </div>
          <p>
            типов самолётов создано в ОКБ за годы его работы — от экспериментальных до серийных легендарных
            машин.
          </p>
          <img src={FACT_SU57} alt="Чертёж Су-57, вид сверху" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
