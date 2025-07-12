import mongoose from 'mongoose';

const stockEntrySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party',
    },
    type: {
      type: String,
      enum: ['IN', 'OUT'], // IN for incoming stock, OUT for usage
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
    },
    itemTotal:{
      type: Number,
      required: true,
      default: 0, 
    }
  },
  {
    timestamps: true,
  }
);

export const StockEntry = mongoose.models.StockEntry || mongoose.model('StockEntry', stockEntrySchema);
