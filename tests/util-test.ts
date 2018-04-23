import { expect } from 'chai';
import 'mocha';
import { methodsFromCategories } from '../src/cli/utils';

describe('methodsFromCategories', () => {
  it('reduces categories map', () => {
    let methods = methodsFromCategories({
      object: ['create', 'init'],
      reference: ['compute', 'dirty'],
    });

    methods.sort();

    expect(methods).to.deep.equal([
      'compute',
      'create',
      'dirty',
      'init',
    ]);
  });
});
