'use strict';

import { expect } from 'chai';
import 'mocha';
import {
  aggregate,
  Aggregations,
  categorizeAggregations,
  verifyMethods,
} from '../src/cli/aggregator';
import { CpuProfile } from '../src/index';
import { AggregationGenerator, ProfileGenerator } from './generators';

describe('aggregate', () => {
  it('aggregates subset of the hierarchy', () => {
    let generator = new ProfileGenerator();
    let root = generator.start();

    let a = generator.append(root, 'a', 100);
    generator.append(a, 'b', 50);
    generator.append(a, 'c', 75);

    let d = generator.append(root, 'd', 100);
    let e = generator.append(root, 'e', 25);
    generator.append(e, 'f', 15);

    let json = generator.end();

    let profile = new CpuProfile(json, -1, -1);
    let aggregations = aggregate(profile.hierarchy, ['a', 'c', 'd', 'f']);

    expect(aggregations.a.total).to.equal(225);
    expect(aggregations.a.attributed).to.equal(150);

    expect(aggregations.c.total).to.equal(75);
    expect(aggregations.c.attributed).to.equal(75);

    expect(aggregations.d.total).to.equal(100);
    expect(aggregations.d.attributed).to.equal(100);

    expect(aggregations.f.total).to.equal(15);
    expect(aggregations.f.attributed).to.equal(15);

    expect(aggregations.unknown.total).to.equal(25); // e
    expect(aggregations.unknown.attributed).to.equal(25); // e
  });

  it('aggregates subset of the hierarchy with multiple call sites', () => {
    let generator = new ProfileGenerator();
    let root = generator.start();

    let a = generator.append(root, 'a', 100);
    generator.append(a, 'b', 50);
    generator.append(a, 'c', 75);

    let d = generator.append(root, 'd', 100);
    let e = generator.append(root, 'e', 25);
    generator.append(e, 'f', 15);

    generator.append(root, 'c', 10);

    let json = generator.end();

    let profile = new CpuProfile(json, -1, -1);
    let aggregations = aggregate(profile.hierarchy, ['a', 'c', 'd', 'f']);

    expect(aggregations.a.total).to.equal(225);
    expect(aggregations.a.attributed).to.equal(150);

    expect(aggregations.c.total).to.equal(85);
    expect(aggregations.c.attributed).to.equal(85);

    expect(aggregations.d.total).to.equal(100);
    expect(aggregations.d.attributed).to.equal(100);

    expect(aggregations.f.total).to.equal(15);
    expect(aggregations.f.attributed).to.equal(15);

    expect(aggregations.unknown.total).to.equal(25); // e
    expect(aggregations.unknown.attributed).to.equal(25); // e
  });
});

describe('categorizeAggregations', () => {
  let aggregations: Aggregations;
  beforeEach(() => {
    let generator = new ProfileGenerator();
    let root = generator.start();

    let a = generator.append(root, 'a', 100);
    generator.append(a, 'b', 50);
    generator.append(a, 'c', 75);

    let d = generator.append(root, 'd', 100);
    let e = generator.append(root, 'e', 25);
    generator.append(e, 'f', 15);

    generator.append(root, 'c', 10);

    let json = generator.end();

    let profile = new CpuProfile(json, -1, -1);
    aggregations = aggregate(profile.hierarchy, ['a', 'c', 'd', 'f']);
  });

  it('creates a categorized map', () => {
    let categorized = categorizeAggregations(aggregations, { cat1: ['a', 'c'], cat2: ['d'], cat3: ['f'] });

    expect(categorized.cat1.length).to.equal(2);
    expect(categorized.cat2.length).to.equal(1);
    expect(categorized.cat3.length).to.equal(1);

    expect(categorized.cat1.map(a => a.name).sort()).to.deep.equal(['a', 'c']);
    expect(categorized.cat2[0].name).to.deep.equal('d');
    expect(categorized.cat3[0].name).to.deep.equal('f');
  });
});

describe('verifyMethods', () => {
  it('should throw if there are duplicates', () => {
    // tslint:disable:no-unused-expression
    expect(() => verifyMethods(['a', 'b', 'c', 'c'])).to.throw;
  });

  it('should not throw if there are no duplicates', () => {
    // tslint:disable:no-unused-expression
    expect(() => verifyMethods(['a', 'b', 'c', 'd'])).to.not.throw;
  });
});
