import { Command } from '@oclif/command';
import CreateArchive from './create-archive';

import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import { liveTrace } from 'parse-profile';
import {
  cpuThrottleRate,
  har,
  network,
  traceJSONOutput,
  url,
  archiveOutput,
  iterations
} from '../flags';
import { getCookiesFromHAR } from '../utils';

export default class Trace extends Command {
  public static description = `Creates an automated trace JSON file. Also takes network conditioner and CPU throttling options.`;
  public static flags = {
    cpuThrottleRate: cpuThrottleRate({ required: true }),
    archiveOutput: archiveOutput({ required: true }),
    har: har(),
    network: network(),
    traceJSONOutput: traceJSONOutput({ required: true }),
    url: url({ required: true }),
    iterations: iterations({ required: true })
  };

  public async run() {
    const { flags } = this.parse(Trace);
    const {
      url,
      cpuThrottleRate,
      traceJSONOutput,
      archiveOutput,
      iterations
    } = flags;
    const network = 'none';
    const cpu = cpuThrottleRate;

    let { har } = flags;
    let cookies: any = '';
    let shouldCreateArchive: string = '';

    if (!har) {
      const userResponse: any = await inquirer.prompt([
        {
          choices: [{ name: 'yes' }, { name: 'no' }],
          message: `A HAR file was not found. Would you like TracerBench to record one now for you from ${url}?`,
          name: 'createArchive',
          type: 'list'
        }
      ]);
      shouldCreateArchive = userResponse.createArchive;

      if (shouldCreateArchive === 'yes') {
        await CreateArchive.run([
          '--url',
          url,
          '--archiveOutput',
          archiveOutput
        ]);
        har = archiveOutput;
      } else {
        this.error(
          `A HAR is required to run a trace. Either pass via tracerbench trace --har flag or have TracerBench record one for you.`
        );
      }
    }

    try {
      cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
    } catch (error) {
      try {
        if (har) {
          cookies = getCookiesFromHAR(JSON.parse(fs.readFileSync(har, 'utf8')));
        }
      } catch (error) {
        this.log(
          `Could not extract cookies from cookies.json or HAR file at path ${har}, ${error}`
        );
        cookies = null;
      }
    }

    await liveTrace(url, traceJSONOutput, cookies, {
      cpu,
      network
    });
    return this.log(
      `Trace JSON file successfully generated and available here: ${traceJSONOutput}`
    );
  }
}
