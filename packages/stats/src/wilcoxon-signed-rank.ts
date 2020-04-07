// ! we are not using this ATM; rather using the conf interval isSig
// all exports are alpha of 0.05 for two-tailed tests
// using (array length) as N value up to 50
// prettier-ignore
const wilcoxonSignedRanksTable = [
  0,0,0,0,0,0,2,3,5,8,10,13,17,21,25,29,34,40,46,52,58,65,73,81,89,98,107,116,126,
  137,147,159,170,182,195,208,221,235,249,264,279,294,310,327,343,361,378,396,415,434,
];

interface ISample {
  c: number;
  e: number | string;
  diff: number;
  absDiff: number;
  rank: number;
}

export function getSamples(control: number[], experiment: number[]): ISample[] {
  return control.map((c, i) => {
    return {
      c,
      e: experiment[i],
      diff: experiment[i] - c,
      absDiff: Math.abs(experiment[i] - c),
      rank: 0
    };
  });
}

// sort by absolute difference
export function sortSamples(samples: ISample[]): ISample[] {
  return samples.sort((a, b) => {
    return a.absDiff - b.absDiff;
  });
}

// rank based on sorted samples
export function rankSamples(sortedSamples: ISample[]): ISample[] {
  const ss = sortedSamples;
  ss.slice().map(s => {
    s.rank = ss.indexOf(s) + 1;
  });
  return ss;
}

export function getTMinusVal(rankedSamples: ISample[]): number {
  return rankedSamples.reduce((currentSum, sample) => {
    if (Math.sign(sample.diff) === -1) {
      return currentSum + sample.rank;
    }
    return currentSum;
  }, 0);
}

export function getTPlusVal(rankedSamples: ISample[]): number {
  return rankedSamples.reduce((currentSum, sample) => {
    if (Math.sign(sample.diff) === 1 || Math.sign(sample.diff) === 0) {
      return currentSum + sample.rank;
    }
    return currentSum;
  }, 0);
}

// paired two-tailed test alpha 0.05 critical values
export function getWilcoxonSignedRankTest(
  control: number[],
  experiment: number[]
): boolean {
  const N = control.length;
  const samples = getSamples(control, experiment);
  const sortedSamples = sortSamples(samples);
  const rankedSamples = rankSamples(sortedSamples);
  const tMinusVal = getTMinusVal(rankedSamples);
  const tPlusVal = getTPlusVal(rankedSamples);
  const wStat = Math.min(tMinusVal, tPlusVal);

  try {
    const wCrit = wilcoxonSignedRanksTable[N];
    // !! important this is lt not gt
    return wStat < wCrit;
  } catch (e) {
    throw new Error(
      `Sample sizes greater than 50 are not supported. Your sample size is ${N}`
    );
  }
}
