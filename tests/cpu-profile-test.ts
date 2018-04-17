'use strict';

import 'mocha';
import { expect } from 'chai';
import CpuProfile from '../src/trace/cpuprofile';

describe('CpuProfile', () => {
  it('class exists', () => {
    expect(CpuProfile).to.not.be.undefined;
  });
});
