import chalk from 'chalk';

// tslint:disable:no-console
const error = chalk.bold.red;

export function showError(message: string) {
  console.log(`${error('Error:')} ${message}`);
}
