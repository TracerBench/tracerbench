import { median } from 'd3-array';
import * as jStat from 'jstat';

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
): {
  lower: number;
  median: number;
  upper: number;
  U: number;
  zScore: number;
  pValue: number;
} {
  const aLength = a.length;
  const bLength = b.length;
  const maxU = aLength * bLength;
  const meanU = maxU / 2;

  const deltas = a
    .map((a) => b.map((b) => a - b))
    .flat()
    .sort((a, b) => a - b);

  const U = deltas.reduce(
    (accum, value) => accum + (value < 0 ? 1 : value == 0 ? 0.5 : 0),
    0
  );

  const lowerTail = U <= meanU;

  const standadDeviationU = Math.sqrt((maxU * (aLength + bLength + 1)) / 12);

  // we are estimating a discrete distribution so bias the mean depending on which tail
  // we are computing the pValue for
  const continuityCorrection = lowerTail ? 0.5 : -0.5;

  const zScore = (U - meanU + continuityCorrection) / standadDeviationU;

  // z is symmetrical, so use lower tail and double the cumulative for each tail
  // since this is a two tailed test
  const pValue = jStat.normal.cdf(-Math.abs(zScore), 0, 1) * 2;

  const alpha = 1 - confidence;

  const lowerU = Math.round(
    jStat.normal.inv(alpha / 2, meanU + 0.5, standadDeviationU)
  );
  const upperU = Math.round(
    jStat.normal.inv(1 - alpha / 2, meanU + 0.5, standadDeviationU)
  );

  return {
    lower: deltas[lowerU],
    median: median(deltas) ?? 0,
    upper: deltas[upperU],
    zScore,
    pValue,
    U
  };
}
