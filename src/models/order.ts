import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  orderTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  itemsOrdered: {
    type: Array,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);