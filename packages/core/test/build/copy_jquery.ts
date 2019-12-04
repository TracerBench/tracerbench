import { readFileSync, writeFileSync } from "fs";

export default function copyJquery() {
  writeFileSync(
    "dist/test/jquery.js",
    readFileSync(require.resolve("jquery/dist/jquery"), "utf8")
  );
  writeFileSync(
    "dist/test/jquery.min.js",
    readFileSync(require.resolve("jquery/dist/jquery.min"), "utf8")
  );
  writeFileSync(
    "dist/test/jquery.min.map",
    readFileSync(require.resolve("jquery/dist/jquery.min.map"), "utf8")
  );
}
