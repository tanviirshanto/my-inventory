import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["LOAN", "DEPOSIT", "INTEREST"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const accountSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  loan: { type: Number, default: 0 },
  interest:{ type: Number, default: 0 },
  interestRate: { type: Number, default: 0.17 }, // daily interest, e.g., 17%
  lastInterestDate: { type: Date, default: Date.now },
  transactions: [transactionSchema],
});

export const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);
