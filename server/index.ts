import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

// Importar rotas
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

  // Rotas de exemplo / API
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/validate-token", validateToken);

  // Admin
  app.get("/api/admin/config", getAdminConfig);
  app.post("/api/admin/config", saveAdminConfig);

  // Balance
  app.get("/api/balance", getBalance);

  // Dashboard
  app.get("/api/dashboard/metrics", getDashboardMetrics);

  // Ranking
  app.get("/api/ranking", getRanking);

  // Servir SPA do Vite (frontend)
  const clientDistPath = path.join(__dirname, "../client/dist"); // ajuste se seu build estiver em outro lugar
  app.use(express.static(clientDistPath));

  // Catch-all para SPA
  app.get("/*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });

  return app;
}
