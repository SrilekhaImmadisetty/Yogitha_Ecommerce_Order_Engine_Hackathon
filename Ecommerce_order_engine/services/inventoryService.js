const store = require("../data/store");

class InventoryService {
  reserveStock(productId, quantity) {
    const product = store.products.get(productId);
    if (!product) throw new Error("Product not found");

    if (product.availableStock < quantity) {
      throw new Error("Not enough stock");
    }

    product.reservedStock += quantity;
  }

  releaseStock(productId, quantity) {
    const product = store.products.get(productId);
    if (!product) throw new Error("Product not found");

    product.reservedStock -= quantity;

    if (product.reservedStock < 0) {
      product.reservedStock = 0;
    }
  }
}

module.exports = new InventoryService();