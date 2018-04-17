'use strict';

import 'mocha';
import { expect } from 'chai';
import { Reporter } from '../src/cli/reporter';

describe('Reporter', () => {
  it('class exists', () => {
    expect(Reporter).to.not.be.undefined;
  });
});
