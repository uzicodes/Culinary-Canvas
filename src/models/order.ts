import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
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
  paymentType: {
    type: String,
  },
  deliveryMethod: {
    type: String,
  },
  tip: {
    type: Number,
    default: 0,
  },
  subtotal: {
    type: Number,
  },
  couponCode: {
    type: String,
  },
  couponDiscount: {
    type: Number,
    default: 0,
  },
});

// Ensure unique index on order_id
OrderSchema.index({ order_id: 1 }, { unique: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);