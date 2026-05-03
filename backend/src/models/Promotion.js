import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    promoCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountPercentage: { type: Number, required: true, min: 0, max: 100 },
    expiryDate: { type: String, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Promotion = mongoose.model("Promotion", promotionSchema);

