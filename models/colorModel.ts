import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  name: String, 
}, { timestamps: true });

export default mongoose.models.Color || mongoose.model("Color", colorSchema);