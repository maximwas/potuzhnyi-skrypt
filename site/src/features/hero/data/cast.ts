export interface Shout {
  readonly word: string;
  readonly jsWord: string;
}

// left і height — відсотки сцени; bubbleLift — де низ бульбашки, відсотки висоти фігури від її низу;
// bubbleOffset — відступ бульбашки від лівого (bubbleSide right) чи правого (left) краю фігури, відсотки її ширини;
// розкладка підібрана перебором (бульбашки одного розміру не перекривають одна одну й обличчя), тож міняти числа лише разом із перевіркою сцени
export interface Placement {
  readonly left: number;
  readonly height: number;
  readonly bubbleLift: number;
  readonly bubbleOffset: number;
  readonly bubbleSide: 'left' | 'right';
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
    desktop: { left: 41.5, height: 58.7, bubbleLift: 92, bubbleOffset: 66, bubbleSide: 'left' },
    mobile: { left: 28.0, height: 38, bubbleLift: 102, bubbleOffset: 39, bubbleSide: 'right' },
    zIndex: 14,
    arrivalOrder: 0,
    enterFrom: 'left',
    bubbleTiltDegrees: -4,
    firstShoutIndex: 0,
    parallaxPixels: 26,
  },
  {
    id: 'poroshenko',
    nameUk: 'Петро Порошенко',
    width: 912,
    height: 1200,
    desktop: { left: 58, height: 54.1, bubbleLift: 100, bubbleOffset: 24, bubbleSide: 'left' },
    mobile: { left: 58.4, height: 38, bubbleLift: 116, bubbleOffset: 59, bubbleSide: 'right' },
    zIndex: 14,
    arrivalOrder: 1,
    enterFrom: 'right',
    bubbleTiltDegrees: 3,
    firstShoutIndex: 1,
    parallaxPixels: 26,
  },
  {
    id: 'budanov',
    nameUk: 'Кирило Буданов',
    width: 860,
    height: 1150,
    desktop: { left: 19.9, height: 42.5, bubbleLift: 104, bubbleOffset: 55, bubbleSide: 'right' },
    mobile: { left: 9.9, height: 40, bubbleLift: 116, bubbleOffset: 43, bubbleSide: 'right' },
    zIndex: 11,
    arrivalOrder: 2,
    enterFrom: 'left',
    bubbleTiltDegrees: 3,
    firstShoutIndex: 4,
    parallaxPixels: 18,
  },
  {
    id: 'klitschko',
    nameUk: 'Віталій Кличко',
    width: 914,
    height: 1200,
    desktop: { left: 78.1, height: 42.7, bubbleLift: 123, bubbleOffset: 30, bubbleSide: 'left' },
    mobile: { left: 87.8, height: 30.9, bubbleLift: 117, bubbleOffset: 29, bubbleSide: 'left' },
    zIndex: 11,
    arrivalOrder: 3,
    enterFrom: 'right',
    bubbleTiltDegrees: -3,
    firstShoutIndex: 2,
    parallaxPixels: 18,
  },
  {
    id: 'yermak',
    nameUk: 'Андрій Єрмак',
    width: 1108,
    height: 1100,
    desktop: { left: 87.4, height: 37.2, bubbleLift: 128, bubbleOffset: 26, bubbleSide: 'right' },
    mobile: null,
    zIndex: 8,
    arrivalOrder: 4,
    enterFrom: 'right',
    bubbleTiltDegrees: 2,
    firstShoutIndex: 5,
    parallaxPixels: 8,
  },
  {
    id: 'tymoshenko',
    nameUk: 'Юлія Тимошенко',
    width: 807,
    height: 1200,
    desktop: { left: 5.9, height: 44.0, bubbleLift: 101, bubbleOffset: 24, bubbleSide: 'right' },
    mobile: null,
    zIndex: 8,
    arrivalOrder: 5,
    enterFrom: 'left',
    bubbleTiltDegrees: -2,
    firstShoutIndex: 3,
    parallaxPixels: 8,
  },
  {
    id: 'zaluzhnyi',
    nameUk: 'Валерій Залужний',
    width: 1004,
    height: 1000,
    desktop: { left: 69.4, height: 40.4, bubbleLift: 105, bubbleOffset: 28, bubbleSide: 'right' },
    mobile: null,
    zIndex: 9,
    arrivalOrder: 6,
    enterFrom: 'bottom',
    bubbleTiltDegrees: 2,
    firstShoutIndex: 6,
    parallaxPixels: 12,
  },
  {
    id: 'svyrydenko',
    nameUk: 'Юлія Свириденко',
    width: 788,
    height: 1200,
    desktop: { left: 28.0, height: 39.9, bubbleLift: 86, bubbleOffset: 65, bubbleSide: 'right' },
    mobile: null,
    zIndex: 9,
    arrivalOrder: 7,
    enterFrom: 'bottom',
    bubbleTiltDegrees: -3,
    firstShoutIndex: 7,
    parallaxPixels: 12,
  },
  {
    id: 'kolomoisky',
    nameUk: 'Ігор Коломойський',
    width: 771,
    height: 1000,
    desktop: { left: 95.0, height: 36, bubbleLift: 105, bubbleOffset: 21, bubbleSide: 'left' },
    mobile: null,
    zIndex: 10,
    arrivalOrder: 8,
    enterFrom: 'bottom',
    bubbleTiltDegrees: 3,
    firstShoutIndex: 8,
    parallaxPixels: 10,
  },
];
