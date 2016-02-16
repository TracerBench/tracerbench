import { InitialRenderBenchmark } from "./lib/benchmarks/initial-render";


let benchmark = new InitialRenderBenchmark(
  "hello world",
  "http://localhost:4200",
  "domLoading",
  "appDidRender", {
  browserType: "release"
});

benchmark.run().then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(err);
});