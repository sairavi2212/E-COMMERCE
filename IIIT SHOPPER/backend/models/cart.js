import mongoose from "mongoose";
const Cart = new mongoose.Schema({
    user_id: { type: String, required: true },
    product_id: { type: String, required: true },
    count: { type: Number, default: 1, required: true }
  });
  
const CartModel = mongoose.model("Cart", Cart);

export default CartModel;