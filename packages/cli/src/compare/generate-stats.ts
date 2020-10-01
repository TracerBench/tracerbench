import { convertMicrosecondsToMS, Stats } from "@tracerbench/stats";

import { md5sum } from "../helpers/utils";

export interface ParsedTitleConfigs {
  servers: Array<{ name: string }>;
  plotTitle: string | undefined;
  browserVersion: string;
}

export type Sample = {
  duration: number;
  js: number;
  phases: Array<{
    phase: string;
    start: number;
    duration: number;
  }>;
};

export interface ITracerBenchTraceResult {
  meta: {
    browserVersion: string;
    cpus: string[];
    "product-version": string;
  };
  samples: Sample[];
  set: string;
}

type FormattedStatsSamples = {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
  samplesMS: number[];
};

export interface HTMLSectionRenderData {
  stats: Stats;
  isSignificant: boolean;
  ciMin: number;
  ciMax: number;
  hlDiff: number;
  phase: string;
  identifierHash: string;
  sampleCount: number;
  servers?: Array<{ name: string }>;
  controlFormatedSamples: FormattedStatsSamples;
  experimentFormatedSamples: FormattedStatsSamples;
}

type ValuesByPhase = {
  [key: string]: number[];
};

type ValueGen = {
  start: number;
  duration: number;
};

type CumulativeData = {
  categories: string[];
  controlData: number[][];
  experimentData: number[][];
};

// takes control/experimentData as raw samples in microseconds
export class GenerateStats {
  controlData: ITracerBenchTraceResult;
  experimentData: ITracerBenchTraceResult;
  reportTitles: ParsedTitleConfigs;
  durationSection: HTMLSectionRenderData;
  subPhaseSections: HTMLSectionRenderData[];
  cumulativeData: CumulativeData;
  constructor(
    controlData: ITracerBenchTraceResult,
    experimentData: ITracerBenchTraceResult,
    reportTitles: ParsedTitleConfigs
  ) {
    this.controlData = controlData;
    this.experimentData = experimentData;
    this.reportTitles = reportTitles;

    const { durationSection, subPhaseSections } = this.generateData(
      this.controlData.samples,
      this.experimentData.samples,
      this.reportTitles
    );
    this.durationSection = durationSection;
    this.subPhaseSections = subPhaseSections;

    this.cumulativeData = this.bucketCumulative(
      this.controlData.samples,
      this.experimentData.samples
    );
  }

  private generateData(
    controlDataSamples: Sample[],
    experimentDataSamples: Sample[],
    reportTitles: ParsedTitleConfigs
  ): {
    durationSection: HTMLSectionRenderData;
    subPhaseSections: HTMLSectionRenderData[];
  } {
    const valuesByPhaseControl = this.bucketPhaseValues(controlDataSamples);
    const valuesByPhaseExperiment = this.bucketPhaseValues(
      experimentDataSamples
    );
    const subPhases = Object.keys(valuesByPhaseControl).filter(
      (k) => k !== "duration"
    );
    const durationSection = this.formatPhaseData(
      valuesByPhaseControl["duration"],
      valuesByPhaseExperiment["duration"],
      "duration"
    );

    const subPhaseSections: HTMLSectionRenderData[] = subPhases.map((phase) => {
      const controlValues = valuesByPhaseControl[phase];
      const experimentValues = valuesByPhaseExperiment[phase];
      const renderDataForPhase = this.formatPhaseData(
        controlValues,
        experimentValues,
        phase
      );

      renderDataForPhase.servers = reportTitles.servers;
      return renderDataForPhase as HTMLSectionRenderData;
    });

    durationSection.servers = reportTitles.servers;

    return {
      durationSection,
      subPhaseSections,
    };
  }

  /**
   * Extract the phases and page load time latency into sorted buckets by phase
   *
   * @param samples - Array of "sample" objects
   * @param valueGen - Calls this function to extract the value from the phase. A
   *   "phase" is passed containing duration and start
   */
  private bucketPhaseValues(
    samples: Sample[],
    valueGen: (a: ValueGen) => number = (a: ValueGen) => a.duration
  ): ValuesByPhase {
    const buckets: { [key: string]: number[] } = { ["duration"]: [] };

    samples.forEach((sample: Sample) => {
      buckets["duration"].push(sample["duration"]);

      sample.phases.forEach((phaseData) => {
        const bucket = buckets[phaseData.phase] || [];
        bucket.push(valueGen(phaseData));
        buckets[phaseData.phase] = bucket;
      });
    });

    return buckets;
  }

  /**
   * Instantiate the TB Stats Class. Format the data into HTMLSectionRenderData
   * structure.
   *
   * @param controlValues - Values for the control for the phase in microseconds not arranged
   * @param experimentValues - Values for the experiment for the phase in microseconds not arranged
   * @param phaseName - Name of the phase the values represent
   */
  private formatPhaseData(
    controlValues: number[],
    experimentValues: number[],
    phaseName: string
  ): HTMLSectionRenderData {
    const stats = new Stats({
      control: controlValues,
      experiment: experimentValues,
      name: phaseName,
    });

    const estimatorIsSig = Math.abs(stats.estimator) >= 1 ? true : false;

    return {
      stats,
      phase: phaseName,
      identifierHash: md5sum(phaseName),
      isSignificant: stats.confidenceInterval.isSig && estimatorIsSig,
      sampleCount: stats.sampleCount.control,
      ciMin: stats.confidenceInterval.min,
      ciMax: stats.confidenceInterval.max,
      hlDiff: stats.estimator,
      servers: undefined,
      controlFormatedSamples: {
        min: stats.sevenFigureSummary.control.min,
        q1: stats.sevenFigureSummary.control[25],
        median: stats.sevenFigureSummary.control[50],
        q3: stats.sevenFigureSummary.control[75],
        max: stats.sevenFigureSummary.control.max,
        outliers: stats.outliers.control.outliers,
        samplesMS: stats.controlMS,
      },
      experimentFormatedSamples: {
        min: stats.sevenFigureSummary.experiment.min,
        q1: stats.sevenFigureSummary.experiment[25],
        median: stats.sevenFigureSummary.experiment[50],
        q3: stats.sevenFigureSummary.experiment[75],
        max: stats.sevenFigureSummary.experiment.max,
        outliers: stats.outliers.experiment.outliers,
        samplesMS: stats.experimentMS,
      },
    };
  }

  /**
   * Bucket the data for the cumulative chart. Ensure to convert to
   * milliseconds for presentation. Does not mutate samples.
   */
  private bucketCumulative(
    controlDataSamples: Sample[],
    experimentDataSamples: Sample[]
  ): CumulativeData {
    // round and convert from micro to milliseconds
    const cumulativeValueFunc = (a: { [key: string]: number }): number =>
      Math.round(convertMicrosecondsToMS(a.start + a.duration));

    const valuesByPhaseControl = this.bucketPhaseValues(
      controlDataSamples,
      cumulativeValueFunc
    );
    const valuesByPhaseExperiment = this.bucketPhaseValues(
      experimentDataSamples,
      cumulativeValueFunc
    );
    const phases = Object.keys(valuesByPhaseControl).filter(
      (k) => k !== "duration"
    );

    return {
      categories: phases,
      controlData: phases.map((k) => valuesByPhaseControl[k]),
      experimentData: phases.map((k) => valuesByPhaseExperiment[k]),
    };
  }
}
