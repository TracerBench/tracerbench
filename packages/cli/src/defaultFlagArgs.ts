export const defaultFlagArgs = {
  cpuThrottleRate: 1,
  markers: [
    { start: 'fetchStart', label: 'jquery' },
    { start: 'jqueryLoaded', label: 'ember' },
    { start: 'emberLoaded', label: 'application' },
    { start: 'startRouting', label: 'routing' },
    { start: 'willTransition', label: 'transition' },
    { start: 'didTransition', label: 'render' },
    { start: 'renderEnd', label: 'afterRender' }
  ],
  browserArgs: [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--mute-audio',
    '--v8-cache-options=none',
    '--disable-cache',
    '--disable-v8-idle-tasks',
    '--crash-dumps-dir=./tmp'
  ],
  harsPath: './hars',
  traceOutput: './trace.archive',
  trace: './trace.json',
  file: './trace.json',
  methods: '',
  fidelity: 'low',
  output: 'tracerbench-results'
};
