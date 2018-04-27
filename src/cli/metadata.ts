import { ICallFrame } from '../trace';

// import { AggregationResult, Aggregations, CallSite, Aggs, CF } from './aggregator';
// import { Archive } from './archive_trace';

export interface ModuleInfo {
  name: string;
  callFrames: ICallFrame[];
}

const EOF = -1;

export class ParsedFile {
  private lines: string[] = [];
  private mangledDefine: string;
  private urlToModuleLocators: Map<string, ModuleInfo[]> = new Map();
  constructor(private content: string) {
    this.mangledDefine = findMangledDefine(this.content);
    this.lines = this.content.split('\n');
  }

  moduleNameFor(callFrame: ICallFrame) {
    let { url, lineNumber, columnNumber, functionName } = callFrame;
    let modules = this.urlToModuleLocators.get(url);
    if (modules) {
      for (let i = 0; i < modules.length; i++) {
        let mod = modules[i];
        let hasFrame = mod.callFrames.find(frame => {
          return frame.functionName === functionName &&
                 frame.lineNumber === lineNumber &&
                 frame.columnNumber === columnNumber;
        });

        if (hasFrame) {
          return mod.name;
        }
      }
    }

    let name = this.findModuleName(lineNumber);
    this.urlToModuleLocators.set(callFrame.url, [{
      name,
      callFrames: [callFrame],
    }]);

    return name;
  }

  private findModuleName(line: number): string {
    if (line === EOF) return 'unknown';

    let currentLine = this.lines[line];
    let defineIndex = getModuleIndex(currentLine, 'define');
    let mangledIndex = getModuleIndex(currentLine, this.mangledDefine);

    if (defineIndex === -1 && mangledIndex === -1) {
      return this.findModuleName(line - 1);
    }

    let ident: string;
    if (defineIndex > -1) {
      ident = 'define';
    } else {
      ident = this.mangledDefine;
    }

    let index = defineIndex || mangledIndex;

    return extractModuleName(currentLine, ident, index);
  }
}

// export class MetaData {
//   parsedFiles: Map<string, ParsedFile> = new Map();
//   constructor(private archive: Archive) {}

//   for(aggregations: Aggs): Aggs {
//     Object.keys(aggregations).forEach((name: string) => {
//       aggregations[name].callframes.forEach(callFrames => {

//         // this.associateCallFrame(callFrames, name);
//       });
//     });
//     return aggregations;
//   }

//   private associateCallFrame(callframes: CF, n: string) {
//     let entry = this.archive.log.entries.find((e) => {
//       return e.request.url === callsite.url;
//     });

//     if (!entry) {
//       callsite.moduleName = 'unknown';
//     } else {
//       let { url, loc: { line, col } } = callsite;
//       let file = this.getFileParser(callsite.url, entry.response.content.text);
//       let { lines, mangledDefine } = file.parse();
//       let moduleName = findModule(lines, line, col, ['define', mangledDefine]);
//       callsite.moduleName = moduleName;
//     }
//   }

//   private getFileParser(url: string, body: string) {
//     let parsedFile = this.parsedFiles.get(url);

//     if (parsedFile === undefined) {
//       let mangledIdent = findMangledDefine(body);
//       let lines = body.split('\n');
//       let file = new ParsedFile(body);
//       this.parsedFiles.set(url, file);
//       return file;
//     }

//     return parsedFile;
//   }
// }

function findMangledDefine(content: string) {
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

// function findModule(lines: string[], line: number, col: number, tokens: string[]): string {
//   if (line === -1 || line === undefined) {
//     return 'unkown';
//   }

//   let callSiteLine = lines[line];
//   let [define, enifed] = tokens;

//   let defineIndex = getModuleIndex(callSiteLine, define);
//   let enifedIndex = getModuleIndex(callSiteLine, enifed);

//   // Either no define on the line.
//   // Go to previous line
//   if (defineIndex === -1 && enifedIndex === -1) {
//     return findModule(lines, line - 1, -1, tokens);
//   }

//   if (col === -1) {
//     // tslint:disable-next-line:no-shadowed-variable
//     let defineIndex = callSiteLine.lastIndexOf(`${define}("`);
//     // tslint:disable-next-line:no-shadowed-variable
//     let enifedIndex = callSiteLine.lastIndexOf(`${enifed}("`);
//     if (defineIndex === -1 && enifedIndex === -1) {
//       return findModule(lines, line - 1, -1, tokens);
//     }

//     // tslint:disable-next-line:no-shadowed-variable
//     let token;
//     // tslint:disable-next-line:no-shadowed-variable
//     let index;
//     if (defineIndex > 0) {
//       token = define;
//       index = defineIndex;
//     } else {
//       token = enifed;
//       index = enifedIndex;
//     }

//     return extractModuleName(callSiteLine, token, index);
//   } else if (defineIndex > col || enifedIndex > col) {
//     return findModule(lines, line - 1, -1, tokens);
//   }

//   let token;
//   let index;
//   if (defineIndex > 0) {
//     token = define;
//     index = defineIndex;
//   } else {
//     token = enifed;
//     index = enifedIndex;
//   }

//   return extractModuleName(callSiteLine, token, index);
// }

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
