'use strict';

import { expect } from 'chai';
import 'mocha';
import { Reporter } from '../src/cli/reporter';

describe('Reporter', () => {
  it('class exists', () => {
    expect(Reporter).to.not.be.undefined;
  });
});
