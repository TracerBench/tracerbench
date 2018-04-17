'use strict';

import { expect } from 'chai';
import 'mocha';
import Trace from '../src/trace/trace';

describe('Trace', () => {
  it('class exists', () => {
    expect(Trace).to.not.be.undefined;
  });
});
