'use strict';

import { expect } from 'chai';
import 'mocha';
import CommandLine from '../src/cli/cli';

describe('CommandLine', () => {
  it('class exists in module', () => {
    // tslint:disable:no-unused-expression
    expect(CommandLine).to.not.be.undefined;
  });
});
