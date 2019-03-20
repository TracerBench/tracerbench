import { ICallFrame } from 'tracerbench';

export interface ModuleInfo {
  name: string;
  callFrames: ICallFrame[];
}

const EOF = -1;

export class ParsedFile {
  private lines: string[] = [];
  private mangledDefine: string;
  private moduleLocators: Map<string, ModuleInfo> = new Map();
  constructor(private content: string) {
    this.mangledDefine = findMangledDefine(this.content);
    this.lines = this.content.split('\n');
  }

  moduleNameFor(callFrame: ICallFrame) {
    let { lineNumber, columnNumber, functionName } = callFrame;
    let key = `${lineNumber}${columnNumber}${functionName}`;
    let moduleLocator = this.moduleLocators.get(key);
    if (moduleLocator) {
      return moduleLocator.name;
    }

    let name = this.findModuleName(lineNumber);

    this.moduleLocators.set(key, {
      name,
      callFrames: [callFrame]
    });

    return name;
  }

  private findModuleName(line: number): string {
    if (line === EOF) return 'unknown';

    let currentLine = this.lines[line];
    let defineIndex = getModuleIndex(currentLine, 'define');
    let mangledIndex = getModuleIndex(currentLine, this.mangledDefine);

    if (defineIndex === EOF && mangledIndex === EOF) {
      return this.findModuleName(line - 1);
    }

    let ident: string;
    let index: number;
    if (defineIndex > EOF) {
      ident = 'define';
      index = defineIndex;
    } else {
      ident = this.mangledDefine;
      index = mangledIndex;
    }

    return extractModuleName(currentLine, ident, index);
  }
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
          defineToken = char + defineToken;
        }
        break;
    }
  }

  return defineToken;
}

export function getModuleIndex(str: string, ident: string) {
  let matcher = new RegExp(
    `(?:${ident}\\\(")(.*?)(?=",\\\[\\\"(.*)\\\"],(function|\\\(function))`,
    'g'
  );
  let matches = str.match(matcher);

  if (matches === null) {
    return EOF;
  }

  let lastMatched = matches[matches.length - 1];
  return str.indexOf(lastMatched);
}

export function extractModuleName(line: string, token: string, index: number) {
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
