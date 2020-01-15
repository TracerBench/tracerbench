// tslint:disable:no-console

import * as chalk from 'chalk';

const error = chalk.bold.red;

export function showError(message: string) {
  console.log(`${error('Error:')} ${message}`);
}
