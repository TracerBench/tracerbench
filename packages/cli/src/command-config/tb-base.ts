import { Command } from '@oclif/command';
import { IConfig } from '@oclif/config';

export { flags } from '@oclif/command';

export default abstract class TBBaseCommand extends Command {
  constructor(argv: string[], config: IConfig) {
    super(argv, config);
  }
}
