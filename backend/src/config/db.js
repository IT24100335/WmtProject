import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  const mongoUri = env.mongoUri;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected to database:", mongoose.connection.name);
  console.log("MongoDB host:", mongoose.connection.host);
}

