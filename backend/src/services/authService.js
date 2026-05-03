import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { assertEmail, assertRequiredFields, assertString } from "../utils/validators.js";

const sanitizeUser = (user) => {
  const plain = user.toObject();
  delete plain.password;
  return plain;
};

export async function register(payload) {
  assertRequiredFields(["username", "password"], payload);
  const username = assertString(payload.username, "username", { min: 3, max: 40 });
  const password = assertString(payload.password, "password", { min: 6, max: 80 });
  const email = payload.email ? assertEmail(payload.email, "email") : "";

  const existingUser = await User.findOne({
    $or: [{ username }, ...(email ? [{ email }] : [])]
  });

  if (existingUser) {
    const error = new Error("Username or email already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email: email || undefined,
    password: hashedPassword,
    role: payload.role || "CUSTOMER"
  });

  return {
    user: sanitizeUser(user),
    token: generateToken(user._id)
  };
}

export async function login(payload) {
  assertRequiredFields(["username", "password"], payload);

  const user = await User.findOne({
    $or: [{ username: payload.username }, { email: payload.username }]
  });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  user.lastLogin = new Date();
  await user.save();

  return {
    user: sanitizeUser(user),
    token: generateToken(user._id)
  };
}
