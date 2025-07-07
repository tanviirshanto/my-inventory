import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  party: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Party', 
    required: true 
  }, // type: CUSTOMER
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { type: Number, required: true },
    itemTotal: Number, // purchase price
    sellingPrice: { type: Number, required: true },
    profit: Number,
  }],
  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  netProfit: Number,
  paymentStatus: { 
    type: String, 
    enum: ['PAID', 'PENDING'], 
    default: 'PENDING' 
  },
  date: { type: Date, default: Date.now },
  note: String,
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
