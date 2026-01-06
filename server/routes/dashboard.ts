import { RequestHandler } from "express";
import mysql from "mysql2/promise";
import { getConfig } from "../config";

export const getDashboardMetrics: RequestHandler = async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token é obrigatório' });
  }

  let connection: any = null;
  try {
    const config = getConfig();

    // Check if database is configured
    if (!config.mysqlDbName || !config.mysqlHost) {
      return res.status(500).json({ error: 'Banco de dados não configurado' });
    }

    // Create connection
    connection = await mysql.createConnection({
      host: config.mysqlHost,
      port: parseInt(config.mysqlPort),
      user: config.mysqlUsername || 'root',
      password: config.mysqlPassword,
      database: config.mysqlDbName,
    });

    // Query user data from configured table
    const [rows] = await connection.execute(
      `SELECT saldo, acoeshoje, totalcontashoje, acoestotal, desativadas FROM geral WHERE TOKEN = ?`,
      [token]
    );

    // Close connection before sending response
    if (connection) {
      await connection.end().catch(() => {});
    }

    if (Array.isArray(rows) && rows.length > 0) {
      const row = rows[0] as any;

      // Calculate Ganho Hoje: acoeshoje * 0.005
      const ganhoHoje = row.acoeshoje ? parseFloat(row.acoeshoje) * 0.004 : 0;

      // Format the values from database
      const metrics = {
        'Saldo Total': row.saldo ? `R$ ${parseFloat(row.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00',
        'Ganho Hoje': `R$ ${ganhoHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        'Contas Hoje': row.totalcontashoje ? String(row.totalcontashoje) : '0',
        'Ações Hoje': row.acoeshoje ? String(row.acoeshoje) : '0',
        'Ações Total': row.acoestotal ? String(row.acoestotal) : '0',
        'Contas Desativadas': row.desativadas ? String(row.desativadas) : '0',
      };

      return res.json(metrics);
    } else {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err: any) {
    // Close connection on error
    if (connection) {
      await connection.end().catch(() => {});
    }

    console.error('Erro ao buscar métricas:', err);
    return res.status(500).json({ error: 'Erro ao buscar métricas' });
  }
};
