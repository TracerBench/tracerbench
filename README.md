# parse-profile


## Usage

```js

const Profile = require('parse-profile');

const trace = new Profile.trace();
trace.addEvents(JSON.parse(fs.readFileSync('<performance-profile>', 'UTF8'));

// the following:
// * associates events to their parents (and children)
// * associates events and their corresponding process (as these profiles can contain tracing information across more then 1 process)
trace.buildModel();

// focus only on renderer process and set that as the `mainProcess`

trace.mainProcess = trace.processes
  .filter(p => p.name === 'Renderer')
  .reduce((c, v) => (v.events.length > c.events.length ? v : c));

// extract the CPU Profile from the renderer process;
let profileEvent = trace.mainProcess.events.find(event => event.name === 'CpuProfile');

// give the profileEvent a nice DSL
let profile = Profile.CpuProfile.from(profileEvent);

// now we can inspect the profile in several ways:

profile.hierachy // tree view
profile.nodes // map of all nodes
````
