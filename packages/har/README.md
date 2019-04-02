# HAR JSON Typescript Interfaces

Provides typing to parsed JSON from a HAR archive.

## Example

```ts
import { Archive } from "@tracerbench/har";
import { readFileSync } from "fs";

const archive: Archive = JSON.parse(readFileSync("path/to/archive.har"), "utf8");

for (const entry of archive.log.entries) {
  console.log(entry.request.url);
}
```
