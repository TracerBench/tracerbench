import { HierarchyNode } from 'd3-hierarchy';
import * as fs from 'fs';
import { ModuleMatcher } from '../cli/module_matcher';
import {
  ICpuProfileNode,
  ITraceEvent,
  Trace,
  TRACE_EVENT_PHASE_COMPLETE
} from '../../trace';

export function exportHierarchy(
  rawTraceData: any,
  hierarchy: HierarchyNode<ICpuProfileNode>,
  trace: Trace,
  filePath: string,
  modMatcher: ModuleMatcher
) {
  const newTraceData = JSON.parse(JSON.stringify(rawTraceData));
  hierarchy.each(node => {
    const completeEvent: ITraceEvent = {
      pid: trace.mainProcess!.id,
      tid: trace.mainProcess!.mainThread!.id,
      ts: node.data.min,
      ph: TRACE_EVENT_PHASE_COMPLETE,
      cat: 'blink.user_timing',
      name: node.data.callFrame.functionName,
      args: {
        data: {
          functionName: node.data.callFrame.functionName,
          moduleName: modMatcher.findModuleName(node.data.callFrame)
        }
      },
      dur: node.data.max - node.data.min
    };

    newTraceData.traceEvents.push(completeEvent);
  });

  const outputFilePath = filePath.endsWith('.json')
    ? filePath.slice(0, filePath.length - 5)
    : filePath;
  fs.writeFileSync(
    `${outputFilePath}-processed.json`,
    JSON.stringify(newTraceData, null, ' '),
    'utf8'
  );
}
