import * as fs from 'fs';
import { Trace } from './trace';
import CpuProfile from './cpuprofile';

let json = JSON.parse(fs.readFileSync('profile.json', 'utf8'));

let trace = new Trace();
trace.addEvents(json);
trace.buildModel();

// this seems to work for figuring out the main process
// even in DevTools Performance the trace is always the whole browser including extensions
trace.mainProcess = trace.processes
  .filter(p => p.name === 'Renderer')
  .reduce((c, v) => (v.events.length > c.events.length ? v : c));

console.log('main process', trace.mainProcess.labels);

let profileEvent = trace.mainProcess.events.find(event => event.name === 'CpuProfile');

let profile = CpuProfile.from(profileEvent);
fs.writeFileSync('cpuProfile.json', JSON.stringify(profile!.profile, null, 2));

console.log(
  'events ' + trace.events.length + ' min ts ' + trace.bounds.min + ' max ts ' + trace.bounds.max
);

trace.processes.forEach(p => {
  console.log(
    '\t' +
      p.name +
      '(' +
      p.labels +
      ')' +
      ' events ' +
      p.events.length +
      ' min ts ' +
      p.bounds.min +
      ' max ts ' +
      p.bounds.max
  );
  p.threads.forEach(t => {
    console.log(
      '\t\t' +
        t.name +
        ' events ' +
        p.events.length +
        ' min ts ' +
        t.bounds.min +
        ' max ts ' +
        t.bounds.max
    );
  });
});

fs.writeFileSync('out2.json', JSON.stringify(trace.events, null, 2));
