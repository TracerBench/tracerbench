/* tslint:disable:no-console*/

import * as fs from 'fs-extra';
import * as path from 'path';
import { EXTENDS, ITBConfig } from './tb-config';
import * as JSON5 from 'json5';
import { getDefaultValue } from './default-flag-args';
import { flags } from '@oclif/command';
import { mergeLeft, relPathToAbs, isDirectory } from '../helpers/utils';

// 1. GET DEFAULTS FOR COMMAND
// 2. GET RELATIVE CONFIG
// 3. RESOLVE RELATIVE CONFIG EXTENDS
// 4. CONVERT RELATIVE TO ABSOLUTE
// 5. MERGE EXPLICIT FLAGS
// 6. RETURN FINAL ABSOLUTE CONFIG TO COMMAND
// COMMAND. PARSE EXPLICIT FLAGS & PARSE CONFIG & ALERT ON MISSING FLAGS

// STEP 1
// takes a command flags object with all the flags the command accepts
// runs that commands object thru the defaults and returns those values
function getCommandDefaults(flags: any): flags.Input<any> {
  const f = flags;
  Object.entries(f).forEach(([key]) => {
    f[key] = getDefaultValue(key);
  });

  // this will return a bunch of flags that don't have values
  // and wont know which are required or not
  return f;
}

// STEP 2
// grab tbconfig with relative paths
export function getRelativeConfigRAW(configPath: string): ITBConfig {
  const p = path.isAbsolute(configPath)
    ? configPath
    : path.join(process.cwd(), `${configPath}`);

  if (isDirectory(p)) {
    try {
      return JSON5.parse(
        fs.readFileSync(path.join(p, 'tbconfig.json'), 'utf8')
      );
    } catch (error) {
      console.error(`Cannot resolve directory path to tbconfig.json: ${error}`);
    }
  }

  return JSON5.parse(fs.readFileSync(path.join(p), 'utf8'));
}

// STEP 3
// resolve relative config extends
// convert parent configs to absolute paths
function resolveRelativeConfigExtends(configPath: string): [ITBConfig, string] {
  let tbConfig;
  let parentConfig;
  try {
    tbConfig = getRelativeConfigRAW(configPath);
    if (tbConfig[EXTENDS]) {
      [parentConfig] = resolveRelativeConfigExtends(
        path.resolve(configPath, tbConfig[EXTENDS]!)
      );
      tbConfig = mergeLeft(
        convertRAWTBConfigRelToAbs(
          path.resolve(configPath, tbConfig[EXTENDS]!),
          parentConfig
        ),
        tbConfig
      );
    }
    return [tbConfig, configPath];
  } catch (error) {
    throw error;
  }
}

// STEP 4
// convert relative tbconfig into absolute tbconfig before parsing
function convertRAWTBConfigRelToAbs(
  configPath: string,
  relativeTBFileRAW: ITBConfig
): ITBConfig {
  Object.entries(relativeTBFileRAW).forEach(([key, value]) => {
    resolveRelativePath(configPath, key, value, relativeTBFileRAW);

    if (key === 'servers' && relativeTBFileRAW[key] !== undefined) {
      // @ts-ignore
      relativeTBFileRAW[key].forEach((server, i) => {
        resolveRelativePath(
          configPath,
          'dist',
          server.dist,
          relativeTBFileRAW,
          i,
          'servers'
        );
        resolveRelativePath(
          configPath,
          'har',
          server.har,
          relativeTBFileRAW,
          i,
          'servers'
        );
      });
    }
  });
  return relativeTBFileRAW;
}
function resolveRelativePath(
  configPath: string,
  key: string,
  value: string,
  relativeTBFileRAW: ITBConfig,
  index?: number,
  scope?: string
) {
  // !TODO these flags are getting past the filter
  // !TODO they might have to remain hardcoded or possibly regex
  const blackList = [
    'regressionThreshold',
    'tracingLocationSearch',
    'appName',
    'network',
    'markers',
    'browserArgs',
    'emulateDevice',
    'emulateDeviceOrientation',
    'runtimeStats',
    'fidelity',
  ];

  // filter to prevent converting non directory/filepath strings
  if (typeof value === 'string') {
    if (
      !path.isAbsolute(value) &&
      !value.startsWith('file:/') &&
      !value.startsWith('https://') &&
      !value.startsWith('http://') &&
      !value.includes(' ') &&
      !blackList.includes(key)
    ) {
      if (scope === 'servers') {
        // @ts-ignore
        relativeTBFileRAW.servers[index][key] = relPathToAbs(value, configPath);
      } else {
        relativeTBFileRAW[key] = relPathToAbs(value, configPath);
      }
    }
  }
}

function handleExplicitFlags(flags: any, explicitFlags: string[]): {} {
  const obj: any = {};

  explicitFlags.forEach(f => {
    if (f.startsWith('--') && !f.includes('config')) {
      f = f.substring(2);
      obj[f] = flags[f];
    }
  });

  return obj as {};
}

// STEP 6
// return the final absolute config to the command
// default configPath to the root tbconfig.json
export function getConfig(
  configPath: string = 'tbconfig.json',
  flags: any,
  explicitFlags: string[]
): ITBConfig {
  const ef = handleExplicitFlags(flags, explicitFlags);
  const commandDefaults = getCommandDefaults(flags);
  const [relativeConfigRAWResolved] = resolveRelativeConfigExtends(configPath);
  const relativeConfigRAWWithDefaults: ITBConfig = mergeLeft(
    commandDefaults,
    relativeConfigRAWResolved
  );
  const absoluteConfigRAW = convertRAWTBConfigRelToAbs(
    configPath,
    relativeConfigRAWWithDefaults
  );

  return mergeLeft(absoluteConfigRAW, ef);
}
