// all props and credit to:
// npm package "mann-whitney-utest"
// credit: @lukem512
// MIT License

const kk = 'val';

const rank = (list: any) => {
  list.sort((a: any, b: any) => {
    return a[kk] - b[kk];
  });

  list = list.map((item: any, index: any) => {
    item.rank = index + 1;
    return item;
  });

  for (let i = 0; i < list.length; ) {
    let count = 1;
    let total = list[i].rank;

    for (
      let j = 0;
      list[i + j + 1] && list[i + j][kk] === list[i + j + 1][kk];
      j++
    ) {
      total += list[i + j + 1].rank;
      count++;
    }

    const rank = total / count;

    for (let k = 0; k < count; k++) {
      list[i + k].rank = rank;
    }

    i = i + count;
  }

  return list;
};

const sampleRank = (rankedList: any, observations: any) => {
  const o = observations.slice(0);
  let rank = 0;
  rankedList.forEach((observation: any) => {
    const index = o.indexOf(observation[kk]);
    if (index > -1) {
      rank += observation.rank;

      o.splice(index, 1);
    }
  });

  return rank;
};

const uValue = (rank: any, observations: any) => {
  const k = observations.length;
  return rank - (k * (k + 1)) / 2;
};

const criticalValue = (uVal: number, samples: [number[], number[]]) => {
  const prod = samples[0].length * samples[1].length;
  const n = samples[0].length + samples[1].length;
  const mean = prod / 2;
  const counts = {} as any;

  samples.forEach((sample: any) => {
    sample.forEach((o: any) => {
      if (!counts[o]) {
        counts[o] = 1;
      } else {
        counts[o]++;
      }
    });
  });

  const ties = Object.keys(counts)
    .filter(key => {
      return counts[key] > 1;
    })
    .map(tie => {
      return counts[tie];
    });

  const k = ties.length;

  let correction = 0;
  for (let i = 0; i < k; i++) {
    correction += (Math.pow(ties[i], 3) - ties[i]) / (n * (n - 1));
  }

  const stddev = Math.sqrt((prod / 12) * (n + 1 - correction));

  const z = Math.abs((uVal - mean) / stddev);
  return z;
};

export const significant = (ustat: number, samples: [number[], number[]]) => {
  return ustat < criticalValue(ustat, samples);
};

export const test = (samples: any): number[] => {
  if (!Array.isArray(samples)) {
    throw Error('Samples must be an array');
  }
  if (samples.length !== 2) {
    throw Error('Samples must contain exactly two samples');
  }

  for (let i = 0; i < 2; i++) {
    if (!samples[i] || samples[i].length === 0) {
      throw Error('Samples cannot be empty');
    }
    if (!Array.isArray(samples[i])) {
      throw Error('Sample ' + i + ' must be an array');
    }
  }

  const all = samples[0].concat(samples[1]);

  const unranked = all.map((val: any) => {
    const result = {} as any;
    result[kk] = val;
    return result;
  });

  const ranked = rank(unranked);
  const ranks = [];
  for (let i = 0; i < 2; i++) {
    ranks[i] = sampleRank(ranked, samples[i]);
  }
  const us = [];
  for (let i = 0; i < 2; i++) {
    us[i] = uValue(ranks[i], samples[i]);
  }

  return us;
};
