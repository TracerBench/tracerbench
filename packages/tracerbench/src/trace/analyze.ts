import Trace from './trace';
import { ITrace, loadTrace } from './load_trace';
import { ITraceEvent } from './trace_event';
import { exportHierarchy } from './export-hierarchy';
import {
  aggregate,
  categorizeAggregations,
  collapseCallFrames,
  verifyMethods,
} from './aggregator';
import { Archive as IArchive } from '@tracerbench/har';
import { ModuleMatcher } from './module_matcher';
import { report as reporter } from './reporter';
import {
  addRemainingModules,
  computeMinMax,
  formatCategories,
  getRenderingNodes,
  methodsFromCategories,
} from './utils';

export interface IAnalyze {
  rawTraceData: ITraceEvent[] | ITrace;
  archiveFile: IArchive;
  methods: string[];
  event?: string;
  report?: string;
  verbose?: boolean;
  file: string;
}

export async function analyze(options: IAnalyze) {
  const { archiveFile, event, file, rawTraceData, report, methods } = options;
  const trace = loadTrace(rawTraceData);
  const profile = getCPUProfile(trace, event)!;
  const { hierarchy } = profile;

  const modMatcher = new ModuleMatcher(hierarchy, archiveFile);
  exportHierarchy(rawTraceData, hierarchy, trace, file, modMatcher);

  const categories = formatCategories(report, methods);
  const allMethods = methodsFromCategories(categories);

  addRemainingModules(allMethods, categories, modMatcher);
  verifyMethods(allMethods);

  const aggregations = aggregate(
    hierarchy,
    allMethods,
    archiveFile,
    modMatcher
  );
  const collapsed = collapseCallFrames(aggregations);
  const categorized = categorizeAggregations(collapsed, categories);

  reporter(categorized);

  const renderNodes = getRenderingNodes(hierarchy);
  renderNodes.forEach(node => {
    const renderAgg = aggregate(node, allMethods, archiveFile, modMatcher);
    const renderCollapsed = collapseCallFrames(renderAgg);
    const renderCategorized = categorizeAggregations(
      renderCollapsed,
      categories
    );
    // console.log(`Render Node:${node.data.callFrame.functionName}`); // tslint:disable-line  no-console
    reporter(renderCategorized);
  });
}

function getCPUProfile(trace: Trace, event?: string) {
  const { min, max } = computeMinMax(trace, 'navigationStart', event!);
  return trace.cpuProfile(min, max);
}
