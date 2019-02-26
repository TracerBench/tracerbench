import * as fs from 'fs';
import { Trace } from '../trace';
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

export interface IAnalyze {
  file: string;
  archiveFile: Archive;
  methods: string[];
  event?: string;
  report?: string;
  verbose?: boolean;
}

export async function analyze(options: IAnalyze) {
  let { archiveFile, event, file, report, methods } = options;
  let trace = loadTrace(file);
  let profile = cpuProfile(trace, event)!;
  const { hierarchy } = profile;
  const rawTraceData = JSON.parse(fs.readFileSync(file, 'utf8'));

  exportHierarchy(rawTraceData, hierarchy, trace, file);

  let modMatcher = new ModuleMatcher(hierarchy, archiveFile);
  let categories = formatCategories(report, methods);
  let allMethods = methodsFromCategories(categories);

  addRemainingModules(allMethods, categories, modMatcher);
  verifyMethods(allMethods);

  let aggregations = aggregate(hierarchy, allMethods, archiveFile, modMatcher);
  let collapsed = collapseCallFrames(aggregations);
  let categorized = categorizeAggregations(collapsed, categories);

  reporter(categorized);
}

function loadTrace(file: string) {
  let traceEvents = JSON.parse(fs.readFileSync(file, 'utf8'));
  let trace = new Trace();
  trace.addEvents(traceEvents.traceEvents);
  trace.buildModel();
  return trace;
}

function cpuProfile(trace: Trace, event?: string) {
  let { min, max } = computeMinMax(trace, 'navigationStart', event!);
  return trace.cpuProfile(min, max);
}
