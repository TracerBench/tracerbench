import { resolve } from 'path';
import { existsSync } from 'fs';

import build from './build';
import copyJquery from './copy_jquery';
import downloadEmbers from './download_embers';

export default async function buildIfNeeded(channels: string[], root: string) {
  const needed = channels.filter(
    (channel) => !existsSync(resolve(root, 'dist/test', channel, 'index.html'))
  );
  if (needed.length > 0) {
    await downloadEmbers(needed, root);
    copyJquery(root);

    build(needed, root);
  }
}
