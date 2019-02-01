import { Command, flags } from '@oclif/command';
import { CLI } from 'parse-profile';

export default class Analyze extends Command {
  public static description =
    'Parses a CPU profile and aggregates time across heuristics. Can be vertically sliced with event names.';
  public static flags = {
    archive: flags.string({
      char: 'a',
      description: 'Path to archive file',
      required: true
    }),
    event: flags.string({
      char: 'e',
      description:
        'Slice time and see the events before and after the time slice'
    }),
    file: flags.string({
      char: 'f',
      description: 'Path to trace json file',
      required: true
    }),
    methods: flags.string({
      char: 'm',
      default: '""',
      description: 'List of methods to aggregate',
      required: true
    }),
    report: flags.string({
      char: 'r',
      description:
        'Directory path to generate a report with aggregated sums for each heuristic category and aggregated sum across all heuristics'
    })
  };

  public async run() {
    const { flags } = this.parse(Analyze);
    const archive = flags.archive;
    const event = flags.event;
    const file = flags.file;
    const methods = flags.methods.split(',');
    const report = flags.report;
    const cli = new CLI({
      archive,
      event,
      file,
      methods,
      report
    });

    // TODO: lynchbomb 01.30.2019 - porting this 1:1 from pp for now for parity
    // all of the cli/cli.run methods should be unraveled from `CommandLine` class

    // await cli.run();
    return this.log(`Analyze successful: ${cli}`);
  }
}
