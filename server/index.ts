import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { handleDemo } from "./routes/demo";
import { getAdminConfig, saveAdminConfig } from "./routes/admin";
import { getBalance } from "./routes/balance";
import { getDashboardMetrics } from "./routes/dashboard";
import { validateToken } from "./routes/auth";
import { getRanking } from "./routes/ranking";

export function createServer() {
  const app = express();

  // ESM workaround para __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
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

  // Serve frontend build
  const clientDistPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDistPath));

  // Catch-all: send index.html for SPA routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });

  return app;
}
