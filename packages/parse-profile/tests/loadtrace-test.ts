'use strict';

import 'mocha';
import { expect } from 'chai';
import { loadTrace } from '../src';

describe('loadTrace', () => {
  it('function exists', () => {
    expect(loadTrace).to.not.be.undefined;
  });
});
