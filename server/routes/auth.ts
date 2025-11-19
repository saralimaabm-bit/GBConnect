import { RequestHandler } from "express";
import mysql from "mysql2/promise";
import { getConfig } from "../config";

export const validateToken: RequestHandler = async (req, res) => {
  const { token } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token é obrigatório' });
  }

  let connection: any = null;
  try {
    const config = getConfig();

    // Check if database is configured
    if (!config.mysqlDbName || !config.mysqlHost) {
      return res.status(500).json({ error: 'Banco de dados não configurado. Contate o administrador.' });
    }

    // Create connection using admin config
    connection = await mysql.createConnection({
      host: config.mysqlHost,
      port: parseInt(config.mysqlPort),
      user: config.mysqlUsername || 'root',
      password: config.mysqlPassword,
      database: config.mysqlDbName,
    });

    // Query the geral table for the token
    const [rows] = await connection.execute(
      'SELECT * FROM geral WHERE TOKEN = ?',
      [token]
    );

    // Close connection before sending response
    if (connection) {
      await connection.end().catch(() => {});
    }

    if (Array.isArray(rows) && rows.length > 0) {
      // Token found - login successful
      return res.json({ success: true, message: 'Token válido' });
    } else {
      // Token not found
      return res.status(401).json({ error: 'Token inválido' });
    }
  } catch (err: any) {
    // Close connection on error
    if (connection) {
      await connection.end().catch(() => {});
    }

    console.error('Erro ao validar token:', err);

    // Provide specific error messages
    let statusCode = 500;
    let errorMessage = 'Erro ao validar token. Tente novamente.';

    if (err.code === 'ER_ACCESS_DENIED_FOR_USER') {
      errorMessage = 'Erro de conexão: credenciais MySQL inválidas';
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      errorMessage = 'Erro de conexão: banco de dados não encontrado';
    } else if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      errorMessage = 'Erro de conexão: conexão perdida';
    }

    return res.status(statusCode).json({ error: errorMessage });
  }
};
