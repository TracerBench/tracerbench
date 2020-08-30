/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stats } from "@tracerbench/stats";
import { readFileSync } from "fs-extra";
import * as Handlebars from "handlebars";
import * as path from "path";

import { ITBConfig } from "../command-config";
import { defaultFlagArgs } from "../command-config/default-flag-args";
import { convertMicrosecondsToMS, md5sum } from "./utils";

export interface Sample {
  duration: number;
  js: number;
  phases: Array<{
    phase: string;
    start: number;
    duration: number;
  }>;
  gc: any;
  blinkGC: any;
}

export interface ITracerBenchTraceResult {
  meta: {
    browserVersion: string;
    cpus: string[];
  };
  samples: Sample[];
  set: string;
}

export interface IFormatedSamples {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
  samplesMS: number[];
}

export interface HTMLSectionRenderData {
  isSignificant: boolean;
  ciMin: number;
  ciMax: number;
  hlDiff: number;
  phase: string;
  identifierHash: string;
  sampleCount: number;
  servers: any;
  controlFormatedSamples: string;
  experimentFormatedSamples: string;
}

interface ValuesByPhase {
  [key: string]: number[];
}

export const PAGE_LOAD_TIME = "duration";

const CHART_CSS_PATH = path.join(__dirname, "../static/chart-bootstrap.css");
const CHART_JS_PATH = path.join(
  __dirname,
  "../static/chartjs-2.9.3-chart.min.js"
);
const REPORT_PATH = path.join(__dirname, "../static/report-template.hbs");
const PHASE_DETAIL_PARTIAL = path.join(
  __dirname,
  "../static/phase-detail-partial.hbs"
);
const PHASE_CHART_JS_PARTIAL = path.join(
  __dirname,
  "../static/phase-chart-js-partial.hbs"
);

const CHART_CSS = readFileSync(CHART_CSS_PATH, "utf8");
const CHART_JS = readFileSync(CHART_JS_PATH, "utf8");
const PHASE_DETAIL_TEMPLATE_RAW = readFileSync(PHASE_DETAIL_PARTIAL, "utf8");
const PHASE_CHART_JS_TEMPLATE_RAW = readFileSync(
  PHASE_CHART_JS_PARTIAL,
  "utf8"
);
let REPORT_TEMPLATE_RAW = readFileSync(REPORT_PATH, "utf8");

REPORT_TEMPLATE_RAW = REPORT_TEMPLATE_RAW.toString()
  .replace(
    "{{!-- TRACERBENCH-CHART-BOOTSTRAP.CSS --}}",
    `<style>${CHART_CSS}</style>`
  )
  .replace("{{!-- TRACERBENCH-CHART-JS --}}", `<script>${CHART_JS}</script>`);

Handlebars.registerPartial("phaseChartJSSection", PHASE_CHART_JS_TEMPLATE_RAW);
Handlebars.registerPartial("phaseDetailSection", PHASE_DETAIL_TEMPLATE_RAW);
/**
 * Camel case helper
 */
Handlebars.registerHelper("toCamel", (val) => {
  return val.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
});

/**
 * Negative means slower
 */
Handlebars.registerHelper("isFaster", (analysis) => {
  return analysis.hlDiff > 0;
});

/**
 * Absolute number helper
 */
Handlebars.registerHelper("abs", (num) => {
  return Math.abs(num);
});

/**
 * Sort the given numbers by their absolute values
 */
Handlebars.registerHelper("absSort", (num1, num2, position) => {
  const sorted = [Math.abs(num1), Math.abs(num2)];
  sorted.sort((a, b) => a - b);
  return sorted[position];
});

/**
 * Extract the phases and page load time latency into sorted buckets by phase
 *
 * @param samples - Array of "sample" objects
 * @param valueGen - Calls this function to extract the value from the phase. A
 *   "phase" is passed containing duration and start
 */
export function bucketPhaseValues(
  samples: Sample[],
  valueGen: any = (a: any) => a.duration
): ValuesByPhase {
  const buckets: { [key: string]: number[] } = { [PAGE_LOAD_TIME]: [] };

  samples.forEach((sample: Sample) => {
    buckets[PAGE_LOAD_TIME].push(sample[PAGE_LOAD_TIME]);

    sample.phases.forEach((phaseData) => {
      const bucket = buckets[phaseData.phase] || [];
      bucket.push(valueGen(phaseData));
      buckets[phaseData.phase] = bucket;
    });
  });

  return buckets;
}

export interface ParsedTitleConfigs {
  servers: Array<{ name: string }>;
  plotTitle: string | undefined;
  browserVersion: string;
}

/**
 * Override the default server and plot title attributes
 *
 * @param tbConfig - Concerned only about the "servers" and "plotTitle"
 *   attribute
 * @param version - Browser version
 * @param plotTitle - Optional explicit title from cli flag
 */
export function resolveTitles(
  tbConfig: Partial<ITBConfig>,
  version: string,
  plotTitle?: string
): ParsedTitleConfigs {
  const reportTitles = {
    servers: [{ name: "Control" }, { name: "Experiment" }],
    plotTitle: tbConfig.plotTitle
      ? tbConfig.plotTitle
      : defaultFlagArgs.plotTitle,
    browserVersion: version,
  };

  if (tbConfig.servers) {
    reportTitles.servers = tbConfig.servers.map((titleConfig, idx) => {
      if (idx === 0) {
        return { name: `Control: ${titleConfig.name}` };
      } else {
        return { name: `Experiment: ${titleConfig.name}` };
      }
    });
  }

  // if passing an explicit plotTitle via cli flag this trumps
  // the tbConfig.plotTitle and defaults
  if (plotTitle) {
    reportTitles.plotTitle = plotTitle;
  }

  return reportTitles;
}

/**
 * Generate the HTML render data for the cumulative chart. Ensure to convert to
 * milliseconds for presentation
 *
 * @param controlData - Samples of the benchmark of control server
 * @param experimentData - Samples of the benchmark experiment server
 */
export function buildCumulativeChartData(
  controlData: ITracerBenchTraceResult,
  experimentData: ITracerBenchTraceResult
): { [key: string]: string } {
  const cumulativeValueFunc = (a: { [key: string]: number }): number =>
    convertMicrosecondsToMS(a.start + a.duration);

  const valuesByPhaseControl = bucketPhaseValues(
    controlData.samples,
    cumulativeValueFunc
  );
  const valuesByPhaseExperiment = bucketPhaseValues(
    experimentData.samples,
    cumulativeValueFunc
  );
  const phases = Object.keys(valuesByPhaseControl).filter(
    (k) => k !== PAGE_LOAD_TIME
  );

  return {
    categories: JSON.stringify(phases),
    controlData: JSON.stringify(phases.map((k) => valuesByPhaseControl[k])),
    experimentData: JSON.stringify(
      phases.map((k) => valuesByPhaseExperiment[k])
    ),
  };
}

/**
 * Call the stats helper functions to generate the confidence interval and
 * Hodges–Lehmann estimator. Format the data into HTMLSectionRenderData
 * structure.
 *
 * @param controlValues - Values for the control for the phase
 * @param experimentValues - Values for the experiment for the phase
 * @param phaseName - Name of the phase the values represent
 */
export function formatPhaseData(
  controlValues: number[],
  experimentValues: number[],
  phaseName: string
): HTMLSectionRenderData {
  const stats = new Stats({
    control: controlValues,
    experiment: experimentValues,
    name: "output",
  });
  const isNotSignificant =
    (stats.confidenceInterval.min < 0 && 0 < stats.confidenceInterval.max) ||
    (stats.confidenceInterval.min > 0 && 0 > stats.confidenceInterval.max) ||
    (stats.confidenceInterval.min === 0 && stats.confidenceInterval.max === 0);

  return {
    phase: phaseName,
    identifierHash: md5sum(phaseName),
    isSignificant: !isNotSignificant,
    sampleCount: stats.sampleCount.control,
    ciMin: stats.confidenceInterval.min,
    ciMax: stats.confidenceInterval.max,
    hlDiff: stats.estimator,
    servers: undefined,
    controlFormatedSamples: JSON.stringify({
      min: stats.sevenFigureSummary.control.min,
      q1: stats.sevenFigureSummary.control[25],
      median: stats.sevenFigureSummary.control[50],
      q3: stats.sevenFigureSummary.control[75],
      max: stats.sevenFigureSummary.control.max,
      outliers: stats.outliers.control.outliers,
      samplesMS: stats.controlMS,
    }),
    experimentFormatedSamples: JSON.stringify({
      min: stats.sevenFigureSummary.experiment.min,
      q1: stats.sevenFigureSummary.experiment[25],
      median: stats.sevenFigureSummary.experiment[50],
      q3: stats.sevenFigureSummary.experiment[75],
      max: stats.sevenFigureSummary.experiment.max,
      outliers: stats.outliers.experiment.outliers,
      samplesMS: stats.experimentMS,
    }),
  };
}

/**
 * Prioritize the phase that has the largest difference in regression first.
 */
export function phaseSorter(
  a: HTMLSectionRenderData,
  b: HTMLSectionRenderData
): number {
  const A_ON_TOP = -1;
  const B_ON_TOP = 1;

  if (a.isSignificant) {
    if (!b.isSignificant) {
      return A_ON_TOP;
    } else {
      // If both are significant prefer slowest one
      return a.hlDiff - b.hlDiff;
    }
  }

  if (b.isSignificant) {
    if (!a.isSignificant) {
      return B_ON_TOP;
    }
  }

  return 0;
}

export function generateDataForHTML(
  controlData: ITracerBenchTraceResult,
  experimentData: ITracerBenchTraceResult,
  reportTitles: ParsedTitleConfigs
): {
  durationSection: HTMLSectionRenderData;
  subPhaseSections: HTMLSectionRenderData[];
} {
  const valuesByPhaseControl = bucketPhaseValues(controlData.samples);
  const valuesByPhaseExperiment = bucketPhaseValues(experimentData.samples);
  const subPhases = Object.keys(valuesByPhaseControl).filter(
    (k) => k !== PAGE_LOAD_TIME
  );

  const durationSection = formatPhaseData(
    valuesByPhaseControl[PAGE_LOAD_TIME],
    valuesByPhaseExperiment[PAGE_LOAD_TIME],
    PAGE_LOAD_TIME
  );

  const subPhaseSections: HTMLSectionRenderData[] = subPhases.map((phase) => {
    const controlValues = valuesByPhaseControl[phase];
    const experimentValues = valuesByPhaseExperiment[phase];
    const renderDataForPhase = formatPhaseData(
      controlValues,
      experimentValues,
      phase
    );

    renderDataForPhase.servers = reportTitles.servers;
    return renderDataForPhase as HTMLSectionRenderData;
  });

  durationSection.servers = reportTitles.servers;
  return { durationSection, subPhaseSections };
}

export default function createConsumableHTML(
  controlData: ITracerBenchTraceResult,
  experimentData: ITracerBenchTraceResult,
  tbConfig: ITBConfig,
  plotTitle?: string
): string {
  const reportTitles = resolveTitles(
    tbConfig,
    controlData.meta.browserVersion,
    plotTitle
  );
  const { durationSection, subPhaseSections } = generateDataForHTML(
    controlData,
    experimentData,
    reportTitles
  );

  const template = Handlebars.compile(REPORT_TEMPLATE_RAW);

  return template({
    cumulativeChartData: buildCumulativeChartData(controlData, experimentData),
    durationSection,
    reportTitles,
    subPhaseSections,
    configsSJSONString: JSON.stringify(tbConfig, null, 4),
    sectionFormattedDataJson: JSON.stringify(subPhaseSections),
  });
}
