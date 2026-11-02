import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import ts from 'typescript';

import { MEME_ENTRIES } from '../../src/dictionary/meme-entries.ts';
import { DOM_CLASS_NAMES, DOM_MEMBER_GROUPS, DOM_NAMES } from '../support/dom-names.ts';

const LIB_DOM_PATH = createRequire(import.meta.url).resolve('typescript/lib/lib.dom.d.ts');

// Інтерфейс → імена його не застарілих членів.
function readInterfaceMembers(): ReadonlyMap<string, ReadonlySet<string>> {
  const source = ts.createSourceFile(
    LIB_DOM_PATH,
    readFileSync(LIB_DOM_PATH, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  const membersByInterface = new Map<string, Set<string>>();

  for (const statement of source.statements) {
    if (!ts.isInterfaceDeclaration(statement)) {
      continue;
    }

    const members = membersByInterface.get(statement.name.text) ?? new Set<string>();

    for (const member of statement.members) {
      const isDeprecated = ts.getJSDocTags(member).some((tag) => tag.tagName.text === 'deprecated');

      if (member.name && !isDeprecated) {
        members.add(member.name.getText(source));
      }
    }

    membersByInterface.set(statement.name.text, members);
  }

  return membersByInterface;
}

describe('покриття DOM', () => {
  const coveredNames = new Set(MEME_ENTRIES.map(([, jsWord]) => jsWord));
  let membersByInterface: ReadonlyMap<string, ReadonlySet<string>>;

  before(() => {
    membersByInterface = readInterfaceMembers();
  });

  it('кожна назва зі списку є ціллю словника', () => {
    const missing = [...DOM_NAMES].filter((name) => !coveredNames.has(name));

    assert.deepEqual(missing.sort(), []);
  });

  it('список має від 200 до 300 назв', () => {
    assert.ok(DOM_NAMES.size >= 200 && DOM_NAMES.size <= 300, String(DOM_NAMES.size));
  });

  it('кожен клас існує в lib.dom.d.ts', () => {
    const unknown = DOM_CLASS_NAMES.filter((name) => !membersByInterface.has(name));

    assert.deepEqual(unknown, []);
  });

  it('кожен член є в lib.dom.d.ts, не застарілий і не обробник on*', () => {
    const problems: string[] = [];

    for (const group of DOM_MEMBER_GROUPS) {
      for (const name of group.names) {
        const found = group.interfaces.some((interfaceName) =>
          membersByInterface.get(interfaceName)?.has(name),
        );

        if (!found || /^on[a-z]/.test(name)) {
          problems.push(`${group.description}: ${name}`);
        }
      }
    }

    assert.deepEqual(problems, []);
  });
});
