import * as os from 'os';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import { Trace } from '../trace';

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

  let schashes =`http://artifactory.corp.linkedin.com:8081/artifactory/CNC/com/linkedin/voyager-web/voyager-web/${version}/voyager-web_prod_build-${version}.zip/\!/extended/sc-hashes.json
    dest=sc-hashes-${version}.json`;

  let hashPath = `${tmpDir}/hashes.json`;
  let hashes;
  if (!fs.existsSync(hashPath)) {
    hashes = childProcess.execSync(`curl -s -L ${schashes}`, { encoding: 'utf8' });
    fs.writeFileSync(hashPath, hashes);
  } else {
    hashes = fs.readFileSync(hashPath, 'utf8');
  }

  hashes = JSON.parse(hashes);
  Object.keys(hashes.hashes).forEach(hash => {
    let h = hashes.hashes[hash];
    hashes[h] = hash;
  });

  return hashes;
}

export function getVersion(htmlEntry) {
  let html = htmlEntry.response.content;
  let metaTag = '<meta name=\"serviceVersion\" content=\"';
  let metaTagStart = html.indexOf(metaTag);
  let start = metaTagStart + metaTag.length;
  let char;
  let version = '';
  while (char !== '\\') {
    char = html[start];
    start++;
    version += char;
  }

  return version;
}

export function computeMinMax(trace: Trace, start: string = 'navigationStart', end: string) {
  let min;
  let max;
  if (end) {
    let startEvent = trace.events.find(e => e.name === start);
    let endEvent = trace.events.find(e => e.name === end);
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
    switch(char) {
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

export function findModule(lines: string[], line: number, col: number, tokens: string[]) {
  let callSiteLine = lines[line];
  let [define, enifed] = tokens;
  let defineIndex = callSiteLine.indexOf(`${define}("`);
  let enifedIndex = callSiteLine.indexOf(`${enifed}("`);

  // Either no define on the line.
  // Go to previous line
  if (defineIndex === -1 && enifedIndex === -1) {
    return findModule(lines, line - 1, -1, tokens);
  }

  if (col === -1) {
    let defineIndex = callSiteLine.lastIndexOf(`${define}("`);
    let enifedIndex = callSiteLine.lastIndexOf(`${enifed}("`);
    if (defineIndex === -1 && enifedIndex === -1) {
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

function extractModuleName(line, token, index) {
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

export function createCallSiteWindow(lines: string[], line: number, col: number, surrondingLines: number;) {
  let callLine = lines[line];
  let before = callLine.slice(0, col);
  let after = callLine.slice(col, callLine.length);

  for (let i = line; i < line + surrondingLines; i++) {
    after += lines[i];
  }

  for (let i = line - surrondingLines; i < line; i++) {
    before = lines[i] + before;
  }

  return { before, after }
}