import { expect } from 'chai';
import 'mocha';
import { methodsFromCategories } from '../src/cli/utils';
import { LocatorGenerator } from './generators';

describe('methodsFromCategories', () => {
  it('reduces categories map', () => {
    let generator = new LocatorGenerator();
    let objectLocators = generator.generate(['create', 'init']);
    let referenceLocators = generator.generate(['compute', 'dirty']);
    let methods = methodsFromCategories({
      object: objectLocators,
      reference: referenceLocators,
    });

    methods.sort();

    expect(methods).to.deep.equal([
      ...objectLocators,
      ...referenceLocators,
    ]);
  });
});
