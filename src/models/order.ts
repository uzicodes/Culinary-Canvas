import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: String,
  items: Array,
  total: Number,
  // Add other fields as needed
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);