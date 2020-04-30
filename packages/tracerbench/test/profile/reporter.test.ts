'use strict';

import { expect } from 'chai';
import 'mocha';
import reporter from '../../src/profile/reporter';

describe('Reporter', () => {
  it('class exists', () => {
    expect(reporter).to.not.be.undefined;
  });
});
