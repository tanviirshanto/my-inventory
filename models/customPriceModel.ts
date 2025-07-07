import mongoose from "mongoose";

const customPriceSchema = new mongoose.Schema(
  {
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    buyingPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Ensure unique combination of party + product
customPriceSchema.index({ party: 1, product: 1 }, { unique: true });

export const CustomPrice =
  mongoose.models.CustomPrice || mongoose.model("CustomPrice", customPriceSchema);
