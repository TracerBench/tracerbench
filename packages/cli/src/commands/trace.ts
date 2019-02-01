import { Command, flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { liveTrace, networkConditions } from 'parse-profile';
import { getCookiesFromHAR } from '../utils';

export default class Trace extends Command {
  public static description = `Creates an automated trace that's saved to JSON. Also takes network conditioner and CPU throttling options.`;
  public static flags = {
    cpu: flags.integer({
      char: 'c',
      default: 1,
      description: 'cpu throttle multiplier',
      required: true
    }),
    har: flags.string({
      char: 'h',
      description: 'filepath to the HAR file',
      required: true
    }),
    network: flags.string({
      char: 'n',
      description: `simulated network conditions for: ${Object.keys(
        networkConditions
      ).join(', ')}`
    }),
    output: flags.string({
      char: 'o',
      default: 'trace.json',
      description: 'the output filepath/name to save the trace to',
      required: true
    }),
    url: flags.string({
      char: 'u',
      description: 'url to visit',
      required: true
    })
  };

  public async run() {
    const { flags } = this.parse(Trace);
    const url = flags.url;
    const har = flags.har;
    const output = flags.output;
    const cpu = flags.cpu;
    const network = 'none';

    let cookies: any = '';

    try {
      cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
    } catch (error) {
      try {
        cookies = getCookiesFromHAR(JSON.parse(fs.readFileSync(har, 'utf8')));
      } catch (error) {
        this.log(
          `Could not extract cookies from HAR file at path ${har}, ${error}`
        );
        cookies = null;
      }
    }

    await liveTrace(url, output, cookies, { cpu, network });
    return this.log(
      `Trace successfully generated and available here: ${output}`
    );
  }
}
