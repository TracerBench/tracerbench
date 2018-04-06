import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Categories } from './reporter';
import CpuProfile, { ICallFrame, ISample, ICpuProfileNode } from '../cpuprofile/index';
import { Trace } from '../trace';
import { Hashes, findMangledDefine, findModule, createCallSiteWindow, cdnHashes, getVersion } from './utils';
import { HAR } from 'har-remix';
import { Diff, DiffResult } from './diff';
import { HierarchyNode } from 'd3';

export const enum Relevancy {
  Irrelevant,
  Partial,
  Relevant,
}

export interface ValidatorOptions {
  report?: string;
  methods?: string[];
}

export interface IValidation {
  warnings: string[];
  updates: string[]
}

export interface IPersistedHeuristics {
  validations: IValidation;
  heuristics: IHeuristicMap;
  categories: Categories;
}

export interface Loc {
  col: number;
  line: number;
}

export interface CallSiteWindow {
  before: string;
  after: string;
}

export interface IHeuristicJSON {
  hashedFileName: string;
  category: string;
  fileName: string;
  moduleName: string;
  functionName: string;
  loc: Loc;
  callSiteWindow: CallSiteWindow;
}

export interface IHeuristicMap {
  [key: string]: IHeuristicJSON;
}

export class Heuristic implements IHeuristicJSON {
  category: string;
  hashedFileName: string;
  fileName: string;
  moduleName: string;
  functionName: string;
  loc: Loc;
  callSiteWindow: CallSiteWindow;
  callFrames: ICallFrame[] = [];
  constructor(json: IHeuristicJSON) {
    this.category = json.category;
    this.fileName = json.fileName;
    this.moduleName = json.moduleName;
    this.functionName = json.functionName;
    this.loc = json.loc;
    this.callSiteWindow = json.callSiteWindow;
    this.hashedFileName = json.hashedFileName;
  }

  pushCallFrame(callFrame: ICallFrame) {
    this.callFrames.push(callFrame);
  }

  verify(heuristic: Heuristic) {
    let { callSiteWindow } = this;
    let { callSiteWindow: newCallSiteWindow } = heuristic;

    let { before, after } = callSiteWindow;
    let { before: newBefore, after: newAfter } = newCallSiteWindow;
    let beforeDiff = this.diffCallSite(before, newBefore);
    let afterDiff = this.diffCallSite(after, newAfter);

    if(this.isRelevant(beforeDiff, afterDiff)) {
      return { match: true, message: `[Updating]: Previous heuristic "${this.functionName}" in the "${this.category} has been remapped to ${heuristic.functionName}.` };
    }

    return { match: false, message: `[Updating]: Previous heuristic "${this.functionName}" in the "${this.category} has been remapped to ${heuristic.functionName}.` };
  }

  validate(callFrame: ICallFrame) {
    return this.callFrames.includes(callFrame);
  }

  private isRelevant(before: DiffResult, after: DiffResult) {
    let score = 0;
    let { levenshteinDistance: lb } = before;
    let { levenshteinDistance: la } = after;

    if (lb <= 10 && la <= 10) {
      return true;
    }

    return false;
  }

  private diffCallSite(from: string, to: string)  {
    return new Diff(from, to).diff();
  }

  toJSON(): IHeuristicJSON {
    let {
      category,
      fileName,
      moduleName,
      functionName,
      loc,
      callSiteWindow,
      hashedFileName
    } = this;
    return {
      hashedFileName,
      category,
      fileName,
      moduleName,
      functionName,
      loc,
      callSiteWindow
    }
  }
}

class ParsedFile {
  constructor(public lines: string[], public moduleIdent: string, public mangledModuleIdent: string) {};
}

export class Heuristics {
  private heuristics: Map<string, Heuristic>;
  private canidates: Map<string, Heuristic>;
  private _categories: Categories;
  private _methods: string[] = [];
  private _categoryKeys: string[] = [];
  private prevCategories?: Categories;
  private parsedFiles: Map<string, ParsedFile>;
  public validations: IValidation = { updates: [], warnings: [] };
  private version: string = '0.0.0';

  static fromJSON(json: Categories) {
    let heuristics = new Heuristics(json);
    return heuristics;
  }

  static fromCache(cachedHeuristics: IPersistedHeuristics, categories: Categories) {
    let heuristics = new Heuristics(categories, cachedHeuristics.categories);
    heuristics.load(cachedHeuristics.heuristics);
    heuristics.validations = cachedHeuristics.validations;
    return heuristics;
  }

  constructor(categories: Categories, prevCategories?: Categories) {
    this._categories = categories;
    this.prevCategories = prevCategories;
    this.heuristics = new Map<string, Heuristic>();
    this.canidates = new Map<string, Heuristic>();
    this.parsedFiles = new Map<string, ParsedFile>();
  }

  setVersion(version: string) {
    this.version = version;
  }

  load(cachedHeuristics: IHeuristicMap) {
    Object.keys(cachedHeuristics).forEach(key => {
      let heuristic = new Heuristic(cachedHeuristics[key]);
      this.canidates.set(key, heuristic)
    });
  }

  get() {
    return this.heuristics;
  }

  verify() {
    return this.validations;
  }

  get methods() {
    if (this._methods.length === 0) {
      this._methods = this._methods.concat(...Object.keys(this._categories).map((cat) => {
        return this._categories[cat];
      }));
    }

    return this._methods;
  }

  get categories() {
    if (this._categoryKeys.length === 0) {
      this._categoryKeys = Object.keys(this._categories);
    }

    return this._categoryKeys;
  }

  compute(profile: CpuProfile, har: HAR, hashes: Hashes) {
    let { _categories } = this;
    if (_categories) {
      Object.keys(_categories).forEach(category => {
        let nodes = this.filterSamples(profile.hierarchy, _categories[category]);
        nodes.forEach(node => {
          this.createHeuristic(har, hashes, node.callFrame, category)
        });
      });
    }
  }

  persist(path: string) {
    let heuristics: { [key: string]: IHeuristicJSON } = {};
    let keys = this.heuristics.keys();
    let { _categories, validations } = this;
    for (let key of keys) {
      heuristics[key] = this.heuristics.get(key)!.toJSON();
    }

    let json: IPersistedHeuristics = {
      validations: validations!,
      heuristics,
      categories: _categories
    };

    fs.writeFileSync(path, JSON.stringify(json));
  }

  isContained(callFrame: ICallFrame) {
    for (let pair of this.heuristics.entries()) {
      let [,heuristic] = pair;
      let { functionName } = heuristic;

      if (functionName === callFrame.functionName) {
        return true;
      }
    }

    return false;
  }

  private createNativeHeuristic(key: string, fileName: string, functionName: string, loc: Loc, hash: string) {
    let existingHeuristic = this.heuristics.get(key);
    if (existingHeuristic) {
      return existingHeuristic;
    }

    let heuristic = new Heuristic({
      moduleName: 'v8',
      category: 'platform',
      functionName,
      loc,
      fileName: fileName,
      callSiteWindow: { before: '', after: '' },
      hashedFileName: hash
    });

    this.heuristics.set(key, heuristic);
    return heuristic;
  }

  private createHeuristic(har: HAR, hashes: Hashes, callFrame: ICallFrame, category: string) {
    let { url, lineNumber, columnNumber, functionName } = callFrame;
    let hash = url.split('/').pop()!;
    let fileName = hashes[hash];
    let loc = { col: columnNumber, line: lineNumber };

    if (isV8(functionName)) {
      let key = `${category}::v8::v8::${functionName}`;
      let heruristic = this.createNativeHeuristic(key, 'v8', functionName, loc, hash);
      heruristic.pushCallFrame(callFrame);
      return heruristic;
    }

    if (isNative(url)) {
      let key = `${category}::v8::${url}::${functionName}`;
      let heruristic = this.createNativeHeuristic(key, url, functionName, loc, hash);
      heruristic.pushCallFrame(callFrame);
      return heruristic;
    }

    if (lineNumber === -1) {
      let msg = `"${functionName}" in "${category}" could not resolve in "${fileName}".`;
      if (!this.validations.warnings.includes(msg)) {
        this.validations.warnings.push(msg);
      }
      return;
    }

    let { lines, mangledModuleIdent: mangledIdent } = this.parseFile(har, fileName, url, hashes);
    let moduleName = findModule(lines, lineNumber, columnNumber, ['define', mangledIdent]);
    let preamble = `${category}::${fileName}::${moduleName}::`
    let key = `${preamble}${functionName}`;
    let existingHeuristic = this.canidates.get(key);

    if (this.heuristics.has(key)) {
      let heruristic = this.heuristics.get(key)!;
      heruristic.pushCallFrame(callFrame);
      return heruristic;
    } else if (existingHeuristic) {
      let { line, col } = existingHeuristic.loc;

      if (line === lineNumber && col === columnNumber) {
        // Promote
        this.heuristics.set(key, existingHeuristic);
        existingHeuristic.pushCallFrame(callFrame);
        this.canidates.delete(key);
        return existingHeuristic;
      }
    }

    let callSiteWindow = createCallSiteWindow(lines, lineNumber, columnNumber, 2);

    let heuristic = new Heuristic({
      hashedFileName: hash,
      moduleName,
      category,
      fileName,
      loc: { col: columnNumber, line: lineNumber },
      callSiteWindow,
      functionName
    });

    heuristic.pushCallFrame(callFrame);
    this.verifyHeuristic(preamble, functionName, heuristic);
    return heuristic;
  }

  private parseFile(har: HAR, fileName: string, url: string, hashes: Hashes) {
    let parsedFile = this.parsedFiles.get(fileName);

    if (parsedFile === undefined) {
      if (/native/.test(url)) {
        let file = new ParsedFile([], '(native)', '(native)');
        this.parsedFiles.set('native', file);
        return file;
      }

      let urlRegex = new RegExp(url);
      let entry = har.log.entries.find(entry => urlRegex.test(entry.request.url));

      if (entry === undefined) {
        throw new Error(`HAR file and CPU profile have diverged. Could not find resource "${url}" in "${this.version}" of the application.`);
      }

      let text = entry.response.content!.text!;
      let mangledIdent = findMangledDefine(text);
      let lines = text.split('\n');
      let file = new ParsedFile(lines, 'define', mangledIdent);
      this.parsedFiles.set(fileName, file);
      return file;
    }

    return parsedFile;
  }

  private verifyHeuristic(preamble: string, name: string, heuristic: Heuristic) {
    if (this.canidates.size === 0) {
      this.heuristics.set(`${preamble}${name}`, heuristic);
    }

    let keys = this.canidates.keys();
    let unmappedKeys = [];

    for (let key of keys) {
      let keyparts= key.split('::');
      let fnName = keyparts.pop()!;
      let keyPreamble = keyparts.join('::');

      if (keyPreamble === preamble) {
        let diff = new Diff(fnName, name).diff();
        if (diff.levenshteinDistance <= 2) {
          let currentHeuristic = this.canidates.get(key)!;
          let { match, message } = currentHeuristic.verify(heuristic);

          if (match) {
            // Promote
            this.canidates.delete(key);
            this.heuristics.set(`${preamble}${name}`, heuristic);
            this.validations.updates.push(message);
          } else {
            this.validations.warnings.push(message);
          }

        } else {
          // assume we are setting a unique key
          this.heuristics.set(`${preamble}${name}`, heuristic);
        }
      }
    }
  }

  private filterSamples(hierarchy: HierarchyNode<ICpuProfileNode>, methods: string[]): ICpuProfileNode[] {
    let nodes: ICpuProfileNode[] = []
    hierarchy.each(node => {
      if (methods.includes(node.data.callFrame.functionName)) {
        nodes.push(node.data);
      }
    });

    return nodes;
  }
}

export class HeuristicsValidator {
  categories: Categories;
  private _heuristics: Heuristics | undefined;

  constructor(options: ValidatorOptions) {
    let { report, methods } = options;

    if (report) {
      let files = fs.readdirSync(report);
      this.categories = {};
      files.map(file => {
        let name = path.basename(file).replace('.json', '');
        let methods = JSON.parse(fs.readFileSync(`${report}/${file}`, 'utf8'));
        this.categories[name] = methods;
      });
    } else {
      if (methods === undefined) {
        throw new Error(`Error: Must pass a list of method names.`);
      }

      this.categories = { adhoc: methods };
    }
  }

  isContained(callFrame: ICallFrame) {
    return this._heuristics!.isContained(callFrame);
  }

  validate(profile: CpuProfile, har: HAR) {
    let version = getVersion(har.log.entries[0].response.content!.text!);
    let hashes = cdnHashes(version);
    let prevalidated = `${os.homedir()}/.parse-profile/${version}/heuristics.json`;

    let heuristics;
    if (fs.existsSync(prevalidated)) {
      let persistedHeuristics = JSON.parse(fs.readFileSync(prevalidated, 'utf8'));
      heuristics = Heuristics.fromCache(persistedHeuristics, this.categories);
    } else {
      heuristics = Heuristics.fromJSON(this.categories);
    }

    heuristics.setVersion(version);
    heuristics.compute(profile, har, hashes);

    let validations = heuristics.verify();

    // TODO: Enable this
    // heuristics.persist(prevalidated);

    this._heuristics = heuristics;

    return {
      heuristics,
      validations
    };
  }
}

function isV8(name: string) {
  return name === '(program)' || name === '(garbage collector)';
}

function isNative(name: string) {
  return name.includes('native');
}