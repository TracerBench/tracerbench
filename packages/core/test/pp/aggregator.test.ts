import { expect } from 'chai';
import 'mocha';
import { Archive } from '@tracerbench/har';

import CpuProfile from '../../src/trace/cpu-profile';
import {
  aggregate,
  IAggregations,
  categorizeAggregations,
  verifyMethods,
} from '../../src/trace/aggregator';
import { ModuleMatcher } from '../../src/trace/module_matcher';
import { addRemainingModules } from '../../src/trace/utils';
import { TRACE_EVENT_NAME } from '../../src/trace/trace_event';

import {
  ArchiveGenerator,
  LocatorGenerator,
  ProfileGenerator,
} from './generators';

describe('aggregate', () => {
  let archive: Archive;
  beforeEach(() => {
    const content = `
      define("module/1",["exports"],function(e) {
        function barbar() {return 'bar';}
      });
      define("module/2",["exports"],function(e) {
        function barbar1() {return 'bar';}
      });
    `;
    archive = new ArchiveGenerator().generate(content);
  });
  it('aggregates subset of the hierarchy (function heuristics)', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, { functionName: 'a' });
    generator.tick(100);
    generator.appendNode(a, { functionName: 'b' });
    generator.tick(50);
    generator.appendNode(a, { functionName: 'c' });
    generator.tick(75);
    generator.appendNode(root, { functionName: 'd' });
    generator.tick(25);
    const e = generator.appendNode(root, { functionName: 'e' });
    generator.tick(25);
    generator.appendNode(e, { functionName: 'f' });
    generator.tick(15);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);
    const json = generator.end();

    // What the call stack looks like
    // 0    100  200  250  325  350  375  390
    // v8-s r    r    r    r    r    r    v8-e
    // v8-s a    a    a    d    e    e    v8-e
    // v8-s      b    c              f    v8-e

    const profile = new CpuProfile(json, generator.events, -1, -1);
    const locators = new LocatorGenerator().generate([
      ['a', '.*'],
      ['c', '.*'],
      ['d', '.*'],
      ['f', '.*'],
    ]);
    const modMatcher = new ModuleMatcher(profile.hierarchy, archive);
    const aggregations = aggregate(
      profile.hierarchy,
      locators,
      archive,
      modMatcher
    );

    expect(aggregations['a.*'].total).to.equal(225);
    expect(aggregations['a.*'].attributed).to.equal(150);

    expect(aggregations['c.*'].total).to.equal(75);
    expect(aggregations['c.*'].attributed).to.equal(75);

    expect(aggregations['d.*'].total).to.equal(25);
    expect(aggregations['d.*'].attributed).to.equal(25);

    expect(aggregations['f.*'].total).to.equal(15);
    expect(aggregations['f.*'].attributed).to.equal(15);

    expect(aggregations.unknown.total).to.equal(25); // e
    expect(aggregations.unknown.attributed).to.equal(25); // e
  });

  it('aggregates subset of the hierarchy with multiple call sites (function heuristics)', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, { functionName: 'a' });
    generator.tick(100);
    generator.appendNode(a, { functionName: 'b' });
    generator.tick(50);
    generator.appendNode(a, { functionName: 'c' });
    generator.tick(75);
    generator.appendNode(root, { functionName: 'd' });
    generator.tick(25);
    const e = generator.appendNode(root, { functionName: 'e' });
    generator.tick(25);
    generator.appendNode(e, { functionName: 'f' });
    generator.tick(15);
    generator.appendNode(root, { functionName: 'c' });
    generator.tick(10);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);
    const json = generator.end();

    const profile = new CpuProfile(json, generator.events, -1, -1);
    const locators = new LocatorGenerator().generate([
      ['a', '.*'],
      ['c', '.*'],
      ['d', '.*'],
      ['f', '.*'],
    ]);
    const modMatcher = new ModuleMatcher(profile.hierarchy, archive);
    const aggregations = aggregate(
      profile.hierarchy,
      locators,
      archive,
      modMatcher
    );

    expect(aggregations['a.*'].total).to.equal(225);
    expect(aggregations['a.*'].attributed).to.equal(150);

    expect(aggregations['c.*'].total).to.equal(85);
    expect(aggregations['c.*'].attributed).to.equal(85);

    expect(aggregations['d.*'].total).to.equal(25);
    expect(aggregations['d.*'].attributed).to.equal(25);

    expect(aggregations['f.*'].total).to.equal(15);
    expect(aggregations['f.*'].attributed).to.equal(15);

    expect(aggregations.unknown.total).to.equal(25); // e
    expect(aggregations.unknown.attributed).to.equal(25); // e
  });

  it('aggregates at a module level with module heuristics', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, {
      functionName: 'a',
      lineNumber: 1,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(100);
    generator.appendNode(a, {
      functionName: 'b',
      lineNumber: 1,
      columnNumber: 6,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(50);
    generator.appendNode(a, {
      functionName: 'c',
      lineNumber: 4,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(75);
    generator.appendNode(root, { functionName: 'd' });
    generator.tick(25);
    generator.appendNode(root, { functionName: 'e' });
    generator.tick(25);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);
    const json = generator.end();

    const locators = new LocatorGenerator().generate([
      ['.*', 'module/1'],
      ['.*', 'module/2'],
    ]);

    const profile = new CpuProfile(json, generator.events, -1, -1);
    const modMatcher = new ModuleMatcher(profile.hierarchy, archive);
    const aggregations = aggregate(
      profile.hierarchy,
      locators,
      archive,
      modMatcher
    );

    expect(aggregations['.*module/1'].attributed).to.equal(150); // a(100) + b(50)
    expect(aggregations['.*module/1'].total).to.equal(275); // a(100) + b(50) + b(50) + c(75)

    expect(aggregations['.*module/2'].attributed).to.equal(75); // c(75)
    expect(aggregations['.*module/2'].total).to.equal(75); // c(75)

    expect(aggregations.unknown.total).to.equal(50); // d(25) + e(25)
    expect(aggregations.unknown.attributed).to.equal(50); // d(25) + e(25)
  });

  it('aggregates at a module level with explicit and implicit locators', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, {
      functionName: 'a',
      lineNumber: 1,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(100);
    generator.appendNode(a, {
      functionName: 'b',
      lineNumber: 1,
      columnNumber: 6,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(50);
    generator.appendNode(a, {
      functionName: 'c',
      lineNumber: 4,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(75);
    generator.appendNode(root, { functionName: 'd' });
    generator.tick(25);
    generator.appendNode(root, { functionName: 'e' });
    generator.tick(25);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);
    const json = generator.end();

    const locators = new LocatorGenerator().generate([['.*', 'module/1']]); // module/2 is implicit

    const profile = new CpuProfile(json, generator.events, -1, -1);

    const modMatcher = new ModuleMatcher(profile.hierarchy, archive);
    addRemainingModules(locators, {}, modMatcher); // this should add module/2
    const aggregations = aggregate(
      profile.hierarchy,
      locators,
      archive,
      modMatcher
    );

    expect(aggregations['.*module/1'].attributed).to.equal(150); // a(100) + b(50)
    expect(aggregations['.*module/1'].total).to.equal(275); // a(100) + b(50) + b(50) + c(75)

    expect(aggregations['.*module/2'].attributed).to.equal(75); // c(75)
    expect(aggregations['.*module/2'].total).to.equal(75); // c(75)

    expect(aggregations.unknown.total).to.equal(50); // d(25) + e(25)
    expect(aggregations.unknown.attributed).to.equal(50); // d(25) + e(25)
  });

  it('aggregates with method name heuristics trumping automatic module heuristics', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, {
      functionName: 'a',
      lineNumber: 1,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(100);
    generator.appendNode(a, {
      functionName: 'b',
      lineNumber: 1,
      columnNumber: 6,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(50);
    generator.appendNode(a, {
      functionName: 'c',
      lineNumber: 4,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(75);
    generator.appendNode(root, { functionName: 'd' });
    generator.tick(25);
    generator.appendNode(root, { functionName: 'e' });
    generator.tick(25);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);
    const json = generator.end();

    const locators = new LocatorGenerator().generate([['a', '.*']]); // this will steal time from module/1

    const profile = new CpuProfile(json, generator.events, -1, -1);

    const modMatcher = new ModuleMatcher(profile.hierarchy, archive); // this should add module/1 & 2
    addRemainingModules(locators, {}, modMatcher);
    const aggregations = aggregate(
      profile.hierarchy,
      locators,
      archive,
      modMatcher
    );

    expect(aggregations['a.*'].attributed).to.equal(100); // a(100)
    expect(aggregations['a.*'].total).to.equal(225); // a(100) + b(50) + c(75)

    expect(aggregations['.*module/1'].attributed).to.equal(50); // b(50)
    expect(aggregations['.*module/1'].total).to.equal(50); // b(50)

    expect(aggregations['.*module/2'].attributed).to.equal(75); // c(75)
    expect(aggregations['.*module/2'].total).to.equal(75); // c(75)

    expect(aggregations.unknown.total).to.equal(50); // d(25) + e(25)
    expect(aggregations.unknown.attributed).to.equal(50); // d(25) + e(25)
  });

  it('aggregates correctly with render-event-split function slices', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, {
      functionName: 'a',
      lineNumber: 1,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(100);
    generator.appendNode(a, {
      functionName: 'b',
      lineNumber: 1,
      columnNumber: 6,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(25);
    generator.appendRenderEvent(
      '<pillar@component:addond@addon::ember1> (Rendering: update)',
      50
    );
    generator.tick(25);
    generator.appendNode(a, {
      functionName: 'c',
      lineNumber: 4,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.tick(75);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);
    const json = generator.end();

    const locators = new LocatorGenerator().generate([
      ['.*', 'module/1'],
      ['.*', 'module/2'],
    ]);

    const profile = new CpuProfile(json, generator.events, -1, -1);
    const modMatcher = new ModuleMatcher(profile.hierarchy, archive);
    const aggregations = aggregate(
      profile.hierarchy,
      locators,
      archive,
      modMatcher
    );

    expect(aggregations['.*module/1'].attributed).to.equal(150); // a(100) + b(25) + b'(25)
    expect(aggregations['.*module/1'].total).to.equal(275); // a(100) + b(25) + b(25) + b'(25) + b'(25) + c(50) + c'(25)

    expect(aggregations['.*module/2'].attributed).to.equal(75); // c(50) + c'(25)
    expect(aggregations['.*module/2'].total).to.equal(75); // c(50) + c'(25)
  });
});

describe('categorizeAggregations', () => {
  let aggregations: IAggregations;
  let archive: Archive;
  beforeEach(() => {
    archive = new ArchiveGenerator().generate();
  });
  beforeEach(() => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, { functionName: 'a' });
    generator.tick(100);
    generator.appendNode(a, { functionName: 'b' });
    generator.tick(50);
    generator.appendNode(a, { functionName: 'c' });
    generator.tick(75);
    generator.appendNode(root, { functionName: 'd' });
    generator.tick(25);
    const e = generator.appendNode(root, { functionName: 'e' });
    generator.tick(25);
    generator.appendNode(e, { functionName: 'f' });
    generator.tick(15);
    generator.appendNode(root, { functionName: 'c' });
    generator.tick(10);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);

    const json = generator.end();

    const profile = new CpuProfile(json, generator.events, -1, -1);
    const locators = new LocatorGenerator().generate([
      ['a', '.*'],
      ['c', '.*'],
      ['d', '.*'],
      ['f', '.*'],
    ]);
    const modMatcher = new ModuleMatcher(profile.hierarchy, archive);
    aggregations = aggregate(profile.hierarchy, locators, archive, modMatcher);
  });

  it('creates a categorized map', () => {
    const generator = new LocatorGenerator();
    const cat1Locators = generator.generate([['a', '.*'], ['c', '.*']]);
    const cat2Locators = generator.generate([['d', '.*']]);
    const cat3Locators = generator.generate([['f', '.*']]);
    const categorized = categorizeAggregations(aggregations, {
      cat1: cat1Locators,
      cat2: cat2Locators,
      cat3: cat3Locators,
    });

    expect(categorized.cat1.length).to.equal(2);
    expect(categorized.cat2.length).to.equal(1);
    expect(categorized.cat3.length).to.equal(1);

    expect(categorized.cat1.map(a => a.functionName).sort()).to.deep.equal([
      'a',
      'c',
    ]);
    expect(categorized.cat2[0].functionName).to.deep.equal('d');
    expect(categorized.cat3[0].functionName).to.deep.equal('f');
  });
});

describe('verifyMethods', () => {
  it('should throw if there are duplicates', () => {
    // tslint:disable:no-unused-expression
    const locators = new LocatorGenerator().generate([
      ['a', '.*'],
      ['c', '.*'],
    ]);
    expect(() => verifyMethods(locators)).to.throw;
  });

  it('should not throw if there are no duplicates', () => {
    // tslint:disable:no-unused-expression
    const locators = new LocatorGenerator().generate([
      ['a', '.*'],
      ['c', '.*'],
      ['d', '.*'],
    ]);
    expect(() => verifyMethods(locators)).to.not.throw;
  });
});
