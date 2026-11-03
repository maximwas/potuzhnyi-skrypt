import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import typescript from 'typescript';

import { createHoverInfoService } from '../src/create-hover-info-service.ts';
import type { HoverInfo } from '../src/hover-info-service.ts';

const SOURCE = `/** Сума відкату */
схема розпилити(сума) {
  відкат сума;
}

партія Депутат {
  будівництво(імʼя) {
    я_тут.імʼя = імʼя;
  }

  привітатись() {
    відкат я_тут.імʼя;
  }
}

потужно депутат = по_новому Депутат("Петренко");
депутат.привітатись();
потужно кількість = розпилити(5);
`;

function hoverOn(
  word: string,
  occurrence = 0,
  typescriptModule = typescript,
): HoverInfo | undefined {
  let offset = -1;

  for (let index = 0; index <= occurrence; index += 1) {
    offset = SOURCE.indexOf(word, offset + 1);
  }

  return createHoverInfoService(typescriptModule).hoverAt(SOURCE, offset + 1);
}

describe('HoverInfoService', () => {
  it('показує підпис методу створеного класу кириличними іменами', () => {
    const info = hoverOn('привітатись', 1);

    assert.ok(info);
    assert.match(info.markdown, /\(method\) Депутат\.привітатись\(\): any/);
    assert.doesNotMatch(info.markdown, /Deputat|pryvitatys/);
  });

  it('показує клас і конструктор з мемним ключовим словом', () => {
    const declaration = hoverOn('Депутат', 0);
    const construction = hoverOn('Депутат', 1);

    assert.match(declaration?.markdown ?? '', /партія Депутат/);
    assert.match(construction?.markdown ?? '', /Депутат\(імʼя: any\): Депутат/);
  });

  it('показує функцію разом із коментарем-документацією', () => {
    const info = hoverOn('розпилити', 1);

    assert.match(info?.markdown ?? '', /схема розпилити\(сума: any\): any/);
    assert.match(info?.markdown ?? '', /Сума відкату/);
  });

  it('показує тип змінної', () => {
    const info = hoverOn('кількість');

    assert.match(info?.markdown ?? '', /потужно кількість: any/);
  });

  it('повертає діапазон слова у вихідному тексті', () => {
    const info = hoverOn('кількість');

    assert.equal(SOURCE.slice(info?.start, info?.end), 'кількість');
  });

  it('для мемного слова показує відповідне JS-слово', () => {
    const info = hoverOn('потужно');

    assert.match(info?.markdown ?? '', /`потужно` → `let`/);
  });

  it('мовчить на пробілі й на числі', () => {
    const service = createHoverInfoService(typescript);

    assert.equal(service.hoverAt(SOURCE, SOURCE.indexOf(' депутат') + 0), undefined);
    assert.equal(service.hoverAt('потужно а = 5;', 12), undefined);
  });

  it('без TypeScript лишає тільки підказки мемних слів', () => {
    const service = createHoverInfoService(undefined);

    assert.equal(service.hoverAt(SOURCE, SOURCE.indexOf('кількість') + 1), undefined);
    assert.match(service.hoverAt(SOURCE, SOURCE.indexOf('потужно') + 1)?.markdown ?? '', /→ `let`/);
  });

  it('не падає, коли два імена мають однакову латиницю', () => {
    const service = createHoverInfoService(typescript);

    assert.equal(service.hoverAt('потужно мить = 1;\nпотужно мит = 2;', 9), undefined);
  });
});
