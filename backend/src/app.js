import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.resolve(__dirname, "..", "uploads");

export function createApp() {
  const app = express();

  const allowedOrigins = [env.clientUrl];
  const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || localOriginPattern.test(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked for origin ${origin}`));
      }
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use("/uploads", express.static(uploadsPath));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/menu", menuRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/promotions", promotionRoutes);
  app.use("/api/inventory", inventoryRoutes);
  app.use("/api/feedback", feedbackRoutes);
  app.use(errorHandler);

  return app;
}
