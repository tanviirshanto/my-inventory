import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    unique: true,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  intialQuantity: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export const Stock = mongoose.models.Stock || mongoose.model('Stock', stockSchema);
