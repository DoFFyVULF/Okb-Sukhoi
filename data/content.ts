/**
 * Контент лендинга ОКБ Сухого.
 * Портировано из legacy/index.html (<script>): PLANES / FLEET / WEAPONS / галерея.
 * Все изображения — PNG с прозрачным фоном (runtime alpha-matting в lib/matting.ts),
 * хост image.qwenlm.ai отдаёт Access-Control-Allow-Origin: * (нужно для маттинга).
 */

const BASE = "https://image.qwenlm.ai/public_source/e2a3e154-caea-43ac-a9a6-62f6bbc394c7";

export const PLANES: Record<string, string> = {
  su27: `${BASE}/1a027ab02-9a29-4823-90b1-dd2318d9e205.png`,
  su30: `${BASE}/1c54c072c-7e51-47b3-935b-70a17fe30ffa.png`,
  su34: `${BASE}/17cbef53a-76cb-468d-8016-46df03081dd8.png`,
  su35: `${BASE}/12a8eb010-75a2-42b2-be42-9d916b9bb759.png`,
  su57: `${BASE}/128563a5a-3507-41e2-b86e-e73f5f8e96cc.png`,
  su75: `${BASE}/14e9a5510-7055-4984-801f-8ac11077cdbb.png`,
};

/** Чертёж Су-57 (вид сверху) для блока «факт» в истории. */
export const FACT_SU57 = `${BASE}/14df9c33d-6ccb-44ab-b9e6-31e828e4ab9a.png`;

export interface FleetStat {
  label: string;
  value: number;
  unit: string;
}

export interface FleetAircraft {
  id: string;
  /** Зеркалить PNG по горизонтали (исходник смотрит влево). */
  flip: boolean;
  name: string;
  gen: string;
  role: string;
  desc: string;
  stats: FleetStat[];
}

export const FLEET: FleetAircraft[] = [
  {
    id: "su27",
    flip: true,
    name: "СУ-27",
    gen: "4 ПОКОЛЕНИЕ",
    role: "Фронтовой истребитель, родоначальник семейства",
    desc: "Интегральная компоновка, выдающаяся манёвренность, база для десятков модификаций.",
    stats: [
      { label: "СКОРОСТЬ", value: 2500, unit: "КМ/Ч" },
      { label: "ПОТОЛОК", value: 20000, unit: "М" },
      { label: "ДАЛЬНОСТЬ", value: 3600, unit: "КМ" },
    ],
  },
  {
    id: "su30",
    flip: true,
    name: "СУ-30СМ",
    gen: "4+ ПОКОЛЕНИЕ",
    role: "Многоцелевой двухместный истребитель",
    desc: "Завоевание превосходства и ударные задачи: два кресла, УВТ, широчайшая номенклатура подвески.",
    stats: [
      { label: "СКОРОСТЬ", value: 2125, unit: "КМ/Ч" },
      { label: "ПОТОЛОК", value: 17300, unit: "М" },
      { label: "ДАЛЬНОСТЬ", value: 3000, unit: "КМ" },
    ],
  },
  {
    id: "su34",
    flip: true,
    name: "СУ-34",
    gen: "4+ ПОКОЛЕНИЕ",
    role: "Фронтовой бомбардировщик",
    desc: "Броневая кабина, экипаж «плечом к плечу», нагрузка 8 000 кг на 12 узлах подвески.",
    stats: [
      { label: "НАГРУЗКА", value: 8000, unit: "КГ" },
      { label: "УЗЛОВ", value: 12, unit: "" },
      { label: "СКОРОСТЬ", value: 1900, unit: "КМ/Ч" },
    ],
  },
  {
    id: "su35",
    flip: false,
    name: "СУ-35С",
    gen: "4++ ПОКОЛЕНИЕ",
    role: "Сверхманёвренный истребитель",
    desc: "2 500 км/ч, потолок 20 000 м; до 12 × Р-77-1 плюс Р-73 и Р-37М — вершина линии «Фланкеров».",
    stats: [
      { label: "СКОРОСТЬ", value: 2500, unit: "КМ/Ч" },
      { label: "ПОТОЛОК", value: 20000, unit: "М" },
      { label: "РАКЕТ", value: 12, unit: "" },
    ],
  },
  {
    id: "su57",
    flip: true,
    name: "СУ-57",
    gen: "5 ПОКОЛЕНИЕ",
    role: "Многоцелевой истребитель ПАК ФА",
    desc: "2 600 км/ч, потолок 20 000 м, дальность до 5 500 км; внутренние отсеки вооружения, низкая ЭПР.",
    stats: [
      { label: "СКОРОСТЬ", value: 2600, unit: "КМ/Ч" },
      { label: "ПОТОЛОК", value: 20000, unit: "М" },
      { label: "ДАЛЬНОСТЬ", value: 5500, unit: "КМ" },
    ],
  },
  {
    id: "su75",
    flip: true,
    name: "СУ-75 CHECKMATE",
    gen: "5 ПОКОЛЕНИЕ · ЛЁГКИЙ",
    role: "Лёгкий тактический истребитель",
    desc: "Однодвигательный «шах и мат»: малозаметность, модульная авионика, ниша лёгкого 5-поколенца.",
    stats: [
      { label: "СКОРОСТЬ", value: 2000, unit: "КМ/Ч" },
      { label: "ДАЛЬНОСТЬ", value: 3000, unit: "КМ" },
      { label: "НАГРУЗКА", value: 7400, unit: "КГ" },
    ],
  },
];

export type WeaponIcon = "aa" | "ag" | "cr" | "bomb" | "gun";

export interface WeaponStat {
  label: string;
  /** Число (для count-up) либо строка (отображается как есть). */
  value: number | string;
  unit?: string;
}

export interface WeaponItem {
  icon: WeaponIcon;
  name: string;
  type: string;
  desc: string;
  /** Дальность/величина для шкалы (в единицах unit группы). */
  range: number;
  stats: WeaponStat[];
}

export interface WeaponGroup {
  scale: number;
  unit: string;
  items: WeaponItem[];
}

export const WEAPONS: Record<string, WeaponGroup> = {
  aa: {
    scale: 300,
    unit: "КМ",
    items: [
      {
        icon: "aa",
        name: "Р-73 / РВВ-МД",
        type: "Малая дальность · ТГС",
        desc: "Высокоманёвренная ракета ближнего боя с тепловизорной ГСН — оружие собачьей схватки.",
        range: 40,
        stats: [
          { label: "ДАЛЬНОСТЬ", value: 40, unit: "КМ" },
          { label: "СКОРОСТЬ", value: 2.5, unit: "М" },
          { label: "БЧ", value: 8, unit: "КГ" },
        ],
      },
      {
        icon: "aa",
        name: "Р-77-1 / РВВ-СД",
        type: "Средняя дальность · АРГСН",
        desc: "«Выстрелил-забыл»: активная радиолокационная ГСН, дальность до 110 км.",
        range: 110,
        stats: [
          { label: "ДАЛЬНОСТЬ", value: 110, unit: "КМ" },
          { label: "СКОРОСТЬ", value: 4, unit: "М" },
          { label: "БЧ", value: 22, unit: "КГ" },
        ],
      },
      {
        icon: "aa",
        name: "Р-77М",
        type: "Новая АРГСН · Су-57/Су-35С",
        desc: "Модернизированная ракета с АРГСН увеличенной дальности для машин 5-го и 4++ поколений.",
        range: 200,
        stats: [
          { label: "ДАЛЬНОСТЬ", value: 200, unit: "КМ" },
          { label: "ГСН", value: "АРГСН" },
          { label: "НОСИТЕЛЬ", value: "СУ-57" },
        ],
      },
      {
        icon: "aa",
        name: "Р-37М / РВВ-БД",
        type: "Большая дальность · до 6М",
        desc: "«Охотник» за ДРЛО и заправщиками: до 300 км, скорость до 6М.",
        range: 300,
        stats: [
          { label: "ДАЛЬНОСТЬ", value: 300, unit: "КМ" },
          { label: "СКОРОСТЬ", value: 6, unit: "М" },
          { label: "БЧ", value: 61, unit: "КГ" },
        ],
      },
    ],
  },
  ag: {
    scale: 290,
    unit: "КМ",
    items: [
      {
        icon: "ag",
        name: "Х-31ПД",
        type: "Противорадиолокационная",
        desc: "«Охотник за ПВО»: самонаведение на излучение РЛС противника, повышенная дальность.",
        range: 180,
        stats: [
          { label: "ДАЛЬНОСТЬ", value: 180, unit: "КМ" },
          { label: "СКОРОСТЬ", value: 3.5, unit: "М" },
          { label: "ЦЕЛЬ", value: "РЛС" },
        ],
      },
      {
        icon: "ag",
        name: "Х-38",
        type: "Высокоточная · до 40 км",
        desc: "Модульное семейство: лазерное, спутниковое или тепловизионное наведение по выбору.",
        range: 40,
        stats: [
          { label: "ДАЛЬНОСТЬ", value: 40, unit: "КМ" },
          { label: "БЧ", value: 250, unit: "КГ" },
          { label: "НАВЕДЕНИЕ", value: "ИНС+" },
        ],
      },
      {
        icon: "cr",
        name: "Х-59МК2",
        type: "Малозаметная · до 290 км",
        desc: "Крылатая ракета пониженной заметности с корреляционной ГСН по образу цели.",
        range: 290,
        stats: [
          { label: "ДАЛЬНОСТЬ", value: 290, unit: "КМ" },
          { label: "БЧ", value: 320, unit: "КГ" },
          { label: "ЭПР", value: "НИЗК." },
        ],
      },
      {
        icon: "cr",
        name: "Х-69",
        type: "Для внутренних отсеков",
        desc: "Компактная крылатая ракета скрытого применения — штатный боеприпас отсеков Су-57.",
        range: 290,
        stats: [
          { label: "ДАЛЬНОСТЬ", value: 290, unit: "КМ" },
          { label: "ОТСЕК", value: "ВНУТР." },
          { label: "НАВЕДЕНИЕ", value: "ИНС" },
        ],
      },
    ],
  },
  bomb: {
    scale: 70,
    unit: "КМ",
    items: [
      {
        icon: "bomb",
        name: "КАБ-500",
        type: "Корректируемая · 500 кг",
        desc: "Спутниковая коррекция, КВО единицы метров: «умная» пятисотка для точечных ударов.",
        range: 50,
        stats: [
          { label: "МАССА", value: 500, unit: "КГ" },
          { label: "КВО", value: 8, unit: "М" },
          { label: "ГЛИССАДА", value: 50, unit: "КМ" },
        ],
      },
      {
        icon: "bomb",
        name: "КАБ-1500",
        type: "Корректируемая · 1500 кг",
        desc: "Тяжёлый аргумент по укреплённым целям: лазерные и спутниковые варианты наведения.",
        range: 60,
        stats: [
          { label: "МАССА", value: 1500, unit: "КГ" },
          { label: "КВО", value: 10, unit: "М" },
          { label: "ГЛИССАДА", value: 60, unit: "КМ" },
        ],
      },
    ],
  },
  gun: {
    scale: 2000,
    unit: "ВЫСТР/МИН",
    items: [
      {
        icon: "gun",
        name: "ГШ-30-1",
        type: "30-мм автоматическая пушка",
        desc: "Штатная пушка Су-27/30/35/57: 150 снарядов, темп ~1500 выстр/мин.",
        range: 1500,
        stats: [
          { label: "КАЛИБР", value: 30, unit: "ММ" },
          { label: "СНАРЯДОВ", value: 150, unit: "" },
          { label: "ТЕМП", value: 1500, unit: "В/М" },
        ],
      },
    ],
  },
};

export interface GalleryImage {
  src: string;
  caption: string;
}

export const GALLERY: GalleryImage[] = [
  {
    src: `${BASE}/1c5647d6d-278a-4f92-9a3d-93a05358131f.png`,
    caption: "КАДР 01 · ФОРСАЖНЫЙ РЕЖИМ · СУ-57",
  },
  {
    src: `${BASE}/13dfc582d-57bb-4e92-8f1c-4b0c3af249c2.png`,
    caption: "КАДР 02 · НОЧНАЯ СТОЯНКА · ТЕХНИКИ",
  },
  {
    src: `${BASE}/15a578a58-12e8-4604-ba16-1fea8f35b0f8.png`,
    caption: "КАДР 03 · ПАТРУЛЬ ВЫШЕ ОБЛАКОВ",
  },
  {
    src: `${BASE}/19d59e485-7747-4e07-8aa0-769791181714.png`,
    caption: "КАДР 04 · ВЗЛЁТ С ПОЛНЫМ ФОРСАЖЕМ",
  },
];

/** Картинки для секции «Пролёт» (flyby): Б — Су-35С, А — Су-57, С — Су-34. */
export const FLYBY_CRAFT = {
  b: PLANES.su35,
  a: PLANES.su57,
  c: PLANES.su34,
};
