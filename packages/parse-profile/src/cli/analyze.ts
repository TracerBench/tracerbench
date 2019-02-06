import { ITrace, loadTrace } from '../index';
import { ITraceEvent, Trace } from '../trace';
import { exportHierarchy } from '../trace/export';
import {
  aggregate,
  categorizeAggregations,
  collapseCallFrames,
  verifyMethods
} from './aggregator';
import { Archive } from './archive_trace';
import { ModuleMatcher } from './module_matcher';
import { report as reporter } from './reporter';
import {
  addRemainingModules,
  computeMinMax,
  formatCategories,
  methodsFromCategories
} from './utils';

interface IAnalyze {
  rawTraceData: ITraceEvent[] | ITrace;
  archiveFile: Archive;
  methods: string[];
  event?: string;
  report?: string;
  verbose?: boolean;
  file: string;
}

export async function analyze(options: IAnalyze) {
  let { archiveFile, event, file, rawTraceData, report, methods } = options;
  let trace = loadTrace(rawTraceData);
  let profile = getCPUProfile(trace, event)!;
  const { hierarchy } = profile;

  let modMatcher = new ModuleMatcher(hierarchy, archiveFile);
  exportHierarchy(rawTraceData, hierarchy, trace, file, modMatcher);
  let categories = formatCategories(report, methods);
  let allMethods = methodsFromCategories(categories);

  addRemainingModules(allMethods, categories, modMatcher);
  verifyMethods(allMethods);

  let aggregations = aggregate(hierarchy, allMethods, archiveFile, modMatcher);
  let collapsed = collapseCallFrames(aggregations);
  let categorized = categorizeAggregations(collapsed, categories);

  reporter(categorized);
}

function getCPUProfile(trace: Trace, event?: string) {
  let { min, max } = computeMinMax(trace, 'navigationStart', event!);
  return trace.cpuProfile(min, max);
}
