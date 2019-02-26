import { flags } from '@oclif/command';
import { networkConditions } from 'parse-profile';
import { getConfigDefault } from './utils';

export const traceOutput = flags.build({
  default: () => getConfigDefault('archiveOutput') || './trace.archive',
  description: 'The archive output file name'
});

export const archiveOutput = flags.build({
  default: () => getConfigDefault('archiveOutput') || './trace.json',
  description: 'The output filepath/name to save the trace to'
});

export const archive = flags.build({
  char: 'a',
  default: () => getConfigDefault('archive'),
  description: 'Path to archive file'
});

export const event = flags.build({
  default: () => getConfigDefault('event'),
  description: 'Slice time and see the events before and after the time slice'
});

export const file = flags.build({
  char: 'f',
  default: () => getConfigDefault('file') || './trace.json',
  description: 'Path to the trace JSON file'
});

export const methods = flags.build({
  char: 'm',
  default: () => getConfigDefault('methods'),
  description: 'List of methods to aggregate'
});

export const report = flags.build({
  char: 'r',
  default: () => getConfigDefault('report'),
  description:
    'Directory path to generate a report with aggregated sums for each heuristic category and aggregated sum across all heuristics'
});

export const cpuThrottle = flags.build({
  default: () => getConfigDefault('cpu') || 1,
  description: 'CPU throttle multiplier'
});

export const control = flags.build({
  char: 'c',
  default: () => getConfigDefault('control'),
  description: 'The path to the control SHA'
});

export const experiment = flags.build({
  char: 'e',
  default: () => getConfigDefault('experiment'),
  description: 'The path to the experiment SHA'
});

export const fidelity = flags.build({
  default: () => getConfigDefault('fidelity') || 'low',
  description:
    'Directly correlates to the number of samples per trace. High means a longer trace time.',
  options: ['low', 'high']
});

export const marker = flags.build({
  default: () => getConfigDefault('marker'),
  description: 'DOM render complete marker'
});

export const network = flags.build({
  char: 'n',
  default: () => getConfigDefault('network'),
  description: 'Simulated network conditions.',
  options: [`${Object.keys(networkConditions).join(', ')}`]
});

export const output = flags.build({
  char: 'o',
  default: () => getConfigDefault('output') || './tracerbench-results.json',
  description: 'The output JSON file'
});

export const url = flags.build({
  char: 'u',
  default: () => getConfigDefault('url'),
  description: 'URL to visit'
});

export const locations = flags.build({
  char: 'l',
  default: () => getConfigDefault('locations'),
  description: 'include locations in names'
});

export const har = flags.build({
  char: 'h',
  default: () => getConfigDefault('har'),
  description: 'Filepath to the HAR file'
});

export const filter = flags.build({
  default: () => getConfigDefault('filter'),
  description: 'User timing marks start with'
});

export const marks = flags.build({
  default: () => getConfigDefault('marks'),
  description: 'Show user timing marks'
});

export const urlOrFrame = flags.build({
  default: () => getConfigDefault('urlOrFrame'),
  description: 'URL or Frame'
});
