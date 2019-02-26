import { Command } from '@oclif/command';
import * as fs from 'fs-extra';
import { liveTrace } from 'parse-profile';
import { cpu, har, network, traceOutput, url } from '../flags';
import { getCookiesFromHAR } from '../utils';

export default class Trace extends Command {
  public static description = `Creates an automated trace that's saved to JSON. Also takes network conditioner and CPU throttling options.`;
  public static flags = {
    cpu: cpu({ required: true }),
    har: har({ required: true }),
    network: network(),
    traceOutput: traceOutput({ required: true }),
    url: url({ required: true })
  };

  public async run() {
    const { flags } = this.parse(Trace);
    const { url, har, traceOutput, cpu } = flags;
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

    await liveTrace(url, traceOutput, cookies, { cpu, network });
    return this.log(
      `Trace successfully generated and available here: ${traceOutput}`
    );
  }
}
