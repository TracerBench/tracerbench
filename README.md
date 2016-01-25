chrome-tracing
==============

```js
var ColdStartMeasure = require("chrome-tracing").ColdStartMeasure;

var measure = new ColdStartMeasure("http://localhost:4200");
measure.on("end", (samples) => {
  console.log(samples);
});
measure.on("error", (err) => {
  console.error(err);
});
measure.run();
```