import { Command } from '@oclif/command';
import { CLI } from 'parse-profile';
import { archive, event, file, methods, report } from '../flags';

export default class Analyze extends Command {
  public static description =
    'Parses a CPU profile and aggregates time across heuristics. Can be vertically sliced with event names.';
  public static flags = {
    archive: archive({ required: true }),
    event: event(),
    file: file({ required: true }),
    methods: methods({ required: true }),
    report: report()
  };

  public async run() {
    const { flags } = this.parse(Analyze);
    const { archive, event, file, report } = flags;
    const methods = flags.methods.split(',');

    const cli = new CLI({
      archive,
      event,
      file,
      methods,
      report
    });

    // TODO: lynchbomb 01.30.2019 - porting this 1:1 from pp for now for parity
    // all of the cli/cli.run methods should be unraveled from `CommandLine` class

    await cli.run();
  }
}
