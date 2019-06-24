import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs-extra';
import { confidenceInterval } from './statistics/confidence-interval';
import { Stats } from './statistics/stats';

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
}

const PAGE_LOAD_TIME = 'duration';
const NORMALIZE = 1000;
const CHART_CSS = fs.readFileSync(
  path.join(`${process.cwd()}`, '/src/static/chart-bootstrap.css'),
  'utf8'
);
const CHART_JS = fs.readFileSync(
  path.join(`${process.cwd()}`, '/src/static/chartjs-2.8.0-chart.min.js'),
  'utf8'
);

let REPORT_TEMPLATE_RAW = fs.readFileSync(
  path.join(`${process.cwd()}`, '/src/static/report-template.hbs'),
  'utf8'
);

REPORT_TEMPLATE_RAW = REPORT_TEMPLATE_RAW.toString()
  .replace(
    '{{!-- TRACERBENCH-CHART-BOOTSTRAP.CSS --}}',
    `<style>${CHART_CSS}</style>`
  )
  .replace('{{!-- TRACERBENCH-CHART-JS --}}', `<script>${CHART_JS}</script>`);

export default function createConsumeableHTML(
  controlData: ITracerBenchTraceResult,
  experimentData: ITracerBenchTraceResult
): string {
  /**
   * Extract the phases and page load time latency into sorted buckets by phase
   *
   * @param samples - Array of "sample" objects
   */
  function bucketPhaseValues(samples: Sample[]): { [key: string]: number[] } {
    const buckets: { [key: string]: number[] } = { [PAGE_LOAD_TIME]: [] };

    samples.forEach((sample: Sample) => {
      buckets[PAGE_LOAD_TIME].push(sample[PAGE_LOAD_TIME] / NORMALIZE);
      sample.phases.forEach(phaseData => {
        const bucket = buckets[phaseData.phase] || [];
        bucket.push(phaseData.duration / NORMALIZE);
        buckets[phaseData.phase] = bucket;
      });
    });

    Object.keys(buckets).forEach(phase => {
      buckets[phase].sort();
    });

    return buckets;
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
    const cInterval = confidenceInterval(controlValues, experimentValues, 0.95);
    const isNotSignificant =
      (cInterval[0] < 0 && 0 < cInterval[1]) ||
      (cInterval[0] > 0 && 0 > cInterval[1]);
    sectionFormattedData.push({
      phase,
      identifierHash: phase,
      isSignificant: !isNotSignificant,
      controlSamples: JSON.stringify(controlValues),
      experimentSamples: JSON.stringify(experimentValues),
      ciMin: Math.ceil(cInterval[0] * 100) / 100,
      ciMax: Math.ceil(cInterval[1] * 100) / 100,
      hlDiff: Math.ceil(stats.estimator * 100) / 100,
    });
  });

  Handlebars.registerHelper('toCamel', (val) => {
    return val.replace(/-([a-z])/g, (g:string) => g[1].toUpperCase());
  });

  const template = Handlebars.compile(REPORT_TEMPLATE_RAW);

  return template({
    sectionFormattedData,
    sectionFormattedDataJson: JSON.stringify(sectionFormattedData),
  });
}
