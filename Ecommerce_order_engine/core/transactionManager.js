class Transaction {
  constructor() {
    this.rollbackActions = [];
  }

  addRollback(fn) {
    this.rollbackActions.push(fn);
  }

  rollback() {
    for (let i = this.rollbackActions.length - 1; i >= 0; i--) {
      try {
        this.rollbackActions[i]();
      } catch (e) {
        console.log("Rollback failed:", e.message);
      }
    }
  }
}

module.exports = Transaction;