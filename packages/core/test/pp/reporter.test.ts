'use strict';

import { expect } from 'chai';
import 'mocha';
import { report } from '../../src/trace/reporter';

describe('Reporter', () => {
  it('class exists', () => {
    // tslint:disable:no-unused-expression
    expect(report).to.not.be.undefined;
  });
});
