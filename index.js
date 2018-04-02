'use strict';
const fs = require('fs');
const USER_TIMING = /blink.user_timing/

class Profile {
  constructor(json) {
    this.json = json;
  }

  userTimings() {
    return this.json.filter(x => USER_TIMING.test(x.cat));
  }
  cpuProfile() {
    return this.json.filter(x => x.name === "CpuProfile");
  }
}

const profile = new Profile(JSON.parse(fs.readFileSync('profile.json', 'UTF8')));
const METHODS = new Map();
const X = /getComponentDefinition/
function count(method) {
  let current = METHODS.get(method) || 0;
  current++;
  METHODS.set(method, current);
}
profile.cpuProfile()[0].args.data.cpuProfile.nodes.forEach(node => {
  const functionName = node.callFrame.functionName;
  count(functionName);
  // if (X.test(node.callFrame.functionName)) {
    // console.log(JSON.stringify(node, null, 2));
  // }
});

[...METHODS].sort((a,b) => a[1] - b[1]).forEach(x => {
  console.log(x);
})
