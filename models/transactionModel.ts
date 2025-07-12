import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: "BankAccount", required: true },
  type: { type: String, enum: ["LOAN", "DEPOSIT", "INTEREST"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String },
});

export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
