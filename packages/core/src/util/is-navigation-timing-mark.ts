const navigationMarks = {
  workerStart: true,
  redirectStart: true,
  redirectEnd: true,
  fetchStart: true,
  domainLookupStart: true,
  domainLookupEnd: true,
  connectStart: true,
  connectEnd: true,
  secureConnectionStart: true,
  requestStart: true,
  responseStart: true,
  responseEnd: true,
  unloadEventStart: true,
  unloadEventEnd: true,
  domInteractive: true,
  domContentLoadedEventStart: true,
  domContentLoadedEventEnd: true,
  domComplete: true,
  loadEventStart: true,
  loadEventEnd: true
} as { [mark: string]: true | undefined };

export default function isNavigationTimingMark(mark: string): boolean {
  return navigationMarks[mark] === true;
}
