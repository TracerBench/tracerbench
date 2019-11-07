import { HierarchyNode } from 'd3-hierarchy';
import { writeJSONSync } from 'fs-extra';
import { Archive } from '@tracerbench/har';
import { ITrace, loadTrace } from './load_trace';
import { ITraceEvents } from './live_trace';
import {
  aggregate,
  categorizeAggregations,
  collapseCallFrames,
  verifyMethods,
} from './aggregator';
import { report as reporter } from './reporter';
import {
  addRemainingModules,
  computeMinMax,
  formatCategories,
  getRenderingNodes,
  methodsFromCategories,
} from './utils';
import { ModuleMatcher } from './module_matcher';
import {
  ICpuProfileNode,
  ITraceEvent,
  Trace,
  TRACE_EVENT_PHASE_COMPLETE,
} from '../trace';

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

export async function analyze(options: IAnalyze) {
  const {
    traceHARJSON,
    event,
    filename,
    traceEvents,
    report,
    methods,
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
  renderNodes.forEach(node => {
    const renderAgg = aggregate(node, allMethods, traceHARJSON, modMatcher);
    const renderCollapsed = collapseCallFrames(renderAgg);
    const renderCategorized = categorizeAggregations(
      renderCollapsed,
      categories
    );
    // console.log(`Render Node:${node.data.callFrame.functionName}`); // tslint:disable-line  no-console
    reporter(renderCategorized);
  });
}

export function exportHierarchy(
  rawTraceData: ITraceEvent[],
  hierarchy: HierarchyNode<ICpuProfileNode>,
  trace: Trace,
  filename: string = 'trace-processed',
  modMatcher: ModuleMatcher
) {
  const traceObj: ITraceEvents = { traceEvents: cloneDeep(rawTraceData) };
  hierarchy.each(node => {
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
          moduleName: modMatcher.findModuleName(node.data.callFrame),
        },
      },
      dur: node.data.max - node.data.min,
    };

    traceObj.traceEvents.push(completeEvent);
  });

  writeJSONSync(`${filename}.json`, JSON.stringify(traceObj));
}

function getCPUProfile(trace: Trace, event?: string) {
  const { min, max } = computeMinMax(trace, 'navigationStart', event!);
  return trace.cpuProfile(min, max);
}
