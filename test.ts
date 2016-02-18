import { InitialRenderBenchmark } from "./index";

let browserOpts = process.env.CHROME_BIN ? {
  type: "exact",
  executablePath: process.env.CHROME_BIN
} : {
  type: "release"
};

let benchmark = new InitialRenderBenchmark({
  name: "test initial render",
  url: `file://${__dirname}/../test/fixtures/index.html`,
  endMarker: "renderEnd",
  browser: browserOpts
});

benchmark.run().then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
