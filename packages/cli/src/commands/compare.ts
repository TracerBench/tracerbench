import { Command, flags } from '@oclif/command';
import { harTrace } from 'parse-profile';
import { networkConditions } from 'parse-profile';

export default class Compare extends Command {
  public static description = 'Creates an automated archive file from a URL.';
  public static flags = {
    control: flags.string({
      char: 'c',
      description: 'the path to the control sha',
      required: true
    }),
    cpu: flags.integer({
      default: 1,
      description: 'cpu throttle multiplier',
      required: true
    }),
    experiment: flags.string({
      char: 'e',
      description: 'the path to the experiment sha',
      required: true
    }),
    fidelity: flags.string({
      char: 'f',
      default: 'low',
      description: `directly correlates to the number of samples per trace. high means a longer trace time.`,
      options: ['low', 'high']
    }),
    marker: flags.string({
      char: 'm',
      default: 'renderEnd',
      description: `DOM render complete marker`
    }),
    network: flags.string({
      char: 'n',
      description: `simulated network conditions.`,
      options: [`${Object.keys(networkConditions).join(', ')}`]
    }),
    output: flags.string({
      char: 'o',
      default: './tracerbench-results.json',
      description: 'the output file',
      required: true
    }),
    url: flags.string({
      char: 'u',
      description: 'url to visit'
    })
  };

  public async run() {
    const { flags } = this.parse(Compare);
    const { url, output, network } = flags;
  }
}
