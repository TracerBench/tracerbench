'use strict';

import 'mocha';
import { expect } from 'chai';
import CommandLine from '../src/cli/cli';

describe('CommandLine', () => {
  it('class exists in module', () => {
    expect(CommandLine).to.not.be.undefined;
  });
});
