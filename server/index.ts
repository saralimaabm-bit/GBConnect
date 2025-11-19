import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
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

  // --- API Routes ---
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
	res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/auth/validate-token", validateToken);
  app.get("/api/admin/config", getAdminConfig);
  app.post("/api/admin/config", saveAdminConfig);
  app.get("/api/balance", getBalance);
  app.get("/api/dashboard/metrics", getDashboardMetrics);
  app.get("/api/ranking", getRanking);



  return app;
}
