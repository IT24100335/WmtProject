import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);

