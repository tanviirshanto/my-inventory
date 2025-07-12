// models/dueTransactionModel.ts
import mongoose from "mongoose";

const dueTransactionSchema = new mongoose.Schema({
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["due", "payment"], // INCREASE = added due, DECREASE = payment
    required: true,
  },
  note: String,
});

export const DueTransaction =
  mongoose.models.DueTransaction ||
  mongoose.model("DueTransaction", dueTransactionSchema);
