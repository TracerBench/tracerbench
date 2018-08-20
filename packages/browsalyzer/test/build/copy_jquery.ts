import { readFileSync, writeFileSync } from "fs";

export default function copyJquery() {
  writeFileSync(
    "dist/test/jquery.js",
    readFileSync("node_modules/jquery/dist/jquery.js", "utf8")
  );
  writeFileSync(
    "dist/test/jquery.min.js",
    readFileSync("node_modules/jquery/dist/jquery.min.js", "utf8")
  );
  writeFileSync(
    "dist/test/jquery.min.map",
    readFileSync("node_modules/jquery/dist/jquery.min.map", "utf8")
  );
}
