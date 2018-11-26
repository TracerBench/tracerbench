'use strict';

import { expect } from 'chai';
import 'mocha';
import {
  aggregate,
  Aggregations,
} from '../src/cli/aggregator';
import { Archive } from '../src/cli/archive_trace';
import { CpuProfile } from '../src/index';
import { AggregationGenerator, ArchiveGenerator, ProfileGenerator } from './generators';

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
  it('aggregates by module names correctly', () => {
    let aggregations: Aggregations;
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

    let e = generator.append(root, 25, {functionName: 'd'});
    generator.append(e, 15, {functionName: 'e'});

    generator.append(root, 10, {
      functionName: 'c',
      lineNumber: 4,
      columnNumber: 2,
      scriptId: 1,
      url: 'https://www.example.com/a.js',
    });

    let json = generator.end();

    let profile = new CpuProfile(json, -1, -1);
    aggregations = aggregate(profile.hierarchy, archive);

    expect(aggregations['module/1'].attributed).to.equal(150); // a's self 100 + b's self 50
    expect(aggregations['module/1'].total).to.equal(275); // a's total 225 + b's total 50

    expect(aggregations['module/2'].attributed).to.equal(85); // c1's 75 + c2's 10
    expect(aggregations['module/2'].total).to.equal(85);

    expect(aggregations.unknown.total).to.equal(40); // d's 25 + e's 15
    expect(aggregations.unknown.attributed).to.equal(40);
  });
});
