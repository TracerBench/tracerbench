import { median } from 'd3-array';
import * as jStat from 'jstat';

import type { IConfidenceInterval } from './stats';
/**
 * Difference of x and y
 *
 * @private
 */
function _defaultModifier(x: number, y: number): number {
  return x - y;
}

/**
 * Apply the passed "func" to the permutations of the items in listOne and listTwo
 *
 * @param listOne - Array of numbers
 * @param listTwo - Array of numbers
 * @param func - Function used to do something with x and y
 */
export function cartesianProduct(
  listOne: number[],
  listTwo: number[],
  func = _defaultModifier
): number[] {
  let results: number[] = [];
  listOne.forEach((x) => {
    listTwo.forEach((y) => {
      results.push(func(x, y));
    });
  });
  results = results.sort((a, b) => a - b);
  return results;
}

/**
 * Calculate the confidence interval of the delta between the two distributions
 *
 * @param distributionOne - Expected to be array of numbers
 * @param distributionTwo - Expected to be array of numbers
 * @param interval - Float between 0 and 1
 */
export function confidenceInterval(
  a: number[],
  b: number[],
  confidence: number
): Omit<IConfidenceInterval, 'isSig'> {
  const aLength = a.length;
  const bLength = b.length;
  const maxU = aLength * bLength;
  const meanU = maxU / 2;

  // subtract every control data point to every experiment data point
  const deltas = a
    .map((a) => b.map((b) => a - b))
    .flat()
    .sort((a, b) => a - b);

  // count the number of "wins" a > b and 0.5 for a tie if a == b
  const U = deltas.reduce(
    (accum, value) => accum + (value < 0 ? 1 : value == 0 ? 0.5 : 0),
    0
  );

  const lowerTail = U <= meanU;

  const standardDeviationU = Math.sqrt((maxU * (aLength + bLength + 1)) / 12);

  // we are estimating a discrete distribution so bias the mean depending on which tail
  // we are computing the pValue for. literally just +/- 0.5
  const continuityCorrection = lowerTail ? 0.5 : -0.5;

  // how many standard deviations the result is given the null hypothesis is true
  const zScore = (U - meanU + continuityCorrection) / standardDeviationU;

  // z is symmetrical, so use lower tail and double the cumulative of U for each tail
  // since this is a two tailed test. normal cumulative distribution function
  const pValue = jStat.normal.cdf(-Math.abs(zScore), 0, 1) * 2;

  const alpha = 1 - confidence;

  const lowerU = Math.round(
    jStat.normal.inv(alpha / 2, meanU + 0.5, standardDeviationU)
  );
  const upperU = Math.round(
    jStat.normal.inv(1 - alpha / 2, meanU + 0.5, standardDeviationU)
  );

  // set percentage delta from control median
  const aMedian = median(a) as number;
  const medianDeltas = median(deltas) as number;

  return {
    min: deltas[lowerU],
    median: medianDeltas ?? 0,
    max: deltas[upperU],
    zScore: +zScore.toPrecision(4),
    pValue: +pValue.toPrecision(4),
    U,
    asPercent: {
      percentMin: +((deltas[lowerU] / aMedian) * 100).toPrecision(4),
      percentMedian: +((medianDeltas / aMedian) * 100).toPrecision(4) ?? 0,
      percentMax: +((deltas[upperU] / aMedian) * 100).toPrecision(4)
    }
  };
}
