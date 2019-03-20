'use strict';

import { expect } from 'chai';
import 'mocha';
import { analyze } from '../src/cli/analyze';

describe('analyze', () => {
  it('function exists', () => {
    // tslint:disable:no-unused-expression
    expect(analyze).to.not.be.undefined;
  });
});
