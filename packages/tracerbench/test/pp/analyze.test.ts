'use strict';

import { expect } from 'chai';
import 'mocha';
import { analyze } from '../../src/trace/analyze';

describe('analyze', () => {
  it('function exists', () => {
    expect(analyze).to.not.be.undefined;
  });
});
