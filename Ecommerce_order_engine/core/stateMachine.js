const transitions = {
  CREATED: ["PENDING_PAYMENT"],
  PENDING_PAYMENT: ["PAID", "FAILED"],
  PAID: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
};

class StateMachine {
  static canTransition(from, to) {
    return transitions[from]?.includes(to);
  }
}

module.exports = StateMachine;