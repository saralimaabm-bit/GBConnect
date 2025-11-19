import { RequestHandler } from "express";
import { getConfig, updateConfig } from "../config";

export const getAdminConfig: RequestHandler = (_req, res) => {
  const config = getConfig();
  res.json(config);
};

export const saveAdminConfig: RequestHandler = (req, res) => {
  try {
    updateConfig(req.body);
    res.json({ success: true, message: 'Configuração salva com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar configuração' });
  }
};
