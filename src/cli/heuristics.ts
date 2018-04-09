import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Categories } from './reporter';
import CpuProfile, { ICallFrame, ISample } from '../cpuprofile';
import { Trace } from '../trace';
import { Hashes, findMangledDefine, findModule, createCallSiteWindow } from './utils';
import { HAR } from 'har-remix';

export interface ValidatorOptions {
  report?: string;
  methods?: string[];
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

  verify(callSite: any) {

  }
}

class ParsedFile {
  constructor(public lines: string[], public moduleIdent: string, public mangledModuleIdent: string) {};
}

class Heuristics {
  private heuristics: Map<string, Heuristic>;
  private categories: Categories;
  private parsedFiles: Map<string, ParsedFile>;

  static fromJSON(json: Categories) {
    let h = new Heuristics(json);
    return h;
  }

  static fromCache(cachedHeuristics: IHeuristicMap) {
    let heuristics = new Heuristics();
    heuristics.load(cachedHeuristics);
    return heuristics;
  }

  constructor(categories?: Categories) {
    this.categories = categories;
    this.heuristics = new Map<string, Heuristic>();
    this.parsedFiles = new Map<string, ParsedFile>();
  }

  load(cachedHeuristics: IHeuristicMap) {
    Object.keys(cachedHeuristics).forEach(key => {
      let heuristic = new Heuristic(cachedHeuristics[key]);
      this.heuristics.set(key, heuristic)
    });
  }

  verify(compare?: Categories) {

  }

  compute(profile: CpuProfile, har: HAR, hashes: Hashes) {
    let { categories } = this;
    if (categories) {
      Object.keys(categories).forEach(category => {
        let samples = this.filterSamples(profile.samples, categories[category]);
        samples.forEach(sample => this.createHeuristic(har, hashes, sample.node.callFrame));
      });
    }
  }

  private createHeuristic(har: HAR, hashes: Hashes, callFrame: ICallFrame) {
    let { url, lineNumber, columnNumber, functionName } = callFrame;
    let fileName = hashes[url];
    let parsedFile = this.parsedFiles.get(fileName);
    let mangledIdent;
    let lines;
    if (parsedFile === undefined) {
      let urlRegex = new RegExp(url);
      let entry = har.log.entries.find(entry => urlRegex.test(entry.request.url));
      let text = entry.response.content.text;
      mangledIdent = findMangledDefine(text);
      lines = text.split('\n');
      this.parsedFiles.set(fileName, new ParsedFile(lines, 'define', mangledIdent));
    } else {
      lines = parsedFile.lines;
      mangledIdent = parsedFile.mangledModuleIdent;
    }

    let moduleName = findModule(lines, lineNumber, columnNumber, ['define', mangledIdent]);
    let callSiteWindow = createCallSiteWindow(lines, lineNumber, columnNumber, 2);

    let heuristic = new Heuristic({
      moduleName,
      category: '',
      fileName,
      loc: { col: columnNumber, line: lineNumber },
      callSiteWindow,
      functionName
    });

    let key = this.computeKey(heuristic);
    this.heuristics.set(key, heuristic);

  }

  private filterSamples(samples: ISample[], methods: string[]): ISample[] {
    return samples.filter(sample => methods.includes(sample.node.callFrame.functionName))
  }

  private computeKey(heuristic: Heuristic) {
    let { moduleName, fileName, functionName, category } = heuristic;
    return `${category}::${fileName}::${moduleName}::${functionName}`;
  }
}

export class HeuristicsValidator {
  categories: Categories;
  private profile: CpuProfile;
  private hashes: Hashes;
  constructor(profile: CpuProfile, hashes: Hashes, options: ValidatorOptions) {
    let { report, methods } = options;
    this.profile = profile;
    this.hashes = hashes;

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

  validate(version: string, har: HAR) {
    let prevalidated = `${os.homedir()}/.parse-profile/${version}/heuristics.json`;
    let { profile, hashes } = this;

    if (fs.existsSync(prevalidated)) {
      let heuristics = Heuristics.fromCache(JSON.parse(fs.readFileSync(prevalidated, 'utf8')));
      let verifications = heuristics.verify(this.categories);
      return verifications;
    }

    let heuristics = Heuristics.fromJSON(this.categories, profile);
    heuristics.compute(profile, har, hashes);
    return heuristics.verify();
  }
}

/*
  check to see if previous run exists for version

*/