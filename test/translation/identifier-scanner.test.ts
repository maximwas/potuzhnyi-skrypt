import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createPotuzhnoContainer } from '../../src/container.ts';
import { MEME_ENTRIES } from '../../src/dictionary/meme-entries.ts';

const { identifierScanner } = createPotuzhnoContainer().cradle;

function scanNames(source: string): string[] {
  return [...identifierScanner.scan(source)].map((identifier) => identifier.name);
}

describe('IdentifierScanner', () => {
  it('знаходить імена поза рядками, коментарями й регулярними виразами', () => {
    const source = 'потужно х = "рядок"; // коментар\nх.test(/регвираз/);';

    assert.deepEqual(scanNames(source), ['потужно', 'х', 'х', 'test']);
  });

  it('знаходить імена всередині виразів шаблонного рядка', () => {
    assert.deepEqual(scanNames('`текст ${назва} кінець`'), ['назва']);
  });

  it('зливає імʼя з апострофом U+2019 в одне імʼя з ʼ', () => {
    assert.deepEqual(scanNames('ім’я'), ['імʼя']);
    assert.deepEqual(scanNames('імʼя'), ['імʼя']);
  });

  it('позначає приватні імена', () => {
    const [identifier] = identifierScanner.scan('#поле');

    assert.equal(identifier.name, '#поле');
    assert.equal(identifier.isPrivate, true);
  });

  it('повертає початок і кінець імені в тексті', () => {
    const source = 'a = ім’я;';
    const identifiers = [...identifierScanner.scan(source)];

    assert.equal(source.slice(identifiers[1].start, identifiers[1].end), 'ім’я');
  });

  it('читає «/» після мемного return чи typeof як початок регулярного виразу', () => {
    assert.deepEqual(scanNames('відкат /потужно/g.test(х)'), ['відкат', 'test', 'х']);
    assert.deepEqual(scanNames('відкат /"/.test(х) + "рядок"'), ['відкат', 'test', 'х']);
    assert.deepEqual(scanNames('анкета /* прапор */ /потужно/'), ['анкета']);
  });

  it('читає «/» після слова-оператора як початок регулярного виразу', () => {
    const [plusWord] = MEME_ENTRIES.find(([, jsWord]) => jsWord === '+') ?? [];

    assert.ok(plusWord);
    assert.deepEqual(scanNames(`${plusWord} /потужно/.test(х)`), [plusWord, 'test', 'х']);
  });

  it('читає «/» після звичайного імені чи властивості як ділення', () => {
    assert.deepEqual(scanNames('а / б / в'), ['а', 'б', 'в']);
    assert.deepEqual(scanNames('х.відкат / б / в'), ['х', 'відкат', 'б', 'в']);
  });
});
