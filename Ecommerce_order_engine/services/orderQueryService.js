const store = require("../data/store");

class OrderQueryService {
  getAllOrders() {
    return Array.from(store.orders.values());
  }

  getOrderById(orderId) {
    return store.orders.get(orderId);
  }

  getOrdersByUser(userId) {
    return Array.from(store.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
}

module.exports = new OrderQueryService();