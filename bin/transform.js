#!/usr/bin/env node

const runtimeCallStatGroup = require('../dist/lib/util').runtimeCallStatGroup;

const { stdin, stdout } = process;

let buffer = '';

stdin.setEncoding('utf8');

stdin.on('data', chunk => buffer += chunk);

stdin.on('end', () => {
  const resultSets = JSON.parse(buffer);
  stdout.write(JSON.stringify(resultSets.map(transformResultSet), null, 2));
  stdout.write('\n');
});

function transformResultSet(resultSet) {
  const copy = Object.assign({}, resultSet);
  copy.samples = resultSet.samples.map(transformSample);
  return copy;
}

function transformSample(sample) {
  const copy = Object.assign({}, sample);
  copy.runtimeCallStats = transformRuntimeCallStats(sample.runtimeCallStats)
  return copy;
}

function transformRuntimeCallStats(runtimeCallStats) {
  const groups = {};
  for (const statName in runtimeCallStats.stats) {
    const groupName = runtimeCallStatGroup(statName);
    let group = groups[groupName];
    if (group === undefined) {
      group = groups[groupName] = {};
    }
    group[statName] = runtimeCallStats.stats[statName];
  }
  return groups;
}
