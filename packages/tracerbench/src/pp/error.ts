// tslint:disable:no-console

import chalk from 'chalk';

const error = chalk.bold.red;

export function showError(message: string) {
  console.log(`${error('Error:')} ${message}`);
}
