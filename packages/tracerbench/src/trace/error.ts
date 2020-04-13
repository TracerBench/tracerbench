import * as chalk from 'chalk';

const error = chalk.bold.red;

export function showError(message: string): void {
  console.log(`${error('Error:')} ${message}`);
}
