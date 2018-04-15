import * as childProcess from 'child_process';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';
import { Hash } from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import { Trace } from '../trace';

// tslint:disable:no-console

export interface Hashes {
  [key: string]: string;
}

export function cdnHashes(version: string): Hashes {
  let tmpDir = `${os.homedir()}/.parse-profile`;

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  tmpDir = `${tmpDir}/${version}`;

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  // tslint:disable-next-line:max-line-length
  let schashes = `http://artifactory.corp.linkedin.com:8081/artifactory/CNC/com/linkedin/voyager-web/voyager-web/${version}/voyager-web_prod_build-${version}.zip/\!/extended/sc-hashes.json
    dest=sc-hashes-${version}.json`;

  let hashPath = `${tmpDir}/hashes.json`;
  let hashes;
  if (!fs.existsSync(hashPath)) {
    hashes = childProcess.execSync(`curl -s -L ${schashes}`, { encoding: 'utf8' });
    fs.writeFileSync(hashPath, hashes);
  } else {
    hashes = fs.readFileSync(hashPath, 'utf8');
  }

  let mappedHashes: Hashes = {};
  let parsedHashes = (hashes = JSON.parse(hashes));
  Object.keys(parsedHashes.hashes).forEach(hash => {
    let h = parsedHashes.hashes[hash];
    mappedHashes[h] = hash;
  });

  return mappedHashes;
}

export function getVersion(content: string) {
  let metaTag = '<meta name="serviceVersion" content="';
  let metaTagStart = content.indexOf(metaTag);
  let start = metaTagStart + metaTag.length;
  let char;
  let version = '';
  while (char !== '"') {
    version += content[start];
    char = content[++start];
  }

  return version;
}

export function computeMinMax(trace: Trace, start: string = 'navigationStart', end: string) {
  let min;
  let max;
  if (end) {
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

export function findMangledDefine(content: string) {
  let tail = content.indexOf('.__loader.define');
  let sub = content.slice(0, tail);
  let defineToken = '';
  let end = sub.length - 1;
  let scanning = true;
  let declaration = false;
  while (scanning) {
    let char = sub[end--];
    switch (char) {
      case '=':
        declaration = true;
        break;
      case ' ':
        scanning = false;
        break;
      default:
        if (declaration) {
          defineToken = defineToken + char;
        }
        break;
    }
  }

  return defineToken;
}

function getModuleIndex(str: string, ident: string) {
  if (str === undefined) {
    console.log('wat');
  }
  let matcher = new RegExp(
    `(?:${ident}\\\(")(.*?)(?=",\\\[\\\"(.*)\\\"],(function|\\\(function))`,
    'g',
  );
  let matches = str.match(matcher);

  if (matches === null) {
    return -1;
  }

  let lastMatched = matches[matches.length - 1];
  return str.indexOf(lastMatched);
}

export function findModule(lines: string[], line: number, col: number, tokens: string[]): string {
  if (line === -1) {
    return 'unkown';
  }

  let callSiteLine = lines[line];
  let [define, enifed] = tokens;

  let defineIndex = getModuleIndex(callSiteLine, define);
  let enifedIndex = getModuleIndex(callSiteLine, enifed);

  // Either no define on the line.
  // Go to previous line
  if (defineIndex === -1 && enifedIndex === -1) {
    return findModule(lines, line - 1, -1, tokens);
  }

  if (col === -1) {
    // tslint:disable-next-line:no-shadowed-variable
    let defineIndex = callSiteLine.lastIndexOf(`${define}("`);
    // tslint:disable-next-line:no-shadowed-variable
    let enifedIndex = callSiteLine.lastIndexOf(`${enifed}("`);
    if (defineIndex === -1 && enifedIndex === -1) {
      return findModule(lines, line - 1, -1, tokens);
    }

    // tslint:disable-next-line:no-shadowed-variable
    let token;
    // tslint:disable-next-line:no-shadowed-variable
    let index;
    if (defineIndex > 0) {
      token = define;
      index = defineIndex;
    } else {
      token = enifed;
      index = enifedIndex;
    }

    return extractModuleName(callSiteLine, token, index);
  } else if (defineIndex > col || enifedIndex > col) {
    return findModule(lines, line - 1, -1, tokens);
  }

  let token;
  let index;
  if (defineIndex > 0) {
    token = define;
    index = defineIndex;
  } else {
    token = enifed;
    index = enifedIndex;
  }

  return extractModuleName(callSiteLine, token, index);
}

function extractModuleName(line: string, token: string, index: number) {
  let start = index + `${token}("`.length;
  let moduleName = '';
  let char;
  while (char !== '"') {
    char = line[start];
    moduleName += char;
    start++;
    char = line[start];
  }
  return moduleName;
}

export function createCallSiteWindow(
  lines: string[],
  line: number,
  col: number,
  surrondingLines: number,
) {
  if (lines.length === 0) {
    return { before: '', after: '' };
  }

  let callLine = lines[line];
  let before = callLine.slice(0, col);
  let after = callLine.slice(col, callLine.length);

  for (let i = line; i < line + surrondingLines; i++) {
    after += lines[i];
  }

  for (let i = line - surrondingLines; i < line; i++) {
    before = lines[i] + before;
  }

  return { before, after };
}
