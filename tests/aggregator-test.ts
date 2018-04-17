'use strict';

import { expect } from 'chai';
import 'mocha';
import { Aggregator, compute } from '../src/cli/aggregator';
import { CpuProfile } from '../src/index';
import { ProfileGenerator } from './profile-generator';

describe('compute', () => {
  it('a subset of the hierarchy', () => {
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
    let result = compute(profile.hierarchy, ['a', 'c', 'd', 'f']);

    expect(result.c.total).to.equal(0); // contained by a
    expect(result.a.total).to.equal(225);
    expect(result.d.total).to.equal(100);
    expect(result.f.total).to.equal(15);
  });

  it('a subset of the hierarchy with multiple call sites', () => {
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
    let result = compute(profile.hierarchy, ['a', 'c', 'd', 'f']);

    expect(result.c.total).to.equal(10);
    expect(result.a.total).to.equal(225);
    expect(result.d.total).to.equal(100);
    expect(result.f.total).to.equal(15);
  });
});
