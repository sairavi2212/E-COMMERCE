import mongoose from "mongoose";
const Product = new mongoose.Schema({
    name: { type: String, required: true , trim: true},
    description: { type: String, required: true , trim: true},
    price: { type: Number, required: true , min: 0},
    seller_id: { type: String, required: true , min:0},
    category: { type: String, required: true , trim: true},
    image: { type: String, required: true , trim: true}
  }, { timestamps: true });
  
const ProductModel = mongoose.model("Product", Product);

export default ProductModel;
  