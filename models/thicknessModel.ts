import mongoose from "mongoose";

const thicknessSchema = new mongoose.Schema({
  name: String, 
}, { timestamps: true });

export default mongoose.models.Thickness || mongoose.model("Thickness", thicknessSchema);