import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getAdminConfig, saveAdminConfig } from "./routes/admin";
import { getBalance } from "./routes/balance";
import { getDashboardMetrics } from "./routes/dashboard";
import { validateToken } from "./routes/auth";
import { getRanking } from "./routes/ranking";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/validate-token", validateToken);

  // Admin routes
  app.get("/api/admin/config", getAdminConfig);
  app.post("/api/admin/config", saveAdminConfig);

  // Balance routes
  app.get("/api/balance", getBalance);

  // Dashboard routes
  app.get("/api/dashboard/metrics", getDashboardMetrics);

  // Ranking routes
  app.get("/api/ranking", getRanking);

  return app;
}
