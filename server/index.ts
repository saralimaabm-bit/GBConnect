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

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --- API Routes ---
  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/auth/validate-token", validateToken);
  app.get("/api/admin/config", getAdminConfig);
  app.post("/api/admin/config", saveAdminConfig);
  app.get("/api/balance", getBalance);
  app.get("/api/dashboard/metrics", getDashboardMetrics);
  app.get("/api/ranking", getRanking);

  // --- Frontend SPA ---
  // Resolve caminho correto em ES Modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientDistPath = path.join(__dirname, "../client/dist");

  app.use(express.static(clientDistPath));

  // Catch-all para rotas do front-end (React/Vite SPA)
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });

  return app;
}
