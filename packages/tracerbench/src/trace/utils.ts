// tslint:disable:no-console

import { HierarchyNode } from 'd3-hierarchy';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ICpuProfileNode, Trace } from '../trace';
import { isRenderNode } from './render-events';
import { ModuleMatcher } from './module_matcher';
import { dirSync } from 'tmp';

export interface ICategories {
  [key: string]: ILocator[];
}

export interface ILocator {
  functionName: string;
  functionNameRegex: RegExp;
  moduleName: string;
  moduleNameRegex: RegExp;
}

export const AUTO_ADD_CAT = 'Auto Added Module Paths';

export function getRenderingNodes(root: HierarchyNode<ICpuProfileNode>) {
  const renderNodes: Array<HierarchyNode<ICpuProfileNode>> = [];
  root.each((node: HierarchyNode<ICpuProfileNode>) => {
    if (isRenderNode(node)) {
      renderNodes.push(node);
    }
  });
  return renderNodes;
}

export function filterObjectByKeys(obj: any, keyArray: string[]) {
  const o = Object.assign({}, obj);
  const k = Object.keys(o);
  k.forEach(c => {
    if (!keyArray.includes(c)) {
      delete o[c];
    }
  });

  return o;
}

export function computeMinMax(
  trace: Trace,
  start: string = 'navigationStart',
  end: string
) {
  let min;
  let max;
  if (end) {
    // TODO harden this to find the correct frame
    const startEvent = trace.events.find(e => e.name === start)!;
    const endEvent = trace.events.find(e => e.name === end);

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
  locators: ILocator[],
  categories: ICategories,
  modMatcher: ModuleMatcher
) {
  const allModules = modMatcher.getModuleList();
  categories[AUTO_ADD_CAT] = [];
  allModules.forEach(moduleName => {
    // If the locator is going to match an entire module anyway, don't add that module to the auto
    // generated list of module aggergations.
    const found = locators.find(locator => {
      return locator.functionName === '.*'
        ? locator.moduleNameRegex.test(moduleName)
        : false;
    });
    if (!found) {
      const newLocator = {
        functionName: '.*',
        functionNameRegex: /.*/,
        moduleName,
        moduleNameRegex: new RegExp(`^${moduleName}$`),
      };
      locators.push(newLocator);
      categories[AUTO_ADD_CAT].push(newLocator);
    }
  });
}

export function methodsFromCategories(categories: ICategories) {
  return Object.keys(categories).reduce(
    (accum: ILocator[], category: string) => {
      accum.push(...categories[category]);
      return accum;
    },
    []
  );
}

export function toRegex(locators: ILocator[]) {
  return locators.map(({ functionName }) => {
    if (functionName === '*') {
      return /.*/;
    }
    const parts = functionName.split('.'); // Path expression
    if (parts.length > 1) {
      parts.shift();
      return new RegExp(`^([A-z]+\\.${parts.join('\\.')})$`);
    }
    return new RegExp(`^${functionName}$`);
  });
}

export function formatCategories(
  report: string | undefined,
  methods: string[]
) {
  if (report) {
    const stats = fs.statSync(report);
    const categories: ICategories = {};

    if (stats.isDirectory()) {
      const files = fs.readdirSync(report);

      files.map(file => {
        const name = path.basename(file).replace('.json', '');
        // tslint:disable-next-line:no-shadowed-variable
        const methods: ILocator[] = JSON.parse(
          fs.readFileSync(`${report}/${file}`, 'utf8')
        );
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

        categories[name] = methods;
      });
    } else {
      const category = path.basename(report).replace('.json', '');
      const methods2 = JSON.parse(fs.readFileSync(report, 'utf8'));
      if (methods2.functionName === '*') {
        methods2.functionName = '.*';
      }
      methods2.functionNameRegex = new RegExp(`^${methods2.functionName}$`);
      if (methods2.moduleName === '*') {
        methods2.moduleName = '.*';
      }
      methods2.moduleNameRegex = new RegExp(`^${methods2.moduleName}$`);
      categories[category] = methods2;
    }

    return categories;
  } else {
    if (methods === undefined) {
      throw new Error(`Error: Must pass a list of method names.`);
    }

    const addHocLocators = methods.map(method => {
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

export async function wait(dur: number) {
  return new Promise(resolve => {
    setTimeout(resolve, dur);
  });
}

export function getBrowserArgs(explictArgs?: string[]): string[] {
  interface IViewOptions {
    windowSize: {
      width: number;
      height: number;
    };
    deviceScaleFactor: number;
    userAgent: string | undefined;
  }

  const tmpDir = dirSync({
    unsafeCleanup: true,
  });

  const options: IViewOptions = {
    windowSize: {
      width: 1280,
      height: 800,
    },
    deviceScaleFactor: 0,
    userAgent: undefined,
  };

  const defaultFlags = [
    `--crash-dumps-dir=${tmpDir.name}`,
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-component-extensions-with-background-pages',
    '--disable-client-side-phishing-detection',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=NetworkPrediction',
    '--disable-features=site-per-process,TranslateUI,BlinkGenPropertyTrees',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-renderer-backgrounding',
    '--disable-sync',
    '--disable-translate',
    '--disable-v8-idle-tasks',
    `--device-scale-factor=${options.deviceScaleFactor}`,
    '--metrics-recording-only',
    '--no-pings',
    '--no-first-run',
    '--no-default-browser-check',
    '--no-experiments',
    '--no-sandbox',
    '--password-store=basic',
    '--safebrowsing-disable-auto-update',
    '--use-mock-keychain',
    `--user-agent=${options.userAgent}`,
    `--user-data-dir=${tmpDir.name}`,
    '--v8-cache-options=none',
    `--window-size=${options.windowSize.width},${options.windowSize.height}`,
    '--headless',
  ];

  return explictArgs ? explictArgs.concat(defaultFlags) : defaultFlags;
}
