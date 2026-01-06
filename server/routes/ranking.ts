import { RequestHandler } from "express";
import mysql from "mysql2/promise";
import { getConfig } from "../config";

interface RankingUser {
  token: string;
  acoeshoje: number;
  ganhoHoje: number;
}

export const getRanking: RequestHandler = async (_req, res) => {
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

    // Query top 5 users by acoeshoje, ordered from highest to lowest
    const [rows] = await connection.execute(
      `SELECT TOKEN, acoeshoje FROM geral ORDER BY acoeshoje DESC LIMIT 5`
    );

    // Close connection before sending response
    if (connection) {
      await connection.end().catch(() => {});
    }

    if (Array.isArray(rows) && rows.length > 0) {
      const ranking = rows.map((row: any, index: number) => {
        // Get first 5 characters of token and hide the rest with **
        const tokenDisplay = row.TOKEN.substring(0, 7) + '**';
        // Calculate ganho hoje: acoeshoje * 0.005
        const ganhoHoje = parseFloat(row.acoeshoje) * 0.004;

        return {
          position: index + 1,
          usuario: tokenDisplay,
          acoeshoje: row.acoeshoje,
          ganhoHoje: ganhoHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        };
      });

      return res.json(ranking);
    } else {
      return res.json([]);
    }
  } catch (err: any) {
    // Close connection on error
    if (connection) {
      await connection.end().catch(() => {});
    }

    console.error('Erro ao buscar ranking:', err);
    return res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
};
