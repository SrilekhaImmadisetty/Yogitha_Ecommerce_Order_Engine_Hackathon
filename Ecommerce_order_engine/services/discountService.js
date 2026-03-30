class DiscountService {
  applyDiscount(totalAmount) {
    // simple rule: 10% off above 2000
    if (totalAmount > 2000) {
      return totalAmount * 0.9;
    }
    return totalAmount;
  }
}

module.exports = new DiscountService();