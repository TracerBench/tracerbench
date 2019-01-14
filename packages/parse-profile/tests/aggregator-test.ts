'use strict';

import { expect } from 'chai';
import 'mocha';
import {
  aggregate,
  Aggregations,
  categorizeAggregations,
  verifyMethods,
} from '../src/cli/aggregator';
import { Archive } from '../src/cli/archive_trace';
import { ModuleMatcher } from '../src/cli/module_matcher';
import { addRemainingModules } from '../src/cli/utils';
import { CpuProfile } from '../src/index';
import { ArchiveGenerator, LocatorGenerator, ProfileGenerator } from './generators';

describe('aggregate', () => {
  let archive: Archive;
  beforeEach(() => {
    let content = `
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
    let generator = new ProfileGenerator();
    let root = generator.start();

    let a = generator.append(root, 100, {functionName: 'a'});
    generator.append(a, 50, {functionName: 'b'});
    generator.append(a, 75, {functionName: 'c'});
    generator.append(root, 100, {functionName: 'd'});
    let e = generator.append(root, 25, {functionName: 'e'});
    generator.append(e, 15, {functionName: 'f'});
    let json = generator.end();

    let profile = new CpuProfile(json, -1, -1);
    let locators = new LocatorGenerator().generate([['a', '.*'], ['c', '.*'], ['d', '.*'], ['f', '.*']]);
    let modMatcher = new ModuleMatcher(profile.hierarchy, archive);
    let aggregations = aggregate(profile.hierarchy, locators, archive, modMatcher);

    expect(aggregations['a.*'].total).to.equal(225);
    expect(aggregations['a.*'].attributed).to.equal(150);

    expect(aggregations['c.*'].total).to.equal(75);
    expect(aggregations['c.*'].attributed).to.equal(75);

    expect(aggregations['d.*'].total).to.equal(100);
    expect(aggregations['d.*'].attributed).to.equal(100);

    expect(aggregations['f.*'].total).to.equal(15);
    expect(aggregations['f.*'].attributed).to.equal(15);

    expect(aggregations.unknown.total).to.equal(25); // e
    expect(aggregations.unknown.attributed).to.equal(25); // e
  });

  it('aggregates subset of the hierarchy with multiple call sites (function heuristics)', () => {
    let generator = new ProfileGenerator();
    let root = generator.start();

    let a = generator.append(root, 100, {functionName: 'a'});
    generator.append(a, 50, {functionName: 'b'});
    generator.append(a, 75, {functionName: 'c'});
    generator.append(root, 100, {functionName: 'd'});
    let e = generator.append(root, 25, {functionName: 'e'});
    generator.append(e, 15, {functionName: 'f'});
    generator.append(root, 10, {functionName: 'c'});
    let json = generator.end();

    let profile = new CpuProfile(json, -1, -1);
    let locators = new LocatorGenerator().generate([['a', '.*'], ['c', '.*'], ['d', '.*'], ['f', '.*']]);
    let modMatcher = new ModuleMatcher(profile.hierarchy, archive);
    let aggregations = aggregate(profile.hierarchy, locators, archive, modMatcher);

    expect(aggregations['a.*'].total).to.equal(225);
    expect(aggregations['a.*'].attributed).to.equal(150);

    expect(aggregations['c.*'].total).to.equal(85);
    expect(aggregations['c.*'].attributed).to.equal(85);

    expect(aggregations['d.*'].total).to.equal(100);
    expect(aggregations['d.*'].attributed).to.equal(100);

    expect(aggregations['f.*'].total).to.equal(15);
    expect(aggregations['f.*'].attributed).to.equal(15);

    expect(aggregations.unknown.total).to.equal(25); // e
    expect(aggregations.unknown.attributed).to.equal(25); // e
  });

  it('aggregates at a module level with module heuristics', () => {
    let generator = new ProfileGenerator();
    let root = generator.start();
    let a = generator.append(root, 100, {
      functionName: 'a',
      lineNumber: 1,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.append(a, 50, {
      functionName: 'b',
      lineNumber: 1,
      columnNumber: 6,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.append(a, 75, {
      functionName: 'c',
      lineNumber: 4,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    let d = generator.append(root, 25, {functionName: 'd'});
    generator.append(d, 15, {functionName: 'e'});
    let json = generator.end();

    let locators = new LocatorGenerator().generate([['.*', 'module/1'], ['.*', 'module/2']]);

    let profile = new CpuProfile(json, -1, -1);
    let modMatcher = new ModuleMatcher(profile.hierarchy, archive);
    let aggregations = aggregate(profile.hierarchy, locators, archive, modMatcher);

    expect(aggregations['.*module/1'].attributed).to.equal(150); // a(100) + b(50)
    expect(aggregations['.*module/1'].total).to.equal(275); // a(100) + b(50) + b(50) + c(75)

    expect(aggregations['.*module/2'].attributed).to.equal(75); // c(75)
    expect(aggregations['.*module/2'].total).to.equal(75); // c(75)

    expect(aggregations.unknown.total).to.equal(40); // d(25) + e(15)
    expect(aggregations.unknown.attributed).to.equal(40); // d(25) + e(15)
  });

  it('aggregates at a module level with explicit and implicit locators', () => {
    let generator = new ProfileGenerator();
    let root = generator.start();
    let a = generator.append(root, 100, {
      functionName: 'a',
      lineNumber: 1,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.append(a, 50, {
      functionName: 'b',
      lineNumber: 1,
      columnNumber: 6,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.append(a, 75, {
      functionName: 'c',
      lineNumber: 4,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    let d = generator.append(root, 25, {functionName: 'd'});
    generator.append(d, 15, {functionName: 'e'});
    let json = generator.end();

    let locators = new LocatorGenerator().generate([['.*', 'module/1']]); // module/2 is implicit

    let profile = new CpuProfile(json, -1, -1);

    let modMatcher = new ModuleMatcher(profile.hierarchy, archive);
    addRemainingModules(profile.hierarchy, locators, {}, modMatcher); // this should add module/2
    let aggregations = aggregate(profile.hierarchy, locators, archive, modMatcher);

    expect(aggregations['.*module/1'].attributed).to.equal(150); // a(100) + b(50)
    expect(aggregations['.*module/1'].total).to.equal(275); // a(100) + b(50) + b(50) + c(75)

    expect(aggregations['.*module/2'].attributed).to.equal(75); // c(75)
    expect(aggregations['.*module/2'].total).to.equal(75); // c(75)

    expect(aggregations.unknown.total).to.equal(40); // d(25) + e(15)
    expect(aggregations.unknown.attributed).to.equal(40); // d(25) + e(15)
  });

  it('aggregates with method name heuristics trumping automatic module heuristics', () => {
    let generator = new ProfileGenerator();
    let root = generator.start();
    let a = generator.append(root, 100, {
      functionName: 'a',
      lineNumber: 1,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.append(a, 50, {
      functionName: 'b',
      lineNumber: 1,
      columnNumber: 6,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    generator.append(a, 75, {
      functionName: 'c',
      lineNumber: 4,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });
    let d = generator.append(root, 25, {functionName: 'd'});
    generator.append(d, 15, {functionName: 'e'});
    let json = generator.end();

    let locators = new LocatorGenerator().generate([['a', '.*']]); // this will steal time from module/1

    let profile = new CpuProfile(json, -1, -1);

    let modMatcher = new ModuleMatcher(profile.hierarchy, archive); // this should add module/1 & 2
    addRemainingModules(profile.hierarchy, locators, {}, modMatcher);
    let aggregations = aggregate(profile.hierarchy, locators, archive, modMatcher);

    expect(aggregations['a.*'].attributed).to.equal(100); // a(100)
    expect(aggregations['a.*'].total).to.equal(225); // a(100) + b(50) + c(75)

    expect(aggregations['.*module/1'].attributed).to.equal(50); // b(50)
    expect(aggregations['.*module/1'].total).to.equal(50); // b(50)

    expect(aggregations['.*module/2'].attributed).to.equal(75); // c(75)
    expect(aggregations['.*module/2'].total).to.equal(75); // c(75)

    expect(aggregations.unknown.total).to.equal(40); // d(25) + e(15)
    expect(aggregations.unknown.attributed).to.equal(40); // d(25) + e(15)
  });
});

describe('categorizeAggregations', () => {
  let aggregations: Aggregations;
  let archive: Archive;
  beforeEach(() => {
    archive = new ArchiveGenerator().generate();
  });
  beforeEach(() => {
    let generator = new ProfileGenerator();
    let root = generator.start();

    let a = generator.append(root, 100, {functionName: 'a'});
    generator.append(a, 50, {functionName: 'b'});
    generator.append(a, 75, {functionName: 'c'});

    let d = generator.append(root, 100, {functionName: 'd'});
    let e = generator.append(root, 25, {functionName: 'e'});
    generator.append(e, 15, {functionName: 'f'});

    generator.append(root, 10, {functionName: 'c'});

    let json = generator.end();

    let profile = new CpuProfile(json, -1, -1);
    let locators = new LocatorGenerator().generate([['a', '.*'], ['c', '.*'], ['d', '.*'], ['f', '.*']]);
    let modMatcher = new ModuleMatcher(profile.hierarchy, archive);
    aggregations = aggregate(profile.hierarchy, locators, archive, modMatcher);
  });

  it('creates a categorized map', () => {
    let generator = new LocatorGenerator();
    let cat1Locators = generator.generate([['a', '.*'], ['c', '.*']]);
    let cat2Locators = generator.generate([['d', '.*']]);
    let cat3Locators = generator.generate([['f', '.*']]);
    let categorized = categorizeAggregations(aggregations, {
      cat1: cat1Locators,
      cat2: cat2Locators,
      cat3: cat3Locators,
    });

    expect(categorized.cat1.length).to.equal(2);
    expect(categorized.cat2.length).to.equal(1);
    expect(categorized.cat3.length).to.equal(1);

    expect(categorized.cat1.map(a => a.functionName).sort()).to.deep.equal(['a', 'c']);
    expect(categorized.cat2[0].functionName).to.deep.equal('d');
    expect(categorized.cat3[0].functionName).to.deep.equal('f');
  });
});

describe('verifyMethods', () => {
  it('should throw if there are duplicates', () => {
    // tslint:disable:no-unused-expression
    let locators = new LocatorGenerator().generate([['a', '.*'], ['c', '.*']]);
    expect(() => verifyMethods(locators)).to.throw;
  });

  it('should not throw if there are no duplicates', () => {
    // tslint:disable:no-unused-expression
    let locators = new LocatorGenerator().generate([['a', '.*'], ['c', '.*'], ['d', '.*']]);
    expect(() => verifyMethods(locators)).to.not.throw;
  });
});
