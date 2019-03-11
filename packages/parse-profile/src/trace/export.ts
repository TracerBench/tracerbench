import { HierarchyNode } from 'd3-hierarchy';
const fs = require('fs-extra');
import { ModuleMatcher } from '../cli/module_matcher';
import { removeFilename } from '../cli/utils';
import { ICpuProfileNode, ITraceEvent, Trace, TRACE_EVENT_PHASE } from '../trace';

export function exportHierarchy(
    rawTraceData: any,
    hierarchy: HierarchyNode<ICpuProfileNode>,
    trace: Trace,
    outputFilepath: string,
    modMatcher: ModuleMatcher) {

    const newTraceData = JSON.parse(JSON.stringify(rawTraceData));
    hierarchy.each(node => {
        const completeEvent: ITraceEvent = {
            pid: trace.mainProcess!.id,
            tid: trace.mainProcess!.mainThread!.id,
            ts: node.data.min,
            ph: TRACE_EVENT_PHASE.COMPLETE,
            cat: 'blink.user_timing',
            name: node.data.callFrame.functionName,
            args: {data: {
                    functionName: node.data.callFrame.functionName,
                    moduleName: modMatcher.findModuleName(node.data.callFrame)
                  }},
            dur: node.data.max - node.data.min,
        };

        newTraceData.traceEvents.push(completeEvent);
    });

    fs.ensureDirSync(removeFilename(outputFilepath));
    fs.writeFileSync(outputFilepath, JSON.stringify(newTraceData, null, ' '), 'utf8');
}
