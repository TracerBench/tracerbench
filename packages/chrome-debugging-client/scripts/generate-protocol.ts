import * as fs from "fs";
import * as got from "got";
import { ProtocolCodegen } from "../codegen";
// tslint:disable:no-console

(async () => {
  const res = await got(
    "https://raw.githubusercontent.com/ChromeDevTools/debugger-protocol-viewer/master/_data/versions.json",
    {
      json: true,
    },
  );
  const versions: IVersion[] = res.body;
  await Promise.all(versions.map(generate));
})().catch(err => {
  console.error(err);
  process.exit(1);
});

interface IVersion {
  slug: string;
  name: string;
}

async function generate(version: IVersion) {
  const res = await got(
    `https://raw.githubusercontent.com/ChromeDevTools/debugger-protocol-viewer/master/_data/${
      version.slug
    }/protocol.json`,
    { json: true },
  );
  const codegen = new ProtocolCodegen({
    clientModuleName: "../lib/types",
  });
  const code = codegen.generate(res.body);
  fs.writeFileSync(`protocol/${version.slug}.ts`, code);
}
