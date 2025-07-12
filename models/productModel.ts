import mongoose from "mongoose";
import Party from "@/models/partyModel";


const productSchema = new mongoose.Schema(
  {
    thickness: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    buyingPrice: {
      type: Number,
      required: true,
    },
    party: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
