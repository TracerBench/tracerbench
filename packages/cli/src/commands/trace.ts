import { Command } from '@oclif/command';
import CreateArchive from './create-archive';
import * as Listr from 'listr';
import * as fs from 'fs-extra';
import { liveTrace } from 'tracerbench';
import {
  archiveOutput,
  cpuThrottleRate,
  har,
  iterations,
  network,
  traceJSONOutput,
  url,
  analyze,
} from '../helpers/flags';
import { getCookiesFromHAR } from '../helpers/utils';

export default class Trace extends Command {
  public static description = `Creates an automated trace JSON file. Also takes network conditioner and CPU throttling options.`;
  public static flags = {
    cpuThrottleRate: cpuThrottleRate({ required: true }),
    archiveOutput: archiveOutput({ required: true }),
    har: har(),
    network: network(),
    traceJSONOutput: traceJSONOutput({ required: true }),
    url: url({ required: true }),
    iterations: iterations({ required: true }),
    analyze,
  };

  public async run() {
    const { flags } = this.parse(Trace);
    const { url, cpuThrottleRate, traceJSONOutput, archiveOutput } = flags;
    const network = 'none';
    const cpu = cpuThrottleRate;

    let { har } = flags;
    let cookies: any = '';

    const tasks = new Listr([
      {
        title: 'HAR Setup',
        task: () => {
          return new Listr([
            {
              title: `Creating HAR file from ${url}`,
              task: () =>
                new Promise(resolve => {
                  CreateArchive.run([
                    '--url',
                    url,
                    '--archiveOutput',
                    archiveOutput,
                  ]).then(() => {
                    har = archiveOutput;
                    resolve();
                  });
                }),
            },
          ]);
        },
        skip: () => {
          if (har) {
            return 'HAR file found.';
          }
        },
      },
      {
        title: 'Extracting Cookies',
        task: (ctx, task) =>
          new Promise((resolve, reject) => {
            try {
              cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
              task.title = `Extracting cookies from cookies.json`;
              ctx.cookies = true;
              resolve();
            } catch (error) {
              try {
                if (har) {
                  cookies = getCookiesFromHAR(
                    JSON.parse(fs.readFileSync(har, 'utf8'))
                  );
                  task.title = `Extracting cookies from HAR ${har}`;
                  resolve();
                }
              } catch (error) {
                this.error(
                  `Could not extract cookies from cookies.json or HAR file at path ${har}, ${error}`
                );
                cookies = null;
                reject();
              }
            }
          }),
      },
      {
        title: 'Running Live Trace',
        task: () =>
          new Promise(resolve => {
            liveTrace(url, traceJSONOutput, cookies, {
              cpu,
              network,
            }).then(() => {
              resolve();
            });
          }),
      },
    ]);

    tasks.run().catch((err: any) => {
      this.error(err);
    });
  }
}
