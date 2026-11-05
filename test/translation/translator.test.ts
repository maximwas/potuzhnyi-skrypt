import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createPotuzhnoContainer } from '../../src/container.ts';
import { NameCollisionError } from '../../src/translation/name-collision-error.ts';

const { translator } = createPotuzhnoContainer().cradle;

function translateToJs(source: string): string {
  return translator.translate(source, 'test.potuzhno').code;
}

describe('Translator', () => {
  it('замінює мемні слова на JS', () => {
    assert.equal(translateToJs('потужно х = 1;'), 'let kh = 1;');
  });

  it('повертає список замін із діапазонами у вихідному коді', () => {
    const { replacements } = translator.translate('потужно х = 1;', 'test.potuzhno');

    assert.deepEqual(replacements, [
      { start: 0, end: 7, original: 'потужно', replacement: 'let' },
      { start: 8, end: 9, original: 'х', replacement: 'kh' },
    ]);
  });

  it('не чіпає рядки, коментарі й регулярні вирази', () => {
    assert.equal(
      translateToJs('потужно х = "потужно відкат"; // відкат'),
      'let kh = "потужно відкат"; // відкат',
    );

    assert.equal(translateToJs('батон р = /відкат/g;'), 'const r = /відкат/g;');
  });

  it('перекладає код усередині ${} шаблонного рядка', () => {
    assert.equal(
      translateToJs('ОП.звернення(`потужно ${бюджет.розпил(х => х)}`)'),
      'console.log(`потужно ${biudzhet.map(kh => kh)}`)',
    );
  });

  it('замінює слова-оператори на символи, у тому числі всередині ${}', () => {
    assert.equal(translateToJs('а донат_на_дрони б'), 'a + b');
    assert.equal(translateToJs('`${а відпил_бюджету б}`'), '`${a - b}`');
    assert.equal(translateToJs('а залишок_після_розпилу 2'), 'a % 2');
  });

  it('не зліплює слово-оператор із сусіднім символом', () => {
    assert.equal(translateToJs('а відпил_бюджету-1'), 'a - -1');
    assert.equal(translateToJs('а донат_на_дрони+1'), 'a + +1');
    assert.equal(translateToJs('а відпил_бюджету--б'), 'a - --b');
    assert.equal(translateToJs('а ділити_по_братськи/* коментар */ б'), 'a / /* коментар */ b');
    assert.equal(translateToJs('донат_на_дрони донат_на_дрони х'), '+ + kh');
  });

  it('не чіпає англійський JS', () => {
    const source = 'const total = [1, 2].map((item) => item * 2);';

    assert.equal(translateToJs(source), source);
  });

  it('транслітерує власні імена за КМУ-2010', () => {
    assert.equal(
      translateToJs('Депутат Згорани Єнакієве ЩУКА ВІДКАТ мій_ящик2 myБюджет'),
      'Deputat Zghorany Yenakiieve SHCHUKA VIDKAT mii_yashchyk2 myBiudzhet',
    );

    assert.equal(translateToJs('я_тут.#поле'), 'this.#pole');
  });

  it('імʼя з апострофом ʼ або ’ дає однаковий результат', () => {
    assert.equal(translateToJs('імʼя ім’я'), 'imia imia');
    assert.equal(translateToJs('по_новому Сім’я()'), 'new Map()');
  });

  it('додає _ до імені, що збігається з ключовим словом чи глобальним обʼєктом', () => {
    assert.equal(translateToJs('потужно до = 1; потужно Сет = 2'), 'let do_ = 1; let Set_ = 2');
  });

  it('будує source map з іменем файлу й початковим кодом', () => {
    const source = 'потужно х = 1;';
    const { sourceMap } = translator.translate(source, 'test.potuzhno');

    assert.deepEqual(sourceMap.sources, ['test.potuzhno']);
    assert.deepEqual(sourceMap.sourcesContent, [source]);
  });

  describe('два різні імені з однаковою латиницею', () => {
    const source = 'потужно кут = 1;\nпотужно куть = 2';

    it('дають NameCollisionError з рядком у файлі', () => {
      assert.throws(
        () => translateToJs(source),
        (error) => {
          assert.ok(error instanceof NameCollisionError);

          assert.deepEqual(error.details, {
            firstName: 'кут',
            secondName: 'куть',
            latinName: 'kut',
            fileName: 'test.potuzhno',
            line: 2,
          });

          return true;
        },
      );
    });

    it('не заважають повторам того самого імені', () => {
      assert.equal(translateToJs('кут + кут'), 'kut + kut');
    });
  });
});

describe('Translator: шляхи імпорту зібраного коду', () => {
  function translateForBuild(source: string): string {
    return translator.translate(source, 'test.potuzhno', { importExtension: '.js' }).code;
  }

  it('міняє .potuzhno на .js у всіх видах імпорту й реекспорту', () => {
    const source = [
      'завезти Кошик з "./кошик.potuzhno";',
      "завезти { а як б } з '../х/гроші.potuzhno';",
      'завезти * як вітрина з "./індекс.potuzhno";',
      'завезти "./побічний.potuzhno";',
      'вивезти { тво як Кошик } з "./кошик.potuzhno";',
      'вивезти * з "./товари.potuzhno";',
      'батон пакунок = два_три_тижні завезти("./гроші.potuzhno");',
    ].join('\n');

    assert.equal(
      translateForBuild(source),
      [
        'import Koshyk from "./кошик.js";',
        "import { a as b } from '../х/гроші.js';",
        'import * as vitryna from "./індекс.js";',
        'import "./побічний.js";',
        'export { default as Koshyk } from "./кошик.js";',
        'export * from "./товари.js";',
        'const pakunok = await import("./гроші.js");',
      ].join('\n'),
    );
  });

  it('не чіпає звичайні рядки, пакети й шляхи без .potuzhno', () => {
    const source = [
      'ОП.звернення("./кошик.potuzhno");',
      'завезти { х } з "node:fs";',
      'завезти { у } з "./файл.js";',
      'завезти { ж } з "пакет.potuzhno";',
      'об.import("./а.potuzhno");',
    ].join('\n');

    assert.equal(
      translateForBuild(source),
      [
        'console.log("./кошик.potuzhno");',
        'import { kh } from "node:fs";',
        'import { u } from "./файл.js";',
        'import { zh } from "пакет.potuzhno";',
        'ob.import("./а.potuzhno");',
      ].join('\n'),
    );
  });

  it('без опції лишає шляхи як є', () => {
    assert.equal(translateToJs('завезти х з "./а.potuzhno";'), 'import kh from "./а.potuzhno";');
  });
});
