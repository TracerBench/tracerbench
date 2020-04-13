import { Archive } from '@tracerbench/har';
import { HierarchyNode } from 'd3-hierarchy';
import { writeJSONSync } from 'fs-extra';

import {
  ICpuProfileNode,
  ITraceEvent,
  Trace,
  TRACE_EVENT_PHASE_COMPLETE
} from '../trace';
import {
  aggregate,
  categorizeAggregations,
  collapseCallFrames,
  verifyMethods
} from './aggregator';
import CpuProfile from './cpu-profile';
import { ITraceEvents } from './live-trace';
import { ITrace, loadTrace } from './load-trace';
import { ModuleMatcher } from './module-matcher';
import reporter from './reporter';
import {
  addRemainingModules,
  computeMinMax,
  formatCategories,
  getRenderingNodes,
  methodsFromCategories
} from './utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloneDeep = require('lodash.clonedeep');

export interface IAnalyze {
  traceEvents: ITraceEvent[] | ITrace;
  traceHARJSON: Archive;
  methods: string[];
  filename?: string;
  event?: string;
  report?: string;
  verbose?: boolean;
}

export async function analyze(options: IAnalyze): Promise<void> {
  const {
    traceHARJSON,
    event,
    filename,
    traceEvents,
    report,
    methods
  } = options;
  const trace = loadTrace(traceEvents);
  const profile = getCPUProfile(trace, event)!;
  const { hierarchy } = profile;

  const modMatcher = new ModuleMatcher(hierarchy, traceHARJSON);
  exportHierarchy(
    traceEvents as ITraceEvent[],
    hierarchy,
    trace,
    filename,
    modMatcher
  );

  const categories = formatCategories(report, methods);
  const allMethods = methodsFromCategories(categories);

  addRemainingModules(allMethods, categories, modMatcher);
  verifyMethods(allMethods);

  const aggregations = aggregate(
    hierarchy,
    allMethods,
    traceHARJSON,
    modMatcher
  );
  const collapsed = collapseCallFrames(aggregations);
  const categorized = categorizeAggregations(collapsed, categories);

  reporter(categorized);

  const renderNodes = getRenderingNodes(hierarchy);
  renderNodes.forEach((node) => {
    const renderAgg = aggregate(node, allMethods, traceHARJSON, modMatcher);
    const renderCollapsed = collapseCallFrames(renderAgg);
    const renderCategorized = categorizeAggregations(
      renderCollapsed,
      categories
    );
    reporter(renderCategorized);
  });
}

export function exportHierarchy(
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

function getCPUProfile(trace: Trace, event?: string): CpuProfile {
  const { min, max } = computeMinMax(trace, 'navigationStart', event!);
  return trace.cpuProfile(min, max);
}
