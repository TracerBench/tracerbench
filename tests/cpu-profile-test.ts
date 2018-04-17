'use strict';

import { expect } from 'chai';
import 'mocha';
import CpuProfile from '../src/trace/cpuprofile';

describe('CpuProfile', () => {
  it('class exists', () => {
    expect(CpuProfile).to.not.be.undefined;
  });
});
