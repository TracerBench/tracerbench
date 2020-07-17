import Cache from './cache';

const disabledByDefault = 'disabled-by-default-';

const disabledByDefaultCache = new Cache((cat: string) => {
  return cat.startsWith(disabledByDefault)
    ? cat.slice(disabledByDefault.length)
    : cat;
});

const cache = new Cache((cat: string) =>
  cat.split(',').map((cat) => disabledByDefaultCache.get(cat))
);

export default function splitCat(cat: string): string | string[] {
  return cache.get(cat);
}
