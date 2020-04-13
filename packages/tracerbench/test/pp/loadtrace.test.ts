'use strict';

import { expect } from 'chai';
import 'mocha';
import { loadTrace } from '../../src/trace/load-trace';

describe('loadTrace', () => {
  it('function exists', () => {
    expect(loadTrace).to.not.be.undefined;
  });
});
