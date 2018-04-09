import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Categories } from './reporter';
import CpuProfile, { ICallFrame, ISample } from '../cpuprofile';
import { Trace } from '../trace';
import { Hashes, findMangledDefine, findModule, createCallSiteWindow, cdnHashes, getVersion } from './utils';
import { HAR } from 'har-remix';
import { Diff, DiffResult } from './diff';

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

class Heuristic implements IHeuristicJSON {
  category: string;
  fileName: string;
  moduleName: string;
  functionName: string;
  loc: Loc;
  callSiteWindow: CallSiteWindow;
  constructor(json: IHeuristicJSON) {
    this.category = json.category;
    this.fileName = json.fileName;
    this.moduleName = json.moduleName;
    this.functionName = json.functionName;
    this.loc = json.loc;
    this.callSiteWindow = json.callSiteWindow;
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
      callSiteWindow
    } = this;
    return {
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
  private categories: Categories;
  private prevCategories?: Categories;
  private parsedFiles: Map<string, ParsedFile>;
  private validations: IValidation = { updates: [], warnings: [] };

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
    this.categories = categories;
    this.prevCategories = prevCategories;
    this.heuristics = new Map<string, Heuristic>();
    this.canidates = new Map<string, Heuristic>();
    this.parsedFiles = new Map<string, ParsedFile>();
  }

  load(cachedHeuristics: IHeuristicMap) {
    Object.keys(cachedHeuristics).forEach(key => {
      let heuristic = new Heuristic(cachedHeuristics[key]);
      this.canidates.set(key, heuristic)
    });
  }

  verify() {
    return this.validations;
  }

  compute(profile: CpuProfile, har: HAR, hashes: Hashes) {
    let { categories } = this;
    if (categories) {
      Object.keys(categories).forEach(category => {
        let samples = this.filterSamples(profile.samples, categories[category]);
        samples.forEach(sample => {
          this.createHeuristic(har, hashes, sample.node.callFrame, category)
        });
      });
    }
  }

  persist(path: string) {
    let heuristics: { [key: string]: IHeuristicJSON } = {};
    let keys = this.heuristics.keys();
    let { categories, validations } = this;
    for (let key of keys) {
      heuristics[key] = this.heuristics.get(key)!.toJSON();
    }

    let json: IPersistedHeuristics = {
      validations: validations!,
      heuristics,
      categories
    };

    fs.writeFileSync(path, JSON.stringify(json));
  }

  get() {
    return this.heuristics;
  }

  private createHeuristic(har: HAR, hashes: Hashes, callFrame: ICallFrame, category: string) {
    let { url, lineNumber, columnNumber, functionName } = callFrame;
    let fileName = hashes[url];
    let parsedFile = this.parsedFiles.get(fileName);
    let mangledIdent;
    let lines;
    if (parsedFile === undefined) {
      let urlRegex = new RegExp(url);
      let entry = har.log.entries.find(entry => urlRegex.test(entry.request.url))!;
      let text = entry.response.content!.text!;
      mangledIdent = findMangledDefine(text);
      lines = text.split('\n');
      this.parsedFiles.set(fileName, new ParsedFile(lines, 'define', mangledIdent));
    } else {
      lines = parsedFile.lines;
      mangledIdent = parsedFile.mangledModuleIdent;
    }

    let moduleName = findModule(lines, lineNumber, columnNumber, ['define', mangledIdent]);
    let preamble = `${category}::${fileName}::${moduleName}::`
    let key = `${preamble}${functionName}`;

    if (this.heuristics.has(key)) {
      return;
    }

    let existingHeuristic = this.canidates.get(key)!;
    let { line, col } = existingHeuristic.loc;

    if (line === lineNumber && col === columnNumber) {
      // Promote
      this.heuristics.set(key, existingHeuristic);
      this.canidates.delete(key);
      return;
    }

    let callSiteWindow = createCallSiteWindow(lines, lineNumber, columnNumber, 2);

    let heuristic = new Heuristic({
      moduleName,
      category,
      fileName,
      loc: { col: columnNumber, line: lineNumber },
      callSiteWindow,
      functionName
    });

    this.verifyHeuristic(preamble, key, heuristic);
  }

  private verifyHeuristic(preamble: string, name: string, heuristic: Heuristic) {
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
            this.heuristics.set(`${preamble}::${name}`, heuristic);
            this.validations.updates.push(message);
          } else {
            this.validations.warnings.push(message);
          }

        } else {
          // assume we are setting a unique key
          this.heuristics.set(`${preamble}::${name}`, heuristic);
        }
      }
    }
  }

  private filterSamples(samples: ISample[], methods: string[]): ISample[] {
    return samples.filter(sample => methods.includes(sample.node.callFrame.functionName))
  }
}

export class HeuristicsValidator {
  categories: Categories;
  private _heuristics: Heuristics | undefined = undefined;

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

  validate(profile: CpuProfile, har: HAR) {
    let version = getVersion(har.log.entries[0].response.content!.text!);
    console.log(version);
    // let hashes = cdnHashes(version);
    // let prevalidated = `${os.homedir()}/.parse-profile/${version}/heuristics.json`;

    // let heuristics;
    // if (fs.existsSync(prevalidated)) {
    //   let persistedHeuristics = JSON.parse(fs.readFileSync(prevalidated, 'utf8'));
    //   heuristics = Heuristics.fromCache(persistedHeuristics, this.categories);
    // } else {
    //   heuristics = Heuristics.fromJSON(this.categories);
    //   heuristics.compute(profile, har, hashes);
    // }

    // let verification = heuristics.verify();
    // heuristics.persist(prevalidated);

    // this._heuristics = heuristics;

    // return {
    //   heuristics: heuristics.get(),
    //   verification
    // };
  }
}