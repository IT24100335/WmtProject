import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "ADMIN",
        "CUSTOMER",
        "MENU_MANAGER",
        "ORDER_MANAGER",
        "INVENTORY_MANAGER",
        "PROMOTION_MANAGER",
        "FEEDBACK_MANAGER"
      ],
      default: "CUSTOMER"
    },
    lastLogin: { type: Date }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
