import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, lowercase: true, required: true },

  price: { type: Number, required: true },

  stock: Number,

  productType: { type: String, enum: ["cow", "buffalo", "mixed"] },

  sales: { type: Number },
});

const Product = mongoose.model("Product", productSchema);
export default Product;