const mongoose = require("mongoose");
const Product = require("../model/productModel");

const transactionSchema = new mongoose.Schema({
  issuedTime: { type: Date, default: Date.now(), immutable: true },
  items: [
    {
      priceThen: {
        type: Number,
      },
      productName: {
        type: String,
      },
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      quantity: { type: Number, default: 1 },
    },
  ],
});

transactionSchema.pre("save", async function (next) {
  let products = await Product.find().select("name _id price");
  console.log(products);
  this.items.forEach((item) => {
    if (item.productId) {
      let product1 = products.find((product) => product._id.toString() == item.productId);
      if (!product1)
        throw new Error(`Product with id "${item.productId}" not found.`);

      // let product1 = await Product.findById(item.productId);
      item.productName = product1.name;
      item.priceThen = product1.price;
    } else if (item.productName) {
      let product2 = products.find(
        (product) => product.name == item.productName.trim().toLocaleLowerCase()
      );
      if (!product2)
        throw new Error(`Product with name "${item.productName}" not found.`);
      item.productId = product2._id;
      item.productName = product2.name;
      item.priceThen = product2.price;
    } else throw new Error("provide product name or id");
  });
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
