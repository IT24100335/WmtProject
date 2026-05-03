import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const DEFAULT_PASSWORD = process.env.TEAM_ACCOUNT_PASSWORD || "CraveTeam@2026";

const accounts = [
  { username: "admin", email: "admin@cravebites.com", role: "ADMIN" },
  { username: "menu_mgr", email: "menu@cravebites.com", role: "MENU_MANAGER" },
  { username: "order_mgr", email: "order@cravebites.com", role: "ORDER_MANAGER" },
  { username: "inventory_mgr", email: "inventory@cravebites.com", role: "INVENTORY_MANAGER" },
  { username: "promo_mgr", email: "promo@cravebites.com", role: "PROMOTION_MANAGER" },
  { username: "feedback_mgr", email: "feedback@cravebites.com", role: "FEEDBACK_MANAGER" }
];

async function upsertAccount(account) {
  const existing = await User.findOne({
    $or: [{ username: account.username }, { email: account.email }]
  });

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  if (existing) {
    existing.username = account.username;
    existing.email = account.email;
    existing.role = account.role;
    existing.password = hashedPassword;
    await existing.save();
    console.log(`Updated ${account.role}: ${account.username}`);
    return;
  }

  await User.create({
    username: account.username,
    email: account.email,
    password: hashedPassword,
    role: account.role
  });
  console.log(`Created ${account.role}: ${account.username}`);
}

async function seedAccounts() {
  await connectDb();

  for (const account of accounts) {
    await upsertAccount(account);
  }

  console.log("");
  console.log("Team accounts are ready:");
  for (const account of accounts) {
    console.log(`- ${account.username} / ${DEFAULT_PASSWORD} (${account.role})`);
  }
}

seedAccounts()
  .catch((error) => {
    console.error("Failed to seed team accounts", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
