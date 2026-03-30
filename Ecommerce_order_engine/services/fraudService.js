class FraudService {
  constructor() {
    this.userOrders = new Map(); // userId → timestamps[]
  }

  recordOrder(userId) {
    const now = Date.now();

    if (!this.userOrders.has(userId)) {
      this.userOrders.set(userId, []);
    }

    const timestamps = this.userOrders.get(userId);

    // keep only last 1 minute
    const recent = timestamps.filter(t => now - t < 60000);

    recent.push(now);

    this.userOrders.set(userId, recent);

    // rule: more than 3 orders/min
    if (recent.length > 3) {
      console.log(`🚨 Fraud detected for ${userId}`);
    }
  }
}

module.exports = new FraudService();