import { Archive, Entry } from '@tracerbench/har';
import { HierarchyNode } from 'd3-hierarchy';

import { ICallFrame, ICpuProfileNode } from '../trace';
import { ParsedFile } from './metadata';
export interface IParsedFiles {
  [key: string]: ParsedFile;
}

export class ModuleMatcher {
  private parsedFiles: IParsedFiles = {};
  private archive: Archive;
  private moduleSet = new Set<string>();

  constructor(hierarchy: HierarchyNode<ICpuProfileNode>, archive: Archive) {
    this.archive = archive;
    hierarchy.each((node: HierarchyNode<ICpuProfileNode>) => {
      const moduleName = this.findModuleName(node.data.callFrame);
      if (moduleName === undefined || moduleName === 'unknown') {
        return;
      }
      this.moduleSet.add(moduleName);
    });
  }

  public getModuleList(): Set<string> {
    return this.moduleSet;
  }

  public findModuleName(callFrame: ICallFrame): string | undefined {
    const { url } = callFrame;
    // guards against things like undefined url or urls like "extensions::SafeBuiltins"
    if (
      url === undefined ||
      (url.substr(0, 7) !== 'https:/' && url.substr(0, 7) !== 'http://') ||
      callFrame.lineNumber === undefined ||
      callFrame.columnNumber === undefined ||
      callFrame.functionName === undefined ||
      callFrame.scriptId === undefined
    ) {
      return undefined;
    }
    const { parsedFiles } = this;
    let file = parsedFiles[url];
    if (file) {
      return file.moduleNameFor(callFrame);
    }

    file = this.parsedFiles[url] = new ParsedFile(
      this.contentFor(url) as string
    );
    return file.moduleNameFor(callFrame);
  }

  private contentFor(url: string): string | undefined {
    const entry = this.archive.log.entries.find(
      (e: Entry) => e.request.url === url
    );

    if (!entry) {
      throw new Error(`Could not find "${url}" in the archive file.`);
    }

    return entry.response.content.text;
  }
}
