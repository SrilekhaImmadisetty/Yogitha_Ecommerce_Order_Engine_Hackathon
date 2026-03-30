const store = require("../data/store");
const inventoryService = require("../services/inventoryService");
const logger = require("../utils/logger");

class ExpiryScheduler {
  constructor() {
    this.reservations = new Map(); // userId → timeout
  }

  clearReservation(userId) {
  if (this.reservations.has(userId)) {
    clearTimeout(this.reservations.get(userId));
    this.reservations.delete(userId);
  }
}

  startReservationTimer(userId, duration = 30000) {
    // clear old timer if exists
    if (this.reservations.has(userId)) {
      clearTimeout(this.reservations.get(userId));
    }

    const timer = setTimeout(() => {
      const cart = store.carts.get(userId);
      if (!cart) return;

      
      logger.log(`Cart expired for user ${userId}`);

      // release all reserved stock
      for (let [productId, qty] of cart.items) {
        inventoryService.releaseStock(productId, qty);
      }

      cart.items.clear();
    }, duration);

    this.reservations.set(userId, timer);
  }
}

module.exports = new ExpiryScheduler();