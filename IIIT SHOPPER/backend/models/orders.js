import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyer_id: { type: String, ref: 'User', required: true },
  seller_id: { type: String, ref: 'User', required: true },
  product_id: { type: String, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'processed', 'delivered'], default: 'pending' },
  otp: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;