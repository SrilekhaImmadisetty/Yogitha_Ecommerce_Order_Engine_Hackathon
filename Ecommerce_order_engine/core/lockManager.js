const locks = new Map();

class LockManager {
  acquire(key) {
    if (locks.get(key)) {
      return false; // already locked
    }
    locks.set(key, true);
    return true;
  }

  release(key) {
    locks.delete(key);
  }
}

module.exports = new LockManager();