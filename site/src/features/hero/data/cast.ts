export interface Shout {
  readonly word: string;
  readonly jsWord: string;
}

interface Placement {
  readonly left: number;
  readonly height: number;
}

export interface CastMember {
  readonly id: string;
  readonly nameUk: string;
  readonly width: number;
  readonly height: number;
  readonly desktop: Placement;
  readonly mobile: Placement | null;
  readonly zIndex: number;
  readonly arrivalOrder: number;
  readonly enterFrom: 'left' | 'right' | 'bottom';
  readonly bubbleSide: 'left' | 'right';
  readonly bubbleTiltDegrees: number;
  readonly firstShoutIndex: number;
  readonly parallaxPixels: number;
}

// Лише нейтральні слова мови: репліки в бульбашках не цитати й не натяки на людей на фото.
// Слова про злочини й гроші (відкат, вирок, застава, зрада, СІЗО) сюди не потрапляють.
export const SHOUTS: readonly Shout[] = [
  { word: 'ПОТУЖНО!', jsWord: 'let' },
  { word: 'ПО_НОВОМУ!', jsWord: 'new' },
  { word: 'ПЕРЕМОГА!', jsWord: 'true' },
  { word: 'ПАРТІЯ!', jsWord: 'class' },
  { word: 'ЩОБ!', jsWord: 'if' },
  { word: 'ХТО_НЕ_ЧУВ!', jsWord: 'else' },
  { word: 'КАДЕНЦІЯ!', jsWord: 'for' },
  { word: 'ЗАВТРАШНІЙ!', jsWord: 'async' },
  { word: 'ДВА_ТРИ_ТИЖНІ!', jsWord: 'await' },
];

// Порядок у масиві = порядок виходу на сцену, коли гортаєш: спершу центр, далі краї.
export const CAST: readonly CastMember[] = [
  {
    id: 'zelensky',
    nameUk: 'Володимир Зеленський',
    width: 901,
    height: 1100,
    desktop: { left: 33, height: 62 },
    mobile: { left: 36, height: 44 },
    zIndex: 14,
    arrivalOrder: 0,
    enterFrom: 'left',
    bubbleSide: 'left',
    bubbleTiltDegrees: -4,
    firstShoutIndex: 0,
    parallaxPixels: 26,
  },
  {
    id: 'poroshenko',
    nameUk: 'Петро Порошенко',
    width: 912,
    height: 1200,
    desktop: { left: 67, height: 62 },
    mobile: { left: 67, height: 46 },
    zIndex: 14,
    arrivalOrder: 1,
    enterFrom: 'right',
    bubbleSide: 'right',
    bubbleTiltDegrees: 3,
    firstShoutIndex: 1,
    parallaxPixels: 26,
  },
  {
    id: 'budanov',
    nameUk: 'Кирило Буданов',
    width: 860,
    height: 1150,
    desktop: { left: 18, height: 54 },
    mobile: { left: 13, height: 34 },
    zIndex: 11,
    arrivalOrder: 2,
    enterFrom: 'left',
    bubbleSide: 'right',
    bubbleTiltDegrees: 3,
    firstShoutIndex: 4,
    parallaxPixels: 18,
  },
  {
    id: 'klitschko',
    nameUk: 'Віталій Кличко',
    width: 914,
    height: 1200,
    desktop: { left: 82, height: 54 },
    mobile: { left: 89, height: 34 },
    zIndex: 11,
    arrivalOrder: 3,
    enterFrom: 'right',
    bubbleSide: 'left',
    bubbleTiltDegrees: -3,
    firstShoutIndex: 2,
    parallaxPixels: 18,
  },
  {
    id: 'yermak',
    nameUk: 'Андрій Єрмак',
    width: 1108,
    height: 1100,
    desktop: { left: 96, height: 44 },
    mobile: null,
    zIndex: 8,
    arrivalOrder: 4,
    enterFrom: 'right',
    bubbleSide: 'left',
    bubbleTiltDegrees: 2,
    firstShoutIndex: 5,
    parallaxPixels: 8,
  },
  {
    id: 'tymoshenko',
    nameUk: 'Юлія Тимошенко',
    width: 807,
    height: 1200,
    desktop: { left: 6, height: 44 },
    mobile: null,
    zIndex: 8,
    arrivalOrder: 5,
    enterFrom: 'left',
    bubbleSide: 'right',
    bubbleTiltDegrees: -2,
    firstShoutIndex: 3,
    parallaxPixels: 8,
  },
  {
    id: 'zaluzhnyi',
    nameUk: 'Валерій Залужний',
    width: 1004,
    height: 1000,
    desktop: { left: 75, height: 46 },
    mobile: { left: 80, height: 30 },
    zIndex: 9,
    arrivalOrder: 6,
    enterFrom: 'bottom',
    bubbleSide: 'right',
    bubbleTiltDegrees: 2,
    firstShoutIndex: 6,
    parallaxPixels: 12,
  },
  {
    id: 'svyrydenko',
    nameUk: 'Юлія Свириденко',
    width: 788,
    height: 1200,
    desktop: { left: 25, height: 46 },
    mobile: null,
    zIndex: 9,
    arrivalOrder: 7,
    enterFrom: 'bottom',
    bubbleSide: 'left',
    bubbleTiltDegrees: -3,
    firstShoutIndex: 7,
    parallaxPixels: 12,
  },
  {
    id: 'kolomoisky',
    nameUk: 'Ігор Коломойський',
    width: 771,
    height: 1000,
    desktop: { left: 91, height: 46 },
    mobile: null,
    zIndex: 10,
    arrivalOrder: 8,
    enterFrom: 'bottom',
    bubbleSide: 'left',
    bubbleTiltDegrees: 3,
    firstShoutIndex: 8,
    parallaxPixels: 10,
  },
];
