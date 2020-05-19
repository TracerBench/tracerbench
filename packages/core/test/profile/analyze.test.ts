'use strict';

import { expect } from 'chai';
import 'mocha';
import { analyze } from '../../src/profile/analyze';

describe('analyze', () => {
  it('function exists', () => {
    expect(analyze).to.not.be.undefined;
  });
});
