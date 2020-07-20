# @tracerbench/trace-event

Typescript interfaces and constants enum for Chrome Devtools Protocol traces.

The Constants enum is a const enum so if you are compiling with tsc it will compile out.

## Example

```ts
import type { MetadataTraceEvent, TraceEvent, TraceStreamJson } from '@tracerbench/trace-event';
import { Constants } from '@tracerbench/trace-event';
import { readFileSync } from 'fs';
const trace: TraceEvent[] | TraceStreamJson = JSON.parse(readFileSync('trace.json', 'utf8'));
const traceEvents = Array.isArray(trace) ? trace : trace.traceEvents;
traceEvents.sort((a, b) => a.ts - b.ts);
const metadata: MetadataTraceEvent[] = traceEvents.filter((event) => event.ph === Constants.TRACE_EVENT_PHASE_METADATA);
```
