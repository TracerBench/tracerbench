import { setFlagsFromString } from 'v8';
import { runInNewContext } from 'vm';
// avoid v8 doing work while we are idling waiting for the sample to complete
setFlagsFromString(
  [
    '--predictable',
    '--predictable-gc-schedule',
    '--single-threaded',
    '--single-threaded-gc',
    '--expose-gc'
  ].join(' ')
);
const gc: () => void = runInNewContext('gc');
export default gc;
