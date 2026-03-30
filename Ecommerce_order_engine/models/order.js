class Order {
  constructor(id, userId, items, totalAmount) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.totalAmount = totalAmount;

    this.status = "CREATED";
  }

  updateStatus(newStatus, stateMachine) {
    if (!stateMachine.canTransition(this.status, newStatus)) {
      throw new Error(`Invalid transition ${this.status} → ${newStatus}`);
    }

    this.status = newStatus; // 🔥 CRITICAL LINE
  }
}

module.exports = Order;