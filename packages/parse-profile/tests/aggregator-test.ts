'use strict';

import { expect } from 'chai';
import 'mocha';
import { aggregate, Aggregations, categorizeAggregations } from '../src/cli/aggregator';
import { CpuProfile } from '../src/index';
import { ProfileGenerator } from './profile-generator';

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

describe('toCategories', () => {
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
