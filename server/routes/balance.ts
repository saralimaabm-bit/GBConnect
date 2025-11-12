import { RequestHandler } from "express";
import mysql from "mysql2/promise";
import { getConfig } from "../config";

export const getBalance: RequestHandler = async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: 'Token é obrigatório' });
    return;
  }

  try {
    const config = getConfig();

    // Check if database is configured
    if (!config.mysqlDbName || !config.mysqlHost) {
      res.status(500).json({ error: 'Banco de dados não configurado' });
      return;
    }

    // Create connection
    const connection = await mysql.createConnection({
      host: config.mysqlHost,
      port: parseInt(config.mysqlPort),
      user: config.mysqlUsername || 'root',
      password: config.mysqlPassword,
      database: config.mysqlDbName,
    });

    try {
      // Query user data from configured table
      const [rows] = await connection.execute(
        `SELECT saldo, acoeshoje FROM geral WHERE TOKEN = ?`,
        [token]
      );

      await connection.end();

      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0] as any;

        // Calculate Ganho Hoje: acoeshoje * 0.01
        const ganhoHoje = row.acoeshoje ? parseFloat(row.acoeshoje) * 0.01 : 0;

        // Format the values from database
        const balance = {
          currentBalance: row.saldo ? `R$ ${parseFloat(row.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00',
          earnedToday: `R$ ${ganhoHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          lastUpdate: new Date().toLocaleString('pt-BR'),
        };

        res.json(balance);
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
      }
    } catch (dbError) {
      await connection.end();
      throw dbError;
    }
  } catch (err: any) {
    console.error('Erro ao buscar saldo:', err);
    res.status(500).json({ error: 'Erro ao buscar saldo' });
  }
};
