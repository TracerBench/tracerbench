'use strict';

import { expect } from 'chai';
import 'mocha';
import {
  aggregate,
  Aggregations,
  categorizeAggregations,
  collapseCallSites,
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

    expect(aggregations.c.total).to.equal(0); // contained by a
    expect(aggregations.c.containers.a.message).to.equal(`Contained by "a"`);
    expect(aggregations.c.containers.a.time).to.equal(75);
    expect(Object.keys(aggregations.c.containees).length).to.equal(0);

    expect(aggregations.a.total).to.equal(225);
    expect(aggregations.a.containees.c.message).to.equal(`Contains "c"`);
    expect(aggregations.a.containees.c.time).to.equal(75);
    expect(Object.keys(aggregations.a.containers).length).to.equal(0);

    expect(aggregations.d.total).to.equal(100);
    expect(Object.keys(aggregations.d.containers).length).to.equal(0);
    expect(Object.keys(aggregations.d.containees).length).to.equal(0);

    expect(aggregations.f.total).to.equal(15);
    expect(Object.keys(aggregations.f.containers).length).to.equal(0);
    expect(Object.keys(aggregations.f.containees).length).to.equal(0);
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

    expect(aggregations.c.total).to.equal(10);
    expect(aggregations.a.containees.c.message).to.equal(`Contains "c"`);
    expect(aggregations.a.containees.c.time).to.equal(75);
    expect(aggregations.a.total).to.equal(225);
    expect(aggregations.d.total).to.equal(100);
    expect(aggregations.f.total).to.equal(15);
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

describe('collapseCallSites', () => {
  it('removes duplicate callsites and aggregates time', () => {
    let generator = new AggregationGenerator();
    let agg1 = generator.aggregation('a');
    let agg2 = generator.aggregation('b');

    generator.callsites(agg1, 10, (i) => {
      let line = i % 2 ? 100 : 200;
      let col = i % 2 ? 1 : 2;
      return { line, col };
    });

    generator.callsites(agg2, 20, (i) => {
      let line = i > 10 ? 2 : 1;
      return { line, col: 2 };
    });

    let aggregation = generator.commit();

    expect(aggregation.a.callsites.length).to.eql(10);
    expect(aggregation.a.total).to.eql(45);
    expect(aggregation.b.callsites.length).to.eql(20);
    expect(aggregation.b.total).to.eql(190);

    let collapsed = collapseCallSites(aggregation);
    expect(collapsed.a.callsites.length).to.eql(2);
    let t1 = collapsed.a.callsites.reduce((acc, cur) => {
      return acc += cur.time;
    }, 0);
    expect(t1).to.equal(collapsed.a.total);

    expect(collapsed.b.callsites.length).to.eql(2);
    let t2 = collapsed.b.callsites.reduce((acc, cur) => {
      return acc += cur.time;
    }, 0);
    expect(t2).to.equal(collapsed.b.total);
  });
});
