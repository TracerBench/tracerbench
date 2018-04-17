'use strict';

import 'mocha';
import { expect } from 'chai';
import { Aggregator } from '../src/cli/aggregator';

describe('Aggregator', () => {
  it('class exists in module', () => {
    expect(Aggregator).to.not.be.undefined;
  });
});
