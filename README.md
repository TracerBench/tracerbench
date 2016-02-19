chrome-tracing
==============

Automated Chrome benchmarking.

```js
import { InitialRenderBenchmark } from "chrome-tracing";

let benchmark = new InitialRenderBenchmark({
  name: "app initial render",
  url: "http://localhost:4200/",
  endMarker: "renderEnd",
  browser: {
    type: "canary"
  }
});
benchmark.run().then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
```
