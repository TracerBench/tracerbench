export function convertMicrosecondsToMS(ms: string | number): number {
  ms = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  return Math.floor(ms * 100) / 100000;
}

export function convertMSToMicroseconds(ms: string | number): number {
  ms = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  return Math.floor(ms * 1000);
}

export function toNearestHundreth(n: number): number {
  return Math.round(n * 100) / 100;
}

export function roundFloatAndConvertMicrosecondsToMS(
  ms: string | number
): number {
  ms = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  ms = Math.floor(ms * 100) / 100000;
  return Math.round(ms);
}

export function fillArray(arrLngth: number, incr = 1, strt = 0): number[] {
  const a = [];
  while (a.length < arrLngth) {
    if (a.length < 1) {
      a.push(strt);
    }
    a.push(strt + incr);
    strt = strt + incr;
  }
  return a;
}
