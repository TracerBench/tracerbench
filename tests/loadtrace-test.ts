'use strict';

import { expect } from 'chai';
import 'mocha';
import { loadTrace } from '../src';

describe('loadTrace', () => {
  it('function exists', () => {
    expect(loadTrace).to.not.be.undefined;
  });
});
