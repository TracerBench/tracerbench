import { setFlagsFromString } from 'v8';
import { runInNewContext } from 'vm';

setFlagsFromString('--expose-gc');
const gc: () => void = runInNewContext('gc');
export default gc;
