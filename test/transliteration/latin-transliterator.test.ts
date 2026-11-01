import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createPotuzhnoContainer } from '../../src/container.ts';
import { LatinTransliterator } from '../../src/transliteration/latin-transliterator.ts';

const KMU_CONTROL_WORDS: readonly (readonly [string, string])[] = [
  ['Депутат', 'Deputat'],
  ['бюджет', 'biudzhet'],
  ['імʼя', 'imia'],
  ['Згорани', 'Zghorany'],
  ['Розгон', 'Rozghon'],
  ['Єнакієве', 'Yenakiieve'],
  ['Їжакевич', 'Yizhakevych'],
  ['Йосипівка', 'Yosypivka'],
  ['Юрій', 'Yurii'],
  ['Яготин', 'Yahotyn'],
  ['Знамʼянка', 'Znamianka'],
  ['Щербухи', 'Shcherbukhy'],
  ['Гайворон', 'Haivoron'],
  ['Ґалаґан', 'Galagan'],
  ['ВІДКАТ', 'VIDKAT'],
  ['ЩУКА', 'SHCHUKA'],
  ['розпилити', 'rozpylyty'],
  ['мій_ящик2', 'mii_yashchyk2'],
];

describe('LatinTransliterator', () => {
  describe('транслітерація за постановою КМУ №55 (2010)', () => {
    const { latinTransliterator } = createPotuzhnoContainer().cradle;

    for (const [cyrillicName, latinName] of KMU_CONTROL_WORDS) {
      it(`${cyrillicName} → ${latinName}`, () => {
        assert.equal(latinTransliterator.toLatin(cyrillicName), latinName);
      });
    }
  });

  it('додає _ до латиниці, що збігається із зарезервованим словом', () => {
    const transliterator = new LatinTransliterator({
      transliterate: (text) => ({ latin: text === 'до' ? 'do' : text }),
      reservedWords: new Set(['do']),
    });

    assert.equal(transliterator.toLatin('до'), 'do_');
    assert.equal(transliterator.toLatin('кут'), 'кут');
  });

  it('розпізнає кириличні імена', () => {
    const { latinTransliterator } = createPotuzhnoContainer().cradle;

    assert.equal(latinTransliterator.containsCyrillic('myБюджет'), true);
    assert.equal(latinTransliterator.containsCyrillic('budget'), false);
  });
});
