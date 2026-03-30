require("./services/paymentService");
const productService = require("./services/productService");
const cartService = require("./services/cartService");
const orderService = require("./services/orderService");
const orderQueryService = require("./services/orderQueryService");

// setup
productService.addProduct("p1", "iPhone", 1000, 5);

// add to cart
cartService.addToCart("user1", "p1", 3);

// place order
try {
  const order = orderService.placeOrder("user1");
  console.log("Order Success:", order);
} catch (err) {
  console.log("Order Failed:", err.message);
}

// query orders
console.log("All Orders:", orderQueryService.getAllOrders());
console.log(productService.getProduct("p1"));