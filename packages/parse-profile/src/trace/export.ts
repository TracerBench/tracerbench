import { HierarchyNode } from 'd3-hierarchy';
import * as fs from 'fs';
import { ICpuProfileNode, ITraceEvent, Trace, TRACE_EVENT_PHASE } from '../trace';

export function exportHierarchy(
    rawTraceData: any,
    hierarchy: HierarchyNode<ICpuProfileNode>,
    trace: Trace,
    filePath: string) {

    const newTraceData = JSON.parse(JSON.stringify(rawTraceData));
    const events: ITraceEvent[] = newTraceData.traceEvents;
    hierarchy.each(node => {
        const completeEvent: ITraceEvent = {
            pid: trace.mainProcess!.id,
            tid: trace.mainProcess!.mainThread!.id,
            tdur: node.data.max - node.data.min,
            ts: node.data.min,
            ph: TRACE_EVENT_PHASE.COMPLETE,
            cat: 'blink.user_timing',
            name: node.data.callFrame.functionName,
            args: {data: {functionName: node.data.callFrame.functionName}},
            dur: node.data.max - node.data.min,
        };

        events.push(completeEvent);
    });

    const outputFilePath = filePath.endsWith('.json') ? filePath.slice(0, filePath.length - 5) : filePath;
    fs.writeFileSync(`${outputFilePath}-processed.json`, JSON.stringify(newTraceData, null, ' '), 'utf8');
}
