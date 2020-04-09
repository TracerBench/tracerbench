/* eslint-disable filenames/match-exported */
import { Command } from "@oclif/command";
import { IConfig } from "@oclif/config";
export { flags } from "@oclif/command";

import { defaultFlagArgs, ITBConfig } from "../command-config";
export default abstract class TBBaseCommand extends Command {
  public parsedConfig: ITBConfig = defaultFlagArgs;
  // flags explicitly specified within the cli when
  // running the command. these will override all
  public explicitFlags: string[];
  constructor(argv: string[], config: IConfig) {
    super(argv, config);
    this.explicitFlags = argv;
  }
}
