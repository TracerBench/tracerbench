// tslint:disable:no-console

import * as fs from 'fs';
import * as path from 'path';
import { Trace } from '../trace';
import { ModuleMatcher } from './module_matcher';
import { Categories, Locator } from './utils';

export interface Categories {
  [key: string]: Locator[];
}

export interface Locator {
  functionName: string;
  functionNameRegex: RegExp;
  moduleName: string;
  moduleNameRegex: RegExp;
}

export function filterObjectByKeys(obj: any, keyArray: string[]) {
  let _obj = Object.assign({}, obj);
  let k = Object.keys(_obj);
  k.forEach(c => {
    if (!keyArray.includes(c)) {
      delete _obj[c];
    }
  });

  return _obj;
}

export function computeMinMax(trace: Trace, start: string = 'navigationStart', end: string) {
  let min;
  let max;
  if (end) {
    // TODO harden this to find the correct frame
    let startEvent = trace.events.find(e => e.name === start)!;
    let endEvent = trace.events.find(e => e.name === end);

    if (!endEvent) {
      throw new Error(`Could not find "${end}" marker in the trace.`);
    }

    min = startEvent.ts;
    max = endEvent.ts;
  } else {
    min = -1;
    max = -1;
  }

  return { min, max };
}

/**
 * This will add all module paths to locators/categories, except for those already matched by
 * user provided heuristic config entries which specify a non-".*" module name regex.
 */
export function addRemainingModules(
  locators: Locator[],
  categories: Categories,
  modMatcher: ModuleMatcher,
) {
  const allModules = modMatcher.getModuleList();
  categories['Auto Added Module Paths'] = [];
  allModules.forEach(moduleName => {
    // If the locator is going to match an entire module anyway, don't add that module to the auto
    // generated list of module aggergations.
    const found = locators.find(locator => {
      return locator.functionName === '.*' ? locator.moduleNameRegex.test(moduleName) : false;
    });
    if (!found) {
      const newLocator = {
        functionName: '.*',
        functionNameRegex: /.*/,
        moduleName,
        moduleNameRegex: new RegExp(`^${moduleName}$`),
      };
      locators.push(newLocator);
      categories['Auto Added Module Paths'].push(newLocator);
    }
  });
}

export function methodsFromCategories(categories: Categories) {
  return Object.keys(categories).reduce((accum: Locator[], category: string) => {
    accum.push(...categories[category]);
    return accum;
  }, []);
}

export function toRegex(locators: Locator[]) {
  return locators.map(({ functionName }) => {
    if (functionName === '*') {
      return /.*/;
    }
    let parts = functionName.split('.'); // Path expression
    if (parts.length > 1) {
      parts.shift();
      return new RegExp(`^([A-z]+\\.${parts.join('\\.')})$`);
    }
    return new RegExp(`^${functionName}$`);
  });
}

export function formatCategories(report: string | undefined, methods: string[]) {
  if (report) {
    let stats = fs.statSync(report);
    let _categories: Categories = {};

    if (stats.isDirectory()) {
      let files = fs.readdirSync(report);

      files.map(file => {
        let name = path.basename(file).replace('.json', '');
        // tslint:disable-next-line:no-shadowed-variable
        let methods: Locator[] = JSON.parse(fs.readFileSync(`${report}/${file}`, 'utf8'));
        methods.forEach(method => {
          if (method.functionName === '*') {
            method.functionName = '.*';
          }
          method.functionNameRegex = new RegExp(`^${method.functionName}$`);
          if (method.moduleName === '*') {
            method.moduleName = '.*';
          }
          method.moduleNameRegex = new RegExp(`^${method.moduleName}$`);
        });

        _categories[name] = methods;
      });
    } else {
      let category = path.basename(report).replace('.json', '');
      let methods2 = JSON.parse(fs.readFileSync(report, 'utf8'));
      if (methods2.functionName === '*') {
        methods2.functionName = '.*';
      }
      methods2.functionNameRegex = new RegExp(`^${methods2.functionName}$`);
      if (methods2.moduleName === '*') {
        methods2.moduleName = '.*';
      }
      methods2.moduleNameRegex = new RegExp(`^${methods2.moduleName}$`);
      _categories[category] = methods2;
    }

    return _categories;
  } else {
    if (methods === undefined) {
      throw new Error(`Error: Must pass a list of method names.`);
    }

    let addHocLocators = methods.map(method => {
      return {
        functionName: method,
        functionNameRegex: new RegExp(`^${method}$`),
        moduleName: '*',
        moduleNameRegex: /.*/,
      };
    });

    return { 'Auto Added Module Paths': addHocLocators };
  }
}
