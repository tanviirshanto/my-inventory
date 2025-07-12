import mongoose from "mongoose";

const partySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["CUSTOMER", "SUPPLIER"], required: true },
  phone: String,
  email: String,
  address: String,
});

export const Party =
  mongoose.models.Party || mongoose.model("Party", partySchema);
