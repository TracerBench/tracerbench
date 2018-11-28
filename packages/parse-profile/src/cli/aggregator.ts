import { HierarchyNode } from 'd3-hierarchy';
import { ICallFrame, ICpuProfileNode, ITraceEvent, Trace } from '../trace';
import CpuProfile from '../trace/cpuprofile';
import { Archive } from './archive_trace';
import { ParsedFile } from './metadata';
// tslint:disable:member-ordering

export interface CallFrameInfo {
  self: number;
  stack: ICallFrame[];
}

export interface Aggregations {
  [key: string]: AggregationResult;
}

export interface AggregationResult {
  total: number;
  self: number;
  attributed: number;
  name: string;
  callframes: CallFrameInfo[];
}

export interface ParsedFiles {
  [key: string]: ParsedFile;
}

class AggregrationCollector {
  private _aggregations: Aggregations = {};
  private parsedFiles: ParsedFiles = {};
  private archive: Archive;

  constructor(hierarchy: HierarchyNode<ICpuProfileNode>, archive: Archive) {
    this.archive = archive;
    hierarchy.each((node: HierarchyNode<ICpuProfileNode>) => {
      const functionName = this.findModuleName(node.data.callFrame);
      if (functionName === undefined) { return; }
      this._aggregations[functionName] = {
        total: 0,
        self: 0,
        attributed: 0,
        name: functionName,
        callframes: [],
      };
    });

    this._aggregations.unknown = {
      total: 0,
      self: 0,
      attributed: 0,
      name: 'unknown',
      callframes: [],
    };
  }

  pushCallFrames(name: string, callFrame: CallFrameInfo) {
    this._aggregations[name].callframes.push(callFrame);
  }

  addToAttributed(name: string, time: number) {
    this._aggregations[name].attributed += time;
  }

  addToTotal(name: string, time: number) {
    this._aggregations[name].total += time;
  }

  collect() {
    Object.keys(this._aggregations).forEach(method => {
      let { total, attributed, callframes } = this._aggregations[method];
      this._aggregations[method].self = callframes.reduce((a, c) => a + c.self, 0);
    });

    return this._aggregations;
  }

  private contentFor(url: string) {
    let entry = this.archive.log.entries.find(e => e.request.url === url);

    if (!entry) {
      throw new Error(`Could not find "${url}" in the archive file.`);
    }

    return entry.response.content.text;
  }

  findModuleName(callFrame: ICallFrame) {
    let { url } = callFrame;
    // guards against things like undefined url or urls like "extensions::SafeBuiltins"
    if (url === undefined ||
       (url.substr(0, 7) !== 'https:/' && url.substr(0, 7) !== 'http://') ||
       callFrame.lineNumber === undefined ||
       callFrame.columnNumber === undefined ||
       callFrame.functionName === undefined ||
       callFrame.scriptId === undefined) {
      return undefined;
    }
    let { parsedFiles } = this;
    let file = parsedFiles[url];
    if (file) {
      return file.moduleNameFor(callFrame);
    }

    file = this.parsedFiles[url] = new ParsedFile(this.contentFor(url));
    return file.moduleNameFor(callFrame);
  }
}

// Dedup identical (function name, column number, line number) callFrame stacks for each method
export function collapseCallFrames(aggregations: Aggregations) {
  Object.keys(aggregations).forEach(methodName => {
    let collapsed: CallFrameInfo[] = [];
    let keys: string[] = [];

    aggregations[methodName].callframes.forEach(callframeInfo => {
      let collapedStack: ICallFrame[] = [];
      let key = callframeInfo.stack.reduce((acc, cur) => {
        let { functionName, columnNumber, lineNumber } = cur;
        return acc += `${functionName}${columnNumber}${lineNumber}`;
      }, '');

      if (!keys.includes(key)) {
        keys.push(key);
        collapsed.push(callframeInfo);
      }
    });

    aggregations[methodName].callframes = collapsed;
  });

  return aggregations;
}

export function aggregate(hierarchy: HierarchyNode<ICpuProfileNode>, archive: Archive) {
  let aggregations = new AggregrationCollector(hierarchy, archive);
  let containments: string[] = [];
  hierarchy.each((node: HierarchyNode<ICpuProfileNode>) => {
    let { self } = node.data;
    if (self !== 0) {
      let currentNode: HierarchyNode<ICpuProfileNode> | null = node;
      let stack: ICallFrame[] = [];
      let containerNode: HierarchyNode<ICpuProfileNode> | null = null;

      while (currentNode) {
        const moduleName = aggregations.findModuleName(currentNode.data.callFrame);
        if (moduleName !== undefined && moduleName !== 'unknown') {
          if (!containerNode) {
            aggregations.addToAttributed(moduleName, self);
            aggregations.pushCallFrames(moduleName, { self, stack });
            containerNode = currentNode;
          }
          aggregations.addToTotal(moduleName, self);
        }
        stack.push(currentNode.data.callFrame);
        currentNode = currentNode.parent;
      }

      if (!containerNode) {
        aggregations.addToAttributed('unknown', self);
        aggregations.addToTotal('unknown', self);
        aggregations.pushCallFrames('unknown', { self, stack });
      }
    }
  });

  return aggregations.collect();
}
