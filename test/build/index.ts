import { existsSync } from "fs";
import build from "./build";
import copyJquery from "./copy_jquery";
import downloadEmbers from "./download_embers";

export default async function buildIfNeeded(channels: string[]) {
  const needed = channels.filter(
    channel => !existsSync(`dist/test/${channel}/index.html`)
  );
  if (needed.length > 0) {
    await downloadEmbers(needed);
    copyJquery();

    build(needed);
  }
}
