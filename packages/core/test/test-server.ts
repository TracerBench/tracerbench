import * as express from 'express';
import { createParser } from 'dashdash';
import { Results, Option } from 'dashdash';

(async function() {
  const app = express();

  type ServerOpt = {
    port: number;
    staticAssetFolder: string;
  }
  async function startServer(): Promise<void> {
    const { port, staticAssetFolder } = initServerOption();
    app.use(express.static(staticAssetFolder));

    return new Promise((resolve) => {
      app.listen(port, () => {
        console.log(`Ready to serve test pages at http://localhost:${port}`);
        resolve();
      });
    });
  }

  function initServerOption(): ServerOpt {
    const options: Option[] = [
      {
        name: 'port',
        type: 'number',
        help: 'server port to listen to',
      }, {
        name: 'staticAssetFolder',
        type: 'string',
        help: 'directory of static assets',
        default: 'build'
      },
      {
        names: ['help', 'h'],
        type: 'bool',
        help: 'Print this help and exit.'
      }
    ];

    const parser = createParser({ options: options });
    let opts: Results;
    let serverOpt: ServerOpt;
    try {
      opts = parser.parse(process.argv);
      serverOpt = {
        port: opts.port,
        staticAssetFolder: opts.staticAssetFolder
      }
    } catch (e) {
      console.error('server start up option error: %s', (e as Error).message);
      process.exit(1);
    }
    return serverOpt;
  }

  await startServer();
})();