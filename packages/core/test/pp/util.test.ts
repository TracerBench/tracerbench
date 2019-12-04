import { expect } from 'chai';
import 'mocha';
import { methodsFromCategories } from '../../src/trace/utils';
import { LocatorGenerator } from './generators';

describe('methodsFromCategories', () => {
  it('reduces categories map', () => {
    const generator = new LocatorGenerator();
    const objectLocators = generator.generate([
      ['create', '.*'],
      ['init', '.*']
    ]);
    const referenceLocators = generator.generate([
      ['compute', '.*'],
      ['dirty', '.*']
    ]);
    const methods = methodsFromCategories({
      object: objectLocators,
      reference: referenceLocators
    });

    methods.sort();

    expect(methods).to.deep.equal([...objectLocators, ...referenceLocators]);
  });
});
