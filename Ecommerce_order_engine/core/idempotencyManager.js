class IdempotencyManager {
  constructor() {
    this.store = new Map(); // key → result
  }

  has(key) {
    return this.store.has(key);
  }

  get(key) {
    return this.store.get(key);
  }

  set(key, value) {
    this.store.set(key, value);
  }
}

module.exports = new IdempotencyManager();