import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema({
  name: { type: String, required: true }, // person or account name
  principal: { type: Number, default: 0 }, // active loan amount
  interestRate: { type: Number, required: true }, // annual % like 10
  lastInterestCalculation: { type: Date, default: Date.now }, // last calculated
  interestAccrued: { type: Number, default: 0 }, // unpaid interest
  createdAt: { type: Date, default: Date.now },
});

export const BankAccount = mongoose.models.BankAccount || mongoose.model("BankAccount", bankAccountSchema);
