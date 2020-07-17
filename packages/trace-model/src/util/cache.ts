export default class Cache<TKey, TValue> {
  [Symbol.iterator](): IterableIterator<TValue> {
    return this.cache.values();
  }

  cache = new Map<TKey, TValue>();

  create: (key: TKey) => TValue;

  constructor(create: (key: TKey) => TValue) {
    this.create = create;
  }

  get(key: TKey): TValue {
    const { create, cache } = this;
    let item = cache.get(key);
    if (item === undefined) {
      item = create(key);
      cache.set(key, item);
    }
    return item;
  }

  values(): IterableIterator<TValue> {
    return this.cache.values();
  }
}
