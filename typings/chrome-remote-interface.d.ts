declare module "chrome-remote-interface" {
  import { EventEmitter } from "events";
  export class Chrome extends EventEmitter {
    constructor(options: {
      host?: string,
      port?: number,
      protocol?: string,
      chooseTab?: (tabs:any[]) => number
    }, notifier: any);
  }
}

// options = options || {};
// self.host = options.host || defaults.HOST;
// self.port = options.port || defaults.PORT;
// self.protocol = options.protocol;
// self.chooseTab = options.chooseTab || function() { return 0; };
