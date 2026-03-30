class Cart {
  constructor(userId) {
    this.userId = userId;
    this.items = new Map(); // productId -> quantity
  }
}

module.exports = Cart;