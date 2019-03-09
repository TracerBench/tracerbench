import { Command } from '@oclif/command';
import CreateArchive from './create-archive';

import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import { liveTrace } from 'parse-profile';
import {
  defaultFlagArgs,
  cpuThrottleRate,
  har,
  network,
  traceJSONOutput,
  url
} from '../flags';
import { getCookiesFromHAR } from '../utils';

export default class Trace extends Command {
  public static description = `Creates an automated trace JSON file. Also takes network conditioner and CPU throttling options.`;
  public static flags = {
    cpuThrottleRate: cpuThrottleRate({ required: true }),
    // takes in trace.har
    har: har(),
    network: network(),
    // outputs trace.json
    traceJSONOutput: traceJSONOutput({ required: true }),
    url: url({ required: true })
  };

  public async run() {
    const { flags } = this.parse(Trace);
    const { url, cpuThrottleRate, traceJSONOutput } = flags;
    const network = 'none';
    const cpu = cpuThrottleRate;
    const harOutput = defaultFlagArgs.harOutput;

    let { har } = flags;
    let cookies: any = '';
    let shouldCreateArchive: string = '';

    // todo
    // trace is only outputting trace.har and not trace.json
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
        // create trace.har
        await CreateArchive.run(['--url', url, '--archiveOutput', harOutput]);
        har = harOutput;
      } else {
        this.error(
          `A HAR is required to run a trace. Either pass via tracerbench trace --har flag or have TracerBench record one for you.`
        );
      }
    }

    // cookies stuff
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

    // in: trace.har
    // out: trace.json
    await liveTrace(url, traceJSONOutput, cookies, {
      cpu,
      network
    });
    return this.log(
      `Trace JSON file successfully generated and available here: ${traceJSONOutput}`
    );
  }
}
