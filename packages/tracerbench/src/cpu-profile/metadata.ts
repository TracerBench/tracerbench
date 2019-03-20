import { ICallFrame } from '../trace';

export interface IModuleInfo {
  name: string;
  callFrames: ICallFrame[];
}

const EOF = -1;

export class ParsedFile {
  private lines: string[] = [];
  private mangledDefine: string;
  private moduleLocators: Map<string, IModuleInfo> = new Map();
  constructor(private content: string) {
    this.mangledDefine = findMangledDefine(this.content);
    this.lines = this.content.split('\n');
  }

  public moduleNameFor(callFrame: ICallFrame) {
    const { lineNumber, columnNumber, functionName } = callFrame;
    const key = `${lineNumber}${columnNumber}${functionName}`;
    const moduleLocator = this.moduleLocators.get(key);
    if (moduleLocator) {
      return moduleLocator.name;
    }

    const name = this.findModuleName(lineNumber);

    this.moduleLocators.set(key, {
      name,
      callFrames: [callFrame]
    });

    return name;
  }

  private findModuleName(line: number): string {
    if (line === EOF) {
      return 'unknown';
    }
    const currentLine = this.lines[line];
    const defineIndex = getModuleIndex(currentLine, 'define');
    const mangledIndex = getModuleIndex(currentLine, this.mangledDefine);

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
  const tail = content.indexOf('.__loader.define');
  const sub = content.slice(0, tail);
  let defineToken = '';
  let end = sub.length - 1;
  let scanning = true;
  let declaration = false;
  while (scanning) {
    const char = sub[end--];
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
  const matcher = new RegExp(
    `(?:${ident}\\\(")(.*?)(?=",\\\[\\\"(.*)\\\"],(function|\\\(function))`,
    'g'
  );
  const matches = str.match(matcher);

  if (matches === null) {
    return EOF;
  }

  const lastMatched = matches[matches.length - 1];
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
