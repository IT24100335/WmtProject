import { login, register } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  // Public registration is customer-only. Staff/admin accounts are created via admin tools.
  const result = await register({ ...req.body, role: "CUSTOMER" });
  res.status(201).json(result);
});

export const loginUser = asyncHandler(async (req, res) => {
  const result = await login(req.body);
  res.json(result);
});
