import bcrypt from "bcryptjs";
import { Feedback } from "../models/Feedback.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { assertEmail, assertOptionalString, assertString } from "../utils/validators.js";

const sanitizeUser = (user) => {
  const plain = user.toObject();
  delete plain.password;
  return plain;
};

export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map(sanitizeUser));
});

export const createUser = asyncHandler(async (req, res) => {
  const username = assertString(req.body.username, "username", { min: 3, max: 40 });
  const email = req.body.email ? assertEmail(req.body.email, "email") : "";
  const password = assertString(req.body.password, "password", { min: 6, max: 80 });
  const role = req.body.role || "CUSTOMER";

  const existingUser = await User.findOne({
    $or: [{ username }, ...(email ? [{ email }] : [])]
  });

  if (existingUser) {
    return res.status(400).json({ message: "Username or email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email: email || undefined,
    password: hashedPassword,
    role
  });

  res.status(201).json(sanitizeUser(user));
});

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;
  const existingUser = await User.findOne({
    $or: [{ username }, ...(email ? [{ email }] : [])]
  });

  if (existingUser) {
    return res.status(400).json({ message: "Username or email already exists" });
  }

  const user = await User.create({
    username,
    email,
    password,
    role: role || "CUSTOMER"
  });

  res.status(201).json(sanitizeUser(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    $or: [{ username }, { email: username }]
  });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  user.lastLogin = new Date();
  await user.save();

  res.json(sanitizeUser(user));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isSelf = String(req.user?._id) === String(id);
  const isAdmin = req.user?.role === "ADMIN";
  if (!isSelf && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { username, email, password, role } = req.body;
  if (username !== undefined) user.username = assertString(username, "username", { min: 3, max: 40 });
  if (email !== undefined) user.email = email ? assertEmail(email, "email") : undefined;
  if (role !== undefined) {
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can change roles" });
    }
    user.role = role;
  }
  if (password) {
    assertString(password, "password", { min: 6, max: 80 });
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  res.json(sanitizeUser(user));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User removed" });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isSelf = String(req.user?._id) === String(req.params.id);
  const isAdmin = req.user?.role === "ADMIN";
  if (!isSelf && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const [orders, feedbacks] = await Promise.all([
    Order.find({ userId: req.params.id }).sort({ createdAt: -1 }),
    Feedback.find({ userId: req.params.id }).sort({ createdAt: -1 })
  ]);

  const totalItemsPurchased = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  res.json({
    user: sanitizeUser(user),
    orders,
    feedbacks,
    totalItemsPurchased
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});
