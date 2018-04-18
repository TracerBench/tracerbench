import { AggregationResult, Aggregations, CallSite } from './aggregator';
import { Archive } from './archive_trace';
import { findMangledDefine, findModule } from './utils';

class ParsedFile {
  private lines: string[] = [];
  private mangledDefine?: string;
  constructor(private content: string) {}

  parse() {
    if (this.lines.length === 0) {
      this.lines = this.content.split('\n');
    }

    if (!this.mangledDefine) {
      this.mangledDefine = findMangledDefine(this.content);
    }

    return {
      lines: this.lines,
      mangledDefine: this.mangledDefine,
    };
  }
}

export class MetaData {
  parsedFiles: Map<string, ParsedFile> = new Map();
  constructor(private archive: Archive) {}

  for(aggregations: Aggregations): Aggregations {
    Object.keys(aggregations).forEach((name: string) => {
      aggregations[name].callsites.forEach(callsite => {
        this.associateCallsite(callsite, name);
      });
    });
    return aggregations;
  }

  private associateCallsite(callsite: CallSite, n: string) {
    let entry = this.archive.log.entries.find((e) => {
      return e.request.url === callsite.url;
    });

    if (!entry) {
      callsite.moduleName = 'unknown';
    } else {
      let { url, loc: { line, col } } = callsite;
      let file = this.getFileParser(callsite.url, entry.response.content.text);
      let { lines, mangledDefine } = file.parse();
      let moduleName = findModule(lines, line, col, ['define', mangledDefine]);
      callsite.moduleName = moduleName;
    }
  }

  private getFileParser(url: string, body: string) {
    let parsedFile = this.parsedFiles.get(url);

    if (parsedFile === undefined) {
      let mangledIdent = findMangledDefine(body);
      let lines = body.split('\n');
      let file = new ParsedFile(body);
      this.parsedFiles.set(url, file);
      return file;
    }

    return parsedFile;
  }
}
