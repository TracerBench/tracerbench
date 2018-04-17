'use strict';

import 'mocha';
import { expect } from 'chai';
import Trace from '../src/trace/trace';

describe('Trace', () => {
  it('class exists', () => {
    expect(Trace).to.not.be.undefined;
  });
});
