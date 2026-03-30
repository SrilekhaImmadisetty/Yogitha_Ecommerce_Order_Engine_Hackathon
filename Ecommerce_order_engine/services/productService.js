const store = require("../data/store");
const Product = require("../models/product");

class ProductService {
  addProduct(id, name, price, stock) {
    if (store.products.has(id)) {
      throw new Error("Product already exists");
    }

    if (stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    const product = new Product(id, name, price, stock);
    store.products.set(id, product);

    return product;
  }

  updateStock(id, newStock) {
    const product = store.products.get(id);
    if (!product) throw new Error("Product not found");

    if (newStock < product.reservedStock) {
      throw new Error("Cannot reduce below reserved stock");
    }

    product.totalStock = newStock;
  }

  getAllProducts() {
    return Array.from(store.products.values());
  }

  getProduct(id) {
    return store.products.get(id);
  }
}

module.exports = new ProductService();