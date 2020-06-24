import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

export default function copyJquery(root: string) {
  writeFileSync(
    join(root, "dist/test/jquery.js"),
    readFileSync(require.resolve("jquery/dist/jquery"), "utf8")
  );
  writeFileSync(
    join(root, "dist/test/jquery.min.js"),
    readFileSync(require.resolve("jquery/dist/jquery.min"), "utf8")
  );
  writeFileSync(
    join(root, "dist/test/jquery.min.map"),
    readFileSync(require.resolve("jquery/dist/jquery.min.map"), "utf8")
  );
}
