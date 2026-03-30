const store = require("../data/store");
const Order = require("../models/order");
const lockManager = require("../core/lockManager");
const inventoryService = require("./inventoryService");

const StateMachine = require("../core/stateMachine");
const discountService = require("./discountService");

const eventBus = require("../core/eventBus");
const EVENTS = require("../events/eventTypes");
const logger = require("../utils/logger");

const fraudService = require("./fraudService");

const expiryScheduler = require("../schedulers/expiryScheduler");

const idempotencyManager = require("../core/idempotencyManager");

const failureInjector = require("../core/failureInjector");

let orderCounter = 1;

class OrderService {
  constructor() {
    // listen to payment events
    eventBus.subscribe(EVENTS.PAYMENT_SUCCESS, this.handlePaymentSuccess.bind(this));
    eventBus.subscribe(EVENTS.PAYMENT_FAILED, this.handlePaymentFailure.bind(this));
  }

  placeOrder(userId, idempotencyKey) {
    const cart = store.carts.get(userId);

    if (idempotencyKey && idempotencyManager.has(idempotencyKey)) {
      return idempotencyManager.get(idempotencyKey);
}

    if (!cart || cart.items.size === 0) {
      throw new Error("Cart is empty");
    }

    const lockedProducts = [];

    try {
      // 🔒 STEP 1: Lock products
      for (let productId of cart.items.keys()) {
        const acquired = lockManager.acquire(productId);
        if (!acquired) {
          throw new Error("Product is locked");
        }
        lockedProducts.push(productId);
      }

      // 💰 STEP 2: Calculate total
      let totalAmount = 0;
      for (let [productId, qty] of cart.items) {
        const product = store.products.get(productId);
        totalAmount += product.price * qty;
      }

      // 🎯 STEP 3: Apply discount
      totalAmount = discountService.applyDiscount(totalAmount);

      // 🧾 STEP 4: Create order
      const order = new Order(
        "order_" + orderCounter++,
        userId,
        new Map(cart.items),
        totalAmount
      );

      // 🔄 STEP 5: Move to PENDING_PAYMENT
      order.updateStatus("PENDING_PAYMENT", StateMachine);

      // 📢 STEP 6: Publish event instead of calling payment directly
      eventBus.publish(EVENTS.ORDER_CREATED, {
        order,
        cart,
        totalAmount,
      });
      if (idempotencyKey) {
        idempotencyManager.set(idempotencyKey, order);
      }

      return order;

    } catch (err) {
      console.log("Order failed:", err.message);
      throw err;

    } finally {
      // 🔓 release locks
      for (let productId of lockedProducts) {
        lockManager.release(productId);
      }
    }
  }

  // ✅ Payment success handler
  handlePaymentSuccess({ order, cart }) {
    
    logger.log(`Order ${order.id} marked as PAID`);
    fraudService.recordOrder(order.userId);
    expiryScheduler.clearReservation(order.userId);

    // update state
    order.updateStatus("PAID", StateMachine);

    // deduct stock
    for (let [productId, qty] of order.items) {
      const product = store.products.get(productId);
      product.totalStock -= qty;
      product.reservedStock -= qty;
    }

    // save order
    store.orders.set(order.id, order);

    // clear cart
    cart.items.clear();
  }

  // ❌ Payment failure handler
  handlePaymentFailure({ order, cart }) {
    
    logger.log(`Order ${order.id} payment FAILED`);

    // release reserved stock
    for (let [productId, qty] of cart.items) {
      inventoryService.releaseStock(productId, qty);
    }
  }

  // 🔁 Cancel order
  cancelOrder(orderId) {
    const order = store.orders.get(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "PAID") {
      throw new Error("Only PAID orders can be cancelled");
    }

    // update state
    order.updateStatus("CANCELLED", StateMachine);

    // restore stock
    for (let [productId, qty] of order.items) {
      const product = store.products.get(productId);
      product.totalStock += qty;
    }

    // trigger refund
    eventBus.publish(EVENTS.REFUND_INITIATED, { order });
  }
}

module.exports = new OrderService();