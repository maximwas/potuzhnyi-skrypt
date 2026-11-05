import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { BuildConfigLoader, CONFIG_FILE_NAME } from '../../src/build/build-config-loader.ts';
import { BuildError } from '../../src/build/build-error.ts';

function loadFrom(json: string, projectPath = '/проєкт') {
  const requestedPaths: string[] = [];
  const loader = new BuildConfigLoader({
    readTextFile: (filePath) => {
      requestedPaths.push(filePath);

      return json;
    },
  });

  return { config: loader.load(projectPath), requestedPaths };
}

function assertRejects(json: string, expectedMessage: RegExp): void {
  assert.throws(
    () => loadFrom(json),
    (error) => {
      assert.ok(error instanceof BuildError);
      assert.match(error.message, expectedMessage);

      return true;
    },
  );
}

describe('BuildConfigLoader', () => {
  it('порожній конфіг дає типові значення: уся тека, dist, карти джерел', () => {
    const { config } = loadFrom('{}');

    assert.deepEqual(config, {
      configPath: `/проєкт/${CONFIG_FILE_NAME}`,
      projectDir: '/проєкт',
      outDir: '/проєкт/dist',
      sourceMap: true,
      bundle: false,
      include: ['.'],
      rootDir: undefined,
    });
  });

  it('шляхи в конфігу рахує від теки з конфігом', () => {
    const { config } = loadFrom(
      '{ "include": ["src", "лишнє/*.potuzhno"], "rootDir": "src", "outDir": "збірка", "sourceMap": false }',
    );

    assert.deepEqual(config, {
      configPath: `/проєкт/${CONFIG_FILE_NAME}`,
      projectDir: '/проєкт',
      outDir: '/проєкт/збірка',
      sourceMap: false,
      bundle: false,
      include: ['src', 'лишнє/*.potuzhno'],
      rootDir: '/проєкт/src',
    });
  });

  it('приймає і теку, і шлях до самого файлу конфігу', () => {
    assert.deepEqual(loadFrom('{}', '/проєкт').requestedPaths, [`/проєкт/${CONFIG_FILE_NAME}`]);
    assert.deepEqual(loadFrom('{}', '/проєкт/мій.json').requestedPaths, ['/проєкт/мій.json']);
    assert.equal(loadFrom('{}', '/проєкт/мій.json').config.projectDir, '/проєкт');
  });

  it('bundle: назва вихідного файлу типово збігається з назвою entry', () => {
    const { config } = loadFrom('{ "bundle": true, "entry": "src/головна.potuzhno" }');

    assert.equal(config.bundle, true);
    assert.equal(config.bundle && config.entry, '/проєкт/src/головна.potuzhno');
    assert.equal(config.bundle && config.outFile, 'головна.mjs');
  });

  it('bundle: outFile можна задати', () => {
    const { config } = loadFrom('{ "bundle": true, "entry": "а.potuzhno", "outFile": "прога.js" }');

    assert.equal(config.bundle && config.outFile, 'прога.js');
  });

  it('помилка, коли конфігу немає', () => {
    const loader = new BuildConfigLoader({
      readTextFile: () => {
        throw new Error('ENOENT');
      },
    });

    assert.throws(() => loader.load('/проєкт'), /Не знайшов \/проєкт\/потужнийконфіг\.json/);
  });

  it('помилка на зламаному JSON і на не-обʼєкті', () => {
    assertRejects('{ include: ', /це не JSON/);
    assertRejects('[]', /очікую обʼєкт/);
    assertRejects('null', /очікую обʼєкт/);
  });

  it('помилка на невідомому параметрі, щоб одруківка не мовчала', () => {
    assertRejects('{ "outdir": "збірка" }', /невідомий параметр «outdir»/);
  });

  it('помилка на параметрі не того типу', () => {
    assertRejects('{ "outDir": 5 }', /«outDir» має бути непорожнім рядком/);
    assertRejects('{ "sourceMap": "так" }', /«sourceMap» має бути true або false/);
    assertRejects('{ "include": "src" }', /«include» має бути непорожнім списком рядків/);
    assertRejects('{ "include": [] }', /«include» має бути непорожнім списком рядків/);
  });

  it('помилка, коли параметри двох режимів змішані', () => {
    assertRejects('{ "bundle": true }', /потрібен "entry"/);

    assertRejects(
      '{ "bundle": true, "entry": "а.potuzhno", "include": ["src"] }',
      /«include» не працює/,
    );

    assertRejects('{ "entry": "а.potuzhno" }', /«entry» не працює/);
  });
});
