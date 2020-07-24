import { setFlagsFromString } from 'v8';
import { runInNewContext } from 'vm';
import debug = require('debug');
const debugCallback = debug('tracerbench:gc');
// avoid v8 doing work while we are idling waiting for the sample to complete
['--predictable', '--single-threaded', '--single-threaded-gc'].forEach(
  (flag) => {
    try {
      setFlagsFromString(flag);
    } catch (e) {
      debugCallback('error setting flag %o', e);
    }
  }
);
setFlagsFromString('--expose-gc');
const _gc: () => void = runInNewContext('gc');
export default function gc(): void {
  debugCallback('full gc');
  _gc();
}
