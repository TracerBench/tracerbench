import { flags } from '@oclif/command';
import { getConfigDefault } from './utils';

export const archive = flags.build({
  char: 'a',
  default: () => getConfigDefault('archive'),
  description: 'Path to archive file'
});

export const event = flags.build({
  char: 'e',
  description: 'Slice time and see the events before and after the time slice'
});

export const file = flags.build({
  char: 'f',
  default: () => getConfigDefault('file'),
  description: 'Path to trace json file'
});

export const methods = flags.build({
  char: 'm',
  default: () => getConfigDefault('methods'),
  description: 'List of methods to aggregate'
});

export const report = flags.build({
  char: 'r',
  description:
    'Directory path to generate a report with aggregated sums for each heuristic category and aggregated sum across all heuristics'
});
