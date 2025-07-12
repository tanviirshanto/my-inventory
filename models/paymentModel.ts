import mongoose from "mongoose";
import { Party } from "@/models/partyModel";


const paymentSchema = new mongoose.Schema({
  party: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["IN", "OUT"], required: true },
  date: { type: Date, required: true },
  note: String,
});

export const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
