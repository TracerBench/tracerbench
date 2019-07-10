import * as Handlebars from 'handlebars';
import * as path from 'path';
import { Stats } from './statistics/stats';
import { readFileSync } from 'fs-extra';
import { defaultFlagArgs } from '../command-config/default-flag-args';
import { ITBConfig } from '../command-config/tb-config';
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
  runtimeCallStats: any;
}

export interface ITracerBenchTraceResult {
  meta: {
    browserVersion: string;
    cpus: string[];
  };
  samples: Sample[];
  set: string;
}

interface HTMLSectionRenderData {
  isSignificant: boolean;
  ciMin: number;
  ciMax: number;
  hlDiff: number;
  phase: string;
  identifierHash: string;
  controlSamples: string;
  experimentSamples: string;
  servers: any;
}

const PAGE_LOAD_TIME = 'duration';

const CHART_CSS_PATH = path.join(__dirname, '../static/chart-bootstrap.css');
const CHART_JS_PATH = path.join(
  __dirname,
  '../static/chartjs-2.8.0-chart.min.js'
);
const REPORT_PATH = path.join(__dirname, '../static/report-template.hbs');

const CHART_CSS = readFileSync(CHART_CSS_PATH, 'utf8');
const CHART_JS = readFileSync(CHART_JS_PATH, 'utf8');
let REPORT_TEMPLATE_RAW = readFileSync(REPORT_PATH, 'utf8');

REPORT_TEMPLATE_RAW = REPORT_TEMPLATE_RAW.toString()
  .replace(
    '{{!-- TRACERBENCH-CHART-BOOTSTRAP.CSS --}}',
    `<style>${CHART_CSS}</style>`
  )
  .replace('{{!-- TRACERBENCH-CHART-JS --}}', `<script>${CHART_JS}</script>`);

export default function createConsumeableHTML(
  controlData: ITracerBenchTraceResult,
  experimentData: ITracerBenchTraceResult,
  config: ITBConfig
): string {
  /**
   * Extract the phases and page load time latency into sorted buckets by phase
   *
   * @param samples - Array of "sample" objects
   */
  function bucketPhaseValues(samples: Sample[]): { [key: string]: number[] } {
    const buckets: { [key: string]: number[] } = { [PAGE_LOAD_TIME]: [] };

    samples.forEach((sample: Sample) => {
      buckets[PAGE_LOAD_TIME].push(sample[PAGE_LOAD_TIME]);
      sample.phases.forEach(phaseData => {
        const bucket = buckets[phaseData.phase] || [];
        bucket.push(phaseData.duration);
        buckets[phaseData.phase] = bucket;
      });
    });

    Object.keys(buckets).forEach(phase => {
      buckets[phase].sort();
    });

    return buckets;
  }

  const reportTitles = {
    servers: [{ name: 'Control' }, { name: 'Experiment' }],
    plotTitle: defaultFlagArgs.plotTitle,
  };

  try {
    // get the raw tbconfig.json either root or child
    if (config.servers) {
      reportTitles.servers = config.servers as any;
    }
    if (config.plotTitle) {
      reportTitles.plotTitle = config.plotTitle;
    }
  } catch (e) {
    // e
  }

  const valuesByPhaseControl = bucketPhaseValues(controlData.samples);
  const valuesByPhaseExperiment = bucketPhaseValues(experimentData.samples);
  const phases = Object.keys(valuesByPhaseControl);
  const sectionFormattedData: HTMLSectionRenderData[] = [];

  phases.forEach(phase => {
    const controlValues = valuesByPhaseControl[phase];
    const experimentValues = valuesByPhaseExperiment[phase];
    const stats = new Stats({
      control: controlValues,
      experiment: experimentValues,
      name: 'output',
    });
    const isNotSignificant =
      (stats.confidenceInterval.min < 0 && 0 < stats.confidenceInterval.max) ||
      (stats.confidenceInterval.min > 0 && 0 > stats.confidenceInterval.max) ||
      (stats.confidenceInterval.min === 0 &&
        stats.confidenceInterval.max === 0);

    sectionFormattedData.push({
      phase,
      identifierHash: phase,
      isSignificant: !isNotSignificant,
      controlSamples: JSON.stringify(controlValues),
      experimentSamples: JSON.stringify(experimentValues),
      ciMin: stats.confidenceInterval.min,
      ciMax: stats.confidenceInterval.max,
      hlDiff: stats.estimator,
      servers: reportTitles.servers,
    });
  });

  Handlebars.registerHelper('toCamel', val => {
    return val.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
  });

  const template = Handlebars.compile(REPORT_TEMPLATE_RAW);

  return template({
    reportTitles,
    sectionFormattedData,
    sectionFormattedDataJson: JSON.stringify(sectionFormattedData),
  });
}
