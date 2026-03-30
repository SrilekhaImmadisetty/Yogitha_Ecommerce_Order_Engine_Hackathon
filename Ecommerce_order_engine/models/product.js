class Product {
  constructor(id, name, price, totalStock) {
    this.id = id;
    this.name = name;
    this.price = price;

    this.totalStock = totalStock;
    this.reservedStock = 0;
  }

  get availableStock() {
    return this.totalStock - this.reservedStock;
  }
}

module.exports = Product;