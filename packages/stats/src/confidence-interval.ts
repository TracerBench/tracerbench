const jStat = require('jstat').jStat;

/**
 * Difference of x and y
 *
 * @private
 */
function _defaultModifier(x: number, y: number) {
  return x - y;
}

/**
 * Apply the passed "_func" to the permutations of the items in listOne and listTwo
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
  listOne.forEach(x => {
    listTwo.forEach(y => {
      results.push(func(x, y));
    });
  });
  results = results.sort((a, b) => a - b);
  return results;
}

/**
 * Calculate the confidence interval of the difference between the two distributions
 *
 * @param distributionOne - Expected to be array of numbers
 * @param distributionTwo - Expected to be array of numbers
 * @param interval - Float between 0 and 1
 */
export function confidenceInterval(
  distributionOne: number[],
  distributionTwo: number[],
  interval: number
): [number, number] {
  const distributionOneLength = distributionOne.length;
  const distributionTwoLength = distributionTwo.length;

  const lengthsMultiplied = distributionOneLength * distributionTwoLength;
  const sqrtOfSomething = Math.sqrt(
    (lengthsMultiplied * (distributionOneLength + distributionTwoLength + 1)) /
      12
  );
  const other =
    jStat.normal.inv(1 - (1 - interval) / 2, 0, 1) * sqrtOfSomething;
  const ca = Math.floor(
    (distributionOneLength * distributionTwoLength) / 2 - other
  );
  const diffs = cartesianProduct(distributionOne, distributionTwo);
  return [
    diffs[ca - 1],
    diffs[distributionOneLength * distributionTwoLength - ca]
  ];
}
