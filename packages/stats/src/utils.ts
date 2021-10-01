/**
 * Convert microseconds to milliseconds
 *
 * @param ms - Microseconds as either string or number
 */
export function convertMicrosecondsToMS(ms: string | number): number {
  ms = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  return Math.floor(ms * 100) / 100000;
}

/**
 * Convert milliseconds to microseconds
 *
 * @param ms - Milliseconds as either string or number
 */
export function convertMSToMicroseconds(ms: string | number): number {
  ms = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  return Math.floor(ms * 1000);
}

/**
 * Round a float to hundreth decimal place
 *
 * @param n - Float as a number
 */
export function toNearestHundreth(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Round a float in microseconds and convert it to milliseconds
 *
 * @param ms - Microseconds float as a string or number
 */
export function roundFloatAndConvertMicrosecondsToMS(
  ms: string | number
): number {
  ms = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  ms = Math.floor(ms * 100) / 100000;
  return Math.round(ms);
}
