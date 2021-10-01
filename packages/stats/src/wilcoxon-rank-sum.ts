// ! we are not using this ATM; rather using the conf interval isSig
// all exports are alpha of 0.05 for two-tailed tests
// using (array length) as N value up to 25 anything over uses normal approximation
// unpaired data with two samples
// also known as the mann-whitney-test
// prettier-ignore

export const wilcoxonRankSumTable = [0,0,0,10,17,26,36,49,62,78,96,115,136,160,184,211,240,270,303,337,373,411,451,491,536];

interface ISample {
  val: number;
  rank: number;
  pool: number[];
  samples: number[];
}
// prettier-ignore
export function getMergedSortedSamples(control: number[], experiment: number[]): number[] {
  return [...control, ...experiment].sort((a, b) => a - b);
}

export function getSamples(a: number[], pool: number[]): ISample[] {
  a.sort((a, b) => a - b);
  return a.map((val) => {
    return {
      val,
      rank: 0,
      pool,
      samples: a
    };
  });
}
// prettier-ignore
export function rankSamples(samples: ISample[]): ISample[] {
  const sa = samples;

  sa.forEach((sample) => {
    sample.pool.forEach((p, i) => {
      if (sample.val === p) {
        sample.rank = i + 1;
      }
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function countDuplicates(obj: any, num: number): number{
    obj[num] = (++obj[num] || 1);
    return obj;
  }
  sa.forEach((sample) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const acc = sample.pool.reduce(countDuplicates, {} as any);
    if (acc[sample.val] > 1) {
      sample.rank = (sample.rank - 0.5);
    }
  });

  return sa;
}

export function getRankSum(rankedSamples: ISample[]): number {
  return rankedSamples.reduce((currentSum, sample) => {
    return currentSum + sample.rank;
  }, 0);
}

export function getSampleUStat(rankSum: number, N: number): number {
  return rankSum - (N * (N + 1)) / 2;
}

/**
 * Wilcoxon Rank Sum Test
 * independent test of 2 groups tested once
 * un-paired two-tailed test alpha 0.05 critical values
 *
 * @param control - Control as array of numbers
 * @param experiment - Experiment as array of numbers
 */
export function getWilcoxonRankSumTest(
  control: number[],
  experiment: number[]
): boolean {
  const N = control.length;
  const samplePool = getMergedSortedSamples(control, experiment);
  const controlSamples = getSamples(control, samplePool);
  const experimentSamples = getSamples(experiment, samplePool);
  const rankedControlSamples = rankSamples(controlSamples);
  const rankedExperimentSamples = rankSamples(experimentSamples);
  const controlRankSum = getRankSum(rankedControlSamples);
  const experimentRankSum = getRankSum(rankedExperimentSamples);
  const uStatControl = getSampleUStat(controlRankSum, N);
  const uStatExperiment = getSampleUStat(experimentRankSum, N);
  const uStat = Math.min(uStatControl, uStatExperiment);

  if (N > 25) {
    throw new Error(
      `Sample sizes greater than 25 are not supported. Your sample size is ${N}`
    );
  }

  const uCrit = wilcoxonRankSumTable[N];

  // !! important this is lt not gt
  return uStat < uCrit;
}
