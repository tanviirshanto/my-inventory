import mongoose from "mongoose";

const heightSchema = new mongoose.Schema({
  name: String, 
}, { timestamps: true });

export default mongoose.models.Height || mongoose.model("Height", heightSchema);