/* tslint:disable:no-console*/

import * as fs from 'fs-extra';
import * as path from 'path';
import { EXTENDS, ITBConfig } from './tb-config';
import * as JSON5 from 'json5';
import { getDefaultValue } from './default-flag-args';
import { mergeLeft } from '../helpers/utils';

const configFileKeys = [
  'extends',
  'tbResultsFolder',
  'inputFilePath',
  'outputFilePath',
] as const;

const serverFileKeys = ['har', 'dist'] as const;

// STEP 1
// takes a command flags object with all the flags the command accepts
// runs that commands object thru the defaults and returns those values
function getCommandDefaults(flags: any) {
  const f = flags;
  Object.entries(f).forEach(([key]) => {
    f[key] = getDefaultValue(key) || flags[key];
  });

  // this will return a bunch of flags that don't have values
  // and wont know which are required or not
  return f;
}

/**
 * Read config file, expanding relative paths to absolute and
 * recursively reading extends
 * @param fileOrDir config file path or directory with a tbconfig.json
 */
export function readConfig(fileOrDir = 'tbconfig.json'): ITBConfig | undefined {
  let configDir: string;
  let configFile: string;
  let config: ITBConfig;
  try {
    [configDir, configFile] = resolveConfigFile(fileOrDir);
    config = JSON5.parse(fs.readFileSync(configFile, 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT') {
      return;
    }
    throw e;
  }
  resolveConfigFileKeys(config, configDir);
  // extends is already absolute here from the above
  const parentConfigFile = config[EXTENDS];
  if (parentConfigFile) {
    const parent = readConfig(parentConfigFile);
    if (parent === undefined) {
      throw new Error(`Extended config missing referenced in ${configFile}`);
    }
    const merged = mergeLeft(parent, config);
    delete merged[EXTENDS];
    return merged;
  }
  return config;
}

function resolveConfigFileKeys(config: ITBConfig, configDir = process.cwd()) {
  resolveFileKeys(config, configFileKeys, configDir);
  if (Array.isArray(config.servers)) {
    for (const server of config.servers) {
      resolveFileKeys(server, serverFileKeys, configDir);
    }
  }
}

function resolveFileKeys<K extends string>(
  config: { [P in K]?: string },
  keys: readonly K[],
  configDir: string
) {
  for (const key of keys) {
    const value = config[key];
    if (typeof value === 'string') {
      config[key] = path.resolve(configDir, value);
    }
  }
}

function resolveConfigFile(fileOrDir: string) {
  const resolved = path.resolve(fileOrDir);
  const stats = fs.statSync(resolved);
  let dir: string;
  let file: string;
  if (stats.isDirectory()) {
    dir = resolved;
    file = path.join(dir, 'tbconfig.json');
  } else {
    dir = path.dirname(resolved);
    file = resolved;
  }
  return [dir, file];
}

// overwrite all flags explicity flagged within cli command
function handleExplicitFlags(flags: any, explicitFlags: string[]): {} {
  const obj: any = {};
  const f = flags;

  explicitFlags.forEach(exF => {
    if (exF.startsWith('--') && !exF.includes('config')) {
      exF = exF.substring(2);
      obj[exF] = f[exF];
    }
  });

  return obj as {};
}

export function getConfig(
  configFileOrDir = 'tbconfig.json',
  flags: any,
  explicitFlags: string[]
): ITBConfig {
  const ef = handleExplicitFlags(flags, explicitFlags);
  resolveConfigFileKeys(ef);
  const commandDefaults = getCommandDefaults(flags);
  resolveConfigFileKeys(commandDefaults);

  const config = readConfig(configFileOrDir);
  if (config === undefined) {
    return mergeLeft(commandDefaults, ef);
  }

  return mergeLeft(mergeLeft(commandDefaults, config), ef);
}
