'use strict';

import { expect } from 'chai';
import 'mocha';
import reporter from '../../src/trace/reporter';

describe('Reporter', () => {
  it('class exists', () => {
    expect(reporter).to.not.be.undefined;
  });
});
