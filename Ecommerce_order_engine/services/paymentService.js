const eventBus = require("../core/eventBus");
const EVENTS = require("../events/eventTypes");
const logger = require("../utils/logger");
const failureInjector = require("../core/failureInjector");


class PaymentService {
  constructor() {
    eventBus.subscribe(EVENTS.ORDER_CREATED, this.handlePayment.bind(this));
    eventBus.subscribe(EVENTS.REFUND_INITIATED, this.handleRefund.bind(this));
  }

  handlePayment({ order, cart, totalAmount }) {
  logger.log(`Processing payment for ${order.id}`);

  try {
    // 🔥 Inject failure here
    if (failureInjector.shouldFail(0.3)) {
      throw new Error("Injected payment failure");
    }

    // simulate success
    eventBus.publish(EVENTS.PAYMENT_SUCCESS, { order, cart });

  } catch (err) {
    logger.log(`Payment failed for ${order.id}: ${err.message}`);
    eventBus.publish(EVENTS.PAYMENT_FAILED, { order, cart });
  }
}

  handleRefund({ order }) {
    logger.log(`Refund processed for ${order.id}`);
  }
}

module.exports = new PaymentService();