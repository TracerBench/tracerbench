import { Archive } from '@tracerbench/har';
import { HierarchyNode } from 'd3-hierarchy';
import { writeJSONSync } from 'fs-extra';
import * as fs from 'fs-extra';
import * as path from 'path';

import {
  ICpuProfileNode,
  ITraceEvent,
  ITraceEventFrame,
  Trace,
  TRACE_EVENT_PHASE_COMPLETE
} from '../trace';
import CpuProfile from '../trace/cpu-profile';
import { ITraceEvents } from '../trace/live-trace';
import { isRenderNode } from '../trace/render-events';
import {
  aggregate,
  categorizeAggregations,
  collapseCallFrames,
  verifyMethods
} from './aggregator';
import { ModuleMatcher } from './module-matcher';
import reporter from './reporter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloneDeep = require('lodash.clonedeep');
export const AUTO_ADD_CAT = 'Auto Added Module Paths';

export interface ICategories {
  [key: string]: ILocator[];
}

export interface ILocator {
  functionName: string;
  functionNameRegex: RegExp;
  moduleName: string;
  moduleNameRegex: RegExp;
}

type AnalyzeOptions = {
  traceEvents: ITraceEventFrame[];
  harJSON: Archive;
  methods?: string[];
  heuristics?: string;
  event?: string;
};

export async function analyze(
  options: AnalyzeOptions
): Promise<{ node: string; hierarchyReports: string[] }> {
  const { harJSON, traceEvents, methods, heuristics } = options;
  const trace = loadTrace(traceEvents);
  const profile = getCPUProfile(trace)!;
  const { hierarchy } = profile;

  const modMatcher = new ModuleMatcher(hierarchy, harJSON);

  exportHierarchy(
    traceEvents as ITraceEvent[],
    hierarchy,
    trace,
    undefined,
    modMatcher
  );

  const categories = formatCategories(heuristics, methods);
  const allMethods = methodsFromCategories(categories);

  addRemainingModules(allMethods, categories, modMatcher);
  verifyMethods(allMethods);

  const aggregations = aggregate(hierarchy, allMethods, harJSON, modMatcher);
  const collapsed = collapseCallFrames(aggregations);
  const renderNodes = getRenderingNodes(hierarchy);
  const hierarchyReports: string[] = [];

  renderNodes.forEach((node) => {
    const renderAgg = aggregate(node, allMethods, harJSON, modMatcher);
    const renderCollapsed = collapseCallFrames(renderAgg);
    hierarchyReports.push(
      reporter(categorizeAggregations(renderCollapsed, categories))
    );
  });

  return {
    node: reporter(categorizeAggregations(collapsed, categories)),
    hierarchyReports
  };
}

function loadTrace(traceEvents: ITraceEventFrame[]): Trace {
  const trace = new Trace();
  trace.addEvents(traceEvents);
  trace.buildModel();
  return trace;
}

/**
 * This will add all module paths to locators/categories, except for those already matched by
 * user provided heuristic config entries which specify a non-".*" module name regex.
 */
export function addRemainingModules(
  locators: ILocator[],
  categories: ICategories,
  modMatcher: ModuleMatcher
): void {
  const allModules = modMatcher.getModuleList();
  categories[AUTO_ADD_CAT] = [];
  allModules.forEach((moduleName) => {
    // If the locator is going to match an entire module anyway, don't add that module to the auto
    // generated list of module aggergations.
    const found = locators.find((locator) => {
      return locator.functionName === '.*'
        ? locator.moduleNameRegex.test(moduleName)
        : false;
    });
    if (!found) {
      const newLocator = {
        functionName: '.*',
        functionNameRegex: /.*/,
        moduleName,
        moduleNameRegex: new RegExp(`^${moduleName}$`)
      };
      locators.push(newLocator);
      categories[AUTO_ADD_CAT].push(newLocator);
    }
  });
}

function formatCategories(
  heuristics: string | undefined,
  methods = ['']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { [key: string]: any } {
  if (heuristics) {
    const stats = fs.statSync(heuristics);
    const categories: ICategories = {};

    if (stats.isDirectory()) {
      const files = fs.readdirSync(heuristics);

      files.map((file) => {
        const name = path.basename(file).replace('.json', '');
        const methods: ILocator[] = JSON.parse(
          fs.readFileSync(`${heuristics}/${file}`, 'utf8')
        );
        methods.forEach((method) => {
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
      const category = path.basename(heuristics).replace('.json', '');
      const methods2 = JSON.parse(fs.readFileSync(heuristics, 'utf8'));
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

    const addHocLocators = methods.map((method) => {
      return {
        functionName: method,
        functionNameRegex: new RegExp(`^${method}$`),
        moduleName: '*',
        moduleNameRegex: /.*/
      };
    });

    return { 'Auto Added Module Paths': addHocLocators };
  }
}

function exportHierarchy(
  rawTraceData: ITraceEvent[],
  hierarchy: HierarchyNode<ICpuProfileNode>,
  trace: Trace,
  filename = 'trace-processed',
  modMatcher: ModuleMatcher
): void {
  const traceObj: ITraceEvents = { traceEvents: cloneDeep(rawTraceData) };
  hierarchy.each((node) => {
    const completeEvent: ITraceEvent = {
      pid: trace.mainProcess!.id,
      tid: trace.mainProcess!.mainThread!.id,
      ts: node.data.min,
      ph: TRACE_EVENT_PHASE_COMPLETE,
      cat: 'blink.user_timing',
      name: node.data.callFrame.functionName,
      args: {
        data: {
          functionName: node.data.callFrame.functionName,
          moduleName: modMatcher.findModuleName(node.data.callFrame)
        }
      },
      dur: node.data.max - node.data.min
    };

    traceObj.traceEvents.push(completeEvent);
  });

  writeJSONSync(`${filename}.json`, JSON.stringify(traceObj));
}

export function methodsFromCategories(categories: ICategories): ILocator[] {
  return Object.keys(categories).reduce(
    (accum: ILocator[], category: string) => {
      accum.push(...categories[category]);
      return accum;
    },
    []
  );
}

function computeMinMax(
  trace: Trace,
  start = 'navigationStart',
  end: string
): { min: number; max: number } {
  let min;
  let max;
  if (end) {
    // TODO harden this to find the correct frame
    const startEvent = trace.events.find((e) => e.name === start)!;
    const endEvent = trace.events.find((e) => e.name === end);

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

function getRenderingNodes(
  root: HierarchyNode<ICpuProfileNode>
): Array<HierarchyNode<ICpuProfileNode>> {
  const renderNodes: Array<HierarchyNode<ICpuProfileNode>> = [];
  root.each((node: HierarchyNode<ICpuProfileNode>) => {
    if (isRenderNode(node)) {
      renderNodes.push(node);
    }
  });
  return renderNodes;
}

function getCPUProfile(trace: Trace, event?: string): CpuProfile {
  const { min, max } = computeMinMax(trace, 'navigationStart', event!);
  return trace.cpuProfile(min, max);
}
