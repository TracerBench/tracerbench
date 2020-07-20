# @tracerbench/trace-model

Builds a minimal model of the trace.

- Stable sorts events on ts.
- Assigns processes and threads metadata, bounds and events.
- Normalizes begin/end events into complete events and assigns
  parent refs from containment.
- Events are monomorphic and have access to the original trace event but all the basic props are lifted.
- Events have convenience methods for checking common phase types and accessing args.
- Category is split into a set if it is comma delimited and the disabled-by-default- prefix has been removed.

## Example

```js
import { buildModel } from '@tracerbench/trace-model';
import { readFileSync } from 'fs';
const trace = JSON.parse(readFileSync('trace.json', 'utf8'));
const model = buildModel(trace);
console.log(trace.start, trace.end, trace.duration);
for (const process of model.processes) {
  console.log(process.name);
  console.log(process.labels);
  console.log(process.start, process.end, process.duration);
  for (const thread of process.threads) {
    console.log(thread.name);
    console.log(thread.start, thread.end, thread.duration);
  }
}
const rendererMain = model.findRendererMain();
const slices = rendererMain.events.filter((event) => event.isComplete());
for (const toplevel of slices.filter((event) => event.parent === undefined)) {
  console.log('%o', toplevel);
}
```
