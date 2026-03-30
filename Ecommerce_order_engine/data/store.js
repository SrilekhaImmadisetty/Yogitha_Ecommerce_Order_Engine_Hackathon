const store = {
  products: new Map(),   // productId -> product
  carts: new Map(),      // userId -> cart
  orders: new Map(), // orderId -> order
};

module.exports = store;