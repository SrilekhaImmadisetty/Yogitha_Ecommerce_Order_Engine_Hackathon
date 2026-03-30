const store = require("../data/store");
const Cart = require("../models/cart");
const inventoryService = require("./inventoryService");
const expiryScheduler = require("../schedulers/expiryScheduler");

class CartService {
  getCart(userId) {
    if (!store.carts.has(userId)) {
      store.carts.set(userId, new Cart(userId));
    }
    return store.carts.get(userId);
  }

  addToCart(userId, productId, quantity) {
  const cart = this.getCart(userId);

  inventoryService.reserveStock(productId, quantity);

  const existingQty = cart.items.get(productId) || 0;
  cart.items.set(productId, existingQty + quantity);

  // 🔥 start/reset expiry timer
  expiryScheduler.startReservationTimer(userId);
}

  removeFromCart(userId, productId) {
    const cart = this.getCart(userId);

    const qty = cart.items.get(productId);
    if (!qty) return;

    inventoryService.releaseStock(productId, qty);
    cart.items.delete(productId);
  }

  updateQuantity(userId, productId, newQty) {
    const cart = this.getCart(userId);

    const oldQty = cart.items.get(productId) || 0;

    if (newQty > oldQty) {
      inventoryService.reserveStock(productId, newQty - oldQty);
    } else {
      inventoryService.releaseStock(productId, oldQty - newQty);
    }

    if (newQty === 0) {
      cart.items.delete(productId);
    } else {
      cart.items.set(productId, newQty);
    }
  }

  viewCart(userId) {
    return this.getCart(userId);
  }
}

module.exports = new CartService();