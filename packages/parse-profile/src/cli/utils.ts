import * as childProcess from 'child_process';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';
import { Hash } from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Trace } from '../trace';

// tslint:disable:no-console

export interface Categories {
  [key: string]: string[];
}

export function computeMinMax(trace: Trace, start: string = 'navigationStart', end: string) {
  let min;
  let max;
  if (end) {
    // TODO harden this to find the correct frame
    let startEvent = trace.events.find(e => e.name === start)!;
    let endEvent = trace.events.find(e => e.name === end);

    if (!endEvent) {
      throw new Error(`Could not find "${end}" marker in the trace.`);
    }

    min = startEvent.ts;
    max = endEvent.ts;
  } else {
    min = -1;
    max = -1;
  }

  return { min, max };
}

export function methodsFromCategories(categories: Categories) {
  return Object.keys(categories).reduce((accum: string[], category: string) => {
    accum.push(...categories[category]);
    return accum;
  }, []);
}

export function formatCategories(report: string | undefined, methods: string[]) {
  if (report) {
    let stats =  fs.statSync(report);
    let _categories: Categories = {};
    if (stats.isDirectory()) {
      let files = fs.readdirSync(report);

      files.map(file => {
        let name = path.basename(file).replace('.json', '');
        // tslint:disable-next-line:no-shadowed-variable
        let methods = JSON.parse(fs.readFileSync(`${report}/${file}`, 'utf8'));
        _categories[name] = methods;
      });

    } else {
      let category = path.basename(report).replace('.json', '');
      _categories[category] = JSON.parse(fs.readFileSync(report, 'utf8'));
    }

    return _categories;

  } else {
    if (methods === undefined) {
      throw new Error(`Error: Must pass a list of method names.`);
    }

    return { adhoc: methods };
  }
}
