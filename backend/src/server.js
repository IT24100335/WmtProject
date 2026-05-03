import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("MONGODB_URI from env:", process.env.MONGODB_URI);

async function startServer() {
  await connectDb();
  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });

  server.on("error", (error) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    if (error.code === "EADDRINUSE") {
      console.error(`Port ${env.port} is already in use. Stop the other process or change PORT in your .env file.`);
      process.exit(1);
    }

    throw error;
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
