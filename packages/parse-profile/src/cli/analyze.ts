import { HierarchyNode } from 'd3-hierarchy';
import * as path from 'path';
const fs = require('fs-extra');
import { ITrace, loadTrace } from '../index';
import { ICpuProfileNode, ITraceEvent, Trace } from '../trace';
import { exportHierarchy } from '../trace/export';
import {
  aggregate,
  categorizeAggregations,
  collapseCallFrames,
  verifyMethods
} from './aggregator';
import { Archive } from './archive_trace';
import {
  ALL_MODULES_DIR,
  ANALYSIS_WRITE_MSG,
  HURISTICS_DIR,
  PROCESSED_TRACES_DIR,
  RENDER_NODES_DIR
} from './constants';
import { ModuleMatcher } from './module_matcher';
import { RenderOutputStats, report as reporter, toJsonOut } from './reporter';
import {
  addRemainingModules,
  Categories,
  computeMinMax,
  formatCategories,
  getRenderingNodes,
  Locator,
  methodsFromCategories,
  removeFilename
} from './utils';

interface IAnalyze {
  rawTraceData: ITraceEvent[] | ITrace;
  harFile: Archive;
  methods: string[];
  event?: string;
  report?: string;
  verbose?: boolean;
  file: string;
  outputPath: string;
  legacy: boolean;
}

export async function analyze(options: IAnalyze) {
  let { harFile, event, file, rawTraceData, report, methods, outputPath, legacy } = options;
  let trace = loadTrace(rawTraceData);
  let profile = getCPUProfile(trace, event)!;
  const { hierarchy } = profile;
  report = report ? report : '';
  const fileName = path.basename(file);

  let modMatcher = new ModuleMatcher(hierarchy, harFile);

  const exportedHierarchyFilepath = path.join(outputPath, PROCESSED_TRACES_DIR, fileName);
  exportHierarchy(rawTraceData, hierarchy, trace, exportedHierarchyFilepath, modMatcher);

  let categories = formatCategories(report, methods);
  let allMethods = methodsFromCategories(categories);

  analyzeHeuristics(hierarchy, allMethods, harFile, modMatcher, categories, outputPath, fileName, legacy);
  analyzeAllModules(hierarchy, [], harFile, modMatcher, {}, outputPath, fileName);
  analyzeRenderNodes(hierarchy, [], harFile, modMatcher, {}, outputPath, fileName);
}

function analyzeAllModules(
  hierarchy: HierarchyNode<ICpuProfileNode>,
  allMethods: Locator[],
  harFile: Archive,
  modMatcher: ModuleMatcher,
  categories: Categories,
  outputPath: string,
  fileName: string
) {
  addRemainingModules(allMethods, categories, modMatcher);
  verifyMethods(allMethods);
  let aggregations = aggregate(hierarchy, allMethods, harFile, modMatcher);
  let collapsed = collapseCallFrames(aggregations);
  let categorized = categorizeAggregations(collapsed, categories);

  toJsonOut(categorized, path.join(outputPath, ALL_MODULES_DIR, fileName), true);
}

function analyzeHeuristics(
  hierarchy: HierarchyNode<ICpuProfileNode>,
  allMethods: Locator[],
  harFile: Archive,
  modMatcher: ModuleMatcher,
  categories: Categories,
  outputPath: string,
  fileName: string,
  legacy: boolean
) {
  verifyMethods(allMethods);
  let aggregations = aggregate(hierarchy, allMethods, harFile, modMatcher);
  let collapsed = collapseCallFrames(aggregations);
  let categorized = categorizeAggregations(collapsed, categories);

  if (legacy) reporter(categorized);
  toJsonOut(categorized, path.join(outputPath, HURISTICS_DIR, fileName), true);
}

function analyzeRenderNodes(
  hierarchy: HierarchyNode<ICpuProfileNode>,
  allMethods: Locator[],
  harFile: Archive,
  modMatcher: ModuleMatcher,
  categories: Categories,
  outputPath: string,
  fileName: string
) {
  addRemainingModules(allMethods, categories, modMatcher);
  const renderNodes = getRenderingNodes(hierarchy);
  const node2output: RenderOutputStats = {};
  debugger;
  renderNodes.forEach(node => {
    let renderAgg = aggregate(node, allMethods, harFile, modMatcher);
    let renderCollapsed = collapseCallFrames(renderAgg);
    let renderCategorized = categorizeAggregations(renderCollapsed, categories);
    const data = toJsonOut(renderCategorized, '', false);
    node2output[node.data.callFrame.functionName] = data;
  });
  const filepath = path.join(outputPath, RENDER_NODES_DIR, fileName);
  fs.ensureDirSync(removeFilename(filepath));
  fs.writeFileSync(filepath, JSON.stringify(node2output, null, 2), 'utf8');
  console.log(`${ANALYSIS_WRITE_MSG} ${filepath}`);
}

function getCPUProfile(trace: Trace, event?: string) {
  let { min, max } = computeMinMax(trace, 'navigationStart', event!);
  return trace.cpuProfile(min, max);
}