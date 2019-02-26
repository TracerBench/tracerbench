import { Command, flags } from '@oclif/command';
import {
  control,
  cpu,
  experiment,
  fidelity,
  marker,
  network,
  output,
  url
} from '../flags';

export default class Compare extends Command {
  public static description = 'Creates an automated archive file from a URL.';
  public static flags = {
    control: control({ required: true }),
    cpu: cpu({ required: true }),
    experiment: experiment({ required: true }),
    fidelity: fidelity(),
    marker: marker(),
    network: network(),
    output: output({ required: true }),
    url: url()
  };

  public async run() {
    const { flags } = this.parse(Compare);
    const {
      url,
      output,
      network,
      marker,
      fidelity,
      experiment,
      cpu,
      control
    } = flags;

    // tracerbench compare -c sha -e sha --cpu 4 --url https://www.tracerbench.com -m renderEnd -f low -o ./results.json
    // har-remix, chrome-debugging-client dep?
    // init initial render benchmark for control and experiment
    // init runner
  }
}
