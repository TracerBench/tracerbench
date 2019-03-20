import { ITraceEvent } from 'tracerbench';

import { ITrace, loadTrace, exportHierarchy } from '../index';
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
  formatCategories,
  getRenderingNodes,
  methodsFromCategories,
  getCPUProfile
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

  const renderNodes = getRenderingNodes(hierarchy);
  renderNodes.forEach(node => {
    let renderAgg = aggregate(node, allMethods, archiveFile, modMatcher);
    let renderCollapsed = collapseCallFrames(renderAgg);
    let renderCategorized = categorizeAggregations(renderCollapsed, categories);
    console.log(`Render Node:${node.data.callFrame.functionName}`); // tslint:disable-line  no-console
    reporter(renderCategorized);
  });
}
